import type { AcpFlavor } from "./acp-flavor";

const KILOCODE_PROMPT_MEDIA_BASE64_BYTES = 8 * 1024 * 1024;

// The Kilo Code CLI (`kilo acp`) is an OpenCode fork, so its ACP protocol behavior matches the
// OpenCode flags below. Kilo-specific error text stays generic until a failure shape is observed.
export const KILOCODE_ACP_FLAVOR: AcpFlavor = {
  keepModelsOnRefreshFailure: true,
  streamAnswerBeforePromptReturns: true,
  thoughtsInsideAnswer: true,
  contextCompaction: "handoff",
  reopenKeepsPrompts: true,
  messagePerId: true,
  mcpServersPerDirectory: true,
  mcpConnectLimitMs: 30_000,
  relayStdioMcpServers: true,
  childSessionUpdates: true,
  promptMediaBase64Bytes: KILOCODE_PROMPT_MEDIA_BASE64_BYTES,
};
