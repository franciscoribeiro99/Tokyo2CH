import { lang } from "next/root-params";
import { DEFAULT_LOCALE, isLocale, type Locale } from "@/config/i18n";
import { de } from "@/content/de";
import { en } from "@/content/en";
import { type Dictionary, fr } from "@/content/fr";
import { it } from "@/content/it";

/**
 * The four dictionaries, imported statically.
 *
 * The Next guide lazy-imports them, which pays off when dictionaries are large
 * or numerous. These are four small objects and every page is prerendered at
 * build time, so lazy loading would buy nothing and cost an await at each call
 * site.
 */
const DICTIONARIES: Record<Locale, Dictionary> = { fr, de, it, en };

export function getDictionaryFor(locale: Locale): Dictionary {
  return DICTIONARIES[locale];
}

/**
 * The dictionary for the current request.
 *
 * `lang` is a root parameter — the `[lang]` segment sits above the root layout
 * — so any Server Component can read it without the locale being threaded
 * through every intermediate component as a prop.
 */
export async function getDictionary(): Promise<Dictionary> {
  return getDictionaryFor(await getLocale());
}

export async function getLocale(): Promise<Locale> {
  const value = await lang();
  return value && isLocale(value) ? value : DEFAULT_LOCALE;
}
