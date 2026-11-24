import type { PartialTranslation } from "../../../message";
import type { messages as source } from "../../en/status/messaging";

export const messages = {
  "status.messaging.working": "Wird bearbeitet…",
  "status.messaging.queued": "Wartet, bis eine frühere Anfrage fertig ist. Die Antwort erscheint hier.",
  "status.messaging.busy": "Zu viele Anfragen warten. Versuche es später erneut.",
  "status.messaging.failed": "dani-dex konnte diese Anfrage nicht abschließen. Der dani-dex-Host hat die Details.",
  "status.messaging.noAnswer": "dani-dex wurde ohne schriftliche Antwort fertig.",
  "status.messaging.noAgent": "Hier kann noch kein Agent antworten. Füge den Slack Orchestrator in dani-dex hinzu.",
  "status.messaging.delegated": "Ein Teamkollege arbeitet daran. Die Antwort erscheint hier.",
  "status.messaging.stopped": "Gestoppt.",
  "status.messaging.stop": "Stoppen",
  "status.messaging.approvalTitle": "dani-dex bittet um Genehmigung, um fortzufahren.",
  "status.messaging.approvalTitleTeammate": "Teamkollege {agent} bittet um Genehmigung, um fortzufahren.",
  "status.messaging.approvalCommand": "Einen Befehl ausführen",
  "status.messaging.approvalFileChange": "Dateien ändern",
  "status.messaging.approvalPermissions": "Weitere Berechtigungen erhalten",
  "status.messaging.approve": "Genehmigen",
  "status.messaging.deny": "Ablehnen",
  "status.messaging.approvedBy": "Von {user} genehmigt.",
  "status.messaging.deniedBy": "Von {user} abgelehnt.",
  "status.messaging.answeredOnHost": "Auf dem dani-dex-Host beantwortet.",
  "status.messaging.requestInactive": "Diese Anfrage ist nicht mehr aktiv.",
  "status.messaging.onlyRequester": "Nur {user} kann dies tun. Der dani-dex-Host kann ebenfalls antworten.",
  "status.messaging.hostOnly": "Nur der dani-dex-Host kann diese Anfrage beantworten.",
  "status.messaging.filesSkipped": "Einige Dateien wurden nicht gesendet: {names}.",
  "status.messaging.orchestratorName": "Slack Orchestrator",
  "status.messaging.orchestratorTitle": "Antwortet in Slack und fragt das Team",
  "status.messaging.discordNoAgent":
    "Hier kann noch kein Agent antworten. Füge den Discord Orchestrator in dani-dex hinzu.",
  "status.messaging.discordOrchestratorName": "Discord Orchestrator",
  "status.messaging.discordOrchestratorTitle": "Antwortet in Discord und fragt das Team",
  "status.messaging.integrationsSection": "Integrationen",
  "status.messaging.signInReceived": "dani-dex hat die Slack-Installation empfangen. Du kannst diesen Tab schließen.",
  "status.messaging.signInUnknown":
    "dani-dex hat diese Slack-Installation nicht gestartet. Starte sie erneut in dani-dex.",
  "status.messaging.telegramNoAgent":
    "Hier kann noch kein Agent antworten. Öffne in dani-dex Marktplatz > Apps > Telegram und klicke auf Agenten hinzufügen.",
  "status.messaging.telegramLinked":
    "dani-dex ist mit diesem Chat verbunden. Erwähne {bot} oder antworte auf eine Nachricht von dani-dex, um die Agenten zu fragen.",
  "status.messaging.telegramNotLinked":
    "dani-dex ist nicht mit diesem Chat verbunden. Öffne zum Verbinden die dani-dex-App, gehe zu Marketplace → Apps → Telegram und wähle „Zu Gruppe hinzufügen“ oder „Direkten Chat öffnen“.",
  "status.messaging.telegramOrchestratorName": "Telegram-Orchestrator",
  "status.messaging.telegramOrchestratorTitle": "Antwortet in Telegram und fragt das Team",
  "status.messaging.whatsappNoAgent":
    "Hier kann noch kein Agent antworten. Füge den WhatsApp-Orchestrator in dani-dex hinzu.",
  "status.messaging.whatsappApprovalMenu": "Antworte 1 zum Genehmigen oder 2 zum Ablehnen.",
  "status.messaging.whatsappStopMenu": "Antworte „stop“, um zu stoppen.",
  "status.messaging.whatsappPairingCode":
    "Diese Nummer antwortet nur Personen, die ihr Besitzer zugelassen hat. Gib dem Besitzer diesen Code: {code}",
  "status.messaging.whatsappPairingApproved": "Du kannst jetzt Anfragen an diese Nummer senden.",
  "status.messaging.whatsappOwnChat": "Nachricht an dich selbst",
  "status.messaging.whatsappWelcomeOwn":
    "👋 *dani-dex ist verbunden*\n\nSchreib hier, um deine Agenten zu fragen. Der WhatsApp Orchestrator antwortet oder gibt die Arbeit an den passenden Agenten.\n\nSende *stop*, um eine Anfrage zu stoppen.",
  "status.messaging.whatsappWelcomeDedicated":
    "👋 *dani-dex ist verbunden*\n\nDie Personen, die du in dani-dex erlaubst, können dieser Nummer jetzt schreiben. Eine neue Person bekommt einen Code: Genehmige ihn in dani-dex unter Anfragen.\n\nSende *stop*, um eine Anfrage zu stoppen.",
  "status.messaging.whatsappOtherOpenBot":
    "Ein anderer dani-dex ist mit dieser WhatsApp-Nummer verknüpft, darum bekommst du vielleicht zwei Antworten. Öffne dazu in WhatsApp auf deinem Handy „Verknüpfte Geräte“ und melde den dani-dex ab, den du nicht nutzt.",
  "status.messaging.whatsappPaused":
    "dani-dex antwortet hier 10 Minuten lang nicht: In kurzer Zeit kamen zu viele Nachrichten. Wenn ein anderer dani-dex mit dieser Nummer verknüpft ist, öffne in WhatsApp auf deinem Handy „Verknüpfte Geräte“ und melde den dani-dex ab, den du nicht nutzt.",
  "status.messaging.whatsappOrchestratorName": "WhatsApp-Orchestrator",
  "status.messaging.whatsappOrchestratorTitle": "Antwortet in WhatsApp und fragt das Team",
} as const satisfies PartialTranslation<typeof source>;
