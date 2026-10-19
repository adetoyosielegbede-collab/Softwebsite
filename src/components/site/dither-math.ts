/** Bayer dither helpers used by the hero conduit and the pixel wash. */

const fract = (n: number) => n - Math.floor(n);

function bayer2(x: number, y: number) {
  x = Math.floor(x);
  y = Math.floor(y);
  return fract(x / 2 + y * y * 0.75);
}

export function bayer8(x: number, y: number) {
  const o = 0.5 * x;
  const s = 0.5 * y;
  return 0.25 * (0.25 * bayer2(0.5 * o, 0.5 * s) + bayer2(o, s)) + bayer2(x, y);
}

function hash(x: number, y: number) {
  return fract(43758.5453 * Math.sin(Math.fround(127.1 * x + 311.7 * y)));
}

function noise(x: number, y: number) {
  const i = Math.floor(x);
  const j = Math.floor(y);
  const fx = x - i;
  const fy = y - j;
  const ux = fx * fx * (3 - 2 * fx);
  const uy = fy * fy * (3 - 2 * fy);
  const a = hash(i, j);
  const b = hash(i + 1, j);
  const c = hash(i, j + 1);
  const d = hash(i + 1, j + 1);
  return a + (b - a) * ux + (c - a) * uy + (a - b - c + d) * ux * uy;
}

export const CELL = 6;
export const FRONT = 0.5;
export const CYAN = "#00ffff";
export const BLUE = "#004bff";

export function field(x: number, y: number, fromBottom: number, seed = 0) {
  return 0.75 * fromBottom + 0.35 * noise(0.06 * x + seed, 0.06 * y + seed);
}

/** How much of a cell is "on" for a wash progress in 0..1. */
export function coverage(progress: number, fieldValue: number) {
  return Math.max(0, Math.min(1, (1.45 * progress - fieldValue) / 0.35));
}

export function clamp01(n: number) {
  return Math.max(0, Math.min(1, n));
}

export function range(value: number, [start, end]: [number, number]) {
  return clamp01((value - start) / (end - start));
}

export function smoothstep(t: number) {
  return t * t * (3 - 2 * t);
}
