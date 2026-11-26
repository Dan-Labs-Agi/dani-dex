// @vitest-environment node

import { DatabaseSync } from "node:sqlite";
import { describe, expect, it, vi } from "vitest";
import { handleRemoteInvites, type InviteEnv } from "../../apps/dani-account/src/remote-invites";
import {
  decodeAcceptedRemoteInvite,
  decodeCreatedRemoteInvite,
  decodeRemoteInvitePreview,
  decodeRemoteInvites,
  decodeRemoteMembers,
} from "./central-auth-records";

function environment(): InviteEnv {
  const sqlite = new DatabaseSync(":memory:");
  sqlite.exec("CREATE TABLE users (id TEXT PRIMARY KEY, email TEXT, name TEXT)");
  sqlite.exec(
    "CREATE TABLE remote_hosts (host_id TEXT PRIMARY KEY, user_id TEXT, name TEXT, membership_id TEXT, device_public_key TEXT, created_at INTEGER)",
  );
  for (const id of ["alice", "bob", "carol"])
    sqlite.prepare("INSERT INTO users VALUES (?,?,?)").run(id, `${id}@example.com`, id);
  sqlite.prepare("INSERT INTO remote_hosts VALUES ('host1','alice','Alice server','owner-m',NULL,1)").run();
  const statement = (sql: string, values: unknown[]) => {
    // biome-ignore lint/nursery/noUnsafeTypeAssertion: test double over node:sqlite
    const args = values as never[];
    return {
      // biome-ignore lint/nursery/noUnsafeTypeAssertion: test double over node:sqlite
      first: async <T>() => (sqlite.prepare(sql).get(...args) as T | undefined) ?? null,
      // biome-ignore lint/nursery/noUnsafeTypeAssertion: test double over node:sqlite
      all: async <T>() => ({ results: sqlite.prepare(sql).all(...args) as T[] }),
      run: async () => ({ meta: { changes: Number(sqlite.prepare(sql).run(...args).changes) } }),
    };
  };
  const database = {
    prepare: (sql: string) => ({ ...statement(sql, []), bind: (...values: unknown[]) => statement(sql, values) }),
  };
  // biome-ignore lint/nursery/noUnsafeTypeAssertion: test double over node:sqlite
  const DB = database as never;
  return { DB, RESEND_API_KEY: "test-key" };
}

async function call(env: InviteEnv, uid: string | null, method: string, path: string, payload?: unknown) {
  const request = new Request(`https://auth.test${path}`, {
    method,
    ...(payload === undefined
      ? {}
      : { body: JSON.stringify(payload), headers: { "content-type": "application/json" } }),
  });
  const response = await handleRemoteInvites(request, env, new URL(request.url), uid);
  if (!response) throw new Error("not handled");
  return { status: response.status, body: await response.json().catch(() => null) };
}

describe("server invitations", () => {
  it("makes single-use 24 hour links that work once", async () => {
    const env = environment();
    const made = await call(env, "alice", "POST", "/v2/remote/hosts/host1/invites", { role: "member" });
    const invite = decodeCreatedRemoteInvite(made.body);
    expect(invite.permanent).toBe(false);
    expect(invite.expiresAt - Date.now()).toBeGreaterThan(23 * 3600_000);
    const preview = decodeRemoteInvitePreview(
      (await call(env, null, "POST", "/v2/remote/invites/preview", { token: invite.token })).body,
    );
    expect(preview.hostName).toBe("Alice server");
    const accepted = decodeAcceptedRemoteInvite(
      (await call(env, "bob", "POST", "/v2/remote/invites/accept", { token: invite.token })).body,
    );
    expect(accepted).toMatchObject({ hostId: "host1", role: "member" });
    expect((await call(env, "carol", "POST", "/v2/remote/invites/accept", { token: invite.token })).status).toBe(404);
  });

  it("keeps a permanent link working for many people until it is revoked", async () => {
    const env = environment();
    const invite = decodeCreatedRemoteInvite(
      (await call(env, "alice", "POST", "/v2/remote/hosts/host1/invites", { role: "member", permanent: true })).body,
    );
    expect(invite.permanent).toBe(true);
    expect((await call(env, "bob", "POST", "/v2/remote/invites/accept", { token: invite.token })).status).toBe(200);
    expect((await call(env, "carol", "POST", "/v2/remote/invites/accept", { token: invite.token })).status).toBe(200);
    expect((await call(env, "bob", "DELETE", `/v2/remote/invites/${invite.inviteId}`)).status).toBe(404);
    expect((await call(env, "alice", "DELETE", `/v2/remote/invites/${invite.inviteId}`)).status).toBe(200);
    const listed = decodeRemoteInvites((await call(env, "alice", "GET", "/v2/remote/hosts/host1/invites")).body);
    expect(listed[0]?.revokedAt).not.toBeNull();
    expect(listed[0]?.useCount).toBe(2);
    expect((await call(env, "carol", "POST", "/v2/remote/invites/preview", { token: invite.token })).status).toBe(404);
  });

  it("binds an email invite to that address", async () => {
    const env = environment();
    const invite = decodeCreatedRemoteInvite(
      (await call(env, "alice", "POST", "/v2/remote/hosts/host1/invites", { role: "member", email: "bob@example.com" }))
        .body,
    );
    expect((await call(env, "carol", "POST", "/v2/remote/invites/accept", { token: invite.token })).status).toBe(403);
    expect((await call(env, "bob", "POST", "/v2/remote/invites/accept", { token: invite.token })).status).toBe(200);
  });

  it("lists members and lets only the owner or an admin change them", async () => {
    const env = environment();
    const invite = decodeCreatedRemoteInvite(
      (await call(env, "alice", "POST", "/v2/remote/hosts/host1/invites", { role: "member", permanent: true })).body,
    );
    await call(env, "bob", "POST", "/v2/remote/invites/accept", { token: invite.token });
    const members = decodeRemoteMembers((await call(env, "alice", "GET", "/v2/remote/hosts/host1/members/")).body);
    expect(members.map((member) => member.role)).toEqual(["owner", "member"]);
    const bob = members.find((member) => member.email === "bob@example.com");
    if (!bob) throw new Error("bob missing");
    expect((await call(env, "bob", "DELETE", `/v2/remote/hosts/host1/members/${bob.membershipId}`)).status).toBe(403);
    expect((await call(env, "alice", "DELETE", `/v2/remote/hosts/host1/members/${bob.membershipId}`)).status).toBe(200);
    const after = decodeRemoteMembers((await call(env, "alice", "GET", "/v2/remote/hosts/host1/members/")).body);
    expect(after.find((member) => member.email === "bob@example.com")?.status).toBe("revoked");
    expect((await call(env, "carol", "GET", "/v2/remote/hosts/host1/members/")).status).toBe(404);
  });

  it("sends the invitation email through the mail service", async () => {
    const env = environment();
    const send = vi.fn(async () => new Response("{}", { status: 200 }));
    vi.stubGlobal("fetch", send);
    try {
      const ok = await call(env, "alice", "POST", "/v1/team-invitations/email", {
        email: "bob@example.com",
        serverName: "Alice server",
        inviteUrl: "https://dani.danlab.dev/join#abc",
        role: "member",
      });
      expect(ok.status).toBe(200);
      expect(send).toHaveBeenCalledTimes(1);
      const refused = await call(env, "alice", "POST", "/v1/team-invitations/email", {
        email: "bob@example.com",
        serverName: "x",
        inviteUrl: "https://evil.example/join",
        role: "member",
      });
      expect(refused.status).toBe(400);
    } finally {
      vi.unstubAllGlobals();
    }
  });
});
