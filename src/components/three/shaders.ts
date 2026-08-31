/**
 * GLSL for "The Passage" — the scroll-driven hero scene.
 *
 * A single uniform, `uProgress` (0 → 1), drives every visual change: the sky
 * grades from a Japanese dawn to alpine daylight, the ridgeline morphs from
 * Fuji's single flared cone into a row of sharp Alpine peaks, the drifting
 * particles turn from blossom into snow, and a Japanese coupé drives the whole
 * width of the scene — left to right, so the motion reads as progress.
 *
 * The car replaces what used to be a sun on the same arc. It is drawn with
 * signed distance fields rather than a texture or a glTF model: it stays sharp
 * at any resolution, costs no download, and needs no licence — which matters
 * here, because free stock has no usable CC0 JDM models.
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

float sdRoundBox(vec2 p, vec2 b, float r) {
  vec2 d = abs(p) - b + r;
  return min(max(d.x, d.y), 0.0) + length(max(d, 0.0)) - r;
}

float sdCircle(vec2 p, float r) {
  return length(p) - r;
}

/** Blends two shapes into one continuous surface instead of a hard seam. */
float smoothUnion(float a, float b, float k) {
  float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
  return mix(b, a, h) - k * h * (1.0 - h);
}

/**
 * Profile of a Japanese coupé, facing right, one unit long, wheels on y = 0.
 *
 * The long bonnet and the cabin set back over the rear axle are what make the
 * silhouette read as a 90s JDM coupé rather than a generic car. The roofline
 * comes from blending the cabin into the body, not from drawing it — a hard
 * union here gives an obvious notch where the two boxes meet.
 */
float carProfile(vec2 p) {
  float body = sdRoundBox(p - vec2(0.0, 0.145), vec2(0.500, 0.088), 0.052);
  float cabin = sdRoundBox(p - vec2(-0.045, 0.250), vec2(0.235, 0.082), 0.075);
  float shell = smoothUnion(body, cabin, 0.085);

  float frontWheel = sdCircle(p - vec2(0.295, 0.078), 0.082);
  float rearWheel = sdCircle(p - vec2(-0.300, 0.078), 0.082);

  return min(shell, min(frontWheel, rearWheel));
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

  // --- light: a glow, with no disc. Only one thing gets to be the subject. --
  vec2 lightPos = vec2(mix(0.74, 0.58, p), mix(0.44, 0.74, p));
  float lightDist = distance(vec2(uv.x * aspect, uv.y), vec2(lightPos.x * aspect, lightPos.y));
  vec3 lightCol = mix(vec3(1.0, 0.52, 0.24), vec3(1.0, 0.98, 0.94), p);
  col += lightCol * exp(-lightDist * 5.0) * mix(0.46, 0.17, p);

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

  // --- the car -------------------------------------------------------------
  // It rides the far crest, which is the highest line in the scene. Two
  // earlier placements failed: behind the near ridge it was hidden for most of
  // the scroll, and on the near crest it tracked straight through the headline.
  // Up here it stays clear of the type and reads as a silhouette against the
  // sky for the whole journey.
  float carScale = 0.160;
  float carU = mix(-0.16, 1.16, p);
  float carX = carU * aspect;

  // Sample the same ridge the far crest is drawn from, so the wheels sit on it.
  float carY = ridgeHeight(carU, p, 1.0, horizon);

  // Tilt into the slope, measured from the crest either side of the car.
  float slopeL = ridgeHeight(carU - 0.012, p, 1.0, horizon);
  float slopeR = ridgeHeight(carU + 0.012, p, 1.0, horizon);
  // Damped and clamped on purpose: these peaks are far steeper than any road,
  // and taking the gradient literally stood the car on its nose near a summit.
  // A hint of lean reads as "climbing"; the true angle reads as broken.
  float angle = clamp(atan((slopeR - slopeL) / (0.024 * aspect)) * 0.32, -0.28, 0.28);

  vec2 rel = vec2(uv.x * aspect, uv.y) - vec2(carX, carY);
  float ca = cos(angle);
  float sa = sin(angle);
  vec2 carLocal = vec2(rel.x * ca + rel.y * sa, -rel.x * sa + rel.y * ca) / carScale;

  // Visible only where the ridge lifts it clear of the headline. At the edges
  // of the scene the crest drops into the type, so the car climbs out of the
  // haze as the mountain rises and dissolves back into it on the way down —
  // which also keeps it from ever competing with the copy for attention.
  float carFade = smoothstep(horizon + 0.055, horizon + 0.145, carY);

  float carDist = carProfile(carLocal);
  float carAa = 2.5 / (uResolution.y * carScale);
  float carMask = smoothstep(carAa, -carAa, carDist) * carFade;

  vec3 carCol = mix(vec3(0.04, 0.03, 0.05), vec3(0.13, 0.16, 0.23), p);
  // Rim light along the roof, taking its colour from whatever the sky is doing.
  float rim = smoothstep(0.26, 0.34, carLocal.y) * smoothstep(0.50, 0.42, abs(carLocal.x));
  carCol = mix(carCol, mix(vec3(1.0, 0.62, 0.34), vec3(0.86, 0.92, 1.0), p), rim * 0.60);
  col = mix(col, carCol, carMask);

  // Lamps: lit against the dawn, washed out by alpine daylight.
  float lamps = mix(1.0, 0.22, p) * carFade;
  float head = exp(-length((carLocal - vec2(0.470, 0.165)) * vec2(1.0, 1.6)) * 13.0);
  float tail = exp(-length((carLocal + vec2(0.478, -0.190)) * vec2(1.0, 1.6)) * 15.0);
  col += vec3(1.00, 0.93, 0.78) * head * 0.90 * lamps;
  col += vec3(1.00, 0.22, 0.12) * tail * 0.70 * lamps;

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
