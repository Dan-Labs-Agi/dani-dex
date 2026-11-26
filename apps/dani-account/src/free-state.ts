/**
 * Dani Dex is free. These answers tell the app that paid billing and credits are not offered, in the exact shapes the desktop app reads.
 */
export function freeAccountState(path: string, method: string): unknown | null {
  if (method !== "GET") return null;
  const clean = path.replace(/\/+$/u, "");
  if (clean === "/v1/me/billing") return { available: false, hasCustomer: false, servers: [] };
  if (clean === "/v1/me/billing/details") return { country: null, vatId: null };
  if (clean === "/v1/me/credits") return { available: false, currency: "usd", currencies: [], balance: 0, servers: [] };
  if (clean === "/v1/me/credits/activity") return { entries: [] };
  if (clean === "/v2/hosting/servers") {
    return { available: false, lifecycleAvailable: false, servers: [], maxServers: null };
  }
  if (clean === "/v2/hosting/plans") return { plans: [] };
  if (clean === "/v1/sites") return { sites: [], limit: 0, used: 0 };
  if (clean === "/v1/me/license") {
    return { available: false, currency: null, license: null, used: 0, users: [], coveredBy: [] };
  }
  return null;
}
