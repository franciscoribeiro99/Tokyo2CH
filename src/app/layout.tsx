import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Zen_Kaku_Gothic_New } from "next/font/google";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { SkipLink } from "@/components/layout/skip-link";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { siteConfig } from "@/config/site";
import { buildMetadata, getSiteUrl, organizationJsonLd } from "@/lib/seo";
import "./globals.css";

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

/**
 * Display face. Chosen because it carries latin and kana in one family, so the
 * Japanese accents in the copy are set in the same voice as the headlines
 * rather than falling back to whatever the OS supplies.
 *
 * Only the two weights actually used are requested — this family has no
 * variable version, so every extra weight is another font file over the wire.
 */
const zenKaku = Zen_Kaku_Gothic_New({
  variable: "--font-zen-display",
  subsets: ["latin"],
  weight: ["500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  // metadataBase makes every relative OG/twitter image URL resolve correctly.
  metadataBase: new URL(getSiteUrl()),
  ...buildMetadata(),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.legalName }],
  creator: siteConfig.legalName,
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fbfaf7" },
    { media: "(prefers-color-scheme: dark)", color: "#0e1116" },
  ],
  colorScheme: "light dark",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang={siteConfig.lang}
      // next-themes writes the class here before paint; suppress the expected
      // server/client mismatch on this element only.
      suppressHydrationWarning
      // Next.js 16 stopped auto-overriding a global `scroll-behavior: smooth`
      // during route transitions; opt back in to the instant scroll-to-top.
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} ${zenKaku.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SkipLink />
          <SiteHeader />
          <main id="main" className="flex flex-1 flex-col">
            {children}
          </main>
          <SiteFooter />
          <Toaster />
        </ThemeProvider>

        {/* Organization + WebSite graph, emitted once for the whole site. */}
        <script
          type="application/ld+json"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD must be inlined; content is generated from static config, not user input.
          dangerouslySetInnerHTML={{ __html: organizationJsonLd() }}
        />

        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
