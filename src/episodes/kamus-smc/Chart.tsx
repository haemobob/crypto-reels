import {useThree} from '@react-three/fiber';
import {useMemo, type ReactNode} from 'react';
import {Easing, interpolate, useCurrentFrame} from 'remotion';
import * as THREE from 'three';
import {Line2} from 'three/examples/jsm/lines/Line2.js';
import {LineGeometry} from 'three/examples/jsm/lines/LineGeometry.js';
import {LineMaterial} from 'three/examples/jsm/lines/LineMaterial.js';
import {fontsReady, textTexture, useAssets3D, type TextTexture} from '../../three/assets';
import {studioPanels} from '../../three/env';
import {canvasTexture, glowTexture} from '../../three/kit';
import {World3D} from '../../three/World3D';
import {colors} from '../../theme/colors';
import {ease} from '../../theme/motion';
import {fonts} from '../../theme/typography';
import {BODY, CANDLES, DATE, EV, N, X, Y, at, shot, usd, type Shot} from './data';

const ramp = (f: number, a: number, b: number, e = ease.inOut) => interpolate(f, [a, b], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: e});
/** Visible from `a` (fade in over 8 frames) until `b` (fade out over 8). */
const span = (f: number, a: number, b = Infinity) => ramp(f, a, a + 8, ease.out) * (1 - ramp(f, b - 8, b));

const curves = {inOut: ease.inOut, out: ease.out, in: ease.in, linear: Easing.linear};
/** The price-axis scale at a frame, eased exactly like the camera between the same keys. */
const syAt = (frame: number, keys: Shot[]) => {
  let i = 0;
  while (i + 1 < keys.length && keys[i + 1].f <= frame) i++;
  const k0 = keys[i], k1 = keys[i + 1];
  if (!k1 || k1.f <= k0.f) return k0.sy;
  const t = interpolate(frame, [k0.f, k1.f], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: curves[k1.ease ?? 'inOut']});
  return k0.sy + (k1.sy - k0.sy) * t;
};

export type ChartBeats = Record<
  | 'hook' | 'chart' | 'count' | 's1' | 'up' | 's2' | 'choch' | 's3' | 'ssl' | 'bsl' | 'eqh' | 'sweep' | 'idm' | 's4' | 'fvg' | 'mitig' | 'open' | 's5' | 'prem' | 'disc' | 'aug' | 'payoff' | 'caveat' | 'end'
  | 'wOrder' | 'wFvg' | 'wSweep0' | 'wPusing' | 'wTutupBos' | 'wNembus' | 'wTutup' | 'wSweep' | 'wStruktur' | 'wLiq' | 'wSweepP' | 'wEntry',
  number
>;

const UP = colors.electric, DOWN = '#4A5A76', STOP = colors.negative;

/** Text that keeps a fixed on-screen height (px) at any camera distance, facing the camera. */
/** 0 outside the stage band (screen px), so labels never drift into the headline zone or under the source line. */
const inStage = (cam: THREE.Camera, p: THREE.Vector3, halfH: number, halfW: number) => {
  const q = p.clone().project(cam);
  const y = ((1 - q.y) / 2) * 1920, x = ((q.x + 1) / 2) * 1080;
  if (q.z > 1) return 0;
  const v = Math.min(1, Math.max(0, (y - halfH - 715) / 14), Math.max(0, (1455 - y - halfH) / 14));
  const h = Math.min(1, Math.max(0, (x - halfW - 24) / 14), Math.max(0, (1056 - x - halfW) / 14));
  return v * h;
};
const ScreenLabel = ({tex, px, position, opacity = 1}: {tex: TextTexture; px: number; position: [number, number, number]; opacity?: number}) => {
  const {camera} = useThree();
  if (opacity <= 0.001) return null;
  const cam = camera as THREE.PerspectiveCamera;
  const p = new THREE.Vector3(...position);
  const o = opacity * inStage(cam, p, px / 2, (px * tex.aspect) / 2);
  if (o <= 0.001) return null;
  const d = cam.position.distanceTo(p);
  const h = (px * 2 * d * Math.tan((cam.fov * Math.PI) / 360)) / 1920;
  return (
    <mesh position={position} quaternion={cam.quaternion.clone()} renderOrder={20}>
      <planeGeometry args={[h * tex.aspect, h]} />
      <meshBasicMaterial map={tex.texture} transparent opacity={o} depthTest={false} depthWrite={false} toneMapped={false} />
    </mesh>
  );
};
/** A soft glow dot of fixed on-screen size. */
const Glow = ({tex, px, position, color, opacity}: {tex: THREE.Texture; px: number; position: [number, number, number]; color: string; opacity: number}) => {
  const {camera} = useThree();
  if (opacity <= 0.001) return null;
  const cam = camera as THREE.PerspectiveCamera;
  const p = new THREE.Vector3(...position);
  const o = opacity * inStage(cam, p, px / 4, px / 4);
  if (o <= 0.001) return null;
  const s = (px * 2 * cam.position.distanceTo(p) * Math.tan((cam.fov * Math.PI) / 360)) / 1920;
  return (
    <sprite position={position} scale={s} renderOrder={15}>
      <spriteMaterial map={tex} color={color} transparent opacity={o} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
    </sprite>
  );
};

/** Two planes through the camera that cut everything above and below the stage band (screen px), like a chart pane. */
const CLIP = [new THREE.Plane(), new THREE.Plane()];
const ClipToStage = ({band}: {band: [number, number]}) => {
  const {camera} = useThree();
  const cam = camera as THREE.PerspectiveCamera;
  const t = Math.tan((cam.fov * Math.PI) / 360);
  const off = cam.view?.enabled ? cam.view.offsetY : 0;
  const k = (px: number) => t * (1 - (2 * (px + off)) / 1920);
  CLIP[0].set(new THREE.Vector3(0, -1, -k(band[0])).normalize(), 0).applyMatrix4(cam.matrixWorld);
  CLIP[1].set(new THREE.Vector3(0, 1, k(band[1])).normalize(), 0).applyMatrix4(cam.matrixWorld);
  return null;
};

/** A box between two prices from candle i0 to i1 (in the scaled chart group). */
const Zone = ({i0, i1 = N - 1, lo, hi, color, opacity, depth = 0.5}: {i0: number; i1?: number; lo: number; hi: number; color: string; opacity: number; depth?: number}) => {
  if (opacity <= 0.001) return null;
  const x0 = X(i0) - BODY / 2, x1 = X(i1) + BODY / 2;
  return (
    <mesh position={[(x0 + x1) / 2, (Y(lo) + Y(hi)) / 2, 0]} renderOrder={2}>
      <boxGeometry args={[x1 - x0, Y(hi) - Y(lo), depth]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.35} transparent opacity={opacity} depthWrite={false} roughness={0.4} clippingPlanes={CLIP} />
    </mesh>
  );
};

const res = new THREE.Vector2(1080, 1920);
const line = (pts: Array<[number, number]>, color: string, width: number, dashed = false) => {
  const l = new Line2(new LineGeometry().setPositions(pts.flatMap(([i, p]) => [X(i), Y(p), 0.1])), new LineMaterial({color: new THREE.Color(color).getHex(), linewidth: width, transparent: true, resolution: res, dashed, dashSize: 0.1, gapSize: 0.07, clippingPlanes: CLIP}));
  if (dashed) l.computeLineDistances();
  l.renderOrder = 6;
  return l;
};
/** A polyline densified so it can draw itself smoothly (instanceCount = segments shown). */
const dense = (pts: Array<[number, number]>, per = 14) =>
  pts.slice(1).flatMap(([i1, p1], k) => {
    const [i0, p0] = pts[k];
    return Array.from({length: per}, (_, s) => [i0 + ((i1 - i0) * (s + (k === 0 && s === 0 ? 0 : 1))) / per, p0 + ((p1 - p0) * (s + (k === 0 && s === 0 ? 0 : 1))) / per] as [number, number]);
  });

/** Resting stop orders as a pile of cubes beyond a level (ILUSTRASI): columns along time, rows away from the level, layers in depth. */
const PILE = 0.038;
const pileCubes = (i0: number, i1: number, dir: 1 | -1, rows = 3) => {
  const cubes: Array<{x: number; r: number; z: number}> = [];
  for (let x = X(i0); x <= X(i1) + 1e-6; x += PILE)
    for (let r = 0; r < rows; r++)
      for (let k = -2; k <= 2; k++) {
        // A fixed hash thins the outer row so the pile looks stacked, and renders identically every frame.
        const h = Math.sin(x * 91.7 + r * 13.1 + k * 7.3) * 0.5 + 0.5;
        if (r === rows - 1 && h < 0.5) continue;
        cubes.push({x: x + (h - 0.5) * 0.01, r, z: k * PILE * dir});
      }
  return cubes;
};

export const ChartWorld = ({b, children}: {b: ChartBeats; children?: ReactNode}) => {
  const frame = useCurrentFrame();
  const a = useAssets3D(async () => {
    await fontsReady();
    const chip = (s: string, bg: string, color = '#FFFFFF', px = 64) => textTexture(s, {family: fonts.mono, weight: 700, px, color, tracking: 2, bg, pad: 14, radius: 12});
    const mono = (s: string, color: string, px = 56) => textTexture(s, {family: fonts.mono, weight: 700, px, color, tracking: 2});
    const floor = canvasTexture(1024, 1024, (ctx, w, h) => {
      ctx.fillStyle = '#060c19';
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = 'rgba(41,151,255,0.12)';
      ctx.lineWidth = 2;
      for (let i = 0; i <= 16; i++) {
        ctx.beginPath(); ctx.moveTo((w * i) / 16, 0); ctx.lineTo((w * i) / 16, h); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, (h * i) / 16); ctx.lineTo(w, (h * i) / 16); ctx.stroke();
      }
    });
    floor.texture.wrapS = floor.texture.wrapT = THREE.RepeatWrapping;
    floor.texture.repeat.set(10, 10);
    const T = (s: string) => chip(s, 'rgba(22,119,255,0.9)', '#FFFFFF', 56);
    const n = (s: string, c: string = colors.muted) => mono(s, c, 48);
    return {
      glow: glowTexture(),
      floor: floor.texture,
      axis: [60000, 70000, 80000].map((p) => mono(`$${p / 1000}K`, '#6A80A3', 48)),
      // The cold open's swarm: every term at the spot where it shows up on this chart (order of the list = when it appears).
      swarm: ([
        ['ORDER BLOCK', EV.ob.i, EV.ob.lo - 2600], ['FVG', EV.fvg.i + 3, (EV.fvg.lo + EV.fvg.hi) / 2], ['SWEEP', EV.sweep.i, EV.sweep.low - 2400],
        ['LH', EV.lh1.i, EV.lh1.p + 2200], ['LL', EV.ll1.i, EV.ll1.p - 2400], ['HH', EV.hh2.i, EV.hh2.p + 2200], ['HL', EV.hl1.i - 2, EV.hl1.p - 5200],
        ['BOS', EV.bosDn.i - 6, EV.lowJun18.p - 5200], ['CHoCH', EV.choch.i - 4, EV.choch.p + 6200], ['BSL', EV.eqh2.i - 18, EV.eqh1.p + 9000], ['SSL', EV.ll2.i + 6, EV.ll2.p - 4500],
        ['EQUAL HIGH', EV.eqh1.i + 12, EV.eqh1.p + 12500], ['INDUCEMENT', EV.idm.i - 4, EV.idm.p + 7000], ['IMBALANCE', EV.fvg.i + 18, EV.fvg.hi + 3800],
        ['MITIGATION', EV.fvg.i + 30, EV.fvg.lo - 2000], ['EQUILIBRIUM', EV.hl1.i - 6, EV.range.mid - 9000], ['PREMIUM', EV.hh2.i + 22, 84500], ['DISCOUNT', EV.hh2.i + 30, 70000],
      ] as Array<[string, number, number]>).map(([s, i, p]) => ({tex: T(s), i, p})),
      tag: {
        lh: chip('LH', colors.negative), ll: chip('LL', colors.negative), hh: chip('HH', '#0FA97B'), hl: chip('HL', '#0FA97B'),
        bos: chip('BOS', colors.blue), choch: chip('CHoCH', colors.blue),
        ssl: chip('SELL SIDE LIQUIDITY', 'rgba(255,82,99,0.92)', '#FFFFFF', 52), bsl: chip('BUY SIDE LIQUIDITY', 'rgba(255,82,99,0.92)', '#FFFFFF', 52), eqh: chip('EQUAL HIGH', colors.blue, '#FFFFFF', 56),
        sweep: chip('SWEEP', '#FFFFFF', colors.ink, 72), idm: chip('INDUCEMENT', colors.blue, '#FFFFFF', 56),
        ob: chip('ORDER BLOCK', colors.blue, '#FFFFFF', 56), fvg: chip('FVG', '#1E9BD7', '#FFFFFF', 64), mitig: chip('MITIGATION · ILUSTRASI', '#3A4A66', '#FFFFFF', 48),
        open: chip('BELUM TERISI', colors.negative, '#FFFFFF', 60), eq: chip('EQUILIBRIUM 50%', colors.blue, '#FFFFFF', 52),
        prem: chip('PREMIUM · MAHAL', 'rgba(255,82,99,0.92)', '#FFFFFF', 52), disc: chip('DISCOUNT · MURAH', 'rgba(25,214,154,0.92)', colors.ink, 52),
      } as Record<string, TextTexture>,
      note: {
        lh1: n(`${DATE(EV.lh1.i)} · ${usd(EV.lh1.p)}`), ll1: n(`${DATE(EV.ll1.i)} · ${usd(EV.ll1.p)}`), lh2: n(`${DATE(EV.lh2.i)} · ${usd(EV.lh2.p)}`), ll2: n(`${DATE(EV.ll2.i)} · ${usd(EV.ll2.p)}`),
        hh1: n(`${DATE(EV.hh1.i)} · ${usd(EV.hh1.p)}`), hl1: n(`${DATE(EV.hl1.i)} · ${usd(EV.hl1.p)}`), hh2: n(`${DATE(EV.hh2.i)} · ${usd(EV.hh2.p)}`),
        bos: n(`24 JUN TUTUP ${usd(EV.bosDn.p)} < ${usd(EV.lowJun18.p)}`, colors.light), choch: n(`14 JUL TUTUP ${usd(EV.choch.p)} > ${usd(EV.highJul6.p)}`, colors.light),
        ssl: n(`LOW 25 JUN · ${usd(EV.ll2.p)}`), eqh: n(`${usd(EV.eqh1.p)} ≈ ${usd(EV.eqh2.p)}`, colors.light),
        sweep: n(`WICK ${usd(EV.sweep.low)} · TUTUP ${usd(EV.sweep.close)}`, colors.text), sweepDate: n('1 JUL 2026'),
        idm: n(`9 AGU ${usd(EV.idm.p)} → 14 AGU ${usd(EV.idmDip.p)}`),
        ob: n('16 AGU · CANDLE TURUN TERAKHIR', colors.light), fvg: n(`${usd(EV.fvg.lo)} – ${usd(EV.fvg.hi)}`, colors.light),
        open: n(`LOW SESUDAHNYA ${usd(74968)} · 15 SEP`, colors.text), openDate: n('S/D 28 OKT 2026'),
        eq: n(usd(EV.range.mid), colors.light), rangeHi: n(usd(EV.range.hi)), rangeLo: n(usd(EV.range.lo)), aug: n(`1 AGU · ${usd(EV.hl1.p)}`, colors.positive),
      } as Record<string, TextTexture>,
    };
  }, 'smc-chart');

  // ---- Geometry built once ----
  const geo = useMemo(() => {
    const box = new THREE.BoxGeometry(1, 1, 1);
    const bodies = new THREE.InstancedMesh(box, new THREE.MeshStandardMaterial({roughness: 0.35, metalness: 0.2, emissive: new THREE.Color('#0a1a33'), clippingPlanes: CLIP}), N);
    const wicks = new THREE.InstancedMesh(box, new THREE.MeshBasicMaterial({toneMapped: false, clippingPlanes: CLIP}), N);
    const m = new THREE.Object3D();
    CANDLES.forEach((k, i) => {
      const up = k.c >= k.o;
      const top = Math.max(k.o, k.c), bot = Math.min(k.o, k.c);
      m.position.set(X(i), (Y(top) + Y(bot)) / 2, 0);
      m.scale.set(BODY, Math.max(Y(top) - Y(bot), 0.01), BODY);
      m.updateMatrix();
      bodies.setMatrixAt(i, m.matrix);
      bodies.setColorAt(i, new THREE.Color(up ? UP : DOWN));
      m.position.set(X(i), (Y(k.h) + Y(k.l)) / 2, 0);
      m.scale.set(0.014, Y(k.h) - Y(k.l), 0.014);
      m.updateMatrix();
      wicks.setMatrixAt(i, m.matrix);
      wicks.setColorAt(i, new THREE.Color(up ? '#8DC2FF' : '#7586A3'));
    });
    bodies.frustumCulled = wicks.frustumCulled = false;
    const downPts: Array<[number, number]> = [[EV.lh1.i, EV.lh1.p], [EV.ll1.i, EV.ll1.p], [EV.lh2.i, EV.lh2.p], [EV.ll2.i, EV.ll2.p], [EV.sweep.i, EV.sweep.low]];
    const upPts: Array<[number, number]> = [[EV.sweep.i, EV.sweep.low], [EV.hh1.i, EV.hh1.p], [EV.hl1.i, EV.hl1.p], [EV.hh2.i, EV.hh2.p]];
    const PER = 14;
    const down = line(dense(downPts, PER), colors.negative, 6);
    const up = line(dense(upPts, PER), '#19D69A', 6);
    // The illustrated return into the gap (mitigation, ILUSTRASI): dashed, drawn over the real candles.
    const mit = line(dense([[EV.hh2.i, EV.hh2.p], [EV.hh2.i + 6, 74500], [EV.hh2.i + 12, 67400], [EV.hh2.i + 18, 76500], [EV.hh2.i + 24, 80800]], 10), '#CFE0FA', 4, true);
    const levels = {
      bos: line([[EV.lowJun18.i, EV.lowJun18.p], [EV.bosDn.i + 2, EV.lowJun18.p]], colors.light, 4),
      choch: line([[EV.highJul6.i, EV.highJul6.p], [EV.choch.i + 2, EV.highJul6.p]], colors.light, 4),
      ssl: line([[EV.ll2.i, EV.ll2.p], [EV.sweep.i + 6, EV.ll2.p]], STOP, 3, true),
      eqh: line([[EV.eqh1.i, EV.eqh1.p], [EV.eqh2.i, EV.eqh2.p]], colors.light, 4, true),
      eq: line([[EV.sweep.i, EV.range.mid], [EV.hl1.i + 9, EV.range.mid]], colors.light, 4, true),
    };
    const axis = [60000, 70000, 80000].map((p) => line([[-6, p], [N + 5, p]], '#17284A', 2));
    // Stop piles (ILUSTRASI): under the 25 Jun low, over the 22 Jun / 15 Jul equal highs.
    const ssl = pileCubes(EV.ll2.i - 1, EV.sweep.i + 3, -1);
    const bsl = pileCubes(EV.eqh1.i - 1, EV.eqh2.i + 3, 1);
    const cube = new THREE.BoxGeometry(PILE * 0.62, PILE * 0.62, PILE * 0.62);
    const mat = () => new THREE.MeshStandardMaterial({color: '#FFFFFF', emissive: STOP, emissiveIntensity: 0.3, roughness: 0.45, metalness: 0.1, transparent: true, clippingPlanes: CLIP});
    const sslMesh = new THREE.InstancedMesh(cube, mat(), ssl.length);
    const bslMesh = new THREE.InstancedMesh(cube, mat(), bsl.length);
    sslMesh.frustumCulled = bslMesh.frustumCulled = false;
    return {bodies, wicks, down, up, mit, levels, axis, ssl, bsl, sslMesh, bslMesh, segs: {down: (downPts.length - 1) * PER, up: (upPts.length - 1) * PER}};
  }, []);

  if (!a) return null;

  // ---- Camera (and the price-axis scale that goes with each shot) ----
  const P = b.payoff;
  const wide = {a: 0, b: N - 1, lo: 55500, hi: 89500};
  const keys: Shot[] = [
    shot(0, {...wide, pitch: 4, widthFrac: 0.86}),
    shot(b.count - 4, {...wide, pitch: 3, widthFrac: 0.92, ease: 'linear'}),
    // Stage 1: low along the slide, settling frontal; then across to the climb.
    shot(b.s1 + 6, {a: 0, b: 44, lo: 55000, hi: 84000, yaw: -28, pitch: -2}),
    shot(b.up - 6, {a: 0, b: 44, lo: 55000, hi: 84000, yaw: -8, pitch: 3, ease: 'linear'}),
    shot(b.up + 14, {a: 38, b: 104, lo: 54000, hi: 87000, yaw: 10, pitch: 4}),
    shot(b.s2 - 4, {a: 38, b: 104, lo: 54000, hi: 87000, yaw: 5, pitch: 4, ease: 'linear'}),
    // Stage 2: the two breaks, close and frontal.
    shot(b.s2 + 14, {a: 24, b: 42, lo: 57500, hi: 68500}),
    shot(b.choch - 4, {a: 25, b: 43, lo: 57500, hi: 68500, ease: 'linear'}),
    shot(b.choch + 12, {a: 42, b: 60, lo: 57500, hi: 68000}),
    shot(b.s3 - 4, {a: 43, b: 61, lo: 57500, hi: 68000, ease: 'linear'}),
    // Stage 3: from the side, so the piles read as piles.
    shot(b.s3 + 16, {a: 28, b: 64, lo: 56000, hi: 69000, yaw: -36, pitch: 12}),
    shot(b.ssl + 10, {a: 32, b: 50, lo: 53800, hi: 63000, yaw: -32, pitch: 10}),
    shot(b.bsl + 8, {a: 30, b: 64, lo: 60500, hi: 69000, yaw: -24, pitch: 8}),
    shot(b.sweep - 30, {a: 30, b: 66, lo: 57000, hi: 69000, yaw: -18, pitch: 6, ease: 'linear'}),
    // Hero: dive along the time axis into the 1 Jul candle as its wick spears the pile.
    shot(b.wNembus - 4, {a: 33, b: 51, lo: 55500, hi: 63000, yaw: -40, pitch: 4}),
    shot(b.wSweep + 10, {a: 34, b: 50, lo: 55500, hi: 62500, yaw: -6, pitch: 4}),
    shot(b.idm - 4, {a: 34, b: 50, lo: 55500, hi: 62500, yaw: -3, pitch: 4, ease: 'linear'}),
    shot(b.idm + 14, {a: 72, b: 92, lo: 61500, hi: 67500}),
    shot(b.s4 - 4, {a: 73, b: 93, lo: 61500, hi: 67500, ease: 'linear'}),
    // Stage 4: three-quarter from the right, so the slab and the gap show their depth.
    shot(b.s4 + 14, {a: 80, b: 98, lo: 58500, hi: 72000, yaw: 22, pitch: 8}),
    shot(b.fvg + 10, {a: 84, b: 106, lo: 61500, hi: 82500, yaw: 18, pitch: 6}),
    shot(b.mitig + 8, {a: 86, b: 128, lo: 61500, hi: 83500, yaw: 8, pitch: 5}),
    shot(b.open + 14, {a: 84, b: N - 1, lo: 61500, hi: 89000, yaw: 4, pitch: 4}),
    shot(b.s5 - 4, {a: 84, b: N - 1, lo: 61500, hi: 89000, yaw: 2, pitch: 4, ease: 'linear'}),
    // Stage 5: the July range, frontal.
    shot(b.s5 + 14, {a: 38, b: 86, lo: 56500, hi: 68500}),
    shot(b.aug - 4, {a: 38, b: 86, lo: 56500, hi: 68500, ease: 'linear'}),
    shot(b.aug + 16, {a: 58, b: 86, lo: 59500, hi: 66500}),
    shot(P - 4, {a: 58, b: 86, lo: 59500, hi: 66500, ease: 'linear'}),
    // Payoff: the whole read chart.
    shot(P + 18, {...wide, yaw: -5, pitch: 6, widthFrac: 0.9}),
    shot(b.end, {...wide, yaw: 4, pitch: 5, widthFrac: 0.86, ease: 'linear'}),
  ];
  const sy = syAt(frame, keys);
  const Yw = (p: number) => Y(p) * sy;
  const V = (i: number, p: number, z = 0.3): [number, number, number] => [X(i), Yw(p), z];

  // ---- Layer timing ----
  const pulse = (f0: number) => ramp(frame, f0, f0 + 6) * (1 - ramp(frame, f0 + 16, f0 + 34));
  // A stage's layer: full during its stage, dimmed after, back up in the payoff.
  const layer = (from: number, until: number, dim = 0.3) => {
    if (frame < from) return 0;
    const inT = ramp(frame, from, from + 10, ease.out);
    if (frame < until) return inT;
    if (frame < P) return dim + (1 - dim) * (1 - ramp(frame, until, until + 12));
    return dim + (0.9 - dim) * ramp(frame, P, P + 12);
  };
  const L1 = layer(b.s1, b.s2), L2 = layer(b.s2, b.s3), L3 = layer(b.s3, b.s4), L4 = layer(b.s4, b.s5), L5 = layer(b.s5, P, 0);

  // Stage 1: the zigzag draws itself; tags land as it reaches each swing.
  const downDraw = ramp(frame, b.s1 + 8, b.up - 6, (t: number) => t);
  const upDraw = ramp(frame, b.up + 6, b.s2 - 8, (t: number) => t);
  geo.down.geometry.instanceCount = Math.round(geo.segs.down * downDraw);
  geo.up.geometry.instanceCount = Math.round(geo.segs.up * upDraw);
  (geo.down.material as LineMaterial).opacity = L1;
  (geo.up.material as LineMaterial).opacity = L1;
  const downN = 4 * downDraw, upN = 3 * upDraw;
  // Stage 2 levels, stage 3 levels, stage 5 midpoint.
  const setLine = (l: Line2, o: number) => {
    (l.material as LineMaterial).opacity = o;
    l.visible = o > 0.001;
  };
  setLine(geo.levels.bos, L2 * ramp(frame, b.s2 + 10, b.s2 + 24));
  setLine(geo.levels.choch, L2 * ramp(frame, b.choch, b.choch + 14));
  setLine(geo.levels.ssl, L3 * ramp(frame, b.ssl - 4, b.ssl + 8));
  setLine(geo.levels.eqh, L3 * ramp(frame, b.eqh, b.eqh + 12));
  setLine(geo.levels.eq, L5 * ramp(frame, b.s5 + 30, b.s5 + 44));
  const mitDraw = ramp(frame, b.mitig, b.mitig + 30, (t: number) => t);
  geo.mit.geometry.instanceCount = Math.round(40 * mitDraw);
  setLine(geo.mit, span(frame, b.mitig, b.open + 10));

  // Stage 3: piles grow; the 1 Jul wick takes the stops just under the low; the equal highs' stops go on 20–21 Jul.
  const sslGrow = ramp(frame, b.s3 + 4, b.ssl + 12, ease.out);
  const bslGrow = ramp(frame, b.bsl - 6, b.bsl + 14, ease.out);
  const replay = frame >= b.wNembus - 2 && frame < b.s4;
  const wickDown = replay ? ramp(frame, b.wNembus, b.wNembus + 26, ease.in) : frame >= b.s4 ? 1 : 0;
  const closeUp = replay ? ramp(frame, b.wTutup, b.wTutup + 20, ease.out) : 1;
  const wickTip = EV.sweep.open + (EV.sweep.low - EV.sweep.open) * wickDown;
  const bslTaken = ramp(frame, b.eqh + 34, b.eqh + 60);
  const m = new THREE.Object3D();
  const red = new THREE.Color(STOP), white = new THREE.Color('#FFFFFF'), tmp = new THREE.Color();
  const placePile = (mesh: THREE.InstancedMesh, cubes: typeof geo.ssl, edge: number, dir: 1 | -1, grow: number, taken: (c: (typeof geo.ssl)[number]) => number, opacity: number) => {
    cubes.forEach((c, i) => {
      const g = ramp(grow, (i / cubes.length) * 0.7, (i / cubes.length) * 0.7 + 0.3);
      const y = Yw(edge) + dir * PILE * (c.r + 0.6);
      const t = taken(c);
      // A taken stop flashes white, swells a little, then is gone.
      const flash = t > 0 && t < 1 ? Math.sin(t * Math.PI) : 0;
      m.position.set(c.x, y - dir * (1 - g) * 0.12 - dir * t * 0.06, c.z);
      m.scale.setScalar(Math.max(0.0001, g * (t < 0.5 ? 1 + 0.5 * flash : (1 - t) * 2 * (1 + 0.5 * flash))));
      m.updateMatrix();
      mesh.setMatrixAt(i, m.matrix);
      mesh.setColorAt(i, tmp.copy(red).lerp(white, flash));
    });
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    (mesh.material as THREE.MeshStandardMaterial).opacity = opacity;
    mesh.visible = opacity > 0.001;
  };
  // A stop is taken once the wick tip has passed its level (only the stops near the 1 Jul candle).
  // The 1 Jul wick takes the stops nearest the low around it, row by row as it reaches down.
  placePile(geo.sslMesh, geo.ssl, EV.ll2.p, -1, sslGrow, (c) => {
    const near = Math.abs(c.x - X(EV.sweep.i));
    if (near > 0.34 || c.r > 1) return 0;
    const t0 = 0.45 + c.r * 0.2 + near * 0.6;
    return frame >= b.s4 ? 1 : ramp(wickDown + (frame - b.wNembus - 26 > 0 ? (frame - b.wNembus - 26) / 30 : 0), t0, t0 + 0.35);
  }, L3);
  placePile(geo.bslMesh, geo.bsl, EV.eqh1.p + 40, 1, bslGrow, () => bslTaken, L3);

  const sw = EV.sweep.i;
  // While 1 Jul is replayed, its stored candle is scaled away (and restored on every other frame).
  {
    const k = CANDLES[sw];
    const top = Math.max(k.o, k.c), bot = Math.min(k.o, k.c);
    m.position.set(X(sw), (Y(top) + Y(bot)) / 2, 0);
    m.scale.set(BODY, replay ? 0.00001 : Math.max(Y(top) - Y(bot), 0.01), replay ? 0.00001 : BODY);
    m.updateMatrix();
    geo.bodies.setMatrixAt(sw, m.matrix);
    m.position.set(X(sw), (Y(k.h) + Y(k.l)) / 2, 0);
    m.scale.set(replay ? 0.00001 : 0.014, replay ? 0.00001 : Y(k.h) - Y(k.l), replay ? 0.00001 : 0.014);
    m.updateMatrix();
    geo.wicks.setMatrixAt(sw, m.matrix);
    geo.bodies.instanceMatrix.needsUpdate = geo.wicks.instanceMatrix.needsUpdate = true;
  }
  const swarmAt = (k: number) => (k === 0 ? b.wOrder : k === 1 ? b.wFvg : k === 2 ? b.wSweep0 : b.wPusing + (k - 3) * 1.2);

  return (
    <World3D keys={keys} panels={studioPanels.dark} bg={colors.bg} fog={[colors.bg, 30, 90]} envIntensity={0.5}>
      <ambientLight intensity={0.35} />
      <directionalLight position={[-4, 6, 8]} intensity={1.4} />
      <directionalLight position={[6, 3, 5]} intensity={0.5} color="#9fc6ff" />

      <ClipToStage band={[722, 1448]} />

      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, Yw(54000), -2]}>
        <planeGeometry args={[80, 60]} />
        <meshStandardMaterial map={a.floor} roughness={0.7} metalness={0.15} />
      </mesh>

      {/* The chart, with its price axis scaled for the shot */}
      <group scale={[1, sy, 1]}>
        {geo.axis.map((l, k) => <primitive key={k} object={l} />)}
        <primitive object={geo.bodies} />
        <primitive object={geo.wicks} />
        {replay && (
          <>
            {/* 1 Jul replayed: the wick reaches down into the pile, then the body closes back above */}
            <mesh position={[X(sw), (Y(EV.sweep.open) + Y(wickTip)) / 2, 0]}>
              <boxGeometry args={[0.018, Math.max(0.001, Y(EV.sweep.open) - Y(wickTip)), 0.018]} />
              <meshBasicMaterial color="#FFFFFF" toneMapped={false} clippingPlanes={CLIP} />
            </mesh>
            {closeUp > 0 && (
              <mesh position={[X(sw), (Y(EV.sweep.open) + Y(EV.sweep.open + (EV.sweep.close - EV.sweep.open) * closeUp)) / 2, 0]}>
                <boxGeometry args={[BODY * 1.15, Math.max(0.01, (Y(EV.sweep.close) - Y(EV.sweep.open)) * closeUp), BODY * 1.15]} />
                <meshStandardMaterial color={UP} emissive={UP} emissiveIntensity={0.9} clippingPlanes={CLIP} />
              </mesh>
            )}
          </>
        )}
        <primitive object={geo.down} />
        <primitive object={geo.up} />
        {Object.values(geo.levels).map((l, k) => <primitive key={k} object={l} />)}
        <primitive object={geo.mit} />
        {/* 4 · order block slab and the gap, open to the right edge */}
        <Zone i0={EV.ob.i} lo={EV.ob.lo} hi={EV.ob.hi} color={colors.blue} opacity={0.55 * L4 * ramp(frame, b.s4 + 8, b.s4 + 30)} />
        <Zone i0={EV.fvg.i - 1} lo={EV.fvg.lo} hi={EV.fvg.hi} color="#2FB4FF" opacity={0.4 * L4 * ramp(frame, b.fvg + 6, b.fvg + 30)} depth={0.6} />
        {/* 5 · premium / discount over the July range */}
        <Zone i0={EV.sweep.i} i1={EV.hl1.i + 9} lo={EV.range.mid} hi={EV.range.hi} color={colors.negative} opacity={0.22 * L5 * ramp(frame, b.prem, b.prem + 14)} depth={0.3} />
        <Zone i0={EV.sweep.i} i1={EV.hl1.i + 9} lo={EV.range.lo} hi={EV.range.mid} color={colors.positive} opacity={0.22 * L5 * ramp(frame, b.disc, b.disc + 14)} depth={0.3} />
        {L5 > 0 && (
          <mesh position={[X(EV.hh1.i) + 0.06, (Y(EV.range.lo) + Y(EV.range.hi)) / 2, 0.2]} scale={[1, ramp(frame, b.s5 + 6, b.s5 + 26), 1]}>
            <boxGeometry args={[0.02, Y(EV.range.hi) - Y(EV.range.lo), 0.02]} />
            <meshBasicMaterial color={colors.light} transparent opacity={L5} toneMapped={false} clippingPlanes={CLIP} />
          </mesh>
        )}
      </group>

      {/* Price axis labels */}
      {[60000, 70000, 80000].map((p, k) => <ScreenLabel key={p} tex={a.axis[k]} px={26} position={[X(N - 1) + 0.5, Yw(p), 0]} opacity={frame < b.s1 + 4 || frame >= P ? 0.9 : 0.55} />)}

      {/* Stop piles */}
      <primitive object={geo.sslMesh} />
      <primitive object={geo.bslMesh} />
      {replay && <Glow tex={a.glow} px={90} position={[X(sw), Yw(wickTip), 0.1]} color="#FFFFFF" opacity={0.9 * wickDown * (1 - 0.6 * closeUp)} />}

      {/* Cold open: every term lands on its spot, then they clear */}
      {a.swarm.map((s, k) => (
        <ScreenLabel key={k} tex={s.tex} px={k < 3 ? 48 : 40} position={V(s.i, s.p, 0.5 + (k % 3) * 0.04)} opacity={span(frame, swarmAt(k), b.chart + 6)} />
      ))}

      {/* 1 · Structure */}
      {([['lh', 'lh1', EV.lh1, 1, 1], ['ll', 'll1', EV.ll1, -1, 2], ['lh', 'lh2', EV.lh2, 1, 3], ['ll', 'll2', EV.ll2, -1, 4]] as const).map(([t, n, e, dir, k]) => {
        const o = ramp(downN, k - 1.05, k - 0.9);
        return (
          <group key={n}>
            <ScreenLabel tex={a.tag[t]} px={40} position={V(e.i, e.p + dir * 1700)} opacity={o * span(frame, b.s1, b.s2) + pulse(b.wStruktur) * 0.9} />
            <ScreenLabel tex={a.note[n]} px={24} position={V(e.i, e.p + dir * 3500)} opacity={o * span(frame, b.s1, b.up + 4)} />
          </group>
        );
      })}
      {([['hh', 'hh1', EV.hh1, 1, 1], ['hl', 'hl1', EV.hl1, -1, 2], ['hh', 'hh2', EV.hh2, 1, 3]] as const).map(([t, n, e, dir, k]) => {
        const o = ramp(upN, k - 0.15, k);
        return (
          <group key={n}>
            <ScreenLabel tex={a.tag[t]} px={40} position={V(e.i, e.p + dir * 1900)} opacity={o * span(frame, b.up, b.s2) + pulse(b.wStruktur) * 0.9} />
            <ScreenLabel tex={a.note[n]} px={24} position={V(e.i, e.p + dir * 3900)} opacity={o * span(frame, b.up, b.s2)} />
          </group>
        );
      })}

      {/* 2 · Breaks */}
      <ScreenLabel tex={a.tag.bos} px={42} position={V(EV.bosDn.i + 1, EV.lowJun18.p - 1300)} opacity={span(frame, b.wTutupBos + 4, b.s3)} />
      <ScreenLabel tex={a.note.bos} px={24} position={V(EV.bosDn.i + 1, EV.lowJun18.p - 2400)} opacity={span(frame, b.wTutupBos + 10, b.choch)} />
      <ScreenLabel tex={a.tag.choch} px={42} position={V(EV.choch.i - 1, EV.highJul6.p + 1300)} opacity={span(frame, b.choch + 10, b.s3)} />
      <ScreenLabel tex={a.note.choch} px={24} position={V(EV.choch.i - 1, EV.highJul6.p + 2300)} opacity={span(frame, b.choch + 16, b.s3)} />

      {/* 3 · Liquidity */}
      <ScreenLabel tex={a.tag.ssl} px={34} position={V(EV.ll2.i + 3, EV.ll2.p - 1500, 0.4)} opacity={span(frame, b.ssl, b.sweep - 30)} />
      <ScreenLabel tex={a.note.ssl} px={22} position={V(EV.ll2.i + 3, EV.ll2.p - 2300, 0.4)} opacity={span(frame, b.ssl + 6, b.sweep - 30)} />
      <ScreenLabel tex={a.tag.bsl} px={34} position={V((EV.eqh1.i + EV.eqh2.i) / 2, EV.eqh1.p + 1500, 0.4)} opacity={span(frame, b.bsl, b.sweep - 30)} />
      <ScreenLabel tex={a.tag.eqh} px={38} position={V((EV.eqh1.i + EV.eqh2.i) / 2, EV.eqh1.p + 2500, 0.4)} opacity={span(frame, b.eqh + 6, b.sweep - 30)} />
      <ScreenLabel tex={a.note.eqh} px={24} position={V((EV.eqh1.i + EV.eqh2.i) / 2, EV.eqh1.p + 3300, 0.4)} opacity={span(frame, b.eqh + 12, b.sweep - 30)} />
      {[EV.eqh1, EV.eqh2].map((e, k) => <Glow key={k} tex={a.glow} px={60} position={V(e.i, e.p, 0.12)} color={colors.light} opacity={L3 * ramp(frame, b.eqh, b.eqh + 10) * (frame < b.sweep - 30 ? 1 : 0.35)} />)}
      <ScreenLabel tex={a.tag.sweep} px={54} position={V(sw + 2.6, EV.sweep.low - 700, 0.4)} opacity={span(frame, b.wSweep - 2, b.idm + 6) + pulse(b.wSweepP) * 0.9} />
      <ScreenLabel tex={a.note.sweep} px={24} position={V(sw + 2.6, EV.sweep.low - 1350, 0.4)} opacity={span(frame, b.wSweep + 4, b.idm + 6)} />
      <ScreenLabel tex={a.note.sweepDate} px={24} position={V(sw, EV.sweep.high + 700, 0.4)} opacity={span(frame, b.sweep, b.idm + 6)} />
      <ScreenLabel tex={a.tag.idm} px={40} position={V(EV.idm.i, EV.idm.p + 1100, 0.35)} opacity={span(frame, b.idm + 6, b.s4)} />
      <ScreenLabel tex={a.note.idm} px={24} position={V(EV.idm.i, EV.idm.p + 1900, 0.35)} opacity={span(frame, b.idm + 12, b.s4)} />
      {[EV.idm, EV.idmDip].map((e, k) => <Glow key={k} tex={a.glow} px={56} position={V(e.i, e.p, 0.12)} color={k === 0 ? colors.light : STOP} opacity={span(frame, b.idm + 4 + k * 14, b.s4)} />)}

      {/* 4 · Entry areas */}
      <Glow tex={a.glow} px={110} position={V(EV.ob.i, (EV.ob.lo + EV.ob.hi) / 2, 0.15)} color={colors.light} opacity={span(frame, b.s4 + 6, b.fvg + 4) * (0.75 + 0.25 * Math.sin(frame / 6))} />
      <ScreenLabel tex={a.tag.ob} px={40} position={V(EV.ob.i - 1, EV.ob.lo - 1300, 0.45)} opacity={span(frame, b.s4 + 10, b.fvg + 4) + pulse(b.wEntry) * 0.9} />
      <ScreenLabel tex={a.note.ob} px={24} position={V(EV.ob.i - 1, EV.ob.lo - 2300, 0.45)} opacity={span(frame, b.s4 + 16, b.fvg + 4)} />
      <ScreenLabel tex={a.tag.fvg} px={46} position={V(EV.fvg.i + 6, (EV.fvg.lo + EV.fvg.hi) / 2 + 500, 0.5)} opacity={span(frame, b.fvg + 14, b.mitig + 4) + pulse(b.wEntry) * 0.9} />
      <ScreenLabel tex={a.note.fvg} px={24} position={V(EV.fvg.i + 6, (EV.fvg.lo + EV.fvg.hi) / 2 - 800, 0.5)} opacity={span(frame, b.fvg + 20, b.s5)} />
      <ScreenLabel tex={a.tag.mitig} px={30} position={V(EV.hh2.i + 12, 67400 - 1800, 0.5)} opacity={span(frame, b.mitig + 18, b.open + 10)} />
      <ScreenLabel tex={a.tag.open} px={44} position={V(132, (EV.fvg.lo + EV.fvg.hi) / 2 + 500, 0.5)} opacity={span(frame, b.open + 10, b.s5)} />
      <ScreenLabel tex={a.note.open} px={24} position={V(132, (EV.fvg.lo + EV.fvg.hi) / 2 - 1100, 0.5)} opacity={span(frame, b.open + 18, b.s5)} />
      <ScreenLabel tex={a.note.openDate} px={24} position={V(N - 9, EV.fvg.hi + 1600, 0.5)} opacity={span(frame, b.open + 18, b.s5)} />
      <Glow tex={a.glow} px={60} position={V(at('2026-09-15'), 74968, 0.12)} color="#FFFFFF" opacity={span(frame, b.open + 18, b.s5)} />

      {/* 5 · Premium / discount */}
      <ScreenLabel tex={a.note.rangeHi} px={22} position={V(EV.hh1.i + 4, EV.range.hi, 0.3)} opacity={L5 * ramp(frame, b.s5 + 18, b.s5 + 28) * (frame < P ? 1 : 0)} />
      <ScreenLabel tex={a.note.rangeLo} px={22} position={V(EV.hh1.i + 4, EV.range.lo, 0.3)} opacity={L5 * ramp(frame, b.s5 + 18, b.s5 + 28) * (frame < P ? 1 : 0)} />
      <ScreenLabel tex={a.tag.eq} px={34} position={V(EV.sweep.i + 9, EV.range.mid + 700, 0.35)} opacity={span(frame, b.s5 + 36, P)} />
      <ScreenLabel tex={a.note.eq} px={22} position={V(EV.sweep.i + 9, EV.range.mid - 650, 0.35)} opacity={span(frame, b.s5 + 42, P)} />
      <ScreenLabel tex={a.tag.prem} px={32} position={V(EV.hl1.i + 2, EV.range.hi - 1100, 0.35)} opacity={span(frame, b.prem + 6, P)} />
      <ScreenLabel tex={a.tag.disc} px={32} position={V(EV.sweep.i + 9, EV.range.lo + 900, 0.35)} opacity={span(frame, b.disc + 6, P)} />
      <Glow tex={a.glow} px={70 + 16 * Math.sin(frame / 5)} position={V(EV.hl1.i, EV.hl1.p, 0.15)} color={colors.positive} opacity={span(frame, b.aug + 4, P)} />
      <ScreenLabel tex={a.note.aug} px={26} position={V(EV.hl1.i, EV.hl1.p - 900, 0.4)} opacity={span(frame, b.aug + 10, P)} />
      {children}
    </World3D>
  );
};
