import {useMemo} from 'react';
import {interpolate, staticFile, useCurrentFrame} from 'remotion';
import * as THREE from 'three';
import {Line2} from 'three/examples/jsm/lines/Line2.js';
import {LineGeometry} from 'three/examples/jsm/lines/LineGeometry.js';
import {LineMaterial} from 'three/examples/jsm/lines/LineMaterial.js';
import {LineSegments2} from 'three/examples/jsm/lines/LineSegments2.js';
import {LineSegmentsGeometry} from 'three/examples/jsm/lines/LineSegmentsGeometry.js';
import {fontsReady, loadImage, textTexture, toTexture, useAssets3D} from '../../../three/assets';
import {cameraAt, type CamKey, type V3} from '../../../three/camera';
import {arcPoint, Earth, latLon} from '../../../three/Earth';
import {studioPanels} from '../../../three/env';
import {glowTexture, rng} from '../../../three/kit';
import {Label3D} from '../../../three/Label3D';
import {World3D} from '../../../three/World3D';
import {colors} from '../../../theme/colors';
import {ease} from '../../../theme/motion';
import {fonts} from '../../../theme/typography';

const ramp = (f: number, a: number, b: number, e = ease.inOut) => interpolate(f, [a, b], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: e});

export type NetBeats = {nocenter: number; relay: number; confirm: number; local: number; partition: number; wait: number};

const R = 2;
const NODE_R = R * 1.004;
const RES = new THREE.Vector2(1080, 1920);
const CITY = {jakarta: [-6.21, 106.84], frankfurt: [50.11, 8.68], singapore: [1.35, 103.82], mumbai: [19.08, 72.88], newYork: [40.71, -74.0]} as const;

type Region = 'NA' | 'SA' | 'EU' | 'AF' | 'AS' | 'OC';
const regionOf = (lat: number, lon: number): Region =>
  lon < -30 ? (lat > 12 ? 'NA' : 'SA') : lon < 60 ? (lat > 35 ? 'EU' : 'AF') : lon >= 110 && lat <= -10 ? 'OC' : 'AS';
const LONG_HAUL: Array<[Region, Region, number]> = [['EU', 'NA', 22], ['EU', 'AS', 16], ['AS', 'NA', 12], ['AS', 'OC', 8], ['EU', 'SA', 5], ['NA', 'SA', 6], ['EU', 'AF', 6], ['AF', 'AS', 4], ['EU', 'OC', 3]];

const buildGraph = (coords: Array<[number, number]>) => {
  const n = coords.length;
  const pts = coords.map(([la, lo]) => latLon(la, lo, NODE_R));
  const reg = coords.map(([la, lo]) => regionOf(la, lo));
  const adj: number[][] = Array.from({length: n}, () => []);
  const short: Array<[number, number]> = [];
  const seen = new Set<number>();
  const add = (i: number, j: number, list: Array<[number, number]>) => {
    const k = Math.min(i, j) * n + Math.max(i, j);
    if (i === j || seen.has(k)) return;
    seen.add(k);
    list.push([i, j]);
    adj[i].push(j);
    adj[j].push(i);
  };
  // Each node to its two nearest neighbours.
  for (let i = 0; i < n; i++) {
    let b1 = -1, b2 = -1, d1 = Infinity, d2 = Infinity;
    for (let j = 0; j < n; j++) {
      if (i === j) continue;
      const d = pts[i].distanceToSquared(pts[j]);
      if (d < d1) { d2 = d1; b2 = b1; d1 = d; b1 = j; } else if (d < d2) { d2 = d; b2 = j; }
    }
    add(i, b1, short);
    if (b2 >= 0) add(i, b2, short);
  }
  // Join isolated clusters to the nearest node of the largest one.
  const comp = new Int32Array(n).fill(-1);
  let c = 0;
  for (let s = 0; s < n; s++) {
    if (comp[s] >= 0) continue;
    const q = [s];
    comp[s] = c;
    while (q.length) for (const v of adj[q.pop()!]) if (comp[v] < 0) { comp[v] = c; q.push(v); }
    c++;
  }
  const sizes = new Map<number, number>();
  comp.forEach((k) => sizes.set(k, (sizes.get(k) ?? 0) + 1));
  const main = [...sizes.entries()].sort((a, b) => b[1] - a[1])[0][0];
  for (const [k] of sizes) {
    if (k === main) continue;
    const members = [...comp.keys()].filter((i) => comp[i] === k);
    let best = [-1, -1], bd = Infinity;
    for (const i of members) for (let j = 0; j < n; j += 3) if (comp[j] === main) { const d = pts[i].distanceToSquared(pts[j]); if (d < bd) { bd = d; best = [i, j]; } }
    add(best[0], best[1], short);
  }
  // Inter-continental links (these are the ones a partition cuts).
  const r = rng(91);
  const byRegion = (g: Region) => coords.map((_, i) => i).filter((i) => reg[i] === g);
  const long: Array<[number, number]> = [];
  for (const [a, b, count] of LONG_HAUL) {
    const A = byRegion(a), B = byRegion(b);
    for (let k = 0; k < count && A.length && B.length; k++) add(A[Math.floor(r() * A.length)], B[Math.floor(r() * B.length)], long);
  }
  return {pts, reg, adj, short, long};
};

const nearest = (coords: Array<[number, number]>, [la, lo]: readonly [number, number]) => {
  let best = 0, bd = Infinity;
  coords.forEach(([a, b], i) => { const d = (a - la) ** 2 + (b - lo) ** 2; if (d < bd) { bd = d; best = i; } });
  return best;
};

/** BFS from the wallet: hop depth and parent of every node. */
const bfs = (adj: number[][], start: number) => {
  const depth = new Int32Array(adj.length).fill(-1), parent = new Int32Array(adj.length).fill(-1);
  depth[start] = 0;
  const q = [start];
  for (let h = 0; h < q.length; h++) for (const v of adj[q[h]]) if (depth[v] < 0) { depth[v] = depth[q[h]] + 1; parent[v] = q[h]; q.push(v); }
  return {depth, parent};
};

const arcPositions = (a: THREE.Vector3, b: THREE.Vector3, segs: number, lift: number) => {
  const out: number[] = [];
  for (let s = 0; s <= segs; s++) out.push(...arcPoint(a, b, s / segs, NODE_R, lift).toArray());
  return out;
};

export const NetworkWorld = ({b}: {b: NetBeats}) => {
  const frame = useCurrentFrame();
  const a = useAssets3D(async () => {
    await fontsReady();
    const [night, nodes] = await Promise.all([loadImage(staticFile('episodes/bitcoin-shutdown/earth-night-3600.jpg')), fetch(staticFile('episodes/bitcoin-shutdown/btc-nodes-2026-10-21.json')).then((r) => r.json())]);
    const mono = (s: string, color: string) => textTexture(s, {family: fonts.mono, weight: 700, px: 72, color, tracking: 6});
    return {
      night: toTexture(night), coords: nodes.coordinates as Array<[number, number]>, glow: glowTexture(),
      t: {wallet: mono('DOMPET LO', colors.light), miner: mono('MINER · BLOK BARU', colors.positive), pending: mono('TERTUNDA', colors.negative), frozen: mono('TERTAHAN', colors.negative)},
    };
  }, 'network');

  const net = useMemo(() => {
    if (!a) return null;
    const g = buildGraph(a.coords);
    const wallet = nearest(a.coords, CITY.jakarta), miner = nearest(a.coords, CITY.frankfurt), sg = nearest(a.coords, CITY.singapore), ny = nearest(a.coords, CITY.newYork), mumbai = nearest(a.coords, CITY.mumbai);
    const {depth, parent} = bfs(g.adj, wallet);
    const maxDepth = Math.max(...depth);
    // The hero route: four real node locations, each hop a visible arc.
    const path = [wallet, sg, mumbai, miner];
    const heroArcs = path.slice(1).map((v, k) => arcPositions(g.pts[path[k]], g.pts[v], 48, 0.12 + 0.3 * g.pts[path[k]].distanceTo(g.pts[v]) / (2 * R)));
    const heroLines = heroArcs.map((arc) => new Line2(new LineGeometry().setPositions(arc), new LineMaterial({color: 0xffffff, linewidth: 4, transparent: true, opacity: 0.95, resolution: RES, depthWrite: false, depthTest: false})));
    // Base links: dim, static.
    const shortPos: number[] = [];
    const walletPos: number[] = [];
    for (const [i, j] of g.short) (i === wallet || j === wallet ? walletPos : shortPos).push(...g.pts[i].toArray(), ...g.pts[j].toArray());
    // The wallet's own links: drawn apart so they can flash red and drop when "your" connection fails.
    const walletLinks = new LineSegments2(new LineSegmentsGeometry().setPositions(walletPos), new LineMaterial({color: 0x75c7ff, linewidth: 2.2, transparent: true, opacity: 0.9, resolution: RES, depthWrite: false}));
    const baseGeo = new LineSegmentsGeometry().setPositions(shortPos);
    const baseMat = new LineMaterial({color: 0x2997ff, linewidth: 1.1, transparent: true, opacity: 0.22, resolution: RES, depthWrite: false});
    const base = new LineSegments2(baseGeo, baseMat);
    // Propagation edges in order of arrival (drawn as a growing prefix).
    const tree = g.pts.map((_, v) => v).filter((v) => parent[v] >= 0).sort((x, y) => depth[x] - depth[y]);
    const treePos: number[] = [];
    for (const v of tree) treePos.push(...g.pts[parent[v]].toArray(), ...g.pts[v].toArray());
    const litGeo = new LineSegmentsGeometry().setPositions(treePos);
    const litMat = new LineMaterial({color: 0x75c7ff, linewidth: 1.8, transparent: true, opacity: 0.85, resolution: RES, depthWrite: false});
    const lit = new LineSegments2(litGeo, litMat);
    // Long-haul arcs, individually animated (they light, then break in the partition).
    const longs = g.long.map(([i, j], k) => {
      const geo = new LineGeometry().setPositions(arcPositions(g.pts[i], g.pts[j], 40, 0.25 + 0.35 * g.pts[i].distanceTo(g.pts[j]) / (2 * R)));
      const mat = new LineMaterial({color: 0x2997ff, linewidth: 1.6, transparent: true, opacity: 0.5, resolution: RES, depthWrite: false});
      return {i, j, line: new Line2(geo, mat), breakAt: (k * 7919) % 40};
    });
    // Points
    const pg = new THREE.BufferGeometry();
    pg.setAttribute('position', new THREE.BufferAttribute(new Float32Array(g.pts.flatMap((p) => p.toArray())), 3));
    pg.setAttribute('color', new THREE.BufferAttribute(new Float32Array(g.pts.length * 3), 3));
    // The packet that freezes in the partition rides a long arc Singapore → Frankfurt.
    const frozenArc = arcPositions(g.pts[sg], g.pts[miner], 60, 0.55);
    const frozenLine = new Line2(new LineGeometry().setPositions(frozenArc), new LineMaterial({color: 0x2997ff, linewidth: 2.2, transparent: true, opacity: 0.8, resolution: RES, depthWrite: false}));
    return {g, wallet, miner, sg, ny, depth, maxDepth, path, heroArcs, heroLines, base, lit, tree, longs, pg, frozenArc, frozenLine, walletLinks};
  }, [a]);

  if (!a || !net) return null;
  const {g} = net;

  // ---- Timeline ----
  const HOP = Math.max(1.2, (b.confirm + 24 - b.relay) / net.maxDepth);
  const t0 = b.relay + 4;
  const arrive = (v: number) => t0 + net.depth[v] * HOP;
  const blackout = ramp(frame, b.wait - 26, b.wait - 2);
  const localCut = frame >= b.local + 14;
  const partitionCut = (k: number) => frame >= b.partition + 18 + net.longs[k].breakAt * 0.9;
  const glowLevel = 1 - blackout;

  // Points: dim blue base; a white flash when the transaction reaches them; the wallet goes red when it loses its link.
  const col = net.pg.attributes.color as THREE.BufferAttribute;
  for (let v = 0; v < g.pts.length; v++) {
    const dt = frame - arrive(v);
    const flash = frame >= b.relay && dt >= 0 && dt < 8 && frame < b.local ? 0.55 * (1 - dt / 8) : 0;
    let r = 0.42 + 0.58 * flash, gg = 0.68 + 0.32 * flash, bb = 1;
    if (v === net.wallet && localCut) [r, gg, bb] = [1, 0.32, 0.38];
    col.setXYZ(v, r * glowLevel, gg * glowLevel, bb * glowLevel);
  }
  col.needsUpdate = true;
  // Growing propagation tree.
  const litCount = frame < b.relay ? 0 : net.tree.filter((v) => arrive(v) <= frame).length;
  net.lit.geometry.instanceCount = litCount;
  (net.lit.material as LineMaterial).opacity = 0.85 * (1 - ramp(frame, b.confirm + 10, b.local)) * glowLevel;
  (net.base.material as LineMaterial).opacity = 0.22 * glowLevel;
  net.longs.forEach((l, k) => {
    const m = l.line.material as LineMaterial;
    const cut = partitionCut(k);
    const since = frame - (b.partition + 18 + l.breakAt * 0.9);
    m.color.set(cut && since < 6 ? colors.negative : colors.electric);
    m.opacity = (cut ? Math.max(0, 1 - since / 14) : 0.5) * glowLevel;
  });

  {
    const m = net.walletLinks.material as LineMaterial;
    const since = frame - (b.local + 14);
    m.color.set(since >= 0 ? colors.negative : colors.light);
    m.opacity = (since < 0 ? 0.9 : Math.max(0, 1 - since / 16)) * glowLevel;
  }

  // Hero packet: hop by hop along the route (relay → confirm).
  const HOPS = [[b.relay + 6, b.relay + 32], [b.relay + 36, b.relay + 64], [b.relay + 68, b.confirm - 6]];
  let packet: THREE.Vector3 | null = null;
  if (frame >= b.nocenter && frame < HOPS[0][0]) packet = g.pts[net.wallet].clone();
  else if (frame >= HOPS[0][0] && frame < b.confirm + 4) {
    let k = HOPS.findIndex(([s0, s1]) => frame < s1);
    if (k < 0) k = HOPS.length - 1;
    const tt = Math.min(1, Math.max(0, (frame - HOPS[k][0]) / (HOPS[k][1] - HOPS[k][0])));
    const idx = Math.round(ease.inOut(tt) * 48);
    const arc = net.heroArcs[k];
    packet = new THREE.Vector3(arc[idx * 3], arc[idx * 3 + 1], arc[idx * 3 + 2]);
  }
  net.heroLines.forEach((line, k) => {
    const tt = Math.min(1, Math.max(0, (frame - HOPS[k][0]) / (HOPS[k][1] - HOPS[k][0])));
    line.geometry.instanceCount = Math.round(ease.inOut(tt) * 48);
    (line.material as LineMaterial).opacity = 0.95 * (1 - ramp(frame, b.confirm + 14, b.local)) * glowLevel;
  });
  // Pending transaction at the wallet (scenario A).
  const pendingOn = frame >= b.local + 20 && frame < b.partition;
  // Frozen packet (scenario B): travels from Singapore toward Frankfurt, stops when its arc is cut.
  const frozenStart = b.partition + 6, frozenStop = b.partition + 40;
  const fz = net.frozenArc;
  const fzT = Math.min(ramp(frame, frozenStart, frozenStart + 90, (t: number) => t), ramp(frozenStop, frozenStart, frozenStart + 90, (t: number) => t));
  const fzIdx = Math.min(59, Math.floor(fzT * 60));
  const frozenPos = new THREE.Vector3(fz[fzIdx * 3], fz[fzIdx * 3 + 1], fz[fzIdx * 3 + 2]);
  const frozenOn = frame >= frozenStart;
  {
    // The frozen packet's route: drawn out ahead of it, then cut in front of it (red flash, then gone).
    const m = net.frozenLine.material as LineMaterial;
    const cut = frame - frozenStop;
    m.color.set(cut >= 0 && cut < 8 ? colors.negative : colors.electric);
    m.opacity = (frame < frozenStart ? 0 : cut < 0 ? 0.8 : Math.max(0.0, 0.8 - cut / 14)) * glowLevel;
    net.frozenLine.geometry.instanceCount = cut < 0 ? 60 : fzIdx;
  }

  // ---- Camera ----
  const W = g.pts[net.wallet], M = g.pts[net.miner];
  const out = (p: THREE.Vector3, d: number) => p.clone().normalize().multiplyScalar(d).toArray() as V3;
  // Each hop framed whole, from above its midpoint (distances fitted so the arc spans the stage, y ≈ 750–1400):
  // close on Jakarta → Singapore, wider for Singapore → Mumbai, wider again for Mumbai → Frankfurt.
  const hopCam = (k: number, d: number) => {
    const arc = net.heroArcs[k];
    const mid = new THREE.Vector3(arc[72], arc[73], arc[74]);
    return {pos: mid.clone().add(mid.clone().normalize().multiplyScalar(d)).toArray() as V3, look: mid.toArray() as V3, fov: 42, shift: -90};
  };
  const followKeys: CamKey[] = [
    {f: b.relay + 10, ...hopCam(0, 0.9), ease: 'out'},
    {f: b.relay + 30, ...hopCam(0, 1.0), ease: 'linear'},
    {f: b.relay + 44, ...hopCam(1, 3.0)},
    {f: b.relay + 62, ...hopCam(1, 3.15), ease: 'linear'},
    {f: b.relay + 76, ...hopCam(2, 4.5)},
    {f: b.confirm - 6, ...hopCam(2, 4.65), ease: 'linear'},
  ];
  const keys: CamKey[] = [
    // Zoom-through from the wallet: emerge right above the transaction in Jakarta, then pull back to the whole network.
    {f: b.nocenter, pos: out(W, R + 0.75), look: W.toArray() as V3, fov: 40, shift: -60},
    {f: b.nocenter + 6, pos: out(W, R + 0.85), look: W.toArray() as V3, fov: 40, shift: -60},
    {f: b.nocenter + 46, pos: out(latLon(12, 98, 1), 8.6), look: [0, 0, 0], fov: 40, shift: -110, ease: 'inOut'},
    {f: b.relay - 4, pos: out(latLon(14, 100, 1), 8.2), look: [0, 0, 0], fov: 40, shift: -110},
    ...followKeys,
    {f: b.confirm, pos: out(latLon(44, 14, 1), 7.4), look: [0, 0, 0], fov: 40, shift: -110},
    {f: b.local - 2, pos: out(latLon(42, 18, 1), 7.2), look: [0, 0, 0], fov: 40, shift: -110},
    {f: b.local + 20, pos: out(latLon(-16, 108, 1), R + 1.5), look: W.toArray() as V3, fov: 42, shift: -110},
    {f: b.partition - 4, pos: out(latLon(-18, 112, 1), R + 1.35), look: W.toArray() as V3, fov: 42, shift: -110},
    {f: b.partition + 34, pos: out(latLon(24, 72, 1), 8.6), look: [0, 0, 0], fov: 40, shift: -110},
    {f: frozenStop + 30, pos: out(latLon(26, 66, 1), 8.0), look: [0, 0, 0], fov: 40, shift: -110},
    {f: b.wait - 6, pos: frozenPos.clone().multiplyScalar(1.55).toArray() as V3, look: frozenPos.toArray() as V3, fov: 40, shift: -40, ease: 'inOut'},
  ];

  // Block ring at the miner on confirmation.
  const ring = frame >= b.confirm ? (frame - b.confirm) / 40 : -1;
  const ringQuat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), M.clone().normalize());

  return (
    <World3D keys={keys} panels={studioPanels.dark} envIntensity={0.4}>
      <ambientLight intensity={0.2} />
      <directionalLight position={[5, 3, 5]} intensity={0.6} />
      <Earth radius={R} night={a.night} nightGain={0.9 * glowLevel * ramp(frame, b.nocenter, b.nocenter + 12)} atmosphereStrength={1.4 * glowLevel} />
      <primitive object={net.base} />
      <primitive object={net.lit} />
      {net.heroLines.map((l, k) => (
        <primitive key={`h${k}`} object={l} />
      ))}
      <primitive object={net.walletLinks} />
      <primitive object={net.frozenLine} />
      {net.longs.map((l, k) => (
        <primitive key={k} object={l.line} />
      ))}
      <points geometry={net.pg}>
        <pointsMaterial map={a.glow} size={0.06} vertexColors transparent blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
      </points>

      {/* Hero packet */}
      {packet && (
        // Constant on-screen size (about 110 px) whatever the camera distance.
        <sprite position={packet} scale={0.045 * packet.distanceTo(new THREE.Vector3(...cameraAt(frame, keys).pos))} renderOrder={20}>
          <spriteMaterial map={a.glow} color="#ffffff" transparent blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
        </sprite>
      )}
      <Label3D tex={a.t.wallet} height={0.06} position={out(W, R + 0.16)} opacity={ramp(frame, b.nocenter + 30, b.nocenter + 40) * (1 - ramp(frame, b.relay + 2, b.relay + 8)) + ramp(frame, b.local + 10, b.local + 20) * (1 - ramp(frame, b.partition, b.partition + 8))} />

      {/* Confirmation: block at the miner + ring */}
      {frame >= b.confirm - 2 && frame < b.local + 10 && (
        <group position={M.clone().multiplyScalar(1.03)} quaternion={ringQuat}>
          <mesh scale={0.07 * ramp(frame, b.confirm - 2, b.confirm + 6, ease.out)}>
            <boxGeometry args={[1, 1, 1]} />
            <meshBasicMaterial color={colors.positive} toneMapped={false} transparent opacity={0.9} />
          </mesh>
          {ring >= 0 && ring < 1 && (
            <mesh scale={0.08 + ring * 0.9}>
              <ringGeometry args={[0.92, 1, 64]} />
              <meshBasicMaterial color={colors.positive} transparent opacity={(1 - ring) * 0.8} toneMapped={false} side={THREE.DoubleSide} depthWrite={false} />
            </mesh>
          )}
        </group>
      )}
      <Label3D tex={a.t.miner} height={0.11} position={M.clone().normalize().multiplyScalar(R + 0.3).add(new THREE.Vector3(0.35, 0.18, 0)).toArray() as V3} opacity={ramp(frame, b.confirm, b.confirm + 8) * (1 - ramp(frame, b.local - 6, b.local + 4))} />

      {/* Scenario A: your connection drops, the transaction waits */}
      {pendingOn && (
        <group position={W.clone().multiplyScalar(1.01)}>
          <sprite scale={0.16 + 0.04 * Math.sin(frame * 0.3)}>
            <spriteMaterial map={a.glow} color={colors.light} transparent blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
          </sprite>
          <mesh quaternion={new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), W.clone().normalize())} rotation={[0, 0, frame * 0.12]}>
            <ringGeometry args={[0.07, 0.085, 48, 1, 0, Math.PI * 1.4]} />
            <meshBasicMaterial color={colors.negative} toneMapped={false} side={THREE.DoubleSide} />
          </mesh>
        </group>
      )}
      <Label3D tex={a.t.pending} height={0.05} position={out(W.clone().add(new THREE.Vector3(0, -0.12, 0)), R + 0.14)} opacity={pendingOn ? ramp(frame, b.local + 24, b.local + 32) : 0} />

      {/* Scenario B: a transaction caught on a link that gets cut */}
      {frozenOn && (
        <sprite position={frozenPos} scale={frame >= frozenStop ? 0.3 + 0.06 * Math.sin(frame * 0.35) : 0.3}>
          <spriteMaterial map={a.glow} color={frame >= frozenStop ? colors.light : '#ffffff'} transparent blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
        </sprite>
      )}
      <Label3D tex={a.t.frozen} height={0.08} position={frozenPos.clone().multiplyScalar(1.06).toArray() as V3} opacity={frame >= frozenStop + 6 ? ramp(frame, frozenStop + 6, frozenStop + 14) * (1 - blackout) : 0} />
    </World3D>
  );
};
