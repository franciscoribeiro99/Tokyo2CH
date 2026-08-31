import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Faq } from "@/components/sections/faq";

const ITEMS = [
  { question: "How do engagements start?", answer: "With a paid two-week discovery." },
  { question: "Do you work with in-house teams?", answer: "Most of our work is embedded." },
] as const;

describe("Faq", () => {
  it("renders every question as a button", () => {
    render(<Faq items={ITEMS} />);

    for (const item of ITEMS) {
      expect(screen.getByRole("button", { name: item.question })).toBeInTheDocument();
    }
  });

  it("starts collapsed and reveals the answer on click", async () => {
    const user = userEvent.setup();
    render(<Faq items={ITEMS} />);

    const trigger = screen.getByRole("button", { name: ITEMS[0].question });
    expect(trigger).toHaveAttribute("aria-expanded", "false");

    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText(ITEMS[0].answer)).toBeVisible();
  });

  it("collapses the open item when another is opened", async () => {
    const user = userEvent.setup();
    render(<Faq items={ITEMS} />);

    const first = screen.getByRole("button", { name: ITEMS[0].question });
    const second = screen.getByRole("button", { name: ITEMS[1].question });

    await user.click(first);
    await user.click(second);

    expect(first).toHaveAttribute("aria-expanded", "false");
    expect(second).toHaveAttribute("aria-expanded", "true");
  });
});
