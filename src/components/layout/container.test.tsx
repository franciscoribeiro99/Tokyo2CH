import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Container } from "@/components/layout/container";

describe("Container", () => {
  it("renders its children", () => {
    render(<Container>content</Container>);
    expect(screen.getByText("content")).toBeInTheDocument();
  });

  it("applies the shared width and gutter classes", () => {
    const { container } = render(<Container>content</Container>);
    const element = container.firstElementChild;

    expect(element).toHaveClass("mx-auto", "w-full", "max-w-6xl");
  });

  it("merges a caller className without dropping the defaults", () => {
    const { container } = render(<Container className="py-10">content</Container>);
    const element = container.firstElementChild;

    expect(element).toHaveClass("py-10");
    expect(element).toHaveClass("max-w-6xl");
  });

  it("renders as a different element when asked", () => {
    const { container } = render(<Container as="header">content</Container>);
    expect(container.firstElementChild?.tagName).toBe("HEADER");
  });
});
