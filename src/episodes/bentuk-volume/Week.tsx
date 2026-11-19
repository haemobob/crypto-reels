import type {ReactNode} from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import raw from '../../../public/episodes/bentuk-volume/week.json';
import {colors} from '../../theme/colors';
import {ease} from '../../theme/motion';
import {fonts} from '../../theme/typography';

/**
 * Five real days of BTC/USDT (Binance 5-minute candles, 12–16 Nov 2026 UTC), each with its own volume profile on the
 * right edge of the day (volume spread evenly over each candle's high–low, 30 bins per day). The frame moves to the
 * day the narration is about: 15 Nov (the bounce) → 12 → 13–14 → 15–16 → 16 and "today" → all five days. Views are
 * re-scaled in data space, so type and strokes keep their size. Keyed to narration cues and words.
 */
export type Beats = Record<
  | 'hook' | 'but' | 'pshape' | 'oi' | 'key' | 'fat' | 'thinW' | 'bshape' | 'turunLagi' | 'thin' | 'enam' | 'jebol' | 'guard' | 'dshape' | 'test' | 'w633' | 'held' | 'pay' | 'tapi' | 'end' | 'w62',
  number
>;

type Day = {d: string; o: number; h: number; l: number; c: number; step: number; bins: number[]; poc: number};
const data = raw as unknown as {bars: Array<[number, number, number]>; days: Day[]; thin15: [number, number]; oi15: Array<[number, number]>};
const BARS = data.bars;
const DAYS = data.days;
const PER = 288;
const GOLD = '#FFD166';

// Chart frame on screen.
const X0 = 90;
const W = 900;
const TOP = 780;
const H = 500;

type ViewDef = {i0: number; i1: number; p0: number; p1: number};
const V: Record<string, ViewDef> = {
  d15: {i0: 856, i1: 1162, p0: 61500, p1: 66700},
  d12: {i0: -8, i1: 300, p0: 70700, p1: 74700},
  d1213: {i0: -8, i1: 586, p0: 67300, p1: 74800},
  d14: {i0: 568, i1: 900, p0: 61600, p1: 68900},
  d1516: {i0: 856, i1: 1448, p0: 61600, p1: 66600},
  d1617: {i0: 1140, i1: 1736, p0: 62900, p1: 66200},
  all: {i0: -10, i1: 2028, p0: 61200, p1: 75200},
};
type View = {X: (i: number) => number; Y: (p: number) => number; i0: number; i1: number};
const mix = (a: ViewDef, b: ViewDef, t: number): View => {
  const i0 = a.i0 + (b.i0 - a.i0) * t;
  const i1 = a.i1 + (b.i1 - a.i1) * t;
  const l0 = Math.log(a.p0) + (Math.log(b.p0) - Math.log(a.p0)) * t;
  const l1 = Math.log(a.p1) + (Math.log(b.p1) - Math.log(a.p1)) * t;
  return {X: (i) => X0 + ((i - i0) / (i1 - i0)) * W, Y: (p) => TOP + H * (1 - (Math.log(p) - l0) / (l1 - l0)), i0, i1};
};

const clampOpts = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const ramp = (f: number, a: number, b: number, e = ease.inOut) => interpolate(f, [a, b], [0, 1], {...clampOpts, easing: e});
const appear = (f: number, at: number, len = 10) => ramp(f, at, at + len, ease.out);
const vanish = (f: number, at: number, len = 10) => 1 - ramp(f, at, at + len, ease.out);
const between = (f: number, a: number, b: number) => appear(f, a) * vanish(f, b);

const T = ({x, y, children, size = 20, color = colors.text, anchor = 'middle', weight = 700, opacity = 1, font = fonts.mono, halo = false}: {x: number; y: number; children: ReactNode; size?: number; color?: string; anchor?: 'start' | 'middle' | 'end'; weight?: number; opacity?: number; font?: string; halo?: boolean}) =>
  opacity <= 0.01 ? null : (
    <text x={x} y={y} fontFamily={font} fontWeight={weight} fontSize={size} fill={color} textAnchor={anchor} dominantBaseline="middle" opacity={opacity} letterSpacing="0.02em" {...(halo ? {stroke: colors.bg, strokeWidth: 6, paintOrder: 'stroke'} : {})}>
      {children}
    </text>
  );
const Pill = ({x, y, text, bg = colors.blue, color = '#FFFFFF', size = 20, anchor = 'middle', opacity = 1}: {x: number; y: number; text: string; bg?: string; color?: string; size?: number; anchor?: 'start' | 'middle' | 'end'; opacity?: number}) => {
  if (opacity <= 0.01) return null;
  const w = text.length * size * 0.62 + 22;
  const h = size + 16;
  const left = anchor === 'middle' ? x - w / 2 : anchor === 'end' ? x - w : x;
  return (
    <g opacity={opacity}>
      <rect x={left} y={y - h / 2} width={w} height={h} rx={8} fill={bg} />
      <T x={left + w / 2} y={y + 1} size={size} color={color}>{text}</T>
    </g>
  );
};
const Ring = ({x, y, o, color = GOLD}: {x: number; y: number; o: number; color?: string}) =>
  o <= 0.01 ? null : <circle cx={x} cy={y} r={17 * (0.7 + 0.3 * o)} fill="none" stroke={color} strokeWidth={3.5} opacity={o} />;

const path = (v: View, a: number, b: number, pick = 2) => {
  let s = '';
  const lo = Math.max(0, Math.floor(Math.max(a, v.i0 - 2)));
  const hi = Math.min(BARS.length - 1, Math.floor(Math.min(b, v.i1 + 2)));
  for (let i = lo; i <= hi; i++) s += `${s ? 'L' : 'M'}${v.X(i).toFixed(1)},${v.Y(BARS[i][pick]).toFixed(1)}`;
  return s;
};

/** One day's profile on the right edge of its day, bars growing leftwards from the POC outwards; POC bar gold. */
const Profile = ({v, di, grow, o, frac = 0.42}: {v: View; di: number; grow: number; o: number; frac?: number}) => {
  if (o <= 0.01) return null;
  const day = DAYS[di];
  const xr = v.X((di + 1) * PER - 0.5);
  const dayW = v.X((di + 1) * PER) - v.X(di * PER);
  const vmax = Math.max(...day.bins);
  const pocJ = day.bins.indexOf(vmax);
  return (
    <g opacity={o}>
      {day.bins.map((vol, j) => {
        const g = Math.max(0, Math.min(1, grow * 1.7 - (Math.abs(j - pocJ) / day.bins.length) * 1.5));
        const y1 = v.Y(day.l + (j + 1) * day.step);
        const y2 = v.Y(day.l + j * day.step);
        const w = (vol / vmax) * dayW * frac * g;
        return <rect key={j} x={xr - w} y={y1 + 0.5} width={w} height={Math.max(1, y2 - y1 - 1)} fill={j === pocJ ? GOLD : colors.light} opacity={j === pocJ ? 0.95 : 0.42} />;
      })}
    </g>
  );
};

/** Band across one or more days at a price range, with a label at its left. */
const Band = ({v, a, b, from, to, o, label, color = GOLD, labelSide = 'left'}: {v: View; a: number; b: number; from: number; to: number; o: number; label?: string; color?: string; labelSide?: 'left' | 'right'}) => {
  if (o <= 0.01) return null;
  const x1 = Math.max(X0, v.X(from));
  const x2 = Math.min(X0 + W, v.X(to));
  const y1 = v.Y(b);
  const y2 = v.Y(a);
  return (
    <g opacity={o}>
      <rect x={x1} y={y1} width={x2 - x1} height={y2 - y1} fill={color} opacity={0.16} />
      <line x1={x1} x2={x2} y1={y1} y2={y1} stroke={color} strokeWidth={1.5} strokeDasharray="6 6" opacity={0.7} />
      <line x1={x1} x2={x2} y1={y2} y2={y2} stroke={color} strokeWidth={1.5} strokeDasharray="6 6" opacity={0.7} />
      {label && <Pill x={labelSide === 'left' ? x1 + 10 : x2 - 10} y={(y1 + y2) / 2} text={label} bg={color} color={colors.bg} size={18} anchor={labelSide === 'left' ? 'start' : 'end'} />}
    </g>
  );
};

const LABELS = ['12 NOV', '13 NOV', '14 NOV', '15 NOV', '16 NOV', '17 NOV', '18 NOV'];

export const Week = ({b}: {b: Beats}) => {
  const f = useCurrentFrame();
  // The frame moves to the day being described (each move ~1.2 s, ease in-out).
  const keys: Array<[number, ViewDef]> = [
    [0, V.d15], [b.bshape, V.d12], [b.turunLagi, V.d1213], [b.thin, V.d14], [b.guard, V.d1516], [b.dshape, V.d1617], [b.pay, V.all],
  ];
  let k = 0;
  while (k + 1 < keys.length && f >= keys[k + 1][0]) k++;
  const prev = k > 0 ? keys[k - 1][1] : keys[0][1];
  const view = k === 0 ? mix(V.d15, V.d15, 0) : mix(prev, keys[k][1], ramp(f, keys[k][0] - 4, keys[k][0] + 32));
  const {X, Y} = view;

  // Line: days 12–14 are already there (off-frame at first); 15 Nov draws during the hook; 16 Nov draws at "Kemarin".
  const d15draw = interpolate(f, [b.hook, b.hook + 54], [864, 1151], {...clampOpts, easing: ease.inOut});
  const d16draw = interpolate(f, [b.guard + 50, b.guard + 90], [1151, 1439], {...clampOpts, easing: ease.inOut});
  const d17draw = interpolate(f, [b.test, b.test + 54], [1439, 1727], {...clampOpts, easing: ease.inOut});
  const drawn = f < b.guard + 50 ? d15draw : f < b.test ? d16draw : d17draw;

  // Price grid: $1K steps when zoomed in, $2K when the whole week is in frame.
  const span = view.i1 - view.i0;
  const step = span > 700 ? 2000 : 1000;
  const ticks: number[] = [];
  for (let p = 62000; p <= 75000; p += 1000) if (p % step === 0) ticks.push(p);

  const iLow15 = 864 + 21; // 01:45 UTC, $62,006
  const iLow14 = 576 + 274; // 22:50 UTC, $63,320
  const iLow17 = 1440 + 190; // 15:50 UTC, $63,336
  const iLow18 = 1728 + 275; // 22:55 UTC, $62,063
  const [t15a, t15b] = data.thin15;
  const day15 = DAYS[3];
  const day17 = DAYS[5];
  const oiOn = between(f, b.oi, b.bshape - 6);
  const settled = (at: number) => appear(f, at + 30, 12); // after a move lands

  return (
    <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{position: 'absolute', inset: 0}}>
      <defs>
        <clipPath id="bv-chart">
          <rect x={X0} y={TOP - 40} width={W} height={H + 60} />
        </clipPath>
      </defs>

      <g clipPath="url(#bv-chart)">
        {/* Grid and day separators. */}
        {ticks.map((p) => (
          <line key={p} x1={X0} x2={X0 + W} y1={Y(p)} y2={Y(p)} stroke="#132442" strokeWidth={1.5} />
        ))}
        {[1, 2, 3, 4, 5].map((d) => (
          <line key={d} x1={X(d * PER)} x2={X(d * PER)} y1={TOP - 40} y2={TOP + H + 20} stroke="#1E3157" strokeWidth={2} strokeDasharray="5 7" />
        ))}

        {/* Profiles: each appears when its shape is named. 15 Nov builds during "bentuk volumenya". */}
        <Profile v={view} di={3} grow={ramp(f, b.but + 4, b.but + 50)} o={appear(f, b.but)} />
        <Profile v={view} di={0} grow={ramp(f, b.bshape + 20, b.bshape + 60)} o={appear(f, b.bshape + 16)} />
        <Profile v={view} di={1} grow={ramp(f, b.pay, b.pay + 30)} o={appear(f, b.pay) * 0.8} />
        <Profile v={view} di={2} grow={ramp(f, b.thin + 20, b.thin + 60)} o={appear(f, b.thin + 16)} />
        <Profile v={view} di={4} grow={ramp(f, b.dshape + 26, b.dshape + 66)} o={appear(f, b.dshape + 22)} />
        <Profile v={view} di={5} grow={ramp(f, b.pay, b.pay + 30)} o={appear(f, b.pay) * 0.8} />

        {/* Key: fat = agreed, thin = passed through (15 Nov). */}
        <Band v={view} a={64413} b={65650} from={864} to={1152} o={between(f, b.fat, b.bshape - 4)} label="GEMUK: DISEPAKATI" />
        <Band v={view} a={t15a} b={t15b} from={864} to={1152} o={between(f, b.thinW, b.bshape - 4)} label="TIPIS: DILEWATI" color={colors.light} />
        {/* Guard: the P's thin area, carried into 16 Nov. */}
        <Band v={view} a={t15a} b={t15b} from={864} to={f >= b.pay ? 2016 : 1728} o={appear(f, b.guard + 20)} label="AREA TIPIS ≈ $63,5 RB" />

        {/* 13 Nov: "besoknya turun lagi". */}
        {f >= b.turunLagi + 8 && <path d={path(view, 288, 288 + 287 * ramp(f, b.turunLagi + 8, b.turunLagi + 40))} stroke={colors.negative} strokeWidth={5} fill="none" strokeLinejoin="round" opacity={vanish(f, b.thin + 20, 16)} />}

        {/* Each 5-minute candle's high–low, faint, then the closing line. */}
        <g opacity={0.28}>
          {BARS.map((r, i) =>
            i > drawn || i < view.i0 - 2 || i > view.i1 + 2 ? null : <line key={i} x1={X(i)} x2={X(i)} y1={Y(r[0])} y2={Y(r[1])} stroke={colors.electric} strokeWidth={1.2} />,
          )}
        </g>
        <path d={path(view, 0, drawn)} stroke={colors.electric} strokeWidth={2.6} fill="none" strokeLinejoin="round" />
        {f >= b.pay && <path d={path(view, 1727, 1727 + 288 * ramp(f, b.pay + 4, b.pay + 34))} stroke={colors.negative} strokeWidth={3.5} fill="none" strokeLinejoin="round" />}

        {/* 14 Nov's low, broken the next day. */}
        <line x1={X(iLow14)} x2={X(iLow14) + (X(iLow15 + 12) - X(iLow14)) * ramp(f, b.jebol - 6, b.jebol + 14)} y1={Y(63320)} y2={Y(63320)} stroke={colors.negative} strokeWidth={2.5} strokeDasharray="7 6" opacity={between(f, b.enam + 20, b.guard)} />
      </g>

      {/* Grid labels and day names (screen-space, haloed). */}
      {ticks.map((p) => {
        const y = Y(p);
        const o = interpolate(y, [TOP - 10, TOP + 16, TOP + H - 16, TOP + H], [0, 1, 1, 0], clampOpts);
        return <T key={p} x={X0 + 4} y={y - 13} size={18} color="#6A80A6" anchor="start" weight={600} opacity={o} halo>{`$${p / 1000} RB`}</T>;
      })}
      {LABELS.map((l, d) => {
        const x = (Math.max(X0, X(d * PER)) + Math.min(X0 + W, X((d + 1) * PER))) / 2;
        const visible = Math.min(X0 + W, X((d + 1) * PER)) - Math.max(X0, X(d * PER));
        const o = interpolate(visible, [60, 140], [0, 1], clampOpts) * (d === 5 ? appear(f, b.dshape + 30) : 1);
        return <T key={l} x={x} y={TOP + H + 30} size={19} color="#6A80A6" opacity={o}>{l}</T>;
      })}

      {/* Shape names above each profile. */}
      {(
        [
          [3, 'P', b.pshape],
          [0, 'b', b.bshape + 30],
          [4, 'D', b.dshape + 40],
        ] as const
      ).map(([di, letter, at]) => {
        const day = DAYS[di];
        const x = X((di + 1) * PER) - (X((di + 1) * PER) - X(di * PER)) * 0.2;
        const y = Math.max(TOP - 6, Y(day.h) - 34);
        const inside = interpolate(x, [X0 + 10, X0 + 40, X0 + W - 40, X0 + W - 10], [0, 1, 1, 0], clampOpts);
        return <T key={letter} x={x} y={y} size={58} color={GOLD} font={fonts.heading} weight={800} opacity={appear(f, at, 12) * inside} halo>{letter}</T>;
      })}
      <Pill x={(X(2 * PER) + X(3 * PER)) / 2} y={Math.max(TOP - 6, Y(DAYS[2].h) - 30)} text="PANJANG & TIPIS" bg={GOLD} color={colors.bg} size={18} opacity={appear(f, b.thin + 30) * interpolate((X(2 * PER) + X(3 * PER)) / 2, [X0 + 60, X0 + 110, X0 + W - 110, X0 + W - 60], [0, 1, 1, 0], clampOpts)} />

      {/* Hook: the bounce off $62,006 to the $65,351 close. */}
      <Ring x={X(iLow15)} y={Y(62006)} o={appear(f, b.w62) * vanish(f, b.bshape, 8)} />
      <Pill x={X(iLow15) + 26} y={Y(62006) + 4} text="$62.006" bg={colors.bg} color={GOLD} anchor="start" opacity={appear(f, b.w62) * vanish(f, b.bshape, 8)} />
      <Pill x={X(1140)} y={Y(day15.c) - 44} text="+5,4%" bg={colors.positive} color={colors.bg} size={24} anchor="end" opacity={appear(f, b.hook + 56) * vanish(f, b.but, 8)} />

      {/* 12 → 13 Nov. */}
      <Pill x={X(288 + 150)} y={Y(70000)} text="13 NOV −4,4%" bg={colors.negative} anchor="middle" size={20} opacity={appear(f, b.turunLagi + 8) * vanish(f, b.thin + 10, 8)} />
      {/* 14 Nov: −6%, its low, broken the next day. */}
      <Pill x={X(576 + 120)} y={Y(65600)} text="−6,1%" bg={colors.negative} size={24} opacity={appear(f, b.enam) * vanish(f, b.guard, 8)} />
      <Ring x={X(iLow14)} y={Y(63320)} o={appear(f, b.enam + 20) * vanish(f, b.guard, 8)} />
      <Pill x={X(iLow14) - 24} y={Y(63320) + 32} text="LOW $63.320" bg={colors.bg} color={GOLD} anchor="end" opacity={appear(f, b.enam + 20) * vanish(f, b.guard, 8)} />
      <Ring x={X(iLow15)} y={Y(62006)} o={appear(f, b.jebol + 8) * vanish(f, b.guard, 8)} color={colors.negative} />
      <Pill x={X(iLow15) - 24} y={Y(62006) + 4} text="JEBOL: $62.006" bg={colors.negative} anchor="end" size={18} opacity={appear(f, b.jebol + 8) * vanish(f, b.guard, 8)} />
      {/* 17 Nov: into the thin area, then closed back above it. */}
      <Ring x={X(iLow17)} y={Y(63336)} o={appear(f, b.w633) * vanish(f, b.pay, 8)} />
      <Pill x={X(iLow17) - 26} y={Y(63336) + 4} text="17 NOV LOW $63.336" bg={colors.bg} color={GOLD} anchor="end" size={18} opacity={appear(f, b.w633) * vanish(f, b.pay, 8)} />
      <Ring x={X(1727)} y={Y(day17.c)} o={appear(f, b.held + 6) * vanish(f, b.pay, 8)} color={colors.positive} />
      <Pill x={X(1727) - 24} y={Y(day17.c) - 36} text="TUTUP $64.947" bg={colors.positive} color={colors.bg} anchor="end" size={18} opacity={appear(f, b.held + 6) * vanish(f, b.pay, 8)} />
      {/* 18 Nov (after the script was recorded): the thin area broke, down to $62,063. */}
      <Ring x={X(iLow18)} y={Y(62063)} o={appear(f, b.pay + 30)} color={colors.negative} />
      <Pill x={X(iLow18) - 22} y={Y(62063) + 4} text="18 NOV: JEBOL → $62.063" bg={colors.negative} anchor="end" size={18} opacity={appear(f, b.pay + 30)} />
      {/* Open interest under the 15 Nov chart: it fell while price rose. */}
      {oiOn > 0.01 && (
        <g opacity={oiOn}>
          <rect x={X0} y={1330} width={W} height={150} rx={14} fill="#0B1730" stroke="#1E3157" strokeWidth={1.5} />
          <T x={X0 + 18} y={1356} size={18} color="#9FB3D6" anchor="start">OPEN INTEREST OKX (BTC) · 15 NOV</T>
          {(() => {
            const pts = data.oi15;
            const lo = 32300;
            const hi = 33900;
            const ox = (h: number) => X(864 + h * 12);
            const oy = (v: number) => 1466 - ((v - lo) / (hi - lo)) * 84;
            const n = 24 * ramp(f, b.oi + 6, b.oi + 46);
            let s = '';
            for (const [h, v] of pts) if (h <= n) s += `${s ? 'L' : 'M'}${ox(h).toFixed(1)},${oy(v).toFixed(1)}`;
            return (
              <>
                <path d={s} stroke={GOLD} strokeWidth={3.5} fill="none" strokeLinejoin="round" />
                <Pill x={X0 + W - 14} y={1356} text="−3,2%" bg={colors.negative} size={20} anchor="end" opacity={appear(f, b.oi + 46)} />
                <T x={ox(0) + 8} y={oy(pts[0][1]) - 16} size={16} color={GOLD} anchor="start" opacity={appear(f, b.oi + 6)}>33.686</T>
                <T x={ox(24) - 8} y={oy(pts[24][1]) - 16} size={16} color={GOLD} anchor="end" opacity={appear(f, b.oi + 46)}>32.600</T>
              </>
            );
          })()}
        </g>
      )}
    </svg>
  );
};
