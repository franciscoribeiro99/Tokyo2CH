import type { Metadata } from "next";
import { Section, SectionHeader } from "@/components/layout/section";
import { Cta } from "@/components/sections/cta";
import { PageHero } from "@/components/sections/page-hero";
import { type VehicleCard, VehicleGrid } from "@/components/sections/vehicle-grid";
import { localePath } from "@/config/i18n";
import { media } from "@/config/media";
import { getDictionary, getLocale } from "@/content/dictionaries";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getDictionary();
  return buildMetadata({
    title: t.nav.vehicles,
    path: "/vehicles",
    description: t.vehicles.hero.description,
  });
}

/**
 * Copy and imagery live in separate modules — one is edited by whoever writes
 * the words in four languages, the other by whoever swaps the pictures. They
 * are paired here, positionally, in the order the categories are declared.
 */
const CATEGORY_IMAGES = [
  media.vehicles.performance,
  media.vehicles.sports,
  media.vehicles.kei,
  media.vehicles.classic,
  media.vehicles.suv,
  media.vehicles.everyday,
] as const;

export default async function VehiclesPage() {
  const locale = await getLocale();
  const t = await getDictionary();

  const categories: readonly VehicleCard[] = t.vehicles.categories.map((category, index) => ({
    ...category,
    image: CATEGORY_IMAGES[index] ?? CATEGORY_IMAGES[0],
  }));

  return (
    <>
      <PageHero
        eyebrow={t.vehicles.hero.eyebrow}
        title={t.vehicles.hero.title}
        description={t.vehicles.hero.description}
      />

      <Section>
        <SectionHeader
          eyebrow={t.vehicles.intro.eyebrow}
          title={t.vehicles.intro.title}
          description={t.vehicles.intro.description}
          className="mb-14"
        />
        <VehicleGrid items={categories} />
      </Section>

      <Cta
        title={t.vehicles.cta.title}
        description={t.vehicles.cta.description}
        action={{ label: t.actions.describeYourCar, href: localePath(locale, "/contact") }}
      />
    </>
  );
}
