import type {ReactNode} from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import captions from '../../../episodes/lantai-hammer/captions.json';
import config from '../../../episodes/lantai-hammer/episode.json';
import {ACTOR, Actor, Pill, SentenceTrack, type Pose} from '../../components/actors';
import {seam} from '../../components/motion';
import {cameraCss, cameraSpline, type CamKey} from '../../lib/camera';
import {useCues} from '../../lib/cues';
import type {EpisodeModule} from '../../lib/episode-module';
import type {Captions, EpisodeConfig} from '../../lib/types';
import {ease} from '../../theme/motion';
import {fonts} from '../../theme/typography';
import data from './data.json';

/**
 * lantai-hammer: one world, the floor. Two fictional traders (Raka, Dina) buy the real 14 Nov 2026 BTC hammer
 * (Binance H1). Raka rides the live price head through the night; Dina's stop sits under the wick tip and she steps
 * off when it breaks. Then the 28 real hammers as a crowd of floors, the wick as a literal slab, a short step down
 * against an equal step up (17 vs 9), and Dina on her floor while Raka stands on nothing.
 *
 * Full-frame composition (user, 22 Nov 2026): the only reserved zone is the caption line at the top (y < 470);
 * graphics own the rest of the 1080×1920 frame and bleed off the edges. No footer: required qualifiers are built
 * into the graphics (SIMULASI on the hypothetical stop, SAMPEL KECIL beside the stats).
 */
type K = [number, number, number, number, number];
type Hm = {t: number; o: number; h: number; l: number; c: number; floorPct: number; broke24: boolean; first: string};
const DATA = data as unknown as {ctx: K[]; hammer: K; hammer5m: K[]; back: K[]; after5m: K[]; hammers: Hm[]};
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const ramp = (f: number, a: number, b: number, e = ease.out) => (b <= a ? (f >= a ? 1 : 0) : interpolate(f, [a, b], [0, 1], {...clamp, easing: e}));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const BLUE = ACTOR.blue;
const RED = ACTOR.red;
const WHITE = ACTOR.white;
const GREY = '#7F8EA3';
const TOPZ = 470; // everything above is the caption zone
const pct = (v: number) => `${v >= 0 ? '+' : '−'}${Math.abs(v).toFixed(1).replace('.', ',')}%`;
const fmt = (n: number) => n.toLocaleString('id-ID', {maximumFractionDigits: 0});
const key = (f: number, x: number, y: number, s: number): CamKey => ({f, x, y, s});

const Cam = ({keys, children}: {keys: CamKey[]; children: ReactNode}) => {
  const f = useCurrentFrame();
  return <div style={{position: 'absolute', inset: 0, transformOrigin: '0 0', transform: cameraCss(cameraSpline(f, keys))}}>{children}</div>;
};
/** The graphics layer: clipped so nothing enters the caption zone, free to bleed off the other three edges. */
const Stage = ({children}: {children: ReactNode}) => <div style={{position: 'absolute', left: 0, right: 0, top: TOPZ, bottom: 0, overflow: 'hidden'}}><div style={{position: 'absolute', left: 0, top: -TOPZ, width: 1080, height: 1920}}>{children}</div></div>;
const Svg = ({children}: {children: ReactNode}) => <svg width={1080} height={1920} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>{children}</svg>;
const Mono = ({x, y, size = 24, color = GREY, weight = 600, anchor = 'middle', children, opacity = 1}: {x: number; y: number; size?: number; color?: string; weight?: number; anchor?: 'middle' | 'start' | 'end'; children: ReactNode; opacity?: number}) => (
  <text x={x} y={y} textAnchor={anchor} fontFamily={fonts.mono} fontWeight={weight} fontSize={size} fill={color} letterSpacing="0.04em" opacity={opacity}>{children}</text>
);

// ---------------------------------------------------------------------------------------------------------------
// Replaying real bars: a bar's price path runs open → low → high → close (up bar) or open → high → low → close.

type OHLC = {o: number; h: number; l: number; c: number};
const pathOf = (b: K) => (b[4] >= b[1] ? [b[1], b[3], b[2], b[4]] : [b[1], b[2], b[3], b[4]]);
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
const Candle = ({x, w, q, Y, color, wick = 3}: {x: number; w: number; q: OHLC; Y: (v: number) => number; color: string; wick?: number}) => {
  const top = Y(Math.max(q.o, q.c));
  const bot = Math.max(Y(Math.min(q.o, q.c)), top + 5);
  return (
    <g>
      <line x1={x} x2={x} y1={Y(q.h)} y2={Y(q.l)} stroke={color} strokeWidth={wick} strokeLinecap="round" />
      <rect x={x - w / 2} y={top} width={w} height={bot - top} rx={Math.min(6, w * 0.12)} fill={color} />
    </g>
  );
};

// The 14 Nov hammer, its own hour (5 m), and the 11 hours after it (5 m).
const HAM = DATA.hammer;
const ENTRY = HAM[4];
const FLOOR = HAM[3];
const AFTER = DATA.after5m;
const BREAK_I = AFTER.findIndex((b) => b[3] < FLOOR);
const BOUNCE_I = (() => {
  let m = 12;
  for (let i = 12; i < 24; i++) if (AFTER[i][2] > AFTER[m][2]) m = i;
  return m;
})();
const LOW_I = AFTER.reduce((m, b, i) => (b[3] < AFTER[m][3] ? i : m), 0);
const EXIT = ((FLOOR - ENTRY) / ENTRY) * 100;
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
const replay = (p: number) => {
  let price = ENTRY;
  let lo = ENTRY;
  const hours: OHLC[] = [];
  for (let i = 0; i < AFTER.length && p > i; i++) {
    const q = partial(AFTER[i], p - i);
    price = q.c;
    lo = Math.min(lo, q.l);
    const hIdx = Math.floor(i / 12);
    const cur = hours[hIdx];
    hours[hIdx] = cur ? {o: cur.o, h: Math.max(cur.h, q.h), l: Math.min(cur.l, q.l), c: q.c} : {...q};
  }
  return {price, lo, hours};
};

// ---------------------------------------------------------------------------------------------------------------
// Chapter 1: the chart room, full frame. Far layer: the real 48 hours that slid into the hammer, big and blurred.

const PX0 = 40;
const PX1 = 1040;
const PY0 = 540;
const PY1 = 1640;
const X0 = 6.3;

const Backdrop = ({f}: {f: number}) => {
  const bs = DATA.back;
  const hi = Math.max(...bs.map((b) => b[2]));
  const lo = 61800;
  const step = 1240 / bs.length;
  const Y = (v: number) => 420 + ((hi - v) / (hi - lo)) * 1500;
  const drift = -f * 0.35; // the far world keeps sliding
  return (
    <svg width={1080} height={1920} style={{position: 'absolute', inset: 0, filter: 'blur(5px)', opacity: 0.2}}>
      <g transform={`translate(${drift - 80} 0)`}>
        {bs.map((b, i) => (
          <Candle key={i} x={i * step + step / 2} w={step * 0.6} q={{o: b[1], h: b[2], l: b[3], c: b[4]}} Y={Y} color={b[4] >= b[1] ? '#5A6577' : '#3A4556'} wick={4} />
        ))}
      </g>
    </svg>
  );
};

const viewAt = (p: number) => {
  const {lo} = replay(p);
  const wide = Math.min(1, p / 40) ** 0.7;
  return {x1: lerp(11.4, 20.2, wide), lo: Math.min(FLOOR * 0.9968, lo * 0.998), hi: lerp(HAM[2] * 1.0045, Math.max(...DATA.ctx.slice(6).map((b) => b[2])) * 1.002, Math.min(1, p / 30))};
};

const ChartRoom = ({f, p, hp, w, showFlash, loop}: {f: number; p: number; hp: number; w: Record<string, number>; showFlash: boolean; loop?: boolean}) => {
  const views = [-6, -3, 0].map((d) => viewAt(Math.max(0, p + d * 0.9)));
  const v = {x1: views.reduce((s, q) => s + q.x1, 0) / 3, lo: views.reduce((s, q) => s + q.lo, 0) / 3, hi: views.reduce((s, q) => s + q.hi, 0) / 3};
  const X = (slot: number) => PX0 + ((slot - X0) / (v.x1 - X0)) * (PX1 - PX0);
  const Y = (price: number) => PY0 + ((v.hi - price) / (v.hi - v.lo)) * (PY1 - PY0);
  const slotW = (PX1 - PX0) / (v.x1 - X0);
  const r = replay(p);
  const head = Math.min(AFTER.length - 1, Math.floor(p));
  const headSlot = 9 + head / 12;
  const live = p > 0;
  const hq = aggregate(DATA.hammer5m, hp);
  const forming = hp < 12;
  const floorDraw = loop ? 1 : ramp(f, w.garis - 6, w.garis + 12, ease.inOut);
  const broke = p >= BREAK_I + 0.67;
  const exitT = loop ? 0 : ramp(f, w.keluar - 4, w.keluar + 14, ease.inOut);
  const walk = loop ? 1 : ramp(f, w.raka - 4, w.beli - 2, ease.out); // the two walk in from the right
  const AH = 200;
  const rakaX0 = lerp(1200, X(10.75), walk);
  const rakaX = live ? X(headSlot) + 60 : rakaX0;
  const rakaY = Y(live ? r.price : ENTRY);
  const rakaPct = ((r.price - ENTRY) / ENTRY) * 100;
  const rakaPose: Pose = loop || !live ? (f >= w.beli && !loop ? 'hold' : 'stand') : r.price > ENTRY * 1.002 && p < BOUNCE_I + 24 ? 'cheer' : rakaPct < -2 ? 'slump' : 'stand';
  const dina0: [number, number] = [lerp(1300, X(9.45), walk), Y(ENTRY)];
  const dina1: [number, number] = [Math.max(150, X(7.4)), Y(FLOOR)];
  const dinaX = lerp(dina0[0], dina1[0], exitT);
  const dinaY = lerp(dina0[1], dina1[1], exitT) - Math.sin(exitT * Math.PI) * 70;
  const flash = showFlash ? ramp(f, w.paginya - 2, w.paginya + 8) * (1 - ramp(f, w.pasang - 8, w.pasang + 2)) : 0;
  return (
    <Svg>
      {Array.from({length: 18}, (_, i) => i + 6).map((s) => (
        <line key={s} x1={X(s + 0.5)} x2={X(s + 0.5)} y1={0} y2={1920} stroke="#0E131B" strokeWidth={2} />
      ))}
      {DATA.ctx.slice(6).map((b, i) => (
        <Candle key={i} x={X(6 + i)} w={slotW * 0.5} q={{o: b[1], h: b[2], l: b[3], c: b[4]}} Y={Y} color="#3A4556" wick={6} />
      ))}
      {/* the hammer forms its real hour: the ghost is the finished shape */}
      {forming && (
        <g>
          <line x1={X(8)} x2={X(8)} y1={Y(HAM[2])} y2={Y(HAM[3])} stroke="#5A6577" strokeWidth={4} strokeDasharray="10 10" />
          <rect x={X(8) - slotW * 0.28} y={Y(Math.max(HAM[1], HAM[4]))} width={slotW * 0.56} height={Math.max(8, Y(Math.min(HAM[1], HAM[4])) - Y(Math.max(HAM[1], HAM[4])))} rx={6} fill="none" stroke="#6B778A" strokeWidth={3} strokeDasharray="10 8" />
        </g>
      )}
      <Candle x={X(8)} w={slotW * 0.56} q={hq} Y={Y} color={forming && hq.c < hq.o ? '#9AA6B6' : WHITE} wick={10} />
      {forming && <circle cx={X(8) + slotW * 0.42} cy={Y(hq.c)} r={11} fill={BLUE} />}
      {r.hours.map((q, i) => (
        <Candle key={`h${i}`} x={X(9 + i)} w={slotW * 0.5} q={q} Y={Y} color={q.c >= q.o ? '#C9D1DB' : '#5A6577'} wick={6} />
      ))}
      <line x1={X(8)} x2={1080} y1={Y(ENTRY)} y2={Y(ENTRY)} stroke="#2A3240" strokeWidth={3} strokeDasharray="6 10" opacity={walk} />
      {floorDraw > 0 && (
        <g>
          <line x1={X(8) - 60} x2={X(8) - 60 + (1140 - X(8)) * floorDraw} y1={Y(FLOOR)} y2={Y(FLOOR)} stroke={broke ? RED : BLUE} strokeWidth={8} strokeDasharray={broke ? '20 14' : undefined} />
          <Mono x={1030} y={Y(FLOOR) - 20} anchor="end" size={26} weight={700} color={broke ? RED : BLUE} opacity={floorDraw}>UJUNG EKOR {fmt(FLOOR)}</Mono>
        </g>
      )}
      {!loop && f >= w.pasang && exitT < 0.5 && <Pill x={X(9.45)} y={Y(FLOOR) + 44} text="STOP DINA · SIMULASI" size={22} border={BLUE} color={BLUE} at={w.pasang} />}
      {live && p < AFTER.length && <circle cx={X(headSlot)} cy={Y(r.price)} r={13} fill={rakaPct >= 0 ? BLUE : RED} />}
      {exitT > 0 && (
        <g opacity={exitT}>
          <line x1={dina1[0] - 90} x2={dina1[0] + 90} y1={Y(FLOOR) + 4} y2={Y(FLOOR) + 4} stroke={BLUE} strokeWidth={12} strokeLinecap="round" />
          <Mono x={dina1[0] - 90} y={Y(FLOOR) + 50} anchor="start" size={26} color={BLUE} weight={800}>KELUAR {pct(EXIT)}</Mono>
        </g>
      )}
      <Actor x={dinaX} y={dinaY} h={AH} color={BLUE} pose={!loop && f >= w.beli && exitT < 0.9 ? 'hold' : 'stand'} ring={false} />
      <Actor x={rakaX} y={rakaY} h={AH} color={WHITE} pose={rakaPose} ring={false} />
      {exitT < 0.5 && <Mono x={dinaX} y={dinaY + 40} size={26} color={BLUE} weight={800} opacity={walk}>DINA</Mono>}
      <Mono x={rakaX} y={rakaY + 40} size={26} color={WHITE} weight={800} opacity={walk}>RAKA</Mono>
      {live && !loop && <Mono x={Math.min(rakaX, 930)} y={rakaY - AH - 30} size={60} weight={800} color={rakaPct >= 0 ? BLUE : RED}>{pct(rakaPct)}</Mono>}
      {flash > 0.01 && (
        <g opacity={flash}>
          <Mono x={(X(9.45) + X(10.75)) / 2} y={Y(ENTRY) - AH - 120} size={24} color="#C9D1DB" weight={700}>BESOK PAGI</Mono>
          <Pill x={X(10.75)} y={Y(ENTRY) - AH - 60} text="−5,7%" size={40} border={RED} color={RED} at={w.paginya} />
          {f >= w.rugi - 2 && <Pill x={X(9.45)} y={Y(ENTRY) - AH - 60} text="−1,0%" size={40} border={BLUE} color={BLUE} at={w.rugi - 2} />}
        </g>
      )}
      <Mono x={X(8)} y={Y(HAM[3]) + 54} size={24} color="#C9D1DB" weight={700} opacity={1 - floorDraw}>HAMMER · 14 NOV 22:00 WIB</Mono>
    </Svg>
  );
};

// ---------------------------------------------------------------------------------------------------------------
// Chapter 2: the 28 hammers as a crowd of floors on a real timeline, edge to edge.

const T0 = Date.UTC(2026, 4, 25);
const T1 = Date.UTC(2026, 10, 21);
const tx = (t: number) => 70 + ((t - T0) / (T1 - T0)) * 940;
const CROWD = (() => {
  const placed: Array<{x: number; lvl: number}> = [];
  return DATA.hammers.map((h) => {
    const x = tx(h.t);
    let lvl = 0;
    while (placed.some((q) => q.lvl === lvl && Math.abs(q.x - x) < 46)) lvl++;
    placed.push({x, lvl});
    return {h, x, y: 1240 - lvl * 150, isNov14: h.t === HAM[0]};
  });
})();
const MONTHS: Array<[string, number]> = [['JUN', 5], ['JUL', 6], ['AGU', 7], ['SEP', 8], ['OKT', 9], ['NOV', 10]];

const Crowd = ({f, w, from}: {f: number; w: Record<string, number>; from: number}) => {
  const scanA = w.dari;
  const scanB = w.terakhir + 6;
  const broken = CROWD.filter((e) => e.h.broke24);
  const crackAt = (e: (typeof CROWD)[number]) => w.belas1 - 4 + broken.indexOf(e) * 3;
  const n = broken.filter((e) => f >= crackAt(e) + 6).length;
  const scanX = interpolate(f, [scanA, scanB], [70, 1010], clamp);
  return (
    <Svg>
      <line x1={0} x2={1080 * ramp(f, from, from + 16, ease.inOut)} y1={1330} y2={1330} stroke="#2A3240" strokeWidth={4} />
      {MONTHS.map(([m, mo]) => (
        <Mono key={m} x={tx(Date.UTC(2026, mo, 1))} y={1378} size={24} opacity={ramp(f, from + 4 + mo, from + 12 + mo)}>{m}</Mono>
      ))}
      {f >= scanA && f < w.belas1 && <rect x={scanX - 2} y={520} width={4} height={816} fill={BLUE} opacity={0.8} />}
      {CROWD.map((e, i) => {
        const at = e.isNov14 ? from : interpolate(e.x, [70, 1010], [scanA, scanB]);
        if (f < at) return null;
        const c = e.h.broke24 ? ramp(f, crackAt(e), crackAt(e) + 10, ease.in) : 0;
        const col = e.isNov14 ? BLUE : c > 0.3 ? '#4A5568' : WHITE;
        const sc = e.isNov14 ? BLUE : '#C9D1DB';
        return (
          <g key={i}>
            <line x1={e.x - 24} x2={e.x - 3 - c * 6} y1={e.y + c * 18} y2={e.y + c * 30} stroke={sc} strokeWidth={9} strokeLinecap="round" opacity={1 - c * 0.5} />
            <line x1={e.x + 3 + c * 6} x2={e.x + 24} y1={e.y + c * 30} y2={e.y + c * 18} stroke={sc} strokeWidth={9} strokeLinecap="round" opacity={1 - c * 0.5} />
            <Actor x={e.x} y={e.y - 5 + c * 50} h={90} color={col} pose={c > 0.5 ? 'slump' : 'stand'} pop={at} ring={false} />
            {e.isNov14 && <Mono x={e.x - 10} y={e.y - 112} size={22} color={BLUE} weight={800} anchor="end">14 NOV</Mono>}
          </g>
        );
      })}
      <g opacity={ramp(f, w.belas1, w.belas1 + 8)}>
        <text x={60} y={1530} fontFamily={fonts.mono} fontWeight={800} fontSize={150} fill={RED}>{n}<tspan fill="#C9D1DB" fontSize={84}> / 28</tspan></text>
        <Mono x={60} y={1576} anchor="start" size={26} color="#C9D1DB" weight={700}>UJUNG EKOR TEMBUS DALAM 24 JAM</Mono>
      </g>
      <Mono x={540} y={540} size={24} color="#C9D1DB" opacity={ramp(f, scanA, scanA + 8)}>28 HAMMER BITCOIN · 1 JAM · 6 BULAN · SAMPEL KECIL</Mono>
      {f >= w.hampir && <Pill x={845} y={1480} text="HAMPIR SETENGAH" size={26} border={RED} at={w.hampir} />}
    </Svg>
  );
};

// ---------------------------------------------------------------------------------------------------------------
// Chapter 3: the wick becomes a floor. One giant candle from the caption line to the bottom edge.

const BigHammer = ({f, w, from}: {f: number; w: Record<string, number>; from: number}) => {
  const [, o, hi, lo, c] = HAM;
  const top = 560;
  const H = 900;
  const Y = (v: number) => top + ((hi - v) / (hi - lo)) * H;
  const cx = 540;
  const draw = ramp(f, from, from + 18, ease.inOut);
  const run = interpolate(f, [w.ekor, w.pembeli, w.harga3 + 8], [o, lo, c], clamp);
  const running = f >= w.ekor && f < w.lantai0;
  const slab = ramp(f, w.lantai0 - 2, w.lantai0 + 14, ease.inOut);
  const crack = ramp(f, w.jebol0, w.jebol0 + 12, ease.in);
  const idea = ramp(f, w.jebol0 + 2, w.mati + 4, ease.in);
  const tip = Y(lo);
  const arahO = ramp(f, w.arah - 4, w.arah + 4) * (1 - ramp(f, w.ekor - 4, w.ekor + 4));
  return (
    <Svg>
      <line x1={cx} x2={cx} y1={Y(hi)} y2={Y(hi) + (tip - Y(hi)) * draw} stroke={WHITE} strokeWidth={48} strokeLinecap="round" />
      <rect x={cx - 150} y={Y(Math.max(o, c))} width={300} height={Math.max(24, Y(Math.min(o, c)) - Y(Math.max(o, c)))} rx={12} fill={WHITE} opacity={ramp(f, from + 8, from + 18)} />
      {arahO > 0.01 && (
        <g opacity={arahO}>
          <path d={`M ${cx + 230} ${Y(c) + 160} l 70 -90 M ${cx + 230} ${Y(c) + 260} l 70 90`} stroke="#5A6577" strokeWidth={10} strokeLinecap="round" fill="none" />
          <text x={cx + 340} y={Y(c) + 236} fontFamily={fonts.heading} fontWeight={800} fontSize={110} fill={RED}>✕</text>
          <Mono x={cx + 300} y={Y(c) + 400} size={26} color={RED} weight={800}>BUKAN BUAT NEBAK ARAH</Mono>
        </g>
      )}
      {running && <circle cx={cx + 70} cy={Y(run)} r={20} fill={BLUE} />}
      {[-200, 0, 200].map((dx, i) => (
        <Actor key={i} x={cx + dx} y={tip + 330} h={260} color={BLUE} pose="cheer" pop={w.pembeli - 6 + i * 3} ring={false} />
      ))}
      <Mono x={cx} y={tip + 380} size={28} color={BLUE} weight={800} opacity={ramp(f, w.pembeli, w.pembeli + 8) * (1 - slab)}>PEMBELI NAHAN HARGA</Mono>
      {slab > 0 && (
        <g>
          <rect x={cx - 640 * slab - crack * 40} y={tip - 4 + crack * 40} width={640 * slab - 10} height={30} rx={6} fill={BLUE} transform={`rotate(${-crack * 10} ${cx - 10} ${tip + 10})`} />
          <rect x={cx + 10 + crack * 40} y={tip - 4 + crack * 40} width={640 * slab - 10} height={30} rx={6} fill={BLUE} transform={`rotate(${crack * 10} ${cx + 10} ${tip + 10})`} />
          <text x={cx + 300} y={tip - 34} textAnchor="middle" fontFamily={fonts.heading} fontWeight={800} fontSize={72} fill={BLUE} opacity={slab * (1 - crack)}>LANTAI</text>
        </g>
      )}
      {f >= w.lantai1 - 4 && (
        <g transform={`translate(0 ${idea * 420})`} opacity={1 - idea * 0.3}>
          <Pill x={cx - 290} y={tip - 50} text={idea > 0.6 ? 'IDE BELI ✕' : 'IDE BELI'} size={34} border={idea > 0.6 ? RED : BLUE} color={idea > 0.6 ? RED : WHITE} at={w.lantai1 - 4} />
        </g>
      )}
    </Svg>
  );
};

// ---------------------------------------------------------------------------------------------------------------
// Chapter 4: the floor is close. Three lines edge to edge; 28 traders, 17 up first, 9 down first.

const NEAR_ENTRY = 1060;
const STEP = 280;
const Near = ({f, w, from}: {f: number; w: Record<string, number>; from: number}) => {
  const floorY = interpolate(f, [w.dekat - 4, w.dekat + 16], [1900, NEAR_ENTRY + STEP], {...clamp, easing: ease.inOut});
  const ruler = ramp(f, w.nol - 2, w.nol + 10);
  const target = ramp(f, w.tujuh1 - 8, w.tujuh1);
  const upT = (i: number) => ramp(f, w.tujuh1 + i * 1.6, w.tujuh1 + i * 1.6 + 12, ease.inOut);
  const dnT = (i: number) => ramp(f, w.sembilan + i * 2.4, w.sembilan + i * 2.4 + 12, ease.in);
  const ups = DATA.hammers.filter((h) => h.first === 'up');
  const dns = DATA.hammers.filter((h) => h.first === 'floor');
  const nUp = ups.filter((_, i) => upT(i) > 0.95).length;
  const nDn = dns.filter((_, i) => dnT(i) > 0.95).length;
  return (
    <Svg>
      <line x1={0} x2={1080} y1={NEAR_ENTRY} y2={NEAR_ENTRY} stroke="#5A6577" strokeWidth={4} strokeDasharray="8 10" opacity={ramp(f, from, from + 10)} />
      <Mono x={60} y={NEAR_ENTRY + 44} anchor="start" size={26} color="#C9D1DB" weight={700} opacity={ramp(f, from, from + 10)}>HARGA BELI</Mono>
      <line x1={0} x2={1080} y1={floorY} y2={floorY} stroke={BLUE} strokeWidth={14} />
      <Mono x={60} y={floorY + 52} anchor="start" size={30} color={BLUE} weight={800}>LANTAI</Mono>
      <line x1={0} x2={1080} y1={NEAR_ENTRY - STEP} y2={NEAR_ENTRY - STEP} stroke="#C9D1DB" strokeWidth={4} strokeDasharray="14 10" opacity={target} />
      <Mono x={60} y={NEAR_ENTRY - STEP + 44} anchor="start" size={26} color="#C9D1DB" weight={700} opacity={target}>+0,8%</Mono>
      {ruler > 0 && (
        <g opacity={ruler}>
          <line x1={1030} x2={1030} y1={NEAR_ENTRY + 20} y2={NEAR_ENTRY + STEP - 20} stroke="#C9D1DB" strokeWidth={4} />
          <text x={1005} y={NEAR_ENTRY + STEP / 2 + 26} textAnchor="end" fontFamily={fonts.mono} fontWeight={800} fontSize={80} fill={WHITE}>0,8%</text>
          <Mono x={1005} y={NEAR_ENTRY + STEP / 2 + 66} anchor="end" size={22}>MEDIAN</Mono>
        </g>
      )}
      {DATA.hammers.map((h, i) => {
        const x = 54 + i * 35.8;
        const ui = ups.indexOf(h);
        const di = dns.indexOf(h);
        const up = ui >= 0 ? upT(ui) : 0;
        const dn = di >= 0 ? dnT(di) : 0;
        const y = NEAR_ENTRY - 3 - up * STEP + dn * (STEP + 150);
        const other = ui < 0 && di < 0 && f > w.sembilan + 24;
        const col = up > 0.5 ? BLUE : dn > 0.5 || other ? '#4A5568' : WHITE;
        return <Actor key={i} x={x} y={y} h={56} color={col} pose={dn > 0.5 ? 'slump' : 'stand'} pop={from + 6 + i * 0.8} ring={false} />;
      })}
      <g opacity={ramp(f, w.tujuh1, w.tujuh1 + 8)}>
        <text x={60} y={650} fontFamily={fonts.mono} fontWeight={800} fontSize={170} fill={BLUE}>{nUp}</text>
        <Mono x={290} y={600} anchor="start" size={30} color={BLUE} weight={800}>KALI NAIK</Mono>
        <Mono x={290} y={640} anchor="start" size={30} color={BLUE} weight={800}>DULUAN</Mono>
      </g>
      <g opacity={ramp(f, w.sembilan, w.sembilan + 8)}>
        <text x={1020} y={650} textAnchor="end" fontFamily={fonts.mono} fontWeight={800} fontSize={170} fill="#C9D1DB">{nDn}</text>
        <Mono x={890} y={600} anchor="end" size={30} color="#C9D1DB" weight={800}>KALI LANTAI</Mono>
        <Mono x={890} y={640} anchor="end" size={30} color="#C9D1DB" weight={800}>JEBOL DULUAN</Mono>
      </g>
      <g opacity={ramp(f, w.sembilan + 24, w.sembilan + 32)}>
        <Mono x={540} y={1560} size={22}>28 HAMMER · 2 TIDAK JELAS · SAMPEL KECIL · TANPA FEE</Mono>
      </g>
    </Svg>
  );
};

// ---------------------------------------------------------------------------------------------------------------
// Chapter 5: the payoff. Dina on her floor, Raka on nothing.

const Payoff = ({f, w, from}: {f: number; w: Record<string, number>; from: number}) => {
  const [, o, hi, lo, c] = HAM;
  const Y = (v: number) => 560 + ((hi - v) / (hi - lo)) * 700;
  const tip = Y(lo);
  const slab = ramp(f, w.salah - 4, w.salah + 14, ease.inOut);
  const AH = 300;
  return (
    <Svg>
      <line x1={540} x2={540} y1={Y(hi)} y2={tip} stroke={WHITE} strokeWidth={34} strokeLinecap="round" opacity={ramp(f, from, from + 10)} />
      <rect x={430} y={Y(Math.max(o, c))} width={220} height={Math.max(18, Y(Math.min(o, c)) - Y(Math.max(o, c)))} rx={10} fill={WHITE} opacity={ramp(f, from, from + 10)} />
      {f >= w.sinyal - 2 && f < w.salah && <Pill x={820} y={Y(c) + 140} text="BUKAN SINYAL BELI" size={30} border={RED} color={RED} at={w.sinyal - 2} />}
      {slab > 0 && (
        <g>
          <rect x={556} y={tip - 12} width={560 * slab} height={24} rx={6} fill={BLUE} />
          <Mono x={560} y={tip + 56} anchor="start" size={30} weight={800} color={BLUE} opacity={slab}>← DI SINI LO SALAH</Mono>
        </g>
      )}
      <line x1={-20} x2={520} y1={tip} y2={tip} stroke="#3A4556" strokeWidth={5} strokeDasharray="16 16" opacity={ramp(f, w.tanpa - 10, w.tanpa)} />
      <Mono x={250} y={tip + 56} size={28} color="#5A6577" weight={800} opacity={ramp(f, w.tanpa - 6, w.tanpa + 4)}>TANPA LANTAI</Mono>
      <Actor x={250} y={tip - 6} h={AH} color={WHITE} pose="shrug" pop={w.tanpa - 4} ring={false} />
      <Pill x={250} y={tip + 150} text="BERHARAP" size={40} border="#5A6577" color="#C9D1DB" at={w.berharap - 2} />
      <Actor x={830} y={tip - 12} h={AH} color={BLUE} pose="stand" pop={w.salah + 8} ring={false} />
      <Pill x={830} y={tip + 150} text="RENCANA" size={40} border={BLUE} color={BLUE} bg="#0B1730" at={w.rencana - 2} />
    </Svg>
  );
};

// ---------------------------------------------------------------------------------------------------------------

const Scene = () => {
  const f = useCurrentFrame();
  const {cue, word, narrationEnd} = useCues();
  const b = {hook: cue('hook'), line: cue('line'), common: cue('common'), floor: cue('floor'), near: cue('near'), payoff: cue('payoff'), end: narrationEnd};
  const w = {
    raka: word('raka', 0), beli: word('beli', 0), paginya: word('paginya'), rugi: word('rugi'), garis: word('garis'),
    pasang: word('pasang'), sejam: word('sejam'), tembus0: word('tembus', 0), keluar: word('keluar'), menang: word('menang'), pagi: word('pagi'),
    dari: word('dari', 0), terakhir: word('terakhir'), belas1: word('belas', 1), hampir: word('hampir'),
    arah: word('arah'), ekor: word('ekor'), pembeli: word('pembeli'), harga3: word('harga', 1), lantai0: word('lantai', 0), lantai1: word('lantai', 1), jebol0: word('jebol', 0), mati: word('mati'),
    dekat: word('dekat'), nol: word('nol'), tujuh1: word('tujuh', 1), sembilan: word('sembilan'),
    sinyal: word('sinyal'), salah: word('salah'), tanpa: word('tanpa'), berharap: word('berharap'), rencana: word('rencana'),
  };
  const loopAt = b.end + 3;
  // The hammer forms its real hour over the first sentence (a third done on frame 0, so the shape reads at once).
  const hp = interpolate(f, [-30, w.raka - 6], [0, 12], {...clamp, easing: ease.inOut});
  const sched: Array<[number, number]> = [[w.sejam - 4, 0], [w.tembus0 + 2, BREAK_I + 0.7], [w.menang, BOUNCE_I + 0.5], [w.pagi + 6, LOW_I + 0.4]];
  const p = interpolate(f, sched.map((s) => s[0]), sched.map((s) => s[1]), clamp);
  const stage = f < b.common ? 'chart' : f < b.floor ? 'crowd' : f < b.near ? 'floor' : f < b.payoff ? 'near' : f < loopAt ? 'payoff' : 'loop';
  // Cameras follow what the narration names, and never park.
  const kChart = [key(-30, 600, 1060, 1.06), key(w.raka, 640, 1080, 1.0), key(w.paginya, 700, 1000, 1.05), key(w.garis, 600, 1120, 1.02), key(w.tembus0, 560, 1140, 1.0), key(w.menang, 560, 1060, 1.0), key(w.pagi, 540, 1150, 1.0), key(b.common + 10, 540, 1120, 1.02)];
  const kCrowd = [key(b.common - 10, 540, 1060, 1.0), key(w.dari, 500, 1040, 1.02), key(w.terakhir, 600, 1040, 1.03), key(w.belas1, 540, 1120, 1.04), key(b.floor + 10, 540, 1140, 1.06)];
  const kFloor = [key(b.floor - 10, 540, 1080, 1.0), key(w.arah, 600, 1040, 1.02), key(w.ekor, 540, 1060, 1.02), key(w.pembeli, 540, 1300, 1.06), key(w.lantai0, 540, 1300, 1.0), key(w.mati, 520, 1360, 1.03), key(b.near + 10, 540, 1340, 1.05)];
  const kNear = [key(b.near - 10, 540, 1040, 1.0), key(w.dekat, 545, 1010, 1.0), key(w.tujuh1, 525, 985, 1.01), key(w.sembilan, 555, 1000, 1.02), key(b.payoff + 10, 540, 1010, 1.03)];
  const kPay = [key(b.payoff - 10, 540, 1000, 1.0), key(w.salah, 590, 1080, 1.03), key(w.berharap, 480, 1100, 1.04), key(w.rencana, 590, 1100, 1.04), key(loopAt + 10, 560, 1090, 1.05)];
  const kLoop = [key(loopAt - 10, 560, 1100, 1.04), key(loopAt + 40, 600, 1060, 1.06)];
  const nov14 = CROWD.find((e) => e.isNov14);
  const cz = cameraSpline(b.floor, kCrowd);
  const zoomOrigin: [number, number] = nov14 ? [(nov14.x - cz.x) * cz.s + 540, (nov14.y - 45 - cz.y) * cz.s + 960] : [540, 960];
  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      <Stage>
        {(stage === 'chart' || stage === 'loop') && (
          <div style={{position: 'absolute', inset: 0, ...(stage === 'chart' ? seam('blurSwap', f, b.common, 'out') : seam('blurSwap', f, loopAt, 'in'))}}>
            <Backdrop f={f} />
            <Cam keys={stage === 'chart' ? kChart : kLoop}>
              <ChartRoom f={f} p={stage === 'chart' ? p : 0} hp={stage === 'chart' ? hp : interpolate(f, [loopAt, loopAt + 30], [12, 4], clamp)} w={w} showFlash={stage === 'chart'} loop={stage === 'loop'} />
            </Cam>
          </div>
        )}
        {stage === 'crowd' && (
          <div style={{position: 'absolute', inset: 0, ...seam('blurSwap', f, b.common, 'in'), ...seam('zoom', f, b.floor, 'out', {dur: 12, origin: zoomOrigin})}}>
            <Cam keys={kCrowd}>
              <Crowd f={f} w={w} from={b.common} />
            </Cam>
          </div>
        )}
        {stage === 'floor' && (
          <div style={{position: 'absolute', inset: 0, ...seam('zoom', f, b.floor, 'in', {dur: 12}), ...seam('push', f, b.near, 'out')}}>
            <Cam keys={kFloor}>
              <BigHammer f={f} w={w} from={b.floor} />
            </Cam>
          </div>
        )}
        {stage === 'near' && (
          <div style={{position: 'absolute', inset: 0, ...seam('push', f, b.near, 'in'), ...seam('dip', f, b.payoff, 'out')}}>
            <Cam keys={kNear}>
              <Near f={f} w={w} from={b.near} />
            </Cam>
          </div>
        )}
        {stage === 'payoff' && (
          <div style={{position: 'absolute', inset: 0, ...seam('flood', f, b.payoff, 'in', {origin: [540, 1100]}), ...seam('blurSwap', f, loopAt, 'out')}}>
            <Cam keys={kPay}>
              <Payoff f={f} w={w} from={b.payoff} />
            </Cam>
          </div>
        )}
      </Stage>
      {/* Opening headline holds the caption line until the story starts; then the sentence builder takes over. */}
      {f < w.raka && (
        <div style={{position: 'absolute', left: 60, right: 60, top: 360, transform: `translateY(-50%) translateY(${(1 - ramp(f, -6, 8)) * 30}px)`, textAlign: 'center', fontFamily: fonts.heading, fontWeight: 700, fontSize: 72, lineHeight: 1.08, color: WHITE, opacity: 1 - ramp(f, w.raka - 6, w.raka)}}>
          HAMMER SAMA.
          <br />
          <span style={{color: BLUE}}>HASIL BEDA.</span>
        </div>
      )}
      <SentenceTrack y={360} size={52} preview={false} from={w.raka} />
    </AbsoluteFill>
  );
};

const episode: EpisodeModule = {config: config as EpisodeConfig, captions: captions as Captions, Scene};
export default episode;
