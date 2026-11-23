import type { PartialTranslation } from "../../../message";
import type { messages as source } from "../../en/status/host";

export const messages = {
  "status.host.registered": "Questo Dani Dex è stato registrato per l'accesso WebRTC.",
  "status.host.keyRotated": "Chiave del server cambiata. I dispositivi associati restano associati.",
  "status.host.identityUpdated": "Identità del server aggiornata.",
  "status.host.starting": "Avvio dell'host WebRTC…",
  "status.host.ready": "Questo Dani Dex è pronto per le connessioni WebRTC.",
  "status.host.signalLost": "Gli altri dispositivi non possono raggiungere questo Dani Dex ora. Si ricollega.",
  "status.host.stopping": "Questo Dani Dex sta diventando privato…",
  "status.host.private": "Questo Dani Dex è privato.",
  "status.host.removed": "Questo Dani Dex è stato rimosso dal tuo account. Pubblicalo di nuovo per condividerlo.",
} as const satisfies PartialTranslation<typeof source>;
