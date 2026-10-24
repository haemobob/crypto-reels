import type {ScriptWord} from './narration';

export type Heard = {text: string; start: number; end: number};
export type Timed = {start: number; end: number; matched: boolean};

const ONES = ['nol', 'satu', 'dua', 'tiga', 'empat', 'lima', 'enam', 'tujuh', 'delapan', 'sembilan', 'sepuluh', 'sebelas'];

/** Indonesian number words ("terbilang"): 25000 -> "dua puluh lima ribu". */
export const terbilang = (n: number): string => {
  const rest = (r: number) => (r ? ` ${terbilang(r)}` : '');
  if (n < 12) return ONES[n];
  if (n < 20) return `${terbilang(n - 10)} belas`;
  if (n < 100) return `${terbilang(Math.floor(n / 10))} puluh${rest(n % 10)}`;
  if (n < 200) return `seratus${rest(n - 100)}`;
  if (n < 1000) return `${terbilang(Math.floor(n / 100))} ratus${rest(n % 100)}`;
  if (n < 2000) return `seribu${rest(n - 1000)}`;
  if (n < 1e6) return `${terbilang(Math.floor(n / 1000))} ribu${rest(n % 1000)}`;
  if (n < 1e9) return `${terbilang(Math.floor(n / 1e6))} juta${rest(n % 1e6)}`;
  if (n < 1e12) return `${terbilang(Math.floor(n / 1e9))} miliar${rest(n % 1e9)}`;
  if (n < 1e15) return `${terbilang(Math.floor(n / 1e12))} triliun${rest(n % 1e12)}`;
  return String(n);
};

/** Whisper writes spoken numbers as digits ("2023", "$25.000", "ke-12"); spell them out so they align with the script. */
const expandHeard = (heard: Heard[]): Heard[] =>
  heard.flatMap((h) => {
    const raw = h.text.replace(/[,;:!?]+$/u, '').replace(/\.$/u, '');
    const ordinal = raw.match(/^ke-?(\d+)$/i);
    const money = raw.match(/^(\$|Rp)?(\d{1,3}(?:[.,]\d{3})+|\d+)$/);
    let spoken: string | undefined;
    const year = raw.match(/^(1[1-9])(\d\d)$/);
    if (/^(Rp|\$)$/i.test(raw)) return [];
    // Years before 2000 are read in pairs: 1996 -> "sembilan belas sembilan puluh enam".
    if (year) spoken = `${terbilang(Number(year[1]))} ${terbilang(Number(year[2]))}`;
    else if (ordinal) spoken = ordinal[1] === '1' ? 'pertama' : `ke${terbilang(Number(ordinal[1]))}`;
    else if (money) spoken = `${terbilang(Number(money[2].replace(/[.,]/g, '')))}${money[1] === '$' ? ' dolar' : money[1] ? ' rupiah' : ''}`;
    if (!spoken) return [h];
    const parts = spoken.split(' ');
    const total = parts.reduce((a, p) => a + p.length, 0);
    let t = h.start;
    return parts.map((p) => {
      const d = ((h.end - h.start) * p.length) / total;
      const w = {text: p, start: t, end: t + d};
      t += d;
      return w;
    });
  });

const norm = (s: string) => s.toLowerCase().replace(/[^\p{L}\p{N}]/gu, '');

const similarity = (a: string, b: string) => {
  if (!a || !b) return 0;
  if (a === b) return 1;
  const dp = Array.from({length: a.length + 1}, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++)
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return 1 - dp[a.length][b.length] / Math.max(a.length, b.length);
};

/**
 * Gives every script word a time by aligning it to what whisper heard (global sequence alignment).
 * Words whisper misheard or merged get times interpolated between their matched neighbours, by length.
 */
export const alignWords = (script: ScriptWord[], heardRaw: Heard[], totalSec: number): Timed[] => {
  const heard = expandHeard(heardRaw);
  const A = script.map((w) => norm(w.spoken));
  const B = heard.map((h) => norm(h.text));
  const n = A.length, m = B.length, GAP = -0.4;
  const score = Array.from({length: n + 1}, () => new Float64Array(m + 1));
  const move = Array.from({length: n + 1}, () => new Uint8Array(m + 1)); // 1 diag, 2 up, 3 left
  for (let i = 1; i <= n; i++) (score[i][0] = i * GAP), (move[i][0] = 2);
  for (let j = 1; j <= m; j++) (score[0][j] = j * GAP), (move[0][j] = 3);
  for (let i = 1; i <= n; i++)
    for (let j = 1; j <= m; j++) {
      const s = similarity(A[i - 1], B[j - 1]);
      const diag = score[i - 1][j - 1] + (s >= 0.6 ? s : -0.6);
      const up = score[i - 1][j] + GAP;
      const left = score[i][j - 1] + GAP;
      const best = Math.max(diag, up, left);
      score[i][j] = best;
      move[i][j] = best === diag ? 1 : best === up ? 2 : 3;
    }
  const out: Array<Timed | null> = Array(n).fill(null);
  for (let i = n, j = m; i > 0 || j > 0; ) {
    const mv = move[i][j];
    if (mv === 1) {
      if (similarity(A[i - 1], B[j - 1]) >= 0.6) out[i - 1] = {start: heard[j - 1].start, end: heard[j - 1].end, matched: true};
      i--, j--;
    } else if (mv === 2) i--;
    else j--;
  }
  // Fill unmatched runs between anchors, splitting the gap by word length.
  for (let i = 0; i < n; ) {
    if (out[i]) { i++; continue; }
    let k = i;
    while (k < n && !out[k]) k++;
    const from = i > 0 ? out[i - 1]!.end : 0;
    const to = k < n ? out[k]!.start : totalSec;
    const lens = script.slice(i, k).map((w) => Math.max(1, norm(w.spoken).length));
    const total = lens.reduce((a, b) => a + b, 0);
    let t = from;
    for (let x = i; x < k; x++) {
      const d = ((to - from) * lens[x - i]) / total;
      out[x] = {start: t, end: t + d, matched: false};
      t += d;
    }
    i = k;
  }
  return out as Timed[];
};

/**
 * Whisper often starts a word inside the pause before it. Any word that starts inside a measured
 * silence is moved to where speech resumes, and the word before it ends where the silence begins.
 */
export const snapToSilences = (timed: Timed[], silences: Array<[number, number]>, lengths: number[] = []): Timed[] => {
  const out = timed.map((t) => ({...t}));
  for (const [s, e] of silences) {
    out.forEach((w, i) => {
      if (w.start < s - 0.02 || w.start >= e) return;
      w.start = e;
      w.end = Math.max(w.end, e + 0.05);
      const prev = out[i - 1];
      if (prev && prev.end > s) prev.end = Math.max(prev.start + 0.05, s);
    });
  }
  // Words snapped onto the same onset (or before the previous one) are spread out again by length (≈ 0.06 s per letter).
  for (let i = 1; i < out.length; i++) {
    if (out[i].start > out[i - 1].start + 0.01) continue;
    const min = out[i - 1].start + Math.min(0.45, Math.max(0.12, 0.06 * (lengths[i - 1] ?? 4)));
    out[i].start = min;
    out[i].end = Math.max(out[i].end, min + 0.05);
    out[i - 1].end = Math.min(out[i - 1].end, min);
  }
  return out;
};

/** Silences of at least `minSec` below `noiseDb`, parsed from ffmpeg's silencedetect report. */
export const parseSilences = (report: string): Array<[number, number]> => {
  const out: Array<[number, number]> = [];
  let start: number | null = null;
  for (const line of report.split('\n')) {
    const s = line.match(/silence_start: ([\d.]+)/);
    const e = line.match(/silence_end: ([\d.]+)/);
    if (s) start = Number(s[1]);
    if (e && start !== null) {
      out.push([start, Number(e[1])]);
      start = null;
    }
  }
  return out;
};
