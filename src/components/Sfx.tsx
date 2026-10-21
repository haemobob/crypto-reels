import {Audio, Sequence, staticFile} from 'remotion';
import newest from '../../public/sfx/newest/manifest.json';

/** Generated originals (npm run audio). */
const generated = {
  hit: {file: 'sfx/hit.wav', seconds: 0.9},
  tick: {file: 'sfx/tick.wav', seconds: 0.15},
  whoosh: {file: 'sfx/whoosh.wav', seconds: 0.7},
  ping: {file: 'sfx/ping.wav', seconds: 1.4},
};

/** Every usable sound: generated ones plus imported packs (npm run import-sfx; sources and licence basis in each manifest). */
export const sfxLibrary: Record<string, {file: string; seconds: number}> = {...generated, ...newest};
export type SfxName = keyof typeof generated | keyof typeof newest;

/** One sound effect starting at an absolute frame. Imported sounds start on their transient (leading silence trimmed). */
export const Sfx = ({name, at, volume = 0.5}: {name: SfxName; at: number; volume?: number}) => {
  const s = sfxLibrary[name];
  return (
    <Sequence from={Math.max(0, Math.round(at))} durationInFrames={Math.ceil(s.seconds * 30) + 2} name={`sfx:${name}`}>
      <Audio src={staticFile(s.file)} volume={volume} />
    </Sequence>
  );
};
