// biome-ignore-all lint/nursery/noUnsafeTypeAssertion: untyped account service payloads, typed contracts pending
// Dani account sign-in and sync over auth.dani.danlab.dev.
// One Google account maps to one user id across desktop and mobile.
// Secrets and provider tokens are never synced: only the kinds below cross devices.

export const DANI_ACCOUNT_ORIGIN = "https://auth.dani.danlab.dev";
export const DANI_ACCOUNT_AUTH_DEEP_LINK = "dani-dex://auth";

export const DANI_ACCOUNT_SYNC_KINDS = ["settings", "agent", "provider-config", "conversation"] as const;
export type DaniAccountSyncKind = (typeof DANI_ACCOUNT_SYNC_KINDS)[number];

export function isDaniAccountSyncKind(value: string): value is DaniAccountSyncKind {
  return (DANI_ACCOUNT_SYNC_KINDS as readonly string[]).includes(value);
}

export interface DaniAccountUser {
  id: string;
  email: string | null;
  name: string | null;
}

export interface DaniAccountSyncRecord {
  kind: DaniAccountSyncKind;
  id: string;
  data: unknown;
  version: number;
  deleted: 0 | 1;
  updated_at: number;
}

export interface DaniAccountSyncPage {
  records: DaniAccountSyncRecord[];
  server_time: number;
}

// Starts Google sign-in in the system browser. The Worker returns to
// the app with the session token in the deep link fragment.
export function daniAccountGoogleStartUrl(redirect: string = DANI_ACCOUNT_AUTH_DEEP_LINK): string {
  const url = new URL("/v1/google/start", DANI_ACCOUNT_ORIGIN);
  url.searchParams.set("redirect", redirect);
  return url.toString();
}

// Accepts dani-dex://auth#token=<session> (and the legacy openbot:// spelling
// while old installs are still around). Returns the session token, or null
// when the URL is not an account sign-in deep link.
export function parseDaniAccountAuthDeepLink(value: string): string | null {
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return null;
  }
  if (url.protocol !== "dani-dex:" && url.protocol !== "openbot:") return null;
  if (url.hostname !== "auth") return null;
  const match = url.hash.match(/^#token=([A-Za-z0-9._~-]+)$/);
  return match ? (match[1] ?? null) : null;
}
