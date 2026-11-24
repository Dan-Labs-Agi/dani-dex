import type { PartialTranslation } from "../../message";
import type { messages as source } from "../en/window";

export const messages = {
  "window.localHostTitle": "dani-dex – المضيف المحلي",
  "window.localClientTitle": "dani-dex – العميل المحلي",
  "window.computerUsePermissionTitle": "تشغيل التحكم في الحاسوب",
  "window.rendererStoppedTitle": "توقف dani-dex عن العمل",
  "window.rendererStoppedBody": "توقفت النافذة عدة مرات. محادثاتك محفوظة، ووكلاؤك يواصلون العمل.",
  "window.rendererStoppedReload": "إعادة التحميل",
} as const satisfies PartialTranslation<typeof source>;
