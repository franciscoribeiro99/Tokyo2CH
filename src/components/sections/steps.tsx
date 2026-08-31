import Image from "next/image";
import { Reveal } from "@/components/sections/reveal";
import type { MediaImage } from "@/config/media";

export interface Step {
  readonly step: string;
  readonly title: string;
  readonly description: string;
  readonly cost: string;
  readonly image: MediaImage;
}

interface StepsProps {
  readonly items: readonly Step[];
}

/**
 * The import journey, as an ordered list.
 *
 * It is an `<ol>` because the order is the meaning — a screen-reader user
 * should hear "1 of 3", not three unrelated cards. Rows alternate sides on
 * wide viewports purely visually; the DOM order stays the reading order.
 */
export function Steps({ items }: StepsProps) {
  return (
    <ol className="flex flex-col gap-16 sm:gap-24">
      {items.map((item, index) => (
        <Reveal
          as="li"
          key={item.step}
          className="grid items-center gap-8 lg:grid-cols-2 lg:gap-14"
        >
          <div className={index % 2 === 1 ? "lg:order-2" : undefined}>
            <div className="flex items-baseline gap-4">
              <span
                aria-hidden="true"
                className="font-bold font-display text-5xl text-primary/25 leading-none"
              >
                {item.step}
              </span>
              <h3 className="font-bold font-display text-2xl tracking-tight">{item.title}</h3>
            </div>

            <p className="mt-5 text-pretty text-lg text-muted-foreground leading-relaxed">
              {item.description}
            </p>

            <p className="mt-6 inline-flex items-center gap-2 rounded-full border px-3 py-1 font-medium font-mono text-muted-foreground text-xs uppercase tracking-widest">
              {item.cost}
            </p>
          </div>

          <div className="overflow-hidden rounded-xl border bg-muted">
            <Image
              src={item.image.src}
              alt={item.image.alt}
              width={item.image.width}
              height={item.image.height}
              sizes="(min-width: 1024px) 46vw, 92vw"
              className="h-full w-full object-cover"
            />
          </div>
        </Reveal>
      ))}
    </ol>
  );
}
