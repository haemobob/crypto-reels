import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {safe} from '../theme/layout';
import {BrandLogo} from './BrandLogo';

/**
 * Small logo bug, top-left inside the safe zone. With from = 0 it is fully visible on frame 0; later starts fade in.
 * `plate` sets it on a small navy plate (unaltered logo) for bright or blue grounds where the gem would vanish.
 */
export const CornerLogo = ({from, hide = [], plate = false}: {from: number; hide?: Array<[number, number]>; plate?: boolean}) => {
  const frame = useCurrentFrame();
  if (hide.some(([a, b]) => frame >= a && frame < b)) return null;
  const opacity = from <= 0 ? 0.85 : interpolate(frame, [from, from + 15], [0, 0.85], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  if (opacity === 0) return null;
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      {plate ? (
        <div style={{position: 'absolute', top: safe.top - 84, left: safe.side - 14, padding: '12px 16px', borderRadius: 12, background: 'rgba(5,11,24,0.92)', lineHeight: 0}}>
          <BrandLogo width={190} style={{opacity: 1}} />
        </div>
      ) : (
        <BrandLogo width={190} style={{position: 'absolute', top: safe.top - 70, left: safe.side, opacity}} />
      )}
    </AbsoluteFill>
  );
};
