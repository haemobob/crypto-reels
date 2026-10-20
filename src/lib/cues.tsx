import {createContext, useContext} from 'react';
import {useVideoConfig} from 'remotion';
import type {Captions, EpisodeConfig} from './types';

export const EpisodeContext = createContext<{episode: EpisodeConfig; captions: Captions} | null>(null);

export const useEpisode = () => {
  const ctx = useContext(EpisodeContext);
  if (!ctx) throw new Error('useEpisode() must be used inside <CryptoReel>');
  return ctx;
};

/** Frame helpers keyed to the narration: cue('hook') is the frame the [[hook]] beat starts. */
export const useCues = () => {
  const {captions} = useEpisode();
  const {fps} = useVideoConfig();
  const toFrame = (sec: number) => Math.round(sec * fps);
  const cue = (name: string) => {
    const t = captions.cues[name];
    if (t === undefined) throw new Error(`Unknown cue "${name}". Known: ${Object.keys(captions.cues).join(', ')}`);
    return toFrame(t);
  };
  /** Frame where the nth (0-based) occurrence of a word is spoken, matched case-insensitively. */
  const word = (text: string, nth = 0) => {
    const needle = text.toLowerCase();
    const hits = captions.words.filter((w) => w.text.toLowerCase().replace(/[^\p{L}\p{N}]/gu, '') === needle);
    if (!hits[nth]) throw new Error(`Word "${text}" #${nth} not found in captions`);
    return toFrame(hits[nth].start);
  };
  return {cue, word, toFrame, narrationEnd: toFrame(captions.durationSec)};
};
