import type { Metadata } from "next";
import { Section } from "@/components/layout/section";
import { Prose } from "@/components/prose";
import { getDictionary } from "@/content/dictionaries";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getDictionary();
  return buildMetadata({
    title: t.legal.privacy.title,
    path: "/legal/privacy",
    description: t.legal.privacy.metaDescription,
  });
}

export default async function PrivacyPage() {
  const t = await getDictionary();

  return (
    <Section className="pt-16">
      <Prose>
        <h1>{t.legal.privacy.title}</h1>
        <p className="lead">
          {t.legal.lastUpdated} {t.legal.lastUpdatedDate}
        </p>

        {t.legal.privacy.sections.map((section) => (
          <div key={section.heading}>
            <h2>{section.heading}</h2>
            <p>{section.body}</p>
          </div>
        ))}

        {/*
          Swiss practice for a multilingual site: one language is named as
          governing so a divergence introduced by a later edit cannot leave it
          ambiguous which text applies.
        */}
        <p className="text-muted-foreground text-sm">{t.legal.governingNotice}</p>
      </Prose>
    </Section>
  );
}
