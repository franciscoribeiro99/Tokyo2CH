import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Hero } from "@/components/sections/hero";

describe("Hero", () => {
  it("renders the title as the page-level h1", () => {
    render(<Hero title="Your Japanese vehicle, brought to Switzerland" description="We source." />);

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Your Japanese vehicle, brought to Switzerland",
    );
  });

  it("renders both calls to action as links to the given hrefs", () => {
    render(
      <Hero
        title="Title"
        description="Description"
        primaryCta={{ label: "Start sourcing", href: "/contact" }}
        secondaryCta={{ label: "See what we source", href: "/vehicles" }}
      />,
    );

    expect(screen.getByRole("link", { name: /start sourcing/i })).toHaveAttribute(
      "href",
      "/contact",
    );
    expect(screen.getByRole("link", { name: /see what we source/i })).toHaveAttribute(
      "href",
      "/vehicles",
    );
  });

  it("omits the call-to-action row entirely when none are provided", () => {
    render(<Hero title="Title" description="Description" />);
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it("renders the eyebrow and kana line only when given", () => {
    const { rerender } = render(<Hero title="Title" description="Description" />);
    expect(screen.queryByText("Japan → Switzerland")).not.toBeInTheDocument();

    rerender(
      <Hero
        eyebrow="Japan → Switzerland"
        kana="日本からスイスへ"
        title="Title"
        description="Description"
      />,
    );
    expect(screen.getByText("Japan → Switzerland")).toBeInTheDocument();
    expect(screen.getByText("日本からスイスへ")).toBeInTheDocument();
  });

  it("marks the kana line as Japanese so screen readers switch voice", () => {
    render(<Hero kana="日本からスイスへ" title="Title" description="Description" />);
    expect(screen.getByText("日本からスイスへ")).toHaveAttribute("lang", "ja");
  });

  it("exposes the scroll trigger the 3D scene binds to", () => {
    const { container } = render(<Hero title="Title" description="Description" />);
    expect(container.querySelector("[data-passage-trigger]")).toBeInTheDocument();
  });
});
