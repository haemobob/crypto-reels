/**
 * "Kota emas": a low-poly isometric diorama in one blue, with gold as the only accent (format adapted from a reference
 * reel; models, layout and type are our own). Everything is frame-driven and deterministic.
 * Units: 1 = about a truck's width. The camera is a long-lens perspective (fov ≈ 12°) at the isometric angle.
 */
import {useMemo, type ReactNode} from 'react';
import * as THREE from 'three';
import type {TextTexture} from '../../three/assets';

export const C = {
  ground: '#164FD2',
  groundDark: '#0F3FAE',
  road: '#0C2F86',
  roadLine: '#E8F0FF',
  tree: '#2E6FF4',
  trunk: '#0F3FAE',
  building: '#2A6CF2',
  buildingDark: '#1A55D6',
  window: '#8FB8FF',
  gold: '#F4B41A',
  goldDark: '#C98A06',
  white: '#F4F7FF',
  cage: '#BFD3FF',
  wrap: '#3D78F0',
};

export type V3 = [number, number, number];

/** Deterministic 0–1 noise from an integer. */
export const rnd = (i: number) => {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

const mat = (color: string, opts: Partial<THREE.MeshStandardMaterialParameters> = {}) => new THREE.MeshStandardMaterial({color, roughness: 0.85, metalness: 0, flatShading: true, ...opts});

/** The ground: one big plane. */
export const Ground = () => (
  <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
    <planeGeometry args={[400, 400]} />
    <meshStandardMaterial color={C.ground} roughness={1} />
  </mesh>
);

/** A road along x (or z with `alongZ`), centred at `at`, with dashed white lines. */
export const Road = ({at = [0, 0, 0], length = 120, width = 2.6, alongZ = false}: {at?: V3; length?: number; width?: number; alongZ?: boolean}) => {
  const dashes = Math.floor(length / 1.6);
  const dashGeo = useMemo(() => new THREE.BoxGeometry(0.75, 0.014, 0.13), []);
  const dashMat = useMemo(() => mat(C.roadLine, {roughness: 0.6}), []);
  return (
    <group position={at} rotation={[0, alongZ ? Math.PI / 2 : 0, 0]}>
      <mesh position={[0, 0.02, 0]} receiveShadow>
        <boxGeometry args={[length, 0.04, width]} />
        <meshStandardMaterial color={C.road} roughness={0.95} />
      </mesh>
      <mesh position={[0, 0.03, width / 2 + 0.12]} receiveShadow>
        <boxGeometry args={[length, 0.06, 0.24]} />
        <meshStandardMaterial color={C.groundDark} roughness={1} />
      </mesh>
      <mesh position={[0, 0.03, -width / 2 - 0.12]} receiveShadow>
        <boxGeometry args={[length, 0.06, 0.24]} />
        <meshStandardMaterial color={C.groundDark} roughness={1} />
      </mesh>
      {Array.from({length: dashes}, (_, i) => (
        <mesh key={i} geometry={dashGeo} material={dashMat} position={[-length / 2 + i * 1.6 + 0.8, 0.045, 0]} />
      ))}
    </group>
  );
};

/** Scattered low-poly trees (instanced), kept out of `clear` rectangles [x0, z0, x1, z1]. */
export const Trees = ({count = 260, area = [-40, -40, 40, 40], clear = [], seed = 1}: {count?: number; area?: [number, number, number, number]; clear?: Array<[number, number, number, number]>; seed?: number}) => {
  const {crowns, trunks} = useMemo(() => {
    const crownM: THREE.Matrix4[] = [];
    const trunkM: THREE.Matrix4[] = [];
    let k = 0;
    for (let i = 0; crownM.length < count && i < count * 8; i++) {
      const x = area[0] + rnd(seed * 1000 + i * 2) * (area[2] - area[0]);
      const z = area[1] + rnd(seed * 1000 + i * 2 + 1) * (area[3] - area[1]);
      if (clear.some(([x0, z0, x1, z1]) => x > x0 && x < x1 && z > z0 && z < z1)) continue;
      const s = 0.55 + rnd(seed * 7 + i) * 0.45;
      const m = new THREE.Matrix4().compose(new THREE.Vector3(x, 0.55 * s + 0.35, z), new THREE.Quaternion().setFromEuler(new THREE.Euler(0, rnd(i + 3) * 6, 0)), new THREE.Vector3(s, s, s));
      crownM.push(m);
      trunkM.push(new THREE.Matrix4().compose(new THREE.Vector3(x, 0.2, z), new THREE.Quaternion(), new THREE.Vector3(1, 1, 1)));
      k++;
    }
    return {crowns: crownM, trunks: trunkM};
  }, [count, area, clear, seed]);
  const crownGeo = useMemo(() => new THREE.IcosahedronGeometry(0.62, 0), []);
  const trunkGeo = useMemo(() => new THREE.CylinderGeometry(0.06, 0.08, 0.4, 5), []);
  const crownMat = useMemo(() => mat(C.tree), []);
  const trunkMat = useMemo(() => mat(C.trunk), []);
  return (
    <>
      <instancedMesh args={[crownGeo, crownMat, crowns.length]} castShadow receiveShadow ref={(m) => m && crowns.forEach((mm, i) => m.setMatrixAt(i, mm))} />
      <instancedMesh args={[trunkGeo, trunkMat, trunks.length]} ref={(m) => m && trunks.forEach((mm, i) => m.setMatrixAt(i, mm))} />
    </>
  );
};

/** A gold bar (trapezoid-ish box). */
const barGeo = new THREE.BoxGeometry(0.27, 0.1, 0.13);
export const goldMat = new THREE.MeshStandardMaterial({color: C.gold, roughness: 0.32, metalness: 0.45, emissive: C.goldDark, emissiveIntensity: 0.25, flatShading: true});

/**
 * A crate of gold bars: `n` bars in rows × cols × layers inside a thin cage. `fill` 0–1 shows how many bars are in
 * (stacking animation), `wrapped` covers it in blue wrap (the unreported crates).
 */
export const Crate = ({position, rows = 6, cols = 4, layers = 6, fill = 1, wrapped = false, wrap, rot = 0}: {position: V3; rows?: number; cols?: number; layers?: number; fill?: number; wrapped?: boolean; /** 0–1: the wrap comes down over the bars (animated). */ wrap?: number; rot?: number}) => {
  const wr = wrap ?? (wrapped ? 1 : 0);
  const w = cols * 0.3 + 0.1;
  const d = rows * 0.15 + 0.1;
  const h = layers * 0.11 + 0.08;
  const total = rows * cols * layers;
  const shown = Math.round(total * Math.max(0, Math.min(1, fill)));
  const matrices = useMemo(() => {
    const out: THREE.Matrix4[] = [];
    for (let l = 0; l < layers; l++)
      for (let r = 0; r < rows; r++)
        for (let c = 0; c < cols; c++) out.push(new THREE.Matrix4().makeTranslation(-w / 2 + 0.2 + c * 0.3, 0.1 + l * 0.11, -d / 2 + 0.125 + r * 0.15));
    return out;
  }, [rows, cols, layers, w, d]);
  const edges = useMemo(() => new THREE.EdgesGeometry(new THREE.BoxGeometry(w, h, d)), [w, h, d]);
  return (
    <group position={position} rotation={[0, rot, 0]}>
      <mesh position={[0, 0.03, 0]} castShadow receiveShadow>
        <boxGeometry args={[w + 0.06, 0.06, d + 0.06]} />
        <meshStandardMaterial color={C.cage} roughness={0.8} />
      </mesh>
      {wr > 0.001 && (
        <group position={[0, 0.03 + h - (h * wr) / 2, 0]} scale={[1.01, Math.max(0.001, wr), 1.01]}>
          <mesh castShadow receiveShadow geometry={wrapGeo(w, h, d)}>
            <meshStandardMaterial color={C.wrap} roughness={0.45} metalness={0.15} flatShading />
          </mesh>
          {[-0.3, 0.3].map((k) => (
            <mesh key={k} position={[k * w, 0, 0]}>
              <boxGeometry args={[0.05, h + 0.02, d + 0.02]} />
              <meshStandardMaterial color="#0A2468" roughness={0.7} />
            </mesh>
          ))}
          <mesh>
            <boxGeometry args={[w + 0.02, 0.05, d + 0.02]} />
            <meshStandardMaterial color="#0A2468" roughness={0.7} />
          </mesh>
        </group>
      )}
      {wr < 0.999 && shown > 0 && <instancedMesh key={shown} args={[barGeo, goldMat, shown]} castShadow ref={(m) => m && matrices.slice(0, shown).forEach((mm, i) => m.setMatrixAt(i, mm))} />}
      <lineSegments geometry={edges} position={[0, h / 2 + 0.03, 0]}>
        <lineBasicMaterial color={C.cage} />
      </lineSegments>
    </group>
  );
};

/** A box with its vertices jittered a little: shrink wrap. */
const wrapCache = new Map<string, THREE.BufferGeometry>();
const wrapGeo = (w: number, h: number, d: number) => {
  const key = `${w}|${h}|${d}`;
  if (!wrapCache.has(key)) {
    const g = new THREE.BoxGeometry(w, h, d, 9, 7, 6).toNonIndexed();
    const p = g.attributes.position;
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i);
      const y = p.getY(i);
      const z = p.getZ(i);
      const n = (rnd(Math.round(x * 97 + y * 131 + z * 173)) - 0.5) * 0.09;
      p.setXYZ(i, x * (1 + n), y * (1 + n * 0.6), z * (1 + n));
    }
    g.computeVertexNormals();
    wrapCache.set(key, g);
  }
  return wrapCache.get(key)!;
};

/** A small truck driving along x; `cargo` puts gold on the bed. */
export const Truck = ({position, rot = 0, cargo = true}: {position: V3; rot?: number; cargo?: boolean}) => (
  <group position={position} rotation={[0, rot, 0]}>
    <mesh position={[0.62, 0.42, 0]} castShadow>
      <boxGeometry args={[0.5, 0.5, 0.62]} />
      <meshStandardMaterial color={C.building} roughness={0.7} flatShading />
    </mesh>
    <mesh position={[0.8, 0.5, 0]}>
      <boxGeometry args={[0.16, 0.22, 0.56]} />
      <meshStandardMaterial color={C.window} roughness={0.3} />
    </mesh>
    <mesh position={[-0.2, 0.28, 0]} castShadow>
      <boxGeometry args={[1.1, 0.16, 0.66]} />
      <meshStandardMaterial color={C.buildingDark} roughness={0.8} flatShading />
    </mesh>
    {cargo &&
      [0, 1, 2].map((r) =>
        [0, 1].map((c) => <mesh key={`${r}${c}`} geometry={barGeo} material={goldMat} position={[-0.52 + r * 0.32, 0.42, -0.1 + c * 0.2]} castShadow />),
      )}
    {[-0.45, 0.05, 0.62].map((x) =>
      [-0.32, 0.32].map((z) => (
        <mesh key={`${x}${z}`} position={[x, 0.14, z]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.13, 0.13, 0.08, 8]} />
          <meshStandardMaterial color="#0A2468" roughness={0.9} />
        </mesh>
      )),
    )}
  </group>
);

/** A bank vault building with a round door; `open` 0–1 swings the door. */
export const Vault = ({position, size = [4.2, 2.6, 3.2], open = 0, rot = 0, children}: {position: V3; size?: V3; open?: number; rot?: number; children?: ReactNode}) => {
  const [w, h, d] = size;
  const r = 0.9;
  return (
    <group position={position} rotation={[0, rot, 0]}>
      <mesh position={[0, h / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[w, h, d]} />
        <meshStandardMaterial color={C.building} roughness={0.85} flatShading />
      </mesh>
      <mesh position={[0, h + 0.08, 0]} castShadow>
        <boxGeometry args={[w + 0.3, 0.16, d + 0.3]} />
        <meshStandardMaterial color={C.buildingDark} roughness={0.85} />
      </mesh>
      {/* pilasters */}
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * (w / 2 - 0.25), h / 2, d / 2 + 0.06]} castShadow>
          <boxGeometry args={[0.35, h, 0.12]} />
          <meshStandardMaterial color={C.buildingDark} roughness={0.85} />
        </mesh>
      ))}
      {/* the opening, dark, with gold inside */}
      <mesh position={[0, r + 0.15, d / 2 + 0.005]}>
        <circleGeometry args={[r * 0.92, 28]} />
        <meshStandardMaterial color="#071A52" roughness={1} />
      </mesh>
      {open > 0.05 && (
        <group position={[0, r + 0.15, d / 2 - 0.3]}>
          {Array.from({length: 9}, (_, i) => (
            <mesh key={i} geometry={barGeo} material={goldMat} position={[-0.32 + (i % 3) * 0.32, -0.45 + Math.floor(i / 3) * 0.12, 0]} />
          ))}
        </group>
      )}
      {/* the door, hinged on the right edge */}
      <group position={[r, r + 0.15, d / 2 + 0.08]} rotation={[0, open * 1.6, 0]}>
        <group position={[-r, 0, 0]}>
          <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[r, r, 0.18, 28]} />
            <meshStandardMaterial color={C.buildingDark} roughness={0.6} metalness={0.2} flatShading />
          </mesh>
          {Array.from({length: 14}, (_, i) => {
            const a = (i / 14) * Math.PI * 2;
            return (
              <mesh key={i} position={[Math.cos(a) * r * 0.82, Math.sin(a) * r * 0.82, 0.11]}>
                <sphereGeometry args={[0.055, 6, 4]} />
                <meshStandardMaterial color={C.window} roughness={0.4} />
              </mesh>
            );
          })}
          <mesh position={[0, 0, 0.14]}>
            <torusGeometry args={[0.28, 0.035, 6, 16]} />
            <meshStandardMaterial color={C.window} roughness={0.4} />
          </mesh>
          {[0, 1, 2].map((i) => (
            <mesh key={i} position={[0, 0, 0.14]} rotation={[0, 0, (i * Math.PI) / 3 + open * 3]}>
              <boxGeometry args={[0.56, 0.04, 0.04]} />
              <meshStandardMaterial color={C.window} roughness={0.4} />
            </mesh>
          ))}
        </group>
      </group>
      {/* ramp */}
      <mesh position={[0, 0.08, d / 2 + 0.9]} rotation={[-0.08, 0, 0]} receiveShadow castShadow>
        <boxGeometry args={[1.5, 0.12, 1.6]} />
        <meshStandardMaterial color={C.buildingDark} roughness={0.9} />
      </mesh>
      {children}
    </group>
  );
};

/** A tower with a lit window grid (canvas texture). */
export const Tower = ({position, size = [3, 7, 3], windows, rot = 0}: {position: V3; size?: V3; windows: THREE.Texture; rot?: number}) => {
  const [w, h, d] = size;
  return (
    <group position={position} rotation={[0, rot, 0]}>
      <mesh position={[0, h / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[w, h, d]} />
        <meshStandardMaterial color={C.building} map={windows} roughness={0.8} />
      </mesh>
      <mesh position={[0, h + 0.1, 0]} castShadow>
        <boxGeometry args={[w * 0.7, 0.2, d * 0.7]} />
        <meshStandardMaterial color={C.buildingDark} roughness={0.8} />
      </mesh>
    </group>
  );
};

/** A flag on a pole; `tex` is the flag drawn on a canvas. */
export const Flag = ({position, tex, raise = 1}: {position: V3; tex: THREE.Texture; raise?: number}) => (
  <group position={position}>
    <mesh position={[0, 0.9, 0]} castShadow>
      <cylinderGeometry args={[0.025, 0.025, 1.8, 6]} />
      <meshStandardMaterial color={C.white} roughness={0.5} />
    </mesh>
    <mesh position={[0.32, 0.55 + 1.1 * raise, 0]} castShadow>
      <planeGeometry args={[0.6, 0.4]} />
      <meshStandardMaterial map={tex} side={THREE.DoubleSide} roughness={0.8} />
    </mesh>
  </group>
);

/** Flat ground text, rotated `yaw` around the vertical axis. */
export const GroundText = ({tex, height, position, yaw = 0, opacity = 1}: {tex: TextTexture; height: number; position: V3; yaw?: number; opacity?: number}) =>
  opacity <= 0.01 ? null : (
    <mesh position={position} rotation={[-Math.PI / 2, 0, yaw]} renderOrder={5}>
      <planeGeometry args={[height * tex.aspect, height]} />
      <meshBasicMaterial map={tex.texture} transparent opacity={opacity} depthWrite={false} toneMapped={false} />
    </mesh>
  );

/** A triangular prism (pediment) of width w, height h, depth d. */
const pedimentGeo = (w: number, h: number, d: number) => {
  const s = new THREE.Shape();
  s.moveTo(-w / 2, 0);
  s.lineTo(w / 2, 0);
  s.lineTo(0, h);
  s.closePath();
  const g = new THREE.ExtrudeGeometry(s, {depth: d, bevelEnabled: false});
  g.translate(0, 0, -d / 2);
  return g;
};

/** A classical building (treasury / central bank): steps, columns, pediment; `sign` is a text texture on the frieze. */
export const Bank = ({position, w = 4.4, d = 3, h = 2.4, rot = 0, sign}: {position: V3; w?: number; d?: number; h?: number; rot?: number; sign?: TextTexture}) => {
  const cols = 6;
  const ped = useMemo(() => pedimentGeo(w + 0.2, 0.9, d + 0.2), [w, d]);
  return (
    <group position={position} rotation={[0, rot, 0]}>
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[0, 0.08 + i * 0.16, 0.25 - i * 0.12]} castShadow receiveShadow>
          <boxGeometry args={[w + 0.8 - i * 0.25, 0.16, d + 0.9 - i * 0.25]} />
          <meshStandardMaterial color={C.buildingDark} roughness={0.85} />
        </mesh>
      ))}
      <mesh position={[0, 0.48 + h / 2, -0.25]} castShadow receiveShadow>
        <boxGeometry args={[w - 0.6, h, d - 0.9]} />
        <meshStandardMaterial color={C.buildingDark} roughness={0.85} />
      </mesh>
      {Array.from({length: cols}, (_, i) => (
        <mesh key={i} position={[-w / 2 + 0.3 + (i * (w - 0.6)) / (cols - 1), 0.48 + h / 2, d / 2 - 0.25]} castShadow>
          <cylinderGeometry args={[0.14, 0.16, h, 10]} />
          <meshStandardMaterial color={C.building} roughness={0.7} />
        </mesh>
      ))}
      <mesh position={[0, 0.48 + h + 0.18, 0]} castShadow>
        <boxGeometry args={[w + 0.2, 0.36, d + 0.2]} />
        <meshStandardMaterial color={C.building} roughness={0.8} />
      </mesh>
      <mesh geometry={ped} position={[0, 0.48 + h + 0.36, 0]} castShadow>
        <meshStandardMaterial color={C.building} roughness={0.8} flatShading />
      </mesh>
      {sign && (
        <mesh position={[0, 0.48 + h + 0.18, d / 2 + 0.11]}>
          <planeGeometry args={[0.26 * sign.aspect, 0.26]} />
          <meshBasicMaterial map={sign.texture} transparent toneMapped={false} />
        </mesh>
      )}
    </group>
  );
};

/** A heap of gold bars (instanced, deterministic) with `fill` 0–1 of them shown. */
export const GoldPile = ({position, count = 260, radius = 1.6, fill = 1, seed = 1}: {position: V3; count?: number; radius?: number; fill?: number; seed?: number}) => {
  const matrices = useMemo(() => {
    const out: THREE.Matrix4[] = [];
    for (let i = 0; i < count; i++) {
      const a = rnd(seed * 31 + i) * Math.PI * 2;
      const r = Math.sqrt(rnd(seed * 17 + i * 3)) * radius;
      const y = Math.max(0.05, (1 - r / radius) * radius * 0.55 * (0.7 + rnd(i * 7) * 0.5));
      out.push(new THREE.Matrix4().compose(new THREE.Vector3(Math.cos(a) * r, y, Math.sin(a) * r), new THREE.Quaternion().setFromEuler(new THREE.Euler(rnd(i) * 0.8, rnd(i + 1) * 6, rnd(i + 2) * 0.8)), new THREE.Vector3(1, 1, 1)));
    }
    return out;
  }, [count, radius, seed]);
  const shown = Math.round(count * Math.max(0, Math.min(1, fill)));
  return shown <= 0 ? null : (
    <group position={position}>
      <instancedMesh key={shown} args={[barGeo, goldMat, shown]} castShadow ref={(m) => m && matrices.slice(0, shown).forEach((mm, i) => m.setMatrixAt(i, mm))} />
    </group>
  );
};

/** A low sports car (fast money). */
export const SportsCar = ({position, rot = 0}: {position: V3; rot?: number}) => (
  <group position={position} rotation={[0, rot, 0]}>
    <mesh position={[0, 0.22, 0]} castShadow>
      <boxGeometry args={[1.5, 0.2, 0.68]} />
      <meshStandardMaterial color={C.white} roughness={0.35} metalness={0.2} flatShading />
    </mesh>
    <mesh position={[-0.12, 0.39, 0]} castShadow>
      <boxGeometry args={[0.66, 0.16, 0.56]} />
      <meshStandardMaterial color="#9DB9F0" roughness={0.2} />
    </mesh>
    {[-0.48, 0.48].map((x) =>
      [-0.33, 0.33].map((z) => (
        <mesh key={`${x}${z}`} position={[x, 0.13, z]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.13, 0.13, 0.08, 10]} />
          <meshStandardMaterial color="#0A2468" roughness={0.9} />
        </mesh>
      )),
    )}
  </group>
);

/** A sign on a post, facing +z (rotate with `rot`). */
export const SignPost = ({position, tex, h = 0.5, rot = 0, lift = 1}: {position: V3; tex: TextTexture; h?: number; rot?: number; lift?: number}) =>
  lift < 0.04 ? null : (
  <group position={position} rotation={[0, rot, 0]}>
    <mesh position={[0, 0.6 * lift, 0]} castShadow>
      <cylinderGeometry args={[0.03, 0.03, 1.2 * lift, 6]} />
      <meshStandardMaterial color={C.white} roughness={0.5} />
    </mesh>
    <mesh position={[0, 1.2 * lift + h / 2, 0.02]} castShadow>
      <planeGeometry args={[h * tex.aspect, h]} />
      <meshBasicMaterial map={tex.texture} toneMapped={false} side={THREE.DoubleSide} />
    </mesh>
  </group>
);

/** A billboard on two legs showing a canvas texture. */
export const Billboard = ({position, tex, w = 6.2, h = 3.6, rot = 0}: {position: V3; tex: THREE.Texture; w?: number; h?: number; rot?: number}) => (
  <group position={position} rotation={[0, rot, 0]}>
    {[-w * 0.42, w * 0.42].map((x) => (
      <mesh key={x} position={[x, 1.6, 0]} castShadow>
        <boxGeometry args={[0.25, 3.2, 0.25]} />
        <meshStandardMaterial color={C.buildingDark} roughness={0.8} />
      </mesh>
    ))}
    <mesh position={[0, 3.2 + h / 2 - 0.2, 0.02]} castShadow>
      <boxGeometry args={[w + 0.4, h + 0.3, 0.3]} />
      <meshStandardMaterial color={C.buildingDark} roughness={0.8} />
    </mesh>
    <mesh position={[0, 3.2 + h / 2 - 0.2, 0.18]}>
      <planeGeometry args={[w, h]} />
      <meshBasicMaterial map={tex} toneMapped={false} />
    </mesh>
  </group>
);

/** A small person (white capsule body, round head). */
export const Person = ({position, color = C.white}: {position: V3; color?: string}) => (
  <group position={position}>
    <mesh position={[0, 0.28, 0]} castShadow>
      <capsuleGeometry args={[0.1, 0.26, 4, 8]} />
      <meshStandardMaterial color={color} roughness={0.6} />
    </mesh>
    <mesh position={[0, 0.58, 0]} castShadow>
      <sphereGeometry args={[0.09, 10, 8]} />
      <meshStandardMaterial color={color} roughness={0.6} />
    </mesh>
  </group>
);
