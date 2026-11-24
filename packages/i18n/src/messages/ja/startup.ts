import type { PartialTranslation } from "../../message";
import type { messages as source } from "../en/startup";

export const messages = {
  "startup.failedTitle": "dani-dex を起動できませんでした",
  "startup.failedBody":
    "{message}\n\nお使いのデータは初期化も上書きもされていません。復旧の手順はトラブルシューティングガイドをご覧ください。",
  "startup.archiveChangedTitle": "dani-dex のファイルが変更されました",
  "startup.archiveChangedBody":
    "別のプログラムが dani-dex のファイル app.asar を変更しました。dani-dex は今は動作していますが、終了すると次は起動しません。\n\n修復するには、dani-dex をもう一度インストールしてください。ローカルのデータはそのまま残ります。",
  "startup.archiveChangedDownload": "dani-dex をダウンロード",
  "startup.filesDamagedBody":
    "dani-dex の一部のファイルが破損しているか、見つかりません。\n\n修復するには、dani-dex をもう一度インストールしてください。ローカルのデータはそのまま残ります。",
  "startup.newerDataUpdatingTitle": "dani-dex を更新しています",
  "startup.newerDataUpdatingBody":
    "新しいバージョンの dani-dex がデータを保存しました。dani-dex は最新バージョンをインストールしてから、もう一度開きます。\n\nローカルデータはリセットも上書きもされていません。",
  "startup.newerDataTitle": "最新の dani-dex をインストールしてください",
  "startup.newerDataBody":
    "新しいバージョンの dani-dex がデータを保存したため、このバージョン ({version}) では開けません。データを開くには最新バージョンをインストールしてください。\n\nローカルデータはリセットも上書きもされていません。",
  "startup.newerDataDownload": "dani-dex をダウンロード",
  "startup.newerDataGuide": "ガイドを開く",
  "startup.newerDataQuit": "終了",
  "startup.newerDataLoopTitle": "最新の dani-dex が開きませんでした",
  "startup.newerDataLoopBody":
    "新しいバージョンの dani-dex がデータを保存したため、このバージョン ({version}) では開けません。dani-dex {loopVersion} は開く前に何度も続けて停止したため、再インストールしません。\n\n{loopVersion} より新しいバージョンが公開されたら、それをインストールしてください。サポートが必要な場合は、ガイドを開いてください。\n\nローカルデータはリセットも上書きもされていません。",
  "startup.newerDataReleases": "リリースを表示",
  "startup.recoveryWindowTitle": "dani-dex の復旧",
  "startup.recoveryTitle": "dani-dex を開けませんでした",
  "startup.recoveryBody": {
    other:
      "dani-dex {version} は開く前に {count} 回続けて停止しました。ローカルデータはリセットも上書きもされていません。",
  },
  "startup.recoveryHint":
    "もう一度試すか、最後に開けたバージョンをインストールしてください。サポートが必要な場合は、診断情報を書き出し、そのファイルをレポートと一緒に送ってください。",
  "startup.recoveryHintLatest":
    "データを開ける以前のバージョンが見つかりませんでした。もう一度試すか、最新バージョンをインストールしてください。サポートが必要な場合は、診断情報を書き出し、そのファイルをレポートと一緒に送ってください。",
  "startup.recoveryRetry": "再試行",
  "startup.recoveryPreviousVersion": "前のバージョンをダウンロード",
  "startup.recoveryLatestVersion": "最新バージョンをダウンロード",
  "startup.recoveryExportDiagnostics": "診断情報を書き出す",
  "startup.recoveryOpenDataFolder": "データフォルダを開く",
  "startup.recoveryQuit": "終了",
  "startup.recoveryDiagnosticsSaved": "診断ファイルを保存しました。",
  "startup.recoveryActionFailed": "dani-dex はこの操作を実行できませんでした。",
} as const satisfies PartialTranslation<typeof source>;
