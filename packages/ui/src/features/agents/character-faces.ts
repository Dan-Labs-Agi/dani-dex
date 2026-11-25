// The seven original characters at 768px. Each has separate feet (so they can move on their own),
// a blink frame and one face overlay per hover emotion. The sunglasses one has no blink or face overlays.
export const AVATAR_EMOTIONS = ["happy", "sad", "love", "sleepy", "surprised", "wink"] as const;
export type AvatarEmotion = (typeof AVATAR_EMOTIONS)[number];

interface CharacterSprites {
  body: string;
  blink: string | null;
  footLeft: string;
  footRight: string;
  emotions: Partial<Record<AvatarEmotion, string>> | null;
}

const faces: readonly CharacterSprites[] = [
  {
    body: new URL("./characters/dani.png", import.meta.url).href,
    blink: new URL("./characters/dani-blink.png", import.meta.url).href,
    footLeft: new URL("./characters/dani-foot-l.png", import.meta.url).href,
    footRight: new URL("./characters/dani-foot-r.png", import.meta.url).href,
    emotions: {
      happy: new URL("./characters/dani-happy.png", import.meta.url).href,
      sad: new URL("./characters/dani-sad.png", import.meta.url).href,
      love: new URL("./characters/dani-love.png", import.meta.url).href,
      sleepy: new URL("./characters/dani-sleepy.png", import.meta.url).href,
      surprised: new URL("./characters/dani-surprised.png", import.meta.url).href,
      wink: new URL("./characters/dani-wink.png", import.meta.url).href,
    },
  },
  {
    body: new URL("./characters/sprout.png", import.meta.url).href,
    blink: new URL("./characters/sprout-blink.png", import.meta.url).href,
    footLeft: new URL("./characters/sprout-foot-l.png", import.meta.url).href,
    footRight: new URL("./characters/sprout-foot-r.png", import.meta.url).href,
    emotions: {
      happy: new URL("./characters/sprout-happy.png", import.meta.url).href,
      sad: new URL("./characters/sprout-sad.png", import.meta.url).href,
      love: new URL("./characters/sprout-love.png", import.meta.url).href,
      sleepy: new URL("./characters/sprout-sleepy.png", import.meta.url).href,
      surprised: new URL("./characters/sprout-surprised.png", import.meta.url).href,
      wink: new URL("./characters/sprout-wink.png", import.meta.url).href,
    },
  },
  {
    body: new URL("./characters/tuft.png", import.meta.url).href,
    blink: new URL("./characters/tuft-blink.png", import.meta.url).href,
    footLeft: new URL("./characters/tuft-foot-l.png", import.meta.url).href,
    footRight: new URL("./characters/tuft-foot-r.png", import.meta.url).href,
    emotions: {
      happy: new URL("./characters/tuft-happy.png", import.meta.url).href,
      sad: new URL("./characters/tuft-sad.png", import.meta.url).href,
      love: new URL("./characters/tuft-love.png", import.meta.url).href,
      sleepy: new URL("./characters/tuft-sleepy.png", import.meta.url).href,
      surprised: new URL("./characters/tuft-surprised.png", import.meta.url).href,
      wink: new URL("./characters/tuft-wink.png", import.meta.url).href,
    },
  },
  {
    body: new URL("./characters/sweep.png", import.meta.url).href,
    blink: new URL("./characters/sweep-blink.png", import.meta.url).href,
    footLeft: new URL("./characters/sweep-foot-l.png", import.meta.url).href,
    footRight: new URL("./characters/sweep-foot-r.png", import.meta.url).href,
    emotions: {
      happy: new URL("./characters/sweep-happy.png", import.meta.url).href,
      sad: new URL("./characters/sweep-sad.png", import.meta.url).href,
      love: new URL("./characters/sweep-love.png", import.meta.url).href,
      sleepy: new URL("./characters/sweep-sleepy.png", import.meta.url).href,
      surprised: new URL("./characters/sweep-surprised.png", import.meta.url).href,
      wink: new URL("./characters/sweep-wink.png", import.meta.url).href,
    },
  },
  {
    body: new URL("./characters/cap.png", import.meta.url).href,
    blink: new URL("./characters/cap-blink.png", import.meta.url).href,
    footLeft: new URL("./characters/cap-foot-l.png", import.meta.url).href,
    footRight: new URL("./characters/cap-foot-r.png", import.meta.url).href,
    emotions: {
      happy: new URL("./characters/cap-happy.png", import.meta.url).href,
      sad: new URL("./characters/cap-sad.png", import.meta.url).href,
      love: new URL("./characters/cap-love.png", import.meta.url).href,
      sleepy: new URL("./characters/cap-sleepy.png", import.meta.url).href,
      surprised: new URL("./characters/cap-surprised.png", import.meta.url).href,
      wink: new URL("./characters/cap-wink.png", import.meta.url).href,
    },
  },
  {
    body: new URL("./characters/shades.png", import.meta.url).href,
    blink: null,
    footLeft: new URL("./characters/shades-foot-l.png", import.meta.url).href,
    footRight: new URL("./characters/shades-foot-r.png", import.meta.url).href,
    emotions: null,
  },
  {
    body: new URL("./characters/bow.png", import.meta.url).href,
    blink: new URL("./characters/bow-blink.png", import.meta.url).href,
    footLeft: new URL("./characters/bow-foot-l.png", import.meta.url).href,
    footRight: new URL("./characters/bow-foot-r.png", import.meta.url).href,
    emotions: {
      happy: new URL("./characters/bow-happy.png", import.meta.url).href,
      sad: new URL("./characters/bow-sad.png", import.meta.url).href,
      love: new URL("./characters/bow-love.png", import.meta.url).href,
      sleepy: new URL("./characters/bow-sleepy.png", import.meta.url).href,
      surprised: new URL("./characters/bow-surprised.png", import.meta.url).href,
      wink: new URL("./characters/bow-wink.png", import.meta.url).href,
    },
  },
];

function sprites(seed: string): CharacterSprites {
  let hash = 0;
  for (const char of seed) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  const found = faces[hash % faces.length] ?? faces[0];
  if (!found) throw new Error("No characters are registered.");
  return found;
}

export function characterFaceUrl(seed: string): string {
  return sprites(seed).body;
}

export function characterSpritesFor(seed: string): CharacterSprites {
  return sprites(seed);
}
