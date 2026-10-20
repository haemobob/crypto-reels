import type {CSSProperties} from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {ease} from '../theme/motion';
import {fonts} from '../theme/typography';

/** Counts from `from` to `to` between two frames (time the end frame to the narrated number). */
export const CountUp = ({
  from = 0,
  to,
  start,
  end,
  format = (n) => Math.round(n).toLocaleString('id-ID'),
  style,
}: {
  from?: number;
  to: number;
  start: number;
  end: number;
  format?: (n: number) => string;
  style?: CSSProperties;
}) => {
  const frame = useCurrentFrame();
  const v = interpolate(frame, [start, end], [from, to], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease.out});
  return <span style={{fontFamily: fonts.mono, fontWeight: 700, fontVariantNumeric: 'tabular-nums', ...style}}>{format(v)}</span>;
};
