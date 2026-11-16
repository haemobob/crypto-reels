/**
 * Original synthesized score for poc-bitcoin (no samples), timed from the narration cues and ducked under the voice
 * (scripts/score-lib.ts): a question under the two levels, a measured bed while the profiles are built, a lift under
 * the rally, tension under the drop, a steady chord under the levels to watch.
 *
 *   npx tsx scripts/score-poc-bitcoin.ts
 */
import {createScore, harm} from './score-lib';

const score = createScore('poc-bitcoin');
const c = score.cues;
const {layer} = score;
const pad = (notes: number[], amp: number, breath = 0.1) => {
  const b = `(0.82+0.18*sin(2*PI*${breath}*t))`;
  const side = (detune: number) => `(${notes.map((f, k) => harm(f + detune, [amp / (k + 1) ** 0.3, amp * 0.4, amp * 0.2])).join('+')})*${b}`;
  return `${side(0)}|${side(0.35)}`;
};
// The two levels: E minor add9, a question.
layer('levels', c.hook, c.poc - c.hook + 0.5, pad([82.41, 123.47, 164.81, 185], 0.06), -29, 'lowpass=f=1600', 0.6, 0.5);
// The profiles being built: A minor 7 with a soft 96 BPM tick.
layer('profiles', c.poc, c.rally - c.poc + 0.5, pad([110, 130.81, 164.81, 196], 0.055), -30, 'lowpass=f=2200', 0.4, 0.5);
{
  const d = c.rally - c.poc;
  const tick = (f: number) => `0.3*sin(2*PI*${f}*t)*exp(-mod(t,0.625)*40)`;
  layer('tick', c.poc, d, `${tick(1320)}|${tick(1323)}`, -35, 'highpass=f=600', 0.3, 0.4);
}
// The rally: C major opening up.
layer('rally', c.rally, c.drop - c.rally + 0.5, pad([130.81, 164.81, 196, 261.63], 0.055, 0.08), -28, 'lowpass=f=2600', 0.3, 0.5);
// The drop and the hold: D minor with a low pulse.
layer('drop', c.drop, c.why - c.drop + 0.5, pad([73.42, 87.31, 110, 146.83], 0.06), -29, 'lowpass=f=1500', 0.3, 0.6);
{
  const d = c.why - c.drop;
  const beat = (f: number) => `0.5*sin(2*PI*${f}*t)*exp(-mod(t,0.6)*14)`;
  layer('pulse', c.drop, d, `${beat(55)}+${beat(110)}*0.4|${beat(55)}+${beat(110)}*0.4`, -31, 'lowpass=f=700', 0.2, 0.5);
}
// Why and what to watch: a steady G major 7, cut to silence after the last word.
const endAt = score.lastWordEnd + 0.08;
layer('watch', c.why, endAt - c.why, pad([98, 123.47, 146.83, 185], 0.055, 0.06), -28, 'aecho=0.8:0.6:180|260:0.2|0.15,lowpass=f=2800', 0.6, 0.06);

score.write(endAt);
console.log(`✔ score.mp3 (${score.layers.length} layers, ducked under the voice, cut at ${endAt.toFixed(2)} s) in public/episodes/poc-bitcoin`);
