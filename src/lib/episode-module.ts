import type {FC} from 'react';
import type {Captions, EpisodeConfig} from './types';

export type EpisodeModule = {
  config: EpisodeConfig;
  captions: Captions;
  Scene: FC;
  /** Frame ranges where the micro caption is hidden (thesis interruptions). */
  captionMute?: Array<[number, number]>;
  /** Frame ranges where the corner logo is hidden (light grounds). */
  logoHide?: Array<[number, number]>;
  /** Optional Reel cover (1080×1920 still): registered as `cover-<id>`, rendered with `npm run cover -- <id>`. */
  Cover?: FC;
};
