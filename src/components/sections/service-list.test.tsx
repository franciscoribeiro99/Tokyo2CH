import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ServiceList } from "@/components/sections/service-list";

const ITEMS = [
  { title: "Vehicle sourcing", description: "We search Japan's market.", price: "By request" },
  {
    title: "Shipping coordination",
    description: "We arrange shipment.",
    price: "Quoted separately",
  },
] as const;

describe("ServiceList", () => {
  it("renders each service as a heading with its description and price", () => {
    render(<ServiceList items={ITEMS} />);

    for (const item of ITEMS) {
      expect(screen.getByRole("heading", { name: item.title })).toBeInTheDocument();
      expect(screen.getByText(item.description)).toBeInTheDocument();
    }
    expect(screen.getByText("By request")).toBeInTheDocument();
  });

  it("renders one list item per service", () => {
    render(<ServiceList items={ITEMS} />);
    expect(screen.getAllByRole("listitem")).toHaveLength(ITEMS.length);
  });
});
