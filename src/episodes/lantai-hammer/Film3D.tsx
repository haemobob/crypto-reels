import {ContactShadows, RoundedBox} from '@react-three/drei';
import {useThree} from '@react-three/fiber';
import {ThreeCanvas} from '@remotion/three';
import type {ReactNode} from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import * as THREE from 'three';
import {SentenceTrack} from '../../components/actors';
import {seam} from '../../components/motion';
import {Figure, Ground, Slab, Studio, graphite, porcelain} from '../../compositions/LantaiStyle';
import {cameraSpline} from '../../lib/camera';
import {useCues} from '../../lib/cues';
import type {V3} from '../../three/camera';
import {Post} from '../../three/post';
import {ease} from '../../theme/motion';
import {fonts} from '../../theme/typography';
import data from './data.json';

/**
 * lantai-hammer, the 3D film (user, 22 Nov 2026: the flat pictograms were "not up to 0x100x"). Dark graphite studio,
 * porcelain and brand-blue figures, real-price candles as objects, the floor as a blue glass slab, depth of field.
 * Real prices: Binance BTCUSDT (14 Nov 2026 hammer; 28 H1 hammers 25 May–21 Nov 2026). Raka and Dina are fictional.
 * Only the caption line at the top is reserved; graphics own the frame. HUD numbers sit in clear space.
 */
type K = [number, number, number, number, number];
type Hm = {t: number; broke24: boolean; first: string};
const DATA = data as unknown as {ctx: K[]; hammer: K; hammer5m: K[]; after5m: K[]; hammers: Hm[]};
type OHLC = {o: number; h: number; l: number; c: number};
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const ramp = (f: number, a: number, b: number, e = ease.out) => (b <= a ? (f >= a ? 1 : 0) : interpolate(f, [a, b], [0, 1], {...clamp, easing: e}));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const BLUE = '#2997FF';
const RED = '#FF5263';
const pct = (v: number) => `${v >= 0 ? '+' : '−'}${Math.abs(v).toFixed(1).replace('.', ',')}%`;

// ---------------------------------------------------------------------------------------------------------------
// Real bars replayed (open → low → high → close for an up bar, open → high → low → close for a down bar).

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
const replay = (p: number) => {
  let price = ENTRY;
  const hours: OHLC[] = [];
  for (let i = 0; i < AFTER.length && p > i; i++) {
    const q = partial(AFTER[i], p - i);
    price = q.c;
    const hIdx = Math.floor(i / 12);
    const cur = hours[hIdx];
    hours[hIdx] = cur ? {o: cur.o, h: Math.max(cur.h, q.h), l: Math.min(cur.l, q.l), c: q.c} : {...q};
  }
  return {price, hours};
};

// ---------------------------------------------------------------------------------------------------------------
// 3D kit

const Candle = ({q, x, z = 0, w = 0.5, Y, mat, opacity = 1}: {q: OHLC; x: number; z?: number; w?: number; Y: (p: number) => number; mat: object; opacity?: number}) => {
  const top = Y(Math.max(q.o, q.c));
  const bot = Y(Math.min(q.o, q.c));
  const bh = Math.max(0.06, top - bot);
  const wl = Math.max(0.02, Y(q.h) - Y(q.l));
  const m = opacity < 1 ? {...mat, transparent: true, opacity} : mat;
  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, (Y(q.h) + Y(q.l)) / 2, 0]} castShadow>
        <cylinderGeometry args={[w * 0.08, w * 0.08, wl, 20]} />
        <meshPhysicalMaterial {...m} />
      </mesh>
      <RoundedBox args={[w, bh, w]} radius={Math.min(0.05, bh / 2.2)} smoothness={4} position={[0, bot + bh / 2, 0]} castShadow>
        <meshPhysicalMaterial {...m} />
      </RoundedBox>
    </group>
  );
};

type Cam = {pos: V3; look: V3; fov?: number};
const FnCamera = ({cam}: {cam: Cam}) => {
  const {camera} = useThree();
  const c = camera as THREE.PerspectiveCamera;
  c.position.set(...cam.pos);
  c.fov = cam.fov ?? 32;
  c.near = 0.05;
  c.far = 200;
  c.updateProjectionMatrix();
  c.lookAt(...cam.look);
  c.updateMatrixWorld();
  return null;
};
/** Camera keys through which the camera keeps moving (spline, never parks). */
const camAt = (f: number, keys: Array<{f: number; pos: V3; look: V3}>, fov = 32): Cam => {
  const p = cameraSpline(f, keys.map((k) => ({f: k.f, x: k.pos[0], y: k.pos[1], s: k.pos[2]})));
  const l = cameraSpline(f, keys.map((k) => ({f: k.f, x: k.look[0], y: k.look[1], s: k.look[2]})));
  return {pos: [p.x, p.y, p.s], look: [l.x, l.y, l.s], fov};
};

const Studio3D = ({cam, focus, children}: {cam: Cam; focus: V3; children: ReactNode}) => (
  <div style={{position: 'absolute', inset: 0, clipPath: 'inset(470px 0 0 0)'}}>
  <ThreeCanvas width={1080} height={1920} gl={{antialias: false, toneMapping: THREE.NoToneMapping, preserveDrawingBuffer: true}} dpr={1} shadows>
    <FnCamera cam={cam} />
    <color attach="background" args={['#000000']} />
    <fog attach="fog" args={['#000000', 14, 36]} />
    <Studio />
    <spotLight position={[1, 14, 7]} angle={0.55} penumbra={1} intensity={160} distance={50} decay={2} color="#ffffff" castShadow />
    <ambientLight intensity={0.06} />
    {children}
    <ContactShadows position={[0, 0.003, 0]} opacity={0.7} scale={30} blur={2.4} far={8} resolution={1024} />
    <Ground />
    <Post focus={focus} focalLength={0.02} bokehScale={3} bloom={0.5} bloomThreshold={0.7} grain={0.04} />
  </ThreeCanvas>
  </div>
);

// HUD type (screen space, never on the caption line)
const Num = ({x, y, size = 96, color = '#FFFFFF', anchor = 'left', children, opacity = 1}: {x: number; y: number; size?: number; color?: string; anchor?: 'left' | 'right' | 'center'; children: ReactNode; opacity?: number}) => (
  <div style={{position: 'absolute', top: y, ...(anchor === 'right' ? {right: 1080 - x} : anchor === 'center' ? {left: x, transform: 'translateX(-50%)'} : {left: x}), fontFamily: fonts.mono, fontWeight: 800, fontSize: size, lineHeight: 1, color, opacity, whiteSpace: 'nowrap', textAlign: anchor}}>{children}</div>
);
const Lab = ({x, y, size = 26, color = '#A8BDD8', anchor = 'left', children, opacity = 1}: {x: number; y: number; size?: number; color?: string; anchor?: 'left' | 'right' | 'center'; children: ReactNode; opacity?: number}) => (
  <div style={{position: 'absolute', top: y, ...(anchor === 'right' ? {right: 1080 - x} : anchor === 'center' ? {left: x, transform: 'translateX(-50%)'} : {left: x}), fontFamily: fonts.mono, fontWeight: 700, fontSize: size, letterSpacing: '0.05em', color, opacity, whiteSpace: 'nowrap', textAlign: anchor}}>{children}</div>
);

// ---------------------------------------------------------------------------------------------------------------
// Chapter 1: Raka and Dina on the real 14 Nov hammer.

const PY1 = (p: number) => ((p - 61500) / 4000) * 6;
const LANE = 1.1; // the traders' lane, in front of the candles
const hourX = (i: number) => 0.9 * (i + 1);

const Chart = ({f, w, p, hp, loop}: {f: number; w: Record<string, number>; p: number; hp: number; loop?: boolean}) => {
  const r = replay(p);
  const live = p > 0;
  const headX = 0.9 * (1 + Math.min(p, AFTER.length) / 12) - 0.45;
  const walk = loop ? 1 : ramp(f, w.raka - 4, w.beli - 2);
  const floorDraw = loop ? 1 : ramp(f, w.garis - 6, w.garis + 14, ease.inOut);
  const broke = p >= BREAK_I + 0.67;
  const exitT = loop ? 0 : ramp(f, w.keluar - 4, w.keluar + 16, ease.inOut);
  const rakaPct = ((r.price - ENTRY) / ENTRY) * 100;
  const cheer = live && r.price > ENTRY * 1.002 && p < BOUNCE_I + 24;
  const raka: V3 = live ? [headX, PY1(r.price), LANE] : [lerp(5.4, 2.1, walk), PY1(ENTRY), LANE];
  const dinaA: V3 = [lerp(4.6, 0.95, walk), PY1(ENTRY), LANE];
  const dinaB: V3 = [-1.25, PY1(FLOOR) + 0.05, LANE];
  const dina: V3 = [lerp(dinaA[0], dinaB[0], exitT), lerp(dinaA[1], dinaB[1], exitT) + Math.sin(exitT * Math.PI) * 0.5, LANE];
  const hq = aggregate(DATA.hammer5m, hp);
  // Camera: the hook frames the hammer and the two; the replay follows Raka down; then a slow pull back.
  const fall = Math.min(1, p / LOW_I);
  const look: V3 = live ? [lerp(1.15, headX - 0.4, Math.min(1, p / 14)), lerp(PY1(ENTRY) + 0.55, PY1(r.price) + 0.75, Math.min(1, p / 14)), 0.5] : [1.15, PY1(ENTRY) + 0.55, 0.5];
  const dist = lerp(9.5, 13, fall) + Math.max(0, f - w.pagi) * 0.006 + (live ? 0 : (1 - ramp(f, -30, w.garis + 20, ease.inOut)) * 1.0);
  const cam: Cam = {pos: [look[0] + 0.7, look[1] + 0.9, look[2] + dist], look, fov: 30};
  return (
    <Studio3D cam={cam} focus={live ? raka : [1.0, PY1(ENTRY), LANE]}>
      <Candle q={{o: DATA.ctx[6][1], h: DATA.ctx[6][2], l: DATA.ctx[6][3], c: DATA.ctx[6][4]}} x={-1.8} Y={PY1} mat={graphite} />
      <Candle q={{o: DATA.ctx[7][1], h: DATA.ctx[7][2], l: DATA.ctx[7][3], c: DATA.ctx[7][4]}} x={-0.9} Y={PY1} mat={graphite} />
      {hp < 12 && <Candle q={{o: HAM[1], h: HAM[2], l: HAM[3], c: HAM[4]}} x={0} Y={PY1} mat={porcelain} opacity={0.14} />}
      <Candle q={hq} x={0} Y={PY1} mat={porcelain} />
      {hp < 12 && (
        <mesh position={[0.32, PY1(hq.c), 0]}>
          <sphereGeometry args={[0.07, 24, 24]} />
          <meshBasicMaterial color={BLUE} />
        </mesh>
      )}
      {r.hours.map((q, i) => (
        <Candle key={i} q={q} x={hourX(i)} Y={PY1} mat={q.c >= q.o ? porcelain : graphite} />
      ))}
      {live && p < AFTER.length && (
        <mesh position={[headX, PY1(r.price), 0]}>
          <sphereGeometry args={[0.08, 24, 24]} />
          <meshBasicMaterial color={rakaPct >= 0 ? BLUE : RED} />
        </mesh>
      )}
      {/* the entry ledge the two stand on */}
      <RoundedBox args={[2.6, 0.05, 0.9]} radius={0.02} position={[1.55, PY1(ENTRY) - 0.025, LANE]}>
        <meshPhysicalMaterial color="#8FA3BF" roughness={0.1} transparent opacity={0.35 * walk} />
      </RoundedBox>
      {/* the floor under the wick tip: draws out on "satu garis" */}
      {floorDraw > 0 && <Slab position={[-1.9 + (12.5 * floorDraw) / 2, PY1(FLOOR) - 0.05, LANE]} size={[12.5 * floorDraw, 0.08, 0.9]} color={broke ? '#C2394A' : BLUE} glow={broke ? 0.6 : 1} />}
      <Figure position={dina} scale={0.42} color={BLUE} arms={!loop && f >= w.beli && exitT < 0.9 ? 'out' : undefined} />
      <Figure position={raka} scale={0.42} arms={cheer ? 'up' : !live && !loop && f >= w.beli ? 'out' : undefined} tilt={live && rakaPct < -2 ? -0.28 : 0} />
    </Studio3D>
  );
};

const ChartHud = ({f, w, p, loop}: {f: number; w: Record<string, number>; p: number; loop?: boolean}) => {
  if (loop) return null;
  const r = replay(p);
  const live = p > 0;
  const rakaPct = ((r.price - ENTRY) / ENTRY) * 100;
  const flash = ramp(f, w.paginya - 2, w.paginya + 8) * (1 - ramp(f, w.sejam - 8, w.sejam + 2));
  const exited = f >= w.keluar;
  return (
    <>
      {flash > 0.01 && (
        <>
          <Lab x={540} y={520} anchor="center" opacity={flash}>BESOK PAGI</Lab>
          <Num x={90} y={570} size={92} color={BLUE} opacity={f >= w.rugi - 2 ? flash : 0}>−1,0%</Num>
          <Lab x={96} y={672} color={BLUE} opacity={f >= w.rugi - 2 ? flash : 0}>DINA</Lab>
          <Num x={990} y={570} size={92} color={RED} anchor="right" opacity={flash}>−5,7%</Num>
          <Lab x={984} y={672} anchor="right" opacity={flash}>RAKA</Lab>
        </>
      )}
      {f >= w.pasang && f < w.keluar + 10 && <Lab x={540} y={1560} anchor="center" color={BLUE} size={24} opacity={ramp(f, w.pasang, w.pasang + 8)}>STOP DINA DI BAWAH UJUNG EKOR · SIMULASI</Lab>}
      {live && (
        <>
          <Num x={990} y={540} size={96} color={rakaPct >= 0 ? BLUE : RED} anchor="right">{pct(rakaPct)}</Num>
          <Lab x={984} y={646} anchor="right">RAKA</Lab>
        </>
      )}
      {exited && (
        <>
          <Num x={90} y={540} size={96} color={BLUE} opacity={ramp(f, w.keluar, w.keluar + 10)}>{pct(EXIT)}</Num>
          <Lab x={96} y={646} color={BLUE} opacity={ramp(f, w.keluar, w.keluar + 10)}>DINA KELUAR</Lab>
        </>
      )}
      {f < w.garis + 40 && <Lab x={540} y={1500} anchor="center" size={22} opacity={1 - ramp(f, w.garis + 20, w.garis + 40)}>BTC/USDT · 1 JAM · 14 NOV 2026 · 22:00 WIB</Lab>}
    </>
  );
};

// ---------------------------------------------------------------------------------------------------------------
// Chapter 2: 28 real hammers as floors receding into depth; 13 crack.

const Crowd = ({f, w, from}: {f: number; w: Record<string, number>; from: number}) => {
  const nov = DATA.hammers.findIndex((h) => h.t === HAM[0]);
  const broken = DATA.hammers.map((h, i) => (h.broke24 ? i : -1)).filter((i) => i >= 0);
  const scanA = w.dari;
  const scanB = w.terakhir + 6;
  const cam = camAt(f, [
    {f: from - 10, pos: [-2.2, 3.1, 12], look: [1.4, 0.7, -5]},
    {f: w.belas1, pos: [-1.6, 2.5, 10], look: [1.2, 0.5, -6]},
    {f: w.floor + 10, pos: [-1.2, 2.1, 8.6], look: [1.1, 0.4, -6.5]},
  ], 36);
  return (
    <Studio3D cam={cam} focus={[0.6, 0.5, -4]}>
      {DATA.hammers.map((h, i) => {
        const t = i / 27;
        const x = -3.6 + t * 7.5 + (i % 2) * 0.55;
        const z = 2.2 - t * 16 - (i % 2) * 1.1;
        const at = i === nov ? from : interpolate(t, [0, 1], [scanA, scanB]);
        const pop = ramp(f, at, at + 10);
        if (pop <= 0) return null;
        const k = broken.indexOf(i);
        const c = k >= 0 ? ramp(f, w.belas1 - 4 + k * 3, w.belas1 + 8 + k * 3, ease.in) : 0;
        const col = i === nov ? BLUE : c > 0.4 ? '#3A4352' : '#F2F4F7';
        return (
          <group key={i} position={[x, 0, z]} scale={0.6 + 0.4 * pop}>
            <Slab position={[-0.33 - c * 0.05, 0.3 - c * 0.18, 0]} size={[0.62, 0.08, 0.7]} rot={-0.35 * c} glow={1 - 0.6 * c} />
            <Slab position={[0.33 + c * 0.05, 0.3 - c * 0.18, 0]} size={[0.62, 0.08, 0.7]} rot={0.35 * c} glow={1 - 0.6 * c} />
            <Figure position={[c * 0.1, 0.34 - c * 0.32, c * 0.15]} scale={0.42} color={col} tilt={c * 1.3} face={c < 0.5} />
          </group>
        );
      })}
    </Studio3D>
  );
};
const CrowdHud = ({f, w}: {f: number; w: Record<string, number>}) => {
  const broken = DATA.hammers.filter((h) => h.broke24).length;
  const n = Math.round(interpolate(f, [w.belas1 - 4, w.belas1 + 8 + broken * 3], [0, broken], clamp));
  return (
    <>
      <Lab x={540} y={520} anchor="center" opacity={ramp(f, w.dari, w.dari + 8)}>28 HAMMER BITCOIN · 1 JAM · 6 BULAN</Lab>
      <div style={{position: 'absolute', left: 70, top: 1300, fontFamily: fonts.mono, fontWeight: 800, fontSize: 190, color: RED, lineHeight: 1, opacity: ramp(f, w.belas1 - 4, w.belas1 + 4)}}>
        {n}
        <span style={{color: '#C9D1DB', fontSize: 100}}> / 28</span>
      </div>
      <Lab x={76} y={1500} opacity={ramp(f, w.belas1, w.belas1 + 8)}>UJUNG EKOR TEMBUS DALAM 24 JAM · SAMPEL KECIL</Lab>
      <Lab x={76} y={1250} color={RED} size={30} opacity={ramp(f, w.hampir - 2, w.hampir + 6)}>HAMPIR SETENGAH</Lab>
    </>
  );
};

// ---------------------------------------------------------------------------------------------------------------
// Chapter 3: one giant hammer; buyers under the wick; the tip becomes a slab; the slab breaks.

const YS = (p: number) => ((p - HAM[3]) / 2300) * 6 * 1.55 + 1.1;
const Floor = ({f, w, from}: {f: number; w: Record<string, number>; from: number}) => {
  const [, o, , lo, c] = HAM;
  const rise = ramp(f, from, from + 20, ease.out);
  const run = interpolate(f, [w.ekor, w.pembeli, w.harga3 + 8], [o, lo, c], clamp);
  const running = f >= w.ekor && f < w.lantai0 + 6;
  const buyers = ramp(f, w.pembeli - 8, w.pembeli + 8, ease.out);
  const slab = ramp(f, w.lantai0 - 4, w.lantai0 + 14, ease.inOut);
  const crack = ramp(f, w.jebol0, w.jebol0 + 14, ease.in);
  const idea = ramp(f, w.jebol0 + 4, w.mati + 6, ease.in);
  const cam = camAt(f, [
    {f: from - 10, pos: [0.9, 3.8, 16.5], look: [0, 3.3, 0]},
    {f: w.ekor, pos: [0.7, 3.4, 14.5], look: [0, 3.0, 0]},
    {f: w.pembeli, pos: [0.6, 1.9, 10.5], look: [0, 1.4, 0]},
    {f: w.lantai0, pos: [0.9, 2.2, 12.5], look: [0, 1.5, 0]},
    {f: w.near + 10, pos: [0.4, 1.6, 11], look: [0, 0.9, 0]},
  ], 34);
  const L = 11 * slab;
  return (
    <Studio3D cam={cam} focus={f < w.pembeli ? [0, 3, 0] : [0, 1.2, 0.6]}>
      <group position={[0, -5.5 * (1 - rise), 0]}>
        <Candle q={{o: HAM[1], h: HAM[2], l: HAM[3], c: HAM[4]}} x={0} w={1.5} Y={YS} mat={porcelain} />
      </group>
      {running && (
        <mesh position={[0.32, YS(run), 0.15]}>
          <sphereGeometry args={[0.16, 32, 32]} />
          <meshBasicMaterial color={BLUE} />
        </mesh>
      )}
      {[-1.6, 0, 1.6].map((x, i) => (
        <Figure key={x} position={[x, -1.3 * (1 - ramp(f, w.pembeli - 8 + i * 3, w.pembeli + 6 + i * 3)), 1.3]} scale={0.55 * (0.4 + 0.6 * buyers)} color={BLUE} arms="up" />
      ))}
      {slab > 0 && (
        <>
          <group position={[-0.02 - crack * 0.2, -crack * 0.7, 0]} rotation={[0, 0, crack * 0.22]}>
            <Slab position={[-L / 4, 1.04, 0]} size={[L / 2 - 0.04, 0.16, 2.4]} glow={1 - 0.5 * crack} />
          </group>
          <group position={[0.02 + crack * 0.2, -crack * 0.7, 0]} rotation={[0, 0, -crack * 0.22]}>
            <Slab position={[L / 4, 1.04, 0]} size={[L / 2 - 0.04, 0.16, 2.4]} glow={1 - 0.5 * crack} />
          </group>
        </>
      )}
      {f >= w.lantai1 - 6 && (
        <mesh position={[-2.6, 1.42 - idea * 4, 0.4]}>
          <sphereGeometry args={[0.28, 32, 32]} />
          <meshPhysicalMaterial color={idea > 0.5 ? '#3A4352' : BLUE} emissive={idea > 0.5 ? '#000000' : BLUE} emissiveIntensity={0.4} roughness={0.3} clearcoat={1} />
        </mesh>
      )}
    </Studio3D>
  );
};
const FloorHud = ({f, w}: {f: number; w: Record<string, number>}) => (
  <>
    <Lab x={540} y={1530} anchor="center" color={RED} size={30} opacity={ramp(f, w.arah - 4, w.arah + 4) * (1 - ramp(f, w.ekor, w.ekor + 8))}>BUKAN BUAT NEBAK ARAH</Lab>
    <Lab x={540} y={1530} anchor="center" color={BLUE} size={30} opacity={ramp(f, w.pembeli, w.pembeli + 8) * (1 - ramp(f, w.lantai0 - 4, w.lantai0 + 4))}>PEMBELI NAHAN HARGA</Lab>
    <div style={{position: 'absolute', left: 0, right: 0, top: 1420, textAlign: 'center', fontFamily: fonts.heading, fontWeight: 800, fontSize: 120, color: BLUE, letterSpacing: '-0.02em', opacity: ramp(f, w.lantai0, w.lantai0 + 10) * (1 - ramp(f, w.jebol0, w.jebol0 + 8))}}>LANTAI</div>
    <Lab x={300} y={1530} anchor="center" color={RED} size={34} opacity={ramp(f, w.mati - 4, w.mati + 6)}>IDE BELI ✕</Lab>
  </>
);

// ---------------------------------------------------------------------------------------------------------------
// Chapter 4: a short step down against an equal step up; 28 figures, 17 up first, 9 floor first.

const N_ENTRY = 2.0;
const N_STEP = 1.1;
const Near = ({f, w, from}: {f: number; w: Record<string, number>; from: number}) => {
  const floorY = interpolate(f, [w.dekat - 4, w.dekat + 16], [-1.5, N_ENTRY - N_STEP], {...clamp, easing: ease.inOut});
  const target = ramp(f, w.tujuh1 - 8, w.tujuh1);
  const ups = DATA.hammers.map((h, i) => (h.first === 'up' ? i : -1)).filter((i) => i >= 0);
  const dns = DATA.hammers.map((h, i) => (h.first === 'floor' ? i : -1)).filter((i) => i >= 0);
  const cam = camAt(f, [
    {f: from - 10, pos: [0.4, 3.4, 9.6], look: [0, 2.0, 0]},
    {f: w.tujuh1, pos: [0.2, 3.4, 8.8], look: [0, 2.3, 0]},
    {f: w.sembilan, pos: [-0.2, 2.6, 8.8], look: [0, 1.6, 0]},
    {f: w.payoff + 10, pos: [0, 2.7, 8.2], look: [0, 1.8, 0]},
  ], 34);
  return (
    <Studio3D cam={cam} focus={[0, 2.0, 0]}>
      <RoundedBox args={[4.8, 0.03, 1.6]} radius={0.01} position={[0, N_ENTRY - 0.015, 0]}>
        <meshPhysicalMaterial color="#8FA3BF" roughness={0.1} transparent opacity={0.3} />
      </RoundedBox>
      {target > 0 && (
        <RoundedBox args={[4.8 * target, 0.03, 1.6]} radius={0.01} position={[0, N_ENTRY + N_STEP - 0.015, 0]}>
          <meshPhysicalMaterial color="#FFFFFF" emissive="#FFFFFF" emissiveIntensity={0.25} roughness={0.2} transparent opacity={0.45} />
        </RoundedBox>
      )}
      <Slab position={[0, floorY - 0.05, 0]} size={[4.8, 0.1, 1.6]} />
      {DATA.hammers.map((_, i) => {
        const x = -2.05 + Math.floor(i / 2) * 0.315;
        const z = i % 2 === 0 ? 0.35 : -0.35;
        const ui = ups.indexOf(i);
        const di = dns.indexOf(i);
        const up = ui >= 0 ? ramp(f, w.tujuh1 + ui * 1.6, w.tujuh1 + ui * 1.6 + 12, ease.inOut) : 0;
        const dn = di >= 0 ? ramp(f, w.sembilan + di * 2.4, w.sembilan + di * 2.4 + 14, ease.in) : 0;
        const pop = ramp(f, from + 6 + i * 0.8, from + 14 + i * 0.8);
        const other = ui < 0 && di < 0 && f > w.sembilan + 24;
        const y = N_ENTRY + up * N_STEP - dn * (N_ENTRY + 0.02);
        const col = up > 0.5 ? BLUE : dn > 0.5 || other ? '#3A4352' : '#F2F4F7';
        return pop > 0 ? <Figure key={i} position={[x, y, z]} scale={0.17 * pop} color={col} tilt={dn * 1.2} face={false} /> : null;
      })}
    </Studio3D>
  );
};
const NearHud = ({f, w}: {f: number; w: Record<string, number>}) => {
  const ups = DATA.hammers.filter((h) => h.first === 'up').length;
  const dns = DATA.hammers.filter((h) => h.first === 'floor').length;
  const nUp = Math.round(interpolate(f, [w.tujuh1, w.tujuh1 + 12 + ups * 1.6], [0, ups], clamp));
  const nDn = Math.round(interpolate(f, [w.sembilan, w.sembilan + 14 + dns * 2.4], [0, dns], clamp));
  return (
    <>
      <Num x={80} y={520} size={170} color={BLUE} opacity={ramp(f, w.tujuh1, w.tujuh1 + 8)}>{nUp}</Num>
      <Lab x={86} y={700} color={BLUE} size={28} opacity={ramp(f, w.tujuh1, w.tujuh1 + 8)}>NAIK DULUAN</Lab>
      <Num x={1000} y={520} size={170} color="#C9D1DB" anchor="right" opacity={ramp(f, w.sembilan, w.sembilan + 8)}>{nDn}</Num>
      <Lab x={994} y={700} size={28} anchor="right" opacity={ramp(f, w.sembilan, w.sembilan + 8)}>LANTAI JEBOL DULUAN</Lab>
      <div style={{position: 'absolute', right: 80, top: 1150, fontFamily: fonts.mono, fontWeight: 800, fontSize: 84, color: '#FFFFFF', opacity: ramp(f, w.nol - 2, w.nol + 10)}}>0,8%</div>
      <Lab x={1000} y={1245} anchor="right" size={22} opacity={ramp(f, w.nol, w.nol + 10)}>JARAK KE LANTAI · MEDIAN</Lab>
      <Lab x={540} y={1560} anchor="center" size={22} opacity={ramp(f, w.sembilan + 24, w.sembilan + 32)}>28 HAMMER · 2 TIDAK JELAS · SAMPEL KECIL · TANPA FEE</Lab>
    </>
  );
};

// ---------------------------------------------------------------------------------------------------------------
// Chapter 5: the payoff. Dina on her floor, Raka on nothing.

const YP = (p: number) => ((p - HAM[3]) / 2300) * 6 + 1.0;
const Payoff = ({f, w, from, loopAt}: {f: number; w: Record<string, number>; from: number; loopAt: number}) => {
  const slab = ramp(f, w.salah - 4, w.salah + 14, ease.inOut);
  const raka = ramp(f, w.tanpa - 6, w.tanpa + 8);
  const dina = ramp(f, w.salah + 4, w.salah + 18);
  const cam = camAt(f, [
    {f: from - 10, pos: [0.3, 3.3, 14.5], look: [0, 2.3, 0]},
    {f: w.salah, pos: [0.6, 2.8, 13], look: [0.4, 2.0, 0]},
    {f: w.berharap, pos: [-0.4, 2.6, 12.6], look: [-0.4, 1.9, 0]},
    {f: w.rencana, pos: [0.5, 2.6, 12.4], look: [0.4, 1.9, 0]},
    {f: loopAt + 10, pos: [0.2, 2.6, 12], look: [0, 1.9, 0]},
  ], 32);
  return (
    <Studio3D cam={cam} focus={[0, 1.6, 0]}>
      <Candle q={{o: HAM[1], h: HAM[2], l: HAM[3], c: HAM[4]}} x={0} w={0.7} Y={YP} mat={porcelain} />
      {slab > 0 && <Slab position={[0.05 + (2.4 * slab) / 2, 0.95, 0]} size={[2.4 * slab, 0.1, 1.5]} />}
      <mesh position={[-1.25, 0.95, 0]}>
        <boxGeometry args={[2.4, 0.1, 1.5]} />
        <meshBasicMaterial color="#3A4556" wireframe transparent opacity={raka} />
      </mesh>
      {raka > 0 && <Figure position={[-1.3, 1.0 + (1 - raka) * 0.6, 0]} scale={0.7 * raka} arms="out" />}
      {dina > 0 && <Figure position={[1.3, 1.0 + (1 - dina) * 0.6, 0]} scale={0.7 * dina} color={BLUE} />}
    </Studio3D>
  );
};
const PayoffHud = ({f, w}: {f: number; w: Record<string, number>}) => (
  <>
    <Lab x={540} y={560} anchor="center" color={RED} size={34} opacity={ramp(f, w.sinyal - 2, w.sinyal + 6) * (1 - ramp(f, w.salah - 4, w.salah + 4))}>BUKAN SINYAL BELI</Lab>
    <Lab x={540} y={560} anchor="center" color={BLUE} size={34} opacity={ramp(f, w.salah, w.salah + 8)}>UJUNG EKOR = DI SINI LO SALAH</Lab>
    <Lab x={290} y={1330} anchor="center" color="#C9D1DB" size={40} opacity={ramp(f, w.berharap - 2, w.berharap + 6)}>BERHARAP</Lab>
    <Lab x={790} y={1330} anchor="center" color={BLUE} size={40} opacity={ramp(f, w.rencana - 2, w.rencana + 6)}>RENCANA</Lab>
  </>
);

// ---------------------------------------------------------------------------------------------------------------

export const Film3D = () => {
  const f = useCurrentFrame();
  const {cue, word, narrationEnd} = useCues();
  const b = {common: cue('common'), floor: cue('floor'), near: cue('near'), payoff: cue('payoff'), end: narrationEnd};
  const w: Record<string, number> = {
    raka: word('raka', 0), beli: word('beli', 0), paginya: word('paginya'), rugi: word('rugi'), garis: word('garis'),
    pasang: word('pasang'), sejam: word('sejam'), tembus0: word('tembus', 0), keluar: word('keluar'), menang: word('menang'), pagi: word('pagi'),
    dari: word('dari', 0), terakhir: word('terakhir'), belas1: word('belas', 1), hampir: word('hampir'),
    arah: word('arah'), ekor: word('ekor'), pembeli: word('pembeli'), harga3: word('harga', 1), lantai0: word('lantai', 0), lantai1: word('lantai', 1), jebol0: word('jebol', 0), mati: word('mati'),
    dekat: word('dekat'), nol: word('nol'), tujuh1: word('tujuh', 1), sembilan: word('sembilan'),
    sinyal: word('sinyal'), salah: word('salah'), tanpa: word('tanpa'), berharap: word('berharap'), rencana: word('rencana'),
    floor: b.floor, near: b.near, payoff: b.payoff,
  };
  const loopAt = b.end + 3;
  const hp = interpolate(f, [-30, w.raka - 6], [0, 12], {...clamp, easing: ease.inOut});
  const sched: Array<[number, number]> = [[w.sejam - 4, 0], [w.tembus0 + 2, BREAK_I + 0.7], [w.menang, BOUNCE_I + 0.5], [w.pagi + 6, LOW_I + 0.4]];
  const p = interpolate(f, sched.map((s) => s[0]), sched.map((s) => s[1]), clamp);
  const stage = f < b.common ? 'chart' : f < b.floor ? 'crowd' : f < b.near ? 'floor' : f < b.payoff ? 'near' : f < loopAt ? 'payoff' : 'loop';
  const box = (style: object, children: ReactNode) => <div style={{position: 'absolute', inset: 0, ...style}}>{children}</div>;
  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      {stage === 'chart' && box(seam('blurSwap', f, b.common, 'out'), <><Chart f={f} w={w} p={p} hp={hp} /><ChartHud f={f} w={w} p={p} /></>)}
      {stage === 'crowd' && box({...seam('blurSwap', f, b.common, 'in'), ...seam('zoom', f, b.floor, 'out', {dur: 12, origin: [540, 1100]})}, <><Crowd f={f} w={w} from={b.common} /><CrowdHud f={f} w={w} /></>)}
      {stage === 'floor' && box({...seam('zoom', f, b.floor, 'in', {dur: 12}), ...seam('push', f, b.near, 'out')}, <><Floor f={f} w={w} from={b.floor} /><FloorHud f={f} w={w} /></>)}
      {stage === 'near' && box({...seam('push', f, b.near, 'in'), ...seam('dip', f, b.payoff, 'out')}, <><Near f={f} w={w} from={b.near} /><NearHud f={f} w={w} /></>)}
      {stage === 'payoff' && box({...seam('flood', f, b.payoff, 'in', {origin: [540, 1150]}), ...seam('blurSwap', f, loopAt, 'out')}, <><Payoff f={f} w={w} from={b.payoff} loopAt={loopAt} /><PayoffHud f={f} w={w} /></>)}
      {stage === 'loop' && box(seam('blurSwap', f, loopAt, 'in'), <Chart f={f} w={w} p={0} hp={interpolate(f, [loopAt, loopAt + 30], [12, 4], clamp)} loop />)}
      {f < w.raka && (
        <div style={{position: 'absolute', left: 60, right: 60, top: 360, transform: `translateY(-50%) translateY(${(1 - ramp(f, -6, 8)) * 30}px)`, textAlign: 'center', fontFamily: fonts.heading, fontWeight: 700, fontSize: 72, lineHeight: 1.08, color: '#FFFFFF', opacity: 1 - ramp(f, w.raka - 6, w.raka)}}>
          HAMMER SAMA.
          <br />
          <span style={{color: BLUE}}>HASIL BEDA.</span>
        </div>
      )}
      <SentenceTrack y={360} size={52} preview={false} from={w.raka} />
    </AbsoluteFill>
  );
};
