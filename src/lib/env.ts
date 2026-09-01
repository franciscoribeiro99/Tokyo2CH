import { z } from "zod";

/**
 * Environment variables, validated once at module load.
 *
 * Fail fast and loudly: a missing or malformed variable should break the build,
 * not surface as a mystery 500 in production.
 *
 * NOTE: `process.env.NEXT_PUBLIC_*` must be referenced statically (not via a
 * dynamic key) so Next.js can inline the value into the client bundle.
 */

const serverSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  /** Set automatically by Vercel. Empty locally. */
  VERCEL_ENV: z.enum(["development", "preview", "production"]).optional(),
});

/**
 * Normalize a hand-entered origin before validating it.
 *
 * "Absolute, no trailing slash" is an invariant the rest of the app depends on
 * (canonical tags, sitemap entries, JSON-LD `@id`s). Enforcing it by rejecting
 * input meant a bare `example.com` or a stray trailing slash — the two things
 * people actually paste into Vercel's import dialog — failed the whole build.
 * Establishing the invariant here instead makes it true by construction, and
 * reserves hard failure for values that are genuinely unusable.
 *
 * An empty or whitespace-only value is treated as *unset* rather than invalid:
 * that is what an env var someone left blank in a dashboard actually means.
 */
function normalizeOrigin(raw: string | undefined): string | undefined {
  if (typeof raw !== "string") return undefined;

  const trimmed = raw.trim();
  if (trimmed === "") return undefined;

  // Add the scheme people omit when pasting a domain, but never rewrite one
  // that is already present — that is what makes the protocol check below real.
  const hasScheme = /^[a-z][a-z\d+.-]*:/i.test(trimmed);
  const withScheme = hasScheme ? trimmed : `https://${trimmed}`;

  return withScheme.replace(/\/+$/, "");
}

/**
 * This origin is interpolated into `<link rel="canonical">`, OG tags, and the
 * JSON-LD graph, so the protocol allowlist is a security boundary rather than
 * a style preference: `z.url()` alone accepts `javascript:` and `data:` URLs.
 */
function isServeableOrigin(value: string): boolean {
  try {
    const url = new URL(value);
    return (url.protocol === "https:" || url.protocol === "http:") && url.hostname !== "";
  } catch {
    return false;
  }
}

const clientSchema = z.object({
  /**
   * Absolute canonical origin, no trailing slash.
   * Required in production so canonical URLs, sitemap, and OG tags are correct.
   */
  NEXT_PUBLIC_SITE_URL: z
    .url()
    .refine(isServeableOrigin, {
      message: "must be an http(s) URL with a hostname, e.g. https://example.com",
    })
    .optional(),
});

const parsedServer = serverSchema.safeParse({
  NODE_ENV: process.env.NODE_ENV,
  VERCEL_ENV: process.env.VERCEL_ENV,
});

const parsedClient = clientSchema.safeParse({
  NEXT_PUBLIC_SITE_URL: normalizeOrigin(process.env.NEXT_PUBLIC_SITE_URL),
});

if (!parsedServer.success) {
  throw new Error(`Invalid server environment variables:\n${z.prettifyError(parsedServer.error)}`);
}

if (!parsedClient.success) {
  throw new Error(
    `Invalid client environment variables:\n${z.prettifyError(parsedClient.error)}\n\n` +
      "Fix the value in Vercel → Project Settings → Environment Variables " +
      "(or in .env.local locally), then redeploy. Leaving it unset is valid: " +
      "the site URL then falls back to the Vercel deployment URL, then to " +
      "siteConfig.url in src/config/site.ts.",
  );
}

export const env = {
  ...parsedServer.data,
  ...parsedClient.data,
} as const;

export const isProduction = env.VERCEL_ENV === "production";
