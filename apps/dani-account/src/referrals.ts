/**
 * Invite friends. Free and unpaid: each account gets one code and link, and the
 * account lists the friends who signed up with it. No money or credit is involved.
 */

const ALPHABET = "abcdefghjkmnpqrstuvwxyz23456789";
const REFERRAL_LINK_BASE = "https://dani.danlab.dev/";
const REFERRAL_PAGE_SIZE = 20;
const REDEEM_WINDOW_MS = 7 * 86_400_000;

export interface ReferralDb {
  prepare(sql: string): {
    bind(...values: unknown[]): {
      first<T>(): Promise<T | null>;
      all<T>(): Promise<{ results: T[] }>;
      run(): Promise<{ meta: { changes?: number } }>;
    };
  };
}

export function isReferralCode(value: unknown): value is string {
  return typeof value === "string" && /^[a-hjkmnp-z2-9]{8}$/u.test(value);
}

export function newReferralCode(random: (length: number) => Uint8Array): string {
  const bytes = random(8);
  let code = "";
  for (const byte of bytes) code += ALPHABET[byte % ALPHABET.length];
  return code;
}

export function referralLink(code: string): string {
  return `${REFERRAL_LINK_BASE}?ref=${code}`;
}

/** First name or the start of the email, never the whole address. */
export function friendLabel(name: string | null, email: string): string {
  const trimmed = name?.trim();
  if (trimmed) return trimmed.slice(0, 40);
  const local = email.split("@")[0] ?? "";
  return `${local.slice(0, 2)}***`;
}

export function canRedeem(input: {
  referrerId: string | null;
  referredId: string;
  alreadyReferred: boolean;
  referredCreatedAtMs: number;
  nowMs: number;
}): boolean {
  if (!input.referrerId || input.referrerId === input.referredId || input.alreadyReferred) return false;
  return input.nowMs - input.referredCreatedAtMs <= REDEEM_WINDOW_MS;
}

const ready = new WeakSet<object>();
async function ensureReferralTables(db: ReferralDb & { exec?: (sql: string) => Promise<unknown> }) {
  if (ready.has(db)) return;
  await db
    .prepare("CREATE TABLE IF NOT EXISTS referral_codes (user_id TEXT PRIMARY KEY, code TEXT NOT NULL UNIQUE)")
    .bind()
    .run();
  await db
    .prepare(
      "CREATE TABLE IF NOT EXISTS referrals (referred_id TEXT PRIMARY KEY, referrer_id TEXT NOT NULL, created_at INTEGER NOT NULL)",
    )
    .bind()
    .run();
  await db.prepare("CREATE INDEX IF NOT EXISTS referrals_referrer ON referrals(referrer_id)").bind().run();
  ready.add(db);
}

export async function codeFor(db: ReferralDb, userId: string): Promise<string> {
  await ensureReferralTables(db);
  const existing = await db
    .prepare("SELECT code FROM referral_codes WHERE user_id=?")
    .bind(userId)
    .first<{ code: string }>();
  if (existing) return existing.code;
  for (let attempt = 0; attempt < 8; attempt++) {
    const code = newReferralCode((n) => crypto.getRandomValues(new Uint8Array(n)));
    const result = await db
      .prepare("INSERT OR IGNORE INTO referral_codes(user_id, code) VALUES(?,?)")
      .bind(userId, code)
      .run();
    if (result.meta.changes) return code;
    const again = await db
      .prepare("SELECT code FROM referral_codes WHERE user_id=?")
      .bind(userId)
      .first<{ code: string }>();
    if (again) return again.code;
  }
  throw new Error("Could not create an invite code.");
}

/** Records that `referredId` signed up with `code`. Returns true when it was recorded. */
export async function recordReferral(
  db: ReferralDb,
  referredId: string,
  code: unknown,
  nowMs: number,
): Promise<boolean> {
  if (!isReferralCode(code)) return false;
  await ensureReferralTables(db);
  const owner = await db
    .prepare("SELECT user_id FROM referral_codes WHERE code=?")
    .bind(code)
    .first<{ user_id: string }>();
  const prior = await db
    .prepare("SELECT referred_id FROM referrals WHERE referred_id=?")
    .bind(referredId)
    .first<{ referred_id: string }>();
  const user = await db
    .prepare("SELECT created_at FROM users WHERE id=?")
    .bind(referredId)
    .first<{ created_at: number }>();
  if (
    !canRedeem({
      referrerId: owner?.user_id ?? null,
      referredId,
      alreadyReferred: Boolean(prior),
      referredCreatedAtMs: (user?.created_at ?? 0) * 1000,
      nowMs,
    })
  )
    return false;
  const result = await db
    .prepare("INSERT OR IGNORE INTO referrals(referred_id, referrer_id, created_at) VALUES(?,?,?)")
    .bind(referredId, owner?.user_id, Math.floor(nowMs / 1000))
    .run();
  return Boolean(result.meta.changes);
}

export async function referralState(db: ReferralDb, userId: string, filter: string, page: number) {
  const code = await codeFor(db, userId);
  const total = await db
    .prepare("SELECT COUNT(*) AS n FROM referrals WHERE referrer_id=?")
    .bind(userId)
    .first<{ n: number }>();
  const all = total?.n ?? 0;
  const show = filter === "all" || filter === "no-plan";
  const offset = Math.max(0, Math.floor(page)) * REFERRAL_PAGE_SIZE;
  const rows = show
    ? ((
        await db
          .prepare(
            "SELECT u.id AS id, u.name AS name, u.email AS email, r.created_at AS created_at FROM referrals r JOIN users u ON u.id=r.referred_id WHERE r.referrer_id=? ORDER BY r.created_at DESC LIMIT ? OFFSET ?",
          )
          .bind(userId, REFERRAL_PAGE_SIZE, offset)
          .all<{ id: string; name: string | null; email: string; created_at: number }>()
      ).results ?? [])
    : [];
  return {
    available: true,
    link: referralLink(code),
    credit: [],
    earned: [],
    pending: [],
    ready: [],
    minimum: [],
    counts: { all, paying: 0, "no-plan": all, stopped: 0 },
    filter: ["all", "paying", "no-plan", "stopped"].includes(filter) ? filter : "all",
    page: Math.max(0, Math.floor(page)),
    friends: rows.map((row) => ({
      id: row.id,
      name: friendLabel(row.name, row.email),
      status: "no-plan",
      joinedAt: row.created_at * 1000,
      paidSince: null,
      stoppedAt: null,
      earned: [],
      pending: [],
    })),
  };
}
