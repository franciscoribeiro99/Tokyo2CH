import { Reveal } from "@/components/sections/reveal";

export interface Testimonial {
  readonly quote: string;
  readonly attribution: string;
}

interface TestimonialsProps {
  readonly items: readonly Testimonial[];
}

/**
 * Client quotes.
 *
 * Marked up as `<figure>`/`<blockquote>`/`<figcaption>` so the attribution is
 * programmatically tied to the quote rather than just sitting below it.
 */
export function Testimonials({ items }: TestimonialsProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      {items.map((item, index) => (
        <Reveal as="figure" key={item.quote} delay={index * 90} className="rounded-xl border p-8">
          <span aria-hidden="true" className="font-bold font-display text-4xl text-primary/30">
            &ldquo;
          </span>
          <blockquote className="mt-2 text-pretty text-lg leading-relaxed">{item.quote}</blockquote>
          <figcaption className="mt-6 font-mono text-muted-foreground text-xs uppercase tracking-widest">
            {item.attribution}
          </figcaption>
        </Reveal>
      ))}
    </div>
  );
}
