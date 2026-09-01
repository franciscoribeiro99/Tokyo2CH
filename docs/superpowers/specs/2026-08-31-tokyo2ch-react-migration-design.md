# Tokyo2CH — WordPress → React migration design

**Date:** 2026-08-31
**Status:** awaiting approval

## Goal

Replace the WordPress site at https://tokyo2ch.ch with the Next.js app in this
repo: same information architecture and same offer, but a far stronger visual
execution built on a scroll-driven WebGL hero, and imagery/video that is
verifiably free for commercial use.

## Decisions already taken

| Question | Decision |
|---|---|
| 3D approach | Abstract WebGL journey (R3F + GSAP ScrollTrigger). No 3D car model. |
| Scope | Mirror the live site's 6 routes + keep the template's 2 legal pages. |
| Contact data | Carry the live site's placeholders across, flagged `TODO` in one place. |
| Language | English only, copy held in typed config so i18n stays a content task. |

## Source material (extracted from the live site)

Six pages: Home, Vehicles, How It Works, Our Services, Contact, FAQ.
One image total (`IMG_1645.jpeg`), no video. Copy is short and decent; the
weakness is entirely presentational. `/vehicles` has no vehicle content at all.

Placeholder contact data on the live site, carried over verbatim:
`claudiosantos.hbk@gmail.com`, `(+1) 23456789`, `Example avenue 100, example country`.

## Brand

**Positioning.** A precise, personal concierge: one person's judgement applied
to Japan's auction market, and the paperwork to land the result in Switzerland.

**Voice.** Calm, concrete, unhyped. Swiss restraint meeting Japanese craft.
No "revolutionise", no exclamation marks, no stock-photo enthusiasm. Numbers and
specifics over adjectives.

**Palette — "rising sun to alpine snow".** A monochrome architecture with a
single accent, which is how premium automotive brands actually behave.

| Token | Light | Role |
|---|---|---|
| `--background` | `oklch(0.98 0.004 85)` warm paper | page ground |
| `--foreground` | `oklch(0.17 0.012 250)` cold ink | text |
| `--primary` | `oklch(0.55 0.20 27)` vermillion | the only accent: CTAs, rules, focus |
| `--secondary` | `oklch(0.80 0.045 220)` alpine ice | cool support, 3D sky end-state |

Dark mode inverts to a near-black cabin with the same vermillion.

**Typography.** Display: **Zen Kaku Gothic New** (SIL OFL) — a Japanese-designed
grotesque carrying both latin and kana, so small kana accents (東京 → スイス) are
typographically native rather than pasted in. Body/UI: **Geist** (already in the
template). Technical labels: **Geist Mono**.

## Architecture

Pattern 2 from `web3d-integration-patterns` (unified R3F component) crossed with
Pattern 1's layered separation: one `<Canvas>` behind DOM content, GSAP owning
scroll, React owning everything else.

```
src/components/three/            ← WebGL only, excluded from jsdom coverage
  passage-canvas.tsx             ← <Canvas>, dpr clamp, visibility gating
  passage-scene.tsx              ← ridgelines + sky + particles
  use-scroll-progress.ts         ← GSAP ScrollTrigger → one 0..1 uniform
  shaders/                       ← sky.glsl.ts, particles.glsl.ts
src/components/sections/         ← pure presentational, unit-tested, in coverage
src/config/site.ts               ← ALL brand copy + contact + nav (AGENTS.md rule)
src/config/content.ts            ← page copy as typed const objects
public/media/                    ← downloaded assets
docs/media-credits.md            ← per-asset source + licence + retrieval date
```

### The 3D hero — "The Passage" — REMOVED

> **Superseded.** The WebGL hero was removed at the client's request. The
> section below is kept as the record of what was built and why, not as a
> description of the current site. The hero is now a single full-bleed
> photograph — which was already this scene's fallback, so it is what every
> visitor without WebGL was seeing anyway. `three`, `@react-three/fiber`,
> `gsap` and `motion` are no longer dependencies.


A single scroll progress value `p ∈ [0,1]` drives everything, so there is exactly
one source of truth and no competing tweens (the skill's "animation conflicts"
pitfall).

- **Sky**: full-screen shader quad. Gradient lerps vermillion dawn → cold alpine
  blue as `p` rises.
- **Ridgelines**: two silhouette layers. The Fuji profile morphs into an Alpine
  profile by lerping vertex displacement on `p`.
- **The car**: a Japanese coupé, drawn with signed distance fields, drives the
  full width of the scene left to right along the far crest, leaning into the
  slope and running its lamps against the dawn. Chosen over a texture or a glTF
  model because it stays sharp at any resolution, costs no download, and needs
  no licence — free stock has no usable CC0 JDM models. It replaced a sun that
  occupied the same arc.
- **Particles**: ~2500 GPU points. Colour, size and drift direction lerp from
  blossom (warm, lateral drift) to snow (white, vertical fall).
- **Camera**: GSAP ScrollTrigger `scrub` dollies the camera; `onUpdate` writes
  `p` into the shared uniform. GSAP never touches React state.

Three placement rules the car needs, each fixing a real failure seen on screen:
its tilt is damped and clamped, because the shader's peaks are far steeper than
any road and the true gradient stood the car on its nose; it rides the *far*
crest, because on the near one it tracked straight through the headline; and it
fades with crest height, so it is only ever drawn where the mountain lifts it
clear of the type.

### Performance and accessibility budget

| Guard | Behaviour |
|---|---|
| `next/dynamic` + `ssr:false` | three.js never enters the server bundle |
| `dpr={[1, 1.75]}` | caps fragment cost on retina |
| IntersectionObserver + `visibilitychange` | rAF stops when offscreen or tab hidden |
| `prefers-reduced-motion` | one static frame, no rAF, no ScrollTrigger |
| No WebGL / failed context | static poster image, hero copy unchanged |
| Cleanup | `dispose()` geometries+materials, `ScrollTrigger.kill()` on unmount |

The hero's text and CTAs are real DOM at all times, so LCP and the accessibility
tree never depend on WebGL.

## Media sourcing

Two pipelines, both validated before writing this spec:

1. **Openverse API** (`api.openverse.org`, no key) filtered to `license=cc0,pdm`.
   Returns machine-readable licence metadata per asset — the strongest provenance.
2. **Pexels** via the Firecrawl key already in the environment, which resolves
   direct `videos.pexels.com` / `images.pexels.com` CDN URLs. The Pexels Licence
   permits commercial use with no attribution required.

Every asset is **downloaded into `public/media/`** — never hotlinked — and every
one gets a row in `docs/media-credits.md` recording source URL, licence,
licence URL and retrieval date. Nothing ships whose licence I could not read.

Needed: hero fallback poster, one looping hero video, six vehicle-category
images, three journey images, one contact/location image, OG image.

## Routes

| Route | Source | Note |
|---|---|---|
| `/` | live Home | 3D hero, three pillars, services teaser, journey, testimonials, FAQ teaser, CTA |
| `/vehicles` | live Vehicles | six category cards — the live page is empty, this is the largest content gain |
| `/how-it-works` | live How It Works | three-step journey, scroll-revealed |
| `/our-services` | live Our Services | six service cards, verbatim copy |
| `/contact` | live Contact | existing server action + zod schema, unchanged trust boundary |
| `/faq` | live FAQ | five Q&As, existing `Faq` accordion |
| `/legal/privacy`, `/legal/terms` | template | kept |

Template's `/about` and `/services` are removed. Per `AGENTS.md`, each route is
registered in `ROUTES` in `src/app/sitemap.ts` **and** in `e2e/accessibility.spec.ts`,
and every page's metadata is built with `buildMetadata()`.

## Testing

- **Unit (vitest, jsdom).** Every new `sections/` component gets a test querying
  by role and accessible name. WebGL lives under `components/three/`, which is
  outside the coverage `include` list — so the 80% threshold is met honestly
  rather than by weakening `vitest.config.mts`, which `AGENTS.md` forbids.
- **E2E (Playwright).** All eight routes added to the accessibility spec; the
  existing navigation, contact and SEO specs updated for the new nav.
- **Gate.** `pnpm verify` (typecheck → lint → test → build) must pass.

## Out of scope

Vehicle inventory/CMS, i18n routing, newsletter provider, real contact details,
and any change to `tsconfig.json` / `biome.json` / coverage thresholds.
