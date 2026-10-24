/**
 * Original synthesized score for jpmorgan-bitcoin (no samples), timed from the narration cues and ducked
 * under the voice (scripts/score-lib.ts).
 *
 *   npx tsx scripts/score-jpmorgan-bitcoin.ts
 */
import {createScore, harm, n, swell} from './score-lib';

const score = createScore('jpmorgan-bitcoin');
const c = score.cues;
const {layer} = score;

// 1. Intrigue, the claim and the report (0 → "angka kedua"): a soft D minor 9 pad, slowly breathing.
{
  const d = c.catch;
  const breathe = '(0.8+0.2*sin(2*PI*0.12*t))';
  layer('pad', 0, d, `(${harm(73.42, [0.16, 0.1, 0.06, 0.04])}+${harm(110, [0.1, 0.05])}+${harm(174.61, [0.07, 0.03])}+0.04*sin(2*PI*329.63*t))*${breathe}|(${harm(73.6, [0.16, 0.1, 0.06, 0.04])}+${harm(110.3, [0.1, 0.05])}+${harm(175, [0.07, 0.03])}+0.04*sin(2*PI*330.1*t))*${breathe}`, -28, 'lowpass=f=1600', 1.0, 0.6);
}
// 2. The numbers: a light tick (120 BPM eighths) while the podium rises.
{
  const d = c.catch - c.race + 0.2;
  const tick = (f: number) => `0.3*sin(2*PI*${f}*t)*exp(-mod(t,0.25)*45)`;
  layer('tick', c.race - 0.2, d, `${tick(1320)}|${tick(1322)}`, -33, 'highpass=f=500', 0.3, 0.4);
}
// 3. The ride ("angka kedua" → "yang tersisa"): a low drone and a tone whose pitch swings up and down like the track.
{
  const d = c.range - c.catch;
  const wob = (f: number, depth: number, rate: number) => `sin(2*PI*(${f}*t-${n(depth / (2 * Math.PI * rate))}*cos(2*PI*${rate}*t)))`;
  layer('drone', c.catch, d, `${harm(55, [0.18, 0.15, 0.1, 0.07, 0.05])}|${harm(55.2, [0.18, 0.15, 0.1, 0.07, 0.05])}`, -29, 'lowpass=f=900', 0.6, 0.5);
  layer('ride', c.catch + 0.3, d - 0.3, `0.16*(${wob(220, 70, 0.32)}+0.5*${wob(440, 140, 0.32)})*${swell(d, 0.5)}|0.16*(${wob(221, 70, 0.32)}+0.5*${wob(442, 140, 0.32)})*${swell(d, 0.5)}`, -31, 'lowpass=f=1400', 1.2, 0.5);
}
// 4. The scenarios: an airy A major add9 pad that opens up.
{
  const d = c.real - c.range;
  layer('fan', c.range, d, `(${harm(110, [0.12, 0.05])}+${harm(138.59, [0.08, 0.03])}+${harm(164.81, [0.08, 0.03])}+0.04*sin(2*PI*493.88*t))*${swell(d, 0.5)}|(${harm(110.3, [0.12, 0.05])}+${harm(139, [0.08, 0.03])}+${harm(165.2, [0.08, 0.03])}+0.04*sin(2*PI*494.6*t))*${swell(d, 0.5)}`, -28, 'lowpass=f=2400', 0.4, 0.3);
}
// 5. Reality (the real chart): the pad drops out, one low tone remains.
{
  const d = c.model - c.real;
  const trem = '(0.8+0.2*sin(2*PI*0.5*t))';
  layer('real', c.real + 0.15, d, `(${harm(82.41, [0.24, 0.16, 0.1, 0.07, 0.04])})*${trem}|(${harm(82.5, [0.24, 0.16, 0.1, 0.07, 0.04])})*${trem}`, -28, 'lowpass=f=900', 0.3, 0.4);
}
// 6. The model and the payoff: a warm D major resolve, cut to silence after the last word.
const endAt = score.lastWordEnd + 0.08;
{
  const d = endAt - c.model;
  layer('resolve', c.model, d, `${harm(73.42, [0.14, 0.08, 0.05])}+${harm(146.83, [0.1, 0.04])}+${harm(185, [0.09, 0.03])}+${harm(220, [0.08, 0.03])}|${harm(73.6, [0.14, 0.08, 0.05])}+${harm(147.1, [0.1, 0.04])}+${harm(185.4, [0.09, 0.03])}+${harm(220.4, [0.08, 0.03])}`, -27, 'aecho=0.8:0.6:180|260:0.2|0.15,lowpass=f=3000', 0.8, 0.06);
}

score.write(endAt);
console.log(`✔ score.mp3 (${score.layers.length} layers, ducked under the voice, cut at ${endAt.toFixed(2)} s) in public/episodes/jpmorgan-bitcoin`);
