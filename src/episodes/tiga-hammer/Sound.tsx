import {Audio, staticFile} from 'remotion';
import {Sfx, type SfxName} from '../../components/Sfx';
import {useCues} from '../../lib/cues';

/** Score (synthesized, ducked under the voice) and effects on on-screen events (absolute frames). Rotates takes. */
export const Sound = () => {
  const {cue, word} = useCues();
  const pops: SfxName[] = ['ui-clicks-notification-pop', 'digital-bounce', 'click-3'];
  const w = (t: string, n = 0) => word(t, n);
  return (
    <>
      <Audio src={staticFile('episodes/tiga-hammer/score.mp3')} />
      <Sfx name="cinematic-boom-soft" at={0} volume={0.2} />
      <Sfx name="ui-glitchy-counter" at={0} volume={0.035} frames={75} />
      <Sfx name={pops[0]} at={w('sama') + 2} volume={0.1} />
      <Sfx name="whoosh-deep-light" at={w('sama') + 40} volume={0.06} />
      <Sfx name={pops[1]} at={w('beli') + 2} volume={0.09} />
      <Sfx name={pops[2]} at={w('beli') + 14} volume={0.09} />
      <Sfx name={pops[0]} at={w('beli') + 26} volume={0.09} />
      <Sfx name="deep-whoosh" at={w('lima', 0) - 6} volume={0.11} />
      <Sfx name="ui-glitchy-counter" at={w('isinya') - 4} volume={0.04} frames={110} />
      <Sfx name={pops[1]} at={w('disapu', 0)} volume={0.08} />
      <Sfx name={pops[2]} at={w('patah')} volume={0.08} />
      <Sfx name="ui-reveal" at={w('cantik') - 4} volume={0.06} />
      <Sfx name="impact-bass-echo" at={w('kosong')} volume={0.08} />
      <Sfx name="whoosh-deep-short" at={cue('c') - 3} volume={0.1} />
      <Sfx name="ui-glitchy-counter" at={cue('c') + 6} volume={0.035} frames={110} />
      <Sfx name="bass-drop-descend" at={w('disapu', 1)} volume={0.07} />
      <Sfx name="switch-click" at={w('gagal')} volume={0.1} />
      <Sfx name="whoosh-deep-short" at={cue('b') - 3} volume={0.1} />
      <Sfx name="ui-glitchy-counter" at={cue('b') + 2} volume={0.035} frames={60} />
      <Sfx name="data-whoosh" at={w('sapu')} volume={0.07} />
      <Sfx name="whoosh-and-hit-2" at={w('change')} volume={0.11} />
      <Sfx name="ui-reveal" at={w('dalam', 1) - 4} volume={0.06} />
      <Sfx name="metalic-riser" at={cue('result') - 24} volume={0.06} />
      <Sfx name="ni-sound-cute-interface-bubble-pop-synth-chord-positive-notification" at={w('persen', 0) - 2} volume={0.1} />
      <Sfx name={pops[2]} at={w('diam') + 4} volume={0.08} />
      <Sfx name="bass-drop-descend" at={w('sempat')} volume={0.07} />
      <Sfx name="cinematic-boom-soft" at={cue('twist') - 2} volume={0.16} />
      <Sfx name="data-whoosh" at={w('dari', 0)} volume={0.06} />
      <Sfx name="transition-swoosh" at={w('terakhir', 3) + 8} volume={0.07} />
      <Sfx name="mountain-audio-computer-data-readout-and-counter-bundle-sound-3" at={w('lima', 1) - 18} volume={0.05} frames={45} />
      <Sfx name="mountain-audio-computer-data-readout-and-counter-bundle-sound-3" at={w('tiga', 3) - 30} volume={0.05} frames={60} />
      <Sfx name={pops[0]} at={w('tiga', 3) + 14} volume={0.09} />
      <Sfx name="whoosh-deep-light" at={cue('payoff') - 3} volume={0.08} />
      <Sfx name={pops[1]} at={w('kendali') - 6} volume={0.08} />
      <Sfx name="switch-click" at={w('bukan', 1)} volume={0.07} />
      <Sfx name="whoosh-deep-short" at={w('pakai')} volume={0.06} />
      <Sfx name="bass-drop-descend" at={w('tembus', 2)} volume={0.08} />
      <Sfx name="impact-bass-echo" at={w('batal') - 6} volume={0.09} />
    </>
  );
};
