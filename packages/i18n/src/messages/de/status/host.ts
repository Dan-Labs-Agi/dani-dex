import type { PartialTranslation } from "../../../message";
import type { messages as source } from "../../en/status/host";

export const messages = {
  "status.host.registered": "Dieser dani-dex wurde für den WebRTC-Zugriff registriert.",
  "status.host.keyRotated": "Serverschlüssel geändert. Gekoppelte Geräte bleiben gekoppelt.",
  "status.host.identityUpdated": "Serveridentität aktualisiert.",
  "status.host.starting": "WebRTC-Host wird gestartet…",
  "status.host.ready": "Dieser dani-dex ist für WebRTC-Verbindungen bereit.",
  "status.host.signalLost": "Andere Geräte erreichen diesen dani-dex gerade nicht. Er verbindet sich erneut.",
  "status.host.stopping": "Dieser dani-dex wird auf privat gesetzt…",
  "status.host.private": "Dieser dani-dex ist privat.",
  "status.host.removed":
    "Dieser dani-dex wurde aus deinem Konto entfernt. Veröffentliche ihn erneut, um ihn zu teilen.",
} as const satisfies PartialTranslation<typeof source>;
