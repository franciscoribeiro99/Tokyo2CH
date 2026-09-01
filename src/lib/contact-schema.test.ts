import { describe, expect, it } from "vitest";
import { de } from "@/content/de";
import { fr } from "@/content/fr";
import { makeContactSchema, toFieldErrors } from "@/lib/contact-schema";

const schema = makeContactSchema(fr.form.errors);

const valid = {
  firstName: "Ada",
  lastName: "Lovelace",
  email: "ada@example.com",
  phone: "+41 78 811 83 14",
  vehicle: "Honda Civic Type R EK9",
  year: "1996-2000",
  budget: "CHF 35 000",
  transmission: "manual",
  condition: "excellent",
  requirements: "Championship White, moins de 120 000 km, d'origine",
  notes: "Je peux attendre la bonne voiture.",
  referral: "instagram",
  website: "",
} as const;

describe("contactSchema", () => {
  it("accepts a well-formed enquiry", () => {
    expect(schema.safeParse(valid).success).toBe(true);
  });

  it("trims surrounding whitespace on text fields", () => {
    const result = schema.safeParse({ ...valid, vehicle: "  Nissan Skyline R34  " });
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
    expect(schema.safeParse(rest).success).toBe(true);
  });

  it.each([
    ["a missing first name", { firstName: "" }],
    ["a missing last name", { lastName: "" }],
    ["a malformed email", { email: "not-an-email" }],
    ["no vehicle", { vehicle: "" }],
    ["no desired year", { year: "" }],
    ["no budget", { budget: "" }],
  ])("rejects %s", (_label, override) => {
    expect(schema.safeParse({ ...valid, ...override }).success).toBe(false);
  });

  /**
   * The placeholder option submits an empty string. If that passed, an enquiry
   * could arrive with no transmission chosen while the form looked satisfied.
   */
  it.each(["transmission", "condition"])(
    "rejects %s when the placeholder option is left selected",
    (field) => {
      const result = schema.safeParse({ ...valid, [field]: "" });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(toFieldErrors(result.error)[field as "transmission"]).toBeDefined();
      }
    },
  );

  it.each(["transmission", "condition", "referral"])(
    "rejects a %s value that is not one of the offered options",
    (field) => {
      expect(schema.safeParse({ ...valid, [field]: "not-an-option" }).success).toBe(false);
    },
  );

  it("rejects a filled honeypot so bots can be identified", () => {
    const result = schema.safeParse({ ...valid, website: "http://spam.example" });
    expect(result.success).toBe(false);
    if (!result.success) expect(toFieldErrors(result.error).website).toBeDefined();
  });

  /**
   * The whole point of building the schema per request: a German visitor must
   * not be told what is wrong in French.
   */
  it("reports its errors in the language it was built with", () => {
    const french = makeContactSchema(fr.form.errors).safeParse({ ...valid, firstName: "" });
    const german = makeContactSchema(de.form.errors).safeParse({ ...valid, firstName: "" });

    expect(french.success).toBe(false);
    expect(german.success).toBe(false);
    if (french.success || german.success) return;

    expect(toFieldErrors(french.error).firstName?.[0]).toBe(fr.form.errors.firstName);
    expect(toFieldErrors(german.error).firstName?.[0]).toBe(de.form.errors.firstName);
    expect(fr.form.errors.firstName).not.toBe(de.form.errors.firstName);
  });
});

describe("toFieldErrors", () => {
  it("groups messages under their field name", () => {
    const result = schema.safeParse({ ...valid, firstName: "", email: "nope" });
    expect(result.success).toBe(false);
    if (result.success) return;

    const errors = toFieldErrors(result.error);
    expect(errors.firstName?.[0]).toBe(fr.form.errors.firstName);
    expect(errors.email?.[0]).toBe(fr.form.errors.email);
    expect(errors.vehicle).toBeUndefined();
  });
});
