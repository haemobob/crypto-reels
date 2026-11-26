/**
 * Style frames for emas-bank-sentral (stills; input prop `shot`, one per beat). Composition id "emas-style".
 * Shots: hook, arrive, fast, bonds, stack, hidden, dip, why, payoff.
 */
import {useThree} from '@react-three/fiber';
import {ThreeCanvas} from '@remotion/three';
import type {ReactNode} from 'react';
import {AbsoluteFill, useVideoConfig} from 'remotion';
import * as THREE from 'three';
import {fontsReady, textTexture, useAssets3D, type TextTexture} from '../../three/assets';
import {KeyedCamera, type CamKey} from '../../three/camera';
import {CornerLogo} from '../../components/CornerLogo';
import {fonts} from '../../theme/typography';
import {Bank, Billboard, C, Crate, Flag, GoldPile, goldMat, Ground, GroundText, Person, Road, SignPost, SportsCar, Tower, Trees, Truck, Vault, type V3} from './city';
import {chartTexture, flagTexture, windowsTexture} from './textures';

const AZ = Math.PI / 4;
const EL = (32 * Math.PI) / 180;
const DIST = 120;
/** An isometric camera key looking at `look`; `fov` sets the zoom. */
export const iso = (f: number, look: V3, fov = 12): CamKey => ({
  f,
  look,
  fov,
  pos: [look[0] + DIST * Math.sin(AZ) * Math.cos(EL), look[1] + DIST * Math.sin(EL), look[2] + DIST * Math.cos(AZ) * Math.cos(EL)],
});

/** The isometric camera sits ~120 units away: a tight near/far keeps depth precision (no z-fighting stripes). */
export const DepthRange = ({near = 70, far = 220}: {near?: number; far?: number}) => {
  const {camera} = useThree();
  camera.near = near;
  camera.far = far;
  camera.updateProjectionMatrix();
  return null;
};

// ---------------------------------------------------------------------------------------------------------------
type Assets = {windows: THREE.Texture; cn: THREE.Texture; pl: THREE.Texture; chart: THREE.Texture; chartOct: THREE.Texture; txt: Record<string, TextTexture>};

const loadAssets = async (): Promise<Assets> => {
  await fontsReady();
  const t = (s: string, px = 120) => textTexture(s, {family: fonts.heading, weight: 800, px, color: C.white, tracking: 2});
  const sign = (s: string, color = '#1653D8') => textTexture(s, {family: fonts.heading, weight: 800, px: 110, color, bg: '#F4F7FF', pad: 26, radius: 18});
  return {
    windows: windowsTexture(),
    cn: flagTexture('cn'),
    pl: flagTexture('pl'),
    chart: chartTexture({from: '2025-01-01', to: '2026-11-26', title: 'EMAS · USD/OZ', badge: '−32%', sub: 'PUNCAK 29 JAN 2026 → 26 NOV 2026'}),
    chartOct: chartTexture({from: '2026-09-01', to: '2026-11-26', title: 'EMAS · OKTOBER', badge: '−7%', sub: '30 SEP → 30 OKT 2026', highlight: ['2026-10-01', '2026-10-30']}),
    txt: {
      minus32: t('−32%', 160),
      bank: t('BANK SENTRAL'),
      borong: t('MEMBORONG', 110),
      spek: t('DANA SPEKULAN', 100),
      jual: t('$9,3 MILIAR', 130),
      hari: t('4 HARI · 17–20 NOV', 80),
      obligasi: textTexture('OBLIGASI AS', {family: fonts.heading, weight: 800, px: 90, color: C.white, tracking: 3}),
      bunga5: t('BUNGA ±5%/TAHUN', 110),
      bunga0: t('BUNGA 0%', 110),
      ton: t('321 TON', 150),
      plus42: t('+42% DARI TAHUN LALU', 80),
      china: t('CHINA', 90),
      poland: t('POLANDIA', 90),
      tercatat: t('TERCATAT 120 TON', 90),
      tidak: t('TIDAK DILAPORKAN ±63%', 90),
      plus26: t('+26 TON', 150),
      terbesar: t('TERBESAR DALAM SETAHUN', 80),
      tigaDari4: t('3 DARI 4', 150),
      dolarTurun: t('PORSI DOLAR TURUN', 90),
      dolarSign: sign('$ ↓'),
      okSign: sign('$ ?', '#7C93C9'),
      minggu: t('MINGGUAN', 120),
      dekade: t('DEKADE', 150),
    },
  };
};

// ---------------------------------------------------------------------------------------------------------------

const Lights = () => (
  <>
    <hemisphereLight args={['#DCE7FF', '#0A2470', 0.95]} />
    <directionalLight
      position={[-14, 26, 10]}
      intensity={3.0}
      castShadow
      shadow-mapSize-width={2048}
      shadow-mapSize-height={2048}
      shadow-camera-left={-30}
      shadow-camera-right={30}
      shadow-camera-top={30}
      shadow-camera-bottom={-30}
      shadow-bias={-0.0008}
      shadow-normalBias={0.03}
      shadow-radius={4}
    />
  </>
);

/** Trucks along a road at z = lane (x direction), frame-driven, wrapping around. */
const Traffic = ({f, lane = 3, n = 5, speed = 0.06, dir = 1, cargo}: {f: number; lane?: number; n?: number; speed?: number; dir?: 1 | -1; cargo?: boolean}) => (
  <>
    {Array.from({length: n}, (_, i) => {
      const x = ((((i * 11 + f * speed) % 55) + 55) % 55) - 27;
      return <Truck key={i} position={[dir * x, 0, lane + (dir > 0 ? 0.6 : -0.6)]} rot={dir > 0 ? 0 : Math.PI} cargo={cargo ?? i % 2 === 0} />;
    })}
  </>
);

const World = ({clear, seed = 3, children}: {clear: Array<[number, number, number, number]>; seed?: number; children: ReactNode}) => (
  <>
    {children}
    <Trees area={[-45, -45, 45, 45]} count={560} clear={[[-46, 1.2, 46, 4.8], ...clear]} seed={seed} />
    <Road at={[0, 0, 3]} length={90} />
    <Ground />
  </>
);

type Shot = {look: V3; fov: number; caption: [string, string, string]; body: (a: Assets) => ReactNode};

const SHOTS: Record<string, Shot> = {
  hook: {
    look: [1.4, 1.8, -1.2],
    fov: 8.6,
    caption: ['Harga emas sudah ', 'anjlok', ' sepertiga'],
    body: (a) => (
      <World clear={[[-6, -7, 8, 1.4]]} seed={5}>
        <Billboard position={[-1.5, 0, -3.5]} tex={a.chart} />
        <Tower position={[6.2, 0, -7.5]} size={[3, 8, 3]} windows={a.windows} />
        <GroundText tex={a.txt.minus32} height={1.3} position={[4.4, 0.03, -1.2]} yaw={Math.PI / 2} />
        <Traffic f={40} dir={-1} />
      </World>
    ),
  },
  arrive: {
    look: [-0.6, 1.2, -1.2],
    fov: 8,
    caption: ['Tapi bank sentral dunia justru ', 'memborong.', ''],
    body: (a) => (
      <World clear={[[-6, -8, 4, 1.4]]}>
        <Vault position={[-1.5, 0, -4.6]} size={[5, 3.2, 4]} open={0.9} />
        <GroundText tex={a.txt.bank} height={0.6} position={[-3.4, 0.03, -0.9]} />
        <GroundText tex={a.txt.borong} height={0.55} position={[2.2, 0.03, 0.7]} />
        <Truck position={[-0.4, 0, -1.6]} rot={Math.PI / 2} />
        <Traffic f={120} n={7} cargo />
      </World>
    ),
  },
  fast: {
    look: [1.2, 2.4, -2],
    fov: 8.6,
    caption: ['melepas kontrak emas senilai ', 'sembilan', ' koma tiga miliar dolar'],
    body: (a) => (
      <World clear={[[-5, -9, 6, 1.4]]} seed={6}>
        <Tower position={[0.5, 0, -5.5]} size={[3.2, 9, 3.2]} windows={a.windows} />
        <GroundText tex={a.txt.spek} height={0.5} position={[-2.6, 0.03, -2.6]} yaw={Math.PI / 2} />
        {/* chute from the tower's door down to the pile */}
        <mesh position={[1.1, 1.25, -2.9]} rotation={[0.6, 0, 0]} castShadow>
          <boxGeometry args={[1.1, 0.08, 2.4]} />
          <meshStandardMaterial color={C.buildingDark} roughness={0.8} />
        </mesh>
        {Array.from({length: 12}, (_, i) => (
          <mesh key={i} material={goldMat} position={[0.8 + (i % 3) * 0.25, 1.8 - i * 0.13, -3.6 + i * 0.16]} rotation={[0.6, i, 0]} castShadow>
            <boxGeometry args={[0.27, 0.1, 0.13]} />
          </mesh>
        ))}
        <GoldPile position={[1.4, 0, -1.2]} radius={1.4} count={320} />
        <GroundText tex={a.txt.jual} height={0.85} position={[3.8, 0.03, -1.4]} yaw={Math.PI / 2} />
        <GroundText tex={a.txt.hari} height={0.36} position={[5.0, 0.03, -1.4]} yaw={Math.PI / 2} />
        <Traffic f={60} dir={-1} cargo />
      </World>
    ),
  },
  bonds: {
    look: [1.0, 1.4, -2.2],
    fov: 7.0,
    caption: ['sementara emas nggak kasih bunga ', 'sama', ' sekali.'],
    body: (a) => (
      <World clear={[[-6, -8, 7, 1.4]]} seed={7}>
        <Bank position={[-1.2, 0, -4.4]} w={4.8} sign={a.txt.obligasi} />
        <GroundText tex={a.txt.bunga5} height={0.55} position={[-1.2, 0.03, -1.1]} />
        {/* the gold bar on its plinth */}
        <mesh position={[4.2, 0.35, -2.6]} castShadow receiveShadow>
          <boxGeometry args={[1.5, 0.7, 1.5]} />
          <meshStandardMaterial color={C.buildingDark} roughness={0.8} />
        </mesh>
        <mesh material={goldMat} position={[4.2, 0.95, -2.6]} castShadow>
          <boxGeometry args={[1.2, 0.5, 0.62]} />
        </mesh>
        <GroundText tex={a.txt.bunga0} height={0.55} position={[4.3, 0.03, -0.9]} />
        {[0, 1, 2].map((i) => (
          <Person key={i} position={[-2.6 + i * 0.5, 0.48, -2.2]} />
        ))}
        <Traffic f={200} />
      </World>
    ),
  },
  stack: {
    look: [1.6, 1.2, -2],
    fov: 8.4,
    caption: ['mereka beli ', 'tiga', ' ratus dua puluh satu ton'],
    body: (a) => (
      <World clear={[[-6, -9, 9, 1.4]]} seed={8}>
        <Vault position={[-2.6, 0, -5.2]} size={[5, 3.2, 4]} open={0.8} />
        {[0, 1, 2].map((r) =>
          [0, 1, 2].map((c) => <Crate key={`${r}${c}`} position={[1.6 + c * 1.9, 0, -5.2 + r * 1.9]} rows={8} cols={5} layers={r === 2 && c === 2 ? 4 : 8} fill={r === 2 && c === 2 ? 0.6 : 1} />),
        )}
        <GroundText tex={a.txt.ton} height={1.0} position={[3.4, 0.03, 0.5]} />
        <GroundText tex={a.txt.plus42} height={0.36} position={[3.4, 0.03, 1.3]} />
        <Traffic f={300} cargo />
      </World>
    ),
  },
  hidden: {
    look: [3.0, 1.0, -2.2],
    fov: 8.2,
    caption: ['hampir dua pertiganya ', 'nggak', ' dilaporkan'],
    body: (a) => (
      <World clear={[[-5, -8, 9, 1.4]]}>
        <Vault position={[-2.2, 0, -4.8]} size={[5, 3.2, 4]} open={0.5} />
        <Crate position={[2.9, 0, -4.4]} rows={8} cols={5} layers={9} />
        <Crate position={[4.9, 0, -4.4]} rows={7} cols={4} layers={6} />
        <Flag position={[2.2, 0, -5.7]} tex={a.cn} />
        <Flag position={[4.4, 0, -5.7]} tex={a.pl} />
        <GroundText tex={a.txt.china} height={0.36} position={[2.9, 0.03, -2.95]} />
        <GroundText tex={a.txt.poland} height={0.36} position={[4.9, 0.03, -2.95]} />
        <GroundText tex={a.txt.tercatat} height={0.4} position={[3.9, 0.03, -2.35]} />
        <Crate position={[2.6, 0, -0.3]} rows={8} cols={5} layers={9} wrapped />
        <Crate position={[4.6, 0, -0.3]} rows={8} cols={5} layers={9} wrapped />
        <Crate position={[6.6, 0, -0.3]} rows={8} cols={5} layers={7} wrapped />
        <GroundText tex={a.txt.tidak} height={0.42} position={[4.4, 0.03, 1.15]} />
        <Traffic f={500} />
      </World>
    ),
  },
  dip: {
    look: [2.0, 1.6, -0.5],
    fov: 9.0,
    caption: ['China malah nambah ', 'dua', ' puluh enam ton'],
    body: (a) => (
      <World clear={[[-6, -8, 8, 1.4]]} seed={9}>
        <Billboard position={[-1.6, 0, -4.2]} tex={a.chartOct} />
        <Road at={[4.6, 0, -2]} length={10} alongZ width={2.2} />
        {[0, 1, 2].map((i) => (
          <group key={i} position={[4.0, 0, -4.4 + i * 2.1]} rotation={[0, -Math.PI / 2, 0]}>
            <Truck position={[0, 0, 0]} />
            <Flag position={[0.62, 0.66, 0]} tex={a.cn} raise={0.3} />
          </group>
        ))}
        <GroundText tex={a.txt.plus26} height={1.0} position={[1.4, 0.03, 0.3]} />
        <GroundText tex={a.txt.terbesar} height={0.32} position={[1.4, 0.03, 1.15]} />
      </World>
    ),
  },
  why: {
    look: [0.4, 1.6, -2.2],
    fov: 9.0,
    caption: ['porsi dolar di cadangan devisa bakal ', 'turun', ''],
    body: (a) => (
      <World clear={[[-8, -9, 9, 1.4]]} seed={10}>
        {[0, 1, 2, 3].map((i) => (
          <group key={i}>
            <Bank position={[-3.6 + i * 3.1, 0, -5.2]} w={2.4} d={2} h={1.5} />
            <SignPost position={[-3.6 + i * 3.1, 0, -2.7]} tex={i < 3 ? a.txt.dolarSign : a.txt.okSign} h={0.95} lift={i < 3 ? 1.1 : 0.55} />
          </group>
        ))}
        <GroundText tex={a.txt.tigaDari4} height={1.0} position={[0.4, 0.03, -0.9]} />
        <GroundText tex={a.txt.dolarTurun} height={0.4} position={[0.4, 0.03, 0.2]} />
        <Traffic f={700} />
      </World>
    ),
  },
  payoff: {
    look: [0.2, 0.8, -1.2],
    fov: 10.0,
    caption: ['Arah satu dekade ditentukan ', 'pembeli', ' yang sabar.'],
    body: (a) => (
      <World clear={[[-9, -12, 9, 1.4]]} seed={11}>
        <Vault position={[-3.5, 0, -6.5]} size={[5, 3.2, 4]} open={0.9} />
        <GroundText tex={a.txt.dekade} height={1.0} position={[-0.6, 0.03, -2.6]} yaw={Math.PI / 2} />
        <SportsCar position={[4.2, 0, 2.4]} />
        <GroundText tex={a.txt.minggu} height={0.55} position={[4.6, 0.03, 0.5]} />
        <Road at={[-3.5, 0, -1.6]} length={5.6} alongZ width={2.2} />
        {Array.from({length: 3}, (_, i) => (
          <Truck key={i} position={[-3.5, 0, -3.4 + i * 1.7]} rot={Math.PI / 2} />
        ))}
        {Array.from({length: 6}, (_, i) => (
          <Truck key={`m${i}`} position={[-5.2 - i * 1.8, 0, 3.6]} />
        ))}
      </World>
    ),
  },
};

export const EmasStyle = ({shot = 'hidden'}: {shot?: string}) => {
  const {width, height} = useVideoConfig();
  const a = useAssets3D(loadAssets, 'emas-style');
  const s = SHOTS[shot] ?? SHOTS.hidden;
  return (
    <AbsoluteFill style={{background: C.ground}}>
      {a && (
        <ThreeCanvas width={width} height={height} gl={{antialias: true, toneMapping: THREE.NoToneMapping, preserveDrawingBuffer: true}} dpr={2} shadows>
          <KeyedCamera keys={[iso(0, s.look, s.fov)]} />
          <DepthRange />
          <color attach="background" args={[C.ground]} />
          <Lights />
          {s.body(a)}
        </ThreeCanvas>
      )}
      <CornerLogo from={0} plate />
      {/* Caption box (karaoke): spoken words white, the current word gold, the rest dim */}
      <div style={{position: 'absolute', left: 120, right: 120, top: 1440, display: 'flex', justifyContent: 'center'}}>
        <div style={{background: 'rgba(5,11,24,0.92)', borderRadius: 14, padding: '16px 26px', fontFamily: fonts.heading, fontWeight: 700, fontSize: 46, lineHeight: 1.18, textAlign: 'center', color: 'rgba(255,255,255,0.45)'}}>
          <span style={{color: '#FFFFFF'}}>{s.caption[0]}</span>
          <span style={{color: C.gold}}>{s.caption[1]}</span>
          {s.caption[2]}
        </div>
      </div>
    </AbsoluteFill>
  );
};
