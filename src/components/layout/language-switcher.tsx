"use client";

import { usePathname } from "next/navigation";
import {
  LOCALE_LABELS,
  LOCALE_SHORT_LABELS,
  LOCALES,
  type Locale,
  localePath,
} from "@/config/i18n";
import { cn } from "@/lib/utils";

interface LanguageSwitcherProps {
  readonly locale: Locale;
  readonly label: string;
  /** `compact` is the header's four-letter row; `full` names each language. */
  readonly variant?: "compact" | "full";
  readonly className?: string;
}

/**
 * Switches language while staying on the same page.
 *
 * It strips the current locale from the path and re-prefixes it, so a visitor
 * reading `/de/vehicles` who picks Italian lands on `/it/vehicles` rather than
 * being dumped on the home page — which is what a switcher that links to `/`
 * does, and the single most common complaint about multilingual sites.
 *
 * These are real links, not a `<select>`: each language is a distinct URL, so
 * search engines should be able to follow them and visitors should be able to
 * open one in a new tab.
 */
export function LanguageSwitcher({
  locale,
  label,
  variant = "compact",
  className,
}: LanguageSwitcherProps) {
  const pathname = usePathname();

  // Everything after the locale segment, e.g. "/vehicles" from "/de/vehicles".
  const rest = pathname.replace(/^\/[^/]+/, "") || "/";
  const labels = variant === "compact" ? LOCALE_SHORT_LABELS : LOCALE_LABELS;

  return (
    <nav aria-label={label} className={cn("flex items-center gap-1", className)}>
      {LOCALES.map((candidate) => {
        const isCurrent = candidate === locale;

        return (
          <a
            key={candidate}
            href={localePath(candidate, rest)}
            hrefLang={candidate}
            aria-current={isCurrent ? "true" : undefined}
            className={cn(
              "rounded-md px-2 py-1 font-medium text-xs uppercase tracking-wide transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              isCurrent
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {labels[candidate]}
          </a>
        );
      })}
    </nav>
  );
}
