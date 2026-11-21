import {AbsoluteFill} from 'remotion';
import {ACTOR, Actor} from '../../components/actors';
import {BrandLogo} from '../../components/BrandLogo';
import {colors} from '../../theme/colors';
import {fonts} from '../../theme/typography';
import data from './candles.json';

/**
 * Reel cover (1080×1920), channel grid style: navy ground with faint real candles behind, logo on top, a two-line
 * question with the key words in blue, one central visual: the three real hammers (Binance H1) side by side, each
 * over its trader. Everything that matters sits inside y 240–1680; the bottom of that band stays clear.
 */
type K = [number, number, number, number, number, number];
const D = data as unknown as Record<'A' | 'B' | 'C', {h1: K; m5: K[]}>;

const Backdrop = () => {
  const ks = D.B.m5;
  const lo = Math.min(...ks.map((k) => k[3]));
  const hi = Math.max(...ks.map((k) => k[2]));
  const y = (v: number) => 1560 - ((v - lo) / (hi - lo)) * 1200;
  const step = 1080 / ks.length;
  return (
    <svg width={1080} height={1920} style={{position: 'absolute', inset: 0, filter: 'blur(1.5px)', opacity: 0.22}}>
      {ks.map((k, i) => {
        const up = k[4] >= k[1];
        const x = i * step + step / 2;
        const c = up ? colors.positive : colors.negative;
        return (
          <g key={i}>
            <line x1={x} x2={x} y1={y(k[2])} y2={y(k[3])} stroke={c} strokeWidth={2} />
            <rect x={x - step * 0.32} y={y(Math.max(k[1], k[4]))} width={step * 0.64} height={Math.max(3, y(Math.min(k[1], k[4])) - y(Math.max(k[1], k[4])))} fill={c} />
          </g>
        );
      })}
    </svg>
  );
};

const Hammer = ({k, cx}: {k: 'A' | 'B' | 'C'; cx: number}) => {
  const [, o, hi, lo, c] = D[k].h1;
  const Y = (v: number) => 760 + ((hi - v) / (hi - lo)) * 400;
  const top = Y(Math.max(o, c));
  return (
    <g>
      <line x1={cx} x2={cx} y1={Y(hi)} y2={Y(lo)} stroke="#F4F6FA" strokeWidth={12} strokeLinecap="round" />
      <rect x={cx - 52} y={top} width={104} height={Math.max(10, Y(Math.min(o, c)) - top)} rx={6} fill="#F4F6FA" />
      <text x={cx} y={735} textAnchor="middle" fontFamily={fonts.mono} fontWeight={800} fontSize={40} fill={k === 'B' ? colors.electric : '#9FB0C8'}>{k}</text>
    </g>
  );
};

export const Cover = () => (
  <AbsoluteFill style={{background: `linear-gradient(180deg, ${colors.bg} 0%, #070F22 55%, #03070F 100%)`}}>
    <Backdrop />
    <AbsoluteFill style={{background: 'radial-gradient(70% 45% at 50% 55%, rgba(5,11,24,0.88), rgba(5,11,24,0.3) 75%)'}} />
    <div style={{position: 'absolute', top: 290, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
      <BrandLogo width={240} />
    </div>
    <div style={{position: 'absolute', top: 390, left: 30, right: 30, textAlign: 'center', fontFamily: fonts.heading, fontWeight: 800, fontSize: 108, letterSpacing: '-0.02em', lineHeight: 1.0, color: colors.text}}>
      HAMMER SAMA,
      <br />
      <span style={{color: colors.electric}}>ISINYA BEDA?</span>
    </div>
    <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
      <Hammer k="A" cx={250} />
      <Hammer k="B" cx={540} />
      <Hammer k="C" cx={830} />
      <line x1={110} x2={970} y1={1381} y2={1381} stroke="#2A3A5A" strokeWidth={3} />
      <Actor x={250} y={1380} h={170} color={ACTOR.white} pose="hold" />
      <Actor x={540} y={1380} h={170} color={ACTOR.blue} pose="hold" />
      <Actor x={830} y={1380} h={170} color={ACTOR.white} pose="hold" />
    </svg>
    <div style={{position: 'absolute', top: 1420, left: 0, right: 0, textAlign: 'center', fontFamily: fonts.heading, fontWeight: 800, fontSize: 46, color: '#FFFFFF'}}>
      DIBONGKAR DI CHART <span style={{color: colors.electric}}>5 MENIT</span>
    </div>
    <div style={{position: 'absolute', top: 1500, left: 0, right: 0, textAlign: 'center', fontFamily: fonts.mono, fontWeight: 600, fontSize: 22, letterSpacing: '0.06em', color: '#7F93B3'}}>
      DATA BINANCE BTC/USDT · H1 · JUL–OKT 2026
    </div>
  </AbsoluteFill>
);
