import { defineMessages } from "../../../message";

export const messages = defineMessages("error.update", {
  "error.update.unsupported": "Updates are available in installed desktop builds.",
  "error.update.notReady": "An update is not ready to install.",
  "error.update.restartFailed": "dani-dex could not restart to install the update.",
  "error.update.downloadStalled": "The update download stopped responding. Try again.",
  "error.update.installFailed": "Could not install the update. Quit and reopen dani-dex, then try again.",
  "error.update.notInstalled": "The last restart did not install the update. Restart to try again.",
  "error.update.downloadFailed": "Could not download the update. Try again.",
  "error.update.signatureNotConfirmed":
    "dani-dex could not verify the update. Try again. If this error continues, download dani-dex from dani.danlab.dev/download.",
  "error.update.checkFailed": "Could not check for updates. Try again.",
  "error.update.checkStalled": "The update check stopped responding. Try again.",
  "error.update.checkOffline": "Could not reach the update service. Check your internet connection, then try again.",
  "error.update.checkUnavailable":
    "The update service did not answer. dani-dex tries again on its own in a few minutes.",
  "error.update.checkNoRelease":
    "No published update was found for this platform. dani-dex tries again on its own in a few minutes.",
  "error.update.managedByNix": "Nix installs updates for this copy of dani-dex. Update it with Nix.",
  "error.update.managedByHost":
    "Updates on this Mac are installed by the host. The update stays ready until the host's maintenance runs.",
  "error.update.siblingSession":
    "Another dani-dex session is still running from this application. Stop dani-dex in every other macOS user account first, then install the update again.",
  "error.update.siblingSessionSameAccount":
    "Another dani-dex process is still running in this user account. Quit it, then install the update again.",
  "error.update.siblingCheckFailed": "Could not verify other dani-dex sessions. Try again before installing.",
  "error.update.readOnlyLocation":
    "dani-dex cannot install updates from this location. Quit dani-dex. In Finder, drag dani-dex into the Applications folder (if it is already there, drag it out and back in). Then open dani-dex and install the update again.",
  "error.update.appImageMissing":
    "dani-dex cannot install the update because its AppImage file was moved, renamed or replaced. Quit dani-dex, then open the AppImage file again.",
  "error.update.appImageReadOnly":
    "dani-dex cannot install updates in the folder of its AppImage file. Quit dani-dex, move the AppImage file to a folder in your home folder, then open it and install the update again.",
  "error.update.remoteDisabled": "Updates from server admins are turned off on this computer.",
  "error.update.restartStarted": "dani-dex is already restarting to install the update.",
  "error.update.alreadyRestarting": "dani-dex is already restarting.",
});
