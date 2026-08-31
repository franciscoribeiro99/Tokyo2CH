import { Check, Code2, Compass, PenTool } from "lucide-react";
import type { Metadata } from "next";
import { Section, SectionHeader } from "@/components/layout/section";
import { Cta } from "@/components/sections/cta";
import { Hero } from "@/components/sections/hero";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Services",
  path: "/services",
  description:
    "Discovery, product design, and platform engineering — delivered by small senior teams embedded with yours.",
});

const SERVICES = [
  {
    icon: Compass,
    title: "Discovery & strategy",
    description: "Two weeks to turn an ambiguous problem into a plan someone can be held to.",
    deliverables: [
      "Stakeholder and user interviews",
      "Technical feasibility assessment",
      "Costed, sequenced delivery plan",
      "Success metrics you agree to measure",
    ],
  },
  {
    icon: PenTool,
    title: "Product design",
    description: "Interface and interaction design that survives contact with real users.",
    deliverables: [
      "Design system in code, not just Figma",
      "Accessible components (WCAG 2.2 AA)",
      "Prototype tested with real users",
      "Handoff docs your engineers will read",
    ],
  },
  {
    icon: Code2,
    title: "Platform engineering",
    description: "Production systems with the operational work done, not deferred.",
    deliverables: [
      "Typed, tested application code",
      "CI/CD with automated quality gates",
      "Observability and alerting from day one",
      "Runbooks and on-call handover",
    ],
  },
] as const;

export default function ServicesPage() {
  return (
    <>
      <Hero
        eyebrow="Services"
        title="Three ways we work together."
        description="Most engagements start with discovery and continue into design or engineering. You can also buy any one of them on its own."
        primaryCta={{ label: "Discuss your project", href: "/contact" }}
      />

      <Section>
        <SectionHeader
          title="What you get"
          description="Each engagement has a fixed shape and named deliverables, agreed before work starts."
        />

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {SERVICES.map((service) => (
            <Card key={service.title} className="flex h-full flex-col">
              <CardHeader>
                <span className="mb-2 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <service.icon className="size-5" aria-hidden="true" />
                </span>
                <CardTitle>{service.title}</CardTitle>
                <CardDescription className="text-pretty leading-relaxed">
                  {service.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="mt-auto">
                <ul className="flex flex-col gap-3">
                  {service.deliverables.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm">
                      <Check className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      <Cta
        title="Not sure which one you need?"
        description="Describe the problem and we will tell you which of these fits — or that none of them do."
        action={{ label: "Start a conversation", href: "/contact" }}
      />
    </>
  );
}
