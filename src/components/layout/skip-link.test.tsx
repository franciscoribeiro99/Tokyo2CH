import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SkipLink } from "@/components/layout/skip-link";

describe("SkipLink", () => {
  it("renders the label it is given, so it can be translated", () => {
    render(<SkipLink label="Aller au contenu principal" />);
    expect(screen.getByRole("link", { name: "Aller au contenu principal" })).toBeInTheDocument();
  });

  it("points at the main landmark", () => {
    render(<SkipLink label="Skip to main content" />);
    expect(screen.getByRole("link", { name: /skip/i })).toHaveAttribute("href", "#main");
  });
});
