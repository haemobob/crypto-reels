import type {EpisodeModule} from '../lib/episode-module';
import pipelineTest from './pipeline-test';
import btcMirip2023 from './btc-mirip-2023';
import liquidationHeatmap from './liquidation-heatmap';
import blackrockTokenisasi from './blackrock-tokenisasi';
import bitcoinShutdown from './bitcoin-shutdown';
import jpmorganBitcoin from './jpmorgan-bitcoin';
import kamusSmc from './kamus-smc';
import semuaMerah from './semua-merah';
import btcUlang2021 from './btc-ulang-2021';
import trader1Persen from './trader-1-persen';
import nggakNyerahLoop from './nggak-nyerah-loop';
import bearTrap2026 from './bear-trap-2026';
import pocBitcoin from './poc-bitcoin';
import bentukVolume from './bentuk-volume';
import satuMeja from './satu-meja';
import mulaiKonsisten from './mulai-konsisten';
import dompetSatoshi from './dompet-satoshi';
import tigaHammer from './tiga-hammer';
// @episodes-import (scripts/new-episode.ts adds imports above this line)

export const episodes: Record<string, EpisodeModule> = {
  // @episodes-entry (scripts/new-episode.ts adds entries below this line)
  'tiga-hammer': tigaHammer,
  'dompet-satoshi': dompetSatoshi,
  'mulai-konsisten': mulaiKonsisten,
  'satu-meja': satuMeja,
  'bentuk-volume': bentukVolume,
  'poc-bitcoin': pocBitcoin,
  'bear-trap-2026': bearTrap2026,
  'nggak-nyerah-loop': nggakNyerahLoop,
  'trader-1-persen': trader1Persen,
  'btc-ulang-2021': btcUlang2021,
  'semua-merah': semuaMerah,
  'kamus-smc': kamusSmc,
  'jpmorgan-bitcoin': jpmorganBitcoin,
  'bitcoin-shutdown': bitcoinShutdown,
  'blackrock-tokenisasi': blackrockTokenisasi,
  'liquidation-heatmap': liquidationHeatmap,
  'btc-mirip-2023': btcMirip2023,
  'pipeline-test': pipelineTest,
};
