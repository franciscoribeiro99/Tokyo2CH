import type { Metadata } from "next";
import { Section } from "@/components/layout/section";
import { Prose } from "@/components/prose";
import { siteConfig } from "@/config/site";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Terms of Service",
  path: "/legal/terms",
  description: `The terms governing use of the ${siteConfig.name} website.`,
});

const LAST_UPDATED = "1 January 2026";

export default function TermsPage() {
  return (
    <Section className="pt-16">
      <Prose>
        <h1>Terms of Service</h1>
        <p className="lead">Last updated: {LAST_UPDATED}</p>

        <div className="not-prose my-8 rounded-lg border border-amber-500/40 bg-amber-500/5 p-4 text-sm">
          <strong>Template placeholder.</strong> This document is scaffolding, not legal advice.
          Replace it with terms reviewed by your counsel before you launch.
        </div>

        <h2>Acceptance</h2>
        <p>
          By accessing this website you agree to these terms. If you do not agree with them, please
          do not use the site.
        </p>

        <h2>Use of the site</h2>
        <p>
          You may view and print material from this site for your own reference. You may not
          reproduce it commercially, attempt to gain unauthorised access to any part of it, or use
          it in a way that impairs its availability for others.
        </p>

        <h2>Intellectual property</h2>
        <p>
          All content on this site is owned by {siteConfig.legalName} or its licensors and is
          protected by copyright and trade mark law.
        </p>

        <h2>No warranty</h2>
        <p>
          The site is provided &ldquo;as is&rdquo;. We make no warranty that it will be
          uninterrupted, error-free, or that the information on it is complete or current.
        </p>

        <h2>Limitation of liability</h2>
        <p>
          To the fullest extent permitted by law, {siteConfig.legalName} is not liable for indirect
          or consequential loss arising from use of this site. Nothing here limits liability for
          death, personal injury, or fraud.
        </p>

        <h2>Governing law</h2>
        <p>
          These terms are governed by the laws of the jurisdiction in which {siteConfig.legalName}{" "}
          is registered.
        </p>

        <h2>Contact</h2>
        <p>
          Questions go to{" "}
          <a href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a>.
        </p>
      </Prose>
    </Section>
  );
}
