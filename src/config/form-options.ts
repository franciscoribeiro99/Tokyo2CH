/**
 * The canonical values the enquiry form accepts.
 *
 * Deliberately separate from the dictionaries. Labels are translated; these
 * values are identifiers that reach the Server Action and are checked by the
 * Zod schema. If they lived in the dictionaries, a translator editing German
 * would silently break validation for German visitors only — the kind of bug
 * that surfaces as "the form just doesn't work" weeks later.
 *
 * `src/content/dictionaries.test.ts` asserts every locale's options carry
 * exactly these values, so a mismatch fails the build rather than the form.
 */

export const TRANSMISSION_VALUES = ["manual", "automatic", "any"] as const;

export const CONDITION_VALUES = ["showroom", "excellent", "good", "project", "any"] as const;

export const REFERRAL_VALUES = [
  "instagram",
  "facebook",
  "tiktok",
  "search",
  "word-of-mouth",
  "other",
] as const;
