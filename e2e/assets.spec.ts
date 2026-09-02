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
    test(`no image on ${path} fails to load`, async ({ page }) => {
      /**
       * Asserted at the network layer, not on `<img>` state.
       *
       * The earlier version waited for every image to report `complete` with a
       * non-zero `naturalWidth`. That makes the check a race against when the
       * browser decides to fetch a lazy image: it failed CI on three different
       * pages and two different images while the optimiser was serving every
       * variant in under 0.65s. Scrolling to provoke the loads, then flipping
       * `loading` to eager, then stretching the budget to 60s each moved the
       * flake without removing it.
       *
       * What the proxy bug actually did was make image requests answer 307,
       * 404 and 400, so that is what to assert. A response either carries a
       * failing status or it does not — there is no waiting involved, and an
       * image the browser never asks for cannot produce a false failure.
       */
      const failures: string[] = [];
      let images = 0;
      let inFlight = 0;

      page.on("request", (request) => {
        if (request.resourceType() === "image") inFlight += 1;
      });

      page.on("response", (response) => {
        if (response.request().resourceType() !== "image") return;
        images += 1;
        inFlight -= 1;
        if (!response.ok()) failures.push(`${response.status()} ${response.url()}`);
      });

      page.on("requestfailed", (request) => {
        if (request.resourceType() !== "image") return;
        inFlight -= 1;
        failures.push(`${request.failure()?.errorText ?? "failed"} ${request.url()}`);
      });

      await page.goto(path);

      // Lazy images only start near the viewport, and an image never requested
      // is one this test never sees. The count assertion below is what stops
      // that silence from passing for success.
      await page.evaluate(async () => {
        for (let y = 0; y < document.body.scrollHeight; y += window.innerHeight / 2) {
          window.scrollTo(0, y);
          await new Promise((resolve) => setTimeout(resolve, 100));
        }
        window.scrollTo(0, 0);
      });
      /**
       * Wait on the image requests themselves, not on `networkidle`: these
       * pages stream a video, so the network never goes quiet and the wait
       * simply burned the whole test budget. Bounded, and deliberately not an
       * assertion — a request still in flight is not a failure, and the direct
       * requests below catch the proxy regression whatever this observes.
       */
      for (let waited = 0; inFlight > 0 && waited < 15_000; waited += 250) {
        await page.waitForTimeout(250);
      }

      expect(failures, `failing image responses on ${path}`).toEqual([]);
      expect(images, `no image was requested on ${path} at all`).toBeGreaterThan(0);
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
