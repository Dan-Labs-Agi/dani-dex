// Runs the Mac direct updater against a local feed: check, download, then quit and let the helper
// replace the app bundle. The workflow `mac-update-proof.yml` checks the result afterwards.
import { createMacDirectUpdater } from "../src/main/mac-direct-updater";

const [feedBase, bundlePath, currentVersion] = process.argv.slice(2);
if (!feedBase || !bundlePath || !currentVersion) throw new Error("usage: feedBase bundlePath currentVersion");

const updater = createMacDirectUpdater({
  currentVersion,
  bundlePath,
  feedBase,
  arch: process.arch,
  quit: () => process.exit(0),
});
updater.on("download-progress", () => undefined);
const checked = await updater.checkForUpdates();
process.stdout.write(`check: ${JSON.stringify(checked)}\n`);
if (!checked?.isUpdateAvailable) throw new Error("the feed did not offer a newer version");
await updater.downloadUpdate();
process.stdout.write("downloaded, installing\n");
updater.quitAndInstall();
await new Promise((resolve) => setTimeout(resolve, 10_000));
