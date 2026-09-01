import Link from "next/link";
import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import { localePath } from "@/config/i18n";
import { siteConfig } from "@/config/site";
import { getDictionary, getLocale } from "@/content/dictionaries";

/**
 * Rendered when a page calls `notFound()` from inside a locale.
 *
 * It does *not* catch unknown URLs. Those match no route, so Next cannot
 * resolve `[lang]` and falls back to its own bare 404. A `[...rest]` catch-all
 * would render this page for them, but measured on a real server it answered
 * **200** — `notFound()` from a matched dynamic route does not set the status,
 * even with `force-dynamic`. A soft 404 gets indexed as a real page, which is
 * worse for the site than an unstyled one nobody links to.
 *
 * No `generateMetadata` either: Next does not call it for `not-found`, and
 * exporting a promise as `metadata` silently ships an unresolved object.
 */
export default async function NotFound() {
  const locale = await getLocale();
  const t = await getDictionary();

  return (
    <Section className="flex flex-1 items-center">
      <div className="mx-auto flex max-w-lg flex-col items-center gap-6 text-center">
        <p className="font-mono font-semibold text-7xl text-primary/30">404</p>
        <h1 className="text-balance font-semibold text-3xl tracking-tight sm:text-4xl">
          {t.notFound.title}
        </h1>
        <p className="text-pretty text-muted-foreground leading-relaxed">
          {t.notFound.description}
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Button asChild>
            <Link href={localePath(locale, "/")}>{t.notFound.backHome}</Link>
          </Button>
          {siteConfig.mainNav.map((item) => (
            <Button key={item.href} asChild variant="outline">
              <Link href={localePath(locale, item.href)}>{t.nav[item.key]}</Link>
            </Button>
          ))}
        </div>
      </div>
    </Section>
  );
}
