import type {ScriptWord} from './narration';

export type Heard = {text: string; start: number; end: number};
export type Timed = {start: number; end: number; matched: boolean};

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
export const alignWords = (script: ScriptWord[], heard: Heard[], totalSec: number): Timed[] => {
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
