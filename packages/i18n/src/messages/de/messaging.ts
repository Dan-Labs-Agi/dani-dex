import type { PartialTranslation } from "../../message";
import type { messages as source } from "../en/messaging";

export const messages = {
  "messaging.help.invalid_token":
    "Slack akzeptiert dani-dex in diesem Arbeitsbereich nicht mehr. Es wurde möglicherweise deinstalliert. Verbinde den Arbeitsbereich erneut.",
  "messaging.help.secret_storage_unavailable":
    "dani-dex kann die gespeicherten Tokens auf diesem Computer nicht lesen. Trenne den Arbeitsbereich und verbinde ihn erneut.",
  "messaging.help.relay_unavailable":
    "dani-dex kann auf diesem Computer keine Slack-Ereignisse empfangen. Melde dich an, gib diesem Computer in den Servereinstellungen einen Namen und lass dani-dex geöffnet.",
  "messaging.help.not_linked":
    "Dieser Workspace ist nicht mit diesem Server verknüpft. Wähle „Neu verbinden“, um ihn zu verknüpfen.",
  "messaging.discordHelp.invalid_token":
    "Discord akzeptiert dani-dex auf diesem Discord-Server nicht mehr. Es wurde möglicherweise entfernt. Verbinde den Discord-Server erneut.",
  "messaging.discordHelp.secret_storage_unavailable":
    "dani-dex kann die gespeicherten Tokens auf diesem Computer nicht lesen. Trenne den Discord-Server und verbinde ihn erneut.",
  "messaging.discordHelp.relay_unavailable":
    "dani-dex kann auf diesem Computer keine Discord-Ereignisse empfangen. Melde dich an, gib diesem Computer in den Servereinstellungen einen Namen und lass dani-dex geöffnet.",
  "messaging.discordHelp.not_linked":
    "Dieser Discord-Server ist nicht mit diesem dani-dex-Server verknüpft. Wähle „Neu verbinden“, um ihn zu verknüpfen.",
} as const satisfies PartialTranslation<typeof source>;
