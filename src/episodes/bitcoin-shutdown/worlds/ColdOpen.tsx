import {useMemo} from 'react';
import {interpolate, staticFile, useCurrentFrame} from 'remotion';
import * as THREE from 'three';
import {fontsReady, useAssets3D} from '../../../three/assets';
import {BitcoinCoin} from '../../../three/BitcoinCoin';
import type {CamKey} from '../../../three/camera';
import {studioPanels} from '../../../three/env';
import {glowTexture, rng, svgShapes} from '../../../three/kit';
import {World3D} from '../../../three/World3D';
import {colors} from '../../../theme/colors';

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

type Link = {a: THREE.Vector3; b: THREE.Vector3; halves: THREE.TubeGeometry[]; breakAt: number; retract: number; mat: THREE.MeshBasicMaterial};
const TUBE_SEGS = 24;
const RADIAL = 6;

/** A web of links around the coin: node-to-node plus node-to-rim, each built as two halves that can retract. */
const buildWeb = (seed: number) => {
  const r = rng(seed);
  const nodes: THREE.Vector3[] = [];
  for (let i = 0; i < 26; i++) {
    const t = (i / 26) * Math.PI * 2 + r() * 0.2;
    const rad = 1.7 + r() * 1.7;
    // Upper nodes spread sideways and stay low, so no link crosses the headline zone above the coin.
    const up = Math.sin(t) > 0;
    nodes.push(new THREE.Vector3(Math.cos(t) * rad * (up ? 1.25 : 1), up ? 0.3 + Math.sin(t) * 0.85 : Math.sin(t) * rad * 1.35, -1.6 + r() * 2.6));
  }
  const pairs: Array<[THREE.Vector3, THREE.Vector3]> = [];
  const seen = new Set<string>();
  nodes.forEach((n, i) => {
    const near = nodes.map((m, j) => ({j, d: n.distanceTo(m)})).filter((x) => x.j !== i).sort((x, y) => x.d - y.d).slice(0, 2);
    for (const {j} of near) {
      const key = [Math.min(i, j), Math.max(i, j)].join('-');
      if (!seen.has(key)) { seen.add(key); pairs.push([n, nodes[j]]); }
    }
    if (i % 2 === 0) {
      const ang = Math.atan2(n.y, n.x);
      pairs.push([n, new THREE.Vector3(Math.cos(ang) * 1.03, Math.sin(ang) * 1.03, 0)]);
    }
  });
  const links: Link[] = pairs.map(([a, b]) => {
    const mid = a.clone().lerp(b, 0.5).add(new THREE.Vector3(0, 0, 0.25 + r() * 0.3));
    const half = (from: THREE.Vector3) => new THREE.TubeGeometry(new THREE.QuadraticBezierCurve3(from, from.clone().lerp(mid, 0.5).add(new THREE.Vector3(0, 0, 0.05)), mid), TUBE_SEGS, 0.0075, RADIAL, false);
    return {a, b, halves: [half(a), half(b)], breakAt: r() * 10, retract: 7 + r() * 8, mat: new THREE.MeshBasicMaterial({color: colors.electric, transparent: true, toneMapped: false})};
  });
  return {nodes, links};
};

export const ColdOpenWorld = ({snap, keys, exitAt}: {snap: number; keys: CamKey[]; exitAt: number}) => {
  const frame = useCurrentFrame();
  const a = useAssets3D(async () => {
    await fontsReady();
    return {symbol: await svgShapes(staticFile('episodes/bitcoin-shutdown/bitcoin-symbol.svg'), '#FFF'), glow: glowTexture()};
  }, 'cold-open');
  const web = useMemo(() => buildWeb(7), []);
  if (!a) return null;

  const after = frame - snap;
  const blue = 1 - clamp01(after / 14);
  const redFlicker = after >= 0 ? (0.55 + 0.45 * Math.sin(after * 1.9) * Math.sin(after * 0.7)) * clamp01(1 - (after - 18) / 20) : 0;
  const idle = Math.sin(frame / 28) * 0.08;

  return (
    <World3D keys={keys} panels={studioPanels.dark} envIntensity={0.55 + 0.45 * blue} exposure={1.05} style={{opacity: interpolate(frame, [exitAt - 6, exitAt], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}}>
      <ambientLight intensity={0.08} />
      <directionalLight position={[-3, 4, 5]} intensity={1.6} />
      <pointLight position={[2.2, 1.2, 2]} color={colors.electric} intensity={30 * blue} distance={8} />
      <pointLight position={[-2.4, -1.6, 1.6]} color={colors.blue} intensity={22 * blue} distance={8} />
      <pointLight position={[1.4, -0.6, 2.2]} color={colors.negative} intensity={26 * redFlicker} distance={7} />
      <BitcoinCoin symbol={a.symbol} dim={0.35 * (1 - blue)} rotation={[0.08, -0.32 + idle, 0.02]} />

      {web.links.map((l, i) => {
        const t = after - l.breakAt;
        const gone = clamp01(t / l.retract);
        const flash = t >= 0 && t < 4;
        l.mat.color.set(flash ? colors.negative : colors.electric);
        l.mat.opacity = t < 0 ? 0.9 : (1 - gone) * 0.9;
        const count = Math.round(TUBE_SEGS * (1 - gone)) * RADIAL * 6;
        if (count <= 0) return null;
        return l.halves.map((g, h) => {
          g.setDrawRange(0, count);
          return <mesh key={`${i}-${h}`} geometry={g} material={l.mat} />;
        });
      })}
      {web.nodes.map((n, i) => {
        const o = 1 - clamp01((after - 4 - (i % 7)) / 12);
        return (
          <sprite key={i} position={n} scale={0.32}>
            <spriteMaterial map={a.glow} color={o > 0.5 ? colors.light : colors.negative} transparent opacity={0.25 + 0.75 * o} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
          </sprite>
        );
      })}
    </World3D>
  );
};
