import {Audio, staticFile} from 'remotion';
import {Sfx} from '../../components/Sfx';
import {useCues} from '../../lib/cues';

/** Score (synthesized, ducked under the voice) and effects placed on on-screen events (absolute frames). */
export const Sound = () => {
  const {cue, word} = useCues();
  const c = (k: string) => cue(k);
  return (
    <>
      <Audio src={staticFile('episodes/semua-merah/score.mp3')} />
      <Sfx name="cinematic-boom-soft" at={0} volume={0.24} />
      {/* Each red tile drops in on its word */}
      {[c('hook') + 4, word('emas', 0), word('perak', 0), word('bitcoin', 0)].map((f, k) => <Sfx key={k} name="hud-electronic-interface-sfx-pack-6" at={f} volume={0.12} />)}
      <Sfx name="deep-whoosh" at={c('q') - 2} volume={0.18} />
      <Sfx name="ui-reveal" at={c('myth') + 4} volume={0.14} />
      <Sfx name="switch-click" at={c('trade') - 2} volume={0.16} />
      <Sfx name="coins-money-drop" at={c('trade') + 24} volume={0.18} />
      <Sfx name="cash-register-1" at={c('swap') + 10} volume={0.12} />
      <Sfx name="bass-drop-descend" at={c('price') + 10} volume={0.14} />
      {/* The reveal: the board is bigger */}
      <Sfx name="whoosh-deep-light" at={c('green') - 2} volume={0.2} />
      {[c('bonds'), c('oil'), word('energi')].map((f, k) => <Sfx key={k} name="ni-sound-cute-interface-bubble-pop-synth-chord-positive-notification" at={f + 2} volume={0.1} />)}
      <Sfx name="hud-electronic-interface-sfx-pack-1" at={c('dollar') + 2} volume={0.12} />
      {/* Triggers */}
      <Sfx name="transition-swoosh" at={c('why') - 2} volume={0.16} />
      {[c('intel'), c('metals'), c('binance')].map((f, k) => <Sfx key={k} name="impact-bass-echo" at={f + 6} volume={0.14} />)}
      <Sfx name="ui-glitchy-counter" at={c('liq') + 4} volume={0.12} frames={24} />
      {/* The check */}
      <Sfx name="whoosh-and-hit-2" at={c('payoff') - 4} volume={0.16} />
      {[word('hijau'), word('terpaksa')].map((f, k) => <Sfx key={k} name="infographic-sound-effect-1" at={f} volume={0.16} />)}
    </>
  );
};
