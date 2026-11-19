import {AbsoluteFill} from 'remotion';
import captions from '../../../episodes/satu-meja/captions.json';
import config from '../../../episodes/satu-meja/episode.json';
import {Ground} from '../../components/Ground';
import {Headline} from '../../components/Headline';
import type {EpisodeModule} from '../../lib/episode-module';
import type {Captions, EpisodeConfig} from '../../lib/types';

const Scene = () => (
  <Ground polarity="navy">
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', padding: '0 90px'}}>
      <Headline>satu-meja</Headline>
    </AbsoluteFill>
  </Ground>
);

const episode: EpisodeModule = {config: config as EpisodeConfig, captions: captions as Captions, Scene};
export default episode;
