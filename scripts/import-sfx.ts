/**
 * npm run import-sfx -- <folder> --pack <name> --licence "<basis>"
 * Imports a folder of sound effects into public/sfx/<pack>/: converts each to 48 kHz WAV, trims leading silence
 * (so a sound placed at frame N is heard at frame N) and peak-normalises to -3 dBFS so `volume` means the same
 * for every sound. Writes public/sfx/<pack>/manifest.json with each sound's key, file, duration, original
 * filename, inferred source and the licence basis given on the command line.
 */
import {readdirSync, mkdirSync, writeFileSync} from 'node:fs';
import path from 'node:path';
import {fail, ffmpegBin, flag, p, probeDuration, run} from './lib';

const src = process.argv[2];
const pack = flag('pack');
const licence = flag('licence');
if (!src || src.startsWith('--') || !pack || !licence) fail('Usage: npm run import-sfx -- <folder> --pack <name> --licence "<basis>"');
const skip = (flag('skip') ?? '').split(',').filter(Boolean);

const AUDIO = /\.(wav|mp3|aac|m4a|ogg|flac|aiff?)$/i;
const slug = (name: string) =>
  name
    .replace(AUDIO, '')
    .replace(/ - Royalty Free Sound Effects$/i, '')
    .replace(/ - SFX Producer(_\d+)?$/i, '')
    .replace(/^ES_/, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

// Where a file came from, as far as its name and tags tell (kept so licences can be re-checked later).
const sourceOf = (name: string, tags: string) => {
  if (/^ES_|SFX Producer/i.test(name + tags)) return 'Epidemic Sound (by filename/tags)';
  if (/^Artlist|^(Ni Sound|Vadi Sound|Mountain Audio) - /i.test(name)) return 'Artlist (by filename)';
  if (/Royalty Free Sound Effects/i.test(name)) return 'Unknown pack ("Royalty Free Sound Effects" in filename)';
  if (/freesound|SoundQ/i.test(tags)) return 'Freesound.org (by embedded tags)';
  if (/Dissona Musika/i.test(tags)) return 'ESE / Dissona Musika (by embedded tags)';
  if (/SmartSound/i.test(tags)) return 'SmartSound FX (by embedded tags)';
  return 'Unknown';
};

const outDir = p('public', 'sfx', pack!);
mkdirSync(outDir, {recursive: true});
const files = readdirSync(src).filter((f) => AUDIO.test(f) && !skip.some((s) => f.includes(s))).sort();
const manifest: Record<string, {file: string; seconds: number; original: string; source: string; licence: string}> = {};

for (const f of files) {
  const key = slug(f);
  const input = path.join(src, f);
  const tags = run('ffprobe', ['-v', 'error', '-show_entries', 'format_tags', '-of', 'default=nw=1', input], {quiet: true});
  const trimmed = path.join(outDir, `${key}.tmp.wav`);
  run(ffmpegBin(), ['-v', 'error', '-y', '-i', input, '-af', 'silenceremove=start_periods=1:start_threshold=-50dB:start_silence=0.005', '-ar', '48000', '-c:a', 'pcm_s16le', trimmed]);
  const peak = Number(run(ffmpegBin(), ['-hide_banner', '-i', trimmed, '-af', 'volumedetect', '-f', 'null', '-'], {quiet: true}).match(/max_volume: (-?[\d.]+) dB/)?.[1] ?? 0);
  const out = path.join(outDir, `${key}.wav`);
  run(ffmpegBin(), ['-v', 'error', '-y', '-i', trimmed, '-af', `volume=${(-3 - peak).toFixed(2)}dB`, '-c:a', 'pcm_s16le', out]);
  run(process.platform === 'win32' ? 'cmd' : 'rm', process.platform === 'win32' ? ['/c', 'del', trimmed] : [trimmed]);
  manifest[key] = {file: `sfx/${pack}/${key}.wav`, seconds: +probeDuration(out).toFixed(3), original: f, source: sourceOf(f, tags), licence: licence!};
  console.log(`✔ ${key.padEnd(58)} ${manifest[key].seconds.toFixed(2)} s  ${manifest[key].source}`);
}
writeFileSync(path.join(outDir, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
console.log(`\n✔ ${files.length} sounds → public/sfx/${pack}/ (manifest.json)`);
