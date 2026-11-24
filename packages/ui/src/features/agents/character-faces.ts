const faces = [
  new URL("./characters/dani.png", import.meta.url).href,
  new URL("./characters/sprout.png", import.meta.url).href,
  new URL("./characters/tuft.png", import.meta.url).href,
  new URL("./characters/sweep.png", import.meta.url).href,
  new URL("./characters/cap.png", import.meta.url).href,
  new URL("./characters/shades.png", import.meta.url).href,
  new URL("./characters/bow.png", import.meta.url).href,
] as const;

export function characterFaceUrl(seed: string): string {
  let hash = 0;
  for (const char of seed) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return faces[hash % faces.length] ?? faces[0];
}
