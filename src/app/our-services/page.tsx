import type { Metadata } from "next";
import Image from "next/image";
import { Section, SectionHeader } from "@/components/layout/section";
import { Cta } from "@/components/sections/cta";
import { PageHero } from "@/components/sections/page-hero";
import { Reveal } from "@/components/sections/reveal";
import { ServiceList } from "@/components/sections/service-list";
import { services } from "@/config/content";
import { media } from "@/config/media";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Our Services",
  path: "/our-services",
  description: services.hero.description,
});

export default function OurServicesPage() {
  return (
    <>
      <PageHero
        eyebrow={services.hero.eyebrow}
        title={services.hero.title}
        description={services.hero.description}
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
            {services.points.map((point, index) => (
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
          eyebrow="Services for your import"
          title="Everything between the auction sheet and the number plate"
          description="Take the whole process or just the part you need help with. Pricing is quoted per vehicle, because a kei car and a classic are not the same job."
          className="mb-14"
        />
        <ServiceList items={services.items} />
      </Section>

      <Cta
        title="Which part do you need help with?"
        description="Whether you want the full service or only the Swiss import paperwork, tell us where you are and we will pick it up from there."
        action={{ label: "Get in touch", href: "/contact" }}
      />
    </>
  );
}
