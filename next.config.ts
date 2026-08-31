import type { NextConfig } from "next";

/**
 * Security headers applied to every response.
 *
 * These are deliberately framework-level (not Vercel-level) so they behave
 * identically in `next dev`, `next start`, Docker, and Vercel.
 */
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
] as const;

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // Never ship a build that only passes because errors were suppressed.
  typescript: { ignoreBuildErrors: false },

  // Strip the `x-powered-by: Next.js` fingerprint.
  poweredByHeader: false,

  images: {
    formats: ["image/avif", "image/webp"],
    // Add your CDN / DAM hostnames here instead of using `domains` (deprecated).
    remotePatterns: [],
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [...securityHeaders],
      },
    ];
  },
};

export default nextConfig;
