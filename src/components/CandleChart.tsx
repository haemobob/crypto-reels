import type {ReactNode} from 'react';
import {colors} from '../theme/colors';
import {fonts} from '../theme/typography';

export type Candle = {t: number; o: number; h: number; l: number; c: number};

export type ChartFrame = {
  /** Plot rectangle in SVG units. */
  x0: number;
  y0: number;
  width: number;
  height: number;
  /** Time slots shown (inclusive) and the log price range. */
  tMin: number;
  tMax: number;
  pMin: number;
  pMax: number;
};

/** Maps time slots and prices (log scale) into the plot rectangle. */
export const scaleFor = (f: ChartFrame) => {
  const slots = f.tMax - f.tMin + 1;
  const slot = f.width / slots;
  const lmin = Math.log(f.pMin);
  const lspan = Math.log(f.pMax) - lmin;
  return {
    slot,
    x: (t: number) => f.x0 + (t - f.tMin + 0.5) * slot,
    y: (p: number) => f.y0 + f.height * (1 - (Math.log(p) - lmin) / lspan),
  };
};

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

/**
 * Weekly candles that appear one by one as `reveal` (in time slots) passes each candle's t.
 * Up weeks are solid brand blue, down weeks hollow: blue carries the structure, red stays free for meaning.
 */
export const Candles = ({candles, frame, reveal, opacity = 1, emphasis}: {
  candles: Candle[];
  frame: ChartFrame;
  reveal: number;
  opacity?: number;
  /** Candles inside [from, to] stay full strength; the rest dim to `dim`. */
  emphasis?: {from: number; to: number; dim: number};
}) => {
  const s = scaleFor(frame);
  const body = Math.max(4, s.slot * 0.58);
  return (
    <g opacity={opacity}>
      {candles.map((k) => {
        const g = clamp01(reveal - k.t);
        if (g <= 0) return null;
        const up = k.c >= k.o;
        const x = s.x(k.t);
        // Each candle grows out of its open price.
        const yo = s.y(k.o);
        const lerp = (p: number) => yo + (s.y(p) - yo) * g;
        const top = lerp(Math.max(k.o, k.c));
        const bottom = lerp(Math.min(k.o, k.c));
        const em = emphasis && (k.t < emphasis.from || k.t > emphasis.to) ? emphasis.dim : 1;
        const stroke = up ? colors.electric : '#7C8DA8';
        return (
          <g key={k.t} opacity={em}>
            <line x1={x} x2={x} y1={lerp(k.h)} y2={lerp(k.l)} stroke={stroke} strokeWidth={2} />
            <rect
              x={x - body / 2}
              y={top}
              width={body}
              height={Math.max(2, bottom - top)}
              fill={up ? colors.electric : colors.black}
              stroke={stroke}
              strokeWidth={2}
              rx={1.5}
            />
          </g>
        );
      })}
    </g>
  );
};

/** Close-price line that draws itself from left to right (progress 0..1). */
export const TracePath = ({candles, frame, progress, color = colors.light, width = 4, glow = 0}: {
  candles: Candle[];
  frame: ChartFrame;
  progress: number;
  color?: string;
  width?: number;
  glow?: number;
}) => {
  if (progress <= 0) return null;
  const s = scaleFor(frame);
  const pts = candles.map((k) => [s.x(k.t), s.y(k.c)] as const);
  const lens = pts.slice(1).map((p, i) => Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]));
  const total = lens.reduce((a, b) => a + b, 0);
  const d = `M${pts.map((p) => p.join(',')).join(' L')}`;
  return (
    <g>
      {glow > 0 && <path d={d} fill="none" stroke={color} strokeWidth={width * 4} strokeOpacity={0.18 * glow} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={total} strokeDashoffset={total * (1 - progress)} />}
      <path d={d} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={total} strokeDashoffset={total * (1 - progress)} />
    </g>
  );
};

/** Horizontal price level that draws across the plot (progress 0..1), with an optional label above its left end. */
export const LevelLine = ({frame, price, progress, color = colors.blue, dashed = false, label, labelBelow}: {
  frame: ChartFrame;
  price: number;
  progress: number;
  color?: string;
  dashed?: boolean;
  label?: ReactNode;
  labelBelow?: ReactNode;
}) => {
  if (progress <= 0) return null;
  const s = scaleFor(frame);
  const y = s.y(price);
  const x1 = frame.x0;
  const x2 = frame.x0 + frame.width * progress;
  return (
    <g>
      <line x1={x1} x2={x2} y1={y} y2={y} stroke={color} strokeWidth={3} strokeDasharray={dashed ? '10 8' : undefined} />
      {label && (
        <text x={x1 + 4} y={y - 14} fill={color} fontFamily={fonts.mono} fontWeight={700} fontSize={22} opacity={Math.min(1, progress * 2)}>
          {label}
        </text>
      )}
      {labelBelow && (
        <text x={x1 + 4} y={y + 32} fill={color} fontFamily={fonts.mono} fontWeight={600} fontSize={20} opacity={Math.min(1, progress * 2)}>
          {labelBelow}
        </text>
      )}
    </g>
  );
};

/** Dotted hypothetical path through (t, price) points, drawn with `progress`. Always label it SKENARIO on screen. */
export const ScenarioPath = ({frame, points, progress, color}: {
  frame: ChartFrame;
  points: Array<[number, number]>;
  progress: number;
  color: string;
}) => {
  if (progress <= 0) return null;
  const s = scaleFor(frame);
  const pts = points.map(([t, p]) => [s.x(t), s.y(p)] as const);
  const total = pts.slice(1).reduce((a, p, i) => a + Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]), 0);
  const visible = total * progress;
  // Dots along the path up to the visible length.
  const dots: Array<readonly [number, number]> = [];
  let walked = 0;
  for (let i = 1; i < pts.length; i++) {
    const [ax, ay] = pts[i - 1];
    const [bx, by] = pts[i];
    const len = Math.hypot(bx - ax, by - ay);
    for (let d = 0; d < len; d += 13) {
      if (walked + d > visible) break;
      dots.push([ax + ((bx - ax) * d) / len, ay + ((by - ay) * d) / len]);
    }
    walked += len;
  }
  return (
    <g>
      {dots.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={3.2} fill={color} />
      ))}
    </g>
  );
};
