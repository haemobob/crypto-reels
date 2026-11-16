import {AbsoluteFill} from 'remotion';
import raw from '../../../public/episodes/poc-bitcoin/btc.json';
import {BrandLogo} from '../../components/BrandLogo';
import {colors} from '../../theme/colors';
import {fonts} from '../../theme/typography';

/**
 * Reel cover (1080×1920), channel grid style (CLAUDE.md, covers): navy, logo on top, the question with the key word
 * in colour, one central visual: the real BTC line (May–Nov 2026) with the two points of control as gold lines.
 */
type Day = [string, number, number, number];
const data = raw as unknown as {daily: Day[]};
const GOLD = '#FFD166';

export const Cover = () => {
  const d = data.daily.filter((r) => r[0] >= '2026-05-01');
  const x0 = 110;
  const w = 860;
  const y0 = 820;
  const h = 560;
  const lo = 56000;
  const hi = 92000;
  const X = (i: number) => x0 + (i / (d.length - 1)) * w;
  const Y = (p: number) => y0 + h * (1 - (Math.log(p) - Math.log(lo)) / (Math.log(hi) - Math.log(lo)));
  const path = d.map((r, i) => `${i ? 'L' : 'M'}${X(i).toFixed(1)},${Y(r[3]).toFixed(1)}`).join('');
  return (
    <AbsoluteFill style={{background: `linear-gradient(180deg, ${colors.bg} 0%, #070F22 55%, #03070F 100%)`}}>
      <div style={{position: 'absolute', top: 300, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
        <BrandLogo width={260} />
      </div>
      <div style={{position: 'absolute', top: 405, left: 30, right: 30, textAlign: 'center', fontFamily: fonts.heading, fontWeight: 800, fontSize: 96, letterSpacing: '-0.02em', lineHeight: 1.02, color: colors.text}}>
        KENAPA BITCOIN
        <br />
        <span style={{color: colors.electric}}>BERHENTI</span> DI SINI?
      </div>
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
        <rect x={x0 - 20} y={y0 - 30} width={w + 40} height={h + 60} rx={26} fill="#0B1730" stroke="#2A3A5A" strokeWidth={2} />
        {[87875, 64125].map((p) => (
          <g key={p}>
            <line x1={x0} x2={x0 + w} y1={Y(p)} y2={Y(p)} stroke={GOLD} strokeWidth={5} strokeDasharray="14 9" />
            <rect x={x0 + w - 300} y={Y(p) + (p > 70000 ? -66 : 18)} width={300} height={50} rx={10} fill={GOLD} />
            <text x={x0 + w - 150} y={Y(p) + (p > 70000 ? -40 : 44)} textAnchor="middle" dominantBaseline="middle" fontFamily={fonts.heading} fontWeight={800} fontSize={32} fill={colors.bg}>{p > 70000 ? 'POC ≈ $87.900' : 'POC ≈ $64.100'}</text>
          </g>
        ))}
        <path d={path} stroke={colors.electric} strokeWidth={5} fill="none" strokeLinejoin="round" />
      </svg>
      <div style={{position: 'absolute', top: 1450, left: 0, right: 0, textAlign: 'center', fontFamily: fonts.mono, fontWeight: 600, fontSize: 22, letterSpacing: '0.05em', color: '#7F93B3'}}>
        POINT OF CONTROL · DATA BINANCE S/D 15 NOV 2026
      </div>
    </AbsoluteFill>
  );
};
