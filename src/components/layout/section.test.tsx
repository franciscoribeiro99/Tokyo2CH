import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Section, SectionHeader } from "@/components/layout/section";

describe("Section", () => {
  it("renders its children inside a landmark section", () => {
    render(
      <Section aria-label="Features">
        <p>Contents</p>
      </Section>,
    );

    expect(screen.getByRole("region", { name: "Features" })).toBeInTheDocument();
    expect(screen.getByText("Contents")).toBeInTheDocument();
  });
});

describe("SectionHeader", () => {
  it("defaults to an h2 so pages keep a single h1", () => {
    render(<SectionHeader title="Why teams pick us" />);
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("Why teams pick us");
  });

  it("honours an explicit heading level", () => {
    render(<SectionHeader as="h3" title="Nested" />);
    expect(screen.getByRole("heading", { level: 3 })).toBeInTheDocument();
  });

  it("renders eyebrow and description when provided", () => {
    render(<SectionHeader eyebrow="Questions" title="Title" description="Some description" />);

    expect(screen.getByText("Questions")).toBeInTheDocument();
    expect(screen.getByText("Some description")).toBeInTheDocument();
  });

  it("omits the description element when none is given", () => {
    render(<SectionHeader title="Title" />);
    expect(screen.queryByText("Some description")).not.toBeInTheDocument();
  });
});
