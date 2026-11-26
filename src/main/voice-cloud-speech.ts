import {
  type CloudSpeechModelId,
  type CloudSpeechModelInfo,
  type ElevenLabsSpeechVoice,
  type SpeechAudio,
  type SpeechLanguage,
  VOICE_KEY_PROVIDER_NAMES,
  type XaiSpeechVoice,
} from "@openbot/contracts/ipc";
import { sourceText } from "@openbot/i18n/source";
import { createOpenBotLogger } from "@openbot/logging";
import { Effect, Option, Schema } from "effect";
import { readLimitedBody } from "../backend/limited-body";
import { VoiceOperationError } from "./voice-model-service";

const logger = createOpenBotLogger("voice-cloud-speech");

const SPEECH_TIMEOUT_MS = 60_000;
const SPEECH_BODY_LIMIT = 16 * 1024 * 1024;
const ERROR_BODY_LIMIT = 16 * 1024;
const REASON_MAX_LENGTH = 300;
const SAMPLE_RATE = 24_000;

const ELEVENLABS_MODELS: Partial<Record<CloudSpeechModelId, { modelId: string; languageCode: boolean }>> = {
  "elevenlabs-flash-v2.5": { modelId: "eleven_flash_v2_5", languageCode: true },
  "elevenlabs-multilingual-v2": { modelId: "eleven_multilingual_v2", languageCode: false },
  "elevenlabs-v3": { modelId: "eleven_v3", languageCode: true },
  "elevenlabs-v4-turbo": { modelId: "eleven_v4_turbo", languageCode: true },
  "elevenlabs-v4": { modelId: "eleven_v4", languageCode: true },
};

const ELEVENLABS_UNLISTED_LANGUAGES: ReadonlySet<SpeechLanguage> = new Set(["et", "lt", "lv", "sl"]);

const ELEVENLABS_VOICE_IDS: Record<ElevenLabsSpeechVoice, string> = {
  alice: "Xb7hH8MSUJpSbSDYk0k2",
  chris: "iP95p4xoKVk53GoZ742B",
  eric: "cjVigY5qzO86Huf0OWal",
  george: "JBFqnCBsd6RMkjVDRZzb",
  jessica: "cgSgspJ2msm6clMCkdW9",
  sarah: "EXAVITQu4vr4xnSDxMaL",
};

const XAI_LANGUAGES: Partial<Record<SpeechLanguage, string>> = {
  ar: "ar-SA",
  de: "de",
  en: "en",
  es: "es-ES",
  fr: "fr",
  hi: "hi",
  id: "id",
  it: "it",
  ja: "ja",
  ko: "ko",
  pt: "pt-BR",
  ru: "ru",
  tr: "tr",
  vi: "vi",
};

interface XaiSpeechBody {
  text: string;
  voice_id: XaiSpeechVoice;
  language: string;
  output_format: { codec: "pcm"; sample_rate: number };
}

interface ElevenLabsSpeechBody {
  text: string;
  model_id: string;
  language_code?: SpeechLanguage;
}

const decodeErrorDetail = Schema.decodeUnknownOption(
  Schema.fromJsonString(
    Schema.Struct({
      detail: Schema.Union([
        Schema.String,
        Schema.Struct({ status: Schema.optionalKey(Schema.String), message: Schema.optionalKey(Schema.String) }),
      ]),
    }),
  ),
);
const CARTESIA_VOICE_ID = "f786b574-daa5-4673-aa0c-cbe3e8534c02";
const GRADIUM_VOICE_ID = "Bla6SbVMczYnOhfK";
const FISH_MODEL = "s2-pro";
const SARVAM_MODEL = "bulbul:v3";
const SARVAM_SPEAKER = "shubh";
const SARVAM_LANGUAGES: Partial<Record<SpeechLanguage, string>> = {
  en: "en-IN",
  hi: "hi-IN",
};

const decodeSarvamAudio = Schema.decodeUnknownOption(
  Schema.fromJsonString(Schema.Struct({ audios: Schema.Array(Schema.String) })),
);
const decodeJsonAudio = Schema.decodeUnknownOption(Schema.fromJsonString(Schema.Struct({ audio: Schema.String })));

export type SpeechFetch = (input: string | URL | Request, init?: RequestInit) => Promise<Response>;

export interface CloudSpeechRequest {
  model: CloudSpeechModelInfo;
  key: string;
  text: string;
  language: SpeechLanguage | null;
  elevenLabsVoice: ElevenLabsSpeechVoice;
  xaiVoice: XaiSpeechVoice;
}

export function speakInCloud(
  fetcher: SpeechFetch,
  request: CloudSpeechRequest,
): Effect.Effect<SpeechAudio, VoiceOperationError> {
  if (request.model.provider === "xai") {
    const language = (request.language && XAI_LANGUAGES[request.language]) ?? "auto";
    return exchange(fetcher, request, "https://api.x.ai/v1/tts", {
      headers: { Authorization: `Bearer ${request.key}` },
      body: {
        text: request.text,
        voice_id: request.xaiVoice,
        language,
        output_format: { codec: "pcm", sample_rate: SAMPLE_RATE },
      },
    });
  }
  if (request.model.provider === "cartesia") {
    return exchange(fetcher, request, "https://api.cartesia.ai/tts/bytes", {
      headers: { "X-API-Key": request.key, "Cartesia-Version": "2025-04-16" },
      body: {
        model_id: "sonic-3",
        transcript: request.text,
        voice: { mode: "id", id: CARTESIA_VOICE_ID },
        output_format: { container: "raw", encoding: "pcm_s16le", sample_rate: SAMPLE_RATE },
        ...(request.language ? { language: request.language } : {}),
      },
    });
  }
  if (request.model.provider === "fish") {
    return exchange(fetcher, request, "https://api.fish.audio/v1/tts", {
      headers: { Authorization: `Bearer ${request.key}`, model: FISH_MODEL },
      body: { text: request.text, format: "pcm", sample_rate: SAMPLE_RATE },
    });
  }
  if (request.model.provider === "gradium") {
    return exchange(fetcher, request, "https://api.gradium.ai/api/post/speech/tts", {
      headers: { "x-api-key": request.key },
      body: {
        text: request.text,
        voice_id: GRADIUM_VOICE_ID,
        only_audio: true,
        output_format: `pcm_${SAMPLE_RATE}`,
      },
    });
  }
  if (request.model.provider === "sarvam") {
    return exchange(fetcher, request, "https://api.sarvam.ai/text-to-speech", {
      headers: { "api-subscription-key": request.key },
      body: {
        text: request.text,
        target_language_code: (request.language && SARVAM_LANGUAGES[request.language]) ?? "en-IN",
        speaker: SARVAM_SPEAKER,
        model: SARVAM_MODEL,
        speech_sample_rate: SAMPLE_RATE,
        output_audio_codec: "wav",
      },
      decode: sarvamAudio,
    });
  }
  const model = ELEVENLABS_MODELS[request.model.id];
  if (!model) return Effect.fail(failure(request, "error.voice.speech.providerFailed"));
  const voiceId = ELEVENLABS_VOICE_IDS[request.elevenLabsVoice];
  return exchange(
    fetcher,
    request,
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?output_format=pcm_${SAMPLE_RATE}`,
    {
      headers: { "xi-api-key": request.key },
      body: {
        text: request.text,
        model_id: model.modelId,
        ...(model.languageCode && request.language && !ELEVENLABS_UNLISTED_LANGUAGES.has(request.language)
          ? { language_code: request.language }
          : {}),
      },
    },
  );
}

function exchange(
  fetcher: SpeechFetch,
  request: CloudSpeechRequest,
  url: string,
  init: {
    headers: Record<string, string>;
    body: XaiSpeechBody | ElevenLabsSpeechBody | object;
    decode?: (body: Buffer) => Buffer | null;
  },
): Effect.Effect<SpeechAudio, VoiceOperationError> {
  const fail = (key: CloudSpeechErrorKey) => failure(request, key);
  return Effect.acquireUseRelease(
    Effect.sync(() => new AbortController()),
    (controller) =>
      Effect.gen(function* () {
        const response = yield* Effect.tryPromise({
          try: () =>
            fetcher(url, {
              method: "POST",
              headers: { ...init.headers, "Content-Type": "application/json", Accept: "*/*" },
              body: JSON.stringify(init.body),
              redirect: "manual",
              signal: controller.signal,
            }),
          catch: () => fail("error.voice.speech.providerUnreachable"),
        });
        if (!response.ok) return yield* errorAnswer(response, request, fail);
        const body = yield* readLimitedBody(response, SPEECH_BODY_LIMIT, () =>
          fail("error.voice.speech.providerFailed"),
        );
        const pcm = init.decode
          ? init.decode(body)
          : (response.headers.get("content-type") ?? "").includes("json")
            ? jsonAudio(body)
            : body;
        if (!pcm || pcm.byteLength < 2) return yield* fail("error.voice.speech.providerFailed");
        return { pcm: new Uint8Array(pcm.buffer, pcm.byteOffset, pcm.byteLength & ~1), sampleRate: SAMPLE_RATE };
      }).pipe(
        Effect.timeoutOrElse({
          duration: SPEECH_TIMEOUT_MS,
          orElse: () =>
            Effect.fail(new VoiceOperationError({ cause: new Error(sourceText("error.voice.speech.timedOut")) })),
        }),
      ),
    (controller) => Effect.sync(() => controller.abort()),
  );
}

function failure(request: CloudSpeechRequest, key: CloudSpeechErrorKey): VoiceOperationError {
  const provider = VOICE_KEY_PROVIDER_NAMES[request.model.provider];
  return new VoiceOperationError({ cause: new Error(sourceText(key, { provider })) });
}

type CloudSpeechErrorKey =
  | "error.voice.cloud.keyRejected"
  | "error.voice.cloud.quotaExceeded"
  | "error.voice.cloud.rateLimited"
  | "error.voice.speech.providerFailed"
  | "error.voice.speech.providerUnreachable";

function errorAnswer(
  response: Response,
  request: CloudSpeechRequest,
  fail: (key: CloudSpeechErrorKey) => VoiceOperationError,
): Effect.Effect<never, VoiceOperationError> {
  return readLimitedBody(response, ERROR_BODY_LIMIT, () => fail("error.voice.speech.providerFailed")).pipe(
    Effect.orElseSucceed(() => Buffer.alloc(0)),
    Effect.flatMap((body) => {
      const { status, reason } = errorDetail(body, request.key);
      logger.warn(
        `${request.model.provider} refused speech with HTTP ${response.status}${status ? ` (${status})` : ""}.`,
      );
      if (status === "quota_exceeded") return Effect.fail(fail("error.voice.cloud.quotaExceeded"));
      if (response.status === 401 || response.status === 403) return Effect.fail(fail("error.voice.cloud.keyRejected"));
      if (response.status === 429) return Effect.fail(fail("error.voice.cloud.rateLimited"));
      if (reason) return Effect.fail(refused(request, reason));
      return Effect.fail(fail("error.voice.speech.providerFailed"));
    }),
  );
}

function refused(request: CloudSpeechRequest, reason: string): VoiceOperationError {
  const provider = VOICE_KEY_PROVIDER_NAMES[request.model.provider];
  return new VoiceOperationError({
    cause: new Error(sourceText("error.voice.speech.providerRefused", { provider, reason })),
  });
}

function errorDetail(body: Buffer, key: string): { status: string | null; reason: string | null } {
  return Option.match(decodeErrorDetail(body.toString("utf8")), {
    onNone: () => ({ status: null, reason: null }),
    onSome: ({ detail }) => {
      const message = typeof detail === "string" ? detail : (detail.message ?? "");
      const reason = (key ? message.replaceAll(key, "…") : message).trim().slice(0, REASON_MAX_LENGTH);
      return { status: typeof detail === "string" ? null : (detail.status ?? null), reason: reason || null };
    },
  });
}

function jsonAudio(body: Buffer): Buffer | null {
  return Option.match(decodeJsonAudio(body.toString("utf8")), {
    onNone: () => null,
    onSome: (answer) => Buffer.from(answer.audio, "base64"),
  });
}

export function sarvamAudio(body: Buffer): Buffer | null {
  return Option.match(decodeSarvamAudio(body.toString("utf8")), {
    onNone: () => null,
    onSome: ({ audios }) => {
      const first = audios[0];
      return first ? wavPcm(Buffer.from(first, "base64")) : null;
    },
  });
}

/** Returns the sample bytes of a WAV file, or the input when it has no WAV header. */
export function wavPcm(wav: Buffer): Buffer {
  if (wav.length < 12 || wav.toString("ascii", 0, 4) !== "RIFF" || wav.toString("ascii", 8, 12) !== "WAVE") return wav;
  let offset = 12;
  while (offset + 8 <= wav.length) {
    const id = wav.toString("ascii", offset, offset + 4);
    const size = wav.readUInt32LE(offset + 4);
    if (id === "data") return wav.subarray(offset + 8, Math.min(wav.length, offset + 8 + size));
    offset += 8 + size + (size & 1);
  }
  return wav;
}
