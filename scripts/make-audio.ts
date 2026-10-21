/**
 * npm run audio
 * Generates Cryptonite's original sound effects into public/sfx/ with ffmpeg (no third-party samples, no licences needed).
 */
import {mkdirSync} from 'node:fs';
import {ffmpegBin, p, run} from './lib';

const sounds: Record<string, string> = {
  // Low thump for the hook and thesis frames.
  hit: "aevalsrc='0.9*sin(2*PI*(52+38*exp(-t*18))*t)*exp(-t*5)':s=48000:d=0.9",
  // Short click when a label or marker lands.
  tick: "aevalsrc='0.45*sin(2*PI*1750*t)*exp(-t*55)+0.2*sin(2*PI*3500*t)*exp(-t*80)':s=48000:d=0.15",
  // Air movement under camera moves.
  whoosh: 'anoisesrc=d=0.7:c=pink:a=0.5:r=48000,bandpass=f=1100:w=1500,afade=t=in:d=0.35,afade=t=out:st=0.35:d=0.35',
  // Soft bell when a key level line draws.
  ping: "aevalsrc='0.3*sin(2*PI*880*t)*exp(-t*5)+0.18*sin(2*PI*1320*t)*exp(-t*7)+0.1*sin(2*PI*1760*t)*exp(-t*9)':s=48000:d=1.4",
};

mkdirSync(p('public', 'sfx'), {recursive: true});
for (const [name, src] of Object.entries(sounds)) {
  run(ffmpegBin(), ['-v', 'error', '-y', '-f', 'lavfi', '-i', src, '-ac', '1', '-c:a', 'pcm_s16le', p('public', 'sfx', `${name}.wav`)]);
  console.log(`✔ public/sfx/${name}.wav`);
}
