import type { PartialTranslation } from "../../message";
import type { messages as source } from "../en/window";

export const messages = {
  "window.localHostTitle": "dani-dex Yerel Ana Makine",
  "window.localClientTitle": "dani-dex Yerel İstemci",
  "window.computerUsePermissionTitle": "Bilgisayar Kullanımını aç",
  "window.rendererStoppedTitle": "dani-dex çalışmayı durdurdu",
  "window.rendererStoppedBody":
    "Pencere birkaç kez durdu. Sohbetleriniz kaydedildi ve ajanlarınız çalışmaya devam ediyor.",
  "window.rendererStoppedReload": "Yeniden yükle",
} as const satisfies PartialTranslation<typeof source>;
