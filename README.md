# Company Website Template

A production-ready starting point for a company marketing site: Next.js App Router, TypeScript in strict mode, Tailwind v4, shadcn/ui, and a CI pipeline that actually blocks bad merges.

Built to be cloned and shipped, not demoed. Every quality gate is wired up and passing on the first commit.

---

## Quick start

```bash
# Use this repo as a template on GitHub, then:
git clone git@github.com:your-org/your-site.git
cd your-site

pnpm install
cp .env.example .env.local
pnpm dev
```

Open <http://localhost:3000>.

### Make it yours

1. **`src/config/site.ts`** — name, tagline, description, nav, contact details, socials. For a basic site this is the only file you need to touch.
2. **`src/app/globals.css`** — the `--primary` and `--ring` tokens set your brand colour. They are defined once for light and once for dark.
3. **`src/app/legal/*`** — replace the placeholder privacy policy and terms. They are scaffolding, not legal advice.
4. **`.github/CODEOWNERS`** — point it at your team.
5. Swap the page copy in `src/app/*/page.tsx`.

---

## Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js 16 (App Router, Turbopack) | Server Components, file-based metadata, first-class on Vercel |
| Language | TypeScript 5.9, `strict` + `noUncheckedIndexedAccess` | Catches the index and null bugs that `strict` alone misses |
| Styling | Tailwind CSS v4 | CSS-first config, no JS config file to drift |
| Components | shadcn/ui on Radix | Source in your repo — own it, don't version-pin it |
| Theming | next-themes | Light/dark/system with no flash of wrong theme |
| Validation | Zod 4 | One schema shared by the client form and the server action |
| Lint + format | Biome 2 | One tool, one config, far faster than ESLint + Prettier |
| Unit tests | Vitest 4 + Testing Library | Same transform pipeline as the app |
| E2E | Playwright | Chromium, Firefox, WebKit, and a mobile viewport |
| Hooks | husky + lint-staged + commitlint | Conventional commits enforced at commit time |
| Analytics | Vercel Analytics + Speed Insights | Real-user Core Web Vitals |

---

## Commands

| Command | What it does |
|---|---|
| `pnpm dev` | Dev server with Turbopack |
| `pnpm build` | Production build |
| `pnpm start` | Serve the production build |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm lint` | Biome check (lint + format, no writes) |
| `pnpm lint:fix` | Biome check with autofix |
| `pnpm test` | Unit tests |
| `pnpm test:coverage` | Unit tests with an 80% threshold on all four metrics |
| `pnpm test:e2e` | Playwright against a local dev server |
| `pnpm test:e2e:ui` | Playwright in watch/debug mode |
| `pnpm verify` | typecheck → lint → test → build. Run before you push. |

---

## What is already handled

**SEO.** Per-page metadata through one `buildMetadata()` helper so canonical tags cannot drift. Generated `sitemap.xml` and `robots.txt`. Organization + WebSite JSON-LD, emitted once. Build-time OG image generation. Preview deployments return `Disallow: /` so they never compete with production in the index.

**Accessibility.** Skip link as the first tab stop. One `h1` per page, enforced by an E2E test. `aria-current` on the active nav item. Form errors wired to inputs via `aria-describedby` and announced in a live region. Visible focus rings on every interactive element. A global `prefers-reduced-motion` reset.

**Security.** `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, and HSTS on every response, set in `next.config.ts` so they behave identically in dev, Docker, and on Vercel. `x-powered-by` stripped. JSON-LD escaped against script-tag breakout. Contact input re-validated server-side regardless of what the client did. CodeQL scan on public repos.

**Contact form.** A Server Action with `useActionState`, a Zod schema shared with the client, a honeypot field, per-field error reporting, and pending state on the submit button. Delivery is deliberately **not** implemented — see below.

**CI.** Typecheck, lint, unit tests with coverage, production build, and E2E across three engines. Dependabot grouped by ecosystem so you get one reviewable PR per week, not twelve.

---

## Wiring up the contact form

The template does not hardcode an email provider. Provision one from the [Vercel Marketplace](https://vercel.com/marketplace) (Resend, Postmark, SendGrid), then implement `deliver()` in `src/app/actions/contact.ts`.

Until you do, behaviour is controlled by `CONTACT_DELIVERY_MODE`:

- `log` — validate and log, send nothing. The default in development and E2E.
- `provider` — call `deliver()`. The default in production, which **throws** until you implement it.

That default is intentional. A contact form that silently swallows leads is worse than one that errors loudly on your first deploy.

---

## Deploying to Vercel

```bash
pnpm dlx vercel link
pnpm dlx vercel env add NEXT_PUBLIC_SITE_URL production
pnpm dlx vercel --prod
```

Vercel auto-detects Next.js — there is no `vercel.json` to maintain. Set `NEXT_PUBLIC_SITE_URL` to your canonical origin (absolute, no trailing slash) in Production. Preview and Development can leave it unset; the app falls back to the Vercel-provided URL, then to `siteConfig.url`.

---

## Project layout

```
src/
├── app/
│   ├── actions/          Server Actions
│   ├── api/health/       Liveness probe for uptime monitors
│   ├── legal/            Privacy and terms (placeholders — replace)
│   ├── layout.tsx        Root layout: fonts, theme, chrome, JSON-LD
│   ├── error.tsx         Route error boundary
│   ├── global-error.tsx  Root layout error boundary
│   ├── sitemap.ts        Generated sitemap.xml
│   ├── robots.ts         Generated robots.txt
│   └── opengraph-image.tsx
├── components/
│   ├── layout/           Header, footer, nav, container, section
│   ├── sections/         Composable page blocks (hero, features, faq, cta)
│   └── ui/               shadcn/ui — yours to edit
├── config/site.ts        Single source of truth for brand content
└── lib/
    ├── env.ts            Zod-validated environment variables
    ├── seo.ts            Metadata and structured-data helpers
    └── contact-schema.ts Shared client/server validation
e2e/                      Playwright specs
```

---

## Conventions

Commits follow [Conventional Commits](https://www.conventionalcommits.org/) — commitlint rejects anything else.

```
feat(contact): add company field
fix(nav): keep focus inside the mobile sheet
chore(deps): bump next to 16.2.13
```

Git hooks: `pre-commit` runs Biome on staged files, `commit-msg` runs commitlint, `pre-push` runs typecheck and unit tests.

New components go in `src/components/sections/` if they are page blocks and `src/components/ui/` if they are primitives. Keep `src/config/site.ts` as the only place brand copy lives — if you find yourself hardcoding the company name in a component, it belongs in config.

---

## Adding a blog or CMS

Not included, deliberately — the right answer depends on who writes the content. The clean seams:

- **MDX in-repo** — add `@next/mdx`, put posts under `src/app/blog/`, extend `src/app/sitemap.ts` to map over them.
- **Headless CMS** — provision Sanity, Contentful, or Payload from the Vercel Marketplace and fetch in a Server Component.

Either way, extend `ROUTES` in `sitemap.ts` rather than maintaining a second list.

---

## License

MIT — see [LICENSE](./LICENSE).
