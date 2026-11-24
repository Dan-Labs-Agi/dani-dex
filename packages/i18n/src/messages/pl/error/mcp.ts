import type { PartialTranslation } from "../../../message";
import type { messages as source } from "../../en/error/mcp";

export const messages = {
  "error.mcp.redirectByName": "Ten adres nie jest osiągalny po nazwie.",
  "error.mcp.redirectNotSignIn": "Ten adres nie jest częścią logowania.",
  "error.mcp.redirectRefused": "Logowanie zostało odrzucone. Wróć do dani-dex i spróbuj ponownie.",
  "error.mcp.redirectNoSignIn": "To logowanie nie jest już aktywne. Wróć do dani-dex i rozpocznij logowanie ponownie.",
  "error.mcp.redirectSignedIn": "dani-dex jest zalogowany. Możesz zamknąć to okno.",
  "error.mcp.redirectNotSaved": "Logowanie nie zostało zakończone. Wróć do dani-dex, aby zobaczyć powód.",
  "error.mcp.signInFileUnreadable": "Nie można odczytać pliku logowania MCP.",
  "error.mcp.signInFileTooLarge": "Plik logowania MCP jest za duży.",
  "error.mcp.unsupported": "Ten serwer nie obsługuje serwerów MCP.",
  "error.mcp.signInOnHost": "Logowanie do serwera MCP działa tylko w dani-dex na komputerze hosta.",
  "error.mcp.signInPageOnServer":
    "Ta strona logowania otwiera się tylko na serwerze. Poproś właściciela lub administratora serwera o zalogowanie się.",
  "error.mcp.signInPageOnServerSwitch":
    "Ta strona logowania otwiera się tylko na serwerze. Przełącz się na ten serwer, a potem ponownie wybierz Zaloguj się.",
  "error.mcp.signInAppUnsupported": "Ten serwer nie obsługuje aplikacji logowania. Zaktualizuj dani-dex na hoście.",
  "error.mcp.redirectRelayed": "dani-dex wysłał logowanie do serwera. Możesz zamknąć to okno.",
  "error.mcp.relayEnded": "To logowanie się zakończyło. Rozpocznij je ponownie.",
  "error.mcp.signInLinkNotReady": "Strona logowania nie jest jeszcze otwarta. Spróbuj ponownie za chwilę.",
  "error.mcp.relayNoState":
    "Strona logowania serwera nie chroni swojego adresu powrotu, więc dani-dex nie otworzy jej na tym komputerze.",
  "error.mcp.relayAddressInvalid": "To nie jest adres z końca tego logowania. Skopiuj pełny adres z przeglądarki.",
} as const satisfies PartialTranslation<typeof source>;
