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
 * TODO — the postal address is not set.
 * ---------------------------------------------------------------------------
 * Email and phone are real. `contact.address` is deliberately empty rather
 * than filler: the contact page and the schema.org markup both skip it when
 * blank. Fill it in when there is a real one and it appears in both places.
 *
 * Nothing here should claim more than the business can currently back: no
 * testimonials, no counts, no social profiles that do not exist yet.
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
    email: "contact@tokyo2ch.ch",
    phone: "+41 78 811 83 14",
    /** `tel:` URIs may not contain spaces or parentheses. */
    phoneHref: "tel:+41788118314",
    /** Empty until there is a real one. The UI and the JSON-LD both omit it when blank — better absent than filler. */
    address: "",
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
  ] as const satisfies readonly SocialLink[],

  /** Used for structured data and the OG image credit line. */
  legalName: "Tokyo2CH",
  foundingYear: 2026,
} as const;

export type SiteConfig = typeof siteConfig;
