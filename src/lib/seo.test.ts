import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { siteConfig } from "@/config/site";

/**
 * `src/lib/seo` reads env at module scope, so each case needs a fresh module
 * registry rather than a shared import.
 */
async function loadSeo(env: Record<string, string | undefined> = {}) {
  vi.resetModules();
  for (const [key, value] of Object.entries(env)) {
    if (value === undefined) vi.stubEnv(key, "");
    else vi.stubEnv(key, value);
  }
  return import("@/lib/seo");
}

beforeEach(() => {
  vi.unstubAllEnvs();
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

describe("getSiteUrl", () => {
  it("prefers NEXT_PUBLIC_SITE_URL", async () => {
    const { getSiteUrl } = await loadSeo({ NEXT_PUBLIC_SITE_URL: "https://acme.dev" });
    expect(getSiteUrl()).toBe("https://acme.dev");
  });

  it("falls back to the Vercel production URL", async () => {
    const { getSiteUrl } = await loadSeo({
      VERCEL_PROJECT_PRODUCTION_URL: "acme.vercel.app",
    });
    expect(getSiteUrl()).toBe("https://acme.vercel.app");
  });

  it("falls back to the site config as a last resort", async () => {
    const { getSiteUrl } = await loadSeo();
    expect(getSiteUrl()).toBe(siteConfig.url);
  });
});

describe("absoluteUrl", () => {
  it("returns the bare origin for the root path", async () => {
    const { absoluteUrl } = await loadSeo({ NEXT_PUBLIC_SITE_URL: "https://acme.dev" });
    expect(absoluteUrl("/")).toBe("https://acme.dev");
  });

  it("joins a path without doubling the slash", async () => {
    const { absoluteUrl } = await loadSeo({ NEXT_PUBLIC_SITE_URL: "https://acme.dev" });
    expect(absoluteUrl("/about")).toBe("https://acme.dev/about");
  });

  it("tolerates a path given without a leading slash", async () => {
    const { absoluteUrl } = await loadSeo({ NEXT_PUBLIC_SITE_URL: "https://acme.dev" });
    expect(absoluteUrl("about")).toBe("https://acme.dev/about");
  });
});

describe("buildMetadata", () => {
  it("sets a self-referencing canonical for every page", async () => {
    const { buildMetadata } = await loadSeo({ NEXT_PUBLIC_SITE_URL: "https://acme.dev" });
    const metadata = buildMetadata({ title: "About", path: "/about" });
    expect(metadata.alternates?.canonical).toBe("https://acme.dev/about");
  });

  it("suffixes the site name onto the page title", async () => {
    const { buildMetadata } = await loadSeo();
    expect(buildMetadata({ title: "About" }).title).toBe(`About | ${siteConfig.name}`);
  });

  it("uses the bare site name when no page title is given", async () => {
    const { buildMetadata } = await loadSeo();
    expect(buildMetadata().title).toBe(siteConfig.name);
  });

  it("marks a page noindex when asked", async () => {
    const { buildMetadata } = await loadSeo();
    expect(buildMetadata({ noIndex: true }).robots).toMatchObject({
      index: false,
      follow: false,
    });
  });

  it("keeps the OG url in sync with the canonical", async () => {
    const { buildMetadata } = await loadSeo({ NEXT_PUBLIC_SITE_URL: "https://acme.dev" });
    const metadata = buildMetadata({ path: "/services" });
    expect(metadata.openGraph?.url).toBe("https://acme.dev/services");
    expect(metadata.alternates?.canonical).toBe("https://acme.dev/services");
  });
});

describe("organizationJsonLd", () => {
  it("emits a parseable Organization + WebSite graph", async () => {
    const { organizationJsonLd } = await loadSeo({ NEXT_PUBLIC_SITE_URL: "https://acme.dev" });
    const parsed = JSON.parse(organizationJsonLd());

    expect(parsed["@context"]).toBe("https://schema.org");
    expect(parsed["@graph"]).toHaveLength(2);
    expect(parsed["@graph"][0]["@type"]).toBe("Organization");
    expect(parsed["@graph"][1]["@type"]).toBe("WebSite");
  });

  it("escapes characters that could break out of a script tag", async () => {
    const { organizationJsonLd } = await loadSeo();
    const output = organizationJsonLd();

    expect(output).not.toContain("<");
    expect(output).not.toContain(">");
    expect(output).not.toContain("&");
    // Still valid JSON once the escapes are decoded.
    expect(() => JSON.parse(output)).not.toThrow();
  });
});
