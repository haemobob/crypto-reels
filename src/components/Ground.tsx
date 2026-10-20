import type {ReactNode} from 'react';
import {AbsoluteFill} from 'remotion';
import {grounds, type Polarity} from '../theme/colors';

/** Full-frame background in one of the editorial polarities (dark / navy / light). */
export const Ground = ({polarity = 'navy', children}: {polarity?: Polarity; children?: ReactNode}) => (
  <AbsoluteFill style={{backgroundColor: grounds[polarity].bg, color: grounds[polarity].text}}>{children}</AbsoluteFill>
);
