import type { Metadata } from "next";
import Image from "next/image";
import { Section, SectionHeader } from "@/components/layout/section";
import { Cta } from "@/components/sections/cta";
import { Faq } from "@/components/sections/faq";
import { Hero } from "@/components/sections/hero";
import { JourneyBand } from "@/components/sections/journey-band";
import { Pillars } from "@/components/sections/pillars";
import { Reveal } from "@/components/sections/reveal";
import { Testimonials } from "@/components/sections/testimonials";
import { faq as faqContent, home } from "@/config/content";
import { media } from "@/config/media";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({ path: "/" });

/** The home page shows the first three questions; the rest live on /faq. */
const FAQ_PREVIEW = faqContent.items.slice(0, 3);

export default function HomePage() {
  return (
    <>
      <Hero
        eyebrow={home.hero.eyebrow}
        kana={home.hero.kana}
        title={home.hero.title}
        description={home.hero.description}
        primaryCta={home.hero.primaryCta}
        secondaryCta={home.hero.secondaryCta}
      />

      <Section>
        <Pillars items={home.pillars} />
      </Section>

      <Section className="border-border/60 border-t bg-muted/30">
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_22rem] lg:gap-16">
          <div>
            <SectionHeader eyebrow={home.services.eyebrow} title={home.services.title} />
            <ul className="mt-10 flex flex-col gap-6">
              {home.services.points.map((point, index) => (
                <Reveal as="li" key={point} delay={index * 90} className="flex gap-5">
                  <span
                    aria-hidden="true"
                    className="mt-2.5 h-px w-8 shrink-0 bg-primary sm:w-12"
                  />
                  <p className="text-pretty text-lg leading-relaxed">{point}</p>
                </Reveal>
              ))}
            </ul>
          </div>

          <Reveal className="overflow-hidden rounded-xl border bg-muted">
            <Image
              src={media.tokyoNight.src}
              alt={media.tokyoNight.alt}
              width={media.tokyoNight.width}
              height={media.tokyoNight.height}
              sizes="(min-width: 1024px) 22rem, 92vw"
              className="h-full w-full object-cover"
            />
          </Reveal>
        </div>
      </Section>

      <JourneyBand
        eyebrow={home.band.eyebrow}
        title={home.band.title}
        description={home.band.description}
        video={media.journeyVideo}
      />

      <Section>
        <SectionHeader eyebrow="Customer stories" title="What clients say" className="mb-12" />
        <Testimonials items={home.testimonials} />
      </Section>

      <Section className="border-border/60 border-t">
        <SectionHeader
          eyebrow="Questions"
          title="The things people ask first"
          align="center"
          className="mb-12"
        />
        <div className="mx-auto max-w-3xl">
          <Faq items={FAQ_PREVIEW} />
        </div>
      </Section>

      <Cta title={home.cta.title} description={home.cta.description} action={home.cta.action} />
    </>
  );
}
