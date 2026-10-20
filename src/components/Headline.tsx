import type {CSSProperties, ReactNode} from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {enter} from '../theme/motion';
import {fonts} from '../theme/typography';

/** Large centred statement that rises in from below (the opening-title treatment). */
export const Headline = ({
  children,
  at = 0,
  size = 112,
  style,
}: {
  children: ReactNode;
  at?: number;
  size?: number;
  style?: CSSProperties;
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = enter(frame, fps, at);
  return (
    <div
      style={{
        fontFamily: fonts.heading,
        fontWeight: 800,
        fontSize: size,
        lineHeight: 1.02,
        letterSpacing: '-0.02em',
        textAlign: 'center',
        textTransform: 'uppercase',
        opacity: interpolate(p, [0, 0.6], [0, 1], {extrapolateRight: 'clamp'}),
        transform: `translateY(${interpolate(p, [0, 1], [70, 0])}px)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/** Wrap a word in <Hi> to colour it brand blue. */
export const Hi = ({children}: {children: ReactNode}) => <span style={{color: '#2997FF'}}>{children}</span>;
