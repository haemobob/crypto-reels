import {AbsoluteFill} from 'remotion';
import {BrandLogo} from '../../components/BrandLogo';
import {colors} from '../../theme/colors';
import {fonts} from '../../theme/typography';
import {NOW, type Pt} from '../btc-ulang-2021/data';

/**
 * Reel cover (1080×1920) in the channel's grid style (CLAUDE.md, covers): navy ground with faint real candles,
 * small logo on top, a bold two-line question with the key word in blue, one large central comparison.
 * The two numbers are the study's (sources.md S2): share in profit after 1 day vs after more than 300 days.
 */
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
    <svg width={1080} height={1920} style={{position: 'absolute', inset: 0, filter: 'blur(1.5px)', opacity: 0.3}}>
      {ks.map((k, i) => {
        const c = k.c >= k.o ? colors.positive : colors.negative;
        const x = i * step + step / 2;
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

const Card = ({x, label, value, color}: {x: number; label: string; value: string; color: string}) => (
  <>
    <div style={{position: 'absolute', left: x, width: 400, top: 770, textAlign: 'center', fontFamily: fonts.heading, fontWeight: 800, fontSize: 52, color: colors.text, letterSpacing: '-0.01em'}}>{label}</div>
    <div style={{position: 'absolute', left: x, top: 850, width: 400, height: 380, borderRadius: 28, background: '#0B1730', boxShadow: `0 0 0 3px ${color}, 0 24px 60px rgba(0,0,0,0.55)`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
      <div style={{fontFamily: fonts.heading, fontWeight: 800, fontSize: 112, color, letterSpacing: '-0.03em', lineHeight: 1}}>{value}</div>
      <div style={{fontFamily: fonts.mono, fontWeight: 700, fontSize: 30, color: '#9FB3D6', marginTop: 18, letterSpacing: '0.08em'}}>UNTUNG</div>
    </div>
  </>
);

export const Cover = () => (
  <AbsoluteFill style={{background: `linear-gradient(180deg, ${colors.bg} 0%, #070F22 55%, #03070F 100%)`}}>
    <Backdrop />
    <AbsoluteFill style={{background: 'radial-gradient(70% 45% at 50% 52%, rgba(5,11,24,0.85), rgba(5,11,24,0.25) 75%)'}} />
    <div style={{position: 'absolute', top: 300, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
      <BrandLogo width={260} />
    </div>
    <div style={{position: 'absolute', top: 400, left: 50, right: 50, textAlign: 'center', fontFamily: fonts.heading, fontWeight: 800, fontSize: 108, letterSpacing: '-0.02em', lineHeight: 1.0, color: colors.text}}>
      <span style={{color: colors.electric}}>1%</span> YANG NGGAK
      <br />
      NYERAH?
    </div>
    <Card x={70} label="SEHARI" value="29,8%" color={colors.positive} />
    <Card x={610} label=">300 HARI" value="3,0%" color={colors.negative} />
    <div style={{position: 'absolute', left: 470, width: 140, top: 975, textAlign: 'center', fontFamily: fonts.heading, fontWeight: 800, fontSize: 110, color: colors.text, lineHeight: 1}}>→</div>
    <div style={{position: 'absolute', top: 1290, left: 60, right: 60, textAlign: 'center', fontFamily: fonts.heading, fontWeight: 800, fontSize: 54, color: colors.text, letterSpacing: '-0.01em', lineHeight: 1.1}}>
      MAKIN LAMA DAY TRADING,
      <br />
      MAKIN <span style={{color: colors.negative}}>SEDIKIT</span> YANG UNTUNG
    </div>
    <div style={{position: 'absolute', top: 1500, left: 0, right: 0, textAlign: 'center', fontFamily: fonts.mono, fontWeight: 600, fontSize: 21, letterSpacing: '0.05em', color: '#7F93B3'}}>
      STUDI 19.646 DAY TRADER · BRASIL 2013–2015
    </div>
  </AbsoluteFill>
);
