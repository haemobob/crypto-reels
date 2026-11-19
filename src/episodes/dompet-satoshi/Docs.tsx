import type {CSSProperties, ReactNode} from 'react';
import {Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {colors} from '../../theme/colors';
import {ease} from '../../theme/motion';
import {fonts} from '../../theme/typography';

export const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
export const ramp = (f: number, a: number, b: number, e = ease.inOut) => interpolate(f, [a, b], [0, 1], {...clamp, easing: e});
export const asset = (p: string) => staticFile(`episodes/dompet-satoshi/${p}`);
/** 0→1 between `from` and `to` (enter 10 frames, leave 8). */
export const life = (f: number, from: number, to: number, enter = 10) =>
  interpolate(f, [from, from + enter], [0, 1], {...clamp, easing: ease.out}) * interpolate(f, [to - 8, to], [1, 0], clamp);

type Rect = [number, number, number, number]; // x, y, w, h in image pixels

/**
 * A real screenshot or document in a fixed window: first shown whole and readable (contain), then zoomed into the
 * part the narration is about (`focus`, image pixels). `mark` outlines that part once the zoom has landed.
 */
export const DocWindow = ({src, size, from, to, x = 90, y, w = 900, h, focus, zoomAt, zoomEnd, mark, credit, dark = true, creditColor}: {src: string; size: [number, number]; from: number; to: number; x?: number; y: number; w?: number; h: number; focus?: Rect; zoomAt?: number; zoomEnd?: number; mark?: string; credit?: string; dark?: boolean; creditColor?: string}) => {
  const f = useCurrentFrame();
  const o = life(f, from, to);
  if (o <= 0.01) return null;
  const [iw, ih] = size;
  const s0 = Math.min(w / iw, h / ih);
  const c0 = [iw / 2, ih / 2];
  let s = s0;
  let c = c0;
  let z = 0;
  if (focus && zoomAt !== undefined) {
    z = ramp(f, zoomAt, zoomEnd ?? zoomAt + 24);
    const s1 = Math.min(w / focus[2], h / focus[3]) * 0.92;
    const c1 = [focus[0] + focus[2] / 2, focus[1] + focus[3] / 2];
    // Interpolate in log scale so the zoom feels even.
    s = Math.exp(Math.log(s0) + (Math.log(s1) - Math.log(s0)) * z);
    c = [c0[0] + (c1[0] - c0[0]) * z, c0[1] + (c1[1] - c0[1]) * z];
  }
  const left = w / 2 - c[0] * s;
  const top = h / 2 - c[1] * s;
  const markO = focus && mark ? ramp(f, (zoomEnd ?? (zoomAt ?? 0) + 24) - 2, (zoomEnd ?? (zoomAt ?? 0) + 24) + 8) : 0;
  return (
    <div style={{position: 'absolute', left: x, top: y + (1 - o) * 24, width: w, opacity: o}}>
      <div style={{position: 'relative', width: w, height: h, borderRadius: 20, overflow: 'hidden', background: dark ? '#0B0F19' : '#FFFFFF', border: `3px solid ${dark ? 'rgba(255,255,255,0.85)' : 'rgba(16,24,40,0.85)'}`, boxShadow: '0 30px 80px rgba(0,0,0,0.55)'}}>
        <Img src={asset(src)} style={{position: 'absolute', left, top, width: iw * s, height: ih * s, maxWidth: 'none'}} />
        {focus && markO > 0.01 && (
          <div style={{position: 'absolute', left: left + focus[0] * s - 6, top: top + focus[1] * s - 6, width: focus[2] * s + 12, height: focus[3] * s + 12, border: `4px solid ${colors.electric}`, borderRadius: 12, opacity: markO, boxShadow: `0 0 24px ${colors.electric}`}} />
        )}
      </div>
      {credit && <div style={{marginTop: 8, fontFamily: fonts.mono, fontSize: 17, fontWeight: 600, letterSpacing: '0.04em', color: creditColor ?? (dark ? '#A8BDD8' : '#4A5568'), textAlign: 'right'}}>{credit}</div>}
    </div>
  );
};

/** A Cryptonite-designed document panel carrying a real headline and its source (no publisher masthead). */
export const PaperCard = ({from, to, y, source, tag, children, accent = colors.electric, size = 38, style}: {from: number; to: number; y: number; source: string; tag?: string; children: ReactNode; accent?: string; size?: number; style?: CSSProperties}) => {
  const f = useCurrentFrame();
  const o = life(f, from, to);
  if (o <= 0.01) return null;
  return (
    <div style={{position: 'absolute', left: 90, width: 900, top: y + (1 - o) * 26, opacity: o, boxSizing: 'border-box', background: 'rgba(237,237,237,0.98)', borderRadius: 18, borderLeft: `10px solid ${accent}`, padding: '18px 26px 22px', boxShadow: '0 24px 60px rgba(0,0,0,0.55)', ...style}}>
      <div style={{display: 'flex', justifyContent: 'space-between', gap: 16, fontFamily: fonts.mono, fontWeight: 700, fontSize: 18, letterSpacing: '0.05em', color: '#3B4A63'}}>
        <span>{source}</span>
        {tag && <span style={{color: accent, whiteSpace: 'nowrap'}}>{tag}</span>}
      </div>
      <div style={{marginTop: 10, fontFamily: fonts.heading, fontWeight: 800, fontSize: size, lineHeight: 1.12, color: '#101828', letterSpacing: '-0.01em'}}>{children}</div>
    </div>
  );
};

/** A small mono label pill. */
export const Chip = ({children, color = colors.electric, bg = 'rgba(5,11,24,0.92)', size = 22, style}: {children: ReactNode; color?: string; bg?: string; size?: number; style?: CSSProperties}) => (
  <div style={{display: 'inline-block', padding: '9px 16px', borderRadius: 10, background: bg, border: `2px solid ${color}`, fontFamily: fonts.mono, fontWeight: 700, fontSize: size, letterSpacing: '0.04em', color: '#FFFFFF', whiteSpace: 'nowrap', ...style}}>{children}</div>
);
