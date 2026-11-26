// @vitest-environment node

import { describe, expect, it } from "vitest";
import { OPENCODE_ZEN_URL } from "./voice-chat-stream";
import { createDuplexSession } from "./voice-duplex-session";

const sse = (...texts: string[]) =>
  `${texts.map((text) => `data: ${JSON.stringify({ choices: [{ delta: { content: text } }] })}\n\n`).join("")}data: [DONE]\n\n`;

describe("full-duplex session", () => {
  it("sends the heard words to the chat endpoint and speaks the streamed reply", async () => {
    const bodies: string[] = [];
    const spoken: string[] = [];
    const heard: string[] = [];
    const session = createDuplexSession({
      fetcher: async (_url, init) => {
        bodies.push(String(init.body));
        return new Response(sse("It is ", "sunny. ", "Bring sunscreen."));
      },
      chat: { url: OPENCODE_ZEN_URL, key: "public", model: "mimo-v2.6-flash-free", system: "Be brief." },
      transcribe: async () => "what is the weather",
      speak: async (sentence) => {
        spoken.push(sentence);
      },
      onTranscript: (text) => heard.push(text),
    });
    session.speechStarted();
    session.audio(new Uint8Array([1]));
    await session.speechEnded();
    expect(heard).toEqual(["what is the weather"]);
    expect(bodies[0]).toContain("what is the weather");
    expect(bodies[0]).toContain("Be brief.");
    expect(spoken).toEqual(["It is sunny.", "Bring sunscreen."]);
  });

  it("stops speaking and drops the rest of the reply when the user talks over it", async () => {
    const spoken: string[] = [];
    const session = createDuplexSession({
      fetcher: async () => new Response(sse("One. ", "Two. ", "Three.")),
      chat: { url: OPENCODE_ZEN_URL, key: "public", model: "m", system: "s" },
      transcribe: async () => "go",
      speak: async (sentence) => {
        spoken.push(sentence);
        if (sentence === "One.") session.speechStarted();
      },
    });
    session.speechStarted();
    await session.speechEnded();
    expect(spoken).toEqual(["One."]);
    expect(session.state).toBe("hearing");
  });
});
