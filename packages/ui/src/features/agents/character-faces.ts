// The seven original characters at 768px. Each is split into a body, two feet and a waving arm so the
// parts can move on their own. The body also has a blink frame and a happy face (the sunglasses one has neither).
interface CharacterSprites {
  bodyClass: string;
  hue: number;
  body: string;
  blink: string | null;
  happy: string | null;
  footLeft: string;
  footRight: string;
  arm: string;
  crown: string | null;
}

const faces: readonly CharacterSprites[] = [
  {
    bodyClass: "agent-avatar-char-dani",
    hue: 268,
    body: new URL("./characters/dani.png", import.meta.url).href,
    blink: new URL("./characters/dani-blink.png", import.meta.url).href,
    happy: new URL("./characters/dani-happy.png", import.meta.url).href,
    footLeft: new URL("./characters/dani-foot-l.png", import.meta.url).href,
    footRight: new URL("./characters/dani-foot-r.png", import.meta.url).href,
    arm: new URL("./characters/dani-arm.png", import.meta.url).href,
    crown: new URL("./characters/dani-crown.png", import.meta.url).href,
  },
  {
    bodyClass: "agent-avatar-char-sprout",
    hue: 181,
    body: new URL("./characters/sprout.png", import.meta.url).href,
    blink: new URL("./characters/sprout-blink.png", import.meta.url).href,
    happy: new URL("./characters/sprout-happy.png", import.meta.url).href,
    footLeft: new URL("./characters/sprout-foot-l.png", import.meta.url).href,
    footRight: new URL("./characters/sprout-foot-r.png", import.meta.url).href,
    arm: new URL("./characters/sprout-arm.png", import.meta.url).href,
    crown: null,
  },
  {
    bodyClass: "agent-avatar-char-tuft",
    hue: 205,
    body: new URL("./characters/tuft.png", import.meta.url).href,
    blink: new URL("./characters/tuft-blink.png", import.meta.url).href,
    happy: new URL("./characters/tuft-happy.png", import.meta.url).href,
    footLeft: new URL("./characters/tuft-foot-l.png", import.meta.url).href,
    footRight: new URL("./characters/tuft-foot-r.png", import.meta.url).href,
    arm: new URL("./characters/tuft-arm.png", import.meta.url).href,
    crown: null,
  },
  {
    bodyClass: "agent-avatar-char-sweep",
    hue: 150,
    body: new URL("./characters/sweep.png", import.meta.url).href,
    blink: new URL("./characters/sweep-blink.png", import.meta.url).href,
    happy: new URL("./characters/sweep-happy.png", import.meta.url).href,
    footLeft: new URL("./characters/sweep-foot-l.png", import.meta.url).href,
    footRight: new URL("./characters/sweep-foot-r.png", import.meta.url).href,
    arm: new URL("./characters/sweep-arm.png", import.meta.url).href,
    crown: null,
  },
  {
    bodyClass: "agent-avatar-char-cap",
    hue: 29,
    body: new URL("./characters/cap.png", import.meta.url).href,
    blink: new URL("./characters/cap-blink.png", import.meta.url).href,
    happy: new URL("./characters/cap-happy.png", import.meta.url).href,
    footLeft: new URL("./characters/cap-foot-l.png", import.meta.url).href,
    footRight: new URL("./characters/cap-foot-r.png", import.meta.url).href,
    arm: new URL("./characters/cap-arm.png", import.meta.url).href,
    crown: null,
  },
  {
    bodyClass: "agent-avatar-char-shades",
    hue: 343,
    body: new URL("./characters/shades.png", import.meta.url).href,
    blink: null,
    happy: null,
    footLeft: new URL("./characters/shades-foot-l.png", import.meta.url).href,
    footRight: new URL("./characters/shades-foot-r.png", import.meta.url).href,
    arm: new URL("./characters/shades-arm.png", import.meta.url).href,
    crown: null,
  },
  {
    bodyClass: "agent-avatar-char-bow",
    hue: 322,
    body: new URL("./characters/bow.png", import.meta.url).href,
    blink: new URL("./characters/bow-blink.png", import.meta.url).href,
    happy: new URL("./characters/bow-happy.png", import.meta.url).href,
    footLeft: new URL("./characters/bow-foot-l.png", import.meta.url).href,
    footRight: new URL("./characters/bow-foot-r.png", import.meta.url).href,
    arm: new URL("./characters/bow-arm.png", import.meta.url).href,
    crown: null,
  },
];

function seedIndex(seed: string): number {
  let hash = 0;
  for (const char of seed) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return hash % faces.length;
}

/** One seed per character, in order, so a picker can list exactly the seven with no repeats. */
export const CHARACTER_SEEDS: readonly string[] = faces.map((_, index) => {
  for (let attempt = 0; attempt < 1000; attempt += 1) {
    const seed = `character:${attempt}`;
    if (seedIndex(seed) === index) return seed;
  }
  return "character";
});

/** The purple king is Chief, the default first agent. The other six are options for later agents. */
export const CHIEF_SEED: string = CHARACTER_SEEDS[0] ?? "character";
export const OPTIONAL_CHARACTER_SEEDS: readonly string[] = CHARACTER_SEEDS.slice(1);

function sprites(seed: string): CharacterSprites {
  const found = faces[seedIndex(seed)] ?? faces[0];
  if (!found) throw new Error("No characters are registered.");
  return found;
}

export function characterFaceUrl(seed: string): string {
  return sprites(seed).body;
}

export function characterSpritesFor(seed: string): CharacterSprites {
  return sprites(seed);
}
