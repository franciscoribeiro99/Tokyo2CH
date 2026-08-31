<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Project conventions

Read `README.md` and `CONTRIBUTING.md` before changing anything.

## Non-negotiables

- `pnpm verify` (typecheck → lint → test → build) must pass before any commit.
- Never weaken `tsconfig.json`, `biome.json`, or the coverage thresholds to make
  a check pass. Fix the code.
- Brand copy lives only in `src/config/site.ts`. Never hardcode the company
  name, email, or URL in a component.
- Page metadata is always built with `buildMetadata()` from `src/lib/seo.ts`.
  Hand-rolled `Metadata` objects cause canonical tags to drift.
- Server Actions re-validate every input with the shared Zod schema. Client-side
  validation is a UX convenience, never a trust boundary.

## Adding a page

1. `src/app/<route>/page.tsx` exporting `metadata: Metadata = buildMetadata(...)`
2. Add the route to `ROUTES` in `src/app/sitemap.ts`
3. Add it to `siteConfig.mainNav` / `footerNav` if it should be linked
4. Add it to the `ROUTES` list in `e2e/accessibility.spec.ts`

## Testing

- Unit tests query by role and accessible name, never by test id.
- Coverage is scoped to `src/components/{layout,sections}` and `src/lib` —
  `src/components/ui/**` is vendored shadcn source and `src/app/**` is covered
  by the Playwright suite.
