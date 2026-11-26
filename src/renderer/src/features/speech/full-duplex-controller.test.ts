// @vitest-environment node

import { describe, expect, it } from "vitest";
import { FullDuplexController } from "./full-duplex-controller";

const loud = new Float32Array(160).fill(0.2);
const quiet = new Float32Array(160).fill(0.001);

async function speak(controller: FullDuplexController) {
  for (let index = 0; index < 5; index += 1) await controller.push(loud);
  for (let index = 0; index < 24; index += 1) await controller.push(quiet);
  await controller.push(quiet);
}

describe("full-duplex controller", () => {
  it("hears an utterance, asks the model and speaks the reply", async () => {
    const wavs: Uint8Array[] = [];
    const spoken: string[] = [];
    const asked: string[] = [];
    const controller = new FullDuplexController({
      transcribe: async (wav) => {
        wavs.push(wav);
        return "hello there";
      },
      reply: async (text) => {
        asked.push(text);
        return "Hi. Nice to meet you.";
      },
      speak: async (sentence) => {
        spoken.push(sentence);
      },
    });
    await speak(controller);
    expect(asked).toEqual(["hello there"]);
    expect(spoken).toEqual(["Hi.", "Nice to meet you."]);
    const wav = wavs[0];
    expect(wav && new TextDecoder().decode(wav.subarray(0, 4))).toBe("RIFF");
    expect(controller.state).toBe("listening");
  });

  it("stops the reply when the user speaks again", async () => {
    const spoken: string[] = [];
    const controller: FullDuplexController = new FullDuplexController({
      transcribe: async () => "go",
      reply: async () => "One. Two. Three.",
      speak: async (sentence) => {
        spoken.push(sentence);
        if (sentence === "One.") for (let index = 0; index < 3; index += 1) void controller.push(loud);
      },
    });
    await speak(controller);
    expect(spoken).toEqual(["One."]);
    expect(controller.state).toBe("hearing");
  });
});
