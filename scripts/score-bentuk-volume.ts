/**
 * Original synthesized score for bentuk-volume (no samples), timed from the narration cues and ducked under the voice
 * (scripts/score-lib.ts): a question under the bounce, a measured bed with a soft tick while the shapes are explained,
 * a darker pulse under the falling days, a lift as the thin area holds, an unresolved chord under the 18 Nov break.
 *
 *   npx tsx scripts/score-bentuk-volume.ts
 */
import {createScore, harm} from './score-lib';

const score = createScore('bentuk-volume');
const c = score.cues;
const {layer} = score;
const pad = (notes: number[], amp: number, breath = 0.1) => {
  const b = `(0.82+0.18*sin(2*PI*${breath}*t))`;
  const side = (detune: number) => `(${notes.map((f, k) => harm(f + detune, [amp / (k + 1) ** 0.3, amp * 0.4, amp * 0.2])).join('+')})*${b}`;
  return `${side(0)}|${side(0.35)}`;
};
// The bounce, and the question: E minor add9.
layer('question', c.hook, c.pshape - c.hook + 0.5, pad([82.41, 123.47, 164.81, 185], 0.06), -29, 'lowpass=f=1600', 0.6, 0.5);
// Reading the shape: A minor 7 with a soft 96 BPM tick.
layer('read', c.pshape, c.bshape - c.pshape + 0.5, pad([110, 130.81, 164.81, 196], 0.055), -30, 'lowpass=f=2200', 0.4, 0.5);
{
  const d = c.bshape - c.pshape;
  const tick = (f: number) => `0.3*sin(2*PI*${f}*t)*exp(-mod(t,0.625)*40)`;
  layer('tick', c.pshape, d, `${tick(1320)}|${tick(1323)}`, -35, 'highpass=f=600', 0.3, 0.4);
}
// The falling days: D minor with a low pulse.
layer('fall', c.bshape, c.guard - c.bshape + 0.5, pad([73.42, 87.31, 110, 146.83], 0.06), -29, 'lowpass=f=1500', 0.3, 0.6);
{
  const d = c.guard - c.bshape;
  const beat = (f: number) => `0.5*sin(2*PI*${f}*t)*exp(-mod(t,0.6)*14)`;
  layer('pulse', c.bshape, d, `${beat(55)}+${beat(110)}*0.4|${beat(55)}+${beat(110)}*0.4`, -31, 'lowpass=f=700', 0.2, 0.5);
}
// The thin area holds: C major opening up.
layer('hold', c.guard, c.pay - c.guard + 0.5, pad([130.81, 164.81, 196, 261.63], 0.055, 0.08), -28, 'lowpass=f=2600', 0.3, 0.5);
// The break and the takeaway: an unresolved D sus2, cut to silence after the last word.
const endAt = score.lastWordEnd + 0.08;
layer('open', c.pay, endAt - c.pay, pad([73.42, 110, 146.83, 164.81], 0.055, 0.06), -28, 'aecho=0.8:0.6:180|260:0.2|0.15,lowpass=f=2400', 0.5, 0.06);

score.write(endAt);
console.log(`✔ score.mp3 (${score.layers.length} layers, ducked under the voice, cut at ${endAt.toFixed(2)} s) in public/episodes/bentuk-volume`);
