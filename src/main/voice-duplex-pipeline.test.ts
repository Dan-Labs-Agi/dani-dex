// @vitest-environment node

import { describe, expect, it } from "vitest";
import { DuplexPipeline, type DuplexState } from "./voice-duplex-pipeline";

async function* pieces(parts: string[], signal: AbortSignal, gate?: Promise<void>) {
  for (const part of parts) {
    if (gate) await gate;
    if (signal.aborted) return;
    yield part;
  }
}

function setup(parts: string[], gate?: Promise<void>) {
  const spoken: string[] = [];
  const states: DuplexState[] = [];
  const seen: string[] = [];
  const pipeline = new DuplexPipeline({
    transcribe: async () => "hello there",
    reply: (text, signal) => {
      seen.push(text);
      return pieces(parts, signal, gate);
    },
    speak: async (sentence, signal) => {
      if (!signal.aborted) spoken.push(sentence);
    },
    onState: (state) => states.push(state),
  });
  return { pipeline, spoken, states, seen };
}

describe("full-duplex voice pipeline", () => {
  it("runs speech to text to model to speech, one sentence at a time", async () => {
    const { pipeline, spoken, states, seen } = setup(["Hi the", "re. How are", " you? Fine"]);
    pipeline.speechStarted();
    pipeline.audio(new Uint8Array([1, 2]));
    await pipeline.speechEnded();
    expect(seen).toEqual(["hello there"]);
    expect(spoken).toEqual(["Hi there.", "How are you?", "Fine"]);
    expect(states).toEqual(["hearing", "thinking", "speaking", "listening"]);
    expect(pipeline.state).toBe("listening");
  });

  it("cancels the reply the moment the user speaks again", async () => {
    let open: () => void = () => {};
    const gate = new Promise<void>((resolve) => {
      open = resolve;
    });
    const { pipeline, spoken } = setup(["One. ", "Two. ", "Three."], gate);
    pipeline.speechStarted();
    const done = pipeline.speechEnded();
    await Promise.resolve();
    expect(pipeline.state).toBe("thinking");
    pipeline.speechStarted();
    expect(pipeline.state).toBe("hearing");
    open();
    await done;
    expect(spoken).toEqual([]);
    expect(pipeline.state).toBe("hearing");
  });

  it("stops speaking mid-reply on barge-in", async () => {
    const spoken: string[] = [];
    const pipeline: DuplexPipeline = new DuplexPipeline({
      transcribe: async () => "go",
      reply: (_text, signal) => pieces(["A. ", "B. ", "C."], signal),
      speak: async (sentence) => {
        spoken.push(sentence);
        if (sentence === "A.") pipeline.speechStarted();
      },
    });
    pipeline.speechStarted();
    await pipeline.speechEnded();
    expect(spoken).toEqual(["A."]);
    expect(pipeline.state).toBe("hearing");
  });

  it("returns to listening when nothing was said", async () => {
    const pipeline = new DuplexPipeline({
      transcribe: async () => "  ",
      reply: (_text, signal) => pieces(["x"], signal),
      speak: async () => {},
    });
    pipeline.speechStarted();
    await pipeline.speechEnded();
    expect(pipeline.state).toBe("listening");
  });
});
