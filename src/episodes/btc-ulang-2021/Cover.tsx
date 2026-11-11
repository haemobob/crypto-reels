import {AbsoluteFill} from 'remotion';
import {BrandLogo} from '../../components/BrandLogo';
import {colors} from '../../theme/colors';
import {fonts} from '../../theme/typography';
import {NOW, OLD, type Pt} from './data';
import {path, type Map} from './Tracing';

/**
 * Reel cover (1080×1920), in the channel's grid style (user reference, 11 Nov 2026): navy ground with faint real
 * candles behind, small logo on top, a bold two-line question with the key year in blue, one large central
 * comparison. Everything that matters sits inside the centre 3:4 band (y 240–1680) the profile grid shows, and the
 * bottom of that band stays clear for Instagram's view count.
 */
const GREY = '#C9D3E3';

/** Weekly candles from the daily series (open = previous close), for the background texture. */
const weekly = (pts: Pt[]) => {
  const out: Array<{o: number; h: number; l: number; c: number}> = [];
  for (let i = 1; i < pts.length; i += 7) {
    const w = pts.slice(i, i + 7);
    out.push({o: pts[i - 1].c, h: Math.max(...w.map((p) => p.h)), l: Math.min(...w.map((p) => p.l)), c: w[w.length - 1].c});
  }
  return out;
};

const Backdrop = () => {
  const ks = weekly(NOW);
  const lo = Math.min(...ks.map((k) => k.l));
  const hi = Math.max(...ks.map((k) => k.h));
  const y = (r: number) => 1500 - ((Math.log(r) - Math.log(lo)) / (Math.log(hi) - Math.log(lo))) * 1100;
  const step = 1080 / ks.length;
  return (
    <svg width={1080} height={1920} style={{position: 'absolute', inset: 0, filter: 'blur(1.5px)', opacity: 0.32}}>
      {ks.map((k, i) => {
        const up = k.c >= k.o;
        const x = i * step + step / 2;
        const c = up ? colors.positive : colors.negative;
        return (
          <g key={i}>
            <line x1={x} x2={x} y1={y(k.h)} y2={y(k.l)} stroke={c} strokeWidth={2} />
            <rect x={x - step * 0.32} y={y(Math.max(k.o, k.c))} width={step * 0.64} height={Math.max(3, y(Math.min(k.o, k.c)) - y(Math.max(k.o, k.c)))} fill={c} />
          </g>
        );
      })}
    </svg>
  );
};

/** One cycle on its own card: from the first top of the double top to the pullback, real daily closes. */
const CycleCard = ({x, pts, d0, d1, r1, color, year, crash}: {x: number; pts: Pt[]; d0: number; d1: number; r1: number; color: string; year: string; crash: string}) => {
  const W = 400;
  const H = 420;
  const top = 840;
  const m: Map = {x0: x + 26, w: W - 52, d0, d1, y0: top + 34, h: H - 68, r0: 0.9, r1};
  return (
    <>
      <div style={{position: 'absolute', left: x, width: W, top: top - 92, textAlign: 'center', fontFamily: fonts.heading, fontWeight: 800, fontSize: 64, color, letterSpacing: '-0.01em'}}>{year}</div>
      <div style={{position: 'absolute', left: x, top, width: W, height: H, borderRadius: 28, background: '#0B1730', boxShadow: `0 0 0 3px ${color === GREY ? '#2A3A5A' : colors.blue}, 0 24px 60px rgba(0,0,0,0.55)`}} />
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
        <defs>
          <clipPath id={`card-${year}`}>
            <rect x={x + 10} y={top + 10} width={W - 20} height={H - 20} rx={20} />
          </clipPath>
        </defs>
        <g clipPath={`url(#card-${year})`}>
          <path d={path(pts.filter((p) => p.d >= d0), m, d1)} stroke={color} strokeWidth={6} fill="none" strokeLinejoin="round" strokeLinecap="round" />
        </g>
      </svg>
      <div style={{position: 'absolute', left: x, width: W, top: top + H + 22, textAlign: 'center', fontFamily: fonts.heading, fontWeight: 800, fontSize: 50, color: colors.negative, letterSpacing: '-0.01em'}}>{crash}</div>
    </>
  );
};

export const Cover = () => (
  <AbsoluteFill style={{background: `linear-gradient(180deg, ${colors.bg} 0%, #070F22 55%, #03070F 100%)`}}>
    <Backdrop />
    {/* Darken the middle so the cards and the question read over the candles. */}
    <AbsoluteFill style={{background: 'radial-gradient(70% 45% at 50% 52%, rgba(5,11,24,0.85), rgba(5,11,24,0.25) 75%)'}} />

    <div style={{position: 'absolute', top: 300, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
      <BrandLogo width={260} />
    </div>
    <div style={{position: 'absolute', top: 400, left: 50, right: 50, textAlign: 'center', fontFamily: fonts.heading, fontWeight: 800, fontSize: 104, letterSpacing: '-0.02em', lineHeight: 1.0, color: colors.text, textTransform: 'uppercase'}}>
      BITCOIN NGULANG
      <br />
      SIKLUS <span style={{color: colors.electric}}>2021?</span>
    </div>

    {/* 2021–23: double top (Apr/Nov 2021) to the Sep 2023 pullback. 2025–26: double top (Aug/Oct 2025) to now. */}
    <CycleCard x={70} pts={OLD} d0={-600} d1={300} r1={4.75} color={GREY} year="2021–23" crash="CRASH −78%" />
    <CycleCard x={610} pts={NOW} d0={-330} d1={135} r1={2.3} color={colors.electric} year="2025–26" crash="CRASH −54%" />
    <div style={{position: 'absolute', left: 470, width: 140, top: 990, textAlign: 'center', fontFamily: fonts.heading, fontWeight: 800, fontSize: 120, color: colors.text, lineHeight: 1}}>=</div>

    <div style={{position: 'absolute', top: 1520, left: 0, right: 0, textAlign: 'center', fontFamily: fonts.mono, fontWeight: 600, fontSize: 22, letterSpacing: '0.06em', color: '#7F93B3'}}>
      DATA BINANCE BTC/USDT · S/D 9 NOV 2026
    </div>
  </AbsoluteFill>
);
