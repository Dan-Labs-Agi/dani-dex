import type { PartialTranslation } from "../../message";
import type { messages as source } from "../en/window";

export const messages = {
  "window.localHostTitle": "Dani Dex מארח מקומי",
  "window.localClientTitle": "Dani Dex לקוח מקומי",
  "window.computerUsePermissionTitle": "הפעלת שליטה במחשב",
  "window.rendererStoppedTitle": "Dani Dex הפסיק לעבוד",
  "window.rendererStoppedBody": "החלון נעצר כמה פעמים. הצ׳אטים שלך שמורים, והסוכנים שלך ממשיכים לעבוד.",
  "window.rendererStoppedReload": "טעינה מחדש",
} as const satisfies PartialTranslation<typeof source>;
