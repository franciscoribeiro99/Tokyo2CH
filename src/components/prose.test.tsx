import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Prose } from "@/components/prose";

describe("Prose", () => {
  it("renders long-form children unchanged", () => {
    render(
      <Prose>
        <h1>Privacy Policy</h1>
        <p>Body copy.</p>
      </Prose>,
    );

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Privacy Policy");
    expect(screen.getByText("Body copy.")).toBeInTheDocument();
  });

  it("constrains the measure for readability", () => {
    const { container } = render(
      <Prose>
        <p>Body</p>
      </Prose>,
    );

    expect(container.firstElementChild).toHaveClass("max-w-3xl", "mx-auto");
  });

  it("accepts an extra className", () => {
    const { container } = render(
      <Prose className="mt-10">
        <p>Body</p>
      </Prose>,
    );

    expect(container.firstElementChild).toHaveClass("mt-10");
  });
});
