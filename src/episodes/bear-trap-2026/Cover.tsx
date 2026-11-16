import {AbsoluteFill} from 'remotion';
import raw from '../../../public/episodes/bear-trap-2026/btc-1d.json';
import {BrandLogo} from '../../components/BrandLogo';
import {colors} from '../../theme/colors';
import {fonts} from '../../theme/typography';

/**
 * Reel cover (1080×1920) in the channel's grid style (CLAUDE.md, covers): navy, faint real candles, small logo on top,
 * the question with the key word in blue, one comparison: 2023 (the trap and its reversal) vs 2026 (the break, reversal "?").
 */
type Row = [string, number, number, number, number, number];
const data = raw as unknown as {y2023: Row[]; y2026: Row[]};

const MiniChart = ({rows, x, w, y, h, until}: {rows: Row[]; x: number; w: number; y: number; h: number; until?: string}) => {
  const rs = until ? rows.filter((r) => r[0] <= until) : rows;
  const lo = Math.min(...rows.map((r) => r[3]));
  const hi = Math.max(...rows.map((r) => r[2]));
  const n = rows.length;
  const sx = (i: number) => x + ((i + 0.5) / n) * w;
  const sy = (p: number) => y + h * (1 - (Math.log(p) - Math.log(lo)) / (Math.log(hi) - Math.log(lo)));
  const body = Math.max(2, (w / n) * 0.6);
  return (
    <g>
      {rs.map((r, i) => {
        const up = r[4] >= r[1];
        const col = up ? colors.electric : colors.negative;
        return (
          <g key={i}>
            <line x1={sx(i)} x2={sx(i)} y1={sy(r[2])} y2={sy(r[3])} stroke={col} strokeWidth={1.4} />
            <rect x={sx(i) - body / 2} y={sy(Math.max(r[1], r[4]))} width={body} height={Math.max(1.5, sy(Math.min(r[1], r[4])) - sy(Math.max(r[1], r[4])))} fill={col} />
          </g>
        );
      })}
    </g>
  );
};

const Card = ({x, year, rows, until, verdict, color}: {x: number; year: string; rows: Row[]; until?: string; verdict: string; color: string}) => (
  <>
    <div style={{position: 'absolute', left: x, width: 420, top: 760, textAlign: 'center', fontFamily: fonts.heading, fontWeight: 800, fontSize: 60, color: colors.text}}>{year}</div>
    <div style={{position: 'absolute', left: x, top: 840, width: 420, height: 400, borderRadius: 28, background: '#0B1730', boxShadow: `0 0 0 3px ${color}, 0 24px 60px rgba(0,0,0,0.55)`}} />
    <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
      <MiniChart rows={rows} x={x + 24} w={372} y={870} h={340} until={until} />
    </svg>
    <div style={{position: 'absolute', left: x, width: 420, top: 1262, textAlign: 'center', fontFamily: fonts.heading, fontWeight: 800, fontSize: 46, color}}>{verdict}</div>
  </>
);

export const Cover = () => (
  <AbsoluteFill style={{background: `linear-gradient(180deg, ${colors.bg} 0%, #070F22 55%, #03070F 100%)`}}>
    <div style={{position: 'absolute', top: 300, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
      <BrandLogo width={260} />
    </div>
    <div style={{position: 'absolute', top: 400, left: 40, right: 40, textAlign: 'center', fontFamily: fonts.heading, fontWeight: 800, fontSize: 116, letterSpacing: '-0.02em', lineHeight: 1.0, color: colors.text}}>
      <span style={{color: colors.electric}}>BEAR TRAP</span>
      <br />
      KAYAK 2023?
    </div>
    <Card x={50} year="2023" rows={data.y2023.filter((r) => r[0] <= '2023-04-05')} verdict="✓ BALIK NAIK" color={colors.positive} />
    <Card x={610} year="2026" rows={data.y2026.filter((r) => r[0] >= '2026-08-10')} verdict="? BELUM" color="#FFD166" />
    <div style={{position: 'absolute', top: 1400, left: 0, right: 0, textAlign: 'center', fontFamily: fonts.mono, fontWeight: 600, fontSize: 22, letterSpacing: '0.05em', color: '#7F93B3'}}>
      DATA BINANCE BTC/USDT · S/D 15 NOV 2026
    </div>
  </AbsoluteFill>
);
