import { expect, test } from "@playwright/test";

test.describe("navigation", () => {
  test("home page renders its hero and primary calls to action", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByRole("link", { name: /start a project/i })).toBeVisible();
  });

  test("every main nav destination resolves", async ({ page }) => {
    for (const path of ["/services", "/about", "/contact"]) {
      const response = await page.goto(path);
      expect(response?.status(), `${path} should return 200`).toBe(200);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    }
  });

  test("desktop nav marks the current route with aria-current", async ({ page }) => {
    // The desktop nav is `hidden md:flex`, so force a wide viewport regardless
    // of which project this runs under.
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/about");

    const nav = page.getByRole("navigation", { name: "Main" });
    await expect(nav.getByRole("link", { name: "About" })).toHaveAttribute("aria-current", "page");
    await expect(nav.getByRole("link", { name: "Services" })).not.toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  test("mobile menu opens, marks the current route, and navigates", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/about");

    await page.getByRole("button", { name: /open menu/i }).click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();

    await expect(dialog.getByRole("link", { name: "About" })).toHaveAttribute(
      "aria-current",
      "page",
    );

    await dialog.getByRole("link", { name: "Services" }).click();
    await expect(page).toHaveURL(/\/services$/);
  });

  test("unknown routes return a 404 page, not a crash", async ({ page }) => {
    const response = await page.goto("/this-route-does-not-exist");

    expect(response?.status()).toBe(404);
    await expect(page.getByText("We could not find that page.")).toBeVisible();
  });
});
