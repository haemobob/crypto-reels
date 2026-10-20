import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import type {CaptionWord} from '../lib/types';
import {colors} from '../theme/colors';
import {captionY} from '../theme/layout';
import {fonts} from '../theme/typography';

// A word stays up through short gaps so the track doesn't flicker; longer pauses clear it.
const HOLD_GAP_SEC = 0.35;

/** One currently spoken word at a time, near the top of the frame. `mute` takes [from, to] frame ranges. */
export const MicroCaptions = ({
  words,
  mute = [],
  color = colors.text,
}: {
  words: CaptionWord[];
  mute?: Array<[number, number]>;
  color?: string;
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  if (mute.some(([a, b]) => frame >= a && frame < b)) return null;
  const t = frame / fps;
  const i = words.findIndex((w, idx) => {
    const next = words[idx + 1];
    const until = next ? Math.min(next.start, w.end + HOLD_GAP_SEC) : w.end + HOLD_GAP_SEC;
    return t >= w.start && t < until;
  });
  if (i < 0) return null;
  const w = words[i];
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <div
        style={{
          position: 'absolute',
          top: captionY,
          left: 0,
          right: 0,
          transform: 'translateY(-50%)',
          textAlign: 'center',
          fontFamily: fonts.body,
          fontWeight: 600,
          fontSize: 46,
          letterSpacing: '0.01em',
          // White in difference mode reads on every ground (white on dark, near-black on off-white);
          // highlighted words use the brand blue, which reads on both.
          color: w.highlight ? colors.blue : color,
          mixBlendMode: w.highlight ? 'normal' : 'difference',
        }}
      >
        {w.text.replace(/[.,!?;:]+$/u, '')}
      </div>
    </AbsoluteFill>
  );
};
