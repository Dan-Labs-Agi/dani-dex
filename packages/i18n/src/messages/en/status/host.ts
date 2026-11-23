import { defineMessages } from "../../../message";

export const messages = defineMessages("status.host", {
  "status.host.registered": "Registered this Dani Dex for WebRTC access.",
  "status.host.keyRotated": "Server key changed. Paired devices stay paired.",
  "status.host.identityUpdated": "Server identity updated.",
  "status.host.starting": "Starting the WebRTC host…",
  "status.host.ready": "This Dani Dex is ready for WebRTC connections.",
  "status.host.signalLost": "Other devices cannot reach this Dani Dex now. It connects again.",
  "status.host.stopping": "Making this Dani Dex private…",
  "status.host.private": "This Dani Dex is private.",
  "status.host.removed": "This Dani Dex was removed from your account. Publish it again to share it.",
});
