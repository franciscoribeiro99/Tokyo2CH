"use server";

import { DEFAULT_LOCALE, isLocale } from "@/config/i18n";
import { getDictionaryFor } from "@/content/dictionaries";
import {
  type ContactFormState,
  type ContactInput,
  makeContactSchema,
  toFieldErrors,
} from "@/lib/contact-schema";

/**
 * Handle a contact form submission.
 *
 * Wired for `useActionState`, so the signature is (prevState, formData).
 *
 * ── Delivery is intentionally not implemented ──────────────────────────────
 * This template does not hardcode an email or CRM provider. Provision one from
 * the Vercel Marketplace (Resend, Postmark, SendGrid, …), then implement
 * `deliver` below. Leave the validation and error handling as-is.
 */
export async function submitContactForm(
  _prevState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  /**
   * The locale rides along in a hidden field so the reply comes back in the
   * language the visitor was reading. It is validated against the known set
   * before use — it only selects a message catalogue, but an unchecked value
   * from the client has no business indexing anything.
   */
  const submitted = formData.get("locale");
  const locale = typeof submitted === "string" && isLocale(submitted) ? submitted : DEFAULT_LOCALE;
  const copy = getDictionaryFor(locale).form;
  const contactSchema = makeContactSchema(copy.errors);

  const parsed = contactSchema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    vehicle: formData.get("vehicle"),
    year: formData.get("year"),
    budget: formData.get("budget"),
    transmission: formData.get("transmission"),
    condition: formData.get("condition"),
    requirements: formData.get("requirements"),
    notes: formData.get("notes"),
    referral: formData.get("referral"),
    website: formData.get("website"),
  });

  if (!parsed.success) {
    const fieldErrors = toFieldErrors(parsed.error);

    // A tripped honeypot means a bot. Return the normal success shape so the
    // bot learns nothing, but deliver nothing.
    if (fieldErrors.website) {
      return { status: "success", message: copy.success };
    }

    return { status: "error", message: copy.errors.fix, fieldErrors };
  }

  try {
    await deliver(parsed.data);
    return { status: "success", message: copy.success };
  } catch (error) {
    // Log detail server-side; never leak internals to the browser.
    console.error("[contact] delivery failed", error);
    return { status: "error", message: copy.errors.failed };
  }
}

/**
 * Replace this with your provider call.
 *
 * @example
 *   const resend = new Resend(process.env.RESEND_API_KEY);
 *   await resend.emails.send({ to: siteConfig.contact.email, ... });
 *
 * Until you do, the default is deliberately fail-loud in production: a contact
 * form that silently swallows leads is far worse than one that errors. Set
 * CONTACT_DELIVERY_MODE=log to opt into log-only behaviour (dev and E2E do).
 */
async function deliver(input: ContactInput): Promise<void> {
  const mode =
    process.env.CONTACT_DELIVERY_MODE ??
    (process.env.NODE_ENV === "production" ? "provider" : "log");

  if (mode === "log") {
    console.warn(`[contact] delivery mode is "log"; dropped message from ${input.email}`);
    return;
  }

  throw new Error(
    "No contact delivery provider is configured. Implement deliver() in src/app/actions/contact.ts.",
  );
}
