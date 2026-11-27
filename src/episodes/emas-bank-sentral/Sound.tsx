import {Audio, staticFile} from 'remotion';
import {Sfx, type SfxName} from '../../components/Sfx';
import {T} from './Film';

/** Original score (scripts/score-emas-bank-sentral.ts, ducked under the voice) and effects on on-screen events. */
export const Sound = () => {
  const pops: SfxName[] = ['ui-clicks-notification-pop', 'digital-bounce', 'click-3'];
  return (
    <>
      <Audio src={staticFile('episodes/emas-bank-sentral/score.mp3')} />
      <Sfx name="cinematic-boom-soft" at={0} volume={0.18} />
      <Sfx name="ui-glitchy-counter" at={0} volume={0.03} frames={34} />
      <Sfx name="whoosh-deep-short" at={T.tapi0 - 2} volume={0.1} />
      <Sfx name="jail-lock-2" at={T.bank0 + 2} volume={0.07} />
      <Sfx name="ui-reveal" at={T.memborong - 2} volume={0.07} />
      <Sfx name={pops[1]} at={T.kenapa - 2} volume={0.09} />
      <Sfx name="whoosh-and-hit-2" at={T.fast - 2} volume={0.11} />
      <Sfx name="coins-money-drop" at={T.fast + 8} volume={0.05} />
      <Sfx name={pops[2]} at={T.empat0} volume={0.08} />
      <Sfx name="coins-money-drop" at={T.sembilan - 6} volume={0.06} />
      <Sfx name={pops[0]} at={T.sembilan - 2} volume={0.09} />
      <Sfx name="whoosh-deep-light" at={T.obligasi - 2} volume={0.08} />
      <Sfx name="ni-sound-cute-interface-bubble-pop-synth-chord-positive-notification" at={T.lima0 - 2} volume={0.08} />
      <Sfx name="bass-drop-descend" at={T.emas2} volume={0.06} />
      <Sfx name="whoosh-and-hit-2" at={T.slow - 2} volume={0.11} />
      <Sfx name="ui-glitchy-counter" at={T.kuartal} volume={0.03} frames={100} />
      <Sfx name="impact-bass-echo" at={T.tiga1} volume={0.07} />
      <Sfx name={pops[0]} at={T.empat1} volume={0.08} />
      <Sfx name="paper-wrapper-rip-2" at={T.nggak1 - 4} volume={0.09} />
      <Sfx name="slick-ui-mechanical-button-press" at={T.seratus} volume={0.08} />
      <Sfx name="whoosh-and-hit-2" at={T.dip - 2} volume={0.11} />
      <Sfx name="ui-glitchy-counter" at={T.dip + 2} volume={0.03} frames={60} />
      <Sfx name="bass-drop-descend" at={T.oktober} volume={0.07} />
      <Sfx name="data-whoosh" at={T.china - 4} volume={0.06} />
      <Sfx name="impact-bass-echo" at={T.dua5 - 2} volume={0.07} />
      <Sfx name="whoosh-deep-short" at={T.why - 2} volume={0.1} />
      <Sfx name={pops[0]} at={T.tiga2} volume={0.08} />
      <Sfx name={pops[1]} at={T.dari2} volume={0.08} />
      <Sfx name={pops[2]} at={T.empat2} volume={0.08} />
      <Sfx name="bass-drop-descend" at={T.turun} volume={0.06} />
      <Sfx name="cinematic-boom-soft" at={T.payoff - 2} volume={0.14} />
      <Sfx name="whoosh-deep-light" at={T.buktinya - 2} volume={0.08} />
      <Sfx name="ese-fight-pack-whoosh-slowmo-01" at={T.minggu1 + 4} volume={0.08} />
      <Sfx name="whoosh-deep-light" at={T.arah - 2} volume={0.08} />
      <Sfx name="impact-bass-echo" at={T.dekade - 2} volume={0.07} />
      <Sfx name="metalic-riser" at={T.pembeli - 30} volume={0.05} />
      <Sfx name="cinematic-boom-long" at={T.sabar} volume={0.1} />
    </>
  );
};
