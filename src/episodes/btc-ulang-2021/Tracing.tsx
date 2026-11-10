import type {ReactNode} from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {colors} from '../../theme/colors';
import {ease} from '../../theme/motion';
import {fonts} from '../../theme/typography';
import {ATH, LEVEL_NOW, LOW_NOW, LOW_OLD, NOW, NOW_LAST, NOW_LOW, OLD, RALLY, STEPS, TOP0, dayNow, dayOld, type Pt} from './data';

/**
 * The light table: today's BTC chart (Binance daily, blue) and the 2021–23 chart drawn on a tracing sheet (graphite).
 * Both series are stored as days from their final low and price ÷ that low, so one "ruler" (a Map) can draw either,
 * and moving between rulers is a lerp of the Map's numbers. Everything is keyed to narration cues (absolute frames).
 */
export type Beats = Record<
  | 'hook' | 'claim' | 'check' | 'order' | 's1' | 's2' | 's3' | 's4' | 's5' | 's6' | 'size' | 'crash' | 'rally' | 'speed'
  | 'retrace' | 'never' | 'level' | 'now' | 'ath' | 'one' | 'payoff' | 'verdict' | 'fail' | 'end',
  number
>;

type Map = {x0: number; w: number; d0: number; d1: number; y0: number; h: number; r0: number; r1: number};
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const lerpMap = (a: Map, b: Map, t: number): Map => ({
  x0: lerp(a.x0, b.x0, t), w: lerp(a.w, b.w, t), d0: lerp(a.d0, b.d0, t), d1: lerp(a.d1, b.d1, t),
  y0: lerp(a.y0, b.y0, t), h: lerp(a.h, b.h, t), r0: Math.exp(lerp(Math.log(a.r0), Math.log(b.r0), t)), r1: Math.exp(lerp(Math.log(a.r1), Math.log(b.r1), t)),
});
const X = (m: Map, d: number) => m.x0 + ((d - m.d0) / (m.d1 - m.d0)) * m.w;
const Y = (m: Map, r: number) => m.y0 + m.h * (1 - (Math.log(r) - Math.log(m.r0)) / (Math.log(m.r1) - Math.log(m.r0)));

// Rulers (screen px). Stage band 740–1430.
const A_NOW: Map = {x0: 90, w: 800, d0: -368, d1: 136, y0: 800, h: 560, r0: 0.93, r1: 2.3};
const B_OLD: Map = {x0: 130, w: 820, d0: -610, d1: 40, y0: 812, h: 212, r0: 0.86, r1: 4.75};
const B_NOW: Map = {x0: 90, w: 860, d0: -368, d1: 136, y0: 1134, h: 236, r0: 0.9, r1: 2.3};
const M2: Map = {x0: 90, w: 900, d0: -620, d1: 330, y0: 790, h: 560, r0: 0.9, r1: 4.75};
const M3: Map = {x0: 90, w: 860, d0: -50, d1: 336, y0: 790, h: 590, r0: 0.92, r1: 2.25};
const M4: Map = {x0: 90, w: 860, d0: -50, d1: 505, y0: 790, h: 590, r0: 0.9, r1: 5.0};

const SHEET_B = {x: 104, y: 772, w: 872, h: 296};
const SHEET_M = {x: 64, y: 752, w: 952, h: 690};
/** Inner margin of the paper: lines stop this far inside its edge. */
const PAD = 14;

const INK = colors.ink;
const GRAPHITE = '#2B3240';
const BLUE = colors.blue;
const RED = colors.negative;
const GREEN = '#0FA37A';

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const ramp = (f: number, a: number, b: number, e = ease.inOut) => interpolate(f, [a, b], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: e});
const span = (f: number, a: number, b: number, inLen = 8, outLen = 8) => (b <= a ? 0 : Math.min(ramp(f, a, a + inLen, ease.out), 1 - ramp(f, b - outLen, b, ease.inOut)));

const path = (pts: Pt[], m: Map, upTo: number) => {
  let s = '';
  for (const p of pts) {
    if (p.d > upTo) break;
    s += `${s ? 'L' : 'M'}${X(m, p.d).toFixed(1)},${Y(m, p.c).toFixed(1)}`;
  }
  return s;
};
const ranges = (pts: Pt[], m: Map, upTo: number) => {
  let s = '';
  for (const p of pts) {
    if (p.d > upTo) break;
    const x = X(m, p.d).toFixed(1);
    s += `M${x},${Y(m, p.h).toFixed(1)}V${Y(m, p.l).toFixed(1)}`;
  }
  return s;
};

const Txt = ({x, y, children, size = 20, color = INK, anchor = 'middle', weight = 700, font = fonts.mono, opacity = 1}: {x: number; y: number; children: ReactNode; size?: number; color?: string; anchor?: 'start' | 'middle' | 'end'; weight?: number; font?: string; opacity?: number}) => (
  <text x={x} y={y} fontFamily={font} fontWeight={weight} fontSize={size} fill={color} textAnchor={anchor} dominantBaseline="middle" opacity={opacity} letterSpacing="0.02em">
    {children}
  </text>
);

/** A label on a solid pill so it never sits illegibly on a line. */
const Pill = ({x, y, text, color = INK, bg = '#FFFFFF', size = 19, anchor = 'middle', opacity = 1, border}: {x: number; y: number; text: string; color?: string; bg?: string; size?: number; anchor?: 'start' | 'middle' | 'end'; opacity?: number; border?: string}) => {
  if (opacity <= 0.001) return null;
  const w = text.length * size * 0.62 + 22;
  const h = size + 16;
  const left = anchor === 'middle' ? x - w / 2 : anchor === 'end' ? x - w : x;
  return (
    <g opacity={opacity}>
      <rect x={left} y={y - h / 2} width={w} height={h} rx={8} fill={bg} stroke={border ?? 'none'} strokeWidth={border ? 1.5 : 0} />
      <Txt x={left + w / 2} y={y + 1} size={size} color={color}>{text}</Txt>
    </g>
  );
};

const Marker = ({x, y, n, fill, opacity, scale = 1}: {x: number; y: number; n: number; fill: string; opacity: number; scale?: number}) =>
  opacity <= 0.001 ? null : (
    <g opacity={opacity} transform={`translate(${x},${y}) scale(${scale})`}>
      <circle r={17} fill={fill} stroke="#FFFFFF" strokeWidth={3} />
      <Txt x={0} y={1} size={18} color="#FFFFFF" weight={800}>{n}</Txt>
    </g>
  );

const fmt = (v: number) => '$' + Math.round(v).toLocaleString('de-DE');

export const Tracing = ({b}: {b: Beats}) => {
  const f = useCurrentFrame();

  // --- Which ruler each series is drawn with, frame by frame.
  const toB = ramp(f, b.check + 2, b.check + 28);
  const toM2 = ramp(f, b.size + 2, b.size + 40);
  const toM3 = ramp(f, b.retrace, b.retrace + 32);
  const toM4 = ramp(f, b.ath, b.ath + 32);
  const later = (m: Map) => lerpMap(lerpMap(lerpMap(m, M3, toM3), M4, toM4), M4, 0);
  const mOld = later(lerpMap(B_OLD, M2, toM2));
  // The sheet slides in from above the frame before it settles on its panel.
  const sheetDrop = (1 - toB) * -760;
  const mOldShown: Map = {...mOld, y0: mOld.y0 + sheetDrop};
  const mNow = later(lerpMap(lerpMap(A_NOW, B_NOW, toB), M2, toM2));

  // --- How much of each series is drawn (days from its final low).
  const nowUpTo = interpolate(f, [b.hook, b.hook + 80], [-368, 140], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease.inOut});
  const oldUpTo =
    f < b.rally ? 4 : f < b.retrace ? interpolate(f, [b.rally, b.rally + 34], [4, 236], {extrapolateRight: 'clamp', easing: ease.inOut})
      : f < b.ath ? interpolate(f, [b.retrace + 6, b.retrace + 40], [236, 336], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease.inOut})
        : interpolate(f, [b.ath + 8, b.ath + 44], [336, 505], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease.inOut});

  const light = f >= b.check;
  const onNavy = !light || f >= b.payoff;
  const fadeAll = 1 - ramp(f, b.payoff - 4, b.payoff + 10);
  const nowColor = onNavy ? colors.electric : BLUE;

  // --- The sheet itself (paper on the light table).
  const sheetIn = ramp(f, b.check + 2, b.check + 28);
  const sh = {
    x: lerp(SHEET_B.x, SHEET_M.x, toM2), y: lerp(SHEET_B.y, SHEET_M.y, toM2) + sheetDrop,
    w: lerp(SHEET_B.w, SHEET_M.w, toM2), h: lerp(SHEET_B.h, SHEET_M.h, toM2),
  };
  const sheetOpacity = lerp(0.62, 0.34, toM2);
  const panelsOn = 1 - toM2;

  // --- Step markers (order section).
  const stepAt = [b.s1, b.s2, b.s3, b.s4, b.s5, b.s6];
  const markersOut = 1 - ramp(f, b.size, b.size + 14);
  const stepNames = ['DOUBLE TOP', 'CRASH', 'MANTUL', 'KAPITULASI', 'MANTUL LAGI', 'LOW TERAKHIR'];

  // --- Size section.
  const sizeOut = 1 - ramp(f, b.retrace - 6, b.retrace + 6);
  const base = Y(mNow, 1);
  const crashIn = ramp(f, b.crash, b.crash + 16, ease.out) * sizeOut;
  const rallyIn = ramp(f, b.rally + 18, b.rally + 34, ease.out) * sizeOut;
  const speedIn = ramp(f, b.speed, b.speed + 14, ease.out) * sizeOut;

  // --- Retrace / level section.
  const levelOut = 1 - ramp(f, b.ath - 4, b.ath + 8);
  const retraceIn = ramp(f, b.retrace + 30, b.retrace + 46, ease.out) * levelOut;
  const neverIn = ramp(f, b.never, b.never + 16, ease.out) * levelOut;
  const move = ramp(f, b.level + 4, b.level + 34);
  const rOld = {lo: 1, hi: RALLY.old.hi / LOW_OLD, lv: RALLY.old.pb / LOW_OLD, d: 330};
  const rNow = {lo: 1, hi: RALLY.now.hi / LOW_NOW, lv: LEVEL_NOW / LOW_NOW, d: 96};
  const ruler = {d: lerp(rOld.d, rNow.d, move), hi: Math.exp(lerp(Math.log(rOld.hi), Math.log(rNow.hi), move)), lv: Math.exp(lerp(Math.log(rOld.lv), Math.log(rNow.lv), move))};
  // The ruler steps aside once the level line carries the idea.
  const rulerIn = retraceIn * (1 - ramp(f, b.now - 6, b.now + 8));
  const levelLineIn = ramp(f, b.level + 30, b.level + 44, ease.out) * levelOut;
  const nowIn = ramp(f, b.now, b.now + 14, ease.out) * levelOut;
  const athIn = ramp(f, b.ath + 36, b.ath + 50, ease.out) * fadeAll;
  const oneIn = ramp(f, b.one, b.one + 12, ease.out) * fadeAll;

  const pulse = (at: number) => (f >= at ? 1 + 0.35 * Math.max(0, Math.sin(((f - at) / 30) * Math.PI * 2)) * Math.exp(-(f - at) / 40) : 1);
  const lastX = X(mNow, NOW[NOW.length - 1].d);
  const lastY = Y(mNow, NOW[NOW.length - 1].c);

  return (
    <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{position: 'absolute', inset: 0}} opacity={fadeAll}>
      <defs>
        <filter id="paperShadow" x="-10%" y="-10%" width="120%" height="130%">
          <feDropShadow dx="0" dy="10" stdDeviation="14" floodColor="#101828" floodOpacity="0.16" />
        </filter>
        <clipPath id="stage">
          <rect x={40} y={742} width={1000} height={700} />
        </clipPath>
        {/* Lines never leave the paper: the old chart is clipped to the sheet; today's chart to the stage while it sits
            on the table, closing in to the sheet as the sheet lands on it. */}
        <clipPath id="sheetClip">
          <rect x={sh.x + PAD} y={sh.y + PAD} width={sh.w - 2 * PAD} height={sh.h - 2 * PAD} />
        </clipPath>
        <clipPath id="nowClip">
          <rect x={lerp(40, SHEET_M.x + PAD, toM2)} y={lerp(742, SHEET_M.y + PAD, toM2)} width={lerp(1000, SHEET_M.w - 2 * PAD, toM2)} height={lerp(700, SHEET_M.h - 2 * PAD, toM2)} />
        </clipPath>
      </defs>

      {/* Navy opening: price ticks for today's chart. */}
      {!light &&
        [60000, 80000, 100000, 120000].map((p) => (
          <g key={p} opacity={0.55 * ramp(f, 10, 30)}>
            <line x1={90} x2={950} y1={Y(mNow, p / LOW_NOW)} y2={Y(mNow, p / LOW_NOW)} stroke="#1E3256" strokeWidth={1.5} strokeDasharray="4 8" />
            <Txt x={990} y={Y(mNow, p / LOW_NOW)} size={18} color="#7F93B3" anchor="end" weight={600}>{`$${p / 1000} RB`}</Txt>
          </g>
        ))}

      <g clipPath="url(#stage)">
        {/* Today's chart, named (bottom-right, clear of every step). */}
        {light && <Txt x={92} y={1408} size={20} color={BLUE} anchor="start" weight={800} opacity={ramp(f, b.check + 10, b.check + 24) * (1 - 0.3 * toM2)}>2025–2026 · SEKARANG</Txt>}

        {/* Today's chart (the base of the light table). */}
        <g clipPath="url(#nowClip)">
          <path d={ranges(NOW, mNow, nowUpTo)} stroke={nowColor} strokeWidth={2} opacity={0.22} fill="none" />
          <path d={path(NOW, mNow, nowUpTo)} stroke={nowColor} strokeWidth={3.4} fill="none" strokeLinejoin="round" strokeLinecap="round" />
          {/* The last few weeks, emphasised when the level is reached. */}
          {nowIn > 0 && <path d={path(NOW.filter((p) => p.d >= dayNow('2026-09-21')), mNow, 999)} stroke={BLUE} strokeWidth={7} opacity={0.35 * nowIn} fill="none" strokeLinecap="round" />}
        </g>

        {/* Opening: the last close, pulsing on the claim. */}
        {!light && f > b.hook + 70 && (
          <g>
            <circle cx={lastX} cy={lastY} r={9 * pulse(b.claim)} fill={colors.electric} opacity={0.9} />
            <circle cx={lastX} cy={lastY} r={22 * pulse(b.claim)} fill="none" stroke={colors.electric} strokeWidth={2} opacity={0.5 * ramp(f, b.claim, b.claim + 10)} />
            <Txt x={lastX - 16} y={lastY + 40} size={20} color={colors.text} anchor="end" opacity={ramp(f, b.hook + 70, b.hook + 84)}>{`9 NOV · ${fmt(NOW_LAST.price)}`}</Txt>
          </g>
        )}

        {/* The tracing sheet with the 2021–23 chart. */}
        {light && sheetIn > 0 && (
          <g>
            <rect x={sh.x} y={sh.y} width={sh.w} height={sh.h} rx={6} fill="#FFFFFF" opacity={sheetOpacity} filter="url(#paperShadow)" />
            <rect x={sh.x} y={sh.y} width={sh.w} height={sh.h} rx={6} fill="none" stroke="#B8C0CC" strokeWidth={1.5} opacity={0.9} />
            {/* Tape on the two top corners. */}
            {[sh.x + 26, sh.x + sh.w - 96].map((x, k) => (
              <rect key={k} x={x} y={sh.y - 12} width={70} height={24} fill="#E8DFC8" opacity={0.75} transform={`rotate(${k ? 6 : -6} ${x + 35} ${sh.y})`} />
            ))}
            <Txt x={sh.x + sh.w - 22} y={sh.y + 30} size={20} color={GRAPHITE} anchor="end" weight={800} opacity={(1 - toM2 * 0.3) * (1 - toM3)}>2021–2023 · DULU</Txt>
            <g clipPath="url(#sheetClip)">
              <path d={ranges(OLD, mOldShown, oldUpTo)} stroke={GRAPHITE} strokeWidth={2} opacity={0.2} fill="none" />
              <path d={path(OLD, mOldShown, oldUpTo)} stroke={GRAPHITE} strokeWidth={2.8} fill="none" strokeLinejoin="round" strokeLinecap="round" />
            </g>
          </g>
        )}

        {/* Order: numbered steps on both charts, threaded together. */}
        {light && markersOut > 0.01 &&
          STEPS.map((s, k) => {
            const a = span(f, stepAt[k], b.size + 14, 8, 14);
            if (a <= 0) return null;
            const ox = X(mOldShown, dayOld(s.old.date));
            const oy = Y(mOldShown, s.old.price / LOW_OLD) + (s.old.top ? -26 : 26);
            const nx = X(mNow, dayNow(s.now.date));
            const ny = Y(mNow, s.now.price / LOW_NOW) + (s.now.top ? -26 : 26);
            const pop = interpolate(f, [stepAt[k], stepAt[k] + 6, stepAt[k] + 12], [0.4, 1.18, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
            const extra = k === 0 ? [{o: TOP0.old, n: TOP0.now}] : [];
            return (
              <g key={s.n}>
                <line x1={ox} y1={oy} x2={nx} y2={ny} stroke={GRAPHITE} strokeWidth={1.6} strokeDasharray="5 7" opacity={0.4 * a * markersOut} />
                {extra.map((e, j) => (
                  <g key={j}>
                    <Marker x={X(mOldShown, dayOld(e.o.date))} y={Y(mOldShown, e.o.price / LOW_OLD) - 26} n={1} fill={GRAPHITE} opacity={a * markersOut} scale={pop * 0.86} />
                    <Marker x={X(mNow, dayNow(e.n.date))} y={Y(mNow, e.n.price / LOW_NOW) - 26} n={1} fill={BLUE} opacity={a * markersOut} scale={pop * 0.86} />
                  </g>
                ))}
                <Marker x={ox} y={oy} n={s.n} fill={GRAPHITE} opacity={a * markersOut} scale={pop} />
                <Marker x={nx} y={ny} n={s.n} fill={BLUE} opacity={a * markersOut} scale={pop} />
              </g>
            );
          })}
        {/* The step being named, in the gap between the two charts. */}
        {light && markersOut > 0.01 &&
          stepAt.map((at, k) => {
            const next = stepAt[k + 1] ?? b.size;
            const a = span(f, at, k === 5 ? b.size : next, 4, 4) * markersOut;
            const nx = Math.min(880, Math.max(200, X(mNow, dayNow(STEPS[k].now.date))));
            return <Pill key={k} x={nx} y={1090} text={stepNames[k]} color="#FFFFFF" bg={BLUE} size={20} opacity={a} />;
          })}
        {/* The two final lows, dated. */}
        {light && (
          <g opacity={ramp(f, b.s6 + 6, b.s6 + 18, ease.out) * markersOut}>
            <Txt x={X(mOldShown, 0) - 30} y={Y(mOldShown, 1) + 30} size={18} color={GRAPHITE} anchor="end">21 NOV 2022 · $15.476</Txt>
            <Txt x={X(mNow, 0) - 30} y={Y(mNow, 1) + 28} size={18} color={BLUE} anchor="end">1 JUL 2026 · $57.800</Txt>
          </g>
        )}

        {/* Size: one ruler, both cycles pinned at their final low. */}
        {light && toM2 > 0.5 && sizeOut > 0.01 && (
          <g opacity={ramp(f, b.size + 30, b.size + 42) * sizeOut}>
            <line x1={70} x2={1000} y1={base} y2={base} stroke={INK} strokeWidth={1.5} strokeDasharray="3 7" opacity={0.45} />
            <Pill x={X(mNow, 0)} y={base + 30} text="LOW TERAKHIR = TITIK 0" size={17} color={INK} bg="#FFFFFF" border="#C7CDD6" opacity={1 - ramp(f, b.speed - 6, b.speed + 4)} />
          </g>
        )}
        {light && crashIn > 0.01 && (
          <g opacity={crashIn}>
            {[
              {d: dayOld(STEPS[0].old.date), r: STEPS[0].old.price / LOW_OLD, c: GRAPHITE, t: '−78%', who: 'DULU'},
              {d: dayNow(STEPS[0].now.date), r: STEPS[0].now.price / LOW_NOW, c: BLUE, t: '−54%', who: 'SEKARANG'},
            ].map((k, j) => {
              const x = X(mNow, k.d) + (j ? 0 : 0);
              const y1 = Y(mNow, k.r);
              const grow = ramp(f, b.crash + j * 6, b.crash + 16 + j * 6, ease.out);
              return (
                <g key={j}>
                  <line x1={x} x2={x} y1={y1} y2={lerp(y1, base, grow)} stroke={k.c} strokeWidth={4} />
                  <line x1={x - 12} x2={x + 12} y1={y1} y2={y1} stroke={k.c} strokeWidth={4} />
                  <line x1={x - 12} x2={x + 12} y1={base} y2={base} stroke={k.c} strokeWidth={4} opacity={grow} />
                  <Pill x={x + (j ? 70 : -70)} y={(y1 + base) / 2} text={k.t} color="#FFFFFF" bg={RED} size={24} opacity={grow} />
                  <Txt x={x + (j ? 70 : -70)} y={(y1 + base) / 2 + 34} size={16} color={k.c} opacity={grow}>{k.who}</Txt>
                </g>
              );
            })}
          </g>
        )}
        {light && rallyIn > 0.01 && (
          <g opacity={rallyIn}>
            {[
              {d: dayOld(RALLY.old.hiDate), r: RALLY.old.hi / LOW_OLD, c: GRAPHITE, t: '+105%', who: 'DULU · 13 JUL 2023'},
              {d: dayNow(RALLY.now.hiDate), r: RALLY.now.hi / LOW_NOW, c: BLUE, t: '+51%', who: 'SEKARANG · 21 SEP 2026'},
            ].map((k, j) => {
              const x = X(mNow, k.d) + 22;
              const y1 = Y(mNow, k.r);
              return (
                <g key={j}>
                  <line x1={x} x2={x} y1={base} y2={y1} stroke={k.c} strokeWidth={4} />
                  <line x1={x - 12} x2={x + 12} y1={y1} y2={y1} stroke={k.c} strokeWidth={4} />
                  <Pill x={x - 66} y={y1 - 30} text={k.t} color="#FFFFFF" bg={GREEN} size={24} />
                  <Txt x={x - 66} y={y1 - 62} size={15} color={k.c}>{k.who}</Txt>
                </g>
              );
            })}
          </g>
        )}
        {light && speedIn > 0.01 && (
          <g opacity={speedIn}>
            {[
              {d: 234, c: GRAPHITE, t: '234 HARI', y: base + 66},
              {d: 82, c: BLUE, t: '82 HARI', y: base + 100},
            ].map((k, j) => {
              const x0 = X(mNow, 0);
              const x1 = lerp(x0, X(mNow, k.d), ramp(f, b.speed + j * 5, b.speed + 18 + j * 5, ease.out));
              return (
                <g key={j}>
                  <line x1={x0} x2={x1} y1={k.y} y2={k.y} stroke={k.c} strokeWidth={5} strokeLinecap="round" />
                  <Txt x={x0 - 14} y={k.y} size={19} color={k.c} anchor="end">{k.t}</Txt>
                </g>
              );
            })}
          </g>
        )}

        {/* Retrace: the 2023 ruler (high → 42% → low), carried onto today's rally. */}
        {light && rulerIn > 0.01 && (() => {
          const m = mNow;
          const x = X(m, ruler.d);
          const yHi = Y(m, ruler.hi);
          const yLo = Y(m, 1);
          const yLv = Y(m, ruler.lv);
          const c = move > 0.5 ? BLUE : GRAPHITE;
          return (
            <g opacity={rulerIn}>
              <rect x={x - 9} y={yHi} width={18} height={yLo - yHi} fill={c} opacity={0.12} rx={4} />
              <line x1={x} x2={x} y1={yHi} y2={yLo} stroke={c} strokeWidth={3} />
              {[yHi, yLo].map((y, k) => <line key={k} x1={x - 16} x2={x + 16} y1={y} y2={y} stroke={c} strokeWidth={3} />)}
              <line x1={x - 22} x2={x + 22} y1={yLv} y2={yLv} stroke={RED} strokeWidth={5} />
              <Pill x={x - 58} y={yLv - 32} text="42%" color="#FFFFFF" bg={RED} size={22} />
              <Txt x={x} y={yHi - 22} size={15} color={c}>PUNCAK RALLY</Txt>
            </g>
          );
        })()}
        {/* 2023's pullback low and "never that cheap again". */}
        {light && retraceIn > 0.01 && (
          <g opacity={retraceIn * (1 - 0.55 * move)}>
            <circle cx={X(mOldShown, dayOld(RALLY.old.pbDate))} cy={Y(mOldShown, RALLY.old.pb / LOW_OLD)} r={9} fill={GRAPHITE} stroke="#FFFFFF" strokeWidth={3} />
            <Txt x={X(mOldShown, dayOld(RALLY.old.pbDate))} y={Y(mOldShown, RALLY.old.pb / LOW_OLD) + 30} size={17} color={GRAPHITE}>11 SEP 2023 · $24.901</Txt>
          </g>
        )}
        {light && neverIn > 0.01 && (() => {
          const y = Y(mOldShown, RALLY.old.pb / LOW_OLD);
          const x0 = X(mOldShown, dayOld(RALLY.old.pbDate));
          const x1 = lerp(x0, 1000, ramp(f, b.never, b.never + 20, ease.out));
          return (
            <g opacity={neverIn * (1 - 0.55 * move)}>
              <line x1={x0} x2={x1} y1={y} y2={y} stroke={GRAPHITE} strokeWidth={2.5} strokeDasharray="8 6" />
            </g>
          );
        })()}
        {light && levelLineIn > 0.01 && (() => {
          const y = Y(mNow, LEVEL_NOW / LOW_NOW);
          const x0 = X(mNow, 82);
          const x1 = lerp(x0, 1000, ramp(f, b.level + 30, b.level + 50, ease.out));
          return (
            <g opacity={levelLineIn}>
              <line x1={x0} x2={x1} y1={y} y2={y} stroke={BLUE} strokeWidth={3} strokeDasharray="10 6" />
              <Pill x={960} y={y - 32} text="42% ≈ $74.900" anchor="end" color="#FFFFFF" bg={BLUE} size={22} />
            </g>
          );
        })()}
        {light && nowIn > 0.01 && (() => {
          const xl = X(mNow, dayNow(NOW_LOW.date));
          const yl = Y(mNow, NOW_LOW.price / LOW_NOW);
          const xc = X(mNow, dayNow(NOW_LAST.date));
          const yc = Y(mNow, NOW_LAST.price / LOW_NOW);
          return (
            <g opacity={nowIn}>
              <circle cx={xl} cy={yl} r={8 * pulse(b.now + 40)} fill={RED} stroke="#FFFFFF" strokeWidth={3} />
              <circle cx={xc} cy={yc} r={9 * pulse(b.now)} fill={BLUE} stroke="#FFFFFF" strokeWidth={3} />
              <Pill x={xl + 20} y={yl + 40} text="8 NOV · SEMPAT $73.510 (47%)" anchor="start" color="#FFFFFF" bg={RED} size={18} opacity={ramp(f, b.now + 40, b.now + 52)} />
              <Pill x={xc + 20} y={yc - 70} text="9 NOV · TUTUP $75.368" anchor="start" color="#FFFFFF" bg={BLUE} size={18} />
            </g>
          );
        })()}

        {/* ATH, 179 days after the 2023 pullback low; and the caveat. */}
        {light && athIn > 0.01 && (() => {
          const xa = X(mOldShown, dayOld(ATH.date));
          const ya = Y(mOldShown, ATH.price / LOW_OLD);
          const xp = X(mOldShown, dayOld(RALLY.old.pbDate));
          const yb = Y(mOldShown, 0.97);
          return (
            <g opacity={athIn}>
              <circle cx={xa} cy={ya} r={10} fill={GRAPHITE} stroke="#FFFFFF" strokeWidth={3} />
              <Pill x={xa - 14} y={ya + 4} text="ATH BARU · 8 MAR 2024" anchor="end" color="#FFFFFF" bg={GRAPHITE} size={18} />
              <line x1={xp} x2={xa} y1={yb} y2={yb} stroke={GRAPHITE} strokeWidth={5} strokeLinecap="round" />
              <line x1={xp} x2={xp} y1={yb - 12} y2={yb + 12} stroke={GRAPHITE} strokeWidth={3} />
              <line x1={xa} x2={xa} y1={yb - 12} y2={yb + 12} stroke={GRAPHITE} strokeWidth={3} />
              <Txt x={(xp + xa) / 2} y={yb + 28} size={18} color={GRAPHITE}>179 HARI · +181%</Txt>
            </g>
          );
        })()}
        {light && oneIn > 0.01 && (
          <g opacity={oneIn} transform={`rotate(-4 300 900)`}>
            <rect x={130} y={866} width={330} height={68} rx={10} fill="none" stroke={RED} strokeWidth={4} />
            <Txt x={295} y={901} size={30} color={RED} weight={800}>1 CONTOH</Txt>
          </g>
        )}
      </g>
    </svg>
  );
};
