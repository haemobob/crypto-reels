import {useMemo} from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import * as THREE from 'three';
import {Line2} from 'three/examples/jsm/lines/Line2.js';
import {LineGeometry} from 'three/examples/jsm/lines/LineGeometry.js';
import {LineMaterial} from 'three/examples/jsm/lines/LineMaterial.js';
import {fontsReady, textTexture, useAssets3D} from '../../three/assets';
import type {CamKey, V3} from '../../three/camera';
import {studioPanels} from '../../three/env';
import {canvasTexture, glowTexture} from '../../three/kit';
import {Label3D} from '../../three/Label3D';
import {World3D} from '../../three/World3D';
import {colors} from '../../theme/colors';
import {ease} from '../../theme/motion';
import {fonts} from '../../theme/typography';

const ramp = (f: number, a: number, b: number, e = ease.inOut) => interpolate(f, [a, b], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: e});

export type FanBeats = {range: number; bull: number; bear: number; real: number};

/** Rp10 juta compounded for ten years under JPMorgan's three bitcoin scenarios (SIMULASI). */
const SCEN = [
  {key: 'bull', rate: 0.17, color: colors.positive, label: 'RP48,1 JT', sub: 'SKENARIO BAGUS · +17%/THN'},
  {key: 'base', rate: 0.1, color: colors.electric, label: 'RP25,9 JT', sub: 'BASE · +10%/THN'},
  {key: 'bear', rate: -0.097, color: colors.negative, label: 'RP3,6 JT', sub: 'SKENARIO BURUK · −9,7%/THN'},
] as const;
const X0 = -1.0, X_PER_YEAR = 0.17, Y_PER_JT = 0.044;
const pt = (t: number, v: number) => new THREE.Vector3(X0 + t * X_PER_YEAR, v * Y_PER_JT, 0);
const N = 60;

export const FanWorld = ({b}: {b: FanBeats}) => {
  const frame = useCurrentFrame();
  const a = useAssets3D(async () => {
    await fontsReady();
    const mono = (s: string, color: string, px = 72) => textTexture(s, {family: fonts.mono, weight: 700, px, color, tracking: 5});
    const floor = canvasTexture(1024, 1024, (ctx, w, h) => {
      ctx.fillStyle = '#04080f';
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = 'rgba(41,151,255,0.14)';
      ctx.lineWidth = 2;
      for (let i = 0; i <= 16; i++) {
        ctx.beginPath(); ctx.moveTo((w * i) / 16, 0); ctx.lineTo((w * i) / 16, h); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, (h * i) / 16); ctx.lineTo(w, (h * i) / 16); ctx.stroke();
      }
    });
    floor.texture.wrapS = floor.texture.wrapT = THREE.RepeatWrapping;
    floor.texture.repeat.set(5, 5);
    return {
      glow: glowTexture(), floor: floor.texture,
      start: mono('RP10 JT', colors.text, 80),
      ends: Object.fromEntries(SCEN.map((s) => [s.key, mono(s.label, s.color, 84)])),
      subs: Object.fromEntries(SCEN.map((s) => [s.key, mono(s.sub, colors.muted, 52)])),
      years: [0, 5, 10].map((y) => mono(y === 10 ? '10 THN' : `${y}`, colors.muted, 56)),
    };
  }, 'fan');

  const lines = useMemo(() => {
    const res = new THREE.Vector2(1080, 1920);
    return SCEN.map((s) => {
      const pos: number[] = [];
      for (let i = 0; i <= N; i++) {
        const t = (10 * i) / N;
        pos.push(...pt(t, 10 * (1 + s.rate) ** t).toArray());
      }
      return new Line2(new LineGeometry().setPositions(pos), new LineMaterial({color: new THREE.Color(s.color).getHex(), linewidth: s.key === 'base' ? 5 : 7, transparent: true, resolution: res}));
    });
  }, []);
  if (!a) return null;

  const grow = {
    bull: ramp(frame, b.bull - 4, b.bull + 30, ease.inOut),
    bear: ramp(frame, b.bear - 2, b.bear + 30, ease.inOut),
    base: ramp(frame, b.bear + 30, b.bear + 52, ease.inOut),
  };
  const axis = ramp(frame, b.range, b.range + 24, ease.out);
  lines.forEach((l, k) => {
    const g = grow[SCEN[k].key];
    l.geometry.instanceCount = Math.round(N * g);
    (l.material as LineMaterial).opacity = SCEN[k].key === 'base' ? 0.75 : 1;
  });
  const tip = (k: number) => {
    const s = SCEN[k];
    const t = 10 * grow[s.key];
    return pt(t, 10 * (1 + s.rate) ** t);
  };

  const keys: CamKey[] = [
    // Close on the starting point, then dolly out as the outcomes fan apart.
    {f: b.range - 2, pos: [-0.85, 0.9, 3.4], look: [-0.95, 0.55, 0], fov: 40, shift: -110},
    {f: b.bull - 2, pos: [-0.55, 1.0, 4.4], look: [-0.6, 0.65, 0], fov: 40, shift: -110},
    {f: b.bull + 28, pos: [0.1, 1.5, 8.3], look: [0.08, 1.15, 0], fov: 40, shift: -180},
    {f: b.real, pos: [0.15, 1.45, 8.6], look: [0.08, 1.12, 0], fov: 40, shift: -180, ease: 'linear'},
  ];

  return (
    <World3D keys={keys} panels={studioPanels.dark} bg="#03070f" fog={['#03070f', 8, 22]} envIntensity={0.5}>
      <ambientLight intensity={0.3} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, -4]}>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial map={a.floor} roughness={0.6} metalness={0.2} />
      </mesh>
      {/* Time axis on the floor and value guides on a back wall */}
      <mesh position={[X0 + 5 * X_PER_YEAR * axis, 0.002, 0.02]} scale={[10 * X_PER_YEAR * axis + 0.0001, 1, 1]}>
        <boxGeometry args={[1, 0.012, 0.012]} />
        <meshBasicMaterial color={colors.muted} toneMapped={false} />
      </mesh>
      {[0, 5, 10].map((y, i) => (
        <Label3D key={y} tex={a.years[i]} height={0.07} position={[X0 + y * X_PER_YEAR, -0.1, 0.05]} opacity={ramp(frame, b.range + 6 + i * 6, b.range + 14 + i * 6)} />
      ))}
      {[10, 25, 50].map((v, i) => (
        <group key={v}>
          <mesh position={[X0 + 1.0, v * Y_PER_JT, -0.05]}>
            <boxGeometry args={[2.0, 0.004, 0.004]} />
            <meshBasicMaterial color="#1E3256" toneMapped={false} />
          </mesh>
        </group>
      ))}
      {/* Start: Rp10 juta */}
      <sprite position={pt(0, 10)} scale={0.28}>
        <spriteMaterial map={a.glow} color={colors.text} transparent blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
      </sprite>
      <Label3D tex={a.start} height={0.1} position={pt(0, 10).add(new THREE.Vector3(0.05, 0.17, 0)).toArray() as V3} opacity={ramp(frame, b.range + 4, b.range + 12)} />
      {/* The three outcomes */}
      {lines.map((l, k) => (
        <primitive key={k} object={l} />
      ))}
      {SCEN.map((s, k) => {
        const g = grow[s.key];
        if (g <= 0) return null;
        const p = tip(k);
        const done = ramp(g, 0.85, 1);
        return (
          <group key={s.key}>
            <sprite position={p} scale={0.24}>
              <spriteMaterial map={a.glow} color={s.color} transparent blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
            </sprite>
            <Label3D tex={a.ends[s.key]} height={0.13} position={[p.x + 0.44, p.y + (s.key === 'bear' ? 0.06 : 0.08), 0]} opacity={done} />
            <Label3D tex={a.subs[s.key]} height={0.06} position={[p.x + 0.44, p.y + (s.key === 'bear' ? 0.19 : -0.06), 0]} opacity={done * 0.95} />
          </group>
        );
      })}
    </World3D>
  );
};
