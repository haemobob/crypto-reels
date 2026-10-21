import type {ReactNode} from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import captions from '../../../episodes/btc-mirip-2023/captions.json';
import data from '../../../episodes/btc-mirip-2023/data/chart-data.json';
import config from '../../../episodes/btc-mirip-2023/episode.json';
import {Candles, LevelLine, ScenarioPath, TracePath, scaleFor, type Candle, type ChartFrame} from '../../components/CandleChart';
import {Ground} from '../../components/Ground';
import {Hi} from '../../components/Headline';
import {HeadlineTrack} from '../../components/HeadlineTrack';
import {Sfx} from '../../components/Sfx';
import {cameraAt, cameraTransform, type CamKey} from '../../lib/camera';
import {useCues} from '../../lib/cues';
import type {EpisodeModule} from '../../lib/episode-module';
import type {Captions, EpisodeConfig} from '../../lib/types';
import {colors} from '../../theme/colors';
import {ease} from '../../theme/motion';
import {fonts} from '../../theme/typography';

// Layout (screen px). Headlines own 470–690, the chart stage owns 700–1520, the source line sits at 1530.
const HEADLINE_Y = 585;
const STAGE = {top: 700, w: 1080, h: 820};
const SOURCE_Y = 1534;

// Both panels share one log scale span (equal height = equal % move) and one week grid (t = weeks since the low).
const T_MIN = -3;
const T_MAX = 21;
const SPAN_LO = 0.9;
const SPAN_HI = 2.1;
const panelFrame = (panelX: number, low: number): ChartFrame => ({
  x0: panelX + 44,
  y0: 124,
  width: 391,
  height: 572,
  tMin: T_MIN,
  tMax: T_MAX,
  pMin: low * SPAN_LO,
  pMax: low * SPAN_HI,
});
const LEFT_X = 90;
const RIGHT_X = 555;

const p23 = data.p2023;
const p26 = data.p2026;
const f23 = panelFrame(LEFT_X, p23.levels.low);
const f26 = panelFrame(RIGHT_X, p26.levels.low);
const c23: Candle[] = p23.candles;
const c26: Candle[] = p26.candles;

const usd = (n: number) => `$${Math.round(n).toLocaleString('id-ID')}`;
const pct = (a: number, b: number) => `${((b / a - 1) * 100).toFixed(1).replace('.', ',').replace('-', '−')}%`;
const fade = (frame: number, from: number, len = 10) =>
  interpolate(frame, [from, from + len], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease.out});
const fadeOut = (frame: number, at: number, len = 10) =>
  interpolate(frame, [at, at + len], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

const cueFrame = (name: keyof typeof captions.cues) => Math.round(captions.cues[name] * 30);

/** Numbered phase marker on the chart; the legend in the headline zone names it. */
const Marker = ({x, y, n, o}: {x: number; y: number; n: number; o: number}) =>
  o <= 0 ? null : (
    <g opacity={o} transform={`translate(${x} ${y}) scale(${0.6 + 0.4 * o})`}>
      <circle r={15} fill={colors.blue} />
      <text y={7} textAnchor="middle" fill="#fff" fontFamily={fonts.heading} fontWeight={800} fontSize={19}>
        {n}
      </text>
    </g>
  );

type PanelState = {
  frame: number;
  reveal: number;
  trace: number;
  traceGlow: number;
  traceOpacity: number;
  marks: {low: number; base: number; breakout: number; high: number; pullback: number};
  week12: number;
  week15: number;
  depth: number;
  opacity: number;
};

/** One chart panel: title, grid, week axis, candles and the phase annotations shared by both periods. */
const Panel = ({x, title, sub, f, candles, p, gridPrices, s, children}: {
  x: number;
  title: string;
  sub: string;
  f: ChartFrame;
  candles: Candle[];
  p: typeof p23 | typeof p26;
  gridPrices: number[];
  s: PanelState;
  children?: ReactNode;
}) => {
  const sc = scaleFor(f);
  const lv = p.levels;
  const ph = p.phases;
  const chartIn = fade(s.frame, 40, 16);
  const highK = candles.find((k) => k.t === ph.high)!;
  const pbK = candles.find((k) => k.t === ph.pullbackLow)!;
  const brK = candles.find((k) => k.t === ph.breakout)!;
  const weekTicks = [0, 4, 8, 12, 16, 20];
  return (
    <g opacity={s.opacity}>
      <g opacity={chartIn}>
        <text x={f.x0} y={62} fill={colors.text} fontFamily={fonts.heading} fontWeight={800} fontSize={38}>
          {title}
        </text>
        <text x={f.x0} y={92} fill={colors.muted} fontFamily={fonts.body} fontWeight={500} fontSize={21}>
          {sub}
        </text>
        {gridPrices.map((g) => (
          <g key={g}>
            <line x1={f.x0} x2={f.x0 + f.width} y1={sc.y(g)} y2={sc.y(g)} stroke="#17233A" strokeWidth={1.5} />
            <text x={x} y={sc.y(g) + 6} fill="#5E708C" fontFamily={fonts.mono} fontSize={17}>
              {g >= 1000 ? `${g / 1000}K` : g}
            </text>
          </g>
        ))}
        {weekTicks.filter((t) => !(t === 16 && s.week15 > 0)).map((t) => (
          <text
            key={t}
            x={sc.x(t)}
            y={f.y0 + f.height + 34}
            textAnchor="middle"
            fill={t === 12 && s.week12 > 0 ? colors.electric : '#6F83A3'}
            fontFamily={fonts.mono}
            fontWeight={t === 12 && s.week12 > 0 ? 800 : 500}
            fontSize={t === 12 && s.week12 > 0 ? 26 : 22}
          >
            {t}
          </text>
        ))}
        {s.week15 > 0 && (
          <text x={sc.x(15)} y={f.y0 + f.height + 34} textAnchor="middle" fill={colors.electric} fontFamily={fonts.mono} fontWeight={800} fontSize={26} opacity={s.week15}>
            15
          </text>
        )}
        <text x={f.x0 + f.width / 2} y={f.y0 + f.height + 66} textAnchor="middle" fill="#5E708C" fontFamily={fonts.body} fontWeight={500} fontSize={20}>
          minggu sejak titik rendah
        </text>
      </g>

      {/* Timing guides: week 12 (peak) and week 15 (pullback low). */}
      {[
        [12, s.week12],
        [15, s.week15],
      ].map(([t, o]) =>
        o > 0 ? (
          <line key={t} x1={sc.x(t)} x2={sc.x(t)} y1={f.y0} y2={f.y0 + f.height + 8} stroke={colors.light} strokeWidth={2} strokeDasharray="6 7" opacity={0.75 * o} />
        ) : null,
      )}

      {/* Base: the consolidation box, weeks 0–6, from the low to the base top. */}
      {s.marks.base > 0 && (
        <rect
          x={sc.x(ph.baseFrom) - sc.slot / 2}
          y={sc.y(lv.baseTop)}
          width={(sc.x(ph.baseTo) - sc.x(ph.baseFrom) + sc.slot) * s.marks.base}
          height={sc.y(lv.low) - sc.y(lv.baseTop)}
          fill={colors.blue}
          fillOpacity={0.14}
          stroke={colors.light}
          strokeOpacity={0.55}
          strokeWidth={2}
          strokeDasharray="5 6"
        />
      )}

      <Candles candles={candles} frame={f} reveal={s.reveal} />
      <g opacity={s.traceOpacity}>
        <TracePath candles={candles.filter((k) => k.t <= (p === p23 ? 15 : 16))} frame={f} progress={s.trace} glow={s.traceGlow} />
      </g>

      <Marker x={sc.x(0)} y={sc.y(lv.low) + 34} n={1} o={s.marks.low} />
      <Marker x={sc.x(ph.baseFrom) - sc.slot / 2 + 4} y={sc.y(lv.baseTop) - 24} n={2} o={s.marks.base} />
      <Marker x={sc.x(ph.breakout)} y={sc.y(brK.h) - 26} n={3} o={s.marks.breakout} />
      <Marker x={sc.x(ph.high)} y={sc.y(highK.h) - 26} n={4} o={s.marks.high} />
      <Marker x={sc.x(ph.pullbackLow)} y={sc.y(pbK.l) + 34} n={5} o={s.marks.pullback} />

      {/* Pullback depth, in the empty weeks to the right of the pullback. */}
      {s.depth > 0 && (
        <g opacity={s.depth}>
          <text x={sc.x(17) - 4} y={(sc.y(lv.high) + sc.y(lv.pullbackLow)) / 2 + 10} fill={colors.negative} fontFamily={fonts.mono} fontWeight={800} fontSize={26}>
            {pct(lv.high, lv.pullbackLow)}
          </text>
        </g>
      )}
      {children}
    </g>
  );
};

/** Opening statement: centred on black at frame 0, then rises into the headline zone as the charts arrive. */
const OpeningTitle = ({until}: {until: number}) => {
  const frame = useCurrentFrame();
  if (frame >= until) return null;
  const rise = interpolate(frame, [-6, 10], [0, 1], {extrapolateRight: 'clamp', easing: ease.out});
  const move = interpolate(frame, [26, 46], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease.inOut});
  const y = 960 + (HEADLINE_Y - 960) * move + (1 - rise) * 60;
  const size = 104 - 24 * move;
  return (
    <div
      style={{
        position: 'absolute',
        left: 90,
        right: 90,
        top: y,
        transform: 'translateY(-50%)',
        opacity: interpolate(rise, [0, 0.4], [0, 1], {extrapolateRight: 'clamp'}) * fadeOut(frame, until - 7, 6),
        textAlign: 'center',
        fontFamily: fonts.heading,
        fontWeight: 800,
        fontSize: size,
        lineHeight: 1.02,
        letterSpacing: '-0.02em',
        color: colors.text,
      }}
    >
      BITCOIN SEKARANG
      <br />
      MIRIP <Hi>2023?</Hi>
    </div>
  );
};

/** Phase legend in the headline zone: each phase lights up as it is named; earlier ones stay, muted. */
const PhaseLegend = ({items, from, until}: {items: Array<{n: number; label: string; at: number}>; from: number; until: number}) => {
  const frame = useCurrentFrame();
  if (frame < from || frame >= until) return null;
  const out = fadeOut(frame, until - 7, 6);
  const rows = [items.slice(0, 2), items.slice(2, 4), items.slice(4)];
  const current = items.findLast((it) => frame >= it.at)?.n;
  return (
    <div style={{position: 'absolute', left: 90, right: 90, top: HEADLINE_Y, transform: 'translateY(-50%)', opacity: out, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14}}>
      {rows.map((row, i) => (
        <div key={i} style={{display: 'flex', gap: 34, justifyContent: 'center'}}>
          {row.map((it) => {
            const o = fade(frame, it.at, 8);
            return (
              <div key={it.n} style={{display: 'flex', alignItems: 'center', gap: 12, opacity: o, transform: `translateY(${(1 - o) * 20}px)`}}>
                <div style={{width: 44, height: 44, borderRadius: 22, background: colors.blue, color: '#fff', fontFamily: fonts.heading, fontWeight: 800, fontSize: 26, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                  {it.n}
                </div>
                <div style={{fontFamily: fonts.heading, fontWeight: 800, fontSize: 44, letterSpacing: '-0.01em', color: it.n === current ? colors.text : '#6F83A3'}}>{it.label}</div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

const Sub = ({children, color = colors.muted}: {children: ReactNode; color?: string}) => (
  <div style={{fontFamily: fonts.mono, fontWeight: 600, fontSize: 26, letterSpacing: '0.06em', color, marginTop: 14, textTransform: 'uppercase'}}>{children}</div>
);

const Scene = () => {
  const frame = useCurrentFrame();
  const {cue, word, narrationEnd} = useCues();
  const C = cue('caution');
  const B = cue('bottom');
  const BASE = cue('base');
  const BR = cue('breakout');
  const HI = word('kuat');
  const P = cue('pullback');
  const T = cue('timing');
  const T2 = cue('timing2');
  const D = cue('depth');
  const K = cue('key2023');
  const L23 = cue('level2023');
  const N = cue('keynow');
  const R = cue('reclaim');
  const F = cue('fail');
  const TK = cue('takeaway');
  const V = cue('validate');
  const CL = cue('closing');
  const END = narrationEnd + 18;

  // Camera over the whole chart stage: gentle push-ins on the phases, then the hero move from 2023 into today's chart.
  const cx = STAGE.w / 2;
  const cy = STAGE.h / 2;
  const keys: CamKey[] = [
    {f: 0, x: cx, y: cy, s: 1},
    {f: 46, x: cx, y: cy, s: 1},
    {f: C, x: cx, y: cy, s: 1.04},
    {f: B, x: cx, y: cy, s: 1.04},
    {f: B + 24, x: cx, y: cy - 2, s: 1.07},
    {f: BR, x: cx, y: cy - 2, s: 1.07},
    {f: BR + 22, x: cx, y: cy - 4, s: 1.05},
    {f: T, x: cx, y: cy - 4, s: 1.05},
    {f: T + 18, x: cx, y: cy, s: 1},
    {f: K, x: cx, y: cy, s: 1},
    {f: K + 30, x: 330, y: 300, s: 2},
    {f: N, x: 330, y: 300, s: 2},
    {f: N + 24, x: cx, y: 380, s: 1.15},
    {f: N + 50, x: 810, y: 320, s: 2},
    {f: F, x: 810, y: 320, s: 2},
    {f: F + 22, x: 810, y: 345, s: 1.9},
    {f: CL - 30, x: 810, y: 345, s: 1.9},
    {f: CL, x: cx, y: cy, s: 1},
    {f: END, x: cx, y: cy - 6, s: 1.03},
  ];
  const cam = cameraAt(frame, keys);

  const reveal23 = Math.min(interpolate(frame, [46, 110], [T_MIN, 16]), 16) + interpolate(frame, [K + 40, K + 100], [0, 6], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease.inOut});
  const reveal26 = interpolate(frame, [46, 112], [T_MIN, 17], {extrapolateRight: 'clamp'});
  const traceOpacity = interpolate(frame, [B, B + 12, P, P + 12], [1, 0.4, 0.4, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const leftOpacity = interpolate(frame, [N, N + 20, CL - 10, CL + 10], [1, 0.22, 0.22, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const rightOpacity = interpolate(frame, [K, K + 20, N, N + 20], [1, 0.22, 0.22, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const annotationsOut = fadeOut(frame, K, 14);

  const shared = (opacity: number, isLeft: boolean): PanelState => ({
    frame,
    reveal: isLeft ? reveal23 : reveal26,
    trace: interpolate(frame, isLeft ? [C + 12, C + 62] : [C + 42, C + 92], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease.inOut}),
    traceGlow: interpolate(frame, isLeft ? [C + 12, C + 62, C + 92] : [C + 42, C + 92, C + 122], [1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
    traceOpacity,
    marks: {
      low: fade(frame, B, 10) * annotationsOut,
      base: fade(frame, BASE, 14) * annotationsOut,
      breakout: fade(frame, BR, 10) * annotationsOut,
      high: fade(frame, HI, 10) * annotationsOut,
      pullback: fade(frame, P, 10) * annotationsOut,
    },
    week12: fade(frame, T, 10) * annotationsOut,
    week15: fade(frame, T2, 10) * annotationsOut,
    depth: fade(frame, D, 10) * annotationsOut,
    opacity,
  });

  // 2023: the rebound high, then the reclaim and what followed.
  const s23 = scaleFor(f23);
  const line23 = interpolate(frame, [K + 6, K + 34], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease.out});
  const reclaimMark = fade(frame, K + 60, 12);
  const reclaimK = c23.find((k) => k.t === p23.phases.reclaim)!;
  // Today: the same level, where price sits now, and two labelled scenarios.
  const s26 = scaleFor(f26);
  const line26 = interpolate(frame, [N + 38, N + 64], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease.out});
  const nowK = c26[c26.length - 1];
  const pulse = 1 + 0.25 * Math.max(0, Math.sin(((frame - N) / 30) * Math.PI * 2));
  const scenA = interpolate(frame, [R + 8, R + 50], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const scenB = interpolate(frame, [F + 6, F + 48], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const last = nowK.c;
  const pathA: Array<[number, number]> = [[16, last], [17, 85600], [18, 89300], [19, 92200], [20, 94600]];
  const pathB: Array<[number, number]> = [[16, last], [16.8, 86200], [17.6, 83400], [18.6, 79200], [20, 75200]];

  const thesisOn = frame >= TK && frame < CL;
  const sourceText =
    frame >= CL
      ? 'BUKAN NASIHAT FINANSIAL · DATA BINANCE PER 21 OKT 2026'
      : 'BTC/USDT · CANDLE MINGGUAN · SKALA LOG · BINANCE · DATA PER 21 OKT 2026';

  return (
    <Ground polarity="dark">
      {/* Chart stage: a fixed window the camera moves inside. */}
      <div style={{position: 'absolute', left: 0, top: STAGE.top, width: STAGE.w, height: STAGE.h, overflow: 'hidden'}}>
        <svg width={STAGE.w} height={STAGE.h} viewBox={`0 0 ${STAGE.w} ${STAGE.h}`}>
          <g transform={cameraTransform(cam, STAGE.w, STAGE.h)}>
            <Panel x={LEFT_X} title="2023" sub="Nov 2022 – Apr 2023" f={f23} candles={c23} p={p23} gridPrices={[15000, 20000, 25000, 30000]} s={shared(leftOpacity, true)}>
              <LevelLine frame={f23} price={p23.levels.high} progress={line23} label="PUNCAK REBOUND" />
              {frame >= L23 && (
                <text x={f23.x0 + 4} y={s23.y(p23.levels.high) - 44} fill={colors.blue} fontFamily={fonts.mono} fontWeight={800} fontSize={26} opacity={fade(frame, L23, 8)}>
                  {usd(p23.levels.high)}
                </text>
              )}
              {reclaimMark > 0 && <circle cx={s23.x(reclaimK.t)} cy={s23.y(p23.levels.high)} r={13 * reclaimMark} fill="none" stroke={colors.positive} strokeWidth={3.5} />}
            </Panel>
            <Panel x={RIGHT_X} title="SEKARANG" sub="Jun – Okt 2026" f={f26} candles={c26} p={p26} gridPrices={[60000, 70000, 80000, 90000, 100000, 110000]} s={shared(rightOpacity, false)}>
              <LevelLine frame={f26} price={p26.levels.high} progress={line26} label={`LEVEL KUNCI · ${usd(p26.levels.high)}`} />
              {frame >= N + 40 && <circle cx={s26.x(nowK.t)} cy={s26.y(last)} r={7 * pulse} fill={colors.text} opacity={fade(frame, N + 40, 10)} />}
              <ScenarioPath frame={f26} points={pathA} progress={scenA} color={colors.electric} />
              <ScenarioPath frame={f26} points={pathB} progress={scenB} color={colors.negative} />
              {scenA > 0.6 && (
                <text x={f26.x0 + f26.width} y={s26.y(97000)} textAnchor="end" fill={colors.electric} fontFamily={fonts.mono} fontWeight={700} fontSize={19} opacity={fade(frame, R + 30, 10)}>
                  SKENARIO A
                </text>
              )}
              {scenB > 0.6 && (
                <text x={f26.x0 + f26.width} y={s26.y(72500)} textAnchor="end" fill={colors.negative} fontFamily={fonts.mono} fontWeight={700} fontSize={19} opacity={fade(frame, F + 30, 10)}>
                  SKENARIO B
                </text>
              )}
            </Panel>
          </g>
        </svg>
      </div>

      {cam.s > 1.5 && (
        <div style={{position: 'absolute', left: 100, top: STAGE.top + 22, fontFamily: fonts.heading, fontWeight: 800, fontSize: 34, color: colors.text, opacity: interpolate(cam.s, [1.5, 1.9], [0, 1], {extrapolateRight: 'clamp'})}}>
          {frame < N + 12 ? '2023' : 'SEKARANG'}
        </div>
      )}
      <OpeningTitle until={C} />
      <PhaseLegend
        from={B}
        until={T}
        items={[
          {n: 1, label: 'TITIK RENDAH', at: B},
          {n: 2, label: 'KONSOLIDASI', at: BASE},
          {n: 3, label: 'BREAKOUT', at: BR},
          {n: 4, label: 'PUNCAK', at: HI},
          {n: 5, label: 'PULLBACK', at: P},
        ]}
      />
      <HeadlineTrack
        centerY={HEADLINE_Y}
        until={END}
        cues={[
          {from: C, content: <>MIRIP <Hi>≠</Hi> PASTI SAMA</>, size: 84},
          {from: B, content: null},
          {from: T, content: <>PUNCAK: <Hi>MINGGU 12</Hi></>},
          {from: T2, content: <>PULLBACK: <Hi>MINGGU 15</Hi></>},
          {from: D, content: <>BEDANYA: <span style={{color: colors.negative}}>KEDALAMAN</span><Sub>−22,6% vs −8,7%</Sub></>},
          {from: K, content: <>2023: NAIK SETELAH <Hi>RECLAIM</Hi> PUNCAK<div style={{opacity: fade(frame, K + 60, 10)}}><Sub>RECLAIM: 17 MAR 2023 · LALU KE $31.000</Sub></div></>, size: 70},
          {from: N, content: <>LEVEL KUNCI: <Hi>~$87.400</Hi><Sub>SEKARANG {usd(last)} · 21 OKT 2026</Sub></>, size: 72},
          {from: R, content: <>RECLAIM → ANALOGI <Hi>MENGUAT</Hi><Sub>SKENARIO A · BUKAN PREDIKSI</Sub></>, size: 64},
          {from: F, content: <>GAGAL → ANALOGI <span style={{color: colors.negative}}>MELEMAH</span><Sub>SKENARIO B · BUKAN PREDIKSI</Sub></>, size: 64},
          {from: TK, content: null},
          {from: CL, content: <>CHART MIRIP <Hi>≠</Hi> HASIL SAMA</>, size: 80},
        ]}
      />

      <div style={{position: 'absolute', left: 90, right: 90, top: SOURCE_Y, textAlign: 'center', fontFamily: fonts.mono, fontWeight: 500, fontSize: 19, letterSpacing: '0.04em', color: '#6F83A3', opacity: fade(frame, 46, 16)}}>
        {sourceText}
      </div>

      {/* Takeaway: polarity flip to off-white, everything else removed. */}
      {thesisOn && (
        <AbsoluteFill style={{backgroundColor: colors.offWhite, justifyContent: 'center', alignItems: 'center', padding: '0 100px'}}>
          <div style={{fontFamily: fonts.heading, fontWeight: 800, fontSize: 92, lineHeight: 1.06, textAlign: 'center', color: colors.ink, letterSpacing: '-0.02em'}}>
            <div style={{opacity: fade(frame, TK, 12), filter: `blur(${(1 - fade(frame, TK, 12)) * 16}px)`}}>POLA MEMBERI KONTEKS.</div>
            <div style={{marginTop: 30, opacity: fade(frame, V, 12), filter: `blur(${(1 - fade(frame, V, 12)) * 16}px)`}}>
              LEVEL MEMBERI <span style={{color: colors.blue}}>VALIDASI.</span>
            </div>
          </div>
        </AbsoluteFill>
      )}

      <Sfx name="hit" at={0} volume={0.3} />
      <Sfx name="whoosh" at={30} volume={0.22} />
      {[B, BASE, BR, HI, P, T, T2, D, R, F].map((f) => (
        <Sfx key={f} name="tick" at={f} volume={0.32} />
      ))}
      <Sfx name="whoosh" at={K + 2} volume={0.28} />
      <Sfx name="ping" at={K + 8} volume={0.35} />
      <Sfx name="tick" at={K + 62} volume={0.32} />
      <Sfx name="whoosh" at={N} volume={0.32} />
      <Sfx name="ping" at={N + 40} volume={0.35} />
      <Sfx name="hit" at={TK} volume={0.28} />
      <Sfx name="whoosh" at={CL - 4} volume={0.22} />
    </Ground>
  );
};

const episode: EpisodeModule = {
  config: config as EpisodeConfig,
  captions: captions as Captions,
  Scene,
  captionMute: [[cueFrame('takeaway'), cueFrame('closing')]],
  logoHide: [[cueFrame('takeaway'), cueFrame('closing')]],
};
export default episode;
