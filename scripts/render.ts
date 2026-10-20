/**
 * npm run render -- <id>
 * Renders output/<id>.mp4 (H.264 + AAC), normalises loudness to -14 LUFS with true peak under -1 dBTP, then validates it.
 * Warns, but still renders, while the audits in qa-report.md are not both PASS.
 */
import {renameSync, rmSync} from 'node:fs';
import {auditStatus} from './audit';
import {ffmpegBin, p, remotion, requireEpisodeId, run} from './lib';
import {validate} from './validate';

const id = requireEpisodeId();
const audit = auditStatus(id);
if (audit.retention !== 'PASS' || audit.visual !== 'PASS')
  console.warn(`⚠ Audits not passed (retention: ${audit.retention}, visual: ${audit.visual}). This render is not final.`);

const raw = p('output', `${id}.raw.mp4`);
const final = p('output', `${id}.mp4`);
remotion(['render', p('src', 'index.ts'), id, raw, '--codec', 'h264', '--audio-codec', 'aac', '--log', 'error']);

// Two-pass loudnorm: measure, then apply with the measured values (video stream copied untouched).
// TP aims at -1.5 because AAC encoding adds a few tenths of overshoot; the result lands under -1 dBTP.
const target = 'I=-14:TP=-1.5:LRA=11';
const measure = run(ffmpegBin(), ['-hide_banner', '-i', raw, '-af', `loudnorm=${target}:print_format=json`, '-f', 'null', '-'], {quiet: true});
const json = measure.match(/\{[^{}]*"input_i"[^{}]*\}/);
if (!json) throw new Error('Could not read loudnorm measurements from ffmpeg');
const stats = JSON.parse(json[0]) as Record<string, string>;
const filter = `loudnorm=${target}:measured_I=${stats.input_i}:measured_TP=${stats.input_tp}:measured_LRA=${stats.input_lra}:measured_thresh=${stats.input_thresh}:offset=${stats.target_offset}:linear=true`;
const tmp = p('output', `${id}.norm.mp4`);
run(ffmpegBin(), ['-v', 'error', '-y', '-i', raw, '-c:v', 'copy', '-af', filter, '-ar', '48000', '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', tmp]);
rmSync(raw);
renameSync(tmp, final);

const {problems} = validate(id);
if (problems.length) {
  console.error(problems.map((x) => `✖ ${x}`).join('\n'));
  process.exit(1);
}
console.log(`✔ output/${id}.mp4 rendered, normalised to -14 LUFS and validated`);
