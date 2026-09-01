"use client";

import { useEffect } from "react";
import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";

interface ErrorPageProps {
  readonly error: Error & { digest?: string };
  readonly reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    // Replace with your error tracker (Sentry, Vercel Observability, …).
    console.error(error);
  }, [error]);

  return (
    <Section className="flex flex-1 items-center">
      <div className="mx-auto flex max-w-lg flex-col items-center gap-6 text-center">
        <h1 className="text-balance font-semibold text-3xl tracking-tight sm:text-4xl">
          Something went wrong.
        </h1>
        <p className="text-pretty text-muted-foreground leading-relaxed">
          The error has been logged. Try again, and if it keeps happening let us know at{" "}
          <a
            href={`mailto:${siteConfig.contact.email}`}
            className="font-medium text-primary underline underline-offset-4"
          >
            {siteConfig.contact.email}
          </a>
          .
        </p>

        {/* The digest is what support needs to find this exact failure in logs. */}
        {error.digest ? (
          <p className="font-mono text-muted-foreground text-xs">Reference: {error.digest}</p>
        ) : null}

        <Button onClick={reset}>Try again</Button>
      </div>
    </Section>
  );
}
