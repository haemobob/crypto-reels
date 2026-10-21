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

/** CSS/SVG transform that centres (x, y) of a stage of size w×h at zoom s. */
export const cameraTransform = (c: {x: number; y: number; s: number}, w: number, h: number) =>
  `translate(${w / 2} ${h / 2}) scale(${c.s}) translate(${-c.x} ${-c.y})`;
