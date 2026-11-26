/**
 * Per-provider options for cloud spoken replies. Values come from each provider's public API reference:
 * Cartesia (docs.cartesia.ai/api-reference/tts/bytes), Fish Audio (docs.fish.audio text-to-speech) and
 * Gradium (docs.gradium.ai text-to-speech guide). Every provider needs the user's own key (BYOK).
 */
const CLOUD_VOICE_PROVIDERS = ["cartesia", "fish", "gradium"] as const;
export type CloudVoiceProvider = (typeof CLOUD_VOICE_PROVIDERS)[number];

export interface CloudVoiceChoice {
  model: string;
  /** Provider voice id. Empty means the provider default. */
  voice: string;
  speed: number;
}
export type CloudVoiceOptions = Record<CloudVoiceProvider, CloudVoiceChoice>;

interface CloudVoiceModel {
  id: string;
  name: string;
  /** True only where the provider documents a free-tier model. */
  free: boolean;
}

interface CloudVoicePreset {
  id: string;
  name: string;
}

interface CloudVoiceCatalogEntry {
  models: readonly CloudVoiceModel[];
  voices: readonly CloudVoicePreset[];
  speeds: readonly number[];
  /** True when voices beyond the presets can be entered by id. */
  customVoice: boolean;
}

export const CLOUD_VOICE_CATALOG: Record<CloudVoiceProvider, CloudVoiceCatalogEntry> = {
  cartesia: {
    models: [
      { id: "sonic-3.6", name: "Sonic 3.6", free: false },
      { id: "sonic-3.5", name: "Sonic 3.5", free: false },
      { id: "sonic-3", name: "Sonic 3", free: false },
      { id: "sonic-latest", name: "Sonic latest", free: false },
    ],
    voices: [{ id: "f786b574-daa5-4673-aa0c-cbe3e8534c02", name: "Default" }],
    speeds: [0.6, 0.8, 1, 1.2, 1.5],
    customVoice: true,
  },
  fish: {
    models: [
      { id: "s2.1-pro-free", name: "S2.1 Pro Free", free: true },
      { id: "s2.1-pro", name: "S2.1 Pro", free: false },
      { id: "s2-pro", name: "S2 Pro", free: false },
      { id: "s3-pro", name: "S3 Pro", free: false },
      { id: "s1", name: "S1", free: false },
    ],
    voices: [{ id: "", name: "Default" }],
    speeds: [0.5, 0.75, 1, 1.25, 1.5, 2],
    customVoice: true,
  },
  gradium: {
    models: [{ id: "default", name: "Default", free: false }],
    voices: [
      { id: "Bla6SbVMczYnOhfK", name: "Marlowe" },
      { id: "So1JQqkLvBzUhTIP", name: "Lydia" },
      { id: "A255XGZGUmCRQF3X", name: "Jasper" },
      { id: "2rvLkgYrTjtRKncj", name: "Warren" },
      { id: "Lxc7YlPC8ckLJA8H", name: "Kelly" },
      { id: "W5htOuyiFI4Fwhxs", name: "Hunter" },
      { id: "2H4HY2CBNyJHBCrP", name: "Christina" },
      { id: "dh0EzP6jCroK6prq", name: "Mark" },
      { id: "56DcpvEI0Gawpidh", name: "Kaitlyn" },
      { id: "c8BzreHTk1GG2R4z", name: "Cameron" },
    ],
    speeds: [0.75, 1, 1.25, 1.5],
    customVoice: true,
  },
};

export const DEFAULT_CLOUD_VOICE: CloudVoiceOptions = {
  cartesia: { model: "sonic-3", voice: "f786b574-daa5-4673-aa0c-cbe3e8534c02", speed: 1 },
  fish: { model: "s2-pro", voice: "", speed: 1 },
  gradium: { model: "default", voice: "Bla6SbVMczYnOhfK", speed: 1 },
};

const VOICE_ID_PATTERN = /^[A-Za-z0-9_-]{1,64}$/u;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function normalizeChoice(provider: CloudVoiceProvider, value: unknown): CloudVoiceChoice {
  const fallback = DEFAULT_CLOUD_VOICE[provider];
  if (!isRecord(value)) return { ...fallback };
  const catalog = CLOUD_VOICE_CATALOG[provider];
  const model = catalog.models.some((item) => item.id === value.model) ? String(value.model) : fallback.model;
  const voice =
    typeof value.voice === "string" && (value.voice === "" || VOICE_ID_PATTERN.test(value.voice))
      ? value.voice
      : fallback.voice;
  const speed = catalog.speeds.find((item) => item === value.speed) ?? fallback.speed;
  return { model, voice, speed };
}

/** Never throws: anything unknown falls back to the provider default, so old settings files keep loading. */
export function normalizeCloudVoice(value: unknown): CloudVoiceOptions {
  const source = isRecord(value) ? value : {};
  return {
    cartesia: normalizeChoice("cartesia", source.cartesia),
    fish: normalizeChoice("fish", source.fish),
    gradium: normalizeChoice("gradium", source.gradium),
  };
}

export function isCloudVoiceProvider(value: string): value is CloudVoiceProvider {
  return (CLOUD_VOICE_PROVIDERS as readonly string[]).includes(value);
}

/** Gradium has no speed field: a negative padding_bonus speaks faster (range -4 to 4). */
export function gradiumPaddingBonus(speed: number): number {
  return Math.max(-4, Math.min(4, Math.round(-(speed - 1) * 4))) + 0;
}
