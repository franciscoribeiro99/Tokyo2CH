import type { Metadata } from "next";
import { Section, SectionHeader } from "@/components/layout/section";
import { Cta } from "@/components/sections/cta";
import { Hero } from "@/components/sections/hero";
import { type Stat, Stats } from "@/components/sections/stats";
import { siteConfig } from "@/config/site";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "About",
  path: "/about",
  description: `How ${siteConfig.name} works, what we believe, and who you will actually be talking to.`,
});

const STATS: readonly Stat[] = [
  { value: String(siteConfig.foundingYear), label: "Founded" },
  { value: "28", label: "People" },
  { value: "3", label: "Offices" },
  { value: "84%", label: "Repeat clients" },
];

const PRINCIPLES = [
  {
    title: "Say the difficult thing early",
    body: "A deadline that will not hold is worth more to you as a conversation in week one than as a surprise in week nine.",
  },
  {
    title: "Small teams, full ownership",
    body: "Three engineers who understand the whole system will outrun a dozen who each own a slice of it.",
  },
  {
    title: "Leave it better documented than you found it",
    body: "The measure of an engagement is how well the team runs six months after we leave.",
  },
] as const;

export default function AboutPage() {
  return (
    <>
      <Hero
        eyebrow="About us"
        title={`We are ${siteConfig.name}.`}
        description={`A ${new Date().getFullYear() - siteConfig.foundingYear}-year-old product studio that works the way we would want an agency to work with us.`}
      />

      <Section>
        <SectionHeader
          eyebrow="How we work"
          title="Three principles we actually enforce"
          description="These are not values on a wall. They show up in how we scope, staff, and hand over."
        />
        <ul className="mt-14 grid gap-10 lg:grid-cols-3">
          {PRINCIPLES.map((principle, index) => (
            <li key={principle.title} className="flex flex-col gap-3">
              <span
                aria-hidden="true"
                className="font-mono font-semibold text-4xl text-primary/30 tabular-nums"
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="font-semibold text-lg tracking-tight">{principle.title}</h3>
              <p className="text-pretty text-muted-foreground leading-relaxed">{principle.body}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section className="border-border/60 border-y bg-muted/30">
        <Stats stats={STATS} />
      </Section>

      <Cta
        title="Want to know if we are a fit?"
        description="The fastest way to find out is a 30-minute call. No deck, no discovery form."
        action={{ label: "Talk to us", href: "/contact" }}
      />
    </>
  );
}
