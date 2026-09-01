import type { Metadata } from "next";
import { Section } from "@/components/layout/section";
import { Cta } from "@/components/sections/cta";
import { PageHero } from "@/components/sections/page-hero";
import { type Step, Steps } from "@/components/sections/steps";
import { localePath } from "@/config/i18n";
import { media } from "@/config/media";
import { getDictionary, getLocale } from "@/content/dictionaries";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getDictionary();
  return buildMetadata({
    title: t.nav.howItWorks,
    path: "/how-it-works",
    description: t.howItWorks.hero.description,
  });
}

const STEP_IMAGES = [media.journey.source, media.journey.verify, media.journey.arrive] as const;

export default async function HowItWorksPage() {
  const locale = await getLocale();
  const t = await getDictionary();

  const steps: readonly Step[] = t.howItWorks.steps.map((step, index) => ({
    ...step,
    image: STEP_IMAGES[index] ?? STEP_IMAGES[0],
  }));

  return (
    <>
      <PageHero
        eyebrow={t.howItWorks.hero.eyebrow}
        title={t.howItWorks.hero.title}
        description={t.howItWorks.hero.description}
      />

      <Section>
        <Steps items={steps} />
      </Section>

      <Cta
        title={t.howItWorks.cta.title}
        description={t.howItWorks.cta.description}
        action={{ label: t.actions.shareYourRequest, href: localePath(locale, "/contact") }}
      />
    </>
  );
}
