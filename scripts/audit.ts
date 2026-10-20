/** npm run audit -- <id>: passes only when both result lines in episodes/<id>/qa-report.md read PASS. */
import {existsSync, readFileSync} from 'node:fs';
import path from 'node:path';
import {episodeDir, requireEpisodeId} from './lib';

export const auditStatus = (id: string) => {
  const file = path.join(episodeDir(id), 'qa-report.md');
  const text = existsSync(file) ? readFileSync(file, 'utf8') : '';
  const read = (label: string) => text.match(new RegExp(`^${label} audit result:\\s*(\\S+)`, 'mi'))?.[1]?.toUpperCase() ?? 'MISSING';
  return {retention: read('Retention'), visual: read('Visual-quality')};
};

if (import.meta.url === `file://${process.argv[1]}` || process.argv[1]?.endsWith('audit.ts')) {
  const id = requireEpisodeId();
  const s = auditStatus(id);
  console.log(`Retention audit: ${s.retention}\nVisual-quality audit: ${s.visual}`);
  if (s.retention !== 'PASS' || s.visual !== 'PASS') {
    console.error('\n✖ Both audits must read PASS in qa-report.md before the final render.');
    process.exit(1);
  }
  console.log('\n✔ Both audits PASS');
}
