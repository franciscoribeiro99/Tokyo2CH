import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Logo } from "@/components/brand/logo";
import { siteConfig } from "@/config/site";

function svgOf(container: HTMLElement) {
  const svg = container.querySelector("svg");
  if (!svg) throw new Error("no svg rendered");
  return svg;
}

describe("Logo", () => {
  it("renders the disc and the cross in both variants", () => {
    for (const variant of ["lockup", "mark"] as const) {
      const { container, unmount } = render(<Logo variant={variant} />);
      expect(container.querySelector("circle")).toBeInTheDocument();
      expect(container.querySelectorAll("path").length).toBeGreaterThan(0);
      unmount();
    }
  });

  it("includes the wordmark in the lockup and drops it from the mark", () => {
    const { container: lockup } = render(<Logo />);
    const { container: mark } = render(<Logo variant="mark" />);

    // The traced wordmark lives in the only <g> in the tree.
    expect(lockup.querySelector("g")).toBeInTheDocument();
    expect(mark.querySelector("g")).not.toBeInTheDocument();
  });

  /**
   * Every placement pairs the mark with the company name as real text, so the
   * SVG must stay out of the accessibility tree or the name is announced twice.
   */
  it("is hidden from assistive technology", () => {
    const { container } = render(<Logo />);
    expect(svgOf(container)).toHaveAttribute("aria-hidden", "true");
    expect(svgOf(container)).toHaveAttribute("focusable", "false");
  });

  it("still carries the brand name as an SVG title for tooltips and search", () => {
    const { container } = render(<Logo />);
    expect(container.querySelector("title")?.textContent).toBe(siteConfig.name);
  });

  it("paints the disc in the brand red rather than a theme colour", () => {
    const { container } = render(<Logo />);
    // A logo does not follow the theme: the disc is the same red everywhere.
    expect(container.querySelector("circle")).toHaveAttribute("fill", "#D21D1A");
  });

  it("leaves the wordmark on currentColor so it inverts on dark surfaces", () => {
    const { container } = render(<Logo />);
    expect(container.querySelector("g")).toHaveAttribute("fill", "currentColor");
  });
});
