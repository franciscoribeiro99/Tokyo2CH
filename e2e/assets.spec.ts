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
      /**
       * Generous on purpose. This asserts the bytes arrive, not how quickly:
       * on a cold `.next/cache/images` the optimiser has to produce every
       * variant on demand, and a page of six photographs can sit well past the
       * default budget on a CI runner. The proxy regression this file exists
       * for is caught in milliseconds by the direct-request tests below, so a
       * long wait here costs nothing in coverage and buys a suite that does not
       * cry wolf.
       */
      test.setTimeout(90_000);

      await page.goto(path);

      /**
       * Opt every image out of lazy loading rather than scrolling to provoke it,
       * and do it inside the poll so it is reasserted on every attempt.
       *
       * The earlier version scrolled in fixed steps and polled for 15s, which
       * made the check a race against viewport heuristics that differ per
       * browser: on a loaded CI runner one below-the-fold image had still not
       * arrived when the budget ran out. Flipping `loading` starts the request
       * immediately, so the wait is bounded by the network rather than by how
       * far something happened to be scrolled.
       *
       * `decode()` looked like the tidier wait and is not portable: Firefox
       * rejects it when the candidate is re-selected mid-decode, which reads as
       * a broken image on a page that is fine.
       */
      await expect
        .poll(
          () =>
            page.evaluate(() => {
              const broken: string[] = [];

              for (const image of document.images) {
                image.loading = "eager";
                if (!image.complete || image.naturalWidth === 0) {
                  /**
                   * `currentSrc` is empty until a candidate loads, so a failure
                   * falls back to `src` — for next/image the largest srcset
                   * entry, which no browser here ever requests. Worth knowing
                   * before chasing the URL a failure prints.
                   */
                  broken.push(image.currentSrc || image.src);
                }
              }

              return broken;
            }),
          { message: `broken images on ${path}`, timeout: 60_000 },
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
