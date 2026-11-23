import { describe, expect, it } from "vitest";
import { DANI_AVATARS, DANI_IDENTITY, daniVariantForAvatar } from "./dani-identity";
import { DANI_PICTURES } from "./dani-pictures";

describe("Dani identity migration", () => {
  it("keeps all seven stable source variants and the crowned primary", () => {
    expect(DANI_IDENTITY.productName).toBe("Dani Dex");
    expect(DANI_AVATARS.map((item) => item.id)).toEqual(["dani", "sprout", "tuft", "sweep", "cap", "shades", "bow"]);
    expect(DANI_AVATARS[0]?.color).toBe("#9561ED");
  });
  it("honors explicit identities across restart regardless of color", () => {
    for (const avatar of DANI_AVATARS) {
      expect(daniVariantForAvatar(`dani:v1:${avatar.id}`, "#000000", 0)).toBe(avatar.id);
      expect(DANI_PICTURES[avatar.id]).toMatch(/^data:image\/png;base64,iVBOR/);
    }
  });
  it("maps known palette colors without changing stored values", () => {
    for (const avatar of DANI_AVATARS) expect(daniVariantForAvatar("user-agent", avatar.color)).toBe(avatar.id);
    expect(daniVariantForAvatar("chief-of-staff", "#3299F4")).toBe("dani");
    expect(daniVariantForAvatar("agent")).toBe("dani");
  });
  it("is deterministic for arbitrary old seeds and always returns a known identity", () => {
    for (const seed of ["old:flat:7", "", "sales-team", "非英語", "<script>"]) {
      const result = daniVariantForAvatar(seed);
      expect(daniVariantForAvatar(seed)).toBe(result);
      expect(DANI_AVATARS.map((avatar) => avatar.id)).toContain(result);
    }
  });
});
