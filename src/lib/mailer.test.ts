import { beforeEach, describe, expect, it, vi } from "vitest";
import { siteConfig } from "@/config/site";
import type { ContactInput } from "@/lib/contact-schema";
import {
  escapeHtml,
  loadSmtpConfig,
  renderContactEmail,
  sanitizeHeader,
  sendContactEmail,
} from "@/lib/mailer";

/**
 * Both `vi.mock` and `vi.hoisted` are lifted above the imports by vitest, so
 * the doubles exist by the time the mock factory runs. Declaring them with a
 * plain `const` would leave the factory reading them in their dead zone.
 */
const { close, createTransport, sendMail } = vi.hoisted(() => {
  const sendMail = vi.fn();
  const close = vi.fn();
  return {
    sendMail,
    close,
    createTransport: vi.fn((_options: Record<string, unknown>) => ({ sendMail, close })),
  };
});

vi.mock("nodemailer", () => ({ default: { createTransport } }));

/** The Hostinger settings, as the account holder would paste them in. */
const CREDENTIALS = {
  SMTP_HOST: "smtp.hostinger.com",
  SMTP_PORT: "465",
  SMTP_USER: "contact@tokyo2ch.ch",
  SMTP_PASSWORD: "s3cret",
} satisfies Record<string, string>;

const ENQUIRY: ContactInput = {
  firstName: "Ada",
  lastName: "Lovelace",
  email: "ada@example.com",
  phone: "+41 78 811 83 14",
  vehicle: "Honda Civic Type R EK9",
  year: "1996-2000",
  budget: "CHF 35 000",
  transmission: "manual",
  condition: "excellent",
  requirements: "Championship White",
  notes: "Happy to wait.",
  referral: "instagram",
  website: "",
};

beforeEach(() => {
  vi.clearAllMocks();
  sendMail.mockResolvedValue({ messageId: "<test>" });
});

describe("loadSmtpConfig", () => {
  it("reads a complete Hostinger configuration", () => {
    const config = loadSmtpConfig(CREDENTIALS);

    expect(config).toMatchObject({
      host: "smtp.hostinger.com",
      port: 465,
      user: "contact@tokyo2ch.ch",
      password: "s3cret",
    });
  });

  /**
   * The pairing that costs an afternoon when it is wrong: `secure: true` on 587
   * hangs until the socket times out rather than reporting anything useful.
   */
  it("infers implicit TLS on 465 and STARTTLS on 587", () => {
    expect(loadSmtpConfig(CREDENTIALS).secure).toBe(true);
    expect(loadSmtpConfig({ ...CREDENTIALS, SMTP_PORT: "587" }).secure).toBe(false);
  });

  it("lets SMTP_SECURE override the port-derived default", () => {
    expect(loadSmtpConfig({ ...CREDENTIALS, SMTP_SECURE: "false" }).secure).toBe(false);
    expect(loadSmtpConfig({ ...CREDENTIALS, SMTP_PORT: "587", SMTP_SECURE: "TRUE" }).secure).toBe(
      true,
    );
  });

  it("rejects an SMTP_SECURE value that is neither true nor false", () => {
    expect(() => loadSmtpConfig({ ...CREDENTIALS, SMTP_SECURE: "maybe" })).toThrow(
      /Invalid SMTP configuration/,
    );
  });

  it("defaults the port to 465 when it is not set", () => {
    const { SMTP_PORT: _omitted, ...withoutPort } = CREDENTIALS;
    expect(loadSmtpConfig(withoutPort).port).toBe(465);
  });

  it("defaults the recipient to the published contact address", () => {
    expect(loadSmtpConfig(CREDENTIALS).to).toBe(siteConfig.contact.email);
  });

  it("defaults the sender to the authenticated mailbox", () => {
    expect(loadSmtpConfig(CREDENTIALS).from).toBe("contact@tokyo2ch.ch");
  });

  it("honours an explicit recipient and sender", () => {
    const config = loadSmtpConfig({
      ...CREDENTIALS,
      CONTACT_TO_EMAIL: "leads@tokyo2ch.ch",
      CONTACT_FROM_EMAIL: "noreply@tokyo2ch.ch",
    });

    expect(config.to).toBe("leads@tokyo2ch.ch");
    expect(config.from).toBe("noreply@tokyo2ch.ch");
  });

  it.each(["SMTP_HOST", "SMTP_USER", "SMTP_PASSWORD"] as const)(
    "names %s in the error when it is missing",
    (key) => {
      const { [key]: _omitted, ...incomplete } = CREDENTIALS;
      expect(() => loadSmtpConfig(incomplete)).toThrow(new RegExp(key));
    },
  );

  it("points at the Vercel dashboard when something is missing", () => {
    expect(() => loadSmtpConfig({})).toThrow(/Environment Variables/);
  });

  /**
   * Regression guard borrowed from `env.ts`: a variable created but left blank
   * in the Vercel dashboard reads as "" rather than undefined, and must fail as
   * *missing* rather than pass a blank host to the transport.
   */
  it("treats a blank value as unset rather than valid", () => {
    expect(() => loadSmtpConfig({ ...CREDENTIALS, SMTP_HOST: "   " })).toThrow(
      /Invalid SMTP configuration/,
    );
  });

  it("treats a blank optional recipient as unset rather than malformed", () => {
    expect(loadSmtpConfig({ ...CREDENTIALS, CONTACT_TO_EMAIL: "" }).to).toBe(
      siteConfig.contact.email,
    );
  });

  it("rejects a recipient that is not an email address", () => {
    expect(() => loadSmtpConfig({ ...CREDENTIALS, CONTACT_TO_EMAIL: "not-an-email" })).toThrow(
      /CONTACT_TO_EMAIL/,
    );
  });

  it("rejects a port outside the valid range", () => {
    expect(() => loadSmtpConfig({ ...CREDENTIALS, SMTP_PORT: "70000" })).toThrow(/SMTP_PORT/);
  });

  it("keeps a password whose whitespace is significant", () => {
    expect(loadSmtpConfig({ ...CREDENTIALS, SMTP_PASSWORD: " pad " }).password).toBe(" pad ");
  });
});

describe("sanitizeHeader", () => {
  it("leaves an ordinary value alone", () => {
    expect(sanitizeHeader("Ada Lovelace")).toBe("Ada Lovelace");
  });

  /**
   * The name fields reach the Subject line and Zod bounds only their length, so
   * a newline in one is a header-injection attempt.
   */
  it("collapses a newline rather than letting it split the header", () => {
    expect(sanitizeHeader("Ada\r\nBcc: victim@example.com")).toBe("Ada Bcc: victim@example.com");
  });

  it("strips other control characters", () => {
    expect(sanitizeHeader("Ada\u0007\u0000Lovelace")).toBe("Ada Lovelace");
  });
});

describe("escapeHtml", () => {
  it("escapes every character that could open a tag or attribute", () => {
    expect(escapeHtml(`<img src=x onerror="alert('1')">&`)).toBe(
      "&lt;img src=x onerror=&quot;alert(&#39;1&#39;)&quot;&gt;&amp;",
    );
  });

  it("leaves ordinary text untouched", () => {
    expect(escapeHtml("Honda Civic Type R")).toBe("Honda Civic Type R");
  });
});

describe("renderContactEmail", () => {
  it("puts the vehicle and the sender's name in the subject", () => {
    const { subject } = renderContactEmail(ENQUIRY);
    expect(subject).toContain("Honda Civic Type R EK9");
    expect(subject).toContain("Ada Lovelace");
  });

  it("replies to the visitor rather than the mailbox that sent it", () => {
    expect(renderContactEmail(ENQUIRY).replyTo).toBe("ada@example.com");
  });

  it("resolves option values to the labels the visitor saw", () => {
    const { text } = renderContactEmail(ENQUIRY);
    expect(text).toContain("Manuelle");
    expect(text).toContain("Excellent");
    expect(text).toContain("Instagram");
  });

  it("reports the visitor's language so the reply goes back in it", () => {
    expect(renderContactEmail(ENQUIRY, "de").text).toContain("Deutsch");
    expect(renderContactEmail(ENQUIRY).text).toContain("Français");
  });

  it("renders an em dash for the optional fields that were left empty", () => {
    const { text } = renderContactEmail({
      ...ENQUIRY,
      phone: "",
      requirements: "",
      notes: "",
      referral: "",
    });

    expect(text).toContain("Téléphone / WhatsApp : —");
    expect(text).toContain("Exigences supplémentaires : —");
  });

  it("carries every submitted field into the body", () => {
    const { text } = renderContactEmail(ENQUIRY);
    for (const value of ["Ada", "Lovelace", "ada@example.com", "1996-2000", "CHF 35 000"]) {
      expect(text).toContain(value);
    }
  });

  /** The body is assembled by hand, so every visitor-supplied value is escaped. */
  it("escapes markup a visitor typed into a free-text field", () => {
    const { html } = renderContactEmail({
      ...ENQUIRY,
      notes: '<script>alert("xss")</script>',
    });

    expect(html).not.toContain("<script>");
    expect(html).toContain("&lt;script&gt;");
  });

  it("keeps the line breaks of a multi-line note readable in HTML", () => {
    const { html } = renderContactEmail({ ...ENQUIRY, notes: "line one\nline two" });
    expect(html).toContain("line one<br>line two");
  });

  it("keeps a header-injection attempt out of the subject", () => {
    const { subject } = renderContactEmail({
      ...ENQUIRY,
      lastName: "Lovelace\nBcc: victim@example.com",
    });

    expect(subject).not.toContain("\n");
  });

  it("truncates a subject long enough to be elided by mail clients", () => {
    const { subject } = renderContactEmail({ ...ENQUIRY, vehicle: "R".repeat(160) });
    expect(subject.length).toBeLessThanOrEqual(160);
  });
});

describe("sendContactEmail", () => {
  it("connects with the configured credentials", async () => {
    vi.stubEnv("SMTP_HOST", CREDENTIALS.SMTP_HOST);
    vi.stubEnv("SMTP_PORT", CREDENTIALS.SMTP_PORT);
    vi.stubEnv("SMTP_USER", CREDENTIALS.SMTP_USER);
    vi.stubEnv("SMTP_PASSWORD", CREDENTIALS.SMTP_PASSWORD);

    await sendContactEmail(ENQUIRY);

    expect(createTransport).toHaveBeenCalledWith(
      expect.objectContaining({
        host: "smtp.hostinger.com",
        port: 465,
        secure: true,
        auth: { user: "contact@tokyo2ch.ch", pass: "s3cret" },
      }),
    );

    vi.unstubAllEnvs();
  });

  /**
   * Without these a wedged handshake runs out the Vercel function's own budget,
   * and the visitor sees a generic failure instead of a sent form.
   */
  it("bounds every stage of the connection with a timeout", async () => {
    vi.stubEnv("SMTP_HOST", CREDENTIALS.SMTP_HOST);
    vi.stubEnv("SMTP_USER", CREDENTIALS.SMTP_USER);
    vi.stubEnv("SMTP_PASSWORD", CREDENTIALS.SMTP_PASSWORD);

    await sendContactEmail(ENQUIRY);

    const options = createTransport.mock.calls[0]?.[0] ?? {};
    expect(options.connectionTimeout).toBeGreaterThan(0);
    expect(options.greetingTimeout).toBeGreaterThan(0);
    expect(options.socketTimeout).toBeGreaterThan(0);

    vi.unstubAllEnvs();
  });

  it("sends to the configured recipient, replying to the visitor", async () => {
    vi.stubEnv("SMTP_HOST", CREDENTIALS.SMTP_HOST);
    vi.stubEnv("SMTP_USER", CREDENTIALS.SMTP_USER);
    vi.stubEnv("SMTP_PASSWORD", CREDENTIALS.SMTP_PASSWORD);
    vi.stubEnv("CONTACT_TO_EMAIL", "leads@tokyo2ch.ch");

    await sendContactEmail(ENQUIRY, "it");

    expect(sendMail).toHaveBeenCalledWith(
      expect.objectContaining({
        to: "leads@tokyo2ch.ch",
        replyTo: "ada@example.com",
        from: { name: siteConfig.name, address: "contact@tokyo2ch.ch" },
      }),
    );

    vi.unstubAllEnvs();
  });

  it("releases the connection even when the send fails", async () => {
    vi.stubEnv("SMTP_HOST", CREDENTIALS.SMTP_HOST);
    vi.stubEnv("SMTP_USER", CREDENTIALS.SMTP_USER);
    vi.stubEnv("SMTP_PASSWORD", CREDENTIALS.SMTP_PASSWORD);
    sendMail.mockRejectedValueOnce(new Error("535 authentication failed"));

    await expect(sendContactEmail(ENQUIRY)).rejects.toThrow("535 authentication failed");
    expect(close).toHaveBeenCalled();

    vi.unstubAllEnvs();
  });

  it("fails before opening a connection when nothing is configured", async () => {
    vi.unstubAllEnvs();
    vi.stubEnv("SMTP_HOST", "");
    vi.stubEnv("SMTP_USER", "");
    vi.stubEnv("SMTP_PASSWORD", "");

    await expect(sendContactEmail(ENQUIRY)).rejects.toThrow(/Invalid SMTP configuration/);
    expect(createTransport).not.toHaveBeenCalled();

    vi.unstubAllEnvs();
  });
});
