import type { Metadata } from "next";
import { Section, SectionHeader } from "@/components/layout/section";
import { Cta } from "@/components/sections/cta";
import { PageHero } from "@/components/sections/page-hero";
import { type VehicleCard, VehicleGrid } from "@/components/sections/vehicle-grid";
import { vehicles } from "@/config/content";
import { media } from "@/config/media";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Vehicles",
  path: "/vehicles",
  description: vehicles.hero.description,
});

/**
 * Copy and imagery are kept in separate config modules — one is edited by
 * whoever writes the words, the other by whoever swaps the pictures. They are
 * paired here, positionally, in the order the categories are declared.
 */
const CATEGORY_IMAGES = [
  media.vehicles.performance,
  media.vehicles.sports,
  media.vehicles.kei,
  media.vehicles.classic,
  media.vehicles.suv,
  media.vehicles.everyday,
] as const;

const CATEGORIES: readonly VehicleCard[] = vehicles.categories.map((category, index) => ({
  ...category,
  image: CATEGORY_IMAGES[index] ?? CATEGORY_IMAGES[0],
}));

export default function VehiclesPage() {
  return (
    <>
      <PageHero
        eyebrow={vehicles.hero.eyebrow}
        title={vehicles.hero.title}
        description={vehicles.hero.description}
      />

      <Section>
        <SectionHeader
          eyebrow={vehicles.intro.eyebrow}
          title={vehicles.intro.title}
          description={vehicles.intro.description}
          className="mb-14"
        />
        <VehicleGrid items={CATEGORIES} />
      </Section>

      <Cta
        title="Not seeing what you want?"
        description="These are categories, not stock. Tell us the specific car you are after and we will tell you honestly whether it is findable, and roughly what it lands at."
        action={{ label: "Describe your car", href: "/contact" }}
      />
    </>
  );
}
