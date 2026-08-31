import type { Metadata } from "next";
import { Section } from "@/components/layout/section";
import { Prose } from "@/components/prose";
import { siteConfig } from "@/config/site";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Privacy Policy",
  path: "/legal/privacy",
  description: `How ${siteConfig.name} collects, uses, and protects personal data.`,
});

const LAST_UPDATED = "1 January 2026";

export default function PrivacyPage() {
  return (
    <Section className="pt-16">
      <Prose>
        <h1>Privacy Policy</h1>
        <p className="lead">Last updated: {LAST_UPDATED}</p>

        <div className="not-prose my-8 rounded-lg border border-amber-500/40 bg-amber-500/5 p-4 text-sm">
          <strong>Template placeholder.</strong> This document is scaffolding, not legal advice.
          Replace it with a policy reviewed by your counsel before you launch.
        </div>

        <h2>What we collect</h2>
        <p>
          When you submit the contact form we collect the name, email address, vehicle of interest,
          and message you provide. We collect aggregate, non-identifying usage analytics to
          understand how the site performs.
        </p>

        <h2>Why we collect it</h2>
        <p>
          We use contact details solely to respond to your enquiry and, where a working relationship
          follows, to administer it. We do not sell personal data, and we do not use it for
          advertising.
        </p>

        <h2>How long we keep it</h2>
        <p>
          Enquiries that do not lead to an engagement are deleted after 24 months. Records relating
          to an active or completed engagement are retained for as long as required by applicable
          tax and contract law.
        </p>

        <h2>Your rights</h2>
        <p>
          Depending on where you live, you may have the right to access, correct, export, or delete
          the personal data we hold about you, and to object to its processing. To exercise any of
          these, email <a href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a>
          .
        </p>

        <h2>Cookies</h2>
        <p>
          This site sets a single first-party preference storing your light or dark theme choice. It
          contains no identifier and is never transmitted to a third party.
        </p>

        <h2>Contact</h2>
        <p>
          Questions about this policy go to{" "}
          <a href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a>, or by post
          to {siteConfig.contact.address}.
        </p>
      </Prose>
    </Section>
  );
}
