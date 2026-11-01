import type {CSSProperties, ReactNode} from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import captions from '../../../episodes/semua-merah/captions.json';
import config from '../../../episodes/semua-merah/episode.json';
import {Ground} from '../../components/Ground';
import {Hi} from '../../components/Headline';
import {HeadlineTrack} from '../../components/HeadlineTrack';
import {useCues} from '../../lib/cues';
import type {EpisodeModule} from '../../lib/episode-module';
import type {Captions, EpisodeConfig} from '../../lib/types';
import {colors} from '../../theme/colors';
import {ease} from '../../theme/motion';
import {fonts} from '../../theme/typography';
import {BoardWorld, type BoardBeats} from './Board';
import {Sound} from './Sound';

// Layout (screen px): micro captions y≈384, tags y≈438, headline zone 470–700, stage 740–1430, source line 1534.
const HEADLINE_Y = 585;
const SOURCE_Y = 1534;

const fade = (frame: number, from: number, len = 10) => interpolate(frame, [from, from + len], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease.out});
const fadeOut = (frame: number, at: number, len = 10) => interpolate(frame, [at, at + len], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
const Red = ({children}: {children: ReactNode}) => <span style={{color: colors.negative}}>{children}</span>;
const Green = ({children}: {children: ReactNode}) => <span style={{color: colors.positive}}>{children}</span>;
const Tag = ({children, color = colors.light, style}: {children: ReactNode; color?: string; style?: CSSProperties}) => (
  <div style={{fontFamily: fonts.mono, fontWeight: 700, fontSize: 22, letterSpacing: '0.12em', color, textTransform: 'uppercase', ...style}}>{children}</div>
);
const Tagline = ({frame, from, to, color = colors.muted, children}: {frame: number; from: number; to: number; color?: string; children: ReactNode}) =>
  frame < from || frame >= to ? null : (
    <div style={{position: 'absolute', left: 80, right: 80, top: HEADLINE_Y + 92, textAlign: 'center', opacity: fade(frame, from, 8) * fadeOut(frame, to - 6, 6)}}>
      <Tag color={color} style={{display: 'inline-block', fontSize: 20, letterSpacing: '0.08em', padding: '8px 14px', borderRadius: 8, background: 'rgba(5,11,24,0.82)', boxShadow: '0 0 0 1px #1E3256'}}>{children}</Tag>
    </div>
  );
const SourceLine = ({text}: {text: string}) => (
  <div style={{position: 'absolute', left: 90, right: 90, top: SOURCE_Y, textAlign: 'center', fontFamily: fonts.mono, fontWeight: 500, fontSize: 18, letterSpacing: '0.03em', color: '#7F93B3'}}>{text}</div>
);

/** Centred opening title, rising in from below on frame 0. */
const OpeningTitle = ({until}: {until: number}) => {
  const frame = useCurrentFrame();
  if (frame >= until) return null;
  const r = interpolate(frame, [-8, 8], [0, 1], {extrapolateRight: 'clamp', easing: ease.out});
  return (
    <div style={{position: 'absolute', left: 40, right: 40, top: HEADLINE_Y, transform: `translateY(calc(-50% + ${(1 - r) * 60}px))`, opacity: interpolate(r, [0, 0.5], [0, 1], {extrapolateRight: 'clamp'}) * fadeOut(frame, until - 6, 6), textAlign: 'center', fontFamily: fonts.heading, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.0, color: colors.text}}>
      <div style={{fontSize: 120}}>SEMUA <span style={{color: colors.negative}}>MERAH.</span></div>
    </div>
  );
};

const Scene = () => {
  const frame = useCurrentFrame();
  const {cue, word, narrationEnd} = useCues();
  const c = (k: string) => cue(k);
  const b: BoardBeats = {
    hook: c('hook'), q: c('q'), myth: c('myth'), trade: c('trade'), swap: c('swap'), price: c('price'), green: c('green'), bonds: c('bonds'), oil: c('oil'), dollar: c('dollar'),
    why: c('why'), intel: c('intel'), metals: c('metals'), binance: c('binance'), liq: c('liq'), payoff: c('payoff'), check: c('check'), end: narrationEnd,
    wEmas: word('emas', 0), wPerak: word('perak', 0), wBitcoin: word('bitcoin', 0), wEnergi: word('energi'), wHijau: word('hijau'), wTerpaksa: word('terpaksa'),
  };

  return (
    <Ground polarity="navy">
      <BoardWorld b={b} />
      <OpeningTitle until={b.q - 2} />
      <HeadlineTrack
        centerY={HEADLINE_Y}
        until={narrationEnd + 18}
        cues={[
          {from: b.q, content: <>UANGNYA <Hi>KE MANA?</Hi></>, size: 104},
          {from: b.myth, content: <>KABUR KE <Red>CASH?</Red></>, size: 104},
          {from: b.trade, content: <>TIAP ADA YANG JUAL,<br />ADA YANG <Hi>BELI</Hi></>, size: 76},
          {from: b.swap, content: <>UANGNYA CUMA<br /><Hi>PINDAH TANGAN</Hi></>, size: 84},
          {from: b.price, content: <>YANG TURUN: <Red>HARGANYA</Red></>, size: 80},
          {from: b.green, content: <>NGGAK SEMUANYA <Red>MERAH</Red></>, size: 78},
          {from: b.bonds, content: <>OBLIGASI AS <Green>NAIK</Green></>, size: 90},
          {from: b.oil, content: <>MINYAK & SAHAM<br />DEFENSIF <Green>NAIK</Green></>, size: 76},
          {from: b.dollar, content: <>DOLAR? MALAH <Red>TURUN</Red> TIPIS</>, size: 74},
          {from: b.why, content: <>PEMICUNYA <Hi>BEDA-BEDA</Hi></>, size: 84},
          {from: b.intel, content: <>CHIP: INTEL <Red>−28,6%</Red></>, size: 86},
          {from: b.metals, content: <>EMAS & PERAK:<br />FED BAKAL <Red>NAIKIN BUNGA?</Red></>, size: 70},
          {from: b.binance, content: <>KRIPTO: <Red>BINANCE</Red><br />INSIDEN ±$6,3 MILIAR</>, size: 72},
          {from: b.liq, content: <>+ LIKUIDASI PAKSA<br /><Red>&gt;$1,5 MILIAR</Red></>, size: 76},
          {from: b.payoff, content: <>LAYAR LO <Red>MERAH SEMUA?</Red></>, size: 78},
          {from: b.check, content: <>APA YANG <Green>HIJAU</Green>?<br />SIAPA YANG <Red>TERPAKSA JUAL</Red>?</>, size: 70},
        ]}
      />
      <Tagline frame={frame} from={b.trade + 10} to={b.price - 2}>ILUSTRASI · TIAP TRANSAKSI ADA PENJUAL & PEMBELI</Tagline>
      <Tagline frame={frame} from={b.bonds + 10} to={b.oil - 2}>YIELD 10 TAHUN 4,94% (−0,04) = HARGA OBLIGASI NAIK</Tagline>
      <Tagline frame={frame} from={b.metals + 10} to={b.binance - 2}>PENJELASAN ANALIS · BUKAN SATU-SATUNYA SEBAB</Tagline>
      <Tagline frame={frame} from={b.binance + 10} to={b.liq - 2}>NILAI TERDAMPAK, BUKAN SEMUANYA HILANG</Tagline>
      <SourceLine
        text={
          frame < b.green ? 'CAPPNOTES CLOSING LOOK · 30 OKT 2026 · GRAFIK: FRED (S&P), BINANCE (BTC)' :
          frame < b.why ? 'CAPPNOTES CLOSING LOOK · 30 OKT 2026' :
          frame < b.metals ? 'CAPPNOTES CLOSING LOOK · 30 OKT 2026' :
          frame < b.binance ? 'KITCO, 29 OKT 2026 · PELUANG: POLYMARKET/KALSHI VIA CAPPNOTES' :
          frame < b.payoff ? 'BINANCE VIA CRYPTO.NEWS & COINDESK · LIKUIDASI: COINGLASS · 30 OKT 2026' :
          'DATA PENUTUPAN 30 OKT 2026 · BUKAN SARAN INVESTASI'
        }
      />
      <Sound />
    </Ground>
  );
};

const episode: EpisodeModule = {config: config as EpisodeConfig, captions: captions as Captions, Scene};
export default episode;
