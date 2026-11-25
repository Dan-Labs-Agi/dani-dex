// Dani Dex account + sync Worker. One Google account = one user id on mobile and desktop.
// Secrets and provider tokens are never synced: kinds below are the only accepted ones.
import { PRIVACY_HTML, TERMS_HTML } from "./legal";
import { emailStart, emailVerify } from "./emailcode";
import { handleRemote, SignalRoom, type REnv } from "./remote";
export { SignalRoom };
export interface Env extends REnv {
  DB: D1Database;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  STATE_SECRET: string;
  RESEND_API_KEY?: string;
  MAIL_FROM?: string;
}

const CALLBACK = "https://auth.dani.danlab.dev/v1/google/callback";
const SYNC_KINDS = new Set(["settings", "agent", "provider-config", "conversation"]);
const SESSION_TTL = 60 * 60 * 24 * 90;
const MAX_RECORD_BYTES = 512 * 1024;

const enc = new TextEncoder();
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });

function b64url(buf: ArrayBuffer | Uint8Array): string {
  const b = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
  let s = "";
  for (const c of b) s += String.fromCharCode(c);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
async function sha256(s: string): Promise<string> {
  return b64url(await crypto.subtle.digest("SHA-256", enc.encode(s)));
}
async function hmac(secret: string, data: string): Promise<string> {
  const k = await crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return b64url(await crypto.subtle.sign("HMAC", k, enc.encode(data)));
}
function allowedRedirect(r: string): boolean {
  if (r.startsWith("dani-dex://")) return true;
  try {
    const u = new URL(r);
    return u.protocol === "http:" && (u.hostname === "127.0.0.1" || u.hostname === "localhost");
  } catch {
    return false;
  }
}
const now = () => Math.floor(Date.now() / 1000);

async function authUser(req: Request, env: Env): Promise<string | null> {
  const h = req.headers.get("authorization") || "";
  if (!h.startsWith("Bearer ")) return null;
  const row = await env.DB.prepare("SELECT user_id FROM sessions WHERE token_hash=? AND expires_at>?")
    .bind(await sha256(h.slice(7)), now()).first<{ user_id: string }>();
  return row ? row.user_id : null;
}

async function googleAuthUrl(env: Env, extra: Record<string, unknown>, hint?: string): Promise<string> {
  const payload = b64url(enc.encode(JSON.stringify({ ...extra, n: crypto.randomUUID(), t: now() })));
  const state = `${payload}.${await hmac(env.STATE_SECRET, payload)}`;
  const g = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  const q: Record<string, string> = {
    client_id: env.GOOGLE_CLIENT_ID, redirect_uri: CALLBACK, response_type: "code",
    scope: "openid email profile", state, prompt: "select_account",
  };
  if (hint) q.login_hint = hint;
  g.search = new URLSearchParams(q).toString();
  return g.toString();
}

async function googleStart(url: URL, env: Env): Promise<Response> {
  const redirect = url.searchParams.get("redirect") || "";
  if (!allowedRedirect(redirect)) return json({ error: "bad_redirect" }, 400);
  return Response.redirect(await googleAuthUrl(env, { r: redirect }), 302);
}

const apiError = (status: number, code: string, message: string) => json({ error: { code, message } }, status);

// Desktop sign-in. The app only knows "email code" and "company browser sign-in" (PKCE).
// Every email goes to the browser flow, which signs in with Google.
async function companyStart(req: Request, env: Env): Promise<Response> {
  const b = (await req.json().catch(() => null)) as any;
  if (!b || typeof b.returnTo !== "string" || typeof b.clientState !== "string" || typeof b.clientChallenge !== "string")
    return apiError(400, "invalid_request", "Invalid sign-in request.");
  if (!allowedRedirect(b.returnTo) || b.clientChallenge.length < 20 || b.clientChallenge.length > 128)
    return apiError(400, "invalid_request", "Invalid sign-in request.");
  const email = typeof b.email === "string" ? b.email.trim() : "";
  const authorizationUrl = await googleAuthUrl(env, { r: b.returnTo, k: "c", cs: b.clientState, cc: b.clientChallenge }, email || undefined);
  return json({ authorizationUrl });
}

async function companyExchange(req: Request, env: Env): Promise<Response> {
  const b = (await req.json().catch(() => null)) as any;
  if (!b || typeof b.code !== "string" || typeof b.codeVerifier !== "string")
    return apiError(400, "invalid_request", "Invalid sign-in request.");
  const [payload, sig] = b.code.split(".");
  if (!payload || !sig || (await hmac(env.STATE_SECRET, payload)) !== sig)
    return apiError(400, "invalid_code", "That sign-in code is not valid. Try again.");
  const c = JSON.parse(new TextDecoder().decode(Uint8Array.from(atob(payload.replace(/-/g, "+").replace(/_/g, "/")), (x) => x.charCodeAt(0))));
  if (c.x !== "code" || now() > c.e) return apiError(400, "code_expired", "That sign-in code expired. Try again.");
  if ((await sha256(b.codeVerifier)) !== c.cc) return apiError(400, "invalid_code", "That sign-in code is not valid. Try again.");
  const u = await env.DB.prepare("SELECT id,email,name FROM users WHERE id=?").bind(c.u).first<any>();
  if (!u) return apiError(400, "invalid_code", "That sign-in code is not valid. Try again.");
  const session = b64url(crypto.getRandomValues(new Uint8Array(32)));
  await env.DB.prepare("INSERT INTO sessions(token_hash,user_id,created_at,expires_at) VALUES(?,?,?,?)")
    .bind(await sha256(session), u.id, now(), now() + SESSION_TTL).run();
  return json({ sessionToken: session, user: { id: u.id, email: u.email, name: u.name ?? null, avatarUrl: null, analyticsEnabled: null } });
}

async function googleCallback(url: URL, env: Env): Promise<Response> {
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state") || "";
  const [payload, sig] = state.split(".");
  if (!payload || !sig || (await hmac(env.STATE_SECRET, payload)) !== sig) return json({ error: "bad_state" }, 400);
  const st = JSON.parse(new TextDecoder().decode(Uint8Array.from(atob(payload.replace(/-/g, "+").replace(/_/g, "/")), (c) => c.charCodeAt(0))));
  if (now() - st.t > 600 || !allowedRedirect(st.r)) return json({ error: "expired_state" }, 400);
  const back = (params: Record<string, string>) => {
    const r = new URL(st.r);
    for (const [k, v] of Object.entries(params)) r.searchParams.set(k, v);
    return Response.redirect(r.toString(), 302);
  };
  if (!code) return st.k === "c" ? back({ error: "access_denied", state: st.cs }) : json({ error: "bad_state" }, 400);
  const tok = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code, client_id: env.GOOGLE_CLIENT_ID, client_secret: env.GOOGLE_CLIENT_SECRET,
      redirect_uri: CALLBACK, grant_type: "authorization_code",
    }),
  });
  if (!tok.ok) return st.k === "c" ? back({ error: "google_exchange_failed", state: st.cs }) : json({ error: "google_exchange_failed" }, 502);
  const { id_token } = (await tok.json()) as { id_token: string };
  // id_token came straight from Google over TLS in the code exchange; decode claims.
  const claims = JSON.parse(atob(id_token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
  if (claims.aud !== env.GOOGLE_CLIENT_ID || !claims.sub || claims.email_verified === false) return json({ error: "bad_token" }, 401);
  let user = await env.DB.prepare("SELECT id FROM users WHERE google_sub=?").bind(claims.sub).first<{ id: string }>();
  if (!user) {
    const byEmail = await env.DB.prepare("SELECT id FROM users WHERE lower(email)=? AND google_sub LIKE 'email:%' LIMIT 1")
      .bind(String(claims.email).toLowerCase()).first<{ id: string }>();
    if (byEmail) {
      await env.DB.prepare("UPDATE users SET google_sub=?, name=COALESCE(name,?) WHERE id=?").bind(claims.sub, claims.name ?? null, byEmail.id).run();
      user = byEmail;
    }
  }
  if (!user) {
    const id = crypto.randomUUID();
    await env.DB.prepare("INSERT INTO users(id,google_sub,email,name,created_at) VALUES(?,?,?,?,?)")
      .bind(id, claims.sub, claims.email, claims.name ?? null, now()).run();
    user = { id };
  }
  if (st.k === "c") {
    const cp = b64url(enc.encode(JSON.stringify({ x: "code", u: user.id, cc: st.cc, e: now() + 120, n: crypto.randomUUID() })));
    return back({ code: `${cp}.${await hmac(env.STATE_SECRET, cp)}`, state: st.cs });
  }
  const session = b64url(crypto.getRandomValues(new Uint8Array(32)));
  await env.DB.prepare("INSERT INTO sessions(token_hash,user_id,created_at,expires_at) VALUES(?,?,?,?)")
    .bind(await sha256(session), user.id, now(), now() + SESSION_TTL).run();
  const sep = st.r.includes("#") ? "&" : "#";
  return Response.redirect(`${st.r}${sep}token=${session}`, 302);
}

export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    const url = new URL(req.url);
    const p = url.pathname;
    if (p === "/healthz") return json({ ok: true });
    if (p === "/v1/releases" && req.method === "GET") {
      // Public release feed for the landing page and in-app updater (CORS open, read only).
      const cors = { "access-control-allow-origin": "*", "cache-control": "public, max-age=60" };
      const r = await fetch("https://dl.dani.danlab.dev/latest.json", { cf: { cacheTtl: 30 } } as RequestInit);
      if (!r.ok) return new Response(JSON.stringify({ platforms: {} }), { headers: { ...cors, "content-type": "application/json" } });
      return new Response(await r.text(), { headers: { ...cors, "content-type": "application/json" } });
    }
    if ((p === "/privacy" || p === "/terms") && req.method === "GET")
      return new Response(p === "/privacy" ? PRIVACY_HTML : TERMS_HTML, { headers: { "content-type": "text/html; charset=utf-8", "cache-control": "public, max-age=3600" } });
    if (p === "/v1/google/start" && req.method === "GET") return googleStart(url, env);
    if (p === "/v1/google/callback" && req.method === "GET") return googleCallback(url, env);
    if (p === "/v1/auth/email/start" && req.method === "POST")
      return emailStart(req, env, json, apiError);
    if (p === "/v1/auth/email/verify" && req.method === "POST") return emailVerify(req, env, json, apiError);
    if (p === "/v1/auth/company/start" && req.method === "POST") return companyStart(req, env);
    if (p === "/v1/auth/company/exchange" && req.method === "POST") return companyExchange(req, env);

    const uid = await authUser(req, env);
    const bearer = (req.headers.get("authorization") || "").slice(7);
    const rr = await handleRemote(req, env, url, uid, bearer);
    if (rr) return rr;
    if (!uid) return apiError(401, "unauthorized", "Sign in to continue.");

    if (p === "/v1/me") {
      const u = await env.DB.prepare("SELECT id,email,name FROM users WHERE id=?").bind(uid).first<any>();
      return json({ id: u.id, email: u.email, name: u.name ?? null, avatarUrl: null, analyticsEnabled: null });
    }
    if ((p === "/v1/logout" || p === "/v1/auth/logout") && req.method === "POST") {
      await env.DB.prepare("DELETE FROM sessions WHERE token_hash=?")
        .bind(await sha256((req.headers.get("authorization") || "").slice(7))).run();
      return p === "/v1/auth/logout" ? new Response(null, { status: 204 }) : json({ ok: true });
    }
    // Full restore (all live records) or incremental changes since a timestamp.
    if (p === "/v1/restore" || (p === "/v1/sync" && req.method === "GET")) {
      const since = p === "/v1/restore" ? 0 : Number(url.searchParams.get("since") || 0);
      const rs = await env.DB.prepare(
        "SELECT kind,id,data,version,deleted,updated_at FROM sync_records WHERE user_id=? AND updated_at>? ORDER BY updated_at LIMIT 5000")
        .bind(uid, since).all();
      const rows = (rs.results as any[]).filter((r) => p !== "/v1/restore" || !r.deleted);
      return json({ records: rows, server_time: now() });
    }
    const m = p.match(/^\/v1\/sync\/([a-z-]+)\/([A-Za-z0-9._:-]{1,128})$/);
    if (m && (req.method === "PUT" || req.method === "DELETE")) {
      const [, kind, id] = m;
      if (!SYNC_KINDS.has(kind)) return json({ error: "kind_not_synced" }, 400);
      const cur = await env.DB.prepare("SELECT version FROM sync_records WHERE user_id=? AND kind=? AND id=?")
        .bind(uid, kind, id).first<{ version: number }>();
      let data: string | null = null;
      let clientVersion = 0;
      if (req.method === "PUT") {
        const body = await req.text();
        if (body.length > MAX_RECORD_BYTES) return json({ error: "too_large" }, 413);
        const parsed = JSON.parse(body) as { data: unknown; version?: number };
        data = JSON.stringify(parsed.data);
        clientVersion = parsed.version ?? 0;
      }
      // last-write-wins on a monotonically increasing server version
      const version = Math.max(cur?.version ?? 0, clientVersion) + 1;
      await env.DB.prepare(
        "INSERT INTO sync_records(user_id,kind,id,data,version,deleted,updated_at) VALUES(?,?,?,?,?,?,?) " +
        "ON CONFLICT(user_id,kind,id) DO UPDATE SET data=excluded.data,version=excluded.version,deleted=excluded.deleted,updated_at=excluded.updated_at")
        .bind(uid, kind, id, data, version, req.method === "DELETE" ? 1 : 0, now()).run();
      return json({ version });
    }
    return json({ error: "not_found" }, 404);
  },
};
