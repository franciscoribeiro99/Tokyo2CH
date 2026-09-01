import type { Metadata } from "next";
import Image from "next/image";
import { Section, SectionHeader } from "@/components/layout/section";
import { Cta } from "@/components/sections/cta";
import { PageHero } from "@/components/sections/page-hero";
import { Reveal } from "@/components/sections/reveal";
import { ServiceList } from "@/components/sections/service-list";
import { localePath } from "@/config/i18n";
import { media } from "@/config/media";
import { getDictionary, getLocale } from "@/content/dictionaries";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getDictionary();
  return buildMetadata({
    title: t.nav.ourServices,
    path: "/our-services",
    description: t.services.hero.description,
  });
}

export default async function OurServicesPage() {
  const locale = await getLocale();
  const t = await getDictionary();

  return (
    <>
      <PageHero
        eyebrow={t.services.hero.eyebrow}
        title={t.services.hero.title}
        description={t.services.hero.description}
      />

      <Section>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal className="overflow-hidden rounded-xl border bg-muted">
            <Image
              src={media.journey.ship.src}
              alt={media.journey.ship.alt}
              width={media.journey.ship.width}
              height={media.journey.ship.height}
              sizes="(min-width: 1024px) 46vw, 92vw"
              className="h-full w-full object-cover"
            />
          </Reveal>

          <ul className="flex flex-col gap-6">
            {t.services.points.map((point, index) => (
              <Reveal as="li" key={point} delay={index * 90} className="flex gap-5">
                <span aria-hidden="true" className="mt-2.5 h-px w-8 shrink-0 bg-primary sm:w-12" />
                <p className="text-pretty text-lg leading-relaxed">{point}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </Section>

      <Section className="border-border/60 border-t bg-muted/30">
        <SectionHeader
          eyebrow={t.services.itemsHeader.eyebrow}
          title={t.services.itemsHeader.title}
          description={t.services.itemsHeader.description}
          className="mb-14"
        />
        <ServiceList items={t.services.items} />
      </Section>

      <Cta
        title={t.services.cta.title}
        description={t.services.cta.description}
        action={{ label: t.actions.getInTouch, href: localePath(locale, "/contact") }}
      />
    </>
  );
}
