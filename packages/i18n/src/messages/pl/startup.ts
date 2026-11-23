import type { PartialTranslation } from "../../message";
import type { messages as source } from "../en/startup";

export const messages = {
  "startup.failedTitle": "Nie udało się uruchomić Dani Dex",
  "startup.failedBody":
    "{message}\n\nTwoje lokalne dane nie zostały zresetowane ani nadpisane. Kroki przywracania znajdziesz w przewodniku rozwiązywania problemów.",
  "startup.archiveChangedTitle": "Pliki Dani Dex zostały zmienione",
  "startup.archiveChangedBody":
    "Inny program zmienił plik app.asar Dani Dex. Dani Dex działa teraz, ale nie uruchomi się po zamknięciu.\n\nAby naprawić Dani Dex, zainstaluj go ponownie. Twoje lokalne dane zostaną zachowane.",
  "startup.archiveChangedDownload": "Pobierz Dani Dex",
  "startup.filesDamagedBody":
    "Niektóre pliki Dani Dex są uszkodzone lub ich brakuje.\n\nAby naprawić Dani Dex, zainstaluj go ponownie. Twoje lokalne dane zostaną zachowane.",
  "startup.newerDataUpdatingTitle": "Aktualizowanie Dani Dex",
  "startup.newerDataUpdatingBody":
    "Nowsza wersja Dani Dex zapisała Twoje dane. Dani Dex instaluje najnowszą wersję, a potem uruchomi się ponownie.\n\nTwoje lokalne dane nie zostały zresetowane ani nadpisane.",
  "startup.newerDataTitle": "Zainstaluj najnowszy Dani Dex",
  "startup.newerDataBody":
    "Nowsza wersja Dani Dex zapisała Twoje dane, a ta wersja ({version}) nie może ich otworzyć. Zainstaluj najnowszą wersję, aby otworzyć swoje dane.\n\nTwoje lokalne dane nie zostały zresetowane ani nadpisane.",
  "startup.newerDataDownload": "Pobierz Dani Dex",
  "startup.newerDataGuide": "Otwórz przewodnik",
  "startup.newerDataQuit": "Zakończ",
  "startup.newerDataLoopTitle": "Najnowszy Dani Dex się nie otworzył",
  "startup.newerDataLoopBody":
    "Nowsza wersja Dani Dex zapisała Twoje dane, a ta wersja ({version}) nie może ich otworzyć. Dani Dex {loopVersion} kilka razy z rzędu zatrzymał się przed otwarciem, więc nie zostanie zainstalowany ponownie.\n\nZainstaluj wersję nowszą niż {loopVersion}, gdy będzie dostępna. Aby uzyskać pomoc, otwórz przewodnik.\n\nTwoje lokalne dane nie zostały zresetowane ani nadpisane.",
  "startup.newerDataReleases": "Pokaż wydania",
  "startup.recoveryWindowTitle": "Odzyskiwanie Dani Dex",
  "startup.recoveryTitle": "Dani Dex się nie otworzył",
  "startup.recoveryBody": {
    one: "Dani Dex {version} zatrzymał się przed otwarciem {count} raz z rzędu. Twoje lokalne dane nie zostały zresetowane ani nadpisane.",
    few: "Dani Dex {version} zatrzymał się przed otwarciem {count} razy z rzędu. Twoje lokalne dane nie zostały zresetowane ani nadpisane.",
    many: "Dani Dex {version} zatrzymał się przed otwarciem {count} razy z rzędu. Twoje lokalne dane nie zostały zresetowane ani nadpisane.",
    other:
      "Dani Dex {version} zatrzymał się przed otwarciem {count} razy z rzędu. Twoje lokalne dane nie zostały zresetowane ani nadpisane.",
  },
  "startup.recoveryHint":
    "Spróbuj ponownie albo zainstaluj ostatnią wersję, która się otwierała. Aby uzyskać pomoc, wyeksportuj diagnostykę i wyślij plik ze zgłoszeniem.",
  "startup.recoveryHintLatest":
    "Dani Dex nie znalazł wcześniejszej wersji, która może otworzyć Twoje dane. Spróbuj ponownie albo zainstaluj najnowszą wersję. Aby uzyskać pomoc, wyeksportuj diagnostykę i wyślij plik ze zgłoszeniem.",
  "startup.recoveryRetry": "Spróbuj ponownie",
  "startup.recoveryPreviousVersion": "Pobierz poprzednią wersję",
  "startup.recoveryLatestVersion": "Pobierz najnowszą wersję",
  "startup.recoveryExportDiagnostics": "Eksportuj diagnostykę",
  "startup.recoveryOpenDataFolder": "Otwórz folder danych",
  "startup.recoveryQuit": "Zakończ",
  "startup.recoveryDiagnosticsSaved": "Plik diagnostyki został zapisany.",
  "startup.recoveryActionFailed": "Dani Dex nie mógł wykonać tej czynności.",
} as const satisfies PartialTranslation<typeof source>;
