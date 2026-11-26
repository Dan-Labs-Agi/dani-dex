// @vitest-environment node

import { parseBillingState } from "@openbot/contracts/billing";
import { parseBillingDetails as parseDetails } from "@openbot/contracts/billing-details";
import { parseCreditActivity, parseCreditsState } from "@openbot/contracts/credits";
import { parseReferralState } from "@openbot/contracts/referral";
import { describe, expect, it } from "vitest";
import { freeAccountState } from "../../apps/dani-account/src/free-state";

describe("free account state", () => {
  it("answers billing in a shape the app accepts", () => {
    expect(parseBillingState(freeAccountState("/v1/me/billing/", "GET"))).toEqual({
      available: false,
      hasCustomer: false,
      servers: [],
    });
    expect(parseDetails(freeAccountState("/v1/me/billing/details", "GET"))).toEqual({ country: null, vatId: null });
  });

  it("answers credits and referrals in a shape the app accepts", () => {
    expect(parseCreditsState(freeAccountState("/v1/me/credits/", "GET"))?.available).toBe(false);
    expect(parseCreditActivity(freeAccountState("/v1/me/credits/activity", "GET"))).toEqual({ entries: [] });
    const referral = parseReferralState(freeAccountState("/v1/me/referrals", "GET"));
    expect(referral?.available).toBe(false);
    expect(referral?.friends).toEqual([]);
  });

  it("leaves other paths and methods alone", () => {
    expect(freeAccountState("/v1/me/billing/", "POST")).toBeNull();
    expect(freeAccountState("/v1/me", "GET")).toBeNull();
  });
});
