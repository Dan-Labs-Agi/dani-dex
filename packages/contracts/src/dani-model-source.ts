export interface DaniDexModelSource {
  /** The provider id model ids are prefixed with, such as `danlab` for `danlab/<model>`. */
  readonly id: string;
  readonly name: string;
  readonly baseUrl: string;
  /** The models the endpoint serves. OpenCode lists only the ones named here. */
  readonly models: readonly {
    readonly id: string;
    readonly name: string;
    readonly limit?: { readonly context: number; readonly output: number };
    readonly reasoningEffortLevels?: readonly ("low" | "medium" | "high" | "max")[];
  }[];
  /** Sent with every request, for a proxy that authenticates by header instead of a key. */
  readonly headers?: readonly { readonly name: string; readonly value: string }[];
  /**
   * The source's own key, sent as the bearer key. Set by a proxy that mints one per install; when it
   * is absent, the OpenCode Go key saved in Settings is sent instead.
   */
  readonly apiKey?: string;
}

export const DANI_DEX_MODEL_SOURCE: DaniDexModelSource | null = null;
