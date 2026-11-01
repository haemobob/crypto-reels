import {useThree} from '@react-three/fiber';
import {useMemo} from 'react';
import {interpolate, staticFile, useCurrentFrame} from 'remotion';
import * as THREE from 'three';
import series from '../../../public/episodes/semua-merah/series.json';
import {fontsReady, textTexture, useAssets3D, type TextTexture} from '../../three/assets';
import {BitcoinCoin} from '../../three/BitcoinCoin';
import type {CamKey, V3} from '../../three/camera';
import {studioPanels} from '../../three/env';
import {canvasTexture, glowTexture, svgShapes} from '../../three/kit';
import {World3D} from '../../three/World3D';
import {colors} from '../../theme/colors';
import {ease} from '../../theme/motion';
import {fonts} from '../../theme/typography';

const ramp = (f: number, a: number, b: number, e = ease.inOut) => interpolate(f, [a, b], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: e});
const span = (f: number, a: number, b = Infinity) => ramp(f, a, a + 8, ease.out) * (Number.isFinite(b) ? 1 - ramp(f, b - 8, b) : 1);

export type BoardBeats = Record<
  'hook' | 'q' | 'myth' | 'trade' | 'swap' | 'price' | 'green' | 'bonds' | 'oil' | 'dollar' | 'why' | 'intel' | 'metals' | 'binance' | 'liq' | 'payoff' | 'check' | 'end'
  | 'wEmas' | 'wPerak' | 'wBitcoin' | 'wEnergi' | 'wHijau' | 'wTerpaksa',
  number
>;

type Tone = 'down' | 'up' | 'flat';
type Tile = {key: string; name: string; big: string; line: string; sub?: string; tone: Tone; col: number; row: number; spark?: number[]};
/** The 30 Oct 2026 close (CappNotes, S1); sparklines are real daily closes for October. */
const TILES: Tile[] = [
  {key: 'nasdaq', name: 'NASDAQ', big: '−2,86%', line: '25.437', tone: 'down', col: 0, row: 0},
  {key: 'chip', name: 'SAHAM CHIP (SOX)', big: '−7,20%', line: '10.689', tone: 'down', col: 1, row: 0},
  {key: 'oil', name: 'MINYAK BRENT', big: '+2,37%', line: '$113,43', tone: 'up', col: 2, row: 0},
  {key: 'spx', name: 'S&P 500', big: '−1,82%', line: '7.580', sub: 'TERBURUK SEJAK JUNI', tone: 'down', col: 0, row: 1, spark: (series.spx as Array<[string, number]>).map((d) => d[1])},
  {key: 'gold', name: 'EMAS', big: '−3,3%', line: '$3.899', sub: 'TERENDAH 1 TAHUN', tone: 'down', col: 1, row: 1},
  {key: 'bond', name: 'OBLIGASI AS 10 TAHUN', big: 'HARGA ↑', line: 'YIELD 4,94% (−0,04)', tone: 'up', col: 2, row: 1},
  {key: 'silver', name: 'PERAK', big: '−5,86%', line: '$49,14', sub: 'DI BAWAH $50', tone: 'down', col: 0, row: 2},
  {key: 'btc', name: 'BITCOIN', big: '−1,3%', line: '±$76.758', tone: 'down', col: 1, row: 2, spark: (series.btc as Array<[string, number]>).map((d) => d[1])},
  {key: 'dxy', name: 'DOLAR AS (DXY)', big: '−0,12%', line: '101,92', sub: 'MALAH TURUN', tone: 'flat', col: 2, row: 2},
  {key: 'energy', name: 'SAHAM ENERGI', big: '+1,91%', line: 'SEKTOR S&P 500', tone: 'up', col: 0, row: 3},
  {key: 'staples', name: 'KEBUTUHAN POKOK', big: '+1,41%', line: 'SEKTOR S&P 500', tone: 'up', col: 1, row: 3},
  {key: 'util', name: 'UTILITAS', big: '+0,67%', line: 'SEKTOR S&P 500', tone: 'up', col: 2, row: 3},
];
const TW = 1.6, TH = 1.0, GX = 1.75, GY = 1.12;
const tilePos = (t: Tile): V3 => [(t.col - 1) * GX, (1.5 - t.row) * GY, 0];
const TONE = {down: colors.negative, up: colors.positive, flat: '#8FA3C2'};

const drawTile = (t: Tile) =>
  canvasTexture(1000, 625, (ctx, w, h) => {
    const c = TONE[t.tone];
    const g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, '#0d1830');
    g.addColorStop(1, '#081022');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.roundRect(0, 0, w, h, 36);
    ctx.fill();
    ctx.lineWidth = 6;
    ctx.strokeStyle = `${c}AA`;
    ctx.stroke();
    ctx.fillStyle = '#A8BDD8';
    ctx.font = `700 46px "${fonts.mono}"`;
    ctx.fillText(t.name, 48, 92);
    ctx.fillStyle = c;
    ctx.font = `800 ${t.big.length > 7 ? 124 : 150}px "${fonts.heading}"`;
    ctx.fillText(t.big, 44, 265);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = `700 ${t.line.length > 14 ? 46 : 60}px "${fonts.mono}"`;
    ctx.fillText(t.line, 48, 358);
    if (t.sub) {
      ctx.fillStyle = c;
      ctx.font = `700 38px "${fonts.mono}"`;
      ctx.fillText(t.sub, 48, 418);
    }
    if (t.spark) {
      const xs = t.spark, lo = Math.min(...xs), hi = Math.max(...xs);
      ctx.beginPath();
      xs.forEach((v, i) => {
        const x = 48 + (i / (xs.length - 1)) * (w - 96), y = h - 40 - ((v - lo) / (hi - lo)) * 130;
        if (i) ctx.lineTo(x, y);
        else ctx.moveTo(x, y);
      });
      ctx.lineWidth = 7;
      ctx.strokeStyle = c;
      ctx.stroke();
      ctx.fillStyle = '#6A80A3';
      ctx.font = `600 30px "${fonts.mono}"`;
      ctx.fillText('1–30 OKT', w - 210, h - 190);
    }
  }).texture;

/** Two planes through the camera that cut everything above and below the stage band (screen px). */
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

/** A camera key that fits the rectangle [x0..x1] × [y0..y1] (in the plane z) inside the stage (screen y 740–1430). */
const fit = (f: number, x0: number, x1: number, y0: number, y1: number, {z = 0, yaw = 0, pitch = 3, ease, fill = 0.9}: {z?: number; yaw?: number; pitch?: number; ease?: CamKey['ease']; fill?: number} = {}): CamKey => {
  const t = Math.tan((17 * Math.PI) / 180);
  const d = Math.max((x1 - x0) / fill / (2 * t * (1080 / 1920)), (y1 - y0) / fill / (2 * t * (690 / 1920)));
  const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2, ya = (yaw * Math.PI) / 180, pa = (pitch * Math.PI) / 180;
  return {f, pos: [cx + d * Math.sin(ya) * Math.cos(pa), cy + d * Math.sin(pa), z + d * Math.cos(ya) * Math.cos(pa)], look: [cx, cy, z], fov: 34, shift: -125, ease};
};

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
const ScreenLabel = ({tex, px, position, opacity = 1}: {tex: TextTexture; px: number; position: V3; opacity?: number}) => {
  const {camera} = useThree();
  if (opacity <= 0.001) return null;
  const cam = camera as THREE.PerspectiveCamera;
  const p = new THREE.Vector3(...position);
  opacity *= inStage(cam, p, px / 2, (px * tex.aspect) / 2);
  if (opacity <= 0.001) return null;
  const h = (px * 2 * cam.position.distanceTo(p) * Math.tan((cam.fov * Math.PI) / 360)) / 1920;
  return (
    <mesh position={position} quaternion={cam.quaternion.clone()} renderOrder={20}>
      <planeGeometry args={[h * tex.aspect, h]} />
      <meshBasicMaterial map={tex.texture} transparent opacity={opacity} depthTest={false} depthWrite={false} toneMapped={false} />
    </mesh>
  );
};

export const BoardWorld = ({b}: {b: BoardBeats}) => {
  const frame = useCurrentFrame();
  const a = useAssets3D(async () => {
    await fontsReady();
    const chip = (s: string, bg: string, color = '#FFFFFF', px = 56) => textTexture(s, {family: fonts.mono, weight: 700, px, color, tracking: 2, bg, pad: 16, radius: 12});
    const mono = (s: string, color: string, px = 52) => textTexture(s, {family: fonts.mono, weight: 700, px, color, tracking: 2});
    return {
      glow: glowTexture(),
      symbol: await svgShapes(staticFile('episodes/semua-merah/bitcoin-symbol.svg'), '#FFF'),
      tiles: Object.fromEntries(TILES.map((t) => [t.key, drawTile(t)])),
      cash: canvasTexture(512, 256, (ctx, w, h) => {
        ctx.fillStyle = '#d9efe4';
        ctx.fillRect(0, 0, w, h);
        ctx.strokeStyle = '#6d9c86';
        ctx.lineWidth = 10;
        ctx.strokeRect(14, 14, w - 28, h - 28);
        ctx.fillStyle = '#3d6b56';
        ctx.font = `800 150px "${fonts.heading}"`;
        ctx.textAlign = 'center';
        ctx.fillText('$', w / 2, h / 2 + 54);
      }).texture,
      t: {
        myth: chip('KABUR KE CASH?', 'rgba(255,82,99,0.92)'), cashBox: chip('CASH', '#2A3E63', '#FFFFFF', 64),
        seller: chip('PENJUAL', '#2A3E63'), buyer: chip('PEMBELI', '#2A3E63'),
        same: chip('UANG DI PASAR: TETAP', colors.blue), ilus: mono('ILUSTRASI', colors.muted, 40),
        priceOld: mono('$78.000', colors.text, 60), priceNew: mono('$76.800', colors.negative, 64), priceNote: mono('DISEPAKATI LEBIH MURAH', colors.negative, 40),
        intel: chip('INTEL −28,6% · PROYEKSI LEMAH', 'rgba(255,82,99,0.95)', '#FFFFFF', 46),
        fed: chip('PELUANG FED NAIK DES ±72%', 'rgba(255,82,99,0.95)', '#FFFFFF', 46), fedNote: mono('KATA ANALIS · PELUANG DARI PASAR PREDIKSI', colors.muted, 34),
        binance: chip('BINANCE: INSIDEN ±$6,3 M', 'rgba(255,82,99,0.95)', '#FFFFFF', 46), binanceNote: mono('DILAPORKAN · ±$3 M DIBEKUKAN', colors.muted, 34),
        liq: chip('LIKUIDASI PAKSA >$1,5 M · 24 JAM', '#FFFFFF', colors.ink, 46),
      } as Record<string, TextTexture>,
    };
  }, 'board');
  const geo = useMemo(() => ({tile: new THREE.PlaneGeometry(TW, TH), frame: new THREE.BoxGeometry(TW + 0.04, TH + 0.04, 0.06), note: new THREE.BoxGeometry(0.62, 0.028, 0.3)}), []);
  if (!a) return null;

  // ---- When each tile is on and lit ----
  const HOOK: Record<string, number> = {spx: b.hook, gold: b.wEmas, silver: b.wPerak, btc: b.wBitcoin};
  const GREEN: Record<string, number> = {bond: b.bonds, oil: b.oil, energy: b.wEnergi, staples: b.wEnergi + 10, util: b.wEnergi + 20, dxy: b.dollar};
  const tileOn = (t: Tile) => {
    if (t.key === 'spx') return 1; // the real anchor is on screen from frame 0
    if (HOOK[t.key] !== undefined) return ramp(frame, HOOK[t.key] - 2, HOOK[t.key] + 8, ease.out);
    if (GREEN[t.key] !== undefined) return ramp(frame, GREEN[t.key] - 2, GREEN[t.key] + 10, ease.out);
    return ramp(frame, b.why - 4, b.why + 10, ease.out); // the two red tech tiles join for the triggers
  };
  // The trade happens in front of the board; the board dims behind it.
  const tradeOn = span(frame, b.myth, b.green + 4);
  const boardDim = 1 - 0.86 * tradeOn;
  const focus = (t: Tile) => {
    if (frame >= b.payoff) {
      const green = t.tone === 'up' ? ramp(frame, b.wHijau - 2, b.wHijau + 8) * (1 - ramp(frame, b.wTerpaksa - 6, b.wTerpaksa + 6)) : 0;
      const forced = t.key === 'btc' ? ramp(frame, b.wTerpaksa - 2, b.wTerpaksa + 8) : 0;
      return 0.55 + 0.45 * Math.max(green, forced);
    }
    if (frame >= b.why) {
      const lit = t.key === 'chip' || t.key === 'nasdaq' ? span(frame, b.intel - 4, b.metals) : t.key === 'gold' || t.key === 'silver' ? span(frame, b.metals - 4, b.binance) : t.key === 'btc' ? span(frame, b.binance - 4, b.payoff) : 0;
      return 0.4 + 0.6 * lit;
    }
    return 1;
  };

  // ---- Trade: the coin goes to the buyer, the cash to the seller ----
  const SELLER: V3 = [-1.75, -0.25, 1.6], BUYER: V3 = [0.0, -0.25, 1.6];
  const cross = ramp(frame, b.trade + 20, b.swap + 18, ease.inOut);
  const arc = (from: V3, to: V3, t: number, lift: number): V3 => [from[0] + (to[0] - from[0]) * t, from[1] + (to[1] - from[1]) * t + Math.sin(Math.PI * t) * lift, from[2] + (to[2] - from[2]) * t];
  const coinP = arc([SELLER[0], SELLER[1] + 0.55, SELLER[2]], [BUYER[0], BUYER[1] + 0.55, BUYER[2]], cross, 0.55);
  const cashP = arc([BUYER[0], BUYER[1] + 0.2, BUYER[2] + 0.25], [SELLER[0], SELLER[1] + 0.2, SELLER[2] + 0.25], cross, -0.35);
  const priceSwap = ramp(frame, b.price + 10, b.price + 22);

  // ---- Camera ----
  const keys: CamKey[] = [
    fit(0, -2.6, 0.85, -1.2, 1.2, {pitch: 2}),
    fit(b.q - 2, -2.5, 0.75, -1.15, 1.15, {pitch: 2, ease: 'linear'}),
    // The myth and the trade, in front of the dimmed board.
    fit(b.myth + 10, -2.5, 0.75, -0.9, 1.3, {z: 1.6, pitch: 6}),
    fit(b.green - 4, -2.45, 0.7, -0.85, 1.3, {z: 1.6, pitch: 6, ease: 'linear'}),
    // Hero: pull back to the whole board.
    fit(b.bonds + 4, -2.6, 2.6, -2.25, 2.25, {pitch: 2}),
    fit(b.why - 4, -2.6, 2.6, -2.25, 2.25, {pitch: 1, ease: 'linear'}),
    // The triggers, one by one.
    fit(b.intel + 6, -2.65, 0.9, 0.95, 2.3, {yaw: -6, pitch: 3}),
    fit(b.metals - 4, -2.65, 0.9, 0.95, 2.3, {yaw: -3, pitch: 3, ease: 'linear'}),
    fit(b.metals + 10, -2.65, 0.9, -1.25, 1.15, {pitch: 2}),
    fit(b.binance - 4, -2.65, 0.9, -1.25, 1.15, {pitch: 2, ease: 'linear'}),
    fit(b.binance + 10, -1.15, 1.15, -1.95, -0.02, {yaw: 4, pitch: 2}),
    fit(b.payoff - 4, -1.1, 1.1, -1.95, -0.02, {yaw: 2, pitch: 2, ease: 'linear'}),
    // Payoff: the whole board again.
    fit(b.payoff + 18, -2.6, 2.6, -2.3, 2.25, {pitch: 2}),
    fit(b.end, -2.55, 2.55, -2.3, 2.25, {pitch: 1, ease: 'linear'}),
  ];

  const tileP = (k: string) => tilePos(TILES.find((t) => t.key === k)!);
  const card = (k: string, dy: number): V3 => {
    const p = tileP(k);
    return [p[0], p[1] + dy, 0.35];
  };

  return (
    <World3D keys={keys} panels={studioPanels.dark} bg={colors.bg} envIntensity={0.45}>
      <ClipToStage band={[722, 1448]} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[-3, 5, 8]} intensity={1.2} />

      {/* The board */}
      {TILES.map((t) => {
        const on = tileOn(t);
        if (on <= 0.001) return null;
        const p = tilePos(t);
        const o = on * boardDim * focus(t);
        return (
          <group key={t.key} position={[p[0], p[1], p[2] - (1 - on) * 0.6]}>
            <mesh geometry={geo.frame} position={[0, 0, -0.04]}>
              <meshStandardMaterial color="#0a1428" metalness={0.5} roughness={0.35} transparent opacity={o} clippingPlanes={CLIP} />
            </mesh>
            <mesh geometry={geo.tile}>
              <meshBasicMaterial map={a.tiles[t.key]} transparent opacity={o} toneMapped={false} clippingPlanes={CLIP} />
            </mesh>
            {t.tone !== 'flat' && (
              <sprite position={[0, 0, -0.2]} scale={[TW * 1.7, TH * 1.7, 1]}>
                <spriteMaterial map={a.glow} color={TONE[t.tone]} transparent opacity={0.16 * o} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} clippingPlanes={CLIP} />
              </sprite>
            )}
          </group>
        );
      })}

      {/* Myth: a CASH box */}
      {(() => {
        const o = span(frame, b.myth, b.trade + 16);
        if (o <= 0) return null;
        const strike = ramp(frame, b.trade - 2, b.trade + 8);
        return (
          <group position={[-0.875, -0.1, 1.4]}>
            <mesh>
              <boxGeometry args={[1.1, 0.75, 0.75]} />
              <meshStandardMaterial color="#1E3256" metalness={0.6} roughness={0.3} transparent opacity={o} />
            </mesh>
            <mesh position={[0, 0, 0.38]} rotation={[0, 0, 0.5]} scale={[strike, 1, 1]}>
              <boxGeometry args={[1.5, 0.07, 0.02]} />
              <meshBasicMaterial color={colors.negative} transparent opacity={o} toneMapped={false} />
            </mesh>
          </group>
        );
      })()}
      <ScreenLabel tex={a.t.cashBox} px={50} position={[-0.875, -0.1, 1.82]} opacity={span(frame, b.myth + 4, b.trade + 16)} />
      <ScreenLabel tex={a.t.myth} px={44} position={[-0.875, 0.62, 1.4]} opacity={span(frame, b.myth + 8, b.trade + 16)} />

      {/* Trade (ILUSTRASI) */}
      {tradeOn > 0 && frame >= b.trade - 4 && (
        <group>
          {[SELLER, BUYER].map((p, k) => (
            <mesh key={k} position={[p[0], p[1] - 0.12, p[2]]}>
              <cylinderGeometry args={[0.62, 0.66, 0.12, 48]} />
              <meshStandardMaterial color="#13213d" metalness={0.5} roughness={0.35} transparent opacity={ramp(frame, b.trade - 4, b.trade + 8) * tradeOn} />
            </mesh>
          ))}
          <group position={coinP}>
            <BitcoinCoin symbol={a.symbol} scale={0.32 * ramp(frame, b.trade, b.trade + 10, ease.out) * tradeOn} rotation={[0, frame * 0.04, 0]} />
          </group>
          {Array.from({length: 6}, (_, k) => (
            <mesh key={k} position={[cashP[0], cashP[1] + k * 0.05, cashP[2]]} rotation={[-Math.PI / 2, 0, 0.1 * Math.sin(k * 2.1)]} scale={ramp(frame, b.trade + 6, b.trade + 16, ease.out) * tradeOn}>
              <planeGeometry args={[0.7, 0.35]} />
              <meshStandardMaterial map={a.cash} side={THREE.DoubleSide} roughness={0.6} />
            </mesh>
          ))}
        </group>
      )}
      <ScreenLabel tex={a.t.seller} px={34} position={[SELLER[0], SELLER[1] - 0.5, SELLER[2] + 0.4]} opacity={span(frame, b.trade + 2, b.green + 4)} />
      <ScreenLabel tex={a.t.buyer} px={34} position={[BUYER[0], BUYER[1] - 0.5, BUYER[2] + 0.4]} opacity={span(frame, b.trade + 4, b.green + 4)} />
      <ScreenLabel tex={a.t.same} px={40} position={[-0.875, 1.05, 1.6]} opacity={span(frame, b.swap + 8, b.price + 4)} />
      <ScreenLabel tex={a.t.priceOld} px={44} position={[BUYER[0], BUYER[1] + 1.2, BUYER[2]]} opacity={span(frame, b.price - 4, b.green + 4) * (1 - priceSwap)} />
      <ScreenLabel tex={a.t.priceNew} px={50} position={[BUYER[0], BUYER[1] + 1.2, BUYER[2]]} opacity={span(frame, b.price - 4, b.green + 4) * priceSwap} />
      <ScreenLabel tex={a.t.priceNote} px={26} position={[BUYER[0], BUYER[1] + 0.92, BUYER[2]]} opacity={span(frame, b.price + 18, b.green + 4)} />
      <ScreenLabel tex={a.t.ilus} px={22} position={[-0.875, -1.15, 1.6]} opacity={span(frame, b.trade + 4, b.green + 4)} />

      {/* Triggers */}
      <ScreenLabel tex={a.t.intel} px={40} position={card('chip', -0.62)} opacity={span(frame, b.intel + 4, b.metals)} />
      <ScreenLabel tex={a.t.fed} px={40} position={[-0.875, 0.56 - 0.66, 0.4]} opacity={span(frame, b.metals + 6, b.binance)} />
      <ScreenLabel tex={a.t.fedNote} px={22} position={[-0.875, 0.56 - 0.9, 0.4]} opacity={span(frame, b.metals + 12, b.binance)} />
      <ScreenLabel tex={a.t.binance} px={40} position={card('btc', -0.62)} opacity={span(frame, b.binance + 6, Infinity)} />
      <ScreenLabel tex={a.t.binanceNote} px={22} position={card('btc', -0.86)} opacity={span(frame, b.binance + 12, b.payoff)} />
      <ScreenLabel tex={a.t.liq} px={36} position={card('btc', -1.12)} opacity={span(frame, b.liq + 4, Infinity)} />
    </World3D>
  );
};
