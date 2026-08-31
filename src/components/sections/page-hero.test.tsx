import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PageHero } from "@/components/sections/page-hero";

describe("PageHero", () => {
  it("renders the title as the page-level h1", () => {
    render(<PageHero title="Vehicles we source" />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Vehicles we source");
  });

  it("renders the eyebrow and description only when provided", () => {
    const { rerender } = render(<PageHero title="Vehicles" />);
    expect(screen.queryByText("Vehicles we source")).not.toBeInTheDocument();

    rerender(<PageHero eyebrow="Vehicles" title="Title" description="Sourced to your brief." />);
    expect(screen.getByText("Vehicles")).toBeInTheDocument();
    expect(screen.getByText("Sourced to your brief.")).toBeInTheDocument();
  });
});
