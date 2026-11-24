import type { PartialTranslation } from "../../message";
import type { messages as source } from "../en/window";

export const messages = {
  "window.localHostTitle": "dani-dex: локальный хост",
  "window.localClientTitle": "dani-dex: локальный клиент",
  "window.computerUsePermissionTitle": "Включите управление компьютером",
  "window.rendererStoppedTitle": "dani-dex перестал работать",
  "window.rendererStoppedBody":
    "Окно несколько раз останавливалось. Ваши чаты сохранены, а агенты продолжают работать.",
  "window.rendererStoppedReload": "Перезагрузить",
} as const satisfies PartialTranslation<typeof source>;
