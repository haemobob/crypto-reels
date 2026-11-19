import {Audio, staticFile} from 'remotion';
import {Sfx} from '../../components/Sfx';
import {useCues} from '../../lib/cues';

/** Score (synthesized, ducked under the voice) and effects on on-screen events (absolute frames). */
export const Sound = () => {
  const {cue, word} = useCues();
  const c = (k: string) => cue(k);
  return (
    <>
      <Audio src={staticFile('episodes/satu-meja/score.mp3')} />
      <Sfx name="cinematic-boom-soft" at={0} volume={0.24} />
      <Sfx name="ui-reveal" at={c('hook') + 28} volume={0.12} />
      <Sfx name="hud-electronic-interface-sfx-pack-4" at={word('nuklir', 0)} volume={0.1} />
      <Sfx name="whoosh-deep-short" at={c('where') - 2} volume={0.1} />
      <Sfx name="hud-electronic-interface-sfx-pack-1" at={word('trump', 0)} volume={0.08} />
      <Sfx name="hud-electronic-interface-sfx-pack-1" at={word('putin', 0)} volume={0.08} />
      <Sfx name="hud-electronic-interface-sfx-pack-1" at={word('xi', 0)} volume={0.08} />
      <Sfx name="chalk-slide-medium" at={c('decl') + 16} volume={0.12} />
      <Sfx name="whoosh-and-hit-2" at={c('turn') - 2} volume={0.13} />
      <Sfx name="whoosh-deep-short" at={c('japan') - 2} volume={0.1} />
      <Sfx name="ui-reveal" at={word('hampir', 0)} volume={0.1} />
      <Sfx name="whoosh-deep-short" at={c('russia') - 2} volume={0.1} />
      <Sfx name="data-whoosh" at={c('russia') + 24} volume={0.08} />
      <Sfx name="whoosh-deep-short" at={c('europe') - 2} volume={0.1} />
      <Sfx name="ui-reveal" at={c('macron') + 4} volume={0.1} />
      <Sfx name="whoosh-deep-short" at={c('jets') - 2} volume={0.1} />
      <Sfx name="impact-bass-echo" at={word('wilayah', 0)} volume={0.11} />
      <Sfx name="whoosh-deep-short" at={c('taiwan') - 2} volume={0.1} />
      <Sfx name="bass-drop-descend" at={word('seratus', 0)} volume={0.1} />
      <Sfx name="whoosh-and-hit-2" at={c('pay') - 2} volume={0.12} />
    </>
  );
};
