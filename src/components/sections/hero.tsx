import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { PassageCanvas } from "@/components/three/passage-canvas";
import { Button } from "@/components/ui/button";

interface HeroProps {
  readonly eyebrow?: string;
  /** Japanese accent line, set in the display face which carries kana natively. */
  readonly kana?: string;
  readonly title: string;
  readonly description: string;
  readonly primaryCta?: { readonly label: string; readonly href: string };
  readonly secondaryCta?: { readonly label: string; readonly href: string };
}

/**
 * The home page hero.
 *
 * The outer section is deliberately taller than the viewport while the inner
 * panel sticks: that extra scroll is the runway the WebGL passage plays out
 * over. Sized to the viewport instead, the journey from Japanese dawn to
 * alpine daylight finished at the exact moment the hero left the screen, so
 * nobody ever saw the second half of it.
 *
 * `data-passage-trigger` is what the scene's ScrollTrigger binds to, so the
 * scroll range is defined by this element's height and nothing else. Note the
 * overflow clip lives on the inner panel — putting it on the sticky element's
 * ancestor would silently disable the stickiness.
 *
 * Copy sits on a fixed dark scrim rather than on theme colours, because it is
 * layered over a scene that is dark in both themes — legibility here must not
 * depend on whether the 3D rendered at all.
 */
export function Hero({ eyebrow, kana, title, description, primaryCta, secondaryCta }: HeroProps) {
  return (
    <section data-passage-trigger className="relative h-[180svh]">
      <div className="sticky top-0 flex h-[100svh] items-end overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <PassageCanvas />
        </div>
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-gradient-to-t from-neutral-950/85 via-neutral-950/35 to-neutral-950/15"
        />

        <Container>
          <div className="flex max-w-3xl flex-col items-start gap-6 pt-32 pb-24 sm:pb-32">
            {eyebrow ? (
              <span className="flex items-center gap-3 font-medium font-mono text-white/70 text-xs uppercase tracking-[0.2em]">
                <span aria-hidden="true" className="h-px w-8 bg-primary" />
                {eyebrow}
              </span>
            ) : null}

            {kana ? (
              <span lang="ja" className="font-display text-lg text-primary tracking-[0.35em]">
                {kana}
              </span>
            ) : null}

            <h1 className="text-balance font-bold font-display text-4xl text-white leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
              {title}
            </h1>

            <p className="max-w-xl text-pretty text-lg text-white/75 leading-relaxed">
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
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="border-white/30 bg-white/5 text-white hover:bg-white/15 hover:text-white"
                  >
                    <Link href={secondaryCta.href}>{secondaryCta.label}</Link>
                  </Button>
                ) : null}
              </div>
            ) : null}
          </div>
        </Container>
      </div>
    </section>
  );
}
