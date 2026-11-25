// Remote pairing + remote desktop control plane for Dani Dex.
// Implements the contracts the existing client uses (mobile-connect, remote sessions,
// signal relay). Media and control run peer to peer over WebRTC; this only signals.
export interface REnv {
  DB: D1Database;
  REMOTE_TICKET_PRIVATE_JWK: string;
  SIGNAL: DurableObjectNamespace;
}

const enc = new TextEncoder();
const TICKET_AUD = "openbot-remote";
const KID = "dani-remote-1";
const SESSION_MS = 12 * 60 * 60 * 1000;
const json = (b: unknown, status = 200) =>
  new Response(JSON.stringify(b), { status, headers: { "content-type": "application/json" } });
const now = () => Math.floor(Date.now() / 1000);

function b64u(buf: ArrayBuffer | Uint8Array): string {
  const b = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
  let s = "";
  for (const c of b) s += String.fromCharCode(c);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
function unb64u(s: string): Uint8Array<ArrayBuffer> {
  const t = s.replace(/-/g, "+").replace(/_/g, "/");
  return Uint8Array.from(atob(t + "=".repeat((4 - (t.length % 4)) % 4)), (c) => c.charCodeAt(0));
}
export async function sha256(s: string): Promise<string> {
  return b64u(await crypto.subtle.digest("SHA-256", enc.encode(s)));
}
const rand = (n = 32) => b64u(crypto.getRandomValues(new Uint8Array(n)));

async function privKey(env: { REMOTE_TICKET_PRIVATE_JWK: string }) {
  return crypto.subtle.importKey(
    "jwk",
    JSON.parse(env.REMOTE_TICKET_PRIVATE_JWK),
    { name: "ECDSA", namedCurve: "P-256" },
    false,
    ["sign"],
  );
}
function publicJwk(env: { REMOTE_TICKET_PRIVATE_JWK: string }) {
  const { d: _d, key_ops: _k, ext: _e, ...pub } = JSON.parse(env.REMOTE_TICKET_PRIVATE_JWK);
  return { ...pub, kid: KID, alg: "ES256", use: "sig" };
}
async function pubKey(env: { REMOTE_TICKET_PRIVATE_JWK: string }) {
  const { kid: _kid, alg: _alg, use: _use, ...jwk } = publicJwk(env);
  return crypto.subtle.importKey("jwk", jwk, { name: "ECDSA", namedCurve: "P-256" }, false, ["verify"]);
}
export async function signJwt(
  env: REnv,
  claims: Record<string, unknown>,
  ttlSec: number,
): Promise<{ jwt: string; exp: number }> {
  const iat = now();
  const exp = iat + ttlSec;
  const head = b64u(enc.encode(JSON.stringify({ alg: "ES256", typ: "JWT", kid: KID })));
  const body = b64u(enc.encode(JSON.stringify({ ...claims, aud: TICKET_AUD, jti: crypto.randomUUID(), iat, exp })));
  const sig = await crypto.subtle.sign(
    { name: "ECDSA", hash: "SHA-256" },
    await privKey(env),
    enc.encode(`${head}.${body}`),
  );
  return { jwt: `${head}.${body}.${b64u(sig)}`, exp };
}
export async function verifyJwt(
  env: { REMOTE_TICKET_PRIVATE_JWK: string },
  token: string,
): Promise<Record<string, any> | null> {
  const [h, b, s] = token.split(".");
  if (!h || !b || !s) return null;
  try {
    const ok = await crypto.subtle.verify(
      { name: "ECDSA", hash: "SHA-256" },
      await pubKey(env),
      unb64u(s),
      enc.encode(`${h}.${b}`),
    );
    if (!ok) return null;
    const c = JSON.parse(new TextDecoder().decode(unb64u(b)));
    if (c.aud !== TICKET_AUD || c.exp < now()) return null;
    return c;
  } catch {
    return null;
  }
}

const userView = (u: any) => ({
  id: u.id,
  email: u.email,
  name: u.name ?? null,
  avatarUrl: null,
  analyticsEnabled: null,
});
async function getUser(env: REnv, uid: string) {
  return env.DB.prepare("SELECT id,email,name FROM users WHERE id=?").bind(uid).first();
}
const HOST_ID = /^[A-Za-z0-9-]{1,128}$/;

async function hostByMachineToken(env: REnv, hostId: string, token: unknown) {
  if (typeof token !== "string") return null;
  const h = await env.DB.prepare("SELECT * FROM remote_hosts WHERE host_id=?").bind(hostId.toLowerCase()).first<any>();
  if (!h || !h.machine_token_hash || h.machine_token_hash !== (await sha256(token))) return null;
  return h;
}
const signalUrl = (hostId: string) =>
  `wss://auth.dani.danlab.dev/v1/signal?host=${encodeURIComponent(hostId.toLowerCase())}`;

// auth: result of authUser (null when unauthenticated). sessionToken: raw bearer.
export async function handleRemote(
  req: Request,
  env: REnv,
  url: URL,
  uid: string | null,
  bearer: string,
): Promise<Response | null> {
  const p = url.pathname;
  const m = req.method;
  const body = async (): Promise<any> => {
    try {
      return await req.json();
    } catch {
      return {};
    }
  };

  if (p === "/.well-known/jwks.json") return json({ keys: [publicJwk(env)] });

  if (p === "/v1/signal") {
    const host = (url.searchParams.get("host") || "").toLowerCase();
    if (!HOST_ID.test(host)) return json({ error: "bad_host" }, 400);
    return env.SIGNAL.get(env.SIGNAL.idFromName(host)).fetch(req);
  }

  // Unauthenticated, ticket based.
  if (p === "/v1/mobile-auth/redeem" && m === "POST") {
    const b = await body();
    const th = typeof b.ticket === "string" ? await sha256(b.ticket) : "";
    const t = await env.DB.prepare("SELECT * FROM mobile_tickets WHERE ticket_hash=?").bind(th).first<any>();
    if (!t || t.expires_at < now())
      return json({ error: "ticket_expired", message: "This code expired. Show a new one on your computer." }, 400);
    await env.DB.prepare("DELETE FROM mobile_tickets WHERE ticket_hash=?").bind(th).run();
    const token = rand(32);
    const hash = await sha256(token);
    await env.DB.prepare("INSERT INTO sessions(token_hash,user_id,created_at,expires_at) VALUES(?,?,?,?)")
      .bind(hash, t.user_id, now(), now() + 60 * 60 * 24 * 90)
      .run();
    const name = typeof b.deviceName === "string" ? b.deviceName.slice(0, 80) : "Phone";
    await env.DB.prepare(
      "INSERT INTO account_sessions(id,user_id,token_hash,name,kind,platform,host_id,created_at,last_active) VALUES(?,?,?,?,?,?,?,?,?)",
    )
      .bind(
        crypto.randomUUID(),
        t.user_id,
        hash,
        name,
        "mobile",
        typeof b.platform === "string" ? b.platform : "unknown",
        t.host_id,
        now() * 1000,
        now() * 1000,
      )
      .run();
    return json({
      sessionToken: token,
      user: userView(await getUser(env, t.user_id)),
      host: { hostId: t.host_id, fingerprint: t.fingerprint },
    });
  }
  let r = p.match(/^\/v2\/remote\/hosts\/([^/]+)\/(ticket|signal-homes)\/?$/);
  if (r && m === "POST") {
    const b = await body();
    const h = await hostByMachineToken(env, decodeURIComponent(r[1]), b.machineToken);
    if (!h) return json({ error: "unauthorized" }, 401);
    if (r[2] === "signal-homes") return json({ homes: [{ id: "a", url: signalUrl(h.host_id) }] });
    const exp = Date.now() + SESSION_MS;
    const { jwt, exp: e } = await signJwt(
      env,
      {
        sessionId: `host-${h.host_id}`,
        hostId: h.host_id,
        userId: h.user_id,
        membershipId: h.membership_id,
        role: "host",
        authEpoch: h.auth_epoch,
        protocolMinimum: 2,
        protocolMaximum: 2,
        sessionExpiresAt: Math.floor(exp / 1000),
      },
      180,
    );
    return json({ ticket: jwt, expiresAt: e * 1000, signalUrl: signalUrl(h.host_id) });
  }

  if (!uid) return null; // caller returns 401

  if (p === "/v1/mobile-auth/ticket") {
    if (m === "POST") {
      const b = await body();
      const host = b.host;
      if (!host || !HOST_ID.test(host.hostId || "") || !/^[A-Za-z0-9_-]{43}$/.test(host.fingerprint || ""))
        return json({ error: "bad_host" }, 400);
      const ticket = rand(32);
      const expires = now() + 300;
      await env.DB.prepare("DELETE FROM mobile_tickets WHERE user_id=? AND host_id=?").bind(uid, host.hostId).run();
      await env.DB.prepare(
        "INSERT INTO mobile_tickets(ticket_hash,user_id,host_id,fingerprint,expires_at) VALUES(?,?,?,?,?)",
      )
        .bind(await sha256(ticket), uid, host.hostId, host.fingerprint, expires)
        .run();
      return json({ ticket, expiresAt: expires * 1000 });
    }
    if (m === "DELETE") {
      await env.DB.prepare("DELETE FROM mobile_tickets WHERE user_id=? AND host_id=?")
        .bind(uid, url.searchParams.get("host") || "")
        .run();
      return json({ ok: true });
    }
  }
  if (p === "/v1/mobile-auth/session") {
    if (m === "GET") return json(userView(await getUser(env, uid)));
    if (m === "DELETE") {
      const h = await sha256(bearer);
      await env.DB.prepare("DELETE FROM sessions WHERE token_hash=?").bind(h).run();
      await env.DB.prepare("DELETE FROM account_sessions WHERE token_hash=?").bind(h).run();
      return json({ ok: true });
    }
  }
  if (p === "/v1/mobile-auth/devices" && m === "GET") {
    const cur = await sha256(bearer);
    const rs = await env.DB.prepare(
      "SELECT id,name,kind,token_hash,created_at,last_active FROM account_sessions WHERE user_id=? ORDER BY created_at",
    )
      .bind(uid)
      .all<any>();
    return json({
      sessions: rs.results.map((s) => ({
        sessionId: s.id,
        name: s.name,
        kind: s.kind,
        current: s.token_hash === cur,
        connectedAt: s.created_at,
        lastActiveAt: s.last_active,
      })),
    });
  }
  r = p.match(/^\/v1\/mobile-auth\/devices\/([^/]+)$/);
  if (r && m === "DELETE") {
    const s = await env.DB.prepare("SELECT token_hash FROM account_sessions WHERE id=? AND user_id=?")
      .bind(r[1], uid)
      .first<any>();
    if (s) {
      await env.DB.prepare("DELETE FROM sessions WHERE token_hash=?").bind(s.token_hash).run();
      await env.DB.prepare("DELETE FROM account_sessions WHERE id=?").bind(r[1]).run();
    }
    return json({ ok: true });
  }

  if (p === "/v2/remote/hosts/register" && m === "POST") {
    const b = await body();
    if (!HOST_ID.test(b.hostId || "") || typeof b.name !== "string" || typeof b.ownerMembershipId !== "string")
      return json({ error: "invalid" }, 400);
    const id = b.hostId.toLowerCase();
    const cur = await env.DB.prepare("SELECT * FROM remote_hosts WHERE host_id=?").bind(id).first<any>();
    if (cur && cur.user_id !== uid) return json({ error: "host_owned_by_another_account" }, 403);
    let machineToken: string | null = null;
    let hash: string | null = cur?.machine_token_hash ?? null;
    if (!cur || b.rotateCredential) {
      machineToken = rand(32);
      hash = await sha256(machineToken);
    } else if (!(await hostByMachineToken(env, id, b.machineToken))) {
      machineToken = rand(32);
      hash = await sha256(machineToken);
    }
    await env.DB.prepare(
      "INSERT INTO remote_hosts(host_id,user_id,name,membership_id,device_public_key,auth_epoch,machine_token_hash,created_at) VALUES(?,?,?,?,?,1,?,?) ON CONFLICT(host_id) DO UPDATE SET name=excluded.name,device_public_key=COALESCE(excluded.device_public_key,remote_hosts.device_public_key),machine_token_hash=excluded.machine_token_hash",
    )
      .bind(
        id,
        uid,
        b.name.slice(0, 120),
        cur?.membership_id ?? b.ownerMembershipId,
        b.devicePublicKey ?? null,
        hash,
        now(),
      )
      .run();
    return json({
      hostId: id,
      name: b.name,
      membershipId: cur?.membership_id ?? b.ownerMembershipId,
      authEpoch: 1,
      machineToken,
    });
  }
  if ((p === "/v2/remote/hosts" || p === "/v2/remote/hosts/") && m === "GET") {
    const rs = await env.DB.prepare("SELECT * FROM remote_hosts WHERE user_id=?").bind(uid).all<any>();
    return json({
      hosts: rs.results.map((h) => ({
        hostId: h.host_id,
        name: h.name,
        logoKey: null,
        devicePublicKey: h.device_public_key,
        authEpoch: h.auth_epoch,
        membershipId: h.membership_id,
        role: "owner",
      })),
    });
  }
  r = p.match(/^\/v2\/remote\/hosts\/([^/]+)\/key-handover$/);
  if (r && m === "POST") return json({ ok: true });

  if ((p === "/v2/remote/sessions" || p === "/v2/remote/sessions/") && m === "POST") {
    const b = await body();
    const h = await env.DB.prepare("SELECT host_id FROM remote_hosts WHERE host_id=? AND user_id=?")
      .bind(String(b.hostId || "").toLowerCase(), uid)
      .first<any>();
    if (!h) return json({ error: "host_not_found" }, 404);
    const id = crypto.randomUUID();
    const exp = Date.now() + SESSION_MS;
    await env.DB.prepare("INSERT INTO remote_sessions(id,host_id,user_id,expires_at) VALUES(?,?,?,?)")
      .bind(id, h.host_id, uid, exp)
      .run();
    return json({ sessionId: id, hostId: h.host_id, expiresAt: exp });
  }
  r = p.match(/^\/v2\/remote\/sessions\/([^/]+)\/(ticket|end)\/?$/);
  if (r && m === "POST") {
    const s = await env.DB.prepare(
      "SELECT rs.*,h.membership_id,h.auth_epoch FROM remote_sessions rs JOIN remote_hosts h ON h.host_id=rs.host_id WHERE rs.id=? AND rs.user_id=?",
    )
      .bind(r[1], uid)
      .first<any>();
    if (!s) return json({ error: "session_not_found" }, 404);
    if (r[2] === "end") {
      await env.DB.prepare("UPDATE remote_sessions SET ended=1 WHERE id=?").bind(s.id).run();
      return json({ ok: true });
    }
    if (s.ended || s.expires_at < Date.now()) return json({ error: "session_ended" }, 410);
    const b = await body();
    if (typeof b.clientPublicKey !== "string" || !b.clientPublicKey)
      return json({ error: "client_public_key_required" }, 400);
    const { jwt, exp } = await signJwt(
      env,
      {
        sessionId: s.id,
        hostId: s.host_id,
        userId: uid,
        membershipId: s.membership_id,
        role: "owner",
        authEpoch: s.auth_epoch,
        protocolMinimum: 2,
        protocolMaximum: 2,
        sessionExpiresAt: Math.floor(s.expires_at / 1000),
        clientPublicKey: b.clientPublicKey,
      },
      180,
    );
    return json({ ticket: jwt, expiresAt: exp * 1000, signalUrl: signalUrl(s.host_id) });
  }
  return null;
}

// ---- Signal relay: one Durable Object per host ----
type Peer = { ws: WebSocket; connectionId: string | null; claims: Record<string, any> };
export class SignalRoom {
  host: Peer | null = null;
  clients = new Map<string, Peer>();
  waiting = new Set<Peer>();
  constructor(
    _s: DurableObjectState,
    readonly env: REnv,
  ) {}

  async fetch(req: Request): Promise<Response> {
    if (req.headers.get("upgrade") !== "websocket") return new Response("expected websocket", { status: 426 });
    const pair = new WebSocketPair();
    const [client, server] = [pair[0], pair[1]];
    server.accept();
    let me: Peer | null = null;
    let role: "host" | "client" | null = null;
    server.addEventListener("message", async (ev) => {
      if (typeof ev.data !== "string" || ev.data.length > 64 * 1024) return;
      let msg: any;
      try {
        msg = JSON.parse(ev.data);
      } catch {
        return;
      }
      if (msg.type === "hello") {
        const c = await verifyJwt(this.env, String(msg.token || ""));
        if (!c || (msg.peer === "host") !== (c.role === "host")) {
          this.err(server, "authentication_required", "Invalid or expired ticket.");
          server.close(1008, "auth");
          return;
        }
        role = msg.peer;
        const resume = (await signJwt(this.env, { ...c, cid: c.cid }, 600)).jwt;
        const ice = [{ urls: ["stun:stun.cloudflare.com:3478", "stun:stun.l.google.com:19302"] }];
        if (role === "host") {
          this.host?.ws.close(1000, "replaced");
          me = { ws: server, connectionId: null, claims: c };
          this.host = me;
          server.send(
            JSON.stringify({
              type: "ready",
              version: 1,
              connectionId: null,
              resumeToken: resume,
              iceServers: ice,
              capabilities: [],
              reconnectGraceMs: 30000,
            }),
          );
          for (const w of [...this.waiting]) {
            await this.announce(w);
          }
          this.waiting.clear();
        } else {
          const cid = c.cid ?? crypto.randomUUID();
          me = { ws: server, connectionId: cid, claims: c };
          this.clients.set(cid, me);
          if (!this.host) {
            if (msg.waitForHost) {
              this.waiting.add(me);
              server.send(
                JSON.stringify({
                  type: "host-waiting",
                  version: 1,
                  resumeToken: (await signJwt(this.env, { ...c, cid }, 600)).jwt,
                }),
              );
            } else {
              this.err(server, "host_unavailable", "The computer is offline.");
              server.close(1000, "no host");
            }
            return;
          }
          server.send(
            JSON.stringify({
              type: "ready",
              version: 1,
              connectionId: cid,
              resumeToken: (await signJwt(this.env, { ...c, cid }, 600)).jwt,
              iceServers: ice,
              reconnectGraceMs: 600000,
            }),
          );
          await this.announce(me);
        }
        return;
      }
      if (!me || !role) {
        this.err(server, "authentication_required", "Say hello first.");
        return;
      }
      if (msg.type === "turn-refresh") {
        server.send(
          JSON.stringify({
            type: "ready",
            version: 1,
            connectionId: me.connectionId,
            resumeToken: (await signJwt(this.env, { ...me.claims, cid: me.connectionId }, 600)).jwt,
            iceServers: [{ urls: ["stun:stun.cloudflare.com:3478"] }],
          }),
        );
        return;
      }
      const relay = ["offer", "answer", "ice-candidate", "ice-restart", "disconnect"];
      if (!relay.includes(msg.type)) return;
      if (role === "client") this.host?.ws.send(JSON.stringify({ ...msg, connectionId: me.connectionId }));
      else {
        const t = this.clients.get(msg.connectionId);
        t?.ws.send(JSON.stringify(msg));
      }
    });
    const gone = () => {
      if (!me) return;
      if (role === "host" && this.host === me) this.host = null;
      if (role === "client" && me.connectionId) {
        this.clients.delete(me.connectionId);
        this.waiting.delete(me);
        this.host?.ws.send(JSON.stringify({ type: "disconnect", version: 1, connectionId: me.connectionId }));
      }
    };
    server.addEventListener("close", gone);
    server.addEventListener("error", gone);
    return new Response(null, { status: 101, webSocket: client });
  }
  err(ws: WebSocket, code: string, message: string) {
    ws.send(JSON.stringify({ type: "error", version: 1, code, message }));
  }
  async announce(c: Peer) {
    this.host?.ws.send(
      JSON.stringify({
        type: "peer-ready",
        version: 1,
        connectionId: c.connectionId,
        sessionId: c.claims.sessionId,
        userId: c.claims.userId,
        membershipId: c.claims.membershipId,
        role: c.claims.role,
        sessionExpiresAt: c.claims.sessionExpiresAt * 1000,
        resumed: false,
      }),
    );
    if (this.waiting.has(c))
      c.ws.send(
        JSON.stringify({
          type: "ready",
          version: 1,
          connectionId: c.connectionId,
          resumeToken: (await signJwt(this.env, { ...c.claims, cid: c.connectionId }, 600)).jwt,
          iceServers: [{ urls: ["stun:stun.cloudflare.com:3478"] }],
        }),
      );
  }
}
