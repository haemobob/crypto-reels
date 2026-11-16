import {Audio, staticFile} from 'remotion';
import {Sfx} from '../../components/Sfx';
import {useCues} from '../../lib/cues';

/** Score (synthesized, ducked under the voice) and effects on on-screen events (absolute frames). */
export const Sound = () => {
  const {cue} = useCues();
  const c = (k: string) => cue(k);
  return (
    <>
      <Audio src={staticFile('episodes/bear-trap-2026/score.mp3')} />
      <Sfx name="cinematic-boom-soft" at={0} volume={0.22} />
      <Sfx name="data-whoosh" at={c('hook') + 2} volume={0.12} />
      <Sfx name="bass-drop-descend" at={c('hook') + 50} volume={0.14} />
      <Sfx name="transition-swoosh" at={c('def') - 4} volume={0.14} />
      <Sfx name="ui-reveal" at={c('t23') + 6} volume={0.1} />
      <Sfx name="deep-whoosh" at={c('break23') + 6} volume={0.16} />
      <Sfx name="impact-bass-echo" at={c('vol23') + 4} volume={0.13} />
      <Sfx name="hud-electronic-interface-sfx-pack-1" at={c('fed')} volume={0.12} />
      <Sfx name="ni-sound-cute-interface-bubble-pop-synth-chord-positive-notification" at={c('rev23') + 14} volume={0.1} />
      <Sfx name="ni-sound-cute-interface-bubble-pop-synth-chord-positive-notification" at={c('high23') + 16} volume={0.1} />
      <Sfx name="whoosh-deep-short" at={c('t26') - 4} volume={0.14} />
      <Sfx name="deep-whoosh" at={c('break26') + 4} volume={0.16} />
      <Sfx name="impact-bass-echo" at={c('press') + 4} volume={0.13} />
      <Sfx name="ui-glitchy-counter" at={c('press') + 30} volume={0.1} frames={24} />
      <Sfx name="hud-electronic-interface-sfx-pack-6" at={c('etf') + 2} volume={0.1} />
      <Sfx name="clock-ticking-1" at={c('miss')} volume={0.08} frames={60} />
      <Sfx name="ui-reveal" at={c('pay') + 4} volume={0.12} />
      <Sfx name="whoosh-and-hit-2" at={c('fail') - 2} volume={0.14} />
    </>
  );
};
