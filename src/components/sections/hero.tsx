import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { media } from "@/config/media";

interface HeroProps {
  readonly eyebrow?: string;
  /** Japanese accent line. */
  readonly kana?: string;
  readonly title: string;
  readonly description: string;
  readonly primaryCta?: { readonly label: string; readonly href: string };
  readonly secondaryCta?: { readonly label: string; readonly href: string };
}

/**
 * The home page hero.
 *
 * A single full-bleed photograph behind the copy. This replaced a scroll-driven
 * WebGL scene: the section used to run 180svh tall so a sticky canvas had a
 * runway to animate over, which cost two viewports of scrolling before any
 * content appeared and shipped three 3D libraries to every visitor. The
 * photograph was already the scene's fallback for anyone without WebGL, so
 * this is what a large share of visitors were seeing regardless.
 *
 * Copy sits on a fixed dark scrim rather than on theme colours, because it is
 * layered over a photograph that is dark in both themes.
 */
export function Hero({ eyebrow, kana, title, description, primaryCta, secondaryCta }: HeroProps) {
  return (
    <section className="relative isolate flex min-h-[100svh] items-end overflow-hidden">
      <Image
        src={media.heroPoster.src}
        alt=""
        fill
        priority
        sizes="100vw"
        className="-z-10 object-cover"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-t from-neutral-950/90 via-neutral-950/55 to-neutral-950/30"
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
    </section>
  );
}
