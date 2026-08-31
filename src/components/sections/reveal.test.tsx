import { act, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Reveal } from "@/components/sections/reveal";

describe("Reveal", () => {
  it("renders its children immediately, so content never depends on the observer", () => {
    render(<Reveal>Sourced to your brief</Reveal>);
    expect(screen.getByText("Sourced to your brief")).toBeInTheDocument();
  });

  it("starts hidden and observes the element", () => {
    const observe = vi.fn();
    vi.stubGlobal(
      "IntersectionObserver",
      class {
        observe = observe;
        unobserve = vi.fn();
        disconnect = vi.fn();
        takeRecords = vi.fn(() => []);
        root = null;
        rootMargin = "";
        thresholds = [];
      },
    );

    render(<Reveal>Content</Reveal>);

    expect(screen.getByText("Content")).toHaveAttribute("data-visible", "false");
    expect(observe).toHaveBeenCalledOnce();
  });

  it("becomes visible once the element intersects, then stops observing", () => {
    const disconnect = vi.fn();
    let trigger: ((entries: { isIntersecting: boolean }[]) => void) | undefined;

    vi.stubGlobal(
      "IntersectionObserver",
      class {
        constructor(callback: (entries: { isIntersecting: boolean }[]) => void) {
          trigger = callback;
        }
        observe = vi.fn();
        unobserve = vi.fn();
        disconnect = disconnect;
        takeRecords = vi.fn(() => []);
        root = null;
        rootMargin = "";
        thresholds = [];
      },
    );

    render(<Reveal>Content</Reveal>);

    // The observer callback sets state, so it has to run inside act().
    act(() => trigger?.([{ isIntersecting: true }]));

    expect(screen.getByText("Content")).toHaveAttribute("data-visible", "true");
    expect(disconnect).toHaveBeenCalled();
  });

  it("renders as the requested element so it can sit inside a list", () => {
    render(
      <ul>
        <Reveal as="li">Item</Reveal>
      </ul>,
    );
    expect(screen.getByRole("listitem")).toHaveTextContent("Item");
  });

  it("applies a stagger delay only when one is given", () => {
    const { rerender } = render(<Reveal>Content</Reveal>);
    expect(screen.getByText("Content")).not.toHaveStyle({ transitionDelay: "90ms" });

    rerender(<Reveal delay={90}>Content</Reveal>);
    expect(screen.getByText("Content")).toHaveStyle({ transitionDelay: "90ms" });
  });
});
