"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { media } from "@/config/media";

/**
 * Client-side wrapper and guard for the WebGL hero.
 *
 * `ssr: false` is only legal inside a Client Component in Next 16, which is
 * the main reason this file exists separately from the scene: it keeps three.js
 * out of the server bundle without forcing the hero itself to be a client
 * component.
 *
 * The poster underneath is not a loading state — it is the permanent floor.
 * It renders for anyone without WebGL and stays behind the canvas otherwise,
 * so the hero is never blank and never depends on the 3D succeeding.
 */

const PassageScene = dynamic(() => import("@/components/three/passage-scene"), {
  ssr: false,
});

function supportsWebGl(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      window.WebGLRenderingContext && (canvas.getContext("webgl2") ?? canvas.getContext("webgl")),
    );
  } catch {
    // Some privacy modes throw rather than returning null.
    return false;
  }
}

export function PassageCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [active, setActive] = useState(true);

  // Capability check runs after mount so the server and client markup agree.
  useEffect(() => {
    setEnabled(supportsWebGl());
  }, []);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  // Park the render loop when the hero is offscreen or the tab is in the background.
  useEffect(() => {
    if (!enabled) return;

    const element = containerRef.current;
    if (!element) return;

    /**
     * Derived from the live rect rather than from `entry.isIntersecting`.
     *
     * IntersectionObserver only reports *changes*, so one misread while the
     * element was still being laid out would park the loop permanently: the
     * hero does not leave the viewport afterwards, so no second event ever
     * arrives to correct it. Recomputing from the rect makes every callback
     * self-correcting, and lets the same function seed the initial value.
     */
    const isOnscreen = () => {
      const rect = element.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return false;
      return rect.bottom > -120 && rect.top < window.innerHeight + 120;
    };

    const update = () => setActive(isOnscreen() && !document.hidden);

    update();

    const observer = new IntersectionObserver(update, { rootMargin: "120px" });
    observer.observe(element);

    document.addEventListener("visibilitychange", update);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", update);
    };
  }, [enabled]);

  return (
    <div ref={containerRef} aria-hidden="true" className="absolute inset-0 overflow-hidden">
      <Image
        src={media.heroPoster.src}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-neutral-950/45" />
      {enabled ? <PassageScene active={active} reducedMotion={reducedMotion} /> : null}
    </div>
  );
}
