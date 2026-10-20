/**
 * npm run still -- <id> --sec 3.5            one frame
 * npm run still -- <id> --sheet               contact sheet: one frame per second
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

if (sec !== undefined) {
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
