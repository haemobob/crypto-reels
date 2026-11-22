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
 * against an equal step up (17 vs 9), and Dina on her floor while Raka stands on nothing. Black ground, white
 * pictogram actors, brand blue as the only accent; red only for a loss.
 */
type K = [number, number, number, number, number];
type Hm = {t: number; o: number; h: number; l: number; c: number; floorPct: number; broke24: boolean; first: string};
const DATA = data as unknown as {ctx: K[]; hammer: K; after5m: K[]; hammers: Hm[]};
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const ramp = (f: number, a: number, b: number, e = ease.out) => (b <= a ? (f >= a ? 1 : 0) : interpolate(f, [a, b], [0, 1], {...clamp, easing: e}));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const BLUE = ACTOR.blue;
const RED = ACTOR.red;
const WHITE = ACTOR.white;
const GREY = '#7F8EA3';
const pct = (v: number) => `${v >= 0 ? '+' : '−'}${Math.abs(v).toFixed(1).replace('.', ',')}%`;
const fmt = (n: number) => n.toLocaleString('id-ID', {maximumFractionDigits: 0});
const key = (f: number, x: number, y: number, s: number): CamKey => ({f, x, y, s});

const Cam = ({keys, children}: {keys: CamKey[]; children: ReactNode}) => {
  const f = useCurrentFrame();
  return <div style={{position: 'absolute', inset: 0, transformOrigin: '0 0', transform: cameraCss(cameraSpline(f, keys))}}>{children}</div>;
};
const Svg = ({children}: {children: ReactNode}) => <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>{children}</svg>;
const Mono = ({x, y, size = 20, color = GREY, weight = 600, anchor = 'middle', children, opacity = 1}: {x: number; y: number; size?: number; color?: string; weight?: number; anchor?: 'middle' | 'start' | 'end'; children: ReactNode; opacity?: number}) => (
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
  const bot = Math.max(Y(Math.min(q.o, q.c)), top + 4);
  return (
    <g>
      <line x1={x} x2={x} y1={Y(q.h)} y2={Y(q.l)} stroke={color} strokeWidth={wick} strokeLinecap="round" />
      <rect x={x - w / 2} y={top} width={w} height={bot - top} rx={Math.min(4, w * 0.15)} fill={color} />
    </g>
  );
};

// The 14 Nov hammer and what came after (5 m bars, 11 hours).
const HAM = DATA.hammer;
const ENTRY = HAM[4];
const FLOOR = HAM[3];
const AFTER = DATA.after5m;
const BREAK_I = AFTER.findIndex((b) => b[3] < FLOOR); // first 5 m bar under the floor
const BOUNCE_I = (() => {
  let m = 0;
  for (let i = 12; i < 24; i++) if (AFTER[i][2] > AFTER[m][2] || m < 12) m = i;
  return m;
})();
const LOW_I = AFTER.reduce((m, b, i) => (b[3] < AFTER[m][3] ? i : m), 0);
const EXIT = (FLOOR - ENTRY) / ENTRY * 100; // Dina's stop, just under the floor: about −1.0%
/** The live price after `p` 5 m bars of replay (fractional), the running extremes, and each hourly candle so far. */
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
// Chapter 1: the chart room. The viewport reframes in data space (type and strokes keep their size).

const PX0 = 110;
const PX1 = 900;
const PY0 = 660;
const PY1 = 1250;
const X0 = 5.4; // the two hours falling into the hammer stay in view
const HI = Math.max(...DATA.ctx.slice(6).map((b) => b[2]), HAM[2]) * 1.001;
const viewAt = (p: number) => {
  const {lo} = replay(p);
  const wide = Math.min(1, p / 40) ** 0.7;
  return {x1: lerp(11.9, 20.4, wide), lo: Math.min(FLOOR * 0.997, lo * 0.9985)};
};

const ChartRoom = ({f, p, w, showFlash, loop}: {f: number; p: number; w: Record<string, number>; showFlash: boolean; loop?: boolean}) => {
  // Smooth the viewport with a short box filter over the replay (deterministic).
  const views = [-6, -3, 0].map((d) => viewAt(Math.max(0, p + d * 0.9)));
  const v = {x1: views.reduce((s, q) => s + q.x1, 0) / 3, lo: views.reduce((s, q) => s + q.lo, 0) / 3};
  const X = (slot: number) => PX0 + ((slot - X0) / (v.x1 - X0)) * (PX1 - PX0);
  const Y = (price: number) => PY0 + ((HI - price) / (HI - v.lo)) * (PY1 - PY0);
  const slotW = (PX1 - PX0) / (v.x1 - X0);
  const r = replay(p);
  const head = Math.min(AFTER.length - 1, Math.floor(p));
  const headSlot = 9 + head / 12;
  const live = p > 0;
  const shown = 1;
  const named = loop ? 1 : ramp(f, w.raka - 2, w.raka + 8);
  const floorDraw = loop ? 1 : ramp(f, w.garis - 6, w.garis + 12, ease.inOut);
  const broke = p >= BREAK_I + 0.67;
  const exitT = loop ? 0 : ramp(f, w.keluar - 4, w.keluar + 14, ease.inOut);
  // Raka rides the price head once the replay starts; before that he stands on the entry level beside Dina.
  const rakaX = live ? X(headSlot) + 34 : X(10.95);
  const rakaY = Y(live ? r.price : ENTRY);
  const rakaPct = ((r.price - ENTRY) / ENTRY) * 100;
  const rakaPose: Pose = loop || !live ? (f >= w.beli && !loop ? 'hold' : 'stand') : r.price > ENTRY * 1.002 && p < BOUNCE_I + 24 ? 'cheer' : rakaPct < -2 ? 'slump' : 'stand';
  const dina0: [number, number] = [X(9.45), Y(ENTRY)];
  const dina1: [number, number] = [X(6.9), Y(FLOOR)];
  const dinaX = lerp(dina0[0], dina1[0], exitT);
  const dinaY = lerp(dina0[1], dina1[1], exitT) - Math.sin(exitT * Math.PI) * 50;
  const flash = showFlash ? ramp(f, w.paginya - 2, w.paginya + 8) * (1 - ramp(f, w.pasang - 8, w.pasang + 2)) : 0;
  const AH = 120;
  return (
    <Svg>
      {/* hour grid: faint, so the room has depth */}
      {Array.from({length: 18}, (_, i) => i + 5).map((s) => (
        <line key={s} x1={X(s + 0.5)} x2={X(s + 0.5)} y1={PY0 - 30} y2={PY1 + 30} stroke="#10151D" strokeWidth={2} />
      ))}
      {DATA.ctx.slice(6).map((b, i) => (
        <Candle key={i} x={X(6 + i)} w={slotW * 0.5} q={{o: b[1], h: b[2], l: b[3], c: b[4]}} Y={Y} color="#3A4556" wick={4} />
      ))}
      <Candle x={X(8)} w={slotW * 0.56} q={{o: HAM[1], h: HAM[2], l: HAM[3], c: HAM[4]}} Y={Y} color={WHITE} wick={7} />
      <Mono x={X(8)} y={PY0 - 40} size={18} color="#C9D1DB">HAMMER · 14 NOV 22:00 WIB</Mono>
      <line x1={X(8)} x2={X(8)} y1={PY0 - 30} y2={Y(HAM[2]) - 10} stroke="#3A4556" strokeWidth={2} strokeDasharray="3 5" />
      {r.hours.map((q, i) => (
        <Candle key={`h${i}`} x={X(9 + i)} w={slotW * 0.5} q={q} Y={Y} color={q.c >= q.o ? '#C9D1DB' : '#5A6577'} wick={4} />
      ))}
      {/* entry level */}
      <line x1={X(8)} x2={PX1 + 40} y1={Y(ENTRY)} y2={Y(ENTRY)} stroke="#2A3240" strokeWidth={2} strokeDasharray="4 8" />
      {/* the line: the floor under the wick tip */}
      {floorDraw > 0 && (
        <g>
          <line x1={X(8) - 40} x2={X(8) - 40 + (PX1 + 80 - X(8)) * floorDraw} y1={Y(FLOOR)} y2={Y(FLOOR)} stroke={broke ? RED : BLUE} strokeWidth={5} strokeDasharray={broke ? '14 10' : undefined} />
          <Mono x={PX1 + 40} y={Y(FLOOR) - 14} anchor="end" size={18} color={broke ? RED : BLUE} opacity={floorDraw}>UJUNG EKOR {fmt(FLOOR)}</Mono>
        </g>
      )}
      {!loop && f >= w.pasang && exitT < 0.5 && <Pill x={X(9.45)} y={Y(FLOOR) + 30} text="STOP DINA" size={18} border={BLUE} color={BLUE} at={w.pasang} />}
      {live && p < AFTER.length && <circle cx={X(headSlot)} cy={Y(r.price)} r={9} fill={rakaPct >= 0 ? BLUE : RED} />}
      {exitT > 0 && (
        <g opacity={exitT}>
          <line x1={dina1[0] - 60} x2={dina1[0] + 60} y1={Y(FLOOR) + 2} y2={Y(FLOOR) + 2} stroke={BLUE} strokeWidth={8} strokeLinecap="round" />
          <Mono x={dina1[0]} y={Y(FLOOR) + 36} size={18} color={BLUE} weight={700}>KELUAR {pct(EXIT)}</Mono>
        </g>
      )}
      <g opacity={shown}>
        <Actor x={dinaX} y={dinaY} h={AH} color={BLUE} pose={!loop && f >= w.beli && exitT < 0.9 ? 'hold' : 'stand'} ring={false} />
        <Actor x={rakaX} y={rakaY} h={AH} color={WHITE} pose={rakaPose} ring={false} />
        {exitT < 0.5 && <Mono x={dinaX} y={dinaY + 28} size={18} color={BLUE} weight={700} opacity={named}>DINA</Mono>}
        <Mono x={rakaX} y={rakaY + 28} size={18} color={WHITE} weight={700} opacity={named}>RAKA</Mono>
      </g>
      {live && !loop && <Mono x={rakaX} y={rakaY - AH - 22} size={36} weight={800} color={rakaPct >= 0 ? BLUE : RED}>{pct(rakaPct)}</Mono>}
      {/* the flash-forward in the hook: where each one is tomorrow morning */}
      {flash > 0.01 && (
        <g opacity={flash}>
          <Mono x={(X(9.45) + X(10.95)) / 2} y={Y(ENTRY) - AH - 92} size={18} color="#C9D1DB">BESOK PAGI</Mono>
          <Pill x={X(10.95)} y={Y(ENTRY) - AH - 44} text="−5,7%" size={26} border={RED} color={RED} at={w.paginya} />
          {f >= w.rugi - 2 && <Pill x={X(9.45)} y={Y(ENTRY) - AH - 44} text="−1,0%" size={26} border={BLUE} color={BLUE} at={w.rugi - 2} />}
        </g>
      )}
    </Svg>
  );
};

// ---------------------------------------------------------------------------------------------------------------
// Chapter 2: the 28 hammers as a crowd of floors on a real timeline.

const T0 = Date.UTC(2026, 4, 25);
const T1 = Date.UTC(2026, 10, 21);
const tx = (t: number) => 150 + ((t - T0) / (T1 - T0)) * 780;
const CROWD = (() => {
  const placed: Array<{x: number; lvl: number}> = [];
  return DATA.hammers.map((h) => {
    const x = tx(h.t);
    let lvl = 0;
    while (placed.some((q) => q.lvl === lvl && Math.abs(q.x - x) < 30)) lvl++;
    placed.push({x, lvl});
    return {h, x, y: 1040 - lvl * 92, isNov14: h.t === HAM[0]};
  });
})();
const MONTHS: Array<[string, number]> = [['JUN', 5], ['JUL', 6], ['AGU', 7], ['SEP', 8], ['OKT', 9], ['NOV', 10]];

const Crowd = ({f, w, from}: {f: number; w: Record<string, number>; from: number}) => {
  const scanA = w.dari;
  const scanB = w.terakhir + 6;
  const broken = CROWD.filter((e) => e.h.broke24);
  const crackAt = (e: (typeof CROWD)[number]) => w.belas1 - 4 + broken.indexOf(e) * 3;
  const n = broken.filter((e) => f >= crackAt(e) + 6).length;
  return (
    <Svg>
      <line x1={150} x2={150 + 780 * ramp(f, from, from + 16, ease.inOut)} y1={1110} y2={1110} stroke="#2A3240" strokeWidth={3} />
      {MONTHS.map(([m, mo]) => (
        <Mono key={m} x={tx(Date.UTC(2026, mo, 1))} y={1146} size={18} opacity={ramp(f, from + 4 + mo, from + 12 + mo)}>{m}</Mono>
      ))}
      {f >= scanA && f < w.belas1 && <line x1={interpolate(f, [scanA, scanB], [150, 930], clamp)} x2={interpolate(f, [scanA, scanB], [150, 930], clamp)} y1={760} y2={1116} stroke={BLUE} strokeWidth={3} opacity={0.8} />}
      {CROWD.map((e, i) => {
        const at = e.isNov14 ? from : interpolate(e.x, [150, 930], [scanA, scanB]);
        if (f < at) return null;
        const c = e.h.broke24 ? ramp(f, crackAt(e), crackAt(e) + 10, ease.in) : 0;
        const col = e.isNov14 ? BLUE : c > 0.3 ? '#4A5568' : WHITE;
        return (
          <g key={i}>
            {/* the floor: one slab per hammer, at its real date; it cracks if it broke within a day */}
            <line x1={e.x - 15} x2={e.x - 2 - c * 4} y1={e.y + c * 14} y2={e.y + c * 22} stroke={e.isNov14 ? BLUE : '#C9D1DB'} strokeWidth={6} strokeLinecap="round" opacity={1 - c * 0.5} />
            <line x1={e.x + 2 + c * 4} x2={e.x + 15} y1={e.y + c * 22} y2={e.y + c * 14} stroke={e.isNov14 ? BLUE : '#C9D1DB'} strokeWidth={6} strokeLinecap="round" opacity={1 - c * 0.5} />
            <Actor x={e.x} y={e.y - 3 + c * 34} h={52} color={col} pose={c > 0.5 ? 'slump' : 'stand'} pop={at} ring={false} />
            {e.isNov14 && <Mono x={e.x} y={e.y - 70} size={17} color={BLUE} weight={700}>14 NOV</Mono>}
          </g>
        );
      })}
      <g opacity={ramp(f, w.belas1, w.belas1 + 8)}>
        <text x={540} y={1260} textAnchor="middle" fontFamily={fonts.mono} fontWeight={800} fontSize={88} fill={RED}>{n}<tspan fill="#C9D1DB" fontSize={56}> / 28</tspan></text>
        <Mono x={540} y={1302} size={22} color="#C9D1DB">UJUNG EKOR TEMBUS DALAM 24 JAM</Mono>
      </g>
      <Pill x={540} y={1360} text="HAMPIR SETENGAH" size={24} border={RED} at={w.hampir} />
      <Mono x={540} y={705} size={22} color="#C9D1DB" opacity={ramp(f, scanA, scanA + 8)}>28 HAMMER BITCOIN · 1 JAM · 6 BULAN</Mono>
    </Svg>
  );
};

// ---------------------------------------------------------------------------------------------------------------
// Chapter 3: the wick becomes a floor.

const BigHammer = ({f, w, from}: {f: number; w: Record<string, number>; from: number}) => {
  const [, o, hi, lo, c] = HAM;
  const top = 640;
  const H = 560;
  const Y = (v: number) => top + ((hi - v) / (hi - lo)) * H;
  const cx = 540;
  const draw = ramp(f, from, from + 18, ease.inOut);
  // "Ekor panjang itu jejak pembeli yang nahan harga": the price runs down the wick and is pushed back up.
  const run = interpolate(f, [w.ekor, w.pembeli, w.harga3 + 8], [o, lo, c], clamp);
  const running = f >= w.ekor && f < w.lantai0;
  const slab = ramp(f, w.lantai0 - 2, w.lantai0 + 14, ease.inOut);
  const crack = ramp(f, w.jebol0, w.jebol0 + 12, ease.in);
  const idea = ramp(f, w.jebol0 + 2, w.mati + 4, ease.in);
  const tip = Y(lo);
  return (
    <Svg>
      <line x1={cx} x2={cx} y1={Y(hi)} y2={Y(hi) + (tip - Y(hi)) * draw} stroke={WHITE} strokeWidth={26} strokeLinecap="round" />
      <rect x={cx - 80} y={Y(Math.max(o, c))} width={160} height={Math.max(14, Y(Math.min(o, c)) - Y(Math.max(o, c)))} rx={8} fill={WHITE} opacity={ramp(f, from + 8, from + 18)} />
      <Mono x={cx - 110} y={Y(hi) + 40} anchor="end" size={20} color={GREY} opacity={draw}>HAMMER 14 NOV</Mono>
      <g opacity={1 - ramp(f, w.pembeli - 6, w.pembeli + 4)}>
        <Pill x={cx + 220} y={Y(Math.min(o, c)) + 70} text="BUKAN BUAT NEBAK ARAH" size={22} border={RED} at={w.arah - 4} />
      </g>
      {running && <circle cx={cx + 40} cy={Y(run)} r={12} fill={BLUE} />}
      {/* buyers holding the price at the bottom of the wick */}
      {[-90, 0, 90].map((dx, i) => (
        <Actor key={i} x={cx + dx} y={tip + 150} h={92} color={BLUE} pose="cheer" pop={w.pembeli - 6 + i * 3} ring={false} />
      ))}
      <Mono x={cx} y={tip + 190} size={20} color={BLUE} opacity={ramp(f, w.pembeli, w.pembeli + 8) * (1 - slab)}>PEMBELI NAHAN HARGA</Mono>
      {/* the floor */}
      {slab > 0 && (
        <g>
          <rect x={cx - 400 * slab - crack * 30} y={tip - 2 + crack * 26} width={400 * slab - 6} height={16} rx={4} fill={BLUE} transform={`rotate(${-crack * 9} ${cx - 6} ${tip + 6})`} />
          <rect x={cx + 6 + crack * 30} y={tip - 2 + crack * 26} width={400 * slab - 6} height={16} rx={4} fill={BLUE} transform={`rotate(${crack * 9} ${cx + 6} ${tip + 6})`} />
          <Mono x={cx + 300} y={tip - 22} size={26} weight={800} color={BLUE} opacity={slab * (1 - crack)}>LANTAI</Mono>
        </g>
      )}
      {f >= w.lantai1 - 4 && (
        <g transform={`translate(0 ${idea * 260})`} opacity={1 - idea * 0.4}>
          <Pill x={cx - 230} y={tip - 30} text={idea > 0.6 ? 'IDE BELI ✕ MATI' : 'IDE BELI'} size={24} border={idea > 0.6 ? RED : BLUE} color={idea > 0.6 ? RED : WHITE} at={w.lantai1 - 4} />
        </g>
      )}
    </Svg>
  );
};

// ---------------------------------------------------------------------------------------------------------------
// Chapter 4: the floor is close. A short step down against an equal step up; 28 traders, 17 up first, 9 down first.

const NEAR_ENTRY = 960;
const STEP = 200; // the median 0.77% drawn as 200 px, and the same step up
const Near = ({f, w, from}: {f: number; w: Record<string, number>; from: number}) => {
  const floorY = interpolate(f, [w.dekat - 4, w.dekat + 16], [1420, NEAR_ENTRY + STEP], {...clamp, easing: ease.inOut});
  const ruler = ramp(f, w.nol - 2, w.nol + 10);
  const target = ramp(f, w.tujuh1 - 8, w.tujuh1);
  const upT = (i: number) => ramp(f, w.tujuh1 + i * 1.6, w.tujuh1 + i * 1.6 + 12, ease.inOut);
  const dnT = (i: number) => ramp(f, w.sembilan + i * 2.4, w.sembilan + i * 2.4 + 12, ease.in);
  const ups = DATA.hammers.filter((h) => h.first === 'up');
  const dns = DATA.hammers.filter((h) => h.first === 'floor');
  const nUp = ups.filter((_, i) => upT(i) > 0.95).length;
  const nDn = dns.filter((_, i) => dnT(i) > 0.95).length;
  const line = (y: number, color: string, width: number, dash?: string, o = 1) => <line x1={130} x2={850} y1={y} y2={y} stroke={color} strokeWidth={width} strokeDasharray={dash} strokeLinecap="round" opacity={o} />;
  return (
    <Svg>
      {line(NEAR_ENTRY, '#5A6577', 3, '6 8', ramp(f, from, from + 10))}
      <Mono x={862} y={NEAR_ENTRY + 7} anchor="start" size={18} color="#C9D1DB" opacity={ramp(f, from, from + 10)}>HARGA BELI</Mono>
      {line(floorY, BLUE, 8)}
      <Mono x={862} y={floorY + 7} anchor="start" size={20} color={BLUE} weight={800}>LANTAI</Mono>
      {line(NEAR_ENTRY - STEP, '#C9D1DB', 3, '10 8', target)}
      <Mono x={862} y={NEAR_ENTRY - STEP + 7} anchor="start" size={18} color="#C9D1DB" opacity={target}>+0,8%</Mono>
      {ruler > 0 && (
        <g opacity={ruler}>
          <line x1={1000} x2={1000} y1={NEAR_ENTRY + 22} y2={NEAR_ENTRY + STEP - 22} stroke="#C9D1DB" strokeWidth={3} />
          <text x={985} y={NEAR_ENTRY + STEP / 2 + 16} textAnchor="end" fontFamily={fonts.mono} fontWeight={800} fontSize={46} fill={WHITE}>0,8%</text>
          <Mono x={985} y={NEAR_ENTRY + STEP / 2 + 44} anchor="end" size={15}>MEDIAN</Mono>
        </g>
      )}
      {/* 28 traders on the entry line, by date; the up-first rise to the step above, the floor-first fall through */}
      {DATA.hammers.map((h, i) => {
        const x = 160 + i * 24.6;
        const ui = ups.indexOf(h);
        const di = dns.indexOf(h);
        const up = ui >= 0 ? upT(ui) : 0;
        const dn = di >= 0 ? dnT(di) : 0;
        const y = NEAR_ENTRY - 2 - up * STEP + dn * (STEP + 110);
        const other = ui < 0 && di < 0 && f > w.sembilan + 24;
        const col = up > 0.5 ? BLUE : dn > 0.5 || other ? '#4A5568' : WHITE;
        return <Actor key={i} x={x} y={y} h={36} color={col} pose={dn > 0.5 ? 'slump' : 'stand'} pop={from + 6 + i * 0.8} ring={false} />;
      })}
      <g opacity={ramp(f, w.tujuh1, w.tujuh1 + 8)}>
        <text x={160} y={690} fontFamily={fonts.mono} fontWeight={800} fontSize={96} fill={BLUE}>{nUp}</text>
        <Mono x={300} y={690} anchor="start" size={22} color={BLUE} weight={700}>KALI NAIK DULUAN</Mono>
      </g>
      <g opacity={ramp(f, w.sembilan, w.sembilan + 8)}>
        <text x={160} y={1430} fontFamily={fonts.mono} fontWeight={800} fontSize={96} fill="#C9D1DB">{nDn}</text>
        <Mono x={250} y={1430} anchor="start" size={22} color="#C9D1DB" weight={700}>KALI LANTAI JEBOL DULUAN</Mono>
        <Mono x={250} y={1462} anchor="start" size={15} opacity={ramp(f, w.sembilan + 24, w.sembilan + 32)}>2 LAINNYA: TIDAK JELAS DALAM 48 JAM</Mono>
      </g>
    </Svg>
  );
};

// ---------------------------------------------------------------------------------------------------------------
// Chapter 5: the payoff. Dina on her floor, Raka on nothing.

const Payoff = ({f, w, from}: {f: number; w: Record<string, number>; from: number}) => {
  const [, o, hi, lo, c] = HAM;
  const Y = (v: number) => 660 + ((hi - v) / (hi - lo)) * 420;
  const tip = Y(lo);
  const slab = ramp(f, w.salah - 4, w.salah + 14, ease.inOut);
  const AH = 150;
  return (
    <Svg>
      <line x1={540} x2={540} y1={Y(hi)} y2={tip} stroke={WHITE} strokeWidth={18} strokeLinecap="round" opacity={ramp(f, from, from + 10)} />
      <rect x={480} y={Y(Math.max(o, c))} width={120} height={Math.max(12, Y(Math.min(o, c)) - Y(Math.max(o, c)))} rx={6} fill={WHITE} opacity={ramp(f, from, from + 10)} />
      <Pill x={540} y={612} text="BUKAN SINYAL BELI" size={24} border={RED} at={w.sinyal - 2} />
      {slab > 0 && (
        <g>
          <rect x={548} y={tip - 7} width={400 * slab} height={14} rx={4} fill={BLUE} />
          <Mono x={548} y={tip + 40} anchor="start" size={20} weight={800} color={BLUE} opacity={slab}>← DI SINI LO SALAH</Mono>
        </g>
      )}
      <line x1={140} x2={532} y1={tip} y2={tip} stroke="#3A4556" strokeWidth={3} strokeDasharray="10 12" opacity={ramp(f, w.tanpa - 10, w.tanpa)} />
      <Mono x={330} y={tip + 40} size={20} color="#5A6577" weight={700} opacity={ramp(f, w.tanpa - 6, w.tanpa + 4)}>TANPA LANTAI</Mono>
      <Actor x={320} y={tip - 4} h={AH} color={WHITE} pose="shrug" pop={w.tanpa - 4} ring={false} />
      <Pill x={320} y={tip + 100} text="BERHARAP" size={28} border="#5A6577" color="#C9D1DB" at={w.berharap - 2} />
      <Actor x={790} y={tip - 7} h={AH} color={BLUE} pose="stand" pop={w.salah + 8} ring={false} />
      <Pill x={790} y={tip + 100} text="RENCANA" size={28} border={BLUE} color={BLUE} bg="#0B1730" at={w.rencana - 2} />
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
  // Replay of the 11 hours after the hammer, its moments on the words: the break on "tembus", the bounce on
  // "menang", the low on "pagi".
  const sched: Array<[number, number]> = [[w.sejam - 4, 0], [w.tembus0 + 2, BREAK_I + 0.7], [w.menang, BOUNCE_I + 0.5], [w.pagi + 6, LOW_I + 0.4]];
  const p = interpolate(f, sched.map((s) => s[0]), sched.map((s) => s[1]), clamp);
  const stage = f < b.common ? 'chart' : f < b.floor ? 'crowd' : f < b.near ? 'floor' : f < b.payoff ? 'near' : f < loopAt ? 'payoff' : 'loop';
  const source =
    stage === 'chart' || stage === 'loop'
      ? 'ILUSTRASI: RAKA & DINA FIKTIF · HARGA ASLI BINANCE BTCUSDT 1 JAM · BUKAN SARAN INVESTASI'
      : stage === 'payoff'
        ? 'BUKAN SARAN INVESTASI'
        : '28 HAMMER BTC 1 JAM · 25 MEI–21 NOV 2026 · HITUNGAN CRYPTONITE · SAMPEL KECIL · TANPA FEE';
  // Cameras: each follows what the narration names, and never parks.
  const kChart = [key(-30, 560, 975, 1.0), key(w.garis, 545, 990, 1.03), key(w.tembus0, 560, 1000, 1.04), key(w.menang, 590, 960, 1.04), key(w.pagi, 560, 1010, 1.03), key(b.common + 10, 540, 1000, 1.05)];
  const kCrowd = [key(b.common - 10, 540, 980, 1.02), key(w.dari, 520, 975, 1.03), key(w.terakhir, 580, 970, 1.04), key(w.belas1, 540, 1010, 1.05), key(b.floor + 10, 540, 1020, 1.07)];
  const kFloor = [key(b.floor - 10, 540, 960, 1.0), key(w.ekor, 545, 940, 1.02), key(w.pembeli, 540, 1050, 1.04), key(w.lantai0, 540, 1080, 1.03), key(w.mati, 530, 1110, 1.05), key(b.near + 10, 540, 1100, 1.06)];
  const kNear = [key(b.near - 10, 540, 980, 1.0), key(w.dekat, 545, 1010, 1.02), key(w.tujuh1, 520, 930, 1.03), key(w.sembilan, 565, 990, 1.04), key(b.payoff + 10, 540, 1000, 1.05)];
  const kPay = [key(b.payoff - 10, 540, 940, 1.0), key(w.salah, 600, 980, 1.03), key(w.berharap, 450, 1010, 1.05), key(w.rencana, 640, 1010, 1.06), key(loopAt + 10, 600, 1000, 1.07)];
  const kLoop = [key(loopAt - 10, 560, 990, 1.05), key(loopAt + 40, 560, 975, 1.0)];
  // The crowd chapter opens by zooming out of the chart; the floor chapter zooms into the 14 Nov slab.
  const nov14 = CROWD.find((e) => e.isNov14);
  const cz = cameraSpline(b.floor, kCrowd);
  const zoomOrigin: [number, number] = nov14 ? [(nov14.x - cz.x) * cz.s + 540, (nov14.y - cz.y) * cz.s + 960] : [540, 960];
  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      {(stage === 'chart' || stage === 'loop') && (
        <div style={{position: 'absolute', inset: 0, ...(stage === 'chart' ? seam('blurSwap', f, b.common, 'out') : seam('blurSwap', f, loopAt, 'in'))}}>
          <Cam keys={stage === 'chart' ? kChart : kLoop}>
            <ChartRoom f={f} p={stage === 'chart' ? p : 0} w={w} showFlash={stage === 'chart'} loop={stage === 'loop'} />
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
        <div style={{position: 'absolute', inset: 0, ...seam('flood', f, b.payoff, 'in', {origin: [540, 1000]}), ...seam('blurSwap', f, loopAt, 'out')}}>
          <Cam keys={kPay}>
            <Payoff f={f} w={w} from={b.payoff} />
          </Cam>
        </div>
      )}
      {/* Opening headline holds the type zone until the story starts; then the sentence builder takes over. */}
      {f < w.raka && (
        <div style={{position: 'absolute', left: 60, right: 60, top: 440, transform: `translateY(-50%) translateY(${(1 - ramp(f, -6, 8)) * 30}px)`, textAlign: 'center', fontFamily: fonts.heading, fontWeight: 700, fontSize: 66, lineHeight: 1.1, color: WHITE, opacity: 1 - ramp(f, w.raka - 6, w.raka)}}>
          HAMMER SAMA.
          <br />
          <span style={{color: BLUE}}>HASIL BEDA.</span>
        </div>
      )}
      <SentenceTrack y={440} size={50} preview={false} from={w.raka} />
      <div style={{position: 'absolute', left: 60, right: 60, top: 1530, textAlign: 'center', fontFamily: fonts.mono, fontWeight: 500, fontSize: 17, letterSpacing: '0.04em', color: GREY}}>{source}</div>
    </AbsoluteFill>
  );
};

const episode: EpisodeModule = {config: config as EpisodeConfig, captions: captions as Captions, Scene};
export default episode;
