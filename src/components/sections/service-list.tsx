import { Reveal } from "@/components/sections/reveal";

export interface ServiceCard {
  readonly title: string;
  readonly description: string;
  readonly price: string;
}

interface ServiceListProps {
  readonly items: readonly ServiceCard[];
}

export function ServiceList({ items }: ServiceListProps) {
  return (
    <ul className="grid gap-px overflow-hidden rounded-xl border bg-border sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item, index) => (
        <Reveal
          as="li"
          key={item.title}
          delay={(index % 3) * 90}
          className="flex flex-col gap-3 bg-card p-8"
        >
          <h3 className="font-bold font-display text-lg tracking-tight">{item.title}</h3>
          <p className="flex-1 text-pretty text-muted-foreground text-sm leading-relaxed">
            {item.description}
          </p>
          <p className="mt-2 font-medium font-mono text-primary text-xs uppercase tracking-widest">
            {item.price}
          </p>
        </Reveal>
      ))}
    </ul>
  );
}
