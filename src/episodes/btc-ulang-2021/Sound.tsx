import {Audio, staticFile} from 'remotion';
import {Sfx} from '../../components/Sfx';
import {useCues} from '../../lib/cues';

/** Score (synthesized, ducked under the voice) and effects placed on on-screen events (absolute frames). */
export const Sound = () => {
  const {cue, word} = useCues();
  const c = (k: string) => cue(k);
  return (
    <>
      <Audio src={staticFile('episodes/btc-ulang-2021/score.mp3')} />
      <Sfx name="cinematic-boom-soft" at={0} volume={0.22} />
      <Sfx name="data-whoosh" at={c('hook') + 4} volume={0.12} />
      <Sfx name="ui-clicks-notification-pop" at={c('claim') + 2} volume={0.12} />
      {/* The light table switches on; the tracing sheet slides in. */}
      <Sfx name="slide-projector-9" at={c('check') - 1} volume={0.2} />
      <Sfx name="paper-movement-2" at={c('check') + 6} volume={0.22} />
      {/* One tick per step. */}
      {['s1', 's2', 's3', 's4', 's5', 's6'].map((k) => <Sfx key={k} name="infographic-sound-effect-1" at={c(k)} volume={0.13} />)}
      {/* The sheet lands on the chart. */}
      <Sfx name="paper-movement-2" at={c('size') + 2} volume={0.18} />
      <Sfx name="whoosh-deep-short" at={c('size') + 20} volume={0.12} />
      <Sfx name="bass-drop-descend" at={c('crash') + 4} volume={0.13} />
      <Sfx name="ui-reveal" at={c('rally') + 18} volume={0.13} />
      <Sfx name="clock-ticking-1" at={c('speed')} volume={0.1} frames={36} />
      {/* The ruler. */}
      <Sfx name="chalk-slide-medium" at={c('retrace') + 30} volume={0.16} />
      <Sfx name="hud-electronic-interface-sfx-pack-4" at={c('never') + 2} volume={0.12} />
      <Sfx name="chalk-slide-medium" at={c('level') + 6} volume={0.16} />
      <Sfx name="impact-bass-echo" at={c('level') + 32} volume={0.14} />
      <Sfx name="hud-electronic-interface-sfx-pack-6" at={c('now') + 40} volume={0.12} />
      <Sfx name="transition-swoosh" at={c('ath') + 2} volume={0.14} />
      <Sfx name="camera-click" at={c('one')} volume={0.16} />
      {/* The verdict. */}
      <Sfx name="whoosh-and-hit-2" at={c('payoff') - 4} volume={0.16} />
      {[word('urutannya', 1), word('ukurannya', 1), word('levelnya')].map((f, k) => <Sfx key={k} name="slick-ui-mechanical-button-press" at={f} volume={0.12} />)}
      <Sfx name="ni-sound-cute-interface-bubble-pop-synth-chord-positive-notification" at={word('sama', 1)} volume={0.1} />
      <Sfx name="hud-electronic-interface-sfx-pack-1" at={word('kecil')} volume={0.12} />
      <Sfx name="ui-reveal" at={word('bertahan')} volume={0.12} />
    </>
  );
};
