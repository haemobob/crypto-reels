/**
 * Original synthesized score for bear-trap-2026 (no samples), timed from the narration cues and ducked under the voice
 * (scripts/score-lib.ts): tension under the 2026 drop and the 2023 break, a brighter turn under the 2023 reversal,
 * tension again under 2026, an unresolved suspended chord under the condition.
 *
 *   npx tsx scripts/score-bear-trap-2026.ts
 */
import {createScore, harm} from './score-lib';

const score = createScore('bear-trap-2026');
const c = score.cues;
const {layer} = score;
const pad = (notes: number[], amp: number, breath = 0.1) => {
  const b = `(0.82+0.18*sin(2*PI*${breath}*t))`;
  const side = (detune: number) => `(${notes.map((f, k) => harm(f + detune, [amp / (k + 1) ** 0.3, amp * 0.4, amp * 0.2])).join('+')})*${b}`;
  return `${side(0)}|${side(0.35)}`;
};
const pulse = (from: number, to: number, name: string) => {
  const d = to - from;
  const beat = (f: number) => `0.5*sin(2*PI*${f}*t)*exp(-mod(t,0.6)*14)`;
  layer(name, from, d, `${beat(55)}+${beat(110)}*0.4|${beat(55)}+${beat(110)}*0.4`, -31, 'lowpass=f=700', 0.3, 0.4);
};
// The drop (2026 hook) and the 2023 break: D minor, a low pulse.
layer('drop', c.hook, c.rev23 - c.hook + 0.5, pad([73.42, 87.31, 110, 146.83], 0.06), -29, 'lowpass=f=1500', 0.5, 0.6);
pulse(c.break23, c.rev23, 'pulse23');
// The 2023 reversal: F major opening up.
layer('rev', c.rev23, c.t26 - c.rev23 + 0.5, pad([87.31, 130.81, 174.61, 220], 0.06, 0.08), -28, 'lowpass=f=2600', 0.4, 0.5);
// 2026: back to D minor, the pulse under the selling.
layer('now', c.t26, c.miss - c.t26 + 0.5, pad([73.42, 87.31, 110, 146.83], 0.06), -29, 'lowpass=f=1500', 0.5, 0.6);
pulse(c.break26, c.miss, 'pulse26');
// The condition: a suspended chord that does not resolve, cut to silence after the last word.
const endAt = score.lastWordEnd + 0.08;
layer('sus', c.miss, endAt - c.miss, pad([73.42, 110, 146.83, 196], 0.055, 0.06), -28, 'aecho=0.8:0.6:180|260:0.2|0.15,lowpass=f=2800', 0.6, 0.06);

score.write(endAt);
console.log(`✔ score.mp3 (${score.layers.length} layers, ducked under the voice, cut at ${endAt.toFixed(2)} s) in public/episodes/bear-trap-2026`);
