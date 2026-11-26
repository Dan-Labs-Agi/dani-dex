import {
  type DictationKeyProvider,
  type RestVoiceModelId,
  VOICE_KEY_PROVIDER_NAMES,
  type VoiceTranscriptionResult,
} from "@openbot/contracts/ipc";
import { sourceText } from "@openbot/i18n/source";
import { Effect, Option, Schema } from "effect";
import { VoiceOperationError } from "./voice-model-service";

type RestDictationProvider = Extract<DictationKeyProvider, "cartesia" | "fish" | "gradium">;
export type DictationFetch = (input: string | URL | Request, init?: RequestInit) => Promise<Response>;

const TIMEOUT_MS = 120_000;
const GRADIUM_LANGUAGES: ReadonlySet<string> = new Set(["en", "fr", "de", "es", "pt"]);

const REST_DICTATION_MODELS = {
  "cartesia-ink-whisper": { provider: "cartesia", model: "ink-whisper" },
  "fish-transcribe-pro": { provider: "fish", model: "transcribe-1-pro" },
  "fish-transcribe": { provider: "fish", model: "transcribe-1" },
  "gradium-stt": { provider: "gradium", model: "default" },
} as const satisfies Record<RestVoiceModelId, { provider: RestDictationProvider; model: string }>;

const decodeText = Schema.decodeUnknownOption(Schema.fromJsonString(Schema.Struct({ text: Schema.String })));
const decodeGradiumLine = Schema.decodeUnknownOption(
  Schema.fromJsonString(Schema.Struct({ type: Schema.String, text: Schema.optionalKey(Schema.String) })),
);

type DictationErrorKey =
  | "error.voice.cloud.keyRejected"
  | "error.voice.cloud.rateLimited"
  | "error.voice.speech.providerUnreachable";

function fail(provider: RestDictationProvider, key: DictationErrorKey): VoiceOperationError {
  return new VoiceOperationError({
    cause: new Error(sourceText(key, { provider: VOICE_KEY_PROVIDER_NAMES[provider] })),
  });
}

function refusal(provider: RestDictationProvider, status: number): VoiceOperationError {
  if (status === 401 || status === 403) return fail(provider, "error.voice.cloud.keyRejected");
  if (status === 429) return fail(provider, "error.voice.cloud.rateLimited");
  return new VoiceOperationError({ cause: new Error(sourceText("error.voice.transcriptionFailed")) });
}

/** Language hint: Whisper-style code such as "en" or "pt-BR", or "automatic". Returns null when unset. */
function languageCode(language: string): string | null {
  return language === "automatic" ? null : (language.split("-")[0]?.toLowerCase() ?? null);
}

export function gradiumTranscript(body: string): string {
  return body
    .split("\n")
    .flatMap((line) =>
      Option.match(decodeGradiumLine(line.trim()), {
        onNone: () => [],
        onSome: (message) => (message.type === "text" && message.text ? [message.text.trim()] : []),
      }),
    )
    .join(" ")
    .trim();
}

export function transcribeAtRestProvider(
  fetcher: DictationFetch,
  input: { modelId: RestVoiceModelId; key: string; wav: Uint8Array; language: string },
): Effect.Effect<VoiceTranscriptionResult, VoiceOperationError> {
  const { provider, model } = REST_DICTATION_MODELS[input.modelId];
  const language = languageCode(input.language);
  const bytes = new Uint8Array(input.wav);
  const request = (): { url: string; init: RequestInit } => {
    if (provider === "cartesia") {
      const form = new FormData();
      form.set("file", new Blob([bytes], { type: "audio/wav" }), "recording.wav");
      form.set("model", model);
      if (language) form.set("language", language);
      return {
        url: "https://api.cartesia.ai/stt",
        init: { method: "POST", headers: { "X-API-Key": input.key, "Cartesia-Version": "2026-08-14" }, body: form },
      };
    }
    if (provider === "fish") {
      const form = new FormData();
      form.set("audio", new Blob([bytes], { type: "audio/wav" }), "recording.wav");
      form.set("ignore_timestamps", "true");
      form.set("tag_audio_events", "false");
      form.set("diarize", "false");
      if (language) form.set("language", language);
      return {
        url: "https://api.fish.audio/v1/asr",
        init: { method: "POST", headers: { Authorization: `Bearer ${input.key}`, model }, body: form },
      };
    }
    const config = JSON.stringify({ language: language && GRADIUM_LANGUAGES.has(language) ? language : "any" });
    return {
      url: `https://api.gradium.ai/api/speech/asr?json_config=${encodeURIComponent(config)}`,
      init: { method: "POST", headers: { "x-api-key": input.key, "Content-Type": "audio/wav" }, body: bytes },
    };
  };
  return Effect.tryPromise({
    try: async () => {
      const { url, init } = request();
      const response = await fetcher(url, { ...init, redirect: "manual", signal: AbortSignal.timeout(TIMEOUT_MS) });
      return { status: response.status, ok: response.ok, body: await response.text() };
    },
    catch: () => fail(provider, "error.voice.speech.providerUnreachable"),
  }).pipe(
    Effect.flatMap((answer) => {
      if (!answer.ok) return Effect.fail(refusal(provider, answer.status));
      const text =
        provider === "gradium"
          ? gradiumTranscript(answer.body)
          : Option.match(decodeText(answer.body), { onNone: () => "", onSome: (value) => value.text.trim() });
      return Effect.succeed({ text });
    }),
  );
}
