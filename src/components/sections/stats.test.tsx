import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { type Stat, Stats } from "@/components/sections/stats";

const STATS: readonly Stat[] = [
  { value: "40+", label: "Products shipped" },
  { value: "99.98%", label: "Median uptime" },
];

describe("Stats", () => {
  it("renders each stat as a description-list pair", () => {
    const { container } = render(<Stats stats={STATS} />);

    expect(container.querySelectorAll("dt")).toHaveLength(STATS.length);
    expect(container.querySelectorAll("dd")).toHaveLength(STATS.length);
  });

  it("renders both the value and its label", () => {
    render(<Stats stats={STATS} />);

    for (const stat of STATS) {
      expect(screen.getByText(stat.value)).toBeInTheDocument();
      expect(screen.getByText(stat.label)).toBeInTheDocument();
    }
  });

  it("puts the label before the value in the DOM, whatever the visual order", () => {
    const { container } = render(<Stats stats={STATS} />);
    const firstPair = container.querySelector("dl > div");

    // A dt must precede its dd in source order for the pairing to be valid;
    // CSS `order` handles the visual flip that puts the number on top.
    expect(firstPair?.children[0]?.tagName).toBe("DT");
    expect(firstPair?.children[1]?.tagName).toBe("DD");
  });

  it("handles an empty list", () => {
    const { container } = render(<Stats stats={[]} />);
    expect(container.querySelectorAll("dt")).toHaveLength(0);
  });
});
