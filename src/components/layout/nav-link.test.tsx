import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { NavLink } from "@/components/layout/nav-link";

const usePathname = vi.hoisted(() => vi.fn(() => "/"));
vi.mock("next/navigation", () => ({ usePathname }));

describe("NavLink", () => {
  it("marks the link for the current route with aria-current", () => {
    usePathname.mockReturnValue("/about");
    render(<NavLink href="/about">About</NavLink>);

    expect(screen.getByRole("link", { name: "About" })).toHaveAttribute("aria-current", "page");
  });

  it("leaves aria-current off links for other routes", () => {
    usePathname.mockReturnValue("/about");
    render(<NavLink href="/services">Services</NavLink>);

    expect(screen.getByRole("link", { name: "Services" })).not.toHaveAttribute("aria-current");
  });

  it("treats a nested route as active for its parent link", () => {
    usePathname.mockReturnValue("/legal/privacy");
    render(<NavLink href="/legal">Legal</NavLink>);

    expect(screen.getByRole("link", { name: "Legal" })).toHaveAttribute("aria-current", "page");
  });

  it("does not match a route that merely shares a prefix", () => {
    usePathname.mockReturnValue("/services-old");
    render(<NavLink href="/services">Services</NavLink>);

    expect(screen.getByRole("link", { name: "Services" })).not.toHaveAttribute("aria-current");
  });

  it("calls onNavigate when clicked, so the mobile sheet can close", async () => {
    usePathname.mockReturnValue("/");
    const onNavigate = vi.fn();
    const user = userEvent.setup();

    render(
      <NavLink href="/about" onNavigate={onNavigate}>
        About
      </NavLink>,
    );
    await user.click(screen.getByRole("link", { name: "About" }));

    expect(onNavigate).toHaveBeenCalledOnce();
  });
});
