import { NextResponse } from "next/server";

/**
 * Liveness probe for uptime monitors and deployment gates.
 *
 * `force-dynamic` matters: without it this would be statically rendered at
 * build time and every check would return the same frozen timestamp.
 */
export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json(
    {
      status: "ok",
      timestamp: new Date().toISOString(),
      commit: process.env.VERCEL_GIT_COMMIT_SHA ?? "local",
      environment: process.env.VERCEL_ENV ?? "development",
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
