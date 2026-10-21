import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {safe} from '../theme/layout';
import {BrandLogo} from './BrandLogo';

/** Small logo bug, top-left inside the safe zone. Appears only after the hook has landed. */
export const CornerLogo = ({from, hide = []}: {from: number; hide?: Array<[number, number]>}) => {
  const frame = useCurrentFrame();
  if (hide.some(([a, b]) => frame >= a && frame < b)) return null;
  const opacity = interpolate(frame, [from, from + 15], [0, 0.85], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  if (opacity === 0) return null;
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <BrandLogo width={190} style={{position: 'absolute', top: safe.top - 70, left: safe.side, opacity}} />
    </AbsoluteFill>
  );
};
