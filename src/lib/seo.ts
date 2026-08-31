import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
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

  return siteConfig.url;
}

export function absoluteUrl(path: string): string {
  const base = getSiteUrl();
  if (!path || path === "/") return base;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

interface BuildMetadataOptions {
  readonly title?: string;
  readonly description?: string;
  /** Route path, e.g. "/about". Used for the canonical link. */
  readonly path?: string;
  readonly noIndex?: boolean;
}

/**
 * Build page metadata with correct canonical, OG, and Twitter tags.
 *
 * Every page should call this rather than hand-rolling a Metadata object —
 * that is how canonical tags silently drift.
 */
export function buildMetadata({
  title,
  description = siteConfig.description,
  path = "/",
  noIndex = false,
}: BuildMetadataOptions = {}): Metadata {
  const resolvedTitle = title ? `${title} | ${siteConfig.name}` : siteConfig.name;
  const url = absoluteUrl(path);

  return {
    title: resolvedTitle,
    description,
    alternates: { canonical: url },
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
      locale: siteConfig.locale,
      url,
      title: resolvedTitle,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title: resolvedTitle,
      description,
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
export function organizationJsonLd(): string {
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
        address: {
          "@type": "PostalAddress",
          streetAddress: siteConfig.contact.address,
        },
        sameAs: siteConfig.social.map((link) => link.href),
      },
      {
        "@type": "WebSite",
        "@id": `${url}/#website`,
        url,
        name: siteConfig.name,
        description: siteConfig.description,
        inLanguage: siteConfig.lang,
        publisher: { "@id": `${url}/#organization` },
      },
    ],
  });
}
