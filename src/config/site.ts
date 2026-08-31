/**
 * Single source of truth for everything brand-specific.
 *
 * When you use this template for a new company site, this is the first file
 * you edit — and for a basic site it may be the only one.
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

export const siteConfig = {
  name: "Acme Inc.",
  shortName: "Acme",
  tagline: "Software that ships.",
  description:
    "Acme builds reliable software for teams that care about craft. Strategy, design, and engineering under one roof.",

  /**
   * Canonical, absolute, no trailing slash.
   * Overridden per-environment by NEXT_PUBLIC_SITE_URL — see src/lib/env.ts.
   */
  url: "https://example.com",

  locale: "en_US",
  lang: "en",

  contact: {
    email: "hello@example.com",
    phone: "+1 (555) 010-0000",
    address: "1 Example Street, Lisbon, Portugal",
  },

  mainNav: [
    { title: "Services", href: "/services" },
    { title: "About", href: "/about" },
    { title: "Contact", href: "/contact" },
  ] as const satisfies readonly NavItem[],

  footerNav: [
    { title: "Privacy", href: "/legal/privacy" },
    { title: "Terms", href: "/legal/terms" },
  ] as const satisfies readonly NavItem[],

  social: [
    { label: "GitHub", href: "https://github.com/acme" },
    { label: "LinkedIn", href: "https://linkedin.com/company/acme" },
  ] as const satisfies readonly SocialLink[],

  /** Used for structured data and the OG image credit line. */
  legalName: "Acme Incorporated",
  foundingYear: 2020,
} as const;

export type SiteConfig = typeof siteConfig;
