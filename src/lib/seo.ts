import type { Metadata } from "next";
import { DEFAULT_LOCALE, LOCALE_OG, LOCALES, type Locale, localePath } from "@/config/i18n";
import { siteConfig } from "@/config/site";
import { getDictionary, getLocale } from "@/content/dictionaries";
import type { Dictionary } from "@/content/fr";
import { env } from "@/lib/env";

/**
 * Resolve the canonical origin for the current deployment.
 *
 * Priority: explicit env var → Vercel-provided production URL → config default.
 * Always absolute, always without a trailing slash.
 */
export function getSiteUrl(): string {
  const fromEnv = env.NEXT_PUBLIC_SITE_URL;
  if (fromEnv) return fromEnv;

  const vercelUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercelUrl) return `https://${vercelUrl}`;

  // siteConfig.url is hand-edited per project, so it gets the same trailing
  // slash treatment the env var already received in src/lib/env.ts. Without it
  // a value like "https://acme.com/" yields canonicals such as "//about".
  return siteConfig.url.replace(/\/+$/, "");
}

export function absoluteUrl(path: string): string {
  const base = getSiteUrl();
  if (!path || path === "/") return base;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

interface BuildMetadataOptions {
  readonly title?: string;
  readonly description?: string;
  /** Route path without the locale prefix, e.g. "/vehicles". */
  readonly path?: string;
  readonly noIndex?: boolean;
}

/**
 * Build page metadata with correct canonical, hreflang, OG, and Twitter tags.
 *
 * Async because it reads the current locale from the route rather than taking
 * it as an argument: every page would otherwise have to pass it, and one page
 * forgetting would emit a canonical pointing at the wrong language.
 */
export async function buildMetadata({
  title,
  description,
  path = "/",
  noIndex = false,
}: BuildMetadataOptions = {}): Promise<Metadata> {
  const locale = await getLocale();
  const dictionary = await getDictionary();

  const resolvedTitle = title ? `${title} | ${siteConfig.name}` : siteConfig.name;
  const resolvedDescription = description ?? dictionary.brand.description;
  const url = absoluteUrl(localePath(locale, path));

  /**
   * One entry per language, plus `x-default` for a visitor whose language we
   * do not publish. Without these, the four translations look like duplicate
   * pages competing with each other rather than alternates of one page.
   */
  const languages = Object.fromEntries(
    LOCALES.map((candidate) => [candidate, absoluteUrl(localePath(candidate, path))]),
  );

  return {
    title: resolvedTitle,
    description: resolvedDescription,
    alternates: {
      canonical: url,
      languages: {
        ...languages,
        "x-default": absoluteUrl(localePath(DEFAULT_LOCALE, path)),
      },
    },
    robots: noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: { index: true, follow: true, "max-image-preview": "large" },
        },
    openGraph: {
      type: "website",
      siteName: siteConfig.name,
      locale: LOCALE_OG[locale],
      alternateLocale: LOCALES.filter((c) => c !== locale).map((c) => LOCALE_OG[c]),
      url,
      title: resolvedTitle,
      description: resolvedDescription,
    },
    twitter: {
      card: "summary_large_image",
      title: resolvedTitle,
      description: resolvedDescription,
    },
  };
}

/**
 * Serialize a value for embedding in an inline `<script>` tag.
 *
 * `JSON.stringify` alone is not enough: a string containing `</script>` would
 * close the tag early and turn trusted data into an injection point. The
 * current inputs are static config, but this stays safe when you extend the
 * graph with CMS or user-supplied content.
 */
function toJsonLdScript(value: unknown): string {
  return JSON.stringify(value)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026");
}

/**
 * schema.org Organization + WebSite graph.
 *
 * Emitted once, in the root layout — not per page. Duplicating Organization
 * markup across pages is a common and avoidable structured-data error.
 */
export function organizationJsonLd(locale: Locale, dictionary: Dictionary): string {
  const url = getSiteUrl();

  return toJsonLdScript({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${url}/#organization`,
        name: siteConfig.name,
        legalName: siteConfig.legalName,
        url,
        foundingDate: String(siteConfig.foundingYear),
        email: siteConfig.contact.email,
        telephone: siteConfig.contact.phone,
        // Region and country only — there is no public street address, and
        // claiming one in `streetAddress` would put the business at a location
        // that does not exist.
        address: {
          "@type": "PostalAddress",
          addressRegion: siteConfig.contact.addressRegion,
          addressCountry: siteConfig.contact.addressCountry,
        },
        sameAs: siteConfig.social.map((link) => link.href),
      },
      {
        "@type": "WebSite",
        "@id": `${url}/#website`,
        url,
        name: siteConfig.name,
        description: dictionary.brand.description,
        inLanguage: locale,
        publisher: { "@id": `${url}/#organization` },
      },
    ],
  });
}
