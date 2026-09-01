/**
 * Keyboard users must be able to jump past the nav.
 * Visually hidden until focused — the first tab stop on every page.
 */
interface SkipLinkProps {
  readonly label: string;
}

export function SkipLink({ label }: SkipLinkProps) {
  return (
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:bg-background focus:px-4 focus:py-2 focus:font-medium focus:text-sm focus:ring-2 focus:ring-ring"
    >
      {label}
    </a>
  );
}
