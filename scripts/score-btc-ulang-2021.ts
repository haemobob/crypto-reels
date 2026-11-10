/**
 * Original synthesized score for btc-ulang-2021 (no samples), timed from the narration cues and ducked under the voice
 * (scripts/score-lib.ts): a question under the claim, a lighter "light table" bed for the check, tension under the
 * size difference and the level, a resolve under the three checks.
 *
 *   npx tsx scripts/score-btc-ulang-2021.ts
 */
import {createScore, harm} from './score-lib';

const score = createScore('btc-ulang-2021');
const c = score.cues;
const {layer} = score;

/** A soft pad: each note with a few overtones, right channel detuned for width, slowly breathing. */
const pad = (notes: number[], amp: number, breath = 0.1) => {
  const b = `(0.82+0.18*sin(2*PI*${breath}*t))`;
  const side = (detune: number) => `(${notes.map((f, k) => harm(f + detune, [amp / (k + 1) ** 0.3, amp * 0.4, amp * 0.2])).join('+')})*${b}`;
  return `${side(0)}|${side(0.35)}`;
};
// The claim: E minor add9, a question.
layer('claim', c.hook, c.check - c.hook + 0.5, pad([82.41, 123.47, 164.81, 185], 0.06), -29, 'lowpass=f=1600', 0.6, 0.5);
// The light table: G major 7, clean and bright, with a soft 96 BPM tick while the steps are counted.
layer('table', c.check, c.size - c.check + 0.5, pad([98, 123.47, 146.83, 185], 0.055), -30, 'lowpass=f=2400', 0.4, 0.6);
{
  const d = c.size - c.order;
  const tick = (f: number) => `0.3*sin(2*PI*${f}*t)*exp(-mod(t,0.625)*40)`;
  layer('tick', c.order, d, `${tick(1320)}|${tick(1323)}`, -35, 'highpass=f=600', 0.3, 0.4);
}
// The size difference and the ruler: C minor, a low pulse under the level.
layer('size', c.size, c.ath - c.size + 0.5, pad([65.41, 77.78, 98, 130.81], 0.06), -29, 'lowpass=f=1500', 0.6, 0.6);
{
  const d = c.ath - c.level;
  const beat = (f: number) => `0.5*sin(2*PI*${f}*t)*exp(-mod(t,0.75)*14)`;
  layer('pulse', c.level, d, `${beat(55)}+${beat(110)}*0.4|${beat(55)}+${beat(110)}*0.4`, -31, 'lowpass=f=700', 0.3, 0.5);
}
// The caveat: A minor, quieter.
layer('caveat', c.ath, c.payoff - c.ath + 0.5, pad([110, 130.81, 164.81], 0.05), -31, 'lowpass=f=1800', 0.5, 0.5);
// The three checks: a warm E major resolve, cut to silence after the last word.
const endAt = score.lastWordEnd + 0.08;
layer('resolve', c.payoff, endAt - c.payoff, pad([82.41, 164.81, 207.65, 246.94], 0.06, 0.06), -27, 'aecho=0.8:0.6:180|260:0.2|0.15,lowpass=f=3000', 0.8, 0.06);

score.write(endAt);
console.log(`✔ score.mp3 (${score.layers.length} layers, ducked under the voice, cut at ${endAt.toFixed(2)} s) in public/episodes/btc-ulang-2021`);
