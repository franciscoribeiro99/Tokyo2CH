import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";

interface CtaProps {
  readonly title: string;
  readonly description: string;
  readonly action: { readonly label: string; readonly href: string };
}

export function Cta({ title, description, action }: CtaProps) {
  return (
    <section className="border-border/60 border-t py-20 sm:py-24">
      <Container>
        <div className="relative isolate overflow-hidden rounded-2xl border bg-card px-8 py-14 sm:px-14">
          <div
            aria-hidden="true"
            className="absolute top-0 right-0 -z-10 h-80 w-80 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl"
          />
          <div className="flex max-w-2xl flex-col gap-4">
            <h2 className="text-balance font-semibold text-3xl tracking-tight sm:text-4xl">
              {title}
            </h2>
            <p className="text-pretty text-lg text-muted-foreground leading-relaxed">
              {description}
            </p>
            <div className="mt-2">
              <Button asChild size="lg">
                <Link href={action.href}>
                  {action.label}
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
