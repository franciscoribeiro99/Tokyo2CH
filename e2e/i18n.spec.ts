import { expect, test } from "@playwright/test";

test.describe("languages", () => {
  test("an unprefixed URL is redirected into a language", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/\/(fr|de|it|en)$/);
  });

  test("the browser's language decides which one", async ({ browser }) => {
    const context = await browser.newContext({ locale: "de-CH" });
    const page = await context.newPage();

    await page.goto("/");
    await expect(page).toHaveURL(/\/de$/);

    await context.close();
  });

  test("an unknown language falls back to French rather than 404ing", async ({ browser }) => {
    const context = await browser.newContext({ locale: "pt-BR" });
    const page = await context.newPage();

    await page.goto("/");
    await expect(page).toHaveURL(/\/fr$/);

    await context.close();
  });

  /**
   * The single most common complaint about multilingual sites: the switcher
   * throws you back to the home page instead of showing the page you were on.
   */
  test("switching language keeps you on the same page", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/fr/vehicles");

    // The switcher appears twice — compact in the header, spelled out in the
    // footer — so scope to the header and match the short label exactly.
    await page
      .getByRole("banner")
      .getByRole("navigation", { name: "Langue" })
      .getByRole("link", { name: "DE", exact: true })
      .click();

    await expect(page).toHaveURL(/\/de\/vehicles$/);
    await expect(page.locator("html")).toHaveAttribute("lang", "de-CH");
  });

  test("each language renders its own copy, not the French", async ({ page }) => {
    await page.goto("/de/vehicles");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Fahrzeuge");

    await page.goto("/it/vehicles");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("veicoli");
  });

  test("every page advertises all four languages plus x-default", async ({ page }) => {
    await page.goto("/fr/contact");

    for (const locale of ["fr", "de", "it", "en"]) {
      await expect(page.locator(`link[rel="alternate"][hreflang="${locale}"]`)).toHaveAttribute(
        "href",
        new RegExp(`/${locale}/contact$`),
      );
    }
    await expect(page.locator('link[rel="alternate"][hreflang="x-default"]')).toHaveAttribute(
      "href",
      /\/fr\/contact$/,
    );
  });

  test("the canonical points at the language being read", async ({ page }) => {
    await page.goto("/it/faq");
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", /\/it\/faq$/);
  });

  test("the legal pages name the language that governs", async ({ page }) => {
    await page.goto("/de/legal/terms");
    await expect(page.getByText(/französische Fassung massgebend/i)).toBeVisible();
  });
});
