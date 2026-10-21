import type {EpisodeModule} from '../lib/episode-module';
import pipelineTest from './pipeline-test';
import btcMirip2023 from './btc-mirip-2023';
// @episodes-import (scripts/new-episode.ts adds imports above this line)

export const episodes: Record<string, EpisodeModule> = {
  // @episodes-entry (scripts/new-episode.ts adds entries below this line)
  'btc-mirip-2023': btcMirip2023,
  'pipeline-test': pipelineTest,
};
