import type { PartialTranslation } from "../../../message";
import type { messages as source } from "../../en/status/messaging";

export const messages = {
  "status.messaging.working": "Ci sto lavorando…",
  "status.messaging.queued": "In attesa che finisca una richiesta precedente. La risposta arriva qui.",
  "status.messaging.busy": "Ci sono troppe richieste in attesa. Riprova più tardi.",
  "status.messaging.failed":
    "dani-dex non è riuscito a completare questa richiesta. I dettagli sono sull'host di dani-dex.",
  "status.messaging.noAnswer": "dani-dex ha finito senza una risposta scritta.",
  "status.messaging.noAgent": "Nessun agente può ancora rispondere qui. Aggiungi lo Slack Orchestrator in dani-dex.",
  "status.messaging.delegated": "Un collega ci sta lavorando. La risposta arriva qui.",
  "status.messaging.stopped": "Interrotto.",
  "status.messaging.stop": "Interrompi",
  "status.messaging.approvalTitle": "dani-dex chiede l'approvazione per continuare.",
  "status.messaging.approvalTitleTeammate": "Il collega {agent} chiede l'approvazione per continuare.",
  "status.messaging.approvalCommand": "Eseguire un comando",
  "status.messaging.approvalFileChange": "Modificare dei file",
  "status.messaging.approvalPermissions": "Ottenere altri permessi",
  "status.messaging.approve": "Approva",
  "status.messaging.deny": "Rifiuta",
  "status.messaging.approvedBy": "Approvato da {user}.",
  "status.messaging.deniedBy": "Rifiutato da {user}.",
  "status.messaging.answeredOnHost": "Risposta data sull'host di dani-dex.",
  "status.messaging.requestInactive": "Questa richiesta non è più attiva.",
  "status.messaging.onlyRequester": "Solo {user} può farlo. Può rispondere anche l'host di dani-dex.",
  "status.messaging.hostOnly": "Solo l'host di dani-dex può rispondere a questa richiesta.",
  "status.messaging.filesSkipped": "Alcuni file non sono stati inviati: {names}.",
  "status.messaging.orchestratorName": "Slack Orchestrator",
  "status.messaging.orchestratorTitle": "Risponde su Slack e consulta il team",
  "status.messaging.discordNoAgent":
    "Nessun agente può ancora rispondere qui. Aggiungi il Discord Orchestrator in dani-dex.",
  "status.messaging.discordOrchestratorName": "Discord Orchestrator",
  "status.messaging.discordOrchestratorTitle": "Risponde su Discord e consulta il team",
  "status.messaging.integrationsSection": "Integrazioni",
  "status.messaging.signInReceived": "dani-dex ha ricevuto l'installazione di Slack. Puoi chiudere questa scheda.",
  "status.messaging.signInUnknown": "dani-dex non ha avviato questa installazione di Slack. Riavviala in dani-dex.",
  "status.messaging.telegramNoAgent":
    "Nessun agente può ancora rispondere qui. In dani-dex, apri Marketplace > App > Telegram e fai clic su Aggiungi agente.",
  "status.messaging.telegramLinked":
    "dani-dex è collegato a questa chat. Menziona {bot} o rispondi a un messaggio di dani-dex per interpellare gli agenti.",
  "status.messaging.telegramNotLinked":
    "dani-dex non è collegato a questa chat. Per collegarlo, apri l’app dani-dex, vai su Marketplace → App → Telegram e seleziona «Aggiungi a un gruppo» o «Apri una chat diretta».",
  "status.messaging.telegramOrchestratorName": "Telegram Orchestrator",
  "status.messaging.telegramOrchestratorTitle": "Risponde su Telegram e consulta il team",
  "status.messaging.whatsappNoAgent":
    "Nessun agente può ancora rispondere qui. Aggiungi il WhatsApp Orchestrator in dani-dex.",
  "status.messaging.whatsappApprovalMenu": "Rispondi 1 per approvare o 2 per rifiutare.",
  "status.messaging.whatsappStopMenu": "Rispondi «stop» per interrompere.",
  "status.messaging.whatsappPairingCode":
    "Questo numero risponde solo alle persone autorizzate dal proprietario. Dai questo codice al proprietario: {code}",
  "status.messaging.whatsappPairingApproved": "Ora puoi inviare richieste a questo numero.",
  "status.messaging.whatsappOwnChat": "Messaggio a te stesso",
  "status.messaging.whatsappWelcomeOwn":
    "👋 *dani-dex è collegato*\n\nScrivi qui per chiedere ai tuoi agenti. Il WhatsApp Orchestrator risponde o passa il lavoro all'agente giusto.\n\nInvia *stop* per fermare una richiesta.",
  "status.messaging.whatsappWelcomeDedicated":
    "👋 *dani-dex è collegato*\n\nLe persone che autorizzi in dani-dex ora possono scrivere a questo numero. Una persona nuova riceve un codice: approvalo in dani-dex, in Richieste.\n\nInvia *stop* per fermare una richiesta.",
  "status.messaging.whatsappOtherOpenBot":
    "Un altro dani-dex è collegato a questo numero WhatsApp, quindi puoi ricevere due risposte. Per risolvere, apri Dispositivi collegati in WhatsApp sul telefono ed esci dall’dani-dex che non usi.",
  "status.messaging.whatsappPaused":
    "dani-dex non risponde qui per 10 minuti: sono arrivati troppi messaggi in poco tempo. Se un altro dani-dex è collegato a questo numero, apri Dispositivi collegati in WhatsApp sul telefono ed esci dall’dani-dex che non usi.",
  "status.messaging.whatsappOrchestratorName": "WhatsApp Orchestrator",
  "status.messaging.whatsappOrchestratorTitle": "Risponde su WhatsApp e consulta il team",
} as const satisfies PartialTranslation<typeof source>;
