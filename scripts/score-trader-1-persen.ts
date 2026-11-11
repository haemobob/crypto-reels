/**
 * Original synthesized score for trader-1-persen (no samples), timed from the narration cues and ducked under the voice
 * (scripts/score-lib.ts): a bouncy court groove under the claim and the lanes, a falling minor pad under the pattern,
 * a resolve under the check.
 *
 *   npx tsx scripts/score-trader-1-persen.ts
 */
import {createScore, harm} from './score-lib';

const score = createScore('trader-1-persen');
const c = score.cues;
const {layer} = score;

const pad = (notes: number[], amp: number, breath = 0.1) => {
  const b = `(0.82+0.18*sin(2*PI*${breath}*t))`;
  const side = (detune: number) => `(${notes.map((f, k) => harm(f + detune, [amp / (k + 1) ** 0.3, amp * 0.4, amp * 0.2])).join('+')})*${b}`;
  return `${side(0)}|${side(0.35)}`;
};
// The court: D minor 7 with a 90 BPM low "dribble" pulse.
layer('court', c.hook, c.trend - c.hook + 0.5, pad([73.42, 87.31, 110, 130.81], 0.055), -30, 'lowpass=f=1700', 0.4, 0.6);
{
  const d = c.trend - c.hook;
  const beat = (f: number) => `0.55*sin(2*PI*${f}*t)*exp(-mod(t,0.6667)*16)`;
  layer('dribble', c.hook, d, `${beat(62)}+${beat(124)}*0.3|${beat(62)}+${beat(124)}*0.3`, -31, 'lowpass=f=600', 0.2, 0.5);
}
// The pattern: B flat minor, darker.
layer('pattern', c.trend, c.payoff - c.trend + 0.5, pad([58.27, 69.3, 87.31, 116.54], 0.06), -29, 'lowpass=f=1400', 0.5, 0.6);
// The check: F major resolve, cut to silence after the last word.
const endAt = score.lastWordEnd + 0.08;
layer('resolve', c.payoff, endAt - c.payoff, pad([87.31, 174.61, 220, 261.63], 0.06, 0.06), -27, 'aecho=0.8:0.6:180|260:0.2|0.15,lowpass=f=3000', 0.6, 0.06);

score.write(endAt);
console.log(`✔ score.mp3 (${score.layers.length} layers, ducked under the voice, cut at ${endAt.toFixed(2)} s) in public/episodes/trader-1-persen`);
