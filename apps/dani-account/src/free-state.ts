/**
 * Dani Dex is free. These answers tell the app that paid billing, referral payouts
 * and credits are not offered, in the exact shapes the desktop app reads.
 */
export function freeAccountState(path: string, method: string): unknown | null {
  if (method !== "GET") return null;
  const clean = path.replace(/\/+$/u, "");
  if (clean === "/v1/me/billing") return { available: false, hasCustomer: false, servers: [] };
  if (clean === "/v1/me/billing/details") return { country: null, vatId: null };
  if (clean === "/v1/me/credits") return { available: false, currency: "usd", currencies: [], balance: 0, servers: [] };
  if (clean === "/v1/me/credits/activity") return { entries: [] };
  if (clean === "/v1/me/referrals")
    return {
      available: false,
      link: "",
      credit: [],
      earned: [],
      pending: [],
      ready: [],
      minimum: [],
      counts: { all: 0, paying: 0, "no-plan": 0, stopped: 0 },
      filter: "all",
      page: 0,
      friends: [],
    };
  return null;
}
