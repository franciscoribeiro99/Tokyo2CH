import { describe, expect, it } from "vitest";
import { contactSchema, toFieldErrors } from "@/lib/contact-schema";

const valid = {
  name: "Ada Lovelace",
  email: "ada@example.com",
  vehicle: "R34 GT-R, manual, under CHF 60k",
  message: "Looking for a clean manual R34 GT-R, budget around CHF 60k. What is findable?",
  website: "",
} as const;

describe("contactSchema", () => {
  it("accepts a well-formed submission", () => {
    const result = contactSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it("trims surrounding whitespace on text fields", () => {
    const result = contactSchema.safeParse({ ...valid, name: "  Ada Lovelace  " });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.name).toBe("Ada Lovelace");
  });

  it("treats the vehicle field as optional", () => {
    const { vehicle: _vehicle, ...withoutVehicle } = valid;
    expect(contactSchema.safeParse(withoutVehicle).success).toBe(true);
  });

  it.each([
    ["a name that is too short", { name: "A" }],
    ["a malformed email", { email: "not-an-email" }],
    ["a message under 20 characters", { message: "too short" }],
  ])("rejects %s", (_label, override) => {
    const result = contactSchema.safeParse({ ...valid, ...override });
    expect(result.success).toBe(false);
  });

  it("rejects a filled honeypot so bots can be identified", () => {
    const result = contactSchema.safeParse({ ...valid, website: "http://spam.example" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(toFieldErrors(result.error).website).toBeDefined();
    }
  });

  it("rejects a message over the 5000 character limit", () => {
    const result = contactSchema.safeParse({ ...valid, message: "x".repeat(5001) });
    expect(result.success).toBe(false);
  });
});

describe("toFieldErrors", () => {
  it("groups messages under their field name", () => {
    const result = contactSchema.safeParse({ ...valid, name: "A", email: "nope" });
    expect(result.success).toBe(false);
    if (result.success) return;

    const errors = toFieldErrors(result.error);
    expect(errors.name?.[0]).toBe("Please enter your name.");
    expect(errors.email?.[0]).toBe("Please enter a valid email address.");
    expect(errors.message).toBeUndefined();
  });

  it("returns an empty map when there is nothing to report", () => {
    const result = contactSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });
});
