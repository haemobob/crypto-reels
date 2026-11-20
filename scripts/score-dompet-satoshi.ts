/**
 * Original synthesized score for dompet-satoshi (no samples), timed from the narration cues and ducked under the voice
 * (scripts/score-lib.ts): an urgent low pulse under the 20-minute hack, a cold still chord for Satoshi's untouched
 * coins (held until the split), a slow swell when the one wallet becomes 22,000 safes, a thin uneasy pad under the
 * quantum caveat, and an open resolved chord under the payoff.
 *
 *   npx tsx scripts/score-dompet-satoshi.ts
 */
import {createScore, harm} from './score-lib';

const score = createScore('dompet-satoshi');
const c = score.cues;
const {layer} = score;
const pad = (notes: number[], amp: number, breath = 0.1) => {
  const b = `(0.82+0.18*sin(2*PI*${breath}*t))`;
  const side = (detune: number) => `(${notes.map((f, k) => harm(f + detune, [amp / (k + 1) ** 0.3, amp * 0.4, amp * 0.2])).join('+')})*${b}`;
  return `${side(0)}|${side(0.35)}`;
};
const beat = (f: number, period: number, decay: number) => `0.5*sin(2*PI*${f}*t)*exp(-mod(t,${period})*${decay})`;

// The hack: E minor, an urgent heartbeat pulse.
layer('hack', c.hook, c.satoshi - c.hook + 0.4, pad([82.41, 123.47, 164.81, 196], 0.05), -30, 'lowpass=f=1400', 0.05, 0.4);
layer('pulse', c.hook, c.satoshi - c.hook, `${beat(55, 0.42, 16)}|${beat(55, 0.42, 16)}`, -29, 'lowpass=f=600', 0.02, 0.3);
// Satoshi's coins, never moved, only a key to guess: one cold, still C major 7 (no pulse), held until the split.
layer('still', c.satoshi, c.split - c.satoshi + 0.4, pad([65.41, 130.81, 164.81, 246.94], 0.05, 0.05), -30, 'lowpass=f=2400', 0.3, 0.4);
// 22,000 safes: a slow swell into A minor add9, held through the digits.
layer('field', c.split, c.quantum - c.split + 0.4, pad([55, 110, 164.81, 246.94, 261.63], 0.05, 0.04), -28, 'lowpass=f=2600', 1.5, 0.5);
// The caveat: a thin uneasy pad (F lydian colour).
layer('caveat', c.quantum, c.payoff - c.quantum + 0.4, pad([87.31, 174.61, 246.94, 329.63], 0.04, 0.12), -31, 'lowpass=f=2000', 0.3, 0.5);
// Payoff: open G major, cut to silence after the last word.
const endAt = score.lastWordEnd + 0.08;
layer('open', c.payoff, endAt - c.payoff, pad([98, 146.83, 196, 246.94], 0.05, 0.06), -28, 'aecho=0.8:0.6:180|260:0.2|0.15,lowpass=f=2400', 0.4, 0.06);

score.write(endAt);
console.log(`✔ score.mp3 (${score.layers.length} layers, ducked under the voice, cut at ${endAt.toFixed(2)} s) in public/episodes/dompet-satoshi`);
