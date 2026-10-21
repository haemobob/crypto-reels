/**
 * npm run still -- <id> --sec 3.5            one frame
 * npm run still -- <id> --sheet               contact sheet: one frame per second
 * npm run still -- <id> --frames 0,45,120     several chosen frames, bundled once, tiled into one labelled sheet
 * Writes PNGs to output/<id>-review/.
 */
import {existsSync, mkdirSync, readdirSync, rmSync, writeFileSync} from 'node:fs';
import path from 'node:path';
import {ffmpegBin, flag, p, remotion, requireEpisodeId, run} from './lib';

const id = requireEpisodeId();
const out = p('output', `${id}-review`);
mkdirSync(out, {recursive: true});
const entry = p('src', 'index.ts');
const sec = flag('sec');

const frameList = flag('frames');

if (frameList) {
  const {bundle} = await import('@remotion/bundler');
  const {renderStill, selectComposition} = await import('@remotion/renderer');
  const serveUrl = await bundle({entryPoint: entry});
  const browserExecutable = process.env.REMOTION_BROWSER ?? null;
  const composition = await selectComposition({serveUrl, id, inputProps: {episodeId: id}, browserExecutable});
  const frames = frameList.split(',').map(Number).filter((n) => n >= 0 && n < composition.durationInFrames);
  const files: string[] = [];
  for (const frame of frames) {
    const file = path.join(out, `${id}-${String(frame).padStart(5, '0')}.png`);
    await renderStill({serveUrl, composition, frame, output: file, inputProps: {episodeId: id}, browserExecutable});
    files.push(file);
  }
  const cols = Math.min(5, files.length);
  const rows = Math.ceil(files.length / cols);
  const sheet = path.join(out, `${id}-frames.jpg`);
  const inputs = files.flatMap((f) => ['-i', f]);
  const labelled = files.map((_, i) => `[${i}:v]scale=360:-1,drawtext=text='f${frames[i]} ${(frames[i] / 30).toFixed(1)}s':x=8:y=8:fontsize=22:fontcolor=yellow:box=1:boxcolor=black@0.6[v${i}]`);
  const pads = Array.from({length: cols * rows - files.length}, (_, i) => `color=c=0x222222:s=360x640:d=1[p${i}]`);
  const all = [...files.map((_, i) => `[v${i}]`), ...pads.map((_, i) => `[p${i}]`)].join('');
  const filter = [...labelled, ...pads, `${all}xstack=inputs=${cols * rows}:layout=${Array.from({length: cols * rows}, (_, i) => `${(i % cols) * 360}_${Math.floor(i / cols) * 640}`).join('|')}[out]`].join(';');
  run(ffmpegBin(), ['-v', 'error', '-y', ...inputs, '-filter_complex', filter, '-map', '[out]', '-frames:v', '1', sheet]);
  console.log(`✔ ${path.relative(p(), sheet)} (${files.length} frames)`);
} else if (sec !== undefined) {
  const frame = Math.round(Number(sec) * 30);
  const file = path.join(out, `${id}-${String(frame).padStart(5, '0')}.png`);
  remotion(['still', entry, id, file, '--frame', String(frame), '--log', 'error']);
  console.log(`✔ ${path.relative(p(), file)}`);
} else if (process.argv.includes('--sheet')) {
  const frames = path.join(out, 'sheet-frames');
  if (existsSync(frames)) rmSync(frames, {recursive: true});
  mkdirSync(frames, {recursive: true});
  // Every 30th frame as an image sequence, then tiled. A concat list (not a glob) keeps it working on Windows.
  remotion(['render', entry, id, frames, '--sequence', '--every-nth-frame', '30', '--image-format', 'jpeg', '--log', 'error']);
  const files = readdirSync(frames).filter((f) => f.endsWith('.jpeg')).sort();
  const list = path.join(out, 'sheet-frames.txt');
  writeFileSync(list, files.map((f) => `file '${path.join(frames, f).replaceAll('\\', '/')}'`).join('\n'));
  const count = files.length;
  const cols = 6;
  const rows = Math.ceil(count / cols);
  const sheet = path.join(out, `${id}-contact-sheet.jpg`);
  run(ffmpegBin(), ['-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', list, '-vf', `scale=270:-1,tile=${cols}x${rows}:padding=6:color=0x222222`, '-frames:v', '1', sheet]);
  console.log(`✔ ${path.relative(p(), sheet)} (${count} frames, one per second)`);
} else {
  console.log('Pass --sec <seconds> or --sheet');
}
