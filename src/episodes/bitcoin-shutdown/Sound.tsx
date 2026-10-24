import {Audio, Sequence, staticFile} from 'remotion';
import {Sfx} from '../../components/Sfx';
import {useCues} from '../../lib/cues';

/** This episode's synthesized effects (scripts/score-bitcoin-shutdown.ts). */
type FxName = 'disconnect' | 'crackle' | 'fail-beep' | 'atm-chime' | 'app-error' | 'hop';
const Fx = ({name, at, volume = 0.4}: {name: FxName; at: number; volume?: number}) => (
  <Sequence from={Math.max(0, Math.round(at))} durationInFrames={30} name={`fx:${name}`}>
    <Audio src={staticFile(`episodes/bitcoin-shutdown/sfx/${name}.wav`)} volume={volume} />
  </Sequence>
);

/**
 * Score and effects, placed on the on-screen events of each world (absolute frames).
 * The score (score.mp3) is already ducked under the narration; effects stay sparse: no alarm on every line.
 */
export const Sound = () => {
  const {cue, word} = useCues();
  const SHUT = word('shutdown');
  const [uk, days, ukinet, php, jutaan, offline, pos, atm, bank] = ['uk', 'days', 'ukinet', 'php', 'jutaan', 'offline', 'pos', 'atm', 'bank'].map((k) => (k === 'jutaan' ? word('jutaan') : cue(k)));
  const [question, q2, q3, nocenter, relay, confirm, local, partition] = ['question', 'q2', 'q3', 'nocenter', 'relay', 'confirm', 'local', 'partition'].map((k) => cue(k));
  const [reveal, key, sat, satsend, exchange, access, sum] = ['reveal', 'key', 'sat', 'satsend', 'exchange', 'access', 'sum'].map((k) => cue(k));
  const kepemilikan = word('kepemilikan');
  return (
    <>
      <Audio src={staticFile('episodes/bitcoin-shutdown/score.mp3')} />

      {/* Cold open: bass, then the links snap on "SHUTDOWN" (impact, disconnect, electrical crackle) */}
      <Sfx name="cinematic-boom-soft" at={0} volume={0.3} />
      <Sfx name="impact-bass-echo" at={SHUT} volume={0.32} />
      <Fx name="disconnect" at={SHUT + 1} volume={0.35} />
      <Fx name="crackle" at={SHUT + 3} volume={0.22} />
      <Sfx name="whoosh-deep-short" at={uk - 12} volume={0.2} />

      {/* Government warning: paper, a faint newsroom keyboard, the 72 JAM monument, the four services */}
      <Sfx name="paper-movement-2" at={uk + 2} volume={0.25} />
      <Sfx name="typing" at={uk + 20} volume={0.05} frames={75} />
      <Sfx name="cinematic-boom-long" at={days - 4} volume={0.2} />
      <Sfx name="hud-electronic-interface-sfx-pack-4" at={ukinet} volume={0.14} />

      {/* Cyber threat: digits become server lights, attack glitches, warning signals, websites switched off */}
      <Sfx name="data-whoosh" at={php} volume={0.24} />
      <Sfx name="ui-glitchy-counter" at={jutaan} volume={0.2} />
      <Sfx name="hud-electronic-interface-sfx-pack-6" at={jutaan + 24} volume={0.13} />
      <Sfx name="hud-electronic-interface-sfx-pack-1" at={offline + 4} volume={0.13} />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <Sfx key={i} name="switch-click" at={offline + 46 + i * 5} volume={0.14} />
      ))}
      <Sfx name="metalic-riser" at={pos - 52} volume={0.14} />
      <Sfx name="whoosh-deep-short" at={pos - 8} volume={0.22} />

      {/* Payment failures: terminal beep, ATM chime, banking-app error, then near-silence */}
      <Fx name="fail-beep" at={pos + 3} volume={0.4} />
      <Sfx name="transition-swoosh" at={atm - 2} volume={0.2} />
      <Fx name="atm-chime" at={atm + 4} volume={0.3} />
      <Fx name="app-error" at={bank + 6} volume={0.4} />

      {/* The question: the wallet appears, goes offline, the push on "gimana?" */}
      <Sfx name="ui-reveal" at={question + 6} volume={0.12} />
      <Fx name="disconnect" at={q2 + 6} volume={0.32} />
      <Sfx name="whoosh-deep-short" at={q3 + 1} volume={0.22} />
      <Sfx name="bass-drop-descend" at={word('gimana')} volume={0.24} />

      {/* Network: into the screen, one ping per hop, the confirmation, connections failing */}
      <Sfx name="deep-whoosh" at={nocenter - 6} volume={0.24} />
      {[6, 36, 68].map((d) => (
        <Fx key={d} name="hop" at={relay + d} volume={0.28} />
      ))}
      <Sfx name="ni-sound-cute-interface-bubble-pop-synth-chord-positive-notification" at={confirm} volume={0.18} />
      <Fx name="disconnect" at={local + 14} volume={0.3} />
      <Fx name="crackle" at={partition + 18} volume={0.2} />
      <Sfx name="impact-bass-echo" at={partition + 18} volume={0.18} />
      <Sfx name="ui-glitchy-counter" at={partition + 40} volume={0.12} />

      {/* Revelation (after the silence): the memorable sound on "nggak otomatis hilang", the key, the chain */}
      <Sfx name="bell-ring-idea" at={reveal} volume={0.3} />
      <Sfx name="jail-lock-2" at={key + 4} volume={0.16} frames={30} />
      <Sfx name="data-whoosh" at={kepemilikan - 8} volume={0.18} />
      <Sfx name="whoosh-deep-light" at={sat - 24} volume={0.22} />

      {/* Space: the broadcast, the ground receiver, the blocked send */}
      <Sfx name="hud-electronic-interface-sfx-pack-4" at={sat + 26} volume={0.12} />
      <Sfx name="ping" at={sat + 114} volume={0.2} />
      <Fx name="fail-beep" at={satsend + 34} volume={0.25} />

      {/* Final: exchange failure, the pull-back, the coin; the last line stays quiet */}
      <Sfx name="transition-swoosh" at={exchange} volume={0.18} />
      <Fx name="app-error" at={access + 4} volume={0.32} />
      <Sfx name="whoosh-deep-light" at={sum} volume={0.16} />
      <Sfx name="cinematic-boom-soft" at={sum + 40} volume={0.18} />
    </>
  );
};
