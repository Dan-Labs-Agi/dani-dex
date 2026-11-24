import type { PartialTranslation } from "../../../message";
import type { messages as source } from "../../en/status/host";

export const messages = {
  "status.host.registered": "تم تسجيل dani-dex هذا للوصول عبر WebRTC.",
  "status.host.keyRotated": "تغيّر مفتاح الخادم. تبقى الأجهزة المقترنة مقترنة.",
  "status.host.identityUpdated": "تم تحديث هوية الخادم.",
  "status.host.starting": "جارٍ تشغيل مضيف WebRTC…",
  "status.host.ready": "dani-dex هذا جاهز لاتصالات WebRTC.",
  "status.host.signalLost": "لا يمكن للأجهزة الأخرى الوصول إلى dani-dex هذا الآن. سيتصل مرة أخرى.",
  "status.host.stopping": "جارٍ جعل dani-dex هذا خاصًا…",
  "status.host.private": "dani-dex هذا خاص.",
  "status.host.removed": "أُزيل dani-dex هذا من حسابك. انشره مرة أخرى لمشاركته.",
} as const satisfies PartialTranslation<typeof source>;
