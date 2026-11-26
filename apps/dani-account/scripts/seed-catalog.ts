// Builds SQL that loads the launch catalog into the account database.
// Usage: bun apps/dani-account/scripts/seed-catalog.ts <artifactDir> > seed.sql
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { unzipSync } from "fflate";
import { parse as parseYaml } from "yaml";

const dir = process.argv[2];
if (!dir) throw new Error("artifact directory required");
const creatorName = "Dani Dex";
const now = Date.now();
const q = (v: string | null) => (v === null ? "NULL" : `'${v.replaceAll("'", "''")}'`);
const out: string[] = ["DELETE FROM catalog_blobs;", "DELETE FROM catalog_items;"];

function blob(id: string, kind: string, data: Uint8Array | string) {
  const b64 = typeof data === "string" ? Buffer.from(data).toString("base64") : Buffer.from(data).toString("base64");
  for (let i = 0, n = 0; i < b64.length; i += 50_000, n++)
    out.push(`INSERT INTO catalog_blobs(id,kind,part,data) VALUES(${q(id)},${q(kind)},${n},${q(b64.slice(i, i + 50_000))});`);
}

const cat = JSON.parse(readFileSync(join(dir, "catalog.json"), "utf8"));
const ag = JSON.parse(readFileSync(join(dir, "agents.json"), "utf8"));
for (const s of cat.skills) {
  const zip = new Uint8Array(readFileSync(join(dir, s.bundle)));
  const entries = unzipSync(zip);
  const name = Object.keys(entries).find((n) => /(^|\/)SKILL\.md$/.test(n));
  if (!name) throw new Error(`no SKILL.md in ${s.slug}`);
  const text = new TextDecoder().decode(entries[name]);
  const m = text.match(/^---\s*\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/u);
  if (!m) throw new Error(`no frontmatter in ${s.slug}`);
  const fm = parseYaml(m[1] ?? "") as Record<string, unknown>;
  const ex = typeof fm["example-prompt"] === "string" ? (fm["example-prompt"] as string).trim() : "";
  const summary = {
    id: s.id, slug: s.slug, name: s.name, description: s.description, category: s.category,
    creatorName, creatorAvatarUrl: null, version: s.version, installs: 0, featured: !!s.featured, verified: true,
    iconUrl: `/v1/skills/${s.id}/icon?v=${encodeURIComponent(s.versionId)}`, updatedAt: new Date(now).toISOString(),
  };
  const detail = {
    ...summary, versionId: s.versionId, bundleSha256: s.bundleSha256, files: s.files,
    instructions: text.slice(m[0].length).trim(), ...(ex && ex.length <= 1000 ? { examplePrompt: ex } : {}), cardUrl: null,
  };
  out.push(`INSERT INTO catalog_items(id,kind,slug,version_id,name,description,category,featured,installs,updated_at,summary,detail) VALUES(${q(s.id)},'skill',${q(s.slug)},${q(s.versionId)},${q(s.name)},${q(s.description)},${q(s.category)},${s.featured ? 1 : 0},0,${now},${q(JSON.stringify(summary))},${q(JSON.stringify(detail))});`);
  blob(s.id, "zip", zip);
  blob(s.id, "icon", new Uint8Array(readFileSync(join(dir, s.icon))));
}
for (const a of ag.agents) {
  const summary = {
    id: a.id, name: a.name, title: a.title, description: a.description, creatorName,
    category: a.category, creatorAvatarUrl: null, version: a.version, installs: 0, featured: !!a.featured, verified: true,
    avatarSeed: a.avatarSeed, avatarHue: a.avatarHue ?? null, avatarUrl: null,
    skillCount: a.skills.length, routineCount: a.routines.length,
    activeRoutineCount: a.routines.filter((r: { active?: boolean }) => r.active).length,
    updatedAt: new Date(now).toISOString(),
  };
  const detail = { ...summary, versionId: a.versionId, cardUrl: null, skills: a.skills, routines: a.routines };
  out.push(`INSERT INTO catalog_items(id,kind,slug,version_id,name,description,category,featured,installs,updated_at,summary,detail) VALUES(${q(a.id)},'agent',${q(a.slug)},${q(a.versionId)},${q(a.name)},${q(a.description)},${q(a.category)},${a.featured ? 1 : 0},0,${now},${q(JSON.stringify(summary))},${q(JSON.stringify(detail))});`);
}
process.stdout.write(`${out.join("\n")}\n`);
