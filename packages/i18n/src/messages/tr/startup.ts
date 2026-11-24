import type { PartialTranslation } from "../../message";
import type { messages as source } from "../en/startup";

export const messages = {
  "startup.failedTitle": "dani-dex başlatılamadı",
  "startup.failedBody":
    "{message}\n\nYerel verileriniz sıfırlanmadı veya üzerine yazılmadı. Kurtarma adımları için sorun giderme kılavuzuna bakın.",
  "startup.archiveChangedTitle": "dani-dex dosyaları değiştirildi",
  "startup.archiveChangedBody":
    "Başka bir program dani-dex’un app.asar dosyasını değiştirdi. dani-dex şu an çalışıyor, ancak kapattıktan sonra açılmayacak.\n\nOnarmak için dani-dex’u yeniden yükleyin. Yerel verileriniz korunur.",
  "startup.archiveChangedDownload": "dani-dex’u indir",
  "startup.filesDamagedBody":
    "Bazı dani-dex dosyaları hasarlı veya eksik.\n\nOnarmak için dani-dex’u yeniden yükleyin. Yerel verileriniz korunur.",
  "startup.newerDataUpdatingTitle": "dani-dex güncelleniyor",
  "startup.newerDataUpdatingBody":
    "dani-dex’un daha yeni bir sürümü verilerinizi kaydetti. dani-dex en son sürümü yüklüyor ve ardından yeniden açılacak.\n\nYerel verileriniz sıfırlanmadı veya üzerine yazılmadı.",
  "startup.newerDataTitle": "En son dani-dex’u yükleyin",
  "startup.newerDataBody":
    "dani-dex’un daha yeni bir sürümü verilerinizi kaydetti ve bu sürüm ({version}) onları açamıyor. Verilerinizi açmak için en son sürümü yükleyin.\n\nYerel verileriniz sıfırlanmadı veya üzerine yazılmadı.",
  "startup.newerDataDownload": "dani-dex’u indir",
  "startup.newerDataGuide": "Kılavuzu aç",
  "startup.newerDataQuit": "Çık",
  "startup.newerDataLoopTitle": "En son dani-dex açılmadı",
  "startup.newerDataLoopBody":
    "dani-dex’un daha yeni bir sürümü verilerinizi kaydetti ve bu sürüm ({version}) onları açamıyor. dani-dex {loopVersion} art arda birkaç kez açılmadan durdu, bu yüzden yeniden yüklenmiyor.\n\n{loopVersion} sürümünden daha yeni bir sürüm çıktığında onu yükleyin. Yardım almak için kılavuzu açın.\n\nYerel verileriniz sıfırlanmadı veya üzerine yazılmadı.",
  "startup.newerDataReleases": "Sürümleri göster",
  "startup.recoveryWindowTitle": "dani-dex kurtarma",
  "startup.recoveryTitle": "dani-dex açılmadı",
  "startup.recoveryBody": {
    one: "dani-dex {version}, açılmadan önce art arda {count} kez durdu. Yerel verileriniz sıfırlanmadı veya üzerine yazılmadı.",
    other:
      "dani-dex {version}, açılmadan önce art arda {count} kez durdu. Yerel verileriniz sıfırlanmadı veya üzerine yazılmadı.",
  },
  "startup.recoveryHint":
    "Yeniden deneyin veya açılan son sürümü yükleyin. Yardım almak için tanılamayı dışa aktarın ve dosyayı raporunuzla gönderin.",
  "startup.recoveryHintLatest":
    "dani-dex verilerinizi açabilen daha eski bir sürüm bulamadı. Yeniden deneyin veya en son sürümü yükleyin. Yardım almak için tanılamayı dışa aktarın ve dosyayı raporunuzla gönderin.",
  "startup.recoveryRetry": "Yeniden dene",
  "startup.recoveryPreviousVersion": "Önceki sürümü indir",
  "startup.recoveryLatestVersion": "En son sürümü indir",
  "startup.recoveryExportDiagnostics": "Tanılamayı dışa aktar",
  "startup.recoveryOpenDataFolder": "Veri klasörünü aç",
  "startup.recoveryQuit": "Çık",
  "startup.recoveryDiagnosticsSaved": "Tanılama dosyası kaydedildi.",
  "startup.recoveryActionFailed": "dani-dex bu işlemi yapamadı.",
} as const satisfies PartialTranslation<typeof source>;
