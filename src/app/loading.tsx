import { Section } from "@/components/layout/section";
import { Skeleton } from "@/components/ui/skeleton";

/** Route-level fallback. Mirrors the page rhythm so the swap is not jarring. */
export default function Loading() {
  return (
    <Section className="pt-16">
      <div className="flex flex-col gap-6">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-12 w-full max-w-2xl" />
        <Skeleton className="h-6 w-full max-w-xl" />
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {["a", "b", "c", "d", "e", "f"].map((key) => (
            <Skeleton key={key} className="h-48 w-full rounded-xl" />
          ))}
        </div>
      </div>
    </Section>
  );
}
