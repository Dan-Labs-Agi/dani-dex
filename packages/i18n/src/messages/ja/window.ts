import type { PartialTranslation } from "../../message";
import type { messages as source } from "../en/window";

export const messages = {
  "window.localHostTitle": "dani-dex ローカルホスト",
  "window.localClientTitle": "dani-dex ローカルクライアント",
  "window.computerUsePermissionTitle": "Computer Use をオンにする",
  "window.rendererStoppedTitle": "dani-dex が停止しました",
  "window.rendererStoppedBody":
    "ウィンドウが何度か停止しました。チャットは保存されており、エージェントは動作を続けています。",
  "window.rendererStoppedReload": "再読み込み",
} as const satisfies PartialTranslation<typeof source>;
