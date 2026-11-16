import type {ReactNode} from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import captions from '../../../episodes/bear-trap-2026/captions.json';
import config from '../../../episodes/bear-trap-2026/episode.json';
import {Hi} from '../../components/Headline';
import {HeadlineTrack} from '../../components/HeadlineTrack';
import {useCues} from '../../lib/cues';
import type {EpisodeModule} from '../../lib/episode-module';
import type {Captions, EpisodeConfig} from '../../lib/types';
import {colors} from '../../theme/colors';
import {ease} from '../../theme/motion';
import {fonts} from '../../theme/typography';
import {Cover} from './Cover';
import {Sound} from './Sound';
import {Anatomy, Trap, type Beats} from './Trap';

// Layout (screen px): micro captions y≈384, anatomy row y≈438, headline zone 470–700, stage 746–1420, source line 1534.
const HEADLINE_Y = 590;
const SOURCE_Y = 1534;

const fadeOut = (frame: number, at: number, len = 10) => interpolate(frame, [at, at + len], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
const Red = ({children}: {children: ReactNode}) => <span style={{color: colors.negative}}>{children}</span>;
const Green = ({children}: {children: ReactNode}) => <span style={{color: colors.positive}}>{children}</span>;
const Amber = ({children}: {children: ReactNode}) => <span style={{color: '#FFD166'}}>{children}</span>;

const OpeningTitle = ({until}: {until: number}) => {
  const frame = useCurrentFrame();
  if (frame >= until) return null;
  const r = interpolate(frame, [-8, 8], [0, 1], {extrapolateRight: 'clamp', easing: ease.out});
  return (
    <div style={{position: 'absolute', left: 40, right: 40, top: HEADLINE_Y - 30, transform: `translateY(calc(-50% + ${(1 - r) * 60}px))`, opacity: interpolate(r, [0, 0.5], [0, 1], {extrapolateRight: 'clamp'}) * fadeOut(frame, until - 6, 6), textAlign: 'center', fontFamily: fonts.heading, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 0.98, color: colors.text, fontSize: 116}}>
      <span style={{color: colors.electric}}>BEAR TRAP</span>
      <br />
      KAYAK 2023?
    </div>
  );
};

const Scene = () => {
  const frame = useCurrentFrame();
  const {cue, narrationEnd} = useCues();
  const c = (k: string) => cue(k);
  const b: Beats = {
    hook: c('hook'), def: c('def'), t23: c('t23'), break23: c('break23'), vol23: c('vol23'), fed: c('fed'), rev23: c('rev23'), high23: c('high23'),
    t26: c('t26'), break26: c('break26'), press: c('press'), etf: c('etf'), miss: c('miss'), pay: c('pay'), fail: c('fail'), end: narrationEnd,
  };
  const source =
    frame < b.def ? 'BINANCE BTC/USDT · HARIAN · S/D 15 NOV 2026'
      : frame < b.fed ? 'BINANCE BTC/USDT · HARIAN · DES 2022 – APR 2023'
        : frame < b.t26 ? 'PERNYATAAN BERSAMA TREASURY, FED & FDIC · 12 MAR 2023 · DATA: BINANCE'
          : frame < b.press ? 'BINANCE BTC/USDT · HARIAN · S/D 15 NOV 2026'
            : frame < b.miss ? 'LIKUIDASI: COINGLASS (VIA YAHOO FINANCE) · ETF: SOSOVALUE (VIA CRYPTO.NEWS) · NOV 2026'
              : 'BINANCE BTC/USDT · S/D 15 NOV 2026 · BACAAN KAMI, BUKAN RAMALAN · BUKAN SARAN INVESTASI';
  return (
    <AbsoluteFill style={{backgroundColor: colors.bg}}>
      <Trap b={b} />
      <Anatomy b={b} />
      <OpeningTitle until={b.def - 1} />
      <HeadlineTrack
        centerY={HEADLINE_Y}
        until={narrationEnd + 18}
        cues={[
          {from: b.def, content: <><Hi>BEAR TRAP</Hi>: JEBOL,<br />LALU <Green>BALIK NAIK</Green></>, size: 84},
          {from: b.t23, content: <>2023: DUA PUNCAK<br />SAMPAI $25.250</>, size: 80},
          {from: b.break23, content: <>SUPPORT JEBOL<br />→ <Red>$19.549</Red></>, size: 84},
          {from: b.vol23, content: <>VOLUME JUAL <Red>×1,8</Red></>, size: 92},
          {from: b.fed, content: <>12 MAR: AS JAMIN<br />DEPOSAN BANK</>, size: 82},
          {from: b.rev23, content: <><Green>3 HARI</Green>: BALIK DI<br />ATAS SUPPORT</>, size: 82},
          {from: b.high23, content: <><Green>7 HARI</Green>: TEMBUS PUNCAK</>, size: 80},
          {from: b.t26, content: <>2026: DUA PUNCAK<br />DI $87.400</>, size: 80},
          {from: b.break26, content: <>SUPPORT $79.800<br />JEBOL → <Red>$62.006</Red></>, size: 76},
          {from: b.press, content: <>VOLUME <Red>×2,1</Red> · LIKUIDASI<br /><Red>&gt;$1,2 M</Red>, MAYORITAS LONG</>, size: 66},
          {from: b.etf, content: <>ETF BITCOIN<br /><Red>TERUS DIJUAL</Red></>, size: 86},
          {from: b.miss, content: <>YANG BELUM:<br /><Amber>PEMBALIKNYA</Amber></>, size: 92},
          {from: b.pay, content: <>SYARAT: BALIK KE ATAS<br /><Green>$79.800</Green> &amp; BERTAHAN</>, size: 74},
          {from: b.fail, content: <>LOW BARU &lt; $62.006<br />→ ANALOGI <Red>GAGAL</Red></>, size: 78},
        ]}
      />
      <div style={{position: 'absolute', left: 80, right: 80, top: SOURCE_Y, textAlign: 'center', fontFamily: fonts.mono, fontWeight: 500, fontSize: 18, letterSpacing: '0.03em', color: '#7F93B3', lineHeight: 1.4}}>{source}</div>
      <Sound />
    </AbsoluteFill>
  );
};

const episode: EpisodeModule = {config: config as EpisodeConfig, captions: captions as Captions, Scene, Cover};
export default episode;
