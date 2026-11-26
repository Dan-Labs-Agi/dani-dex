// @vitest-environment node

import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import { runCauseEffect } from "../backend/effect-boundary";
import { AUTO_INSTALLED_RUNTIMES, ProviderRuntimeManager } from "./provider-runtime-manager";

const cleanups: Array<() => Promise<void> | void> = [];

afterEach(async () => {
  for (const cleanup of cleanups.splice(0).reverse()) await cleanup();
});

describe("default runtime install", () => {
  it("lists KiloCode and OpenCode", () => {
    expect([...AUTO_INSTALLED_RUNTIMES].sort()).toEqual(["kilocode", "opencode"]);
  });

  it("starts both downloads on a fresh install and skips a provider the user turned off", async () => {
    const root = await mkdtemp(join(tmpdir(), "dani-auto-install-"));
    cleanups.push(() => rm(root, { recursive: true, force: true }));
    const started = new Set<string>();
    const manager = new ProviderRuntimeManager({
      root,
      platform: "linux",
      architecture: "x64",
      isProviderOn: (provider) => provider !== "opencode",
      availableDiskBytes: async () => Number.MAX_SAFE_INTEGER,
      fetchImpl: async () => {
        throw new TypeError("offline");
      },
    });
    cleanups.push(() => runCauseEffect(manager.stop()));
    manager.on("status", (snapshot) => {
      for (const runtime of AUTO_INSTALLED_RUNTIMES) {
        if (snapshot.providers[runtime].phase !== "not-downloaded") started.add(runtime);
      }
    });
    await runCauseEffect(manager.initialize());
    await runCauseEffect(manager.installDefaultRuntimes());
    await vi.waitFor(() => expect(started.has("kilocode")).toBe(true));
    expect(started.has("opencode")).toBe(false);
  });
});
