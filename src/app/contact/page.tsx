import { Clock, Mail, MapPin, Phone } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import { ContactForm } from "@/components/contact-form";
import { Section } from "@/components/layout/section";
import { PageHero } from "@/components/sections/page-hero";
import { Separator } from "@/components/ui/separator";
import { contact } from "@/config/content";
import { media } from "@/config/media";
import { siteConfig } from "@/config/site";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Contact",
  path: "/contact",
  description: contact.hero.description,
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
    href: siteConfig.contact.phoneHref,
  },
  { icon: MapPin, label: "Address", value: siteConfig.contact.address, href: undefined },
  { icon: Clock, label: "Hours", value: siteConfig.contact.hours, href: undefined },
  // Rows with no value are dropped rather than rendered empty — the postal
  // address is not published yet, and filler text is worse than its absence.
].filter((detail) => detail.value.length > 0);

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow={contact.hero.eyebrow}
        title={contact.hero.title}
        description={contact.hero.description}
      />

      <Section>
        <div className="grid gap-16 lg:grid-cols-[1fr_22rem]">
          <ContactForm />

          <aside className="flex flex-col gap-6 lg:border-l lg:pl-10">
            <h2 className="font-bold font-display text-sm uppercase tracking-widest">
              {contact.location.title}
            </h2>
            <p className="text-pretty text-muted-foreground text-sm leading-relaxed">
              {contact.location.description}
            </p>

            <div className="overflow-hidden rounded-xl border bg-muted">
              <Image
                src={media.contactLocation.src}
                alt={media.contactLocation.alt}
                width={media.contactLocation.width}
                height={media.contactLocation.height}
                sizes="(min-width: 1024px) 22rem, 92vw"
                className="h-full w-full object-cover"
              />
            </div>

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
    </>
  );
}
