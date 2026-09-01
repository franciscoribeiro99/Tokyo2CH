import { describe, expect, it } from "vitest";
import { CONDITION_VALUES, REFERRAL_VALUES, TRANSMISSION_VALUES } from "@/config/form-options";
import { LOCALES } from "@/config/i18n";
import { de } from "@/content/de";
import { en } from "@/content/en";
import { fr } from "@/content/fr";
import { it as itDict } from "@/content/it";

const DICTIONARIES = { fr, de, it: itDict, en };

/** Every leaf as a `[path, value]` pair, e.g. ["home.hero.title", "…"]. */
function leaves(value: unknown, prefix = ""): [string, unknown][] {
  if (Array.isArray(value)) {
    return value.flatMap((entry, index) => leaves(entry, `${prefix}.${index}`));
  }
  if (value && typeof value === "object") {
    return Object.entries(value).flatMap(([key, entry]) =>
      leaves(entry, prefix ? `${prefix}.${key}` : key),
    );
  }
  return [[prefix, value]];
}

const pathsOf = (value: unknown): string[] => leaves(value).map(([path]) => path);

describe("dictionaries", () => {
  it("covers every locale the site advertises", () => {
    expect(Object.keys(DICTIONARIES).sort()).toEqual([...LOCALES].sort());
  });

  /**
   * The type system already forbids a missing key, but not a missing *array
   * entry*: a locale could ship five FAQ items where French has six and still
   * compile. This catches that.
   */
  it.each(["de", "it", "en"] as const)(
    "%s has exactly the same shape as the French reference",
    (locale) => {
      expect(pathsOf(DICTIONARIES[locale])).toEqual(pathsOf(fr));
    },
  );

  it.each(["fr", "de", "it", "en"] as const)("%s has no empty strings", (locale) => {
    const empties = leaves(DICTIONARIES[locale])
      .filter(([, value]) => typeof value === "string" && value.trim() === "")
      .map(([path]) => path);

    expect(empties).toEqual([]);
  });

  /**
   * Option *values* are identifiers the Server Action validates against; only
   * the labels are translated. If a translator edited a value, the form would
   * break for that language alone — the kind of bug that shows up weeks later
   * as "it just doesn't work in German".
   */
  describe("form option values match the canonical list", () => {
    it.each(["fr", "de", "it", "en"] as const)("%s", (locale) => {
      const form = DICTIONARIES[locale].form;
      expect(form.transmissionOptions.map((o) => o.value)).toEqual([...TRANSMISSION_VALUES]);
      expect(form.conditionOptions.map((o) => o.value)).toEqual([...CONDITION_VALUES]);
      expect(form.referralOptions.map((o) => o.value)).toEqual([...REFERRAL_VALUES]);
    });
  });

  it("translates the labels rather than leaving the French through", () => {
    // A spot check that the files are not copies of one another.
    expect(de.nav.vehicles).not.toBe(fr.nav.vehicles);
    expect(itDict.nav.vehicles).not.toBe(fr.nav.vehicles);
    expect(en.nav.vehicles).not.toBe(fr.nav.vehicles);
  });
});
