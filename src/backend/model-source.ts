import type { DaniDexModelSource } from "@openbot/contracts/dani-model-source";
import type { CustomProviderConfig, CustomProviderSource } from "./opencode-config";

let runtimeSource: DaniDexModelSource | null = null;

export function setRuntimeModelSource(source: DaniDexModelSource | null): void {
  runtimeSource = source;
}

export function currentModelSource(): DaniDexModelSource | null {
  return runtimeSource;
}

/** The local proxy is an extra endpoint. Never replace user endpoints or other harnesses. */
export function modelSourceProviders(source = currentModelSource()): CustomProviderConfig[] {
  if (!source || source.models.length === 0) return [];
  return [
    {
      id: source.id,
      name: source.name,
      baseUrl: source.baseUrl,
      apiKey: source.apiKey ?? null,
      harness: "opencode",
      models: source.models.map((model) => ({
        id: model.id,
        name: model.name,
        ...(model.limit ? { contextWindow: model.limit.context, maxOutput: model.limit.output } : {}),
        ...(model.reasoningEffortLevels ? { reasoningEfforts: [...model.reasoningEffortLevels] } : {}),
      })),
      headers: (source.headers ?? []).map((header) => ({ ...header })),
    },
  ];
}

/** Read at spawn time, including after crash recovery; never freeze a stale loopback URL. */
export function withModelSource(custom: CustomProviderSource): CustomProviderSource {
  return () => {
    const source = currentModelSource();
    return [...modelSourceProviders(source), ...custom().filter((provider) => provider.id !== source?.id)];
  };
}
