import { render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SiteHeader } from "@/components/layout/site-header";
import { siteConfig } from "@/config/site";

const usePathname = vi.hoisted(() => vi.fn(() => "/"));
vi.mock("next/navigation", () => ({ usePathname }));

describe("SiteHeader", () => {
  it("renders as the banner landmark", () => {
    render(<SiteHeader />);
    expect(screen.getByRole("banner")).toBeInTheDocument();
  });

  it("links the wordmark home", () => {
    render(<SiteHeader />);
    expect(screen.getByRole("link", { name: siteConfig.name })).toHaveAttribute("href", "/");
  });

  it("renders every configured main nav destination", () => {
    render(<SiteHeader />);
    const nav = screen.getByRole("navigation", { name: "Main" });

    for (const item of siteConfig.mainNav) {
      expect(within(nav).getByRole("link", { name: item.title })).toHaveAttribute(
        "href",
        item.href,
      );
    }
  });

  it("names the main nav so it is distinguishable from the mobile one", () => {
    render(<SiteHeader />);
    expect(screen.getByRole("navigation", { name: "Main" })).toBeInTheDocument();
  });

  it("exposes a labelled trigger for the mobile menu", () => {
    render(<SiteHeader />);
    expect(screen.getByRole("button", { name: /open menu/i })).toBeInTheDocument();
  });
});
