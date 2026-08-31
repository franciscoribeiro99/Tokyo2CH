import { render, screen } from "@testing-library/react";
import { Rocket, Wrench } from "lucide-react";
import { describe, expect, it } from "vitest";
import { type Feature, FeatureGrid } from "@/components/sections/feature-grid";

const FEATURES: readonly Feature[] = [
  { icon: Rocket, title: "Ship fast", description: "Short feedback loops." },
  { icon: Wrench, title: "You own it", description: "No proprietary runtime." },
];

describe("FeatureGrid", () => {
  it("renders one list item per feature", () => {
    render(<FeatureGrid features={FEATURES} />);
    expect(screen.getAllByRole("listitem")).toHaveLength(FEATURES.length);
  });

  it("renders each title and description", () => {
    render(<FeatureGrid features={FEATURES} />);

    for (const feature of FEATURES) {
      expect(screen.getByText(feature.title)).toBeInTheDocument();
      expect(screen.getByText(feature.description)).toBeInTheDocument();
    }
  });

  it("renders an empty list rather than crashing on no features", () => {
    render(<FeatureGrid features={[]} />);
    expect(screen.queryAllByRole("listitem")).toHaveLength(0);
  });

  it("hides the decorative icons from the accessibility tree", () => {
    const { container } = render(<FeatureGrid features={FEATURES} />);
    const icons = container.querySelectorAll("svg");

    expect(icons.length).toBe(FEATURES.length);
    for (const icon of icons) {
      expect(icon).toHaveAttribute("aria-hidden", "true");
    }
  });
});
