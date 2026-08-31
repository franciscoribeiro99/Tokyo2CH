import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Testimonials } from "@/components/sections/testimonials";

const ITEMS = [
  { quote: "They found the exact model I wanted.", attribution: "Imported a performance coupé" },
  { quote: "Clear communication throughout.", attribution: "Imported a compact 4x4" },
] as const;

describe("Testimonials", () => {
  it("renders every quote", () => {
    render(<Testimonials items={ITEMS} />);

    for (const item of ITEMS) {
      expect(screen.getByText(item.quote)).toBeInTheDocument();
    }
  });

  it("ties each attribution to its quote as a figure", () => {
    render(<Testimonials items={ITEMS} />);

    const figures = screen.getAllByRole("figure");
    expect(figures).toHaveLength(ITEMS.length);
    expect(figures[0]).toHaveTextContent(ITEMS[0].quote);
    expect(figures[0]).toHaveTextContent(ITEMS[0].attribution);
  });
});
