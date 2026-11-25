// 204 distinct characters. Looks only: body color, proportions, eyes, head item and face detail.
const faces = [
  new URL("./characters/c000.webp", import.meta.url).href,
  new URL("./characters/c001.webp", import.meta.url).href,
  new URL("./characters/c002.webp", import.meta.url).href,
  new URL("./characters/c003.webp", import.meta.url).href,
  new URL("./characters/c004.webp", import.meta.url).href,
  new URL("./characters/c005.webp", import.meta.url).href,
  new URL("./characters/c006.webp", import.meta.url).href,
  new URL("./characters/c007.webp", import.meta.url).href,
  new URL("./characters/c008.webp", import.meta.url).href,
  new URL("./characters/c009.webp", import.meta.url).href,
  new URL("./characters/c010.webp", import.meta.url).href,
  new URL("./characters/c011.webp", import.meta.url).href,
  new URL("./characters/c012.webp", import.meta.url).href,
  new URL("./characters/c013.webp", import.meta.url).href,
  new URL("./characters/c014.webp", import.meta.url).href,
  new URL("./characters/c015.webp", import.meta.url).href,
  new URL("./characters/c016.webp", import.meta.url).href,
  new URL("./characters/c017.webp", import.meta.url).href,
  new URL("./characters/c018.webp", import.meta.url).href,
  new URL("./characters/c019.webp", import.meta.url).href,
  new URL("./characters/c020.webp", import.meta.url).href,
  new URL("./characters/c021.webp", import.meta.url).href,
  new URL("./characters/c022.webp", import.meta.url).href,
  new URL("./characters/c023.webp", import.meta.url).href,
  new URL("./characters/c024.webp", import.meta.url).href,
  new URL("./characters/c025.webp", import.meta.url).href,
  new URL("./characters/c026.webp", import.meta.url).href,
  new URL("./characters/c027.webp", import.meta.url).href,
  new URL("./characters/c028.webp", import.meta.url).href,
  new URL("./characters/c029.webp", import.meta.url).href,
  new URL("./characters/c030.webp", import.meta.url).href,
  new URL("./characters/c031.webp", import.meta.url).href,
  new URL("./characters/c032.webp", import.meta.url).href,
  new URL("./characters/c033.webp", import.meta.url).href,
  new URL("./characters/c034.webp", import.meta.url).href,
  new URL("./characters/c035.webp", import.meta.url).href,
  new URL("./characters/c036.webp", import.meta.url).href,
  new URL("./characters/c037.webp", import.meta.url).href,
  new URL("./characters/c038.webp", import.meta.url).href,
  new URL("./characters/c039.webp", import.meta.url).href,
  new URL("./characters/c040.webp", import.meta.url).href,
  new URL("./characters/c041.webp", import.meta.url).href,
  new URL("./characters/c042.webp", import.meta.url).href,
  new URL("./characters/c043.webp", import.meta.url).href,
  new URL("./characters/c044.webp", import.meta.url).href,
  new URL("./characters/c045.webp", import.meta.url).href,
  new URL("./characters/c046.webp", import.meta.url).href,
  new URL("./characters/c047.webp", import.meta.url).href,
  new URL("./characters/c048.webp", import.meta.url).href,
  new URL("./characters/c049.webp", import.meta.url).href,
  new URL("./characters/c050.webp", import.meta.url).href,
  new URL("./characters/c051.webp", import.meta.url).href,
  new URL("./characters/c052.webp", import.meta.url).href,
  new URL("./characters/c053.webp", import.meta.url).href,
  new URL("./characters/c054.webp", import.meta.url).href,
  new URL("./characters/c055.webp", import.meta.url).href,
  new URL("./characters/c056.webp", import.meta.url).href,
  new URL("./characters/c057.webp", import.meta.url).href,
  new URL("./characters/c058.webp", import.meta.url).href,
  new URL("./characters/c059.webp", import.meta.url).href,
  new URL("./characters/c060.webp", import.meta.url).href,
  new URL("./characters/c061.webp", import.meta.url).href,
  new URL("./characters/c062.webp", import.meta.url).href,
  new URL("./characters/c063.webp", import.meta.url).href,
  new URL("./characters/c064.webp", import.meta.url).href,
  new URL("./characters/c065.webp", import.meta.url).href,
  new URL("./characters/c066.webp", import.meta.url).href,
  new URL("./characters/c067.webp", import.meta.url).href,
  new URL("./characters/c068.webp", import.meta.url).href,
  new URL("./characters/c069.webp", import.meta.url).href,
  new URL("./characters/c070.webp", import.meta.url).href,
  new URL("./characters/c071.webp", import.meta.url).href,
  new URL("./characters/c072.webp", import.meta.url).href,
  new URL("./characters/c073.webp", import.meta.url).href,
  new URL("./characters/c074.webp", import.meta.url).href,
  new URL("./characters/c075.webp", import.meta.url).href,
  new URL("./characters/c076.webp", import.meta.url).href,
  new URL("./characters/c077.webp", import.meta.url).href,
  new URL("./characters/c078.webp", import.meta.url).href,
  new URL("./characters/c079.webp", import.meta.url).href,
  new URL("./characters/c080.webp", import.meta.url).href,
  new URL("./characters/c081.webp", import.meta.url).href,
  new URL("./characters/c082.webp", import.meta.url).href,
  new URL("./characters/c083.webp", import.meta.url).href,
  new URL("./characters/c084.webp", import.meta.url).href,
  new URL("./characters/c085.webp", import.meta.url).href,
  new URL("./characters/c086.webp", import.meta.url).href,
  new URL("./characters/c087.webp", import.meta.url).href,
  new URL("./characters/c088.webp", import.meta.url).href,
  new URL("./characters/c089.webp", import.meta.url).href,
  new URL("./characters/c090.webp", import.meta.url).href,
  new URL("./characters/c091.webp", import.meta.url).href,
  new URL("./characters/c092.webp", import.meta.url).href,
  new URL("./characters/c093.webp", import.meta.url).href,
  new URL("./characters/c094.webp", import.meta.url).href,
  new URL("./characters/c095.webp", import.meta.url).href,
  new URL("./characters/c096.webp", import.meta.url).href,
  new URL("./characters/c097.webp", import.meta.url).href,
  new URL("./characters/c098.webp", import.meta.url).href,
  new URL("./characters/c099.webp", import.meta.url).href,
  new URL("./characters/c100.webp", import.meta.url).href,
  new URL("./characters/c101.webp", import.meta.url).href,
  new URL("./characters/c102.webp", import.meta.url).href,
  new URL("./characters/c103.webp", import.meta.url).href,
  new URL("./characters/c104.webp", import.meta.url).href,
  new URL("./characters/c105.webp", import.meta.url).href,
  new URL("./characters/c106.webp", import.meta.url).href,
  new URL("./characters/c107.webp", import.meta.url).href,
  new URL("./characters/c108.webp", import.meta.url).href,
  new URL("./characters/c109.webp", import.meta.url).href,
  new URL("./characters/c110.webp", import.meta.url).href,
  new URL("./characters/c111.webp", import.meta.url).href,
  new URL("./characters/c112.webp", import.meta.url).href,
  new URL("./characters/c113.webp", import.meta.url).href,
  new URL("./characters/c114.webp", import.meta.url).href,
  new URL("./characters/c115.webp", import.meta.url).href,
  new URL("./characters/c116.webp", import.meta.url).href,
  new URL("./characters/c117.webp", import.meta.url).href,
  new URL("./characters/c118.webp", import.meta.url).href,
  new URL("./characters/c119.webp", import.meta.url).href,
  new URL("./characters/c120.webp", import.meta.url).href,
  new URL("./characters/c121.webp", import.meta.url).href,
  new URL("./characters/c122.webp", import.meta.url).href,
  new URL("./characters/c123.webp", import.meta.url).href,
  new URL("./characters/c124.webp", import.meta.url).href,
  new URL("./characters/c125.webp", import.meta.url).href,
  new URL("./characters/c126.webp", import.meta.url).href,
  new URL("./characters/c127.webp", import.meta.url).href,
  new URL("./characters/c128.webp", import.meta.url).href,
  new URL("./characters/c129.webp", import.meta.url).href,
  new URL("./characters/c130.webp", import.meta.url).href,
  new URL("./characters/c131.webp", import.meta.url).href,
  new URL("./characters/c132.webp", import.meta.url).href,
  new URL("./characters/c133.webp", import.meta.url).href,
  new URL("./characters/c134.webp", import.meta.url).href,
  new URL("./characters/c135.webp", import.meta.url).href,
  new URL("./characters/c136.webp", import.meta.url).href,
  new URL("./characters/c137.webp", import.meta.url).href,
  new URL("./characters/c138.webp", import.meta.url).href,
  new URL("./characters/c139.webp", import.meta.url).href,
  new URL("./characters/c140.webp", import.meta.url).href,
  new URL("./characters/c141.webp", import.meta.url).href,
  new URL("./characters/c142.webp", import.meta.url).href,
  new URL("./characters/c143.webp", import.meta.url).href,
  new URL("./characters/c144.webp", import.meta.url).href,
  new URL("./characters/c145.webp", import.meta.url).href,
  new URL("./characters/c146.webp", import.meta.url).href,
  new URL("./characters/c147.webp", import.meta.url).href,
  new URL("./characters/c148.webp", import.meta.url).href,
  new URL("./characters/c149.webp", import.meta.url).href,
  new URL("./characters/c150.webp", import.meta.url).href,
  new URL("./characters/c151.webp", import.meta.url).href,
  new URL("./characters/c152.webp", import.meta.url).href,
  new URL("./characters/c153.webp", import.meta.url).href,
  new URL("./characters/c154.webp", import.meta.url).href,
  new URL("./characters/c155.webp", import.meta.url).href,
  new URL("./characters/c156.webp", import.meta.url).href,
  new URL("./characters/c157.webp", import.meta.url).href,
  new URL("./characters/c158.webp", import.meta.url).href,
  new URL("./characters/c159.webp", import.meta.url).href,
  new URL("./characters/c160.webp", import.meta.url).href,
  new URL("./characters/c161.webp", import.meta.url).href,
  new URL("./characters/c162.webp", import.meta.url).href,
  new URL("./characters/c163.webp", import.meta.url).href,
  new URL("./characters/c164.webp", import.meta.url).href,
  new URL("./characters/c165.webp", import.meta.url).href,
  new URL("./characters/c166.webp", import.meta.url).href,
  new URL("./characters/c167.webp", import.meta.url).href,
  new URL("./characters/c168.webp", import.meta.url).href,
  new URL("./characters/c169.webp", import.meta.url).href,
  new URL("./characters/c170.webp", import.meta.url).href,
  new URL("./characters/c171.webp", import.meta.url).href,
  new URL("./characters/c172.webp", import.meta.url).href,
  new URL("./characters/c173.webp", import.meta.url).href,
  new URL("./characters/c174.webp", import.meta.url).href,
  new URL("./characters/c175.webp", import.meta.url).href,
  new URL("./characters/c176.webp", import.meta.url).href,
  new URL("./characters/c177.webp", import.meta.url).href,
  new URL("./characters/c178.webp", import.meta.url).href,
  new URL("./characters/c179.webp", import.meta.url).href,
  new URL("./characters/c180.webp", import.meta.url).href,
  new URL("./characters/c181.webp", import.meta.url).href,
  new URL("./characters/c182.webp", import.meta.url).href,
  new URL("./characters/c183.webp", import.meta.url).href,
  new URL("./characters/c184.webp", import.meta.url).href,
  new URL("./characters/c185.webp", import.meta.url).href,
  new URL("./characters/c186.webp", import.meta.url).href,
  new URL("./characters/c187.webp", import.meta.url).href,
  new URL("./characters/c188.webp", import.meta.url).href,
  new URL("./characters/c189.webp", import.meta.url).href,
  new URL("./characters/c190.webp", import.meta.url).href,
  new URL("./characters/c191.webp", import.meta.url).href,
  new URL("./characters/c192.webp", import.meta.url).href,
  new URL("./characters/c193.webp", import.meta.url).href,
  new URL("./characters/c194.webp", import.meta.url).href,
  new URL("./characters/c195.webp", import.meta.url).href,
  new URL("./characters/c196.webp", import.meta.url).href,
  new URL("./characters/c197.webp", import.meta.url).href,
  new URL("./characters/c198.webp", import.meta.url).href,
  new URL("./characters/c199.webp", import.meta.url).href,
  new URL("./characters/c200.webp", import.meta.url).href,
  new URL("./characters/c201.webp", import.meta.url).href,
  new URL("./characters/c202.webp", import.meta.url).href,
  new URL("./characters/c203.webp", import.meta.url).href,
] as const;

export const CHARACTER_COUNT = faces.length;

// One look per agent: if two agents hash to the same look, or to the same head item,
// the later one moves on to the next free look. Agents already seen keep theirs for the session.
const HEAD_CLASSES = 33;
const assigned = new Map<string, number>();
const usedLooks = new Set<number>();
const usedHeads = new Set<number>();
const CHOSEN_PREFIX = "dex-char:";

function hashSeed(seed: string): number {
  let hash = 0;
  for (const char of seed) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return hash;
}

function claim(index: number): void {
  usedLooks.add(index);
  usedHeads.add(index % HEAD_CLASSES);
}

function pickLook(seed: string): number {
  const start = hashSeed(seed) % faces.length;
  if (usedLooks.size >= faces.length) return start;
  let fallback = -1;
  for (let step = 0; step < faces.length; step += 1) {
    const index = (start + step) % faces.length;
    if (usedLooks.has(index)) continue;
    if (fallback < 0) fallback = index;
    if (usedHeads.size >= HEAD_CLASSES || !usedHeads.has(index % HEAD_CLASSES)) return index;
  }
  return fallback < 0 ? start : fallback;
}

/** Seed that pins an agent to one specific character from the catalogue. */
export function characterSeed(index: number): string {
  return `${CHOSEN_PREFIX}${index}`;
}

/** The catalogue index an agent seed is pinned to, or null when the look is picked automatically. */
export function characterIndexForSeed(seed: string): number | null {
  if (!seed.startsWith(CHOSEN_PREFIX)) return null;
  const index = Number(seed.slice(CHOSEN_PREFIX.length));
  return Number.isInteger(index) && index >= 0 && index < faces.length ? index : null;
}

export function characterUrlAt(index: number): string {
  return faces[index] ?? faces[0];
}

export function characterFaceUrl(seed: string): string {
  const chosen = characterIndexForSeed(seed);
  if (chosen !== null) {
    claim(chosen);
    return faces[chosen] ?? faces[0];
  }
  let index = assigned.get(seed);
  if (index === undefined) {
    index = pickLook(seed);
    assigned.set(seed, index);
    claim(index);
  }
  return faces[index] ?? faces[0];
}
