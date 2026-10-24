import {useMemo} from 'react';
import {interpolate, staticFile, useCurrentFrame} from 'remotion';
import * as THREE from 'three';
import {fontsReady, loadImage, textTexture, toTexture, useAssets3D} from '../../../three/assets';
import {BitcoinCoin} from '../../../three/BitcoinCoin';
import type {CamKey, V3} from '../../../three/camera';
import {HardwareWallet, Monitor} from '../../../three/devices';
import {Line2} from 'three/examples/jsm/lines/Line2.js';
import {LineGeometry} from 'three/examples/jsm/lines/LineGeometry.js';
import {LineMaterial} from 'three/examples/jsm/lines/LineMaterial.js';
import {Earth} from '../../../three/Earth';
import {studioPanels} from '../../../three/env';
import {canvasTexture, glowTexture, svgShapes} from '../../../three/kit';
import {Label3D} from '../../../three/Label3D';
import {drawExchange} from '../../../three/screens';
import {World3D} from '../../../three/World3D';
import {colors} from '../../../theme/colors';
import {ease} from '../../../theme/motion';
import {fonts} from '../../../theme/typography';
import {rackTexture} from './textures';

const ramp = (f: number, a: number, b: number, e = ease.inOut) => interpolate(f, [a, b], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: e});

export type FinalBeats = {exchange: number; access: number; sum: number; final: number; final2: number; end: number};

const WALLET_POS: V3 = [-0.7, 0.1, 0];
const MONITOR_POS: V3 = [0.7, -0.42, 0];

export const FinalWorld = ({b}: {b: FinalBeats}) => {
  const frame = useCurrentFrame();
  const a = useAssets3D(async () => {
    await fontsReady();
    const night = await loadImage(staticFile('episodes/bitcoin-shutdown/earth-night-3600.jpg'));
    const oled = canvasTexture(420, 260, (ctx, w, h) => {
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = '#fff';
      ctx.textAlign = 'center';
      ctx.font = `800 64px "${fonts.heading}"`;
      ctx.fillText('₿', w / 2, 120);
      ctx.font = `700 34px "${fonts.mono}"`;
      ctx.fillText('KUNCI AMAN', w / 2, 200);
    });
    const exchange = canvasTexture(1000, 584, (ctx, w, h) => drawExchange(ctx, w, h, 0));
    const label = (s: string, color: string, px = 72) => textTexture(s, {family: fonts.mono, weight: 700, px, color, tracking: 6});
    return {
      night: toTexture(night), oled: oled.texture, exchange, glow: glowTexture(), rack: rackTexture(),
      symbol: await svgShapes(staticFile('episodes/bitcoin-shutdown/bitcoin-symbol.svg'), '#FFF'),
      t: {self: label('SELF-CUSTODY', colors.light), selfSub: label('KUNCI DI TANGAN LO', '#FFFFFF', 60), send1: label('KIRIM TETAP', colors.muted, 60), send2: label('BUTUH JARINGAN', colors.muted, 60), ex: label('EXCHANGE', colors.negative), exSub: label('KUNCI DI TANGAN MEREKA', '#FFFFFF', 60)},
    };
  }, 'final');
  // Connection lines from each device back into the global network (they fade at the end).
  const links = useMemo(() => {
    const res = new THREE.Vector2(1080, 1920);
    const ends: Array<[V3, V3]> = [[[-0.7, 0.6, 0], [-4.5, 3.2, -14]], [[-0.7, 0.6, 0], [-1.5, 4.6, -15]], [[0.7, 0.3, 0], [3.8, 3.6, -14]], [[0.7, 0.3, 0], [1.2, 4.9, -15]], [[0.7, 0.3, 0], [5.2, 1.2, -13]], [[-0.7, 0.6, 0], [-5.4, 0.8, -13]]];
    return ends.map(([p, q]) => {
      const a = new THREE.Vector3(...p), b = new THREE.Vector3(...q);
      const mid = a.clone().lerp(b, 0.5).add(new THREE.Vector3(0, 1.6, 0));
      const pts = new THREE.QuadraticBezierCurve3(a, mid, b).getPoints(40).flatMap((v) => v.toArray());
      return new Line2(new LineGeometry().setPositions(pts), new LineMaterial({color: 0x2997ff, linewidth: 2, transparent: true, resolution: res, depthWrite: false}));
    });
  }, []);
  const rackMat = useMemo(() => (a ? new THREE.MeshStandardMaterial({map: a.rack, roughness: 0.6, metalness: 0.4}) : null), [a]);
  if (!a || !rackMat) return null;

  a.exchange.redraw((ctx, w, h) => drawExchange(ctx, w, h, frame * 0.25));
  const devices = 1 - ramp(frame, b.final - 10, b.final + 30);
  const labels = ramp(frame, b.exchange + 8, b.exchange + 20) * (1 - ramp(frame, b.sum - 6, b.sum + 6));
  const serversRed = ramp(frame, b.access + 4, b.access + 16);
  const world = ramp(frame, b.sum - 4, b.sum + 30);
  const linesFade = 1 - ramp(frame, b.final, b.final + 40);
  const coin = ramp(frame, b.sum + 40, b.final + 6, ease.out);
  links.forEach((l, k) => {
    (l.material as LineMaterial).opacity = 0.75 * ramp(frame, b.sum + 6 + k * 3, b.sum + 20 + k * 3) * linesFade;
  });
  const globeLights = 0.75 * world * (1 - 0.85 * ramp(frame, b.final, b.final2));

  const keys: CamKey[] = [
    // Two-shot: self-custody (left) vs exchange (right), a slow push; then a push onto the failing exchange.
    {f: b.exchange, pos: [0.0, 0.3, 7.4], look: [0.0, -0.1, 0], fov: 40, shift: -150},
    {f: b.access - 4, pos: [0.0, 0.32, 7.2], look: [0.0, -0.1, 0], fov: 40, shift: -150, ease: 'linear'},
    {f: b.access + 18, pos: [0.75, 0.1, 4.2], look: [0.75, -0.2, 0], fov: 40, shift: -150},
    {f: b.sum - 2, pos: [0.8, 0.1, 4.0], look: [0.75, -0.2, 0], fov: 40, shift: -150},
    // Pull back: both devices inside the dark global network, the coin rising between them.
    {f: b.sum + 46, pos: [0, 1.0, 13.5], look: [0, 0.3, -4], fov: 40, shift: -150},
    {f: b.final, pos: [0, 0.8, 12.0], look: [0, 0.2, -4], fov: 40, shift: -150, ease: 'linear'},
    // Only the coin remains: a slow push to the end.
    {f: b.end, pos: [0, 0.12, 7.0], look: [0, 0.02, 0], fov: 40, shift: -160},
  ];

  return (
    <World3D keys={keys} panels={studioPanels.dark} envIntensity={0.25 + 0.6 * coin} exposure={1.05}>
      <ambientLight intensity={0.4 * devices} />
      <directionalLight position={[-3, 4, 5]} intensity={2.4 * devices} />
      <directionalLight position={[3, 2, 4]} intensity={1.0 * devices} color="#cfe0ff" />
      {links.map((l, k) => (
        <primitive key={k} object={l} />
      ))}
      <pointLight position={[1.2, 1.5, 2.5]} color={colors.electric} intensity={18 * coin} distance={9} />
      <pointLight position={[-1.5, -0.8, 2]} color="#ffd9a0" intensity={10 * coin} distance={8} />

      {/* The global network behind, then fading */}
      <Earth radius={6} night={a.night} nightGain={globeLights} atmosphereStrength={1.3 * world * (0.4 + 0.6 * linesFade)} position={[0, -1.5, -14]} rotation={[0.3, -1.2, 0]} />

      {/* Self-custody vs exchange */}
      <group visible={devices > 0.01}>
        <HardwareWallet screen={a.oled} position={WALLET_POS} rotation={[-0.05, 0.3, 0]} scale={1.05} led={devices} />
        <Monitor screen={a.exchange.texture} position={MONITOR_POS} rotation={[0, -0.3, 0]} scale={0.72} />
        {/* The exchange's own servers behind its screen */}
        {[0, 1, 2].map((k) => (
          <group key={k} position={[1.1 + k * 0.62, -0.15, -2.0]}>
            <mesh>
              <boxGeometry args={[0.6, 1.5, 0.8]} />
              <meshStandardMaterial color="#151a22" roughness={0.5} metalness={0.6} />
            </mesh>
            <mesh position={[0, 0, 0.401]} material={rackMat}>
              <planeGeometry args={[0.56, 1.45]} />
            </mesh>
            {Array.from({length: 8}, (_, u) => (
              <mesh key={u} position={[0.18, -0.6 + u * 0.17, 0.41]}>
                <boxGeometry args={[0.03, 0.03, 0.01]} />
                <meshBasicMaterial color={new THREE.Color(colors.electric).lerp(new THREE.Color(colors.negative), serversRed).multiplyScalar(Math.sin(frame * 0.7 + u + k) > 0 || serversRed < 0.5 ? 1 : 0.3)} toneMapped={false} />
              </mesh>
            ))}
          </group>
        ))}
        <pointLight position={[1.7, 0.2, -1.2]} color={colors.negative} intensity={8 * serversRed} distance={4} />
        <Label3D tex={a.t.self} height={0.13} position={[WALLET_POS[0], -0.66, 0.3]} opacity={labels} />
        <Label3D tex={a.t.selfSub} height={0.085} position={[WALLET_POS[0], -0.84, 0.3]} opacity={labels} />
        <Label3D tex={a.t.send1} height={0.085} position={[WALLET_POS[0], -0.99, 0.3]} opacity={labels} />
        <Label3D tex={a.t.send2} height={0.085} position={[WALLET_POS[0], -1.1, 0.3]} opacity={labels} />
        <Label3D tex={a.t.ex} height={0.13} position={[MONITOR_POS[0], -0.66, 0.3]} opacity={labels} />
        <Label3D tex={a.t.exSub} height={0.085} position={[MONITOR_POS[0], -0.84, 0.3]} opacity={labels} />
      </group>

      {/* The Bitcoin coin returns: the only thing still lit */}
      {coin > 0 && (
        <group position={[0, 0.05 - 0.4 * (1 - coin), 0.4]} scale={0.9 * coin}>
          <BitcoinCoin symbol={a.symbol} rotation={[0.05, -0.25 + Math.sin(frame / 40) * 0.08, 0]} />
          <sprite scale={4} position={[0, 0, -0.6]}>
            <spriteMaterial map={a.glow} color={colors.blue} transparent opacity={0.25 * coin} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
          </sprite>
        </group>
      )}
    </World3D>
  );
};
