# Contributing

## Setup

```bash
pnpm install          # also installs the git hooks via `prepare`
cp .env.example .env.local
pnpm dev
```

Node 20.11+ is required; `.nvmrc` pins the version CI uses. Run `nvm use` if you have nvm.

## The loop

1. Branch from `main`: `git switch -c feat/short-description`
2. Write a test that fails for the reason you are about to fix.
3. Make it pass.
4. `pnpm verify` — typecheck, lint, unit tests, build. This is what CI runs.
5. Commit. The hooks will format staged files and check your commit message.
6. Open a PR and fill in the template.

## Commit messages

[Conventional Commits](https://www.conventionalcommits.org/), enforced by commitlint:

```
<type>(<optional scope>): <subject>
```

Types: `feat`, `fix`, `refactor`, `docs`, `test`, `chore`, `perf`, `ci`, `build`, `style`, `revert`.

The subject is lowercase, imperative, and under 72 characters. Explain *why* in the body if it is not obvious from the diff.

## Tests

- **Unit** (`src/**/*.test.tsx`) — pure logic and component behaviour. Query by role, not by test id: if you cannot find an element by its accessible name, neither can a screen reader.
- **E2E** (`e2e/*.spec.ts`) — user-visible flows, real navigation, real HTTP. This is where accessibility and SEO invariants live.

Coverage must stay at or above 80% on statements, branches, functions, and lines. If a change drops it, add the test rather than lowering the threshold.

## Code style

Biome owns formatting and lint. Do not hand-format; run `pnpm lint:fix`.

`biome.json`, `tsconfig.json`, and the workflow files are quality gates. If one of them is blocking you, the fix is almost always in your code. If it genuinely is not, change the config in its own PR with the reasoning in the description — not bundled into a feature.

## Accessibility

Every PR that touches UI must keep these true:

- Exactly one `h1` per page, heading levels never skipped
- Every interactive element reachable and operable by keyboard, with a visible focus ring
- Form inputs have a `<label>`; errors are linked with `aria-describedby`
- Colour is never the only carrier of meaning
- Decorative elements are `aria-hidden`

## Adding a page

1. Create `src/app/<route>/page.tsx`
2. Export `metadata` built with `buildMetadata({ title, path, description })` — never hand-roll a `Metadata` object, or the canonical tag will drift
3. Add the route to `ROUTES` in `src/app/sitemap.ts`
4. Add it to `siteConfig.mainNav` or `footerNav` if it should be linked
5. Add it to the `ROUTES` list in `e2e/accessibility.spec.ts`

## Dependencies

Prefer the platform over a package. Before adding a dependency, say in the PR description what it does that we cannot do in ~30 lines, and what its install size and maintenance status are.
