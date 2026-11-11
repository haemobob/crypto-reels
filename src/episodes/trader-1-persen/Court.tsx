import type {ReactNode} from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {colors} from '../../theme/colors';
import {ease} from '../../theme/motion';
import {fonts} from '../../theme/typography';

/**
 * The court: three day traders shooting at three hoops, then the study card, then the real six-bar chart, then the
 * check. Frame-driven SVG, keyed to narration cues (absolute frames). Which shots go in is an ILLUSTRATION of each
 * group's share in profit (labelled on screen); the percentages are the study's (sources.md S1–S3).
 */
export type Beats = Record<'hook' | 'study' | 'one' | 'mid' | 'long' | 'trend' | 'learn' | 'payoff' | 'end' | 'wCount', number>;

const LANES = [
  // Lanes 215 px apart: each ball arc stays in the band y−140…y−50 and each label in y−30…y+56, so no arc crosses
  // the label of the lane above.
  {y: 905, days: '1 HARI', pct: '29,8%', pattern: [1, 0, 0, 1, 0, 0, 0, 1, 0, 0]},
  {y: 1120, days: '101–200 HARI', pct: '6,8%', pattern: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0]},
  {y: 1335, days: '>300 HARI', pct: '3,0%', pattern: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]},
];
const BARS = [
  {d: '1', v: 29.8},
  {d: '2–50', v: 15.5},
  {d: '51–100', v: 8.9},
  {d: '101–200', v: 6.8},
  {d: '201–300', v: 5.4},
  {d: '>300', v: 3.0},
];

const HOOP_X = 110;
const FIG_X = 900;
const PERIOD = 40; // frames per shot
const RELEASE = 18; // frame in the cycle when the ball leaves the hands
const FLIGHT = 22; // frames from hands to rim

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const ramp = (f: number, a: number, b: number, e = ease.inOut) => interpolate(f, [a, b], [0, 1], {...clamp, easing: e});
const fadeSpan = (f: number, a: number, b: number, len = 10) => Math.min(ramp(f, a, a + len, ease.out), 1 - ramp(f, b - len, b));

const Txt = ({x, y, children, size, color = colors.text, font = fonts.mono, weight = 700, anchor = 'middle', opacity = 1, spacing = '0.04em'}: {x: number; y: number; children: ReactNode; size: number; color?: string; font?: string; weight?: number; anchor?: 'start' | 'middle' | 'end'; opacity?: number; spacing?: string}) => (
  <text x={x} y={y} fontFamily={font} fontWeight={weight} fontSize={size} fill={color} textAnchor={anchor} dominantBaseline="middle" opacity={opacity} letterSpacing={spacing}>
    {children}
  </text>
);

const Ball = ({x, y, opacity = 1}: {x: number; y: number; opacity?: number}) => (
  <g transform={`translate(${x},${y})`} opacity={opacity}>
    <circle r={13} fill={colors.light} />
    <path d="M-13,0 H13 M0,-13 V13 M-9,-9 Q0,0 -9,9 M9,-9 Q0,0 9,9" stroke={colors.bg} strokeWidth={1.6} fill="none" />
  </g>
);

const Hoop = ({y, glow}: {y: number; glow: number}) => {
  const ry = y - 50;
  return (
    <g>
      <line x1={HOOP_X} x2={HOOP_X} y1={ry - 70} y2={y + 70} stroke="#3A4C6E" strokeWidth={5} />
      <rect x={HOOP_X} y={ry - 64} width={10} height={80} rx={2} fill="#5B6F95" />
      {glow > 0 && <ellipse cx={HOOP_X + 52} cy={ry + 14} rx={46} ry={30} fill={colors.positive} opacity={0.28 * glow} />}
      <path d={`M${HOOP_X + 20},${ry} L${HOOP_X + 30},${ry + 36} L${HOOP_X + 74},${ry + 36} L${HOOP_X + 84},${ry}`} stroke={glow > 0.2 ? colors.positive : '#9FB3D6'} strokeWidth={2} fill="none" opacity={0.85} />
      <path d={`M${HOOP_X + 36},${ry} L${HOOP_X + 42},${ry + 36} M${HOOP_X + 52},${ry} V${ry + 36} M${HOOP_X + 68},${ry} L${HOOP_X + 62},${ry + 36}`} stroke={glow > 0.2 ? colors.positive : '#9FB3D6'} strokeWidth={1.5} opacity={0.7} />
      <ellipse cx={HOOP_X + 52} cy={ry} rx={34} ry={7} fill="none" stroke={glow > 0.2 ? colors.positive : colors.electric} strokeWidth={4} />
    </g>
  );
};

/** A stick figure facing left. `raise` 0 = ball at the chest, 1 = arms up (shot). */
const Figure = ({y, raise, dip, hold, opacity}: {y: number; raise: number; dip: number; hold: boolean; opacity: number}) => {
  const x = FIG_X;
  const k = dip * 8; // knee bend
  const head = {x, y: y - 82 + k};
  const neck = y - 66 + k;
  const hip = y + 8 + k;
  const hand = {x: x - 22 - raise * 4, y: lerpN(y - 34 + k, y - 100 + k, raise)};
  return (
    <g opacity={opacity} stroke={colors.text} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" fill="none">
      <circle cx={head.x} cy={head.y} r={15} fill={colors.text} stroke="none" />
      <line x1={x} y1={neck} x2={x} y2={hip} />
      <polyline points={`${x},${hip} ${x - 12},${y + 40 + k / 2} ${x - 16},${y + 70}`} />
      <polyline points={`${x},${hip} ${x + 14},${y + 40 + k / 2} ${x + 18},${y + 70}`} />
      <polyline points={`${x},${neck + 8} ${lerpN(x - 18, x - 10, raise)},${lerpN(y - 18 + k, y - 80 + k, raise)} ${hand.x},${hand.y}`} />
      <polyline points={`${x},${neck + 8} ${lerpN(x - 6, x + 2, raise)},${lerpN(y - 14 + k, y - 84 + k, raise)} ${hand.x + 10},${hand.y + 4}`} />
      {hold && <Ball x={hand.x - 6} y={hand.y - 10} />}
    </g>
  );
};
const lerpN = (a: number, b: number, t: number) => a + (b - a) * t;

/** One lane's shooting, from frame `from` to `to`; returns the figure pose, the ball (if in flight) and the rim glow. */
const shotState = (f: number, from: number, to: number, pattern: number[], y: number) => {
  const idle = {raise: 0, dip: 0, hold: true, ball: null as null | {x: number; y: number; o: number}, glow: 0};
  if (f < from) return idle;
  const t = f - from;
  const k = Math.floor(t / PERIOD);
  const c = t % PERIOD;
  const lastShotStart = from + Math.floor((to - from) / PERIOD) * PERIOD;
  if (f >= lastShotStart && f >= to) return idle;
  const make = pattern[k % pattern.length] === 1;
  const raise = c < RELEASE - 8 ? 0 : c < RELEASE ? (c - (RELEASE - 8)) / 8 : c < RELEASE + 10 ? 1 : Math.max(0, 1 - (c - RELEASE - 10) / 8);
  const dip = c < RELEASE - 8 ? Math.sin((c / (RELEASE - 8)) * Math.PI) : 0;
  const hold = c < RELEASE;
  let glow = 0;
  // Glow from the previous make, carried a few frames into the next cycle.
  const hx = HOOP_X + 52;
  const ry = y - 50;
  const sx = FIG_X - 28;
  const sy = y - 110;
  let ball: null | {x: number; y: number; o: number} = null;
  const tb = c - RELEASE;
  if (tb >= 0) {
    if (tb <= FLIGHT) {
      const u = tb / FLIGHT;
      const tx = make ? hx : hx + 34;
      const ty = make ? ry - 6 : ry - 10;
      const apex = Math.min(sy, ty) - 28;
      // Quadratic Bezier through an apex control point.
      const cx = (sx + tx) / 2;
      const cy = 2 * apex - (sy + ty) / 2;
      ball = {x: (1 - u) ** 2 * sx + 2 * (1 - u) * u * cx + u ** 2 * tx, y: (1 - u) ** 2 * sy + 2 * (1 - u) * u * cy + u ** 2 * ty, o: 1};
    } else {
      const a = tb - FLIGHT;
      if (make) {
        ball = {x: hx, y: ry - 6 + a * 5, o: Math.max(0, 1 - a / 10)};
        glow = Math.max(0, 1 - a / 14);
      } else {
        ball = {x: hx + 34 + a * 4.5, y: ry - 10 - a * 6 + 0.5 * 0.9 * a * a, o: Math.max(0, 1 - a / 16)};
      }
    }
  }
  return {raise, dip, hold, ball, glow};
};

export const Court = ({b}: {b: Beats}) => {
  const f = useCurrentFrame();
  const courtOn = Math.max(fadeSpan(f, 0, b.study + 6, 8), fadeSpan(f, b.one - 6, b.trend + 10, 10));
  const cardOn = fadeSpan(f, b.study, b.one + 2, 10);
  const chartOn = fadeSpan(f, b.trend, b.payoff + 6, 10);
  const endOn = ramp(f, b.payoff, b.payoff + 12, ease.out);
  const laneFrom = [b.one, b.mid, b.long];
  const introFrom = 6;

  return (
    <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{position: 'absolute', inset: 0}}>
      <defs>
        <radialGradient id="spot" cx="50%" cy="0%" r="75%">
          <stop offset="0%" stopColor={colors.electric} stopOpacity={0.32} />
          <stop offset="100%" stopColor={colors.electric} stopOpacity={0} />
        </radialGradient>
      </defs>
      {/* Spotlight on the court from above the stage. */}
      <rect x={0} y={760} width={1080} height={720} fill="url(#spot)" opacity={Math.max(courtOn, endOn * 0.6)} />

      {/* The court: three lanes. */}
      {courtOn > 0.01 &&
        LANES.map((l, i) => {
          const labelled = f >= laneFrom[i];
          const intro = f < b.study + 6;
          const s = intro ? shotState(f, introFrom + i * 9, b.study - 8, LANES[(i + 1) % 3].pattern, l.y) : shotState(f, laneFrom[i] + 4, b.trend, l.pattern, l.y);
          const active = intro || labelled;
          const lab = ramp(f, laneFrom[i], laneFrom[i] + 10, ease.out);
          return (
            <g key={i} opacity={courtOn}>
              <line x1={70} x2={1010} y1={l.y + 72} y2={l.y + 72} stroke="#1E3256" strokeWidth={2} />
              <Hoop y={l.y} glow={s.glow} />
              <Figure y={l.y} raise={active ? s.raise : 0} dip={active ? s.dip : 0} hold={active ? s.hold : true} opacity={active ? 1 : 0.32} />
              {active && s.ball && <Ball x={s.ball.x} y={s.ball.y} opacity={s.ball.o} />}
              {!intro && (
                <g opacity={lab}>
                  <Txt x={520} y={l.y + 6} size={72} font={fonts.heading} weight={800} spacing="-0.01em" color={i === 0 ? colors.positive : i === 1 ? colors.text : colors.negative}>{l.pct}</Txt>
                  <Txt x={520} y={l.y + 46} size={21} color="#9FB3D6">{`${l.days} · UNTUNG`}</Txt>
                </g>
              )}
            </g>
          );
        })}
      {courtOn > 0.01 && f >= b.one && (
        <Txt x={540} y={1452} size={17} color="#6F84A8" opacity={courtOn * ramp(f, b.one, b.one + 10)}>BOLA MASUK = ILUSTRASI · PERSENTASE = DATA STUDI</Txt>
      )}

      {/* The study card (the real-world anchor). */}
      {cardOn > 0.01 && (
        <g opacity={cardOn} transform={`translate(0 ${(1 - ramp(f, b.study, b.study + 14, ease.out)) * 30})`}>
          <rect x={110} y={790} width={860} height={560} rx={22} fill="#0B1730" stroke="#2A3A5A" strokeWidth={2} />
          <rect x={110} y={790} width={10} height={560} rx={4} fill={colors.blue} />
          <Txt x={160} y={846} size={20} color="#7F93B3" anchor="start">PENELITIAN · UNIVERSITAS SÃO PAULO (FEA-USP) · 2019–2020</Txt>
          <Txt x={160} y={920} size={62} font={fonts.heading} weight={800} anchor="start" spacing="-0.01em">“Day Trading for a Living?”</Txt>
          <Txt x={160} y={984} size={26} font={fonts.body} weight={600} color="#C9D3E3" anchor="start" spacing="0">Chague, De-Losso &amp; Giovannetti</Txt>
          <line x1={160} x2={920} y1={1030} y2={1030} stroke="#2A3A5A" strokeWidth={2} />
          <Txt x={160} y={1124} size={110} font={fonts.heading} weight={800} anchor="start" color={colors.electric} spacing="-0.02em">
            {Math.round(interpolate(f, [b.wCount - 4, b.wCount + 26], [0, 19646], {...clamp, easing: ease.out})).toLocaleString('de-DE')}
          </Txt>
          <Txt x={160} y={1206} size={22} color={colors.text} anchor="start">ORANG MULAI DAY TRADING FUTURES INDEKS SAHAM</Txt>
          <Txt x={160} y={1240} size={22} color={colors.text} anchor="start">BRASIL · 2013–2015 · SEMUANYA DIIKUTI</Txt>
          <Txt x={160} y={1300} size={18} color="#7F93B3" anchor="start">DATA: CVM, REGULATOR PASAR MODAL BRASIL · BUKAN KRIPTO</Txt>
        </g>
      )}

      {/* The pattern: the real six groups. */}
      {chartOn > 0.01 && (
        <g opacity={chartOn}>
          <Txt x={540} y={800} size={20} color="#9FB3D6">YANG UNTUNG (SETELAH BIAYA), MENURUT LAMA DAY TRADING</Txt>
          {BARS.map((bar, i) => {
            const x0 = 130 + i * 140;
            const h = (bar.v / 30) * 400;
            const g = ramp(f, b.trend + 4 + i * 5, b.trend + 22 + i * 5, ease.out);
            const key = i === 0 || i === 3 || i === 5;
            return (
              <g key={i}>
                <rect x={x0} y={1290 - h * g} width={100} height={h * g} rx={6} fill={key ? colors.blue : '#2A4C86'} />
                <Txt x={x0 + 50} y={1290 - h * g - 30} size={34} font={fonts.heading} weight={800} opacity={g} spacing="-0.01em">{bar.v.toLocaleString('de-DE', {minimumFractionDigits: 1})}%</Txt>
                <Txt x={x0 + 50} y={1324} size={20} color="#9FB3D6">{bar.d}</Txt>
              </g>
            );
          })}
          <line x1={110} x2={970} y1={1290} y2={1290} stroke="#3A4C6E" strokeWidth={2} />
          <Txt x={540} y={1370} size={20} color="#7F93B3">HARI DAY TRADING</Txt>
          {/* The falling line through the three lanes' groups. */}
          {(() => {
            const pts = [0, 3, 5].map((i) => [130 + i * 140 + 50, 1290 - (BARS[i].v / 30) * 400 - 8] as const);
            const u = ramp(f, b.trend + 40, b.trend + 64);
            const d = pts.map(([x, y], k) => `${k ? 'L' : 'M'}${x},${y}`).join('');
            return <path d={d} stroke={colors.negative} strokeWidth={4} strokeDasharray="10 8" fill="none" opacity={0.85 * u} pathLength={1} strokeDashoffset={0} />;
          })()}
        </g>
      )}

      {/* The check: the last trader, ball in hand, facing the only score that matters. */}
      {endOn > 0.01 && (
        <g opacity={endOn}>
          <rect x={150} y={820} width={780} height={330} rx={24} fill="#0B1730" stroke="#2A3A5A" strokeWidth={2} />
          <Txt x={540} y={872} size={22} color="#9FB3D6">HASIL BERSIH LO · SETELAH BIAYA</Txt>
          {[
            {x: 370, t: '+ POSITIF', c: colors.positive},
            {x: 710, t: '− NEGATIF', c: colors.negative},
          ].map((o, k) => (
            <g key={k}>
              <rect x={o.x - 150} y={930} width={300} height={150} rx={18} fill="none" stroke={o.c} strokeWidth={3} opacity={0.9} />
              <Txt x={o.x} y={1005} size={44} font={fonts.heading} weight={800} color={o.c} spacing="-0.01em">{o.t}</Txt>
            </g>
          ))}
          <Txt x={540} y={1005} size={60} font={fonts.heading} weight={800} color={colors.text} opacity={0.5 + 0.5 * Math.abs(Math.sin(f / 9))}>?</Txt>
          <Txt x={540} y={1240} size={24} color="#9FB3D6">DI STUDI: YANG BERTAHAN &gt;300 HARI, 97% RUGI</Txt>
        </g>
      )}
    </svg>
  );
};

/** Frames at which lane `i`'s shots go in (for sound): same schedule as the court. */
export const makeFrames = (from: number, to: number, lane: number) => {
  const out: number[] = [];
  const pattern = LANES[lane].pattern;
  for (let k = 0; from + k * PERIOD + RELEASE + FLIGHT < to; k++) if (pattern[k % pattern.length] === 1) out.push(from + k * PERIOD + RELEASE + FLIGHT);
  return out;
};
export const releaseFrames = (from: number, to: number) => {
  const out: number[] = [];
  for (let k = 0; from + k * PERIOD + RELEASE < to; k++) out.push(from + k * PERIOD + RELEASE);
  return out;
};
