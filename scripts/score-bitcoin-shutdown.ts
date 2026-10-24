/**
 * Original synthesized score and sound effects for bitcoin-shutdown (no third-party audio).
 *
 *   npx tsx scripts/score-bitcoin-shutdown.ts
 *
 * Reads the narration cues from episodes/bitcoin-shutdown/captions.json, so the score re-times itself
 * if the voice changes. The score is ducked under the narration (sidechain), so music stays below speech.
 * Writes public/episodes/bitcoin-shutdown/score.mp3 and sfx/*.wav.
 *
 * Every tone carries harmonics up to a few hundred hertz: phone speakers can't reproduce a bare 55 Hz sine,
 * but they do reproduce its overtones, and the ear hears the low note from them.
 */
import {mkdirSync} from 'node:fs';
import path from 'node:path';
import {ffmpegBin, p, run} from './lib';
import {createScore, fades, harm, n, noise, SR, swell, synth} from './score-lib';

const score = createScore('bitcoin-shutdown');
const c = score.cues;
const {lastWordEnd, outDir, layer} = score;
const sfxDir = path.join(outDir, 'sfx');
mkdirSync(sfxDir, {recursive: true});

// 1. Threat drone, opening → the question: A1 with overtones, a beating detuned partner, slowly breathing.
const droneDur = c.question - 0.15;
const breathe = (r: number) => `(0.75+0.25*sin(2*PI*${r}*t))`;
const DRONE = [0.22, 0.2, 0.15, 0.12, 0.08, 0.06, 0.04, 0.03];
layer(
  'drone',
  0,
  droneDur,
  `(${harm(55, DRONE)})*${breathe(0.11)}+(${harm(55.37, DRONE.slice(0, 4))})*0.6|(${harm(55.12, DRONE)})*${breathe(0.09)}+(${harm(54.88, DRONE.slice(0, 4))})*0.6`,
  -25,
  'lowpass=f=1400',
  1.2,
  1.6,
);
// 2. Government warning: a low pulse (72 BPM) that builds, under the document and the 72 JAM monument.
{
  const d = c.imagine - c.uk;
  const u = 'mod(t,0.8333)';
  // A thump: a fast pitch drop 150 → 50 Hz, with its overtones so a phone can hear it.
  const ph = `(50*${u}+5*(1-exp(-20*${u})))`;
  const thump = `(sin(2*PI*${ph})+0.6*sin(4*PI*${ph})+0.35*sin(6*PI*${ph})+0.2*sin(8*PI*${ph}))*exp(-7*${u})`;
  layer('pulse', c.uk, d, `0.5*${thump}*${swell(d, 0.35)}|0.5*${thump}*${swell(d, 0.35)}`, -29, 'lowpass=f=900', 0.6, 1.2);
}
// 3. Server hum under the cyber-attack beat (php → payments): mains hum and its overtones.
{
  const d = c.pos - c.php;
  layer('hum', c.php, d, `${harm(120, [0.22, 0.12, 0.07, 0.05, 0.03])}|${harm(120.2, [0.22, 0.12, 0.07, 0.05, 0.03])}`, -30, 'lowpass=f=1200', 0.8, 0.5);
}
// 4. Tension under the outage simulation: a minor second rubbing above the drone, growing.
{
  const d = c.question - c.imagine - 0.2;
  layer('tension', c.imagine, d, `(${harm(116.54, [0.14, 0.07, 0.04])}+${harm(123.47, [0.11, 0.06, 0.03])})*${swell(d, 0.3)}|(${harm(116.9, [0.14, 0.07, 0.04])}+${harm(123.1, [0.11, 0.06, 0.03])})*${swell(d, 0.3)}`, -28, 'lowpass=f=1100', 1.2, 0.5);
}
// 5. The question: the music drops out, one low sustained tone remains (E2 and overtones).
{
  const d = c.nocenter - c.question - 0.3;
  const trem = '(0.8+0.2*sin(2*PI*0.5*t))';
  layer('lowtone', c.question + 0.45, d, `(${harm(82.41, [0.24, 0.16, 0.1, 0.07, 0.04, 0.03])})*${trem}|(${harm(82.5, [0.24, 0.16, 0.1, 0.07, 0.04, 0.03])})*${trem}`, -26, 'lowpass=f=900', 0.8, 0.4);
}
// 6. The network: precise transaction pulses (120 BPM eighths, accent each bar) moving across the stereo field, over a thin pad.
const netEnd = c.wait - 0.55; // sudden silence before "Tapi tunggu..."
const netDur = netEnd - c.nocenter - 0.2;
{
  const blip = (f: number, phase = 0) => `0.22*sin(2*PI*${f}*t)*exp(-mod(t+${phase},0.25)*38)+0.14*sin(2*PI*${f * 1.5}*t)*exp(-mod(t+${phase},1)*20)`;
  const pan = '(0.5+0.35*sin(2*PI*0.13*t))';
  layer('pulses', c.nocenter + 0.2, netDur, `(${blip(880)})*${pan}*1.4|(${blip(880.6, 0.002)})*(1-${pan})*1.4`, -28, 'highpass=f=300', 1.0, 0.12);
  layer('netpad', c.nocenter + 0.2, netDur, `${harm(220, [0.1, 0.03])}+${harm(246.94, [0.06, 0.02])}+${harm(329.63, [0.06, 0.02])}|${harm(220.4, [0.1, 0.03])}+${harm(247.3, [0.06, 0.02])}+${harm(330.1, [0.06, 0.02])}`, -31, 'lowpass=f=1500', 1.5, 0.12);
}
// 6b. Escalation as connections fail: a slowly rising, beating tone with overtones.
{
  const d = netEnd - c.local;
  const sweep = (f0: number, rise: number) => `(${f0}*t+${rise / 2}*t*t/${n(d)})`;
  const tone = (f0: number, rise: number, a: number) => `${a}*(sin(2*PI*${sweep(f0, rise)})+0.5*sin(4*PI*${sweep(f0, rise)})+0.25*sin(6*PI*${sweep(f0, rise)}))`;
  layer('escalate', c.local, d, `(${tone(98, 18, 0.16)}+${tone(103.5, 22, 0.12)})*${swell(d, 0.4)}|(${tone(98.3, 18, 0.16)}+${tone(103.9, 22, 0.12)})*${swell(d, 0.4)}`, -27, 'lowpass=f=900', 1.5, 0.12);
}
// 7. Revelation: after the silence, a warm D major (add9) swell with a shimmer, through the satellite section.
{
  const d = c.exchange - c.reveal + 0.6;
  const shimmer = (r: number) => `0.025*sin(2*PI*1174.7*t)*(0.5+0.5*sin(2*PI*${r}*t))`;
  layer('reveal', c.reveal - 0.05, d, `${harm(146.83, [0.12, 0.04])}+${harm(185, [0.1, 0.03])}+${harm(220, [0.09, 0.03])}+0.06*sin(2*PI*329.63*t)+${shimmer(0.3)}|${harm(147.1, [0.12, 0.04])}+${harm(185.4, [0.1, 0.03])}+${harm(220.4, [0.09, 0.03])}+0.06*sin(2*PI*330.1*t)+${shimmer(0.27)}`, -24, 'aecho=0.8:0.6:180|260:0.25|0.2,lowpass=f=4000', 0.35, 1.2);
}
// 8. Ending: dark restrained ambience (A minor third) and a slow heartbeat that fades; cut to silence after the last word.
const endAt = lastWordEnd + 0.08;
{
  const d = endAt - c.exchange;
  layer('enddrone', c.exchange, d, `${harm(55, [0.16, 0.14, 0.1, 0.08, 0.05, 0.035])}+${harm(65.41, [0.11, 0.09, 0.06, 0.04])}|${harm(55.2, [0.16, 0.14, 0.1, 0.08, 0.05, 0.035])}+${harm(65.7, [0.11, 0.09, 0.06, 0.04])}`, -27, 'lowpass=f=1000', 1.0, 0.06);
}
{
  const d = endAt - c.sum;
  const thump = (u: string) => [1, 0.6, 0.35, 0.2].map((a, k) => `${a}*sin(${2 * (k + 1)}*PI*(52*${u}+4*(1-exp(-25*${u}))))`).join('+');
  const lub = `0.9*(${thump('mod(t,1.4)')})*exp(-mod(t,1.4)*13)`;
  const dub = `0.55*(${thump('mod(t-0.26,1.4)')})*exp(-mod(t-0.26,1.4)*15)*gte(mod(t,1.4),0.26)`;
  const fall = `(1-0.7*t/${n(d)})`;
  layer('heartbeat', c.sum, d, `(${lub}+${dub})*${fall}|(${lub}+${dub})*${fall}`, -27, 'lowpass=f=800', 0.3, 0.06);
}
// Air under the opening (filtered noise), the "dark environment".
{
  const f = path.join(score.tmp, 'air.wav');
  noise(f, c.question, 'pink', `bandpass=f=320:width_type=o:w=1.2,${fades(c.question, 2, 1)}`);
  score.addFile(f, 0, -42);
}

// Mix, duck under the narration (sidechain), trim at the cut to silence, encode.
score.write(endAt);

// ---- Sound effects ----
const sfx = (name: string, seconds: number, expr: string, filters = '') => synth(path.join(sfxDir, `${name}.wav`), seconds, expr, filters);
// Network disconnect: a falling blip (900 Hz decaying towards 150 Hz).
sfx('disconnect', 0.45, `0.6*sin(2*PI*(900/4)*(1-exp(-4*t)))*exp(-t*6)|0.6*sin(2*PI*(905/4)*(1-exp(-4*t)))*exp(-t*6)`);
// Electrical crackle: gated noise bursts.
run(ffmpegBin(), ['-v', 'error', '-y', '-f', 'lavfi', '-i', `anoisesrc=c=white:r=${SR}:d=0.7:a=0.8:seed=11`, '-af', `volume='if(lt(mod(t,0.07),0.018),1,0.05)':eval=frame,highpass=f=1500,afade=t=out:st=0.3:d=0.4,aformat=channel_layouts=stereo`, '-c:a', 'pcm_s16le', path.join(sfxDir, 'crackle.wav')]);
// Failed payment: two short low square-ish beeps.
sfx('fail-beep', 0.6, `0.5*sgn(sin(2*PI*440*t))*lt(t,0.14)+0.5*sgn(sin(2*PI*330*t))*gte(t,0.22)*lt(t,0.42)|0.5*sgn(sin(2*PI*440*t))*lt(t,0.14)+0.5*sgn(sin(2*PI*330*t))*gte(t,0.22)*lt(t,0.42)`, 'lowpass=f=2400,volume=0.6');
// ATM notification: three descending soft tones.
const chime = `0.4*sin(2*PI*988*t)*lt(t,0.2)*exp(-t*4)+0.4*sin(2*PI*784*t)*gte(t,0.22)*lt(t,0.44)*exp(-(t-0.22)*4)+0.4*sin(2*PI*659*t)*gte(t,0.46)*exp(-(t-0.46)*4)`;
sfx('atm-chime', 0.9, `${chime}|${chime}`, 'afade=t=out:st=0.8:d=0.1');
// App error: a short low buzz.
sfx('app-error', 0.3, `0.5*sin(2*PI*180*t)*sin(2*PI*30*t)*exp(-t*8)|0.5*sin(2*PI*181*t)*sin(2*PI*30*t)*exp(-t*8)`);
// Transaction hop: a precise digital ping.
sfx('hop', 0.35, `0.5*sin(2*PI*1760*t)*exp(-t*18)+0.25*sin(2*PI*2640*t)*exp(-t*24)|0.5*sin(2*PI*1762*t)*exp(-t*18)+0.25*sin(2*PI*2643*t)*exp(-t*24)`);
console.log(`✔ score.mp3 (${score.layers.length} layers, ducked under the voice, cut at ${endAt.toFixed(2)} s) and sfx/ in ${path.relative(p(), outDir)}`);
