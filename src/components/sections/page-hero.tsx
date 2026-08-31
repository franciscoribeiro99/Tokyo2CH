import { Container } from "@/components/layout/container";

interface PageHeroProps {
  readonly eyebrow?: string;
  readonly title: string;
  readonly description?: string;
}

/**
 * Header for every page other than home.
 *
 * Deliberately typographic rather than 3D: the WebGL scene is the home page's
 * signature, and repeating it on six inner pages would cost load time on every
 * route while making none of them feel like an arrival.
 */
export function PageHero({ eyebrow, title, description }: PageHeroProps) {
  return (
    <section className="relative isolate overflow-hidden border-border/60 border-b">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-hatch opacity-40 [mask-image:radial-gradient(ellipse_at_top_left,black,transparent_72%)]"
      />
      <div
        aria-hidden="true"
        className="absolute top-0 left-0 -z-10 h-80 w-[36rem] -translate-x-1/3 rounded-full bg-primary/10 blur-3xl"
      />

      <Container>
        <div className="flex max-w-3xl flex-col gap-5 py-20 sm:py-28">
          {eyebrow ? (
            <span className="flex items-center gap-3 font-medium font-mono text-primary text-xs uppercase tracking-[0.2em]">
              <span aria-hidden="true" className="h-px w-8 bg-primary" />
              {eyebrow}
            </span>
          ) : null}

          <h1 className="text-balance font-bold font-display text-4xl leading-[1.1] tracking-tight sm:text-5xl">
            {title}
          </h1>

          {description ? (
            <p className="max-w-2xl text-pretty text-lg text-muted-foreground leading-relaxed">
              {description}
            </p>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
