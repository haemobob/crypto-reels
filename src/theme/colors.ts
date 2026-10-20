export const colors = {
  bg: '#050B18',
  bg2: '#0B1730',
  black: '#000000',
  offWhite: '#EDEDED',
  blue: '#1677FF',
  electric: '#2997FF',
  light: '#75C7FF',
  text: '#FFFFFF',
  muted: '#A8BDD8',
  ink: '#101828',
  positive: '#19D69A',
  negative: '#FF5263',
} as const;

export type Polarity = 'dark' | 'light' | 'navy';

export const grounds: Record<Polarity, {bg: string; text: string; muted: string}> = {
  dark: {bg: colors.black, text: colors.text, muted: colors.muted},
  navy: {bg: colors.bg, text: colors.text, muted: colors.muted},
  light: {bg: colors.offWhite, text: colors.ink, muted: '#4A5568'},
};
