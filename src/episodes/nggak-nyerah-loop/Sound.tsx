import {Audio, staticFile} from 'remotion';
import {Sfx} from '../../components/Sfx';
import {FLIGHT, LANES, RELEASE, makeFrame} from './schedule';

/** The score with the court's foley (scripts/score-nggak-nyerah-loop.ts) and the pack's chime on the winning shot. */
export const Sound = () => {
  const mk = makeFrame(LANES[2]) ?? 0;
  return (
    <>
      <Audio src={staticFile('episodes/nggak-nyerah-loop/score.mp3')} />
      <Sfx name="ni-sound-cute-interface-bubble-pop-synth-chord-positive-notification" at={mk + 1} volume={0.22} />
      <Sfx name="whoosh-and-hit-2" at={mk + 4} volume={0.12} />
      <Sfx name="coins-money-drop" at={mk + 3} volume={0.2} />
      {/* A soft low blip with each LOSS tag. */}
      {LANES.flatMap((l) => l.shots.filter((s) => !s.make).map((s) => s.at + RELEASE + FLIGHT + 2)).map((at, k) => <Sfx key={k} name="hud-electronic-interface-sfx-pack-6" at={at} volume={0.06} />)}
    </>
  );
};
