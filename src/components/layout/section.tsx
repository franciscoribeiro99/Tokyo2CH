import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { Container } from "@/components/layout/container";
import { cn } from "@/lib/utils";

interface SectionProps extends ComponentPropsWithoutRef<"section"> {
  children: ReactNode;
}

/** Vertical rhythm primitive. Pair with `SectionHeader` for titled blocks. */
export function Section({ className, children, ...props }: SectionProps) {
  return (
    <section className={cn("py-20 sm:py-28", className)} {...props}>
      <Container>{children}</Container>
    </section>
  );
}

interface SectionHeaderProps {
  readonly eyebrow?: string;
  readonly title: string;
  readonly description?: string;
  readonly align?: "left" | "center";
  /** Heading level. Use h1 only on the page's single top-level header. */
  readonly as?: "h1" | "h2" | "h3";
  readonly className?: string;
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
  as: Heading = "h2",
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "flex max-w-2xl flex-col gap-4",
        align === "center" && "mx-auto items-center text-center",
        className,
      )}
    >
      {eyebrow ? (
        <span className="font-medium font-mono text-primary text-xs uppercase tracking-widest">
          {eyebrow}
        </span>
      ) : null}
      <Heading className="text-balance font-semibold text-3xl tracking-tight sm:text-4xl">
        {title}
      </Heading>
      {description ? (
        <p className="text-pretty text-lg text-muted-foreground leading-relaxed">{description}</p>
      ) : null}
    </div>
  );
}
