import type { PartialTranslation } from "../../message";
import type { messages as source } from "../en/startup";

export const messages = {
  "startup.failedTitle": "dani-dex не удалось запустить",
  "startup.failedBody":
    "{message}\n\nЛокальные данные не сброшены и не перезаписаны. Шаги восстановления — в руководстве по устранению неполадок.",
  "startup.archiveChangedTitle": "Файлы dani-dex изменены",
  "startup.archiveChangedBody":
    "Другая программа изменила файл dani-dex app.asar. Сейчас dani-dex работает, но после выхода он больше не запустится.\n\nЧтобы исправить это, установите dani-dex заново. Ваши локальные данные сохранятся.",
  "startup.archiveChangedDownload": "Скачать dani-dex",
  "startup.filesDamagedBody":
    "Некоторые файлы dani-dex повреждены или отсутствуют.\n\nЧтобы исправить это, установите dani-dex заново. Ваши локальные данные сохранятся.",
  "startup.newerDataUpdatingTitle": "Обновление dani-dex",
  "startup.newerDataUpdatingBody":
    "Более новая версия dani-dex сохранила ваши данные. dani-dex устанавливает последнюю версию и затем откроется снова.\n\nВаши локальные данные не были сброшены или перезаписаны.",
  "startup.newerDataTitle": "Установите последнюю версию dani-dex",
  "startup.newerDataBody":
    "Более новая версия dani-dex сохранила ваши данные, и эта версия ({version}) не может их открыть. Установите последнюю версию, чтобы открыть данные.\n\nВаши локальные данные не были сброшены или перезаписаны.",
  "startup.newerDataDownload": "Скачать dani-dex",
  "startup.newerDataGuide": "Открыть руководство",
  "startup.newerDataQuit": "Выйти",
  "startup.newerDataLoopTitle": "Последняя версия dani-dex не открылась",
  "startup.newerDataLoopBody":
    "Более новая версия dani-dex сохранила ваши данные, и эта версия ({version}) не может их открыть. dani-dex {loopVersion} несколько раз подряд останавливался до открытия, поэтому он не будет установлен снова.\n\nУстановите версию новее {loopVersion}, когда она появится. Чтобы получить помощь, откройте руководство.\n\nВаши локальные данные не были сброшены или перезаписаны.",
  "startup.newerDataReleases": "Показать версии",
  "startup.recoveryWindowTitle": "Восстановление dani-dex",
  "startup.recoveryTitle": "dani-dex не открылся",
  "startup.recoveryBody": {
    one: "dani-dex {version} остановился до открытия {count} раз подряд. Ваши локальные данные не сброшены и не перезаписаны.",
    few: "dani-dex {version} остановился до открытия {count} раза подряд. Ваши локальные данные не сброшены и не перезаписаны.",
    many: "dani-dex {version} остановился до открытия {count} раз подряд. Ваши локальные данные не сброшены и не перезаписаны.",
    other:
      "dani-dex {version} остановился до открытия {count} раза подряд. Ваши локальные данные не сброшены и не перезаписаны.",
  },
  "startup.recoveryHint":
    "Попробуйте снова или установите последнюю версию, которая открывалась. Чтобы получить помощь, экспортируйте диагностику и отправьте файл вместе с отчётом.",
  "startup.recoveryHintLatest":
    "dani-dex не нашёл более раннюю версию, которая может открыть ваши данные. Попробуйте снова или установите последнюю версию. Чтобы получить помощь, экспортируйте диагностику и отправьте файл вместе с отчётом.",
  "startup.recoveryRetry": "Повторить",
  "startup.recoveryPreviousVersion": "Скачать прошлую версию",
  "startup.recoveryLatestVersion": "Скачать последнюю версию",
  "startup.recoveryExportDiagnostics": "Экспорт диагностики",
  "startup.recoveryOpenDataFolder": "Открыть папку данных",
  "startup.recoveryQuit": "Выйти",
  "startup.recoveryDiagnosticsSaved": "Файл диагностики сохранён.",
  "startup.recoveryActionFailed": "dani-dex не удалось выполнить это действие.",
} as const satisfies PartialTranslation<typeof source>;
