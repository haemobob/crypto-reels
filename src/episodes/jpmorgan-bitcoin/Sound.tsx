import {Audio, staticFile} from 'remotion';
import {Sfx} from '../../components/Sfx';
import {useCues} from '../../lib/cues';

/** Score (synthesized, ducked under the voice) and effects placed on on-screen events (absolute frames). */
export const Sound = () => {
  const {cue} = useCues();
  const c = (k: string) => cue(k);
  return (
    <>
      <Audio src={staticFile('episodes/jpmorgan-bitcoin/score.mp3')} />

      {/* Cold open: the stamp, then it tears off for the report */}
      <Sfx name="cinematic-boom-soft" at={0} volume={0.26} />
      <Sfx name="impact-bass-echo" at={3} volume={0.22} />
      <Sfx name="paper-wrapper-rip-2" at={c('now') - 1} volume={0.3} />
      <Sfx name="paper-movement-2" at={c('now') + 4} volume={0.2} />
      <Sfx name="ui-reveal" at={c('report') + 4} volume={0.14} />

      {/* The podium: one hit per step */}
      <Sfx name="whoosh-deep-short" at={c('race') - 12} volume={0.18} />
      {['race', 'stocks', 'gold'].map((k) => (
        <Sfx key={k} name="infographic-sound-effect-1" at={c(k) - 2} volume={0.2} />
      ))}

      {/* The second number and the ride */}
      <Sfx name="bass-drop-descend" at={c('catch')} volume={0.2} />
      <Sfx name="deep-whoosh" at={c('catch') + 6} volume={0.2} />
      <Sfx name="wheel-spin" at={c('vol')} volume={0.08} frames={120} />

      {/* −50% then +50% */}
      <Sfx name="coins-money-drop" at={c('drag') + 4} volume={0.22} />
      <Sfx name="data-whoosh" at={c('down')} volume={0.18} />
      <Sfx name="coins-money-drop" at={c('up') + 2} volume={0.2} />
      <Sfx name="hud-electronic-interface-sfx-pack-6" at={c('loss')} volume={0.14} />

      {/* The ghost of the simple average evaporates */}
      <Sfx name="metalic-riser" at={c('avg')} volume={0.11} frames={30} />
      <Sfx name="transition-swoosh" at={c('keep')} volume={0.18} />

      {/* Scenario fan */}
      <Sfx name="whoosh-deep-light" at={c('range') - 2} volume={0.18} />
      <Sfx name="ni-sound-cute-interface-bubble-pop-synth-chord-positive-notification" at={c('bull') + 26} volume={0.14} />
      <Sfx name="bass-drop-descend" at={c('bear') + 4} volume={0.2} />

      {/* Real chart, the model, the payoff */}
      <Sfx name="slide-projector-9" at={c('real')} volume={0.24} />
      <Sfx name="impact-bass-echo" at={c('low')} volume={0.16} />
      <Sfx name="jail-lock-2" at={c('model') + 14} volume={0.14} frames={30} />
      <Sfx name="whoosh-and-hit-2" at={c('payoff') - 4} volume={0.18} />
      <Sfx name="deep-whoosh" at={c('check') + 4} volume={0.16} />
    </>
  );
};
