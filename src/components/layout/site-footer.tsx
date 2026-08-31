import Link from "next/link";
import { Container } from "@/components/layout/container";
import { siteConfig } from "@/config/site";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-border/60 border-t py-12">
      <Container>
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-sm space-y-3">
            <p className="font-bold font-display tracking-tight">{siteConfig.name}</p>
            <p className="text-pretty text-muted-foreground text-sm leading-relaxed">
              {siteConfig.tagline}
            </p>
            <div className="flex flex-col gap-1">
              <a
                href={`mailto:${siteConfig.contact.email}`}
                className="inline-block rounded-sm text-muted-foreground text-sm underline-offset-4 hover:text-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {siteConfig.contact.email}
              </a>
              <a
                href={siteConfig.contact.phoneHref}
                className="inline-block rounded-sm text-muted-foreground text-sm underline-offset-4 hover:text-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {siteConfig.contact.phone}
              </a>
            </div>
          </div>

          <div className="flex gap-12">
            <nav aria-label="Footer" className="flex flex-col gap-2">
              <p className="font-medium text-sm">Company</p>
              {[...siteConfig.mainNav, ...siteConfig.footerNav].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-sm text-muted-foreground text-sm hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {item.title}
                </Link>
              ))}
            </nav>

            <nav aria-label="Social" className="flex flex-col gap-2">
              <p className="font-medium text-sm">Elsewhere</p>
              {siteConfig.social.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="rounded-sm text-muted-foreground text-sm hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </div>
        </div>

        <p className="mt-10 text-muted-foreground text-xs">
          &copy; {year} {siteConfig.legalName}. All rights reserved.
        </p>
      </Container>
    </footer>
  );
}
