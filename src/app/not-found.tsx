import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Page not found",
  path: "/404",
  noIndex: true,
});

export default function NotFound() {
  return (
    <Section className="flex flex-1 items-center">
      <div className="mx-auto flex max-w-lg flex-col items-center gap-6 text-center">
        <p className="font-mono font-semibold text-7xl text-primary/30">404</p>
        <h1 className="text-balance font-semibold text-3xl tracking-tight sm:text-4xl">
          We could not find that page.
        </h1>
        <p className="text-pretty text-muted-foreground leading-relaxed">
          The link may be out of date, or the page may have moved. These are the places most people
          are looking for.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Button asChild>
            <Link href="/">Back to home</Link>
          </Button>
          {siteConfig.mainNav.map((item) => (
            <Button key={item.href} asChild variant="outline">
              <Link href={item.href}>{item.title}</Link>
            </Button>
          ))}
        </div>
      </div>
    </Section>
  );
}
