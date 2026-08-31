import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SiteFooter } from "@/components/layout/site-footer";
import { siteConfig } from "@/config/site";

describe("SiteFooter", () => {
  it("renders as the contentinfo landmark", () => {
    render(<SiteFooter />);
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
  });

  it("links every main and footer nav destination", () => {
    render(<SiteFooter />);
    const nav = screen.getByRole("navigation", { name: "Footer" });

    for (const item of [...siteConfig.mainNav, ...siteConfig.footerNav]) {
      expect(within(nav).getByRole("link", { name: item.title })).toHaveAttribute(
        "href",
        item.href,
      );
    }
  });

  it("opens external social links safely in a new tab", () => {
    render(<SiteFooter />);
    const nav = screen.getByRole("navigation", { name: "Social" });

    for (const social of siteConfig.social) {
      const link = within(nav).getByRole("link", { name: social.label });
      expect(link).toHaveAttribute("href", social.href);
      expect(link).toHaveAttribute("target", "_blank");
      // Prevents the opened page from reaching back through window.opener.
      expect(link.getAttribute("rel")).toContain("noopener");
    }
  });

  it("shows a mailto link for the configured address", () => {
    render(<SiteFooter />);
    expect(screen.getByRole("link", { name: siteConfig.contact.email })).toHaveAttribute(
      "href",
      `mailto:${siteConfig.contact.email}`,
    );
  });

  it("renders the current year in the copyright line", () => {
    render(<SiteFooter />);
    const year = String(new Date().getFullYear());
    expect(screen.getByText(new RegExp(`${year}.*${siteConfig.legalName}`))).toBeInTheDocument();
  });
});
