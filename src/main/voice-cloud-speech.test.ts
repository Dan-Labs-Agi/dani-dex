// @vitest-environment node

import { CLOUD_SPEECH_MODELS } from "@openbot/contracts/ipc";
import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { type SpeechFetch, sarvamAudio, speakInCloud, wavPcm } from "./voice-cloud-speech";

const pcm = Buffer.from([1, 2, 3, 4, 5, 6, 7, 8]);

function wav(samples: Buffer): Buffer {
  const header = Buffer.alloc(44);
  header.write("RIFF", 0, "ascii");
  header.write("WAVE", 8, "ascii");
  header.write("fmt ", 12, "ascii");
  header.writeUInt32LE(16, 16);
  header.write("data", 36, "ascii");
  header.writeUInt32LE(samples.length, 40);
  return Buffer.concat([header, samples]);
}

function run(modelId: string, reply: () => Response) {
  const seen: { url: string; init: RequestInit | undefined }[] = [];
  const fetcher: SpeechFetch = async (input, init) => {
    seen.push({ url: String(input), init });
    return reply();
  };
  const model = CLOUD_SPEECH_MODELS.find((entry) => entry.id === modelId);
  if (!model) throw new Error(`no model ${modelId}`);
  const audio = Effect.runPromise(
    speakInCloud(fetcher, {
      model,
      key: "test-key",
      text: "hello",
      language: null,
      elevenLabsVoice: "alice",
      xaiVoice: "eve",
    }),
  );
  return { audio, seen };
}

describe("bring-your-own-key speech providers", () => {
  it("sends Cartesia the key and reads raw audio", async () => {
    const { audio, seen } = run("cartesia-sonic", () => new Response(pcm));
    await audio;
    expect(seen[0]?.url).toBe("https://api.cartesia.ai/tts/bytes");
    expect(JSON.stringify(seen[0]?.init?.headers)).toContain("test-key");
  });
  it("sends Fish Audio a bearer key", async () => {
    const { audio, seen } = run("fish-audio", () => new Response(pcm));
    await audio;
    expect(seen[0]?.url).toBe("https://api.fish.audio/v1/tts");
    expect(JSON.stringify(seen[0]?.init?.headers)).toContain("Bearer test-key");
  });
  it("sends Gradium its key", async () => {
    const { audio, seen } = run("gradium-tts", () => new Response(pcm));
    await audio;
    expect(seen[0]?.url).toBe("https://api.gradium.ai/api/speech/tts");
    expect(JSON.stringify(seen[0]?.init?.headers)).toContain("test-key");
  });
  it("sends Sarvam its subscription key and unwraps the wav", async () => {
    const body = JSON.stringify({ audios: [wav(pcm).toString("base64")] });
    const { audio, seen } = run("sarvam-bulbul", () => new Response(body));
    await audio;
    expect(seen[0]?.url).toBe("https://api.sarvam.ai/text-to-speech");
    expect(JSON.stringify(seen[0]?.init?.headers)).toContain("test-key");
  });
});

describe("wav helpers", () => {
  it("strips the wav header", () => {
    expect(wavPcm(wav(pcm)).equals(pcm)).toBe(true);
  });
  it("passes headerless audio through", () => {
    expect(wavPcm(pcm).equals(pcm)).toBe(true);
  });
  it("reads Sarvam json audio", () => {
    expect(sarvamAudio(Buffer.from(JSON.stringify({ audios: [wav(pcm).toString("base64")] })))?.equals(pcm)).toBe(true);
    expect(sarvamAudio(Buffer.from("nope"))).toBeNull();
  });
});
