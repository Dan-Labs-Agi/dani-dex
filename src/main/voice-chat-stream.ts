export const OPENCODE_ZEN_URL = "https://opencode.ai/zen/v1/chat/completions";
export const KILO_GATEWAY_URL = "https://ai-gateway.kilo.ai/api/v1/chat/completions";

export type ChatFetch = (input: string, init: RequestInit) => Promise<Response>;

export interface ChatStreamRequest {
  url: string;
  /** Bearer token. The free OpenCode Zen tier accepts "public". */
  key: string;
  model: string;
  system: string;
  user: string;
  signal: AbortSignal;
}

/** Pulls the text out of one server-sent-event line, or returns null when it has none. */
export function deltaFromLine(line: string): string | null {
  if (!line.startsWith("data:")) return null;
  const payload = line.slice(5).trim();
  if (!payload || payload === "[DONE]") return null;
  try {
    const parsed = JSON.parse(payload);
    const content = parsed?.choices?.[0]?.delta?.content;
    return typeof content === "string" && content ? content : null;
  } catch {
    return null;
  }
}

/** Streams reply text from an OpenAI-compatible chat endpoint (OpenCode Zen or the Kilo gateway). */
export async function* streamChat(fetcher: ChatFetch, request: ChatStreamRequest): AsyncGenerator<string> {
  const response = await fetcher(request.url, {
    method: "POST",
    signal: request.signal,
    headers: { Authorization: `Bearer ${request.key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: request.model,
      stream: true,
      messages: [
        { role: "system", content: request.system },
        { role: "user", content: request.user },
      ],
    }),
  });
  if (!response.ok || !response.body) throw new Error(`Chat request failed with status ${response.status}`);
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      let newline = buffer.indexOf("\n");
      while (newline >= 0) {
        const delta = deltaFromLine(buffer.slice(0, newline).trim());
        buffer = buffer.slice(newline + 1);
        if (delta) yield delta;
        newline = buffer.indexOf("\n");
      }
    }
    const last = deltaFromLine(buffer.trim());
    if (last) yield last;
  } finally {
    await reader.cancel().catch(() => undefined);
  }
}
