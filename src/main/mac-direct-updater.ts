import { spawn, spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { EventEmitter } from "node:events";
import { createWriteStream } from "node:fs";
import { chmod, mkdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import { isNewerRelease } from "@openbot/contracts/release-version";
import type { ProgressInfo, UpdateInfo } from "electron-updater";
import type { UpdateAdapter, UpdateCancellationToken, UpdateCheckOutcome } from "./update-service";

/**
 * The stock Mac updater only accepts an update that is signed by the same Apple Developer ID as the
 * app. A build without one cannot use it. This adapter does the same job in plain steps: read the feed,
 * download the zip for this Mac, check its sha512, then replace the app bundle and open it again.
 */

export interface MacFeedEntry {
  readonly url: string;
  readonly sha512: string;
  readonly size: number;
}

export interface MacFeed {
  readonly version: string;
  readonly files: readonly MacFeedEntry[];
}

export function parseMacFeed(text: string): MacFeed | null {
  const version = /^version:\s*['"]?([^'"\s]+)['"]?\s*$/mu.exec(text)?.[1];
  if (!version) return null;
  const files: MacFeedEntry[] = [];
  for (const block of text.split(/^\s*-\s+url:/mu).slice(1)) {
    const url = /^\s*([^\s]+)/u.exec(block)?.[1]?.replace(/['"]/gu, "");
    const sha512 = /sha512:\s*([^\s]+)/u.exec(block)?.[1];
    const size = Number(/size:\s*(\d+)/u.exec(block)?.[1] ?? 0);
    if (url && sha512) files.push({ url, sha512, size });
  }
  return { version, files };
}

export function pickMacZip(feed: MacFeed, arch: string): MacFeedEntry | null {
  const suffix = arch === "arm64" ? "-arm64.zip" : "-x64.zip";
  return feed.files.find((file) => file.url.endsWith(suffix)) ?? null;
}

export function isDeveloperIdSigned(bundlePath: string): boolean {
  const result = spawnSync("/usr/bin/codesign", ["-dv", "--verbose=2", bundlePath], { encoding: "utf8" });
  const text = `${result.stdout}${result.stderr}`;
  const team = /TeamIdentifier=(\S+)/u.exec(text)?.[1];
  return Boolean(team && team !== "not");
}

const INSTALL_SCRIPT = `#!/bin/bash
PID="$1"; ZIP="$2"; DEST="$3"
while kill -0 "$PID" 2>/dev/null; do sleep 0.5; done
TMP="$(mktemp -d)"
/usr/bin/ditto -x -k "$ZIP" "$TMP" || exit 1
NEW="$(ls -d "$TMP"/*.app | head -1)"
[ -n "$NEW" ] || exit 1
OLD="$DEST.previous"
rm -rf "$OLD"
mv "$DEST" "$OLD" || exit 1
if /usr/bin/ditto "$NEW" "$DEST"; then
  /usr/bin/xattr -cr "$DEST" || true
  rm -rf "$OLD" "$TMP" "$ZIP"
else
  rm -rf "$DEST"; mv "$OLD" "$DEST"
fi
/usr/bin/open "$DEST"
`;

export interface MacDirectUpdaterOptions {
  readonly currentVersion: string;
  readonly bundlePath: string;
  readonly feedBase: string;
  readonly arch: string;
  readonly fetchImpl?: typeof fetch;
  readonly workDirectory?: string;
  readonly quit: () => void;
  readonly pid?: number;
}

export function createMacDirectUpdater(options: MacDirectUpdaterOptions): UpdateAdapter {
  const emitter = new EventEmitter();
  const doFetch = options.fetchImpl ?? fetch;
  const workDirectory = options.workDirectory ?? join(tmpdir(), "dani-dex-update");
  let pending: { entry: MacFeedEntry; version: string } | null = null;
  let zipPath: string | null = null;

  const info = (version: string): UpdateInfo => ({
    version,
    files: [],
    path: "",
    sha512: "",
    releaseDate: "",
  });

  const adapter: UpdateAdapter = {
    allowPrerelease: false,
    autoDownload: false,
    autoInstallOnAppQuit: false,
    on: (event: string, listener: (...args: never[]) => void) => emitter.on(event, listener),
    async checkForUpdates(): Promise<UpdateCheckOutcome | null> {
      emitter.emit("checking-for-update");
      try {
        const response = await doFetch(new URL("latest-mac.yml", options.feedBase), { cache: "no-store" });
        if (!response.ok) throw new Error(`The update feed answered ${response.status}.`);
        const feed = parseMacFeed(await response.text());
        const entry = feed ? pickMacZip(feed, options.arch) : null;
        if (!feed || !entry || !isNewerRelease(feed.version, options.currentVersion)) {
          emitter.emit("update-not-available", info(feed?.version ?? options.currentVersion));
          return { isUpdateAvailable: false, updateInfo: { version: feed?.version ?? options.currentVersion } };
        }
        pending = { entry, version: feed.version };
        emitter.emit("update-available", info(feed.version));
        return { isUpdateAvailable: true, updateInfo: { version: feed.version } };
      } catch (error) {
        emitter.emit("error", error instanceof Error ? error : new Error(String(error)));
        throw error;
      }
    },
    async downloadUpdate(token?: UpdateCancellationToken): Promise<unknown> {
      if (!pending) throw new Error("There is no update to download.");
      const { entry, version } = pending;
      try {
        await mkdir(workDirectory, { recursive: true });
        const target = join(workDirectory, `update-${version}.zip`);
        await rm(target, { force: true });
        const response = await doFetch(new URL(entry.url, options.feedBase));
        if (!response.ok || !response.body) throw new Error(`The update download answered ${response.status}.`);
        const hash = createHash("sha512");
        let received = 0;
        const body = Readable.from(response.body);
        body.on("data", (chunk: Buffer) => {
          if (token?.cancelled) body.destroy(new Error("The update download was cancelled."));
          hash.update(chunk);
          received += chunk.length;
          emitter.emit("download-progress", {
            percent: entry.size ? (received / entry.size) * 100 : 0,
            transferred: received,
            total: entry.size,
            bytesPerSecond: 0,
            delta: chunk.length,
          } satisfies ProgressInfo);
        });
        await pipeline(body, createWriteStream(target));
        if (hash.digest("base64") !== entry.sha512) {
          await rm(target, { force: true });
          throw new Error("The downloaded update did not match the checksum in the feed.");
        }
        zipPath = target;
        emitter.emit("update-downloaded", info(version));
        return [target];
      } catch (error) {
        emitter.emit("error", error instanceof Error ? error : new Error(String(error)));
        throw error;
      }
    },
    quitAndInstall(): void {
      const zip = zipPath;
      if (!zip) throw new Error("There is no downloaded update to install.");
      const script = join(workDirectory, "install.sh");
      void writeFile(script, INSTALL_SCRIPT)
        .then(() => chmod(script, 0o755))
        .then(() => {
          const child = spawn("/bin/bash", [script, String(options.pid ?? process.pid), zip, options.bundlePath], {
            detached: true,
            stdio: "ignore",
          });
          child.unref();
          options.quit();
        });
    },
  };
  return adapter;
}
