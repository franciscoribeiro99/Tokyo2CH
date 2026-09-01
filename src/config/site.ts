/**
 * Single source of truth for everything brand-specific.
 *
 * Per AGENTS.md, brand copy lives here and nowhere else — no component should
 * hardcode the company name, email, or URL.
 */

/**
 * A navigation entry.
 *
 * `key` looks the label up in the current dictionary; `href` is the path
 * without a locale prefix, which `localePath` adds at render time. Storing the
 * English label here is what would make the nav monolingual.
 */
export interface NavItem {
  readonly key: "vehicles" | "howItWorks" | "ourServices" | "faq" | "contact" | "privacy" | "terms";
  readonly href: string;
}

export interface SocialLink {
  readonly label: string;
  readonly href: string;
}

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
    email: "contact@tokyo2ch.ch",
    phone: "+41 78 811 83 14",
    /** `tel:` URIs may not contain spaces or parentheses. */
    phoneHref: "tel:+41788118314",
    /**
     * Shown on the contact page. Region-level on purpose: there is no public
     * office to publish, and a region is honest where a fabricated street
     * address would not be.
     */
    address: "Valais, Switzerland",
    /**
     * The same location, structured for schema.org. Kept separate from the
     * display string because "Valais, Switzerland" is a region and a country,
     * not a streetAddress — putting it in the wrong field is how search
     * engines end up with a business at a street that does not exist.
     */
    addressRegion: "Valais",
    /** ISO 3166-1 alpha-2, which is what schema.org expects. */
    addressCountry: "CH",
    hours: "9am – 6pm",
  },

  mainNav: [
    { key: "vehicles", href: "/vehicles" },
    { key: "howItWorks", href: "/how-it-works" },
    { key: "ourServices", href: "/our-services" },
    { key: "faq", href: "/faq" },
    { key: "contact", href: "/contact" },
  ] as const satisfies readonly NavItem[],

  footerNav: [
    { key: "privacy", href: "/legal/privacy" },
    { key: "terms", href: "/legal/terms" },
  ] as const satisfies readonly NavItem[],

  social: [
    { label: "Instagram", href: "https://instagram.com/tokyo_2ch" },
  ] as const satisfies readonly SocialLink[],

  /** Used for structured data and the OG image credit line. */
  legalName: "Tokyo2CH",
  foundingYear: 2026,
} as const;

export type SiteConfig = typeof siteConfig;
