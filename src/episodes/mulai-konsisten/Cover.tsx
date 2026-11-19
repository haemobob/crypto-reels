import {AbsoluteFill} from 'remotion';
import {BrandLogo} from '../../components/BrandLogo';
import {colors} from '../../theme/colors';
import {fonts} from '../../theme/typography';
import {Wall} from './Wall';

/**
 * Reel cover (1080×1920), channel grid style: navy, logo on top, a two-line question with the key word in blue, one
 * central visual: the scene itself at the moment the builder stands on the finished wall and the waiter is still
 * levelling his first brick.
 */
export const Cover = () => (
  <AbsoluteFill style={{backgroundColor: colors.bg}}>
    {/* Frame 326: the builder stands on the finished wall; the waiter still has his level on the first brick. */}
    <div style={{position: 'absolute', inset: 0, transform: 'translateY(190px)'}}>
      <Wall at={326} labels={false} />
    </div>
    <div style={{position: 'absolute', top: 290, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
      <BrandLogo width={240} />
    </div>
    <div style={{position: 'absolute', top: 390, left: 30, right: 30, textAlign: 'center', fontFamily: fonts.heading, fontWeight: 800, fontSize: 96, letterSpacing: '-0.02em', lineHeight: 1.02, color: colors.text}}>
      NUNGGU SEMPURNA,
      <br />
      ATAU <span style={{color: colors.electric}}>MULAI?</span>
    </div>
  </AbsoluteFill>
);
