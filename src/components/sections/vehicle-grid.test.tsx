import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { VehicleGrid } from "@/components/sections/vehicle-grid";

const ITEMS = [
  {
    title: "Performance",
    description: "Turbocharged icons sourced on condition and history.",
    examples: "Skyline · Supra",
    image: {
      src: "/media/vehicle-performance.jpg",
      width: 1200,
      height: 900,
      alt: "Two Japanese performance coupés parked front to front",
    },
  },
  {
    title: "Kei cars",
    description: "Japan's 660cc class, small and characterful.",
    examples: "Cappuccino · Jimny",
    image: {
      src: "/media/vehicle-kei.jpg",
      width: 1200,
      height: 900,
      alt: "A small yellow Japanese city car parked on a sunlit street",
    },
  },
] as const;

describe("VehicleGrid", () => {
  it("renders each category as a heading with its description and examples", () => {
    render(<VehicleGrid items={ITEMS} />);

    for (const item of ITEMS) {
      expect(screen.getByRole("heading", { name: item.title })).toBeInTheDocument();
      expect(screen.getByText(item.description)).toBeInTheDocument();
      expect(screen.getByText(item.examples)).toBeInTheDocument();
    }
  });

  it("gives every image descriptive alt text rather than repeating the heading", () => {
    render(<VehicleGrid items={ITEMS} />);

    for (const item of ITEMS) {
      const image = screen.getByAltText(item.image.alt);
      expect(image).toBeInTheDocument();
      expect(image.getAttribute("alt")).not.toBe(item.title);
    }
  });

  it("renders one list item per category", () => {
    render(<VehicleGrid items={ITEMS} />);
    expect(screen.getAllByRole("listitem")).toHaveLength(ITEMS.length);
  });
});
