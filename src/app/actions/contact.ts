"use server";

import { DEFAULT_LOCALE, isLocale, type Locale } from "@/config/i18n";
import { getDictionaryFor } from "@/content/dictionaries";
import {
  type ContactFormState,
  type ContactInput,
  type ContactValues,
  makeContactSchema,
  toFieldErrors,
} from "@/lib/contact-schema";
import { resolveDeliveryMode } from "@/lib/delivery-mode";
import { sendContactEmail } from "@/lib/mailer";

/**
 * Handle a contact form submission.
 *
 * Wired for `useActionState`, so the signature is (prevState, formData).
 *
 * Delivery goes out over SMTP — see `src/lib/mailer.ts` and `.env.example`.
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

  const raw = {
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
  };

  /**
   * What the visitor typed, handed back on every failure.
   *
   * React resets an uncontrolled `<form action>` to each field's defaultValue
   * once the action settles, so without this a single rejected field wipes the
   * whole form. The honeypot is deliberately absent: it is never echoed.
   */
  const submittedValues = Object.fromEntries(
    Object.entries(raw).map(([field, value]) => [field, typeof value === "string" ? value : ""]),
  ) as ContactValues;

  const parsed = contactSchema.safeParse({ ...raw, website: formData.get("website") });

  if (!parsed.success) {
    const fieldErrors = toFieldErrors(parsed.error);

    // A tripped honeypot means a bot. Return the normal success shape so the
    // bot learns nothing, but deliver nothing.
    if (fieldErrors.website) {
      return { status: "success", message: copy.success };
    }

    return { status: "error", message: copy.errors.fix, fieldErrors, values: submittedValues };
  }

  try {
    await deliver(parsed.data, locale);
    return { status: "success", message: copy.success };
  } catch (error) {
    // Log detail server-side; never leak internals to the browser.
    console.error("[contact] delivery failed", error);
    // Valid data that we failed to deliver: hand it back so a retry costs the
    // visitor a click rather than the whole form again.
    return { status: "error", message: copy.errors.failed, values: submittedValues };
  }
}

/**
 * Hand a validated enquiry to the mail transport.
 *
 *   log      -> validate and log, send nothing. What previews and the E2E
 *               suite run under, so the happy-path test does not post real
 *               mail on every CI run.
 *   provider -> send over SMTP.
 *
 * A missing credential surfaces here as a thrown error naming the variable,
 * which the caller turns into the visitor-facing failure message.
 */
async function deliver(input: ContactInput, locale: Locale): Promise<void> {
  if (resolveDeliveryMode() === "log") {
    console.warn(`[contact] delivery mode is "log"; dropped message from ${input.email}`);
    return;
  }

  await sendContactEmail(input, locale);
}
