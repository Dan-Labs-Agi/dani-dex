// Email-code sign-in. The desktop and mobile apps already speak this protocol:
// POST /v1/auth/email/start -> { challengeId, expiresAt, resendAt }
// POST /v1/auth/email/verify -> { sessionToken, user }
export interface EmailEnv {
  DB: D1Database;
  RESEND_API_KEY?: string;
  MAIL_FROM?: string;
  STATE_SECRET: string;
}
type Json = (b: unknown, s?: number) => Response;
type Err = (s: number, c: string, m: string) => Response;
const enc = new TextEncoder();
const now = () => Math.floor(Date.now() / 1000);
const CODE_TTL = 600;
const RESEND_GAP = 45;
const MAX_ATTEMPTS = 5;
const SESSION_TTL = 60 * 60 * 24 * 90;

function b64url(u: Uint8Array): string {
  let s = "";
  for (const c of u) s += String.fromCharCode(c);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
async function hashCode(env: EmailEnv, id: string, code: string): Promise<string> {
  const k = await crypto.subtle.importKey(
    "raw",
    enc.encode(env.STATE_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  return b64url(new Uint8Array(await crypto.subtle.sign("HMAC", k, enc.encode(`${id}:${code}`))));
}
async function sha256(s: string): Promise<string> {
  return b64url(new Uint8Array(await crypto.subtle.digest("SHA-256", enc.encode(s))));
}
function sixDigits(): string {
  const n = crypto.getRandomValues(new Uint32Array(1))[0] % 1000000;
  return String(n).padStart(6, "0");
}
const validEmail = (e: string) => e.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e);

function mailHtml(code: string): string {
  return `<div style="font-family:Arial,sans-serif;max-width:420px;margin:0 auto;padding:24px;color:#101416"><h2 style="margin:0 0 12px">Your Dani Dex code</h2><p style="font-size:34px;letter-spacing:8px;font-weight:700;margin:16px 0;background:#d7ff67;padding:12px 16px;border-radius:8px;display:inline-block">${code}</p><p style="color:#555">It works for 10 minutes. If you did not ask for it, ignore this email.</p></div>`;
}

export async function emailStart(req: Request, env: EmailEnv, json: Json, apiError: Err): Promise<Response> {
  const b = (await req.json().catch(() => null)) as any;
  const email = typeof b?.email === "string" ? b.email.trim().toLowerCase() : "";
  if (!validEmail(email)) return apiError(400, "invalid_email", "Enter a valid email address.");
  if (!env.RESEND_API_KEY)
    return apiError(503, "email_unavailable", "Email codes are not available right now. Use Continue with Google.");
  const recent = await env.DB.prepare(
    "SELECT created_at FROM email_challenges WHERE email=? AND created_at>? ORDER BY created_at DESC LIMIT 6",
  )
    .bind(email, now() - 3600)
    .all<{ created_at: number }>();
  const rows = recent.results ?? [];
  if (rows.length >= 6) return apiError(429, "rate_limited", "Too many codes requested. Try again later.");
  if (rows[0] && now() - rows[0].created_at < RESEND_GAP)
    return apiError(429, "rate_limited", "Wait a moment before asking for another code.");
  const id = crypto.randomUUID();
  const code = sixDigits();
  const expiresAt = now() + CODE_TTL;
  await env.DB.prepare("INSERT INTO email_challenges(id,email,code_hash,created_at,expires_at) VALUES(?,?,?,?,?)")
    .bind(id, email, await hashCode(env, id, code), now(), expiresAt)
    .run();
  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { authorization: `Bearer ${env.RESEND_API_KEY}`, "content-type": "application/json" },
    body: JSON.stringify({
      from: env.MAIL_FROM || "Dani Dex <login@mail.danlab.dev>",
      to: [email],
      subject: `${code} is your Dani Dex code`,
      html: mailHtml(code),
      text: `Your Dani Dex code is ${code}. It works for 10 minutes.`,
    }),
  });
  if (!r.ok) {
    await env.DB.prepare("DELETE FROM email_challenges WHERE id=?").bind(id).run();
    return apiError(502, "email_send_failed", "Could not send the code. Try again or use Continue with Google.");
  }
  return json({ challengeId: id, expiresAt: expiresAt * 1000, resendAt: (now() + RESEND_GAP) * 1000 });
}

export async function emailVerify(req: Request, env: EmailEnv, json: Json, apiError: Err): Promise<Response> {
  const b = (await req.json().catch(() => null)) as any;
  if (!b || typeof b.challengeId !== "string" || typeof b.code !== "string")
    return apiError(400, "invalid_request", "Invalid sign-in request.");
  const bad = () => apiError(400, "invalid_code", "That code is not right. Check it and try again.");
  const c = await env.DB.prepare("SELECT id,email,code_hash,attempts,expires_at,used FROM email_challenges WHERE id=?")
    .bind(b.challengeId)
    .first<any>();
  if (!c || c.used) return bad();
  if (now() > c.expires_at) return apiError(400, "sign_in_code_expired", "That code expired. Ask for a new one.");
  if (c.attempts >= MAX_ATTEMPTS) return apiError(429, "rate_limited", "Too many wrong tries. Ask for a new code.");
  await env.DB.prepare("UPDATE email_challenges SET attempts=attempts+1 WHERE id=?").bind(c.id).run();
  if ((await hashCode(env, c.id, b.code.trim())) !== c.code_hash) return bad();
  const used = await env.DB.prepare("UPDATE email_challenges SET used=1 WHERE id=? AND used=0").bind(c.id).run();
  if (!used.meta.changes) return bad();
  let u = await env.DB.prepare("SELECT id,email,name FROM users WHERE lower(email)=? ORDER BY created_at LIMIT 1")
    .bind(c.email)
    .first<any>();
  if (!u) {
    const id = crypto.randomUUID();
    await env.DB.prepare("INSERT INTO users(id,google_sub,email,name,created_at) VALUES(?,?,?,?,?)")
      .bind(id, `email:${c.email}`, c.email, null, now())
      .run();
    u = { id, email: c.email, name: null };
  }
  const session = b64url(crypto.getRandomValues(new Uint8Array(32)));
  await env.DB.prepare("INSERT INTO sessions(token_hash,user_id,created_at,expires_at) VALUES(?,?,?,?)")
    .bind(await sha256(session), u.id, now(), now() + SESSION_TTL)
    .run();
  return json({
    sessionToken: session,
    user: { id: u.id, email: u.email, name: u.name ?? null, avatarUrl: null, analyticsEnabled: null },
  });
}
