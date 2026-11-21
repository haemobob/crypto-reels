/**
 * Pictogram-actor kit (reference/pictogram-storytelling-study.md): ISOTYPE-style people who act out the story,
 * label pills, a sentence-builder caption track, isotype count grids, and lines with money dots flowing along them.
 * SVG, frame-driven, deterministic. Coordinates are SVG user units in a 1080×1920 frame unless stated.
 */
import type {CSSProperties, ReactNode} from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {useEpisode} from '../lib/cues';
import {ease} from '../theme/motion';
import {fonts} from '../theme/typography';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const ramp = (f: number, a: number, b: number, e = ease.out) => (b <= a ? (f >= a ? 1 : 0) : interpolate(f, [a, b], [0, 1], {...clamp, easing: e}));

export const ACTOR = {white: '#F4F6FA', grey: '#5A6577', blue: '#2997FF', red: '#FF5263', dim: '#2A3240'};

export type Pose = 'stand' | 'cheer' | 'shrug' | 'slump' | 'hold' | 'point';

/**
 * A pictogram person, feet at (x, y), `h` tall. `pop` is the frame it appears (scale-settle inside a glow ring);
 * `glow` 0–1 lights the ring (this is the one we're talking about). `poseAt` switches pose at a frame.
 */
export const Actor = ({x, y, h = 200, color = ACTOR.white, pose = 'stand', pop, glow = 0, children}: {x: number; y: number; h?: number; color?: string; pose?: Pose; pop?: number; glow?: number; children?: ReactNode}) => {
  const f = useCurrentFrame();
  const a = pop === undefined ? 1 : ramp(f, pop, pop + 10);
  if (a <= 0.001) return null;
  const s = pop === undefined ? 1 : a < 1 ? 0.6 + 0.4 * a + Math.sin(a * Math.PI) * 0.08 : 1;
  const ringO = Math.max(glow, pop === undefined ? 0 : 1 - ramp(f, pop + 6, pop + 26, ease.inOut));
  const head = h * 0.13;
  const top = h * 0.31;
  const w = h * 0.27;
  const slump = pose === 'slump' ? 1 : 0;
  const arm = (dx: number, x2: number, y2: number) => <line x1={dx * w * 0.92} y1={top + h * 0.1} x2={x2} y2={y2} stroke={color} strokeWidth={h * 0.075} strokeLinecap="round" />;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={Math.min(1, a * 1.4)}>
      {ringO > 0.01 && <circle cx={0} cy={-h * 0.52} r={h * 0.62} fill="none" stroke={ACTOR.blue} strokeWidth={4} opacity={ringO * 0.9} />}
      <g transform={`translate(0 ${-h}) rotate(${slump * 8} 0 ${h})`}>
        <circle cx={slump * h * 0.05} cy={head + slump * h * 0.05} r={head} fill={color} />
        <path d={`M ${-w} ${h} L ${-w} ${top + w * 0.7} Q ${-w} ${top} ${-w * 0.3} ${top} L ${w * 0.3} ${top} Q ${w} ${top} ${w} ${top + w * 0.7} L ${w} ${h} Z`} fill={color} />
        {pose === 'cheer' && (
          <>
            {arm(-1, -w * 1.5, top - h * 0.18)}
            {arm(1, w * 1.5, top - h * 0.18)}
          </>
        )}
        {pose === 'shrug' && (
          <>
            {arm(-1, -w * 1.75, top + h * 0.02)}
            {arm(1, w * 1.75, top + h * 0.02)}
          </>
        )}
        {pose === 'point' && arm(1, w * 2.1, top - h * 0.02)}
        {pose === 'hold' && arm(1, w * 1.6, top + h * 0.22)}
      </g>
      {children}
    </g>
  );
};

/** A small rounded label (role, tag). */
export const Pill = ({x, y, text, color = '#FFFFFF', bg = '#0B0F16', border = '#5A6577', size = 20, at, anchor = 'middle'}: {x: number; y: number; text: string; color?: string; bg?: string; border?: string; size?: number; at?: number; anchor?: 'middle' | 'start' | 'end'}) => {
  const f = useCurrentFrame();
  const a = at === undefined ? 1 : ramp(f, at, at + 8);
  if (a <= 0.001) return null;
  const w = text.length * size * 0.66 + size * 1.4;
  const h = size * 1.7;
  const x0 = anchor === 'middle' ? x - w / 2 : anchor === 'start' ? x : x - w;
  const s = a < 1 ? 0.8 + 0.2 * a + Math.sin(a * Math.PI) * 0.06 : 1;
  return (
    <g transform={`translate(${x0 + w / 2} ${y}) scale(${s}) translate(${-(x0 + w / 2)} ${-y})`} opacity={a}>
      <rect x={x0} y={y - h / 2} width={w} height={h} rx={h / 2} fill={bg} stroke={border} strokeWidth={2} />
      <text x={x0 + w / 2} y={y + size * 0.36} textAnchor="middle" fontFamily={fonts.mono} fontWeight={700} fontSize={size} letterSpacing="0.06em" fill={color}>
        {text}
      </text>
    </g>
  );
};

/**
 * ISOTYPE count: `n` pictogram icons in rows of `cols`, the first `lit` light up one by one from frame `at`.
 */
export const IconGrid = ({x, y, n, lit, cols, size = 44, at, litAt, litColor = ACTOR.blue, offColor = ACTOR.dim}: {x: number; y: number; n: number; lit: number; cols: number; size?: number; at: number; /** Frame the lit icons start lighting (default: right after they all appear). */ litAt?: number; litColor?: string; offColor?: string}) => {
  const f = useCurrentFrame();
  return (
    <g>
      {Array.from({length: n}, (_, i) => {
        const r = Math.floor(i / cols);
        const c = i % cols;
        const appear = ramp(f, at + i * 1.5, at + i * 1.5 + 6);
        const l0 = litAt ?? at + n * 1.5 + 6;
        const on = i < lit ? ramp(f, l0 + i * 3, l0 + 6 + i * 3) : 0;
        if (appear <= 0.01) return null;
        const col = on > 0.5 ? litColor : offColor;
        const cx = x + c * size * 0.82 + size * 0.4;
        const cy = y + r * size * 1.25 + size;
        return (
          <g key={i} opacity={appear}>
            <circle cx={cx} cy={cy - size * 0.78} r={size * 0.13} fill={col} />
            <path d={`M ${cx - size * 0.24} ${cy} L ${cx - size * 0.24} ${cy - size * 0.45} Q ${cx - size * 0.24} ${cy - size * 0.6} ${cx - size * 0.1} ${cy - size * 0.6} L ${cx + size * 0.1} ${cy - size * 0.6} Q ${cx + size * 0.24} ${cy - size * 0.6} ${cx + size * 0.24} ${cy - size * 0.45} L ${cx + size * 0.24} ${cy} Z`} fill={col} />
          </g>
        );
      })}
    </g>
  );
};

/** A path that draws on from `at` over `dur` frames, with dots flowing along it once drawn (money, orders). */
export const FlowLine = ({d, len, at, dur = 18, color = '#5A6577', dots = 0, dotColor = ACTOR.blue, width = 3, dash}: {d: string; len: number; at: number; dur?: number; color?: string; dots?: number; dotColor?: string; width?: number; dash?: string}) => {
  const f = useCurrentFrame();
  const t = ramp(f, at, at + dur, ease.inOut);
  if (t <= 0.001) return null;
  return (
    <g>
      <path d={d} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeDasharray={dash ?? `${len} ${len}`} strokeDashoffset={dash ? undefined : len * (1 - t)} opacity={dash ? t : 1} />
      {t >= 1 &&
        Array.from({length: dots}, (_, i) => {
          const u = (((f - at - dur) / 40 + i / dots) % 1 + 1) % 1;
          return <circle key={i} r={6} fill={dotColor} style={{offsetPath: `path('${d}')`, offsetDistance: `${u * 100}%`} as CSSProperties} />;
        })}
    </g>
  );
};

/**
 * Sentence builder (study §type, reel A): the spoken sentence assembles word by word at the top third; *highlighted*
 * words turn brand blue and bold; the previous sentence blurs out when the next one starts. Driven by captions.json.
 */
export const SentenceTrack = ({y = 400, size = 50, width = 900, color = '#FFFFFF', accent = ACTOR.blue, preview = true}: {y?: number; size?: number; width?: number; color?: string; accent?: string; preview?: boolean}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {captions} = useCuesCaptions();
  const words = captions.words;
  if (!words.length) return null;
  // Sentences end on . ? ! : …
  const sentences: Array<{from: number; to: number}> = [];
  let s0 = 0;
  words.forEach((w, i) => {
    if (/[.?!:…]$/.test(w.text) || i === words.length - 1) {
      sentences.push({from: s0, to: i});
      s0 = i + 1;
    }
  });
  const t = f / fps;
  let k = sentences.findIndex((s, i) => t >= words[s.from].start - 0.05 && (i === sentences.length - 1 || t < words[sentences[i + 1].from].start - 0.05));
  if (k < 0) k = t < words[0].start ? (preview ? 0 : -1) : sentences.length - 1;
  if (k < 0) return null;
  const s = sentences[k];
  const nextStart = k + 1 < sentences.length ? words[sentences[k + 1].from].start - 0.05 : Infinity;
  const leaving = Number.isFinite(nextStart) ? interpolate(t, [nextStart - 0.18, nextStart], [0, 1], clamp) : 0;
  return (
    <div style={{position: 'absolute', left: (1080 - width) / 2, width, top: y, transform: 'translateY(-50%)', textAlign: 'center', fontFamily: fonts.heading, fontWeight: 600, fontSize: size, lineHeight: 1.18, color, letterSpacing: '-0.01em', opacity: 1 - leaving, filter: leaving > 0 ? `blur(${leaving * 8}px)` : undefined}}>
      {words.slice(s.from, s.to + 1).map((w, i) => {
        const a0 = interpolate(t, [w.start - 0.04, w.start + 0.1], [0, 1], clamp);
        const a = k === 0 && preview ? 0.28 + 0.72 * a0 : a0;
        return (
          <span key={i} style={{opacity: a, filter: a0 < 1 && !(k === 0 && preview) ? `blur(${(1 - a0) * 6}px)` : undefined, color: w.highlight ? accent : color, fontWeight: w.highlight ? 800 : 600}}>
            {w.text}
            {' '}
          </span>
        );
      })}
    </div>
  );
};

const useCuesCaptions = () => ({captions: useEpisode().captions});
