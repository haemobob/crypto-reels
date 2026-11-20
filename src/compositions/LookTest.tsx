import {ContactShadows, Environment, Lightformer, MeshReflectorMaterial, RoundedBox} from '@react-three/drei';
import {ThreeCanvas} from '@remotion/three';
import {useMemo} from 'react';
import {AbsoluteFill, getInputProps, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import * as THREE from 'three';
import {Enter} from '../components/motion';
import {fontsReady, loadImage, useAssets3D} from '../three/assets';
import {ridgeNormalMap} from '../three/kit';
import {KeyedCamera, cameraAt, type CamKey} from '../three/camera';
import {Post} from '../three/post';
import {colors} from '../theme/colors';
import {fonts} from '../theme/typography';

/**
 * "look-test" (5 s, no voice): the premium render pipeline on one story object, to compare against our earlier frames.
 * Brushed-metal ID card built from the real whitepaper page, a chrome coin stack, a glossy reflective floor, a studio
 * environment of light panels, contact shadows, depth of field, a touch of bloom, film grain, AgX tone mapping, and a
 * fast whip with directional motion blur.
 */
const W = 1080;
const H = 1920;
const CARD: [number, number, number] = [0, 1.55, 0];
const COINS: [number, number, number] = [2.6, 0, -2.2];
const WHIP = 88;

const keys: CamKey[] = [
  {f: 0, pos: [1.7, 2.7, 16.6], look: [0, 2.15, 0], fov: 30},
  {f: WHIP, pos: [0.6, 2.35, 13.4], look: [0, 2.15, 0], fov: 30, ease: 'linear'},
  {f: WHIP + 12, pos: [1.5, 1.55, 4.6], look: [COINS[0], 1.0, COINS[2]], fov: 30, ease: 'in'},
  {f: 150, pos: [1.7, 1.45, 4.15], look: [COINS[0], 1.0, COINS[2]], fov: 30, ease: 'out'},
];

/** The card face, 0x100x-style ID card: graphite glass, a real "portrait" (the whitepaper page), white type, a badge. */
const cardFace = (page: HTMLImageElement) => {
  const c = document.createElement('canvas');
  c.width = 2048;
  c.height = 1264;
  const g = c.getContext('2d')!;
  g.beginPath();
  g.roundRect(0, 0, 2048, 1264, 110);
  g.clip();
  const grad = g.createLinearGradient(0, 0, 2048, 1264);
  grad.addColorStop(0, '#2A2F37');
  grad.addColorStop(0.55, '#14171C');
  grad.addColorStop(1, '#1E2229');
  g.fillStyle = grad;
  g.fillRect(0, 0, 2048, 1264);
  const sheen = g.createLinearGradient(0, 0, 2048, 600);
  sheen.addColorStop(0, 'rgba(255,255,255,0.10)');
  sheen.addColorStop(0.4, 'rgba(255,255,255,0.0)');
  g.fillStyle = sheen;
  g.fillRect(0, 0, 2048, 1264);
  // Portrait: the real whitepaper title page, in a rounded window.
  g.save();
  g.beginPath();
  g.roundRect(110, 150, 640, 964, 60);
  g.clip();
  g.fillStyle = '#FFFFFF';
  g.fillRect(110, 150, 640, 964);
  const sw = 1300;
  const sh = sw * (964 / 640);
  g.drawImage(page, 285, 240, sw, sh, 110, 150, 640, 964);
  g.restore();
  // Badge (top right).
  g.fillStyle = 'rgba(255,255,255,0.08)';
  g.beginPath();
  g.roundRect(1720, 150, 210, 210, 48);
  g.fill();
  g.strokeStyle = 'rgba(255,255,255,0.25)';
  g.lineWidth = 4;
  g.stroke();
  g.fillStyle = '#FFFFFF';
  g.font = `800 140px "${fonts.heading}"`;
  g.textAlign = 'center';
  g.fillText('\u20bf', 1825, 305);
  g.textAlign = 'left';
  // Type.
  g.fillStyle = '#FFFFFF';
  g.font = `700 150px "${fonts.heading}"`;
  g.fillText('Satoshi', 860, 330);
  g.fillText('Nakamoto', 860, 490);
  g.fillStyle = '#9AA6B6';
  g.font = `600 58px "${fonts.body}"`;
  g.fillText('Pencipta Bitcoin \u00b7 whitepaper 2008', 860, 590);
  g.fillStyle = 'rgba(255,255,255,0.14)';
  g.fillRect(860, 660, 1070, 4);
  g.fillStyle = '#9AA6B6';
  g.font = `700 52px "${fonts.mono}"`;
  g.fillText('PERKIRAAN SALDO', 860, 770);
  g.fillStyle = '#FFFFFF';
  g.font = `800 118px "${fonts.mono}"`;
  g.fillText('\u00b11.097.650', 860, 910);
  g.fillStyle = colors.electric;
  g.font = `800 70px "${fonts.mono}"`;
  g.fillText('BTC', 1640, 910);
  g.fillStyle = '#19D69A';
  g.font = `700 50px "${fonts.mono}"`;
  g.fillText('\u25cf 21.953 BLOK \u00b7 BELUM DIPINDAH', 860, 1040);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
};

const Card = ({face}: {face: THREE.Texture}) => {
  const f = useCurrentFrame();
  const rotY = interpolate(f, [0, 150], [-0.34, -0.14]);
  const bob = Math.sin(f / 30) * 0.015;
  // A glint that runs along the top edge once (their travelling specular).
  const gx = interpolate(f, [10, 60], [-1.9, 1.9], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <group position={[CARD[0], CARD[1] + bob, CARD[2]]} rotation={[0.02, rotY, 0.015]}>
      <RoundedBox args={[3.4, 2.1, 0.07]} radius={0.11} smoothness={8}>
        <meshPhysicalMaterial color="#1B1F25" metalness={0.7} roughness={0.22} clearcoat={1} clearcoatRoughness={0.05} />
      </RoundedBox>
      <mesh position={[0, 0, 0.0362]}>
        <planeGeometry args={[3.3, 2.04]} />
        <meshBasicMaterial map={face} transparent toneMapped={false} />
      </mesh>
      {f > 10 && f < 62 && (
        <mesh position={[gx, 1.035, 0.05]}>
          <planeGeometry args={[0.5, 0.05]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.85} toneMapped={false} blending={THREE.AdditiveBlending} />
        </mesh>
      )}
    </group>
  );
};

const Coins = () => {
  const ridges = useMemo(() => {
    const t = ridgeNormalMap(220);
    t.repeat.set(1, 1);
    return t;
  }, []);
  const geo = useMemo(() => new THREE.CylinderGeometry(0.62, 0.62, 0.085, 128), []);
  const side = useMemo(() => new THREE.MeshPhysicalMaterial({color: '#4A525E', metalness: 1, roughness: 0.16, normalMap: ridges, normalScale: new THREE.Vector2(0.6, 0.6)}), [ridges]);
  const face = useMemo(() => new THREE.MeshPhysicalMaterial({color: '#59626F', metalness: 1, roughness: 0.12, clearcoat: 0.8}), []);
  return (
    <group position={COINS}>
      {Array.from({length: 14}, (_, i) => {
        const jitter = Math.sin(i * 7.31) * 0.035;
        return <mesh key={i} geometry={geo} material={[side, face, face]} position={[jitter, 0.045 + i * 0.09, Math.cos(i * 3.1) * 0.03]} rotation={[0, i * 0.7, 0]} />;
      })}
      {/* Brand-blue under-glow, the accent light (theirs is green). */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.004, 0]}>
        <circleGeometry args={[1.5, 64]} />
        <meshBasicMaterial map={glowTex()} transparent toneMapped={false} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
    </group>
  );
};

let glowCache: THREE.Texture | null = null;
const glowTex = () => {
  if (glowCache) return glowCache;
  const c = document.createElement('canvas');
  c.width = c.height = 256;
  const g = c.getContext('2d')!;
  const r = g.createRadialGradient(128, 128, 0, 128, 128, 128);
  r.addColorStop(0, 'rgba(41,151,255,0.85)');
  r.addColorStop(0.35, 'rgba(22,119,255,0.35)');
  r.addColorStop(1, 'rgba(22,119,255,0)');
  g.fillStyle = r;
  g.fillRect(0, 0, 256, 256);
  glowCache = new THREE.CanvasTexture(c);
  return glowCache;
};

const Studio = () => (
  <Environment resolution={256} frames={1}>
    <Lightformer form="rect" intensity={7} color="#ffffff" position={[-2.5, 6, 4]} scale={[5, 2.5, 1]} />
    <Lightformer form="rect" intensity={9} color="#ffffff" position={[0, 3.2, -5]} scale={[9, 0.18, 1]} />
    <Lightformer form="rect" intensity={2.2} color="#cfe0ff" position={[5, 2, 3]} scale={[2.5, 4, 1]} />
    <Lightformer form="rect" intensity={10} color="#1677FF" position={[0, 0.25, -4]} scale={[12, 0.25, 1]} />
    <Lightformer form="rect" intensity={5} color="#2997FF" position={[-6, 1.5, -1]} rotation-y={Math.PI / 2} scale={[0.18, 5, 1]} />
  </Environment>
);

export const LookTest = () => {
  const f = useCurrentFrame();
  const {post = true, reflector = true} = getInputProps() as {post?: boolean; reflector?: boolean};
  const {width, height} = useVideoConfig();
  const assets = useAssets3D(async () => {
    await fontsReady();
    const page = await loadImage(staticFile('episodes/dompet-satoshi/whitepaper-p1.jpg'));
    return {face: cardFace(page)};
  }, 'look-test');
  // Directional motion blur on the whip: horizontal smear proportional to the camera's angular speed.
  const a = cameraAt(f - 1, keys).look;
  const b = cameraAt(f, keys).look;
  const speed = Math.hypot(b[0] - a[0], b[2] - a[2]);
  const blurX = Math.min(28, speed * 140);
  const focus = f < WHIP + 9 ? CARD : ([COINS[0], 0.6, COINS[2]] as [number, number, number]);
  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      <svg width={0} height={0} style={{position: 'absolute'}}>
        <filter id="whip">
          <feGaussianBlur stdDeviation={`${blurX} 0`} />
        </filter>
      </svg>
      {assets && (
        <div style={{position: 'absolute', inset: 0, filter: blurX > 0.5 ? 'url(#whip)' : undefined}}>
          <ThreeCanvas width={width} height={height} gl={{antialias: false, toneMapping: THREE.NoToneMapping, preserveDrawingBuffer: true}} dpr={1}>
            <KeyedCamera keys={keys} />
            <color attach="background" args={['#000000']} />
            <fog attach="fog" args={['#000000', 18, 40]} />
            <Studio />
            <spotLight position={[0.5, 9, 5]} angle={0.42} penumbra={1} intensity={90} distance={30} decay={2} color="#ffffff" />
            <ambientLight intensity={0.05} />
            <Card face={assets.face} />
            <Coins />
            <ContactShadows position={[0, 0.002, 0]} opacity={0.7} scale={14} blur={2.6} far={4} resolution={1024} frames={1} />
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
              <planeGeometry args={[40, 40]} />
              {reflector ? <MeshReflectorMaterial resolution={1024} blur={[400, 120]} mixBlur={1} mixStrength={4} roughness={0.7} depthScale={1} minDepthThreshold={0.4} maxDepthThreshold={1.3} color="#06090F" metalness={0.6} mirror={0.6} /> : <meshStandardMaterial color="#06090F" roughness={0.4} metalness={0.5} />}
            </mesh>
            {post && <Post focus={focus} focalLength={0.015} bokehScale={2} bloom={0.45} bloomThreshold={0.75} grain={0.04} />}
          </ThreeCanvas>
        </div>
      )}
      <div style={{position: 'absolute', left: 60, right: 60, top: 470, textAlign: 'center', fontFamily: fonts.heading, fontWeight: 800, fontSize: 118, lineHeight: 0.98, letterSpacing: '-0.035em', color: '#FFFFFF'}}>
        <Enter at={4} kind="words">1,1 JUTA BTC</Enter>
        <div style={{color: colors.electric}}>
          <Enter at={14} kind="words">MILIK SATOSHI?</Enter>
        </div>
      </div>
      <div style={{position: 'absolute', left: 60, right: 60, top: 1530, textAlign: 'center', fontFamily: fonts.mono, fontWeight: 500, fontSize: 18, letterSpacing: '0.04em', color: '#7F93B3'}}>
        <Enter at={20} kind="wipe">PERKIRAAN: POLA PATOSHI · WHITEPAPER: BITCOIN.ORG</Enter>
      </div>
    </AbsoluteFill>
  );
};

export const LOOK_TEST_FRAMES = 150;
export const LOOK_SIZE = {W, H};
