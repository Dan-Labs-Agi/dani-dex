// @vitest-environment node

import { parseBillingState } from "@openbot/contracts/billing";
import { parseBillingDetails as parseDetails } from "@openbot/contracts/billing-details";
import { parseCreditActivity, parseCreditsState } from "@openbot/contracts/credits";
import { parseHostedServerCatalog, parseHostedServerList } from "@openbot/contracts/hosted-servers";
import { parseHostedSiteList } from "@openbot/contracts/hosted-sites";
import { parseLicenseState } from "@openbot/contracts/license";
import { describe, expect, it } from "vitest";
import { freeAccountState } from "../../apps/dani-account/src/free-state";

describe("free account state", () => {
  it("answers the server, plan, site and license lists the Billing page reads", () => {
    expect(parseHostedServerList(freeAccountState("/v2/hosting/servers/", "GET"))).toEqual({
      available: false,
      lifecycleAvailable: false,
      servers: [],
      maxServers: null,
    });
    expect(parseHostedServerCatalog(freeAccountState("/v2/hosting/plans", "GET"))?.plans).toEqual([]);
    expect(parseHostedSiteList(freeAccountState("/v1/sites/", "GET"))).toEqual({ sites: [], limit: 0, used: 0 });
    expect(parseLicenseState(freeAccountState("/v1/me/license/", "GET"))?.available).toBe(false);
  });

  it("answers billing in a shape the app accepts", () => {
    expect(parseBillingState(freeAccountState("/v1/me/billing/", "GET"))).toEqual({
      available: false,
      hasCustomer: false,
      servers: [],
    });
    expect(parseDetails(freeAccountState("/v1/me/billing/details", "GET"))).toEqual({ country: null, vatId: null });
  });

  it("answers credits in a shape the app accepts", () => {
    expect(parseCreditsState(freeAccountState("/v1/me/credits/", "GET"))?.available).toBe(false);
    expect(parseCreditActivity(freeAccountState("/v1/me/credits/activity", "GET"))).toEqual({ entries: [] });
  });

  it("leaves other paths and methods alone", () => {
    expect(freeAccountState("/v1/me/billing/", "POST")).toBeNull();
    expect(freeAccountState("/v1/me", "GET")).toBeNull();
  });
});
