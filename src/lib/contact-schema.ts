import { z } from "zod";
import { contactForm } from "@/config/content";

/**
 * Shared between the client form and the Server Action.
 *
 * Client-side validation is a UX convenience only — the Server Action
 * re-validates with this exact schema, because anything reaching a server
 * action is untrusted regardless of what the form did.
 */

const allowed = (options: readonly { readonly value: string }[]): readonly string[] =>
  options.map((option) => option.value);

/**
 * A required `<select>`.
 *
 * Its placeholder option submits an empty string, so "nothing chosen" has to
 * fail here rather than being quietly accepted as a valid answer. Values are
 * derived from the same arrays the form renders, so the two cannot drift.
 */
function requiredChoice(options: readonly { readonly value: string }[], message: string) {
  const values = allowed(options);
  return z
    .string()
    .trim()
    .refine((value) => values.includes(value), { message });
}

/** An optional `<select>`: empty is fine, but a made-up value is not. */
function optionalChoice(options: readonly { readonly value: string }[], message: string) {
  const values = allowed(options);
  return z
    .string()
    .trim()
    .refine((value) => value === "" || values.includes(value), { message })
    .optional();
}

export const contactSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, "Please enter your first name.")
    .max(80, "That first name is too long."),
  lastName: z
    .string()
    .trim()
    .min(1, "Please enter your last name.")
    .max(80, "That last name is too long."),
  email: z.email("Please enter a valid email address.").max(320),
  /** Phone or WhatsApp. Deliberately unvalidated beyond length — international
   *  formats vary too much to reject on a pattern without losing real leads. */
  phone: z.string().trim().max(40, "That number is too long.").optional().or(z.literal("")),

  vehicle: z
    .string()
    .trim()
    .min(2, "Tell us which vehicle you are looking for.")
    .max(160, "Please keep this under 160 characters."),
  year: z
    .string()
    .trim()
    .min(1, "Please give a year or generation.")
    .max(60, "Please keep this under 60 characters."),
  budget: z
    .string()
    .trim()
    .min(1, "Please give an approximate budget.")
    .max(60, "Please keep this under 60 characters."),

  transmission: requiredChoice(contactForm.transmission, "Please choose a transmission."),
  condition: requiredChoice(contactForm.condition, "Please choose a vehicle condition."),

  requirements: z
    .string()
    .trim()
    .max(500, "Please keep this under 500 characters.")
    .optional()
    .or(z.literal("")),
  notes: z
    .string()
    .trim()
    .max(5000, "Please keep this under 5000 characters.")
    .optional()
    .or(z.literal("")),
  referral: optionalChoice(contactForm.referral, "Please choose one of the listed options."),

  /**
   * Honeypot. Real users never fill a hidden field; bots fill everything.
   * Must be empty to pass.
   */
  website: z.literal("").optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;

export type ContactFieldErrors = Partial<Record<keyof ContactInput, string[]>>;

export interface ContactFormState {
  readonly status: "idle" | "success" | "error";
  readonly message?: string;
  readonly fieldErrors?: ContactFieldErrors;
}

export const initialContactState: ContactFormState = { status: "idle" };

/**
 * Collapse a ZodError's issue list into a per-field error map.
 *
 * Lives here rather than in the action file because `"use server"` modules may
 * only export async functions — and because this is worth unit-testing.
 */
export function toFieldErrors(error: z.ZodError<ContactInput>): ContactFieldErrors {
  const result: Record<string, string[]> = {};

  for (const issue of error.issues) {
    const key = issue.path[0];
    if (typeof key !== "string") continue;
    const existing = result[key] ?? [];
    existing.push(issue.message);
    result[key] = existing;
  }

  return result as ContactFieldErrors;
}
