import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { Container } from "@/components/layout/container";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { MobileNav } from "@/components/layout/mobile-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { type Locale, localePath } from "@/config/i18n";
import { siteConfig } from "@/config/site";
import type { Dictionary } from "@/content/fr";
import { NavLink } from "./nav-link";

interface SiteHeaderProps {
  readonly locale: Locale;
  readonly dictionary: Dictionary;
}

export function SiteHeader({ locale, dictionary }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-border/60 border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <Container>
        <div className="flex h-16 items-center justify-between gap-4">
          <Link
            href={localePath(locale, "/")}
            className="rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            {/* The mark is decorative; this text is what gets announced. */}
            <span className="sr-only">{siteConfig.name}</span>
            <Logo className="h-7" />
          </Link>

          <nav aria-label={dictionary.nav.main} className="hidden items-center gap-1 md:flex">
            {siteConfig.mainNav.map((item) => (
              <NavLink key={item.href} href={localePath(locale, item.href)}>
                {dictionary.nav[item.key]}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <LanguageSwitcher
              locale={locale}
              label={dictionary.nav.language}
              className="hidden sm:flex"
            />
            <ThemeToggle />
            <Button asChild size="sm" className="hidden md:inline-flex">
              <Link href={localePath(locale, "/contact")}>{dictionary.actions.startSourcing}</Link>
            </Button>
            <MobileNav locale={locale} dictionary={dictionary} />
          </div>
        </div>
      </Container>
    </header>
  );
}
