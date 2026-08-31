import { Mail, MapPin, Phone } from "lucide-react";
import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";
import { Section } from "@/components/layout/section";
import { Separator } from "@/components/ui/separator";
import { siteConfig } from "@/config/site";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Contact",
  path: "/contact",
  description: `Get in touch with ${siteConfig.name}. Real replies from engineers, usually within one business day.`,
});

const DETAILS = [
  {
    icon: Mail,
    label: "Email",
    value: siteConfig.contact.email,
    href: `mailto:${siteConfig.contact.email}`,
  },
  {
    icon: Phone,
    label: "Phone",
    value: siteConfig.contact.phone,
    href: `tel:${siteConfig.contact.phone.replace(/[^+\d]/g, "")}`,
  },
  { icon: MapPin, label: "Office", value: siteConfig.contact.address, href: undefined },
] as const;

export default function ContactPage() {
  return (
    <Section className="pt-16">
      <div className="grid gap-16 lg:grid-cols-[1fr_22rem]">
        <div className="flex flex-col gap-10">
          <div className="flex max-w-2xl flex-col gap-4">
            <h1 className="text-balance font-semibold text-4xl tracking-tight sm:text-5xl">
              Tell us what you are building.
            </h1>
            <p className="text-pretty text-lg text-muted-foreground leading-relaxed">
              A few sentences is enough to start. We reply to everything within one business day.
            </p>
          </div>

          <ContactForm />
        </div>

        <aside className="flex flex-col gap-6 lg:border-l lg:pl-10">
          <h2 className="font-semibold text-sm uppercase tracking-widest">
            Other ways to reach us
          </h2>
          <Separator />
          <dl className="flex flex-col gap-6">
            {DETAILS.map((detail) => (
              <div key={detail.label} className="flex gap-3">
                <detail.icon
                  className="mt-0.5 size-4 shrink-0 text-muted-foreground"
                  aria-hidden="true"
                />
                <div className="flex flex-col gap-1">
                  <dt className="font-medium text-sm">{detail.label}</dt>
                  <dd className="text-muted-foreground text-sm">
                    {detail.href ? (
                      <a
                        href={detail.href}
                        className="rounded-sm underline-offset-4 hover:text-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        {detail.value}
                      </a>
                    ) : (
                      detail.value
                    )}
                  </dd>
                </div>
              </div>
            ))}
          </dl>
        </aside>
      </div>
    </Section>
  );
}
