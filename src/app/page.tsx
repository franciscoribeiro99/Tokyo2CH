import { Gauge, Layers, LifeBuoy, Lock, Rocket, Wrench } from "lucide-react";
import type { Metadata } from "next";
import { Section, SectionHeader } from "@/components/layout/section";
import { Cta } from "@/components/sections/cta";
import { Faq } from "@/components/sections/faq";
import { type Feature, FeatureGrid } from "@/components/sections/feature-grid";
import { Hero } from "@/components/sections/hero";
import { type Stat, Stats } from "@/components/sections/stats";
import { siteConfig } from "@/config/site";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({ path: "/" });

const FEATURES: readonly Feature[] = [
  {
    icon: Rocket,
    title: "Ship in weeks, not quarters",
    description: "Small senior teams, short feedback loops, and a working deployment from day one.",
  },
  {
    icon: Layers,
    title: "Architecture that survives",
    description:
      "We design for the version of your product that exists two years from now, not just this quarter.",
  },
  {
    icon: Gauge,
    title: "Performance as a requirement",
    description:
      "Core Web Vitals are tracked in CI and treated as a release blocker, not a post-launch cleanup.",
  },
  {
    icon: Lock,
    title: "Secure by default",
    description:
      "Threat modelling, dependency scanning, and least-privilege access baked into the pipeline.",
  },
  {
    icon: Wrench,
    title: "You own everything",
    description:
      "No proprietary runtime, no lock-in. Your repository, your infrastructure, your roadmap.",
  },
  {
    icon: LifeBuoy,
    title: "Support that answers",
    description: "Named engineers, published response times, and a real escalation path.",
  },
];

const STATS: readonly Stat[] = [
  { value: "40+", label: "Products shipped" },
  { value: "99.98%", label: "Median uptime" },
  { value: "< 4h", label: "Support response" },
  { value: "12", label: "Countries served" },
];

const FAQS = [
  {
    question: "How do engagements usually start?",
    answer:
      "With a paid two-week discovery. We map the problem, agree on success metrics, and deliver a plan you can execute with or without us.",
  },
  {
    question: "Do you work with in-house teams?",
    answer:
      "Most of our work is embedded alongside an existing team. We pair, review, and hand over rather than building in isolation.",
  },
  {
    question: "What happens to the code afterwards?",
    answer:
      "It is yours from the first commit. We work in your repository, under your license, with documentation written for the team that inherits it.",
  },
  {
    question: "What is your typical project size?",
    answer:
      "Engagements run from six weeks to eighteen months. If your problem is smaller than that, we will tell you and point you somewhere better.",
  },
] as const;

export default function HomePage() {
  return (
    <>
      <Hero
        eyebrow="Strategy · Design · Engineering"
        title={siteConfig.tagline}
        description={siteConfig.description}
        primaryCta={{ label: "Start a project", href: "/contact" }}
        secondaryCta={{ label: "See what we do", href: "/services" }}
      />

      <Section>
        <SectionHeader
          eyebrow="Why teams pick us"
          title="Built for teams that have to live with the result"
          description="Every one of these is a commitment we make in writing before an engagement starts."
        />
        <div className="mt-14">
          <FeatureGrid features={FEATURES} />
        </div>
      </Section>

      <Section className="border-border/60 border-y bg-muted/30">
        <Stats stats={STATS} />
      </Section>

      <Section>
        <SectionHeader
          eyebrow="Questions"
          title="The things people ask first"
          align="center"
          className="mb-14"
        />
        <div className="mx-auto max-w-3xl">
          <Faq items={FAQS} />
        </div>
      </Section>

      <Cta
        title="Tell us what you are building."
        description="Send a few sentences about the problem. You will get a real reply from an engineer, not a sales sequence."
        action={{ label: "Get in touch", href: "/contact" }}
      />
    </>
  );
}
