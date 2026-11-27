/**
 * emas-bank-sentral: one isometric city, every beat a place along the main road (z = 3).
 * x ≈ -44 bonds · -24 speculators' tower · 0 the gold billboard (hook) · 24 the central bank compound ·
 * 46 the October billboard and China's convoy · 66 the four central banks (survey).
 * The camera pans along the road between neighbours and cuts on beats; trucks keep driving the whole time.
 */
import {useThree} from '@react-three/fiber';
import {ThreeCanvas} from '@remotion/three';
import {useMemo, type ReactNode} from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import * as THREE from 'three';
import captionsJson from '../../../episodes/emas-bank-sentral/captions.json';
import type {Captions} from '../../lib/types';
import {fontsReady, textTexture, toTexture, useAssets3D, type TextTexture} from '../../three/assets';
import {KeyedCamera, cameraAt, type CamKey} from '../../three/camera';
import {ease} from '../../theme/motion';
import {fonts} from '../../theme/typography';
import {Bank, Billboard, C, Crate, Flag, GoldPile, goldMat, Ground, GroundText, Person, Road, SignPost, SportsCar, Tower, Trees, Truck, Vault, type V3} from './city';
import {iso, DepthRange} from './Style';
import {Sound} from './Sound';
import {drawChart, flagTexture, windowsTexture, type ChartOpts} from './textures';

const cap = captionsJson as Captions;
const FPS = 30;
const norm = (s: string) => s.toLowerCase().replace(/[^\p{L}\p{N}]/gu, '');
const W = (t: string, n = 0) => {
  const hits = cap.words.filter((w) => norm(w.text) === t);
  if (!hits[n]) throw new Error(`emas-bank-sentral: word "${t}" #${n} not in captions`);
  return Math.round(hits[n].start * FPS);
};
const Cu = (k: string) => Math.round(cap.cues[k] * FPS);

export const T = {
  sepertiga: W('sepertiga'), tapi0: W('tapi'), bank0: W('bank'), memborong: W('memborong'), kenapa: W('kenapa'),
  fast: Cu('fast'), spekulan: W('spekulan'), empat0: W('empat'), sembilan: W('sembilan'), apalagi: W('apalagi'), obligasi: W('obligasi'), lima0: W('lima'), emas2: W('emas', 2),
  slow: Cu('slow'), kuartal: W('kuartal'), tiga1: W('tiga', 1), empat1: W('empat', 1), dan0: W('dan'), nggak1: W('nggak', 1), dilaporkan: W('dilaporkan'), seratus: W('seratus'), perkiraan: W('perkiraan'),
  dip: Cu('dip'), oktober: W('oktober'), china: W('china'), dua5: W('dua', 5), terbesar: W('terbesar'),
  why: Cu('why'), tiga2: W('tiga', 2), dari2: W('dari', 2), empat2: W('empat', 2), turun: W('turun'), gagal: W('gagal'),
  payoff: Cu('payoff'), buktinya: W('buktinya'), jatuh1: W('jatuh', 1), minggu1: W('minggu', 1), uang1: W('uang', 1), arah: W('arah'), dekade: W('dekade'), pembeli: W('pembeli'), sabar: W('sabar'),
  end: Math.round(cap.durationSec * FPS),
};

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const ramp = (f: number, a: number, b: number, e = ease.inOut) => (b <= a ? (f >= a ? 1 : 0) : interpolate(f, [a, b], [0, 1], {...clamp, easing: e}));

// ---------------------------------------------------------------------------------------------------------------
// Camera: [frame, look, fov]; a repeated frame is a cut.

const CAM: Array<[number, V3, number]> = [
  [0, [1.4, 1.8, -1.2], 8.8],
  [T.tapi0 - 4, [1.4, 1.8, -1.2], 8.1],
  [T.tapi0 + 20, [23.6, 1.2, -1.8], 8.4],
  [T.fast - 1, [23.8, 1.2, -1.8], 7.6],
  [T.fast, [-22.8, 2.4, -2], 8.9],
  [T.apalagi - 2, [-22.6, 2.4, -2], 8.0],
  [T.obligasi + 8, [-43, 1.4, -2.2], 7.4],
  [T.slow - 1, [-43, 1.4, -2.2], 6.9],
  [T.slow, [27.4, 1.0, -2.6], 8.8],
  [T.dan0 - 2, [27.4, 1.0, -2.6], 8.0],
  [T.dan0 + 20, [27.9, 0.9, -2.0], 7.4],
  [T.dip - 1, [27.9, 0.9, -2.0], 7.0],
  [T.dip, [46.4, 1.6, -0.8], 9.2],
  [T.why - 2, [46.2, 1.6, -0.8], 8.5],
  [T.why + 22, [66.2, 1.6, -2.2], 9.2],
  [T.payoff - 1, [66.2, 1.6, -2.2], 8.5],
  [T.payoff, [24, 1.0, -2.2], 10.8],
  [T.buktinya - 4, [24, 1.0, -2.2], 10.0],
  [T.buktinya + 20, [2.6, 1.0, 0.2], 10.2],
  [T.arah - 4, [2.4, 1.0, 0.2], 9.6],
  [T.arah + 22, [21.6, 0.9, -1.8], 9.6],
  [T.sabar - 6, [21.6, 0.9, -1.8], 9.2],
  [T.end + 20, [12, 0.4, -2.0], 22],
  [T.end + 120, [12, 0.4, -2.0], 23],
];
const KEYS: CamKey[] = CAM.map(([f, look, fov]) => iso(f, look, fov));

/** The sun follows the camera, so shadows stay sharp wherever the shot is. */
const Sun = () => {
  const f = useCurrentFrame();
  const {scene} = useThree();
  const look = cameraAt(f, KEYS).look;
  const target = useMemo(() => {
    const o = new THREE.Object3D();
    scene.add(o);
    return o;
  }, [scene]);
  target.position.set(look[0], 0, look[2]);
  target.updateMatrixWorld();
  return (
    <>
      <hemisphereLight args={['#DCE7FF', '#0A2470', 0.95]} />
      <directionalLight
        position={[look[0] - 14, 26, look[2] + 10]}
        target={target}
        intensity={3.0}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-26}
        shadow-camera-right={26}
        shadow-camera-top={26}
        shadow-camera-bottom={-26}
        shadow-bias={-0.0008}
        shadow-normalBias={0.03}
      />
    </>
  );
};

// ---------------------------------------------------------------------------------------------------------------
// Assets

type Assets = {windows: THREE.Texture; cn: THREE.Texture; pl: THREE.Texture; txt: Record<string, TextTexture>};

const loadAssets = async (): Promise<Assets> => {
  await fontsReady();
  const t = (s: string, px = 120) => textTexture(s, {family: fonts.heading, weight: 800, px, color: C.white, tracking: 2});
  const sign = (s: string, color = '#1653D8') => textTexture(s, {family: fonts.heading, weight: 800, px: 110, color, bg: '#F4F7FF', pad: 26, radius: 18});
  return {
    windows: windowsTexture(),
    cn: flagTexture('cn'),
    pl: flagTexture('pl'),
    txt: {
      minus32: t('−32%', 160),
      bank: t('BANK SENTRAL'),
      bankSign: textTexture('BANK SENTRAL', {family: fonts.heading, weight: 800, px: 90, color: C.white, tracking: 4}),
      tercatatSign: textTexture('TERCATAT 120 TON', {family: fonts.heading, weight: 800, px: 100, color: '#1653D8', bg: '#F4F7FF', pad: 24, radius: 16}),
      borong: t('MEMBORONG', 110),
      kenapa: t('KENAPA?', 130),
      spek: t('DANA SPEKULAN', 100),
      jual: t('$9,3 MILIAR', 130),
      hari: t('4 HARI · 17–20 NOV', 80),
      obligasi: textTexture('OBLIGASI AS', {family: fonts.heading, weight: 800, px: 90, color: C.white, tracking: 3}),
      bunga5: t('BUNGA ±5%/TAHUN', 110),
      bunga0: t('BUNGA 0%', 110),
      ton: t('321 TON', 150),
      plus42: t('+42% DARI TAHUN LALU', 80),
      tercatat: t('TERCATAT 120 TON', 90),
      tidak: t('TIDAK DILAPORKAN ±63%', 90),
      wgc: t('SISANYA PERKIRAAN WORLD GOLD COUNCIL', 60),
      plus26: t('+26 TON', 150),
      terbesar: t('TERBESAR DALAM SETAHUN', 80),
      tigaDari4: t('3 DARI 4', 150),
      dolarTurun: t('PORSI DOLAR TURUN', 90),
      gagal: t('TANPA RISIKO GAGAL BAYAR', 70),
      dolarSign: sign('$ ↓'),
      okSign: sign('$ ?', '#7C93C9'),
      minggu: t('MINGGUAN', 120),
      dekade: t('DEKADE', 150),
    },
  };
};

/** A billboard whose real price line draws on as `progress` goes 0 → 1. */
const ChartBoard = ({position, opts, progress}: {position: V3; opts: ChartOpts; progress: number}) => {
  const canvas = useMemo(() => document.createElement('canvas'), []);
  const tex = useMemo(() => {
    drawChart(canvas, opts, 1);
    return toTexture(canvas);
  }, [canvas, opts]);
  const p = Math.round(progress * 200) / 200;
  useMemo(() => {
    drawChart(canvas, opts, p);
    tex.needsUpdate = true;
  }, [canvas, opts, p, tex]);
  return <Billboard position={position} tex={tex} />;
};

const HOOK_CHART: ChartOpts = {from: '2025-01-01', to: '2026-11-26', title: 'EMAS · USD/OZ', badge: '−32%', sub: 'PUNCAK 29 JAN 2026 → 26 NOV 2026'};
const OCT_CHART: ChartOpts = {from: '2026-09-01', to: '2026-11-26', title: 'EMAS · OKTOBER', badge: '−7%', sub: '30 SEP → 30 OKT 2026', highlight: ['2026-10-01', '2026-10-30']};

/** Ground text that appears at `at` (settles from 0.85 scale) and leaves at `out`. */
const GT = ({tex, at, out = 99999, height, position, yaw = 0}: {tex: TextTexture; at: number; out?: number; height: number; position: V3; yaw?: number}) => {
  const f = useCurrentFrame();
  const o = ramp(f, at, at + 8, ease.out) * (1 - ramp(f, out, out + 6));
  if (o <= 0.01) return null;
  const s = 0.85 + 0.15 * ramp(f, at, at + 10, ease.out);
  return (
    <group position={position} scale={[s, 1, s]}>
      <GroundText tex={tex} height={height} position={[0, 0, 0]} yaw={yaw} opacity={o} />
    </group>
  );
};

/**
 * Traffic on the main road. Two lanes: west-bound (z 2.4, toward -x) and east-bound (z 3.6, toward +x). Every truck
 * in a lane has the same speed and spacing (10 units, 16 slots over x -70…90), so trucks never overlap. The lane's
 * phase is reset only on hard cuts (invisible), and each segment's phase puts slot 0 so that a convoy riding in the
 * gap behind it (offsets 2.5 / 4.7 / 6.9) reaches its mark on time.
 */
const LANE = {L: 160, S: 10, v: 0.076, x0: 90};
const SLOTS = LANE.L / LANE.S;
const OFFS = [2.5, 4.7, 6.9];
const wrap = (u: number) => ((u % LANE.L) + LANE.L) % LANE.L;
/** Segments between hard cuts; `mark` = [frame, x] where the convoy's lead truck should be (west lane). */
const SEGMENTS: Array<{from: number; mark?: [number, number]; convoy?: 'vault' | 'china'; east: boolean}> = [
  {from: -100, mark: [T.bank0 + 18, 21], convoy: 'vault', east: false},
  {from: T.fast, east: true},
  {from: T.slow, east: true},
  {from: T.dip, mark: [T.china + 10, 47], convoy: 'china', east: true},
  {from: T.payoff, mark: [T.arah + 28, 21], convoy: 'vault', east: false},
];
const segmentAt = (f: number) => SEGMENTS[SEGMENTS.findLastIndex((s) => f >= s.from)] ?? SEGMENTS[0];
const phaseOf = (seg: (typeof SEGMENTS)[number]) => (seg.mark ? wrap(LANE.x0 - (seg.mark[1] - OFFS[0]) - seg.mark[0] * LANE.v) : 37);
const westX = (k: number, f: number, ph: number) => LANE.x0 - wrap(k * LANE.S + f * LANE.v + ph);
const eastX = (k: number, f: number) => -70 + wrap(k * LANE.S + 5 + f * LANE.v);

const Traffic = ({f, cn}: {f: number; cn: THREE.Texture}) => {
  const seg = segmentAt(f);
  const ph = phaseOf(seg);
  const trucks: ReactNode[] = [];
  for (let k = 0; k < SLOTS; k++) {
    trucks.push(<Truck key={`w${k}`} position={[westX(k, f, ph), 0, 2.4]} rot={Math.PI} cargo={k % 3 !== 0} />);
    if (seg.east) trucks.push(<Truck key={`e${k}`} position={[eastX(k, f), 0, 3.6]} cargo={k % 3 !== 1} />);
  }
  // The convoy in the gap behind slot 0: into the vault (turning up the access road at x 21), or China's convoy.
  if (seg.convoy) {
    OFFS.forEach((o, j) => {
      const xl = westX(0, f, ph) + o;
      if (seg.convoy === 'china') {
        trucks.push(
          <group key={`c${j}`} position={[xl, 0, 2.4]} rotation={[0, Math.PI, 0]}>
            <Truck position={[0, 0, 0]} />
            <Flag position={[0.62, 0.66, 0]} tex={cn} raise={0.3} />
          </group>,
        );
        return;
      }
      if (xl > 21) {
        trucks.push(<Truck key={`v${j}`} position={[xl, 0, 2.4]} rot={Math.PI} />);
        return;
      }
      const d = 21 - xl;
      const z = 2.4 - d;
      if (z < -3.1) return; // inside the vault
      const turn = Math.min(1, d / 0.9);
      trucks.push(<Truck key={`v${j}`} position={[21, 0, z]} rot={Math.PI - (Math.PI / 2) * turn} />);
    });
  }
  return <>{trucks}</>;
};

// ---------------------------------------------------------------------------------------------------------------
// The places

const Hook = ({a, f}: {a: Assets; f: number}) => (
  <group>
    <ChartBoard position={[-1.5, 0, -3.5]} opts={HOOK_CHART} progress={0.55 + 0.45 * ramp(f, 0, 34, ease.inOut)} />
    <Tower position={[6.2, 0, -7.5]} size={[3, 8, 3]} windows={a.windows} />
    <Tower position={[10.5, 0, -9.5]} size={[2.6, 6, 2.6]} windows={a.windows} />
    <GT tex={a.txt.minus32} at={-6} height={1.3} position={[4.4, 0.03, -1.2]} yaw={Math.PI / 2} />
    <GT tex={a.txt.minggu} at={T.minggu1} height={0.6} position={[-2.4, 0.03, 0.9]} />
  </group>
);

/** The central bank compound: vault, access road, a 3×3 crate yard (back row reported, front rows unreported). */
const Compound = ({a, f}: {a: Assets; f: number}) => {
  const door = ramp(f, T.bank0, T.bank0 + 30);
  return (
    <group>
      <Vault position={[21, 0, -5.4]} size={[5, 3.2, 4]} open={door} />
      <mesh position={[21, 2.62, -3.37]}>
        <planeGeometry args={[0.42 * a.txt.bankSign.aspect, 0.42]} />
        <meshBasicMaterial map={a.txt.bankSign.texture} transparent toneMapped={false} />
      </mesh>
      <Road at={[21, 0, -0.6]} length={3.8} alongZ width={2.2} />
      {[0, 1, 2].map((r) =>
        [0, 1, 2].map((c) => {
          const k = r * 3 + c;
          const fill = ramp(f, T.kuartal + k * 9, T.kuartal + k * 9 + 30, ease.out);
          const pre = f < T.slow ? 0.35 + 0.65 * (k % 2) : fill;
          const wrap = r === 0 ? 0 : ramp(f, T.nggak1 - 6 + (k - 3) * 4, T.nggak1 + 14 + (k - 3) * 4, ease.inOut);
          return <Crate key={k} position={[26.2 + c * 1.9, 0, -5.4 + r * 1.9]} rows={8} cols={5} layers={8} fill={pre} wrap={wrap} />;
        }),
      )}
      <Flag position={[25.4, 0, -6.6]} tex={a.cn} raise={ramp(f, T.seratus - 4, T.seratus + 14)} />
      <Flag position={[27.3, 0, -6.6]} tex={a.pl} raise={ramp(f, T.seratus + 2, T.seratus + 20)} />
      <GT tex={a.txt.borong} at={T.memborong - 2} out={T.kenapa - 4} height={0.55} position={[24.8, 0.03, 0.6]} />
      <GT tex={a.txt.kenapa} at={T.kenapa - 2} out={T.slow} height={0.7} position={[24.8, 0.03, 0.6]} />
      <GT tex={a.txt.ton} at={T.tiga1} out={T.dan0} height={1.0} position={[28.1, 0.03, 0.5]} />
      <GT tex={a.txt.plus42} at={T.empat1} out={T.dan0} height={0.36} position={[28.1, 0.03, 1.25]} />
      <GT tex={a.txt.tidak} at={T.dilaporkan} out={T.payoff - 6} height={0.42} position={[28.1, 0.03, 0.6]} />
      <GT tex={a.txt.wgc} at={T.perkiraan} out={T.dip} height={0.24} position={[28.1, 0.03, 1.2]} />
      <SignPost position={[28.1, 0, -7.0]} tex={a.txt.tercatatSign} h={0.5} lift={Math.max(0.02, 1.6 * ramp(f, T.seratus - 2, T.seratus + 14, ease.out))} />
      <GT tex={a.txt.dekade} at={T.dekade - 2} height={1.0} position={[24.8, 0.03, 0.6]} />
    </group>
  );
};

const Speculators = ({a, f}: {a: Assets; f: number}) => {
  const pile = 0.3 + 0.7 * ramp(f, T.fast, T.apalagi, ease.inOut);
  return (
    <group>
      <Tower position={[-23.5, 0, -5.5]} size={[3.2, 9, 3.2]} windows={a.windows} />
      <mesh position={[-22.9, 1.25, -2.9]} rotation={[0.6, 0, 0]} castShadow>
        <boxGeometry args={[1.1, 0.08, 2.4]} />
        <meshStandardMaterial color={C.buildingDark} roughness={0.8} />
      </mesh>
      {/* bars sliding down the chute's top surface, then dropping onto the pile: a continuous stream */}
      {Array.from({length: 14}, (_, i) => {
        const u = (((f * 0.03 + i / 14) % 1) + 1) % 1 * 1.3;
        // Chute top surface: from (y 1.928, z -3.890) to (y 0.572, z -1.910), lifted along its normal by 0.09.
        const x = -23.25 + (i % 4) * 0.23;
        let y: number;
        let z: number;
        let rx = 0.6;
        if (u <= 1) {
          y = 1.928 + (0.572 - 1.928) * u + 0.074;
          z = -3.89 + (-1.91 + 3.89) * u + 0.051;
        } else {
          const t = (u - 1) / 0.3;
          y = 0.646 + 0.2 * t - 0.62 * t * t;
          z = -1.86 + 0.75 * t;
          rx = 0.6 + t * 1.4;
        }
        return (
          <mesh key={i} material={goldMat} position={[x, y, z]} rotation={[rx, (i % 3) * 0.2 - 0.2, 0]} castShadow>
            <boxGeometry args={[0.27, 0.1, 0.13]} />
          </mesh>
        );
      })}
      <GoldPile position={[-22.6, 0, -1.2]} radius={1.4} count={340} fill={pile} />
      <GT tex={a.txt.spek} at={T.spekulan - 2} height={0.5} position={[-27.6, 0.03, -2.6]} yaw={Math.PI / 2} />
      <GT tex={a.txt.hari} at={T.empat0} height={0.36} position={[-19.0, 0.03, -1.4]} yaw={Math.PI / 2} />
      <GT tex={a.txt.jual} at={T.sembilan - 2} height={0.85} position={[-20.2, 0.03, -1.4]} yaw={Math.PI / 2} />
    </group>
  );
};

const Bonds = ({a, f}: {a: Assets; f: number}) => (
  <group>
    <Bank position={[-45.2, 0, -4.4]} w={4.8} sign={a.txt.obligasi} />
    <mesh position={[-40, 0.35, -2.6]} castShadow receiveShadow>
      <boxGeometry args={[1.5, 0.7, 1.5]} />
      <meshStandardMaterial color={C.buildingDark} roughness={0.8} />
    </mesh>
    <mesh material={goldMat} position={[-40, 0.95, -2.6]} castShadow>
      <boxGeometry args={[1.2, 0.5, 0.62]} />
    </mesh>
    {[0, 1, 2, 3].map((i) => {
      const t = ramp(f, T.obligasi + i * 10, T.obligasi + 80 + i * 10, ease.inOut);
      return <Person key={i} position={[interpolate(t, [0, 1], [-40.5 + i * 0.4, -46.6 + i * 0.5]), 0.48, -2.3]} />;
    })}
    <GT tex={a.txt.bunga5} at={T.lima0 - 2} height={0.55} position={[-45, 0.03, -1.1]} />
    <GT tex={a.txt.bunga0} at={T.emas2} height={0.55} position={[-39.9, 0.03, -0.9]} />
  </group>
);

const Dip = ({a, f}: {a: Assets; f: number}) => (
  <group>
    <ChartBoard position={[44.4, 0, -4.2]} opts={OCT_CHART} progress={ramp(f, T.dip + 2, T.oktober + 10, ease.inOut)} />
    <GT tex={a.txt.plus26} at={T.dua5 - 2} height={1.0} position={[49.2, 0.03, -1.6]} yaw={Math.PI / 2} />
    <GT tex={a.txt.terbesar} at={T.terbesar} height={0.32} position={[50.4, 0.03, -1.6]} yaw={Math.PI / 2} />
  </group>
);

const Survey = ({a, f}: {a: Assets; f: number}) => {
  const ats = [T.tiga2, T.dari2, T.empat2, T.empat2 + 10];
  return (
    <group>
      {[0, 1, 2, 3].map((i) => (
        <group key={i}>
          <Bank position={[62.4 + i * 3.1, 0, -5.2]} w={2.4} d={2} h={1.5} />
          <SignPost position={[62.4 + i * 3.1, 0, -2.7]} tex={i < 3 ? a.txt.dolarSign : a.txt.okSign} h={0.95} lift={Math.max(0.02, (i < 3 ? 1.1 : 0.55) * ramp(f, ats[i] - 2, ats[i] + 12, ease.out))} />
        </group>
      ))}
      <GT tex={a.txt.tigaDari4} at={T.tiga2} height={1.0} position={[66.4, 0.03, -0.9]} />
      <GT tex={a.txt.dolarTurun} at={T.turun - 2} height={0.4} position={[66.4, 0.03, 0.15]} />
      <GT tex={a.txt.gagal} at={T.gagal - 2} height={0.3} position={[66.4, 0.03, 0.85]} />
    </group>
  );
};

/** The sports car (fast money) races along the near lane in the payoff. */
const FastCar = ({f}: {f: number}) => {
  if (f < T.minggu1 - 20 || f > T.arah + 10) return null;
  const x = interpolate(f, [T.minggu1 - 20, T.arah + 10], [-14, 20]);
  return <SportsCar position={[x, 0, 3.6]} />;
};

// ---------------------------------------------------------------------------------------------------------------

/** Karaoke caption box: the current phrase, spoken words white, the current word gold, the rest dim. */
const CaptionBox = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const words = cap.words;
  const chunks = useMemo(() => {
    const out: Array<[number, number]> = [];
    let s = 0;
    let len = 0;
    words.forEach((w, i) => {
      len += w.text.length + 1;
      const end = /[.?!:,]$/.test(w.text) && len > 14;
      if (end || len > 34 || i - s >= 6 || i === words.length - 1) {
        out.push([s, i]);
        s = i + 1;
        len = 0;
      }
    });
    return out;
  }, [words]);
  const k = chunks.findIndex(([a, b], i) => t >= words[a].start - 0.08 && (i === chunks.length - 1 || t < words[chunks[i + 1][0]].start - 0.08));
  if (k < 0 || t > cap.durationSec + 0.3) return null;
  const [a, b] = chunks[k];
  let cur = -1;
  for (let i = a; i <= b; i++) if (t >= words[i].start - 0.03) cur = i;
  return (
    <div style={{position: 'absolute', left: 110, right: 110, top: 1430, display: 'flex', justifyContent: 'center'}}>
      <div style={{background: 'rgba(5,11,24,0.92)', borderRadius: 14, padding: '14px 26px', fontFamily: fonts.heading, fontWeight: 700, fontSize: 48, lineHeight: 1.16, textAlign: 'center', maxWidth: 860}}>
        {words.slice(a, b + 1).map((w, j) => {
          const i = a + j;
          const color = i === cur ? C.gold : i < cur ? '#FFFFFF' : 'rgba(255,255,255,0.42)';
          return (
            <span key={i} style={{color}}>
              {w.text}
              {j < b - a ? ' ' : ''}
            </span>
          );
        })}
      </div>
    </div>
  );
};

const TREE_AREA: [number, number, number, number] = [-75, -40, 95, 30];
const TREE_CLEAR: Array<[number, number, number, number]> = [
  [-80, 1.2, 100, 4.8],
  [-50, -8, -36, 1.4],
  [-30, -9, -16, 1.4],
  [-6, -8, 9, 1.4],
  [15, -9, 34, 1.4],
  [38, -8, 52, 1.4],
  [58, -8, 76, 1.4],
];

const City = ({a}: {a: Assets}) => {
  const f = useCurrentFrame();
  return (
    <>
      <KeyedCamera keys={KEYS} />
      <DepthRange near={60} far={240} />
      <color attach="background" args={[C.ground]} />
      <Sun />
      <Hook a={a} f={f} />
      <Compound a={a} f={f} />
      <Speculators a={a} f={f} />
      <Bonds a={a} f={f} />
      <Dip a={a} f={f} />
      <Survey a={a} f={f} />
      <Traffic f={f} cn={a.cn} />
      <FastCar f={f} />
      <Road at={[10, 0, 3]} length={170} />
      <Trees area={TREE_AREA} count={1900} seed={4} clear={TREE_CLEAR} />
      <Ground />
    </>
  );
};

export const Film = (): ReactNode => {
  const {width, height} = useVideoConfig();
  const a = useAssets3D(loadAssets, 'emas-film');
  return (
    <AbsoluteFill style={{background: C.ground}}>
      {a && (
        <ThreeCanvas width={width} height={height} gl={{antialias: true, toneMapping: THREE.NoToneMapping, preserveDrawingBuffer: true}} dpr={2} shadows>
          <City a={a} />
        </ThreeCanvas>
      )}
      <CaptionBox />
      <Sound />
    </AbsoluteFill>
  );
};
