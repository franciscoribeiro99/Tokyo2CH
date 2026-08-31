import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Hero } from "@/components/sections/hero";

describe("Hero", () => {
  it("renders the title as the page-level h1", () => {
    render(<Hero title="Software that ships." description="We build things." />);

    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveTextContent("Software that ships.");
  });

  it("renders both calls to action as links to the given hrefs", () => {
    render(
      <Hero
        title="Title"
        description="Description"
        primaryCta={{ label: "Start a project", href: "/contact" }}
        secondaryCta={{ label: "See what we do", href: "/services" }}
      />,
    );

    expect(screen.getByRole("link", { name: /start a project/i })).toHaveAttribute(
      "href",
      "/contact",
    );
    expect(screen.getByRole("link", { name: /see what we do/i })).toHaveAttribute(
      "href",
      "/services",
    );
  });

  it("omits the call-to-action row entirely when none are provided", () => {
    render(<Hero title="Title" description="Description" />);
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it("renders the eyebrow only when one is given", () => {
    const { rerender } = render(<Hero title="Title" description="Description" />);
    expect(screen.queryByText("Strategy")).not.toBeInTheDocument();

    rerender(<Hero eyebrow="Strategy" title="Title" description="Description" />);
    expect(screen.getByText("Strategy")).toBeInTheDocument();
  });
});
