import {loadFont} from '@remotion/fonts';
import {staticFile} from 'remotion';

export const fonts = {
  heading: 'Inter Tight',
  body: 'Inter',
  mono: 'JetBrains Mono',
} as const;

const files: Array<[family: string, file: string]> = [
  [fonts.heading, 'InterTight'],
  [fonts.body, 'Inter'],
  [fonts.mono, 'JetBrainsMono'],
];
const weights = ['400', '500', '600', '700', '800'] as const;

let loading: Promise<unknown> | null = null;

// Loads every local font face once; Remotion waits on each loadFont call before rendering.
export const loadBrandFonts = () => {
  loading ??= Promise.all(
    files.flatMap(([family, file]) =>
      weights.map((weight) =>
        loadFont({family, url: staticFile(`fonts/${file}-${weight}.woff2`), weight}),
      ),
    ),
  );
  return loading;
};
