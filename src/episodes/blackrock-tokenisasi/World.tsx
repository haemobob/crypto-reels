import {useThree} from '@react-three/fiber';
import {ThreeCanvas} from '@remotion/three';
import {useMemo} from 'react';
import {interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import * as THREE from 'three';
import {RoomEnvironment} from 'three/examples/jsm/environments/RoomEnvironment.js';
import {fontsReady, loadImage, textTexture, toTexture, useAssets3D} from '../../three/assets';
import {KeyedCamera, type CamKey, type V3} from '../../three/camera';
import {Coin, coinFace} from '../../three/Coin';
import {Label3D} from '../../three/Label3D';
import {colors} from '../../theme/colors';
import {ease} from '../../theme/motion';
import {fonts} from '../../theme/typography';

const ramp = (frame: number, a: number, b: number, easing = ease.inOut) =>
  interpolate(frame, [a, b], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing});
const mix = (a: number, b: number, t: number) => a + (b - a) * t;
const mix3 = (a: V3, b: V3, t: number): V3 => [mix(a[0], b[0], t), mix(a[1], b[1], t), mix(a[2], b[2], t)];

const dir = (p: string) => staticFile(`episodes/blackrock-tokenisasi/${p}`);

/** Scene light, reflections and fog; also enables the clipping the scan uses. */
export const Env = ({bg, near, far, envIntensity = 0.8}: {bg: string; near: number; far: number; envIntensity?: number}) => {
  const {gl, scene} = useThree();
  useMemo(() => {
    gl.localClippingEnabled = true;
    const pm = new THREE.PMREMGenerator(gl);
    scene.environment = pm.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environmentIntensity = envIntensity;
    scene.background = new THREE.Color(bg);
    scene.fog = new THREE.Fog(bg, near, far);
  }, [gl, scene, bg, near, far, envIntensity]);
  return null;
};

/** Per-frame fog distance (the scene's fog is created by <Env>). */
const FogAt = ({near, far}: {near: number; far: number}) => {
  const {scene} = useThree();
  if (scene.fog instanceof THREE.Fog) {
    scene.fog.near = near;
    scene.fog.far = far;
  }
  return null;
};

export const gridTexture = (bg: string, line: string, repeat: number) => {
  const c = document.createElement('canvas');
  c.width = 256;
  c.height = 256;
  const ctx = c.getContext('2d')!;
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 256, 256);
  ctx.fillStyle = line;
  ctx.fillRect(0, 0, 256, 3);
  ctx.fillRect(0, 0, 3, 256);
  const t = toTexture(c);
  t.wrapS = THREE.RepeatWrapping;
  t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(repeat, repeat);
  return t;
};

const blobTexture = () => {
  const c = document.createElement('canvas');
  c.width = 128;
  c.height = 128;
  const ctx = c.getContext('2d')!;
  const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0, 'rgba(0,0,0,0.85)');
  g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);
  return toTexture(c);
};

export type MechanismBeats = {
  WH: number; buku: number; digital: number;
  OLD: number; NEW: number; pindah: number; tangan: number;
  SP: number; dipecah: number; CO: number; jaminan: number; pinjaman: number; RE: number;
};

const LANE_X = 0.62;
const Z0 = 1.2; // lane start
const Z2 = -3.8; // lane end (day 2)
const GATES = [Z0, (Z0 + Z2) / 2, Z2];
const VAULT: V3 = [1.85, 0, 0.25];
const PLEDGED = 0; // sector whose middle points at the vault

const Gate = ({x, z, color, glow}: {x: number; z: number; color: string; glow: number}) => {
  const c = new THREE.Color(color).lerp(new THREE.Color(colors.light), glow);
  return (
    <group position={[x, 0, z]}>
      {[-0.42, 0.42].map((dx) => (
        <mesh key={dx} position={[dx, 0.35, 0]}>
          <boxGeometry args={[0.035, 0.7, 0.035]} />
          <meshBasicMaterial color={c} />
        </mesh>
      ))}
      <mesh position={[0, 0.7, 0]}>
        <boxGeometry args={[0.875, 0.035, 0.035]} />
        <meshBasicMaterial color={c} />
      </mesh>
    </group>
  );
};

export const MechanismWorld = ({b}: {b: MechanismBeats}) => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();
  const a = useAssets3D(async () => {
    await fontsReady();
    const [cert, mark] = await Promise.all([loadImage(dir('share-certificate-cbq-1880s.jpg')), loadImage(dir('blackrock-wordmark-white.png'))]);
    const label = (s: string, color: string = colors.text, px = 96, weight = 800) => textTexture(s, {family: fonts.heading, weight, px, color, tracking: 1});
    const mono = (s: string, color: string = colors.muted) => textTexture(s, {family: fonts.mono, weight: 700, px: 80, color, tracking: 4});
    return {
      cert: toTexture(cert),
      face: toTexture(coinFace(mark)),
      loan: toTexture(coinFace(null, {bg: colors.positive, ring: '#0E8F67'})),
      grid: gridTexture('#02060D', 'rgba(41,151,255,0.24)', 24),
      blob: blobTexture(),
      t: {
        bei: mono('BEI · SAHAM', colors.muted),
        chain: mono('BLOCKCHAIN · TOKEN', colors.light),
        days: ['HARI 0', 'HARI 1', 'HARI 2'].map((d) => mono(d, colors.muted)),
        daysLit: ['HARI 0', 'HARI 1', 'HARI 2'].map((d) => mono(d, colors.light)),
        owner: mono('PEMILIK BARU', colors.light),
                vault: mono('JAMINAN', colors.light),
        loan: mono('PINJAMAN', colors.positive),
      },
    };
  }, 'mechanism-world');

  const clip = useMemo(() => new THREE.Plane(new THREE.Vector3(1, 0, 0), 1.7), []);
  const certMat = useMemo(() => (a ? new THREE.MeshStandardMaterial({map: a.cert, roughness: 0.85, metalness: 0, clippingPlanes: [clip], side: THREE.DoubleSide}) : null), [a, clip]);
  if (!a || !certMat) return null;

  // ---- A. Certificate → token (WH → OLD) ----
  const scan = ramp(frame, b.buku - 2, b.buku + 16, ease.inOut);
  const scanX = mix(-1.7, 1.7, scan);
  clip.constant = -scanX;
  const showCert = frame < b.buku + 18;
  const beam = frame >= b.buku - 3 && frame < b.buku + 19 ? Math.sin(Math.PI * Math.min(1, Math.max(0, (frame - b.buku + 3) / 22))) : 0;
  const born = b.buku + 6;
  const grow = ramp(frame, born, born + 12, ease.out);
  const stand = ramp(frame, born + 4, b.digital + 12);
  const coinA: V3 = [0, mix(0.05, 1.15, stand), 0];

  // ---- B. Lanes (OLD → SP) ----
  const lanes = frame >= b.OLD && frame < b.SP ? ramp(frame, b.OLD, b.OLD + 14, ease.out) : 0;
  const toLane = ramp(frame, b.OLD, b.OLD + 18);
  const zip = ramp(frame, b.pindah, b.pindah + 10, ease.inOut);
  const arrived = frame >= b.pindah + 10;
  const laneStart: V3 = [LANE_X, 0.36, Z0];
  const coinB: V3 = [LANE_X, 0.36 + Math.sin(zip * Math.PI) * 0.2, mix(Z0, Z2, zip)];
  const slowP = interpolate(frame, [b.OLD + 16, b.SP], [0, 0.66], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const slowZ = mix(Z0, Z2, slowP);
  // After the token lands, cut to a reverse angle from beyond the finish so the ledger panel sits over empty floor.
  const reverse = frame >= b.pindah + 12 && frame < b.SP;
  const flash = arrived ? Math.max(0, 1 - (frame - b.pindah - 10) / 18) : 0;

  // ---- C/D. Split and pledge (SP → RE) ----
  const split = ramp(frame, b.dipecah, b.dipecah + 14, ease.out);
  const vault = ramp(frame, b.CO + 8, b.CO + 18, ease.out);
  const pledge = ramp(frame, b.jaminan - 6, b.jaminan + 10);
  const loan = ramp(frame, b.pinjaman - 4, b.pinjaman + 10, ease.out);
  const GAP = 0.32;
  const mid = (0.5 / 8) * Math.PI * 2;
  // Coin is laid flat (local y = world −z, local z = world y); target is the vault floor.
  const pledgeTarget: V3 = [VAULT[0] - Math.cos(mid) * GAP - 0.2, -VAULT[2] - Math.sin(mid) * GAP + 0.1, 0.15];
  const pledgeOff = mix3([0, 0, 0], pledgeTarget, pledge);
  pledgeOff[2] += Math.sin(pledge * Math.PI) * 0.9;

  let coin: {pos: V3; rot: V3; scale: number; split: number} | null = null;
  if (frame < b.OLD) coin = {pos: coinA, rot: [mix(-Math.PI / 2, 0, stand), Math.sin(frame / 40) * 0.12 * stand, 0], scale: grow, split: 0};
  else if (frame < b.SP) {
    const p = mix3(coinA, laneStart, toLane);
    coin = {pos: frame < b.pindah ? p : coinB, rot: [0, 0, 0], scale: mix(1, 0.3, toLane), split: 0};
  } else coin = {pos: [0, 0.09, 0], rot: [-Math.PI / 2, 0, interpolate(frame, [b.SP, b.RE], [0, 0.35])], scale: 1, split};

  // Portrait frame: horizontal view is ~0.52 × distance at fov 50. Subjects sit at screen y ≈ 1110 (shift −150).
  const keys: CamKey[] = [
    {f: b.WH, pos: [0, 5.0, 3.6], look: [0, 0, 0.1], fov: 50, shift: -150},
    {f: b.buku - 4, pos: [0.35, 4.1, 2.9], look: [0.1, 0, 0.1], fov: 50, shift: -150},
    {f: b.digital + 16, pos: [0, 2.3, 6.4], look: [0, 1.1, 0], fov: 50, shift: -150},
    {f: b.OLD, pos: [0, 2.3, 6.5], look: [0, 1.1, 0], fov: 50, shift: -150},
    {f: b.OLD + 22, pos: [0, 3.0, 7.5], look: [0, 0.3, -4], fov: 50, shift: 44},
    {f: b.pindah + 11, pos: [0.25, 2.9, 7.2], look: [0.1, 0.3, -4], fov: 50, shift: 44},
    {f: b.pindah + 12, pos: [0.3, 3.6, -8.0], look: [0.35, 0.15, -3.4], fov: 50, shift: 90},
    {f: b.SP, pos: [0.2, 3.5, -7.8], look: [0.35, 0.15, -3.4], fov: 50, shift: 90},
    {f: b.SP, pos: [0, 8.4, 1.6], look: [0, 0, 0], fov: 50, shift: -110},
    {f: b.CO - 8, pos: [-0.6, 8.2, 1.9], look: [0, 0, 0], fov: 50, shift: -110},
    {f: b.CO + 16, pos: [0.35, 4.2, 10.2], look: [0.35, 0.5, 0], fov: 50, shift: -130},
    {f: b.RE, pos: [0.45, 4.1, 9.9], look: [0.35, 0.5, 0], fov: 50, shift: -130},
  ];

  return (
    <ThreeCanvas width={width} height={height} style={{position: 'absolute', inset: 0}} gl={{antialias: true}}>
      <Env bg="#000000" near={7} far={20} />
      <KeyedCamera keys={keys} />
      <FogAt near={reverse ? 5.7 : 7} far={reverse ? 7.4 : 20} />
      <ambientLight intensity={0.35} />
      <directionalLight position={[-3, 6, 4]} intensity={2.4} />
      <directionalLight position={[4, 2, -3]} intensity={1.4} color={colors.electric} />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -3]}>
        <planeGeometry args={[48, 48]} />
        <meshBasicMaterial map={a.grid} />
      </mesh>

      {/* A. Paper certificate on the table, scanned away from left to right */}
      {showCert && (
        <mesh rotation={[-Math.PI / 2, 0, -0.06]} position={[0, 0.012, 0]} material={certMat}>
          <planeGeometry args={[2.6, 2.6 / 1.426]} />
        </mesh>
      )}
      {beam > 0 && (
        <group position={[scanX, 0, 0]}>
          <mesh position={[0, 0.18, 0]} rotation={[0, Math.PI / 2, 0]}>
            <planeGeometry args={[2.1, 0.36]} />
            <meshBasicMaterial color={colors.electric} transparent opacity={0.2 * beam} blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.DoubleSide} />
          </mesh>
          <mesh position={[0, 0.02, 0]}>
            <boxGeometry args={[0.03, 0.02, 2.1]} />
            <meshBasicMaterial color={colors.light} transparent opacity={beam} />
          </mesh>
        </group>
      )}

      {/* B. Two lanes: BEI (left) and blockchain (right) */}
      {lanes > 0 && (
        <group>
          {[-LANE_X, LANE_X].map((x) => (
            <mesh key={x} rotation={[-Math.PI / 2, 0, 0]} position={[x, 0.006, (Z0 + Z2) / 2]}>
              <planeGeometry args={[0.9, Z0 - Z2 + 0.8]} />
              <meshBasicMaterial color={x < 0 ? '#0E1A2E' : '#0A1B3A'} transparent opacity={0.92 * lanes} />
            </mesh>
          ))}
          {GATES.map((z) => (reverse && z !== Z2 ? null : <Gate key={z} x={-LANE_X} z={z} color="#4A5D7E" glow={slowZ <= z + 0.05 ? 1 : 0} />))}
          <Gate x={LANE_X} z={Z0} color="#2C5DA8" glow={0} />
          <Gate x={LANE_X} z={Z2} color="#2C5DA8" glow={arrived ? 1 : 0} />
          {GATES.map((z, i) => (
            <Label3D key={z} tex={slowZ <= z + 0.05 ? a.t.daysLit[i] : a.t.days[i]} height={0.13} position={[-LANE_X, 0.86, z]} opacity={reverse ? 0 : lanes} />
          ))}
          <Label3D tex={a.t.bei} height={0.14} position={[-LANE_X - 0.05, 1.08, Z0]} opacity={reverse ? 0 : lanes} />
          <Label3D tex={a.t.chain} height={0.14} position={[LANE_X + 0.15, 1.08, Z0]} opacity={reverse ? 0 : lanes} />
          <Label3D tex={a.t.owner} height={reverse ? 0.13 : 0.2} position={reverse ? [-0.3, 0.4, Z2 - 0.1] : [LANE_X, 0.95, Z2]} opacity={lanes * (arrived ? 1 : 0.35)} />
          {/* Paper share creeping toward day 2 (out of the reverse shot, where it would rise into the headline) */}
          <mesh visible={!reverse} position={[-LANE_X, 0.3, slowZ]} rotation={[-0.25, 0, 0]}>
            <planeGeometry args={[0.7, 0.7 / 1.426]} />
            <meshStandardMaterial map={a.cert} roughness={0.85} transparent opacity={lanes} side={THREE.DoubleSide} />
          </mesh>
          {/* Trail and arrival flash on the blockchain lane */}
          {zip > 0 && (
            <mesh position={[LANE_X, 0.02, (Z0 + coinB[2]) / 2]}>
              <boxGeometry args={[0.05, 0.015, Math.max(0.01, Z0 - coinB[2])]} />
              <meshBasicMaterial color={colors.electric} transparent opacity={arrived ? Math.max(0.35, 1 - (frame - b.pindah - 10) / 30) : 1} />
            </mesh>
          )}
          {flash > 0 && (
            <mesh position={[LANE_X, 0.36, Z2]} scale={1 + (1 - flash) * 1.4}>
              <torusGeometry args={[0.32, 0.025, 12, 64]} />
              <meshBasicMaterial color={colors.light} transparent opacity={flash} />
            </mesh>
          )}
        </group>
      )}

      {/* C/D. Vault (collateral) and the loan it releases */}
      {frame >= b.CO && (
        <group position={VAULT}>
          <lineSegments position={[0, 0.425, 0]} scale={vault}>
            <edgesGeometry args={[new THREE.BoxGeometry(1.1, 0.85, 1.1)]} />
            <lineBasicMaterial color={colors.light} transparent opacity={vault} />
          </lineSegments>
          <mesh position={[0, 0.425, 0]} scale={vault}>
            <boxGeometry args={[1.1, 0.85, 1.1]} />
            <meshBasicMaterial color={colors.blue} transparent opacity={0.08 * vault} depthWrite={false} />
          </mesh>
          <Label3D tex={a.t.vault} height={0.18} position={[0, 0.06, 0.95]} opacity={vault} />
          {loan > 0 && (
            <>
              <Coin face={a.loan} radius={0.36} thickness={0.1} sectors={1} rimColor="#BFF5E2" position={[0, mix(0.4, 1.5, loan), mix(0, 0.5, loan)]} scale={loan} />
              <Label3D tex={a.t.loan} height={0.2} position={[0, mix(0.4, 1.5, loan) + 0.58, mix(0, 0.5, loan)]} opacity={loan} />
            </>
          )}
        </group>
      )}

      {/* The token itself */}
      {coin && coin.scale > 0.001 && (
        <group position={coin.pos} rotation={coin.rot} scale={coin.scale}>
          <Coin face={a.face} split={coin.split} gap={GAP} offsets={frame >= b.CO ? {[PLEDGED]: pledgeOff} : {}} />
        </group>
      )}
      {coin && frame < b.OLD && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.015, 0]} scale={1.3 * grow}>
          <planeGeometry args={[2, 2]} />
          <meshBasicMaterial map={a.blob} transparent opacity={0.6 * stand} depthWrite={false} />
        </mesh>
      )}
    </ThreeCanvas>
  );
};
