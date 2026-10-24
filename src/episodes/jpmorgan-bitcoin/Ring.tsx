import {useMemo} from 'react';
import {interpolate, staticFile, useCurrentFrame} from 'remotion';
import * as THREE from 'three';
import {fontsReady, textTexture, useAssets3D} from '../../three/assets';
import {BitcoinCoin} from '../../three/BitcoinCoin';
import type {CamKey} from '../../three/camera';
import {studioPanels} from '../../three/env';
import {glowTexture, svgShapes} from '../../three/kit';
import {Label3D} from '../../three/Label3D';
import {World3D} from '../../three/World3D';
import {colors} from '../../theme/colors';
import {ease} from '../../theme/motion';
import {fonts} from '../../theme/typography';

const ramp = (f: number, a: number, b: number, e = ease.inOut) => interpolate(f, [a, b], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: e});

/** An annular sector, extruded upward (y), lying on the floor. */
const sector = (r0: number, r1: number, a0: number, a1: number, h: number) => {
  const s = new THREE.Shape();
  s.absarc(0, 0, r1, a0, a1, false);
  s.absarc(0, 0, r0, a1, a0, true);
  const g = new THREE.ExtrudeGeometry(s, {depth: h, bevelEnabled: true, bevelThickness: 0.015, bevelSize: 0.015, bevelSegments: 3, curveSegments: 64});
  g.rotateX(-Math.PI / 2);
  return g;
};

const GAP = 0.03;
/** JPMorgan's headline model: a USD 60/40 stock-bond portfolio. */
const SLICES = [
  {key: 'stocks', share: 0.6, color: colors.blue, label: 'SAHAM 60%'},
  {key: 'bonds', share: 0.4, color: '#5aa9ff', label: 'OBLIGASI 40%'},
] as const;

export const RingWorld = ({b}: {b: {model: number; payoff: number}}) => {
  const frame = useCurrentFrame();
  const a = useAssets3D(async () => {
    await fontsReady();
    const mono = (s: string, color: string, px = 72) => textTexture(s, {family: fonts.mono, weight: 700, px, color, tracking: 5});
    return {
      glow: glowTexture(),
      symbol: await svgShapes(staticFile('episodes/jpmorgan-bitcoin/bitcoin-symbol.svg'), '#FFF'),
      labels: Object.fromEntries(SLICES.map((s) => [s.key, mono(s.label, colors.text)])),
      btc: mono('BELUM MASUK', '#F2A33A', 64),
    };
  }, 'ring');
  const geo = useMemo(() => {
    let a0 = Math.PI * 0.5;
    return SLICES.map((s) => {
      const a1 = a0 - s.share * Math.PI * 2;
      const g = sector(0.62, 1.15, a1 + GAP, a0 - GAP, 0.22);
      const mid = (a0 + a1) / 2;
      a0 = a1;
      return {g, mid};
    });
  }, []);
  if (!a) return null;

  const build = (k: number) => ramp(frame, b.model + k * 8, b.model + 18 + k * 8, ease.out);
  const coinIn = ramp(frame, b.model + 14, b.model + 32, ease.out);
  const keys: CamKey[] = [
    {f: b.model, pos: [0.95, 5.2, 8.4], look: [0.45, 0.1, 0], fov: 40, shift: -120},
    {f: b.payoff + 2, pos: [0.55, 4.9, 8.1], look: [0.45, 0.15, 0], fov: 40, shift: -120, ease: 'linear'},
  ];

  return (
    <World3D keys={keys} panels={studioPanels.dark} bg="#03070f" envIntensity={0.7}>
      <ambientLight intensity={0.3} />
      <directionalLight position={[-2, 5, 4]} intensity={1.8} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <circleGeometry args={[6, 64]} />
        <meshStandardMaterial color="#060c18" roughness={0.7} />
      </mesh>
      {SLICES.map((s, k) => {
        const g = build(k);
        if (g <= 0) return null;
        const {mid} = geo[k];
        return (
          <group key={s.key}>
            <mesh geometry={geo[k].g} scale={[1, g, 1]}>
              <meshPhysicalMaterial color={s.color} metalness={0.3} roughness={0.3} clearcoat={0.6} />
            </mesh>
            <Label3D tex={a.labels[s.key]} height={0.17} position={[Math.cos(mid) * 0.9, 0.45, -Math.sin(mid) * 0.9]} opacity={ramp(g, 0.6, 1)} />
          </group>
        );
      })}
      {/* Bitcoin waits outside the ring */}
      {coinIn > 0 && (
        <group position={[1.55, 0.45 + 0.05 * Math.sin(frame / 14), 1.05]}>
          <BitcoinCoin symbol={a.symbol} scale={0.26 * coinIn} rotation={[0, -0.6 + frame * 0.01, 0]} />
          <sprite scale={0.9} position={[0, 0, -0.15]}>
            <spriteMaterial map={a.glow} color="#F2A33A" transparent opacity={0.25 * coinIn} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
          </sprite>
          <Label3D tex={a.btc} height={0.12} position={[0, -0.45, 0.1]} opacity={ramp(frame, b.model + 26, b.model + 36)} />
        </group>
      )}
    </World3D>
  );
};
