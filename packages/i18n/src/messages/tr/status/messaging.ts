import type { PartialTranslation } from "../../../message";
import type { messages as source } from "../../en/status/messaging";

export const messages = {
  "status.messaging.working": "Üzerinde çalışılıyor…",
  "status.messaging.queued": "Bekleniyor: önceki bir istek henüz bitmedi. Yanıt buraya gelecek.",
  "status.messaging.busy": "Çok fazla istek bekliyor. Daha sonra tekrar deneyin.",
  "status.messaging.failed": "dani-dex bu isteği tamamlayamadı. Ayrıntılar dani-dex ana makinesinde mevcuttur.",
  "status.messaging.noAnswer": "dani-dex yazılı bir yanıt olmadan tamamlandı.",
  "status.messaging.noAgent": "Henüz burada yanıt verebilecek bir ajan yok. dani-dex'ta Slack Düzenleyicisini ekleyin.",
  "status.messaging.delegated": "Bir ekip arkadaşı üzerinde çalışıyor. Yanıt buraya gelecek.",
  "status.messaging.stopped": "Durduruldu.",
  "status.messaging.stop": "Durdur",
  "status.messaging.approvalTitle": "dani-dex devam etmek için onay istiyor.",
  "status.messaging.approvalTitleTeammate": "Ekip arkadaşı {agent} devam etmek için onay istiyor.",
  "status.messaging.approvalCommand": "Bir komut çalıştır",
  "status.messaging.approvalFileChange": "Dosyaları değiştir",
  "status.messaging.approvalPermissions": "Daha fazla izin al",
  "status.messaging.approve": "Onayla",
  "status.messaging.deny": "Reddet",
  "status.messaging.approvedBy": "{user} tarafından onaylandı.",
  "status.messaging.deniedBy": "{user} tarafından reddedildi.",
  "status.messaging.answeredOnHost": "dani-dex ana makinesinde yanıtlandı.",
  "status.messaging.requestInactive": "Bu istek artık etkin değil.",
  "status.messaging.onlyRequester": "Bunu yalnızca {user} yapabilir. dani-dex ana makinesi de yanıt verebilir.",
  "status.messaging.hostOnly": "Bu isteği yalnızca dani-dex ana makinesi yanıtlayabilir.",
  "status.messaging.filesSkipped": "Bazı dosyalar gönderilmedi: {names}.",
  "status.messaging.orchestratorName": "Slack Düzenleyicisi",
  "status.messaging.orchestratorTitle": "Slack'te yanıt verir ve ekibe sorar",
  "status.messaging.discordNoAgent":
    "Henüz burada yanıt verebilecek bir ajan yok. dani-dex'ta Discord Düzenleyicisini ekleyin.",
  "status.messaging.discordOrchestratorName": "Discord Düzenleyicisi",
  "status.messaging.discordOrchestratorTitle": "Discord'da yanıt verir ve ekibe sorar",
  "status.messaging.integrationsSection": "Entegrasyonlar",
  "status.messaging.signInReceived": "dani-dex Slack kurulumunu aldı. Bu sekmeyi kapatabilirsiniz.",
  "status.messaging.signInUnknown": "dani-dex bu Slack kurulumunu başlatmadı. dani-dex içinde tekrar başlatın.",
  "status.messaging.telegramNoAgent":
    "Henüz burada yanıt verebilecek bir ajan yok. dani-dex'ta Pazar yeri > Uygulamalar > Telegram'ı açın ve Ajan ekle'ye tıklayın.",
  "status.messaging.telegramLinked":
    "dani-dex bu sohbete bağlandı. Ajanlara sormak için {bot} adını anın veya dani-dex'un bir mesajını yanıtlayın.",
  "status.messaging.telegramNotLinked":
    'dani-dex bu sohbete bağlı değil. Bağlamak için dani-dex uygulamasını açın, Pazaryeri → Uygulamalar → Telegram\'a gidin ve "Bir gruba ekle" veya "Doğrudan sohbet aç" seçeneğini seçin.',
  "status.messaging.telegramOrchestratorName": "Telegram Düzenleyicisi",
  "status.messaging.telegramOrchestratorTitle": "Telegram'da yanıt verir ve ekibe sorar",
  "status.messaging.whatsappNoAgent":
    "Henüz burada yanıt verebilecek bir ajan yok. dani-dex'ta WhatsApp Düzenleyicisini ekleyin.",
  "status.messaging.whatsappApprovalMenu": "Onaylamak için 1, reddetmek için 2 yazın.",
  "status.messaging.whatsappStopMenu": "Durdurmak için “stop” yazın.",
  "status.messaging.whatsappPairingCode":
    "Bu numara yalnızca sahibinin izin verdiği kişileri yanıtlar. Sahibine şu kodu verin: {code}",
  "status.messaging.whatsappPairingApproved": "Artık bu numaraya istek gönderebilirsiniz.",
  "status.messaging.whatsappOwnChat": "Kendine mesaj gönder",
  "status.messaging.whatsappWelcomeOwn":
    "👋 *dani-dex bağlandı*\n\nAjanlarına sormak için buraya yaz. WhatsApp Orchestrator yanıtlar ya da işi doğru ajana verir.\n\nBir isteği durdurmak için *stop* gönder.",
  "status.messaging.whatsappWelcomeDedicated":
    "👋 *dani-dex bağlandı*\n\nOpenBot'ta izin verdiğin kişiler artık bu numaraya yazabilir. Yeni bir kişi bir kod alır: dani-dex'ta İstekler altında onayla.\n\nBir isteği durdurmak için *stop* gönder.",
  "status.messaging.whatsappOtherOpenBot":
    "Bu WhatsApp numarasına başka bir dani-dex da bağlı, bu yüzden iki yanıt alabilirsin. Düzeltmek için telefonundaki WhatsApp'ta Bağlı cihazlar'ı aç ve kullanmadığın dani-dex'tan çıkış yap.",
  "status.messaging.whatsappPaused":
    "dani-dex burada 10 dakika yanıt vermeyi durdurdu: kısa sürede çok fazla mesaj geldi. Bu numaraya başka bir dani-dex da bağlıysa telefonundaki WhatsApp'ta Bağlı cihazlar'ı aç ve kullanmadığın dani-dex'tan çıkış yap.",
  "status.messaging.whatsappOrchestratorName": "WhatsApp Düzenleyicisi",
  "status.messaging.whatsappOrchestratorTitle": "WhatsApp'ta yanıt verir ve ekibe sorar",
} as const satisfies PartialTranslation<typeof source>;
