import type { PartialTranslation } from "../../../message";
import type { messages as source } from "../../en/status/host";

export const messages = {
  "status.host.registered": "Zarejestrowano ten dani-dex do dostępu przez WebRTC.",
  "status.host.keyRotated": "Zmieniono klucz serwera. Sparowane urządzenia pozostają sparowane.",
  "status.host.identityUpdated": "Zaktualizowano tożsamość serwera.",
  "status.host.starting": "Uruchamianie hosta WebRTC…",
  "status.host.ready": "Ten dani-dex jest gotowy na połączenia WebRTC.",
  "status.host.signalLost": "Inne urządzenia nie mogą teraz połączyć się z tym OpenBotem. Łączy się ponownie.",
  "status.host.stopping": "Ustawianie tego serwera dani-dex jako prywatnego…",
  "status.host.private": "Ten dani-dex jest prywatny.",
  "status.host.removed": "Ten dani-dex został usunięty z Twojego konta. Opublikuj go ponownie, aby go udostępnić.",
} as const satisfies PartialTranslation<typeof source>;
