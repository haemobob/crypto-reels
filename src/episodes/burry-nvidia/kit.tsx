import type {CSSProperties, ReactNode} from 'react';
import {interpolate} from 'remotion';
import {colors} from '../../theme/colors';
import {ease} from '../../theme/motion';
import {fonts} from '../../theme/typography';

export const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
/** 0→1 from a to b (eased). */
export const ramp = (f: number, a: number, b: number, e = ease.inOut) => (b <= a ? (f >= a ? 1 : 0) : interpolate(f, [a, b], [0, 1], {...clamp, easing: e}));
/** 0→1 between `from` and `to` (enter `inF` frames, leave `outF`). */
export const life = (f: number, from: number, to: number, inF = 10, outF = 7) =>
  interpolate(f, [from, from + inF], [0, 1], {...clamp, easing: ease.out}) * interpolate(f, [to - outF, to], [1, 0], clamp);

/** Indonesian number format: 27.7 → "27,7". */
export const idn = (n: number, d = 1) => n.toFixed(d).replace('.', ',');

export const GREEN = colors.positive;
export const RED = colors.negative;
export const BLUE = colors.electric;

/** A small mono tag (in-world label). */
export const Tag = ({children, color = '#FFFFFF', bg = 'rgba(0,0,0,0.88)', border, size = 22, style}: {children: ReactNode; color?: string; bg?: string; border?: string; size?: number; style?: CSSProperties}) => (
  <div style={{display: 'inline-block', padding: `${size * 0.32}px ${size * 0.6}px`, borderRadius: size * 0.4, background: bg, border: `2px solid ${border ?? color}`, fontFamily: fonts.mono, fontWeight: 700, fontSize: size, letterSpacing: '0.04em', color, whiteSpace: 'nowrap', ...style}}>{children}</div>
);

/** Path through screen points, with the last point interpolated for a fractional draw. */
export const pathOf = (pts: Array<[number, number]>) => pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`).join('');

/** First `upTo` (fractional) points of a series. */
export const partial = <P extends [number, number]>(pts: P[], upTo: number): Array<[number, number]> => {
  if (upTo <= 0) return pts.slice(0, 1);
  const k = Math.min(pts.length - 1, Math.floor(upTo));
  const out: Array<[number, number]> = pts.slice(0, k + 1);
  const u = upTo - k;
  if (u > 0 && k + 1 < pts.length) {
    const [ax, ay] = pts[k];
    const [bx, by] = pts[k + 1];
    out.push([ax + (bx - ax) * u, ay + (by - ay) * u]);
  }
  return out;
};
