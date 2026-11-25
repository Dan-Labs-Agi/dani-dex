// biome-ignore-all lint/nursery/noUnsafeTypeAssertion: untyped account service payloads, typed contracts pending
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import {
  DANI_ACCOUNT_ORIGIN,
  type DaniAccountSyncKind,
  type DaniAccountSyncPage,
  type DaniAccountSyncRecord,
  type DaniAccountUser,
  daniAccountGoogleStartUrl,
  isDaniAccountSyncKind,
} from "@openbot/contracts/dani-account";
import { createOpenBotLogger } from "@openbot/logging";
import { app, shell } from "electron";

const logger = createOpenBotLogger("dani-account");

// Dani account sign-in and sync client for the desktop. The session token
// arrives on the dani-dex://auth deep link after Google sign-in in the
// system browser and is kept in the user data directory. Records pulled
// from the backend are persisted to dani-account-restore.json; applying
// them to the live stores per kind is wired up separately.

interface DaniAccountSession {
  token: string;
  user: DaniAccountUser;
}

let session: DaniAccountSession | null = null;

function sessionPath(): string {
  return join(app.getPath("userData"), "dani-account-session.json");
}

function restorePath(): string {
  return join(app.getPath("userData"), "dani-account-restore.json");
}

async function readSession(): Promise<DaniAccountSession | null> {
  if (session) return session;
  try {
    const parsed = JSON.parse(await readFile(sessionPath(), "utf8")) as DaniAccountSession;
    if (typeof parsed.token === "string" && parsed.user && typeof parsed.user.id === "string") {
      session = parsed;
      return session;
    }
  } catch {}
  return null;
}

async function writeSession(next: DaniAccountSession | null): Promise<void> {
  session = next;
  const path = sessionPath();
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, JSON.stringify(next), "utf8");
}

async function accountFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const current = await readSession();
  if (!current) throw new Error("Not signed in to the Dani account.");
  const response = await fetch(new URL(path, DANI_ACCOUNT_ORIGIN), {
    ...init,
    headers: { authorization: `Bearer ${current.token}`, "content-type": "application/json", ...init.headers },
    signal: AbortSignal.timeout(30_000),
  });
  if (!response.ok) throw new Error(`Dani account request ${path} failed with ${response.status}.`);
  return response;
}

// Opens Google sign-in in the system browser. Completion arrives as a
// dani-dex://auth deep link handled by receiveDaniAccountAuthToken.
export async function startDaniAccountSignIn(): Promise<void> {
  await shell.openExternal(daniAccountGoogleStartUrl());
}

// Handles the sign-in deep link: persists the session and pulls a full
// restore so a fresh install has everything the backend holds.
export async function receiveDaniAccountAuthToken(token: string): Promise<void> {
  session = { token, user: { id: "", email: null, name: null } };
  const response = await accountFetch("/v1/me");
  const user = (await response.json()) as DaniAccountUser;
  await writeSession({ token, user });
  logger.info(`Signed in to the Dani account as ${user.email ?? user.id}.`);
  const records = await restoreDaniAccount();
  logger.info(`Dani account restore pulled ${records.length} record(s).`);
}

export async function restoreDaniAccount(): Promise<DaniAccountSyncRecord[]> {
  const response = await accountFetch("/v1/restore");
  const page = (await response.json()) as DaniAccountSyncPage;
  await writeFile(restorePath(), JSON.stringify(page), "utf8");
  return page.records;
}

export async function syncDaniAccountSince(since: number): Promise<DaniAccountSyncPage> {
  const response = await accountFetch(`/v1/sync?since=${Math.floor(since)}`);
  return (await response.json()) as DaniAccountSyncPage;
}

export async function putDaniAccountSyncRecord(
  kind: DaniAccountSyncKind,
  id: string,
  data: unknown,
  version = 0,
): Promise<number> {
  if (!isDaniAccountSyncKind(kind)) throw new Error(`Kind ${kind} is not synced.`);
  const response = await accountFetch(`/v1/sync/${kind}/${encodeURIComponent(id)}`, {
    method: "PUT",
    body: JSON.stringify({ data, version }),
  });
  return ((await response.json()) as { version: number }).version;
}

export async function deleteDaniAccountSyncRecord(kind: DaniAccountSyncKind, id: string): Promise<number> {
  if (!isDaniAccountSyncKind(kind)) throw new Error(`Kind ${kind} is not synced.`);
  const response = await accountFetch(`/v1/sync/${kind}/${encodeURIComponent(id)}`, { method: "DELETE" });
  return ((await response.json()) as { version: number }).version;
}

export async function signOutDaniAccount(): Promise<void> {
  try {
    await accountFetch("/v1/logout", { method: "POST" });
  } finally {
    await writeSession(null);
  }
}
