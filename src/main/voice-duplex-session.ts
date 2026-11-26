import { DuplexPipeline, type DuplexState } from "@openbot/contracts/voice-duplex";
import { type ChatFetch, type ChatStreamRequest, streamChat } from "./voice-chat-stream";

export interface DuplexSessionOptions {
  fetcher: ChatFetch;
  chat: Pick<ChatStreamRequest, "url" | "key" | "model" | "system">;
  transcribe: (audio: Uint8Array, signal: AbortSignal) => Promise<string>;
  /** Makes audio for one sentence and plays it. Must stop when the signal aborts. */
  speak: (sentence: string, signal: AbortSignal) => Promise<void>;
  onState?: (state: DuplexState) => void;
  onTranscript?: (text: string) => void;
}

/** Joins speech to text, the streamed chat reply and speech output into one barge-in loop. */
export function createDuplexSession(options: DuplexSessionOptions): DuplexPipeline {
  return new DuplexPipeline({
    transcribe: options.transcribe,
    reply: (text, signal) => streamChat(options.fetcher, { ...options.chat, user: text, signal }),
    speak: options.speak,
    ...(options.onState ? { onState: options.onState } : {}),
    ...(options.onTranscript ? { onTranscript: options.onTranscript } : {}),
  });
}
