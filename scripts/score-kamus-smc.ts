/**
 * Original synthesized score for kamus-smc (no samples), timed from the narration cues and ducked under the voice
 * (scripts/score-lib.ts). One chord per stage, a light tick while the chart is read, tension under the liquidity
 * stage, a riser into the 1 July sweep, and a resolve under the reading order.
 *
 *   npx tsx scripts/score-kamus-smc.ts
 */
import {readFileSync} from 'node:fs';
import {createScore, harm, n, swell} from './score-lib';
import {p} from './lib';

const score = createScore('kamus-smc');
const c = score.cues;
const {layer} = score;
const words = (JSON.parse(readFileSync(p('episodes', 'kamus-smc', 'captions.json'), 'utf8')) as {words: Array<{text: string; start: number}>}).words;
const word = (t: string, nth = 0) => words.filter((w) => w.text.toLowerCase().replace(/[^\p{L}\p{N}]/gu, '') === t)[nth].start;

/** A soft pad: each note with a few overtones, right channel detuned for width, slowly breathing. */
const pad = (notes: number[], amp: number, breath = 0.1) => {
  const b = `(0.82+0.18*sin(2*PI*${breath}*t))`;
  const side = (detune: number) => `(${notes.map((f, k) => harm(f + detune, [amp / (k + 1) ** 0.3, amp * 0.4, amp * 0.2])).join('+')})*${b}`;
  return `${side(0)}|${side(0.35)}`;
};
const chords: Array<[string, string, string, number[]]> = [
  ['intro', 'hook', 's1', [110, 130.81, 164.81, 196, 246.94]], // A minor 9: a question
  ['struktur', 's1', 's3', [87.31, 110, 130.81, 164.81]], // F major 7: reading
  ['liquidity', 's3', 's4', [73.42, 87.31, 110, 146.83]], // D minor: tension
  ['entry', 's4', 's5', [130.81, 164.81, 196, 293.66]], // C add9: opening up
  ['zones', 's5', 'payoff', [98, 123.47, 146.83, 164.81]], // G6
];
for (const [name, from, to, notes] of chords) {
  const d = c[to] - c[from] + 0.6;
  layer(name, c[from], d, pad(notes, 0.06), -29, 'lowpass=f=1800', 0.8, 0.8);
}

// A light tick (100 BPM eighths) while the chart is read, stage 1 to the payoff.
{
  const d = c.payoff - c.s1;
  const tick = (f: number) => `0.3*sin(2*PI*${f}*t)*exp(-mod(t,0.3)*40)`;
  layer('tick', c.s1, d, `${tick(1480)}|${tick(1483)}`, -35, 'highpass=f=600', 0.5, 0.5);
}
// Tension under the liquidity stage: a low drone that grows.
{
  const d = c.s4 - c.s3;
  layer('drone', c.s3, d, `(${harm(55, [0.18, 0.14, 0.1, 0.07, 0.05])})*${swell(d, 0.4)}|(${harm(55.25, [0.18, 0.14, 0.1, 0.07, 0.05])})*${swell(d, 0.4)}`, -30, 'lowpass=f=800', 1, 0.6);
}
// A riser into the 1 July sweep ("nembus" → "sweep").
{
  const at = word('nembus') - 0.6, d = word('sweep', 1) - at;
  const sweepTone = (f0: number) => `0.2*sin(2*PI*(${f0}*t+${n(260 / (2 * d))}*t*t))*${swell(d, 0.1)}`;
  layer('riser', at, d, `${sweepTone(180)}|${sweepTone(181)}`, -31, 'highpass=f=150', 0.4, 0.05);
}
// The reading order and the rule: a warm A major add9 resolve, cut to silence after the last word.
const endAt = score.lastWordEnd + 0.08;
{
  const d = endAt - c.payoff;
  layer('resolve', c.payoff, d, pad([110, 138.59, 164.81, 246.94], 0.06, 0.06), -27, 'aecho=0.8:0.6:180|260:0.2|0.15,lowpass=f=3000', 0.8, 0.06);
}

score.write(endAt);
console.log(`✔ score.mp3 (${score.layers.length} layers, ducked under the voice, cut at ${endAt.toFixed(2)} s) in public/episodes/kamus-smc`);
