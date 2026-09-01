import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";

export const alt = `${siteConfig.name} — ${siteConfig.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Default social card, generated at build time.
 *
 * Copy this file into any route segment to give that page its own card —
 * Next.js resolves the nearest `opengraph-image` up the tree.
 *
 * The mark is rebuilt from primitives rather than imported from icon.svg:
 * Satori renders a small subset of SVG, and a disc plus two bars is both
 * exactly reproducible here and immune to that subset changing.
 */

/** Matches src/app/icon.svg — disc, then the cross at the measured ratios. */
function Mark({ size }: { readonly size: number }) {
  const arm = size * 0.595;
  const thickness = size * (46 / 247);
  const armOffset = (size - arm) / 2;
  const thicknessOffset = (size - thickness) / 2;

  return (
    <div
      style={{
        display: "flex",
        position: "relative",
        width: size,
        height: size,
        borderRadius: size / 2,
        background: "#D21D1A",
      }}
    >
      <div
        style={{
          display: "flex",
          position: "absolute",
          left: thicknessOffset,
          top: armOffset,
          width: thickness,
          height: arm,
          background: "#fff",
        }}
      />
      <div
        style={{
          display: "flex",
          position: "absolute",
          left: armOffset,
          top: thicknessOffset,
          width: arm,
          height: thickness,
          background: "#fff",
        }}
      />
    </div>
  );
}
export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 80,
        background: "#09090b",
        color: "#fafafa",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <Mark size={64} />
        <div style={{ display: "flex", fontSize: 34, fontWeight: 700, letterSpacing: -0.5 }}>
          {siteConfig.name}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div style={{ display: "flex", fontSize: 76, fontWeight: 600, letterSpacing: -2.5 }}>
          {siteConfig.tagline}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 30,
            color: "#a1a1aa",
            lineHeight: 1.4,
            maxWidth: 860,
          }}
        >
          {siteConfig.description}
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <div style={{ display: "flex", width: 56, height: 6, background: "#D21D1A" }} />
        <div style={{ display: "flex", fontSize: 24, color: "#71717a" }}>
          {siteConfig.url.replace(/^https?:\/\//, "")}
        </div>
      </div>
    </div>,
    size,
  );
}
