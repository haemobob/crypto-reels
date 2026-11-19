import type {ReactNode} from 'react';
import {Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import raw from '../../../public/episodes/satu-meja/countries.json';
import {ease} from '../../theme/motion';
import {fonts} from '../../theme/typography';

/**
 * A real satellite world map (NASA Blue Marble, Dec 2004, public domain; a sharper NASA tile over Asia-Pacific)
 * in equirectangular projection, with Natural Earth borders (public domain) for country highlights. The camera is a
 * lon/lat centre plus a visible span in degrees; the map repeats once to the east so Pacific views can cross 180°.
 */
const WM = 5400; // map units = base image pixels
const HM = WM / 2;
export const mx = (lon: number) => ((lon + 180) / 360) * WM;
export const my = (lat: number) => ((90 - lat) / 180) * HM;

export type ViewDef = {lon: number; lat: number; span: number};
export type Cam = {s: number; tx: number; ty: number; toScreen: (lon: number, lat: number) => [number, number]};
const CX = 540;
// The map lives in its own window, so headlines and captions above it sit on clean navy.
export const MAP_TOP = 740;
export const MAP_H = 530;
export const CY = MAP_TOP + MAP_H / 2;

export const camAt = (v: ViewDef): Cam => {
  const s = 1080 / ((v.span / 360) * WM);
  const tx = CX - mx(v.lon) * s;
  const ty = CY - my(v.lat) * s;
  return {s, tx, ty, toScreen: (lon, lat) => [tx + mx(lon) * s, ty + my(lat) * s]};
};

/** Interpolates views along keys (frame, view), easing each move over `len` frames; zoom moves in log space. */
export const useView = (keys: Array<[number, ViewDef]>, len = 34): ViewDef => {
  const f = useCurrentFrame();
  let k = 0;
  while (k + 1 < keys.length && f >= keys[k + 1][0]) k++;
  if (k === 0 && f < keys[0][0]) return keys[0][1];
  const prev = k > 0 ? keys[k - 1][1] : keys[0][1];
  const cur = keys[k][1];
  const t = interpolate(f, [keys[k][0] - 4, keys[k][0] - 4 + len], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease.inOut});
  const lerp = (a: number, b: number) => a + (b - a) * t;
  return {lon: lerp(prev.lon, cur.lon), lat: lerp(prev.lat, cur.lat), span: Math.exp(lerp(Math.log(prev.span), Math.log(cur.span)))};
};

type Rings = Record<string, number[][][]>;
const C = raw as unknown as Rings;
const ringPath = (ring: number[][], dx: number) => ring.map(([lon, lat], i) => `${i ? 'L' : 'M'}${(mx(lon) + dx).toFixed(1)},${my(lat).toFixed(1)}`).join('') + 'Z';
const PATHS: Record<string, string> = Object.fromEntries(Object.entries(C).map(([k, rings]) => [k, rings.map((r) => ringPath(r, 0)).join('') + rings.map((r) => ringPath(r, WM)).join('')]));

export type Highlight = {code: string; color: string; o: number};

export const WorldMap = ({view, highlights, children}: {view: ViewDef; highlights: Highlight[]; children?: (cam: Cam) => ReactNode}) => {
  const cam = camAt(view);
  const grade = {filter: 'brightness(0.62) saturate(0.85) contrast(1.05)'};
  // Asia-Pacific tile: 95°E–150°E, 10°N–55°N.
  const tile = {left: mx(95), top: my(55), width: mx(150) - mx(95), height: my(10) - my(55)};
  return (
    <div style={{position: 'absolute', left: 0, top: MAP_TOP, width: 1080, height: MAP_H, overflow: 'hidden', borderTop: '1px solid rgba(117,199,255,0.25)', borderBottom: '1px solid rgba(117,199,255,0.25)'}}>
      <div style={{position: 'absolute', left: 0, top: -MAP_TOP, width: 1080, height: 1920}}>
      <div style={{position: 'absolute', left: 0, top: 0, width: WM * 2, height: HM, transformOrigin: '0 0', transform: `translate(${cam.tx}px, ${cam.ty}px) scale(${cam.s})`}}>
        {[0, WM].map((dx) => (
          <Img key={dx} src={staticFile('episodes/satu-meja/world-5400.jpg')} style={{position: 'absolute', left: dx, top: 0, width: WM, height: HM, ...grade}} />
        ))}
        <Img src={staticFile('episodes/satu-meja/asia-95E-150E-10N-55N.jpg')} style={{position: 'absolute', ...tile, ...grade}} />
        <svg width={WM * 2} height={HM} viewBox={`0 0 ${WM * 2} ${HM}`} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
          {highlights.map(({code, color, o}) =>
            o <= 0.01 ? null : (
              <path key={code} d={PATHS[code]} fill={color} fillOpacity={0.36 * o} stroke={color} strokeOpacity={o} strokeWidth={2.6} vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
            ),
          )}
        </svg>
      </div>
      {children?.(cam)}
      </div>
    </div>
  );
};

/** A country name tag (no pin) in screen space. */
export const Tag = ({cam, lon, lat, label, o, color = '#FFFFFF'}: {cam: Cam; lon: number; lat: number; label: string; o: number; color?: string}) => {
  if (o <= 0.01) return null;
  const [x, y] = cam.toScreen(lon, lat);
  return (
    <div style={{position: 'absolute', left: x, top: y, transform: 'translate(-50%, -50%)', opacity: o, fontFamily: fonts.heading, fontWeight: 800, fontSize: 34, letterSpacing: '0.02em', color, textShadow: '0 2px 10px rgba(0,0,0,0.95), 0 0 2px rgba(0,0,0,1)', whiteSpace: 'nowrap'}}>{label}</div>
  );
};

/** A pin with a label, in screen space at a lon/lat (so text keeps its size). */
export const Pin = ({cam, lon, lat, label, o, color = '#FFFFFF', side = 'right', sub}: {cam: Cam; lon: number; lat: number; label: string; o: number; color?: string; side?: 'left' | 'right'; sub?: string}) => {
  if (o <= 0.01) return null;
  const [x, y] = cam.toScreen(lon, lat);
  const pulse = 1 + 0.25 * Math.sin(o * Math.PI);
  return (
    <div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, pointerEvents: 'none', opacity: o}}>
      <div style={{position: 'absolute', left: x - 9, top: y - 9, width: 18, height: 18, borderRadius: 9, background: color, boxShadow: `0 0 0 ${6 * pulse}px rgba(255,255,255,0.18)`}} />
      <div style={{position: 'absolute', top: y - 26, ...(side === 'right' ? {left: x + 22} : {right: 1080 - x + 22}), background: 'rgba(5,11,24,0.92)', border: `2px solid ${color}`, borderRadius: 10, padding: '6px 12px', fontFamily: fonts.mono, fontWeight: 700, fontSize: 22, letterSpacing: '0.04em', color: '#FFFFFF', whiteSpace: 'nowrap'}}>
        {label}
        {sub && <div style={{fontSize: 16, color: '#A8BDD8', fontWeight: 600, marginTop: 2}}>{sub}</div>}
      </div>
    </div>
  );
};
