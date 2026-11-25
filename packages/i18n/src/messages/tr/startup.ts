import type { PartialTranslation } from "../../message";
import type { messages as source } from "../en/startup";

export const messages = {
  "startup.failedTitle": "Dani Dex başlatılamadı",
  "startup.failedBody":
    "{message}\n\nYerel verileriniz sıfırlanmadı veya üzerine yazılmadı. Kurtarma adımları için sorun giderme kılavuzuna bakın.",
  "startup.archiveChangedTitle": "Dani Dex dosyaları değiştirildi",
  "startup.archiveChangedBody":
    "Başka bir program Dani Dex’un app.asar dosyasını değiştirdi. Dani Dex şu an çalışıyor, ancak kapattıktan sonra açılmayacak.\n\nOnarmak için Dani Dex’u yeniden yükleyin. Yerel verileriniz korunur.",
  "startup.archiveChangedDownload": "Dani Dex’u indir",
  "startup.filesDamagedBody":
    "Bazı Dani Dex dosyaları hasarlı veya eksik.\n\nOnarmak için Dani Dex’u yeniden yükleyin. Yerel verileriniz korunur.",
  "startup.newerDataUpdatingTitle": "Dani Dex güncelleniyor",
  "startup.newerDataUpdatingBody":
    "Dani Dex’un daha yeni bir sürümü verilerinizi kaydetti. Dani Dex en son sürümü yüklüyor ve ardından yeniden açılacak.\n\nYerel verileriniz sıfırlanmadı veya üzerine yazılmadı.",
  "startup.newerDataTitle": "En son Dani Dex’u yükleyin",
  "startup.newerDataBody":
    "Dani Dex’un daha yeni bir sürümü verilerinizi kaydetti ve bu sürüm ({version}) onları açamıyor. Verilerinizi açmak için en son sürümü yükleyin.\n\nYerel verileriniz sıfırlanmadı veya üzerine yazılmadı.",
  "startup.newerDataDownload": "Dani Dex’u indir",
  "startup.newerDataGuide": "Kılavuzu aç",
  "startup.newerDataQuit": "Çık",
  "startup.newerDataLoopTitle": "En son Dani Dex açılmadı",
  "startup.newerDataLoopBody":
    "Dani Dex’un daha yeni bir sürümü verilerinizi kaydetti ve bu sürüm ({version}) onları açamıyor. Dani Dex {loopVersion} art arda birkaç kez açılmadan durdu, bu yüzden yeniden yüklenmiyor.\n\n{loopVersion} sürümünden daha yeni bir sürüm çıktığında onu yükleyin. Yardım almak için kılavuzu açın.\n\nYerel verileriniz sıfırlanmadı veya üzerine yazılmadı.",
  "startup.newerDataReleases": "Sürümleri göster",
  "startup.recoveryWindowTitle": "Dani Dex kurtarma",
  "startup.recoveryTitle": "Dani Dex açılmadı",
  "startup.recoveryBody": {
    one: "Dani Dex {version}, açılmadan önce art arda {count} kez durdu. Yerel verileriniz sıfırlanmadı veya üzerine yazılmadı.",
    other:
      "Dani Dex {version}, açılmadan önce art arda {count} kez durdu. Yerel verileriniz sıfırlanmadı veya üzerine yazılmadı.",
  },
  "startup.recoveryHint":
    "Yeniden deneyin veya açılan son sürümü yükleyin. Yardım almak için tanılamayı dışa aktarın ve dosyayı raporunuzla gönderin.",
  "startup.recoveryHintLatest":
    "Dani Dex verilerinizi açabilen daha eski bir sürüm bulamadı. Yeniden deneyin veya en son sürümü yükleyin. Yardım almak için tanılamayı dışa aktarın ve dosyayı raporunuzla gönderin.",
  "startup.recoveryRetry": "Yeniden dene",
  "startup.recoveryPreviousVersion": "Önceki sürümü indir",
  "startup.recoveryLatestVersion": "En son sürümü indir",
  "startup.recoveryExportDiagnostics": "Tanılamayı dışa aktar",
  "startup.recoveryOpenDataFolder": "Veri klasörünü aç",
  "startup.recoveryQuit": "Çık",
  "startup.recoveryDiagnosticsSaved": "Tanılama dosyası kaydedildi.",
  "startup.recoveryActionFailed": "Dani Dex bu işlemi yapamadı.",
} as const satisfies PartialTranslation<typeof source>;
