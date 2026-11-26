// @vitest-environment node

import { CLOUD_SPEECH_MODELS, type RestVoiceModelId } from "@openbot/contracts/ipc";
import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { OPENCODE_ZEN_URL } from "./voice-chat-stream";
import { transcribeAtRestProvider } from "./voice-cloud-dictation";
import { speakInCloud } from "./voice-cloud-speech";
import { createDuplexSession } from "./voice-duplex-session";

const sse = (text: string) =>
  `data: ${JSON.stringify({ choices: [{ delta: { content: text } }] })}\n\ndata: [DONE]\n\n`;

const PROVIDERS: ReadonlyArray<{ name: string; stt: RestVoiceModelId; tts: string; sttUrl: string; ttsUrl: string }> = [
  {
    name: "Cartesia",
    stt: "cartesia-ink-whisper",
    tts: "cartesia-sonic",
    sttUrl: "https://api.cartesia.ai/stt",
    ttsUrl: "https://api.cartesia.ai/tts/bytes",
  },
  {
    name: "Fish Audio",
    stt: "fish-transcribe",
    tts: "fish-audio",
    sttUrl: "https://api.fish.audio/v1/asr",
    ttsUrl: "https://api.fish.audio/v1/tts",
  },
  {
    name: "Gradium",
    stt: "gradium-stt",
    tts: "gradium-tts",
    sttUrl: "https://api.gradium.ai/api/speech/asr",
    ttsUrl: "https://api.gradium.ai/api/speech/tts",
  },
];

describe("full-duplex voice with cloud providers", () => {
  for (const provider of PROVIDERS) {
    it(`hears with ${provider.name} speech to text and answers with ${provider.name} text to speech`, async () => {
      const urls: string[] = [];
      const heard: string[] = [];
      const spoken: Uint8Array[] = [];
      const model = CLOUD_SPEECH_MODELS.find((entry) => entry.id === provider.tts);
      if (!model) throw new Error(`no model ${provider.tts}`);
      const transcript =
        provider.name === "Gradium" ? '{"type":"text","text":"what time is it"}\n' : '{"text":"what time is it"}';
      const fetcher = async (input: string | URL | Request): Promise<Response> => {
        urls.push(String(input));
        if (String(input).startsWith(provider.sttUrl)) return new Response(transcript);
        if (String(input).startsWith(provider.ttsUrl)) return new Response(Buffer.from([1, 2, 3, 4]));
        return new Response(sse("It is noon."));
      };
      const session = createDuplexSession({
        fetcher: async (input) => fetcher(input),
        chat: { url: OPENCODE_ZEN_URL, key: "public", model: "free", system: "Be brief." },
        transcribe: async (audio) =>
          (
            await Effect.runPromise(
              transcribeAtRestProvider(fetcher, { modelId: provider.stt, key: "k", wav: audio, language: "en" }),
            )
          ).text,
        speak: async (sentence) => {
          const audio = await Effect.runPromise(
            speakInCloud(fetcher, {
              model,
              key: "k",
              text: sentence,
              language: null,
              elevenLabsVoice: "alice",
              xaiVoice: "eve",
            }),
          );
          spoken.push(audio.pcm);
        },
        onTranscript: (text) => heard.push(text),
      });
      session.speechStarted();
      session.audio(new Uint8Array([1, 2]));
      await session.speechEnded();
      expect(heard).toEqual(["what time is it"]);
      expect(spoken.length).toBe(1);
      expect(urls.some((url) => url.startsWith(provider.sttUrl))).toBe(true);
      expect(urls.some((url) => url.startsWith(provider.ttsUrl))).toBe(true);
    });
  }
});
