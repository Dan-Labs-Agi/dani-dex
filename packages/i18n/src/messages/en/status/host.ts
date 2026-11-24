import { defineMessages } from "../../../message";

export const messages = defineMessages("status.host", {
  "status.host.registered": "Registered this dani-dex for WebRTC access.",
  "status.host.keyRotated": "Server key changed. Paired devices stay paired.",
  "status.host.identityUpdated": "Server identity updated.",
  "status.host.starting": "Starting the WebRTC host…",
  "status.host.ready": "This dani-dex is ready for WebRTC connections.",
  "status.host.signalLost": "Other devices cannot reach this dani-dex now. It connects again.",
  "status.host.stopping": "Making this dani-dex private…",
  "status.host.private": "This dani-dex is private.",
  "status.host.removed": "This dani-dex was removed from your account. Publish it again to share it.",
});
