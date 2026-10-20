/**
 * npm run validate -- <id>
 * Checks the narration against the episode window, and the rendered MP4 (if present) with ffprobe:
 * 1080x1920, 30 fps, H.264 + AAC, duration within the window plus outro.
 */
import {existsSync, readFileSync} from 'node:fs';
import path from 'node:path';
import type {Captions, EpisodeConfig} from '../src/lib/types';
import {brand} from '../src/theme/brand';
import {episodeDir, ffprobeBin, p, readJson, requireEpisodeId, run} from './lib';

export const validate = (id: string) => {
  const problems: string[] = [];
  const episode = readJson<EpisodeConfig>(path.join(episodeDir(id), 'episode.json'));
  const captions = readJson<Captions>(path.join(episodeDir(id), 'captions.json'));
  const minS = episode.minSeconds ?? 0;
  const maxS = episode.maxSeconds ?? 30;
  if (captions.words.length === 0) problems.push('No voice yet: run npm run voice');
  if (captions.durationSec < minS || captions.durationSec > maxS)
    problems.push(`Narration ${captions.durationSec.toFixed(1)} s is outside ${minS}–${maxS} s`);

  const mp4 = p('output', `${id}.mp4`);
  if (existsSync(mp4)) {
    const info = JSON.parse(run(ffprobeBin(), ['-v', 'error', '-show_streams', '-show_format', '-of', 'json', mp4], {quiet: true})) as {
      streams: Array<{codec_type: string; codec_name: string; width?: number; height?: number; r_frame_rate?: string}>;
      format: {duration: string};
    };
    const v = info.streams.find((s) => s.codec_type === 'video');
    const a = info.streams.find((s) => s.codec_type === 'audio');
    if (!v) problems.push('MP4 has no video stream');
    else {
      if (v.width !== 1080 || v.height !== 1920) problems.push(`MP4 is ${v.width}x${v.height}, expected 1080x1920`);
      if (v.r_frame_rate !== '30/1') problems.push(`MP4 frame rate ${v.r_frame_rate}, expected 30/1`);
      if (v.codec_name !== 'h264') problems.push(`MP4 video codec ${v.codec_name}, expected h264`);
    }
    if (!a) problems.push('MP4 has no audio stream');
    else if (a.codec_name !== 'aac') problems.push(`MP4 audio codec ${a.codec_name}, expected aac`);
    const dur = Number(info.format.duration);
    const extra = (episode.tailSeconds ?? 0.6) + (episode.outro === false ? 0 : brand.outroSeconds) + 0.2;
    if (dur < minS || dur > maxS + extra) problems.push(`MP4 is ${dur.toFixed(2)} s, outside ${minS}–${(maxS + extra).toFixed(1)} s`);
  }
  return {problems, checkedMp4: existsSync(mp4)};
};

if (process.argv[1]?.endsWith('validate.ts')) {
  const id = requireEpisodeId();
  const {problems, checkedMp4} = validate(id);
  if (problems.length) {
    console.error(problems.map((x) => `✖ ${x}`).join('\n'));
    process.exit(1);
  }
  console.log(`✔ ${id}: narration within window${checkedMp4 ? '; output MP4 is 1080x1920, 30 fps, H.264 + AAC, length OK' : ' (no MP4 rendered yet)'}`);
}
