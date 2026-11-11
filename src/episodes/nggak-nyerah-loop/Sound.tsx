import {Sfx} from '../../components/Sfx';
import {FLIGHT, LANES, RELEASE, makeFrame} from './schedule';

/** Pack effects on the winning shot and the losses (the music and foley play as the episode's Soundtrack, outro included). */
export const Sound = () => {
  const mk = makeFrame(LANES[2]) ?? 0;
  return (
    <>
      <Sfx name="ni-sound-cute-interface-bubble-pop-synth-chord-positive-notification" at={mk + 1} volume={0.22} />
      <Sfx name="whoosh-and-hit-2" at={mk + 4} volume={0.12} />
      <Sfx name="coins-money-drop" at={mk + 3} volume={0.2} />
      {/* A soft low blip with each LOSS tag. */}
      {LANES.flatMap((l) => l.shots.filter((s) => !s.make).map((s) => s.at + RELEASE + FLIGHT + 2)).map((at, k) => <Sfx key={k} name="hud-electronic-interface-sfx-pack-6" at={at} volume={0.06} />)}
    </>
  );
};
