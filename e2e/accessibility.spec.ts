import { expect, test } from "@playwright/test";

const LOCALES = ["fr", "de", "it", "en"] as const;

const PATHS = [
  "/",
  "/vehicles",
  "/how-it-works",
  "/our-services",
  "/faq",
  "/contact",
  "/legal/privacy",
  "/legal/terms",
] as const;

test.describe("accessibility fundamentals", () => {
  for (const path of PATHS) {
    test(`/fr${path} has exactly one h1 and required landmarks`, async ({ page }) => {
      await page.goto(`/fr${path === "/" ? "" : path}`);

      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page.getByRole("banner")).toBeVisible();
      await expect(page.getByRole("main")).toBeVisible();
      await expect(page.getByRole("contentinfo")).toBeVisible();
    });
  }

  for (const locale of LOCALES) {
    test(`the ${locale} home page renders and declares its language`, async ({ page }) => {
      await page.goto(`/${locale}`);

      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page.locator("html")).toHaveAttribute("lang", `${locale}-CH`);
    });
  }

  test("the skip link is the first tab stop and moves focus to main", async ({ page }) => {
    await page.goto("/fr");
    await page.keyboard.press("Tab");

    const skipLink = page.getByRole("link", { name: /aller au contenu/i });
    await expect(skipLink).toBeFocused();

    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/#main$/);
  });

  test("every image carries an alt attribute", async ({ page }) => {
    await page.goto("/fr");

    const images = page.locator("img");
    const count = await images.count();

    for (let index = 0; index < count; index += 1) {
      await expect(images.nth(index)).toHaveAttribute("alt");
    }
  });
});
