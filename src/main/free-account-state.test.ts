// @vitest-environment node

import { parseBillingState } from "@openbot/contracts/billing";
import { parseBillingDetails as parseDetails } from "@openbot/contracts/billing-details";
import { parseCreditActivity, parseCreditsState } from "@openbot/contracts/credits";
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

  it("answers credits in a shape the app accepts", () => {
    expect(parseCreditsState(freeAccountState("/v1/me/credits/", "GET"))?.available).toBe(false);
    expect(parseCreditActivity(freeAccountState("/v1/me/credits/activity", "GET"))).toEqual({ entries: [] });
  });

  it("leaves other paths and methods alone", () => {
    expect(freeAccountState("/v1/me/billing/", "POST")).toBeNull();
    expect(freeAccountState("/v1/me", "GET")).toBeNull();
  });
});
