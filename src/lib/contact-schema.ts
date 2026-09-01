import { z } from "zod";
import { CONDITION_VALUES, REFERRAL_VALUES, TRANSMISSION_VALUES } from "@/config/form-options";
import type { Dictionary } from "@/content/fr";

/**
 * Shared between the client form and the Server Action.
 *
 * Client-side validation is a UX convenience only — the Server Action
 * re-validates with this exact schema, because anything reaching a server
 * action is untrusted regardless of what the form did.
 *
 * The schema is built per request rather than defined once, because its
 * messages have to reach the visitor in their own language. The *values* it
 * accepts come from `form-options`, never from a dictionary: translating a
 * label must not be able to change what the server considers valid.
 */

type ErrorCopy = Dictionary["form"]["errors"];

/** A required `<select>`: its placeholder option submits "", which must fail. */
function requiredChoice(allowed: readonly string[], message: string) {
  return z
    .string()
    .trim()
    .refine((value) => allowed.includes(value), { message });
}

/** An optional `<select>`: empty is fine, but a made-up value is not. */
function optionalChoice(allowed: readonly string[], message: string) {
  return z
    .string()
    .trim()
    .refine((value) => value === "" || allowed.includes(value), { message })
    .optional();
}

export function makeContactSchema(errors: ErrorCopy) {
  return z.object({
    firstName: z.string().trim().min(1, errors.firstName).max(80, errors.firstNameLong),
    lastName: z.string().trim().min(1, errors.lastName).max(80, errors.lastNameLong),
    email: z.email(errors.email).max(320),
    /** Phone or WhatsApp. Unvalidated beyond length: international formats
     *  vary too much to reject on a pattern without losing real leads. */
    phone: z.string().trim().max(40, errors.phoneLong).optional().or(z.literal("")),

    vehicle: z.string().trim().min(2, errors.vehicle).max(160, errors.tooLong),
    year: z.string().trim().min(1, errors.year).max(60, errors.tooLong),
    budget: z.string().trim().min(1, errors.budget).max(60, errors.tooLong),

    transmission: requiredChoice(TRANSMISSION_VALUES, errors.transmission),
    condition: requiredChoice(CONDITION_VALUES, errors.condition),

    requirements: z.string().trim().max(500, errors.tooLong).optional().or(z.literal("")),
    notes: z.string().trim().max(5000, errors.tooLong).optional().or(z.literal("")),
    referral: optionalChoice(REFERRAL_VALUES, errors.choice),

    /**
     * Honeypot. Real users never fill a hidden field; bots fill everything.
     * Must be empty to pass.
     */
    website: z.literal("").optional(),
  });
}

export type ContactSchema = ReturnType<typeof makeContactSchema>;
export type ContactInput = z.infer<ContactSchema>;

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
