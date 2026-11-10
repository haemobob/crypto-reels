import type {CSSProperties, ReactNode} from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import captions from '../../../episodes/btc-ulang-2021/captions.json';
import config from '../../../episodes/btc-ulang-2021/episode.json';
import {Hi} from '../../components/Headline';
import {HeadlineTrack} from '../../components/HeadlineTrack';
import {useCues} from '../../lib/cues';
import type {EpisodeModule} from '../../lib/episode-module';
import type {Captions, EpisodeConfig} from '../../lib/types';
import {colors} from '../../theme/colors';
import {ease} from '../../theme/motion';
import {fonts} from '../../theme/typography';
import {Sound} from './Sound';
import {Tracing, type Beats} from './Tracing';

// Layout (screen px): micro captions y≈384, tags y≈438, headline zone 470–700, stage 740–1430, source line 1534.
const HEADLINE_Y = 585;
const SOURCE_Y = 1534;
const INK = colors.ink;

const fade = (frame: number, from: number, len = 10) => interpolate(frame, [from, from + len], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease.out});
const fadeOut = (frame: number, at: number, len = 10) => interpolate(frame, [at, at + len], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
const Red = ({children}: {children: ReactNode}) => <span style={{color: colors.negative}}>{children}</span>;
const Green = ({children, light}: {children: ReactNode; light?: boolean}) => <span style={{color: light ? '#0FA37A' : colors.positive}}>{children}</span>;
const Blue = ({children}: {children: ReactNode}) => <span style={{color: colors.blue}}>{children}</span>;
const Graphite = ({children}: {children: ReactNode}) => <span style={{color: '#5B6475'}}>{children}</span>;

const Tag = ({children, color, style}: {children: ReactNode; color: string; style?: CSSProperties}) => (
  <div style={{fontFamily: fonts.mono, fontWeight: 700, fontSize: 20, letterSpacing: '0.08em', color, textTransform: 'uppercase', ...style}}>{children}</div>
);
/** A short qualifier under the headline, on its own pill (never over the chart). */
const Tagline = ({frame, from, to, light, top = HEADLINE_Y + 96, children}: {frame: number; from: number; to: number; light: boolean; top?: number; children: ReactNode}) =>
  frame < from || frame >= to ? null : (
    <div style={{position: 'absolute', left: 70, right: 70, top, textAlign: 'center', opacity: fade(frame, from, 8) * fadeOut(frame, to - 6, 6)}}>
      <Tag
        color={light ? '#3A4252' : colors.light}
        style={{display: 'inline-block', padding: '8px 14px', borderRadius: 8, background: light ? 'rgba(255,255,255,0.9)' : 'rgba(5,11,24,0.85)', boxShadow: light ? '0 0 0 1px #C7CDD6' : '0 0 0 1px #1E3256'}}
      >
        {children}
      </Tag>
    </div>
  );

const OpeningTitle = ({until}: {until: number}) => {
  const frame = useCurrentFrame();
  if (frame >= until) return null;
  const r = interpolate(frame, [-8, 8], [0, 1], {extrapolateRight: 'clamp', easing: ease.out});
  return (
    <div style={{position: 'absolute', left: 40, right: 40, top: HEADLINE_Y - 12, transform: `translateY(calc(-50% + ${(1 - r) * 60}px))`, opacity: interpolate(r, [0, 0.5], [0, 1], {extrapolateRight: 'clamp'}) * fadeOut(frame, until - 6, 6), textAlign: 'center', fontFamily: fonts.heading, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 0.98, color: colors.text, fontSize: 108}}>
      BITCOIN NGULANG
      <br />
      <span style={{color: colors.electric}}>2021?</span>
    </div>
  );
};

/** The closing check: three rows that fill in as they are named, then the condition. */
const CheckCard = ({b, w}: {b: Beats; w: (t: string, n?: number) => number}) => {
  const f = useCurrentFrame();
  if (f < b.payoff) return null;
  const rows = [
    {n: 1, t: 'URUTAN', at: w('urutannya', 1), res: <Green>SAMA ✓</Green>, resAt: w('sama', 1), note: '6 LANGKAH, URUTAN IDENTIK'},
    {n: 2, t: 'UKURAN', at: w('ukurannya', 1), res: <Red>JAUH LEBIH KECIL ✗</Red>, resAt: w('kecil'), note: 'CRASH −54% vs −78% · RALLY +51% vs +105%'},
    {n: 3, t: 'LEVEL', at: w('levelnya'), res: <span style={{color: colors.electric}}>±$75 RB</span>, resAt: b.fail, note: '42% DARI RALLY · ≈ $74.900'},
  ];
  return (
    <div style={{position: 'absolute', left: 90, right: 90, top: 760}}>
      {rows.map((r) => {
        // The three rows wait as faint placeholders, then light up as each is named.
        const a = Math.max(0.28 * fade(f, b.payoff + 6, 12), fade(f, r.at - 4, 10));
        const res = fade(f, r.resAt, 10);
        return (
          <div key={r.n} style={{height: 150, display: 'flex', flexDirection: 'column', justifyContent: 'center', borderBottom: '1px solid #1E3256', opacity: a, transform: `translateY(${(1 - a) * 24}px)`}}>
            {/* Number, title and result share one line, centred on each other. */}
            <div style={{display: 'flex', alignItems: 'center', gap: 26, height: 70}}>
              <div style={{width: 64, height: 64, flexShrink: 0, borderRadius: 32, background: colors.blue, color: '#fff', fontFamily: fonts.mono, fontWeight: 800, fontSize: 32, lineHeight: 1, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{r.n}</div>
              <div style={{flex: 1, fontFamily: fonts.heading, fontWeight: 800, fontSize: 58, lineHeight: 1, color: colors.text, letterSpacing: '-0.01em'}}>{r.t}</div>
              <div style={{fontFamily: fonts.heading, fontWeight: 800, fontSize: 44, lineHeight: 1, opacity: res, letterSpacing: '-0.01em'}}>{r.res}</div>
            </div>
            <div style={{marginLeft: 90, fontFamily: fonts.mono, fontWeight: 600, fontSize: 18, color: '#7F93B3', marginTop: 8, opacity: res, letterSpacing: '0.04em'}}>{r.note}</div>
          </div>
        );
      })}
      <div style={{marginTop: 34, textAlign: 'center', opacity: fade(f, w('bertahan'), 10)}}>
        <div style={{fontFamily: fonts.heading, fontWeight: 800, fontSize: 40, color: colors.text, lineHeight: 1.15}}>
          BERTAHAN DI BAWAH <span style={{color: colors.electric}}>±$75 RB</span>
          <br />→ ANALOGINYA <Red>MELEMAH</Red>
        </div>
        <div style={{fontFamily: fonts.mono, fontWeight: 700, fontSize: 18, color: '#7F93B3', marginTop: 14, letterSpacing: '0.08em'}}>BACAAN KAMI · BUKAN RAMALAN · BUKAN SARAN INVESTASI</div>
      </div>
    </div>
  );
};

const Scene = () => {
  const frame = useCurrentFrame();
  const {cue, word, narrationEnd} = useCues();
  const c = (k: string) => cue(k);
  const b: Beats = {
    hook: c('hook'), claim: c('claim'), check: c('check'), order: c('order'), s1: c('s1'), s2: c('s2'), s3: c('s3'), s4: c('s4'), s5: c('s5'), s6: c('s6'),
    size: c('size'), crash: c('crash'), rally: c('rally'), speed: c('speed'), retrace: c('retrace'), never: c('never'), level: c('level'), now: c('now'),
    ath: c('ath'), one: c('one'), payoff: c('payoff'), verdict: c('verdict'), fail: c('fail'), end: narrationEnd,
  };
  const w = (t: string, n = 0) => word(t, n);

  // Ground: navy for the claim, the light table for the check, navy again for the verdict.
  const toLight = interpolate(frame, [b.check, b.check + 3, b.check + 5, b.check + 9], [0, 0.85, 0.6, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const toNavy = interpolate(frame, [b.payoff - 4, b.payoff + 6], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease.inOut});
  const lightAmt = toLight * (1 - toNavy);
  const light = frame >= b.check && frame < b.payoff;

  return (
    <AbsoluteFill style={{backgroundColor: colors.bg}}>
      <AbsoluteFill style={{backgroundColor: colors.offWhite, opacity: lightAmt}} />
      <Tracing b={b} />
      <OpeningTitle until={b.check - 1} />
      <Tagline frame={frame} from={b.claim} to={b.check} light={false} top={HEADLINE_Y + 120}>
        KLAIM VIRAL: “DIP TERAKHIR SEBELUM ATH”
      </Tagline>

      {/* Headlines on the light table (ink). */}
      <HeadlineTrack
        centerY={HEADLINE_Y}
        until={b.payoff - 6}
        color={INK}
        cues={[
          {from: b.check, content: <>CEK PAKAI <Blue>DATA</Blue></>, size: 100},
          {from: b.order, content: <>URUTANNYA <Blue>SAMA</Blue></>, size: 100},
          {from: b.size, content: <>TAPI <Red>UKURANNYA</Red> BEDA</>, size: 86},
          {from: b.crash, content: <>CRASH: <Graphite>DULU</Graphite> <Red>−78%</Red><br /><Blue>SEKARANG</Blue> <Red>−54%</Red></>, size: 74},
          {from: b.rally, content: <>RALLY: <Graphite>DULU</Graphite> <Green light>+105%</Green><br /><Blue>SEKARANG</Blue> <Green light>+51%</Green></>, size: 74},
          {from: b.speed, content: <>HAMPIR <Blue>3× LEBIH CEPAT</Blue></>, size: 82},
          {from: b.retrace, content: <>2023: BERHENTI<br />DI <Red>42%</Red> DARI RALLY</>, size: 78},
          {from: b.never, content: <>NGGAK PERNAH<br /><Graphite>SEMURAH ITU</Graphite> LAGI</>, size: 80},
          {from: b.level, content: <>42% SEKARANG<br />≈ <Blue>$74.900</Blue></>, size: 86},
          {from: b.now, content: <>BITCOIN <Blue>LAGI DI SITU</Blue></>, size: 82},
          {from: b.ath, content: <>ATH BARU:<br /><Graphite>6 BULAN</Graphite> KEMUDIAN</>, size: 84},
          {from: b.one, content: <><Red>1 CONTOH</Red> ≠ ATURAN</>, size: 90},
        ]}
      />
      <Tagline frame={frame} from={b.s6 + 6} to={b.size} light top={HEADLINE_Y + 118}>DOUBLE TOP → CRASH → MANTUL → KAPITULASI → MANTUL → LOW</Tagline>
      <Tagline frame={frame} from={b.size + 30} to={b.crash} light top={HEADLINE_Y + 118}>DUA CHART, SATU PENGGARIS · DISEJAJARKAN DI LOW TERAKHIR</Tagline>
      <Tagline frame={frame} from={b.retrace + 30} to={b.never} light top={HEADLINE_Y + 112}>13 JUL → 11 SEP 2023 · $31.804 → $24.901</Tagline>
      <Tagline frame={frame} from={b.level + 30} to={b.now} light top={HEADLINE_Y + 112}>RALLY 2026: $57.800 → $87.396 · BALIK 42%</Tagline>
      <Tagline frame={frame} from={b.now + 10} to={b.ath} light top={HEADLINE_Y + 118}>SEMPAT LEBIH DALAM: 47% (8 NOV)</Tagline>
      <Tagline frame={frame} from={b.ath + 36} to={b.payoff} light top={HEADLINE_Y + 112}>SATU SIKLUS DULU ≠ JAMINAN SIKLUS SEKARANG</Tagline>

      {/* The verdict, back on navy. */}
      <HeadlineTrack centerY={HEADLINE_Y} until={narrationEnd + 18} cues={[{from: b.payoff, content: <>CEK <Hi>3 HAL</Hi></>, size: 120}]} />
      <CheckCard b={b} w={w} />

      <div style={{position: 'absolute', left: 90, right: 90, top: SOURCE_Y, textAlign: 'center', fontFamily: fonts.mono, fontWeight: 500, fontSize: 18, letterSpacing: '0.03em', color: light ? '#5A6475' : '#7F93B3'}}>
        {frame < b.payoff ? 'BINANCE BTC/USDT · HARIAN · S/D 9 NOV 2026' : 'DATA: BINANCE BTC/USDT HARIAN · S/D 9 NOV 2026'}
      </div>
      <Sound />
    </AbsoluteFill>
  );
};

const cap = captions as Captions;
const F = (k: string) => Math.round((cap.cues as Record<string, number>)[k] * 30);
const episode: EpisodeModule = {
  config: config as EpisodeConfig,
  captions: cap,
  Scene,
  // The corner logo needs a dark ground: hidden while the light table is on.
  logoHide: [[F('check'), F('payoff') + 4]],
};
export default episode;
