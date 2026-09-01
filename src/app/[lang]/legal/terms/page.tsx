import type { Metadata } from "next";
import { Section } from "@/components/layout/section";
import { Prose } from "@/components/prose";
import { getDictionary } from "@/content/dictionaries";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getDictionary();
  return buildMetadata({
    title: t.legal.terms.title,
    path: "/legal/terms",
    description: t.legal.terms.metaDescription,
  });
}

export default async function TermsPage() {
  const t = await getDictionary();

  return (
    <Section className="pt-16">
      <Prose>
        <h1>{t.legal.terms.title}</h1>
        <p className="lead">
          {t.legal.lastUpdated} {t.legal.lastUpdatedDate}
        </p>

        {t.legal.terms.sections.map((section) => (
          <div key={section.heading}>
            <h2>{section.heading}</h2>
            <p>{section.body}</p>
          </div>
        ))}

        <p className="text-muted-foreground text-sm">{t.legal.governingNotice}</p>
      </Prose>
    </Section>
  );
}
