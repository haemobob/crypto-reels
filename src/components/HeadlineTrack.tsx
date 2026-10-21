import type {ReactNode} from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {ease} from '../theme/motion';
import {fonts} from '../theme/typography';

export type HeadlineCue = {from: number; content: ReactNode; size?: number};

const ENTER = 10;
const EXIT = 6;

/**
 * Main-idea headlines in their own zone: each rises in at `from` and clears EXIT frames
 * before the next one arrives, so two headlines never overlap. `until` ends the last one.
 */
export const HeadlineTrack = ({cues, centerY, until, color = '#FFFFFF'}: {cues: HeadlineCue[]; centerY: number; until: number; color?: string}) => {
  const frame = useCurrentFrame();
  const i = cues.findLastIndex((c) => frame >= c.from);
  if (i < 0) return null;
  const cue = cues[i];
  const end = (cues[i + 1]?.from ?? until) - 1;
  if (frame > end) return null;
  const inT = interpolate(frame, [cue.from, cue.from + ENTER], [0, 1], {extrapolateRight: 'clamp', easing: ease.out});
  const outT = interpolate(frame, [end - EXIT, end], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <div
      style={{
        position: 'absolute',
        left: 90,
        right: 90,
        top: centerY,
        transform: `translateY(calc(-50% + ${(1 - inT) * 40}px))`,
        opacity: Math.min(inT, outT),
        textAlign: 'center',
        fontFamily: fonts.heading,
        fontWeight: 800,
        fontSize: cue.size ?? 76,
        lineHeight: 1.04,
        letterSpacing: '-0.015em',
        textTransform: 'uppercase',
        color,
      }}
    >
      {cue.content}
    </div>
  );
};
