import type { PartialTranslation } from "../../../message";
import type { messages as source } from "../../en/error/update";

export const messages = {
  "error.update.unsupported": "Обновления доступны в установленных сборках для компьютера.",
  "error.update.notReady": "Обновление не готово к установке.",
  "error.update.restartFailed": "Dani Dex не смог перезапуститься для установки обновления.",
  "error.update.downloadStalled": "Загрузка обновления перестала отвечать. Повторите попытку.",
  "error.update.installFailed":
    "Не удалось установить обновление. Закройте и снова откройте Dani Dex, затем повторите попытку.",
  "error.update.notInstalled": "Последний перезапуск не установил обновление. Перезапустите, чтобы повторить попытку.",
  "error.update.downloadFailed": "Не удалось загрузить обновление. Повторите попытку.",
  "error.update.signatureNotConfirmed":
    "Dani Dex не удалось проверить обновление. Повторите попытку. Если ошибка повторяется, скачайте Dani Dex на openbot.run/download.",
  "error.update.checkFailed": "Не удалось проверить обновления. Повторите попытку.",
  "error.update.checkStalled": "Проверка обновлений перестала отвечать. Повторите попытку.",
  "error.update.checkOffline":
    "Не удалось связаться со службой обновлений. Проверьте подключение к интернету и повторите попытку.",
  "error.update.checkUnavailable": "Служба обновлений не ответила. Dani Dex сам повторит попытку через несколько минут.",
  "error.update.checkNoRelease":
    "Для этой платформы не найдено опубликованных обновлений. Dani Dex сам повторит попытку через несколько минут.",
  "error.update.managedByNix": "Обновления этой копии Dani Dex устанавливает Nix. Обновите её через Nix.",
  "error.update.managedByHost":
    "Обновления на этом Mac устанавливает хост. Обновление остаётся готовым до начала обслуживания хоста.",
  "error.update.siblingSession":
    "Из этого приложения всё ещё запущена другая сессия Dani Dex. Сначала закройте Dani Dex во всех других учётных записях macOS, затем установите обновление снова.",
  "error.update.siblingSessionSameAccount":
    "В этой учётной записи всё ещё работает другой процесс Dani Dex. Завершите его, затем установите обновление снова.",
  "error.update.siblingCheckFailed": "Не удалось проверить другие сессии Dani Dex. Повторите попытку перед установкой.",
  "error.update.readOnlyLocation":
    "Dani Dex не может устанавливать обновления из этого места. Закройте Dani Dex. В Finder перетащите Dani Dex в папку «Программы» (если он уже там, перетащите его наружу и обратно). Затем откройте Dani Dex и установите обновление снова.",
  "error.update.appImageMissing":
    "Dani Dex не может установить обновление, потому что его файл AppImage был перемещён, переименован или заменён. Закройте Dani Dex, затем снова откройте файл AppImage.",
  "error.update.appImageReadOnly":
    "Dani Dex не может устанавливать обновления в папку своего файла AppImage. Закройте Dani Dex, переместите файл AppImage в папку внутри домашней папки, затем откройте его и снова установите обновление.",
  "error.update.remoteDisabled": "Обновления от администраторов сервера отключены на этом компьютере.",
  "error.update.restartStarted": "Dani Dex уже перезапускается для установки обновления.",
  "error.update.alreadyRestarting": "Dani Dex уже перезапускается.",
} as const satisfies PartialTranslation<typeof source>;
