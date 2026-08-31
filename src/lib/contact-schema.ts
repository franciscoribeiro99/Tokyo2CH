import { z } from "zod";

/**
 * Shared between the client form and the Server Action.
 *
 * Client-side validation is a UX convenience only — the Server Action
 * re-validates with this exact schema, because anything reaching a server
 * action is untrusted regardless of what the form did.
 */
export const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(100, "That name is too long."),
  email: z.email("Please enter a valid email address.").max(320),
  /** Free text: the model, spec, or budget the enquiry is about. Optional. */
  vehicle: z.string().trim().max(120).optional().or(z.literal("")),
  message: z
    .string()
    .trim()
    .min(20, "Please give us at least 20 characters of context.")
    .max(5000, "Please keep the message under 5000 characters."),
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
