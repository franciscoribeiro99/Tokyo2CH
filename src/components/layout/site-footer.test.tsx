import { render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SiteFooter } from "@/components/layout/site-footer";
import { siteConfig } from "@/config/site";
import { fr } from "@/content/fr";

vi.mock("next/navigation", () => ({ usePathname: () => "/fr/vehicles" }));

describe("SiteFooter", () => {
  it("lists every page, prefixed with the locale", () => {
    render(<SiteFooter locale="fr" dictionary={fr} />);
    const nav = screen.getByRole("navigation", { name: fr.nav.footer });

    for (const item of [...siteConfig.mainNav, ...siteConfig.footerNav]) {
      expect(within(nav).getByRole("link", { name: fr.nav[item.key] })).toHaveAttribute(
        "href",
        `/fr${item.href}`,
      );
    }
  });

  it("links each social account out with rel protections", () => {
    render(<SiteFooter locale="fr" dictionary={fr} />);
    const nav = screen.getByRole("navigation", { name: fr.nav.social });

    for (const social of siteConfig.social) {
      const link = within(nav).getByRole("link", { name: social.label });
      expect(link).toHaveAttribute("href", social.href);
      expect(link).toHaveAttribute("rel", expect.stringContaining("noopener"));
    }
  });

  /**
   * The signature is brand copy, not dictionary copy: it reads the same in
   * every locale, so this asserts it survives a non-English render.
   */
  it("shows the brand signature beside the mark, untranslated", () => {
    for (const locale of ["fr", "de"] as const) {
      const view = render(<SiteFooter locale={locale} dictionary={fr} />);
      expect(screen.getByText(siteConfig.slogan)).toBeVisible();
      view.unmount();
    }
  });

  it("exposes the contact email as a mailto link", () => {
    render(<SiteFooter locale="fr" dictionary={fr} />);
    expect(screen.getByRole("link", { name: siteConfig.contact.email })).toHaveAttribute(
      "href",
      `mailto:${siteConfig.contact.email}`,
    );
  });

  /**
   * Repeated from the header on purpose: someone arriving mid-page from a
   * search result should not have to scroll back up to change language.
   */
  it("repeats the language switcher, spelling the languages out in full", () => {
    render(<SiteFooter locale="fr" dictionary={fr} />);
    const switcher = screen.getByRole("navigation", { name: fr.nav.language });
    expect(within(switcher).getByRole("link", { name: "Deutsch" })).toBeInTheDocument();
    expect(within(switcher).getByRole("link", { name: "Italiano" })).toBeInTheDocument();
  });

  it("keeps the language switcher on the same page when switching", () => {
    render(<SiteFooter locale="fr" dictionary={fr} />);
    const switcher = screen.getByRole("navigation", { name: fr.nav.language });
    // Reading /fr/vehicles and picking German must land on /de/vehicles,
    // not dump the visitor back on the home page.
    expect(within(switcher).getByRole("link", { name: "Deutsch" })).toHaveAttribute(
      "href",
      "/de/vehicles",
    );
  });
});
