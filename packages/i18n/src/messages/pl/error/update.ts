import type { PartialTranslation } from "../../../message";
import type { messages as source } from "../../en/error/update";

export const messages = {
  "error.update.unsupported": "Aktualizacje są dostępne w zainstalowanych wersjach desktopowych.",
  "error.update.notReady": "Aktualizacja nie jest gotowa do instalacji.",
  "error.update.restartFailed": "Dani Dex nie mógł uruchomić się ponownie, aby zainstalować aktualizację.",
  "error.update.downloadStalled": "Pobieranie aktualizacji przestało odpowiadać. Spróbuj ponownie.",
  "error.update.installFailed":
    "Nie udało się zainstalować aktualizacji. Zamknij i otwórz ponownie Dani Dex, a potem spróbuj ponownie.",
  "error.update.notInstalled":
    "Ostatnie ponowne uruchomienie nie zainstalowało aktualizacji. Uruchom ponownie, aby spróbować jeszcze raz.",
  "error.update.downloadFailed": "Nie udało się pobrać aktualizacji. Spróbuj ponownie.",
  "error.update.signatureNotConfirmed":
    "Dani Dex nie mógł zweryfikować aktualizacji. Spróbuj ponownie. Jeśli błąd się powtarza, pobierz Dani Dex ze strony openbot.run/download.",
  "error.update.checkFailed": "Nie udało się sprawdzić aktualizacji. Spróbuj ponownie.",
  "error.update.checkStalled": "Sprawdzanie aktualizacji przestało odpowiadać. Spróbuj ponownie.",
  "error.update.checkOffline":
    "Nie udało się połączyć z usługą aktualizacji. Sprawdź połączenie z internetem i spróbuj ponownie.",
  "error.update.checkUnavailable":
    "Usługa aktualizacji nie odpowiedziała. Dani Dex sam spróbuje ponownie za kilka minut.",
  "error.update.checkNoRelease":
    "Nie znaleziono opublikowanej aktualizacji dla tej platformy. Dani Dex sam spróbuje ponownie za kilka minut.",
  "error.update.managedByNix": "Aktualizacje tej kopii Dani Dex instaluje Nix. Zaktualizuj ją przez Nix.",
  "error.update.managedByHost":
    "Aktualizacje na tym Macu instaluje host. Aktualizacja pozostaje gotowa do czasu konserwacji hosta.",
  "error.update.siblingSession":
    "Inna sesja Dani Dex nadal działa z tej aplikacji. Najpierw zatrzymaj Dani Dex na każdym innym koncie użytkownika macOS, a potem ponownie zainstaluj aktualizację.",
  "error.update.siblingSessionSameAccount":
    "Inny proces Dani Dex nadal działa na tym koncie użytkownika. Zamknij go, a potem ponownie zainstaluj aktualizację.",
  "error.update.siblingCheckFailed":
    "Nie udało się sprawdzić innych sesji Dani Dex. Spróbuj ponownie przed instalacją.",
  "error.update.readOnlyLocation":
    "Dani Dex nie może instalować aktualizacji z tej lokalizacji. Zamknij Dani Dex. W Finderze przeciągnij Dani Dex do folderu Aplikacje (jeśli już tam jest, przeciągnij go na zewnątrz i z powrotem). Następnie otwórz Dani Dex i zainstaluj aktualizację ponownie.",
  "error.update.appImageMissing":
    "Dani Dex nie może zainstalować aktualizacji, ponieważ jego plik AppImage został przeniesiony, zmieniono jego nazwę lub go zastąpiono. Zamknij Dani Dex, a następnie ponownie otwórz plik AppImage.",
  "error.update.appImageReadOnly":
    "Dani Dex nie może instalować aktualizacji w folderze swojego pliku AppImage. Zamknij Dani Dex, przenieś plik AppImage do folderu w swoim folderze domowym, a następnie otwórz go i ponownie zainstaluj aktualizację.",
  "error.update.remoteDisabled": "Aktualizacje od administratorów serwera są wyłączone na tym komputerze.",
  "error.update.restartStarted": "Dani Dex już uruchamia się ponownie, aby zainstalować aktualizację.",
  "error.update.alreadyRestarting": "Dani Dex już uruchamia się ponownie.",
} as const satisfies PartialTranslation<typeof source>;
