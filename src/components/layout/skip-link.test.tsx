import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SkipLink } from "@/components/layout/skip-link";

describe("SkipLink", () => {
  it("targets the main landmark", () => {
    render(<SkipLink />);
    expect(screen.getByRole("link", { name: /skip to main content/i })).toHaveAttribute(
      "href",
      "#main",
    );
  });

  it("is in the accessibility tree but visually hidden until focused", () => {
    render(<SkipLink />);
    const link = screen.getByRole("link", { name: /skip to main content/i });

    // sr-only keeps it available to screen readers; focus: unhides it visually.
    expect(link).toHaveClass("sr-only");
    expect(link.className).toContain("focus:not-sr-only");
  });
});
