/**
 * Single source of truth for everything brand-specific.
 *
 * Per AGENTS.md, brand copy lives here and nowhere else — no component should
 * hardcode the company name, email, or URL.
 */

export interface NavItem {
  readonly title: string;
  readonly href: string;
  readonly description?: string;
}

export interface SocialLink {
  readonly label: string;
  readonly href: string;
}

/**
 * ---------------------------------------------------------------------------
 * TODO — PLACEHOLDER CONTACT DATA, REPLACE BEFORE LAUNCH
 * ---------------------------------------------------------------------------
 * These values are carried over verbatim from the live WordPress site, where
 * they are themselves placeholders. They are wrong on purpose — copying them
 * across is a deliberate choice so nothing is silently invented.
 *
 *   contact.email      a personal Gmail address, not a business address
 *   contact.phone      "(+1) 23456789" is not a real, or Swiss, number
 *   contact.address    literally "Example avenue 100, example country"
 *   social Facebook    bare domain, no page
 *   social TikTok      bare domain, no profile
 *
 * `contact.instagram` is the one real handle on the live site.
 * Everything above is also emitted into schema.org Organization markup by
 * src/lib/seo.ts, so leaving it wrong has SEO consequences, not just visual
 * ones. Replace all five, then delete this block.
 * ---------------------------------------------------------------------------
 */
export const siteConfig = {
  name: "Tokyo2CH",
  shortName: "Tokyo2CH",
  tagline: "Your Japanese vehicle, brought to Switzerland.",
  description:
    "Tokyo2CH sources and imports Japanese vehicles to Switzerland on demand, guiding clients through selection, shipping, regulations, and registration.",

  /**
   * Canonical, absolute, no trailing slash.
   * Overridden per-environment by NEXT_PUBLIC_SITE_URL — see src/lib/env.ts.
   */
  url: "https://tokyo2ch.ch",

  locale: "en_CH",
  lang: "en",

  contact: {
    email: "claudiosantos.hbk@gmail.com",
    phone: "(+1) 23456789",
    /** `tel:` URIs may not contain spaces or parentheses. */
    phoneHref: "tel:+123456789",
    address: "Example avenue 100, example country",
    hours: "9am – 6pm",
  },

  mainNav: [
    { title: "Vehicles", href: "/vehicles" },
    { title: "How It Works", href: "/how-it-works" },
    { title: "Our Services", href: "/our-services" },
    { title: "FAQ", href: "/faq" },
    { title: "Contact", href: "/contact" },
  ] as const satisfies readonly NavItem[],

  footerNav: [
    { title: "Privacy", href: "/legal/privacy" },
    { title: "Terms", href: "/legal/terms" },
  ] as const satisfies readonly NavItem[],

  social: [
    { label: "Instagram", href: "https://instagram.com/tokyo_2ch" },
    { label: "Facebook", href: "https://facebook.com" },
    { label: "TikTok", href: "https://tiktok.com" },
  ] as const satisfies readonly SocialLink[],

  /** Used for structured data and the OG image credit line. */
  legalName: "Tokyo2CH",
  foundingYear: 2026,
} as const;

export type SiteConfig = typeof siteConfig;
