import { describe, expect, it } from "vitest";
import { contactForm } from "@/config/content";
import { contactSchema, toFieldErrors } from "@/lib/contact-schema";

const valid = {
  firstName: "Ada",
  lastName: "Lovelace",
  email: "ada@example.com",
  phone: "+41 78 811 83 14",
  vehicle: "Honda Civic Type R EK9",
  year: "1996-2000",
  budget: "CHF 35,000",
  transmission: "manual",
  condition: "excellent",
  requirements: "Championship White, under 120k km, unmodified",
  notes: "Happy to wait for the right car.",
  referral: "instagram",
  website: "",
} as const;

describe("contactSchema", () => {
  it("accepts a well-formed enquiry", () => {
    expect(contactSchema.safeParse(valid).success).toBe(true);
  });

  it("trims surrounding whitespace on text fields", () => {
    const result = contactSchema.safeParse({ ...valid, vehicle: "  Nissan Skyline R34  " });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.vehicle).toBe("Nissan Skyline R34");
  });

  it.each([
    ["phone", "phone"],
    ["additional requirements", "requirements"],
    ["free-text notes", "notes"],
    ["the referral answer", "referral"],
  ])("treats %s as optional", (_label, field) => {
    const { [field as keyof typeof valid]: _omitted, ...rest } = valid;
    expect(contactSchema.safeParse(rest).success).toBe(true);
  });

  it.each([
    ["a missing first name", { firstName: "" }],
    ["a missing last name", { lastName: "" }],
    ["a malformed email", { email: "not-an-email" }],
    ["no vehicle", { vehicle: "" }],
    ["no desired year", { year: "" }],
    ["no budget", { budget: "" }],
  ])("rejects %s", (_label, override) => {
    expect(contactSchema.safeParse({ ...valid, ...override }).success).toBe(false);
  });

  /**
   * The placeholder option submits an empty string. If that passed, an enquiry
   * could arrive with no transmission chosen while the form looked satisfied.
   */
  it.each(["transmission", "condition"])(
    "rejects %s when the placeholder option is left selected",
    (field) => {
      const result = contactSchema.safeParse({ ...valid, [field]: "" });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(toFieldErrors(result.error)[field as "transmission"]).toBeDefined();
      }
    },
  );

  it.each(["transmission", "condition", "referral"])(
    "rejects a %s value that is not one of the offered options",
    (field) => {
      expect(contactSchema.safeParse({ ...valid, [field]: "not-an-option" }).success).toBe(false);
    },
  );

  it("accepts every option the form actually renders", () => {
    for (const option of contactForm.transmission) {
      expect(contactSchema.safeParse({ ...valid, transmission: option.value }).success).toBe(true);
    }
    for (const option of contactForm.condition) {
      expect(contactSchema.safeParse({ ...valid, condition: option.value }).success).toBe(true);
    }
    for (const option of contactForm.referral) {
      expect(contactSchema.safeParse({ ...valid, referral: option.value }).success).toBe(true);
    }
  });

  it("rejects a filled honeypot so bots can be identified", () => {
    const result = contactSchema.safeParse({ ...valid, website: "http://spam.example" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(toFieldErrors(result.error).website).toBeDefined();
    }
  });

  it("rejects notes over the 5000 character limit", () => {
    expect(contactSchema.safeParse({ ...valid, notes: "x".repeat(5001) }).success).toBe(false);
  });
});

describe("toFieldErrors", () => {
  it("groups messages under their field name", () => {
    const result = contactSchema.safeParse({ ...valid, firstName: "", email: "nope" });
    expect(result.success).toBe(false);
    if (result.success) return;

    const errors = toFieldErrors(result.error);
    expect(errors.firstName?.[0]).toBe("Please enter your first name.");
    expect(errors.email?.[0]).toBe("Please enter a valid email address.");
    expect(errors.vehicle).toBeUndefined();
  });
});
