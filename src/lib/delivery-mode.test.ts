import { afterEach, describe, expect, it, vi } from "vitest";
import { resolveDeliveryMode } from "@/lib/delivery-mode";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("resolveDeliveryMode", () => {
  it.each(["log", "provider"] as const)("honours an explicit %s", (mode) => {
    vi.stubEnv("CONTACT_DELIVERY_MODE", mode);
    expect(resolveDeliveryMode()).toBe(mode);
  });

  /**
   * Regression: the variable was set to "" in Vercel. `??` only falls back on
   * null and undefined, so the mode became "" — neither branch — and the
   * intended default never applied.
   */
  it.each(["", "   "])("treats a blank value as unset rather than a mode", (blank) => {
    vi.stubEnv("CONTACT_DELIVERY_MODE", blank);
    vi.stubEnv("VERCEL_ENV", "production");
    expect(resolveDeliveryMode()).toBe("provider");
  });

  it("ignores a value that is neither mode", () => {
    vi.stubEnv("CONTACT_DELIVERY_MODE", "yes-please");
    vi.stubEnv("VERCEL_ENV", "preview");
    expect(resolveDeliveryMode()).toBe("log");
  });

  /**
   * Regression: Vercel builds previews with NODE_ENV=production, so keying off
   * NODE_ENV alone meant every pull-request preview would send real mail from
   * the client's own mailbox.
   */
  it.each([
    ["preview", "log"],
    ["development", "log"],
    ["production", "provider"],
  ] as const)("on Vercel %s, delivery is %s", (vercelEnv, expected) => {
    vi.stubEnv("CONTACT_DELIVERY_MODE", "");
    vi.stubEnv("VERCEL_ENV", vercelEnv);
    vi.stubEnv("NODE_ENV", "production");
    expect(resolveDeliveryMode()).toBe(expected);
  });

  it("falls back to NODE_ENV when not running on Vercel", () => {
    vi.stubEnv("CONTACT_DELIVERY_MODE", "");
    vi.stubEnv("VERCEL_ENV", "");
    vi.stubEnv("NODE_ENV", "production");
    expect(resolveDeliveryMode()).toBe("provider");
  });

  it("never sends from a local development run", () => {
    vi.stubEnv("CONTACT_DELIVERY_MODE", "");
    vi.stubEnv("VERCEL_ENV", "");
    vi.stubEnv("NODE_ENV", "development");
    expect(resolveDeliveryMode()).toBe("log");
  });
});
