import {AbsoluteFill, Img, staticFile} from 'remotion';
import {BrandLogo} from '../../components/BrandLogo';
import {colors} from '../../theme/colors';
import {fonts} from '../../theme/typography';

/**
 * Reel cover (1080×1920), channel grid style: navy, logo on top, a two-line question with the key words in blue, one
 * central visual: the real Kremlin.ru photo (CC BY 4.0) of Putin, Xi and Trump in Shenzhen, 19 Nov 2026.
 */
export const Cover = () => (
  <AbsoluteFill style={{background: `linear-gradient(180deg, ${colors.bg} 0%, #070F22 55%, #03070F 100%)`}}>
    <div style={{position: 'absolute', top: 290, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
      <BrandLogo width={240} />
    </div>
    <div style={{position: 'absolute', top: 390, left: 30, right: 30, textAlign: 'center', fontFamily: fonts.heading, fontWeight: 800, fontSize: 92, letterSpacing: '-0.02em', lineHeight: 1.02, color: colors.text}}>
      TRUMP, PUTIN, XI:
      <br />
      <span style={{color: colors.electric}}>DUNIA BARU?</span>
    </div>
    <div style={{position: 'absolute', left: 190, top: 620, width: 700, height: 860, borderRadius: 28, overflow: 'hidden', border: '4px solid rgba(255,255,255,0.9)', boxShadow: '0 30px 90px rgba(0,0,0,0.65)'}}>
      <Img src={staticFile('episodes/satu-meja/photos/k02.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 30%'}} />
    </div>
    <div style={{position: 'absolute', top: 1505, left: 0, right: 0, textAlign: 'center', fontFamily: fonts.mono, fontWeight: 600, fontSize: 22, letterSpacing: '0.05em', color: '#7F93B3'}}>
      SHENZHEN, 19 NOV 2026 · FOTO: KREMLIN.RU (CC BY 4.0)
    </div>
  </AbsoluteFill>
);
