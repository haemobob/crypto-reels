import {useMemo} from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import * as THREE from 'three';
import {RoundedBoxGeometry} from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import {fontsReady, textTexture, useAssets3D, type TextTexture} from '../../three/assets';
import type {CamKey} from '../../three/camera';
import {studioPanels} from '../../three/env';
import {Label3D} from '../../three/Label3D';
import {World3D} from '../../three/World3D';
import {ease} from '../../theme/motion';
import {fonts} from '../../theme/typography';
import patoshi from './patoshi.json';

/**
 * Satoshi's coins as what they are on-chain: not one wallet but 21,953 separate 50-BTC outputs, one per block in
 * Lerner's Patoshi pattern (dataset: bensig/patoshi-addresses). Each small safe is one real block, laid out in block
 * order (row by row from the front-left corner, block 3 first). A single big safe splits into the field.
 */
const N = patoshi.heights.length; // 21,953
export const COLS = 110;
const ROWS = Math.ceil(N / COLS); // 200
const GAP = 1.0;
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const ramp = (f: number, a: number, b: number, e = ease.inOut) => interpolate(f, [a, b], [0, 1], {...clamp, easing: e});

export const tilePos = (i: number): [number, number] => {
  const r = Math.floor(i / COLS);
  const c = i % COLS;
  return [(c - (COLS - 1) / 2) * GAP, ((ROWS - 1) / 2 - r) * GAP];
};

// Deterministic per-tile randoms (no Math.random in renders).
const hash = (i: number, k: number) => {
  const x = Math.sin(i * 12.9898 + k * 78.233) * 43758.5453;
  return x - Math.floor(x);
};

export type VaultTimes = {start: number; split: number; settled: number; sweep: [number, number]; dive: number; back: number; end: number};

const Field = ({t, tex}: {t: VaultTimes; tex: Record<string, TextTexture>}) => {
  const f = useCurrentFrame();
  const mesh = useMemo(() => {
    const geo = new RoundedBoxGeometry(0.8, 0.5, 0.8, 2, 0.08);
    const mat = new THREE.MeshStandardMaterial({color: '#FFFFFF', metalness: 0.75, roughness: 0.32, envMapIntensity: 1.1});
    const m = new THREE.InstancedMesh(geo, mat, N);
    m.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    m.frustumCulled = false;
    return m;
  }, []);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const col = useMemo(() => new THREE.Color(), []);
  const steel = useMemo(() => new THREE.Color('#2B3A57'), []);
  const lit = useMemo(() => new THREE.Color('#2F8CFF'), []);
  const hot = useMemo(() => new THREE.Color('#BFE3FF'), []);

  // The split: tiles leave the big safe's volume and fly to their place, nearest first.
  const sweepAt = (i: number) => interpolate(i / N, [0, 1], t.sweep);
  for (let i = 0; i < N; i++) {
    const [gx, gz] = tilePos(i);
    const d = Math.hypot(gx, gz * 0.6) / 110;
    const a = ramp(f, t.split + d * 70 + hash(i, 1) * 10, t.split + d * 70 + hash(i, 1) * 10 + 26, ease.inOut);
    // Start inside the big safe (the field is drawn at half scale, so these are doubled).
    const sx = (hash(i, 2) - 0.5) * 4.8;
    const sy = 3 + (hash(i, 3) - 0.5) * 4.8;
    const sz = (hash(i, 4) - 0.5) * 4.8;
    const x = sx + (gx - sx) * a;
    const z = sz + (gz - sz) * a;
    const y = sy + (0.25 - sy) * a + Math.sin(Math.PI * a) * (1.5 + d * 3);
    dummy.position.set(x, y, z);
    dummy.rotation.set(0, (1 - a) * (hash(i, 5) - 0.5) * 3, 0);
    dummy.scale.setScalar(a < 0.02 ? 0.0001 : 0.35 + 0.65 * a);
    dummy.updateMatrix();
    mesh.setMatrixAt(i, dummy.matrix);
    // Light sweeps through the field in block order (Jan 2009 → Apr 2010).
    const s = ramp(f, sweepAt(i) - 2, sweepAt(i) + 4, ease.out);
    const flash = s * (1 - ramp(f, sweepAt(i) + 4, sweepAt(i) + 30));
    const glowAll = ramp(f, t.back, t.back + 30) * 0.35;
    col.copy(steel).lerp(lit, Math.min(1, s * 0.75 + glowAll)).lerp(hot, flash * 0.7);
    mesh.setColorAt(i, col);
  }
  mesh.instanceMatrix.needsUpdate = true;
  if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;

  // In-world labels for the close-up: a staggered fan above blocks 3, 4 and 5 (real keys), with leader lines.
  const close = ramp(f, t.dive + 4, t.dive + 16) * (1 - ramp(f, t.back - 6, t.back));
  const ends = ramp(f, t.sweep[0], t.sweep[0] + 12) * (1 - ramp(f, t.dive - 6, t.dive));
  return (
    <>
      <primitive object={mesh} />
      {[0, 1, 2].map((i) => {
        const [x, z] = tilePos(i);
        const hgt = 3.4 - i * 1.05;
        const a = close * ramp(f, t.dive + 6 + i * 8, t.dive + 16 + i * 8);
        return (
          <group key={i}>
            <mesh position={[x, 0.5 + hgt / 2, z]}>
              <boxGeometry args={[0.025, hgt, 0.025]} />
              <meshBasicMaterial color="#75C7FF" transparent opacity={a * 0.9} />
            </mesh>
            <Label3D tex={tex[`b${i}`]} height={0.27} position={[x + 0.27 * tex[`b${i}`].aspect * 0.5 - 0.1, 0.5 + hgt + 0.2, z]} opacity={a} />
          </group>
        );
      })}
      <Label3D tex={tex.first} height={7} position={[-22, 3, 106]} opacity={ends} />
      <Label3D tex={tex.last} height={7} position={[24, 3, -92]} opacity={ends} />
    </>
  );
};

/** The single big safe the field comes out of. */
const safeGeo = new RoundedBoxGeometry(3, 3, 3, 4, 0.18);
const BigSafe = ({o, s}: {o: number; s: number}) => {
  if (o <= 0.01) return null;
  return (
    <group position={[0, 1.5, 0]} scale={s}>
      <mesh>
        <primitive object={safeGeo} attach="geometry" />
        <meshStandardMaterial color="#33476B" metalness={0.85} roughness={0.28} transparent opacity={o} />
      </mesh>
      <mesh position={[0, 0, 1.52]}>
        <boxGeometry args={[2.3, 2.3, 0.08]} />
        <meshStandardMaterial color="#47628F" metalness={0.9} roughness={0.25} transparent opacity={o} />
      </mesh>
      <mesh position={[0, 0, 1.62]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.42, 0.42, 0.14, 48]} />
        <meshStandardMaterial color="#9FC6FF" metalness={1} roughness={0.18} transparent opacity={o} />
      </mesh>
      <mesh position={[0.78, 0, 1.64]}>
        <boxGeometry args={[0.12, 0.7, 0.12]} />
        <meshStandardMaterial color="#D7E3F4" metalness={1} roughness={0.2} transparent opacity={o} />
      </mesh>
    </group>
  );
};

export const Vaults = ({t, keys, fog}: {t: VaultTimes; keys: CamKey[]; fog: [number, number]}) => {
  const f = useCurrentFrame();
  const tex = useAssets3D(async () => {
    await fontsReady();
    const key = (k: string) => `${k.slice(0, 8)}…${k.slice(-6)}`;
    const fk = patoshi.firstKeys as Record<string, string>;
    const mono = (s: string, color = '#FFFFFF', bg = 'rgba(5,11,24,0.9)') => textTexture(s, {family: fonts.mono, weight: 700, px: 64, color, bg, pad: 22, radius: 16});
    return {
      b0: mono(`BLOK 3 · KUNCI ${key(fk['3'])}`),
      b1: mono(`BLOK 4 · KUNCI ${key(fk['4'])}`),
      b2: mono(`BLOK 5 · KUNCI ${key(fk['5'])}`),
      first: mono('BLOK 3 · 9 JAN 2009'),
      last: mono('BLOK 49.973 · 10 APR 2010'),
    } as Record<string, TextTexture>;
  }, 'vault-labels');
  if (f < t.start - 1 || f > t.end + 1) return null;
  if (!tex) return null;
  const bigO = 1 - ramp(f, t.split + 6, t.split + 26);
  const bigS = 1 - 0.5 * ramp(f, t.split, t.split + 26);
  return (
    <World3D keys={keys} bg="#000000" fog={['#000000', fog[0], fog[1]]} panels={studioPanels.dark} envIntensity={1.15}>
      <ambientLight intensity={0.25} />
      <directionalLight position={[-30, 60, 40]} intensity={1.4} />
      <BigSafe o={bigO} s={bigS} />
      {/* Half scale keeps every distance inside the camera's far plane (400). */}
      <group scale={0.5}>
        <Field t={t} tex={tex} />
      </group>
    </World3D>
  );
};
