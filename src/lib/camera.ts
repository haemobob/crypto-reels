import {interpolate} from 'remotion';
import {ease} from '../theme/motion';

/** A camera key: at frame f, look at (x, y) in stage units with zoom s. */
export type CamKey = {f: number; x: number; y: number; s: number};

/** Eased interpolation between camera keys; equal consecutive keys make a hold. */
export const cameraAt = (frame: number, keys: CamKey[]) => {
  if (frame <= keys[0].f) return keys[0];
  for (let i = 1; i < keys.length; i++) {
    const a = keys[i - 1];
    const b = keys[i];
    if (frame <= b.f) {
      const t = interpolate(frame, [a.f, b.f], [0, 1], {easing: ease.inOut});
      return {f: frame, x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t, s: a.s + (b.s - a.s) * t};
    }
  }
  return keys[keys.length - 1];
};

/**
 * A camera that never parks: a smooth curve through the keys with continuous velocity (cubic Hermite with
 * finite-difference tangents), so it keeps travelling through each key instead of easing to a stop there; before the
 * first key and after the last it keeps drifting at the end velocity (put the first key before frame 0 for a camera
 * already moving on frame 0). Use cameraAt when a hold is wanted.
 */
export const cameraSpline = (frame: number, keys: CamKey[]): CamKey => {
  const n = keys.length;
  if (n === 1) return {...keys[0], f: frame};
  const tan = (i: number) => {
    const a = keys[Math.max(0, i - 1)];
    const b = keys[Math.min(n - 1, i + 1)];
    const dt = b.f - a.f || 1;
    return {x: (b.x - a.x) / dt, y: (b.y - a.y) / dt, s: (b.s - a.s) / dt};
  };
  if (frame <= keys[0].f || frame >= keys[n - 1].f) {
    const i = frame <= keys[0].f ? 0 : n - 1;
    const k = keys[i];
    const m = tan(i);
    const d = frame - k.f;
    return {f: frame, x: k.x + m.x * d, y: k.y + m.y * d, s: k.s + m.s * d};
  }
  let i = 0;
  while (frame > keys[i + 1].f) i++;
  const a = keys[i];
  const b = keys[i + 1];
  const dt = b.f - a.f;
  const u = (frame - a.f) / dt;
  const h00 = 2 * u ** 3 - 3 * u ** 2 + 1;
  const h10 = u ** 3 - 2 * u ** 2 + u;
  const h01 = -2 * u ** 3 + 3 * u ** 2;
  const h11 = u ** 3 - u ** 2;
  const ma = tan(i);
  const mb = tan(i + 1);
  const mix = (p: 'x' | 'y' | 's') => h00 * a[p] + h10 * dt * ma[p] + h01 * b[p] + h11 * dt * mb[p];
  return {f: frame, x: mix('x'), y: mix('y'), s: mix('s')};
};

/** CSS transform (with transform-origin 0 0) that centres stage point (x, y) of a w×h frame at zoom s. */
export const cameraCss = (c: {x: number; y: number; s: number}, w = 1080, h = 1920) => `translate(${w / 2 - c.x * c.s}px, ${h / 2 - c.y * c.s}px) scale(${c.s})`;

/** CSS/SVG transform that centres (x, y) of a stage of size w×h at zoom s. */
export const cameraTransform = (c: {x: number; y: number; s: number}, w: number, h: number) =>
  `translate(${w / 2} ${h / 2}) scale(${c.s}) translate(${-c.x} ${-c.y})`;
