import type { PartialTranslation } from "../../../message";
import type { messages as source } from "../../en/status/host";

export const messages = {
  "status.host.registered": "Este Dani Dex foi registrado para acesso por WebRTC.",
  "status.host.keyRotated": "Chave do servidor alterada. Os dispositivos pareados continuam pareados.",
  "status.host.identityUpdated": "Identidade do servidor atualizada.",
  "status.host.starting": "Iniciando o computador anfitrião WebRTC…",
  "status.host.ready": "Este Dani Dex está pronto para conexões WebRTC.",
  "status.host.signalLost":
    "Outros dispositivos não conseguem acessar este Dani Dex agora. Ele está se conectando novamente.",
  "status.host.stopping": "Tornando este Dani Dex privado…",
  "status.host.private": "Este Dani Dex é privado.",
  "status.host.removed": "Este Dani Dex foi removido da sua conta. Publique-o novamente para compartilhá-lo.",
} as const satisfies PartialTranslation<typeof source>;
