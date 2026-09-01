import { render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SiteHeader } from "@/components/layout/site-header";
import { siteConfig } from "@/config/site";
import { fr } from "@/content/fr";

vi.mock("next/navigation", () => ({ usePathname: () => "/fr" }));

describe("SiteHeader", () => {
  it("links the brand back to the home page of the current language", () => {
    render(<SiteHeader locale="fr" dictionary={fr} />);
    expect(screen.getByRole("link", { name: siteConfig.name })).toHaveAttribute("href", "/fr");
  });

  it("renders every main nav destination, prefixed with the locale", () => {
    render(<SiteHeader locale="fr" dictionary={fr} />);
    const nav = screen.getByRole("navigation", { name: fr.nav.main });

    for (const item of siteConfig.mainNav) {
      expect(within(nav).getByRole("link", { name: fr.nav[item.key] })).toHaveAttribute(
        "href",
        `/fr${item.href}`,
      );
    }
  });

  it("labels the nav in the current language, not in English", () => {
    render(<SiteHeader locale="de" dictionary={fr} />);
    // The dictionary drives the labels, so passing French copy yields French.
    expect(screen.getByRole("navigation", { name: fr.nav.main })).toBeInTheDocument();
  });

  it("offers every language in the switcher", () => {
    render(<SiteHeader locale="fr" dictionary={fr} />);
    const switcher = screen.getByRole("navigation", { name: fr.nav.language });

    for (const code of ["FR", "DE", "IT", "EN"]) {
      expect(within(switcher).getByRole("link", { name: code })).toBeInTheDocument();
    }
  });

  it("marks the active language so it is not just a colour change", () => {
    render(<SiteHeader locale="fr" dictionary={fr} />);
    const switcher = screen.getByRole("navigation", { name: fr.nav.language });
    expect(within(switcher).getByRole("link", { name: "FR" })).toHaveAttribute(
      "aria-current",
      "true",
    );
  });
});
