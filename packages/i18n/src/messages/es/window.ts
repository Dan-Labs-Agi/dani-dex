import type { PartialTranslation } from "../../message";
import type { messages as source } from "../en/window";

export const messages = {
  "window.localHostTitle": "Host local de Dani Dex",
  "window.localClientTitle": "Cliente local de Dani Dex",
  "window.computerUsePermissionTitle": "Activar el uso del equipo",
  "window.rendererStoppedTitle": "Dani Dex dejó de funcionar",
  "window.rendererStoppedBody":
    "La ventana se detuvo varias veces. Tus chats están guardados y tus agentes siguen trabajando.",
  "window.rendererStoppedReload": "Recargar",
} as const satisfies PartialTranslation<typeof source>;
