import type {CSSProperties, ReactNode} from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import captions from '../../../episodes/jpmorgan-bitcoin/captions.json';
import config from '../../../episodes/jpmorgan-bitcoin/episode.json';
import btcWeekly from '../../../public/episodes/jpmorgan-bitcoin/btc-weekly-2020-2026.json';
import {Candles, scaleFor, type Candle, type ChartFrame} from '../../components/CandleChart';
import {Ground} from '../../components/Ground';
import {Hi} from '../../components/Headline';
import {HeadlineTrack} from '../../components/HeadlineTrack';
import {useCues} from '../../lib/cues';
import type {EpisodeModule} from '../../lib/episode-module';
import type {Captions, EpisodeConfig} from '../../lib/types';
import {colors} from '../../theme/colors';
import {ease} from '../../theme/motion';
import {fonts} from '../../theme/typography';
import {ArenaWorld} from './Arena';
import {FanWorld} from './Fan';
import {RingWorld} from './Ring';
import {Sound} from './Sound';

// Layout (screen px): micro captions y≈384, tags y≈438, headline zone 470–700, stage 720–1450, source line 1534.
const HEADLINE_Y = 585;
const TAG_Y = 438;
const SOURCE_Y = 1534;

const fade = (frame: number, from: number, len = 10) => interpolate(frame, [from, from + len], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease.out});
const fadeOut = (frame: number, at: number, len = 10) => interpolate(frame, [at, at + len], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
const cueFrame = (name: keyof typeof captions.cues) => Math.round(captions.cues[name] * 30);

const Red = ({children}: {children: ReactNode}) => <span style={{color: colors.negative}}>{children}</span>;
const Green = ({children}: {children: ReactNode}) => <span style={{color: colors.positive}}>{children}</span>;

const Tag = ({children, color = colors.light, style}: {children: ReactNode; color?: string; style?: CSSProperties}) => (
  <div style={{fontFamily: fonts.mono, fontWeight: 700, fontSize: 22, letterSpacing: '0.12em', color, textTransform: 'uppercase', ...style}}>{children}</div>
);

/** A small label in the clear band between the micro captions and the headline. */
const TopTag = ({frame, from, to, color = colors.light, children}: {frame: number; from: number; to: number; color?: string; children: ReactNode}) =>
  frame < from || frame >= to ? null : (
    <Tag color={color} style={{position: 'absolute', left: 90, right: 90, top: TAG_Y, textAlign: 'center', opacity: fade(frame, from, 8) * fadeOut(frame, to - 6, 6)}}>{children}</Tag>
  );

/** A one-line qualifier under the headline, at the moment of the claim. */
const Tagline = ({frame, from, to, color = colors.muted, light = false, children}: {frame: number; from: number; to: number; color?: string; light?: boolean; children: ReactNode}) =>
  frame < from || frame >= to ? null : (
    <div style={{position: 'absolute', left: 80, right: 80, top: HEADLINE_Y + 92, textAlign: 'center', opacity: fade(frame, from, 8) * fadeOut(frame, to - 6, 6)}}>
      <Tag color={color} style={{display: 'inline-block', fontSize: 20, letterSpacing: '0.08em', padding: '8px 14px', borderRadius: 8, background: light ? 'rgba(255,255,255,0.86)' : 'rgba(5,11,24,0.82)', boxShadow: light ? '0 0 0 1px #c9d2e3' : '0 0 0 1px #1E3256'}}>{children}</Tag>
    </div>
  );

/** Source line under the stage: what is shown, who says so, when. */
const SourceLine = ({text, light = false}: {text: string; light?: boolean}) => (
  <div style={{position: 'absolute', left: 90, right: 90, top: SOURCE_Y, textAlign: 'center', fontFamily: fonts.mono, fontWeight: 500, fontSize: 18, letterSpacing: '0.03em', color: light ? '#5A6B85' : '#7F93B3'}}>{text}</div>
);

/** Part of a headline that arrives on its spoken word; its slot is kept, so the line doesn't jump. */
const SpokenAt = ({at, children}: {at: number; children: ReactNode}) => {
  const frame = useCurrentFrame();
  return <span style={{opacity: fade(frame, at, 6)}}>{children}</span>;
};

/** Centred opening title, rising in: the contradiction in five words. */
const OpeningTitle = ({until}: {until: number}) => {
  const frame = useCurrentFrame();
  if (frame >= until) return null;
  const r = interpolate(frame, [-8, 8], [0, 1], {extrapolateRight: 'clamp', easing: ease.out});
  return (
    <div style={{position: 'absolute', left: 40, right: 40, top: HEADLINE_Y, transform: `translateY(calc(-50% + ${(1 - r) * 60}px))`, opacity: interpolate(r, [0, 0.5], [0, 1], {extrapolateRight: 'clamp'}) * fadeOut(frame, until - 6, 6), textAlign: 'center', fontFamily: fonts.heading, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.0, color: colors.text}}>
      <div style={{fontSize: 84}}>DULU “PENIPUAN”.</div>
      <div style={{fontSize: 100, color: colors.electric}}>SEKARANG JUARA?</div>
    </div>
  );
};

/** The 2017 word, stamped across the coin; it tears off when the forecast arrives. */
const FraudStamp = ({now}: {now: number}) => {
  const frame = useCurrentFrame();
  if (frame >= now) return null;
  const slam = interpolate(frame, [2, 7], [1.5, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease.in});
  const tear = interpolate(frame, [now - 10, now], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease.in});
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: 1110, display: 'flex', justifyContent: 'center', opacity: fade(frame, 2, 4) * (1 - tear)}}>
      <div style={{transform: `translateY(-50%) rotate(${-12 + 25 * tear}deg) scale(${slam + 0.4 * tear}) translateX(${tear * 260}px)`, padding: '10px 34px', border: `8px solid ${colors.negative}`, borderRadius: 14, color: colors.negative, fontFamily: fonts.heading, fontWeight: 800, fontSize: 112, letterSpacing: '0.06em', background: 'rgba(255,82,99,0.06)', boxShadow: `inset 0 0 0 4px rgba(255,82,99,0.35)`}}>FRAUD</div>
    </div>
  );
};

// ---- Real chart (2D, off-white): Bitcoin's own ride, Jan 2025 → Oct 2026 ----
type Raw = [number, number, number, number, number];
const START = Date.UTC(2025, 0, 6) / 1000;
const CANDLES: Candle[] = (btcWeekly.candles as Raw[])
  .filter((r) => r[0] >= START)
  .map((r, i) => ({t: i, o: r[1], h: r[2], l: r[3], c: r[4]}));
const PEAK = CANDLES.reduce((m, k) => (k.h > m.h ? k : m));
const LOW = CANDLES.filter((k) => k.t > PEAK.t).reduce((m, k) => (k.l < m.l ? k : m));
const CHART: ChartFrame = {x0: 120, y0: 790, width: 820, height: 600, tMin: 0, tMax: CANDLES.length - 1, pMin: 48000, pMax: 140000};
const usdK = (p: number) => `$${(p / 1000).toFixed(1).replace('.', ',')}K`;

const RealChart = ({real, low}: {real: number; low: number}) => {
  const frame = useCurrentFrame();
  const s = scaleFor(CHART);
  const reveal = interpolate(frame, [real + 2, real + 52], [0, CANDLES.length + 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease.inOut});
  const peakOn = fade(frame, real + 30, 8);
  const lowOn = fade(frame, low - 2, 8);
  const brk = fade(frame, low + 8, 10);
  const yP = s.y(PEAK.h), yL = s.y(LOW.l), xB = CHART.x0 + CHART.width + 6;
  const drop = Math.round((1 - LOW.l / PEAK.h) * 100);
  return (
    <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
      {[60000, 80000, 100000, 120000].map((p) => (
        <g key={p}>
          <line x1={CHART.x0} x2={CHART.x0 + CHART.width} y1={s.y(p)} y2={s.y(p)} stroke="#c9d2e3" strokeWidth={1.5} />
          <text x={CHART.x0 - 10} y={s.y(p) + 6} textAnchor="end" fill="#7a879b" fontFamily={fonts.mono} fontSize={18}>{`$${p / 1000}K`}</text>
        </g>
      ))}
      <Candles candles={CANDLES} frame={CHART} reveal={reveal} />
      <g opacity={peakOn}>
        <circle cx={s.x(PEAK.t)} cy={yP} r={9} fill={colors.blue} />
        <text x={s.x(PEAK.t) - 14} y={yP - 22} textAnchor="end" fill={colors.ink} fontFamily={fonts.mono} fontWeight={700} fontSize={26}>{`${usdK(PEAK.h)} · OKT 2025`}</text>
      </g>
      <g opacity={lowOn}>
        <circle cx={s.x(LOW.t)} cy={yL} r={9} fill={colors.negative} />
        <text x={s.x(LOW.t)} y={yL + 44} textAnchor="middle" fill={colors.negative} fontFamily={fonts.mono} fontWeight={700} fontSize={26}>{`${usdK(LOW.l)} · JUN 2026`}</text>
      </g>
      <g opacity={brk}>
        <line x1={s.x(PEAK.t)} x2={xB} y1={yP} y2={yP} stroke={colors.negative} strokeWidth={2} strokeDasharray="6 6" />
        <line x1={s.x(LOW.t)} x2={xB} y1={yL} y2={yL} stroke={colors.negative} strokeWidth={2} strokeDasharray="6 6" />
        <line x1={xB} x2={xB} y1={yP} y2={yL} stroke={colors.negative} strokeWidth={4} />
        {/* In the empty band above the recent candles */}
        <text x={xB - 14} y={s.y(108000)} textAnchor="end" fill={colors.negative} fontFamily={fonts.heading} fontWeight={800} fontSize={58}>{`−${drop}%`}</text>
      </g>
    </svg>
  );
};

const Scene = () => {
  const frame = useCurrentFrame();
  const {cue, word, narrationEnd} = useCues();
  const c = (k: string) => cue(k);
  const arena = {
    now: c('now'), report: c('report'), race: c('race'), stocks: c('stocks'), gold: c('gold'), catch: c('catch'), vol: c('vol'),
    drag: c('drag'), down: c('down'), up: c('up'), loss: c('loss'), avg: c('avg'), keep: c('keep'), range: c('range'),
    payoff: c('payoff'), ticket: c('ticket'), check: c('check'), end: narrationEnd,
  };
  const REAL = c('real'), LOWC = c('low'), MODEL = c('model');
  // "…jarang dibahas: lima puluh lima persen": the 55 is shown when it is said.
  const FIFTY = word('lima', 3);
  const light = frame >= REAL && frame < MODEL;

  return (
    <Ground polarity="dark">
      {/* Each next world mounts a few frames early underneath the current one, so its assets are ready at the cut */}
      {frame >= arena.range - 2 && frame < REAL + 2 && <FanWorld b={{range: arena.range, bull: c('bull'), bear: c('bear'), real: REAL}} />}
      {(frame < arena.range || frame >= arena.payoff - 2) && <ArenaWorld b={arena} />}
      {frame >= MODEL - 2 && frame < arena.payoff + 2 && <RingWorld b={{model: MODEL, payoff: arena.payoff}} />}
      {light && <AbsoluteFill style={{background: colors.offWhite}} />}
      {light && <RealChart real={REAL} low={LOWC} />}

      <FraudStamp now={arena.now} />
      <OpeningTitle until={arena.report - 2} />
      <HeadlineTrack
        centerY={HEADLINE_Y}
        until={REAL}
        cues={[
          {from: arena.report, content: <>PERTAMA KALI ADA <Hi>BITCOIN</Hi></>, size: 74},
          {from: arena.race, content: <>PROYEKSI <Hi>RETURN</Hi> PER TAHUN</>, size: 68},
          {from: arena.catch, content: <>ANGKA KEDUA: <SpokenAt at={FIFTY}><Red>55%</Red></SpokenAt></>, size: 92},
          {from: arena.vol, content: <><Red>55%</Red> = VOLATILITAS</>, size: 84},
          {from: arena.drag, content: <>NAIK-TURUN <Red>MAKAN HASIL</Red></>, size: 76},
          {from: arena.loss, content: <>−50% LALU +50% = <Red>−25%</Red></>, size: 72},
          {from: arena.avg, content: <>RATA-RATA: 20,9% PER TAHUN</>, size: 68},
          {from: arena.keep, content: <>YANG TERSISA: <Hi>10%</Hi></>, size: 84},
          {from: arena.range, content: <>RP10 JUTA, 10 TAHUN…</>, size: 80},
          {from: c('bear'), content: <><Green>RP48 JT</Green> ATAU <Red>RP3,6 JT</Red></>, size: 80},
        ]}
      />
      <HeadlineTrack
        centerY={HEADLINE_Y}
        until={MODEL}
        color={colors.ink}
        cues={[
          {from: REAL + 2, content: <>INI <span style={{color: colors.blue}}>BUKAN TEORI</span></>, size: 84},
          {from: LOWC, content: <>$126K → <span style={{color: colors.negative}}>$58K</span></>, size: 92},
        ]}
      />
      <HeadlineTrack
        centerY={HEADLINE_Y}
        until={narrationEnd + 18}
        cues={[
          {from: MODEL + 2, content: <>JPMORGAN SENDIRI: <Red>BELUM MASUK</Red> PORTOFOLIO</>, size: 64},
          {from: arena.payoff, content: <>RETURN = <Hi>HADIAHNYA</Hi></>, size: 80},
          {from: arena.ticket, content: <><span style={{fontSize: '0.8em'}}>RETURN = <Hi>HADIAHNYA</Hi></span><br />VOLATILITAS =<br /><Red>HARGA TIKETNYA</Red></>, size: 66},
          {from: arena.check, content: <>KALAU TURUN SETENGAH, LO <Hi>KUAT NAHAN?</Hi></>, size: 70},
        ]}
      />
      {/* Qualifiers at the claim */}
      <Tagline frame={frame} from={arena.race + 6} to={arena.catch - 2}>10–15 TAHUN KE DEPAN · DALAM USD · BUKAN JAMINAN</Tagline>
      <Tagline frame={frame} from={arena.vol + 8} to={arena.drag - 2}>SEBERAPA LIAR HARGANYA NAIK-TURUN DALAM SETAHUN</Tagline>
      <Tagline frame={frame} from={arena.keep + 8} to={arena.range - 2}>BESAR-KECILNYA AYUNAN MEMAKAN HASIL MAJEMUK</Tagline>
      <Tagline frame={frame} from={c('bear') + 8} to={REAL - 2}>SIMULASI · TANPA PAJAK, BIAYA & KURS</Tagline>
      <Tagline frame={frame} from={LOWC + 10} to={MODEL - 2} color={colors.ink} light>TURUN LEBIH DARI SEPARUH DALAM 9 BULAN</Tagline>
      <Tagline frame={frame} from={MODEL + 10} to={arena.payoff - 2}>“BITCOIN IS NOT INCLUDED AS AN ALLOCATION”</Tagline>
      <TopTag frame={frame} from={arena.race + 6} to={arena.catch - 2}>PROYEKSI JPMORGAN</TopTag>
      <TopTag frame={frame} from={arena.report + 4} to={arena.race - 2}>J.P. MORGAN ASSET MANAGEMENT · LTCMA 2027</TopTag>
      <TopTag frame={frame} from={FIFTY + 4} to={arena.drag - 2}>JALUR = ILUSTRASI · VOLATILITAS: JPMAM VIA DECRYPT/YAHOO</TopTag>
      <TopTag frame={frame} from={arena.drag + 4} to={arena.avg - 2}>ILUSTRASI</TopTag>
      <TopTag frame={frame} from={arena.range + 4} to={REAL - 2} color={colors.negative}>SIMULASI</TopTag>
      <TopTag frame={frame} from={MODEL + 4} to={arena.payoff - 2}>ILUSTRASI · MODEL 60/40 JPMORGAN</TopTag>
      <TopTag frame={frame} from={arena.payoff + 4} to={narrationEnd + 18}>JALUR = ILUSTRASI</TopTag>
      <SourceLine
        light={light}
        text={
          frame < arena.now ? 'JAMIE DIMON, CEO JPMORGAN, SOAL BITCOIN · CNBC, 12 SEP 2017' :
          frame < arena.report ? 'J.P. MORGAN ASSET MANAGEMENT · LONG-TERM CAPITAL MARKET ASSUMPTIONS 2027 · 19 OKT 2026' :
          frame < arena.race ? '' :
          frame < arena.catch ? 'JPMAM LTCMA 2027: BTC 10%, SAHAM AS LARGE CAP 7,5%, EMAS 5,5% PER TAHUN' :
          frame < arena.avg + 8 ? '' :
          frame < arena.range ? 'RATA-RATA ARITMETIKA 20,9% VS MAJEMUK 10% · JPMAM VIA DECRYPT, 20 OKT 2026' :
          frame < REAL ? 'SKENARIO BTC JPMAM: −9,7% / 10% / 17% PER TAHUN · VIA COINDESK, 20 OKT 2026' :
          frame < MODEL ? 'BINANCE BTC/USDT MINGGUAN · JAN 2025 – 19 OKT 2026' :
          frame < arena.payoff ? 'JPMAM, 19 OKT 2026 · BITCOIN BELUM MASUK MATRIKS UTAMA' : ''
        }
      />
      <Sound />
    </Ground>
  );
};

const episode: EpisodeModule = {
  config: config as EpisodeConfig,
  captions: captions as Captions,
  Scene,
  // The corner logo needs a dark ground: hidden on the off-white chart chapter.
  logoHide: [[cueFrame('real') - 1, cueFrame('model') + 1]],
};
export default episode;
