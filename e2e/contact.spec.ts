import { expect, test } from "@playwright/test";

test.describe("vehicle request form", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/contact");
  });

  test("rejects an invalid submission and reports it on the field", async ({ page }) => {
    await page.getByLabel("First").fill("");
    await page.getByLabel(/^email address/i).fill("not-an-email");
    await page.getByRole("button", { name: /request a vehicle/i }).click();

    await expect(page.getByText("Please enter your first name.")).toBeVisible();
    await expect(page.getByText("Please enter a valid email address.")).toBeVisible();
    await expect(page.getByLabel(/^email address/i)).toHaveAttribute("aria-invalid", "true");
  });

  test("requires a choice in the two select fields", async ({ page }) => {
    await page.getByLabel("First").fill("Ada");
    await page.getByLabel("Last").fill("Lovelace");
    await page.getByLabel(/^email address/i).fill("ada@example.com");
    await page.getByLabel(/what vehicle are you looking for/i).fill("Honda Civic Type R EK9");
    await page.getByLabel(/desired year/i).fill("1996-2000");
    await page.getByLabel(/budget/i).fill("CHF 35,000");
    // Transmission and condition deliberately left on the placeholder option.
    await page.getByRole("button", { name: /request a vehicle/i }).click();

    await expect(page.getByText("Please choose a transmission.")).toBeVisible();
    await expect(page.getByText("Please choose a vehicle condition.")).toBeVisible();
  });

  test("accepts a complete request and clears the form", async ({ page }) => {
    await page.getByLabel("First").fill("Ada");
    await page.getByLabel("Last").fill("Lovelace");
    await page.getByLabel(/^email address/i).fill("ada@example.com");
    await page.getByLabel(/phone \/ whatsapp/i).fill("+41 78 811 83 14");
    await page.getByLabel(/what vehicle are you looking for/i).fill("Honda Civic Type R EK9");
    await page.getByLabel(/desired year/i).fill("1996-2000");
    await page.getByLabel(/budget/i).fill("CHF 35,000");
    await page.getByLabel(/transmission/i).selectOption("manual");
    await page.getByLabel(/vehicle condition/i).selectOption("excellent");
    await page.getByLabel(/additional requirements/i).fill("Championship White, unmodified");
    await page.getByLabel(/anything else/i).fill("Happy to wait for the right car.");
    await page.getByLabel(/how did you hear/i).selectOption("instagram");

    await page.getByRole("button", { name: /request a vehicle/i }).click();

    await expect(page.getByText(/we'll be in touch shortly/i).first()).toBeVisible();
    await expect(page.getByLabel("First")).toHaveValue("");
  });

  test("keeps the honeypot out of the accessibility tree", async ({ page }) => {
    const honeypot = page.locator('input[name="website"]');

    await expect(honeypot).toHaveCount(1);
    await expect(honeypot).toBeHidden();
    await expect(honeypot).toHaveAttribute("tabindex", "-1");
  });
});
