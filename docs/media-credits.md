# Media credits

Every file in `public/media/` is listed here with its source and licence.
Assets are **downloaded and served from this repository**, never hot-linked, so
the site does not depend on a third-party CDN staying up or unchanged.

Retrieved: **2026-08-31**

## Licences in use

| Licence | Terms | Attribution required |
|---|---|---|
| [Pexels Licence](https://www.pexels.com/license/) | Free for commercial and non-commercial use; modification permitted | No |

Nothing here is licensed under terms that restrict commercial use. Identifiable
people, trademarks and vehicle number plates remain subject to the usual
publicity/trademark rules independent of the licence — the selected frames
avoid recognisable faces.

## Images

All images: Pexels Licence — <https://www.pexels.com/license/>

| File | Source | Used on |
|---|---|---|
| `hero-poster.jpg` | https://www.pexels.com/photo/37054088/ | Hero fallback when WebGL is unavailable |
| `vehicle-performance.jpg` | https://www.pexels.com/photo/10664484/ | Vehicles — Performance |
| `vehicle-sports.jpg` | https://www.pexels.com/photo/36582586/ | Vehicles — Sports coupés |
| `vehicle-kei.jpg` | https://www.pexels.com/photo/32886338/ | Vehicles — Kei cars |
| `vehicle-classic.jpg` | https://www.pexels.com/photo/11439335/ | Vehicles — Classics |
| `vehicle-suv.jpg` | https://www.pexels.com/photo/20079552/ | Vehicles — SUVs and 4x4s |
| `vehicle-everyday.jpg` | https://www.pexels.com/photo/9846087/ | Vehicles — Everyday and vans |
| `journey-source.jpg` | https://www.pexels.com/photo/30145523/ | How It Works — step 1, sourcing |
| `journey-verify.jpg` | https://www.pexels.com/photo/8478259/ | How It Works — step 2, verification |
| `journey-ship.jpg` | https://www.pexels.com/photo/7519262/ | How It Works — shipping |
| `journey-arrive.jpg` | https://www.pexels.com/photo/2790919/ | How It Works — step 3, Swiss arrival |
| `contact-location.jpg` | https://www.pexels.com/photo/27910258/ | Contact — location panel |
| `tokyo-night.jpg` | https://www.pexels.com/photo/20257063/ | Home — sourcing band |

## Video

| File | Source | Licence | Notes |
|---|---|---|---|
| `journey-drive.mp4` | https://www.pexels.com/video/30098831/ | [Pexels Licence](https://www.pexels.com/license/) | Alpine pass drive. Re-encoded to 1600×900 H.264, audio removed, and cut to a 9.2 s **seamless loop** (the tail is cross-faded onto the head so the loop point is invisible). |
| `journey-drive-poster.jpg` | frame from the above | [Pexels Licence](https://www.pexels.com/license/) | `poster` attribute; shown before the video loads and when `prefers-reduced-motion` is set. |

## Replacing an asset

Keep the filename, drop the replacement in `public/media/`, and update the row
above. Sizes are baked into `src/config/media.ts` — update them there too if the
new file has a different aspect ratio, or `next/image` will report a mismatch.
