export type CaptionWord = {
  /** Word as written in the script (original spelling, no markup). */
  text: string;
  /** Seconds from the start of narration.wav. */
  start: number;
  end: number;
  /** Marked *like this* in narration.txt: shown in brand blue. */
  highlight: boolean;
};

export type Captions = {
  durationSec: number;
  words: CaptionWord[];
  /** [[cue]] markers: cue name -> start time (seconds) of the word that follows it. */
  cues: Record<string, number>;
  /** How the timings were made, e.g. "whisper.cpp base, aligned to script". */
  timing: string;
};

export type EpisodeConfig = {
  id: string;
  title: string;
  minSeconds: number;
  maxSeconds: number;
  minWords?: number;
  maxWords?: number;
  captions: 'micro' | 'subtitles' | 'none';
  /** Seconds of picture held after the last word before the outro starts. */
  tailSeconds?: number;
  outro?: boolean;
};

export type ReelProps = {
  episodeId: string;
  episode?: EpisodeConfig;
  captions?: Captions;
};
