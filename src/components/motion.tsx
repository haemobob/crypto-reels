/**
 * The living-frame kit (reference/retention-playbook.md §5, skill `reel-motion`).
 * Three layers in every shot: the world moves (Shot / Layer / KenBurns), the subject acts (RollNumber, draw-ons in
 * the episode), the words land and hold (Enter). Seams between beats get a cause (seam()).
 * All frame-driven and deterministic: absolute frames, like useCues().
 */
import {createContext, useContext, type CSSProperties, type ReactNode} from 'react';
import {Img, interpolate, useCurrentFrame} from 'remotion';
import {ease} from '../theme/motion';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const ramp = (f: number, a: number, b: number, e = ease.inOut) => (b <= a ? (f >= a ? 1 : 0) : interpolate(f, [a, b], [0, 1], {...clamp, easing: e}));

// ---------------------------------------------------------------------------------------------------------------
// 1. The world moves: a continuous camera drift for one shot, with parallax layers inside it.

type ShotState = {p: number; pan: [number, number]; push: number};
const ShotCtx = createContext<ShotState>({p: 0, pan: [0, 0], push: 0});

/**
 * A shot from `from` to `to` (frames) whose content drifts the whole time: a push (scale +push over the shot), a pan
 * (px) and an optional small roll (deg). Eases at both ends; never loops. Typical: push 0.04–0.08 over 2–4 s.
 */
export const Shot = ({from, to, push = 0.05, pan = [0, 0], roll = 0, origin = '50% 55%', children, style}: {from: number; to: number; push?: number; pan?: [number, number]; roll?: number; origin?: string; children: ReactNode; style?: CSSProperties}) => {
  const f = useCurrentFrame();
  const p = ramp(f, from, to, ease.inOut);
  return (
    <ShotCtx.Provider value={{p, pan, push}}>
      <div style={{position: 'absolute', inset: 0, transformOrigin: origin, transform: `translate(${pan[0] * p}px, ${pan[1] * p}px) scale(${1 + push * p}) rotate(${roll * p}deg)`, ...style}}>{children}</div>
    </ShotCtx.Provider>
  );
};

/** Parallax inside a Shot: depth 1 moves with the shot, >1 moves more (closer), <1 less (further back). */
export const Layer = ({depth, children, style}: {depth: number; children: ReactNode; style?: CSSProperties}) => {
  const {p, pan, push} = useContext(ShotCtx);
  const k = depth - 1;
  return <div style={{position: 'absolute', inset: 0, transform: `translate(${pan[0] * p * k}px, ${pan[1] * p * k}px) scale(${1 + push * p * k})`, ...style}}>{children}</div>;
};

/** A real photo that never sits still: push, drift, and an optional light sweep across it once. */
export const KenBurns = ({src, from, to, push = 0.08, pan = [0, -20], focus = '50% 45%', sweepAt, style}: {src: string; from: number; to: number; push?: number; pan?: [number, number]; focus?: string; sweepAt?: number; style?: CSSProperties}) => {
  const f = useCurrentFrame();
  const p = ramp(f, from, to, ease.inOut);
  const s = sweepAt === undefined ? -1 : ramp(f, sweepAt, sweepAt + 18, ease.inOut);
  return (
    <div style={{position: 'absolute', inset: 0, overflow: 'hidden', ...style}}>
      <Img src={src} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: focus, transformOrigin: focus, transform: `translate(${pan[0] * p}px, ${pan[1] * p}px) scale(${1 + push * p})`}} />
      {s > 0 && s < 1 && <div style={{position: 'absolute', inset: 0, background: `linear-gradient(105deg, transparent ${s * 140 - 40}%, rgba(255,255,255,0.22) ${s * 140 - 20}%, transparent ${s * 140}%)`}} />}
    </div>
  );
};

// ---------------------------------------------------------------------------------------------------------------
// 2. The words land and hold: varied entrances, exits 40–50% shorter, no motion after landing.

export type EnterKind = 'blur' | 'words' | 'scale' | 'wipe' | 'rise' | 'cut';
export type ExitKind = 'blur' | 'cut' | 'up' | 'wipe';

const enterStyle = (kind: EnterKind, t: number): CSSProperties => {
  switch (kind) {
    case 'blur':
      return {opacity: t, filter: `blur(${(1 - t) * 10}px)`};
    case 'scale': {
      // Spring-like settle (damping ≈ 0.8): overshoot 3%, then rest.
      const s = t < 1 ? 0.9 + 0.13 * Math.sin((t * Math.PI) / 1.6) : 1;
      return {opacity: Math.min(1, t * 2), transform: `scale(${s})`};
    }
    case 'wipe':
      return {clipPath: `inset(0 ${(1 - t) * 100}% 0 0)`};
    case 'rise':
      return {opacity: t, transform: `translateY(${(1 - t) * 28}px)`};
    case 'cut':
    case 'words':
      return {};
  }
};
const exitStyle = (kind: ExitKind, t: number): CSSProperties => {
  switch (kind) {
    case 'blur':
      return {opacity: 1 - t, filter: `blur(${t * 8}px)`};
    case 'up':
      return {opacity: 1 - t, transform: `translateY(${-t * 24}px)`};
    case 'wipe':
      return {clipPath: `inset(0 0 0 ${t * 100}%)`};
    case 'cut':
      return t >= 1 ? {opacity: 0} : {};
  }
};

/**
 * Lands at `at` with `kind` over `dur` frames, holds still, leaves at `out` with `exit` (0.55 × dur frames).
 * 'words' blurs a string in word by word (2 frames apart). Returns null outside its life.
 */
export const Enter = ({at, out, kind = 'blur', exit = 'blur', dur = 12, children, style}: {at: number; out?: number; kind?: EnterKind; exit?: ExitKind; dur?: number; children: ReactNode; style?: CSSProperties}) => {
  const f = useCurrentFrame();
  const exitDur = Math.max(2, Math.round(dur * 0.55));
  if (f < at || (out !== undefined && f >= out + (exit === 'cut' ? 0 : exitDur))) return null;
  const tin = ramp(f, at, at + dur, ease.out);
  const tout = out === undefined ? 0 : exit === 'cut' ? (f >= out ? 1 : 0) : ramp(f, out, out + exitDur, ease.in);
  const base: CSSProperties = {...enterStyle(kind, tin), ...style};
  const ex = tout > 0 ? exitStyle(exit, tout) : {};
  const merged: CSSProperties = {...base, ...ex, opacity: (base.opacity ?? 1) as number * ((ex.opacity ?? 1) as number), filter: [base.filter, ex.filter].filter(Boolean).join(' ') || undefined, transform: [base.transform, ex.transform].filter(Boolean).join(' ') || undefined};
  if (kind === 'words' && typeof children === 'string') {
    const words = children.split(' ');
    return (
      <span style={{...merged, display: 'inline'}}>
        {words.map((w, i) => {
          const t = ramp(f, at + i * 2, at + i * 2 + 5, ease.out);
          return (
            <span key={i} style={{opacity: t, filter: `blur(${(1 - t) * 8}px)`}}>
              {w}
              {i < words.length - 1 ? ' ' : ''}
            </span>
          );
        })}
      </span>
    );
  }
  return <div style={merged}>{children}</div>;
};

/** A number that rolls like a slot machine into `value` (formatted), landing at `at + dur`. */
export const RollNumber = ({value, at, dur = 24, format = (n: number) => Math.round(n).toLocaleString('id-ID'), style}: {value: number; at: number; dur?: number; format?: (n: number) => string; style?: CSSProperties}) => {
  const f = useCurrentFrame();
  const t = ramp(f, at, at + dur, ease.out);
  const shown = format(value * t);
  return <span style={{fontVariantNumeric: 'tabular-nums', filter: t < 1 ? `blur(${(1 - t) * 3}px)` : undefined, ...style}}>{shown}</span>;
};

// ---------------------------------------------------------------------------------------------------------------
// 3. Seams with a cause. Wrap the outgoing beat in seam(kind, f, at, 'out') and the incoming one in 'in'.

export type SeamKind = 'whip' | 'zoom' | 'blurSwap' | 'dip' | 'flood' | 'push';
export type SeamOpts = {dur?: number; dir?: 1 | -1; origin?: [number, number]; distance?: number};

/**
 * Style for one side of a seam centred on frame `at` (the cut happens at `at`).
 * - whip: a 0.27 s horizontal smear; outgoing leaves at full speed, incoming lands blurred and sharpens.
 * - zoom: zoom THROUGH the object at `origin` (px): outgoing scales up ~4× with an ease-in and blur; incoming arrives
 *   slightly large (1.12) and settles. Use when the next idea lives inside the thing on screen.
 * - push: outgoing slides up and out, incoming pushes in from below (a vertical camera move between two beats).
 * - blurSwap: same stage, content swaps through an 8 px blur (for a beat that stays in the same world).
 * - dip: outgoing darkens 40% for 3 frames before a hard cut.
 * - flood: incoming opens as a circle from `origin` (iris), for a polarity flip that keeps the hero object.
 */
export const seam = (kind: SeamKind, f: number, at: number, side: 'out' | 'in', {dur = 8, dir = 1, origin = [540, 960], distance = 1080}: SeamOpts = {}): CSSProperties => {
  const half = Math.max(2, Math.round(dur / 2));
  if (side === 'out') {
    if (f >= at) return {opacity: 0};
    const t = ramp(f, at - half, at, ease.in);
    if (t <= 0) return {};
    switch (kind) {
      case 'whip':
        return {transform: `translateX(${-dir * distance * 0.6 * t}px)`, filter: `blur(${t * 18}px)`};
      case 'zoom':
        return {transformOrigin: `${origin[0]}px ${origin[1]}px`, transform: `scale(${1 + 3 * t * t})`, filter: `blur(${t * 10}px)`, opacity: 1 - Math.max(0, t - 0.6) * 2.5};
      case 'push':
        return {transform: `translateY(${-t * 420}px)`, filter: `blur(${t * 6}px)`, opacity: 1 - t * 0.6};
      case 'blurSwap':
        return {filter: `blur(${t * 8}px)`, opacity: 1 - t};
      case 'dip':
        return {filter: `brightness(${1 - 0.4 * ramp(f, at - 3, at)})`};
      case 'flood':
        return {};
    }
  }
  if (f < at) return {opacity: 0};
  const t = ramp(f, at, at + half + 2, ease.out);
  if (t >= 1) return {};
  switch (kind) {
    case 'whip':
      return {transform: `translateX(${dir * distance * 0.35 * (1 - t)}px)`, filter: `blur(${(1 - t) * 14}px)`};
    case 'zoom':
      return {transformOrigin: '50% 50%', transform: `scale(${1 + 0.12 * (1 - t)})`, filter: `blur(${(1 - t) * 8}px)`, opacity: Math.min(1, t * 2)};
    case 'push':
      return {transform: `translateY(${(1 - t) * 420}px)`, filter: `blur(${(1 - t) * 6}px)`};
    case 'blurSwap':
      return {filter: `blur(${(1 - t) * 8}px)`, opacity: t};
    case 'dip':
      return {};
    case 'flood': {
      const r = ramp(f, at, at + dur + 4, ease.inOut);
      return r >= 1 ? {} : {clipPath: `circle(${r * 150}% at ${origin[0]}px ${origin[1]}px)`};
    }
  }
};

/** Convenience wrapper: <SeamSide kind="whip" at={cut} side="in">…</SeamSide>. */
export const SeamSide = ({kind, at, side, opts, children, style}: {kind: SeamKind; at: number; side: 'out' | 'in'; opts?: SeamOpts; children: ReactNode; style?: CSSProperties}) => {
  const f = useCurrentFrame();
  return <div style={{position: 'absolute', inset: 0, ...seam(kind, f, at, side, opts), ...style}}>{children}</div>;
};
