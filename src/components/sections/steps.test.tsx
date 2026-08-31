import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Steps } from "@/components/sections/steps";

const ITEMS = [
  {
    step: "01",
    title: "Share your request",
    description: "Tell us your ideal vehicle and budget.",
    cost: "Free",
    image: {
      src: "/media/journey-source.jpg",
      width: 1600,
      height: 1000,
      alt: "A line of Japanese performance cars at golden hour",
    },
  },
  {
    step: "02",
    title: "We source",
    description: "We verify details and share options.",
    cost: "Free",
    image: {
      src: "/media/journey-verify.jpg",
      width: 1600,
      height: 1000,
      alt: "A technician inspecting an engine bay with the bonnet raised",
    },
  },
] as const;

describe("Steps", () => {
  it("renders each step as a heading with its description and cost", () => {
    render(<Steps items={ITEMS} />);

    for (const item of ITEMS) {
      expect(screen.getByRole("heading", { name: item.title })).toBeInTheDocument();
      expect(screen.getByText(item.description)).toBeInTheDocument();
    }
    expect(screen.getAllByText("Free")).toHaveLength(2);
  });

  it("marks the sequence up as an ordered list, because the order is the meaning", () => {
    const { container } = render(<Steps items={ITEMS} />);

    expect(container.querySelector("ol")).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(ITEMS.length);
  });

  it("hides the large decorative step numerals from assistive technology", () => {
    render(<Steps items={ITEMS} />);
    expect(screen.getByText("01")).toHaveAttribute("aria-hidden", "true");
  });
});
