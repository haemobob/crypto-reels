/**
 * Style frames for emas-bank-sentral (stills; input prop `shot` = chart | vault). Composition id "emas-style".
 */
import {useThree} from '@react-three/fiber';
import {ThreeCanvas} from '@remotion/three';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import * as THREE from 'three';
import {fontsReady, textTexture, toTexture, useAssets3D, type TextTexture} from '../../three/assets';
import {KeyedCamera, type CamKey} from '../../three/camera';
import {fonts} from '../../theme/typography';
import {C, Crate, Flag, Ground, GroundText, Road, Tower, Trees, Truck, Vault, type V3} from './city';
import data from './data.json';

const AZ = Math.PI / 4;
const EL = (32 * Math.PI) / 180;
const DIST = 120;
/** An isometric camera key looking at `look`, `fov` sets the zoom. */
export const iso = (f: number, look: V3, fov = 12): CamKey => ({
  f,
  look,
  fov,
  pos: [look[0] + DIST * Math.sin(AZ) * Math.cos(EL), look[1] + DIST * Math.sin(EL), look[2] + DIST * Math.cos(AZ) * Math.cos(EL)],
});

// ---------------------------------------------------------------------------------------------------------------
// Canvas textures

const windowsTexture = () => {
  const c = document.createElement('canvas');
  c.width = 256;
  c.height = 512;
  const g = c.getContext('2d')!;
  g.fillStyle = C.building;
  g.fillRect(0, 0, 256, 512);
  for (let y = 0; y < 16; y++)
    for (let x = 0; x < 6; x++) {
      const lit = Math.sin(x * 12.9 + y * 78.2) * 43758.5 % 1;
      g.fillStyle = Math.abs(lit) > 0.6 ? '#DCE8FF' : '#1A4FC9';
      g.fillRect(18 + x * 38, 20 + y * 30, 22, 16);
    }
  return toTexture(c);
};

const flagTexture = (country: 'cn' | 'pl') => {
  const c = document.createElement('canvas');
  c.width = 300;
  c.height = 200;
  const g = c.getContext('2d')!;
  if (country === 'pl') {
    g.fillStyle = '#FFFFFF';
    g.fillRect(0, 0, 300, 100);
    g.fillStyle = '#DC143C';
    g.fillRect(0, 100, 300, 100);
  } else {
    g.fillStyle = '#EE1C25';
    g.fillRect(0, 0, 300, 200);
    const star = (cx: number, cy: number, r: number, rot: number) => {
      g.beginPath();
      for (let i = 0; i < 10; i++) {
        const a = rot + (i * Math.PI) / 5 - Math.PI / 2;
        const rr = i % 2 ? r * 0.382 : r;
        g.lineTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr);
      }
      g.closePath();
      g.fillStyle = '#FFFF00';
      g.fill();
    };
    star(50, 50, 30, 0);
    [[100, 20], [120, 40], [120, 70], [100, 90]].forEach(([x, y], i) => star(x, y, 10, 0.3 + i * 0.3));
  }
  return toTexture(c);
};

/** The real gold price (daily closes, Jan 2025 – 26 Nov 2026) on an LED board. */
const chartTexture = () => {
  const W = 1200;
  const H = 700;
  const c = document.createElement('canvas');
  c.width = W;
  c.height = H;
  const g = c.getContext('2d')!;
  g.fillStyle = '#071433';
  g.fillRect(0, 0, W, H);
  const pts = data.gold;
  const lo = 2400;
  const hi = 5600;
  const px = (i: number) => 60 + (i / (pts.length - 1)) * (W - 120);
  const py = (v: number) => 170 + ((hi - v) / (hi - lo)) * (H - 230);
  g.strokeStyle = 'rgba(255,255,255,0.08)';
  g.lineWidth = 2;
  [3000, 4000, 5000].forEach((v) => {
    g.beginPath();
    g.moveTo(40, py(v));
    g.lineTo(W - 40, py(v));
    g.stroke();
  });
  g.font = `600 26px "${fonts.mono}"`;
  g.fillStyle = 'rgba(255,255,255,0.5)';
  [3000, 4000, 5000].forEach((v) => g.fillText(`$${v / 1000}rb`, W - 150, py(v) - 8));
  g.beginPath();
  pts.forEach((p, i) => (i ? g.lineTo(px(i), py(p.c)) : g.moveTo(px(i), py(p.c))));
  g.strokeStyle = C.gold;
  g.lineWidth = 7;
  g.lineJoin = 'round';
  g.stroke();
  const ip = pts.findIndex((p) => p.d === data.key.peakDate);
  g.fillStyle = '#FFFFFF';
  g.beginPath();
  g.arc(px(ip), py(pts[ip].c), 10, 0, Math.PI * 2);
  g.fill();
  g.beginPath();
  g.arc(px(pts.length - 1), py(pts[pts.length - 1].c), 12, 0, Math.PI * 2);
  g.fillStyle = '#FF5263';
  g.fill();
  g.font = `800 56px "${fonts.heading}"`;
  g.fillStyle = '#FFFFFF';
  g.fillText('EMAS · USD/OZ', 60, 90);
  g.font = `800 80px "${fonts.mono}"`;
  g.fillStyle = '#FF5263';
  g.fillText('−32%', W - 340, 100);
  g.font = `600 24px "${fonts.mono}"`;
  g.fillStyle = 'rgba(255,255,255,0.6)';
  g.fillText('PUNCAK 29 JAN 2026 → 26 NOV 2026', 60, 135);
  return toTexture(c);
};

type Assets = {windows: THREE.Texture; cn: THREE.Texture; pl: THREE.Texture; chart: THREE.Texture; txt: Record<string, TextTexture>};

const loadAssets = async (): Promise<Assets> => {
  await fontsReady();
  const t = (s: string, px = 120) => textTexture(s, {family: fonts.heading, weight: 800, px, color: C.white, tracking: 2});
  return {
    windows: windowsTexture(),
    cn: flagTexture('cn'),
    pl: flagTexture('pl'),
    chart: chartTexture(),
    txt: {
      bank: t('BANK SENTRAL'),
      ton: t('321 TON'),
      plus: t('+42%'),
      china: t('CHINA', 90),
      poland: t('POLANDIA', 90),
      tercatat: t('TERCATAT', 90),
      tidak: t('TIDAK DILAPORKAN', 90),
      jual: t('JUAL'),
      spek: t('DANA SPEKULAN', 90),
      minus: t('−32%'),
    },
  };
};

// ---------------------------------------------------------------------------------------------------------------

/** The isometric camera sits ~120 units away: a tight near/far keeps depth precision (no z-fighting stripes). */
export const DepthRange = ({near = 70, far = 220}: {near?: number; far?: number}) => {
  const {camera} = useThree();
  camera.near = near;
  camera.far = far;
  camera.updateProjectionMatrix();
  return null;
};

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

/** Trucks driving along the main road (z = 3), frame-driven, wrapping around. */
const Traffic = ({f, lane = 3, n = 5, speed = 0.06, dir = 1}: {f: number; lane?: number; n?: number; speed?: number; dir?: 1 | -1}) => (
  <>
    {Array.from({length: n}, (_, i) => {
      const x = ((((i * 11 + f * speed) % 55) + 55) % 55) - 27;
      return <Truck key={i} position={[dir * x, 0, lane + (dir > 0 ? 0.6 : -0.6)]} rot={dir > 0 ? 0 : Math.PI} cargo={i % 2 === 0} />;
    })}
  </>
);

const VaultShot = ({a, f}: {a: Assets; f: number}) => (
  <>
    <Road at={[0, 0, 3]} length={90} />
    <Vault position={[-2.2, 0, -4.8]} size={[5, 3.2, 4]} open={0.55} />
    <GroundText tex={a.txt.bank} height={0.7} position={[-1.4, 0.03, 0.6]} />
    {/* reported (gold) and unreported (wrapped) crates */}
    <Crate position={[2.9, 0, -3.9]} rows={8} cols={5} layers={9} />
    <Crate position={[4.9, 0, -3.9]} rows={7} cols={4} layers={6} />
    <Flag position={[2.2, 0, -5.2]} tex={a.cn} />
    <Flag position={[4.4, 0, -5.2]} tex={a.pl} />
    <GroundText tex={a.txt.china} height={0.42} position={[2.9, 0.03, -2.3]} />
    <GroundText tex={a.txt.poland} height={0.42} position={[5.0, 0.03, -2.3]} />
    <Crate position={[2.9, 0, -0.7]} rows={8} cols={5} layers={9} wrapped />
    <Crate position={[4.9, 0, -0.7]} rows={8} cols={5} layers={9} wrapped />
    <Crate position={[6.9, 0, -0.7]} rows={8} cols={5} layers={7} wrapped />
    <GroundText tex={a.txt.tidak} height={0.5} position={[5.0, 0.03, 1.05]} />
    <GroundText tex={a.txt.tercatat} height={0.42} position={[6.6, 0.03, -3.6]} yaw={Math.PI / 2} />
    <Traffic f={f} />
    <Trees area={[-45, -45, 45, 45]} count={520} clear={[[-46, 1.2, 46, 4.8], [-5, -8, 8.5, 1.4]]} seed={3} />
    <Ground />
  </>
);

const ChartShot = ({a, f}: {a: Assets; f: number}) => (
  <>
    <Road at={[0, 0, 3]} length={90} />
    {/* the LED board on two legs, showing the real price */}
    <group position={[-1.5, 0, -3.5]}>
      {[-2.6, 2.6].map((x) => (
        <mesh key={x} position={[x, 1.6, 0]} castShadow>
          <boxGeometry args={[0.25, 3.2, 0.25]} />
          <meshStandardMaterial color={C.buildingDark} roughness={0.8} />
        </mesh>
      ))}
      <mesh position={[0, 4.6, 0.02]} castShadow>
        <boxGeometry args={[6.6, 3.9, 0.3]} />
        <meshStandardMaterial color={C.buildingDark} roughness={0.8} />
      </mesh>
      <mesh position={[0, 4.6, 0.18]}>
        <planeGeometry args={[6.2, 3.6]} />
        <meshBasicMaterial map={a.chart} toneMapped={false} />
      </mesh>
    </group>
    <Tower position={[5.5, 0, -6]} size={[3, 8, 3]} windows={a.windows} />
    <GroundText tex={a.txt.spek} height={0.5} position={[5.6, 0.03, -3.2]} />
    <GroundText tex={a.txt.jual} height={0.9} position={[3.6, 0.03, 0.4]} />
    <Traffic f={f} dir={-1} />
    <Trees area={[-45, -45, 45, 45]} count={520} clear={[[-46, 1.2, 46, 4.8], [-5, -7, 8, 1.4]]} seed={5} />
    <Ground />
  </>
);

export const EmasStyle = ({shot = 'vault'}: {shot?: string}) => {
  const f = useCurrentFrame();
  const {width, height} = useVideoConfig();
  const a = useAssets3D(loadAssets, 'emas-style');
  const keys = [shot === 'vault' ? iso(0, [3.2, 1.0, -1.9], 7.4) : iso(0, [0.4, 2.6, -2.2], 8.2)];
  return (
    <AbsoluteFill style={{background: C.ground}}>
      {a && (
        <ThreeCanvas width={width} height={height} gl={{antialias: true, toneMapping: THREE.NoToneMapping, preserveDrawingBuffer: true}} dpr={2} shadows>
          <KeyedCamera keys={keys} />
          <DepthRange />
          <color attach="background" args={[C.ground]} />
          <Lights />
          {shot === 'vault' ? <VaultShot a={a} f={f} /> : <ChartShot a={a} f={f} />}
        </ThreeCanvas>
      )}
      {/* Caption box (karaoke): spoken words white, the current word gold, the rest dim */}
      <div style={{position: 'absolute', left: 150, right: 150, top: 1440, display: 'flex', justifyContent: 'center'}}>
        <div style={{background: 'rgba(5,11,24,0.92)', borderRadius: 14, padding: '16px 26px', fontFamily: fonts.heading, fontWeight: 700, fontSize: 46, lineHeight: 1.18, textAlign: 'center', color: 'rgba(255,255,255,0.45)'}}>
          {shot === 'vault' ? (
            <>
              <span style={{color: '#FFFFFF'}}>hampir dua pertiganya </span>
              <span style={{color: C.gold}}>nggak </span>dilaporkan
            </>
          ) : (
            <>
              <span style={{color: '#FFFFFF'}}>Harga emas sudah </span>
              <span style={{color: C.gold}}>anjlok </span>sepertiga
            </>
          )}
        </div>
      </div>
    </AbsoluteFill>
  );
};
