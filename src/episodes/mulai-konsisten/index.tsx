import {AbsoluteFill, Audio, staticFile} from 'remotion';
import captions from '../../../episodes/mulai-konsisten/captions.json';
import config from '../../../episodes/mulai-konsisten/episode.json';
import type {EpisodeModule} from '../../lib/episode-module';
import type {Captions, EpisodeConfig} from '../../lib/types';
import {colors} from '../../theme/colors';
import {Cover} from './Cover';
import {Wall} from './Wall';

/** Wordless Reel (no narration, no captions: user request, 19 Nov 2026). */
const Scene = () => (
  <AbsoluteFill style={{backgroundColor: colors.bg}}>
    <Wall />
  </AbsoluteFill>
);

/** Music and foley across the whole Reel, so the closing chord rings out under the logo. */
const Soundtrack = () => <Audio src={staticFile('episodes/mulai-konsisten/score.mp3')} />;

const episode: EpisodeModule = {config: config as EpisodeConfig, captions: captions as Captions, Scene, Soundtrack, Cover};
export default episode;
