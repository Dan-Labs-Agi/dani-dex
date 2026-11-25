// Seven main characters, each unique in colour, hat and face.
const faces = [
  new URL("./characters/crown.webp", import.meta.url).href,
  new URL("./characters/hat.webp", import.meta.url).href,
  new URL("./characters/wizard.webp", import.meta.url).href,
  new URL("./characters/sprout.webp", import.meta.url).href,
  new URL("./characters/halo.webp", import.meta.url).href,
  new URL("./characters/cat.webp", import.meta.url).href,
  new URL("./characters/beret.webp", import.meta.url).href,
] as const;

export const CHARACTER_COUNT = faces.length;

const CHOSEN_PREFIX = "dex-char:";
const assigned = new Map<string, number>();
const usedLooks = new Set<number>();

function hashSeed(seed: string): number {
  let hash = 0;
  for (const char of seed) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return hash;
}

/** Seed that pins an agent to one of the seven characters. */
export function characterSeed(index: number): string {
  return `${CHOSEN_PREFIX}${index}`;
}

function characterIndexForSeed(seed: string): number | null {
  if (!seed.startsWith(CHOSEN_PREFIX)) return null;
  const index = Number(seed.slice(CHOSEN_PREFIX.length));
  return Number.isInteger(index) && index >= 0 && index < faces.length ? index : null;
}

// Agents without a pinned character get a free look first, so two agents only share one after all seven are taken.
export function characterFaceUrl(seed: string): string {
  const chosen = characterIndexForSeed(seed);
  if (chosen !== null) {
    usedLooks.add(chosen);
    return faces[chosen] ?? faces[0];
  }
  let index = assigned.get(seed);
  if (index === undefined) {
    const start = hashSeed(seed) % faces.length;
    index = start;
    for (let step = 0; step < faces.length; step += 1) {
      const candidate = (start + step) % faces.length;
      if (!usedLooks.has(candidate)) {
        index = candidate;
        break;
      }
    }
    assigned.set(seed, index);
    usedLooks.add(index);
  }
  return faces[index] ?? faces[0];
}
