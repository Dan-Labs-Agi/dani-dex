import type { DaniDexModelSource } from "@openbot/contracts/dani-model-source";
import { afterEach, describe, expect, it } from "vitest";
import type { CustomProviderConfig } from "./opencode-config";
import { currentModelSource, modelSourceProviders, setRuntimeModelSource, withModelSource } from "./model-source";

const source: DaniDexModelSource = {
  id: "dani",
  name: "Dani",
  baseUrl: "http://127.0.0.1:40000/v1",
  apiKey: "local-only",
  models: [
    {
      id: "dani-free-auto",
      name: "Dani Free Auto",
      limit: { context: 128000, output: 8192 },
      reasoningEffortLevels: ["low", "high"],
    },
  ],
};
afterEach(() => setRuntimeModelSource(null));

describe("Dani runtime endpoint adapter", () => {
  it("does not invent an endpoint when the supervisor is unavailable", () => {
    expect(currentModelSource()).toBeNull();
    expect(modelSourceProviders()).toEqual([]);
  });
  it("maps the existing limit and effort contract to current endpoint fields", () => {
    expect(modelSourceProviders(source)).toEqual([
      {
        id: "dani",
        name: "Dani",
        baseUrl: source.baseUrl,
        apiKey: "local-only",
        harness: "opencode",
        headers: [],
        models: [
          {
            id: "dani-free-auto",
            name: "Dani Free Auto",
            contextWindow: 128000,
            maxOutput: 8192,
            reasoningEfforts: ["low", "high"],
          },
        ],
      },
    ]);
  });
  it("preserves user providers and reads replacement URLs at each spawn", () => {
    const user: CustomProviderConfig = {
      id: "user",
      name: "User",
      baseUrl: "https://example.org/v1",
      apiKey: null,
      models: [],
      headers: [],
      harness: "pi",
    };
    const providers = withModelSource(() => [user]);
    expect(providers()).toEqual([user]);
    setRuntimeModelSource(source);
    expect(providers()[0]?.baseUrl).toBe(source.baseUrl);
    expect(providers()[1]).toBe(user);
    setRuntimeModelSource({ ...source, baseUrl: "http://127.0.0.1:40001/v1" });
    expect(providers()[0]?.baseUrl).toBe("http://127.0.0.1:40001/v1");
    setRuntimeModelSource(null);
    expect(providers()).toEqual([user]);
  });
});
