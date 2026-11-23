// Data-only registry, safe for native, server and browser consumers without a WebGL dependency.
const DANI_VARIANTS = [
  { id: "dani", label: "Dani", color: "#9561ED" },
  { id: "sprout", label: "Sprout", color: "#17B4BD" },
  { id: "tuft", label: "Tuft", color: "#3299F4" },
  { id: "sweep", label: "Sweep", color: "#20BA78" },
  { id: "cap", label: "Cap", color: "#FF934F" },
  { id: "shades", label: "Shades", color: "#ED6383" },
  { id: "bow", label: "Bow", color: "#E65CAA" },
] as const;
type DaniVariantId = (typeof DANI_VARIANTS)[number]["id"];

export const DANI_IDENTITY = Object.freeze({
  productName: "Dani Dex",
  assistantName: "Dani",
  repository: "somdipto/dani-dex",
  appId: "dev.danlab.danidex.desktop",
  scheme: "dani-dex",
  avatarCacheVersion: 1,
});
export const DANI_AVATARS = DANI_VARIANTS.map((variant) => ({
  ...variant,
  label: variant.id === "dani" ? "Dani" : `Dani ${variant.label}`,
}));
export type { DaniVariantId };

/** Pure presentation migration. Never changes user IDs, names, uploads or stored credentials. */
export function daniVariantForAvatar(seed: string, color?: string | null, hue?: number | null): DaniVariantId {
  const explicit = /^dani:v1:(dani|sprout|tuft|sweep|cap|shades|bow)(?::|$)/.exec(seed)?.[1];
  if (explicit) return explicit as DaniVariantId;
  if (/\b(chief|coordinator|director|dani)\b/i.test(seed)) return "dani";
  if (color && /^#[0-9a-f]{6}$/i.test(color)) {
    const rgb = (value: string) => [1, 3, 5].map((offset) => Number.parseInt(value.slice(offset, offset + 2), 16));
    const input = rgb(color);
    return [...DANI_VARIANTS].sort((a, b) => {
      const distance = (hex: string) => rgb(hex).reduce((total, channel, i) => total + (channel - (input[i] ?? 0)) ** 2, 0);
      return distance(a.color) - distance(b.color);
    })[0]?.id ?? "dani";
  }
  if (hue !== null && hue !== undefined) {
    const choices: readonly [number, DaniVariantId][] = [[185, "sprout"], [215, "tuft"], [150, "sweep"], [30, "cap"], [0, "shades"], [320, "bow"], [280, "dani"]];
    const difference = (candidate: number) => Math.min(Math.abs(candidate - hue), 360 - Math.abs(candidate - hue));
    return [...choices].sort((a, b) => difference(a[0]) - difference(b[0]))[0]?.[1] ?? "dani";
  }
  let hash = 0;
  for (const character of seed) hash = (Math.imul(hash, 31) + character.charCodeAt(0)) >>> 0;
  return seed === "agent" ? "dani" : DANI_VARIANTS[hash % DANI_VARIANTS.length]?.id ?? "dani";
}
