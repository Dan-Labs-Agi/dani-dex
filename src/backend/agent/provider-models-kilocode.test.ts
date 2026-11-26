// @vitest-environment node

import { describe, expect, it } from "vitest";
import { BUILT_IN_PROVIDER_DRIVERS } from "../provider-drivers";
import { modelsAfterKilocodeDiscoveryFailure, PREFERRED_MODEL_ORDER } from "./provider-models";

describe("KiloCode models in the model picker", () => {
  it("lists free KiloCode models when discovery has nothing yet", () => {
    const models = modelsAfterKilocodeDiscoveryFailure([]);
    expect(models.length).toBeGreaterThan(0);
    expect(models.every((model) => model.provider === "kilocode")).toBe(true);
    expect(models.map((model) => model.id)).toContain("kilo/kilo-auto/free");
  });

  it("keeps models already discovered", () => {
    const [first] = modelsAfterKilocodeDiscoveryFailure([]);
    if (!first) throw new Error("no model");
    expect(modelsAfterKilocodeDiscoveryFailure([first])).toEqual([first]);
  });

  it("ranks free KiloCode models ahead of the rest", () => {
    const rank = PREFERRED_MODEL_ORDER.get("kilocode");
    if (!rank) throw new Error("kilocode has no ordering");
    const [free, other] = modelsAfterKilocodeDiscoveryFailure([]);
    if (!free || !other) throw new Error("need two models");
    const paid = { ...other, id: "kilo/some/paid-model", name: "Paid Model" };
    expect(rank(free)).toBeLessThan(rank(paid));
  });

  it("keeps listing the free fallback before the runtime is downloaded", () => {
    const driver = BUILT_IN_PROVIDER_DRIVERS.find((item) => item.id === "kilocode");
    expect(driver?.catalog?.listFallbackWhenUnavailable).toBe(true);
    const opencode = BUILT_IN_PROVIDER_DRIVERS.find((item) => item.id === "opencode");
    expect(opencode?.catalog?.listFallbackWhenUnavailable).toBeUndefined();
  });
});
