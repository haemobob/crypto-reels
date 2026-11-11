import {AbsoluteFill, Audio, staticFile} from 'remotion';
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

/** Music and foley across the whole Reel, so the closing chord rings out under the logo instead of stopping at the outro. */
const Soundtrack = () => <Audio src={staticFile('episodes/nggak-nyerah-loop/score.mp3')} />;

const episode: EpisodeModule = {config: config as EpisodeConfig, captions: captions as Captions, Scene, Soundtrack};
export default episode;
