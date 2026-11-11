import {Audio, staticFile} from 'remotion';
import {Sfx} from '../../components/Sfx';
import {useCues} from '../../lib/cues';
import {makeFrames, releaseFrames} from './Court';

/** Score (synthesized, ducked under the voice) and effects on on-screen events (absolute frames). */
export const Sound = () => {
  const {cue, word} = useCues();
  const c = (k: string) => cue(k);
  return (
    <>
      <Audio src={staticFile('episodes/trader-1-persen/score.mp3')} />
      <Sfx name="cinematic-boom-soft" at={0} volume={0.22} />
      {/* Throws in the opening (all three lanes), then lane 1's makes once it is labelled. */}
      {[0, 1, 2].flatMap((i) => releaseFrames(6 + i * 9, c('study') - 8)).map((f, k) => <Sfx key={`t${k}`} name="click-3" at={f} volume={0.05} />)}
      <Sfx name="paper-movement-2" at={c('study') + 2} volume={0.2} />
      <Sfx name="mountain-audio-computer-data-readout-and-counter-bundle-sound-3" at={word('dua', 0) - 2} volume={0.1} frames={28} />
      <Sfx name="whoosh-deep-short" at={c('one') - 4} volume={0.14} />
      {makeFrames(c('one') + 4, c('trend'), 0).map((f, k) => <Sfx key={`m${k}`} name="ni-sound-cute-interface-bubble-pop-synth-chord-positive-notification" at={f} volume={0.08} />)}
      <Sfx name="hud-electronic-interface-sfx-pack-1" at={c('mid') + 2} volume={0.1} />
      <Sfx name="bass-drop-descend" at={c('long') + 4} volume={0.14} />
      <Sfx name="data-whoosh" at={c('trend') + 2} volume={0.14} />
      <Sfx name="hud-electronic-interface-sfx-pack-4" at={c('learn') + 2} volume={0.12} />
      <Sfx name="whoosh-and-hit-2" at={c('payoff') - 4} volume={0.16} />
      <Sfx name="ui-reveal" at={word('positif') - 2} volume={0.12} />
    </>
  );
};
