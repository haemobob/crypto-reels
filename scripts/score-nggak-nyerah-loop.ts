/**
 * Sound for the wordless loop nggak-nyerah-loop: an original synthesized track (no samples) plus the court's foley,
 * each placed on the frame the picture shows it (src/episodes/nggak-nyerah-loop/schedule.ts):
 * dribbles, releases, rim hits, the ball on the floor, the swish of the one shot that goes in.
 * There is no narration, so nothing is ducked; the render normalises the mix to −14 LUFS.
 *
 *   npx tsx scripts/score-nggak-nyerah-loop.ts
 */
import {mkdirSync, rmSync} from 'node:fs';
import path from 'node:path';
import {FPS, LANES, SCENE_FRAMES, events, makeFrame} from '../src/episodes/nggak-nyerah-loop/schedule';
import {ffmpegBin, p, run} from './lib';
import {SR, atLufs, fades, harm, noise, synth} from './score-lib';

const id = 'nggak-nyerah-loop';
const outDir = p('public', 'episodes', id);
const tmp = p('episodes', id, 'voice-cache', 'score-tmp');
rmSync(tmp, {recursive: true, force: true});
mkdirSync(tmp, {recursive: true});
mkdirSync(outDir, {recursive: true});

const total = SCENE_FRAMES / FPS + 2; // scene + branded outro
const make = (makeFrame(LANES[2]) ?? 0) / FPS;
const BEAT = 0.6; // 100 BPM
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

// --- Music: Am – F – C – G under the trying, a bright C add9 lift on the shot that goes in.
const pad = (notes: number[], amp: number) => {
  const side = (d: number) => notes.map((f, k) => harm(f + d, [amp / (k + 1) ** 0.3, amp * 0.35, amp * 0.15])).join('+');
  return `(${side(0)})*(0.85+0.15*sin(2*PI*0.25*t))|(${side(0.4)})*(0.85+0.15*sin(2*PI*0.25*t))`;
};
const chords: Array<[number[], string]> = [
  [[110, 130.81, 164.81], 'am'],
  [[87.31, 130.81, 174.61], 'f'],
  [[130.81, 164.81, 196], 'c'],
  [[98, 123.47, 146.83], 'g'],
  [[110, 130.81, 164.81], 'am2'],
];
const bar = BEAT * 4;
chords.forEach(([notes, name], k) => {
  const at = k * bar;
  if (at >= make) return;
  const dur = Math.min(bar + 0.3, make - at + 0.3);
  music(name, at, dur, pad(notes, 0.05), -29, 'lowpass=f=2200', 0.15, 0.3);
});
// The ending: the groove runs to the end of the court (sceneEnd), then one final hit as the logo appears, and a
// closing chord that rings out under the outro on its own decay (no long fade, no cut).
const sceneEnd = SCENE_FRAMES / FPS;
music('lift', make, sceneEnd + 0.4 - make, pad([130.81, 196, 261.63, 293.66, 329.63], 0.05), -26, 'aecho=0.8:0.6:160|240:0.25|0.18,lowpass=f=3600', 0.05, 0.5);
// Beat: a soft kick on each beat and a hat on the off-beats, until the court ends.
const kick = `sin(2*PI*(52+90*exp(-mod(t,${BEAT})*28))*mod(t,${BEAT}))*exp(-mod(t,${BEAT})*10)*0.9`;
music('kick', 0, sceneEnd, `${kick}|${kick}`, -29, 'lowpass=f=400', 0.8, 0.12);
const hat = `(random(0)*2-1)*exp(-mod(t+${BEAT / 2},${BEAT})*55)*0.5`;
music('hat', bar, sceneEnd - 0.3 - bar, `${hat}|${hat}`, -36, 'highpass=f=6500', 0.6, 0.3);
{
  // Final hit: a low boom and a C add9 chord struck once, decaying naturally across the 2 s outro.
  const notes = [65.41, 130.81, 196, 261.63, 329.63, 392];
  const chord = (d: number) => notes.map((f, k) => harm(f + d, [0.06 / (k + 1) ** 0.25, 0.022, 0.01])).join('+');
  const boom = `0.5*sin(2*PI*55*t)*exp(-t*3.2)+0.25*sin(2*PI*110*t)*exp(-t*4)`;
  const expr = `(${chord(0)})*exp(-t*1.35)+${boom}|(${chord(0.5)})*exp(-t*1.35)+${boom}`;
  music('final', sceneEnd, total - sceneEnd, expr, -23, 'aecho=0.8:0.55:210|330:0.3|0.2,lowpass=f=4200', 0.004, 0.25);
}
// A crash on the make.
{
  const f = path.join(tmp, 'crash.wav');
  noise(f, 2.2, 'white', `highpass=f=3000,afade=t=out:st=0:d=2.2`);
  layers.push({at: make, file: f, gain: atLufs(f, -27)});
}

// --- Foley, from the same schedule as the picture.
const dribble = shot('dribble', 0.25, `(0.9*sin(2*PI*85*t)*exp(-t*28)+0.5*sin(2*PI*170*t)*exp(-t*34)+0.3*sin(2*PI*255*t)*exp(-t*40))|(0.9*sin(2*PI*85*t)*exp(-t*28)+0.5*sin(2*PI*170*t)*exp(-t*34)+0.3*sin(2*PI*255*t)*exp(-t*40))`);
const rim = shot('rim', 0.7, `exp(-t*8)*(0.5*sin(2*PI*1180*t)+0.35*sin(2*PI*1730*t)+0.25*sin(2*PI*2660*t)+0.15*sin(2*PI*3410*t))|exp(-t*8)*(0.5*sin(2*PI*1183*t)+0.35*sin(2*PI*1733*t)+0.25*sin(2*PI*2663*t)+0.15*sin(2*PI*3413*t))`);
const release = shot('release', 0.14, `(random(0)*2-1)*exp(-t*30)*0.25|(random(0)*2-1)*exp(-t*30)*0.25`, 'bandpass=f=900:w=800');
const swish = path.join(tmp, 'swish.wav');
noise(swish, 0.4, 'white', 'bandpass=f=4200:w=3200,afade=t=in:d=0.04,afade=t=out:st=0.05:d=0.33');
const gains = {dribble: 0.55, floor: 0.38, rim: 0.32, release: 0.5, swish: 0.9};
const file = {dribble, floor: dribble, rim, release, swish};
// The lower lanes are a touch quieter, as if further from the listener; the winning lane is closest.
const laneGain = [0.8, 0.85, 1];
for (const e of events()) layers.push({at: e.t, file: file[e.kind], gain: gains[e.kind] * laneGain[e.lane]});

// --- Mix (no voice, nothing to duck), cut at the end of the outro with a short fade.
const inputs = layers.flatMap((l) => ['-i', l.file]);
const chains = layers.map((l, i) => `[${i}:a]aformat=sample_rates=${SR}:channel_layouts=stereo,volume=${l.gain.toFixed(4)},adelay=${Math.round(l.at * 1000)}|${Math.round(l.at * 1000)}[l${i}]`).join(';');
const mix = `${chains};${layers.map((_, i) => `[l${i}]`).join('')}amix=inputs=${layers.length}:normalize=0,alimiter=limit=0.8,atrim=0:${total.toFixed(3)},afade=t=out:st=${(total - 0.25).toFixed(3)}:d=0.25[out]`;
const out = path.join(outDir, 'score.mp3');
run(ffmpegBin(), ['-v', 'error', '-y', ...inputs, '-filter_complex', mix, '-map', '[out]', '-ar', String(SR), '-c:a', 'libmp3lame', '-b:a', '320k', out]);
console.log(`✔ score.mp3 (${layers.length} layers: music + ${events().length} foley events, make at ${make.toFixed(2)} s, ${total.toFixed(1)} s) in public/episodes/${id}`);
