import { expect, test } from "@playwright/test";

test.describe("navigation", () => {
  test("home page renders its hero and primary calls to action", async ({ page }) => {
    await page.goto("/fr");

    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByRole("link", { name: /lancer la recherche/i }).first()).toBeVisible();
  });

  test("every main nav destination resolves", async ({ page }) => {
    for (const path of ["/vehicles", "/how-it-works", "/our-services", "/faq", "/contact"]) {
      const response = await page.goto(`/fr${path}`);
      expect(response?.status(), `${path} should return 200`).toBe(200);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    }
  });

  test("desktop nav marks the current route with aria-current", async ({ page }) => {
    // The desktop nav is `hidden md:flex`, so force a wide viewport.
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/fr/vehicles");

    const nav = page.getByRole("navigation", { name: "Navigation principale" });
    await expect(nav.getByRole("link", { name: "Véhicules" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    await expect(nav.getByRole("link", { name: "Nos services" })).not.toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  test("mobile menu opens, marks the current route, and navigates", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/fr/vehicles");

    await page.getByRole("button", { name: /ouvrir le menu/i }).click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();

    await expect(dialog.getByRole("link", { name: "Véhicules" })).toHaveAttribute(
      "aria-current",
      "page",
    );

    await dialog.getByRole("link", { name: "Nos services" }).click();
    await expect(page).toHaveURL(/\/fr\/our-services$/);
  });

  /**
   * The status is what is asserted, not the wording. An unknown URL matches no
   * route, so Next serves its own bare 404 rather than the localised one — see
   * the note in `[lang]/not-found.tsx`. Answering 200 with a pretty page would
   * be the worse bug.
   */
  test("unknown routes answer 404 rather than 200", async ({ page }) => {
    const response = await page.goto("/fr/this-route-does-not-exist");
    expect(response?.status()).toBe(404);
  });
});
