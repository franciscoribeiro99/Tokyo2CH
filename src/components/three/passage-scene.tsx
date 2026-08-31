"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { type RefObject, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import {
  particleFragmentShader,
  particleVertexShader,
  skyFragmentShader,
  skyVertexShader,
} from "@/components/three/shaders";

/**
 * "The Passage".
 *
 * Scroll progress lives in a plain ref, never in React state. GSAP writes it on
 * every scroll tick and the render loop reads it, so the scene animates at
 * 60fps without triggering a single React re-render — the state-synchronisation
 * trap that multi-library 3D setups usually fall into. There is exactly one
 * progress value, so no two animations can fight over the same property.
 *
 * ── Uniforms are written through the material ref, deliberately ─────────────
 * The object passed to `<shaderMaterial uniforms={…} />` is NOT the object the
 * material ends up using — three copies it during construction. Mutating the
 * memoised object therefore updates nothing, and the scene renders forever at
 * its initial values while every JavaScript-side reading looks perfectly
 * correct, which makes it a genuinely nasty bug to spot. Always go through
 * `material.current.uniforms`.
 */

const PARTICLE_COUNT = 2200;

/**
 * Write one numeric uniform on a material.
 *
 * `ShaderMaterial.uniforms` is an index signature, so every lookup is possibly
 * undefined under `noUncheckedIndexedAccess`. Funnelling writes through here
 * keeps that check honest without sprinkling non-null assertions across the
 * render loop, which is the one place a wrong assumption is hardest to notice.
 */
function setUniform(material: THREE.ShaderMaterial | null, name: string, value: number): void {
  const uniform = material?.uniforms[name];
  if (uniform) uniform.value = value;
}

type ProgressRef = RefObject<number>;

interface SceneProps {
  readonly progress: ProgressRef;
}

/** Fullscreen shader backdrop: sky, sun, and the morphing ridgelines. */
function Backdrop({ progress }: SceneProps) {
  const material = useRef<THREE.ShaderMaterial>(null);
  const { size, viewport } = useThree();

  const uniforms = useMemo(
    () => ({
      uProgress: { value: 0 },
      uResolution: { value: new THREE.Vector2(1, 1) },
    }),
    [],
  );

  useEffect(() => {
    const resolution = material.current?.uniforms.uResolution?.value ?? uniforms.uResolution.value;
    resolution.set(size.width * viewport.dpr, size.height * viewport.dpr);
  }, [size.width, size.height, viewport.dpr, uniforms]);

  useFrame(() => {
    setUniform(material.current, "uProgress", progress.current);
  });

  return (
    <mesh frustumCulled={false} renderOrder={-1}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={material}
        uniforms={uniforms}
        vertexShader={skyVertexShader}
        fragmentShader={skyFragmentShader}
        depthTest={false}
        depthWrite={false}
      />
    </mesh>
  );
}

/** Blossom that becomes snow. All motion is computed in the vertex shader. */
function Particles({ progress }: SceneProps) {
  const material = useRef<THREE.ShaderMaterial>(null);
  const { viewport } = useThree();

  const geometry = useMemo(() => {
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const seeds = new Float32Array(PARTICLE_COUNT);

    for (let i = 0; i < PARTICLE_COUNT; i += 1) {
      positions[i * 3] = (Math.random() - 0.5) * 18;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 14;
      positions[i * 3 + 2] = Math.random() * -7 + 1.5;
      seeds[i] = Math.random();
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));
    return geo;
  }, []);

  // Geometry is created outside React's lifecycle, so it must be released by hand.
  useEffect(() => () => geometry.dispose(), [geometry]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uProgress: { value: 0 },
      uSize: { value: 6.5 },
      uPixelRatio: { value: 1 },
    }),
    [],
  );

  useEffect(() => {
    setUniform(material.current, "uPixelRatio", viewport.dpr);
  }, [viewport.dpr]);

  useFrame((_, delta) => {
    const elapsed = material.current?.uniforms.uTime?.value ?? 0;
    // Clamped so a backgrounded tab resuming does not jump the animation.
    setUniform(material.current, "uTime", elapsed + Math.min(delta, 0.05));
    setUniform(material.current, "uProgress", progress.current);
  });

  return (
    <points geometry={geometry}>
      <shaderMaterial
        ref={material}
        uniforms={uniforms}
        vertexShader={particleVertexShader}
        fragmentShader={particleFragmentShader}
        transparent
        depthWrite={false}
        blending={THREE.NormalBlending}
      />
    </points>
  );
}

interface ScrollDriverProps extends SceneProps {
  readonly reducedMotion: boolean;
}

/** The only place scroll is read. Owns its ScrollTrigger and kills it on unmount. */
function ScrollDriver({ progress, reducedMotion }: ScrollDriverProps) {
  const { camera, invalidate } = useThree();

  useEffect(() => {
    if (reducedMotion) {
      // A single representative frame: dawn already giving way to daylight.
      progress.current = 0.35;
      invalidate();
      return;
    }

    const trigger = document.querySelector("[data-passage-trigger]");
    if (!trigger) return;

    gsap.registerPlugin(ScrollTrigger);

    const context = gsap.context(() => {
      const state = { value: 0 };

      gsap.to(state, {
        value: 1,
        ease: "none",
        scrollTrigger: {
          trigger,
          start: "top top",
          // Ends while the sticky panel still fills the screen, so the alpine
          // end-state is actually seen rather than scrolled past.
          end: "bottom bottom",
          scrub: 0.6,
        },
        onUpdate: () => {
          progress.current = state.value;
          // Camera eases forward and lifts as the pass opens out.
          camera.position.z = 5 - state.value * 1.6;
          camera.position.y = state.value * 0.55;
          camera.lookAt(0, 0, 0);
        },
      });
    });

    return () => context.revert();
  }, [camera, invalidate, progress, reducedMotion]);

  return null;
}

interface PassageSceneProps {
  /** `false` parks the render loop when the hero is offscreen or the tab is hidden. */
  readonly active: boolean;
  readonly reducedMotion: boolean;
}

export default function PassageScene({ active, reducedMotion }: PassageSceneProps) {
  const progress = useRef(0);

  return (
    <Canvas
      // "demand" renders exactly one frame for reduced motion; "never" parks
      // the loop entirely once the hero has scrolled away.
      frameloop={reducedMotion ? "demand" : active ? "always" : "never"}
      // Retina costs four times the fragments for a soft gradient nobody can
      // see the difference in — cap it.
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 5], fov: 55, near: 0.1, far: 100 }}
      gl={{
        antialias: false,
        alpha: false,
        powerPreference: "high-performance",
        // R3F defaults to ACES tone mapping, which crushed this palette by
        // several stops. The scene is hand-graded, so both of these are off:
        // what the shader writes is what the screen shows.
        toneMapping: THREE.NoToneMapping,
        outputColorSpace: THREE.LinearSRGBColorSpace,
      }}
      style={{ position: "absolute", inset: 0 }}
    >
      <Backdrop progress={progress} />
      <Particles progress={progress} />
      <ScrollDriver progress={progress} reducedMotion={reducedMotion} />
    </Canvas>
  );
}
