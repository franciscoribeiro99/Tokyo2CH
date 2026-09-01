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
   * Skip anything that is not a page: build output, the API, and the
   * file-based icons and feeds, which must stay at their own URLs.
   */
  matcher: [
    "/((?!_next|api|icon.svg|apple-icon.png|opengraph-image|robots.txt|sitemap.xml|favicon.ico).*)",
  ],
};
