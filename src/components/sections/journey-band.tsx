"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Container } from "@/components/layout/container";

interface JourneyBandProps {
  readonly eyebrow: string;
  readonly title: string;
  readonly description: string;
  readonly video: {
    readonly src: string;
    readonly poster: string;
    readonly width: number;
    readonly height: number;
  };
}

/**
 * Full-bleed video band.
 *
 * `preload="none"` keeps roughly two megabytes off the initial page load —
 * this sits well below the fold, so the browser fetches it only when it is
 * close to playing. With reduced motion the video is never mounted at all and
 * the poster frame stands in, which is why this is a client component.
 */
export function JourneyBand({ eyebrow, title, description, video }: JourneyBandProps) {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  return (
    <section className="relative isolate flex min-h-[26rem] items-center overflow-hidden sm:min-h-[34rem]">
      {reducedMotion ? (
        <Image
          src={video.poster}
          alt=""
          fill
          sizes="100vw"
          className="absolute inset-0 -z-10 object-cover"
        />
      ) : (
        // Decorative, silent background footage: no speech or meaningful audio to caption.
        <video
          className="absolute inset-0 -z-10 h-full w-full object-cover"
          src={video.src}
          poster={video.poster}
          width={video.width}
          height={video.height}
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          aria-hidden="true"
          tabIndex={-1}
        />
      )}

      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-r from-neutral-950/90 via-neutral-950/65 to-neutral-950/30"
      />

      <Container>
        <div className="flex max-w-xl flex-col gap-4 py-20">
          <span className="flex items-center gap-3 font-medium font-mono text-white/70 text-xs uppercase tracking-[0.2em]">
            <span aria-hidden="true" className="h-px w-8 bg-primary" />
            {eyebrow}
          </span>
          <h2 className="text-balance font-bold font-display text-3xl text-white tracking-tight sm:text-4xl">
            {title}
          </h2>
          <p className="text-pretty text-lg text-white/75 leading-relaxed">{description}</p>
        </div>
      </Container>
    </section>
  );
}
