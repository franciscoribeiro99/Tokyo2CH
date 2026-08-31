import type { Metadata } from "next";
import { Section } from "@/components/layout/section";
import { Cta } from "@/components/sections/cta";
import { Faq } from "@/components/sections/faq";
import { PageHero } from "@/components/sections/page-hero";
import { faq } from "@/config/content";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "FAQ",
  path: "/faq",
  description: faq.hero.description,
});

export default function FaqPage() {
  return (
    <>
      <PageHero
        eyebrow={faq.hero.eyebrow}
        title={faq.hero.title}
        description={faq.hero.description}
      />

      <Section>
        <div className="mx-auto max-w-3xl">
          <Faq items={faq.items} />
        </div>
      </Section>

      <Cta
        title="Still unsure?"
        description="Import questions are rarely generic. Send us your situation and you will get a specific answer rather than a brochure."
        action={{ label: "Ask us directly", href: "/contact" }}
      />
    </>
  );
}
