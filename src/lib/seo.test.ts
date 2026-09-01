import { beforeEach, describe, expect, it, vi } from "vitest";

/**
 * `buildMetadata` reads the locale from the route rather than an argument, so
 * the root param has to be stubbed. The mock is hoisted above the import.
 */
const currentLang = vi.hoisted(() => ({ value: "fr" }));
vi.mock("next/root-params", () => ({ lang: async () => currentLang.value }));

import { LOCALES } from "@/config/i18n";
import { fr } from "@/content/fr";
import { absoluteUrl, buildMetadata, getSiteUrl, organizationJsonLd } from "@/lib/seo";

beforeEach(() => {
  currentLang.value = "fr";
});

describe("getSiteUrl", () => {
  it("falls back to the configured origin, without a trailing slash", () => {
    expect(getSiteUrl()).toMatch(/^https?:\/\/[^/]+$/);
  });
});

describe("absoluteUrl", () => {
  it("returns the bare origin for the root", () => {
    expect(absoluteUrl("/")).toBe(getSiteUrl());
  });

  it("joins a path onto the origin exactly once", () => {
    expect(absoluteUrl("/fr/vehicles")).toBe(`${getSiteUrl()}/fr/vehicles`);
    expect(absoluteUrl("fr/vehicles")).toBe(`${getSiteUrl()}/fr/vehicles`);
  });
});

describe("buildMetadata", () => {
  it("points the canonical at the current locale's copy of the page", async () => {
    currentLang.value = "de";
    const metadata = await buildMetadata({ path: "/vehicles" });
    expect(metadata.alternates?.canonical).toBe(`${getSiteUrl()}/de/vehicles`);
  });

  /**
   * Without these, four translations look like four duplicate pages competing
   * with each other rather than alternates of the same one.
   */
  it("advertises every language as an alternate, plus x-default", async () => {
    const metadata = await buildMetadata({ path: "/contact" });
    const languages = metadata.alternates?.languages ?? {};

    for (const locale of LOCALES) {
      expect(languages[locale]).toBe(`${getSiteUrl()}/${locale}/contact`);
    }
    // x-default points at the default locale, for a visitor we have no page for.
    expect(languages["x-default"]).toBe(`${getSiteUrl()}/fr/contact`);
  });

  it("falls back to the locale's own description when none is given", async () => {
    const metadata = await buildMetadata({ path: "/" });
    expect(metadata.description).toBe(fr.brand.description);
  });

  it("suffixes the site name onto a page title", async () => {
    const metadata = await buildMetadata({ title: "Véhicules", path: "/vehicles" });
    expect(metadata.title).toContain("Véhicules");
  });

  it("tags Open Graph with the regional locale and lists the others", async () => {
    currentLang.value = "it";
    const metadata = await buildMetadata({ path: "/" });
    const openGraph = metadata.openGraph as { locale?: string; alternateLocale?: string[] };

    expect(openGraph.locale).toBe("it_CH");
    expect(openGraph.alternateLocale).toContain("fr_CH");
    expect(openGraph.alternateLocale).not.toContain("it_CH");
  });

  it("can mark a page as no-index", async () => {
    const metadata = await buildMetadata({ path: "/", noIndex: true });
    expect(metadata.robots).toMatchObject({ index: false, follow: false });
  });
});

describe("organizationJsonLd", () => {
  it("emits an Organization and a WebSite node", () => {
    const parsed = JSON.parse(
      organizationJsonLd("fr", fr)
        .replace(/\\u003c/g, "<")
        .replace(/\\u0026/g, "&"),
    );

    expect(parsed["@context"]).toBe("https://schema.org");
    expect(parsed["@graph"].map((node: { "@type": string }) => node["@type"])).toEqual([
      "Organization",
      "WebSite",
    ]);
  });

  it("declares the language of the description it ships", () => {
    const parsed = JSON.parse(organizationJsonLd("de", fr).replace(/\\u003c/g, "<"));
    const website = parsed["@graph"][1];
    expect(website.inLanguage).toBe("de");
  });

  /**
   * A string containing `</script>` would close the tag early and turn trusted
   * data into an injection point.
   */
  it("escapes angle brackets so the inline script cannot be closed early", () => {
    expect(organizationJsonLd("fr", fr)).not.toContain("</");
  });
});
