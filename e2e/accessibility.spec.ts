import { expect, test } from "@playwright/test";

const ROUTES = ["/", "/services", "/about", "/contact", "/legal/privacy"] as const;

test.describe("accessibility fundamentals", () => {
  for (const route of ROUTES) {
    test(`${route} has exactly one h1 and required landmarks`, async ({ page }) => {
      await page.goto(route);

      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page.getByRole("banner")).toBeVisible();
      await expect(page.getByRole("main")).toBeVisible();
      await expect(page.getByRole("contentinfo")).toBeVisible();
    });
  }

  test("the skip link is the first tab stop and moves focus to main", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Tab");

    const skipLink = page.getByRole("link", { name: /skip to main content/i });
    await expect(skipLink).toBeFocused();

    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/#main$/);
  });

  test("every image carries an alt attribute", async ({ page }) => {
    await page.goto("/");

    const images = page.locator("img");
    const count = await images.count();

    for (let index = 0; index < count; index += 1) {
      await expect(images.nth(index)).toHaveAttribute("alt");
    }
  });

  test("html declares a language", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
  });
});
