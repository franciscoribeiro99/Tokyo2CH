/**
 * Manifest of everything in `public/media/`.
 *
 * Dimensions are recorded here so `next/image` always gets an exact intrinsic
 * size and never triggers layout shift. Sources and licences for every entry
 * are documented in docs/media-credits.md — if you swap a file, update both.
 */

export interface MediaImage {
  readonly src: string;
  readonly width: number;
  readonly height: number;
  /**
   * Describes the picture for someone who cannot see it. Never repeats the
   * heading it sits next to; decorative uses pass `alt=""` at the call site.
   */
  readonly alt: string;
}

const image = (src: string, width: number, height: number, alt: string): MediaImage => ({
  src,
  width,
  height,
  alt,
});

export const media = {
  heroPoster: image(
    "/media/hero-poster.jpg",
    1920,
    1080,
    "A Japanese performance coupé on an open road beneath a wide sky",
  ),

  vehicles: {
    performance: image(
      "/media/vehicle-performance.jpg",
      1200,
      900,
      "Two Japanese performance coupés parked front to front",
    ),
    sports: image(
      "/media/vehicle-sports.jpg",
      1200,
      900,
      "A yellow Japanese sports coupé accelerating along a highway",
    ),
    kei: image(
      "/media/vehicle-kei.jpg",
      1200,
      900,
      "Small Japanese cars parked along a narrow Tokyo side street",
    ),
    classic: image(
      "/media/vehicle-classic.jpg",
      1200,
      900,
      "A red vintage Japanese saloon parked on a city street",
    ),
    suv: image(
      "/media/vehicle-suv.jpg",
      1200,
      900,
      "A red Japanese four-wheel-drive parked on a mountain track",
    ),
    everyday: image(
      "/media/vehicle-everyday.jpg",
      1200,
      900,
      "A black Japanese hatchback on a wet road lined with trees",
    ),
  },

  journey: {
    source: image(
      "/media/journey-source.jpg",
      1600,
      1000,
      "A line of Japanese performance cars at golden hour",
    ),
    verify: image(
      "/media/journey-verify.jpg",
      1600,
      1000,
      "A technician inspecting an engine bay with the bonnet raised",
    ),
    ship: image(
      "/media/journey-ship.jpg",
      1600,
      1000,
      "Shipping containers and cranes at a freight port seen from above",
    ),
    arrive: image(
      "/media/journey-arrive.jpg",
      1600,
      1000,
      "A winding pass road climbing through Swiss mountains",
    ),
  },

  tokyoNight: image(
    "/media/tokyo-night.jpg",
    1200,
    1500,
    "Illuminated signs above a Tokyo street at night",
  ),

  contactLocation: image(
    "/media/contact-location.jpg",
    1400,
    1000,
    "A Swiss town on a lake below snow-covered peaks",
  ),

  /**
   * 9.2 s silent loop, cross-faded end-to-start so the loop point is invisible.
   * Rendered decoratively behind copy, so it carries no alt text — the poster
   * stands in before it loads and whenever motion is reduced.
   */
  journeyVideo: {
    src: "/media/journey-drive.mp4",
    poster: "/media/journey-drive-poster.jpg",
    width: 1600,
    height: 900,
  },
} as const;
