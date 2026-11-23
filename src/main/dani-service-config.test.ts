import { describe, expect, it } from "vitest";
import { daniServiceConfig } from "./dani-service-config";

describe("Dani service isolation", () => {
  it("does not use a hosted service until one is configured", () => {
    expect(daniServiceConfig(undefined)).toEqual({ accountApi: "http://127.0.0.1:3100", configured: false });
  });
  it("accepts explicit secure and local development origins", () => {
    expect(daniServiceConfig("https://account.example.org")).toEqual({ accountApi: "https://account.example.org", configured: true });
    expect(daniServiceConfig("http://127.0.0.1:3100").configured).toBe(true);
  });
  it("rejects upstream services, credentials and insecure remote hosts", () => {
    for (const value of ["https://api.openbot.run", "https://openbot.run", "https://a.b.openbot.run", "http://remote.example.org", "https://user:password@example.org", "https://example.org/path", "https://example.org?secret=x", "https://example.org#token"]) {
      expect(() => daniServiceConfig(value)).toThrow();
    }
  });
});
