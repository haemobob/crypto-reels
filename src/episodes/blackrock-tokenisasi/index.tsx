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
  const {cue, narrationEnd} = useCues();
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
  const quoteIn = fade(frame, Q + 6, 12) * fadeOut(frame, SC - 6, 8);

  // ---- 2. Scale in rupiah vs PDB blocks ----
  const countIn = fade(frame, SC + 6, 10) * cardOut;
  const count = interpolate(frame, [SC + 6, SC + 60], [0, AUM_IDR_T], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease.out});
  const blocksIn = (i: number) => fade(frame, GDP + 4 + i * 4, 6) * cardOut;

  // ---- 3. Ledger ----
  const ledgerIn = fade(frame, WH + 2, 12) * fadeOut(frame, OLD - 6, 8);
  const certToToken = interpolate(frame, [WH + 20, WH + 46], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease.inOut});
  const rows = [
    {who: 'Andi', what: 'Obligasi', qty: '10', hash: '0x3fa9…c21'},
    {who: 'Sari', what: 'Saham', qty: '250', hash: '0x8b02…e7d'},
    {who: 'Kamu', what: 'Reksa dana', qty: '1,5', hash: '0xd41c…09a'},
  ];

  // ---- 4. Settlement lanes, then fractions and collateral ----
  const lanesIn = fade(frame, OLD + 2, 12) * fadeOut(frame, SP - 6, 8);
  const slow = interpolate(frame, [OLD + 16, NEW + 40], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const fastIn = fade(frame, NEW, 8);
  const fast = interpolate(frame, [NEW + 6, NEW + 16], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease.out});
  const fracIn = fade(frame, SP + 2, 10) * fadeOut(frame, RE - 4, 6);
  const splitP = interpolate(frame, [SP + 10, SP + 34], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease.inOut});
  const pledge = interpolate(frame, [CO + 4, CO + 30], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease.inOut});
  const loanOut = fade(frame, CO + 30, 10);

  // ---- 5. Reality check (off-white) ----
  const shotIn = fade(frame, SZ + 2, 12) * fadeOut(frame, F2 - 6, 8);
  const barsIn = fade(frame, RA, 10) * fadeOut(frame, F2 - 6, 8);
  const barGrow = interpolate(frame, [RA + 4, RA + 26], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease.out});
  const quote2In = fade(frame, F2 + 4, 12);

  // ---- 6. Checklist ----
  const checks = [
    {at: C1, n: 1, t: 'SIAPA PENERBITNYA?', s: 'Lembaga resmi & teregulasi?'},
    {at: C2, n: 2, t: 'ASET ASLINYA DI MANA?', s: 'Siapa yang menyimpan & mengaudit?'},
    {at: C3, n: 3, t: 'BISA DITUKAR BALIK?', s: 'Token → aset / uang, dengan aturan jelas'},
  ];

  const sourceText = (() => {
    if (frame < SC) return 'FOTO: JERRY GOLDBERG / BLACKROCK · KUTIPAN: SURAT TAHUNAN LARRY FINK 2026';
    if (frame < WH) return `AUM $15,5 T (30 SEP 2026, SEC 8-K) × KURS Rp${idr(USD_IDR)} (22 OKT 2026) · PDB 2025 BPS`;
    if (frame < OLD) return 'DEFINISI: SURAT TAHUNAN LARRY FINK 2026 · ILUSTRASI';
    if (frame < SP) return 'BEI: PENYELESAIAN T+2 SEJAK 26 NOV 2018 (POJK 21/2018)';
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
      <At x={90} y={cardY} w={900} o={cardIn * cardOut} style={{transform: `${rise(cardIn, 40)} scale(${1 - 0.12 * cardUp})`, transformOrigin: '50% 0'}}>
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
      <At x={90} y={300} w={900} o={countIn} style={{textAlign: 'center', transform: rise(countIn)}}>
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
            return <div key={i} style={{width: 67, height: 80, borderRadius: 8, background: '#13213A', overflow: 'hidden', opacity: blocksIn(i), position: 'relative'}}>
              <div style={{position: 'absolute', left: 0, bottom: 0, width: `${fill * 100}%`, height: '100%', background: colors.blue}} />
            </div>;
          })}
        </div>
        <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 14, fontFamily: fonts.mono, fontWeight: 600, fontSize: 22, color: colors.muted}}>
          <span>1 KOTAK = PDB INDONESIA 2025 (Rp{idr(PDB_2025_T)} T)</span>
          <span style={{color: colors.light}}>≈ {RATIO_PDB.toFixed(1).replace('.', ',')}×</span>
        </div>
      </At>

      {/* 3. Ledger */}
      <At x={90} y={60} w={900} o={ledgerIn}>
        <div style={{display: 'flex', alignItems: 'center', gap: 30}}>
          <div style={{position: 'relative', width: 200, height: 250}}>
            <div style={{position: 'absolute', inset: 0, borderRadius: 14, background: '#E9E4D6', opacity: 1 - certToToken, transform: `scale(${1 - 0.5 * certToToken}) rotate(${-4 + 4 * certToToken}deg)`, padding: 22, boxSizing: 'border-box'}}>
              <div style={{fontFamily: fonts.heading, fontWeight: 800, fontSize: 24, color: colors.ink}}>SERTIFIKAT</div>
              {[0, 1, 2, 3, 4].map((i) => <div key={i} style={{height: 8, background: '#C9C2B0', borderRadius: 4, marginTop: 18, width: `${90 - i * 9}%`}} />)}
            </div>
            <div style={{position: 'absolute', left: 25, top: 50, width: 150, height: 150, borderRadius: 75, background: `radial-gradient(circle at 35% 30%, ${colors.light}, ${colors.blue} 60%, #0B3F99)`, opacity: certToToken, transform: `scale(${0.6 + 0.4 * certToToken})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: fonts.mono, fontWeight: 800, fontSize: 30, color: '#fff'}}>TOKEN</div>
          </div>
          <div style={{flex: 1, background: colors.bg2, borderRadius: 20, padding: '22px 26px', boxShadow: '0 0 0 2px #1E3256'}}>
            <div style={{fontFamily: fonts.mono, fontWeight: 700, fontSize: 22, letterSpacing: '0.1em', color: colors.light, marginBottom: 14}}>BUKU BESAR DIGITAL</div>
            {rows.map((r, i) => {
              const o = fade(frame, WH + 30 + i * 12, 8);
              return <div key={r.hash} style={{display: 'flex', justifyContent: 'space-between', fontFamily: fonts.mono, fontSize: 24, color: colors.text, padding: '12px 0', borderTop: '1px solid #1E3256', opacity: o, transform: `translateX(${(1 - o) * 30}px)`}}>
                <span>{r.who}</span><span style={{color: colors.muted}}>{r.what}</span><span>{r.qty}</span><span style={{color: '#6F83A3', fontSize: 20}}>{r.hash}</span>
              </div>;
            })}
          </div>
        </div>
      </At>

      {/* 4a. Settlement lanes */}
      <At x={90} y={70} w={900} o={lanesIn}>
        {[
          {label: 'BEI · SAHAM', sub: 'T+2', p: slow, marks: ['HARI 0', 'HARI 1', 'HARI 2'], o: 1, color: colors.muted},
          {label: 'BLOCKCHAIN · TOKEN', sub: '24 JAM', p: fast, marks: ['', '', 'DETIK'], o: fastIn, color: colors.electric},
        ].map((lane, li) => (
          <div key={lane.label} style={{marginBottom: 70, opacity: lane.o}}>
            <div style={{display: 'flex', justifyContent: 'space-between', fontFamily: fonts.mono, fontWeight: 700, fontSize: 26, color: lane.color, marginBottom: 18}}>
              <span>{lane.label}</span><span>{lane.sub}</span>
            </div>
            <div style={{position: 'relative', height: 60}}>
              <div style={{position: 'absolute', left: 0, right: 0, top: 28, height: 4, background: '#1E3256', borderRadius: 2}} />
              <div style={{position: 'absolute', left: 0, top: 28, height: 4, width: `${lane.p * 100}%`, background: lane.color, borderRadius: 2}} />
              {lane.marks.map((m, i) => (
                <div key={i} style={{position: 'absolute', left: `${(i / 2) * 100}%`, top: 44, transform: 'translateX(-50%)', fontFamily: fonts.mono, fontSize: 20, color: '#6F83A3', whiteSpace: 'nowrap'}}>{m}</div>
              ))}
              <div style={{position: 'absolute', left: `calc(${lane.p * 100}% - 22px)`, top: 8, width: 44, height: 44, borderRadius: li === 0 ? 8 : 22, background: li === 0 ? '#E9E4D6' : colors.blue}} />
            </div>
          </div>
        ))}
      </At>

      {/* 4b. Fractions and collateral (ILUSTRASI) */}
      <At x={90} y={40} w={900} h={700} o={fracIn}>
        <svg width={900} height={640} viewBox="0 0 900 640">
          {Array.from({length: 8}, (_, i) => {
            const a0 = (i / 8) * Math.PI * 2 - Math.PI / 2;
            const a1 = ((i + 1) / 8) * Math.PI * 2 - Math.PI / 2;
            const r = 140;
            const mid = (a0 + a1) / 2;
            const off = 26 * splitP;
            let cx = 250 + Math.cos(mid) * off;
            let cy = 260 + Math.sin(mid) * off;
            // One slice is pledged as collateral.
            if (i === 1) {
              cx += (640 - 250) * pledge;
              cy += (40) * pledge;
            }
            const d = `M${cx},${cy} L${cx + Math.cos(a0) * r},${cy + Math.sin(a0) * r} A${r},${r} 0 0 1 ${cx + Math.cos(a1) * r},${cy + Math.sin(a1) * r} Z`;
            return <path key={i} d={d} fill={i === 1 ? colors.light : colors.blue} stroke={colors.bg} strokeWidth={4} />;
          })}
          <text x={250} y={470} textAnchor="middle" fill={colors.muted} fontFamily={fonts.mono} fontWeight={600} fontSize={24}>1 TOKEN → 8 BAGIAN</text>
          <g opacity={fade(frame, CO, 10)}>
            <rect x={540} y={160} width={220} height={240} rx={18} fill="none" stroke={colors.light} strokeWidth={3} strokeDasharray="10 8" />
            <text x={650} y={150} textAnchor="middle" fill={colors.light} fontFamily={fonts.mono} fontWeight={700} fontSize={24}>JAMINAN</text>
          </g>
          <g opacity={loanOut}>
            <line x1={650} y1={410} x2={650} y2={470} stroke={colors.positive} strokeWidth={3} />
            <circle cx={650} cy={510} r={40} fill={colors.positive} />
            <text x={650} y={519} textAnchor="middle" fill={colors.bg} fontFamily={fonts.heading} fontWeight={800} fontSize={28}>$</text>
            <text x={650} y={590} textAnchor="middle" fill={colors.positive} fontFamily={fonts.mono} fontWeight={700} fontSize={24}>PINJAMAN</text>
          </g>
        </svg>
        <div style={{position: 'absolute', left: 0, top: -6, fontFamily: fonts.mono, fontWeight: 700, fontSize: 22, letterSpacing: '0.12em', color: colors.light}}>ILUSTRASI</div>
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
      <At x={90} y={330} w={900} o={barsIn}>
        {[
          {label: 'Dana dikelola BlackRock', v: 1, txt: '100%', color: colors.ink},
          {label: 'Semua aset nyata yang ditokenisasi', v: RWA_SHARE, txt: `${(RWA_SHARE * 100).toFixed(2).replace('.', ',')}%`, color: colors.blue},
        ].map((b) => (
          <div key={b.label} style={{marginBottom: 36}}>
            <div style={{fontFamily: fonts.body, fontWeight: 600, fontSize: 28, color: ink, marginBottom: 10}}>{b.label}</div>
            <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
              <div style={{height: 46, width: Math.max(6, 760 * b.v * barGrow), background: b.color, borderRadius: 6}} />
              <div style={{fontFamily: fonts.mono, fontWeight: 800, fontSize: 30, color: b.color}}>{b.txt}</div>
            </div>
          </div>
        ))}
      </At>
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
            <At key={c.n} x={90} y={70 + i * 200} w={900} o={shell * (0.35 + 0.65 * o) * (frame >= CL ? 0.55 : 1)} style={{transform: `translateX(${(1 - shell) * 40}px)`}}>
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
          {from: RA, content: <>&lt; <span style={{color: colors.blue}}>0,5%</span> DANA BLACKROCK SAJA</>, size: 70},
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
      <Sfx name="typing-beep-computer-3" at={WH + 30} volume={0.12} frames={40} />
      <Sfx name="clock-ticking-1" at={OLD + 10} volume={0.14} frames={NEW - OLD - 6} />
      <Sfx name="transition-swoosh" at={NEW + 4} volume={0.32} />
      <Sfx name="hud-electronic-interface-sfx-pack-1" at={SP + 8} volume={0.24} />
      <Sfx name="coins-money-drop" at={CO + 30} volume={0.26} />
      <Sfx name="impact-bass-echo" at={RE} volume={0.22} />
      <Sfx name="ui-clicks-notification-pop" at={SZ + 4} volume={0.26} />
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
