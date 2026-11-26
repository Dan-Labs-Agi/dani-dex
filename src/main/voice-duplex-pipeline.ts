export type DuplexState = "listening" | "hearing" | "thinking" | "speaking";

export interface DuplexDeps {
  /** Turns one finished utterance of audio into text. */
  transcribe: (audio: Uint8Array, signal: AbortSignal) => Promise<string>;
  /** Streams reply text pieces from the language model (the OpenCode or KiloCode proxy). */
  reply: (text: string, signal: AbortSignal) => AsyncIterable<string>;
  /** Turns one sentence into audio and hands it to the speaker. */
  speak: (sentence: string, signal: AbortSignal) => Promise<void>;
  onState?: (state: DuplexState) => void;
  onTranscript?: (text: string) => void;
}

const SENTENCE_END = /[.!?](?:\s|$)/u;

/**
 * Full-duplex turn loop: the user can speak while the reply is still being
 * generated or spoken, and that speech cancels the reply at once (barge-in).
 */
export class DuplexPipeline {
  #state: DuplexState = "listening";
  #turn: AbortController | null = null;
  #heard: Uint8Array[] = [];
  #running: Promise<void> = Promise.resolve();

  constructor(private readonly deps: DuplexDeps) {}

  get state(): DuplexState {
    return this.#state;
  }

  /** The voice detector saw speech start. Cancels any reply in progress. */
  speechStarted(): void {
    this.#turn?.abort();
    this.#turn = null;
    this.#heard = [];
    this.#set("hearing");
  }

  /** Audio captured while the user is speaking. */
  audio(chunk: Uint8Array): void {
    if (this.#state === "hearing") this.#heard.push(chunk);
  }

  /** The voice detector saw speech end. Starts the reply. */
  speechEnded(): Promise<void> {
    if (this.#state !== "hearing") return this.#running;
    const audio = concat(this.#heard);
    this.#heard = [];
    const turn = new AbortController();
    this.#turn = turn;
    this.#set("thinking");
    this.#running = this.#run(audio, turn);
    return this.#running;
  }

  async #run(audio: Uint8Array, turn: AbortController): Promise<void> {
    const { signal } = turn;
    try {
      const text = (await this.deps.transcribe(audio, signal)).trim();
      if (signal.aborted) return;
      if (!text) return this.#idle(turn);
      this.deps.onTranscript?.(text);
      let pending = "";
      for await (const piece of this.deps.reply(text, signal)) {
        if (signal.aborted) return;
        pending += piece;
        let cut = pending.search(SENTENCE_END);
        while (cut >= 0) {
          const sentence = pending.slice(0, cut + 1).trim();
          pending = pending.slice(cut + 1);
          if (sentence) await this.#say(sentence, turn);
          if (signal.aborted) return;
          cut = pending.search(SENTENCE_END);
        }
      }
      if (!signal.aborted && pending.trim()) await this.#say(pending.trim(), turn);
      this.#idle(turn);
    } catch (error) {
      if (signal.aborted) return;
      this.#idle(turn);
      throw error;
    }
  }

  async #say(sentence: string, turn: AbortController): Promise<void> {
    if (turn.signal.aborted) return;
    this.#set("speaking");
    await this.deps.speak(sentence, turn.signal);
  }

  #idle(turn: AbortController): void {
    if (this.#turn === turn) {
      this.#turn = null;
      this.#set("listening");
    }
  }

  #set(state: DuplexState): void {
    if (this.#state === state) return;
    this.#state = state;
    this.deps.onState?.(state);
  }
}

function concat(parts: readonly Uint8Array[]): Uint8Array {
  const out = new Uint8Array(parts.reduce((sum, part) => sum + part.length, 0));
  let at = 0;
  for (const part of parts) {
    out.set(part, at);
    at += part.length;
  }
  return out;
}
