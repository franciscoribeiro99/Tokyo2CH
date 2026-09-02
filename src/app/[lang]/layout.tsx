import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Zen_Kaku_Gothic_New } from "next/font/google";
import localFont from "next/font/local";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { SkipLink } from "@/components/layout/skip-link";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { LOCALE_HTML_LANG, LOCALES } from "@/config/i18n";
import { siteConfig } from "@/config/site";
import { getDictionary, getLocale } from "@/content/dictionaries";
import { buildMetadata, getSiteUrl, organizationJsonLd } from "@/lib/seo";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

/** Display face for headings. Latin only — the kana come from zenKakuKana. */
const zenKaku = Zen_Kaku_Gothic_New({
  variable: "--font-zen-display",
  subsets: ["latin"],
  weight: ["500", "700"],
  display: "swap",
});

/**
 * The eight kana in the hero, and nothing else.
 *
 * `next/font/google` does not offer this family's Japanese subset — its types
 * allow only latin, latin-ext and cyrillic — so a latin-subset file contains
 * no kana at all and 日本からスイスへ falls back to whatever the operating
 * system supplies, or to empty boxes on a machine with no Japanese font.
 *
 * The file is Google's own `text=` subset, which returns only the glyphs asked
 * for: 1.4 kB rather than the several megabytes a full Japanese face weighs.
 * It is committed and served from our own origin. Loading it over a `<link>`
 * to fonts.googleapis.com, as this did before, sent every visitor's IP address
 * to a third country on every page view for two kilobytes of font — a data
 * export to disclose under art. 16-17 nLPD, bought for nothing.
 *
 * `unicode-range` keeps the face scoped to the seven codepoints it actually
 * contains, so the browser fetches it only when that string is rendered and
 * never consults it for latin text.
 *
 * `adjustFontFallback` is off deliberately. It would emit a metric-adjusted
 * fallback family alongside this one, and that family carries no
 * `unicode-range` — first in the display stack, it would capture every latin
 * heading on the site and render it in adjusted Arial.
 */
const zenKakuKana = localFont({
  src: "../fonts/zen-kaku-gothic-new-kana-700.woff2",
  variable: "--font-zen-kana",
  weight: "700",
  style: "normal",
  display: "swap",
  adjustFontFallback: false,
  declarations: [
    { prop: "unicode-range", value: "U+304b, U+3078, U+3089, U+30a4, U+30b9, U+65e5, U+672c" },
  ],
});

/** Prerenders all four languages at build time. */
export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata(): Promise<Metadata> {
  const dictionary = await getDictionary();

  return {
    // metadataBase makes every relative OG/twitter image URL resolve correctly.
    metadataBase: new URL(getSiteUrl()),
    ...(await buildMetadata()),
    title: {
      default: siteConfig.name,
      template: `%s | ${siteConfig.name}`,
    },
    description: dictionary.brand.description,
    applicationName: siteConfig.name,
    authors: [{ name: siteConfig.legalName }],
    creator: siteConfig.legalName,
    formatDetection: { telephone: false },
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fbfaf7" },
    { media: "(prefers-color-scheme: dark)", color: "#0e1116" },
  ],
  colorScheme: "light dark",
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const locale = await getLocale();
  const dictionary = await getDictionary();

  return (
    <html
      lang={LOCALE_HTML_LANG[locale]}
      // next-themes writes the class here before paint; suppress the expected
      // server/client mismatch on this element only.
      suppressHydrationWarning
      // Next.js 16 stopped auto-overriding a global `scroll-behavior: smooth`
      // during route transitions; opt back in to the instant scroll-to-top.
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} ${zenKaku.variable} ${zenKakuKana.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SkipLink label={dictionary.nav.skipToContent} />
          <SiteHeader locale={locale} dictionary={dictionary} />
          <main id="main" className="flex flex-1 flex-col">
            {children}
          </main>
          <SiteFooter locale={locale} dictionary={dictionary} />
          <Toaster />
        </ThemeProvider>

        {/* Organization + WebSite graph, emitted once for the whole site. */}
        <script
          type="application/ld+json"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD must be inlined; content is generated from static config, not user input.
          dangerouslySetInnerHTML={{ __html: organizationJsonLd(locale, dictionary) }}
        />

        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
