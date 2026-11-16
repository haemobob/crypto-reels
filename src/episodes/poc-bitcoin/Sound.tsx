import {Audio, staticFile} from 'remotion';
import {Sfx} from '../../components/Sfx';
import {useCues} from '../../lib/cues';

/** Score (synthesized, ducked under the voice) and effects on on-screen events (absolute frames). */
export const Sound = () => {
  const {cue, word} = useCues();
  const c = (k: string) => cue(k);
  return (
    <>
      <Audio src={staticFile('episodes/poc-bitcoin/score.mp3')} />
      <Sfx name="cinematic-boom-soft" at={0} volume={0.22} />
      <Sfx name="data-whoosh" at={c('hook') + 2} volume={0.12} />
      <Sfx name="hud-electronic-interface-sfx-pack-4" at={word('delapan', 0)} volume={0.1} />
      <Sfx name="hud-electronic-interface-sfx-pack-4" at={word('enam', 0)} volume={0.1} />
      <Sfx name="ui-reveal" at={c('poc') + 6} volume={0.12} />
      <Sfx name="mountain-audio-computer-data-readout-and-counter-bundle-sound-3" at={c('poc') + 8} volume={0.08} frames={36} />
      <Sfx name="chalk-slide-medium" at={c('summer') + 40} volume={0.14} />
      <Sfx name="ui-reveal" at={c('bear') + 6} volume={0.12} />
      <Sfx name="chalk-slide-medium" at={c('bear') + 40} volume={0.14} />
      <Sfx name="whoosh-deep-short" at={c('rally')} volume={0.14} />
      <Sfx name="impact-bass-echo" at={c('stop') + 6} volume={0.13} />
      <Sfx name="bass-drop-descend" at={c('drop') + 2} volume={0.13} />
      <Sfx name="ni-sound-cute-interface-bubble-pop-synth-chord-positive-notification" at={word('tutup', 0)} volume={0.1} />
      <Sfx name="hud-electronic-interface-sfx-pack-1" at={c('why') + 2} volume={0.1} />
      <Sfx name="whoosh-and-hit-2" at={c('pay') - 2} volume={0.14} />
      <Sfx name="hud-electronic-interface-sfx-pack-6" at={c('fail') + 2} volume={0.1} />
    </>
  );
};
