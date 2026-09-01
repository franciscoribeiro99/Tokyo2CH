import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

/**
 * `src/lib/env` validates at module scope and throws on bad input, so every
 * case needs a fresh module registry rather than a shared import.
 */
async function loadEnv(vars: Record<string, string> = {}) {
  vi.resetModules();
  for (const [key, value] of Object.entries(vars)) {
    vi.stubEnv(key, value);
  }
  return import("@/lib/env");
}

beforeEach(() => {
  vi.unstubAllEnvs();
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

describe("NEXT_PUBLIC_SITE_URL", () => {
  it("passes a well-formed origin through untouched", async () => {
    const { env } = await loadEnv({ NEXT_PUBLIC_SITE_URL: "https://acme.dev" });
    expect(env.NEXT_PUBLIC_SITE_URL).toBe("https://acme.dev");
  });

  it("is undefined when the variable is absent", async () => {
    const { env } = await loadEnv();
    expect(env.NEXT_PUBLIC_SITE_URL).toBeUndefined();
  });

  /**
   * Regression: a variable created-but-left-blank in the Vercel dashboard used
   * to fail validation as "Invalid URL", which aborted `next build` during page
   * data collection. Blank means unset, not malformed.
   */
  it("treats a blank value as unset rather than invalid", async () => {
    const { env } = await loadEnv({ NEXT_PUBLIC_SITE_URL: "" });
    expect(env.NEXT_PUBLIC_SITE_URL).toBeUndefined();
  });

  it("treats a whitespace-only value as unset", async () => {
    const { env } = await loadEnv({ NEXT_PUBLIC_SITE_URL: "   " });
    expect(env.NEXT_PUBLIC_SITE_URL).toBeUndefined();
  });

  it("adds the scheme people omit when pasting a bare domain", async () => {
    const { env } = await loadEnv({ NEXT_PUBLIC_SITE_URL: "acme.vercel.app" });
    expect(env.NEXT_PUBLIC_SITE_URL).toBe("https://acme.vercel.app");
  });

  it("strips a trailing slash instead of rejecting it", async () => {
    const { env } = await loadEnv({ NEXT_PUBLIC_SITE_URL: "https://acme.dev/" });
    expect(env.NEXT_PUBLIC_SITE_URL).toBe("https://acme.dev");
  });

  it("trims surrounding whitespace", async () => {
    const { env } = await loadEnv({ NEXT_PUBLIC_SITE_URL: "  https://acme.dev  " });
    expect(env.NEXT_PUBLIC_SITE_URL).toBe("https://acme.dev");
  });

  it("keeps an explicit http origin", async () => {
    const { env } = await loadEnv({ NEXT_PUBLIC_SITE_URL: "http://localhost:3000" });
    expect(env.NEXT_PUBLIC_SITE_URL).toBe("http://localhost:3000");
  });

  /**
   * This value is interpolated into canonical tags, OG tags, and the JSON-LD
   * graph, so a non-http(s) scheme is an injection vector — and `z.url()` alone
   * accepts both of these.
   */
  it.each(["javascript:alert(1)", "data:text/html,<h1>x</h1>"])(
    "rejects the non-http scheme %s",
    async (value) => {
      await expect(loadEnv({ NEXT_PUBLIC_SITE_URL: value })).rejects.toThrow(
        /Invalid client environment variables/,
      );
    },
  );

  it("rejects a scheme-only value with no hostname", async () => {
    await expect(loadEnv({ NEXT_PUBLIC_SITE_URL: "https://" })).rejects.toThrow(
      /Invalid client environment variables/,
    );
  });

  it("explains how to fix the value when it rejects one", async () => {
    await expect(loadEnv({ NEXT_PUBLIC_SITE_URL: "javascript:alert(1)" })).rejects.toThrow(
      /Environment Variables/,
    );
  });
});

describe("isProduction", () => {
  it("is true only for the Vercel production environment", async () => {
    const { isProduction } = await loadEnv({ VERCEL_ENV: "production" });
    expect(isProduction).toBe(true);
  });

  it("is false for preview deployments", async () => {
    const { isProduction } = await loadEnv({ VERCEL_ENV: "preview" });
    expect(isProduction).toBe(false);
  });

  it("is false when VERCEL_ENV is absent", async () => {
    const { isProduction } = await loadEnv();
    expect(isProduction).toBe(false);
  });
});

describe("server variables", () => {
  it("rejects an unrecognised VERCEL_ENV", async () => {
    await expect(loadEnv({ VERCEL_ENV: "staging" })).rejects.toThrow(
      /Invalid server environment variables/,
    );
  });
});
