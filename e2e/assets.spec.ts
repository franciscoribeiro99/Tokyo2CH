import { expect, test } from "@playwright/test";

/**
 * Regression cover for a proxy matcher that swallowed `public/`.
 *
 * The locale proxy redirects unprefixed paths, and its first matcher listed
 * only the file-based routes by name. Everything under /media was therefore
 * redirected to /fr/media/… and 404'd, and the image optimiser answered 400
 * because the file it fetches was being redirected under it.
 *
 * The accessibility suite did not catch it: asserting that an `<img>` carries
 * an `alt` attribute says nothing about whether the image loaded. These tests
 * check bytes actually arrive.
 *
 * Caveat, measured rather than assumed: with a warm `.next/cache/images`, the
 * "actually loads" tests still pass while the bug is present, because the
 * optimiser serves cached bytes without re-fetching the file. Cold, six of the
 * seven fail. CI builds fresh so it is covered there — but the direct request
 * below is the one that catches it in every case, which is why it exists
 * alongside the visual checks rather than instead of them.
 */

const PAGES = ["/fr", "/fr/vehicles", "/fr/how-it-works", "/fr/contact"] as const;

test.describe("static assets", () => {
  for (const path of PAGES) {
    test(`every image on ${path} actually loads`, async ({ page }) => {
      await page.goto(path);

      /**
       * Scroll the page first. Most of these are lazy, so they only begin
       * loading once they near the viewport — without this, WebKit and Firefox
       * report them as incomplete and the test fails on images that were never
       * asked for. Chromium happened to load them anyway, which is exactly the
       * kind of difference that makes a browser-specific flake.
       */
      await page.evaluate(async () => {
        for (let y = 0; y < document.body.scrollHeight; y += window.innerHeight / 2) {
          window.scrollTo(0, y);
          await new Promise((resolve) => setTimeout(resolve, 100));
        }
        window.scrollTo(0, 0);
      });

      await expect
        .poll(
          () =>
            page.evaluate(() =>
              Array.from(document.images)
                .filter((image) => !image.complete || image.naturalWidth === 0)
                .map((image) => image.currentSrc || image.src),
            ),
          { message: `broken images on ${path}`, timeout: 15_000 },
        )
        .toEqual([]);
    });
  }

  test("files in public/ are served rather than redirected into a locale", async ({ request }) => {
    for (const file of [
      "/media/hero-poster.jpg",
      "/media/journey-drive.mp4",
      "/media/vehicle-suv.jpg",
      "/icon.svg",
    ]) {
      const response = await request.get(file, { maxRedirects: 0 });
      expect(response.status(), `${file} should be served directly`).toBe(200);
    }
  });

  test("the image optimiser can read a local file", async ({ request }) => {
    const response = await request.get("/_next/image?url=%2Fmedia%2Fhero-poster.jpg&w=1920&q=75");

    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("image");
  });

  test("unprefixed pages are still redirected into a language", async ({ request }) => {
    // The fix must not have disabled the proxy along with it.
    const response = await request.get("/vehicles", { maxRedirects: 0 });
    expect(response.status()).toBe(307);
    expect(response.headers().location).toMatch(/\/(fr|de|it|en)\/vehicles$/);
  });
});
