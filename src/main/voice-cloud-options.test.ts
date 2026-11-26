// @vitest-environment node

import { cloudSpeechModel } from "@openbot/contracts/ipc";
import {
  CLOUD_VOICE_CATALOG,
  DEFAULT_CLOUD_VOICE,
  gradiumPaddingBonus,
  normalizeCloudVoice,
} from "@openbot/contracts/voice-providers";
import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { speakInCloud } from "./voice-cloud-speech";

function capture() {
  interface Sent {
    url: string;
    headers: Record<string, string>;
    body: {
      model_id?: string;
      voice_id?: string;
      generation_config?: object;
      prosody?: object;
      reference_id?: string;
      json_config?: object;
    };
  }
  const calls: Sent[] = [];
  const fetcher = async (input: string | URL | Request, init?: RequestInit) => {
    calls.push({
      url: String(input),
      // biome-ignore lint/nursery/noUnsafeTypeAssertion: the code under test always passes a plain header object
      headers: init?.headers as Record<string, string>,
      body: JSON.parse(String(init?.body)),
    });
    return new Response(new Uint8Array(8), { status: 200, headers: { "content-type": "audio/pcm" } });
  };
  return { calls, fetcher };
}

describe("cloud voice options", () => {
  it("falls back to defaults for unknown values", () => {
    const options = normalizeCloudVoice({ cartesia: { model: "nope", voice: "bad id!", speed: 9 }, fish: 4 });
    expect(options).toEqual(DEFAULT_CLOUD_VOICE);
    expect(normalizeCloudVoice(undefined)).toEqual(DEFAULT_CLOUD_VOICE);
  });

  it("keeps valid choices", () => {
    const options = normalizeCloudVoice({ fish: { model: "s2.1-pro-free", voice: "abc123", speed: 1.5 } });
    expect(options.fish).toEqual({ model: "s2.1-pro-free", voice: "abc123", speed: 1.5 });
  });

  it("tags only the documented free model as free", () => {
    const free = Object.values(CLOUD_VOICE_CATALOG).flatMap((entry) => entry.models.filter((model) => model.free));
    expect(free.map((model) => model.id)).toEqual(["s2.1-pro-free"]);
  });

  it("maps speed to the Gradium padding bonus", () => {
    expect(gradiumPaddingBonus(1)).toBe(0);
    expect(gradiumPaddingBonus(1.5)).toBe(-2);
    expect(gradiumPaddingBonus(0.75)).toBe(1);
  });

  it("sends the chosen model, voice and speed to each provider", async () => {
    const options = normalizeCloudVoice({
      cartesia: { model: "sonic-3.6", voice: "voice-1", speed: 1.2 },
      fish: { model: "s2.1-pro-free", voice: "ref1", speed: 0.75 },
      gradium: { model: "default", voice: "So1JQqkLvBzUhTIP", speed: 1.5 },
    });
    const sent = capture();
    for (const id of ["cartesia-sonic", "fish-audio", "gradium-tts"] as const) {
      const model = cloudSpeechModel(id);
      if (!model) throw new Error("missing model");
      await Effect.runPromise(
        speakInCloud(sent.fetcher, {
          model,
          key: "k",
          text: "hi",
          language: null,
          elevenLabsVoice: "alice",
          xaiVoice: "eve",
          cloudVoice: options,
        }),
      );
    }
    const [cartesia, fish, gradium] = sent.calls;
    expect(cartesia?.body).toMatchObject({ model_id: "sonic-3.6", generation_config: { speed: 1.2 } });
    expect(cartesia?.headers["Cartesia-Version"]).toBe("2026-08-14");
    expect(fish?.headers.model).toBe("s2.1-pro-free");
    expect(fish?.body).toMatchObject({ reference_id: "ref1", prosody: { speed: 0.75 } });
    expect(gradium?.url).toBe("https://api.gradium.ai/api/speech/tts");
    expect(gradium?.body).toMatchObject({ voice_id: "So1JQqkLvBzUhTIP", json_config: { padding_bonus: -2 } });
  });
});
