import { DuplexPipeline, type DuplexState, EnergyDetector } from "@openbot/contracts/voice-duplex";
import { encodePcmWav } from "../../voice-recording";

export interface FullDuplexPorts {
  /** Turns one spoken utterance (16 kHz mono WAV) into text. */
  transcribe: (wav: Uint8Array) => Promise<string>;
  /** Asks the chat model for a reply. */
  reply: (text: string) => Promise<string>;
  /** Speaks one sentence. Must stop quickly when the signal aborts. */
  speak: (sentence: string, signal: AbortSignal) => Promise<void>;
  onState?: (state: DuplexState) => void;
  onTranscript?: (text: string) => void;
}

const SAMPLE_RATE = 16_000;
/** Quiet frames kept from before speech is detected so the first word is not clipped. */
const PRE_ROLL_FRAMES = 4;

/** Feeds microphone frames into the full-duplex loop. */
export class FullDuplexController {
  readonly #detector = new EnergyDetector();
  readonly #pipeline: DuplexPipeline;
  #preRoll: Float32Array[] = [];
  #utterance: Float32Array[] = [];

  constructor(ports: FullDuplexPorts) {
    this.#pipeline = new DuplexPipeline({
      transcribe: async (audio) => ports.transcribe(audio),
      reply: (text, signal) => replyOnce(ports.reply, text, signal),
      speak: ports.speak,
      ...(ports.onState ? { onState: ports.onState } : {}),
      ...(ports.onTranscript ? { onTranscript: ports.onTranscript } : {}),
    });
  }

  get state(): DuplexState {
    return this.#pipeline.state;
  }

  /** One frame of 16 kHz mono microphone samples. Resolves when a reply finishes. */
  async push(frame: Float32Array): Promise<void> {
    const event = this.#detector.push(frame);
    if (event === "start") {
      this.#utterance = [...this.#preRoll];
      this.#pipeline.speechStarted();
    }
    if (this.#detector.speaking || event === "end") {
      this.#utterance.push(frame);
    } else {
      this.#preRoll.push(frame);
      if (this.#preRoll.length > PRE_ROLL_FRAMES) this.#preRoll.shift();
    }
    if (event === "end") {
      const wav = encodePcmWav(join(this.#utterance), SAMPLE_RATE);
      this.#utterance = [];
      this.#pipeline.audio(wav);
      await this.#pipeline.speechEnded();
    }
  }
}

async function* replyOnce(
  reply: (text: string) => Promise<string>,
  text: string,
  signal: AbortSignal,
): AsyncGenerator<string> {
  const answer = await reply(text);
  if (!signal.aborted) yield answer;
}

function join(frames: readonly Float32Array[]): Float32Array {
  const out = new Float32Array(frames.reduce((sum, frame) => sum + frame.length, 0));
  let at = 0;
  for (const frame of frames) {
    out.set(frame, at);
    at += frame.length;
  }
  return out;
}
