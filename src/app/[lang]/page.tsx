import type { Metadata } from "next";
import Image from "next/image";
import { Section, SectionHeader } from "@/components/layout/section";
import { Cta } from "@/components/sections/cta";
import { Faq } from "@/components/sections/faq";
import { Hero } from "@/components/sections/hero";
import { JourneyBand } from "@/components/sections/journey-band";
import { Pillars } from "@/components/sections/pillars";
import { Reveal } from "@/components/sections/reveal";
import { localePath } from "@/config/i18n";
import { media } from "@/config/media";
import { getDictionary, getLocale } from "@/content/dictionaries";
import { buildMetadata } from "@/lib/seo";

export function generateMetadata(): Promise<Metadata> {
  return buildMetadata({ path: "/" });
}

export default async function HomePage() {
  const locale = await getLocale();
  const t = await getDictionary();

  return (
    <>
      <Hero
        eyebrow={t.home.hero.eyebrow}
        kana={t.home.hero.kana}
        title={t.home.hero.title}
        description={t.home.hero.description}
        primaryCta={{ label: t.actions.startSourcing, href: localePath(locale, "/contact") }}
        secondaryCta={{ label: t.actions.seeWhatWeSource, href: localePath(locale, "/vehicles") }}
      />

      <Section>
        <Pillars items={t.home.pillars} />
      </Section>

      <Section className="border-border/60 border-t bg-muted/30">
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_22rem] lg:gap-16">
          <div>
            <SectionHeader eyebrow={t.home.services.eyebrow} title={t.home.services.title} />
            <ul className="mt-10 flex flex-col gap-6">
              {t.home.services.points.map((point, index) => (
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
        eyebrow={t.home.band.eyebrow}
        title={t.home.band.title}
        description={t.home.band.description}
        video={media.journeyVideo}
      />

      <Section className="border-border/60 border-t">
        <SectionHeader
          eyebrow={t.home.faqSection.eyebrow}
          title={t.home.faqSection.title}
          align="center"
          className="mb-12"
        />
        <div className="mx-auto max-w-3xl">
          <Faq items={t.faq.items.slice(0, 3)} />
        </div>
      </Section>

      <Cta
        title={t.home.cta.title}
        description={t.home.cta.description}
        action={{ label: t.actions.startSourcing, href: localePath(locale, "/contact") }}
      />
    </>
  );
}
