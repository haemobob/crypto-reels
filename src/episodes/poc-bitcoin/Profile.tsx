import type {ReactNode} from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import raw from '../../../public/episodes/poc-bitcoin/btc.json';
import {colors} from '../../theme/colors';
import {ease} from '../../theme/motion';
import {fonts} from '../../theme/typography';

/**
 * One real daily chart (Binance BTC/USDT, 15 Sep 2025 – 15 Nov 2026, log; closes as the line, each day's high–low as a
 * faint wick) and two volume profiles computed from Binance hourly volume: the bear range (6 Oct 2025 – 31 Jan 2026)
 * and the summer range (15 Jun – 18 Aug 2026), drawn as horizontal bars with their points of control extended across
 * the chart. One camera move: at the rally the view reframes onto Apr–Nov 2026, where both levels and the moves between
 * them are (the chart is re-scaled, so type and strokes stay the same size). Keyed to narration cues.
 */
export type Beats = Record<'hook' | 'nocoin' | 'poc' | 'summer' | 'bear' | 'rally' | 'stop' | 'drop' | 'hold' | 'why' | 'pay' | 'fail' | 'end' | 'w87' | 'w62' | 's64' | 'b88' | 'up36' | 'under' | 'tutup' | 'p64' | 'p88' | 'low', number>;

type Day = [string, number, number, number];
type Prof = {from: string; to: string; step: number; bins: Array<[number, number]>; poc: number; poc250: number};
const data = raw as unknown as {daily: Day[]; summer: Prof; bear: Prof};
const DAYS = data.daily;
const DAY = 86_400_000;
const idx = (d: string) => Math.round((Date.parse(d) - Date.parse(DAYS[0][0])) / DAY);
const LAST = DAYS.length - 1;

const X0 = 90;
const W = 900;
const TOP = 790;
const H = 600;
const GOLD = '#FFD166';

// The two framings: the whole period, and Apr–Nov 2026 (both levels, the rally and the drop).
const FULL = {i0: -0.5, i1: LAST + 3.5, p0: 55000, p1: 132000};
const ZOOM = {i0: idx('2026-04-08'), i1: LAST + 5, p0: 55500, p1: 98000};
type View = {X: (i: number) => number; Y: (p: number) => number; k: number};
const makeView = (k: number): View => {
  const i0 = FULL.i0 + (ZOOM.i0 - FULL.i0) * k;
  const i1 = FULL.i1 + (ZOOM.i1 - FULL.i1) * k;
  const l0 = Math.log(FULL.p0) + (Math.log(ZOOM.p0) - Math.log(FULL.p0)) * k;
  const l1 = Math.log(FULL.p1) + (Math.log(ZOOM.p1) - Math.log(FULL.p1)) * k;
  return {X: (i) => X0 + ((i - i0) / (i1 - i0)) * W, Y: (p) => TOP + H * (1 - (Math.log(p) - l0) / (l1 - l0)), k};
};

const clampOpts = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const ramp = (f: number, a: number, b: number, e = ease.inOut) => interpolate(f, [a, b], [0, 1], {...clampOpts, easing: e});
const appear = (f: number, at: number, len = 10) => ramp(f, at, at + len, ease.out);
const vanish = (f: number, at: number, len = 10) => 1 - ramp(f, at, at + len, ease.out);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const T = ({x, y, children, size = 20, color = colors.text, anchor = 'middle', weight = 700, opacity = 1}: {x: number; y: number; children: ReactNode; size?: number; color?: string; anchor?: 'start' | 'middle' | 'end'; weight?: number; opacity?: number}) =>
  opacity <= 0.01 ? null : (
    <text x={x} y={y} fontFamily={fonts.mono} fontWeight={weight} fontSize={size} fill={color} textAnchor={anchor} dominantBaseline="middle" opacity={opacity} letterSpacing="0.02em">
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

const linePath = (v: View, a: number, b: number) => {
  let s = '';
  const end = Math.min(LAST, b);
  for (let i = Math.max(0, Math.floor(a)); i <= Math.floor(end); i++) s += `${s ? 'L' : 'M'}${v.X(i).toFixed(1)},${v.Y(DAYS[i][3]).toFixed(1)}`;
  // Partial last segment so the line draws smoothly.
  const fi = Math.floor(end);
  if (end > fi && fi + 1 <= LAST) {
    const t = end - fi;
    s += `L${lerp(v.X(fi), v.X(fi + 1), t).toFixed(1)},${lerp(v.Y(DAYS[fi][3]), v.Y(DAYS[fi + 1][3]), t).toFixed(1)}`;
  }
  return s;
};

/** A volume profile: bars from the range's left edge, length ∝ volume, POC bin in gold; grows from the POC outwards. */
const ProfileBars = ({v, p, maxW, grow, o}: {v: View; p: Prof; maxW: number; grow: number; o: number}) => {
  if (o <= 0.01) return null;
  const x0 = v.X(idx(p.from));
  const x1 = v.X(idx(p.to));
  const vmax = Math.max(...p.bins.map((b) => b[1]));
  const pocBin = p.bins.reduce((a, b) => (b[1] > a[1] ? b : a));
  const yTop = v.Y(Math.max(...p.bins.map((b) => b[0])) + p.step);
  const yBot = v.Y(Math.min(...p.bins.map((b) => b[0])));
  return (
    <g opacity={o}>
      <rect x={x0} y={yTop} width={x1 - x0} height={yBot - yTop} fill={colors.blue} opacity={0.08} />
      <rect x={x0} y={yTop} width={x1 - x0} height={yBot - yTop} fill="none" stroke="#2A4C86" strokeWidth={1.5} strokeDasharray="4 6" />
      {p.bins.map(([price, vol]) => {
        const isPoc = price === pocBin[0];
        const dist = Math.abs(price - pocBin[0]) / (p.step * p.bins.length);
        const g = Math.max(0, Math.min(1, grow * 1.6 - dist * 1.4));
        const y1 = v.Y(price + p.step);
        const y2 = v.Y(price);
        return <rect key={price} x={x0} y={y1 + 0.5} width={(vol / vmax) * maxW * g} height={Math.max(1, y2 - y1 - 1)} fill={isPoc ? GOLD : colors.light} opacity={isPoc ? 0.95 : 0.4} />;
      })}
    </g>
  );
};

const Ring = ({v, i, p, o, color = GOLD}: {v: View; i: number; p: number; o: number; color?: string}) =>
  o <= 0.01 ? null : <circle cx={v.X(i)} cy={v.Y(p)} r={18 * (0.7 + 0.3 * o)} fill="none" stroke={color} strokeWidth={3.5} opacity={o} />;

const MONTHS: Array<[string, string, boolean]> = [
  ['2025-10-01', 'OKT 25', true], ['2026-01-01', 'JAN 26', true], ['2026-04-01', 'APR', true], ['2026-05-01', 'MEI', false], ['2026-06-01', 'JUN', false],
  ['2026-07-01', 'JUL', true], ['2026-08-01', 'AGU', false], ['2026-09-01', 'SEP', false], ['2026-10-01', 'OKT 26', true], ['2026-11-01', 'NOV', false],
];

export const Profile = ({b}: {b: Beats}) => {
  const f = useCurrentFrame();
  // The one hero move: reframe onto Apr–Nov 2026 as the rally between the two levels is described.
  const v = makeView(ramp(f, b.rally - 4, b.rally + 36));
  const {X, Y, k} = v;
  const draw = interpolate(f, [b.hook, b.hook + 50], [0, LAST], {...clampOpts, easing: ease.inOut});
  const iTop = idx('2026-09-21');
  const iLow = idx('2026-11-15');
  const iAug = idx('2026-08-18');
  const iJul = idx('2026-07-01');
  const why = f >= b.why && f < b.pay + 10 ? (0.5 - 0.5 * Math.cos((f - b.why) / 6)) * vanish(f, b.pay) : 0;
  // Callouts that served their beat step back at the payoff, leaving the two levels.
  const calm = vanish(f, b.pay, 14);
  const o87 = Math.max(appear(f, b.w87) * vanish(f, b.poc), appear(f, b.stop + 6));
  const o62 = Math.max(appear(f, b.w62) * vanish(f, b.poc), appear(f, b.hold + 6));
  const ring = (o: number, at: number) => o * (f >= at ? lerp(0.35, 1, calm) : 1);
  const tag = (o: number, at: number) => o * (f >= at ? calm : 1);
  const ticks = [60000, 70000, 80000, 90000, 100000, 120000].map((p) => {
    const y = Y(p);
    return {p, y, inside: interpolate(y, [TOP - 10, TOP + 20, TOP + H - 20, TOP + H], [0, 1, 1, 0], clampOpts)};
  });
  const summerPill = Y(data.summer.poc250);
  const bearPill = Y(data.bear.poc250);
  return (
    <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{position: 'absolute', inset: 0}}>
      <defs>
        <clipPath id="poc-chart">
          <rect x={X0} y={TOP - 30} width={W + 10} height={H + 40} />
        </clipPath>
      </defs>
      {/* Price grid under the data; its labels go on top (below) with a dark halo. */}
      {ticks.map(({p, y, inside}) => (inside <= 0.01 ? null : <line key={p} x1={X0} x2={X0 + W} y1={y} y2={y} stroke="#132442" strokeWidth={1.5} opacity={0.75 * inside} />))}
      {MONTHS.map(([d, l, major]) => {
        const x = X(idx(d));
        const o = (major ? 1 : k) * interpolate(x, [X0 + 10, X0 + 40, X0 + W - 30, X0 + W], [0, 1, 1, 0], clampOpts);
        return <T key={d} x={x} y={TOP + H + 28} size={19} color="#6A80A6" opacity={o}>{l}</T>;
      })}

      <g clipPath="url(#poc-chart)">
        {/* The two profiles and their points of control. */}
        {/* Built while the definition is spoken: the summer range is the example. */}
        <ProfileBars v={v} p={data.summer} maxW={150 + 60 * k} grow={ramp(f, b.poc + 20, b.poc + 80)} o={appear(f, b.poc + 14)} />
        <ProfileBars v={v} p={data.bear} maxW={240} grow={ramp(f, b.bear + 4, b.bear + 44)} o={appear(f, b.bear)} />
        {[[data.summer, appear(f, b.s64, 24)], [data.bear, appear(f, b.b88, 24)]].map(([p, o]) => {
          const pr = p as Prof;
          const oo = o as number;
          if (oo <= 0.01) return null;
          const x0 = X(idx(pr.from));
          const y = Y(pr.poc250);
          return <line key={pr.from} x1={x0} x2={x0 + (X0 + W - x0) * Math.min(1, oo * 1.3)} y1={y} y2={y} stroke={GOLD} strokeWidth={3} strokeDasharray="10 7" opacity={Math.min(1, oo * 1.6)} />;
        })}
        {why > 0 && (
          <g opacity={why * 0.5}>
            <rect x={X0} y={summerPill - 7} width={W} height={14} fill={GOLD} opacity={0.4} />
            <rect x={X0} y={bearPill - 7} width={W} height={14} fill={GOLD} opacity={0.4} />
          </g>
        )}
        {/* The payoff: each level lights up as it is named, and stays lit. */}
        {([[summerPill, b.p64], [bearPill, b.p88]] as const).map(([y, at]) => {
          const o = appear(f, at, 8);
          return o <= 0.01 ? null : <rect key={at} x={X0} y={y - 9} width={W} height={18} fill={GOLD} opacity={0.22 * o} />;
        })}

        {/* Each day's high–low range, faint, under the closing-price line. */}
        <g opacity={0.3}>
          {DAYS.slice(0, Math.floor(draw) + 1).map((r, i) => (
            <line key={r[0]} x1={X(i)} x2={X(i)} y1={Y(r[1])} y2={Y(r[2])} stroke={colors.electric} strokeWidth={1.5 + k} />
          ))}
        </g>
        <path d={linePath(v, 0, draw)} stroke={colors.electric} strokeWidth={3} fill="none" strokeLinejoin="round" opacity={f >= b.rally ? 0.55 : 1} />
        {/* The rally and the drop, emphasised. */}
        {f >= b.rally + 8 && <path d={linePath(v, iAug, iAug + (iTop - iAug) * ramp(f, b.rally + 8, b.rally + 44))} stroke={colors.positive} strokeWidth={6} fill="none" strokeLinejoin="round" />}
        {f >= b.drop && <path d={linePath(v, iTop, iTop + (iLow - iTop) * ramp(f, b.drop, b.drop + 34))} stroke={colors.negative} strokeWidth={6} fill="none" strokeLinejoin="round" />}

        <Ring v={v} i={iTop} p={87396} o={ring(o87, b.stop)} />
        <Ring v={v} i={iLow} p={62006} o={ring(o62, b.hold)} />

        {/* What comes next if $64K breaks: the July low. */}
        {f >= b.low && <line x1={X(iJul)} x2={X0 + W} y1={Y(57800)} y2={Y(57800)} stroke={colors.negative} strokeWidth={3} strokeDasharray="8 7" opacity={appear(f, b.low)} />}
      </g>

      {ticks.map(({p, y, inside}) =>
        inside <= 0.01 ? null : (
          <text key={p} x={X0 + 4} y={y - 14} fontFamily={fonts.mono} fontWeight={600} fontSize={19} fill="#6A80A6" stroke={colors.bg} strokeWidth={6} paintOrder="stroke" dominantBaseline="middle" opacity={inside}>{`$${p / 1000} RB`}</text>
        ),
      )}
      {/* Labels: range names, POC values, the two extremes and what happened there. */}
      <T x={X(idx(data.summer.from)) + 80} y={Y(data.summer.bins[data.summer.bins.length - 1][0] + data.summer.step) - 22} size={18} color="#9FB3D6" opacity={appear(f, b.summer) * calm}>15 JUN – 18 AGU</T>
      <T x={X(idx(data.bear.from)) + 140} y={Y(data.bear.bins[data.bear.bins.length - 1][0] + data.bear.step) - 22} size={18} color="#9FB3D6" opacity={appear(f, b.bear) * (1 - k)}>6 OKT 25 – 31 JAN 26</T>
      <Pill x={X0 + W} y={bearPill - 28} text="POC ≈ $87.900" bg={GOLD} color={colors.bg} anchor="end" opacity={appear(f, b.b88, 24)} />
      {/* Right end in the full view; in the reframed view it moves left, clear of the $62K low at the right edge. */}
      <Pill x={lerp(X0 + W - 183, X(idx('2026-08-24')), k)} y={summerPill + 28} text="POC ≈ $64.100" bg={GOLD} color={colors.bg} anchor="start" opacity={appear(f, b.s64, 24)} />

      <Pill x={X(idx('2026-08-23'))} y={Y(72000)} text="+36%" bg={colors.positive} color={colors.bg} size={24} anchor="start" opacity={appear(f, b.up36) * calm} />
      <Pill x={X(idx('2026-10-28'))} y={Y(71000)} text="−29%" bg={colors.negative} size={24} anchor="end" opacity={appear(f, b.drop + 24) * calm} />

      <Pill x={X(iTop) - 24} y={Y(87396) - 34} text="$87.396" bg={colors.bg} color={GOLD} anchor="end" opacity={tag(o87, b.stop)} />
      <Pill x={X(iTop) - 24} y={Y(87396) - 76} text="0,5% DI BAWAH POC" bg={colors.blue} anchor="end" size={19} opacity={appear(f, b.under) * calm} />
      <Pill x={X(iLow) - 24} y={Y(62006) + 34} text="$62.006" bg={colors.bg} color={GOLD} anchor="end" opacity={tag(o62, b.hold)} />
      <Pill x={X(iLow) - 24} y={Y(62006) + 76} text="15 NOV TUTUP $65.351 · DI ATAS POC" bg={colors.positive} color={colors.bg} anchor="end" size={18} opacity={appear(f, b.tutup) * calm} />
      <Pill x={X0 + W} y={Y(57800) + 28} text="LOW JULI $57.800" bg={colors.negative} anchor="end" opacity={appear(f, b.low + 4)} />
    </svg>
  );
};
