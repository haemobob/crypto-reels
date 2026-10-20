export type ScriptWord = {
  /** As written in narration.txt, without markup: shown in captions. */
  text: string;
  /** What the voice is asked to say (after pronunciations.json). */
  spoken: string;
  highlight: boolean;
  cue?: string;
  segment: number;
};

export type Segment = {text: string; pauseAfter: number};

/**
 * Parses narration.txt markup:
 *   [[cue]]        names the beat that starts at the next word
 *   *word*         blue highlight (closing * before punctuation: *word*,)
 *   [[pause:0.6]]  exact silence in seconds; splits the take into segments
 *   [[tone:...]] / [[say:...]]  ElevenLabs/Edge-only directions: ignored by Google TTS
 * Lines starting with # are comments.
 */
export const parseNarration = (source: string, pronunciations: Record<string, string>) => {
  const body = source
    .split(/\r?\n/)
    .filter((l) => !l.trim().startsWith('#'))
    .join(' ');
  const tokens = body.match(/\[\[[^\]]+\]\]|\S+/g) ?? [];
  const words: ScriptWord[] = [];
  const segments: Segment[] = [{text: '', pauseAfter: 0}];
  const ignored = new Set<string>();
  let pendingCue: string | undefined;

  for (const tok of tokens) {
    const marker = tok.match(/^\[\[([^\]]+)\]\]$/);
    if (marker) {
      const [kind, value] = marker[1].split(':');
      if (kind === 'pause') {
        segments[segments.length - 1].pauseAfter += Number(value);
        segments.push({text: '', pauseAfter: 0});
      } else if (kind === 'tone' || kind === 'say') {
        ignored.add(kind);
      } else {
        pendingCue = marker[1].trim();
      }
      continue;
    }
    const highlight = /\*/.test(tok);
    const text = tok.replace(/\*/g, '');
    const core = text.replace(/[^\p{L}\p{N}'-]/gu, '').toLowerCase();
    const respelled = pronunciations[core];
    const spoken = respelled ? text.replace(new RegExp(core.replace(/[-']/g, '\\$&'), 'i'), respelled) : text;
    words.push({text, spoken, highlight, cue: pendingCue, segment: segments.length - 1});
    pendingCue = undefined;
    const seg = segments[segments.length - 1];
    seg.text += (seg.text ? ' ' : '') + spoken;
  }
  if (pendingCue) throw new Error(`Cue [[${pendingCue}]] is at the end of the script with no word after it`);
  return {words, segments, ignored: [...ignored]};
};
