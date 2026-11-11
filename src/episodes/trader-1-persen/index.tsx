import type {CSSProperties, ReactNode} from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import captions from '../../../episodes/trader-1-persen/captions.json';
import config from '../../../episodes/trader-1-persen/episode.json';
import {Hi} from '../../components/Headline';
import {HeadlineTrack} from '../../components/HeadlineTrack';
import {useCues} from '../../lib/cues';
import type {EpisodeModule} from '../../lib/episode-module';
import type {Captions, EpisodeConfig} from '../../lib/types';
import {colors} from '../../theme/colors';
import {ease} from '../../theme/motion';
import {fonts} from '../../theme/typography';
import {Court, type Beats} from './Court';
import {Cover} from './Cover';
import {Sound} from './Sound';

// Layout (screen px): micro captions y≈384, headline zone 470–700, stage 740–1460, source line 1534.
const HEADLINE_Y = 585;
const SOURCE_Y = 1534;

const fade = (frame: number, from: number, len = 10) => interpolate(frame, [from, from + len], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease.out});
const fadeOut = (frame: number, at: number, len = 10) => interpolate(frame, [at, at + len], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
const Red = ({children}: {children: ReactNode}) => <span style={{color: colors.negative}}>{children}</span>;
const Green = ({children}: {children: ReactNode}) => <span style={{color: colors.positive}}>{children}</span>;

const Tag = ({children, style}: {children: ReactNode; style?: CSSProperties}) => (
  <div style={{display: 'inline-block', fontFamily: fonts.mono, fontWeight: 700, fontSize: 20, letterSpacing: '0.08em', color: colors.light, padding: '8px 14px', borderRadius: 8, background: 'rgba(5,11,24,0.85)', boxShadow: '0 0 0 1px #1E3256', ...style}}>{children}</div>
);

const OpeningTitle = ({until}: {until: number}) => {
  const frame = useCurrentFrame();
  if (frame >= until) return null;
  const r = interpolate(frame, [-8, 8], [0, 1], {extrapolateRight: 'clamp', easing: ease.out});
  return (
    <div style={{position: 'absolute', left: 40, right: 40, top: HEADLINE_Y - 10, transform: `translateY(calc(-50% + ${(1 - r) * 60}px))`, opacity: interpolate(r, [0, 0.5], [0, 1], {extrapolateRight: 'clamp'}) * fadeOut(frame, until - 6, 6), textAlign: 'center', fontFamily: fonts.heading, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 0.98, color: colors.text, fontSize: 112}}>
      <span style={{color: colors.electric}}>1%</span> YANG NGGAK
      <br />
      NYERAH?
    </div>
  );
};

const Scene = () => {
  const frame = useCurrentFrame();
  const {cue, word, narrationEnd} = useCues();
  const c = (k: string) => cue(k);
  const b: Beats = {
    hook: c('hook'), study: c('study'), one: c('one'), mid: c('mid'), long: c('long'), trend: c('trend'), learn: c('learn'), payoff: c('payoff'), end: narrationEnd,
    wCount: word('dua', 0),
  };
  return (
    <AbsoluteFill style={{backgroundColor: colors.bg}}>
      <Court b={b} />
      <OpeningTitle until={b.study - 1} />
      {frame >= 30 && frame < b.study && (
        <div style={{position: 'absolute', left: 0, right: 0, top: HEADLINE_Y + 116, textAlign: 'center', opacity: fade(frame, 30, 10) * fadeOut(frame, b.study - 8, 8)}}>
          <Tag>KLAIM VIRAL · ANGKANYA TANPA SUMBER</Tag>
        </div>
      )}
      <HeadlineTrack
        centerY={HEADLINE_Y}
        until={narrationEnd + 18}
        cues={[
          {from: b.study, content: <>ADA YANG <Hi>NGECEK</Hi></>, size: 110},
          {from: b.one, content: <>SEHARI: <Green>29,8%</Green> UNTUNG</>, size: 86},
          {from: b.mid, content: <>101–200 HARI: 6,8%</>, size: 86},
          {from: b.long, content: <>&gt;300 HARI: CUMA <Red>3%</Red></>, size: 86},
          {from: b.trend, content: <>MAKIN LAMA, MAKIN<br />SEDIKIT YANG <Red>UNTUNG</Red></>, size: 80},
          {from: b.learn, content: <>NGGAK ADA BUKTI<br /><Hi>MAKIN JAGO</Hi></>, size: 88},
          {from: b.payoff, content: <>SEBELUM<br />“JANGAN <Hi>NYERAH</Hi>”</>, size: 96},
        ]}
      />
      <div style={{position: 'absolute', left: 90, right: 90, top: SOURCE_Y, textAlign: 'center', fontFamily: fonts.mono, fontWeight: 500, fontSize: 18, letterSpacing: '0.03em', color: '#7F93B3', lineHeight: 1.4}}>
        {frame < b.study ? '' : 'STUDI: CHAGUE, DE-LOSSO & GIOVANNETTI (FEA-USP) · DATA CVM BRASIL 2013–2015 · FUTURES INDEKS SAHAM, BUKAN KRIPTO'}
      </div>
      <Sound />
    </AbsoluteFill>
  );
};

const episode: EpisodeModule = {config: config as EpisodeConfig, captions: captions as Captions, Scene, Cover};
export default episode;
