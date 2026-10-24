import type {CSSProperties, ReactNode} from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import captions from '../../../episodes/bitcoin-shutdown/captions.json';
import config from '../../../episodes/bitcoin-shutdown/episode.json';
import {Ground} from '../../components/Ground';
import {Hi} from '../../components/Headline';
import {HeadlineTrack} from '../../components/HeadlineTrack';
import {useCues} from '../../lib/cues';
import type {EpisodeModule} from '../../lib/episode-module';
import type {Captions, EpisodeConfig} from '../../lib/types';
import {colors} from '../../theme/colors';
import {ease} from '../../theme/motion';
import {fonts} from '../../theme/typography';
import {Img, staticFile} from 'remotion';
import {ColdOpenWorld} from './worlds/ColdOpen';
import {NewsServerWorld} from './worlds/NewsServer';
import {PaymentsWorld} from './worlds/Payments';
import {NetworkWorld} from './worlds/Network';
import {RevealWorld} from './worlds/Reveal';
import {SpaceWorld} from './worlds/Space';
import {FinalWorld} from './worlds/Final';
import {Sound} from './Sound';

// Layout (screen px): micro captions y≈384, headline zone 470–700, stage 720–1450, tags ~1470, source line 1534.
export const HEADLINE_Y = 585;
export const SOURCE_Y = 1534;
/** Labels (SIMULASI / ILUSTRASI) sit in the clear band between the micro captions and the headline zone. */
export const TAG_Y = 438;
/** Lower-third headline centre for device close-ups (above Instagram's bottom UI). */
export const LOWER_Y = 1478;

export const fade = (frame: number, from: number, len = 10) =>
  interpolate(frame, [from, from + len], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease.out});
export const fadeOut = (frame: number, at: number, len = 10) =>
  interpolate(frame, [at, at + len], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
const cueFrame = (name: keyof typeof captions.cues) => Math.round(captions.cues[name] * 30);

/** Small mono tag (SIMULASI / ILUSTRASI / qualifiers) in clear space. */
export const Tag = ({children, color = colors.light, style}: {children: ReactNode; color?: string; style?: CSSProperties}) => (
  <div style={{fontFamily: fonts.mono, fontWeight: 700, fontSize: 22, letterSpacing: '0.12em', color, textTransform: 'uppercase', ...style}}>{children}</div>
);

const OpeningTitle = ({shut, until}: {shut: number; until: number}) => {
  const frame = useCurrentFrame();
  if (frame >= until) return null;
  const r = interpolate(frame, [-8, 8], [0, 1], {extrapolateRight: 'clamp', easing: ease.out});
  const punch = interpolate(frame, [shut, shut + 3, shut + 10], [0, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const glitch = frame >= shut && frame < shut + 6 ? (frame % 2 ? 7 : -5) : 0;
  return (
    <div style={{position: 'absolute', left: 40, right: 40, top: HEADLINE_Y, transform: `translateY(calc(-50% + ${(1 - r) * 60}px))`, opacity: interpolate(r, [0, 0.5], [0, 1], {extrapolateRight: 'clamp'}) * fadeOut(frame, until - 6, 6), textAlign: 'center', fontFamily: fonts.heading, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 0.98, color: colors.text}}>
      <div style={{fontSize: 78}}>BITCOIN AKAN SEGERA</div>
      <div style={{fontSize: 132, color: colors.negative, transform: `translateX(${glitch}px) scale(${1 + 0.06 * punch})`, textShadow: punch > 0 ? `${-glitch}px 0 0 rgba(41,151,255,0.8)` : 'none'}}>SHUTDOWN?</div>
    </div>
  );
};

const ConnectionLost = ({at, until}: {at: number; until: number}) => {
  const frame = useCurrentFrame();
  if (frame < at || frame >= until) return null;
  const on = (frame - at) % 8 < 6 ? 1 : 0.35;
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: 1452, display: 'flex', justifyContent: 'center', opacity: on * fade(frame, at, 3) * fadeOut(frame, until - 5, 5)}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 14, padding: '12px 22px', borderRadius: 12, border: `2px solid ${colors.negative}`, background: 'rgba(255,82,99,0.12)', fontFamily: fonts.mono, fontWeight: 700, fontSize: 28, letterSpacing: '0.1em', color: colors.negative}}>
        <span style={{width: 14, height: 14, borderRadius: 7, background: colors.negative}} />
        CONNECTION LOST
      </div>
    </div>
  );
};

/** A snapped link from the cold open stretches into the underline of the GOV.UK headline (object handoff). */
const HandoffLine = ({from, to}: {from: number; to: number}) => {
  const frame = useCurrentFrame();
  if (frame < from || frame > to + 3) return null;
  const k = interpolate(frame, [from, to], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease.inOut});
  const o = fadeOut(frame, to, 3);
  // Start: a short broken segment beside the coin. End: exactly on the page's own underline under the title,
  // which takes over (the page keeps moving, so this line must not linger).
  const x0 = interpolate(k, [0, 1], [690, 288]), x1 = interpolate(k, [0, 1], [760, 765]), y = interpolate(k, [0, 1], [1080, 1168]);
  const color = k < 0.35 ? colors.negative : colors.electric;
  return (
    <svg width={1080} height={1920} style={{position: 'absolute', inset: 0, opacity: o}}>
      <line x1={x0} y1={y} x2={x1} y2={y} stroke={color} strokeWidth={6} strokeLinecap="round" style={{filter: `drop-shadow(0 0 10px ${color})`}} />
    </svg>
  );
};

const Red = ({children}: {children: ReactNode}) => <span style={{color: colors.negative}}>{children}</span>;

/** Small label line inside a headline (e.g. SIMULASI above the claim it qualifies). */
const LowerTag = ({children, color}: {children: ReactNode; color: string}) => (
  <div style={{fontFamily: fonts.mono, fontWeight: 700, fontSize: 22, letterSpacing: '0.14em', color, marginBottom: 10, textTransform: 'uppercase'}}>{children}</div>
);

/** The ending: the answer, then the question that stays with the viewer (echoes the opening). */
const FinalCard = ({frame, first, second}: {frame: number; first: number; second: number}) => {
  if (frame < first) return null;
  const a = fade(frame, first, 14);
  const b2 = fade(frame, second, 14);
  return (
    <div style={{position: 'absolute', left: 60, right: 60, top: HEADLINE_Y - 30, transform: 'translateY(-50%)', textAlign: 'center', fontFamily: fonts.heading, fontWeight: 800, letterSpacing: '-0.015em', lineHeight: 1.02}}>
      <div style={{fontSize: 78, color: colors.text, opacity: a, transform: `translateY(${(1 - a) * 30}px)`}}>BITCOIN BISA BERTAHAN.</div>
      <div style={{fontSize: 70, color: colors.text, marginTop: 18, opacity: b2, transform: `translateY(${(1 - b2) * 30}px)`}}>
        TAPI BISAKAH LO <span style={{color: colors.electric}}>MENGAKSESNYA?</span>
      </div>
    </div>
  );
};

/** A real screenshot crop shown as a flat card in the lower stage, with its source. */
const EvidenceCard = ({frame, from, to, src, caption}: {frame: number; from: number; to: number; src: string; caption: string}) => {
  if (frame < from || frame >= to) return null;
  const o = fade(frame, from, 10) * fadeOut(frame, to - 8, 8);
  return (
    <div style={{position: 'absolute', left: 110, right: 110, top: 1150, opacity: o, transform: `translateY(${(1 - o) * 24}px)`}}>
      <Img src={staticFile(src)} style={{width: '100%', borderRadius: 14, boxShadow: '0 0 0 2px #1E3256, 0 20px 50px rgba(0,0,0,0.6)'}} />
      <Tag color={colors.muted} style={{fontSize: 18, marginTop: 10, letterSpacing: '0.06em'}}>{caption}</Tag>
    </div>
  );
};

/** A one-line qualifier under the headline, at the moment of the claim. */
const Tagline = ({frame, from, to, color, children, light = false}: {frame: number; from: number; to: number; color: string; children: ReactNode; light?: boolean}) =>
  frame < from || frame >= to ? null : (
    <div style={{position: 'absolute', left: 80, right: 80, top: HEADLINE_Y + 92, textAlign: 'center', opacity: fade(frame, from, 8) * fadeOut(frame, to - 6, 6)}}>
      <Tag color={color} style={{display: 'inline-block', fontSize: 20, letterSpacing: '0.08em', padding: '8px 14px', borderRadius: 8, background: light ? 'rgba(255,255,255,0.86)' : 'rgba(5,11,24,0.82)', boxShadow: light ? '0 0 0 1px #c9d2e3' : '0 0 0 1px #1E3256'}}>{children}</Tag>
    </div>
  );

/** Source line under the stage: what is shown, who says so, when. */
const SourceLine = ({text, light = false}: {text: string; light?: boolean}) => (
  <div style={{position: 'absolute', left: 90, right: 90, top: SOURCE_Y, textAlign: 'center', fontFamily: fonts.mono, fontWeight: 500, fontSize: 18, letterSpacing: '0.03em', color: light ? '#5A6B85' : '#7F93B3'}}>{text}</div>
);

const Scene = () => {
  const frame = useCurrentFrame();
  const {cue, word, narrationEnd} = useCues();
  const UK = cue('uk');
  const SHUT = word('shutdown');
  const POS = cue('pos');
  const NOCENTER = cue('nocenter');
  const WAIT = cue('wait');
  const SAT = cue('sat');
  const EXCHANGE = cue('exchange');
  const space = {sat: SAT, satsend: cue('satsend'), exchange: EXCHANGE};
  const fin = {exchange: EXCHANGE, access: cue('access'), sum: cue('sum'), final: cue('final'), final2: cue('final2'), end: narrationEnd};
  const rev = {wait: WAIT, reveal: cue('reveal'), key: cue('key'), kepemilikan: word('kepemilikan'), sat: SAT};
  const netBeats = {nocenter: NOCENTER, relay: cue('relay'), confirm: cue('confirm'), local: cue('local'), partition: cue('partition'), wait: WAIT};
  const pay = {pos: POS, atm: cue('atm'), bank: cue('bank'), question: cue('question'), q2: cue('q2'), q3: cue('q3'), nocenter: NOCENTER};
  const news = {uk: UK, baru: word('baru'), days: cue('days'), ukinet: cue('ukinet'), php: cue('php'), jutaan: word('jutaan'), offline: cue('offline'), notend: cue('notend'), imagine: cue('imagine'), pos: POS};

  // ---- W1: cold open (coin in a web of links that snap on "SHUTDOWN") ----
  const coldKeys = [
    {f: 0, pos: [1.4, -3.2, 17], look: [0, 0.1, 0], fov: 34, shift: -150},
    {f: SHUT - 2, pos: [0.6, -1.7, 10.2], look: [0, 0.05, 0], fov: 34, shift: -150, ease: 'out' as const},
    {f: UK - 2, pos: [-1.3, -1.25, 9.4], look: [0, 0, 0], fov: 34, shift: -150},
    {f: UK + 14, pos: [-0.3, -0.25, 3.4], look: [0.1, 0.05, 0], fov: 34, shift: -150, ease: 'in' as const},
  ];

  return (
    <Ground polarity="dark">
      {frame >= UK - 1 && frame < POS + 2 && <NewsServerWorld b={news} />}
      {frame >= POS && frame < NOCENTER + 2 && <PaymentsWorld b={pay} />}
      {frame >= NOCENTER && frame < WAIT + 2 && <NetworkWorld b={netBeats} />}
      {frame >= EXCHANGE && <FinalWorld b={fin} />}
      {frame >= SAT - 2 && frame < EXCHANGE + 4 && <SpaceWorld b={space} />}
      {frame >= WAIT && frame < SAT + 4 && <RevealWorld b={rev} />}
      {frame < UK + 2 && <ColdOpenWorld snap={SHUT} keys={coldKeys as never} exitAt={UK + 2} />}
      <OpeningTitle shut={SHUT} until={UK - 2} />
      <HeadlineTrack
        centerY={HEADLINE_Y}
        until={POS}
        cues={[
          {from: news.jutaan, content: <><Red>JUTAAN</Red> PERCOBAAN EKSPLOITASI</>, size: 70},
          {from: news.offline, content: <>WEBSITE SENGAJA <Red>DIMATIKAN</Red></>, size: 72},
          {from: news.notend, content: <>BUKAN BERARTI INTERNET <Hi>DUNIA MATI</Hi></>, size: 64},
          {from: news.imagine, content: <>TAPI BAYANGIN, KALAU <Red>MELUAS</Red>…</>, size: 70},
        ]}
      />
      {/* Device shots: lower-third headlines, with the SIMULASI label right above the claim */}
      <HeadlineTrack
        centerY={LOWER_Y}
        until={NOCENTER}
        cues={[
          {from: POS, content: <><LowerTag color={colors.negative}>SIMULASI GANGGUAN BESAR</LowerTag>MESIN PEMBAYARAN <Red>GAGAL</Red></>, size: 66},
          {from: pay.atm, content: <><LowerTag color={colors.negative}>SIMULASI GANGGUAN BESAR</LowerTag>ATM <Red>OFFLINE</Red></>, size: 78},
          {from: pay.bank, content: <><LowerTag color={colors.negative}>SIMULASI GANGGUAN BESAR</LowerTag>APLIKASI BANK <Red>NGGAK KEBUKA</Red></>, size: 62},
          {from: pay.question, content: null},
          {from: pay.q2, content: <><LowerTag color={colors.muted}>SIMULASI · DOMPET CONTOH</LowerTag>KALAU <Hi>INTERNET</Hi> MATI…</>, size: 72},
          {from: pay.q3, content: <><LowerTag color={colors.muted}>SIMULASI · DOMPET CONTOH</LowerTag>BITCOIN JUGA <Red>OFFLINE?</Red></>, size: 84},
        ]}
      />
      <HeadlineTrack
        centerY={HEADLINE_Y}
        until={WAIT - 8}
        cues={[
          {from: NOCENTER + 10, content: <>TANPA <Hi>SERVER PUSAT</Hi></>, size: 84},
          {from: netBeats.relay, content: <>TRANSAKSI HARUS <Hi>DIKIRIM</Hi></>, size: 76},
          {from: netBeats.confirm, content: <>LALU <span style={{color: colors.positive}}>DIKONFIRMASI</span></>, size: 80},
          {from: netBeats.local, content: <>KONEKSI LO PUTUS: <Red>TERTUNDA</Red></>, size: 68},
          {from: netBeats.partition, content: <>JARINGAN <Red>TERPECAH</Red></>, size: 84},
          {from: netBeats.partition + 50, content: <>TRANSAKSI <Red>TERTUNDA</Red></>, size: 84},
        ]}
      />
      <Tagline frame={frame} from={NOCENTER + 18} to={netBeats.relay - 2} color={colors.muted}>TITIK = 3.271 LOKASI NODE PUBLIK · BITNODES, 21 OKT 2026</Tagline>
      <Tagline frame={frame} from={netBeats.relay + 8} to={netBeats.confirm - 2} color={colors.muted}>DITANDATANGANI DI DOMPET → DITERUSKAN NODE KE NODE</Tagline>
      <Tagline frame={frame} from={netBeats.confirm + 8} to={netBeats.local - 2} color={colors.muted}>MINER MEMASUKKANNYA KE BLOK BARU</Tagline>
      <Tagline frame={frame} from={netBeats.local + 8} to={netBeats.partition - 2} color={colors.muted}>SKENARIO A · ILUSTRASI · JARINGAN GLOBAL TETAP JALAN</Tagline>
      <Tagline frame={frame} from={netBeats.partition + 8} to={WAIT - 8} color={colors.muted}>SKENARIO B · HIPOTESIS · BLOCKCHAIN TIDAK TERHAPUS</Tagline>
      {frame >= NOCENTER + 18 && frame < WAIT - 10 && <Tag color={colors.muted} style={{position: 'absolute', left: 90, top: TAG_Y, opacity: fade(frame, NOCENTER + 18) * fadeOut(frame, WAIT - 20, 10)}}>GARIS KONEKSI = ILUSTRASI</Tag>}
      <HeadlineTrack
        centerY={HEADLINE_Y}
        until={SAT - 12}
        color={colors.ink}
        cues={[
          {from: rev.reveal + 4, content: <>INTERNET MATI <span style={{color: colors.blue}}>≠</span> BITCOIN HILANG</>, size: 74},
          {from: rev.kepemilikan + 4, content: <>TETAP TERCATAT DI <span style={{color: colors.blue}}>BLOCKCHAIN</span></>, size: 72},
        ]}
      />
      <Tagline frame={frame} from={rev.key + 6} to={rev.kepemilikan} color={colors.ink} light>HARDWARE WALLET MENJAGA KUNCI, BUKAN MENYIMPAN KOIN</Tagline>
      <Tagline frame={frame} from={rev.kepemilikan + 12} to={SAT - 14} color={colors.ink} light>BLOK ASLI TERBARU · MEMPOOL.SPACE, 24 OKT 2026</Tagline>
      <HeadlineTrack
        centerY={HEADLINE_Y}
        until={EXCHANGE}
        cues={[
          {from: SAT + 8, content: <>BLOCKSTREAM <Hi>SATELLITE</Hi></>, size: 80},
          {from: SAT + 104, content: <>TERIMA DATA BLOCKCHAIN <span style={{color: colors.positive}}>✓</span></>, size: 70},
          {from: space.satsend, content: <>KIRIM TRANSAKSI? <Red>PERLU JALUR LAIN</Red></>, size: 66},
        ]}
      />
      <Tagline frame={frame} from={SAT + 16} to={SAT + 100} color={colors.muted}>SIARAN 24/7, GRATIS · TELSTAR 18V, 138°BT · ASIA PASIFIK</Tagline>
      <Tagline frame={frame} from={space.satsend + 8} to={EXCHANGE - 2} color={colors.muted}>LINK SATELIT INI SATU ARAH: HANYA MENERIMA · BLOCKSTREAM</Tagline>
      <Tagline frame={frame} from={news.jutaan + 8} to={news.offline - 2} color={colors.muted}>PERCOBAAN · NCSC INGGRIS: BELUM ADA LAPORAN PERETASAN BERHASIL</Tagline>
      <Tagline frame={frame} from={news.offline + 8} to={news.notend - 2} color={colors.muted}>SEBAGAI PENCEGAHAN · TERMASUK SITUS PEMERINTAH</Tagline>
      <Tagline frame={frame} from={news.notend + 8} to={news.imagine - 2} color={colors.muted}>IMBAUAN INGGRIS = PERSIAPAN, BUKAN PREDIKSI</Tagline>
      {frame >= news.php + 20 && frame < news.imagine + 10 && <Tag style={{position: 'absolute', left: 90, top: TAG_Y, opacity: fade(frame, news.php + 20)}}>ILUSTRASI · RUANG SERVER</Tag>}
      {frame >= news.imagine + 10 && frame < POS && <Tag color={colors.negative} style={{position: 'absolute', left: 90, top: TAG_Y, opacity: fade(frame, news.imagine + 10)}}>SIMULASI GANGGUAN BESAR</Tag>}
      <SourceLine
        text={
          frame < UK ? '' :
          frame < news.php ? '' :
          frame < news.offline ? 'THE GUARDIAN, 22 OKT 2026 · “JUTAAN PERCOBAAN”: CLOUDFLARE · PHP DIPAKAI ±70% WEBSITE' :
          frame < news.notend ? 'NCSC-NL, 21–23 OKT 2026 · INGGRIS: 32 LAYANAN PEMERINTAH OFFLINE SEMENTARA (THE GUARDIAN)' :
          frame < POS ? 'GOV.UK, 22 OKT 2026: KAMPANYE KESIAPSIAGAAN UMUM (CUACA EKSTREM DLL.)' : ''
        }
      />
      <EvidenceCard frame={frame} from={SAT + 22} to={SAT + 96} src="episodes/bitcoin-shutdown/blockstream-hero.png" caption="BLOCKSTREAM.COM/SATELLITE · DIAKSES 24 OKT 2026" />
      <HeadlineTrack
        centerY={HEADLINE_Y}
        until={fin.sum}
        cues={[
          {from: EXCHANGE + 4, content: <>KALAU DI <Hi>EXCHANGE</Hi>?</>, size: 84},
          {from: fin.access, content: <>AKSES = <Red>SISTEM MEREKA</Red></>, size: 78},
        ]}
      />
      <FinalCard frame={frame} first={fin.sum + 8} second={fin.final2} />
      <ConnectionLost at={SHUT + 2} until={UK - 8} />
      <HandoffLine from={UK - 12} to={UK + 2} />
      <Sound />
    </Ground>
  );
};

const episode: EpisodeModule = {
  config: config as EpisodeConfig,
  captions: captions as Captions,
  Scene,
  // The corner logo needs a dark ground: hidden while the white GOV.UK page sits under it, and while the reveal is off-white.
  logoHide: [
    [cueFrame('uk') + 32, cueFrame('days') + 34],
    [cueFrame('reveal') - 7, cueFrame('sat') + 1],
  ],
};
export default episode;
