import {AbsoluteFill, useCurrentFrame} from 'remotion';
import captions from '../../../episodes/burry-nvidia/captions.json';
import config from '../../../episodes/burry-nvidia/episode.json';
import {SentenceTrack} from '../../components/actors';
import {SeamSide} from '../../components/motion';
import type {EpisodeModule} from '../../lib/episode-module';
import type {Captions, EpisodeConfig} from '../../lib/types';
import {Archive, BET_2005_SCREEN, BIG_SHORT_SCREEN, Portrait} from './Burry';
import {Market, NV_LOW_SCREEN} from './Market';
import {NvdaWorld} from './NvdaWorld';
import {T} from './timing';

/**
 * Burry & Nvidia. Chapters and seams (transition-map.md):
 * market board (black) → iris from the Nvidia low → Burry premiere photo → zoom through "THE BIG SHORT" →
 * off-white archive (2005 bet, 2008 crisis) → polarity flood from the 2005 marker → the Nvidia line world (black),
 * where one continuous camera carries the bet, the loss, the profit, the bounce and the takeaway.
 */
const Scene = () => {
  const f = useCurrentFrame();
  const archive = f >= T.tahun + 2 && f < T.bet + 8;
  return (
    <AbsoluteFill style={{backgroundColor: '#000000'}}>
      {f < T.trader + 16 && (
        <Market />
      )}
      {f >= T.trader && f < T.tahun + 2 && (
        <SeamSide kind="flood" at={T.trader} side="in" opts={{origin: NV_LOW_SCREEN, dur: 12}}>
          <SeamSide kind="zoom" at={T.tahun} side="out" opts={{origin: BIG_SHORT_SCREEN, dur: 12}}>
            <Portrait />
          </SeamSide>
        </SeamSide>
      )}
      {f >= T.tahun && f < T.bet + 18 && (
        <SeamSide kind="zoom" at={T.tahun} side="in" opts={{dur: 12}}>
          <Archive />
        </SeamSide>
      )}
      {f >= T.bet && (
        <SeamSide kind="flood" at={T.bet} side="in" opts={{origin: BET_2005_SCREEN, dur: 8}}>
          <NvdaWorld />
        </SeamSide>
      )}
      <SentenceTrack y={360} size={50} preview={false} color={archive ? '#101828' : '#FFFFFF'} />
    </AbsoluteFill>
  );
};

const episode: EpisodeModule = {
  config: config as EpisodeConfig,
  captions: captions as Captions,
  Scene,
  logoHide: [[T.tahun - 2, T.bet + 14]],
};
export default episode;
