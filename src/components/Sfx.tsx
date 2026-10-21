import {Audio, Sequence, staticFile} from 'remotion';

export type SfxName = 'hit' | 'tick' | 'whoosh' | 'ping';

/** One generated sound effect (public/sfx, from npm run audio) starting at an absolute frame. */
export const Sfx = ({name, at, volume = 0.5}: {name: SfxName; at: number; volume?: number}) => (
  <Sequence from={Math.max(0, Math.round(at))} durationInFrames={60} name={`sfx:${name}`}>
    <Audio src={staticFile(`sfx/${name}.wav`)} volume={volume} />
  </Sequence>
);
