import {useMemo} from 'react';
import {interpolate, staticFile, useCurrentFrame} from 'remotion';
import * as THREE from 'three';
import {fontsReady, loadImage, textTexture, toTexture, useAssets3D} from '../../three/assets';
import {BitcoinCoin} from '../../three/BitcoinCoin';
import type {CamKey, V3} from '../../three/camera';
import {studioPanels} from '../../three/env';
import {canvasTexture, glowTexture, loadFont, svgShapes, text3D} from '../../three/kit';
import {Label3D} from '../../three/Label3D';
import {World3D} from '../../three/World3D';
import {colors} from '../../theme/colors';
import {ease} from '../../theme/motion';
import {fonts} from '../../theme/typography';

const ramp = (f: number, a: number, b: number, e = ease.inOut) => interpolate(f, [a, b], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: e});

export type ArenaBeats = {
  now: number; report: number; race: number; stocks: number; gold: number; catch: number; vol: number;
  drag: number; down: number; up: number; loss: number; avg: number; keep: number; range: number;
  payoff: number; ticket: number; check: number; end: number;
};

// ---- Layout (world units) -------------------------------------------------------------------------
/** Podium step height per percentage point of projected annual return. */
const H_PER_PCT = 0.1;
const BW = 0.72; // step width and depth
const STEPS = [
  {key: 'btc', x: 0, pct: 10, label: '10%', name: 'BITCOIN', color: colors.electric},
  {key: 'stocks', x: -0.76, pct: 7.5, label: '7,5%', name: 'SAHAM AS', color: colors.light},
  {key: 'gold', x: 0.76, pct: 5.5, label: '5,5%', name: 'EMAS', color: '#E8B64C'},
] as const;
const stepH = (pct: number) => pct * H_PER_PCT;
const COIN_R = 0.26;
/** The real report stands in front of the podium. */
const DOC: V3 = [0, 1.0, 2.2];
const DOC_W = 1.02, DOC_H = 1.32;
/** Cover pixel (1020×1320) → document-local position. */
const docPt = (px: number, py: number): [number, number] => [px / 1000 - DOC_W / 2, DOC_H / 2 - py / 1000];
const DOC_HL = [
  {x0: 70, x1: 632, y0: 166, y1: 219},
  {x0: 70, x1: 570, y0: 221, y1: 274},
  {x0: 70, x1: 390, y0: 320, y1: 351},
];
/** The coin stack (−50% / +50%) stands front right. */
const STACK: V3 = [1.95, 0, 1.15];
const COIN_H = 0.016;
const TRACK_Z0 = -BW / 2 - 0.02, TRACK_Z1 = -13;

/** A rollercoaster profile: base trend to the step top, plus swings scaled by the asset's volatility. */
const trackPoints = (x: number, top: number, swing: number, seed: number) => {
  const pts: THREE.Vector3[] = [];
  const n = 70;
  for (let i = 0; i <= n; i++) {
    const u = i / n; // 0 far → 1 at the podium
    const z = TRACK_Z1 + (TRACK_Z0 - TRACK_Z1) * u;
    const trend = 0.22 + (top - 0.22) * Math.pow(u, 1.3);
    const wave = Math.sin(u * 19 + seed) * 0.6 + Math.sin(u * 37 + seed * 2.3) * 0.3 + Math.sin(u * 7.3 + seed * 0.7) * 0.5;
    // The last stretch climbs cleanly onto the step; Bitcoin's big drop sits just before it.
    const settle = 1 - ramp(u, 0.9, 0.985);
    const drop = swing > 0.5 ? -0.85 * Math.exp(-((u - 0.84) ** 2) / 0.0012) : 0;
    const y = Math.max(0.06, trend + swing * wave * settle + drop * top);
    pts.push(new THREE.Vector3(x, y, z));
  }
  return new THREE.CatmullRomCurve3(pts, false, 'catmullrom', 0.3);
};

/** Gold bar: a bevelled trapezoid. */
const goldBarGeometry = () => {
  const s = new THREE.Shape();
  s.moveTo(-0.25, 0);
  s.lineTo(0.25, 0);
  s.lineTo(0.2, 0.13);
  s.lineTo(-0.2, 0.13);
  s.closePath();
  const g = new THREE.ExtrudeGeometry(s, {depth: 0.22, bevelEnabled: true, bevelThickness: 0.012, bevelSize: 0.01, bevelSegments: 3});
  g.translate(0, 0, -0.11);
  return g;
};

/** A stock tile: dark glass with a rising candle chart (generic, no index brand). */
const drawStockTile = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
  ctx.fillStyle = '#0b1730';
  ctx.fillRect(0, 0, w, h);
  ctx.strokeStyle = 'rgba(117,199,255,0.18)';
  ctx.lineWidth = 2;
  for (let i = 1; i < 5; i++) {
    ctx.beginPath();
    ctx.moveTo(0, (h * i) / 5);
    ctx.lineTo(w, (h * i) / 5);
    ctx.stroke();
  }
  let p = h * 0.78;
  for (let i = 0; i < 16; i++) {
    const x = 30 + i * ((w - 60) / 16);
    const next = p - (Math.sin(i * 1.7) * 18 + 16);
    const up = next < p;
    ctx.fillStyle = up ? colors.electric : 'rgba(117,199,255,0.5)';
    ctx.fillRect(x, Math.min(p, next), 16, Math.max(6, Math.abs(next - p)));
    ctx.fillRect(x + 7, Math.min(p, next) - 10, 2, Math.abs(next - p) + 20);
    p = next;
  }
  ctx.font = `700 34px "${fonts.mono}"`;
  ctx.fillStyle = colors.light;
  ctx.fillText('SAHAM AS', 30, 52);
};

export const ArenaWorld = ({b}: {b: ArenaBeats}) => {
  const frame = useCurrentFrame();
  const a = useAssets3D(async () => {
    await fontsReady();
    const [cover, font, symbol] = await Promise.all([
      loadImage(staticFile('episodes/jpmorgan-bitcoin/ltcma-2027-cover.jpg')),
      loadFont(staticFile('fonts/typeface/InterTight-800.json')),
      svgShapes(staticFile('episodes/jpmorgan-bitcoin/bitcoin-symbol.svg'), '#FFF'),
    ]);
    const mono = (s: string, color: string, px = 72) => textTexture(s, {family: fonts.mono, weight: 700, px, color, tracking: 6});
    const floor = canvasTexture(1024, 1024, (ctx, w, h) => {
      ctx.fillStyle = '#04080f';
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = 'rgba(41,151,255,0.16)';
      ctx.lineWidth = 2;
      for (let i = 0; i <= 16; i++) {
        ctx.beginPath(); ctx.moveTo((w * i) / 16, 0); ctx.lineTo((w * i) / 16, h); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, (h * i) / 16); ctx.lineTo(w, (h * i) / 16); ctx.stroke();
      }
    });
    floor.texture.wrapS = floor.texture.wrapT = THREE.RepeatWrapping;
    floor.texture.repeat.set(6, 6);
    return {
      cover: toTexture(cover), font, symbol, glow: glowTexture(), floor: floor.texture,
      tile: canvasTexture(512, 360, drawStockTile).texture,
      num: Object.fromEntries(STEPS.map((s) => [s.key, text3D(font, s.label, {size: 0.15, depth: 0.035, bevel: 0.006})])) as Record<string, THREE.BufferGeometry>,
      name: Object.fromEntries(STEPS.map((s) => [s.key, mono(s.name, colors.light, 64)])),
      vol: {btc: mono('VOLATILITAS 55%', colors.electric), stocks: mono('± 18%', colors.light, 64), gold: mono('± 17%', '#E8B64C', 64)},
      stack: {n100: mono('100', colors.text), n50: mono('50', colors.negative), n75: mono('75', colors.text), loss: mono('−25%', colors.negative, 80), start: mono('MODAL 100', colors.muted, 56)},
      ghost: {avg: mono('RATA-RATA 20,9%', colors.light, 64), keep: mono('TERSISA 10%', colors.text, 64)},
      dip: mono('−50%', colors.negative, 72),
    };
  }, 'arena');

  const geo = useMemo(() => {
    const tracks = STEPS.map((s, k) => trackPoints(s.x, stepH(s.pct), s.key === 'btc' ? 0.62 : s.key === 'stocks' ? 0.07 : 0.055, k * 1.9 + 0.4));
    return {
      block: new THREE.BoxGeometry(1, 1, 1),
      edges: new THREE.EdgesGeometry(new THREE.BoxGeometry(1, 1, 1)),
      bar: goldBarGeometry(),
      tubes: tracks.map((c, k) => new THREE.TubeGeometry(c, 600, k === 0 ? 0.022 : 0.016, 10, false)),
      tracks,
      coin: new THREE.CylinderGeometry(0.2, 0.2, COIN_H * 0.92, 40),
    };
  }, []);
  const mats = useMemo(
    () => ({
      block: new THREE.MeshPhysicalMaterial({color: '#0d1a33', roughness: 0.28, metalness: 0.35, clearcoat: 0.8, clearcoatRoughness: 0.2}),
      gold: new THREE.MeshStandardMaterial({color: '#E8B64C', metalness: 1, roughness: 0.22}),
      coinStack: new THREE.MeshStandardMaterial({color: '#F2A33A', metalness: 0.95, roughness: 0.3}),
      ghost: new THREE.MeshPhysicalMaterial({color: colors.electric, transparent: true, opacity: 0.22, roughness: 0.1, metalness: 0, depthWrite: false}),
      post: new THREE.MeshStandardMaterial({color: '#1b2b48', roughness: 0.6, metalness: 0.5}),
    }),
    [],
  );
  const stackMesh = useMemo(() => {
    const m = new THREE.InstancedMesh(geo.coin, mats.coinStack, 100);
    m.frustumCulled = false;
    return m;
  }, [geo, mats]);
  if (!a) return null;

  // ---- Timeline ----
  const rise = {btc: ramp(frame, b.race - 4, b.race + 12, ease.out), stocks: ramp(frame, b.stocks - 4, b.stocks + 12, ease.out), gold: ramp(frame, b.gold - 4, b.gold + 12, ease.out)};
  const docIn = ramp(frame, b.now, b.now + 8, ease.out);
  const docOut = ramp(frame, b.race - 18, b.race + 4, ease.inOut);
  const hl = (i: number) => ramp(frame, b.report + 4 + i * 8, b.report + 16 + i * 8, ease.out);
  const coinShow = frame < b.now || frame >= b.race - 10;
  const tracksIn = ramp(frame, b.catch - 4, b.catch + 30);
  const cartU = frame < b.payoff ? ramp(frame, b.vol, b.drag + 10, (t: number) => t) : 0.5 + 0.34 * ramp(frame, b.check - 6, b.check + 40, ease.inOut);
  const cartOn = (frame >= b.vol - 4 && frame < b.avg) || frame >= b.payoff;
  // Coin stack: build to 100, lose half, regain half of what's left.
  const build = Math.round(100 * ramp(frame, b.drag, b.drag + 40, ease.out));
  const lost = ramp(frame, b.down, b.down + 22, ease.inOut);
  const regained = ramp(frame, b.up, b.up + 20, ease.out);
  const stackCount = frame < b.down ? build : Math.round(100 - 50 * lost + 25 * regained);
  const stackOn = frame >= b.drag - 2 && frame < b.avg + 6;
  // Ghost step: the simple average (20.9%) on top of Bitcoin's step, then it evaporates to what is kept (10%).
  const ghostUp = ramp(frame, b.avg, b.avg + 18, ease.out);
  const ghostDown = ramp(frame, b.keep, b.keep + 22, ease.inOut);
  const ghostH = (20.9 - 10) * H_PER_PCT * ghostUp * (1 - ghostDown);
  const btcTop = stepH(10) * rise.btc;
  const coinY = Math.max(btcTop, 0) + COIN_R + 0.02 + ghostH;
  const floatY = stepH(10) + COIN_R + 0.02;
  const coinPos: V3 = [0, rise.btc > 0 ? coinY : floatY, 0];

  // Instances for the stack
  const dummy = new THREE.Object3D();
  for (let i = 0; i < 100; i++) {
    const on = i < stackCount;
    // Coins leaving fly up and out; coins arriving drop in from above.
    const leaving = frame >= b.down && i >= 50 && i < 100 && !(i < stackCount);
    const lift = leaving ? lost * (1.2 + (i - 50) * 0.03) : 0;
    dummy.position.set(STACK[0] + (leaving ? lost * (0.4 + (i % 7) * 0.08) : 0), STACK[1] + COIN_H * (i + 0.5) + lift, STACK[2]);
    dummy.rotation.set(0, i * 0.37, 0);
    dummy.scale.setScalar(on || (leaving && lost < 1) ? 1 : 0.0001);
    dummy.updateMatrix();
    stackMesh.setMatrixAt(i, dummy.matrix);
  }
  stackMesh.instanceMatrix.needsUpdate = true;
  stackMesh.visible = stackOn;

  // ---- Camera ----
  const keys: CamKey[] = [
    // Cold open: the coin, close, with the 2017 quote stamped on it (2D).
    {f: 0, pos: [0.42, 1.62, 3.3], look: [0, floatY, 0], fov: 35, shift: -150},
    {f: b.now - 1, pos: [0.3, 1.58, 2.95], look: [0, floatY, 0], fov: 35, shift: -150, ease: 'linear'},
    // Hard cut to the real report, whole; documentary push to its title.
    {f: b.now, pos: [0.18, 1.1, 7.6], look: [DOC[0], DOC[1], DOC[2]], fov: 35, shift: -150},
    {f: b.report - 2, pos: [0.1, 1.12, 6.8], look: [DOC[0], DOC[1], DOC[2]], fov: 35, shift: -150, ease: 'linear'},
    {f: b.report + 26, pos: [-0.16, 1.5, 4.75], look: [-0.16, DOC[1] + 0.43, DOC[2]], fov: 35, shift: -150, ease: 'out'},
    {f: b.race - 18, pos: [-0.16, 1.5, 4.55], look: [-0.16, DOC[1] + 0.43, DOC[2]], fov: 35, shift: -150, ease: 'linear'},
    // Crane up and back as the report drops away and the podium rises.
    {f: b.race + 14, pos: [0.0, 1.55, 6.8], look: [0, 0.72, 0], fov: 40, shift: -110},
    {f: b.stocks + 10, pos: [-0.55, 1.5, 6.7], look: [0, 0.7, 0], fov: 40, shift: -110},
    {f: b.catch - 4, pos: [0.5, 1.55, 6.6], look: [0, 0.7, 0], fov: 40, shift: -110},
    // Hero move: crane up over the podium to see what's behind it, then cut to the reverse angle: the podium is only the finish line.
    {f: b.vol - 1, pos: [0.5, 3.7, 7.6], look: [0, 0.9, -4], fov: 42, shift: -90},
    {f: b.vol, pos: [1.5, 2.55, -12.4], look: [0, 0.95, -2.8], fov: 42, shift: -90},
    {f: b.drag - 8, pos: [1.25, 2.35, -11.4], look: [0, 0.95, -2.6], fov: 42, shift: -90, ease: 'linear'},
    // The coin stack, front right.
    {f: b.drag + 14, pos: [5.4, 1.5, 7.3], look: [STACK[0], 0.82, STACK[2]], fov: 38, shift: -110},
    {f: b.avg - 6, pos: [5.2, 1.45, 7.0], look: [STACK[0], 0.8, STACK[2]], fov: 38, shift: -110, ease: 'linear'},
    // Bitcoin's step with the ghost of the simple average.
    {f: b.avg + 10, pos: [-2.85, 2.2, 8.5], look: [0, 1.3, 0], fov: 40, shift: -145},
    {f: b.range, pos: [-2.65, 2.15, 8.2], look: [0, 1.3, 0], fov: 40, shift: -145, ease: 'linear'},
    // Payoff: the prize at the end of the ride; then into the big drop on "kalau turun setengah".
    {f: b.payoff - 2, pos: [1.9, 3.1, -13.8], look: [0, 0.9, -3.0], fov: 42, shift: -100},
    {f: b.payoff - 1, pos: [1.9, 3.1, -13.8], look: [0, 0.9, -3.0], fov: 42, shift: -100},
    {f: b.check, pos: [1.7, 2.8, -12.4], look: [0, 0.85, -2.9], fov: 42, shift: -100, ease: 'linear'},
    {f: b.end, pos: [1.15, 1.95, -7.6], look: [0, 0.75, -2.4], fov: 42, shift: -210},
  ];

  const cartPos = geo.tracks[0].getPointAt(Math.min(0.999, Math.max(0, cartU)));
  const docY = DOC[1] - 2.6 * docOut;

  return (
    <World3D keys={keys} panels={studioPanels.dark} bg="#03070f" fog={['#03070f', 9, 24]} envIntensity={0.55} exposure={1.05}>
      <ambientLight intensity={0.25} />
      <directionalLight position={[-3, 6, 5]} intensity={1.6} />
      <spotLight position={[0, 6, 4]} angle={0.5} penumbra={0.7} intensity={40} color="#dce9ff" />
      <pointLight position={[0, 2.5, -3]} color={colors.electric} intensity={6} distance={10} />

      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -6]}>
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial map={a.floor} roughness={0.55} metalness={0.3} />
      </mesh>

      {/* Podium: one step per asset, height = projected annual return */}
      {STEPS.map((s) => {
        const r = rise[s.key];
        const h = stepH(s.pct) * r;
        if (r <= 0) return null;
        return (
          <group key={s.key} position={[s.x, 0, 0]}>
            <mesh geometry={geo.block} material={mats.block} position={[0, h / 2, 0]} scale={[BW, Math.max(h, 0.001), BW]} />
            <lineSegments geometry={geo.edges} position={[0, h / 2, 0]} scale={[BW, Math.max(h, 0.001), BW]}>
              <lineBasicMaterial color={s.color} transparent opacity={0.85} />
            </lineSegments>
            <mesh geometry={a.num[s.key]} position={[0, h - 0.17, BW / 2 + 0.02]}>
              <meshStandardMaterial color={s.key === 'btc' ? colors.text : s.color} emissive={s.key === 'btc' ? colors.electric : '#000000'} emissiveIntensity={0.25} metalness={0.2} roughness={0.4} />
            </mesh>
            <Label3D tex={a.name[s.key]} height={0.075} position={[0, h - 0.33, BW / 2 + 0.03]} rotation={[0, 0, 0]} opacity={ramp(r, 0.6, 1)} />
          </group>
        );
      })}
      {/* Objects on the steps */}
      {rise.stocks > 0 && (
        <group position={[STEPS[1].x, stepH(7.5) * rise.stocks + 0.19, 0]} rotation={[-0.05, 0.12, 0]}>
          <mesh>
            <boxGeometry args={[0.54, 0.38, 0.03]} />
            <meshStandardMaterial color="#14223d" metalness={0.6} roughness={0.3} />
          </mesh>
          <mesh position={[0, 0, 0.0155]}>
            <planeGeometry args={[0.52, 0.36]} />
            <meshBasicMaterial map={a.tile} toneMapped={false} />
          </mesh>
        </group>
      )}
      {rise.gold > 0 && <mesh geometry={geo.bar} material={mats.gold} position={[STEPS[2].x, stepH(5.5) * rise.gold, 0]} rotation={[0, -0.25, 0]} />}
      {coinShow && (
        <group position={coinPos}>
          <BitcoinCoin symbol={a.symbol} scale={COIN_R} rotation={[0, -0.3 + Math.sin(frame / 45) * 0.25, 0]} />
          <sprite scale={1.1} position={[0, 0, -0.2]}>
            <spriteMaterial map={a.glow} color={colors.blue} transparent opacity={0.22} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
          </sprite>
        </group>
      )}

      {/* The real report */}
      {docIn > 0 && docOut < 1 && (
        <group position={[DOC[0], docY, DOC[2]]} rotation={[-0.04 - 0.5 * docOut, 0, 0]}>
          <mesh>
            <planeGeometry args={[DOC_W, DOC_H]} />
            <meshBasicMaterial map={a.cover} toneMapped={false} transparent opacity={docIn} />
          </mesh>
          {DOC_HL.map((r, i) => {
            const k = hl(i);
            if (k <= 0) return null;
            const [x0, y0] = docPt(r.x0, r.y0);
            const [x1, y1] = docPt(r.x1, r.y1);
            const w = (x1 - x0) * k;
            return (
              <mesh key={i} position={[x0 + w / 2, (y0 + y1) / 2, 0.002]}>
                <planeGeometry args={[w, y0 - y1]} />
                <meshBasicMaterial color={colors.electric} transparent opacity={0.3} depthWrite={false} toneMapped={false} />
              </mesh>
            );
          })}
        </group>
      )}

      {/* The ride: tracks run back from each step; Bitcoin's is a rollercoaster */}
      {tracksIn > 0 &&
        geo.tubes.map((t, k) => (
          <mesh key={k} geometry={t}>
            <meshStandardMaterial color={STEPS[k].color} emissive={STEPS[k].color} emissiveIntensity={k === 0 ? 0.9 : 0.5} transparent opacity={tracksIn * (k === 0 ? 1 : 0.8)} toneMapped={false} />
          </mesh>
        ))}
      {tracksIn > 0 &&
        geo.tracks.map((c, k) =>
          Array.from({length: 22}, (_, i) => {
            const p = c.getPointAt(0.02 + i * 0.044);
            if (p.y < 0.15) return null;
            return (
              <mesh key={`${k}-${i}`} position={[p.x, p.y / 2, p.z]} material={mats.post}>
                <cylinderGeometry args={[0.012, 0.012, p.y, 6]} />
              </mesh>
            );
          }),
        )}
      {tracksIn > 0 && (
        <>
          <Label3D tex={a.vol.btc} height={0.14} position={[0, 2.3, -4.5]} opacity={ramp(frame, b.vol - 6, b.vol + 6) * (1 - ramp(frame, b.drag - 2, b.drag + 6)) + ramp(frame, b.payoff, b.payoff + 10) * (1 - ramp(frame, b.check, b.check + 10))} />
          <Label3D tex={a.vol.stocks} height={0.12} position={[STEPS[1].x - 0.42, 1.25, -4.5]} opacity={ramp(frame, b.vol + 8, b.vol + 18) * (1 - ramp(frame, b.drag - 2, b.drag + 6))} />
          <Label3D tex={a.vol.gold} height={0.12} position={[STEPS[2].x + 0.42, 1.0, -4.5]} opacity={ramp(frame, b.vol + 14, b.vol + 24) * (1 - ramp(frame, b.drag - 2, b.drag + 6))} />
        </>
      )}
      {/* A coin rides Bitcoin's track */}
      {cartOn && (
        <group position={cartPos}>
          <sprite scale={0.55}>
            <spriteMaterial map={a.glow} color={colors.light} transparent blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
          </sprite>
          <BitcoinCoin symbol={a.symbol} scale={0.09} position={[0, 0.12, 0]} rotation={[0, Math.PI / 2, 0]} />
        </group>
      )}
      {frame >= b.check + 30 && <Label3D tex={a.dip} height={0.16} position={[cartPos.x + 0.45, cartPos.y + 0.35, cartPos.z]} opacity={ramp(frame, b.check + 30, b.check + 40)} />}

      {/* −50% then +50%: the stack */}
      <primitive object={stackMesh} />
      {stackOn && (
        <>
          {/* Where the money started */}
          <mesh position={[STACK[0], (COIN_H * 100) / 2, STACK[2]]} material={mats.ghost}>
            <cylinderGeometry args={[0.215, 0.215, COIN_H * 100, 40, 1, true]} />
          </mesh>
          <Label3D tex={a.stack.start} height={0.07} position={[STACK[0] - 0.62, COIN_H * 100, STACK[2]]} opacity={ramp(frame, b.drag + 30, b.drag + 40)} />
          <Label3D tex={a.stack.n100} height={0.11} position={[STACK[0] + 0.45, COIN_H * Math.max(stackCount, 1), STACK[2]]} opacity={frame < b.down ? ramp(frame, b.drag + 26, b.drag + 36) : 0} />
          <Label3D tex={a.stack.n50} height={0.11} position={[STACK[0] + 0.45, COIN_H * Math.max(stackCount, 1), STACK[2]]} opacity={frame >= b.down + 8 && frame < b.up ? 1 : 0} />
          <Label3D tex={a.stack.n75} height={0.11} position={[STACK[0] + 0.45, COIN_H * Math.max(stackCount, 1), STACK[2]]} opacity={frame >= b.up + 10 ? 1 : 0} />
          {frame >= b.loss && (
            <>
              <mesh position={[STACK[0] + 0.3, COIN_H * 87.5, STACK[2]]}>
                <boxGeometry args={[0.02, COIN_H * 25, 0.02]} />
                <meshBasicMaterial color={colors.negative} toneMapped={false} />
              </mesh>
              <Label3D tex={a.stack.loss} height={0.13} position={[STACK[0] + 0.62, COIN_H * 87.5, STACK[2]]} opacity={ramp(frame, b.loss, b.loss + 8)} />
            </>
          )}
        </>
      )}

      {/* The simple average (20.9%) as a ghost on Bitcoin's step */}
      {ghostH > 0.002 && (
        <mesh position={[0, stepH(10) + ghostH / 2, 0]} scale={[BW * 1.002, ghostH, BW * 1.002]} geometry={geo.block} material={mats.ghost} />
      )}
      {frame >= b.avg && frame < b.range && (
        <>
          <Label3D tex={a.ghost.avg} height={0.14} position={[1.25, stepH(10) + 1.09 * ghostUp, 0.3]} opacity={ramp(frame, b.avg + 6, b.avg + 14) * (1 - ramp(frame, b.keep, b.keep + 10))} />
          <Label3D tex={a.ghost.keep} height={0.14} position={[1.25, stepH(10) + 0.16, 0.4]} opacity={ramp(frame, b.keep + 14, b.keep + 22)} />
        </>
      )}
    </World3D>
  );
};
