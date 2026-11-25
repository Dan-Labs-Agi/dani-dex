import { defineMessages } from "../../../message";

export const messages = defineMessages("status.messaging", {
  "status.messaging.working": "Working on it…",
  "status.messaging.queued": "Waiting for an earlier request to finish. The answer comes here.",
  "status.messaging.busy": "Too many requests are waiting. Try again later.",
  "status.messaging.failed": "Dani Dex could not finish this request. The Dani Dex host has the details.",
  "status.messaging.noAnswer": "Dani Dex finished without a written answer.",
  "status.messaging.noAgent": "No agent can answer here yet. Add the Slack Orchestrator in Dani Dex.",
  "status.messaging.delegated": "A teammate is working on it. The answer comes here.",
  "status.messaging.stopped": "Stopped.",
  "status.messaging.stop": "Stop",
  "status.messaging.approvalTitle": "Dani Dex asks for approval to continue.",
  "status.messaging.approvalTitleTeammate": "Teammate {agent} asks for approval to continue.",
  "status.messaging.approvalCommand": "Run a command",
  "status.messaging.approvalFileChange": "Change files",
  "status.messaging.approvalPermissions": "Get more permissions",
  "status.messaging.approve": "Approve",
  "status.messaging.deny": "Deny",
  "status.messaging.approvedBy": "Approved by {user}.",
  "status.messaging.deniedBy": "Denied by {user}.",
  "status.messaging.answeredOnHost": "Answered on the Dani Dex host.",
  "status.messaging.requestInactive": "This request is no longer active.",
  "status.messaging.onlyRequester": "Only {user} can do this. The Dani Dex host can also answer.",
  "status.messaging.hostOnly": "Only the Dani Dex host can answer this request.",
  "status.messaging.filesSkipped": "Some files were not sent: {names}.",
  "status.messaging.orchestratorName": "Slack Orchestrator",
  "status.messaging.orchestratorTitle": "Answers in Slack and asks the team",
  "status.messaging.discordNoAgent": "No agent can answer here yet. Add the Discord Orchestrator in Dani Dex.",
  "status.messaging.discordOrchestratorName": "Discord Orchestrator",
  "status.messaging.discordOrchestratorTitle": "Answers in Discord and asks the team",
  "status.messaging.integrationsSection": "Integrations",
  "status.messaging.signInReceived": "Dani Dex received the Slack install. You can close this tab.",
  "status.messaging.signInUnknown": "Dani Dex did not start this Slack install. Start it again in Dani Dex.",
  "status.messaging.telegramNoAgent":
    "No agent can answer here yet. In Dani Dex, open Marketplace > Apps > Telegram and click Add agent.",
  "status.messaging.telegramLinked":
    "Dani Dex is connected to this chat. Mention {bot} or reply to a message of Dani Dex to ask the agents.",
  "status.messaging.telegramNotLinked":
    "Dani Dex is not connected to this chat. To connect it, open the Dani Dex app, go to Marketplace → Apps → Telegram, and select Add to a group or Open a direct chat.",
  "status.messaging.telegramOrchestratorName": "Telegram Orchestrator",
  "status.messaging.telegramOrchestratorTitle": "Answers in Telegram and asks the team",
  "status.messaging.whatsappNoAgent": "No agent can answer here yet. Add the WhatsApp Orchestrator in Dani Dex.",
  "status.messaging.whatsappApprovalMenu": "Reply 1 to approve or 2 to deny.",
  "status.messaging.whatsappStopMenu": "Reply stop to stop.",
  "status.messaging.whatsappPairingCode":
    "This number answers only people that its owner allowed. Give the owner this code: {code}",
  "status.messaging.whatsappPairingApproved": "You can now send requests to this number.",
  "status.messaging.whatsappOwnChat": "Message yourself",
  "status.messaging.whatsappWelcomeOwn":
    "👋 *Dani Dex is connected*\n\nWrite here to ask your agents. The WhatsApp Orchestrator answers, or gives the work to the right agent.\n\nSend *stop* to stop a request.",
  "status.messaging.whatsappWelcomeDedicated":
    "👋 *Dani Dex is connected*\n\nThe people you allow in Dani Dex can now write to this number. A new person gets a code: approve it in Dani Dex under Requests.\n\nSend *stop* to stop a request.",
  "status.messaging.whatsappOtherOpenBot":
    "Another Dani Dex is linked to this WhatsApp number, so you can get two answers. To fix this, open Linked devices in WhatsApp on your phone and log out the Dani Dex that you do not use.",
  "status.messaging.whatsappPaused":
    "Dani Dex stopped answering here for 10 minutes: too many messages came in a short time. If another Dani Dex is linked to this number, open Linked devices in WhatsApp on your phone and log out the Dani Dex that you do not use.",
  "status.messaging.whatsappOrchestratorName": "WhatsApp Orchestrator",
  "status.messaging.whatsappOrchestratorTitle": "Answers in WhatsApp and asks the team",
});
