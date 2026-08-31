import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Cta } from "@/components/sections/cta";

describe("Cta", () => {
  it("renders the heading at level 2 so it nests under the page h1", () => {
    render(
      <Cta
        title="Tell us what you are building."
        description="Send a few sentences."
        action={{ label: "Get in touch", href: "/contact" }}
      />,
    );

    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
      "Tell us what you are building.",
    );
  });

  it("links the action to the given href", () => {
    render(
      <Cta
        title="Title"
        description="Description"
        action={{ label: "Get in touch", href: "/contact" }}
      />,
    );

    expect(screen.getByRole("link", { name: /get in touch/i })).toHaveAttribute("href", "/contact");
  });

  it("hides the decorative glow from assistive technology", () => {
    const { container } = render(
      <Cta title="Title" description="Description" action={{ label: "Go", href: "/" }} />,
    );

    expect(container.querySelectorAll('[aria-hidden="true"]').length).toBeGreaterThan(0);
  });
});
