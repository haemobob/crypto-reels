import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {brand} from '../theme/brand';
import {colors} from '../theme/colors';
import {ease} from '../theme/motion';
import {fonts} from '../theme/typography';
import {BrandLogo} from './BrandLogo';

/** ≤2 s signature after the payoff: logo plus the brand line. Not a follow/save request. */
export const BrandedOutro = () => {
  const frame = useCurrentFrame();
  const a = interpolate(frame, [0, 10], [0, 1], {extrapolateRight: 'clamp', easing: ease.out});
  const line = interpolate(frame, [8, 20], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease.out});
  return (
    <AbsoluteFill style={{backgroundColor: colors.bg, justifyContent: 'center', alignItems: 'center', gap: 46}}>
      <BrandLogo width={620} style={{opacity: a, transform: `scale(${0.96 + 0.04 * a})`}} />
      <div
        style={{
          fontFamily: fonts.heading,
          fontWeight: 600,
          fontSize: 38,
          letterSpacing: '0.06em',
          color: colors.muted,
          opacity: line,
        }}
      >
        {brand.outroLine}
      </div>
    </AbsoluteFill>
  );
};
