import type {CSSProperties, ReactNode} from 'react';
import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import captions from '../../../episodes/blackrock-tokenisasi/captions.json';
import config from '../../../episodes/blackrock-tokenisasi/episode.json';
import {Ground} from '../../components/Ground';
import {Hi} from '../../components/Headline';
import {HeadlineTrack} from '../../components/HeadlineTrack';
import {Sfx} from '../../components/Sfx';
import {useCues} from '../../lib/cues';
import type {EpisodeModule} from '../../lib/episode-module';
import type {Captions, EpisodeConfig} from '../../lib/types';
import {colors} from '../../theme/colors';
import {ease} from '../../theme/motion';
import {fonts} from '../../theme/typography';
import {TowerWorld} from './Tower';
import {MechanismWorld} from './World';

// Layout (screen px): headlines 470–690, stage 700–1520, source line 1534.
const HEADLINE_Y = 585;
const STAGE_TOP = 700;
const SOURCE_Y = 1534;

// Verified figures (research.md). Wealth/AUM/GDP in rupiah, tokenized-asset market in USD.
const AUM_USD_T = 15.5; // SEC 8-K Ex. 99.2, 30 Sep 2026
const USD_IDR = 18030; // open.er-api, 22 Oct 2026
const AUM_IDR_T = AUM_USD_T * USD_IDR; // ≈ 279,465 (trillion rupiah)
const PDB_2025_T = 23821.1; // BPS, PDB ADHB 2025 (trillion rupiah)
const RATIO_PDB = AUM_IDR_T / PDB_2025_T; // ≈ 11.7
const RWA_B = 39.02; // rwa.xyz, 22 Oct 2026
const RWA_SHARE = RWA_B / (AUM_USD_T * 1000); // ≈ 0.25%

// Real BUIDL transfers on Ethereum (Blockscout API, fetched 22 Oct 2026; buidl-transfers-2026-10-22.json). Times in WIB.
const BUIDL_TX = [
  {day: 'RAB 21 OKT', time: '23.33', qty: '20.000.000', from: '0x7137…A258', to: '0x8780…4200'},
  {day: 'RAB 21 OKT', time: '21.05', qty: '711,78', from: '0xDbef…B910', to: '0xf819…73AA'},
  {day: 'SEL 20 OKT', time: '23.24', qty: '260,13', from: '0x026B…b1d2', to: '0x7702…63de'},
];

const fade = (frame: number, from: number, len = 10) =>
  interpolate(frame, [from, from + len], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease.out});
const fadeOut = (frame: number, at: number, len = 10) =>
  interpolate(frame, [at, at + len], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
const rise = (o: number, px = 30) => `translateY(${(1 - o) * px}px)`;
const cueFrame = (name: keyof typeof captions.cues) => Math.round(captions.cues[name] * 30);
const idr = (n: number) => Math.round(n).toLocaleString('id-ID');

const Sub = ({children, color = colors.muted}: {children: ReactNode; color?: string}) => (
  <div style={{fontFamily: fonts.mono, fontWeight: 600, fontSize: 25, letterSpacing: '0.05em', color, marginTop: 14, textTransform: 'uppercase'}}>{children}</div>
);

/** A block in the stage: absolutely placed in stage coordinates. */
const At = ({x, y, w, h, o = 1, children, style}: {x: number; y: number; w?: number; h?: number; o?: number; children: ReactNode; style?: CSSProperties}) =>
  o <= 0 ? null : <div style={{position: 'absolute', left: x, top: STAGE_TOP + y, width: w, height: h, opacity: o, ...style}}>{children}</div>;

const OpeningTitle = ({until}: {until: number}) => {
  const frame = useCurrentFrame();
  if (frame >= until) return null;
  const r = interpolate(frame, [-6, 10], [0, 1], {extrapolateRight: 'clamp', easing: ease.out});
  const move = interpolate(frame, [30, 50], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease.inOut});
  return (
    <div style={{position: 'absolute', left: 90, right: 90, top: 960 + (HEADLINE_Y - 960) * move + (1 - r) * 60, transform: 'translateY(-50%)', opacity: interpolate(r, [0, 0.4], [0, 1], {extrapolateRight: 'clamp'}) * fadeOut(frame, until - 7, 6), textAlign: 'center', fontFamily: fonts.heading, fontWeight: 800, fontSize: 84 - 12 * move, lineHeight: 1.03, letterSpacing: '-0.02em', color: colors.text}}>
      TOKENISASI =
      <br />
      <Hi>INTERNET TAHUN 1996?</Hi>
    </div>
  );
};

const Scene = () => {
  const frame = useCurrentFrame();
  const {cue, word, narrationEnd} = useCues();
  const Q = cue('quote');
  const SC = cue('scale');
  const GDP = cue('gdp');
  const WH = cue('what');
  const OLD = cue('old');
  const NEW = cue('new');
  const SP = cue('split');
  const CO = cue('collateral');
  const RE = cue('reality');
  const SZ = cue('size');
  const RA = cue('ratio');
  const F2 = cue('fink2');
  const PO = cue('payoff');
  const C1 = cue('c1');
  const C2 = cue('c2');
  const C3 = cue('c3');
  const CL = cue('closing');
  const END = narrationEnd + 18;
  const light = frame >= RE && frame < PO;

  // ---- 1. Authority card (real photo) ----
  const cardIn = fade(frame, 40, 14);
  const cardOut = fadeOut(frame, WH - 8, 10);
  // At the scale beat the card slides up to make room for the number.
  const cardUp = interpolate(frame, [SC - 4, SC + 14], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease.inOut});
  const cardY = 120 - 90 * cardUp;
  const push = interpolate(frame, [40, WH], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const quoteIn = fade(frame, Q + 6, 12) * fadeOut(frame, SC - 6, 8);

  // ---- 2. Scale in rupiah vs PDB blocks ----
  const countIn = fade(frame, SC + 6, 10) * cardOut;
  const count = interpolate(frame, [SC + 6, SC + 60], [0, AUM_IDR_T], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease.out});
  const blocksIn = (i: number) => fade(frame, GDP + 4 + i * 4, 6) * cardOut;

  // ---- 3. Mechanism world (3D): certificate → token, lanes, split, pledge ----
  const beats = {
    WH, buku: word('buku'), digital: word('digital'), OLD, NEW, pindah: word('pindah'), tangan: word('tangan'),
    SP, dipecah: word('dipecah'), CO, jaminan: word('jaminan'), pinjaman: word('pinjaman'), RE,
  };
  const ledgerIn = fade(frame, beats.tangan + 8, 10) * fadeOut(frame, SP - 8, 8);
  const lateHours = fade(frame, word('jam'), 8);
  const illus = fade(frame, OLD + 6, 10) * (frame < RE ? 1 : 0);
  const piecesIn = fade(frame, beats.dipecah + 6, 10) * fadeOut(frame, CO - 4, 6);

  // ---- 5. Reality check (off-white) ----
  const DOLAR = word('dolar');
  const shotIn = fade(frame, SZ + 2, 12) * fadeOut(frame, DOLAR - 2, 6);
  const quote2In = fade(frame, F2 + 8, 12);

  // ---- 6. Checklist ----
  const checks = [
    {at: C1, n: 1, t: 'SIAPA PENERBITNYA?', s: 'Lembaga resmi & teregulasi?'},
    {at: C2, n: 2, t: 'ASET ASLINYA DI MANA?', s: 'Siapa yang menyimpan & mengaudit?'},
    {at: C3, n: 3, t: 'BISA DITUKAR BALIK?', s: 'Token → aset / uang, dengan aturan jelas'},
  ];

  const sourceText = (() => {
    if (frame < SC) return 'FOTO: JERRY GOLDBERG / BLACKROCK · KUTIPAN: SURAT TAHUNAN LARRY FINK 2026';
    if (frame < WH) return `AUM $15,5 T (30 SEP 2026, SEC 8-K) × KURS Rp${idr(USD_IDR)} (22 OKT 2026) · PDB 2025 BPS`;
    if (frame < beats.buku + 6) return 'SERTIFIKAT SAHAM CHICAGO, BURLINGTON & QUINCY RAILROAD, 1880-AN · DOMAIN PUBLIK';
    if (frame < OLD) return 'TOKEN BUIDL = DANA TOKEN BLACKROCK DI ETHEREUM (SEJAK 2024)';
    if (frame < beats.tangan + 8) return 'BEI: PENYELESAIAN T+2 SEJAK 26 NOV 2018 (POJK 21/2018)';
    if (frame < SP) return 'DATA: BLOCKSCOUT (ETHEREUM), DIAMBIL 22 OKT 2026 · WAKTU DIKONVERSI KE WIB';
    if (frame < RE) return 'ILUSTRASI';
    if (frame < PO) return 'DATA: RWA.XYZ, 22 OKT 2026 (TANPA STABLECOIN) · AUM BLACKROCK 30 SEP 2026';
    return 'BUKAN NASIHAT FINANSIAL';
  })();

  const ink = light ? colors.ink : colors.text;
  const muted = light ? '#4A5568' : colors.muted;

  return (
    <Ground polarity="dark">
      {light && <AbsoluteFill style={{backgroundColor: colors.offWhite}} />}

      {/* 1. Authority card */}
      <At x={90} y={cardY} w={900} o={cardIn * cardOut} style={{transform: `${rise(cardIn, 40)} scale(${(1 - 0.12 * cardUp) * (1 + 0.035 * push)})`, transformOrigin: '50% 0'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 34, background: colors.bg2, borderRadius: 28, padding: '30px 36px', boxShadow: '0 0 0 2px #1E3256'}}>
          <div style={{position: 'relative'}}>
            <Img src={staticFile('episodes/blackrock-tokenisasi/larry-fink-official-headshot.png')} style={{width: 210, height: 210, borderRadius: 105, objectFit: 'cover', boxShadow: `0 0 0 4px ${colors.blue}`}} />
          </div>
          <div>
            <div style={{fontFamily: fonts.heading, fontWeight: 800, fontSize: 60, color: colors.text, letterSpacing: '-0.01em'}}>Larry Fink</div>
            <div style={{fontFamily: fonts.body, fontWeight: 500, fontSize: 30, color: colors.muted, marginTop: 6}}>Chairman &amp; CEO, BlackRock</div>
            <div style={{fontFamily: fonts.mono, fontWeight: 600, fontSize: 20, color: '#6F83A3', marginTop: 16}}>FOTO: JERRY GOLDBERG / BLACKROCK</div>
          </div>
        </div>
      </At>
      <At x={90} y={420} w={900} o={quoteIn} style={{transform: rise(quoteIn)}}>
        <div style={{borderLeft: `6px solid ${colors.blue}`, paddingLeft: 30}}>
          <div style={{fontFamily: fonts.heading, fontWeight: 700, fontSize: 46, lineHeight: 1.15, color: colors.text}}>
            “Tokenisasi hari ini mungkin kira-kira ada di titik <Hi>internet tahun 1996</Hi>.”
          </div>
          <div style={{fontFamily: fonts.mono, fontWeight: 600, fontSize: 22, color: colors.muted, marginTop: 16}}>— SURAT TAHUNAN LARRY FINK 2026 (DITERJEMAHKAN)</div>
        </div>
      </At>

      {/* 2. Scale */}
      <At x={90} y={300} w={900} o={countIn} style={{textAlign: 'center', transform: `${rise(countIn)} scale(${0.97 + 0.05 * push})`}}>
        <div style={{fontFamily: fonts.mono, fontWeight: 600, fontSize: 24, letterSpacing: '0.1em', color: colors.muted}}>DANA YANG DIKELOLA BLACKROCK</div>
        <div style={{fontFamily: fonts.heading, fontWeight: 800, fontSize: 104, color: colors.text, letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums'}}>
          ≈ Rp{idr(count)} <span style={{fontSize: 56}}>triliun</span>
        </div>
        <div style={{fontFamily: fonts.mono, fontWeight: 600, fontSize: 24, color: '#6F83A3'}}>= $15,5 triliun · 30 Sep 2026</div>
      </At>
      <At x={90} y={560} w={900} o={blocksIn(0)}>
        <div style={{display: 'flex', gap: 8, alignItems: 'flex-end'}}>
          {Array.from({length: 12}, (_, i) => {
            const fill = Math.min(1, Math.max(0, RATIO_PDB - i));
            return <div key={i} style={{width: 67, height: 80, borderRadius: 8, background: '#13213A', overflow: 'hidden', opacity: blocksIn(i), position: 'relative', transform: `translateY(${(1 - blocksIn(i)) * -60}px) rotate(${(1 - blocksIn(i)) * (i % 2 ? 8 : -8)}deg)`}}>
              <div style={{position: 'absolute', left: 0, bottom: 0, width: `${fill * 100}%`, height: '100%', background: colors.blue}} />
            </div>;
          })}
        </div>
        <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 14, fontFamily: fonts.mono, fontWeight: 600, fontSize: 22, color: colors.muted}}>
          <span>1 KOTAK = PDB INDONESIA 2025 (Rp{idr(PDB_2025_T)} T)</span>
          <span style={{color: colors.light}}>≈ {RATIO_PDB.toFixed(1).replace('.', ',')}×</span>
        </div>
      </At>

      {/* 3–4. Mechanism in 3D, with the real ledger below it */}
      {frame >= WH && frame < RE && <MechanismWorld b={beats} />}
      <At x={90} y={420} w={900} o={ledgerIn} style={{transform: rise(ledgerIn)}}>
        <div style={{background: 'rgba(11,23,48,0.94)', borderRadius: 20, padding: '20px 26px', boxShadow: '0 0 0 2px #1E3256'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', fontFamily: fonts.mono, fontWeight: 700, fontSize: 21, letterSpacing: '0.08em', color: colors.light, marginBottom: 8}}>
            <span>TRANSFER NYATA · TOKEN BUIDL</span><span style={{color: '#6F83A3'}}>ETHEREUM</span>
          </div>
          {BUIDL_TX.map((t, i) => {
            const o = fade(frame, beats.tangan + 12 + i * 5, 8);
            return (
              <div key={t.from} style={{display: 'flex', alignItems: 'baseline', gap: 18, fontFamily: fonts.mono, fontSize: 23, color: colors.text, padding: '10px 0', borderTop: '1px solid #1E3256', opacity: o, transform: `translateX(${(1 - o) * 30}px)`}}>
                <span style={{color: colors.muted, width: 150}}>{t.day}</span>
                <span style={{width: 130, fontWeight: 800, color: lateHours > 0.5 ? colors.light : colors.text}}>{t.time} WIB</span>
                <span style={{flex: 1, textAlign: 'right', fontWeight: 700}}>{t.qty}</span>
                <span style={{color: '#6F83A3', fontSize: 18, width: 170, textAlign: 'right'}}>{t.from}<br />→ {t.to}</span>
              </div>
            );
          })}
          <div style={{fontFamily: fonts.mono, fontWeight: 600, fontSize: 18, color: '#6F83A3', marginTop: 10, opacity: lateHours}}>
            SEMUA DI LUAR JAM BURSA BEI · BUIDL KHUSUS INVESTOR TERDAFTAR
          </div>
        </div>
      </At>
      <At x={90} y={780} w={400} o={illus * (frame < beats.tangan + 8 || frame >= SP ? 1 : 0)}>
        <div style={{fontFamily: fonts.mono, fontWeight: 700, fontSize: 22, letterSpacing: '0.12em', color: colors.light}}>ILUSTRASI</div>
      </At>
      <At x={90} y={690} w={900} o={piecesIn} style={{textAlign: 'center'}}>
        <div style={{fontFamily: fonts.mono, fontWeight: 700, fontSize: 30, color: colors.muted}}>1 TOKEN → 8 BAGIAN</div>
      </At>

      {/* 5. Reality check on off-white */}
      <At x={90} y={40} w={900} o={shotIn} style={{transform: rise(shotIn)}}>
        <div style={{display: 'flex', gap: 30, alignItems: 'center'}}>
          <Img src={staticFile('episodes/blackrock-tokenisasi/rwa-xyz-2026-10-22.png')} style={{width: 476, height: 196, borderRadius: 14, boxShadow: '0 0 0 2px #C9D2E3'}} />
          <div style={{fontFamily: fonts.mono, fontWeight: 600, fontSize: 22, lineHeight: 1.5, color: muted}}>
            RWA.XYZ<br />22 OKT 2026<br />ASET NYATA YANG<br />DITOKENISASI
          </div>
        </div>
      </At>
      {frame >= DOLAR - 2 && frame < F2 + 8 && (
        <TowerWorld start={DOLAR - 2} crane={RA - 2} settle={word('dana')} share={RWA_SHARE} end={F2 + 8} />
      )}
      <At x={90} y={170} w={900} o={quote2In * (light ? 1 : 0)} style={{transform: rise(quote2In)}}>
        <div style={{borderLeft: `6px solid ${colors.blue}`, paddingLeft: 30}}>
          <div style={{fontFamily: fonts.heading, fontWeight: 700, fontSize: 50, lineHeight: 1.15, color: colors.ink}}>
            “Ini tidak akan menggantikan sistem keuangan yang ada <span style={{color: colors.blue}}>dalam semalam</span>.”
          </div>
          <div style={{fontFamily: fonts.mono, fontWeight: 600, fontSize: 22, color: '#4A5568', marginTop: 16}}>— LARRY FINK, SURAT TAHUNAN 2026 (DITERJEMAHKAN)</div>
        </div>
      </At>

      {/* 6. Checklist */}
      {frame >= PO &&
        checks.map((c, i) => {
          // Numbered outlines appear with the headline; each fills in when it is named.
          const shell = fade(frame, PO + 4 + i * 4, 10);
          const o = fade(frame, c.at, 10);
          return (
            <At key={c.n} x={90} y={70 + i * 200} w={900} o={shell * (0.35 + 0.65 * o) * (frame >= CL ? 0.55 : 1)} style={{transform: `perspective(1400px) rotateX(${(1 - shell) * 75}deg) rotateY(${(1 - o) * -10}deg)`, transformOrigin: '50% 0'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: 28, background: colors.bg2, borderRadius: 22, padding: '26px 30px', boxShadow: '0 0 0 2px #1E3256'}}>
                <div style={{width: 72, height: 72, borderRadius: 36, background: colors.blue, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: fonts.heading, fontWeight: 800, fontSize: 38, color: '#fff', flexShrink: 0}}>{c.n}</div>
                <div style={{opacity: o}}>
                  <div style={{fontFamily: fonts.heading, fontWeight: 800, fontSize: 44, color: colors.text}}>{c.t}</div>
                  <div style={{fontFamily: fonts.body, fontWeight: 500, fontSize: 26, color: colors.muted, marginTop: 6}}>{c.s}</div>
                </div>
              </div>
            </At>
          );
        })}

      <OpeningTitle until={SC} />
      <HeadlineTrack
        centerY={HEADLINE_Y}
        until={RE}
        cues={[
          {from: SC, content: <>BLACKROCK MENGELOLA…</>, size: 74},
          {from: GDP, content: <><Hi>≈ 12×</Hi> PDB INDONESIA SETAHUN</>, size: 70},
          {from: WH, content: <>TOKENISASI = KEPEMILIKAN DI <Hi>BUKU BESAR DIGITAL</Hi></>, size: 62},
          {from: OLD, content: <>BEI: SERAH TERIMA <span style={{color: colors.muted}}>2 HARI BURSA</span></>, size: 66},
          {from: NEW, content: <>BLOCKCHAIN: <Hi>HITUNGAN DETIK</Hi>, 24 JAM</>, size: 66},
          {from: SP, content: <>BISA DIPECAH KECIL…</>, size: 74},
          {from: CO, content: <>…& JADI <Hi>JAMINAN</Hi> PINJAMAN</>, size: 74},
        ]}
      />
      <HeadlineTrack
        centerY={HEADLINE_Y}
        until={PO}
        color={colors.ink}
        cues={[
          {from: RE, content: <>TAPI JANGAN <span style={{color: colors.blue}}>KEBAWA HYPE</span></>, size: 80},
          {from: SZ, content: <>BARU <span style={{color: colors.blue}}>$39 MILIAR</span></>, size: 84},
          // Cleared while the camera cranes up the tower, back once it settles.
          {from: RA - 2, content: null},
          {from: word('dana'), content: <>&lt; <span style={{color: colors.blue}}>0,5%</span> DANA BLACKROCK SAJA</>, size: 70},
          {from: F2, content: <>BUKAN DALAM SEMALAM</>, size: 76},
        ]}
      />
      <HeadlineTrack
        centerY={HEADLINE_Y}
        until={END}
        cues={[
          {from: PO, content: <>SEBELUM BELI TOKEN <Hi>ASET NYATA</Hi>, CEK:</>, size: 64},
          {from: CL, content: <>TOKEN CUMA SEKUAT <Hi>JANJI DI BELAKANGNYA</Hi></>, size: 68},
        ]}
      />

      <div style={{position: 'absolute', left: 90, right: 90, top: SOURCE_Y, textAlign: 'center', fontFamily: fonts.mono, fontWeight: 500, fontSize: 18, letterSpacing: '0.03em', color: light ? '#5A6B85' : '#6F83A3', opacity: fade(frame, 40, 12)}}>
        {sourceText}
      </div>

      {/* Sound (library, see sources.md). */}
      <Sfx name="cinematic-boom-soft" at={0} volume={0.26} />
      <Sfx name="camera-focus" at={36} volume={0.25} />
      <Sfx name="ui-reveal" at={Q + 6} volume={0.22} />
      <Sfx name="mountain-audio-computer-data-readout-and-counter-bundle-sound-3" at={SC + 6} volume={0.22} />
      <Sfx name="ui-clicks-notification-pop" at={GDP + 4} volume={0.26} />
      <Sfx name="paper-movement-2" at={WH + 4} volume={0.3} />
      <Sfx name="data-whoosh" at={beats.buku - 3} volume={0.26} />
      <Sfx name="metalic-riser" at={beats.buku + 6} volume={0.16} frames={30} />
      <Sfx name="clock-ticking-1" at={OLD + 10} volume={0.14} frames={beats.pindah - OLD - 10} />
      <Sfx name="transition-swoosh" at={beats.pindah} volume={0.34} />
      <Sfx name="ni-sound-cute-interface-bubble-pop-synth-chord-positive-notification" at={beats.pindah + 10} volume={0.2} />
      <Sfx name="typing-beep-computer-3" at={beats.tangan + 12} volume={0.1} frames={24} />
      <Sfx name="paper-wrapper-rip-2" at={beats.dipecah + 2} volume={0.22} />
      <Sfx name="jail-lock-2" at={beats.jaminan + 8} volume={0.16} frames={30} />
      <Sfx name="coins-money-drop" at={beats.pinjaman} volume={0.26} />
      <Sfx name="impact-bass-echo" at={RE} volume={0.22} />
      <Sfx name="ui-clicks-notification-pop" at={SZ + 4} volume={0.26} />
      <Sfx name="whoosh-deep-short" at={RA - 2} volume={0.24} />
      <Sfx name="slide-projector-9" at={F2 + 2} volume={0.26} />
      {[C1, C2, C3].map((f) => (
        <Sfx key={f} name="slick-ui-mechanical-button-press" at={f} volume={0.3} />
      ))}
      <Sfx name="whoosh-and-hit-2" at={CL - 6} volume={0.22} />
    </Ground>
  );
};

const episode: EpisodeModule = {
  config: config as EpisodeConfig,
  captions: captions as Captions,
  Scene,
  logoHide: [[cueFrame('reality'), cueFrame('payoff')]],
};
export default episode;
