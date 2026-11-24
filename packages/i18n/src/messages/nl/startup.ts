import type { PartialTranslation } from "../../message";
import type { messages as source } from "../en/startup";

export const messages = {
  "startup.failedTitle": "dani-dex kan niet starten",
  "startup.failedBody":
    "{message}\n\nJe lokale gegevens zijn niet gereset of overschreven. Bekijk de handleiding voor probleemoplossing voor herstelstappen.",
  "startup.archiveChangedTitle": "dani-dex-bestanden zijn gewijzigd",
  "startup.archiveChangedBody":
    "Een ander programma heeft het dani-dex-bestand app.asar gewijzigd. dani-dex werkt nu, maar opent niet meer nadat je het afsluit.\n\nInstalleer dani-dex opnieuw om het te herstellen. Je lokale gegevens blijven bewaard.",
  "startup.archiveChangedDownload": "dani-dex downloaden",
  "startup.filesDamagedBody":
    "Sommige dani-dex-bestanden zijn beschadigd of ontbreken.\n\nInstalleer dani-dex opnieuw om het te herstellen. Je lokale gegevens blijven bewaard.",
  "startup.newerDataUpdatingTitle": "dani-dex wordt bijgewerkt",
  "startup.newerDataUpdatingBody":
    "Een nieuwere versie van dani-dex heeft je gegevens opgeslagen. dani-dex installeert de nieuwste versie en opent daarna opnieuw.\n\nJe lokale gegevens zijn niet gereset of overschreven.",
  "startup.newerDataTitle": "Installeer de nieuwste dani-dex",
  "startup.newerDataBody":
    "Een nieuwere versie van dani-dex heeft je gegevens opgeslagen, en deze versie ({version}) kan ze niet openen. Installeer de nieuwste versie om je gegevens te openen.\n\nJe lokale gegevens zijn niet gereset of overschreven.",
  "startup.newerDataDownload": "dani-dex downloaden",
  "startup.newerDataGuide": "Gids openen",
  "startup.newerDataQuit": "Stoppen",
  "startup.newerDataLoopTitle": "De nieuwste dani-dex opende niet",
  "startup.newerDataLoopBody":
    "Een nieuwere versie van dani-dex heeft je gegevens opgeslagen, en deze versie ({version}) kan ze niet openen. dani-dex {loopVersion} stopte meerdere keren achter elkaar voordat het opende, dus het wordt niet opnieuw geïnstalleerd.\n\nInstalleer een versie nieuwer dan {loopVersion} zodra er een beschikbaar is. Open de gids voor hulp.\n\nJe lokale gegevens zijn niet gereset of overschreven.",
  "startup.newerDataReleases": "Versies tonen",
  "startup.recoveryWindowTitle": "dani-dex-herstel",
  "startup.recoveryTitle": "dani-dex is niet geopend",
  "startup.recoveryBody": {
    one: "dani-dex {version} stopte voordat het openging, {count} keer achter elkaar. Je lokale gegevens zijn niet gewist of overschreven.",
    other:
      "dani-dex {version} stopte voordat het openging, {count} keer achter elkaar. Je lokale gegevens zijn niet gewist of overschreven.",
  },
  "startup.recoveryHint":
    "Probeer het opnieuw, of installeer de laatste versie die wel opende. Exporteer voor hulp de diagnose en stuur het bestand mee met je melding.",
  "startup.recoveryHintLatest":
    "dani-dex vond geen eerdere versie die je gegevens kan openen. Probeer het opnieuw, of installeer de nieuwste versie. Exporteer voor hulp de diagnose en stuur het bestand mee met je melding.",
  "startup.recoveryRetry": "Opnieuw",
  "startup.recoveryPreviousVersion": "Vorige versie downloaden",
  "startup.recoveryLatestVersion": "Nieuwste versie downloaden",
  "startup.recoveryExportDiagnostics": "Diagnose exporteren",
  "startup.recoveryOpenDataFolder": "Gegevensmap openen",
  "startup.recoveryQuit": "Stoppen",
  "startup.recoveryDiagnosticsSaved": "Het diagnosebestand is opgeslagen.",
  "startup.recoveryActionFailed": "dani-dex kon deze actie niet uitvoeren.",
} as const satisfies PartialTranslation<typeof source>;
