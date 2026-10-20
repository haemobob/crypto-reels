import type {ReactNode} from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {grounds, type Polarity} from '../theme/colors';
import {ease} from '../theme/motion';
import {fonts} from '../theme/typography';

/** Thesis interruption: an almost empty frame with one terse statement, blur-to-sharp. */
export const ThesisCard = ({
  children,
  at = 0,
  polarity = 'dark',
  size = 92,
}: {
  children: ReactNode;
  at?: number;
  polarity?: Polarity;
  size?: number;
}) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame - at, [0, 14], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease.out});
  return (
    <AbsoluteFill style={{backgroundColor: grounds[polarity].bg, justifyContent: 'center', alignItems: 'center', padding: '0 110px'}}>
      <div
        style={{
          fontFamily: fonts.heading,
          fontWeight: 700,
          fontSize: size,
          lineHeight: 1.08,
          textAlign: 'center',
          color: grounds[polarity].text,
          opacity: t,
          filter: `blur(${(1 - t) * 18}px)`,
        }}
      >
        {children}
      </div>
    </AbsoluteFill>
  );
};
