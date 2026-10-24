import type {ThreeElements} from '@react-three/fiber';
import {useMemo} from 'react';
import * as THREE from 'three';
import {ridgeNormalMap} from './kit';

const FIELD = 0.84;
const FACE_Y = 0.055;

/** Rounded rim profile (radius, height), revolved around the coin axis (y). */
const rimProfile = [
  [FIELD, FACE_Y], [0.85, 0.075], [0.9, 0.082], [0.955, 0.08], [0.985, 0.068], [1.0, 0.045],
  [1.0, -0.045], [0.985, -0.068], [0.955, -0.08], [0.9, -0.082], [0.85, -0.075], [FIELD, -FACE_Y],
].map(([x, y]) => new THREE.Vector2(x, y));

/** Reverses every triangle (needed after a mirroring scale, or the faces turn inside out). */
const flipWinding = (g: THREE.BufferGeometry) => {
  for (const name of Object.keys(g.attributes)) {
    const a = g.attributes[name] as THREE.BufferAttribute;
    for (let t = 0; t < a.count; t += 3)
      for (let c = 0; c < a.itemSize; c++) {
        const i1 = (t + 1) * a.itemSize + c;
        const i2 = (t + 2) * a.itemSize + c;
        const v = a.array[i1];
        (a.array as Float32Array)[i1] = a.array[i2];
        (a.array as Float32Array)[i2] = v;
      }
    a.needsUpdate = true;
  }
};

/** The ₿ relief from the public-domain Bitcoin logo, centred, `height` tall and `depth` deep, base at z = 0. */
const reliefGeometry = (shapes: THREE.Shape[], height: number, depth: number) => {
  const g = new THREE.ExtrudeGeometry(shapes, {depth: 1, bevelEnabled: true, bevelThickness: 0.35, bevelSize: 0.32, bevelSegments: 3, curveSegments: 24});
  g.computeBoundingBox();
  const b = g.boundingBox!;
  const s = height / (b.max.y - b.min.y);
  g.translate(-(b.max.x + b.min.x) / 2, -(b.max.y + b.min.y) / 2, -b.min.z);
  g.scale(s, -s, depth / (b.max.z - b.min.z)); // SVG y points down: mirror it
  flipWinding(g);
  g.computeVertexNormals();
  return g;
};

export type BitcoinCoinProps = {
  /** ₿ outline shapes (from `svgShapes(bitcoin-symbol.svg, '#FFF')`). */
  symbol: THREE.Shape[];
  /** 0 = gold, 1 = dimmed (lost connection). */
  dim?: number;
} & ThreeElements['group'];

/** Hero coin, faces on ±z (the camera looks at the ₿ from +z). Radius 1. */
export const BitcoinCoin = ({symbol, dim = 0, ...group}: BitcoinCoinProps) => {
  const parts = useMemo(() => {
    const rim = new THREE.LatheGeometry(rimProfile, 160);
    const field = new THREE.CircleGeometry(FIELD + 0.002, 96);
    const relief = reliefGeometry(symbol, 1.12, 0.045);
    const ridges = ridgeNormalMap(220);
    ridges.repeat.set(1, 1);
    return {rim, field, relief, ridges};
  }, [symbol]);
  const mats = useMemo(() => {
    const gold = new THREE.Color('#F2A33A');
    return {
      rim: new THREE.MeshPhysicalMaterial({color: gold, metalness: 1, roughness: 0.2, normalMap: parts.ridges, normalScale: new THREE.Vector2(0.6, 0.6), clearcoat: 0.4, clearcoatRoughness: 0.15}),
      field: new THREE.MeshPhysicalMaterial({color: new THREE.Color('#E8902A'), metalness: 1, roughness: 0.42, clearcoat: 0.2}),
      relief: new THREE.MeshPhysicalMaterial({color: new THREE.Color('#FFC266'), metalness: 1, roughness: 0.3, clearcoat: 0.5, clearcoatRoughness: 0.12}),
    };
  }, [parts]);
  const k = 1 - 0.55 * dim;
  mats.rim.color.set('#F2A33A').multiplyScalar(k);
  mats.field.color.set('#E8902A').multiplyScalar(k);
  mats.relief.color.set('#FFC266').multiplyScalar(k);
  return (
    <group {...group}>
      {/* Lathe/circle geometry is built around y; turn it so the faces look along ±z. */}
      <group rotation={[Math.PI / 2, 0, 0]}>
        <mesh geometry={parts.rim} material={mats.rim} />
        <mesh geometry={parts.field} material={mats.field} position={[0, FACE_Y, 0]} rotation={[-Math.PI / 2, 0, 0]} />
        <mesh geometry={parts.field} material={mats.field} position={[0, -FACE_Y, 0]} rotation={[Math.PI / 2, 0, 0]} />
      </group>
      <mesh geometry={parts.relief} material={mats.relief} position={[0, 0, FACE_Y]} />
      <mesh geometry={parts.relief} material={mats.relief} position={[0, 0, -FACE_Y]} rotation={[0, Math.PI, 0]} />
    </group>
  );
};
