/**
 * npm run new -- <id> [--title "Judul"] [--min 35] [--max 60]
 * Scaffolds episodes/<id>/ (production docs from templates/, narration, sources, episode.json, placeholder captions)
 * and src/episodes/<id>/index.tsx, and registers the episode.
 */
import {existsSync, mkdirSync, readFileSync, writeFileSync} from 'node:fs';
import path from 'node:path';
import type {Captions, EpisodeConfig} from '../src/lib/types';
import {episodeDir, fail, flag, p, publicEpisodeDir, requireEpisodeId} from './lib';

const id = requireEpisodeId();
const dir = episodeDir(id);
if (existsSync(dir)) fail(`episodes/${id} already exists`);
const title = flag('title') ?? id;
const minSeconds = Number(flag('min') ?? 35);
const maxSeconds = Number(flag('max') ?? 60);

mkdirSync(dir, {recursive: true});
mkdirSync(publicEpisodeDir(id), {recursive: true});
const fill = (s: string) => s.replaceAll('[EPISODE]', title);

const fromTemplates: Record<string, string> = {
  'retention-brief.md': 'retention-brief-template.md',
  'hooks.md': 'hooks-template.md',
  'cold-open-storyboard.md': 'cold-open-storyboard-template.md',
  'beat-sheet.md': 'beat-sheet-template.md',
  'transition-map.md': 'transition-map-template.md',
  'qa-report.md': 'qa-report-template.md',
  'performance-review.md': 'performance-review.md',
};
for (const [out, tpl] of Object.entries(fromTemplates)) writeFileSync(path.join(dir, out), fill(readFileSync(p('templates', tpl), 'utf8')));

const stubs: Record<string, string> = {
  'brief.md': `# Visual brief — ${title}\n\n- **Framework**: Remotion (or HyperFrames, and why)\n- **Visual subject** and why it is the most relevant:\n- **Visual concept** (the one idea the look is built around):\n- **Different from recent episodes** (see reference/episode-visual-log.md):\n- **Opening asset hierarchy level** (and why, if below 3):\n- **Visual nouns**:\n- **Polarity chapters** (by meaning):\n- **Hero move(s)**:\n`,
  'research.md': `# Research — ${title}\n\n## 5W1H\n- Who:\n- What:\n- When (event date vs publication date):\n- Where:\n- Why:\n- How:\n\n## Claims\n| Claim | Type (fact / allegation / opinion / forecast / illustration / calculation) | Source | Date checked |\n|---|---|---|---|\n`,
  'storyboard.md': `# Storyboard — ${title}\n\n\`shot_id | in/out | narrator phrase | new fact | visual noun | camera | transition | polarity | audio | source/qualifier\`\n`,
  'audio-map.md': `# Audio map — ${title}\n\n- Voice: see voice.json; take measured by npm run voice\n- Duration (measured):\n- Cue times: captions.json\n- Music / SFX cue points and licences:\n`,
  'sources.md': `# Sources — ${title}\n\n| # | Claim or asset | Source (URL / file) | Published | Checked | Licence or basis |\n|---|---|---|---|---|---|\n`,
  'narration.txt': `# Approved exact wording, Bahasa Indonesia. Lines starting with # are ignored.\n# [[cue]] before a beat's first word, *keyword* for blue, [[pause:0.6]] for a silence.\n`,
};
for (const [out, text] of Object.entries(stubs)) writeFileSync(path.join(dir, out), text);

const config: EpisodeConfig = {id, title, minSeconds, maxSeconds, captions: 'micro', tailSeconds: 0.6, outro: true};
writeFileSync(path.join(dir, 'episode.json'), JSON.stringify(config, null, 2) + '\n');
const placeholder: Captions = {durationSec: minSeconds, words: [], cues: {}, timing: 'PLACEHOLDER: no voice yet (run npm run voice)'};
writeFileSync(path.join(dir, 'captions.json'), JSON.stringify(placeholder, null, 2) + '\n');

const srcDir = p('src', 'episodes', id);
mkdirSync(srcDir, {recursive: true});
writeFileSync(
  path.join(srcDir, 'index.tsx'),
  `import {AbsoluteFill} from 'remotion';
import captions from '../../../episodes/${id}/captions.json';
import config from '../../../episodes/${id}/episode.json';
import {Ground} from '../../components/Ground';
import {Headline} from '../../components/Headline';
import type {EpisodeModule} from '../../lib/episode-module';
import type {Captions, EpisodeConfig} from '../../lib/types';

const Scene = () => (
  <Ground polarity="navy">
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', padding: '0 90px'}}>
      <Headline>${title.replace(/[`$\\]/g, '')}</Headline>
    </AbsoluteFill>
  </Ground>
);

const episode: EpisodeModule = {config: config as EpisodeConfig, captions: captions as Captions, Scene};
export default episode;
`,
);

const registry = p('src', 'episodes', 'index.ts');
const varName = id.replace(/-([a-z0-9])/g, (_, c: string) => c.toUpperCase()).replace(/^(\d)/, '_$1');
const reg = readFileSync(registry, 'utf8')
  .replace('// @episodes-import', `import ${varName} from './${id}';\n// @episodes-import`)
  .replace(/(\/\/ @episodes-entry[^\n]*\n)/, `$1  '${id}': ${varName},\n`);
writeFileSync(registry, reg);

console.log(`✔ Created episodes/${id}/ and src/episodes/${id}/, registered "${id}" (${minSeconds}–${maxSeconds} s)`);
console.log('  Next: fill retention-brief.md, hooks.md and cold-open-storyboard.md, then write narration.txt.');
