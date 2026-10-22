import type {ThreeElements} from '@react-three/fiber';
import {useMemo} from 'react';
import * as THREE from 'three';

/** A pie-slice of a coin, extruded, with the face texture mapped as if the coin were whole (back face un-mirrored). */
const sectorGeometry = (r: number, depth: number, a0: number, a1: number) => {
  const s = new THREE.Shape();
  s.moveTo(0, 0);
  s.absarc(0, 0, r, a0, a1, false);
  s.lineTo(0, 0);
  const g = new THREE.ExtrudeGeometry(s, {depth, bevelEnabled: false, curveSegments: 64});
  const pos = g.attributes.position;
  const nrm = g.attributes.normal;
  const uv = g.attributes.uv;
  for (let i = 0; i < pos.count; i++) {
    const nz = nrm.getZ(i);
    if (Math.abs(nz) < 0.99) continue;
    const u = pos.getX(i) / (2 * r) + 0.5;
    const v = pos.getY(i) / (2 * r) + 0.5;
    uv.setXY(i, nz < 0 ? 1 - u : u, v);
  }
  uv.needsUpdate = true;
  g.translate(0, 0, -depth / 2);
  return g;
};

export type CoinProps = {
  face?: THREE.Texture;
  faceColor?: string;
  rimColor?: string;
  radius?: number;
  thickness?: number;
  sectors?: number;
  /** 0 = whole coin, 1 = slices pushed apart by `gap` along their middle angle. */
  split?: number;
  gap?: number;
  /** Per-slice extra offset (coin-local x, y, z), e.g. one slice pledged elsewhere. */
  offsets?: Record<number, [number, number, number]>;
  hidden?: number[];
  opacity?: number;
} & ThreeElements['group'];

/** Coin with faces on ±z. Rotate x by −π/2 to lay it flat, face up. */
export const Coin = ({face, faceColor = '#FFFFFF', rimColor = '#AFC2DA', radius = 1, thickness = 0.16, sectors = 8, split = 0, gap = 0.4, offsets = {}, hidden = [], opacity = 1, ...group}: CoinProps) => {
  const geos = useMemo(
    () => Array.from({length: sectors}, (_, i) => sectorGeometry(radius, thickness, (i / sectors) * Math.PI * 2, ((i + 1) / sectors) * Math.PI * 2)),
    [radius, thickness, sectors],
  );
  const mats = useMemo(() => {
    const transparent = opacity < 1;
    return [
      new THREE.MeshStandardMaterial({map: face, color: face ? '#FFFFFF' : faceColor, metalness: 0.35, roughness: 0.32, transparent, opacity}),
      new THREE.MeshStandardMaterial({color: rimColor, metalness: 1, roughness: 0.22, transparent, opacity}),
    ];
  }, [face, faceColor, rimColor, opacity]);
  return (
    <group {...group}>
      {geos.map((g, i) => {
        if (hidden.includes(i)) return null;
        const mid = ((i + 0.5) / sectors) * Math.PI * 2;
        const o = offsets[i] ?? [0, 0, 0];
        return <mesh key={i} geometry={g} material={mats} position={[Math.cos(mid) * gap * split + o[0], Math.sin(mid) * gap * split + o[1], o[2]]} />;
      })}
    </group>
  );
};

/** Coin face: a disc in `bg` with an image centred at `width` of the diameter (used unaltered), and a thin mint ring. */
export const coinFace = (img: HTMLImageElement | null, {bg = '#000000', ring = '#34405A', width = 0.7, text, textColor = '#FFFFFF', family = 'Inter Tight'}: {bg?: string; ring?: string; width?: number; text?: string; textColor?: string; family?: string} = {}) => {
  const size = 1024;
  const c = document.createElement('canvas');
  c.width = size;
  c.height = size;
  const ctx = c.getContext('2d')!;
  ctx.fillStyle = bg;
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = ring;
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size / 2 - 34, 0, Math.PI * 2);
  ctx.stroke();
  if (img) {
    const w = size * width;
    const h = (w * img.height) / img.width;
    ctx.drawImage(img, (size - w) / 2, (size - h) / 2, w, h);
  }
  if (text) {
    ctx.fillStyle = textColor;
    ctx.font = `800 300px "${family}"`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, size / 2, size / 2 + 14);
  }
  return c;
};
