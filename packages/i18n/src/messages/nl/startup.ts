import type { PartialTranslation } from "../../message";
import type { messages as source } from "../en/startup";

export const messages = {
  "startup.failedTitle": "Dani Dex kan niet starten",
  "startup.failedBody":
    "{message}\n\nJe lokale gegevens zijn niet gereset of overschreven. Bekijk de handleiding voor probleemoplossing voor herstelstappen.",
  "startup.archiveChangedTitle": "Dani Dex-bestanden zijn gewijzigd",
  "startup.archiveChangedBody":
    "Een ander programma heeft het Dani Dex-bestand app.asar gewijzigd. Dani Dex werkt nu, maar opent niet meer nadat je het afsluit.\n\nInstalleer Dani Dex opnieuw om het te herstellen. Je lokale gegevens blijven bewaard.",
  "startup.archiveChangedDownload": "Dani Dex downloaden",
  "startup.filesDamagedBody":
    "Sommige Dani Dex-bestanden zijn beschadigd of ontbreken.\n\nInstalleer Dani Dex opnieuw om het te herstellen. Je lokale gegevens blijven bewaard.",
  "startup.newerDataUpdatingTitle": "Dani Dex wordt bijgewerkt",
  "startup.newerDataUpdatingBody":
    "Een nieuwere versie van Dani Dex heeft je gegevens opgeslagen. Dani Dex installeert de nieuwste versie en opent daarna opnieuw.\n\nJe lokale gegevens zijn niet gereset of overschreven.",
  "startup.newerDataTitle": "Installeer de nieuwste Dani Dex",
  "startup.newerDataBody":
    "Een nieuwere versie van Dani Dex heeft je gegevens opgeslagen, en deze versie ({version}) kan ze niet openen. Installeer de nieuwste versie om je gegevens te openen.\n\nJe lokale gegevens zijn niet gereset of overschreven.",
  "startup.newerDataDownload": "Dani Dex downloaden",
  "startup.newerDataGuide": "Gids openen",
  "startup.newerDataQuit": "Stoppen",
  "startup.newerDataLoopTitle": "De nieuwste Dani Dex opende niet",
  "startup.newerDataLoopBody":
    "Een nieuwere versie van Dani Dex heeft je gegevens opgeslagen, en deze versie ({version}) kan ze niet openen. Dani Dex {loopVersion} stopte meerdere keren achter elkaar voordat het opende, dus het wordt niet opnieuw geïnstalleerd.\n\nInstalleer een versie nieuwer dan {loopVersion} zodra er een beschikbaar is. Open de gids voor hulp.\n\nJe lokale gegevens zijn niet gereset of overschreven.",
  "startup.newerDataReleases": "Versies tonen",
  "startup.recoveryWindowTitle": "Dani Dex-herstel",
  "startup.recoveryTitle": "Dani Dex is niet geopend",
  "startup.recoveryBody": {
    one: "Dani Dex {version} stopte voordat het openging, {count} keer achter elkaar. Je lokale gegevens zijn niet gewist of overschreven.",
    other:
      "Dani Dex {version} stopte voordat het openging, {count} keer achter elkaar. Je lokale gegevens zijn niet gewist of overschreven.",
  },
  "startup.recoveryHint":
    "Probeer het opnieuw, of installeer de laatste versie die wel opende. Exporteer voor hulp de diagnose en stuur het bestand mee met je melding.",
  "startup.recoveryHintLatest":
    "Dani Dex vond geen eerdere versie die je gegevens kan openen. Probeer het opnieuw, of installeer de nieuwste versie. Exporteer voor hulp de diagnose en stuur het bestand mee met je melding.",
  "startup.recoveryRetry": "Opnieuw",
  "startup.recoveryPreviousVersion": "Vorige versie downloaden",
  "startup.recoveryLatestVersion": "Nieuwste versie downloaden",
  "startup.recoveryExportDiagnostics": "Diagnose exporteren",
  "startup.recoveryOpenDataFolder": "Gegevensmap openen",
  "startup.recoveryQuit": "Stoppen",
  "startup.recoveryDiagnosticsSaved": "Het diagnosebestand is opgeslagen.",
  "startup.recoveryActionFailed": "Dani Dex kon deze actie niet uitvoeren.",
} as const satisfies PartialTranslation<typeof source>;
