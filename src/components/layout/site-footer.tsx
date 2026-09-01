import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { Container } from "@/components/layout/container";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { type Locale, localePath } from "@/config/i18n";
import { siteConfig } from "@/config/site";
import type { Dictionary } from "@/content/fr";

interface SiteFooterProps {
  readonly locale: Locale;
  readonly dictionary: Dictionary;
}

export function SiteFooter({ locale, dictionary }: SiteFooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-border/60 border-t py-12">
      <Container>
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-sm space-y-3">
            <p>
              {/* The mark is decorative; this text is what gets announced. */}
              <span className="sr-only">{siteConfig.name}</span>
              <Logo className="h-6" />
            </p>
            <p className="text-pretty text-muted-foreground text-sm leading-relaxed">
              {dictionary.brand.tagline}
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
            <nav aria-label={dictionary.nav.footer} className="flex flex-col gap-2">
              <p className="font-medium text-sm">{dictionary.nav.company}</p>
              {[...siteConfig.mainNav, ...siteConfig.footerNav].map((item) => (
                <Link
                  key={item.href}
                  href={localePath(locale, item.href)}
                  className="rounded-sm text-muted-foreground text-sm hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {dictionary.nav[item.key]}
                </Link>
              ))}
            </nav>

            <nav aria-label={dictionary.nav.social} className="flex flex-col gap-2">
              <p className="font-medium text-sm">{dictionary.nav.elsewhere}</p>
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

        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-muted-foreground text-xs">
            &copy; {year} {siteConfig.legalName}. {dictionary.nav.rights}
          </p>
          {/* Repeated here because someone who lands mid-page from a search
              result should not have to scroll back up to change language. */}
          <LanguageSwitcher locale={locale} label={dictionary.nav.language} variant="full" />
        </div>
      </Container>
    </footer>
  );
}
