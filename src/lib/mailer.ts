import nodemailer from "nodemailer";
import { z } from "zod";
import { DEFAULT_LOCALE, LOCALE_LABELS, type Locale } from "@/config/i18n";
import { siteConfig } from "@/config/site";
import { fr } from "@/content/fr";
import type { ContactInput } from "@/lib/contact-schema";

/**
 * SMTP delivery for the vehicle enquiry form.
 *
 * Split into three pieces: read the credentials (`loadSmtpConfig`), build the
 * message (`renderContactEmail`), then hand it to a transport
 * (`sendContactEmail`). Only the last one touches the network, which is what
 * lets the first two be unit-tested for the parts that actually go wrong — a
 * half-configured dashboard, and untrusted text in an HTML body.
 *
 * Configured for Hostinger, whose settings are the defaults baked in below:
 * smtp.hostinger.com, port 465, implicit TLS. Port 587 with STARTTLS is the
 * documented fallback when 465 is blocked — set SMTP_PORT=587 and the
 * `secure` flag follows automatically.
 */

/** A variable someone created but left blank in a dashboard means *unset*. */
function optional(raw: string | undefined): string | undefined {
  if (typeof raw !== "string") return undefined;
  const trimmed = raw.trim();
  return trimmed === "" ? undefined : trimmed;
}

const TRUTHY = new Set(["true", "1", "yes", "on"]);
const FALSY = new Set(["false", "0", "no", "off"]);

const booleanish = z
  .string()
  .transform((value) => value.toLowerCase())
  .refine((value) => TRUTHY.has(value) || FALSY.has(value), {
    message: 'must be "true" or "false"',
  })
  .transform((value) => TRUTHY.has(value))
  .optional();

const smtpSchema = z.object({
  SMTP_HOST: z.string().min(1, "is required, e.g. smtp.hostinger.com"),
  SMTP_PORT: z.coerce.number().int("must be a whole number").min(1).max(65535).default(465),
  /**
   * Implicit TLS (465) versus STARTTLS (587). Deriving the default from the
   * port rather than demanding a fourth variable removes the most common
   * misconfiguration of the pair: `secure: true` on 587 hangs until the socket
   * times out, with no error that names the cause.
   */
  SMTP_SECURE: booleanish,
  SMTP_USER: z.string().min(1, "is required — your full Hostinger mailbox address"),
  SMTP_PASSWORD: z.string().min(1, "is required"),
  /** Defaults to the published contact address. */
  CONTACT_TO_EMAIL: z.email("must be a valid email address").optional(),
  /**
   * Defaults to SMTP_USER. Hostinger rejects an envelope sender that is not a
   * mailbox on the authenticated domain, so overriding this is rarely right.
   */
  CONTACT_FROM_EMAIL: z.email("must be a valid email address").optional(),
});

/** Only the keys below are read, so a plain record beats `NodeJS.ProcessEnv`. */
type EnvSource = Readonly<Record<string, string | undefined>>;

export interface SmtpConfig {
  readonly host: string;
  readonly port: number;
  readonly secure: boolean;
  readonly user: string;
  readonly password: string;
  readonly to: string;
  readonly from: string;
}

/**
 * Read and validate the SMTP credentials.
 *
 * Deliberately *not* validated in `src/lib/env.ts`: that module validates at
 * import time, so requiring SMTP there would break `next build`, `next dev`
 * and the E2E suite for everyone who has not set the variables — including
 * preview deployments that run with CONTACT_DELIVERY_MODE=log on purpose.
 * These are checked at the moment they are needed instead.
 */
export function loadSmtpConfig(source: EnvSource = process.env): SmtpConfig {
  const parsed = smtpSchema.safeParse({
    SMTP_HOST: optional(source.SMTP_HOST),
    SMTP_PORT: optional(source.SMTP_PORT),
    SMTP_SECURE: optional(source.SMTP_SECURE),
    SMTP_USER: optional(source.SMTP_USER),
    // Not trimmed: a leading or trailing space in a password is legitimate.
    SMTP_PASSWORD: source.SMTP_PASSWORD === "" ? undefined : source.SMTP_PASSWORD,
    CONTACT_TO_EMAIL: optional(source.CONTACT_TO_EMAIL),
    CONTACT_FROM_EMAIL: optional(source.CONTACT_FROM_EMAIL),
  });

  if (!parsed.success) {
    throw new Error(
      `Invalid SMTP configuration:\n${z.prettifyError(parsed.error)}\n\n` +
        "Set these in Vercel under Project Settings / Environment Variables " +
        "(or in .env.local locally), then redeploy. See .env.example.",
    );
  }

  const config = parsed.data;

  return {
    host: config.SMTP_HOST,
    port: config.SMTP_PORT,
    secure: config.SMTP_SECURE ?? config.SMTP_PORT === 465,
    user: config.SMTP_USER,
    password: config.SMTP_PASSWORD,
    to: config.CONTACT_TO_EMAIL ?? siteConfig.contact.email,
    from: config.CONTACT_FROM_EMAIL ?? config.SMTP_USER,
  };
}

/**
 * Strip anything that would let a form field break out of a header.
 *
 * The name fields reach the Subject line, and Zod only bounds their length —
 * a newline in one would otherwise be an injected header. Nodemailer encodes
 * headers as well; this is the belt to that pair of braces.
 */
export function sanitizeHeader(value: string): string {
  // biome-ignore lint/suspicious/noControlCharactersInRegex: removing them is the point.
  const withoutControls = value.replace(/[\u0000-\u001f\u007f]+/g, " ");
  return withoutControls.replace(/\s+/g, " ").trim();
}

const HTML_ESCAPES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

/** Every value in the HTML body is visitor-supplied, so all of it is escaped. */
export function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => HTML_ESCAPES[char] ?? char);
}

const EMPTY = "—";

interface Option {
  readonly value: string;
  readonly label: string;
}

/** Turn a stored option value back into the label the visitor saw. */
function labelFor(options: readonly Option[], value: string | undefined): string {
  if (!value) return EMPTY;
  return options.find((option) => option.value === value)?.label ?? value;
}

function present(value: string | undefined): string {
  return value && value.trim() !== "" ? value.trim() : EMPTY;
}

export interface ContactEmail {
  readonly subject: string;
  readonly text: string;
  readonly html: string;
  readonly replyTo: string;
}

/**
 * Build the notification the business receives.
 *
 * Labelled in French from the existing dictionary rather than a fresh set of
 * hardcoded strings: the recipient is the Valais business, and reusing the
 * form's own copy keeps the email and the page from drifting apart. The
 * visitor's own language is reported as a field so the reply goes back in it.
 */
export function renderContactEmail(
  input: ContactInput,
  locale: Locale = DEFAULT_LOCALE,
): ContactEmail {
  const copy = fr.form;

  const name = sanitizeHeader(`${input.firstName} ${input.lastName}`);
  const vehicle = sanitizeHeader(input.vehicle);

  const rows: readonly (readonly [string, string])[] = [
    [copy.first, input.firstName],
    [copy.last, input.lastName],
    [copy.email, input.email],
    [copy.phone, present(input.phone)],
    [copy.vehicle, input.vehicle],
    [copy.year, input.year],
    [copy.budget, input.budget],
    [copy.transmission, labelFor(copy.transmissionOptions, input.transmission)],
    [copy.condition, labelFor(copy.conditionOptions, input.condition)],
    [copy.requirements, present(input.requirements)],
    [copy.notes, present(input.notes)],
    [copy.referral, labelFor(copy.referralOptions, input.referral)],
    ["Langue du visiteur", LOCALE_LABELS[locale]],
  ];

  const text = rows.map(([label, value]) => `${label} : ${value}`).join("\n");

  const cells = rows
    .map(([label, value]) => {
      const body = escapeHtml(value).replace(/\n/g, "<br>");
      return (
        '<tr><th align="left" valign="top" style="padding:6px 16px 6px 0;' +
        'font-weight:600;white-space:nowrap;">' +
        `${escapeHtml(label)}</th>` +
        `<td valign="top" style="padding:6px 0;">${body}</td></tr>`
      );
    })
    .join("");

  const html =
    '<div style="font-family:system-ui,-apple-system,Segoe UI,sans-serif;' +
    'font-size:14px;line-height:1.5;color:#111;">' +
    '<p style="margin:0 0 16px;"><strong>Nouvelle demande de véhicule</strong> — ' +
    `${escapeHtml(name)}</p>` +
    `<table cellpadding="0" cellspacing="0" border="0">${cells}</table>` +
    '<p style="margin:16px 0 0;color:#666;">Répondez à cet e-mail pour écrire ' +
    `directement à ${escapeHtml(input.email)}.</p>` +
    "</div>";

  return {
    // Truncated because the vehicle field accepts 160 characters on its own and
    // mail clients elide a subject past roughly 78.
    subject: sanitizeHeader(`Demande véhicule — ${vehicle} — ${name}`).slice(0, 160),
    text,
    html,
    replyTo: sanitizeHeader(input.email),
  };
}

/**
 * Deliver one enquiry over SMTP.
 *
 * A fresh transport per call rather than a pooled module-level one: a Vercel
 * function can be frozen between invocations, and a pooled connection resumed
 * after a freeze is a socket the server has long since closed. The timeouts
 * matter for the same reason — without them a wedged handshake runs out the
 * function's own budget and the visitor sees a generic failure.
 */
export async function sendContactEmail(
  input: ContactInput,
  locale: Locale = DEFAULT_LOCALE,
): Promise<void> {
  const config = loadSmtpConfig();
  const message = renderContactEmail(input, locale);

  const transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: { user: config.user, pass: config.password },
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 20_000,
  });

  try {
    await transporter.sendMail({
      from: { name: siteConfig.name, address: config.from },
      to: config.to,
      replyTo: message.replyTo,
      subject: message.subject,
      text: message.text,
      html: message.html,
    });
  } finally {
    transporter.close();
  }
}
