export type EnergyEvent = "start" | "end" | null;

export interface EnergyDetectorOptions {
  /** Loudness (RMS, 0 to 1) above which a frame counts as speech. */
  threshold: number;
  /** Frames of speech in a row needed to call it the start of speech. */
  startFrames: number;
  /** Frames of quiet in a row needed to call it the end of speech. */
  endFrames: number;
}

export const DEFAULT_ENERGY_OPTIONS: EnergyDetectorOptions = { threshold: 0.02, startFrames: 3, endFrames: 25 };

export function frameLoudness(samples: Float32Array): number {
  if (samples.length === 0) return 0;
  let sum = 0;
  for (const sample of samples) sum += sample * sample;
  return Math.sqrt(sum / samples.length);
}

/** Turns a stream of audio frames into speech start and end events. */
export class EnergyDetector {
  #speaking = false;
  #loud = 0;
  #quiet = 0;

  constructor(private readonly options: EnergyDetectorOptions = DEFAULT_ENERGY_OPTIONS) {}

  get speaking(): boolean {
    return this.#speaking;
  }

  push(samples: Float32Array): EnergyEvent {
    if (frameLoudness(samples) >= this.options.threshold) {
      this.#loud += 1;
      this.#quiet = 0;
      if (!this.#speaking && this.#loud >= this.options.startFrames) {
        this.#speaking = true;
        return "start";
      }
      return null;
    }
    this.#quiet += 1;
    this.#loud = 0;
    if (this.#speaking && this.#quiet >= this.options.endFrames) {
      this.#speaking = false;
      return "end";
    }
    return null;
  }
}
