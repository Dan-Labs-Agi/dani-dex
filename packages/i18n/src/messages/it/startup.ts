import type { PartialTranslation } from "../../message";
import type { messages as source } from "../en/startup";

export const messages = {
  "startup.failedTitle": "Dani Dex non è riuscito ad avviarsi",
  "startup.failedBody":
    "{message}\n\nI tuoi dati locali non sono stati reimpostati né sovrascritti. Consulta la guida alla risoluzione dei problemi per i passaggi di ripristino.",
  "startup.archiveChangedTitle": "I file di Dani Dex sono stati modificati",
  "startup.archiveChangedBody":
    "Un altro programma ha modificato il file app.asar di Dani Dex. Dani Dex ora funziona, ma non si aprirà più dopo la chiusura.\n\nPer ripararlo, installa di nuovo Dani Dex. I tuoi dati locali restano.",
  "startup.archiveChangedDownload": "Scarica Dani Dex",
  "startup.filesDamagedBody":
    "Alcuni file di Dani Dex sono danneggiati o mancanti.\n\nPer ripararlo, installa di nuovo Dani Dex. I tuoi dati locali restano.",
  "startup.newerDataUpdatingTitle": "Aggiornamento di Dani Dex",
  "startup.newerDataUpdatingBody":
    "Una versione più recente di Dani Dex ha salvato i tuoi dati. Dani Dex installa l’ultima versione e poi si riapre.\n\nI tuoi dati locali non sono stati reimpostati né sovrascritti.",
  "startup.newerDataTitle": "Installa l’ultima versione di Dani Dex",
  "startup.newerDataBody":
    "Una versione più recente di Dani Dex ha salvato i tuoi dati e questa versione ({version}) non può aprirli. Installa l’ultima versione per aprire i tuoi dati.\n\nI tuoi dati locali non sono stati reimpostati né sovrascritti.",
  "startup.newerDataDownload": "Scarica Dani Dex",
  "startup.newerDataGuide": "Apri guida",
  "startup.newerDataQuit": "Esci",
  "startup.newerDataLoopTitle": "L’ultima versione di Dani Dex non si è aperta",
  "startup.newerDataLoopBody":
    "Una versione più recente di Dani Dex ha salvato i tuoi dati e questa versione ({version}) non può aprirli. Dani Dex {loopVersion} si è fermato prima di aprirsi più volte di seguito, quindi non viene installato di nuovo.\n\nInstalla una versione più recente di {loopVersion} quando sarà disponibile. Per ricevere aiuto, apri la guida.\n\nI tuoi dati locali non sono stati reimpostati né sovrascritti.",
  "startup.newerDataReleases": "Mostra versioni",
  "startup.recoveryWindowTitle": "Ripristino di Dani Dex",
  "startup.recoveryTitle": "Dani Dex non si è aperto",
  "startup.recoveryBody": {
    one: "Dani Dex {version} si è chiuso prima di aprirsi, {count} volta di seguito. I tuoi dati locali non sono stati reimpostati né sovrascritti.",
    other:
      "Dani Dex {version} si è chiuso prima di aprirsi, {count} volte di seguito. I tuoi dati locali non sono stati reimpostati né sovrascritti.",
  },
  "startup.recoveryHint":
    "Riprova, oppure installa l’ultima versione che si è aperta. Per ricevere aiuto, esporta la diagnostica e invia il file con la tua segnalazione.",
  "startup.recoveryHintLatest":
    "Dani Dex non ha trovato una versione precedente che possa aprire i tuoi dati. Riprova, oppure installa l’ultima versione. Per ricevere aiuto, esporta la diagnostica e invia il file con la tua segnalazione.",
  "startup.recoveryRetry": "Riprova",
  "startup.recoveryPreviousVersion": "Scarica versione precedente",
  "startup.recoveryLatestVersion": "Scarica ultima versione",
  "startup.recoveryExportDiagnostics": "Esporta diagnostica",
  "startup.recoveryOpenDataFolder": "Apri cartella dati",
  "startup.recoveryQuit": "Esci",
  "startup.recoveryDiagnosticsSaved": "Il file di diagnostica è stato salvato.",
  "startup.recoveryActionFailed": "Dani Dex non è riuscito a eseguire questa azione.",
} as const satisfies PartialTranslation<typeof source>;
