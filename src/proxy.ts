import { type NextRequest, NextResponse } from "next/server";
import { LOCALES, resolveLocale } from "@/config/i18n";

/**
 * Sends every unprefixed request to a language.
 *
 * Every locale is prefixed, including the default, so `/` and `/vehicles` are
 * not real routes. Rather than 404 them, this redirects to the same path under
 * the language the browser asked for — which also means an unknown path still
 * lands inside a locale and renders the styled 404 rather than the bare
 * framework one.
 *
 * `proxy` is what Next 16 calls this file; it was `middleware` before.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hasLocale = LOCALES.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );
  if (hasLocale) return NextResponse.next();

  const locale = resolveLocale(request.headers.get("accept-language"));
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  /**
   * Pages only.
   *
   * The previous matcher listed the file-based routes by name, which missed
   * everything in `public/`: every request for /media/… was redirected to
   * /fr/media/…, so every image and the video 404'd, and the image optimiser
   * answered 400 because the file it fetches was being redirected under it.
   *
   * Excluding any path containing a dot covers all of public/ and the
   * extension-bearing routes at once, and keeps covering them when new assets
   * are added. `opengraph-image` is listed separately because it is a route
   * with no extension.
   */
  matcher: ["/((?!_next|api|opengraph-image|.*\\..*).*)"],
};
