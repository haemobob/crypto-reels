/**
 * npm run estimate -- <id> [--sps 5.0]
 *
 * Placeholder timing for preview frames before the voice exists: estimates each word's start/end from its syllables
 * (vowel groups) at `--sps` syllables per second (5.0 ≈ the calm ElevenLabs read), with pauses after punctuation
 * and between beats, and writes episodes/<id>/captions.json marked "ESTIMATE". `npm run voice -- <id> --audio <file>`
 * replaces it with measured timings. Never ship an estimate: validate/audit read the timing note.
 */
import {readFileSync, writeFileSync} from 'node:fs';
import path from 'node:path';
import {parseNarration} from './narration';

const args = process.argv.slice(2);
const id = args.find((a) => !a.startsWith('--'));
if (!id) {
  console.error('Usage: npm run estimate -- <id> [--sps 5.0]');
  process.exit(1);
}
const i = args.indexOf('--sps');
const sps = i >= 0 ? Number(args[i + 1]) : 5.0;
const dir = path.join('episodes', id);
const source = readFileSync(path.join(dir, 'narration.txt'), 'utf8');
const {words} = parseNarration(source, {});

const syllables = (w: string) => {
  const core = w.toLowerCase().replace(/[^a-z]/g, '');
  if (!core) return /\d/.test(w) ? 2 : 1;
  return Math.max(1, (core.match(/[aeiouy]+/g) ?? []).length);
};

let t = 0.15;
const out: Array<{text: string; start: number; end: number; highlight: boolean}> = [];
const cues: Record<string, number> = {};
words.forEach((w, k) => {
  if (w.cue) {
    if (k > 0) t += 0.35;
    cues[w.cue] = +t.toFixed(3);
  }
  const d = syllables(w.text) / sps;
  out.push({text: w.text, start: +t.toFixed(3), end: +(t + d).toFixed(3), highlight: w.highlight});
  t += d;
  if (/[.?!]$/.test(w.text)) t += 0.42;
  else if (/[,:]$/.test(w.text)) t += 0.2;
  else if (/…$/.test(w.text)) t += 0.35;
  else t += 0.03;
});
const captions = {durationSec: +(t + 0.2).toFixed(2), words: out, cues, timing: `ESTIMATE (no voice yet): ${sps} syllables/s, not measured`};
writeFileSync(path.join(dir, 'captions.json'), JSON.stringify(captions, null, 2) + '\n');
console.log(`✔ episodes/${id}/captions.json: ESTIMATED ${captions.durationSec} s, ${out.length} words, cues ${Object.entries(cues).map(([k, v]) => `${k} ${v}`).join(' · ')}`);
