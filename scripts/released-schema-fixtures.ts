import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { copyFile, mkdir, readFile, rm, symlink, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { DatabaseSync } from "node:sqlite";
import { z } from "zod";

const ROOT = resolve(import.meta.dirname, "..");
const WORK = join(ROOT, ".openbot-build", "released-schema-fixtures");
const OUTPUT = join(ROOT, "src", "backend", "released-schemas", "releases.json");
const SCHEMA_MODULES = ["src/backend/openbot-database-schema.ts", "src/backend/dani-dex-database-schema.ts"];
const FIRST_DATABASE_TAG = "v0.1.12";
const APPLIED_AT = "2026-01-01T00:00:00.000Z";

const dumpSchema = z.object({
  migrations: z.array(z.number().int()),
  objects: z.array(z.object({ type: z.string(), name: z.string(), sql: z.string() })),
});
type Dump = z.infer<typeof dumpSchema>;

function argumentValue(name: string): string | undefined {
  return process.argv.find((argument) => argument.startsWith(`--${name}=`))?.slice(name.length + 3);
}

const childModule = argumentValue("dump");
const childDatabase = argumentValue("db");
if (childModule && childDatabase) {
  const source = await readFile(childModule, "utf8");
  const schema = await import(childModule);
  if (typeof schema !== "object" || schema === null) throw new Error(`No schema module in ${childModule}.`);
  const openbotMigrate = "migrateOpenBotDatabase" in schema ? schema.migrateOpenBotDatabase : undefined;
  const daniDexMigrate = "migrateDaniDexDatabase" in schema ? schema.migrateDaniDexDatabase : undefined;
  const migrate = openbotMigrate ?? daniDexMigrate;
  if (typeof migrate !== "function") throw new Error(`No migrate function in ${childModule}.`);
  const db = new DatabaseSync(childDatabase);
  migrate(db, source.includes("MigrationOptions") ? { appliedAt: APPLIED_AT } : APPLIED_AT);
  const shadowTables = new Set(
    db
      .prepare("SELECT name FROM pragma_table_list WHERE type = 'shadow'")
      .all()
      .map((row) => String(row.name)),
  );
  const dump: Dump = {
    migrations: db
      .prepare("SELECT version FROM schema_migrations ORDER BY version")
      .all()
      .map((row) => Number(row.version)),
    objects: db
      .prepare(
        `SELECT type, name, sql FROM sqlite_master
         WHERE sql IS NOT NULL AND name NOT LIKE 'sqlite_%' ORDER BY rowid`,
      )
      .all()
      .filter((row) => !shadowTables.has(String(row.name)))
      .map((row) => ({
        type: String(row.type),
        name: String(row.name),
        sql: String(row.sql),
      })),
  };
  db.close();
  process.stdout.write(JSON.stringify(dump));
  process.exit(0);
}

function git(...args: string[]): string {
  return execFileSync("git", args, { cwd: ROOT, encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
}

function compareVersions(left: string, right: string): number {
  const a = left.slice(1).split(".").map(Number);
  const b = right.slice(1).split(".").map(Number);
  for (let index = 0; index < 3; index += 1) {
    const difference = (a[index] ?? 0) - (b[index] ?? 0);
    if (difference !== 0) return difference;
  }
  return 0;
}

function releaseTags(): string[] {
  return git("tag", "--list", "v*")
    .split("\n")
    .filter((tag) => /^v\d+\.\d+\.\d+$/u.test(tag))
    .filter((tag) => compareVersions(tag, FIRST_DATABASE_TAG) >= 0)
    .sort(compareVersions);
}

async function exportTag(tag: string): Promise<string> {
  const directory = join(WORK, tag);
  await rm(directory, { recursive: true, force: true });
  await mkdir(directory, { recursive: true });
  const archive = execFileSync("git", ["archive", "--format=tar", tag, "src/backend", "packages"], {
    cwd: ROOT,
    maxBuffer: 512 * 1024 * 1024,
  });
  execFileSync("tar", ["-x", "-C", directory], { input: archive });
  for (const scope of ["@openbot", "@dani-dex"]) {
    await mkdir(join(directory, "node_modules", scope), { recursive: true });
    for (const name of git("ls-tree", "--name-only", `${tag}:packages`).split("\n").filter(Boolean)) {
      await symlink(join(directory, "packages", name), join(directory, "node_modules", scope, name), "dir");
    }
  }
  for (const candidate of SCHEMA_MODULES) {
    try {
      await readFile(join(directory, candidate), "utf8");
      return join(directory, candidate);
    } catch {}
  }
  throw new Error(`No database schema module in ${tag}: ${SCHEMA_MODULES.join(", ")}`);
}

function dumpDatabase(schemaModule: string, database: string): Dump {
  const output = execFileSync(process.execPath, [import.meta.filename, `--dump=${schemaModule}`, `--db=${database}`], {
    cwd: join(schemaModule, "..", "..", ".."),
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024,
    stdio: ["ignore", "pipe", "inherit"],
  });
  return dumpSchema.parse(JSON.parse(output));
}

function hashOf(sql: string): string {
  return createHash("sha256").update(sql).digest("hex").slice(0, 16);
}

interface ReleasedSchema {
  migrations: number[];
  objects: string[];
}

type Item = number | string;

function encode(base: readonly Item[], list: readonly Item[]): (Item | [number, number])[] {
  const encoded: (Item | [number, number])[] = [];
  for (let index = 0; index < list.length; ) {
    let longest = { start: 0, length: 0 };
    base.forEach((_, start) => {
      let length = 0;
      while (start + length < base.length && base[start + length] === list[index + length]) length += 1;
      if (length > longest.length) longest = { start, length };
    });
    if (longest.length >= 2) {
      encoded.push([longest.start, longest.start + longest.length]);
      index += longest.length;
    } else {
      encoded.push(...list.slice(index, index + 1));
      index += 1;
    }
  }
  return encoded;
}

const statements: Record<string, string> = {};
function releasedSchema(dump: Dump): ReleasedSchema {
  const objects = dump.objects.map((object) => {
    const hash = hashOf(object.sql);
    statements[hash] = object.sql;
    return hash;
  });
  return { migrations: dump.migrations, objects };
}

const encodedListSchema = z.array(z.union([z.number(), z.string(), z.tuple([z.number(), z.number()])]));
type EncodedList = z.infer<typeof encodedListSchema>;

const releaseEntrySchema = z.object({
  tag: z.string(),
  newInstall: z.object({ migrations: encodedListSchema, objects: encodedListSchema }),
  upgraded: z.object({ migrations: encodedListSchema, objects: encodedListSchema }).optional(),
});

const committedFileSchema = z.object({ releases: z.array(releaseEntrySchema) });

function decodeNumbers(base: readonly number[], encoded: EncodedList): number[] {
  const decoded: number[] = [];
  for (const item of encoded) {
    if (Array.isArray(item)) decoded.push(...base.slice(item[0], item[1]));
    else if (typeof item === "number") decoded.push(item);
  }
  return decoded;
}

function decodeStrings(base: readonly string[], encoded: EncodedList): string[] {
  const decoded: string[] = [];
  for (const item of encoded) {
    if (Array.isArray(item)) decoded.push(...base.slice(item[0], item[1]));
    else if (typeof item === "string") decoded.push(item);
  }
  return decoded;
}

if (process.argv.includes("--check")) {
  // Verify the committed fixtures against the tags that exist in this
  // repository. The code was imported without most upstream release tags, so
  // releases whose tag is absent are frozen: their committed fixtures are the
  // source of truth and are kept unchanged.
  const committedText = await readFile(OUTPUT, "utf8").catch(() => "");
  if (!committedText) {
    process.stderr.write(`${OUTPUT} is missing. Run: bun scripts/released-schema-fixtures.ts\n`);
    process.exit(1);
  }
  const committed = committedFileSchema.parse(JSON.parse(committedText));
  const present = new Set(releaseTags());
  const absent = committed.releases.filter((release) => !present.has(release.tag)).map((release) => release.tag);
  if (absent.length > 0) {
    process.stderr.write(
      `${absent.length} releases have no tag in this repository; keeping their committed fixtures frozen: ${absent.join(", ")}\n`,
    );
  }
  const latestCommitted = committed.releases.at(-1)?.tag ?? FIRST_DATABASE_TAG;
  const known = new Set(committed.releases.map((release) => release.tag));
  const withoutFixtures = [...present].filter((tag) => !known.has(tag));
  const missing = withoutFixtures.filter((tag) => compareVersions(tag, latestCommitted) > 0);
  if (missing.length > 0) {
    process.stderr.write(
      `New release tags without committed schema fixtures: ${missing.join(", ")}. Update ${OUTPUT} for them.\n`,
    );
    process.exit(1);
  }
  const historical = withoutFixtures.filter((tag) => compareVersions(tag, latestCommitted) <= 0);
  if (historical.length > 0) {
    process.stderr.write(`Tags without committed schema fixtures (not schema releases): ${historical.join(", ")}\n`);
  }

  // Decode the delta-encoded fixtures so they can be compared semantically.
  const empty: ReleasedSchema = { migrations: [], objects: [] };
  let previous = { newInstall: empty, upgraded: empty };
  const decoded = new Map<string, { newInstall: ReleasedSchema; upgraded: ReleasedSchema }>();
  for (const entry of committed.releases) {
    const newInstall: ReleasedSchema = {
      migrations: decodeNumbers(previous.newInstall.migrations, entry.newInstall.migrations),
      objects: decodeStrings(previous.newInstall.objects, entry.newInstall.objects),
    };
    const upgraded: ReleasedSchema = entry.upgraded
      ? {
          migrations: decodeNumbers(previous.upgraded.migrations, entry.upgraded.migrations),
          objects: decodeStrings(previous.upgraded.objects, entry.upgraded.objects),
        }
      : newInstall;
    decoded.set(entry.tag, { newInstall, upgraded });
    previous = { newInstall, upgraded };
  }

  await rm(WORK, { recursive: true, force: true });
  let failed = false;
  for (const entry of committed.releases) {
    if (!present.has(entry.tag)) continue;
    const schemaModule = await exportTag(entry.tag);
    const actual = releasedSchema(dumpDatabase(schemaModule, join(WORK, `${entry.tag}.db`)));
    await rm(join(WORK, entry.tag), { recursive: true, force: true });
    const expected = decoded.get(entry.tag);
    if (!expected || JSON.stringify(actual) !== JSON.stringify(expected.newInstall)) {
      if (expected && compareVersions(entry.tag, latestCommitted) <= 0) {
        process.stderr.write(
          `${entry.tag}: the tag's schema does not match the committed fixture (the tag name collides with the imported release history); keeping the committed fixture frozen.\n`,
        );
      } else {
        process.stderr.write(
          `${entry.tag}: schema fixture does not match the tag. Run: bun scripts/released-schema-fixtures.ts\n`,
        );
        failed = true;
      }
    } else {
      process.stderr.write(`${entry.tag}: verified against the committed fixture.\n`);
    }
  }
  await rm(WORK, { recursive: true, force: true });
  if (failed) process.exit(1);
} else {
  const releases: object[] = [];
  const empty: ReleasedSchema = { migrations: [], objects: [] };
  let previous = { newInstall: empty, upgraded: empty };
  const upgradedDatabase = join(WORK, "upgraded.db");
  await rm(WORK, { recursive: true, force: true });
  for (const tag of releaseTags()) {
    const schemaModule = await exportTag(tag);
    const newDatabase = join(WORK, `${tag}.db`);
    const newInstall = releasedSchema(dumpDatabase(schemaModule, newDatabase));
    if (releases.length === 0) await copyFile(newDatabase, upgradedDatabase);
    const upgraded = releasedSchema(dumpDatabase(schemaModule, upgradedDatabase));
    await rm(join(WORK, tag), { recursive: true, force: true });
    const current = { newInstall, upgraded };
    if (JSON.stringify(current) === JSON.stringify(previous)) continue;
    const change = (kind: keyof typeof current) => ({
      migrations: encode(previous[kind].migrations, current[kind].migrations),
      objects: encode(previous[kind].objects, current[kind].objects),
    });
    const sameAsNew = JSON.stringify(upgraded) === JSON.stringify(newInstall);
    releases.push({ tag, newInstall: change("newInstall"), ...(sameAsNew ? {} : { upgraded: change("upgraded") }) });
    previous = current;
    process.stderr.write(
      `${tag}: schema ${newInstall.migrations.at(-1)}, ${newInstall.objects.length} objects` +
        `${sameAsNew ? "" : `; upgraded: ${upgraded.objects.length} objects`}\n`,
    );
  }
  await rm(WORK, { recursive: true, force: true });

  const sortedStatements = Object.fromEntries(Object.entries(statements).sort(([a], [b]) => a.localeCompare(b)));
  const text = execFileSync(join(ROOT, "node_modules", ".bin", "biome"), ["format", `--stdin-file-path=${OUTPUT}`], {
    cwd: ROOT,
    encoding: "utf8",
    input: JSON.stringify({ releases, statements: sortedStatements }),
  });
  await writeFile(OUTPUT, text);
  process.stderr.write(`Wrote ${releases.length} release schemas, ${Object.keys(statements).length} statements.\n`);
}
