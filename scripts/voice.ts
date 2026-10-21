/**
 * npm run voice -- <id>
 * Synthesises episodes/<id>/narration.txt with the house voice, writes public/episodes/<id>/narration.wav,
 * then aligns every script word to the audio (whisper.cpp) and writes episodes/<id>/captions.json.
 */
import {createHash} from 'node:crypto';
import {existsSync, mkdirSync, readFileSync, writeFileSync} from 'node:fs';
import path from 'node:path';
import {downloadWhisperModel, installWhisperCpp, toCaptions, transcribe, type WhisperModel} from '@remotion/install-whisper-cpp';
import type {Captions, EpisodeConfig} from '../src/lib/types';
import {alignWords} from './align';
import {episodeDir, fail, ffmpegBin, p, probeDuration, publicEpisodeDir, readJson, readSecret, requireEpisodeId, run} from './lib';
import {parseNarration} from './narration';

type VoiceConfig = {
  engine: 'google';
  google: {voice: string; languageCode: string; speakingRate: number};
  alignment: {model: WhisperModel; whisperCppVersion: string};
};

const id = requireEpisodeId();
const dir = episodeDir(id);
if (!existsSync(dir)) fail(`No episode folder episodes/${id}. Run npm run new -- ${id} first.`);

const voice = readJson<VoiceConfig>(p('voice.json'));
const episode = readJson<EpisodeConfig>(path.join(dir, 'episode.json'));
const pronunciations = existsSync(p('pronunciations.json')) ? readJson<Record<string, string>>(p('pronunciations.json')) : {};
const source = readFileSync(path.join(dir, 'narration.txt'), 'utf8');
const {words, segments, ignored} = parseNarration(source, pronunciations);
if (words.length === 0) fail(`episodes/${id}/narration.txt has no words yet`);
if (ignored.length) console.log(`ℹ Ignoring [[${ignored.join(']], [[')}:...]] markers: Google Chirp 3 HD has no emotion or prosody tags.`);
if (voice.engine !== 'google') fail(`voice.json engine "${voice.engine}" is not supported (only "google")`);

const cacheDir = path.join(dir, 'voice-cache');
const outDir = publicEpisodeDir(id);
mkdirSync(cacheDir, {recursive: true});
mkdirSync(outDir, {recursive: true});

const synthesise = async (text: string, rate?: number) => {
  const g = {...voice.google, speakingRate: rate ?? voice.google.speakingRate};
  const hash = createHash('sha1').update(JSON.stringify({g, text})).digest('hex').slice(0, 16);
  const file = path.join(cacheDir, `${hash}.wav`);
  if (existsSync(file)) return file;
  const key = readSecret('GOOGLE_TTS_API_KEY', 'google-tts-key.txt');
  const res = await fetch('https://texttospeech.googleapis.com/v1/text:synthesize', {
    method: 'POST',
    headers: {'Content-Type': 'application/json', 'x-goog-api-key': key},
    body: JSON.stringify({
      input: {text},
      voice: {languageCode: g.languageCode, name: g.voice},
      audioConfig: {audioEncoding: 'LINEAR16', sampleRateHertz: 48000, speakingRate: g.speakingRate},
    }),
  });
  const body = (await res.json()) as {audioContent?: string; error?: {message: string}};
  if (!res.ok || !body.audioContent) fail(`Google TTS ${res.status}: ${body.error?.message ?? 'no audio returned'}`);
  writeFileSync(file, Buffer.from(body.audioContent!, 'base64'));
  return file;
};

console.log(`▶ Voice: ${voice.google.voice} (rate ${voice.google.speakingRate}), ${segments.length} segment(s), ${words.length} words`);
const inputs: string[] = [];
let n = 0;
for (const seg of segments) {
  if (seg.text) {
    inputs.push('-i', await synthesise(seg.text, seg.rate));
    n++;
  }
  if (seg.pauseAfter > 0) {
    inputs.push('-f', 'lavfi', '-t', String(seg.pauseAfter), '-i', 'anullsrc=r=48000:cl=mono');
    n++;
  }
}
const narration = path.join(outDir, 'narration.wav');
const streams = Array.from({length: n}, (_, i) => `[${i}:a]aformat=sample_rates=48000:channel_layouts=mono[a${i}]`).join(';');
const concat = `${streams};${Array.from({length: n}, (_, i) => `[a${i}]`).join('')}concat=n=${n}:v=0:a=1[out]`;
run(ffmpegBin(), ['-v', 'error', '-y', ...inputs, '-filter_complex', concat, '-map', '[out]', '-c:a', 'pcm_s16le', narration]);
const durationSec = probeDuration(narration);

// Word timings: whisper.cpp hears the take, then each script word is matched to what it heard.
const {model, whisperCppVersion} = voice.alignment;
const whisperPath = p('.whisper');
console.log(`▶ Aligning words with whisper.cpp ${whisperCppVersion} (${model} model; first run downloads and builds it)`);
await installWhisperCpp({to: whisperPath, version: whisperCppVersion, printOutput: false});
await downloadWhisperModel({model, folder: whisperPath, printOutput: false});
const wav16 = path.join(cacheDir, 'whisper-16k.wav');
run(ffmpegBin(), ['-v', 'error', '-y', '-i', narration, '-ar', '16000', '-ac', '1', '-c:a', 'pcm_s16le', wav16]);
const out = await transcribe({inputPath: wav16, whisperPath, whisperCppVersion, model, modelFolder: whisperPath, tokenLevelTimestamps: true, language: 'id', splitOnWord: true, printOutput: false});
const heard = toCaptions({whisperCppOutput: out})
  .captions.map((c) => ({text: c.text.trim(), start: c.startMs / 1000, end: c.endMs / 1000}))
  .filter((h) => h.text);
const timed = alignWords(words, heard, durationSec);
// What whisper heard, for checking pronunciation: unmatched words are often mispronounced English terms.
writeFileSync(path.join(cacheDir, 'heard.txt'), heard.map((h) => h.text).join(' ') + '\n');
const unmatched = words.filter((_, i) => !timed[i].matched).map((w) => w.text);

const captions: Captions = {
  durationSec,
  timing: `whisper.cpp ${whisperCppVersion} ${model}, aligned to narration.txt (${timed.filter((t) => t.matched).length}/${words.length} words matched, rest interpolated)`,
  words: words.map((w, i) => ({text: w.text, start: +timed[i].start.toFixed(3), end: +timed[i].end.toFixed(3), highlight: w.highlight})),
  cues: Object.fromEntries(words.flatMap((w, i) => (w.cue ? [[w.cue, +timed[i].start.toFixed(3)]] : []))),
};
writeFileSync(path.join(dir, 'captions.json'), JSON.stringify(captions, null, 2) + '\n');

const matched = timed.filter((t) => t.matched).length;
const inWindow = durationSec >= episode.minSeconds && durationSec <= episode.maxSeconds;
console.log(`\n✔ narration.wav ${durationSec.toFixed(2)} s  (window ${episode.minSeconds}–${episode.maxSeconds} s: ${inWindow ? 'OK' : 'OUTSIDE'})`);
console.log(`✔ captions.json ${words.length} words, ${matched} matched to audio (${Math.round((100 * matched) / words.length)}%), cues: ${Object.keys(captions.cues).join(', ') || 'none'}`);
if (unmatched.length) console.log(`ℹ Not matched (check pronunciation; heard text in voice-cache/heard.txt): ${unmatched.join(', ')}`);
if (matched / words.length < 0.8) console.log('⚠ Under 80% of words matched: listen to the take and check captions.json before building on these timings.');
if (episode.minWords && words.length < episode.minWords) console.log(`⚠ ${words.length} words is under the minimum (${episode.minWords})`);
if (episode.maxWords && words.length > episode.maxWords) console.log(`⚠ ${words.length} words is over the maximum (${episode.maxWords})`);
