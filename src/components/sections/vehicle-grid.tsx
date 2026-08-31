import Image from "next/image";
import { Reveal } from "@/components/sections/reveal";
import type { MediaImage } from "@/config/media";

export interface VehicleCard {
  readonly title: string;
  readonly description: string;
  /** Representative models, shown as a dot-separated technical line. */
  readonly examples: string;
  readonly image: MediaImage;
}

interface VehicleGridProps {
  readonly items: readonly VehicleCard[];
}

export function VehicleGrid({ items }: VehicleGridProps) {
  return (
    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item, index) => (
        <Reveal
          as="li"
          key={item.title}
          delay={(index % 3) * 90}
          className="group flex flex-col overflow-hidden rounded-xl border bg-card transition-colors hover:border-primary/50"
        >
          <div className="relative aspect-4/3 overflow-hidden bg-muted">
            <Image
              src={item.image.src}
              alt={item.image.alt}
              fill
              sizes="(min-width: 1024px) 30vw, (min-width: 640px) 46vw, 92vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
            />
          </div>

          <div className="flex flex-1 flex-col gap-3 p-6">
            <h3 className="font-bold font-display text-lg tracking-tight">{item.title}</h3>
            <p className="flex-1 text-pretty text-muted-foreground text-sm leading-relaxed">
              {item.description}
            </p>
            <p className="font-mono text-muted-foreground/80 text-xs tracking-wide">
              {item.examples}
            </p>
          </div>
        </Reveal>
      ))}
    </ul>
  );
}
