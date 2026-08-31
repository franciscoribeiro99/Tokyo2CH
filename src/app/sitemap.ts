import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/seo";

/**
 * Static route manifest.
 *
 * When you add dynamic content (blog, case studies), map over your data source
 * here and append the entries — do not maintain a second hand-written list.
 */
const ROUTES = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/vehicles", changeFrequency: "weekly", priority: 0.9 },
  { path: "/our-services", changeFrequency: "monthly", priority: 0.9 },
  { path: "/how-it-works", changeFrequency: "monthly", priority: 0.8 },
  { path: "/faq", changeFrequency: "monthly", priority: 0.7 },
  { path: "/contact", changeFrequency: "yearly", priority: 0.7 },
  { path: "/legal/privacy", changeFrequency: "yearly", priority: 0.2 },
  { path: "/legal/terms", changeFrequency: "yearly", priority: 0.2 },
] as const satisfies readonly {
  path: string;
  changeFrequency: NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>;
  priority: number;
}[];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getSiteUrl();
  const lastModified = new Date();

  return ROUTES.map((route) => ({
    url: route.path === "/" ? baseUrl : `${baseUrl}${route.path}`,
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
