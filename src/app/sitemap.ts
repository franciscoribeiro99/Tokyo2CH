import type { MetadataRoute } from "next";
import { DEFAULT_LOCALE, LOCALES, localePath } from "@/config/i18n";
import { getSiteUrl } from "@/lib/seo";

/**
 * Static route manifest.
 *
 * Emitted once per language, so eight routes become thirty-two entries. Each
 * carries the full `alternates.languages` map: without it a search engine sees
 * four unrelated pages saying the same thing rather than one page in four
 * languages.
 */
const ROUTES = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/vehicles", changeFrequency: "weekly", priority: 0.9 },
  { path: "/our-services", changeFrequency: "monthly", priority: 0.9 },
  { path: "/how-it-works", changeFrequency: "monthly", priority: 0.8 },
  { path: "/faq", changeFrequency: "monthly", priority: 0.7 },
  { path: "/contact", changeFrequency: "yearly", priority: 0.7 },
  { path: "/legal/privacy", changeFrequency: "yearly", priority: 0.2 },
  { path: "/legal/terms", changeFrequency: "yearly", priority: 0.2 },
] as const satisfies readonly {
  path: string;
  changeFrequency: NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>;
  priority: number;
}[];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getSiteUrl();
  const lastModified = new Date();

  return ROUTES.flatMap((route) => {
    const languages = Object.fromEntries(
      LOCALES.map((locale) => [locale, `${baseUrl}${localePath(locale, route.path)}`]),
    );

    return LOCALES.map((locale) => ({
      url: `${baseUrl}${localePath(locale, route.path)}`,
      lastModified,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
      alternates: {
        languages: {
          ...languages,
          "x-default": `${baseUrl}${localePath(DEFAULT_LOCALE, route.path)}`,
        },
      },
    }));
  });
}
