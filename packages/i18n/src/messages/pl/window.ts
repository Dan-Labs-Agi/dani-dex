import type { PartialTranslation } from "../../message";
import type { messages as source } from "../en/window";

export const messages = {
  "window.localHostTitle": "dani-dex – lokalny host",
  "window.localClientTitle": "dani-dex – lokalny klient",
  "window.computerUsePermissionTitle": "Włącz Sterowanie komputerem",
  "window.rendererStoppedTitle": "dani-dex przestał działać",
  "window.rendererStoppedBody": "Okno kilka razy przestało działać. Twoje czaty są zapisane, a agenci dalej pracują.",
  "window.rendererStoppedReload": "Wczytaj ponownie",
} as const satisfies PartialTranslation<typeof source>;
