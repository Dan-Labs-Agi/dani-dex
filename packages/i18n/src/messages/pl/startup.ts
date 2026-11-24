import type { PartialTranslation } from "../../message";
import type { messages as source } from "../en/startup";

export const messages = {
  "startup.failedTitle": "Nie udało się uruchomić dani-dex",
  "startup.failedBody":
    "{message}\n\nTwoje lokalne dane nie zostały zresetowane ani nadpisane. Kroki przywracania znajdziesz w przewodniku rozwiązywania problemów.",
  "startup.archiveChangedTitle": "Pliki dani-dex zostały zmienione",
  "startup.archiveChangedBody":
    "Inny program zmienił plik app.asar dani-dex. dani-dex działa teraz, ale nie uruchomi się po zamknięciu.\n\nAby naprawić dani-dex, zainstaluj go ponownie. Twoje lokalne dane zostaną zachowane.",
  "startup.archiveChangedDownload": "Pobierz dani-dex",
  "startup.filesDamagedBody":
    "Niektóre pliki dani-dex są uszkodzone lub ich brakuje.\n\nAby naprawić dani-dex, zainstaluj go ponownie. Twoje lokalne dane zostaną zachowane.",
  "startup.newerDataUpdatingTitle": "Aktualizowanie dani-dex",
  "startup.newerDataUpdatingBody":
    "Nowsza wersja dani-dex zapisała Twoje dane. dani-dex instaluje najnowszą wersję, a potem uruchomi się ponownie.\n\nTwoje lokalne dane nie zostały zresetowane ani nadpisane.",
  "startup.newerDataTitle": "Zainstaluj najnowszy dani-dex",
  "startup.newerDataBody":
    "Nowsza wersja dani-dex zapisała Twoje dane, a ta wersja ({version}) nie może ich otworzyć. Zainstaluj najnowszą wersję, aby otworzyć swoje dane.\n\nTwoje lokalne dane nie zostały zresetowane ani nadpisane.",
  "startup.newerDataDownload": "Pobierz dani-dex",
  "startup.newerDataGuide": "Otwórz przewodnik",
  "startup.newerDataQuit": "Zakończ",
  "startup.newerDataLoopTitle": "Najnowszy dani-dex się nie otworzył",
  "startup.newerDataLoopBody":
    "Nowsza wersja dani-dex zapisała Twoje dane, a ta wersja ({version}) nie może ich otworzyć. dani-dex {loopVersion} kilka razy z rzędu zatrzymał się przed otwarciem, więc nie zostanie zainstalowany ponownie.\n\nZainstaluj wersję nowszą niż {loopVersion}, gdy będzie dostępna. Aby uzyskać pomoc, otwórz przewodnik.\n\nTwoje lokalne dane nie zostały zresetowane ani nadpisane.",
  "startup.newerDataReleases": "Pokaż wydania",
  "startup.recoveryWindowTitle": "Odzyskiwanie dani-dex",
  "startup.recoveryTitle": "dani-dex się nie otworzył",
  "startup.recoveryBody": {
    one: "dani-dex {version} zatrzymał się przed otwarciem {count} raz z rzędu. Twoje lokalne dane nie zostały zresetowane ani nadpisane.",
    few: "dani-dex {version} zatrzymał się przed otwarciem {count} razy z rzędu. Twoje lokalne dane nie zostały zresetowane ani nadpisane.",
    many: "dani-dex {version} zatrzymał się przed otwarciem {count} razy z rzędu. Twoje lokalne dane nie zostały zresetowane ani nadpisane.",
    other:
      "dani-dex {version} zatrzymał się przed otwarciem {count} razy z rzędu. Twoje lokalne dane nie zostały zresetowane ani nadpisane.",
  },
  "startup.recoveryHint":
    "Spróbuj ponownie albo zainstaluj ostatnią wersję, która się otwierała. Aby uzyskać pomoc, wyeksportuj diagnostykę i wyślij plik ze zgłoszeniem.",
  "startup.recoveryHintLatest":
    "dani-dex nie znalazł wcześniejszej wersji, która może otworzyć Twoje dane. Spróbuj ponownie albo zainstaluj najnowszą wersję. Aby uzyskać pomoc, wyeksportuj diagnostykę i wyślij plik ze zgłoszeniem.",
  "startup.recoveryRetry": "Spróbuj ponownie",
  "startup.recoveryPreviousVersion": "Pobierz poprzednią wersję",
  "startup.recoveryLatestVersion": "Pobierz najnowszą wersję",
  "startup.recoveryExportDiagnostics": "Eksportuj diagnostykę",
  "startup.recoveryOpenDataFolder": "Otwórz folder danych",
  "startup.recoveryQuit": "Zakończ",
  "startup.recoveryDiagnosticsSaved": "Plik diagnostyki został zapisany.",
  "startup.recoveryActionFailed": "dani-dex nie mógł wykonać tej czynności.",
} as const satisfies PartialTranslation<typeof source>;
