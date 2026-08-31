import { Reveal } from "@/components/sections/reveal";

export interface Pillar {
  readonly title: string;
  readonly description: string;
}

interface PillarsProps {
  readonly items: readonly Pillar[];
}

/**
 * The three promises, set as a numbered index rather than icon cards.
 *
 * Generic icons next to short claims read as filler; a numbered rule reads as
 * a considered list, and costs nothing to render.
 */
export function Pillars({ items }: PillarsProps) {
  return (
    <ul className="grid gap-px overflow-hidden rounded-xl border bg-border sm:grid-cols-3">
      {items.map((item, index) => (
        <Reveal
          as="li"
          key={item.title}
          delay={index * 90}
          className="flex flex-col gap-3 bg-card p-8"
        >
          <span aria-hidden="true" className="font-medium font-mono text-primary text-xs">
            {String(index + 1).padStart(2, "0")}
          </span>
          <h3 className="font-bold font-display text-lg tracking-tight">{item.title}</h3>
          <p className="text-pretty text-muted-foreground text-sm leading-relaxed">
            {item.description}
          </p>
        </Reveal>
      ))}
    </ul>
  );
}
