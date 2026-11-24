import type { PartialTranslation } from "../../../message";
import type { messages as source } from "../../en/status/host";

export const messages = {
  "status.host.registered": "Questo dani-dex è stato registrato per l'accesso WebRTC.",
  "status.host.keyRotated": "Chiave del server cambiata. I dispositivi associati restano associati.",
  "status.host.identityUpdated": "Identità del server aggiornata.",
  "status.host.starting": "Avvio dell'host WebRTC…",
  "status.host.ready": "Questo dani-dex è pronto per le connessioni WebRTC.",
  "status.host.signalLost": "Gli altri dispositivi non possono raggiungere questo dani-dex ora. Si ricollega.",
  "status.host.stopping": "Questo dani-dex sta diventando privato…",
  "status.host.private": "Questo dani-dex è privato.",
  "status.host.removed": "Questo dani-dex è stato rimosso dal tuo account. Pubblicalo di nuovo per condividerlo.",
} as const satisfies PartialTranslation<typeof source>;
