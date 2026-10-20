import type {EpisodeModule} from '../lib/episode-module';
import pipelineTest from './pipeline-test';
// @episodes-import (scripts/new-episode.ts adds imports above this line)

export const episodes: Record<string, EpisodeModule> = {
  // @episodes-entry (scripts/new-episode.ts adds entries below this line)
  'pipeline-test': pipelineTest,
};
