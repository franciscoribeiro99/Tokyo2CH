import { describe, expect, it } from "vitest";
import { cn } from "@/lib/utils";

describe("cn", () => {
  it("joins class names", () => {
    expect(cn("flex", "items-center")).toBe("flex items-center");
  });

  it("drops falsy values", () => {
    expect(cn("flex", false && "hidden", undefined, null)).toBe("flex");
  });

  it("lets a later Tailwind utility win over an earlier conflicting one", () => {
    // This is the whole reason for tailwind-merge: plain clsx would keep both.
    expect(cn("px-2", "px-4")).toBe("px-4");
    expect(cn("text-muted-foreground text-sm", "text-foreground")).toBe("text-sm text-foreground");
  });

  it("supports conditional object syntax", () => {
    expect(cn("base", { active: true, disabled: false })).toBe("base active");
  });

  it("returns an empty string when given nothing", () => {
    expect(cn()).toBe("");
  });
});
