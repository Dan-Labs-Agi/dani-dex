import { defineMessages } from "../../message";

export const messages = defineMessages("startup", {
  "startup.failedTitle": "Dani Dex couldn’t start",
  "startup.failedBody":
    "{message}\n\nYour local data was not reset or overwritten. See the troubleshooting guide for recovery steps.",
  "startup.archiveChangedTitle": "Dani Dex files were changed",
  "startup.archiveChangedBody":
    "Another program changed the Dani Dex file app.asar. Dani Dex runs now, but it will not open after you quit it.\n\nTo repair Dani Dex, install it again. Your local data stays.",
  "startup.archiveChangedDownload": "Download Dani Dex",
  "startup.filesDamagedBody":
    "Some Dani Dex files are damaged or missing.\n\nTo repair Dani Dex, install it again. Your local data stays.",
  "startup.newerDataUpdatingTitle": "Updating Dani Dex",
  "startup.newerDataUpdatingBody":
    "A newer version of Dani Dex saved your data. Dani Dex installs the latest version and then opens again.\n\nYour local data was not reset or overwritten.",
  "startup.newerDataTitle": "Install the latest Dani Dex",
  "startup.newerDataBody":
    "A newer version of Dani Dex saved your data, and this version ({version}) cannot open it. Install the latest version to open your data.\n\nYour local data was not reset or overwritten.",
  "startup.newerDataDownload": "Download Dani Dex",
  "startup.newerDataGuide": "Open guide",
  "startup.newerDataQuit": "Quit",
  "startup.newerDataLoopTitle": "The latest Dani Dex did not open",
  "startup.newerDataLoopBody":
    "A newer version of Dani Dex saved your data, and this version ({version}) cannot open it. Dani Dex {loopVersion} stopped before it opened several times in a row, so it is not installed again.\n\nInstall a version newer than {loopVersion} when one is available. To get help, open the guide.\n\nYour local data was not reset or overwritten.",
  "startup.newerDataReleases": "Show releases",
  "startup.recoveryWindowTitle": "Dani Dex recovery",
  "startup.recoveryTitle": "Dani Dex did not open",
  "startup.recoveryBody": {
    one: "Dani Dex {version} stopped before it opened, {count} time in a row. Your local data was not reset or overwritten.",
    other:
      "Dani Dex {version} stopped before it opened, {count} times in a row. Your local data was not reset or overwritten.",
  },
  "startup.recoveryHint":
    "Try again, or install the last version that opened. To get help, export the diagnostics and send the file with your report.",
  "startup.recoveryHintLatest":
    "Dani Dex found no earlier version that can open your data. Try again, or install the latest version. To get help, export the diagnostics and send the file with your report.",
  "startup.recoveryRetry": "Try again",
  "startup.recoveryPreviousVersion": "Download previous version",
  "startup.recoveryLatestVersion": "Download latest version",
  "startup.recoveryExportDiagnostics": "Export diagnostics",
  "startup.recoveryOpenDataFolder": "Open data folder",
  "startup.recoveryQuit": "Quit",
  "startup.recoveryDiagnosticsSaved": "The diagnostics file is saved.",
  "startup.recoveryActionFailed": "Dani Dex could not do this action.",
});
