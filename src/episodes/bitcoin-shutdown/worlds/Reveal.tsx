import {useMemo} from 'react';
import {interpolate, staticFile, useCurrentFrame} from 'remotion';
import * as THREE from 'three';
import {fontsReady, textTexture, useAssets3D} from '../../../three/assets';
import type {CamKey, V3} from '../../../three/camera';
import {HardwareWallet} from '../../../three/devices';
import {studioPanels} from '../../../three/env';
import {canvasTexture, glowTexture} from '../../../three/kit';
import {Label3D} from '../../../three/Label3D';
import {World3D} from '../../../three/World3D';
import {colors} from '../../../theme/colors';
import {ease} from '../../../theme/motion';
import {fonts} from '../../../theme/typography';

const ramp = (f: number, a: number, b: number, e = ease.inOut) => interpolate(f, [a, b], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: e});
const mixColor = (a: string, b: string, t: number) => '#' + new THREE.Color(a).lerp(new THREE.Color(b), t).getHexString();

export type RevealBeats = {wait: number; reveal: number; key: number; kepemilikan: number; sat: number};

const DEVICE_POS: V3 = [0, 0.95, 0];
/** Links between consecutive blocks point along the chain. */
const LINK_Q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3(-0.95, 0, -1.2).normalize());
const DEVICE_ROT: V3 = [-0.12, 0.38, 0.02];
/** The status LED in world space (device local (0, 0.43, 0.057)). */
const ledWorld = () => new THREE.Vector3(0, 0.43, 0.057).applyEuler(new THREE.Euler(...DEVICE_ROT)).add(new THREE.Vector3(...DEVICE_POS));

/** A key silhouette (bow with a hole, shaft, three bits), extruded. */
const keyGeometry = () => {
  const r = 0.2, h = 0.04, a0 = Math.asin(h / r);
  const s = new THREE.Shape();
  s.moveTo(Math.cos(a0) * r, h);
  s.lineTo(0.92, h);
  s.lineTo(0.92, -h);
  for (const [x0, x1, d] of [[0.84, 0.9, 0.1], [0.73, 0.8, 0.13], [0.62, 0.68, 0.09]]) {
    s.lineTo(x1, -h);
    s.lineTo(x1, -d);
    s.lineTo(x0, -d);
    s.lineTo(x0, -h);
  }
  s.lineTo(Math.cos(a0) * r, -h);
  s.absarc(0, 0, r, -a0, a0, true);
  const hole = new THREE.Path();
  hole.absarc(-0.03, 0, 0.075, 0, Math.PI * 2, false);
  s.holes.push(hole);
  const g = new THREE.ExtrudeGeometry(s, {depth: 0.045, bevelEnabled: true, bevelThickness: 0.012, bevelSize: 0.01, bevelSegments: 3, curveSegments: 32});
  g.center();
  return g;
};

export const RevealWorld = ({b}: {b: RevealBeats}) => {
  const frame = useCurrentFrame();
  const a = useAssets3D(async () => {
    await fontsReady();
    const blocks = (await (await fetch(staticFile('episodes/bitcoin-shutdown/btc-blocks-2026-10-24.json'))).json()).blocks as Array<{height: number; id: string}>;
    const oled = canvasTexture(420, 260, (ctx, w, h) => {
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = '#ffffff';
      ctx.font = `800 64px "${fonts.heading}"`;
      ctx.textAlign = 'center';
      ctx.fillText('₿', w / 2, 120);
      ctx.font = `700 34px "${fonts.mono}"`;
      ctx.fillText('KUNCI AMAN', w / 2, 200);
    });
    const label = (s: string, color: string, px = 72) => textTexture(s, {family: fonts.mono, weight: 700, px, color, tracking: 4});
    return {
      oled: oled.texture,
      glow: glowTexture(),
      blocks: blocks.slice(0, 10).map((bk) => ({height: bk.height, label: label(`#${bk.height.toLocaleString('id-ID')}`, colors.ink, 64), hash: label(`${bk.id.slice(0, 6)}…${bk.id.slice(-6)}`, '#5a6b85', 48)})),
      keyLabel: label('PRIVATE KEY', colors.blue),
    };
  }, 'reveal');
  const geo = useMemo(() => ({key: keyGeometry(), block: new THREE.BoxGeometry(0.5, 0.5, 0.5)}), []);
  const mats = useMemo(
    () => ({
      key: new THREE.MeshPhysicalMaterial({color: colors.blue, metalness: 0.85, roughness: 0.22, clearcoat: 1, clearcoatRoughness: 0.1}),
      block: new THREE.MeshPhysicalMaterial({color: '#f6f8fb', metalness: 0, roughness: 0.32, clearcoat: 0.6, clearcoatRoughness: 0.2}),
      edge: new THREE.LineBasicMaterial({color: colors.blue, transparent: true}),
      floor: new THREE.MeshStandardMaterial({color: '#e9ebef', roughness: 0.9}),
      shadow: new THREE.MeshBasicMaterial({color: '#000000', transparent: true, depthWrite: false}),
    }),
    [],
  );
  const edges = useMemo(() => new THREE.EdgesGeometry(geo.block), [geo]);
  if (!a) return null;

  const bloom = ramp(frame, b.reveal - 6, b.reveal + 10, ease.out);
  const toSpace = ramp(frame, b.sat - 16, b.sat + 2);
  const bg = mixColor(mixColor('#000000', colors.offWhite, bloom), '#000000', toSpace);
  const keyIn = ramp(frame, b.key - 2, b.key + 16, ease.out);
  const chainIn = (i: number) => ramp(frame, b.kepemilikan - 8 + i * 2, b.kepemilikan + 8 + i * 2, ease.out);
  const beam = ramp(frame, b.sat - 22, b.sat - 10, ease.out);
  const led = ledWorld();
  const lit = bloom * (1 - toSpace);
  const blockPos = (i: number): V3 => [1.5 - i * 0.95, 0.25, -1.0 - i * 1.2];
  const keys: CamKey[] = [
    // Darkness: one blue light at the same screen spot as the frozen transaction.
    {f: b.wait, pos: [led.x + 0.05, led.y + 0.02, led.z + 1.3], look: led.toArray() as V3, fov: 40, shift: -45},
    {f: b.reveal - 4, pos: [led.x + 0.06, led.y + 0.02, led.z + 1.2], look: led.toArray() as V3, fov: 40, shift: -45},
    // Bloom to off-white and pull back to the hero shot.
    {f: b.reveal + 22, pos: [1.15, 1.35, 3.7], look: [0.05, 0.9, 0], fov: 40, shift: -170, ease: 'out'},
    {f: b.key - 4, pos: [-0.85, 1.3, 3.6], look: [0.05, 0.88, 0], fov: 40, shift: -170, ease: 'linear'},
    {f: b.key + 22, pos: [0.2, 1.4, 4.0], look: [0.3, 0.82, 0], fov: 40, shift: -170},
    {f: b.kepemilikan - 6, pos: [0.3, 1.42, 4.1], look: [0.3, 0.82, 0], fov: 40, shift: -170},
    // Pull back to reveal the chain of real blocks behind.
    {f: b.kepemilikan + 40, pos: [2.9, 2.7, 6.2], look: [-1.0, 0.6, -3.6], fov: 42, shift: -120},
    {f: b.sat - 22, pos: [3.1, 2.8, 6.4], look: [-1.0, 0.6, -3.6], fov: 42, shift: -120},
    // Tilt up the beam into the dark sky.
    {f: b.sat + 2, pos: [3.0, 3.4, 5.6], look: [1.5, 9, -1.0], fov: 42, shift: 0, ease: 'in'},
  ];

  return (
    <World3D keys={keys} panels={studioPanels.light} bg={bg} envIntensity={0.05 + 0.95 * lit} exposure={1}>
      <ambientLight intensity={0.55 * lit} />
      <directionalLight position={[-3, 6, 4]} intensity={2.2 * lit} />
      <directionalLight position={[4, 3, -2]} intensity={0.8 * lit} color="#cfe0ff" />
      <mesh rotation={[-Math.PI / 2, 0, 0]} material={mats.floor} visible={lit > 0.02}>
        <planeGeometry args={[60, 60]} />
      </mesh>
      {/* Soft contact shadows */}
      {[[DEVICE_POS[0], DEVICE_POS[2], 0.9], [0.8, 0.25, 0.6]].map(([x, z, s], i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[x, 0.003, z]} scale={s}>
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial map={a.glow} color="#000000" transparent opacity={0.22 * lit} depthWrite={false} />
        </mesh>
      ))}

      <HardwareWallet screen={a.oled} position={DEVICE_POS} rotation={DEVICE_ROT} led={1} />
      {/* The LED's glow, the only light in the dark */}
      <sprite position={led} scale={0.3 + 0.05 * Math.sin(frame * 0.25)}>
        <spriteMaterial map={a.glow} color={colors.electric} transparent blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} opacity={1 - 0.6 * lit} />
      </sprite>

      {/* Private key as a physical object */}
      {keyIn > 0 && (
        <group position={[0.62, 0.5 + 0.12 * keyIn, 0.45]} rotation={[0.3, -0.5 + 0.4 * keyIn + frame * 0.004, 0.25]} scale={0.58 * keyIn}>
          <mesh geometry={geo.key} material={mats.key} />
        </group>
      )}
      <Label3D tex={a.keyLabel} height={0.07} position={[0.62, 0.24, 0.62]} opacity={ramp(frame, b.key + 8, b.key + 16) * (1 - ramp(frame, b.kepemilikan + 20, b.kepemilikan + 30))} />

      {/* The blockchain: real recent blocks, newest nearest */}
      {a.blocks.map((bk, i) => {
        const o = chainIn(i);
        if (o <= 0) return null;
        const p = blockPos(i);
        mats.edge.opacity = 0.9;
        return (
          <group key={bk.height} position={[p[0], p[1] - 0.4 * (1 - o), p[2]]} scale={o}>
            <mesh geometry={geo.block} material={mats.block} />
            <lineSegments geometry={edges} material={mats.edge} />
            {i < 9 && (
              <mesh position={[-0.475, 0, -0.6]} quaternion={LINK_Q}>
                <cylinderGeometry args={[0.025, 0.025, 1.0, 12]} />
                <meshStandardMaterial color={colors.blue} metalness={0.5} roughness={0.3} />
              </mesh>
            )}
            <Label3D tex={bk.label} height={0.11} position={[0, 0.42, 0]} opacity={o} />
          </group>
        );
      })}
      {/* Beam from the newest block into the sky (the satellite uplink) */}
      {beam > 0 && (
        <mesh position={[blockPos(0)[0], 0.5 + 10 * beam, blockPos(0)[2]]}>
          <cylinderGeometry args={[0.035, 0.035, 20 * beam, 16]} />
          <meshBasicMaterial color={colors.electric} toneMapped={false} />
        </mesh>
      )}
    </World3D>
  );
};
