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
};
