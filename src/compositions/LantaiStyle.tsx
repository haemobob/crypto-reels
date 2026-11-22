import {ContactShadows, Environment, Lightformer, MeshReflectorMaterial, RoundedBox} from '@react-three/drei';
import {ThreeCanvas} from '@remotion/three';
import {useMemo, type ReactNode} from 'react';
import {AbsoluteFill, getInputProps, useVideoConfig} from 'remotion';
import * as THREE from 'three';
import data from '../episodes/lantai-hammer/data.json';
import {KeyedCamera, type CamKey, type V3} from '../three/camera';
import {Post} from '../three/post';
import {fonts} from '../theme/typography';

/**
 * "lantai-style": style frames (stills) for the lantai-hammer rebuild in a lit 3D studio, to compare with 0x100x before
 * animating. Shots (input prop `shot`): hook · crowd · floor · payoff. Real prices (Binance BTCUSDT 1h, 14 Nov 2026);
 * the traders are fictional.
 */
type K = [number, number, number, number, number];
const D = data as unknown as {ctx: K[]; hammer: K; hammers: Array<{t: number; broke24: boolean}>};
const HAM = D.hammer;
const BLUE = '#2997FF';

// Price → height (world units): 64,700 sits on the ground.
const PY = (p: number) => ((p - 64700) / 2300) * 6;

export const Studio = () => (
  <Environment resolution={256} frames={1}>
    <Lightformer form="rect" intensity={6} color="#ffffff" position={[-3, 7, 5]} scale={[6, 3, 1]} />
    <Lightformer form="rect" intensity={8} color="#ffffff" position={[0, 4, -6]} scale={[12, 0.25, 1]} />
    <Lightformer form="rect" intensity={2.4} color="#d6e6ff" position={[6, 2.5, 4]} scale={[3, 5, 1]} />
    <Lightformer form="rect" intensity={9} color="#1677FF" position={[0, 0.3, -5]} scale={[16, 0.3, 1]} />
    <Lightformer form="rect" intensity={1.4} color="#ffffff" position={[0, 2, 10]} scale={[10, 6, 1]} />
  </Environment>
);

export const porcelain = {color: '#F2F4F7', roughness: 0.42, metalness: 0, clearcoat: 0.6, clearcoatRoughness: 0.35} as const;
export const graphite = {color: '#1B2029', roughness: 0.28, metalness: 0.75, clearcoat: 1, clearcoatRoughness: 0.2} as const;

/** A soft figure (0x100x-style): a bell body, a sphere head with a simple face. */
export const Figure = ({position, scale = 1, color = '#F2F4F7', arms, tilt = 0, face = true}: {position: V3; scale?: number; color?: string; arms?: 'up' | 'out'; tilt?: number; face?: boolean}) => {
  const body = useMemo(() => {
    const pts = [[0, 0], [0.5, 0], [0.56, 0.12], [0.55, 0.42], [0.46, 0.7], [0.28, 0.86], [0, 0.9]].map(([x, y]) => new THREE.Vector2(x, y));
    return new THREE.LatheGeometry(pts, 48);
  }, []);
  const mat = color === '#F2F4F7' ? porcelain : {color, roughness: 0.38, metalness: 0.05, clearcoat: 0.5, clearcoatRoughness: 0.3};
  return (
    <group position={position} scale={scale} rotation={[0, 0, tilt]}>
      <mesh geometry={body} castShadow>
        <meshPhysicalMaterial {...mat} />
      </mesh>
      <mesh position={[0, 1.22, 0]} castShadow>
        <sphereGeometry args={[0.34, 48, 48]} />
        <meshPhysicalMaterial {...mat} />
      </mesh>
      {face && (
        <group position={[0, 1.24, 0.31]}>
          <mesh position={[-0.1, 0.05, 0.02]}>
            <sphereGeometry args={[0.028, 16, 16]} />
            <meshBasicMaterial color="#0A0D12" />
          </mesh>
          <mesh position={[0.1, 0.05, 0.02]}>
            <sphereGeometry args={[0.028, 16, 16]} />
            <meshBasicMaterial color="#0A0D12" />
          </mesh>
          <mesh position={[0, -0.06, 0.02]} rotation={[0, 0, Math.PI]}>
            <torusGeometry args={[0.06, 0.009, 8, 24, Math.PI]} />
            <meshBasicMaterial color="#0A0D12" />
          </mesh>
        </group>
      )}
      {arms &&
        [-1, 1].map((s) => (
          <mesh key={s} position={[s * 0.5, arms === 'up' ? 1.0 : 0.62, 0]} rotation={[0, 0, arms === 'up' ? s * -0.35 : s * -1.25]} castShadow>
            <capsuleGeometry args={[0.09, 0.55, 8, 16]} />
            <meshPhysicalMaterial {...mat} />
          </mesh>
        ))}
    </group>
  );
};

/** A candle as an object: a rounded body and a wick rod, from real OHLC. */
const Candle3D = ({k, x, z = 0, w = 0.9, mat}: {k: K; x: number; z?: number; w?: number; mat: object}) => {
  const [, o, h, l, c] = k;
  const top = PY(Math.max(o, c));
  const bot = PY(Math.min(o, c));
  const bh = Math.max(0.12, top - bot);
  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, (PY(h) + PY(l)) / 2, 0]} castShadow>
        <cylinderGeometry args={[0.07, 0.07, PY(h) - PY(l), 24]} />
        <meshPhysicalMaterial {...mat} />
      </mesh>
      <RoundedBox args={[w, bh, w]} radius={0.08} smoothness={4} position={[0, bot + bh / 2, 0]} castShadow>
        <meshPhysicalMaterial {...mat} />
      </RoundedBox>
    </group>
  );
};

/** The floor: a slab of blue glass with a lit edge. */
export const Slab = ({position, size, glow = 1, rot = 0, color = BLUE}: {position: V3; size: V3; glow?: number; rot?: number; color?: string}) => (
  <RoundedBox args={size} radius={0.04} smoothness={3} position={position} rotation={[0, 0, rot]} castShadow>
    <meshPhysicalMaterial color={color} emissive={color} emissiveIntensity={0.55 * glow} roughness={0.15} transmission={0.3} thickness={0.4} clearcoat={1} />
  </RoundedBox>
);

export const Ground = () => (
  <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
    <planeGeometry args={[80, 80]} />
    <MeshReflectorMaterial resolution={1024} blur={[400, 120]} mixBlur={1} mixStrength={3} roughness={0.75} depthScale={1} minDepthThreshold={0.4} maxDepthThreshold={1.3} color="#05080D" metalness={0.6} mirror={0.55} />
  </mesh>
);

const Scene3D = ({keys, focus, children}: {keys: CamKey[]; focus: V3; children: ReactNode}) => {
  const {width, height} = useVideoConfig();
  return (
    <ThreeCanvas width={width} height={height} gl={{antialias: false, toneMapping: THREE.NoToneMapping, preserveDrawingBuffer: true}} dpr={1} shadows>
      <KeyedCamera keys={keys} />
      <color attach="background" args={['#000000']} />
      <fog attach="fog" args={['#000000', 14, 34]} />
      <Studio />
      <spotLight position={[1, 11, 6]} angle={0.5} penumbra={1} intensity={120} distance={40} decay={2} color="#ffffff" castShadow />
      <ambientLight intensity={0.06} />
      {children}
      <ContactShadows position={[0, 0.003, 0]} opacity={0.75} scale={24} blur={2.4} far={6} resolution={1024} frames={1} />
      <Ground />
      <Post focus={focus} focalLength={0.02} bokehScale={3} bloom={0.5} bloomThreshold={0.7} grain={0.04} />
    </ThreeCanvas>
  );
};

const Type = ({top, children, size = 64}: {top: number; children: ReactNode; size?: number}) => (
  <div style={{position: 'absolute', left: 60, right: 60, top, textAlign: 'center', fontFamily: fonts.heading, fontWeight: 600, fontSize: size, lineHeight: 1.08, letterSpacing: '-0.02em', color: '#FFFFFF'}}>{children}</div>
);
const Blue = ({children}: {children: ReactNode}) => <span style={{color: BLUE}}>{children}</span>;
const Tag = ({x, y, children, color = '#C9D1DB'}: {x: number; y: number; children: ReactNode; color?: string}) => (
  <div style={{position: 'absolute', left: x, top: y, transform: 'translateX(-50%)', fontFamily: fonts.mono, fontWeight: 700, fontSize: 30, letterSpacing: '0.04em', color, whiteSpace: 'nowrap'}}>{children}</div>
);

// ---------------------------------------------------------------------------------------------------------------

const Hook = () => {
  const floorY = PY(HAM[3]);
  const entryY = PY(HAM[4]);
  return (
    <>
      <Scene3D keys={[{f: 0, pos: [0.9, 3.0, 14], look: [0.2, 2.35, 0], fov: 32}]} focus={[0.2, 2.4, 0]}>
        <Candle3D k={D.ctx[7]} x={-2.3} z={-1.5} w={0.75} mat={graphite} />
        <Candle3D k={HAM} x={-1.05} w={0.75} mat={porcelain} />
        <RoundedBox args={[2.9, 0.05, 1.3]} radius={0.02} position={[0.95, entryY - 0.025, 0]}>
          <meshPhysicalMaterial color="#8FA3BF" roughness={0.1} transmission={0.6} thickness={0.2} transparent opacity={0.45} />
        </RoundedBox>
        <Figure position={[0.2, entryY, 0]} scale={0.62} color={BLUE} />
        <Figure position={[1.55, entryY, 0]} scale={0.62} />
        <Slab position={[0.7, floorY - 0.05, 0]} size={[5.6, 0.1, 1.5]} />
      </Scene3D>
      <Type top={300}>
        Hammer sama.
        <br />
        <Blue>Hasil beda.</Blue>
      </Type>
    </>
  );
};

const Crowd = () => {
  const items = D.hammers.map((h, i) => ({broke: h.broke24, nov: i === D.hammers.findIndex((q) => q.t === HAM[0]), i}));
  return (
    <>
      <Scene3D keys={[{f: 0, pos: [-1.5, 2.6, 9.5], look: [1.5, 0.6, -6], fov: 36}]} focus={[0.5, 0.6, -4]}>
        {items.map(({broke, nov, i}) => {
          // a timeline receding into depth, two rows
          const t = i / 27;
          const x = -3.6 + t * 7.5 + (i % 2) * 0.55;
          const z = 2.2 - t * 16 - (i % 2) * 1.1;
          const col = nov ? BLUE : broke ? '#3A4352' : '#F2F4F7';
          return (
            <group key={i} position={[x, 0, z]}>
              {broke ? (
                <>
                  <Slab position={[-0.33, 0.12, 0]} size={[0.6, 0.08, 0.7]} rot={-0.35} glow={0.3} />
                  <Slab position={[0.33, 0.12, 0]} size={[0.6, 0.08, 0.7]} rot={0.35} glow={0.3} />
                  <Figure position={[0.1, 0.02, 0.15]} scale={0.42} color={col} tilt={1.3} face={false} />
                </>
              ) : (
                <>
                  <Slab position={[0, 0.3, 0]} size={[1.3, 0.08, 0.7]} />
                  <Figure position={[0, 0.34, 0]} scale={0.42} color={col} />
                </>
              )}
            </group>
          );
        })}
      </Scene3D>
      <Type top={300}>
        <Blue>Tiga belas</Blue> ujung ekornya
        <br />
        tembus dalam sehari.
      </Type>
      <div style={{position: 'absolute', left: 70, top: 1330, fontFamily: fonts.mono, fontWeight: 800, fontSize: 190, color: '#FF5263', lineHeight: 1}}>
        13<span style={{color: '#C9D1DB', fontSize: 100}}> / 28</span>
      </div>
      <div style={{position: 'absolute', left: 76, top: 1530, fontFamily: fonts.mono, fontWeight: 600, fontSize: 24, color: '#7F8EA3', letterSpacing: '0.04em'}}>28 HAMMER BTC · 6 BULAN · SAMPEL KECIL</div>
    </>
  );
};

const Floor = () => {
  const s = 1.55;
  const tip = PY(HAM[3]) * s;
  return (
    <>
      <Scene3D keys={[{f: 0, pos: [0.8, 3.6, 15.5], look: [0, 3.2, 0], fov: 34}]} focus={[0, 2.4, 0]}>
        <group scale={s} position={[0, 0, 0]}>
          <group position={[0, -PY(HAM[3]) + 1.1 / s, 0]}>
            <Candle3D k={HAM} x={0} w={1.5} mat={porcelain} />
          </group>
        </group>
        <Slab position={[0, 1.1 - 0.06, 0]} size={[11, 0.16, 2.4]} />
        {[-1.6, 0, 1.6].map((x) => (
          <Figure key={x} position={[x, 0, 1.3]} scale={0.55} color={BLUE} arms="up" />
        ))}
      </Scene3D>
      <Type top={300}>
        Ujungnya jadi <Blue>lantai.</Blue>
      </Type>
      <Tag x={820} y={1240} color={BLUE}>LANTAI</Tag>
      {tip > 0 && null}
    </>
  );
};

const Payoff = () => {
  const y = 1.0;
  return (
    <>
      <Scene3D keys={[{f: 0, pos: [0.2, 3.0, 13.5], look: [0, 2.2, 0], fov: 32}]} focus={[0, 2.0, 0]}>
        <group position={[0, -PY(HAM[3]) + y, 0]}>
          <Candle3D k={HAM} x={0} w={0.7} mat={porcelain} />
        </group>
        <Slab position={[1.25, y - 0.05, 0]} size={[2.4, 0.1, 1.5]} />
        <mesh position={[-1.25, y - 0.05, 0]}>
          <boxGeometry args={[2.4, 0.1, 1.5]} />
          <meshBasicMaterial color="#3A4556" wireframe />
        </mesh>
        <Figure position={[-1.3, y, 0]} scale={0.7} arms="out" />
        <Figure position={[1.3, y, 0]} scale={0.7} color={BLUE} />
      </Scene3D>
      <Type top={300}>
        Beli tanpa lantai, itu berharap.
        <br />
        Pakai lantai, itu <Blue>rencana.</Blue>
      </Type>
    </>
  );
};

export const LantaiStyle = () => {
  const {shot = 'hook'} = getInputProps() as {shot?: string};
  return <AbsoluteFill style={{backgroundColor: '#000'}}>{shot === 'crowd' ? <Crowd /> : shot === 'floor' ? <Floor /> : shot === 'payoff' ? <Payoff /> : <Hook />}</AbsoluteFill>;
};
