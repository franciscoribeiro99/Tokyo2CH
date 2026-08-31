import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ProseProps {
  readonly children: ReactNode;
  readonly className?: string;
}

/**
 * Long-form text styling for legal pages, docs, and any future MDX content.
 *
 * Hand-rolled rather than pulled from @tailwindcss/typography so it inherits
 * the theme tokens directly and stays readable in both colour schemes.
 */
export function Prose({ children, className }: ProseProps) {
  return (
    <div
      className={cn(
        "mx-auto max-w-3xl",
        "[&_h1]:mb-4 [&_h1]:text-balance [&_h1]:font-semibold [&_h1]:text-4xl [&_h1]:tracking-tight",
        "[&_h2]:mt-12 [&_h2]:mb-4 [&_h2]:font-semibold [&_h2]:text-2xl [&_h2]:tracking-tight",
        "[&_h3]:mt-8 [&_h3]:mb-3 [&_h3]:font-semibold [&_h3]:text-lg",
        "[&_p]:mb-4 [&_p]:text-pretty [&_p]:text-muted-foreground [&_p]:leading-relaxed",
        "[&_p.lead]:text-base [&_p.lead]:text-muted-foreground/80",
        "[&_ul]:mb-4 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6 [&_ul]:text-muted-foreground",
        "[&_ol]:mb-4 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-6 [&_ol]:text-muted-foreground",
        "[&_a]:font-medium [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-4",
        "[&_strong]:font-semibold [&_strong]:text-foreground",
        className,
      )}
    >
      {children}
    </div>
  );
}
