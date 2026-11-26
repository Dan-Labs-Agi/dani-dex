// @vitest-environment node

import { DatabaseSync } from "node:sqlite";
import { parseReferralState, referralCodeFromInput } from "@openbot/contracts/referral";
import { describe, expect, it } from "vitest";
import {
  canRedeem,
  codeFor,
  friendLabel,
  isReferralCode,
  newReferralCode,
  type ReferralDb,
  recordReferral,
  referralLink,
  referralState,
} from "../../apps/dani-account/src/referrals";

function database(): ReferralDb {
  const sqlite = new DatabaseSync(":memory:");
  sqlite.exec("CREATE TABLE users (id TEXT PRIMARY KEY, google_sub TEXT, email TEXT, name TEXT, created_at INTEGER)");
  const now = Math.floor(Date.now() / 1000);
  for (const [id, name] of [
    ["alice", "Alice"],
    ["bob", "Bob"],
    ["carol", null],
  ] as const)
    sqlite.prepare("INSERT INTO users VALUES (?,?,?,?,?)").run(id, `sub:${id}`, `${id}@example.com`, name, now);
  return {
    prepare(sql: string) {
      return {
        bind(...values: unknown[]) {
          const statement = sqlite.prepare(sql);
          // biome-ignore lint/nursery/noUnsafeTypeAssertion: test double over node:sqlite
          const args = values as never[];
          return {
            // biome-ignore lint/nursery/noUnsafeTypeAssertion: test double over node:sqlite
            first: async <T>() => (statement.get(...args) as T | undefined) ?? null,
            // biome-ignore lint/nursery/noUnsafeTypeAssertion: test double over node:sqlite
            all: async <T>() => ({ results: statement.all(...args) as T[] }),
            run: async () => ({ meta: { changes: Number(statement.run(...args).changes) } }),
          };
        },
      };
    },
  };
}

describe("invite friends", () => {
  it("makes valid codes and a link the app can read back", () => {
    const code = newReferralCode((n) => crypto.getRandomValues(new Uint8Array(n)));
    expect(isReferralCode(code)).toBe(true);
    expect(referralCodeFromInput(referralLink(code))).toBe(code);
  });

  it("gives each account one stable code", async () => {
    const db = database();
    const first = await codeFor(db, "alice");
    expect(await codeFor(db, "alice")).toBe(first);
    expect(await codeFor(db, "bob")).not.toBe(first);
  });

  it("tracks a friend who signs up with the code and lists them", async () => {
    const db = database();
    const code = await codeFor(db, "alice");
    expect(await recordReferral(db, "bob", code, Date.now())).toBe(true);
    const state = parseReferralState(await referralState(db, "alice", "all", 0));
    expect(state?.available).toBe(true);
    expect(state?.link).toBe(referralLink(code));
    expect(state?.counts.all).toBe(1);
    expect(state?.friends.map((friend) => friend.name)).toEqual(["Bob"]);
  });

  it("ignores your own code, a second code, unknown codes and old accounts", async () => {
    const db = database();
    const aliceCode = await codeFor(db, "alice");
    const bobCode = await codeFor(db, "bob");
    expect(await recordReferral(db, "alice", aliceCode, Date.now())).toBe(false);
    expect(await recordReferral(db, "carol", aliceCode, Date.now())).toBe(true);
    expect(await recordReferral(db, "carol", bobCode, Date.now())).toBe(false);
    expect(await recordReferral(db, "bob", "zzzzzzzz", Date.now())).toBe(false);
    expect(await recordReferral(db, "bob", aliceCode, Date.now() + 30 * 86_400_000)).toBe(false);
    expect(
      canRedeem({ referrerId: null, referredId: "x", alreadyReferred: false, referredCreatedAtMs: 0, nowMs: 0 }),
    ).toBe(false);
  });

  it("shows a short friend label without the full email", () => {
    expect(friendLabel(null, "carol@example.com")).toBe("ca***");
    expect(friendLabel("  Dana ", "d@example.com")).toBe("Dana");
  });
});
