import type {ReactNode} from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {colors} from '../../theme/colors';
import {ease} from '../../theme/motion';
import {fonts} from '../../theme/typography';
import {clamp, life, ramp} from './Docs';

const W = 1080;
const RED = colors.negative;

/** Simple line icons drawn in a 100×100 box. */
export const Icon = ({kind, color = '#FFFFFF'}: {kind: 'recruiter' | 'laptop' | 'file' | 'wallet' | 'out' | 'staff' | 'key' | 'lock'; color?: string}) => {
  const p = {stroke: color, strokeWidth: 6, fill: 'none', strokeLinecap: 'round', strokeLinejoin: 'round'} as const;
  switch (kind) {
    case 'recruiter':
      return (
        <g {...p}>
          <circle cx={50} cy={34} r={15} />
          <path d="M22 84c2-18 14-28 28-28s26 10 28 28" />
          <path d="M64 22l14-8M70 30h14" stroke={RED} />
        </g>
      );
    case 'staff':
      return (
        <g {...p}>
          <circle cx={50} cy={34} r={15} />
          <path d="M22 84c2-18 14-28 28-28s26 10 28 28" />
        </g>
      );
    case 'laptop':
      return (
        <g {...p}>
          <rect x={22} y={24} width={56} height={38} rx={4} />
          <path d="M12 74h76l-6 8H18z" />
        </g>
      );
    case 'file':
      return (
        <g {...p}>
          <path d="M30 14h28l16 16v56H30z" />
          <path d="M58 14v16h16" />
          <circle cx={52} cy={62} r={10} stroke={RED} />
          <path d="M44 54l-6-6M60 54l6-6M44 70l-6 6M60 70l6 6" stroke={RED} strokeWidth={5} />
        </g>
      );
    case 'wallet':
      return (
        <g {...p}>
          <rect x={16} y={34} width={64} height={46} rx={8} />
          <path d="M24 34l38-16 6 16" />
          <rect x={60} y={50} width={22} height={16} rx={4} />
          <path d="M84 18a14 14 0 0 1 0 20M92 12a24 24 0 0 1 0 32" stroke={colors.light} />
        </g>
      );
    case 'out':
      return (
        <g {...p}>
          <circle cx={36} cy={60} r={18} />
          <path d="M30 60h12M36 54v12" strokeWidth={5} />
          <path d="M58 40h28M74 28l12 12-12 12" stroke={RED} />
        </g>
      );
    case 'key':
      return (
        <g {...p}>
          <circle cx={32} cy={50} r={16} />
          <path d="M48 50h38M74 50v12M84 50v9" />
        </g>
      );
    case 'lock':
      return (
        <g {...p}>
          <rect x={22} y={44} width={56} height={42} rx={8} />
          <path d="M34 44V32a16 16 0 0 1 32 0v12" />
          <circle cx={50} cy={64} r={5} fill={color} />
        </g>
      );
  }
};

/** One step of the attack chain: an icon in a ring and a two-line label, plus an optional red cross. */
export const Node = ({x, y, o, kind, label, accent = colors.electric, crossed = 0, pulse = 0, sub}: {x: number; y: number; o: number; kind: Parameters<typeof Icon>[0]['kind']; label: ReactNode; accent?: string; crossed?: number; pulse?: number; sub?: string}) => {
  if (o <= 0.01) return null;
  const r = 62;
  return (
    <div style={{position: 'absolute', left: x - 110, top: y - r + (1 - o) * 20, width: 220, opacity: o, textAlign: 'center'}}>
      <svg width={220} height={2 * r + 8} viewBox={`-110 ${-r - 4} 220 ${2 * r + 8}`} style={{overflow: 'visible'}}>
        {pulse > 0.01 && <circle r={r + 10 + pulse * 26} fill="none" stroke={accent} strokeWidth={4} opacity={(1 - pulse) * 0.8} />}
        <circle r={r} fill="#0B1730" stroke={accent} strokeWidth={5} />
        <g transform="translate(-36 -36) scale(0.72)">
          <Icon kind={kind} />
        </g>
        {crossed > 0.01 && (
          <g stroke={RED} strokeWidth={10} strokeLinecap="round" opacity={crossed}>
            <line x1={-r * 0.8} y1={-r * 0.8} x2={-r * 0.8 + 1.6 * r * crossed} y2={-r * 0.8 + 1.6 * r * crossed} />
            <line x1={r * 0.8} y1={-r * 0.8} x2={r * 0.8 - 1.6 * r * Math.max(0, crossed * 2 - 1)} y2={-r * 0.8 + 1.6 * r * Math.max(0, crossed * 2 - 1)} />
          </g>
        )}
      </svg>
      <div style={{marginTop: 10, fontFamily: fonts.heading, fontWeight: 800, fontSize: 27, lineHeight: 1.1, color: '#FFFFFF', letterSpacing: '-0.005em'}}>{label}</div>
      {sub && <div style={{marginTop: 6, fontFamily: fonts.mono, fontWeight: 700, fontSize: 18, color: accent, letterSpacing: '0.04em'}}>{sub}</div>}
    </div>
  );
};

/** Dashed arrow between two nodes with a dot travelling along it (t 0..1). */
export const Link = ({x1, x2, y, o, t, color = colors.electric}: {x1: number; x2: number; y: number; o: number; t: number; color?: string}) => {
  if (o <= 0.01) return null;
  const xe = x1 + (x2 - x1) * Math.min(1, t * 1.4);
  return (
    <svg width={W} height={40} style={{position: 'absolute', left: 0, top: y - 20, opacity: o, overflow: 'visible'}}>
      <line x1={x1} y1={20} x2={xe} y2={20} stroke={color} strokeWidth={4} strokeDasharray="10 8" strokeLinecap="round" />
      {t > 0.02 && <path d={`M${xe - 12},${10} L${xe},${20} L${xe - 12},${30}`} stroke={color} strokeWidth={4} fill="none" strokeLinecap="round" />}
      {t > 0.02 && t < 1 && <circle cx={x1 + (x2 - x1) * ((t * 1.7) % 1)} cy={20} r={7} fill={color} />}
    </svg>
  );
};

/**
 * The 20 minutes on 29 Oct 2026 (UTC), from TRM Labs' timeline: a playhead sweeps 20:05 → 20:25 and each chain's
 * outflow drops in at its reported time.
 */
const EVENTS: Array<{m: number; label: string; sub: string; up: boolean}> = [
  {m: 5, label: 'XRP', sub: '233 JT XRP', up: true},
  {m: 10, label: 'SOL · OP', sub: '', up: false},
  {m: 20, label: 'BTC', sub: '18.270 BTC', up: true},
  {m: 22, label: 'TRON', sub: '612,7 JT USDT', up: false},
  {m: 23.4, label: 'ETH', sub: '167.464 ETH', up: true},
];
export const TwentyMinutes = ({from, to, sweep, y, labelColor = '#FFFFFF'}: {from: number; to: number; sweep: [number, number]; y: number; labelColor?: string}) => {
  const f = useCurrentFrame();
  const o = life(f, from, to);
  if (o <= 0.01) return null;
  const x0 = 130;
  const x1 = 950;
  const X = (m: number) => x0 + ((m - 5) / 20) * (x1 - x0);
  const head = interpolate(f, sweep, [5, 25], {...clamp, easing: ease.inOut});
  return (
    <svg width={W} height={260} style={{position: 'absolute', left: 0, top: y, opacity: o, overflow: 'visible'}}>
      <line x1={x0} y1={130} x2={x1} y2={130} stroke="#3A5785" strokeWidth={6} strokeLinecap="round" />
      <line x1={x0} y1={130} x2={X(head)} y2={130} stroke={RED} strokeWidth={6} strokeLinecap="round" />
      {[5, 10, 15, 20, 25].map((m) => (
        <g key={m}>
          <line x1={X(m)} y1={122} x2={X(m)} y2={138} stroke="#5D7BAA" strokeWidth={3} />
          <text x={X(m)} y={168} textAnchor="middle" fontFamily={fonts.mono} fontWeight={600} fontSize={20} fill="#A8BDD8">{`20:${String(m).padStart(2, '0')}`}</text>
        </g>
      ))}
      {EVENTS.map((e, i) => {
        const a = ramp(f, interpolate(e.m, [5, 25], sweep), interpolate(e.m, [5, 25], sweep) + 6, ease.out);
        if (a <= 0.01) return null;
        const yy = e.up ? 60 : 206;
        return (
          <g key={i} opacity={a}>
            <line x1={X(e.m)} y1={130} x2={X(e.m)} y2={e.up ? 84 : 186} stroke={RED} strokeWidth={3} />
            <circle cx={X(e.m)} cy={130} r={10} fill={RED} />
            <text x={X(e.m)} y={yy - (e.sub ? 14 : 0) + (e.up ? 0 : 6)} textAnchor="middle" fontFamily={fonts.heading} fontWeight={800} fontSize={26} fill={labelColor}>{e.label}</text>
            {e.sub && <text x={X(e.m)} y={yy + 14 + (e.up ? 0 : 6)} textAnchor="middle" fontFamily={fonts.mono} fontWeight={700} fontSize={19} fill={RED}>{e.sub}</text>}
          </g>
        );
      })}
      <text x={x0 - 10} y={20} fontFamily={fonts.mono} fontWeight={700} fontSize={20} fill="#A8BDD8" letterSpacing="0.04em">29 OKT 2026 · UTC · DANA KELUAR DARI DOMPET BINANCE</text>
    </svg>
  );
};
