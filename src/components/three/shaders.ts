/**
 * GLSL for "The Passage" — the scroll-driven hero scene.
 *
 * A single uniform, `uProgress` (0 → 1), drives every visual change: the sky
 * grades from a Japanese dawn to alpine daylight, the ridgeline morphs from
 * Fuji's single flared cone into a row of sharp Alpine peaks, and the drifting
 * particles turn from blossom into snow.
 *
 * Colour management note: the canvas disables tone mapping and uses a linear
 * output space, so the values written here are exactly what is displayed. No
 * gamma round-trip — with ACES tone mapping left on, R3F's default, the whole
 * scene came out several stops too dark.
 */

/** Fullscreen quad. Bypasses the camera entirely — this is the backdrop. */
export const skyVertexShader = /* glsl */ `
varying vec2 vUv;

void main() {
  vUv = uv;
  // Clip-space passthrough: always fills the viewport, ignores camera motion.
  gl_Position = vec4(position.xy, 1.0, 1.0);
}
`;

export const skyFragmentShader = /* glsl */ `
precision highp float;

uniform float uProgress;
uniform vec2 uResolution;

varying vec2 vUv;

float hash(float n) {
  return fract(sin(n) * 43758.5453123);
}

float noise1(float x) {
  float i = floor(x);
  float f = fract(x);
  f = f * f * (3.0 - 2.0 * f);
  return mix(hash(i), hash(i + 1.0), f);
}

/** Fuji: one wide, gently flared cone with a flattened summit. */
float fujiProfile(float x) {
  float d = abs(x - 0.5);
  float h = 0.36 * exp(-pow(d * 3.2, 1.7));
  return min(h, 0.272);
}

/** Alps: several sharp peaks of differing height, plus fine ridge detail. */
float alpsProfile(float x) {
  float h = 0.0;
  h = max(h, 0.30 * exp(-pow(abs(x - 0.28) * 7.0, 1.5)));
  h = max(h, 0.38 * exp(-pow(abs(x - 0.52) * 8.5, 1.4)));
  h = max(h, 0.26 * exp(-pow(abs(x - 0.74) * 7.5, 1.6)));
  h = max(h, 0.21 * exp(-pow(abs(x - 0.10) * 9.0, 1.6)));
  h += 0.018 * noise1(x * 22.0);
  return h;
}

float ridgeHeight(float x, float p, float scale, float lift) {
  return lift + scale * mix(fujiProfile(x), alpsProfile(x), p);
}

void main() {
  vec2 uv = vUv;
  float p = uProgress;
  float aspect = uResolution.x / max(uResolution.y, 1.0);

  // --- sky -----------------------------------------------------------------
  vec3 top = mix(vec3(0.09, 0.10, 0.17), vec3(0.24, 0.38, 0.55), p);
  vec3 mid = mix(vec3(0.62, 0.20, 0.16), vec3(0.62, 0.74, 0.84), p);
  vec3 low = mix(vec3(0.94, 0.44, 0.21), vec3(0.90, 0.94, 0.97), p);

  vec3 col = mix(low, mid, smoothstep(0.0, 0.55, uv.y));
  col = mix(col, top, smoothstep(0.45, 1.0, uv.y));

  // --- sun: a low red disc at dawn, a high pale one over the Alps ----------
  vec2 sunPos = vec2(mix(0.76, 0.60, p), mix(0.46, 0.78, p));
  float sunDist = distance(vec2(uv.x * aspect, uv.y), vec2(sunPos.x * aspect, sunPos.y));
  float disc = smoothstep(0.058, 0.046, sunDist);
  float glow = exp(-sunDist * 6.0);
  vec3 sunCol = mix(vec3(1.0, 0.52, 0.24), vec3(1.0, 0.98, 0.94), p);
  col += sunCol * (disc * 0.85 + glow * mix(0.60, 0.22, p));

  // --- ridgelines ----------------------------------------------------------
  float horizon = 0.30;
  float aa = 2.0 / max(uResolution.y, 1.0);

  float far = ridgeHeight(uv.x, p, 1.0, horizon);
  float near = ridgeHeight(uv.x * 1.35 + 0.12, p, 0.70, horizon - 0.11);

  float farMask = 1.0 - smoothstep(far - aa, far + aa, uv.y);
  float nearMask = 1.0 - smoothstep(near - aa, near + aa, uv.y);

  vec3 farCol = mix(vec3(0.26, 0.13, 0.20), vec3(0.46, 0.56, 0.66), p);
  vec3 nearCol = mix(vec3(0.11, 0.07, 0.12), vec3(0.17, 0.21, 0.29), p);

  // Snow settles on the high ground, and only once we are over the Alps.
  float belowCrest = smoothstep(0.0, 0.055, far - uv.y);
  float cap = (1.0 - belowCrest) * smoothstep(horizon + 0.13, horizon + 0.30, far) * p;
  farCol = mix(farCol, vec3(0.93, 0.95, 0.98), clamp(cap, 0.0, 1.0) * 0.85);

  col = mix(col, farCol, farMask);
  col = mix(col, nearCol, nearMask);

  // --- atmosphere ----------------------------------------------------------
  vec3 haze = mix(vec3(0.88, 0.52, 0.32), vec3(0.88, 0.93, 0.97), p);
  col = mix(col, haze, exp(-abs(uv.y - horizon) * 14.0) * 0.22);

  float vignette = smoothstep(1.30, 0.30, length((uv - 0.5) * vec2(1.0, 1.15)));
  col *= mix(0.86, 1.0, vignette);

  // Break up banding in the large flat gradients.
  col += (hash(uv.x * 1234.5 + uv.y * 6789.1) - 0.5) * 0.015;

  gl_FragColor = vec4(max(col, 0.0), 1.0);
}
`;

/**
 * Particles. Motion is computed entirely on the GPU from a per-point seed, so
 * the CPU only ever writes `uTime` — there is no per-frame attribute upload.
 */
export const particleVertexShader = /* glsl */ `
precision highp float;

uniform float uTime;
uniform float uProgress;
uniform float uSize;
uniform float uPixelRatio;

attribute float aSeed;

varying float vSeed;

void main() {
  float s = aSeed;
  vec3 pos = position;

  // Blossom drifts sideways and hangs; snow falls faster and straighter.
  float fall = mix(0.30, 1.05, uProgress);
  float sway = mix(0.55, 0.14, uProgress);

  pos.y = mod(pos.y - uTime * fall * (0.6 + s * 0.8) + 7.0, 14.0) - 7.0;
  pos.x += sin(uTime * (0.25 + s * 0.5) + s * 31.0) * sway;
  pos.z += cos(uTime * (0.18 + s * 0.4) + s * 17.0) * sway * 0.5;

  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  gl_PointSize = uSize * (0.45 + s) * uPixelRatio * (8.0 / max(-mvPosition.z, 0.1));

  vSeed = s;
}
`;

export const particleFragmentShader = /* glsl */ `
precision highp float;

uniform float uProgress;

varying float vSeed;

void main() {
  float d = length(gl_PointCoord - 0.5);
  if (d > 0.5) discard;

  float alpha = smoothstep(0.5, 0.08, d) * (0.32 + vSeed * 0.45);

  vec3 blossom = vec3(1.0, 0.70, 0.70);
  vec3 snow = vec3(0.97, 0.98, 1.0);
  vec3 col = mix(blossom, snow, uProgress);

  gl_FragColor = vec4(col, alpha);
}
`;
