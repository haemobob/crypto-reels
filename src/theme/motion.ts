import {Easing, spring, type SpringConfig} from 'remotion';

export const springs: Record<'gentle' | 'snappy' | 'settle', Partial<SpringConfig>> = {
  gentle: {damping: 200, mass: 1, stiffness: 80},
  snappy: {damping: 18, mass: 0.7, stiffness: 160},
  settle: {damping: 26, mass: 1, stiffness: 110},
};

export const ease = {
  out: Easing.bezier(0.16, 1, 0.3, 1),
  inOut: Easing.bezier(0.65, 0, 0.35, 1),
  in: Easing.bezier(0.7, 0, 0.84, 0),
};

export const enter = (frame: number, fps: number, delay = 0, config = springs.settle) =>
  spring({frame: frame - delay, fps, config});
