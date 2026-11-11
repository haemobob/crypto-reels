import {AbsoluteFill} from 'remotion';
import captions from '../../../episodes/nggak-nyerah-loop/captions.json';
import config from '../../../episodes/nggak-nyerah-loop/episode.json';
import type {EpisodeModule} from '../../lib/episode-module';
import type {Captions, EpisodeConfig} from '../../lib/types';
import {colors} from '../../theme/colors';
import {Loop} from './Loop';
import {Sound} from './Sound';

/** Wordless loop (no narration, no captions: user request, 11 Nov 2026). */
const Scene = () => (
  <AbsoluteFill style={{backgroundColor: colors.bg}}>
    <Loop />
    <Sound />
  </AbsoluteFill>
);

const episode: EpisodeModule = {config: config as EpisodeConfig, captions: captions as Captions, Scene};
export default episode;
