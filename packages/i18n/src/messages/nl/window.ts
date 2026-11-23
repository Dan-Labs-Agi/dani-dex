import type { PartialTranslation } from "../../message";
import type { messages as source } from "../en/window";

export const messages = {
  "window.localHostTitle": "Lokale Dani Dex-host",
  "window.localClientTitle": "Lokale Dani Dex-client",
  "window.computerUsePermissionTitle": "Zet Computerbesturing aan",
  "window.rendererStoppedTitle": "Dani Dex werkt niet meer",
  "window.rendererStoppedBody":
    "Het venster is meerdere keren gestopt. Je chats zijn opgeslagen en je agents blijven werken.",
  "window.rendererStoppedReload": "Herladen",
} as const satisfies PartialTranslation<typeof source>;
