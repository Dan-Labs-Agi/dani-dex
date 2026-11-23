import type { PartialTranslation } from "../../../message";
import type { messages as source } from "../../en/status/host";

export const messages = {
  "status.host.registered": "Cet Dani Dex est enregistré pour l’accès WebRTC.",
  "status.host.keyRotated": "Clé du serveur changée. Les appareils associés restent associés.",
  "status.host.identityUpdated": "Identité du serveur mise à jour.",
  "status.host.starting": "Démarrage de l’hôte WebRTC…",
  "status.host.ready": "Cet Dani Dex est prêt pour les connexions WebRTC.",
  "status.host.signalLost": "Les autres appareils ne peuvent pas joindre cet Dani Dex pour le moment. Il se reconnecte.",
  "status.host.stopping": "Passage de cet Dani Dex en mode privé…",
  "status.host.private": "Cet Dani Dex est privé.",
  "status.host.removed": "Cet Dani Dex a été retiré de votre compte. Publiez-le à nouveau pour le partager.",
} as const satisfies PartialTranslation<typeof source>;
