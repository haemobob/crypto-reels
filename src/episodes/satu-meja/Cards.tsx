import type {ReactNode} from 'react';
import {Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {colors} from '../../theme/colors';
import {ease} from '../../theme/motion';
import {fonts} from '../../theme/typography';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
/** 0→1 between `from` and `to` (enter 10 frames, leave 8). */
export const life = (f: number, from: number, to: number) =>
  interpolate(f, [from, from + 10], [0, 1], {...clamp, easing: ease.out}) * interpolate(f, [to - 8, to], [1, 0], clamp);

/** A real photo in a framed window, slow push-in while on screen, credit underneath. */
export const PhotoCard = ({src, from, to, x = 90, y = 752, w = 900, h = 490, credit, focus = '50% 40%', push = 0.07, zoom = 1}: {src: string; from: number; to: number; x?: number; y?: number; w?: number; h?: number; credit: string; focus?: string; push?: number; zoom?: number}) => {
  const f = useCurrentFrame();
  const o = life(f, from, to);
  if (o <= 0.01) return null;
  const k = zoom * interpolate(f, [from, to], [1, 1 + push], clamp);
  return (
    <div style={{position: 'absolute', left: x, top: y + (1 - Math.min(1, o * 1.2)) * 30, width: w, opacity: o}}>
      <div style={{width: w, height: h, borderRadius: 22, overflow: 'hidden', border: '3px solid rgba(255,255,255,0.9)', boxShadow: '0 30px 80px rgba(0,0,0,0.6)'}}>
        <Img src={staticFile(`episodes/satu-meja/photos/${src}`)} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: focus, transform: `scale(${k})`, transformOrigin: focus}} />
      </div>
      <div style={{marginTop: 8, fontFamily: fonts.mono, fontSize: 16, fontWeight: 600, letterSpacing: '0.04em', color: '#A8BDD8', textAlign: 'right'}}>{credit}</div>
    </div>
  );
};

/** A round portrait cut from a real photo, with a name. */
export const Portrait = ({src, from, to, x, y, name, focus = '50% 30%', zoom = 1.6, color = colors.electric}: {src: string; from: number; to: number; x: number; y: number; name: string; focus?: string; zoom?: number; color?: string}) => {
  const f = useCurrentFrame();
  const o = life(f, from, to);
  if (o <= 0.01) return null;
  const d = 176;
  return (
    <div style={{position: 'absolute', left: x - d / 2, top: y + (1 - o) * 24, width: d, opacity: o, textAlign: 'center'}}>
      <div style={{width: d, height: d, borderRadius: d / 2, overflow: 'hidden', border: `5px solid ${color}`, boxShadow: '0 18px 50px rgba(0,0,0,0.6)', background: '#0B1730'}}>
        <Img src={staticFile(`episodes/satu-meja/photos/${src}`)} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: focus, transform: `scale(${zoom})`, transformOrigin: focus}} />
      </div>
      <div style={{marginTop: 12, fontFamily: fonts.heading, fontWeight: 800, fontSize: 30, color: '#FFFFFF', letterSpacing: '-0.01em', textShadow: '0 2px 10px rgba(0,0,0,0.8)'}}>{name}</div>
    </div>
  );
};

/** A Cryptonite-designed report card: our summary, the outlet and date (no publisher mastheads). */
export const InfoCard = ({from, to, source, children, y = 1296, accent = colors.electric, tag}: {from: number; to: number; source: string; children: ReactNode; y?: number; accent?: string; tag?: string}) => {
  const f = useCurrentFrame();
  const o = life(f, from, to);
  if (o <= 0.01) return null;
  return (
    <div style={{position: 'absolute', left: 90, width: 900, top: y + (1 - o) * 26, opacity: o, background: 'rgba(237,237,237,0.97)', borderRadius: 18, borderLeft: `10px solid ${accent}`, padding: '18px 24px', boxShadow: '0 24px 60px rgba(0,0,0,0.55)'}}>
      <div style={{display: 'flex', justifyContent: 'space-between', fontFamily: fonts.mono, fontWeight: 700, fontSize: 18, letterSpacing: '0.05em', color: '#3B4A63'}}>
        <span>{source}</span>
        {tag && <span style={{color: accent}}>{tag}</span>}
      </div>
      <div style={{marginTop: 8, fontFamily: fonts.heading, fontWeight: 800, fontSize: 38, lineHeight: 1.12, color: '#101828', letterSpacing: '-0.01em'}}>{children}</div>
    </div>
  );
};
