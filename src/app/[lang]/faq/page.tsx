import type { Metadata } from "next";
import { Section } from "@/components/layout/section";
import { Cta } from "@/components/sections/cta";
import { Faq } from "@/components/sections/faq";
import { PageHero } from "@/components/sections/page-hero";
import { localePath } from "@/config/i18n";
import { getDictionary, getLocale } from "@/content/dictionaries";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getDictionary();
  return buildMetadata({ title: t.nav.faq, path: "/faq", description: t.faq.hero.description });
}

export default async function FaqPage() {
  const locale = await getLocale();
  const t = await getDictionary();

  return (
    <>
      <PageHero
        eyebrow={t.faq.hero.eyebrow}
        title={t.faq.hero.title}
        description={t.faq.hero.description}
      />

      <Section>
        <div className="mx-auto max-w-3xl">
          <Faq items={t.faq.items} />
        </div>
      </Section>

      <Cta
        title={t.faq.cta.title}
        description={t.faq.cta.description}
        action={{ label: t.actions.askUsDirectly, href: localePath(locale, "/contact") }}
      />
    </>
  );
}
