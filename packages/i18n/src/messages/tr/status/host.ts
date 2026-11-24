import type { PartialTranslation } from "../../../message";
import type { messages as source } from "../../en/status/host";

export const messages = {
  "status.host.registered": "Bu dani-dex, WebRTC erişimi için kaydedildi.",
  "status.host.keyRotated": "Sunucu anahtarı değiştirildi. Eşlenmiş cihazlar eşli kalır.",
  "status.host.identityUpdated": "Sunucu kimliği güncellendi.",
  "status.host.starting": "WebRTC ana makinesi başlatılıyor…",
  "status.host.ready": "Bu dani-dex, WebRTC bağlantıları için hazır.",
  "status.host.signalLost": "Diğer cihazlar şu anda bu dani-dex'a ulaşamıyor. Yeniden bağlanıyor.",
  "status.host.stopping": "Bu dani-dex özel yapılıyor…",
  "status.host.private": "Bu dani-dex özel.",
  "status.host.removed": "Bu dani-dex hesabınızdan kaldırıldı. Paylaşmak için yeniden yayımlayın.",
} as const satisfies PartialTranslation<typeof source>;
