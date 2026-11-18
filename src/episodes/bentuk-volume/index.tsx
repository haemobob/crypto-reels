import type {ReactNode} from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import captions from '../../../episodes/bentuk-volume/captions.json';
import config from '../../../episodes/bentuk-volume/episode.json';
import {Hi} from '../../components/Headline';
import {HeadlineTrack} from '../../components/HeadlineTrack';
import {useCues} from '../../lib/cues';
import type {EpisodeModule} from '../../lib/episode-module';
import type {Captions, EpisodeConfig} from '../../lib/types';
import {colors} from '../../theme/colors';
import {ease} from '../../theme/motion';
import {fonts} from '../../theme/typography';
import {Cover} from './Cover';
import {Week, type Beats} from './Week';

// Layout (screen px): micro captions y≈384, headline zone centred at 590, chart 780–1280 with day labels at 1310,
// open-interest panel 1330–1480 (only while it is discussed), source line 1534.
const HEADLINE_Y = 590;
const SOURCE_Y = 1534;
const GOLD = '#FFD166';
const Gold = ({children}: {children: ReactNode}) => <span style={{color: GOLD}}>{children}</span>;
const Red = ({children}: {children: ReactNode}) => <span style={{color: colors.negative}}>{children}</span>;
const Green = ({children}: {children: ReactNode}) => <span style={{color: colors.positive}}>{children}</span>;

const OpeningTitle = ({until}: {until: number}) => {
  const frame = useCurrentFrame();
  if (frame >= until) return null;
  const r = interpolate(frame, [-8, 8], [0, 1], {extrapolateRight: 'clamp', easing: ease.out});
  const out = interpolate(frame, [until - 6, until], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <div style={{position: 'absolute', left: 40, right: 40, top: HEADLINE_Y, transform: `translateY(calc(-50% + ${(1 - r) * 60}px))`, opacity: interpolate(r, [0, 0.5], [0, 1], {extrapolateRight: 'clamp'}) * out, textAlign: 'center', fontFamily: fonts.heading, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.0, color: colors.text, fontSize: 110}}>
      MANTUL <Green>5%</Green>.
      <br />
      <Hi>PEMBELI BALIK?</Hi>
    </div>
  );
};

const Scene = () => {
  const frame = useCurrentFrame();
  const {cue, word, narrationEnd} = useCues();
  const c = (k: string) => cue(k);
  const b: Beats = {
    hook: c('hook'), but: c('but'), pshape: c('pshape'), oi: c('oi'), key: c('key'), bshape: c('bshape'), thin: c('thin'), guard: c('guard'), dshape: c('dshape'), test: c('test'), held: c('held'), pay: c('pay'), end: narrationEnd,
    w62: word('enam', 0), fat: word('gemuk', 0), thinW: word('tipis', 1), turunLagi: word('turun', 2), enam: word('enam', 1), jebol: word('jebol', 0), w633: word('enam', 4),
  };
  const source =
    frame < b.oi ? 'BINANCE BTC/USDT · CANDLE 5 MENIT · 15 NOV 2026 (UTC)'
      : frame < b.key ? 'OPEN INTEREST: OKX BTC-USDT-SWAP, PER JAM · HARGA: BINANCE BTC/USDT'
        : frame < b.pay ? 'PROFIL VOLUME PER HARI (UTC) DARI CANDLE 5 MENIT BINANCE BTC/USDT'
          : 'DATA S/D TUTUP 17 NOV 2026 · BACAAN, BUKAN SINYAL · BUKAN SARAN INVESTASI';
  return (
    <AbsoluteFill style={{backgroundColor: colors.bg}}>
      <Week b={b} />
      <OpeningTitle until={b.but} />
      <HeadlineTrack
        centerY={HEADLINE_Y}
        until={narrationEnd + 18}
        cues={[
          {from: b.but, content: <>BENTUK VOLUMENYA<br /><Hi>BILANG LAIN</Hi></>, size: 92},
          {from: b.pshape, content: <><Gold>BENTUK P</Gold>:<br />VOLUME DI ATAS</>, size: 96},
          {from: b.oi, content: <>OPEN INTEREST <Red>TURUN</Red><br />= SHORT TUTUP POSISI</>, size: 74},
          {from: b.key, content: <>GEMUK = <Gold>DISEPAKATI</Gold><br />TIPIS = DILEWATI</>, size: 80},
          {from: b.bshape, content: <>12 NOV: <Gold>BENTUK <span style={{textTransform: 'none'}}>b</span></Gold><br />PENJUAL PEGANG KENDALI</>, size: 64},
          {from: b.thin, content: <>14 NOV: <Gold>PANJANG &amp; TIPIS</Gold><br />JANGAN TEBAK DASARNYA</>, size: 62},
          {from: b.guard, content: <>BENTUK P: JAGA<br /><Gold>AREA TIPIS ≈ $63,5 RB</Gold></>, size: 76},
          {from: b.dshape, content: <>16 NOV: <Gold>BENTUK D</Gold><br />KEDUA SISI SEPAKAT</>, size: 80},
          {from: b.test, content: <>17 NOV: TURUN KE<br /><Gold>AREA TIPIS</Gold></>, size: 88},
          {from: b.held, content: <>…TUTUP LAGI<br /><Green>DI ATASNYA</Green></>, size: 92},
          {from: b.pay, content: <>BENTUK ≠ SINYAL.<br />TAPI KASIH TAHU<br /><Hi>SIAPA PEGANG KENDALI</Hi></>, size: 64},
        ]}
      />
      <div style={{position: 'absolute', left: 80, right: 80, top: SOURCE_Y, textAlign: 'center', fontFamily: fonts.mono, fontWeight: 500, fontSize: 18, letterSpacing: '0.03em', color: '#7F93B3', lineHeight: 1.4}}>{source}</div>
    </AbsoluteFill>
  );
};

const episode: EpisodeModule = {config: config as EpisodeConfig, captions: captions as Captions, Scene, Cover};
export default episode;
