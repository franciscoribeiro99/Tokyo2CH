"use server";

import {
  type ContactFormState,
  type ContactInput,
  contactSchema,
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
  const parsed = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    company: formData.get("company"),
    message: formData.get("message"),
    website: formData.get("website"),
  });

  if (!parsed.success) {
    const fieldErrors = toFieldErrors(parsed.error);

    // A tripped honeypot means a bot. Return the normal success shape so the
    // bot learns nothing, but deliver nothing.
    if (fieldErrors.website) {
      return { status: "success", message: "Thanks — we'll be in touch shortly." };
    }

    return {
      status: "error",
      message: "Please fix the highlighted fields and try again.",
      fieldErrors,
    };
  }

  try {
    await deliver(parsed.data);
    return { status: "success", message: "Thanks — we'll be in touch shortly." };
  } catch (error) {
    // Log detail server-side; never leak internals to the browser.
    console.error("[contact] delivery failed", error);
    return {
      status: "error",
      message: "Something went wrong on our end. Please email us directly.",
    };
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
