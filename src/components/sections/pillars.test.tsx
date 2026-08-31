import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Pillars } from "@/components/sections/pillars";

const ITEMS = [
  { title: "Wide selection", description: "Performance cars, kei cars, SUVs, and classics." },
  { title: "Trusted sourcing", description: "Careful sourcing through trusted networks." },
  { title: "Swiss import support", description: "Guidance from auction to registration." },
] as const;

describe("Pillars", () => {
  it("renders each pillar as a heading with its description", () => {
    render(<Pillars items={ITEMS} />);

    for (const item of ITEMS) {
      expect(screen.getByRole("heading", { name: item.title })).toBeInTheDocument();
      expect(screen.getByText(item.description)).toBeInTheDocument();
    }
  });

  it("presents the pillars as a single list", () => {
    render(<Pillars items={ITEMS} />);
    expect(screen.getAllByRole("listitem")).toHaveLength(ITEMS.length);
  });

  it("hides the decorative index numbers from assistive technology", () => {
    render(<Pillars items={ITEMS} />);
    expect(screen.queryByText("01")).toHaveAttribute("aria-hidden", "true");
  });
});
