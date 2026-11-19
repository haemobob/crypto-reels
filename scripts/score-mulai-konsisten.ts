/**
 * Sound for the wordless Reel mulai-konsisten: an original synthesized track (no samples) plus foley placed on the
 * frames the picture shows them (src/episodes/mulai-konsisten/schedule.ts): a clack for every brick laid (the
 * builder's and the waiter's), a tick for the level, footsteps on the wall, a soft drop as he climbs down.
 * No narration, so nothing is ducked; the render normalises the mix to −14 LUFS.
 *
 *   npx tsx scripts/score-mulai-konsisten.ts
 */
import {mkdirSync, rmSync} from 'node:fs';
import path from 'node:path';
import {FPS, LAST, SCENE_FRAMES, events} from '../src/episodes/mulai-konsisten/schedule';
import {ffmpegBin, p, run} from './lib';
import {SR, atLufs, fades, harm, noise, synth} from './score-lib';

const id = 'mulai-konsisten';
const outDir = p('public', 'episodes', id);
const tmp = p('episodes', id, 'voice-cache', 'score-tmp');
rmSync(tmp, {recursive: true, force: true});
mkdirSync(tmp, {recursive: true});
mkdirSync(outDir, {recursive: true});

const total = SCENE_FRAMES / FPS + 2; // scene + branded outro
const sceneEnd = SCENE_FRAMES / FPS;
const done = LAST / FPS;
const BEAT = 0.6; // 100 BPM
const bar = BEAT * 4;
const layers: Array<{at: number; file: string; gain: number}> = [];
const music = (name: string, at: number, dur: number, expr: string, lufs: number, filters = '', fin = 0.4, fout = 0.6) => {
  const f = path.join(tmp, `${name}.wav`);
  synth(f, dur, expr, [filters, fades(dur, fin, fout)].filter(Boolean).join(','));
  layers.push({at, file: f, gain: atLufs(f, lufs)});
};
const shot = (name: string, dur: number, expr: string, filters = '') => {
  const f = path.join(tmp, `${name}.wav`);
  synth(f, dur, expr, filters);
  return f;
};
const pad = (notes: number[], amp: number) => {
  const side = (d: number) => notes.map((f, k) => harm(f + d, [amp / (k + 1) ** 0.3, amp * 0.35, amp * 0.15])).join('+');
  return `(${side(0)})*(0.85+0.15*sin(2*PI*0.25*t))|(${side(0.4)})*(0.85+0.15*sin(2*PI*0.25*t))`;
};

// --- Music: a patient, building progression (Am – F – C – G) while the wall goes up, a lift when it is done.
const chords: number[][] = [[110, 130.81, 164.81], [87.31, 130.81, 174.61], [130.81, 164.81, 196], [98, 123.47, 146.83]];
for (let k = 0; k * bar < done; k++) {
  const at = k * bar;
  music(`c${k}`, at, Math.min(bar + 0.3, done - at + 0.3), pad(chords[k % 4], 0.05), -30, 'lowpass=f=2200', 0.15, 0.3);
}
music('lift', done, sceneEnd + 0.4 - done, pad([130.81, 196, 261.63, 293.66, 329.63], 0.05), -27, 'aecho=0.8:0.6:160|240:0.25|0.18,lowpass=f=3600', 0.1, 0.5);
const kick = `sin(2*PI*(52+90*exp(-mod(t,${BEAT})*28))*mod(t,${BEAT}))*exp(-mod(t,${BEAT})*10)*0.9`;
music('kick', bar, done - bar, `${kick}|${kick}`, -31, 'lowpass=f=400', 0.6, 0.3);
{
  // Final hit: a low boom and a C add9 struck once, decaying across the 2 s outro.
  const notes = [65.41, 130.81, 196, 261.63, 329.63, 392];
  const chord = (d: number) => notes.map((f, k) => harm(f + d, [0.06 / (k + 1) ** 0.25, 0.022, 0.01])).join('+');
  const boom = `0.5*sin(2*PI*55*t)*exp(-t*3.2)+0.25*sin(2*PI*110*t)*exp(-t*4)`;
  music('final', sceneEnd, total - sceneEnd, `(${chord(0)})*exp(-t*1.35)+${boom}|(${chord(0.5)})*exp(-t*1.35)+${boom}`, -23, 'aecho=0.8:0.55:210|330:0.3|0.2,lowpass=f=4200', 0.004, 0.25);
}

// --- Foley from the same schedule as the picture.
const clack = shot('clack', 0.16, `(0.6*sin(2*PI*620*t)*exp(-t*55)+0.5*sin(2*PI*140*t)*exp(-t*30)+0.25*(random(0)*2-1)*exp(-t*90))|(0.6*sin(2*PI*624*t)*exp(-t*55)+0.5*sin(2*PI*140*t)*exp(-t*30)+0.25*(random(0)*2-1)*exp(-t*90))`);
const tick = shot('tick', 0.08, `0.4*sin(2*PI*2400*t)*exp(-t*90)|0.4*sin(2*PI*2404*t)*exp(-t*90)`);
const step = shot('step', 0.18, `(0.7*sin(2*PI*90*t)*exp(-t*26))|(0.7*sin(2*PI*90*t)*exp(-t*26))`);
const drop = path.join(tmp, 'drop.wav');
noise(drop, 0.35, 'brown', 'lowpass=f=500,afade=t=out:st=0.02:d=0.3');
const file = {brick: clack, level: tick, step, drop};
const gains = {brick: 0.3, level: 0.26, step: 0.42, drop: 0.6};
for (const e of events()) layers.push({at: e.t, file: file[e.kind], gain: gains[e.kind]});

// --- Mix (no voice), cut at the end of the outro with a short fade.
const inputs = layers.flatMap((l) => ['-i', l.file]);
const chains = layers.map((l, i) => `[${i}:a]aformat=sample_rates=${SR}:channel_layouts=stereo,volume=${l.gain.toFixed(4)},adelay=${Math.round(l.at * 1000)}|${Math.round(l.at * 1000)}[l${i}]`).join(';');
const mix = `${chains};${layers.map((_, i) => `[l${i}]`).join('')}amix=inputs=${layers.length}:normalize=0,acompressor=threshold=-20dB:ratio=3:attack=2:release=60,alimiter=limit=0.7,atrim=0:${total.toFixed(3)},afade=t=out:st=${(total - 0.25).toFixed(3)}:d=0.25[out]`;
const out = path.join(outDir, 'score.mp3');
run(ffmpegBin(), ['-v', 'error', '-y', ...inputs, '-filter_complex', mix, '-map', '[out]', '-ar', String(SR), '-c:a', 'libmp3lame', '-b:a', '320k', out]);
console.log(`✔ score.mp3 (${layers.length} layers: music + ${events().length} foley events, wall done at ${done.toFixed(2)} s, ${total.toFixed(1)} s) in public/episodes/${id}`);
