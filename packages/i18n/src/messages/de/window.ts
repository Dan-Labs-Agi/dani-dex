import type { PartialTranslation } from "../../message";
import type { messages as source } from "../en/window";

export const messages = {
  "window.localHostTitle": "Lokaler Dani Dex-Host",
  "window.localClientTitle": "Lokaler Dani Dex-Client",
  "window.computerUsePermissionTitle": "Computersteuerung aktivieren",
  "window.rendererStoppedTitle": "Dani Dex funktioniert nicht mehr",
  "window.rendererStoppedBody":
    "Das Fenster wurde mehrmals beendet. Deine Chats sind gespeichert, und deine Agenten arbeiten weiter.",
  "window.rendererStoppedReload": "Neu laden",
} as const satisfies PartialTranslation<typeof source>;
