import type { Metadata } from "next";
import { Section } from "@/components/layout/section";
import { Cta } from "@/components/sections/cta";
import { PageHero } from "@/components/sections/page-hero";
import { type Step, Steps } from "@/components/sections/steps";
import { howItWorks } from "@/config/content";
import { media } from "@/config/media";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "How It Works",
  path: "/how-it-works",
  description: howItWorks.hero.description,
});

const STEP_IMAGES = [media.journey.source, media.journey.verify, media.journey.arrive] as const;

const STEPS: readonly Step[] = howItWorks.steps.map((step, index) => ({
  ...step,
  image: STEP_IMAGES[index] ?? STEP_IMAGES[0],
}));

export default function HowItWorksPage() {
  return (
    <>
      <PageHero
        eyebrow={howItWorks.hero.eyebrow}
        title={howItWorks.hero.title}
        description={howItWorks.hero.description}
      />

      <Section>
        <Steps items={STEPS} />
      </Section>

      <Cta
        title="Start with step one."
        description="Tell us the vehicle, the budget, and how you plan to use it. Sourcing and shortlisting cost you nothing — you only commit once you have seen real options."
        action={{ label: "Share your request", href: "/contact" }}
      />
    </>
  );
}
