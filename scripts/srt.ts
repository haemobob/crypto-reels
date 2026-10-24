/**
 * npm run srt -- <id>
 * Writes episodes/<id>/<id>.srt from captions.json: one short line per cue (≤ 42 characters), broken at
 * sentence ends and pauses; long sentences are split evenly, preferring colons and commas and never right after a
 * word that leans on the next one ("di", "belum", any part of a spoken number…). Narration starts at frame 0, so these are video times.
 */
import {writeFileSync} from 'node:fs';
import path from 'node:path';
import type {Captions} from '../src/lib/types';
import {episodeDir, p, readJson, requireEpisodeId} from './lib';

const MAX_CHARS = 42;
const PAUSE_BREAK = 0.6;
const MIN_SECONDS = 0.8;
/** Indonesian words that read badly at the end of a line: prepositions, conjunctions, auxiliaries, pronouns used as subjects, and every part of a spoken number (a line never breaks inside "dua puluh koma sembilan"). */
const LEANS_FORWARD = new Set([
  'di', 'ke', 'dari', 'pada', 'untuk', 'dan', 'yang', 'kalau', 'akan', 'bisa', 'belum', 'nggak', 'tidak', 'tetap', 'perlu', 'juga', 'seluruh', 'sejumlah',
  'lo', 'gue', 'jadi', 'cuma', 'hanya', 'tinggal', 'seberapa', 'lebih', 'masih', 'udah', 'sudah', 'kasih',
  'satu', 'dua', 'tiga', 'empat', 'lima', 'enam', 'tujuh', 'delapan', 'sembilan', 'sepuluh', 'sebelas', 'seratus', 'seribu', 'puluh', 'belas', 'ratus', 'ribu', 'juta', 'miliar', 'triliun', 'koma',
]);

const id = requireEpisodeId();
const {words} = readJson<Captions>(path.join(episodeDir(id), 'captions.json'));

type Word = (typeof words)[number];
type Cue = {start: number; end: number; text: string};
const join = (ws: Word[]) => ws.map((w) => w.text).join(' ');

/** Splits a sentence into lines of at most MAX_CHARS, as even as possible, preferring breaks after commas. */
const splitBalanced = (ws: Word[]): Word[][] => {
  const total = join(ws).length;
  if (total <= MAX_CHARS) return [ws];
  const target = total / Math.ceil(total / MAX_CHARS);
  const best = Array<number>(ws.length + 1).fill(Infinity);
  const prev = Array<number>(ws.length + 1).fill(0);
  best[0] = 0;
  for (let i = 1; i <= ws.length; i++)
    for (let j = 0; j < i; j++) {
      const l = join(ws.slice(j, i)).length;
      if (l > MAX_CHARS) continue;
      const last = ws[i - 1].text;
      // Prefer breaks after a colon, then after a comma; avoid breaking after a word that leans on the next.
      const comma = i < ws.length && /[:;]$/.test(last) ? -200 : i < ws.length && /,$/.test(last) ? -40 : 0;
      const leans = i < ws.length && LEANS_FORWARD.has(last.toLowerCase()) ? 150 : 0;
      const cost = best[j] + (l - target) ** 2 + comma + leans + 60;
      if (cost < best[i]) {
        best[i] = cost;
        prev[i] = j;
      }
    }
  const lines: Word[][] = [];
  for (let i = ws.length; i > 0; i = prev[i]) lines.unshift(ws.slice(prev[i], i));
  return lines;
};

// Sentences end at . ? ! … or at a pause; each sentence becomes one or more balanced lines.
const cues: Cue[] = [];
let sentence: Word[] = [];
words.forEach((w, i) => {
  sentence.push(w);
  const next = words[i + 1];
  if (/[.?!…]$/.test(w.text) || !next || next.start - w.end > PAUSE_BREAK) {
    for (const l of splitBalanced(sentence)) cues.push({start: l[0].start, end: l[l.length - 1].end, text: join(l)});
    sentence = [];
  }
});

// Hold short cues a little longer, never into the next one.
cues.forEach((c, i) => {
  const limit = cues[i + 1] ? cues[i + 1].start - 0.04 : c.end + 1;
  c.end = Math.min(Math.max(c.end + 0.1, c.start + MIN_SECONDS), limit);
});

const stamp = (s: number) => {
  const ms = Math.round(s * 1000);
  const pad = (n: number, w = 2) => String(n).padStart(w, '0');
  return `${pad(Math.floor(ms / 3600000))}:${pad(Math.floor((ms % 3600000) / 60000))}:${pad(Math.floor((ms % 60000) / 1000))},${pad(ms % 1000, 3)}`;
};
const srt = cues.map((c, i) => `${i + 1}\n${stamp(c.start)} --> ${stamp(c.end)}\n${c.text}\n`).join('\n');
const out = path.join(episodeDir(id), `${id}.srt`);
writeFileSync(out, srt);
console.log(`✔ ${path.relative(p(), out)} (${cues.length} cues)`);
