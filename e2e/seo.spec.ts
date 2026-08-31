import { expect, test } from "@playwright/test";

test.describe("seo surface", () => {
  test("pages carry a title, description, and self-referencing canonical", async ({ page }) => {
    await page.goto("/about");

    await expect(page).toHaveTitle(/About/);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /.+/);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", /\/about$/);
  });

  test("open graph and twitter tags are present", async ({ page }) => {
    await page.goto("/");

    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute("content", /.+/);
    await expect(page.locator('meta[property="og:description"]')).toHaveAttribute("content", /.+/);
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
      "content",
      "summary_large_image",
    );
  });

  test("emits a valid Organization + WebSite JSON-LD graph", async ({ page }) => {
    await page.goto("/");

    const raw = await page.locator('script[type="application/ld+json"]').first().textContent();
    expect(raw).toBeTruthy();

    const parsed = JSON.parse(raw ?? "{}");
    expect(parsed["@context"]).toBe("https://schema.org");
    expect(parsed["@graph"].map((node: { "@type": string }) => node["@type"])).toEqual([
      "Organization",
      "WebSite",
    ]);
  });

  test("serves sitemap.xml listing the public routes", async ({ request }) => {
    const response = await request.get("/sitemap.xml");

    expect(response.status()).toBe(200);
    const body = await response.text();
    for (const path of ["/services", "/about", "/contact"]) {
      expect(body).toContain(path);
    }
  });

  test("serves robots.txt pointing at the sitemap", async ({ request }) => {
    const response = await request.get("/robots.txt");

    expect(response.status()).toBe(200);
    expect(await response.text()).toContain("Sitemap:");
  });

  test("generates a social card image", async ({ request }) => {
    const response = await request.get("/opengraph-image");

    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("image/png");
  });

  test("security headers are applied", async ({ request }) => {
    const headers = (await request.get("/")).headers();

    expect(headers["x-content-type-options"]).toBe("nosniff");
    expect(headers["x-frame-options"]).toBe("DENY");
    expect(headers["referrer-policy"]).toBe("strict-origin-when-cross-origin");
    expect(headers["x-powered-by"]).toBeUndefined();
  });

  test("health endpoint reports ok and is not cached", async ({ request }) => {
    const response = await request.get("/api/health");

    expect(response.status()).toBe(200);
    expect((await response.json()).status).toBe("ok");
    expect(response.headers()["cache-control"]).toContain("no-store");
  });
});
