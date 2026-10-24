import {useMemo} from 'react';
import {interpolate, staticFile, useCurrentFrame} from 'remotion';
import * as THREE from 'three';
import {Line2} from 'three/examples/jsm/lines/Line2.js';
import {LineGeometry} from 'three/examples/jsm/lines/LineGeometry.js';
import {LineMaterial} from 'three/examples/jsm/lines/LineMaterial.js';
import {fontsReady, loadImage, textTexture, toTexture, useAssets3D} from '../../../three/assets';
import type {CamKey, V3} from '../../../three/camera';
import {HomeDish, Satellite} from '../../../three/devices';
import {Earth, latLon} from '../../../three/Earth';
import {studioPanels} from '../../../three/env';
import {canvasTexture, glowTexture, rng} from '../../../three/kit';
import {Label3D} from '../../../three/Label3D';
import {World3D} from '../../../three/World3D';
import {colors} from '../../../theme/colors';
import {ease} from '../../../theme/motion';
import {fonts} from '../../../theme/typography';

const ramp = (f: number, a: number, b: number, e = ease.inOut) => interpolate(f, [a, b], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: e});
const dir = (p: string) => staticFile(`episodes/bitcoin-shutdown/${p}`);

export type SpaceBeats = {sat: number; satsend: number; exchange: number};

const R = 2;
/** Telstar 18V's slot (138°E over the equator), drawn much closer than true GEO so both fit the frame. */
const SAT = latLon(0, 138, 4.4);
const SAT_Q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, -1, 0), SAT.clone().negate().normalize());
const FOOT = latLon(-4, 120, R); // centre of the broadcast footprint (Indonesia, Asia-Pacific)
const GROUND = new THREE.Vector3(200, 0, 0);
const DISH = GROUND.clone().add(new THREE.Vector3(0, 0.55, 0));

export const SpaceWorld = ({b}: {b: SpaceBeats}) => {
  const frame = useCurrentFrame();
  const a = useAssets3D(async () => {
    await fontsReady();
    const [day, night, clouds, hero] = await Promise.all([loadImage(dir('earth-day-2048.jpg')), loadImage(dir('earth-night-3600.jpg')), loadImage(dir('earth-clouds-2048.jpg')), loadImage(dir('blockstream-hero.png'))]);
    const node = canvasTexture(640, 400, (ctx, w, h) => {
      ctx.fillStyle = '#050b18';
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = colors.positive;
      ctx.font = `800 54px "${fonts.mono}"`;
      ctx.fillText('BLOK DITERIMA', 40, 120);
      ctx.fillStyle = '#ffffff';
      ctx.font = `800 76px "${fonts.heading}"`;
      ctx.fillText('#972.911', 40, 230);
      ctx.fillStyle = '#7f93b3';
      ctx.font = `600 32px "${fonts.mono}"`;
      ctx.fillText('via satelit · tanpa internet', 40, 320);
    });
    const label = (s: string, color: string) => textTexture(s, {family: fonts.mono, weight: 700, px: 72, color, tracking: 6});
    // Stars on a far sphere (seeded, so every render matches).
    const r = rng(17);
    const starPos = new Float32Array(2400 * 3);
    for (let i = 0; i < 2400; i++) {
      const u = r() * 2 - 1, th = r() * Math.PI * 2, sr = Math.sqrt(1 - u * u);
      starPos.set([70 * sr * Math.cos(th), 70 * u, 70 * sr * Math.sin(th)], i * 3);
    }
    const stars = new THREE.BufferGeometry();
    stars.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    return {
      day: toTexture(day), night: toTexture(night), clouds: toTexture(clouds), hero: {texture: toTexture(hero), aspect: hero.width / hero.height},
      node: node.texture, glow: glowTexture(), stars,
      t: {one: label('SATU ARAH', colors.negative), other: label('JALUR LAIN', colors.light), otherSub: label('(MIS. INTERNET)', colors.muted), receive: label('TERIMA ✓', colors.positive)},
    };
  }, 'space');

  const lines = useMemo(() => {
    const res = new THREE.Vector2(1080, 1920);
    // The alternative path for sending: a dashed route off along the rooftop.
    const pts: number[] = [];
    for (let k = 0; k <= 20; k++) pts.push(...GROUND.clone().add(new THREE.Vector3(1.0 + k * 0.08, 0.3, 0.05 - k * 0.1)).toArray());
    const alt = new Line2(new LineGeometry().setPositions(pts), new LineMaterial({color: 0x75c7ff, linewidth: 3, dashed: true, dashSize: 0.18, gapSize: 0.12, transparent: true, resolution: res}));
    alt.computeLineDistances();
    return {alt};
  }, []);
  const coneGeo = useMemo(() => {
    const h = SAT.distanceTo(FOOT);
    const g = new THREE.ConeGeometry(1.25, h, 64, 1, true);
    g.translate(0, -h / 2, 0);
    return g;
  }, []);
  if (!a) return null;

  // ---- Timeline ----
  const fadeIn = ramp(frame, b.sat - 2, b.sat + 10);
  const cone = ramp(frame, b.sat + 26, b.sat + 44, ease.out);
  const toGround = b.sat + 104;
  const ground = frame >= toGround;
  const attempt = ramp(frame, b.satsend + 10, b.satsend + 34);
  const blocked = frame >= b.satsend + 34;
  const altPath = ramp(frame, b.satsend + 44, b.satsend + 70, ease.out);
  (lines.alt.material as LineMaterial).opacity = altPath;
  lines.alt.geometry.instanceCount = Math.max(0, Math.round(20 * altPath));
  const coneQ = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, -1, 0), FOOT.clone().sub(SAT).normalize());
  const sun: [number, number, number] = latLon(8, 172, 1).toArray() as [number, number, number];

  const out = (p: THREE.Vector3, d: number) => p.clone().normalize().multiplyScalar(d);
  const tangent = new THREE.Vector3(0, 1, 0).cross(SAT.clone().normalize()).normalize();
  const camA = out(SAT, 7.4).add(tangent.clone().multiplyScalar(2.4)).add(new THREE.Vector3(0, 1.4, 0));
  const camB = out(SAT, 7.2).add(tangent.clone().multiplyScalar(-2.6)).add(new THREE.Vector3(0, 1.0, 0));
  const camC = SAT.clone().lerp(FOOT, 0.45).add(tangent.clone().multiplyScalar(0.9));
  const keys: CamKey[] = [
    // Orbital reveal around the satellite, the Earth filling the background.
    {f: b.sat, pos: camA.toArray() as V3, look: SAT.toArray() as V3, fov: 42, shift: -120},
    {f: b.sat + 56, pos: camB.toArray() as V3, look: SAT.clone().lerp(FOOT, 0.25).toArray() as V3, fov: 42, shift: -120, ease: 'inOut'},
    // Follow the signal down to the ground.
    {f: toGround - 1, pos: camC.toArray() as V3, look: FOOT.toArray() as V3, fov: 42, shift: -60, ease: 'in'},
    // Rooftop receiver: low angle up the beam, then the node's screen.
    {f: toGround, pos: GROUND.clone().add(new THREE.Vector3(1.2, 1.5, 3.2)).toArray() as V3, look: GROUND.clone().add(new THREE.Vector3(0.35, 1.0, 0)).toArray() as V3, fov: 42, shift: -120},
    {f: b.satsend - 6, pos: GROUND.clone().add(new THREE.Vector3(1.6, 1.4, 3.0)).toArray() as V3, look: GROUND.clone().add(new THREE.Vector3(0.4, 0.85, 0)).toArray() as V3, fov: 42, shift: -120},
    // Pull back so the dish, the blocked return, the receiver and the alternative path (with both labels) all fit.
    {f: b.satsend + 40, pos: GROUND.clone().add(new THREE.Vector3(0.6, 2.1, 7.0)).toArray() as V3, look: GROUND.clone().add(new THREE.Vector3(0.85, 0.7, -0.8)).toArray() as V3, fov: 44, shift: -60},
    {f: b.exchange + 2, pos: GROUND.clone().add(new THREE.Vector3(0.62, 2.05, 6.6)).toArray() as V3, look: GROUND.clone().add(new THREE.Vector3(0.85, 0.7, -0.8)).toArray() as V3, fov: 44, shift: -60},
  ];

  const pulse = (k: number, speed: number) => ((frame * speed + k) % 1 + 1) % 1;

  return (
    <World3D keys={keys} panels={studioPanels.dark} envIntensity={0.7} exposure={1.1} style={{opacity: fadeIn}}>
      <points geometry={a.stars}>
        <pointsMaterial color="#ffffff" size={0.12} sizeAttenuation transparent opacity={0.8} />
      </points>
      <ambientLight intensity={0.15} />
      <directionalLight position={new THREE.Vector3(...sun).multiplyScalar(10).toArray() as V3} intensity={2.6} />

      {!ground && (
        <group>
          <Earth radius={R} day={a.day} night={a.night} clouds={a.clouds} sun={sun} nightGain={1.2} dayGain={1.05} atmosphereStrength={1.5} />
          <Satellite position={SAT} quaternion={SAT_Q} scale={0.5} />
          {/* Uplink from the ground station (the beam from the ledger) */}
          <mesh position={SAT.clone().lerp(latLon(-22, 132, R), 0.5)} quaternion={new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), SAT.clone().sub(latLon(-22, 132, R)).normalize())}>
            <cylinderGeometry args={[0.012, 0.012, SAT.distanceTo(latLon(-22, 132, R)), 8]} />
            <meshBasicMaterial color={colors.electric} toneMapped={false} transparent opacity={1 - cone * 0.6} />
          </mesh>
          {/* Broadcast footprint over Asia-Pacific */}
          {cone > 0 && (
            <group position={SAT} quaternion={coneQ}>
              <mesh geometry={coneGeo}>
                <meshBasicMaterial color={colors.electric} transparent opacity={0.13 * cone} side={THREE.DoubleSide} depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
              </mesh>
              {[0, 0.33, 0.66].map((k) => {
                const p = pulse(k, 0.02);
                const h = SAT.distanceTo(FOOT);
                return (
                  <mesh key={k} position={[0, -h * p, 0]} rotation={[Math.PI / 2, 0, 0]}>
                    <ringGeometry args={[1.25 * p * 0.97, 1.25 * p, 64]} />
                    <meshBasicMaterial color={colors.light} transparent opacity={0.6 * cone * (1 - p)} side={THREE.DoubleSide} depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
                  </mesh>
                );
              })}
            </group>
          )}
        </group>
      )}

      {ground && (
        <group>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={GROUND.toArray() as V3}>
            <planeGeometry args={[30, 30]} />
            <meshStandardMaterial color="#14171d" roughness={0.92} />
          </mesh>
          <spotLight position={GROUND.clone().add(new THREE.Vector3(-1.5, 3, 2)).toArray() as V3} angle={0.6} penumbra={0.8} intensity={10} color="#cfe0ff" />
          <HomeDish position={DISH} rotation={[-0.25, 0, 0.2]} />
          {/* Beam from the sky into the dish */}
          <mesh position={DISH.clone().add(new THREE.Vector3(0, 6, 0)).toArray() as V3}>
            <cylinderGeometry args={[0.06, 0.32, 12, 32, 1, true]} />
            <meshBasicMaterial color={colors.electric} transparent opacity={0.22} side={THREE.DoubleSide} depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
          </mesh>
          {[0, 0.5].map((k) => (
            <sprite key={k} position={DISH.clone().add(new THREE.Vector3(0, 6 - 6 * pulse(k, 0.035), 0)).toArray() as V3} scale={0.35}>
              <spriteMaterial map={a.glow} color={colors.light} transparent blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
            </sprite>
          ))}
          {/* Node box with its screen */}
          <mesh position={GROUND.clone().add(new THREE.Vector3(0.75, 0.18, 0.1)).toArray() as V3}>
            <boxGeometry args={[0.55, 0.36, 0.4]} />
            <meshStandardMaterial color="#1d222b" roughness={0.5} metalness={0.3} />
          </mesh>
          <mesh position={GROUND.clone().add(new THREE.Vector3(0.75, 0.6, 0.12)).toArray() as V3} rotation={[-0.15, -0.25, 0]}>
            <planeGeometry args={[0.64, 0.4]} />
            <meshBasicMaterial map={a.node} toneMapped={false} />
          </mesh>
          <Label3D tex={a.t.receive} height={0.12} position={GROUND.clone().add(new THREE.Vector3(0.75, 0.98, 0.15)).toArray() as V3} opacity={ramp(frame, toGround + 10, toGround + 18) * (1 - ramp(frame, b.satsend + 4, b.satsend + 12))} />
          {/* Trying to send back up: the pulse stops — the satellite link is one-way */}
          {attempt > 0 && !blocked && (
            <sprite position={DISH.clone().add(new THREE.Vector3(0, 0.3 + 0.8 * attempt, 0)).toArray() as V3} scale={0.3}>
              <spriteMaterial map={a.glow} color={colors.negative} transparent blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
            </sprite>
          )}
          <Label3D tex={a.t.one} height={0.13} position={DISH.clone().add(new THREE.Vector3(0.5, 1.0, 0.25)).toArray() as V3} opacity={blocked ? ramp(frame, b.satsend + 34, b.satsend + 42) : 0} />
          <primitive object={lines.alt} />
          <Label3D tex={a.t.other} height={0.11} position={GROUND.clone().add(new THREE.Vector3(1.6, 0.8, -0.9)).toArray() as V3} opacity={altPath} />
          <Label3D tex={a.t.otherSub} height={0.08} position={GROUND.clone().add(new THREE.Vector3(1.6, 0.66, -0.9)).toArray() as V3} opacity={altPath} />
        </group>
      )}
    </World3D>
  );
};
