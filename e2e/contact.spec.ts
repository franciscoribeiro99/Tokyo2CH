import { expect, test } from "@playwright/test";

test.describe("contact form", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/contact");
  });

  test("rejects an invalid submission and reports it on the field", async ({ page }) => {
    await page.getByLabel(/^name/i).fill("A");
    await page.getByLabel(/^email/i).fill("not-an-email");
    await page.getByLabel(/how can we help/i).fill("short");
    await page.getByRole("button", { name: /send message/i }).click();

    await expect(page.getByText("Please enter your name.")).toBeVisible();
    await expect(page.getByText("Please enter a valid email address.")).toBeVisible();
    await expect(page.getByLabel(/^email/i)).toHaveAttribute("aria-invalid", "true");
  });

  test("accepts a valid submission and clears the form", async ({ page }) => {
    await page.getByLabel(/^name/i).fill("Ada Lovelace");
    await page.getByLabel(/^email/i).fill("ada@example.com");
    await page
      .getByLabel(/how can we help/i)
      .fill("We need help shipping an analytics surface before Q3.");

    await page.getByRole("button", { name: /send message/i }).click();

    await expect(page.getByText(/we'll be in touch shortly/i).first()).toBeVisible();
    await expect(page.getByLabel(/^name/i)).toHaveValue("");
  });

  test("keeps the honeypot out of the accessibility tree", async ({ page }) => {
    const honeypot = page.locator('input[name="website"]');

    await expect(honeypot).toHaveCount(1);
    await expect(honeypot).toBeHidden();
    await expect(honeypot).toHaveAttribute("tabindex", "-1");
  });
});
