import {AbsoluteFill, Img} from 'remotion';
import {BrandLogo} from '../../components/BrandLogo';
import {colors} from '../../theme/colors';
import {fonts} from '../../theme/typography';
import {asset} from './Docs';

/**
 * Reel cover (1080×1920), channel grid style: navy, logo on top, a two-line question with the key word in blue, one
 * central visual: the real block-3 coinbase on mempool.space (Satoshi-era coins, 50 BTC, never spent) under the
 * stolen-vs-untouched comparison.
 */
export const Cover = () => (
  <AbsoluteFill style={{background: `linear-gradient(180deg, ${colors.bg} 0%, #070F22 55%, #03070F 100%)`}}>
    <div style={{position: 'absolute', top: 290, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
      <BrandLogo width={240} />
    </div>
    <div style={{position: 'absolute', top: 390, left: 30, right: 30, textAlign: 'center', fontFamily: fonts.heading, fontWeight: 800, fontSize: 90, letterSpacing: '-0.02em', lineHeight: 1.02, color: colors.text}}>
      KENAPA DOMPET SATOSHI
      <br />
      <span style={{color: colors.electric}}>NGGAK PERNAH DIBOBOL?</span>
    </div>
    <div style={{position: 'absolute', left: 90, top: 680, width: 900}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', fontFamily: fonts.mono, fontWeight: 700, color: '#A8BDD8', fontSize: 24, letterSpacing: '0.03em'}}>
        <span>BINANCE, 29 OKT 2026</span>
        <span style={{color: colors.negative, fontSize: 40, fontFamily: fonts.heading, fontWeight: 800}}>$6,3 MILIAR DICURI</span>
      </div>
      <div style={{marginTop: 26, height: 560, borderRadius: 22, overflow: 'hidden', border: '4px solid rgba(255,255,255,0.9)', position: 'relative', background: '#0B0F19'}}>
        <Img src={asset('mempool-block3.jpg')} style={{position: 'absolute', width: 2200 * 0.62, left: -1060 * 0.62 + 40, top: -1600 * 0.62, maxWidth: 'none'}} />
      </div>
      <div style={{marginTop: 22, textAlign: 'center', fontFamily: fonts.heading, fontWeight: 800, fontSize: 46, color: '#FFFFFF'}}>
        ±1,1 JUTA BTC · <span style={{color: colors.positive}}>BELUM PERNAH DIPINDAH</span>
      </div>
      <div style={{marginTop: 10, textAlign: 'center', fontFamily: fonts.mono, fontWeight: 600, fontSize: 20, color: '#7F93B3', letterSpacing: '0.04em'}}>BLOK 3, 9 JAN 2009 · MEMPOOL.SPACE · PERKIRAAN: POLA PATOSHI</div>
    </div>
  </AbsoluteFill>
);
