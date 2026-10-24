import {useMemo} from 'react';
import {interpolate, staticFile, useCurrentFrame} from 'remotion';
import * as THREE from 'three';
import {MeshSurfaceSampler} from 'three/examples/jsm/math/MeshSurfaceSampler.js';
import {fontsReady, loadImage, textTexture, useAssets3D} from '../../../three/assets';
import type {CamKey, V3} from '../../../three/camera';
import {studioPanels} from '../../../three/env';
import {glowTexture, loadFont, rng, text3D} from '../../../three/kit';
import {Label3D} from '../../../three/Label3D';
import {World3D} from '../../../three/World3D';
import {colors} from '../../../theme/colors';
import {ease} from '../../../theme/motion';
import {fonts} from '../../../theme/typography';
import {bokehWall, clippingTexture, floorTexture, PAGE, pageTexture, rackTexture, siteTexture} from './textures';

const dir = (p: string) => staticFile(`episodes/bitcoin-shutdown/${p}`);
const ramp = (f: number, a: number, b: number, e = ease.inOut) => interpolate(f, [a, b], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: e});

export type NewsBeats = {uk: number; baru: number; days: number; ukinet: number; php: number; jutaan: number; offline: number; notend: number; imagine: number; pos: number};

// ---- Layout -------------------------------------------------------------------------------------
/** Page: 1 px = 1 mm (0.001 units), centred on the origin. */
const PW = PAGE.w / 1000, PH = PAGE.h / 1000;
const pagePt = (x: number, y: number): [number, number] => [x / 1000 - PW / 2, PH / 2 - y / 1000];
/** Highlight rectangles on the page (pixel coords measured from the crops). */
const HL = {
  date: {x0: 60 + 230, x1: 60 + 478, y: PAGE.head.y + 1190, h: 40},
  days: [{x0: 60 + 66, x1: 60 + 462, y: PAGE.days.y + 141, h: 42}],
  power: [{x0: 60 + 760, x1: 60 + 1232, y: PAGE.power.y + 146, h: 42}, {x0: 60 + 66, x1: 60 + 212, y: PAGE.power.y + 195, h: 36}],
};
const DOC_POS: V3 = [-0.25, 0, 0];
const DOC_AWAY: V3 = [-0.45, -1.75, 0.9];
/** The page's gentle curl (shared by the page and its highlights). */
const curlZ = (x: number, y: number) => {
  const nx = x / (PW / 2), ny = y / (PH / 2);
  return 0.035 * nx * nx + 0.025 * Math.max(0, nx) * Math.max(0, ny) ** 3;
};
/** A highlight strip that follows the curl. */
const curlStrip = (x0: number, w: number, y: number, h: number) => {
  const g = new THREE.PlaneGeometry(w, h, 12, 1);
  const p = g.attributes.position;
  for (let i = 0; i < p.count; i++) p.setZ(i, curlZ(x0 + w / 2 + p.getX(i), y) + 0.004);
  return g;
};
/** Highlight boxes on a clipping card: pixel rects inside the crop, card width in world units. */
const cardStrip = (card: {aspect: number; pad: number}, cardW: number, imgW: number, r: {x0: number; x1: number; y0: number; y1: number}, k: number) => {
  const W = imgW + card.pad * 2, H = W / card.aspect, u = cardW / W;
  const w = (r.x1 - r.x0) * u * k;
  return {w, h: (r.y1 - r.y0 + 10) * u, x: -cardW / 2 + (card.pad + r.x0) * u + w / 2, y: (H / 2 - card.pad - (r.y0 + r.y1) / 2) * u};
};
const MONUMENT_Z = -3.4;

const RACKS = 20, RACK_DZ = 0.68, RACK_Z0 = -9.6, AISLE_X = 0.8;
const LED_PER_RACK = 32;
const ledLayout = () => {
  const out: Array<{p: THREE.Vector3; rack: number; side: number}> = [];
  for (const side of [-1, 1])
    for (let r = 0; r < RACKS; r++) {
      const z = RACK_Z0 - r * RACK_DZ;
      for (let u = 0; u < 8; u++) {
        const y = 0.22 + u * 0.25;
        for (const dz of [-0.22, -0.18, -0.14, 0.21]) out.push({p: new THREE.Vector3(side * (AISLE_X - 0.01), y, z + dz * side), rack: r + (side > 0 ? RACKS : 0), side});
      }
    }
  return out;
};
// Website cards all sit beyond the NCSC clipping, so each piece of evidence reads alone.
const CARDS = [
  {p: [-0.42, 1.6, -19.6], r: 0.14}, {p: [0.48, 0.95, -19.2], r: -0.15}, {p: [-0.38, 0.95, -20.6], r: 0.1},
  {p: [0.45, 1.65, -21.2], r: -0.1}, {p: [-0.4, 1.4, -22.4], r: 0.12}, {p: [0.3, 1.45, -18.3], r: -0.05},
] as Array<{p: V3; r: number}>;
const HERO_CARD = 5;
const GUARDIAN_POS: V3 = [0, 1.32, -11.0];
const NCSC_POS: V3 = [0, 1.32, -15.2];

export const NewsServerWorld = ({b}: {b: NewsBeats}) => {
  const frame = useCurrentFrame();
  const a = useAssets3D(async () => {
    await fontsReady();
    const [head, power, days, guardian, byline, ncsc, font] = await Promise.all([
      loadImage(dir('govuk-head.png')), loadImage(dir('govuk-power.png')), loadImage(dir('govuk-3days.png')),
      loadImage(dir('guardian-head.png')), loadImage(dir('guardian-byline.png')), loadImage(dir('ncsc-alert.png')),
      loadFont(staticFile('fonts/typeface/InterTight-800.json')),
    ]);
    const chip = (s: string, color: string) => textTexture(s, {family: fonts.mono, weight: 700, px: 72, color, tracking: 6});
    return {
      page: pageTexture(head, power, days),
      rack: rackTexture(),
      floor: floorTexture(),
      sites: [0, 1, 2, 3, 4, 5].map((i) => siteTexture(i, false)),
      error: [0, 1, 2, 3, 4, 5].map((i) => siteTexture(i, true, i === HERO_CARD)),
      guardian: clippingTexture(guardian, byline, 'THE GUARDIAN · 22 OKT 2026'),
      ncsc: clippingTexture(ncsc, null, 'NCSC-NL · 21 OKT 2026, DIPERBARUI 23 OKT'),
      bokeh: bokehWall(11, ['#1677FF', '#75C7FF', '#ffffff', '#FF5263']),
      glow: glowTexture(),
      g72: text3D(font, '72', {size: 2.9, depth: 0.55, bevel: 0.05}),
      gJam: text3D(font, 'JAM', {size: 1.05, depth: 0.3, bevel: 0.03}),
      chips: {
        listrik: chip('LISTRIK', colors.muted), air: chip('AIR', colors.muted), telepon: chip('TELEPON', colors.muted), internet: chip('INTERNET', colors.light),
        sub: textTexture('PERSIAPAN MENGHADAPI GANGGUAN LAYANAN', {family: fonts.mono, weight: 700, px: 64, color: colors.text, tracking: 4}),
      },
    };
  }, 'news-server');

  const mats = useMemo(() => {
    if (!a) return null;
    const cap = new THREE.MeshPhysicalMaterial({color: '#0e1a33', metalness: 0.85, roughness: 0.3, emissive: new THREE.Color(colors.blue), emissiveIntensity: 0.35, transparent: true});
    const side = new THREE.MeshPhysicalMaterial({color: '#a9c3e6', metalness: 1, roughness: 0.22, transparent: true});
    const page = new THREE.MeshStandardMaterial({map: a.page, roughness: 0.88, metalness: 0, side: THREE.DoubleSide});
    const rack = new THREE.MeshStandardMaterial({color: '#151a22', roughness: 0.55, metalness: 0.6});
    const rackFront = new THREE.MeshStandardMaterial({map: a.rack, roughness: 0.6, metalness: 0.4});
    a.floor.repeat.set(4, 40);
    const floor = new THREE.MeshStandardMaterial({map: a.floor, roughness: 0.22, metalness: 0.65, transparent: true, opacity: 0.9});
    return {cap, side, page, rack, rackFront, floor};
  }, [a]);

  const geo = useMemo(() => {
    if (!a) return null;
    const page = new THREE.PlaneGeometry(PW, PH, 40, 40);
    const p = page.attributes.position;
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i) / (PW / 2), y = p.getY(i) / (PH / 2);
      p.setZ(i, curlZ(x * (PW / 2), y * (PH / 2)));
    }
    page.computeVertexNormals();
    // "72" surface samples → server LEDs (the dissolve).
    const leds = ledLayout();
    const mesh72 = new THREE.Mesh(a.g72);
    mesh72.position.set(0.1, 1.55, MONUMENT_Z);
    mesh72.updateMatrixWorld();
    const sampler = new MeshSurfaceSampler(mesh72).build();
    const r = rng(5);
    const tmp = new THREE.Vector3();
    const starts = leds.map(() => {
      sampler.sample(tmp);
      return tmp.clone().applyMatrix4(mesh72.matrixWorld);
    });
    const delays = leds.map(() => r() * 16);
    return {page, leds, starts, delays};
  }, [a]);

  const led = useMemo(() => {
    if (!geo) return null;
    const n = geo.leds.length;
    const box = new THREE.BoxGeometry(0.016, 0.016, 0.03);
    const mesh = new THREE.InstancedMesh(box, new THREE.MeshBasicMaterial({toneMapped: false}), n);
    const m = new THREE.Matrix4();
    geo.leds.forEach((l, i) => mesh.setMatrixAt(i, m.makeTranslation(l.p.x, l.p.y, l.p.z)));
    mesh.instanceMatrix.needsUpdate = true;
    // Glow points: live LEDs, their reflection in the floor, and the flying dissolve.
    const glowGeo = (count: number) => {
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(count * 3), 3));
      g.setAttribute('color', new THREE.BufferAttribute(new Float32Array(count * 3), 3));
      return g;
    };
    return {mesh, glow: glowGeo(n), mirror: glowGeo(n), fly: glowGeo(n)};
  }, [geo]);

  const racks = useMemo(() => {
    const body = new THREE.BoxGeometry(1.0, 2.25, RACK_DZ - 0.05);
    const front = new THREE.PlaneGeometry(RACK_DZ - 0.07, 2.2);
    const list: Array<{x: number; z: number; side: number}> = [];
    for (const side of [-1, 1]) for (let r = 0; r < RACKS; r++) list.push({x: side * (AISLE_X + 0.5), z: RACK_Z0 - r * RACK_DZ, side});
    return {body, front, list};
  }, []);

  if (!a || !mats || !geo || !led) return null;

  // ---- Phases ----
  const docOn = frame < b.php + 40;
  const monumentIn = ramp(frame, b.days - 6, b.days + 22, ease.out);
  const dissolve = frame >= b.php;
  const monumentOpacity = monumentIn * (1 - ramp(frame, b.php, b.php + 10));
  mats.cap.opacity = monumentOpacity;
  mats.side.opacity = monumentOpacity;
  const chipsOn = ramp(frame, b.ukinet - 4, b.ukinet + 10, ease.out) * (1 - ramp(frame, b.php - 6, b.php + 4));
  const subOn = ramp(frame, b.days + 16, b.days + 30, ease.out) * (1 - ramp(frame, b.php - 6, b.php + 4));

  // LED colours: dark until the dissolve reaches them, then blue; attack flashes; caveat calm; simulated spread.
  const BLUE = new THREE.Color(colors.electric), RED = new THREE.Color(colors.negative), OFF = new THREE.Color('#0a1220'), c = new THREE.Color();
  const spreadOrigin = new THREE.Vector3(...CARDS[HERO_CARD].p);
  const pos = led.glow.attributes.position as THREE.BufferAttribute, col = led.glow.attributes.color as THREE.BufferAttribute;
  const mpos = led.mirror.attributes.position as THREE.BufferAttribute, mcol = led.mirror.attributes.color as THREE.BufferAttribute;
  const fpos = led.fly.attributes.position as THREE.BufferAttribute, fcol = led.fly.attributes.color as THREE.BufferAttribute;
  const flyStart = b.php + 4;
  geo.leds.forEach((l, i) => {
    const t = (frame - flyStart - geo.delays[i]) / 26;
    const arrived = t >= 1;
    const attacked = (l.rack * 7 + Math.floor(i / 4)) % 9 === 0;
    const blink = Math.sin(frame * 0.9 + i) > 0.1;
    if (!arrived) c.copy(OFF);
    else if (frame >= b.imagine && l.p.distanceTo(spreadOrigin) < (frame - b.imagine) * 0.28) c.copy(RED).multiplyScalar(blink ? 1 : 0.4);
    else if (frame >= b.jutaan && frame < b.notend && attacked) c.copy(RED).multiplyScalar(blink ? 1 : 0.3);
    else if (frame >= b.notend && attacked && i % 3 === 0) c.copy(RED).multiplyScalar(0.8);
    else c.copy(BLUE).multiplyScalar(0.55 + 0.45 * (Math.sin(frame * 0.21 + i * 1.7) > 0.6 ? 1 : 0.6));
    led.mesh.setColorAt(i, c);
    pos.setXYZ(i, l.p.x + 0.02 * Math.sign(-l.p.x), l.p.y, l.p.z);
    col.setXYZ(i, arrived ? c.r : 0, arrived ? c.g : 0, arrived ? c.b : 0);
    mpos.setXYZ(i, l.p.x, -l.p.y, l.p.z);
    mcol.setXYZ(i, arrived ? c.r * 0.35 : 0, arrived ? c.g * 0.35 : 0, arrived ? c.b * 0.35 : 0);
    // Flying points from the "72" to their LED, on an arc.
    if (dissolve && !arrived && t > -0.6) {
      const k = ease.inOut(Math.min(1, Math.max(0, t)));
      const s = geo.starts[i];
      const mid = s.clone().lerp(l.p, 0.5).add(new THREE.Vector3(0, 0.8, 0));
      const p1 = s.clone().lerp(mid, k), p2 = mid.clone().lerp(l.p, k);
      const q = p1.lerp(p2, k);
      fpos.setXYZ(i, q.x, q.y, q.z);
      fcol.setXYZ(i, 0.46, 0.78, 1);
    } else {
      fpos.setXYZ(i, 0, -50, 0);
      fcol.setXYZ(i, 0, 0, 0);
    }
  });
  if (led.mesh.instanceColor) led.mesh.instanceColor.needsUpdate = true;
  for (const attr of [pos, col, mpos, mcol, fpos, fcol]) attr.needsUpdate = true;

  const roomOn = frame >= b.php - 10;
  const redLevel = frame >= b.imagine ? ramp(frame, b.imagine, b.pos - 10) : frame >= b.jutaan && frame < b.notend ? 0.45 + 0.25 * Math.sin(frame * 0.5) : frame >= b.notend ? 0.12 : 0;

  const keys: CamKey[] = [
    // Reading path on the page (page centre x = DOC_POS.x): title → date → "three days of disruption".
    {f: b.uk, pos: [-0.25, 0.42, 3.6], look: [-0.25, 0.38, 0], fov: 40, shift: -40},
    {f: b.baru + 20, pos: [-0.27, -0.08, 3.4], look: [-0.27, -0.14, 0], fov: 40, shift: -40, ease: 'linear'},
    {f: b.days + 4, pos: [-0.62, -0.7, 2.95], look: [-0.62, -0.8, 0], fov: 40, shift: -130},
    {f: b.days + 16, pos: [-0.62, -0.71, 2.85], look: [-0.62, -0.8, 0], fov: 40, shift: -130},
    {f: b.ukinet + 12, pos: [0.4, 1.0, 8.6], look: [0.1, 0.8, -2.0], fov: 40, shift: -30},
    {f: b.php, pos: [0.32, 1.0, 7.6], look: [0.1, 0.95, -2.4], fov: 40, shift: -30},
    {f: b.php + 34, pos: [0.05, 1.3, -6.2], look: [0, 1.25, -13], fov: 42, shift: -60, ease: 'inOut'},
    {f: b.jutaan + 6, pos: [0.04, 1.32, -8.2], look: [0, 1.3, -11.0], fov: 40, shift: -60, shake: 0.005},
    {f: b.jutaan + 58, pos: [0.06, 1.32, -8.35], look: [0.02, 1.3, -11.0], fov: 40, shift: -60, shake: 0.006},
    {f: b.jutaan + 100, pos: [0.12, 1.36, -9.8], look: [0.65, 1.2, -13.8], fov: 42, shift: -60, shake: 0.009},
    {f: b.offline - 6, pos: [-0.05, 1.32, -12.3], look: [0, 1.3, -15.2], fov: 40, shift: -60, shake: 0.006},
    {f: b.offline + 40, pos: [0, 1.32, -12.45], look: [0, 1.3, -15.2], fov: 40, shift: -60, shake: 0.005},
    {f: b.offline + 66, pos: [0.0, 1.5, -14.6], look: [0.25, 1.45, -18.3], fov: 42, shift: -60, shake: 0.008},
    {f: b.notend - 20, pos: [0.26, 1.45, -16.5], look: [0.3, 1.45, -18.3], fov: 40, shift: -130, shake: 0.005},
    {f: b.notend + 28, pos: [0, 3.4, -11.6], look: [0, 1.0, -19.5], fov: 42, shift: -60},
    {f: b.imagine + 16, pos: [0.05, 3.2, -12.3], look: [0.05, 1.05, -19.5], fov: 42, shift: -60},
    {f: b.pos - 2, pos: [0.3, 1.45, -17.72], look: [0.3, 1.45, -18.3], fov: 40, shift: 0, ease: 'in'},
  ];

  return (
    <World3D keys={keys} panels={studioPanels.dark} envIntensity={0.9} fog={['#02040a', frame < b.php ? 9 : 4, frame < b.php ? 30 : 15]}>
      <ambientLight intensity={0.12} />
      <directionalLight position={[-2, 3, 4]} intensity={2.2} color="#fff4e6" />
      <pointLight position={[1.5, 1.2, -2]} color={colors.electric} intensity={14 * monumentIn} distance={9} />

      {/* GOV.UK page as a physical sheet, with highlight sweeps */}
      {docOn && (
        <group
          position={DOC_POS.map((v, i) => v + (DOC_AWAY[i] - v) * ramp(frame, b.days + 16, b.ukinet + 12)) as V3}
          rotation={[-0.18 * ramp(frame, b.days + 16, b.ukinet + 12), 0.28 * ramp(frame, b.days + 16, b.ukinet + 12), 0]}
        >
          <mesh geometry={geo.page} material={mats.page} />
          {(() => {
            const bar = ramp(frame, b.uk - 2, b.uk + 12, ease.out) * (1 - ramp(frame, b.uk + 26, b.uk + 40));
            const [x0, y0] = pagePt(60 + 70, PAGE.head.y + 790);
            return bar > 0 ? (
              <mesh position={[x0 + (0.98 * bar) / 2, y0, curlZ(x0 + 0.49, y0) + 0.006]}>
                <planeGeometry args={[0.98 * bar, 0.008]} />
                <meshBasicMaterial color={colors.electric} toneMapped={false} />
              </mesh>
            ) : null;
          })()}
          {[{r: HL.date, at: b.baru}, ...HL.days.map((r, i) => ({r, at: b.days + i * 6})), ...HL.power.map((r, i) => ({r, at: b.ukinet + i * 8}))].map(({r, at}, i) => {
            const w = ((r.x1 - r.x0) / 1000) * ramp(frame, at, at + 12, ease.out);
            if (w <= 0) return null;
            const [x0, y] = pagePt(r.x0, r.y);
            return (
              <mesh key={i} geometry={curlStrip(x0, w, y, r.h / 1000)} position={[x0 + w / 2, y, 0]}>
                <meshBasicMaterial color={colors.electric} transparent opacity={0.32} depthWrite={false} toneMapped={false} />
              </mesh>
            );
          })}
          <mesh position={[0, 0, -1.4]} scale={[5, 4, 1]}>
            <planeGeometry args={[1, 1]} />
            <meshBasicMaterial map={a.bokeh} transparent opacity={0.85 * (1 - monumentIn)} toneMapped={false} depthWrite={false} />
          </mesh>
        </group>
      )}

      {/* The monumental 72 JAM behind the page */}
      {monumentOpacity > 0.001 && (
        <group position={[0, -0.6 * (1 - monumentIn), 0]}>
          <mesh geometry={a.g72} material={[mats.cap, mats.side]} position={[0.1, 1.55, MONUMENT_Z]} />
          <mesh geometry={a.gJam} material={[mats.cap, mats.side]} position={[0.1, -0.15, MONUMENT_Z]} />
        </group>
      )}
      <Label3D tex={a.chips.sub} height={0.15} position={[0.1, -0.88, MONUMENT_Z + 0.3]} opacity={subOn} />
      {(['listrik', 'air', 'telepon', 'internet'] as const).map((k, i) => (
        <Label3D key={k} tex={a.chips[k]} height={k === 'internet' ? 0.2 : 0.16} position={[-1.25 + i * 0.86, -1.2, MONUMENT_Z + 0.3]} opacity={chipsOn * (k === 'internet' ? 1 : 0.85)} />
      ))}

      {/* The 72's points flying into the server LEDs */}
      {dissolve && frame < b.php + 60 && (
        <points geometry={led.fly}>
          <pointsMaterial map={a.glow} size={0.09} vertexColors transparent blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
        </points>
      )}

      {/* Server room */}
      {roomOn && (
        <group>
          {racks.list.map((r, i) => (
            <group key={i} position={[r.x, 1.125, r.z]}>
              <mesh geometry={racks.body} material={mats.rack} />
              <mesh geometry={racks.front} material={mats.rackFront} position={[-r.side * 0.501, 0, 0]} rotation={[0, (-r.side * Math.PI) / 2, 0]} />
            </group>
          ))}
          <primitive object={led.mesh} />
          <points geometry={led.glow}>
            <pointsMaterial map={a.glow} size={0.07} vertexColors transparent blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
          </points>
          <points geometry={led.mirror}>
            <pointsMaterial map={a.glow} size={0.08} vertexColors transparent blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
          </points>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -22.5]} material={mats.floor}>
            <planeGeometry args={[4, 27]} />
          </mesh>
          {[-0.45, 0.45].map((x) => (
            <mesh key={x} position={[x, 2.72, -16]}>
              <boxGeometry args={[0.05, 0.02, 16]} />
              <meshBasicMaterial color="#cfe2ff" toneMapped={false} />
            </mesh>
          ))}
          <pointLight position={[0, 2.4, -11]} color="#cfe2ff" intensity={6} distance={7} />
          <pointLight position={[0, 2.4, -16]} color="#cfe2ff" intensity={6} distance={7} />
          <pointLight position={[0, 1.2, -14]} color={colors.negative} intensity={18 * redLevel} distance={10} />

          {/* Evidence clippings */}
          <mesh position={[GUARDIAN_POS[0] - 1.8 * ramp(frame, b.jutaan + 84, b.jutaan + 104), GUARDIAN_POS[1], GUARDIAN_POS[2]]} visible={frame < b.jutaan + 104}>
            <planeGeometry args={[1.1, 1.1 / a.guardian.aspect]} />
            <meshBasicMaterial map={a.guardian.texture} toneMapped={false} />
          </mesh>
          {[{x0: 866, x1: 1232, y0: 22, y1: 76, at: b.jutaan}, {x0: 20, x1: 270, y0: 100, y1: 167, at: b.jutaan + 6}].map((r, i) => {
            const k = ramp(frame, r.at, r.at + 10, ease.out);
            if (k <= 0) return null;
            const h = cardStrip(a.guardian, 1.1, 1300, r, k);
            if (frame >= b.jutaan + 84) return null;
            return (
              <mesh key={`g${i}`} position={[GUARDIAN_POS[0] + h.x, GUARDIAN_POS[1] + h.y, GUARDIAN_POS[2] + 0.003]}>
                <planeGeometry args={[h.w, h.h]} />
                <meshBasicMaterial color={colors.negative} transparent opacity={0.28} depthWrite={false} toneMapped={false} />
              </mesh>
            );
          })}
          <mesh position={[NCSC_POS[0] + 1.8 * ramp(frame, b.offline + 44, b.offline + 62), NCSC_POS[1], NCSC_POS[2]]} visible={frame >= b.offline - 30 && frame < b.offline + 62}>
            <planeGeometry args={[1.12, 1.12 / a.ncsc.aspect]} />
            <meshBasicMaterial map={a.ncsc.texture} toneMapped={false} transparent opacity={ramp(frame, b.offline - 30, b.offline - 10)} />
          </mesh>
          {[{x0: 520, x1: 1450, y0: 445, y1: 476}, {x0: 36, x1: 1460, y0: 499, y1: 530}, {x0: 36, x1: 205, y0: 553, y1: 584}].map((r, i) => {
            const k = ramp(frame, b.offline + 2 + i * 7, b.offline + 12 + i * 7, ease.out);
            if (k <= 0) return null;
            const h = cardStrip(a.ncsc, 1.12, 1560, r, k);
            if (frame >= b.offline + 44) return null;
            return (
              <mesh key={`n${i}`} position={[NCSC_POS[0] + h.x, NCSC_POS[1] + h.y, NCSC_POS[2] + 0.003]}>
                <planeGeometry args={[h.w, h.h]} />
                <meshBasicMaterial color={colors.electric} transparent opacity={0.3} depthWrite={false} toneMapped={false} />
              </mesh>
            );
          })}
          {/* Website cards that go down */}
          {CARDS.map((card, i) => {
            const down = frame >= b.offline + 46 + i * 5;
            const o = ramp(frame, b.offline + 20 + i * 3, b.offline + 36 + i * 3, ease.out);
            if (o <= 0) return null;
            return (
              <mesh key={i} position={card.p} rotation={[0, card.r, 0]} scale={0.85 + 0.15 * o}>
                <planeGeometry args={[0.66, 0.44]} />
                <meshBasicMaterial map={down ? a.error[i] : a.sites[i]} toneMapped={false} transparent opacity={o} />
              </mesh>
            );
          })}
        </group>
      )}
    </World3D>
  );
};
