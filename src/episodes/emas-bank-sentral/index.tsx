import captions from '../../../episodes/emas-bank-sentral/captions.json';
import config from '../../../episodes/emas-bank-sentral/episode.json';
import type {EpisodeModule} from '../../lib/episode-module';
import type {Captions, EpisodeConfig} from '../../lib/types';
import {Film} from './Film';

/** Emas & bank sentral: an isometric city in Cryptonite blue (format adapted from a reference reel; see brief.md). */
const Scene = () => <Film />;

const episode: EpisodeModule = {config: config as EpisodeConfig, captions: captions as Captions, Scene, logoPlate: true};
export default episode;
