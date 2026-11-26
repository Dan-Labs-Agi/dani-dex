// biome-ignore-all lint/suspicious/noExplicitAny: D1 rows are untyped in this service
// biome-ignore-all lint/nursery/noUnsafeTypeAssertion: D1 rows are untyped in this service
// Server invitations and members for published servers. Free: D1 plus the existing email sender.

interface Statement {
  first<T>(): Promise<T | null>;
  all<T>(): Promise<{ results: T[] }>;
  run(): Promise<unknown>;
}
interface BoundStatement extends Statement {
  bind(...values: unknown[]): Statement;
}
interface InviteDb {
  prepare(sql: string): BoundStatement;
}

export interface InviteEnv {
  DB: InviteDb;
  RESEND_API_KEY?: string;
  MAIL_FROM?: string;
}

const encoder = new TextEncoder();
async function sha256(value: string): Promise<string> {
  const digest = new Uint8Array(await crypto.subtle.digest("SHA-256", encoder.encode(value)));
  return Array.from(digest, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

const DAY_MS = 24 * 60 * 60 * 1000;
const PERMANENT_EXPIRES_AT = 8_640_000_000_000_000;
const json = (b: unknown, status = 200) =>
  new Response(JSON.stringify(b), { status, headers: { "content-type": "application/json" } });
const b64u = (b: Uint8Array) =>
  btoa(String.fromCharCode(...b))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
const token = () => b64u(crypto.getRandomValues(new Uint8Array(32)));
const validEmail = (e: string) => e.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e);
const roleOf = (v: unknown): "admin" | "member" | null => (v === "admin" || v === "member" ? v : null);

const ready = new WeakSet<object>();
async function ensureTables(db: InviteDb) {
  if (ready.has(db)) return;
  await db
    .prepare(
      "CREATE TABLE IF NOT EXISTS remote_invites (invite_id TEXT PRIMARY KEY, host_id TEXT NOT NULL, token_hash TEXT NOT NULL UNIQUE, role TEXT NOT NULL, email TEXT, permanent INTEGER NOT NULL DEFAULT 0, expires_at INTEGER NOT NULL, used_at INTEGER, revoked_at INTEGER, use_count INTEGER NOT NULL DEFAULT 0, created_at INTEGER NOT NULL)",
    )
    .run();
  await db.prepare("CREATE INDEX IF NOT EXISTS remote_invites_host ON remote_invites(host_id)").run();
  await db
    .prepare(
      "CREATE TABLE IF NOT EXISTS remote_members (membership_id TEXT PRIMARY KEY, host_id TEXT NOT NULL, user_id TEXT NOT NULL, role TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'active', created_at INTEGER NOT NULL, UNIQUE(host_id, user_id))",
    )
    .run();
  ready.add(db);
}

/** The caller's role on a host: the owner, or an active member. */
async function roleOnHost(db: InviteDb, hostId: string, uid: string): Promise<"owner" | "admin" | "member" | null> {
  const host = await db.prepare("SELECT user_id FROM remote_hosts WHERE host_id=?").bind(hostId).first<any>();
  if (!host) return null;
  if (host.user_id === uid) return "owner";
  const member = await db
    .prepare("SELECT role FROM remote_members WHERE host_id=? AND user_id=? AND status='active'")
    .bind(hostId, uid)
    .first<any>();
  return member ? (member.role as "admin" | "member") : null;
}

const inviteView = (i: any) => ({
  inviteId: i.invite_id,
  email: i.email ?? null,
  role: i.role,
  expiresAt: i.permanent ? PERMANENT_EXPIRES_AT : i.expires_at,
  usedAt: i.used_at ?? null,
  revokedAt: i.revoked_at ?? null,
  permanent: i.permanent === 1,
  useCount: i.use_count ?? 0,
});

function inviteMail(serverName: string, url: string): string {
  const name = serverName.replace(/[<>&"]/g, "");
  return `<div style="font-family:Arial,sans-serif;max-width:460px;margin:0 auto;padding:24px;color:#101416"><h2 style="margin:0 0 12px">You are invited to ${name} on Dani Dex</h2><p><a href="${url}" style="background:#d7ff67;color:#101416;padding:12px 18px;border-radius:8px;text-decoration:none;font-weight:700;display:inline-block">Open invitation</a></p><p style="color:#555">If you did not expect this, ignore this email.</p></div>`;
}

export async function handleRemoteInvites(
  req: Request,
  env: InviteEnv,
  url: URL,
  uid: string | null,
): Promise<Response | null> {
  const p = url.pathname.replace(/\/+$/u, "");
  const m = req.method;
  const mine = /^\/v2\/remote\/(hosts|invites)|^\/v1\/team-invitations\/email$/u.test(p);
  if (!mine) return null;
  const body = async (): Promise<any> => req.json().catch(() => ({}));

  if (p === "/v2/remote/invites/preview" && m === "POST") {
    await ensureTables(env.DB);
    const b = await body();
    if (typeof b.token !== "string" || b.token.length < 16) return json({ error: "invalid_invitation" }, 400);
    const inv = await env.DB.prepare("SELECT * FROM remote_invites WHERE token_hash=?")
      .bind(await sha256(b.token))
      .first<any>();
    if (!inv || inv.revoked_at || (!inv.permanent && (inv.used_at || inv.expires_at < Date.now())))
      return json({ error: "invitation_unavailable" }, 404);
    const host = await env.DB.prepare("SELECT name, device_public_key FROM remote_hosts WHERE host_id=?")
      .bind(inv.host_id)
      .first<any>();
    if (!host) return json({ error: "invitation_unavailable" }, 404);
    return json({
      inviteId: inv.invite_id,
      hostId: inv.host_id,
      hostName: host.name,
      role: inv.role,
      expiresAt: inv.permanent ? PERMANENT_EXPIRES_AT : inv.expires_at,
      emailBound: Boolean(inv.email),
      permanent: inv.permanent === 1,
      devicePublicKey: host.device_public_key ?? null,
    });
  }

  if (!uid) return json({ error: "unauthorized" }, 401);
  await ensureTables(env.DB);

  if (p === "/v2/remote/invites/accept" && m === "POST") {
    const b = await body();
    if (typeof b.token !== "string") return json({ error: "invalid_invitation" }, 400);
    const inv = await env.DB.prepare("SELECT * FROM remote_invites WHERE token_hash=?")
      .bind(await sha256(b.token))
      .first<any>();
    if (!inv || inv.revoked_at || (!inv.permanent && (inv.used_at || inv.expires_at < Date.now())))
      return json({ error: "invitation_unavailable" }, 404);
    const user = await env.DB.prepare("SELECT email FROM users WHERE id=?").bind(uid).first<any>();
    if (inv.email && String(user?.email ?? "").toLowerCase() !== String(inv.email).toLowerCase())
      return json({ error: "invitation_email_mismatch" }, 403);
    const host = await env.DB.prepare("SELECT user_id, membership_id FROM remote_hosts WHERE host_id=?")
      .bind(inv.host_id)
      .first<any>();
    if (!host) return json({ error: "invitation_unavailable" }, 404);
    if (host.user_id === uid) return json({ hostId: inv.host_id, membershipId: host.membership_id, role: "admin" });
    const existing = await env.DB.prepare(
      "SELECT membership_id, role, status FROM remote_members WHERE host_id=? AND user_id=?",
    )
      .bind(inv.host_id, uid)
      .first<any>();
    let membershipId = existing?.membership_id as string | undefined;
    let role = inv.role as "admin" | "member";
    if (existing) {
      if (existing.status === "active") role = existing.role;
      else
        await env.DB.prepare("UPDATE remote_members SET status='active', role=? WHERE membership_id=?")
          .bind(role, membershipId)
          .run();
    } else {
      membershipId = crypto.randomUUID();
      await env.DB.prepare(
        "INSERT INTO remote_members(membership_id,host_id,user_id,role,status,created_at) VALUES(?,?,?,?, 'active', ?)",
      )
        .bind(membershipId, inv.host_id, uid, role, Date.now())
        .run();
    }
    await env.DB.prepare(
      "UPDATE remote_invites SET use_count=use_count+1, used_at=COALESCE(used_at, ?) WHERE invite_id=?",
    )
      .bind(Date.now(), inv.invite_id)
      .run();
    return json({ hostId: inv.host_id, membershipId, role });
  }

  const del = p.match(/^\/v2\/remote\/invites\/([^/]+)$/u);
  if (del && m === "DELETE") {
    const inv = await env.DB.prepare("SELECT host_id FROM remote_invites WHERE invite_id=?").bind(del[1]).first<any>();
    const role = inv ? await roleOnHost(env.DB, inv.host_id, uid) : null;
    if (role !== "owner" && role !== "admin") return json({ error: "not_found" }, 404);
    await env.DB.prepare("UPDATE remote_invites SET revoked_at=? WHERE invite_id=? AND revoked_at IS NULL")
      .bind(Date.now(), del[1])
      .run();
    return json({ ok: true });
  }

  const inv = p.match(/^\/v2\/remote\/hosts\/([^/]+)\/invites$/u);
  if (inv) {
    const hostId = decodeURIComponent(inv[1] ?? "").toLowerCase();
    const role = await roleOnHost(env.DB, hostId, uid);
    if (role !== "owner" && role !== "admin") return json({ error: "not_found" }, 404);
    if (m === "GET") {
      const rs = await env.DB.prepare("SELECT * FROM remote_invites WHERE host_id=? ORDER BY created_at DESC LIMIT 200")
        .bind(hostId)
        .all<any>();
      return json({ invites: rs.results.map(inviteView) });
    }
    if (m === "POST") {
      const b = await body();
      const inviteRole = roleOf(b.role);
      if (!inviteRole) return json({ error: "invalid_role" }, 400);
      if (inviteRole === "admin" && role !== "owner") return json({ error: "forbidden" }, 403);
      const email = typeof b.email === "string" && b.email.trim() ? b.email.trim().toLowerCase() : null;
      if (email && !validEmail(email)) return json({ error: "invalid_email" }, 400);
      const permanent = b.permanent === true && !email;
      const raw = token();
      const id = crypto.randomUUID();
      const expiresAt = permanent ? PERMANENT_EXPIRES_AT : Date.now() + DAY_MS;
      await env.DB.prepare(
        "INSERT INTO remote_invites(invite_id,host_id,token_hash,role,email,permanent,expires_at,use_count,created_at) VALUES(?,?,?,?,?,?,?,0,?)",
      )
        .bind(id, hostId, await sha256(raw), inviteRole, email, permanent ? 1 : 0, expiresAt, Date.now())
        .run();
      return json({ inviteId: id, token: raw, expiresAt, permanent, useCount: 0 });
    }
  }

  const members = p.match(/^\/v2\/remote\/hosts\/([^/]+)\/members(?:\/([^/]+))?$/u);
  if (members) {
    const hostId = decodeURIComponent(members[1] ?? "").toLowerCase();
    const role = await roleOnHost(env.DB, hostId, uid);
    if (!role) return json({ error: "not_found" }, 404);
    if (m === "GET" && !members[2]) {
      const host = await env.DB.prepare(
        "SELECT h.membership_id, h.created_at, u.email, u.name FROM remote_hosts h JOIN users u ON u.id=h.user_id WHERE h.host_id=?",
      )
        .bind(hostId)
        .first<any>();
      const rs = await env.DB.prepare(
        "SELECT m.membership_id, m.role, m.status, m.created_at, u.email, u.name FROM remote_members m JOIN users u ON u.id=m.user_id WHERE m.host_id=? ORDER BY m.created_at",
      )
        .bind(hostId)
        .all<any>();
      const view = (r: any, memberRole: string, status: string) => ({
        membershipId: r.membership_id,
        email: r.email,
        name: r.name ?? null,
        avatarUrl: null,
        role: memberRole,
        status,
        createdAt: r.created_at > 1e12 ? r.created_at : r.created_at * 1000,
      });
      return json({
        members: [
          ...(host ? [view(host, "owner", "active")] : []),
          ...rs.results.map((r) => view(r, r.role, r.status)),
        ],
      });
    }
    if (role !== "owner" && role !== "admin") return json({ error: "forbidden" }, 403);
    if (members[2] && (m === "PATCH" || m === "DELETE")) {
      const target = await env.DB.prepare("SELECT role FROM remote_members WHERE membership_id=? AND host_id=?")
        .bind(members[2], hostId)
        .first<any>();
      if (!target) return json({ error: "not_found" }, 404);
      if (target.role === "admin" && role !== "owner") return json({ error: "forbidden" }, 403);
      if (m === "DELETE") {
        await env.DB.prepare("UPDATE remote_members SET status='revoked' WHERE membership_id=?").bind(members[2]).run();
        return json({ ok: true });
      }
      const b = await body();
      const next = roleOf(b.role);
      if (!next || (next === "admin" && role !== "owner")) return json({ error: "invalid_role" }, 400);
      await env.DB.prepare(
        "UPDATE remote_members SET role=?, status=CASE WHEN ? THEN 'active' ELSE status END WHERE membership_id=?",
      )
        .bind(next, b.reactivate === true ? 1 : 0, members[2])
        .run();
      return json({ ok: true });
    }
  }

  if (p === "/v1/team-invitations/email" && m === "POST") {
    const b = await body();
    const email = typeof b.email === "string" ? b.email.trim().toLowerCase() : "";
    let link: URL | null = null;
    try {
      link = new URL(String(b.inviteUrl));
    } catch {
      link = null;
    }
    if (!validEmail(email) || !link || link.protocol !== "https:" || !link.hostname.endsWith("danlab.dev"))
      return json({ error: "invalid_request" }, 400);
    if (!env.RESEND_API_KEY) return json({ error: "email_unavailable" }, 503);
    const sent = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { authorization: `Bearer ${env.RESEND_API_KEY}`, "content-type": "application/json" },
      body: JSON.stringify({
        from: env.MAIL_FROM || "Dani Dex <login@mail.danlab.dev>",
        to: [email],
        subject: "You are invited to a Dani Dex server",
        html: inviteMail(String(b.serverName ?? "a server").slice(0, 80), link.toString()),
      }),
    });
    return sent.ok ? json({ ok: true }) : json({ error: "email_failed" }, 502);
  }
  return null;
}
