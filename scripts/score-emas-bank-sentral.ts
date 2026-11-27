/**
 * Original synthesized score for emas-bank-sentral (no samples), timed from the narration cues and ducked under the
 * voice (scripts/score-lib.ts): a curious plucked pulse for the hook, a quicker ticking pulse for the "fast money",
 * a slow warm bed for the central banks (the patient buyer), a low heartbeat for October's drop, a thinner bed for
 * the survey, and an open chord under the payoff.
 *
 *   npx tsx scripts/score-emas-bank-sentral.ts
 */
import {createScore, harm} from './score-lib';

const score = createScore('emas-bank-sentral');
const c = score.cues;
const {layer} = score;
const pad = (notes: number[], amp: number, breath = 0.1) => {
  const b = `(0.82+0.18*sin(2*PI*${breath}*t))`;
  const side = (detune: number) => `(${notes.map((f, k) => harm(f + detune, [amp / (k + 1) ** 0.3, amp * 0.4, amp * 0.2])).join('+')})*${b}`;
  return `${side(0)}|${side(0.35)}`;
};
const pluck = (f: number, period: number, decay: number, amp = 0.5) => `${amp}*sin(2*PI*${f}*t)*exp(-mod(t,${period})*${decay})`;
const st = (e: string) => `${e}|${e}`;
const beat = 0.6; // 100 BPM

// Hook: E minor, a curious plucked pulse.
layer('hook', c.hook, c.fast - c.hook + 0.4, pad([82.41, 164.81, 196, 246.94], 0.045), -31, 'lowpass=f=2200', 0.05, 0.4);
layer('hookPluck', c.hook, c.fast - c.hook, st(`${pluck(493.88, beat, 9, 0.22)}+${pluck(659.25, beat * 2, 7, 0.1)}`), -37, 'lowpass=f=3000', 0.05, 0.3);
// Fast money: D minor, a quicker tick and a low pulse.
layer('fast', c.fast, c.slow - c.fast + 0.4, pad([73.42, 146.83, 174.61, 220], 0.042), -32, 'lowpass=f=1800', 0.3, 0.4);
layer('fastTick', c.fast, c.slow - c.fast, st(pluck(1046.5, beat / 2, 30, 0.14)), -40, 'highpass=f=600', 0.3, 0.3);
layer('fastPulse', c.fast, c.slow - c.fast, st(pluck(55, beat, 14, 0.5)), -31, 'lowpass=f=600', 0.3, 0.3);
// Central banks: C major, warm and slow (one pluck every two beats).
layer('slow', c.slow, c.dip - c.slow + 0.4, pad([65.41, 130.81, 196, 261.63, 329.63], 0.048), -30, 'lowpass=f=2400', 0.4, 0.4);
layer('slowPluck', c.slow, c.dip - c.slow, st(pluck(392, beat * 2, 5, 0.16)), -38, 'lowpass=f=2600', 0.4, 0.3);
// October: A minor, a low heartbeat.
layer('dip', c.dip, c.why - c.dip + 0.4, pad([55, 110, 130.81, 164.81], 0.045), -31, 'lowpass=f=1500', 0.3, 0.4);
layer('dipHeart', c.dip, c.why - c.dip, st(pluck(49, beat, 14, 0.5)), -30, 'lowpass=f=600', 0.2, 0.3);
// Survey: F major 7, thinner.
layer('why', c.why, c.payoff - c.why + 0.4, pad([87.31, 174.61, 220, 261.63, 329.63], 0.04, 0.07), -32, 'lowpass=f=2000', 0.3, 0.4);
// Payoff: open G sus2 with a little echo, cut after the last word.
const endAt = score.lastWordEnd + 0.08;
layer('payoff', c.payoff, endAt - c.payoff, pad([98, 146.83, 196, 220], 0.05, 0.06), -29, 'aecho=0.8:0.6:180|260:0.2|0.15,lowpass=f=2400', 0.4, 0.06);

score.write(endAt);
console.log(`✔ score.mp3 (${score.layers.length} layers, ducked under the voice, cut at ${endAt.toFixed(2)} s) in public/episodes/emas-bank-sentral`);
