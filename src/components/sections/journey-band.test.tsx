import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { JourneyBand } from "@/components/sections/journey-band";

afterEach(() => {
  vi.restoreAllMocks();
});

const VIDEO = {
  src: "/media/journey-drive.mp4",
  poster: "/media/journey-drive-poster.jpg",
  width: 1600,
  height: 900,
} as const;

function renderBand() {
  return render(
    <JourneyBand
      eyebrow="The passage"
      title="Japan to Switzerland"
      description="We manage the import process end to end."
      video={VIDEO}
    />,
  );
}

/** Stub `matchMedia` so the component sees the reduced-motion preference. */
function preferReducedMotion(matches: boolean) {
  vi.spyOn(window, "matchMedia").mockReturnValue({
    matches,
    media: "(prefers-reduced-motion: reduce)",
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  } as unknown as MediaQueryList);
}

describe("JourneyBand", () => {
  it("renders the heading and supporting copy", () => {
    renderBand();

    expect(screen.getByRole("heading", { name: "Japan to Switzerland" })).toBeInTheDocument();
    expect(screen.getByText("We manage the import process end to end.")).toBeInTheDocument();
    expect(screen.getByText("The passage")).toBeInTheDocument();
  });

  it("defers the video download so it costs nothing above the fold", () => {
    const { container } = renderBand();

    const video = container.querySelector("video");
    expect(video).toHaveAttribute("preload", "none");
    expect(video).toHaveAttribute("poster", VIDEO.poster);
  });

  it("plays silently, inline and on a loop, and stays out of the accessibility tree", () => {
    const { container } = renderBand();

    const video = container.querySelector("video");
    expect(video).toHaveAttribute("aria-hidden", "true");
    expect(video).toHaveAttribute("tabindex", "-1");
    expect(video).toHaveProperty("muted", true);
    expect(video).toHaveProperty("loop", true);
  });

  it("swaps the video for its poster frame when the visitor prefers reduced motion", () => {
    preferReducedMotion(true);

    const { container } = renderBand();

    expect(container.querySelector("video")).not.toBeInTheDocument();
    // The copy must survive the swap — this is a background, not the content.
    expect(screen.getByRole("heading", { name: "Japan to Switzerland" })).toBeInTheDocument();
  });
});
