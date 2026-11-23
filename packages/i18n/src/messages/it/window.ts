import type { PartialTranslation } from "../../message";
import type { messages as source } from "../en/window";

export const messages = {
  "window.localHostTitle": "Dani Dex — host locale",
  "window.localClientTitle": "Dani Dex — client locale",
  "window.computerUsePermissionTitle": "Attiva il Controllo del computer",
  "window.rendererStoppedTitle": "Dani Dex ha smesso di funzionare",
  "window.rendererStoppedBody":
    "La finestra si è fermata più volte. Le tue chat sono salvate e i tuoi agenti continuano a lavorare.",
  "window.rendererStoppedReload": "Ricarica",
} as const satisfies PartialTranslation<typeof source>;
