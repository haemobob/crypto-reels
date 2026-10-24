/**
 * Shared helpers for an episode's synthesized score (no samples, no third-party audio).
 * A score is a set of layers rendered with ffmpeg's aevalsrc, each set to a target loudness, then mixed and
 * sidechain-ducked under the narration so music stays below speech. Layers are timed from captions.json cues,
 * so a score re-times itself when the voice changes.
 *
 * Every tone should carry harmonics up to a few hundred hertz: phone speakers can't reproduce a bare 55 Hz sine,
 * but they do reproduce its overtones, and the ear hears the low note from them.
 */
import {mkdirSync, readFileSync, rmSync} from 'node:fs';
import path from 'node:path';
import {ffmpegBin, p, run} from './lib';

export const SR = 48000;

/** Renders an aevalsrc expression (stereo "left|right") to a WAV, with optional extra filters. */
export const synth = (file: string, seconds: number, expr: string, filters = '') =>
  run(ffmpegBin(), ['-v', 'error', '-y', '-f', 'lavfi', '-i', `aevalsrc='${expr}':s=${SR}:d=${seconds.toFixed(3)}`, ...(filters ? ['-af', filters] : []), '-c:a', 'pcm_s16le', file]);
export const noise = (file: string, seconds: number, color: string, filters: string) =>
  run(ffmpegBin(), ['-v', 'error', '-y', '-f', 'lavfi', '-i', `anoisesrc=c=${color}:r=${SR}:d=${seconds.toFixed(3)}:a=0.5:seed=7`, '-af', `${filters},aformat=channel_layouts=stereo`, '-c:a', 'pcm_s16le', file]);
export const fades = (dur: number, fin: number, fout: number) => `afade=t=in:d=${fin.toFixed(3)},afade=t=out:st=${Math.max(0, dur - fout).toFixed(3)}:d=${fout.toFixed(3)}`;
export const n = (x: number) => x.toFixed(4);
/** A harmonic tone: amps[k] is the level of harmonic k+1 of f. */
export const harm = (f: number, amps: number[]) => amps.map((a, k) => `${a}*sin(2*PI*${n(f * (k + 1))}*t)`).join('+');
/** A slow crescendo over d seconds, from `floor` up to 1. */
export const swell = (d: number, floor: number) => `(${floor}+${1 - floor}*t/${n(d)})`;

const loudness = (file: string) => {
  const report = run(ffmpegBin(), ['-hide_banner', '-nostats', '-i', file, '-af', 'ebur128', '-f', 'null', '-'], {quiet: true});
  const all = [...report.matchAll(/I:\s+(-?[\d.]+) LUFS/g)];
  return Number(all[all.length - 1][1]);
};
/** Linear gain that brings a file to a target integrated loudness. */
export const atLufs = (file: string, lufs: number) => 10 ** ((lufs - loudness(file)) / 20);

type Captions = {durationSec: number; cues: Record<string, number>; words: Array<{text: string; start: number; end: number}>};

/** Starts a score for an episode: its cues, a scratch folder, and the layer list. */
export const createScore = (id: string) => {
  const captions = JSON.parse(readFileSync(p('episodes', id, 'captions.json'), 'utf8')) as Captions;
  const outDir = p('public', 'episodes', id);
  const tmp = p('episodes', id, 'voice-cache', 'score-tmp');
  rmSync(tmp, {recursive: true, force: true});
  mkdirSync(tmp, {recursive: true});
  // Each layer is measured and set to a target loudness (LUFS, before ducking), so the balance is explicit.
  const layers: Array<{at: number; file: string; gain: number}> = [];
  const layer = (name: string, at: number, dur: number, expr: string, lufs: number, filters = '', fin = Math.min(1.5, dur / 4), fout = Math.min(1.5, dur / 4)) => {
    const f = path.join(tmp, `${name}.wav`);
    synth(f, dur, expr, [filters, fades(dur, fin, fout)].filter(Boolean).join(','));
    layers.push({at, file: f, gain: atLufs(f, lufs)});
  };
  /** Adds an already rendered file (e.g. filtered noise) at a target loudness. */
  const addFile = (file: string, at: number, lufs: number) => layers.push({at, file, gain: atLufs(file, lufs)});
  /** Mixes the layers, ducks them under narration.wav, cuts at endAt and writes score.mp3. */
  const write = (endAt: number) => {
    const inputs = layers.flatMap((l) => ['-i', l.file]);
    const voiceIdx = layers.length;
    const chains = layers.map((l, i) => `[${i}:a]volume=${l.gain},adelay=${Math.round(l.at * 1000)}|${Math.round(l.at * 1000)}[l${i}]`).join(';');
    const mix = [
      chains,
      `${layers.map((_, i) => `[l${i}]`).join('')}amix=inputs=${layers.length}:normalize=0,volume=1[m]`,
      `[${voiceIdx}:a]aformat=sample_rates=${SR}:channel_layouts=stereo[v]`,
      `[m][v]sidechaincompress=threshold=0.025:ratio=6:attack=30:release=450:knee=4[d]`,
      `[d]alimiter=limit=0.7,atrim=0:${endAt.toFixed(3)},afade=t=out:st=${(endAt - 0.04).toFixed(3)}:d=0.04[out]`,
    ].join(';');
    const scoreFile = path.join(outDir, 'score.mp3');
    run(ffmpegBin(), ['-v', 'error', '-y', ...inputs, '-i', path.join(outDir, 'narration.wav'), '-filter_complex', mix, '-map', '[out]', '-ar', String(SR), '-c:a', 'libmp3lame', '-b:a', '320k', scoreFile]);
    return scoreFile;
  };
  return {cues: captions.cues, lastWordEnd: captions.words[captions.words.length - 1].end, outDir, tmp, layers, layer, addFile, write};
};
