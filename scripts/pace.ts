/**
 * npm run pace -- <id | path/to/video.mp4> [--outro 2] [--json]
 *
 * Measures how "alive" a rendered Reel is, from the pixels, so pacing can be checked like loudness:
 *  - picture activity per frame in the main zone (y 470–1500: headline + visuals; the micro-caption strip and the
 *    corner logo are excluded so a changing caption word doesn't count as motion);
 *  - still stretches (nothing visibly moving) and the longest one;
 *  - visual events (something new starts moving after a calm moment) and the gap between them;
 *  - hard changes (cuts, flips, flashes);
 *  - the first 3 s (how soon the picture changes after frame 0).
 * Targets (reference/retention-playbook.md §Pace): no still stretch over 1.5 s outside a marked thesis hold, a new visual
 * event at least every 2.5 s on average, a picture change inside the first second.
 */
import {spawnSync} from 'node:child_process';
import {existsSync} from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const target = args.find((a) => !a.startsWith('--'));
if (!target) {
  console.error('Usage: npm run pace -- <id | video.mp4> [--outro 2] [--json]');
  process.exit(1);
}
const flag = (name: string, def: number) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? Number(args[i + 1]) : def;
};
const json = args.includes('--json');
const file = target.endsWith('.mp4') ? target : path.join('output', `${target}.mp4`);
if (!existsSync(file)) {
  console.error(`✖ ${file} not found (render it first)`);
  process.exit(1);
}
// A Cryptonite render ends with a 2 s branded outro; a reference video has none.
const outro = flag('outro', target.endsWith('.mp4') ? 0 : 2);

const probe = spawnSync('ffprobe', ['-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height,r_frame_rate', '-of', 'csv=p=0', file], {encoding: 'utf8'});
const [w, h, rate] = probe.stdout.trim().split(',');
const W = Number(w);
const H = Number(h);
const [rn, rd] = rate.split('/').map(Number);
const fps = rn / (rd || 1);
// Main zone in 1080×1920 terms, scaled to the file's size: y 470–1500.
const y0 = Math.round((470 / 1920) * H);
const ch = Math.round((1030 / 1920) * H);
const SW = 108;
const SH = 103;
const ff = spawnSync('ffmpeg', ['-v', 'error', '-i', file, '-vf', `crop=${W}:${ch}:0:${y0},scale=${SW}:${SH},format=gray`, '-f', 'rawvideo', '-pix_fmt', 'gray', '-'], {maxBuffer: 1 << 30});
if (ff.status !== 0) {
  console.error(String(ff.stderr));
  process.exit(1);
}
const buf = ff.stdout as Buffer;
const size = SW * SH;
const total = Math.floor(buf.length / size);
const n = Math.max(2, total - Math.round(outro * fps));

// Mean absolute difference between consecutive frames (0–255).
const d: number[] = [0];
for (let i = 1; i < n; i++) {
  let s = 0;
  const a = (i - 1) * size;
  const b = i * size;
  for (let k = 0; k < size; k++) s += Math.abs(buf[b + k] - buf[a + k]);
  d.push(s / size);
}
const STILL = 0.12; // below this nothing visible moves
const EVENT = 0.6; // a clear new movement
const HARD = 10; // a cut, a polarity flip or a flash
const t = (i: number) => +(i / fps).toFixed(2);

const stills: Array<[number, number]> = [];
let runStart = -1;
for (let i = 1; i <= n; i++) {
  const still = i < n && d[i] < STILL;
  if (still && runStart < 0) runStart = i;
  if (!still && runStart >= 0) {
    if (i - runStart >= Math.round(0.5 * fps)) stills.push([runStart, i]);
    runStart = -1;
  }
}
const events: number[] = [];
let calm = 0;
for (let i = 1; i < n; i++) {
  if (d[i] >= EVENT && calm >= 4) events.push(i);
  calm = d[i] < EVENT * 0.5 ? calm + 1 : 0;
}
const hard = d.map((v, i) => (v >= HARD ? i : -1)).filter((i) => i > 0);
const gaps = events.slice(1).map((e, i) => (e - events[i]) / fps);
gaps.sort((a, b) => a - b);
const median = gaps.length ? gaps[Math.floor(gaps.length / 2)] : n / fps;
const stillFrames = d.filter((v, i) => i > 0 && v < STILL).length;
const longest = stills.reduce((m, [a, b]) => Math.max(m, (b - a) / fps), 0);
const firstChange = d.findIndex((v, i) => i > 0 && v >= EVENT);
const seconds = n / fps;
const report = {
  file,
  seconds: +seconds.toFixed(1),
  stillPercent: +((100 * stillFrames) / (n - 1)).toFixed(1),
  longestStill: +longest.toFixed(2),
  stillsOver1_5s: stills.filter(([a, b]) => (b - a) / fps > 1.5).map(([a, b]) => `${t(a)}–${t(b)} s`),
  eventsPerMin: +((events.length / seconds) * 60).toFixed(1),
  medianEventGap: +median.toFixed(2),
  maxEventGap: +(gaps.length ? gaps[gaps.length - 1] : seconds).toFixed(2),
  hardChangesPerMin: +((hard.length / seconds) * 60).toFixed(1),
  firstChange: firstChange > 0 ? t(firstChange) : null,
  meanActivity: +(d.reduce((a, b) => a + b, 0) / n).toFixed(3),
};
if (json) {
  console.log(JSON.stringify(report, null, 2));
} else {
  const ok = (cond: boolean) => (cond ? '✔' : '✖');
  console.log(`Pace — ${file} (${report.seconds} s, outro excluded)`);
  console.log(`  ${ok(report.longestStill <= 1.5)} longest still stretch: ${report.longestStill} s (target ≤ 1.5 s outside a marked thesis hold)`);
  console.log(`  ${ok(report.stillsOver1_5s.length === 0)} still stretches over 1.5 s: ${report.stillsOver1_5s.join(', ') || 'none'}`);
  console.log(`  ${ok(report.stillPercent <= 25)} still time: ${report.stillPercent}% (target ≤ 25%)`);
  console.log(`  ${ok(report.medianEventGap <= 2.5)} visual events: ${report.eventsPerMin}/min, median gap ${report.medianEventGap} s, max ${report.maxEventGap} s (target median ≤ 2.5 s, max ≤ 4 s)`);
  console.log(`  · hard changes (cuts, flips, flashes): ${report.hardChangesPerMin}/min`);
  console.log(`  ${ok(report.firstChange !== null && report.firstChange <= 1)} first picture change: ${report.firstChange ?? 'none'} s (target ≤ 1 s)`);
  console.log(`  · mean activity: ${report.meanActivity}`);
}
