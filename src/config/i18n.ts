/**
 * The four languages the site ships in.
 *
 * French is the default because the business is in Valais and its first
 * customers will be French-speaking. German and Italian cover the other two
 * national languages; English stays because it was already written and the JDM
 * audience is heavily English-speaking.
 *
 * Every locale is prefixed in the URL, the default included. Leaving one
 * unprefixed makes it a special case in routing, canonical tags and the
 * sitemap — which is the usual source of duplicate-content bugs.
 */

export const LOCALES = ["fr", "de", "it", "en"] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "fr";

/**
 * The language a legal document is authoritative in.
 *
 * Swiss practice for a multilingual site: every translated version of the
 * terms names one language as governing, so a divergence introduced by a later
 * edit cannot leave it ambiguous which text applies.
 */
export const GOVERNING_LOCALE: Locale = "fr";

/** Shown in the language switcher. Each label is written in its own language. */
export const LOCALE_LABELS: Record<Locale, string> = {
  fr: "Français",
  de: "Deutsch",
  it: "Italiano",
  en: "English",
};

/** Short form for the compact switcher in the header. */
export const LOCALE_SHORT_LABELS: Record<Locale, string> = {
  fr: "FR",
  de: "DE",
  it: "IT",
  en: "EN",
};

/**
 * BCP 47 tags for `<html lang>` and Open Graph.
 *
 * Regionalised on purpose: `fr-CH` rather than `fr` tells a browser and a
 * search engine this is the Swiss variant, which is the whole point of the
 * site.
 */
export const LOCALE_HTML_LANG: Record<Locale, string> = {
  fr: "fr-CH",
  de: "de-CH",
  it: "it-CH",
  en: "en-CH",
};

export const LOCALE_OG: Record<Locale, string> = {
  fr: "fr_CH",
  de: "de_CH",
  it: "it_CH",
  en: "en_CH",
};

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

/**
 * Pick the best locale for an `Accept-Language` header.
 *
 * Deliberately simple: match the primary subtag only, in the order the browser
 * asked for. A visitor sending `de-AT` gets German, which is right; nobody
 * needs quality-value arithmetic to choose between four languages.
 */
export function resolveLocale(acceptLanguage: string | null): Locale {
  if (!acceptLanguage) return DEFAULT_LOCALE;

  for (const part of acceptLanguage.split(",")) {
    const tag = part.split(";")[0]?.trim().toLowerCase();
    const primary = tag?.split("-")[0];
    if (primary && isLocale(primary)) return primary;
  }

  return DEFAULT_LOCALE;
}

/**
 * Prefix a route with a locale.
 *
 * Every internal link goes through this. Hardcoding `/fr/...` anywhere would
 * strand a visitor in the wrong language the moment they clicked it.
 */
export function localePath(locale: Locale, path: string): string {
  return path === "/" ? `/${locale}` : `/${locale}${path}`;
}
