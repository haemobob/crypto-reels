import {AbsoluteFill, Img} from 'remotion';
import {BrandLogo} from '../../components/BrandLogo';
import {colors} from '../../theme/colors';
import {fonts} from '../../theme/typography';
import {asset} from './Docs';

/**
 * Reel cover (1080×1920), channel grid style: navy, logo on top, a two-line question with the key words in blue, one
 * central visual: the film's own 3D close-up of the Patoshi blocks (blocks 3, 4, 5 with their real keys).
 */
export const Cover = () => (
  <AbsoluteFill style={{background: `linear-gradient(180deg, ${colors.bg} 0%, #070F22 55%, #03070F 100%)`}}>
    <div style={{position: 'absolute', top: 290, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
      <BrandLogo width={240} />
    </div>
    <div style={{position: 'absolute', top: 390, left: 30, right: 30, textAlign: 'center', fontFamily: fonts.heading, fontWeight: 800, fontSize: 104, letterSpacing: '-0.02em', lineHeight: 1.0, color: colors.text}}>
      KENAPA SATOSHI
      <br />
      <span style={{color: colors.electric}}>NGGAK DIBOBOL?</span>
    </div>
    <div style={{position: 'absolute', top: 640, left: 0, right: 0, textAlign: 'center'}}>
      <span style={{display: 'inline-block', padding: '10px 22px', borderRadius: 12, border: `3px solid ${colors.negative}`, background: 'rgba(255,82,99,0.12)', fontFamily: fonts.heading, fontWeight: 800, fontSize: 40, color: '#FFFFFF'}}>
        BINANCE: <span style={{color: colors.negative}}>$6,3 MILIAR</span> DICURI
      </span>
    </div>
    <div style={{position: 'absolute', left: 90, top: 740, width: 900, height: 600, borderRadius: 24, overflow: 'hidden', border: '4px solid rgba(255,255,255,0.9)', boxShadow: '0 30px 90px rgba(0,0,0,0.65)', background: '#000'}}>
      <Img src={asset('cover-vaults.jpg')} style={{position: 'absolute', width: 1080, left: -120, top: -10, maxWidth: 'none'}} />
    </div>
    <div style={{position: 'absolute', top: 1380, left: 30, right: 30, textAlign: 'center', fontFamily: fonts.heading, fontWeight: 800, fontSize: 44, lineHeight: 1.08, color: '#FFFFFF', whiteSpace: 'nowrap'}}>
      ±1,1 JUTA BTC · <span style={{color: colors.positive}}>BELUM PERNAH DIPINDAH</span>
    </div>
    <div style={{position: 'absolute', top: 1460, left: 0, right: 0, textAlign: 'center', fontFamily: fonts.mono, fontWeight: 600, fontSize: 21, color: '#7F93B3', letterSpacing: '0.04em'}}>
      21.953 BLOK POLA PATOSHI (PERKIRAAN) · HACK BINANCE 29 OKT 2026
    </div>
  </AbsoluteFill>
);
