import {Audio, staticFile} from 'remotion';
import {Sfx} from '../../components/Sfx';
import {useCues} from '../../lib/cues';

/** Score (synthesized, ducked under the voice) and effects on on-screen events (absolute frames). */
export const Sound = () => {
  const {cue, word} = useCues();
  return (
    <>
      <Audio src={staticFile('episodes/dompet-satoshi/score.mp3')} />
      <Sfx name="cinematic-boom-soft" at={0} volume={0.26} />
      <Sfx name="ui-reveal" at={word('binance', 0) - 4} volume={0.1} />
      <Sfx name="clock-ticking-1" at={word('kebanyakan')} volume={0.12} frames={52} />
      <Sfx name="whoosh-and-hit-2" at={cue('satoshi') - 2} volume={0.12} />
      <Sfx name="data-whoosh" at={word('juta') - 10} volume={0.08} />
      <Sfx name="paper-movement-2" at={word('satoshi', 0) - 6} volume={0.12} />
      <Sfx name="ui-reveal" at={cue('still') - 2} volume={0.09} />
      <Sfx name="camera-focus" at={cue('still') + 14} volume={0.08} />
      <Sfx name="switch-click" at={word('nggak', 2) + 6} volume={0.1} />
      <Sfx name="switch-click" at={word('karyawan')} volume={0.1} />
      <Sfx name="typing-beep-computer-3" at={word('satusatunya')} volume={0.06} frames={80} />
      <Sfx name="deep-whoosh" at={cue('split') - 4} volume={0.12} />
      <Sfx name="metalic-riser" at={word('dompet', 0) - 10} volume={0.08} />
      <Sfx name="cinematic-boom-long" at={word('dompet', 0) + 10} volume={0.14} />
      <Sfx name="data-whoosh" at={word('tersebar')} volume={0.08} />
      <Sfx name="whoosh-deep-light" at={word('masingmasing')} volume={0.08} />
      <Sfx name="whoosh-deep-light" at={cue('digits') + 4} volume={0.08} />
      <Sfx name="typewriter-2" at={word('jumlah')} volume={0.07} frames={96} />
      <Sfx name="whoosh-and-hit-2" at={cue('quantum') - 2} volume={0.1} />
      <Sfx name="camera-focus" at={word('format')} volume={0.07} />
      <Sfx name="ui-reveal" at={word('komputer')} volume={0.08} />
      <Sfx name="impact-bass-echo" at={word('mesinnya')} volume={0.08} />
      <Sfx name="paper-movement-2" at={word('draf')} volume={0.1} />
      <Sfx name="whoosh-deep-short" at={cue('payoff') - 2} volume={0.1} />
      <Sfx name="switch-click" at={word('tempat')} volume={0.08} />
      <Sfx name="switch-click" at={word('orang')} volume={0.08} />
      <Sfx name="ui-reveal" at={word('kalau')} volume={0.08} />
    </>
  );
};
