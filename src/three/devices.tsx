import type {ThreeElements} from '@react-three/fiber';
import {useMemo} from 'react';
import * as THREE from 'three';
import {RoundedBoxGeometry} from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import {toTexture} from './assets';

type Group = ThreeElements['group'];

/** Screen material: self-lit, untouched by tone mapping, so UI colours stay true. */
const screenMat = (map: THREE.Texture) => new THREE.MeshBasicMaterial({map, toneMapped: false});

const keyLabels = (labels: string[], cols: number, cell = 128, color = '#e8edf5', bg = '#2a313d', font = '"Inter"') => {
  const rows = Math.ceil(labels.length / cols);
  const c = document.createElement('canvas');
  c.width = cols * cell;
  c.height = rows * cell;
  const ctx = c.getContext('2d')!;
  labels.forEach((l, i) => {
    const x = (i % cols) * cell, y = Math.floor(i / cols) * cell;
    ctx.fillStyle = bg;
    ctx.fillRect(x, y, cell, cell);
    ctx.fillStyle = color;
    ctx.font = `700 ${cell * 0.46}px ${font}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(l, x + cell / 2, y + cell / 2 + 3);
  });
  return {texture: toTexture(c), cols, rows};
};

/** Keys with their labels: one mesh per key, UVs pointing at the key's cell in a label atlas. */
const Keypad = ({labels, cols, size, gap, colorsBy, ...group}: {labels: string[]; cols: number; size: [number, number]; gap: number; colorsBy?: (i: number) => string | null} & Group) => {
  const atlas = useMemo(() => keyLabels(labels, cols), [labels, cols]);
  const geo = useMemo(() => new RoundedBoxGeometry(size[0], 0.03, size[1], 2, 0.012), [size]);
  const mats = useMemo(
    () =>
      labels.map((_, i) => {
        const t = atlas.texture.clone();
        t.needsUpdate = true;
        t.repeat.set(1 / atlas.cols, 1 / atlas.rows);
        t.offset.set((i % atlas.cols) / atlas.cols, 1 - (Math.floor(i / atlas.cols) + 1) / atlas.rows);
        const tint = colorsBy?.(i);
        return [
          new THREE.MeshStandardMaterial({color: tint ?? '#2a313d', roughness: 0.55}),
          new THREE.MeshStandardMaterial({color: tint ?? '#2a313d', roughness: 0.55}),
          new THREE.MeshStandardMaterial({map: tint ? null : t, color: tint ?? '#ffffff', roughness: 0.5}),
          new THREE.MeshStandardMaterial({color: tint ?? '#2a313d', roughness: 0.55}),
          new THREE.MeshStandardMaterial({color: tint ?? '#2a313d', roughness: 0.55}),
          new THREE.MeshStandardMaterial({color: tint ?? '#2a313d', roughness: 0.55}),
        ];
      }),
    [labels, atlas, colorsBy],
  );
  return (
    <group {...group}>
      {labels.map((_, i) => (
        <mesh key={i} geometry={geo} material={mats[i]} position={[(i % cols - (cols - 1) / 2) * (size[0] + gap), 0, Math.floor(i / cols) * (size[1] + gap)]} />
      ))}
    </group>
  );
};

/** Smartphone (generic): titanium frame, glass front with a live screen texture, camera bump on the back. */
export const Phone = ({screen, ...group}: {screen: THREE.Texture} & Group) => {
  const parts = useMemo(() => {
    const body = new RoundedBoxGeometry(0.74, 1.54, 0.08, 6, 0.1);
    const s = new THREE.Shape();
    const w = 0.69, h = 1.49, r = 0.085;
    s.moveTo(-w / 2 + r, -h / 2);
    s.lineTo(w / 2 - r, -h / 2);
    s.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + r);
    s.lineTo(w / 2, h / 2 - r);
    s.quadraticCurveTo(w / 2, h / 2, w / 2 - r, h / 2);
    s.lineTo(-w / 2 + r, h / 2);
    s.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - r);
    s.lineTo(-w / 2, -h / 2 + r);
    s.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + r, -h / 2);
    const scr = new THREE.ShapeGeometry(s, 12);
    // UVs from shape coordinates.
    const p = scr.attributes.position, uv = scr.attributes.uv;
    for (let i = 0; i < p.count; i++) uv.setXY(i, p.getX(i) / w + 0.5, p.getY(i) / h + 0.5);
    const bump = new RoundedBoxGeometry(0.3, 0.3, 0.03, 4, 0.06);
    const lens = new THREE.CylinderGeometry(0.052, 0.056, 0.03, 32);
    return {body, scr, bump, lens};
  }, []);
  const mats = useMemo(
    () => ({
      frame: new THREE.MeshPhysicalMaterial({color: '#3b4150', metalness: 0.9, roughness: 0.32, clearcoat: 0.3}),
      screen: screenMat(screen),
      glass: new THREE.MeshPhysicalMaterial({color: '#05070c', metalness: 0.2, roughness: 0.05, clearcoat: 1, transparent: true, opacity: 0.25}),
      lens: new THREE.MeshPhysicalMaterial({color: '#0a0d14', metalness: 0.6, roughness: 0.1, clearcoat: 1}),
    }),
    [screen],
  );
  return (
    <group {...group}>
      <mesh geometry={parts.body} material={mats.frame} />
      <mesh geometry={parts.scr} material={mats.screen} position={[0, 0, 0.0405]} />
      <mesh geometry={parts.scr} material={mats.glass} position={[0, 0, 0.042]} />
      <mesh geometry={parts.bump} material={mats.frame} position={[-0.17, 0.53, -0.048]} />
      {[[-0.24, 0.6], [-0.1, 0.6], [-0.17, 0.46]].map(([x, y], i) => (
        <mesh key={i} geometry={parts.lens} material={mats.lens} position={[x, y, -0.07]} rotation={[Math.PI / 2, 0, 0]} />
      ))}
    </group>
  );
};

/** Card payment terminal (generic EDC): screen, keypad, printer housing and a card in the chip slot. */
export const PaymentTerminal = ({screen, ...group}: {screen: THREE.Texture} & Group) => {
  const parts = useMemo(
    () => ({
      body: new RoundedBoxGeometry(0.82, 0.16, 1.62, 5, 0.06),
      printer: new THREE.CylinderGeometry(0.2, 0.2, 0.8, 32, 1, false, 0, Math.PI),
      bezel: new RoundedBoxGeometry(0.7, 0.02, 0.56, 3, 0.02),
      card: new RoundedBoxGeometry(0.54, 0.008, 0.86, 2, 0.03),
      screen: new THREE.PlaneGeometry(0.62, 0.465),
    }),
    [],
  );
  const mats = useMemo(
    () => ({
      body: new THREE.MeshPhysicalMaterial({color: '#1d222b', roughness: 0.42, metalness: 0.1, clearcoat: 0.4, clearcoatRoughness: 0.4}),
      bezel: new THREE.MeshPhysicalMaterial({color: '#07090d', roughness: 0.15, metalness: 0.3, clearcoat: 1}),
      card: new THREE.MeshPhysicalMaterial({color: '#1f3f8f', roughness: 0.35, metalness: 0.2, clearcoat: 0.8}),
      chip: new THREE.MeshStandardMaterial({color: '#d4af37', metalness: 1, roughness: 0.3}),
      screen: screenMat(screen),
    }),
    [screen],
  );
  const labels = useMemo(() => ['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#', '', '', ''], []);
  const tint = useMemo(() => (i: number) => (i === 12 ? '#c0392b' : i === 13 ? '#d4a017' : i === 14 ? '#1e9e5a' : null), []);
  return (
    <group {...group}>
      <mesh geometry={parts.body} material={mats.body} />
      <mesh geometry={parts.printer} material={mats.body} position={[0, 0.06, -0.78]} rotation={[0, 0, Math.PI / 2]} />
      <mesh geometry={parts.bezel} material={mats.bezel} position={[0, 0.08, -0.36]} />
      <mesh geometry={parts.screen} material={mats.screen} position={[0, 0.092, -0.36]} rotation={[-Math.PI / 2, 0, 0]} />
      <Keypad labels={labels} cols={3} size={[0.19, 0.105]} gap={0.03} colorsBy={tint} position={[0, 0.09, 0.05]} />
      {/* Card in the chip slot at the near end */}
      <group position={[0, 0.0, 0.98]}>
        <mesh geometry={parts.card} material={mats.card} />
        <mesh material={mats.chip} position={[-0.12, 0.006, -0.22]}>
          <boxGeometry args={[0.1, 0.004, 0.08]} />
        </mesh>
      </group>
    </group>
  );
};

/** ATM kiosk (generic): lit header, screen in a bezel, keypad shelf, card and cash slots. */
export const ATM = ({screen, header, ...group}: {screen: THREE.Texture; header: THREE.Texture} & Group) => {
  const parts = useMemo(
    () => ({
      body: new RoundedBoxGeometry(1.15, 2.05, 0.8, 4, 0.04),
      fascia: new RoundedBoxGeometry(0.98, 1.3, 0.06, 4, 0.03),
      shelf: new RoundedBoxGeometry(0.98, 0.06, 0.34, 3, 0.02),
      slot: new RoundedBoxGeometry(0.26, 0.05, 0.05, 2, 0.015),
      cash: new RoundedBoxGeometry(0.6, 0.06, 0.06, 2, 0.02),
    }),
    [],
  );
  const mats = useMemo(
    () => ({
      body: new THREE.MeshPhysicalMaterial({color: '#9aa4b2', metalness: 0.85, roughness: 0.38}),
      fascia: new THREE.MeshPhysicalMaterial({color: '#151a22', metalness: 0.5, roughness: 0.3, clearcoat: 0.6}),
      dark: new THREE.MeshStandardMaterial({color: '#07090c', roughness: 0.4}),
      screen: screenMat(screen),
      header: screenMat(header),
      green: new THREE.MeshBasicMaterial({color: '#19d69a', toneMapped: false}),
    }),
    [screen, header],
  );
  const labels = useMemo(() => ['1', '2', '3', '', '4', '5', '6', '', '7', '8', '9', '', '', '0', '', ''], []);
  const tint = useMemo(() => (i: number) => (i === 3 ? '#c0392b' : i === 7 ? '#d4a017' : i === 11 ? '#1e9e5a' : null), []);
  return (
    <group {...group}>
      <mesh geometry={parts.body} material={mats.body} position={[0, 1.025, -0.4]} />
      <mesh geometry={parts.fascia} material={mats.fascia} position={[0, 1.25, 0.02]} />
      <mesh material={mats.header} position={[0, 1.97, 0.03]}>
        <planeGeometry args={[0.98, 0.22]} />
      </mesh>
      <mesh material={mats.screen} position={[0, 1.5, 0.056]} rotation={[-0.08, 0, 0]}>
        <planeGeometry args={[0.66, 0.5]} />
      </mesh>
      <mesh geometry={parts.shelf} material={mats.fascia} position={[0, 0.98, 0.18]} rotation={[0.22, 0, 0]} />
      <Keypad labels={labels} cols={4} size={[0.1, 0.06]} gap={0.018} colorsBy={tint} position={[-0.12, 1.02, 0.06]} rotation={[0.22, 0, 0]} />
      <mesh geometry={parts.slot} material={mats.dark} position={[0.33, 1.08, 0.08]} />
      <mesh material={mats.green} position={[0.33, 1.08, 0.106]}>
        <planeGeometry args={[0.2, 0.012]} />
      </mesh>
      <mesh geometry={parts.cash} material={mats.dark} position={[0, 0.72, 0.06]} />
    </group>
  );
};

/** Hardware wallet (generic, no brand): graphite body, aluminium frame, small OLED, side buttons and a status LED. */
export const HardwareWallet = ({screen, led = 1, ...group}: {screen: THREE.Texture; led?: number} & Group) => {
  const parts = useMemo(
    () => ({
      body: new RoundedBoxGeometry(0.62, 1.0, 0.11, 6, 0.08),
      frame: new RoundedBoxGeometry(0.64, 1.02, 0.07, 6, 0.08),
      oled: new RoundedBoxGeometry(0.46, 0.3, 0.012, 3, 0.03),
      button: new RoundedBoxGeometry(0.03, 0.12, 0.05, 2, 0.012),
      port: new RoundedBoxGeometry(0.12, 0.03, 0.04, 2, 0.012),
    }),
    [],
  );
  const mats = useMemo(
    () => ({
      body: new THREE.MeshPhysicalMaterial({color: '#1b1f27', roughness: 0.55, metalness: 0.2, clearcoat: 0.3, clearcoatRoughness: 0.5}),
      frame: new THREE.MeshPhysicalMaterial({color: '#b9c2cf', roughness: 0.28, metalness: 1}),
      glass: new THREE.MeshPhysicalMaterial({color: '#05070b', roughness: 0.05, metalness: 0.3, clearcoat: 1}),
      screen: screenMat(screen),
      dark: new THREE.MeshStandardMaterial({color: '#07090c', roughness: 0.6}),
      led: new THREE.MeshBasicMaterial({color: '#2997FF', toneMapped: false}),
    }),
    [screen],
  );
  mats.led.color.set('#2997FF').multiplyScalar(0.3 + 0.7 * led);
  return (
    <group {...group}>
      <mesh geometry={parts.frame} material={mats.frame} />
      <mesh geometry={parts.body} material={mats.body} />
      <mesh geometry={parts.oled} material={mats.glass} position={[0, 0.22, 0.056]} />
      <mesh material={mats.screen} position={[0, 0.22, 0.063]}>
        <planeGeometry args={[0.42, 0.26]} />
      </mesh>
      <mesh geometry={parts.button} material={mats.frame} position={[0.325, 0.18, 0]} />
      <mesh geometry={parts.button} material={mats.frame} position={[0.325, -0.02, 0]} />
      <mesh geometry={parts.port} material={mats.dark} position={[0, -0.5, 0]} />
      <mesh material={mats.led} position={[0, 0.43, 0.057]}>
        <circleGeometry args={[0.018, 24]} />
      </mesh>
    </group>
  );
};

/** Solar-cell panel texture: dark blue cells on a silver grid. */
const solarTexture = () => {
  const c = document.createElement('canvas');
  c.width = 512;
  c.height = 768;
  const ctx = c.getContext('2d')!;
  ctx.fillStyle = '#c9d2dc';
  ctx.fillRect(0, 0, 512, 768);
  for (let y = 0; y < 12; y++)
    for (let x = 0; x < 8; x++) {
      const g = ctx.createLinearGradient(0, y * 64, 0, y * 64 + 60);
      g.addColorStop(0, '#13265a');
      g.addColorStop(1, '#0a1838');
      ctx.fillStyle = g;
      ctx.fillRect(x * 64 + 3, y * 64 + 3, 58, 58);
      ctx.fillStyle = 'rgba(160,190,255,0.12)';
      ctx.fillRect(x * 64 + 3, y * 64 + 3, 58, 3);
    }
  return toTexture(c);
};

/** Crinkled-foil normal map for the satellite bus. */
const foilNormal = () => {
  const s = 256;
  const c = document.createElement('canvas');
  c.width = s;
  c.height = s;
  const ctx = c.getContext('2d')!;
  const img = ctx.createImageData(s, s);
  let seed = 3;
  const r = () => ((seed = (seed * 1664525 + 1013904223) % 4294967296) / 4294967296);
  const cells = Array.from({length: 60}, () => [r() * s, r() * s, r() * 2 - 1, r() * 2 - 1]);
  for (let y = 0; y < s; y++)
    for (let x = 0; x < s; x++) {
      let best = 0, bd = Infinity;
      cells.forEach(([cx, cy], i) => { const d = (cx - x) ** 2 + (cy - y) ** 2; if (d < bd) { bd = d; best = i; } });
      const i = (y * s + x) * 4;
      img.data[i] = 128 + cells[best][2] * 70;
      img.data[i + 1] = 128 + cells[best][3] * 70;
      img.data[i + 2] = 255;
      img.data[i + 3] = 255;
    }
  ctx.putImageData(img, 0, 0);
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  return t;
};

/** Parabolic dish shell (lathe), opening toward +y. */
const dishGeometry = (radius: number, depth: number) => {
  const pts: THREE.Vector2[] = [];
  for (let i = 0; i <= 24; i++) {
    const x = (i / 24) * radius;
    pts.push(new THREE.Vector2(x, (depth * x * x) / (radius * radius)));
  }
  return new THREE.LatheGeometry(pts, 64);
};

/** Geostationary communications satellite (generic): foil bus, two solar wings, dishes facing −y (the Earth). */
export const Satellite = (group: Group) => {
  const parts = useMemo(
    () => ({bus: new RoundedBoxGeometry(0.62, 0.72, 0.62, 3, 0.03), panel: new THREE.BoxGeometry(0.62, 0.012, 0.95), boom: new THREE.CylinderGeometry(0.018, 0.018, 0.5, 10), dish: dishGeometry(0.42, 0.14), horn: new THREE.ConeGeometry(0.05, 0.16, 16)}),
    [],
  );
  const mats = useMemo(() => {
    const foil = foilNormal();
    foil.repeat.set(3, 3);
    const cells = solarTexture();
    return {
      foil: new THREE.MeshStandardMaterial({color: '#d6a72c', metalness: 1, roughness: 0.38, normalMap: foil, normalScale: new THREE.Vector2(0.35, 0.35)}),
      panelTop: new THREE.MeshStandardMaterial({map: cells, metalness: 0.5, roughness: 0.25}),
      panelSide: new THREE.MeshStandardMaterial({color: '#9aa4b2', metalness: 0.9, roughness: 0.3}),
      white: new THREE.MeshStandardMaterial({color: '#eef1f5', metalness: 0.1, roughness: 0.45, side: THREE.DoubleSide}),
      metal: new THREE.MeshStandardMaterial({color: '#a9b4c2', metalness: 1, roughness: 0.3}),
    };
  }, []);
  const panelMats = [mats.panelSide, mats.panelSide, mats.panelTop, mats.panelTop, mats.panelSide, mats.panelSide];
  return (
    <group {...group}>
      <mesh geometry={parts.bus} material={mats.foil} />
      {[-1, 1].map((side) => (
        <group key={side} position={[side * 0.31, 0.1, 0]}>
          <mesh geometry={parts.boom} material={mats.metal} position={[side * 0.25, 0, 0]} rotation={[0, 0, Math.PI / 2]} />
          {[0, 1, 2].map((k) => (
            <mesh key={k} geometry={parts.panel} material={panelMats} position={[side * (0.85 + k * 0.66), 0, 0]} rotation={[Math.PI / 2, 0, 0]} />
          ))}
        </group>
      ))}
      {/* Dishes look down at the Earth (−y) */}
      <mesh geometry={parts.dish} material={mats.white} position={[0.12, -0.52, 0.2]} rotation={[Math.PI, 0, 0.25]} />
      <mesh geometry={parts.dish} material={mats.white} position={[-0.18, -0.48, -0.18]} rotation={[Math.PI, 0, -0.2]} scale={0.7} />
      <mesh geometry={parts.horn} material={mats.metal} position={[0.12, -0.72, 0.2]} />
    </group>
  );
};

/** Small home satellite dish on a pole mount, opening toward +y (tilt the group to aim it). */
export const HomeDish = (group: Group) => {
  const dish = useMemo(() => dishGeometry(0.45, 0.12), []);
  return (
    <group {...group}>
      <mesh geometry={dish}>
        <meshStandardMaterial color="#e6e9ee" metalness={0.2} roughness={0.5} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0.42, 0]}>
        <cylinderGeometry args={[0.012, 0.012, 0.8, 8]} />
        <meshStandardMaterial color="#9aa4b2" metalness={0.9} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.82, 0]}>
        <boxGeometry args={[0.08, 0.1, 0.08]} />
        <meshStandardMaterial color="#2a313d" roughness={0.5} />
      </mesh>
    </group>
  );
};

/** A thin-bezel monitor on a stand (generic), with a live screen texture. */
export const Monitor = ({screen, ...group}: {screen: THREE.Texture} & Group) => {
  const parts = useMemo(() => ({bezel: new RoundedBoxGeometry(1.62, 1.0, 0.05, 4, 0.03), neck: new RoundedBoxGeometry(0.12, 0.42, 0.05, 2, 0.02), foot: new RoundedBoxGeometry(0.6, 0.03, 0.34, 2, 0.015)}), []);
  const mats = useMemo(() => ({bezel: new THREE.MeshPhysicalMaterial({color: '#20252f', metalness: 0.6, roughness: 0.35, clearcoat: 0.4}), screen: screenMat(screen)}), [screen]);
  return (
    <group {...group}>
      <mesh geometry={parts.bezel} material={mats.bezel} position={[0, 0.72, 0]} />
      <mesh material={mats.screen} position={[0, 0.74, 0.0255]}>
        <planeGeometry args={[1.54, 0.9]} />
      </mesh>
      <mesh geometry={parts.neck} material={mats.bezel} position={[0, 0.2, -0.06]} />
      <mesh geometry={parts.foot} material={mats.bezel} position={[0, 0.0, -0.04]} />
    </group>
  );
};
