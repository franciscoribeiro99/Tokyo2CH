import type { ComponentPropsWithoutRef, ElementType, FunctionComponent } from "react";
import { cn } from "@/lib/utils";

interface ContainerProps extends ComponentPropsWithoutRef<"div"> {
  /** Render as a different element without losing the width constraint. */
  as?: ElementType;
}

/**
 * The single horizontal rhythm of the site.
 *
 * Every page-level block goes through this so gutters and max-width stay
 * consistent — no page should set its own `max-w-*` / `px-*` pair.
 */
export function Container({ as: Comp = "div", className, ...props }: ContainerProps) {
  /**
   * TypeScript intersects the props of every possible `ElementType` when the
   * tag is held in a variable, which collapses to `never` and rejects even
   * `className`. Naming the props we actually forward restores checking on the
   * ones that matter, and the runtime tag is unaffected.
   */
  const Tag = Comp as FunctionComponent<ComponentPropsWithoutRef<"div">>;

  return <Tag className={cn("mx-auto w-full max-w-6xl px-6 lg:px-8", className)} {...props} />;
}
