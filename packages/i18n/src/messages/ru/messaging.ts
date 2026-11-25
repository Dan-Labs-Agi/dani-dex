import type { PartialTranslation } from "../../message";
import type { messages as source } from "../en/messaging";

export const messages = {
  "messaging.help.invalid_token":
    "Slack больше не принимает Dani Dex в этом рабочем пространстве. Возможно, приложение удалили. Подключите рабочее пространство заново.",
  "messaging.help.secret_storage_unavailable":
    "Dani Dex не может прочитать сохранённые токены на этом компьютере. Отключите рабочее пространство и подключите его снова.",
  "messaging.help.relay_unavailable":
    "Dani Dex не может получать события Slack на этом компьютере. Войдите в аккаунт, задайте компьютеру имя в настройках сервера и не закрывайте Dani Dex.",
  "messaging.help.not_linked":
    "Это рабочее пространство не связано с этим сервером. Выберите «Переподключить», чтобы связать его.",
  "messaging.discordHelp.invalid_token":
    "Discord больше не принимает Dani Dex на этом сервере Discord. Возможно, приложение удалили. Подключите сервер Discord заново.",
  "messaging.discordHelp.secret_storage_unavailable":
    "Dani Dex не может прочитать сохранённые токены на этом компьютере. Отключите сервер Discord и подключите его снова.",
  "messaging.discordHelp.relay_unavailable":
    "Dani Dex не может получать события Discord на этом компьютере. Войдите в аккаунт, задайте компьютеру имя в настройках сервера и не закрывайте Dani Dex.",
  "messaging.discordHelp.not_linked":
    "Этот сервер Discord не связан с этим сервером Dani Dex. Выберите «Переподключить», чтобы связать его.",
} as const satisfies PartialTranslation<typeof source>;
