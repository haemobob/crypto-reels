import {AbsoluteFill} from 'remotion';
import raw from '../../../public/episodes/bentuk-volume/week.json';
import {BrandLogo} from '../../components/BrandLogo';
import {colors} from '../../theme/colors';
import {fonts} from '../../theme/typography';

/**
 * Reel cover (1080×1920), channel grid style (CLAUDE.md, covers): navy, logo on top, the same question as the first
 * frame with the key words in blue, one central visual: the real 15 Nov 2026 bounce (Binance 5-minute closes) with its
 * P-shaped volume profile and the OKX open-interest change.
 */
type Day = {d: string; h: number; l: number; c: number; step: number; bins: number[]};
const data = raw as unknown as {bars: Array<[number, number, number]>; days: Day[]};
const GOLD = '#FFD166';

export const Cover = () => {
  const day = data.days[3];
  const bars = data.bars.slice(864, 1152);
  const x0 = 120;
  const w = 840;
  const y0 = 860;
  const h = 480;
  const lo = 61700;
  const hi = 66400;
  const X = (i: number) => x0 + (i / (bars.length - 1)) * w;
  const Y = (p: number) => y0 + h * (1 - (p - lo) / (hi - lo));
  const line = bars.map((r, i) => `${i ? 'L' : 'M'}${X(i).toFixed(1)},${Y(r[2]).toFixed(1)}`).join('');
  const vmax = Math.max(...day.bins);
  const pocJ = day.bins.indexOf(vmax);
  return (
    <AbsoluteFill style={{background: `linear-gradient(180deg, ${colors.bg} 0%, #070F22 55%, #03070F 100%)`}}>
      <div style={{position: 'absolute', top: 300, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
        <BrandLogo width={260} />
      </div>
      <div style={{position: 'absolute', top: 410, left: 30, right: 30, textAlign: 'center', fontFamily: fonts.heading, fontWeight: 800, fontSize: 112, letterSpacing: '-0.02em', lineHeight: 1.02, color: colors.text}}>
        MANTUL <span style={{color: colors.positive}}>5%</span>.
        <br />
        <span style={{color: colors.electric}}>PEMBELI BALIK?</span>
      </div>
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
        <rect x={x0 - 30} y={y0 - 60} width={w + 60} height={h + 110} rx={26} fill="#0B1730" stroke="#2A3A5A" strokeWidth={2} />
        {/* The day's volume profile on its right edge, POC bar gold. */}
        {day.bins.map((v, j) => {
          const y1 = Y(day.l + (j + 1) * day.step);
          const y2 = Y(day.l + j * day.step);
          const bw = (v / vmax) * w * 0.45;
          return <rect key={j} x={x0 + w - bw} y={y1 + 1} width={bw} height={Math.max(1, y2 - y1 - 2)} fill={j === pocJ ? GOLD : colors.light} opacity={j === pocJ ? 0.95 : 0.4} />;
        })}
        <path d={line} stroke={colors.electric} strokeWidth={5} fill="none" strokeLinejoin="round" />
        <circle cx={X(21)} cy={Y(62006)} r={16} fill="none" stroke={GOLD} strokeWidth={4} />
        <text x={x0 + w - 140} y={y0 - 4} textAnchor="middle" dominantBaseline="middle" fontFamily={fonts.heading} fontWeight={800} fontSize={120} fill={GOLD}>P</text>
        <rect x={x0 + 10} y={y0 + h + 6} width={300} height={44} rx={10} fill={colors.negative} />
        <text x={x0 + 160} y={y0 + h + 29} textAnchor="middle" dominantBaseline="middle" fontFamily={fonts.mono} fontWeight={700} fontSize={24} fill="#FFFFFF">OI OKX −3,2%</text>
      </svg>
      <div style={{position: 'absolute', top: 1490, left: 0, right: 0, textAlign: 'center', fontFamily: fonts.mono, fontWeight: 600, fontSize: 22, letterSpacing: '0.05em', color: '#7F93B3'}}>
        BENTUK VOLUME · BTC 15 NOV 2026 · BINANCE & OKX
      </div>
    </AbsoluteFill>
  );
};
