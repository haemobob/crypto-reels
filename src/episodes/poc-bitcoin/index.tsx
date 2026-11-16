import type {ReactNode} from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import captions from '../../../episodes/poc-bitcoin/captions.json';
import config from '../../../episodes/poc-bitcoin/episode.json';
import {Hi} from '../../components/Headline';
import {HeadlineTrack} from '../../components/HeadlineTrack';
import {useCues} from '../../lib/cues';
import type {EpisodeModule} from '../../lib/episode-module';
import type {Captions, EpisodeConfig} from '../../lib/types';
import {colors} from '../../theme/colors';
import {ease} from '../../theme/motion';
import {fonts} from '../../theme/typography';
import {Cover} from './Cover';
import {Profile, type Beats} from './Profile';
import {Sound} from './Sound';

// Layout (screen px): micro captions y≈384, headline zone 470–700, stage 760–1420, source line 1534.
const HEADLINE_Y = 590;
const SOURCE_Y = 1534;
const fadeOut = (frame: number, at: number, len = 10) => interpolate(frame, [at, at + len], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
const Gold = ({children}: {children: ReactNode}) => <span style={{color: '#FFD166'}}>{children}</span>;
const Red = ({children}: {children: ReactNode}) => <span style={{color: colors.negative}}>{children}</span>;
const Green = ({children}: {children: ReactNode}) => <span style={{color: colors.positive}}>{children}</span>;

const OpeningTitle = ({until}: {until: number}) => {
  const frame = useCurrentFrame();
  if (frame >= until) return null;
  const r = interpolate(frame, [-8, 8], [0, 1], {extrapolateRight: 'clamp', easing: ease.out});
  return (
    <div style={{position: 'absolute', left: 40, right: 40, top: HEADLINE_Y - 20, transform: `translateY(calc(-50% + ${(1 - r) * 60}px))`, opacity: interpolate(r, [0, 0.5], [0, 1], {extrapolateRight: 'clamp'}) * fadeOut(frame, until - 6, 6), textAlign: 'center', fontFamily: fonts.heading, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.0, color: colors.text, fontSize: 104}}>
      <div style={{fontSize: 64, marginBottom: 14}}>BITCOIN BERHENTI DI</div>
      <Gold>$87 RB</Gold> &amp; <Gold>$62 RB</Gold>.
      <br />
      KEBETULAN?
    </div>
  );
};

const Scene = () => {
  const frame = useCurrentFrame();
  const {cue, word, narrationEnd} = useCues();
  const c = (k: string) => cue(k);
  const b: Beats = {
    hook: c('hook'), nocoin: c('nocoin'), poc: c('poc'), summer: c('summer'), bear: c('bear'), rally: c('rally'), stop: c('stop'), drop: c('drop'), hold: c('hold'),
    why: c('why'), pay: c('pay'), fail: c('fail'), end: narrationEnd, w87: word('delapan', 0), w62: word('enam', 0),
  };
  const source =
    frame < b.poc ? 'BINANCE BTC/USDT · HARIAN · 15 SEP 2025 – 15 NOV 2026'
      : frame < b.pay ? 'POC: VOLUME PER JAM BINANCE BTC/USDT, DIBAGI RATA KE RENTANG HARGA TIAP JAM'
        : 'DATA BINANCE S/D 15 NOV 2026 · BACAAN KAMI, BUKAN RAMALAN · BUKAN SARAN INVESTASI';
  return (
    <AbsoluteFill style={{backgroundColor: colors.bg}}>
      <Profile b={b} />
      <OpeningTitle until={b.nocoin - 1} />
      <HeadlineTrack
        centerY={HEADLINE_Y}
        until={narrationEnd + 18}
        cues={[
          {from: b.nocoin, content: <>BUKAN <Hi>KEBETULAN</Hi></>, size: 100},
          {from: b.poc, content: <><Gold>POINT OF CONTROL</Gold>:<br />HARGA DENGAN VOLUME<br />TERBANYAK</>, size: 66},
          {from: b.summer, content: <>JUN–AGU: POC<br /><Gold>≈ $64.100</Gold></>, size: 88},
          {from: b.bear, content: <>OKT–JAN: POC<br /><Gold>≈ $87.900</Gold></>, size: 88},
          {from: b.rally, content: <><Green>+36%</Green> DARI POC BAWAH…</>, size: 84},
          {from: b.stop, content: <>…BERHENTI DI<br /><Gold>POC ATAS</Gold></>, size: 92},
          {from: b.drop, content: <><Red>−29%</Red>…</>, size: 110},
          {from: b.hold, content: <>…BERHENTI DI<br /><Gold>POC BAWAH</Gold></>, size: 92},
          {from: b.why, content: <>BANYAK TRANSAKSI<br />→ HARGA SERING BEREAKSI</>, size: 70},
          {from: b.pay, content: <>AWASI: <Gold>$64 RB</Gold><br />&amp; <Gold>$88 RB</Gold></>, size: 96},
          {from: b.fail, content: <>$64 RB JEBOL<br />→ <Red>$57.800</Red></>, size: 96},
        ]}
      />
      <div style={{position: 'absolute', left: 80, right: 80, top: SOURCE_Y, textAlign: 'center', fontFamily: fonts.mono, fontWeight: 500, fontSize: 18, letterSpacing: '0.03em', color: '#7F93B3', lineHeight: 1.4}}>{source}</div>
      <Sound />
    </AbsoluteFill>
  );
};

const episode: EpisodeModule = {config: config as EpisodeConfig, captions: captions as Captions, Scene, Cover};
export default episode;
