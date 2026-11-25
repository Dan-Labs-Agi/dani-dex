import type { PartialTranslation } from "../../message";
import type { messages as source } from "../en/startup";

export const messages = {
  "startup.failedTitle": "Dani Dex не удалось запустить",
  "startup.failedBody":
    "{message}\n\nЛокальные данные не сброшены и не перезаписаны. Шаги восстановления — в руководстве по устранению неполадок.",
  "startup.archiveChangedTitle": "Файлы Dani Dex изменены",
  "startup.archiveChangedBody":
    "Другая программа изменила файл Dani Dex app.asar. Сейчас Dani Dex работает, но после выхода он больше не запустится.\n\nЧтобы исправить это, установите Dani Dex заново. Ваши локальные данные сохранятся.",
  "startup.archiveChangedDownload": "Скачать Dani Dex",
  "startup.filesDamagedBody":
    "Некоторые файлы Dani Dex повреждены или отсутствуют.\n\nЧтобы исправить это, установите Dani Dex заново. Ваши локальные данные сохранятся.",
  "startup.newerDataUpdatingTitle": "Обновление Dani Dex",
  "startup.newerDataUpdatingBody":
    "Более новая версия Dani Dex сохранила ваши данные. Dani Dex устанавливает последнюю версию и затем откроется снова.\n\nВаши локальные данные не были сброшены или перезаписаны.",
  "startup.newerDataTitle": "Установите последнюю версию Dani Dex",
  "startup.newerDataBody":
    "Более новая версия Dani Dex сохранила ваши данные, и эта версия ({version}) не может их открыть. Установите последнюю версию, чтобы открыть данные.\n\nВаши локальные данные не были сброшены или перезаписаны.",
  "startup.newerDataDownload": "Скачать Dani Dex",
  "startup.newerDataGuide": "Открыть руководство",
  "startup.newerDataQuit": "Выйти",
  "startup.newerDataLoopTitle": "Последняя версия Dani Dex не открылась",
  "startup.newerDataLoopBody":
    "Более новая версия Dani Dex сохранила ваши данные, и эта версия ({version}) не может их открыть. Dani Dex {loopVersion} несколько раз подряд останавливался до открытия, поэтому он не будет установлен снова.\n\nУстановите версию новее {loopVersion}, когда она появится. Чтобы получить помощь, откройте руководство.\n\nВаши локальные данные не были сброшены или перезаписаны.",
  "startup.newerDataReleases": "Показать версии",
  "startup.recoveryWindowTitle": "Восстановление Dani Dex",
  "startup.recoveryTitle": "Dani Dex не открылся",
  "startup.recoveryBody": {
    one: "Dani Dex {version} остановился до открытия {count} раз подряд. Ваши локальные данные не сброшены и не перезаписаны.",
    few: "Dani Dex {version} остановился до открытия {count} раза подряд. Ваши локальные данные не сброшены и не перезаписаны.",
    many: "Dani Dex {version} остановился до открытия {count} раз подряд. Ваши локальные данные не сброшены и не перезаписаны.",
    other:
      "Dani Dex {version} остановился до открытия {count} раза подряд. Ваши локальные данные не сброшены и не перезаписаны.",
  },
  "startup.recoveryHint":
    "Попробуйте снова или установите последнюю версию, которая открывалась. Чтобы получить помощь, экспортируйте диагностику и отправьте файл вместе с отчётом.",
  "startup.recoveryHintLatest":
    "Dani Dex не нашёл более раннюю версию, которая может открыть ваши данные. Попробуйте снова или установите последнюю версию. Чтобы получить помощь, экспортируйте диагностику и отправьте файл вместе с отчётом.",
  "startup.recoveryRetry": "Повторить",
  "startup.recoveryPreviousVersion": "Скачать прошлую версию",
  "startup.recoveryLatestVersion": "Скачать последнюю версию",
  "startup.recoveryExportDiagnostics": "Экспорт диагностики",
  "startup.recoveryOpenDataFolder": "Открыть папку данных",
  "startup.recoveryQuit": "Выйти",
  "startup.recoveryDiagnosticsSaved": "Файл диагностики сохранён.",
  "startup.recoveryActionFailed": "Dani Dex не удалось выполнить это действие.",
} as const satisfies PartialTranslation<typeof source>;
