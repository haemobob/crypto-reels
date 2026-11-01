/**
 * Original synthesized score for semua-merah (no samples), timed from the narration cues and ducked under the voice
 * (scripts/score-lib.ts): tension under the red board, a lighter bed for the trade, a brighter chord when the green
 * tiles appear, a pulse under the triggers, a resolve under the check.
 *
 *   npx tsx scripts/score-semua-merah.ts
 */
import {createScore, harm} from './score-lib';

const score = createScore('semua-merah');
const c = score.cues;
const {layer} = score;

/** A soft pad: each note with a few overtones, right channel detuned for width, slowly breathing. */
const pad = (notes: number[], amp: number, breath = 0.1) => {
  const b = `(0.82+0.18*sin(2*PI*${breath}*t))`;
  const side = (detune: number) => `(${notes.map((f, k) => harm(f + detune, [amp / (k + 1) ** 0.3, amp * 0.4, amp * 0.2])).join('+')})*${b}`;
  return `${side(0)}|${side(0.35)}`;
};
// Red board and the myth: D minor with a low heartbeat pulse.
layer('red', c.hook, c.trade - c.hook + 0.5, pad([73.42, 87.31, 110, 146.83], 0.06), -29, 'lowpass=f=1500', 0.6, 0.6);
{
  const d = c.trade - c.hook;
  const beat = (f: number) => `0.5*sin(2*PI*${f}*t)*exp(-mod(t,0.75)*14)`;
  layer('pulse', c.hook, d, `${beat(55)}+${beat(110)}*0.4|${beat(55)}+${beat(110)}*0.4`, -31, 'lowpass=f=700', 0.2, 0.5);
}
// The trade: a lighter F major 7.
layer('trade', c.trade, c.green - c.trade + 0.5, pad([87.31, 110, 130.81, 164.81], 0.055), -30, 'lowpass=f=2000', 0.6, 0.6);
// Not everything was red: A major add9 opens up.
layer('green', c.green, c.why - c.green + 0.5, pad([110, 138.59, 164.81, 246.94], 0.06, 0.08), -28, 'lowpass=f=2600', 0.5, 0.6);
// The triggers: C minor with a 100 BPM tick.
layer('why', c.why, c.payoff - c.why + 0.5, pad([65.41, 77.78, 98, 130.81], 0.06), -29, 'lowpass=f=1600', 0.6, 0.6);
{
  const d = c.payoff - c.why;
  const tick = (f: number) => `0.3*sin(2*PI*${f}*t)*exp(-mod(t,0.3)*40)`;
  layer('tick', c.why, d, `${tick(1480)}|${tick(1483)}`, -35, 'highpass=f=600', 0.5, 0.5);
}
// The check: a warm D major resolve, cut to silence after the last word.
const endAt = score.lastWordEnd + 0.08;
layer('resolve', c.payoff, endAt - c.payoff, pad([73.42, 146.83, 185, 220], 0.06, 0.06), -27, 'aecho=0.8:0.6:180|260:0.2|0.15,lowpass=f=3000', 0.8, 0.06);

score.write(endAt);
console.log(`✔ score.mp3 (${score.layers.length} layers, ducked under the voice, cut at ${endAt.toFixed(2)} s) in public/episodes/semua-merah`);
