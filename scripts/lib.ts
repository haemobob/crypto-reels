import {spawnSync} from 'node:child_process';
import {existsSync, readFileSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const p = (...parts: string[]) => path.join(ROOT, ...parts);

export const episodeDir = (id: string) => p('episodes', id);
export const publicEpisodeDir = (id: string) => p('public', 'episodes', id);

export const fail = (msg: string): never => {
  console.error(`\n✖ ${msg}\n`);
  process.exit(1);
};

export const requireEpisodeId = (argv = process.argv.slice(2)) => {
  const id = argv.find((a) => !a.startsWith('--'));
  if (!id) fail('Pass an episode id, e.g. npm run voice -- my-episode');
  if (!/^[a-z0-9-]+$/.test(id!)) fail(`Episode id "${id}" must use lowercase letters, digits and hyphens only`);
  return id!;
};

export const flag = (name: string, argv = process.argv.slice(2)) => {
  const i = argv.indexOf(`--${name}`);
  return i >= 0 ? (argv[i + 1] ?? '') : undefined;
};

export const readJson = <T>(file: string): T => JSON.parse(readFileSync(file, 'utf8')) as T;

/** Runs a program with an argument array (no shell, so it behaves the same on Windows). */
export const run = (cmd: string, args: string[], opts: {quiet?: boolean} = {}) => {
  const r = spawnSync(cmd, args, {stdio: opts.quiet ? 'pipe' : 'inherit', encoding: 'utf8', shell: false});
  if (r.error) fail(`Could not start ${cmd}: ${r.error.message}`);
  if (r.status !== 0) fail(`${cmd} exited with code ${r.status}${opts.quiet ? `\n${r.stderr}` : ''}`);
  // ffmpeg writes its reports (e.g. loudnorm stats) to stderr, so quiet runs return both streams.
  return opts.quiet ? `${r.stdout ?? ''}${r.stderr ?? ''}` : (r.stdout ?? '');
};

export const ffmpegBin = () => process.env.FFMPEG_PATH ?? 'ffmpeg';
export const ffprobeBin = () => process.env.FFPROBE_PATH ?? 'ffprobe';

export const probeDuration = (file: string) =>
  Number(run(ffprobeBin(), ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', file], {quiet: true}).trim());

/** Reads a secret from an env var or a one-line key file in the project root. */
export const readSecret = (envName: string, fileName: string) => {
  if (process.env[envName]) return process.env[envName]!.trim();
  const file = p(fileName);
  if (existsSync(file)) return readFileSync(file, 'utf8').trim();
  return fail(`Missing ${envName}: set the environment variable or put the key alone in ${fileName} (it is gitignored)`);
};

/** Runs the Remotion CLI through node (no npx/shell), passing REMOTION_BROWSER as the Chrome to use if set. */
export const remotion = (args: string[]) => {
  const browser = process.env.REMOTION_BROWSER ? ['--browser-executable', process.env.REMOTION_BROWSER] : [];
  return run(process.execPath, [p('node_modules', '@remotion', 'cli', 'remotion-cli.js'), ...args, ...browser]);
};
