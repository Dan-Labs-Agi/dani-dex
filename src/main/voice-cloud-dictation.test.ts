// @vitest-environment node

import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { gradiumTranscript, transcribeAtRestProvider } from "./voice-cloud-dictation";

function recorder(reply: Response) {
  const calls: Array<{ url: string; headers: Record<string, string>; body: unknown }> = [];
  const fetcher = async (input: string | URL | Request, init?: RequestInit) => {
    // biome-ignore lint/nursery/noUnsafeTypeAssertion: the code under test always passes a plain header object
    calls.push({ url: String(input), headers: init?.headers as Record<string, string>, body: init?.body });
    return reply;
  };
  return { calls, fetcher };
}

const wav = new Uint8Array([1, 2, 3, 4]);

describe("cloud dictation", () => {
  it("posts to Cartesia /stt with ink-whisper and reads the text", async () => {
    const sent = recorder(new Response(JSON.stringify({ text: " hello " })));
    const result = await Effect.runPromise(
      transcribeAtRestProvider(sent.fetcher, { modelId: "cartesia-ink-whisper", key: "k", wav, language: "en" }),
    );
    expect(result.text).toBe("hello");
    expect(sent.calls[0]?.url).toBe("https://api.cartesia.ai/stt");
    expect(sent.calls[0]?.headers["X-API-Key"]).toBe("k");
    // biome-ignore lint/nursery/noUnsafeTypeAssertion: the code under test sends a FormData body
    const form = sent.calls[0]?.body as FormData;
    expect(form.get("model")).toBe("ink-whisper");
    expect(form.get("language")).toBe("en");
  });

  it("posts to Fish /v1/asr with the model header", async () => {
    const sent = recorder(new Response(JSON.stringify({ text: "hi there" })));
    const result = await Effect.runPromise(
      transcribeAtRestProvider(sent.fetcher, { modelId: "fish-transcribe-pro", key: "k", wav, language: "automatic" }),
    );
    expect(result.text).toBe("hi there");
    expect(sent.calls[0]?.url).toBe("https://api.fish.audio/v1/asr");
    expect(sent.calls[0]?.headers.model).toBe("transcribe-1-pro");
    // biome-ignore lint/nursery/noUnsafeTypeAssertion: the code under test sends a FormData body
    const form = sent.calls[0]?.body as FormData;
    expect(form.get("diarize")).toBe("false");
    expect(form.has("language")).toBe(false);
  });

  it("posts raw audio to Gradium and joins the NDJSON text lines", async () => {
    const lines = ['{"type":"text","text":"good"}', '{"type":"end_text"}', '{"type":"text","text":"morning"}'];
    const ndjson = lines.join("\n");
    const sent = recorder(new Response(ndjson));
    const result = await Effect.runPromise(
      transcribeAtRestProvider(sent.fetcher, { modelId: "gradium-stt", key: "k", wav, language: "ja" }),
    );
    expect(result.text).toBe("good morning");
    expect(sent.calls[0]?.url).toContain("https://api.gradium.ai/api/speech/asr?json_config=");
    expect(decodeURIComponent(sent.calls[0]?.url.split("json_config=")[1] ?? "")).toBe('{"language":"any"}');
    expect(sent.calls[0]?.headers["Content-Type"]).toBe("audio/wav");
    expect(gradiumTranscript("not json")).toBe("");
  });

  it("fails on a rejected key", async () => {
    const sent = recorder(new Response("no", { status: 401 }));
    await expect(
      Effect.runPromise(
        transcribeAtRestProvider(sent.fetcher, { modelId: "fish-transcribe", key: "bad", wav, language: "en" }),
      ),
    ).rejects.toBeDefined();
  });
});
