/**
 * Original synthesized score for tiga-hammer (no samples), timed from the narration cues and ducked under the voice
 * (scripts/score-lib.ts): a light plucked pulse (~100 BPM) under the three traders, a darker pulse inside the
 * candles, a lift under the results, the bed thinning under "bukan rumus", and an open chord under the payoff.
 *
 *   npx tsx scripts/score-tiga-hammer.ts
 */
import {createScore, harm} from './score-lib';

const score = createScore('tiga-hammer');
const c = score.cues;
const {layer} = score;
const pad = (notes: number[], amp: number, breath = 0.1) => {
  const b = `(0.82+0.18*sin(2*PI*${breath}*t))`;
  const side = (detune: number) => `(${notes.map((f, k) => harm(f + detune, [amp / (k + 1) ** 0.3, amp * 0.4, amp * 0.2])).join('+')})*${b}`;
  return `${side(0)}|${side(0.35)}`;
};
const pluck = (f: number, period: number, decay: number, amp = 0.5) => `${amp}*sin(2*PI*${f}*t)*exp(-mod(t,${period})*${decay})`;
const beat = 0.6; // 100 BPM

// The three traders: A minor, a plucked pulse.
layer('open', c.hook, c.a - c.hook + 0.4, pad([110, 164.81, 220, 261.63], 0.045), -31, 'lowpass=f=2200', 0.05, 0.4);
layer('pluck', c.hook, c.a - c.hook, `${pluck(440, beat, 9, 0.25)}+${pluck(659.25, beat * 2, 7, 0.12)}|${pluck(440, beat, 9, 0.25)}+${pluck(659.25, beat * 2, 7, 0.12)}`, -36, 'lowpass=f=3000', 0.05, 0.3);
// Inside the candles: D minor, a low heartbeat.
layer('inside', c.a, c.result - c.a + 0.4, pad([73.42, 146.83, 174.61, 220], 0.045), -31, 'lowpass=f=1600', 0.3, 0.4);
layer('heart', c.a, c.result - c.a, `${pluck(55, beat, 14, 0.5)}|${pluck(55, beat, 14, 0.5)}`, -30, 'lowpass=f=600', 0.2, 0.3);
// Results: a lift to C major.
layer('lift', c.result, c.twist - c.result + 0.3, pad([130.81, 196, 261.63, 329.63], 0.05), -30, 'lowpass=f=2600', 0.3, 0.3);
// "Bukan rumus": the bed thins to one low note, then the data pulse.
layer('thin', c.twist, c.payoff - c.twist + 0.4, pad([87.31, 174.61], 0.04, 0.06), -32, 'lowpass=f=1400', 0.1, 0.4);
layer('tick', c.twist + 1.2, c.payoff - c.twist - 1.2, `${pluck(1200, beat / 2, 40, 0.15)}|${pluck(1203, beat / 2, 40, 0.15)}`, -40, 'highpass=f=700', 0.3, 0.3);
// Payoff: open G sus2, cut after the last word.
const endAt = score.lastWordEnd + 0.08;
layer('open2', c.payoff, endAt - c.payoff, pad([98, 146.83, 196, 220], 0.05, 0.06), -29, 'aecho=0.8:0.6:180|260:0.2|0.15,lowpass=f=2400', 0.4, 0.06);

score.write(endAt);
console.log(`✔ score.mp3 (${score.layers.length} layers, ducked under the voice, cut at ${endAt.toFixed(2)} s) in public/episodes/tiga-hammer`);
