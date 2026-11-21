import type {ReactNode} from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import captions from '../../../episodes/tiga-hammer/captions.json';
import config from '../../../episodes/tiga-hammer/episode.json';
import hammers from '../../../episodes/tiga-hammer/evidence/hammers-btc.json';
import {ACTOR, Actor, Pill, SentenceTrack, type Pose} from '../../components/actors';
import {seam} from '../../components/motion';
import {cameraCss, cameraSpline, type CamKey} from '../../lib/camera';
import {useCues} from '../../lib/cues';
import type {EpisodeModule} from '../../lib/episode-module';
import type {Captions, EpisodeConfig} from '../../lib/types';
import {ease} from '../../theme/motion';
import {fonts} from '../../theme/typography';
import data from './candles.json';
import {Cover} from './Cover';
import {Sound} from './Sound';

/**
 * tiga-hammer: three real BTC H1 hammers of near-identical shape (Binance), opened on 5 m. Pictogram-actor style
 * (reference/pictogram-storytelling-study.md): three traders, each candle replayed from its real 5 m path and acted out
 * by who won each 5 minutes, the swept level as a line of stop orders, the last lower high as a gate. Black ground,
 * white actors, brand blue as the only accent; red only for a loss. The camera travels on a spline in every stage
 * (it never parks), and every subject moves on the word that names it.
 */
type K = [number, number, number, number, number, number];
type Key = 'A' | 'B' | 'C';
type Pick = {utc: string; h1: K; m5: K[]; after6h: K[]; levels: {low12: number; equalLow: number | null; lowerHigh: number | null; lowerHighAt: number | null; lowAt: number; closeAboveLH: boolean}};
type OHLC = {o: number; h: number; l: number; c: number};
const D = data as unknown as Record<Key, Pick>;
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const ramp = (f: number, a: number, b: number, e = ease.out) => (b <= a ? (f >= a ? 1 : 0) : interpolate(f, [a, b], [0, 1], {...clamp, easing: e}));
const BLUE = ACTOR.blue;
const RED = ACTOR.red;
const GROUND = 1330;
const STATIONS: Array<{k: Key; x: number; date: string}> = [
  {k: 'A', x: 220, date: '2 SEP 2026 · 01:00 WIB'},
  {k: 'B', x: 540, date: '17 JUL 2026 · 20:00 WIB'},
  {k: 'C', x: 860, date: '15 OKT 2026 · 09:00 WIB'},
];
const fmt = (n: number) => n.toLocaleString('id-ID', {maximumFractionDigits: 0});
const pctText = (v: number) => `${v >= 0 ? '+' : '−'}${Math.abs(v).toFixed(1).replace('.', ',')}%`;
const key = (f: number, x: number, y: number, s: number): CamKey => ({f, x, y, s});

// ---------------------------------------------------------------------------------------------------------------
// Replaying real bars: a bar's price path runs open → low → high → close (up bar) or open → high → low → close.

const pathOf = (b: K) => (b[4] >= b[1] ? [b[1], b[3], b[2], b[4]] : [b[1], b[2], b[3], b[4]]);
/** A bar `u` (0..1) of the way through its life: its open, the extremes reached so far, and the price now. */
const partial = (b: K, u: number): OHLC => {
  if (u >= 1) return {o: b[1], h: b[2], l: b[3], c: b[4]};
  const p = pathOf(b);
  const x = Math.max(0, u) * 3;
  const seg = Math.min(2, Math.floor(x));
  const c = p[seg] + (p[seg + 1] - p[seg]) * (x - seg);
  let h = Math.max(p[0], c);
  let l = Math.min(p[0], c);
  for (let s = 1; s <= seg; s++) {
    h = Math.max(h, p[s]);
    l = Math.min(l, p[s]);
  }
  return {o: b[1], h, l, c};
};
/** Bars replayed as one candle, `prog` bars done (fractional): what the H1 candle looked like mid-hour. */
const aggregate = (bars: K[], prog: number): OHLC => {
  const o = bars[0][1];
  let h = o;
  let l = o;
  let c = o;
  for (let i = 0; i < bars.length && prog > i; i++) {
    const q = partial(bars[i], prog - i);
    h = Math.max(h, q.h);
    l = Math.min(l, q.l);
    c = q.c;
  }
  return {o, h, l, c};
};
/** A replay schedule: [frame, bars done] anchors, strictly increasing in both. */
type Sched = Array<[number, number]>;
const progAt = (f: number, s: Sched) => interpolate(f, s.map((a) => a[0]), s.map((a) => a[1]), clamp);
const frameOf = (s: Sched, p: number) => interpolate(p, s.map((a) => a[1]), s.map((a) => a[0]), clamp);

const Candle = ({x, w, q, Y, color, wick = 3, minH = 4}: {x: number; w: number; q: OHLC; Y: (v: number) => number; color: string; wick?: number; minH?: number}) => {
  const top = Y(Math.max(q.o, q.c));
  const bot = Math.max(Y(Math.min(q.o, q.c)), top + minH);
  return (
    <g>
      <line x1={x} x2={x} y1={Y(q.h)} y2={Y(q.l)} stroke={color} strokeWidth={wick} strokeLinecap="round" />
      <rect x={x - w / 2} y={top} width={w} height={bot - top} rx={Math.min(4, w * 0.12)} fill={color} />
    </g>
  );
};

/** A camera that keeps travelling (spline through the keys); the stage is 1080×1920. */
const Cam = ({keys, children}: {keys: CamKey[]; children: ReactNode}) => {
  const f = useCurrentFrame();
  return <div style={{position: 'absolute', inset: 0, transformOrigin: '0 0', transform: cameraCss(cameraSpline(f, keys))}}>{children}</div>;
};

// ---------------------------------------------------------------------------------------------------------------
// The opening and result stage: three traders under three real hammers.

const TOP = 660;
const HH = 340;
/** An H1 hammer replayed from its 12 real 5 m bars: the finished shape as a dashed outline, the live candle filling it. */
const BigHammer = ({k, cx, prog, color = ACTOR.white}: {k: Key; cx: number; prog: number; color?: string}) => {
  const p = D[k];
  const [, o, hi, lo, c] = p.h1;
  const Y = (v: number) => TOP + ((hi - v) / (hi - lo)) * HH;
  const q = aggregate(p.m5.slice(36, 48) as K[], prog);
  const forming = prog < 12;
  return (
    <g>
      {forming && (
        <g>
          <line x1={cx} x2={cx} y1={Y(hi)} y2={Y(lo)} stroke="#5A6577" strokeWidth={3} strokeDasharray="8 8" />
          <rect x={cx - 34} y={Y(Math.max(o, c))} width={68} height={Math.max(6, Y(Math.min(o, c)) - Y(Math.max(o, c)))} rx={4} fill="none" stroke="#6B778A" strokeWidth={2.5} strokeDasharray="8 6" />
        </g>
      )}
      <Candle x={cx} w={68} wick={8} q={q} Y={Y} color={forming && q.c < q.o ? '#9AA6B6' : color} minH={6} />
      {forming && <circle cx={cx + 54} cy={Y(q.c)} r={8} fill={BLUE} />}
    </g>
  );
};

/** Six hours after the hammer: the six real H1 candles drawn in order, the change counting as they draw. */
const SixHours = ({k, cx, f, from, to}: {k: Key; cx: number; f: number; from: number; to: number}) => {
  const p = D[k];
  const cs = [p.h1, ...p.after6h] as K[];
  const lo = Math.min(...cs.map((c) => c[3]));
  const hi = Math.max(...cs.map((c) => c[2]));
  const Y = (v: number) => 680 + ((hi - v) / (hi - lo)) * 290;
  const X = (i: number) => cx - 90 + i * 30;
  const prog = interpolate(f, [from, to], [0, 6], clamp);
  const base = p.h1[4];
  let price = base;
  let low = base;
  const drawn: Array<{i: number; q: OHLC}> = [];
  cs.slice(1).forEach((b, i) => {
    if (prog <= i) return;
    const q = partial(b, prog - i);
    price = q.c;
    low = Math.min(low, q.l);
    drawn.push({i: i + 1, q});
  });
  const v = (((k === 'C' ? low : price) - base) / base) * 100;
  const shown = f >= from;
  return (
    <g>
      <line x1={X(0) - 18} x2={X(6) + 18} y1={Y(base)} y2={Y(base)} stroke="#3A4556" strokeWidth={2} strokeDasharray="6 6" />
      <Candle x={X(0)} w={20} wick={4} q={{o: p.h1[1], h: p.h1[2], l: p.h1[3], c: p.h1[4]}} Y={Y} color={ACTOR.white} />
      {drawn.map((d) => (
        <Candle key={d.i} x={X(d.i)} w={18} wick={3.5} q={d.q} Y={Y} color={d.q.c >= d.q.o ? '#F4F6FA' : '#6B778A'} />
      ))}
      {shown && prog < 6 && <circle cx={X(Math.min(6, Math.floor(prog) + 1)) + 16} cy={Y(price)} r={6} fill={BLUE} />}
      {shown && (
        <g opacity={ramp(f, from, from + 8)}>
          <text x={cx} y={1100} textAnchor="middle" fontFamily={fonts.mono} fontWeight={800} fontSize={48} fill={k === 'B' ? BLUE : k === 'C' ? RED : '#C9D1DB'}>
            {pctText(v)}
          </text>
          <text x={cx} y={1134} textAnchor="middle" fontFamily={fonts.mono} fontWeight={600} fontSize={18} fill="#7F8EA3">{k === 'C' ? 'TERENDAH 6 JAM' : 'SETELAH 6 JAM'}</text>
        </g>
      )}
    </g>
  );
};

type Results = Record<Key, [number, number]>;
const Stations = ({f, prog, merge = 0, buyAt, results}: {f: number; prog: (i: number) => number; merge?: number; buyAt?: (i: number) => number; results?: Results}) => (
  <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
    <line x1={70} x2={1010} y1={GROUND + 1} y2={GROUND + 1} stroke="#2A3240" strokeWidth={3} />
    {STATIONS.map((s, i) => {
      const r = results?.[s.k];
      const done = r ? f >= r[1] : false;
      const tb = buyAt ? buyAt(i) : Infinity;
      const pose: Pose = done ? (s.k === 'B' ? 'cheer' : s.k === 'A' ? 'shrug' : 'slump') : !r && f >= tb ? 'hold' : 'stand';
      const tone = done ? (s.k === 'B' ? BLUE : s.k === 'C' ? '#9AA6B6' : '#C9D1DB') : ACTOR.white;
      const cx = s.x + (540 - s.x) * merge;
      // The buy: a blue dot (the money) travels from the trader's hand to the candle.
      const fly = r ? 0 : ramp(f, tb, tb + 12, ease.inOut);
      const hand: [number, number] = [s.x + 82, 1241];
      const into: [number, number] = [s.x + 6, 1004];
      return (
        <g key={s.k}>
          {r ? <SixHours k={s.k} cx={s.x} f={f} from={r[0]} to={r[1]} /> : <BigHammer k={s.k} cx={cx} prog={prog(i)} color={merge > 0.05 ? `rgba(244,246,250,${1 - 0.45 * merge})` : ACTOR.white} />}
          {!r && merge < 0.5 && (
            <>
              <Pill x={s.x} y={598} text={`HAMMER ${s.k}`} size={22} />
              <text x={s.x} y={642} textAnchor="middle" fontFamily={fonts.mono} fontWeight={600} fontSize={17} fill="#7F8EA3" letterSpacing="0.02em">{s.date}</text>
            </>
          )}
          {fly > 0 && fly < 1 && (
            <g>
              <line x1={hand[0]} y1={hand[1]} x2={hand[0] + (into[0] - hand[0]) * fly} y2={hand[1] + (into[1] - hand[1]) * fly} stroke={BLUE} strokeWidth={2} strokeDasharray="6 6" opacity={0.6} />
              <circle cx={hand[0] + (into[0] - hand[0]) * fly} cy={hand[1] + (into[1] - hand[1]) * fly} r={9} fill={BLUE} />
            </g>
          )}
          <Actor x={s.x} y={GROUND} h={190} pose={pose} color={tone} glow={!r && f >= tb && f < tb + 14 ? 1 - ramp(f, tb + 4, tb + 14) : 0} />
          <Pill x={s.x} y={GROUND + 44} text={`TRADER ${s.k}`} size={20} border={done && s.k === 'B' ? BLUE : '#3A4556'} />
          {!r && f >= tb + 12 && <Pill x={s.x - 82} y={1098} text="BELI" size={22} color="#FFFFFF" border={BLUE} bg="#0B1730" at={tb + 12} />}
        </g>
      );
    })}
    {merge > 0.3 && <Pill x={540} y={1100} text="DITUMPUK: NYARIS SAMA" size={26} border={BLUE} />}
  </svg>
);

// ---------------------------------------------------------------------------------------------------------------
// One hammer opened on 5 m.

const chartOf = (k: Key) => {
  const p = D[k];
  const bars = p.m5.slice(24, 48) as K[]; // the hour before (context, dimmed) + the hour itself
  const lv = p.levels;
  const level = lv.equalLow ?? lv.low12;
  const lo = Math.min(...bars.map((b) => b[3]), level) * 0.9996;
  const hi = Math.max(...bars.map((b) => b[2]), lv.lowerHigh ?? 0) * 1.0004;
  const X0 = 110;
  const W = 740; // labels for the lines sit in the clear margin on the right (x ≥ 866)
  const T = 650;
  const Hh = 520;
  const bw = W / bars.length;
  return {p, bars, lv, level, X0, W, T, Hh, bw, Y: (v: number) => T + ((hi - v) / (hi - lo)) * Hh, X: (i: number) => X0 + i * bw + bw / 2};
};

const Inside = ({k, f, from, sched, label, notes, outline, labels = true}: {k: Key; f: number; from: number; sched: Sched; label: string; notes: ReactNode; outline?: {at: number; hollow?: number}; labels?: boolean}) => {
  const {p, bars, lv, level, X0, W, T, Hh, bw, Y, X} = chartOf(k);
  const hour = bars.slice(12);
  const prog = progAt(f, sched);
  const flushI = hour.findIndex((b) => b[3] < level);
  const sweptAt = flushI >= 0 ? frameOf(sched, flushI + 0.5) : Infinity;
  const sweptReclaimed = p.h1[4] > level;
  const breakJ = lv.lowerHigh === null ? -1 : hour.findIndex((b) => b[4] > (lv.lowerHigh as number));
  const broke = lv.closeAboveLH && breakJ >= 0 && prog >= breakJ + 0.97;
  const lhX = lv.lowerHighAt !== null ? X0 + (lv.lowerHighAt - 24) * bw + bw / 2 : X0;
  const cur = Math.min(11, Math.floor(prog));
  const price = prog <= 0 ? hour[0][1] : partial(hour[cur], prog - cur).c;
  const forming = prog > 0 && prog < 12;
  const lineO = prog <= 0 ? 0 : forming ? 0.55 : 0.55 - 0.37 * ramp(f, frameOf(sched, 12), frameOf(sched, 12) + 15);
  const levelDraw = ramp(f, from + 8, from + 24, ease.inOut);
  const gateDraw = ramp(f, from + 12, from + 28, ease.inOut);
  const hollow = outline?.hollow !== undefined ? ramp(f, outline.hollow, outline.hollow + 10) : 0;
  const [, ho, hh, hl, hc] = p.h1;
  const boxL = X0 + 12 * bw;
  const ocx = X0 + 18 * bw;
  const oDraw = outline ? ramp(f, outline.at, outline.at + 14, ease.inOut) : 0;
  return (
    <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
      <Pill x={600} y={600} text={label} size={21} border={BLUE} />
      <rect x={boxL - 4} y={T - 18} width={12 * bw + 8} height={Hh + 36} rx={18} fill="none" stroke="#3A4556" strokeWidth={2} strokeDasharray="10 8" />
      {/* The swept level: a line with stop orders resting just under it. */}
      {levelDraw > 0 && (
        <g>
          <line x1={X0} x2={X0 + W * levelDraw} y1={Y(level)} y2={Y(level)} stroke={k === 'A' ? '#5A6577' : '#9AA6B6'} strokeWidth={2.5} strokeDasharray="12 9" />
          {labels && (
            <g opacity={ramp(f, from + 20, from + 28)}>
              <text x={X0 + W + 16} y={Y(level) + 7} fontFamily={fonts.mono} fontWeight={700} fontSize={19} fill="#9AA6B6">{lv.equalLow ? 'EQUAL LOW' : 'LOW 12 JAM'}</text>
              <text x={X0 + W + 16} y={Y(level) + 30} fontFamily={fonts.mono} fontWeight={500} fontSize={15} fill="#7F8EA3">{fmt(level)}</text>
            </g>
          )}
          {Array.from({length: 14}, (_, i) => {
            const appear = ramp(f, from + 14 + i, from + 20 + i);
            const gone = ramp(f, sweptAt + i * 0.8, sweptAt + i * 0.8 + 10, ease.in);
            const sx = X0 + 24 + i * 52;
            const sy = Y(level) + 18 + gone * 120;
            return gone >= 1 || appear <= 0 ? null : <circle key={i} cx={sx} cy={sy} r={6} fill={gone > 0 ? (sweptReclaimed ? BLUE : '#9AA6B6') : '#7F8EA3'} opacity={appear * (1 - gone)} />;
          })}
        </g>
      )}
      {/* The last lower high: the gate. */}
      {lv.lowerHigh !== null && gateDraw > 0 && (
        <g>
          <line x1={lhX} x2={lhX + (X0 + W - lhX) * gateDraw} y1={Y(lv.lowerHigh)} y2={Y(lv.lowerHigh)} stroke={broke ? BLUE : '#C9D1DB'} strokeWidth={broke ? 4 : 2.5} strokeDasharray={broke ? undefined : '6 8'} />
          {labels && (
            <text x={X0 + W + 16} y={Y(lv.lowerHigh) + 7 - (Math.abs(Y(lv.lowerHigh) - Y(level)) < 44 ? 40 : 0)} fontFamily={fonts.mono} fontWeight={700} fontSize={19} fill={broke ? BLUE : '#C9D1DB'} opacity={ramp(f, from + 24, from + 32)}>
              LOWER HIGH
            </text>
          )}
        </g>
      )}
      {/* Context: the hour before, dimmed. */}
      {bars.slice(0, 12).map((b, i) => {
        const a = ramp(f, from + 4 + i * 0.6, from + 8 + i * 0.6);
        return a <= 0.01 ? null : (
          <g key={i} opacity={a}>
            <Candle x={X(i)} w={bw * 0.6} q={{o: b[1], h: b[2], l: b[3], c: b[4]}} Y={Y} color="#2F3846" minH={3} />
          </g>
        );
      })}
      {/* The hour, replayed bar by bar on the narration. */}
      <g opacity={1 - 0.7 * hollow}>
        {hour.map((b, j) => {
          if (prog <= j) return null;
          const q = partial(b, prog - j);
          return <Candle key={j} x={X(12 + j)} w={bw * 0.6} q={q} Y={Y} color={q.c >= q.o ? '#F4F6FA' : '#6B778A'} minH={3} />;
        })}
      </g>
      {/* The price now: a live line across the chart while the hour replays. */}
      {lineO > 0.01 && (
        <g>
          <line x1={X0} x2={X0 + W} y1={Y(price)} y2={Y(price)} stroke={BLUE} strokeWidth={2} strokeDasharray="4 6" opacity={lineO} />
          {forming && <circle cx={X(12 + cur) + bw * 0.55} cy={Y(price)} r={7} fill={BLUE} />}
        </g>
      )}
      {/* The outside: the H1 candle drawn to the same scale over its 12 bars. */}
      {oDraw > 0 && (
        <g opacity={oDraw}>
          <line x1={ocx} x2={ocx} y1={Y(hh)} y2={Y(hh) + (Y(hl) - Y(hh)) * oDraw} stroke={BLUE} strokeWidth={4} strokeLinecap="round" />
          <rect x={ocx - 6 * bw * 0.62} y={Y(Math.max(ho, hc))} width={12 * bw * 0.62} height={Math.max(8, Y(Math.min(ho, hc)) - Y(Math.max(ho, hc)))} rx={6} fill="rgba(41,151,255,0.10)" stroke={BLUE} strokeWidth={4} />
        </g>
      )}
      {/* Who won each 5 minutes: one actor per candle of the hour (blue = buyers, grey = sellers). */}
      {hour.map((b, j) => {
        const at = frameOf(sched, j + 1);
        if (f < at) return null;
        return <Actor key={j} x={X(12 + j)} y={GROUND + 40} h={58} color={b[4] >= b[1] ? BLUE : ACTOR.grey} pop={at} />;
      })}
      <text x={600} y={GROUND + 84} textAnchor="middle" fontFamily={fonts.mono} fontWeight={700} fontSize={20} fill="#7F8EA3">PEMENANG TIAP 5 MENIT: <tspan fill={BLUE}>BUYER</tspan> · <tspan fill="#C9D1DB">SELLER</tspan></text>
      {notes}
    </svg>
  );
};

// ---------------------------------------------------------------------------------------------------------------
// The twist: all 28 H1 hammers of the six months on a real timeline, then sorted into the two groups.

type H = {tf: string; t: number; o: number; h: number; l: number; c: number; sweep: boolean; choch: boolean; ret6: number};
const H1 = (hammers as H[]).filter((h) => h.tf.startsWith('H1'));
const isB = (h: H) => h.sweep && h.choch;
const T0 = Date.UTC(2026, 4, 25);
const T1 = Date.UTC(2026, 10, 21);
const TX0 = 140;
const TX1 = 940;
const AXIS = 1000;
const tx = (t: number) => TX0 + ((t - T0) / (T1 - T0)) * (TX1 - TX0);
const BOARD = (() => {
  const placed: Array<{x: number; lvl: number}> = [];
  let bi = 0;
  let oi = 0;
  return H1.map((h) => {
    const x = tx(h.t);
    let lvl = 0;
    while (placed.some((q) => q.lvl === lvl && Math.abs(q.x - x) < 26)) lvl++;
    placed.push({x, lvl});
    const cell = isB(h) ? (() => {
      const i = bi++;
      return {x: 185 + (i % 4) * 70, y: 820 + Math.floor(i / 4) * 104};
    })() : (() => {
      const i = oi++;
      return {x: 595 + (i % 5) * 70, y: 800 + Math.floor(i / 5) * 92};
    })();
    return {h, x, lvl, cell, b: isB(h), up: h.ret6 > 0};
  });
})();
const MONTHS: Array<[string, number]> = [['JUN', 5], ['JUL', 6], ['AGU', 7], ['SEP', 8], ['OKT', 9], ['NOV', 10]];

const MiniHammer = ({h, x, yb, s = 1, color}: {h: H; x: number; yb: number; s?: number; color: string}) => {
  const Y = (v: number) => yb - ((v - h.l) / (h.h - h.l)) * 64 * s;
  return <Candle x={x} w={18 * s} wick={3.5} q={{o: h.o, h: h.h, l: h.l, c: h.c}} Y={Y} color={color} minH={4} />;
};

const TwistBoard = ({f, w, from}: {f: number; w: Record<string, number>; from: number}) => {
  const scanA = w.dari0;
  const scanB = w.terakhir3 + 6;
  const scanX = interpolate(f, [scanA, scanB], [TX0, TX1], clamp);
  const sortAt = scanB + 2; // the scan ends, the hammers sort into the two groups
  const timeline = 1 - ramp(f, sortAt, sortAt + 12);
  const popped = BOARD.filter((e) => f >= interpolate(e.x, [TX0, TX1], [scanA, scanB])).length;
  const leftLit = BOARD.filter((e) => e.b && e.up);
  const rightLit = BOARD.filter((e) => !e.b && e.up);
  const litAt = (e: (typeof BOARD)[number]) => (e.b ? w.lima1 - 6 + leftLit.indexOf(e) * 5 : w.tiga3 - 10 + rightLit.indexOf(e) * 3);
  const dimAt = (e: (typeof BOARD)[number]) => (e.b ? w.lima1 - 12 : w.tiga3 - 18);
  const nLeft = leftLit.filter((e) => f >= litAt(e)).length;
  const nRight = rightLit.filter((e) => f >= litAt(e)).length;
  return (
    <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
      <Pill x={540} y={600} text="BUKAN RUMUS" size={28} border={RED} at={w.rumus} />
      {timeline > 0.01 && (
        <g opacity={timeline}>
          <line x1={TX0} x2={TX0 + (TX1 - TX0) * ramp(f, from, from + 16, ease.inOut)} y1={AXIS} y2={AXIS} stroke="#3A4556" strokeWidth={3} />
          {MONTHS.map(([m, mo]) => {
            const x = tx(Date.UTC(2026, mo, 1));
            return (
              <g key={m} opacity={ramp(f, from + 4 + mo * 2, from + 12 + mo * 2)}>
                <line x1={x} x2={x} y1={AXIS - 6} y2={AXIS + 10} stroke="#3A4556" strokeWidth={2} />
                <text x={x} y={AXIS + 38} textAnchor="middle" fontFamily={fonts.mono} fontWeight={600} fontSize={18} fill="#7F8EA3">{m}</text>
              </g>
            );
          })}
          {f >= scanA && f < sortAt && <line x1={scanX} x2={scanX} y1={AXIS - 270} y2={AXIS + 12} stroke={BLUE} strokeWidth={3} />}
          <text x={540} y={AXIS + 96} textAnchor="middle" fontFamily={fonts.mono} fontWeight={800} fontSize={34} fill="#F4F6FA" opacity={ramp(f, scanA, scanA + 8)}>
            {popped} HAMMER BTC H1
          </text>
        </g>
      )}
      <g opacity={ramp(f, sortAt, sortAt + 10)}>
        <text x={290} y={712} textAnchor="middle" fontFamily={fonts.mono} fontWeight={700} fontSize={24} fill={BLUE} letterSpacing="0.05em">POLA B</text>
        <text x={735} y={712} textAnchor="middle" fontFamily={fonts.mono} fontWeight={700} fontSize={24} fill="#C9D1DB" letterSpacing="0.05em">HAMMER LAIN</text>
      </g>
      {BOARD.map((e, i) => {
        const at = interpolate(e.x, [TX0, TX1], [scanA, scanB]);
        if (f < at) return null;
        const pop = ramp(f, at, at + 8);
        const s = pop < 1 ? 0.5 + 0.5 * pop + Math.sin(pop * Math.PI) * 0.15 : 1;
        const go = ramp(f, sortAt + i * 0.6, sortAt + 18 + i * 0.6, ease.inOut);
        const x = e.x + (e.cell.x - e.x) * go;
        const yb = AXIS - 12 - e.lvl * 80 + (e.cell.y - (AXIS - 12 - e.lvl * 80)) * go - Math.sin(go * Math.PI) * 70;
        const lit = f >= litAt(e);
        const dim = f >= dimAt(e);
        const color = lit ? (e.b ? BLUE : '#F4F6FA') : dim ? '#2F3846' : f >= sortAt - 4 ? (e.b ? BLUE : '#8A96A8') : '#C9D1DB';
        return <MiniHammer key={i} h={e.h} x={x} yb={yb} s={s * (1 + 0.2 * go)} color={color} />;
      })}
      <g opacity={ramp(f, w.lima1 - 6, w.lima1 + 2)}>
        <text x={290} y={1160} textAnchor="middle" fontFamily={fonts.mono} fontWeight={800} fontSize={64} fill={BLUE}>{nLeft}/8</text>
        <text x={290} y={1198} textAnchor="middle" fontFamily={fonts.mono} fontWeight={600} fontSize={19} fill="#7F8EA3">NAIK 6 JAM KEMUDIAN</text>
      </g>
      <g opacity={ramp(f, w.tiga3 - 10, w.tiga3)}>
        <text x={735} y={1160} textAnchor="middle" fontFamily={fonts.mono} fontWeight={800} fontSize={64} fill="#F4F6FA">{nRight}/20</text>
        <text x={735} y={1198} textAnchor="middle" fontFamily={fonts.mono} fontWeight={600} fontSize={19} fill="#7F8EA3">NAIK 6 JAM KEMUDIAN</text>
      </g>
      <Pill x={540} y={1290} text="BEDANYA TIPIS" size={28} border={BLUE} at={w.tiga3 + 14} />
    </svg>
  );
};

// ---------------------------------------------------------------------------------------------------------------
// The payoff: the swept low is the floor B stands on, and the line where the idea is wrong.

const PayoffMarks = ({f, w}: {f: number; w: Record<string, number>}) => {
  const {p, bars, Y, X} = chartOf('B');
  const swept = p.h1[3];
  const ys = Y(swept);
  const close = bars[23][4];
  const sx = X(23) + 16;
  const sy = Y(close);
  // "bukan arah berikutnya": two possible next moves, neither known.
  const fork = ramp(f, w.bukan1 - 2, w.bukan1 + 10, ease.inOut) * (1 - ramp(f, w.pakai - 4, w.pakai + 6));
  // "kapan lo salah": the swept low turns into the red line.
  const red = ramp(f, w.pakai, w.salah + 6, ease.inOut);
  // "kalau low yang disapu tembus lagi": SIMULASI, a hypothetical path down through the line.
  const pts: Array<[number, number]> = [[sx, sy], [sx + 27, sy + 47], [sx + 47, sy + 24], [sx + 77, ys - 290], [sx + 97, ys - 312], [sx + 142, ys + 45]];
  const lens = pts.slice(1).map((q, i) => Math.hypot(q[0] - pts[i][0], q[1] - pts[i][1]));
  const total = lens.reduce((a, b) => a + b, 0);
  const crossAt = (() => {
    const [a, b] = [pts[4], pts[5]];
    const u = (ys - a[1]) / (b[1] - a[1]);
    return (lens.slice(0, 4).reduce((s, l) => s + l, 0) + lens[4] * u) / total;
  })();
  const sim = interpolate(f, [w.kalau, w.tembus2, w.tembus2 + 12], [0, crossAt, 1], clamp);
  const simPts: Array<[number, number]> = [pts[0]];
  let left = sim * total;
  for (let i = 0; i < lens.length && left > 0; i++) {
    const u = Math.min(1, left / lens[i]);
    simPts.push([pts[i][0] + (pts[i + 1][0] - pts[i][0]) * u, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * u]);
    left -= lens[i];
  }
  const head = simPts[simPts.length - 1];
  const crossed = sim >= crossAt;
  const flash = crossed ? 1 - ramp(f, w.tembus2, w.tembus2 + 14) : 0;
  const fallen = f >= w.batal;
  return (
    <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
      {/* The floor: the swept low. */}
      <line x1={110} x2={1010} y1={ys} y2={ys} stroke="#5A6577" strokeWidth={2.5} strokeDasharray="12 9" opacity={ramp(f, w.kendali - 8, w.kendali + 4)} />
      {red > 0 && <line x1={110} x2={110 + 900 * red} y1={ys} y2={ys} stroke={RED} strokeWidth={3 + 4 * flash} />}
      <Actor x={400} y={ys - 3} h={96} color={fallen ? '#9AA6B6' : BLUE} pose={fallen ? 'slump' : 'stand'} pop={w.kendali - 6} />
      {fork > 0.01 && (
        <g opacity={fork}>
          <path d={`M ${sx} ${sy} L ${sx + 100 * fork} ${sy - 62 * fork}`} stroke="#C9D1DB" strokeWidth={3} strokeDasharray="8 7" fill="none" />
          <path d={`M ${sx} ${sy} L ${sx + 100 * fork} ${sy + 62 * fork}`} stroke="#C9D1DB" strokeWidth={3} strokeDasharray="8 7" fill="none" />
          <text x={sx + 128} y={sy + 14} textAnchor="middle" fontFamily={fonts.heading} fontWeight={800} fontSize={44} fill="#F4F6FA">?</text>
        </g>
      )}
      {sim > 0 && (
        <g>
          <polyline points={simPts.map((q) => q.join(',')).join(' ')} fill="none" stroke={RED} strokeWidth={4} strokeDasharray="10 8" strokeLinejoin="round" />
          <circle cx={head[0]} cy={head[1]} r={8} fill={RED} />
          <Pill x={930} y={ys + 100} text="SIMULASI" size={18} border="#5A6577" color="#C9D1DB" at={w.kalau} />
        </g>
      )}
      {red > 0.5 && <Pill x={540} y={ys + 40} text={`BATAL KALAU ${fmt(swept)} TEMBUS`} size={24} border={RED} at={w.salah} bg={fallen ? '#2A0A10' : '#0B0F16'} />}
    </svg>
  );
};

// ---------------------------------------------------------------------------------------------------------------

const Scene = () => {
  const f = useCurrentFrame();
  const {cue, word, narrationEnd} = useCues();
  const b = {hook: cue('hook'), pick: cue('pick'), a: cue('a'), c: cue('c'), bb: cue('b'), result: cue('result'), twist: cue('twist'), payoff: cue('payoff'), end: narrationEnd};
  const w = {
    sama: word('sama'), beli: word('beli'), lima: word('lima', 0), isinya: word('isinya'), balik: word('balik'), terakhir0: word('terakhir', 0), disapu: word('disapu', 0), patah: word('patah'), cantik: word('cantik'), kosong: word('kosong'),
    disapu1: word('disapu', 1), mantul: word('mantul'), gagal: word('gagal'), high0: word('high', 0),
    sapu: word('sapu'), tembus1: word('tembus', 1), change: word('change'), dalam1: word('dalam', 1),
    b1: word('b', 1), persen0: word('persen', 0), a1: word('a', 1), diam: word('diam'), c1: word('c', 1), persen1: word('persen', 1),
    rumus: word('rumus'), dari0: word('dari', 0), terakhir3: word('terakhir', 3), pola: word('pola'), lima1: word('lima', 1), tiga3: word('tiga', 3),
    kendali: word('kendali'), bukan1: word('bukan', 1), pakai: word('pakai'), salah: word('salah'), kalau: word('kalau'), tembus2: word('tembus', 2), batal: word('batal'),
  };
  const loopAt = b.end + 3; // after "idenya batal": the tail returns to the opening shot so the Reel loops
  const merge = ramp(f, w.sama, w.sama + 12, ease.inOut) * (1 - ramp(f, w.sama + 40, w.sama + 54, ease.inOut));
  const buyAt = (i: number) => w.beli - 10 + i * 12;
  // The opening hammers replay their real hour (already a third formed on frame 0); the loop rewinds them.
  const openProg = (i: number) => interpolate(f, [-40 + i * 4, 78 + i * 4], [0, 12], clamp);
  const loopProg = () => interpolate(f, [loopAt, loopAt + 28], [12, 4], {...clamp, easing: ease.inOut});
  // Replay schedules ([frame, bars done]) put each candle's key moment on the word that names it.
  const schedA: Sched = [[w.isinya - 4, 0], [w.balik, 9.33], [w.terakhir0 + 8, 12]];
  const schedC: Sched = [[b.c + 6, 0], [w.disapu1 + 4, 5.33], [w.mantul + 6, 8], [w.high0 + 4, 12]];
  const schedB: Sched = [[b.bb + 2, 0], [w.sapu + 4, 7.67], [w.tembus1, 11.8], [w.tembus1 + 8, 12]];
  const done: Sched = [[-2000, 0], [-1999, 12]];
  // Camera paths: the camera follows what the narration names, and never parks.
  const kOpen = [key(-30, 600, 985, 1.0), key(w.sama, 548, 965, 1.035), key(w.beli, 540, 975, 1.05), key(w.lima - 12, 470, 950, 1.08), key(w.lima + 12, 420, 930, 1.11)];
  const kA = [key(w.lima - 10, 520, 930, 0.98), key(w.isinya, 540, 935, 1.0), key(w.balik, 610, 975, 1.04), key(w.terakhir0 + 10, 630, 930, 1.05), key(w.patah, 610, 945, 1.06), key(w.cantik, 650, 930, 1.08), key(b.c + 10, 668, 935, 1.1)];
  const kC = [key(b.c - 10, 560, 945, 1.0), key(w.disapu1, 610, 985, 1.05), key(w.mantul, 640, 950, 1.05), key(w.gagal, 690, 925, 1.07), key(b.bb + 10, 720, 915, 1.09)];
  const kB = [key(b.bb - 10, 560, 945, 1.0), key(w.sapu, 600, 990, 1.05), key(w.tembus1, 690, 910, 1.07), key(w.change, 640, 940, 1.07), key(w.dalam1, 668, 925, 1.1), key(b.result + 10, 690, 930, 1.12)];
  const kR = [key(b.result - 10, 540, 1000, 1.03), key(w.b1, 540, 975, 1.03), key(w.a1, 532, 955, 1.02), key(w.c1, 548, 945, 1.02), key(b.twist + 10, 540, 925, 1.03)];
  const kT = [key(b.twist - 10, 540, 985, 1.0), key(w.dari0, 540, 960, 1.02), key(w.terakhir3, 560, 960, 1.03), key(w.pola, 540, 955, 1.03), key(w.lima1, 525, 950, 1.035), key(w.tiga3, 555, 950, 1.035), key(b.payoff + 10, 540, 970, 1.04)];
  const kP = [key(b.payoff - 10, 560, 960, 1.0), key(w.kendali, 520, 1000, 1.04), key(w.bukan1, 600, 930, 1.04), key(w.salah, 560, 990, 1.05), key(w.tembus2, 620, 1000, 1.05), key(w.batal, 600, 1000, 1.06), key(loopAt + 10, 590, 990, 1.07)];
  const kL = [key(loopAt - 10, 560, 990, 1.06), key(loopAt + 40, 600, 985, 1.0)];
  // Zoom through hammer A's body: where it sits on screen when the cut comes.
  const cz = cameraSpline(w.lima, kOpen);
  const zoomOrigin: [number, number] = [(220 - cz.x) * cz.s + 540, (700 - cz.y) * cz.s + 960];
  const stage = f < w.lima ? 'open' : f < b.c ? 'A' : f < b.bb ? 'C' : f < b.result ? 'B' : f < b.twist ? 'result' : f < b.payoff ? 'twist' : f < loopAt ? 'payoff' : 'loop';
  const source =
    stage === 'twist' ? '28 HAMMER BTC H1 · 25 MEI–21 NOV 2026 · DEFINISI & HITUNGAN CRYPTONITE · SAMPEL KECIL'
      : 'DATA: BINANCE BTCUSDT · H1 & 5 MENIT · BUKAN SARAN INVESTASI';
  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      {(stage === 'open' || stage === 'loop') && (
        <div style={{position: 'absolute', inset: 0, ...(stage === 'open' ? seam('zoom', f, w.lima, 'out', {dur: 12, origin: zoomOrigin}) : seam('blurSwap', f, loopAt, 'in'))}}>
          <Cam keys={stage === 'open' ? kOpen : kL}>
            <Stations f={f} prog={stage === 'open' ? openProg : loopProg} merge={stage === 'open' ? merge : 0} buyAt={stage === 'open' ? buyAt : undefined} />
          </Cam>
        </div>
      )}
      {stage === 'A' && (
        <div style={{position: 'absolute', inset: 0, ...seam('zoom', f, w.lima, 'in', {dur: 12}), ...seam('whip', f, b.c, 'out')}}>
          <Cam keys={kA}>
            <Inside k="A" f={f} from={w.lima} sched={schedA} label="HAMMER A · ISINYA: 12 CANDLE 5 MENIT" outline={{at: w.cantik - 4, hollow: w.kosong - 2}} notes={
              <>
                <Pill x={665} y={1196} text="LOW LAMA TEMBUS, NGGAK DIREBUT LAGI" size={21} at={w.disapu} border="#5A6577" />
                <Pill x={665} y={1241} text="STRUKTUR NGGAK PATAH ✕" size={21} at={w.patah} border="#5A6577" />
                <Pill x={665} y={1286} text="KOSONG DI DALAM" size={22} at={w.kosong} border={BLUE} />
              </>
            } />
          </Cam>
        </div>
      )}
      {stage === 'C' && (
        <div style={{position: 'absolute', inset: 0, ...seam('whip', f, b.c, 'in'), ...seam('whip', f, b.bb, 'out')}}>
          <Cam keys={kC}>
            <Inside k="C" f={f} from={b.c} sched={schedC} label="HAMMER C · ISINYA: 12 CANDLE 5 MENIT" notes={<Pill x={660} y={1236} text="GAGAL TEMBUS LOWER HIGH ✕" size={26} at={w.gagal} border={RED} />} />
          </Cam>
        </div>
      )}
      {stage === 'B' && (
        <div style={{position: 'absolute', inset: 0, ...seam('whip', f, b.bb, 'in'), ...seam('blurSwap', f, b.result, 'out')}}>
          <Cam keys={kB}>
            <Inside k="B" f={f} from={b.bb} sched={schedB} label="HAMMER B · ISINYA: 12 CANDLE 5 MENIT" outline={{at: w.dalam1 - 4}} notes={<Pill x={665} y={1236} text="CHoCH DI DALAM 1 CANDLE" size={26} at={w.change} border={BLUE} color={BLUE} />} />
          </Cam>
        </div>
      )}
      {stage === 'result' && (
        <div style={{position: 'absolute', inset: 0, ...seam('blurSwap', f, b.result, 'in'), ...seam('dip', f, b.twist, 'out')}}>
          <Cam keys={kR}>
            <Stations f={f} prog={() => 12} results={{B: [w.b1 - 4, w.persen0], A: [w.a1 - 2, w.diam + 4], C: [w.c1, w.persen1]}} />
            <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
              <Pill x={540} y={600} text="6 JAM KEMUDIAN" size={24} border={BLUE} at={b.result} />
            </svg>
          </Cam>
        </div>
      )}
      {stage === 'twist' && (
        <div style={{position: 'absolute', inset: 0, ...seam('flood', f, b.twist, 'in', {origin: [540, 900]}), ...seam('push', f, b.payoff, 'out')}}>
          <Cam keys={kT}>
            <TwistBoard f={f} w={w} from={b.twist} />
          </Cam>
        </div>
      )}
      {stage === 'payoff' && (
        <div style={{position: 'absolute', inset: 0, ...seam('push', f, b.payoff, 'in'), ...seam('blurSwap', f, loopAt, 'out')}}>
          <Cam keys={kP}>
            <Inside k="B" f={f} from={-2000} sched={done} label="HAMMER B · YANG DISAPU JADI LANTAI" notes={null} labels={false} />
            <PayoffMarks f={f} w={w} />
          </Cam>
        </div>
      )}
      <SentenceTrack y={440} size={50} />
      <Sound />
      <div style={{position: 'absolute', left: 60, right: 60, top: 1530, textAlign: 'center', fontFamily: fonts.mono, fontWeight: 500, fontSize: 17, letterSpacing: '0.04em', color: '#7F8EA3'}}>{source}</div>
    </AbsoluteFill>
  );
};

const episode: EpisodeModule = {config: config as EpisodeConfig, captions: captions as Captions, Scene, Cover};
export default episode;
