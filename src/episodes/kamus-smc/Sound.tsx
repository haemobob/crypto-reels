import {Audio, staticFile} from 'remotion';
import {Sfx} from '../../components/Sfx';
import {useCues} from '../../lib/cues';

/** Score (synthesized, ducked under the voice) and effects placed on on-screen events (absolute frames). */
export const Sound = () => {
  const {cue, word} = useCues();
  const c = (k: string) => cue(k);
  return (
    <>
      <Audio src={staticFile('episodes/kamus-smc/score.mp3')} />
      <Sfx name="cinematic-boom-soft" at={0} volume={0.24} />
      {/* The first three terms land on the chart, then the pile-up */}
      {[word('order', 0), word('fvg', 0), word('sweep', 0)].map((f, k) => <Sfx key={k} name="infographic-sound-effect-1" at={f} volume={0.16} />)}
      <Sfx name="ui-glitchy-counter" at={word('pusing')} volume={0.12} frames={24} />
      <Sfx name="transition-swoosh" at={c('chart') + 2} volume={0.16} />
      <Sfx name="ui-reveal" at={c('count') + 2} volume={0.14} />

      {/* Stages: one soft hit each */}
      {['s1', 's2', 's3', 's4', 's5'].map((k) => <Sfx key={k} name="whoosh-deep-short" at={c(k) - 4} volume={0.16} />)}
      <Sfx name="hud-electronic-interface-sfx-pack-4" at={word('break') + 4} volume={0.12} />
      <Sfx name="hud-electronic-interface-sfx-pack-4" at={c('choch') + 10} volume={0.12} />

      {/* Liquidity: the piles, the magnet, the sweep */}
      <Sfx name="coins-money-drop" at={c('s3') + 8} volume={0.14} />
      <Sfx name="hud-electronic-interface-sfx-pack-1" at={c('eqh') + 4} volume={0.12} />
      <Sfx name="deep-whoosh" at={word('nembus') - 6} volume={0.2} />
      <Sfx name="impact-bass-echo" at={word('nembus') + 22} volume={0.22} />
      <Sfx name="bass-drop-descend" at={word('sweep', 1) - 2} volume={0.18} />
      <Sfx name="hud-electronic-interface-sfx-pack-6" at={c('idm') + 6} volume={0.12} />

      {/* Entry areas */}
      <Sfx name="ui-reveal" at={c('s4') + 10} volume={0.14} />
      <Sfx name="data-whoosh" at={c('fvg') + 6} volume={0.16} />
      <Sfx name="transition-swoosh" at={c('open') + 4} volume={0.14} />

      {/* Premium / discount */}
      <Sfx name="ui-reveal" at={c('s5') + 30} volume={0.12} />
      <Sfx name="ni-sound-cute-interface-bubble-pop-synth-chord-positive-notification" at={c('aug') + 6} volume={0.12} />

      {/* Payoff: one tick per step, then the rule */}
      {[word('struktur', 1), word('liquidity', 1), word('sweep', 2), word('entry', 2)].map((f, k) => <Sfx key={k} name="infographic-sound-effect-1" at={f} volume={0.16} />)}
      <Sfx name="whoosh-and-hit-2" at={c('caveat') - 4} volume={0.16} />
    </>
  );
};
