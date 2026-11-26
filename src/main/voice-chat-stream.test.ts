// @vitest-environment node

import { describe, expect, it } from "vitest";
import { deltaFromLine, KILO_GATEWAY_URL, OPENCODE_ZEN_URL, streamChat } from "./voice-chat-stream";

const sse = (...texts: string[]) =>
  `${texts.map((text) => `data: ${JSON.stringify({ choices: [{ delta: { content: text } }] })}\n\n`).join("")}data: [DONE]\n\n`;

async function collect(iterable: AsyncIterable<string>) {
  const out: string[] = [];
  for await (const piece of iterable) out.push(piece);
  return out;
}

describe("chat streaming for the voice loop", () => {
  it("reads text pieces from the stream", async () => {
    const seen: { url: string; init: RequestInit }[] = [];
    const pieces = await collect(
      streamChat(
        async (url, init) => {
          seen.push({ url, init });
          return new Response(sse("Hel", "lo."));
        },
        {
          url: OPENCODE_ZEN_URL,
          key: "public",
          model: "mimo-v2.6-flash-free",
          system: "s",
          user: "u",
          signal: new AbortController().signal,
        },
      ),
    );
    expect(pieces).toEqual(["Hel", "lo."]);
    expect(seen[0]?.url).toBe(OPENCODE_ZEN_URL);
    expect(JSON.stringify(seen[0]?.init.headers)).toContain("Bearer public");
    expect(String(seen[0]?.init.body)).toContain('"stream":true');
  });

  it("can target the Kilo gateway with a user key", async () => {
    const seen: string[] = [];
    await collect(
      streamChat(
        async (url) => {
          seen.push(url);
          return new Response(sse("ok"));
        },
        {
          url: KILO_GATEWAY_URL,
          key: "user-key",
          model: "kilo/kilo-auto/free",
          system: "s",
          user: "u",
          signal: new AbortController().signal,
        },
      ),
    );
    expect(seen).toEqual([KILO_GATEWAY_URL]);
  });

  it("fails on a bad status", async () => {
    const run = collect(
      streamChat(async () => new Response("no", { status: 429 }), {
        url: OPENCODE_ZEN_URL,
        key: "public",
        model: "m",
        system: "s",
        user: "u",
        signal: new AbortController().signal,
      }),
    );
    await expect(run).rejects.toThrow("429");
  });

  it("ignores lines without text", () => {
    expect(deltaFromLine("data: [DONE]")).toBeNull();
    expect(deltaFromLine(": keepalive")).toBeNull();
    expect(deltaFromLine("data: not json")).toBeNull();
  });
});
