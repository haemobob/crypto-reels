/**
 * npm run cover -- <id>
 * Renders the episode's Reel cover (its `Cover` component, composition `cover-<id>`) to
 *   output/<id>-cover.png   1080×1920, for the Reel's cover upload
 *   output/<id>-cover.jpg   the same, JPEG (quality ≈ 95)
 *   output/<id>-cover-grid.jpg   the centre 3:4 crop (1080×1440): how the profile grid shows it
 */
import path from 'node:path';
import {ffmpegBin, p, requireEpisodeId, run} from './lib';

const id = requireEpisodeId();
const {bundle} = await import('@remotion/bundler');
const {renderStill, selectComposition} = await import('@remotion/renderer');
const serveUrl = await bundle({entryPoint: p('src', 'index.ts')});
const browserExecutable = process.env.REMOTION_BROWSER ?? null;
const composition = await selectComposition({serveUrl, id: `cover-${id}`, inputProps: {}, browserExecutable});
const png = p('output', `${id}-cover.png`);
await renderStill({serveUrl, composition, frame: 0, output: png, inputProps: {}, browserExecutable});
const jpg = p('output', `${id}-cover.jpg`);
run(ffmpegBin(), ['-v', 'error', '-y', '-i', png, '-q:v', '2', jpg]);
const grid = p('output', `${id}-cover-grid.jpg`);
run(ffmpegBin(), ['-v', 'error', '-y', '-i', png, '-vf', 'crop=1080:1440:0:240', '-q:v', '2', grid]);
console.log(`✔ ${path.relative(p(), png)}, ${path.relative(p(), jpg)} and ${path.relative(p(), grid)} (profile-grid crop)`);
