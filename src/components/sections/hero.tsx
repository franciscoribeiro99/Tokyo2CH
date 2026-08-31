import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface HeroProps {
  readonly eyebrow?: string;
  readonly title: string;
  readonly description: string;
  readonly primaryCta?: { readonly label: string; readonly href: string };
  readonly secondaryCta?: { readonly label: string; readonly href: string };
}

export function Hero({ eyebrow, title, description, primaryCta, secondaryCta }: HeroProps) {
  return (
    <section className="relative isolate overflow-hidden border-border/60 border-b">
      {/* Decorative only — hidden from the accessibility tree. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-grid opacity-[0.35] [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]"
      />
      <div
        aria-hidden="true"
        className="absolute top-0 left-1/2 -z-10 h-[32rem] w-[64rem] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl"
      />

      <Container>
        <div className="flex max-w-3xl flex-col items-start gap-6 py-24 sm:py-32">
          {eyebrow ? (
            <Badge variant="secondary" className="font-mono text-xs">
              {eyebrow}
            </Badge>
          ) : null}

          <h1 className="text-balance font-semibold text-4xl leading-[1.1] tracking-tight sm:text-6xl">
            {title}
          </h1>

          <p className="max-w-2xl text-pretty text-lg text-muted-foreground leading-relaxed sm:text-xl">
            {description}
          </p>

          {primaryCta || secondaryCta ? (
            <div className="mt-2 flex flex-col gap-3 sm:flex-row">
              {primaryCta ? (
                <Button asChild size="lg">
                  <Link href={primaryCta.href}>
                    {primaryCta.label}
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
              ) : null}
              {secondaryCta ? (
                <Button asChild size="lg" variant="outline">
                  <Link href={secondaryCta.href}>{secondaryCta.label}</Link>
                </Button>
              ) : null}
            </div>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
