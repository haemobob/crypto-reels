import {Audio, staticFile} from 'remotion';
import {Sfx} from '../../components/Sfx';
import {useCues} from '../../lib/cues';

/** Score (synthesized, ducked under the voice) and effects on on-screen events (absolute frames). */
export const Sound = () => {
  const {cue, word} = useCues();
  const c = (k: string) => cue(k);
  return (
    <>
      <Audio src={staticFile('episodes/bentuk-volume/score.mp3')} />
      <Sfx name="cinematic-boom-soft" at={0} volume={0.22} />
      <Sfx name="data-whoosh" at={c('hook') + 2} volume={0.1} />
      <Sfx name="hud-electronic-interface-sfx-pack-4" at={word('enam', 0)} volume={0.1} />
      <Sfx name="ui-reveal" at={c('but') + 4} volume={0.12} />
      <Sfx name="mountain-audio-computer-data-readout-and-counter-bundle-sound-3" at={c('oi') + 6} volume={0.08} frames={40} />
      <Sfx name="chalk-slide-medium" at={word('gemuk', 0)} volume={0.12} />
      <Sfx name="chalk-slide-medium" at={word('tipis', 1)} volume={0.12} />
      <Sfx name="whoosh-deep-short" at={c('bshape') - 2} volume={0.1} />
      <Sfx name="ui-reveal" at={c('bshape') + 16} volume={0.1} />
      <Sfx name="bass-drop-descend" at={word('turun', 2) + 8} volume={0.1} />
      <Sfx name="whoosh-deep-short" at={c('thin') - 2} volume={0.1} />
      <Sfx name="ui-reveal" at={c('thin') + 16} volume={0.1} />
      <Sfx name="impact-bass-echo" at={word('jebol', 0) + 8} volume={0.12} />
      <Sfx name="whoosh-deep-short" at={c('guard') - 2} volume={0.09} />
      <Sfx name="whoosh-deep-short" at={c('dshape') - 2} volume={0.09} />
      <Sfx name="ui-reveal" at={c('dshape') + 22} volume={0.1} />
      <Sfx name="hud-electronic-interface-sfx-pack-1" at={word('enam', 4)} volume={0.1} />
      <Sfx name="ni-sound-cute-interface-bubble-pop-synth-chord-positive-notification" at={c('held') + 6} volume={0.1} />
      <Sfx name="bass-drop-descend" at={c('pay') + 6} volume={0.12} />
      <Sfx name="whoosh-and-hit-2" at={word('tapi', 1) - 2} volume={0.13} />
    </>
  );
};
