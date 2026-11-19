/**
 * Original synthesized score for satu-meja (no samples), timed from the narration cues and ducked under the voice
 * (scripts/score-lib.ts): a grave chord under "one table", a restless pulse while the map shifts, a darker pulse under
 * the aircraft and ships, an open unresolved chord under the payoff.
 *
 *   npx tsx scripts/score-satu-meja.ts
 */
import {createScore, harm} from './score-lib';

const score = createScore('satu-meja');
const c = score.cues;
const {layer} = score;
const pad = (notes: number[], amp: number, breath = 0.1) => {
  const b = `(0.82+0.18*sin(2*PI*${breath}*t))`;
  const side = (detune: number) => `(${notes.map((f, k) => harm(f + detune, [amp / (k + 1) ** 0.3, amp * 0.4, amp * 0.2])).join('+')})*${b}`;
  return `${side(0)}|${side(0.35)}`;
};
// One table: D minor, grave.
layer('table', c.hook, c.turn - c.hook + 0.5, pad([73.42, 110, 146.83, 174.61], 0.06), -29, 'lowpass=f=1500', 0.8, 0.5);
// The map shifts: B-flat major 7 over D with a restless tick.
layer('shift', c.turn, c.jets - c.turn + 0.5, pad([116.54, 146.83, 174.61, 220], 0.055, 0.08), -30, 'lowpass=f=2200', 0.3, 0.5);
{
  const d = c.jets - c.turn;
  const tick = (f: number) => `0.3*sin(2*PI*${f}*t)*exp(-mod(t,0.6)*40)`;
  layer('tick', c.turn, d, `${tick(1180)}|${tick(1183)}`, -36, 'highpass=f=600', 0.3, 0.4);
}
// Aircraft and ships: G minor with a low pulse.
layer('force', c.jets, c.pay - c.jets + 0.5, pad([98, 116.54, 146.83, 196], 0.06), -29, 'lowpass=f=1400', 0.3, 0.6);
{
  const d = c.pay - c.jets;
  const beat = (f: number) => `0.5*sin(2*PI*${f}*t)*exp(-mod(t,0.55)*14)`;
  layer('pulse', c.jets, d, `${beat(49)}+${beat(98)}*0.4|${beat(49)}+${beat(98)}*0.4`, -31, 'lowpass=f=700', 0.2, 0.5);
}
// Payoff: an open D sus2, cut to silence after the last word.
const endAt = score.lastWordEnd + 0.08;
layer('open', c.pay, endAt - c.pay, pad([73.42, 110, 146.83, 164.81], 0.055, 0.06), -28, 'aecho=0.8:0.6:180|260:0.2|0.15,lowpass=f=2400', 0.5, 0.06);

score.write(endAt);
console.log(`✔ score.mp3 (${score.layers.length} layers, ducked under the voice, cut at ${endAt.toFixed(2)} s) in public/episodes/satu-meja`);
