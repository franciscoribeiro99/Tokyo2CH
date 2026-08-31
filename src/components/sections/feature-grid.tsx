import type { LucideIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export interface Feature {
  readonly title: string;
  readonly description: string;
  readonly icon: LucideIcon;
}

interface FeatureGridProps {
  readonly features: readonly Feature[];
}

export function FeatureGrid({ features }: FeatureGridProps) {
  return (
    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {features.map((feature) => (
        <li key={feature.title}>
          <Card className="h-full transition-colors hover:border-primary/40">
            <CardHeader>
              <span className="mb-2 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <feature.icon className="size-5" aria-hidden="true" />
              </span>
              <CardTitle className="text-base">{feature.title}</CardTitle>
              <CardDescription className="text-pretty leading-relaxed">
                {feature.description}
              </CardDescription>
            </CardHeader>
            <CardContent />
          </Card>
        </li>
      ))}
    </ul>
  );
}
