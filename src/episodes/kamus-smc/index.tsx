import type {CSSProperties, ReactNode} from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import captions from '../../../episodes/kamus-smc/captions.json';
import config from '../../../episodes/kamus-smc/episode.json';
import {Ground} from '../../components/Ground';
import {Hi} from '../../components/Headline';
import {HeadlineTrack} from '../../components/HeadlineTrack';
import {useCues} from '../../lib/cues';
import type {EpisodeModule} from '../../lib/episode-module';
import type {Captions, EpisodeConfig} from '../../lib/types';
import {colors} from '../../theme/colors';
import {ease} from '../../theme/motion';
import {fonts} from '../../theme/typography';
import {ChartWorld, type ChartBeats} from './Chart';
import {Sound} from './Sound';

// Layout (screen px): micro captions y≈384, stage index y≈438, headline zone 470–700, stage 740–1430, source line 1534.
const HEADLINE_Y = 585;
const TAG_Y = 438;
const SOURCE_Y = 1534;

const fade = (frame: number, from: number, len = 10) => interpolate(frame, [from, from + len], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease.out});
const fadeOut = (frame: number, at: number, len = 10) => interpolate(frame, [at, at + len], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

const Red = ({children}: {children: ReactNode}) => <span style={{color: colors.negative}}>{children}</span>;
const Green = ({children}: {children: ReactNode}) => <span style={{color: colors.positive}}>{children}</span>;
const Tag = ({children, color = colors.light, style}: {children: ReactNode; color?: string; style?: CSSProperties}) => (
  <div style={{fontFamily: fonts.mono, fontWeight: 700, fontSize: 22, letterSpacing: '0.12em', color, textTransform: 'uppercase', ...style}}>{children}</div>
);

/** A one-line qualifier under the headline, at the moment of the claim. */
const Tagline = ({frame, from, to, color = colors.muted, children}: {frame: number; from: number; to: number; color?: string; children: ReactNode}) =>
  frame < from || frame >= to ? null : (
    <div style={{position: 'absolute', left: 80, right: 80, top: HEADLINE_Y + 92, textAlign: 'center', opacity: fade(frame, from, 8) * fadeOut(frame, to - 6, 6)}}>
      <Tag color={color} style={{display: 'inline-block', fontSize: 20, letterSpacing: '0.08em', padding: '8px 14px', borderRadius: 8, background: 'rgba(5,11,24,0.82)', boxShadow: '0 0 0 1px #1E3256'}}>{children}</Tag>
    </div>
  );

/** The five stages as an index in the tag line: the current one lit, the done ones ticked. */
const STAGES = ['STRUKTUR', 'PERUBAHAN', 'LIQUIDITY', 'ENTRY', 'MAHAL/MURAH'];
const StageIndex = ({frame, from, starts, all}: {frame: number; from: number; starts: number[]; all: number}) => {
  if (frame < from) return null;
  const cur = starts.findLastIndex((s) => frame >= s);
  return (
    <div style={{position: 'absolute', left: 30, right: 30, top: TAG_Y - 10, display: 'flex', justifyContent: 'center', gap: 12, opacity: fade(frame, from, 10)}}>
      {STAGES.map((s, k) => {
        const lit = frame >= all ? 1 : k === cur ? 1 : 0;
        const done = frame < all && k < cur;
        const on = fade(frame, from + k * 3, 8);
        return (
          <div key={s} style={{display: 'flex', alignItems: 'center', gap: 6, opacity: on * (lit ? 1 : done ? 0.62 : 0.36)}}>
            <div style={{width: 30, height: 30, borderRadius: 7, background: lit ? colors.blue : 'transparent', boxShadow: `0 0 0 2px ${lit || done ? colors.blue : '#2A3E63'}`, color: colors.text, fontFamily: fonts.mono, fontWeight: 700, fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{done ? '✓' : k + 1}</div>
            <div style={{fontFamily: fonts.mono, fontWeight: 700, fontSize: 19, letterSpacing: '0.04em', color: lit ? colors.text : colors.muted}}>{s}</div>
          </div>
        );
      })}
    </div>
  );
};

/** Centred opening title, rising in from below on frame 0. */
const OpeningTitle = ({until}: {until: number}) => {
  const frame = useCurrentFrame();
  if (frame >= until) return null;
  const r = interpolate(frame, [-8, 8], [0, 1], {extrapolateRight: 'clamp', easing: ease.out});
  return (
    <div style={{position: 'absolute', left: 40, right: 40, top: HEADLINE_Y, transform: `translateY(calc(-50% + ${(1 - r) * 60}px))`, opacity: interpolate(r, [0, 0.5], [0, 1], {extrapolateRight: 'clamp'}) * fadeOut(frame, until - 6, 6), textAlign: 'center', fontFamily: fonts.heading, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.0, color: colors.text}}>
      <div style={{fontSize: 96}}><span style={{color: colors.electric}}>18</span> ISTILAH SMC,</div>
      <div style={{fontSize: 80}}>1 CHART BITCOIN</div>
    </div>
  );
};

const SourceLine = ({text}: {text: string}) => (
  <div style={{position: 'absolute', left: 90, right: 90, top: SOURCE_Y, textAlign: 'center', fontFamily: fonts.mono, fontWeight: 500, fontSize: 18, letterSpacing: '0.03em', color: '#7F93B3'}}>{text}</div>
);

const Scene = () => {
  const frame = useCurrentFrame();
  const {cue, word, narrationEnd} = useCues();
  const c = (k: string) => cue(k);
  const b: ChartBeats = {
    hook: c('hook'), chart: c('chart'), count: c('count'), s1: c('s1'), up: c('up'), s2: c('s2'), choch: c('choch'), s3: c('s3'), ssl: c('ssl'), bsl: c('bsl'), eqh: c('eqh'),
    sweep: c('sweep'), idm: c('idm'), s4: c('s4'), fvg: c('fvg'), mitig: c('mitig'), open: c('open'), s5: c('s5'), prem: c('prem'), disc: c('disc'), aug: c('aug'), payoff: c('payoff'),
    caveat: c('caveat'), end: narrationEnd,
    wOrder: word('order', 0), wFvg: word('fvg', 0), wSweep0: word('sweep', 0), wPusing: word('pusing'), wTutupBos: word('tutup', 0), wNembus: word('nembus'),
    wTutup: word('tutup', 1), wSweep: word('sweep', 1), wStruktur: word('struktur', 1), wLiq: word('liquidity', 1), wSweepP: word('sweep', 2), wEntry: word('entry', 2),
  };
  const lower = word('lower', 0), brk = word('break'), orderBlock = word('order', 1), equil = word('equilibrium');

  return (
    <Ground polarity="navy">
      <ChartWorld b={b} />

      <OpeningTitle until={b.count - 2} />
      <StageIndex frame={frame} from={b.count + 2} starts={[b.s1, b.s2, b.s3, b.s4, b.s5]} all={b.payoff} />
      <HeadlineTrack
        centerY={HEADLINE_Y}
        until={narrationEnd + 18}
        cues={[
          {from: b.count, content: <><Hi>5 TAHAP</Hi>, BERURUTAN</>, size: 84},
          {from: b.s1, content: <>1 · STRUKTUR</>, size: 88},
          {from: lower, content: <><Red>LOWER HIGH</Red> · <Red>LOWER LOW</Red></>, size: 66},
          {from: b.up, content: <><Green>HIGHER HIGH</Green> · <Green>HIGHER LOW</Green></>, size: 62},
          {from: b.s2, content: <>2 · TANDA PERUBAHAN</>, size: 76},
          {from: brk, content: <><Hi>BOS</Hi> = TEMBUS SEARAH TREND</>, size: 68},
          {from: b.choch, content: <><Hi><span style={{textTransform: 'none'}}>CHoCH</span></Hi> = TEMBUS LAWAN ARAH</>, size: 68},
          {from: b.s3, content: <>3 · LIQUIDITY = <Red>TUMPUKAN STOP</Red></>, size: 66},
          {from: b.ssl, content: <><Red>SELL SIDE</Red>: DI BAWAH LOW</>, size: 72},
          {from: b.bsl, content: <><Red>BUY SIDE</Red>: DI ATAS HIGH</>, size: 72},
          {from: b.eqh, content: <><Hi>EQUAL HIGH</Hi> = MAGNET</>, size: 78},
          {from: b.sweep, content: <>1 JULI: TEMBUS, LALU BALIK</>, size: 70},
          {from: b.wSweep - 2, content: <>ITU <Hi>SWEEP</Hi></>, size: 104},
          {from: b.idm, content: <><Hi>INDUCEMENT</Hi> = JEBAKAN KECIL</>, size: 64},
          {from: b.s4, content: <>4 · AREA ENTRY</>, size: 88},
          {from: orderBlock, content: <><Hi>ORDER BLOCK</Hi></>, size: 96},
          {from: b.fvg, content: <><Hi>FVG</Hi> = CELAH HARGA</>, size: 84},
          {from: b.mitig, content: <><Hi>MITIGATION</Hi> = BALIK KE CELAH</>, size: 64},
          {from: b.open, content: <>CELAH INI <Red>BELUM TERISI</Red></>, size: 74},
          {from: b.s5, content: <>5 · MAHAL ATAU MURAH</>, size: 76},
          {from: equil, content: <><Hi>EQUILIBRIUM</Hi> = 50%</>, size: 84},
          {from: b.prem, content: <><Red>PREMIUM</Red> = MAHAL</>, size: 88},
          {from: b.disc, content: <><Green>DISCOUNT</Green> = MURAH</>, size: 88},
          {from: b.aug, content: <>1 AGU: MANTUL DI <Green>DISKON</Green></>, size: 72},
          {from: b.payoff, content: <>STRUKTUR → LIQUIDITY<br />→ SWEEP → <Hi>ENTRY</Hi></>, size: 70},
          {from: b.caveat, content: <>CARA BACA, BUKAN JAMINAN.<br /><Hi>STOP LOSS</Hi> TETAP WAJIB.</>, size: 64},
        ]}
      />
      {/* Qualifiers at the claim */}
      <Tagline frame={frame} from={brk + 8} to={b.choch - 2}>TUTUP DI BAWAH LOW 18 JUN, SEARAH TREND TURUN</Tagline>
      <Tagline frame={frame} from={b.choch + 8} to={b.s3 - 2}>TUTUP DI ATAS HIGH 6 JUL: TANDA AWAL, BUKAN KEPASTIAN</Tagline>
      <Tagline frame={frame} from={b.s3 + 8} to={b.sweep - 2} color={colors.negative}>ZONA STOP = PERKIRAAN (ILUSTRASI), BUKAN DATA ORDER</Tagline>
      <Tagline frame={frame} from={b.idm + 8} to={b.s4 - 2}>BACAAN KAMI · TIAP TRADER BISA BEDA</Tagline>
      <Tagline frame={frame} from={b.fvg + 8} to={b.mitig - 2}>CELAH ANTARA HIGH 18 AGU & LOW 20 AGU</Tagline>
      <Tagline frame={frame} from={b.mitig + 6} to={b.open - 2}>JALUR BALIK = ILUSTRASI</Tagline>
      <Tagline frame={frame} from={b.open + 8} to={b.s5 - 2}>SERING DIISI, TAPI TIDAK SELALU</Tagline>
      <Tagline frame={frame} from={b.s5 + 8} to={b.prem - 2}>RANGE: LOW 1 JUL → HIGH 21 JUL</Tagline>
      <SourceLine text="BINANCE BTC/USDT · HARIAN · 20 MEI – 28 OKT 2026 · CONTOH PEMBACAAN, BUKAN SINYAL" />
      <Sound />
    </Ground>
  );
};

const episode: EpisodeModule = {config: config as EpisodeConfig, captions: captions as Captions, Scene};
export default episode;
