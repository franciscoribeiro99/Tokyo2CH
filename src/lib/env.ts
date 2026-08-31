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

const clientSchema = z.object({
  /**
   * Absolute canonical origin, no trailing slash.
   * Required in production so canonical URLs, sitemap, and OG tags are correct.
   */
  NEXT_PUBLIC_SITE_URL: z
    .url()
    .refine((value) => !value.endsWith("/"), {
      message: "NEXT_PUBLIC_SITE_URL must not end with a trailing slash",
    })
    .optional(),
});

const parsedServer = serverSchema.safeParse({
  NODE_ENV: process.env.NODE_ENV,
  VERCEL_ENV: process.env.VERCEL_ENV,
});

const parsedClient = clientSchema.safeParse({
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
});

if (!parsedServer.success) {
  throw new Error(`Invalid server environment variables:\n${z.prettifyError(parsedServer.error)}`);
}

if (!parsedClient.success) {
  throw new Error(`Invalid client environment variables:\n${z.prettifyError(parsedClient.error)}`);
}

export const env = {
  ...parsedServer.data,
  ...parsedClient.data,
} as const;

export const isProduction = env.VERCEL_ENV === "production";
