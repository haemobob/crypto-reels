import type {ReactNode} from 'react';
import {AbsoluteFill, Img, interpolate, useCurrentFrame} from 'remotion';
import captions from '../../../episodes/dompet-satoshi/captions.json';
import config from '../../../episodes/dompet-satoshi/episode.json';
import {Hi} from '../../components/Headline';
import {HeadlineTrack} from '../../components/HeadlineTrack';
import {useCues} from '../../lib/cues';
import type {EpisodeModule} from '../../lib/episode-module';
import type {Captions, EpisodeConfig} from '../../lib/types';
import type {CamKey} from '../../three/camera';
import {colors} from '../../theme/colors';
import {ease} from '../../theme/motion';
import {fonts} from '../../theme/typography';
import {Icon, Link, Node, TwentyMinutes} from './Chain';
import {Cover} from './Cover';
import {asset, Chip, clamp, DocWindow, life, PaperCard, ramp} from './Docs';
import patoshi from './patoshi.json';
import {Sound} from './Sound';
import {tilePos, Vaults} from './Vaults';

// Layout (screen px): micro captions y≈384, headline zone centred at 590, visuals 740–1440, source line 1530.
const HEADLINE_Y = 590;
const SOURCE_Y = 1530;
const RED = colors.negative;
const GREEN = colors.positive;
const INK = colors.ink;
const Red = ({children}: {children: ReactNode}) => <span style={{color: RED}}>{children}</span>;
const Blue = ({children}: {children: ReactNode}) => <span style={{color: colors.blue}}>{children}</span>;

/** secp256k1 group order n: private keys are integers 1..n−1, so this is the number of possible keys (78 digits). */
const N_ORDER = '115792089237316195423570985008687907852837564279074904382605163141518161494337';
const PUBKEY3 = (patoshi.firstKeys as Record<string, string>)['3'];

const OpeningTitle = ({until}: {until: number}) => {
  const frame = useCurrentFrame();
  if (frame >= until) return null;
  const r = interpolate(frame, [-8, 8], [0, 1], {extrapolateRight: 'clamp', easing: ease.out});
  const out = interpolate(frame, [until - 6, until], [1, 0], clamp);
  return (
    <div style={{position: 'absolute', left: 40, right: 40, top: HEADLINE_Y, transform: `translateY(calc(-50% + ${(1 - r) * 60}px))`, opacity: interpolate(r, [0, 0.5], [0, 1], {extrapolateRight: 'clamp'}) * out, textAlign: 'center', fontFamily: fonts.heading, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.0, color: colors.text, fontSize: 118}}>
      $6,3 MILIAR
      <br />
      <Red>DICURI</Red>
    </div>
  );
};

/** Two bars on one scale: the BTC taken from Binance's Bitcoin hot wallet vs the Patoshi-pattern coins. */
const Bars = ({from, to, grow, mark, still}: {from: number; to: number; grow: number; mark: number; still: number}) => {
  const f = useCurrentFrame();
  const o = life(f, from, to);
  if (o <= 0.01) return null;
  const full = 860;
  const g = ramp(f, grow, grow + 26, ease.out);
  const stolen = (18270 / 1097650) * full;
  const m = ramp(f, mark, mark + 10, ease.out);
  const s = ramp(f, still, still + 10, ease.out);
  return (
    <svg width={1080} height={300} style={{position: 'absolute', left: 0, top: 760, opacity: o, overflow: 'visible'}}>
      <text x={110} y={30} fontFamily={fonts.mono} fontWeight={700} fontSize={21} fill="#A8BDD8" letterSpacing="0.03em">DICURI DARI HOT WALLET BITCOIN BINANCE</text>
      <rect x={110} y={44} width={Math.max(6, stolen)} height={44} rx={6} fill={RED} />
      <text x={110 + stolen + 22} y={76} fontFamily={fonts.mono} fontWeight={700} fontSize={32} fill="#FFFFFF">18.270 BTC</text>
      <text x={110} y={148} fontFamily={fonts.mono} fontWeight={700} fontSize={21} fill="#A8BDD8" letterSpacing="0.03em">POLA PATOSHI · DIDUGA MILIK SATOSHI (PERKIRAAN)</text>
      <rect x={110} y={162} width={Math.max(0, full * g)} height={44} rx={6} fill={colors.blue} />
      {g > 0.6 && <text x={110 + 18} y={194} fontFamily={fonts.mono} fontWeight={700} fontSize={32} fill="#FFFFFF" opacity={ramp(f, grow + 14, grow + 24)}>±1.097.650 BTC</text>}
      {m > 0.01 && (
        <g opacity={m}>
          <rect x={808} y={226} width={162} height={50} rx={10} fill="rgba(41,151,255,0.15)" stroke={colors.electric} strokeWidth={2} />
          <text x={889} y={260} textAnchor="middle" fontFamily={fonts.heading} fontWeight={800} fontSize={32} fill="#FFFFFF">≈ 60×</text>
        </g>
      )}
      {s > 0.01 && (
        <text x={110} y={258} opacity={s} fontFamily={fonts.mono} fontWeight={700} fontSize={22} fill={GREEN} letterSpacing="0.03em">SEJAK 2009 · BELUM PERNAH DIPINDAH</text>
      )}
    </svg>
  );
};

/** The Bitcoin lock, intact: what the Binance hack did not break. */
const IntactLock = ({from, to}: {from: number; to: number}) => {
  const f = useCurrentFrame();
  const o = life(f, from, to);
  if (o <= 0.01) return null;
  const c = ramp(f, from + 14, from + 26, ease.out);
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: 820, opacity: o, textAlign: 'center'}}>
      <svg width={300} height={300} viewBox="0 0 100 100">
        <Icon kind="lock" color={colors.light} />
        {c > 0.01 && <path d="M30 64l12 12 24-26" stroke={GREEN} strokeWidth={8} fill="none" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={80} strokeDashoffset={80 * (1 - c)} transform="translate(2 -12)" />}
      </svg>
      <div style={{fontFamily: fonts.mono, fontWeight: 700, fontSize: 28, color: '#FFFFFF', letterSpacing: '0.05em', marginTop: 6}}>KRIPTOGRAFI BITCOIN</div>
      <div style={{fontFamily: fonts.heading, fontWeight: 800, fontSize: 44, color: GREEN, marginTop: 6, opacity: c}}>UTUH</div>
    </div>
  );
};

/** Guessing a private key: 64 hex digits that never come up right (an illustration, labelled). */
const KeyGuess = ({from, to}: {from: number; to: number}) => {
  const f = useCurrentFrame();
  const o = life(f, from, to);
  if (o <= 0.01) return null;
  const step = Math.floor((f - from) / 2);
  const hex = Array.from({length: 64}, (_, i) => {
    const x = Math.sin((step + 1) * 91.7 + i * 12.9898) * 43758.5453;
    return '0123456789abcdef'[Math.floor((x - Math.floor(x)) * 16)];
  }).join('');
  const tries = Math.floor(Math.pow(Math.max(0, f - from), 2.2) * 37 + (f - from) * 911);
  return (
    <div style={{position: 'absolute', left: 90, width: 900, top: 790 + (1 - o) * 20, opacity: o, textAlign: 'center'}}>
      <svg width={180} height={180} viewBox="0 0 100 100">
        <Icon kind="key" color={colors.light} />
      </svg>
      <div style={{fontFamily: fonts.mono, fontWeight: 700, fontSize: 24, color: '#A8BDD8', letterSpacing: '0.05em', marginTop: 10}}>TEBAKAN KUNCI PRIVAT · KE-{tries.toLocaleString('id-ID')}</div>
      <div style={{margin: '18px auto 0', width: 820, padding: '22px 26px', borderRadius: 16, border: '3px solid #2B3A57', background: '#070B14', fontFamily: fonts.mono, fontWeight: 600, fontSize: 34, lineHeight: 1.35, color: '#FFFFFF', letterSpacing: '0.02em', wordBreak: 'break-all'}}>
        {hex.slice(0, 32)}
        <br />
        {hex.slice(32)}
      </div>
      <div style={{marginTop: 18, fontFamily: fonts.heading, fontWeight: 800, fontSize: 40, color: RED}}>✕ SALAH</div>
      <div style={{marginTop: 12}}>
        <Chip color="#5D7BAA" size={18}>ILUSTRASI</Chip>
      </div>
    </div>
  );
};

/** The 78-digit number of possible private keys, typed out. */
const Digits = ({from, to, type: [a, b]}: {from: number; to: number; type: [number, number]}) => {
  const f = useCurrentFrame();
  const o = life(f, from, to);
  if (o <= 0.01) return null;
  const n = Math.round(interpolate(f, [a, b], [0, 78], {...clamp, easing: ease.inOut}));
  const shown = N_ORDER.slice(0, n);
  const lines = [shown.slice(0, 20), shown.slice(20, 40), shown.slice(40, 60), shown.slice(60)];
  const done = ramp(f, b, b + 10, ease.out);
  return (
    <div style={{position: 'absolute', left: 90, width: 900, top: 760 + (1 - o) * 20, opacity: o, textAlign: 'center'}}>
      <svg width={150} height={150} viewBox="0 0 100 100">
        <Icon kind="lock" color={colors.light} />
      </svg>
      <div style={{fontFamily: fonts.mono, fontWeight: 700, fontSize: 22, color: '#A8BDD8', letterSpacing: '0.05em', marginTop: 8, opacity: ramp(f, a - 10, a)}}>JUMLAH KEMUNGKINAN KUNCI PRIVAT (1 BRANKAS)</div>
      <div style={{marginTop: 16, height: 300, fontFamily: fonts.mono, fontWeight: 700, fontSize: 56, lineHeight: 1.3, color: '#FFFFFF', letterSpacing: '0.02em'}}>
        {lines.map((l, i) => (
          <div key={i}>{l || ' '}</div>
        ))}
      </div>
      <div style={{marginTop: 6, display: 'flex', justifyContent: 'center', gap: 16, opacity: done}}>
        <Chip color={colors.electric} size={26}>{n} DIGIT</Chip>
        <Chip color="#5D7BAA" size={26}>≈ 1,16 × 10⁷⁷</Chip>
      </div>
    </div>
  );
};

/** Block 3's full public key, as it sits on the blockchain (P2PK). */
const PubKey = ({from, to}: {from: number; to: number}) => {
  const f = useCurrentFrame();
  const o = life(f, from, to);
  if (o <= 0.01) return null;
  const n = Math.round(interpolate(f, [from, from + 26], [0, PUBKEY3.length], {...clamp, easing: ease.out}));
  const s = PUBKEY3.slice(0, n);
  return (
    <div style={{position: 'absolute', left: 90, width: 900, top: 1236 + (1 - o) * 20, opacity: o, boxSizing: 'border-box', background: '#FFFFFF', borderRadius: 16, border: `3px solid ${INK}`, padding: '16px 20px'}}>
      <div style={{display: 'flex', justifyContent: 'space-between', fontFamily: fonts.mono, fontWeight: 700, fontSize: 18, letterSpacing: '0.05em', color: '#3B4A63'}}>
        <span>KUNCI PUBLIK · BLOK 3 (P2PK)</span>
        <span style={{color: RED}}>TERLIHAT SEMUA ORANG</span>
      </div>
      <div style={{marginTop: 10, fontFamily: fonts.mono, fontWeight: 600, fontSize: 21, lineHeight: 1.45, color: INK, letterSpacing: '0.02em', wordBreak: 'break-all'}}>
        {s.slice(0, 65)}
        <br />
        {s.slice(65) || ' '}
      </div>
    </div>
  );
};

/** Quantum: the real IBM photo beside the three-step chain public key → (quantum) → private key. */
const Quantum = ({from, to, theory, compute, none}: {from: number; to: number; theory: number; compute: number; none: number}) => {
  const f = useCurrentFrame();
  const o = life(f, from, to);
  if (o <= 0.01) return null;
  const box = (label: ReactNode, y: number, a: number, accent: string) => (
    <div style={{position: 'absolute', left: 0, width: 440, top: y + (1 - a) * 16, opacity: a, boxSizing: 'border-box', padding: '16px 18px', borderRadius: 14, background: '#FFFFFF', border: `3px solid ${accent}`, fontFamily: fonts.heading, fontWeight: 800, fontSize: 30, lineHeight: 1.1, color: INK, textAlign: 'center'}}>{label}</div>
  );
  const a1 = ramp(f, from + 4, from + 14, ease.out);
  const a2 = ramp(f, from + 14, from + 24, ease.out);
  const a3 = ramp(f, compute, compute + 12, ease.out);
  const th = ramp(f, theory, theory + 8, ease.out);
  const st = ramp(f, none, none + 8, ease.out);
  const arrow = (y: number, a: number) => (
    <svg width={440} height={60} style={{position: 'absolute', left: 0, top: y, opacity: a}}>
      <path d="M220 6v40M206 34l14 14 14-14" stroke={INK} strokeWidth={5} fill="none" strokeLinecap="round" />
    </svg>
  );
  return (
    <div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, opacity: o}}>
      <div style={{position: 'absolute', left: 90, top: 760, width: 400}}>
        <div style={{width: 400, height: 560, borderRadius: 20, overflow: 'hidden', border: `3px solid ${INK}`, boxShadow: '0 24px 60px rgba(0,0,0,0.25)'}}>
          <Img src={asset('ibm-quantum-system-one.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 40%', transform: `scale(${interpolate(f, [from, to], [1.02, 1.1], clamp)})`}} />
        </div>
        <div style={{marginTop: 8, fontFamily: fonts.mono, fontSize: 15, fontWeight: 600, letterSpacing: '0.03em', color: '#4A5568', lineHeight: 1.35}}>IBM QUANTUM SYSTEM ONE, 2024<br />FOTO: OJB QUANTUM · CC BY 4.0</div>
      </div>
      <div style={{position: 'absolute', left: 530, top: 772, width: 440, height: 600}}>
        {box('KUNCI PUBLIK', 0, a1, colors.blue)}
        {arrow(86, a2)}
        {box(<>KOMPUTER KUANTUM<br />BESAR</>, 150, a2, INK)}
        {arrow(276, a3)}
        {box(<>KUNCI <Red>PRIVAT</Red>?</>, 340, a3, RED)}
        {th > 0.01 && (
          <div style={{position: 'absolute', left: 0, width: 440, top: 446, textAlign: 'center', opacity: th}}>
            <Chip color={INK} bg="#EDEDED" size={20} style={{color: INK}}>SECARA TEORI (ALGORITMA SHOR)</Chip>
          </div>
        )}
        {st > 0.01 && (
          <div style={{position: 'absolute', left: 20, top: 166, width: 400, transform: `rotate(-6deg) scale(${1.25 - 0.25 * st})`, opacity: st, textAlign: 'center', border: `5px solid ${RED}`, borderRadius: 12, padding: '10px 0', background: 'rgba(237,237,237,0.94)', fontFamily: fonts.heading, fontWeight: 800, fontSize: 44, color: RED, letterSpacing: '0.02em'}}>BELUM ADA</div>
        )}
      </div>
    </div>
  );
};

/** Payoff board: what broke vs what held. */
const Board = ({from, to, held, key1, key2}: {from: number; to: number; held: number; key1: number; key2: number}) => {
  const f = useCurrentFrame();
  const o = life(f, from, to);
  if (o <= 0.01) return null;
  const row = (icon: Parameters<typeof Icon>[0]['kind'], label: ReactNode, at: number, mark: '✕' | '✓', color: string) => {
    const a = ramp(f, at, at + 10, ease.out);
    if (a <= 0.01) return null;
    return (
      <div style={{display: 'flex', alignItems: 'center', gap: 14, marginTop: 16, opacity: a, transform: `translateY(${(1 - a) * 14}px)`}}>
        <svg width={64} height={64} viewBox="0 0 100 100" style={{flex: 'none'}}>
          <Icon kind={icon} />
        </svg>
        <div style={{flex: 1, fontFamily: fonts.heading, fontWeight: 800, fontSize: 30, lineHeight: 1.08, color: '#FFFFFF'}}>{label}</div>
        <div style={{fontFamily: fonts.heading, fontWeight: 800, fontSize: 40, color}}>{mark}</div>
      </div>
    );
  };
  const col = (title: string, color: string, children: ReactNode) => (
    <div style={{width: 432, boxSizing: 'border-box', padding: '18px 20px 22px', borderRadius: 18, background: 'rgba(11,23,48,0.9)', border: `3px solid ${color}`}}>
      <div style={{fontFamily: fonts.mono, fontWeight: 700, fontSize: 22, letterSpacing: '0.06em', color}}>{title}</div>
      {children}
    </div>
  );
  return (
    <div style={{position: 'absolute', left: 90, width: 900, top: 1080 + (1 - o) * 20, opacity: o, display: 'flex', justifyContent: 'space-between'}}>
      {col('YANG JEBOL', RED, <>
        {row('wallet', <>TEMPAT KUNCI DISIMPAN</>, key1, '✕', RED)}
        {row('staff', <>ORANG YANG MEMEGANGNYA</>, key2, '✕', RED)}
      </>)}
      {col('YANG UTUH', GREEN, <>
        {row('lock', <>MATEMATIKA BITCOIN</>, held, '✓', GREEN)}
        {row('key', <>22.000 BRANKAS SATOSHI</>, held + 10, '✓', GREEN)}
      </>)}
    </div>
  );
};

/** Final card: on an exchange, the exchange holds the key. */
const ExchangeKey = ({from, to}: {from: number; to: number}) => {
  const f = useCurrentFrame();
  const o = life(f, from, to);
  if (o <= 0.01) return null;
  const k = ramp(f, from + 10, from + 26, ease.inOut);
  return (
    <svg width={1080} height={300} style={{position: 'absolute', left: 0, top: 760, opacity: o}}>
      <g transform="translate(150 40)">
        <circle cx={70} cy={110} r={66} fill="#0B1730" stroke={colors.electric} strokeWidth={5} />
        <g transform="translate(34 74) scale(0.72)"><Icon kind="staff" /></g>
        <text x={70} y={214} textAnchor="middle" fontFamily={fonts.heading} fontWeight={800} fontSize={28} fill="#FFFFFF">AKUN LO</text>
      </g>
      <line x1={300} y1={150} x2={560} y2={150} stroke="#5D7BAA" strokeWidth={4} strokeDasharray="10 8" />
      <g transform="translate(560 30)">
        <rect x={0} y={0} width={360} height={220} rx={20} fill="#0B1730" stroke={colors.electric} strokeWidth={5} />
        <text x={180} y={52} textAnchor="middle" fontFamily={fonts.mono} fontWeight={700} fontSize={24} fill="#A8BDD8" letterSpacing="0.06em">EXCHANGE</text>
        <g transform={`translate(${130 - (1 - k) * 330} 80) scale(1.0)`} opacity={0.3 + 0.7 * k}><Icon kind="key" color={colors.yellow} /></g>
        <text x={180} y={200} textAnchor="middle" fontFamily={fonts.heading} fontWeight={800} fontSize={26} fill={colors.yellow} opacity={k}>KUNCI DI SINI</text>
      </g>
    </svg>
  );
};

const Scene = () => {
  const f = useCurrentFrame();
  const {cue, word, narrationEnd} = useCues();
  const b = {
    hook: cue('hook'), satoshi: cue('satoshi'), how: cue('how'), still: cue('still'), split: cue('split'), digits: cue('digits'), quantum: cue('quantum'), payoff: cue('payoff'), end: narrationEnd,
    binance: word('binance', 0), kebanyakan: word('kebanyakan'), juta: word('juta'), satoshiW: word('satoshi', 0), hampir: word('hampir'),
    menurut: word('menurut', 0), menipu: word('menipu'), engineer: word('engineer'), wawancara: word('wawancara'), menguasai: word('menguasai'), online: word('online'),
    dipindah: word('dipindah'), nggakAda: word('nggak', 3), karyawan: word('karyawan'), satuSatunya: word('satusatunya'),
    dompet: word('dompet', 1), lerner: word('lerner'), tersebar: word('tersebar'), awal: word('awal', 0), masing: word('masingmasing'), berbeda: word('berbeda'),
    brankas: word('brankas'), untuk: word('untuk', 0), jumlah: word('jumlah'), tujuh: word('tujuh'), digit: word('digit'),
    format: word('format'), memajang: word('memajang'), komputer: word('komputer'), teori: word('teori'), menghitung: word('menghitung'), mesinnya: word('mesinnya'), draf: word('draf'), membekukan: word('membekukan'),
    bukan2: word('bukan', 1), tempat: word('tempat'), orang: word('orang'), kalau: word('kalau'),
  };

  // Chapters by meaning: navy = the hack, black = Satoshi's coins, off-white = the caveat, navy = the payoff.
  const ground = f < b.satoshi ? colors.bg : f < b.how ? '#000000' : f < b.still ? colors.bg : f < b.quantum ? '#000000' : f < b.payoff ? colors.offWhite : colors.bg;

  // 3D: one safe splits into 21,953 safes, one per Patoshi block.
  const p0 = tilePos(0);
  const vt = {start: b.split, split: b.dompet + 2, settled: b.tersebar, sweep: [b.tersebar + 2, b.awal + 6] as [number, number], dive: b.masing, back: b.digits, end: b.untuk};
  // Framings solved so the field stays inside the visual band (y 780–1420) and out of the text zones; shots are joined
  // by cuts, except the one hero move (safe → field) during which the text is muted.
  // The field is drawn at half scale (Vaults), so field-space framings are halved here.
  const close = {pos: [(p0[0] - 4.75) / 2, 5.41, (p0[1] + 16.29) / 2] as [number, number, number], look: [(p0[0] + 3) / 2, 0.125, (p0[1] - 5) / 2] as [number, number, number]};
  const keys: CamKey[] = [
    {f: b.split, pos: [0, 3.2, 19.6], look: [0, 2.1, 0], fov: 34},
    {f: vt.split, pos: [0, 3.3, 18.6], look: [0, 2.1, 0], fov: 34, ease: 'linear'},
    {f: b.tersebar, pos: [0, 109, 143.65], look: [0, 0, -12], fov: 56},
    {f: b.masing - 1, pos: [2.5, 110.5, 145.5], look: [0.75, 0, -12], fov: 56, ease: 'linear'},
    {f: b.masing, pos: close.pos, look: close.look, fov: 36},
    {f: b.digits - 1, pos: [close.pos[0] + 0.3, close.pos[1] - 0.25, close.pos[2] - 0.45], look: close.look, fov: 36, ease: 'linear'},
    {f: b.digits, pos: [0, 187.4, 171.4], look: [0, 0, -16], fov: 48},
    {f: b.untuk, pos: [0, 189, 173.5], look: [0, 0, -16], fov: 48, ease: 'linear'},
  ];
  const fog: [number, number] = f >= b.masing && f < b.digits ? [11.75, 14.25] : f >= b.digits ? [300, 460] : [215, 380];

  const source =
    f < b.satoshi ? 'TRM LABS & CHAINALYSIS, 30 OKT 2026 · LOGO: BINANCE'
      : f < b.how ? '18.270 BTC: TRM LABS · PERKIRAAN: POLA PATOSHI (S. D. LERNER) · WHITEPAPER: BITCOIN.ORG'
        : f < b.still ? 'PENILAIAN AWAL BINANCE via NPR, 3 NOV 2026 · TRM LABS'
          : f < b.satuSatunya ? 'DATA ON-CHAIN: MEMPOOL.SPACE · DICEK 19 NOV 2026'
            : f < b.split ? 'TEBAKAN: ILUSTRASI'
              : f < b.untuk ? 'DATA: 21.953 BLOK POLA PATOSHI (LERNER · LOPP) · DIDUGA MILIK SATOSHI'
                : f < b.quantum ? 'ORDE KURVA secp256k1 · STANDAR BITCOIN'
                  : f < b.komputer ? 'MEMPOOL.SPACE · BLOK 3, 9 JAN 2009'
                    : f < b.draf ? 'BELUM ADA KOMPUTER KUANTUM YANG MAMPU · FOTO: OJB QUANTUM (CC BY 4.0)'
                      : f < b.payoff ? 'BIP-361 · GITHUB.COM/BITCOIN/BIPS · DRAF, BELUM DIADOPSI'
                        : 'TRM LABS · NPR · MEMPOOL.SPACE';
  const light = f >= b.quantum && f < b.payoff;

  return (
    <AbsoluteFill style={{backgroundColor: ground}}>
      {/* --- Hook: the hack. --- */}
      {f < b.satoshi && (
        <div style={{position: 'absolute', left: 0, right: 0, top: 772, textAlign: 'center', opacity: life(f, 8, b.satoshi)}}>
          <Img src={asset('binance-logo.svg')} style={{width: 470}} />
        </div>
      )}
      <PaperCard from={b.binance - 4} to={b.satoshi} y={900} source="TRM LABS · 30 OKT 2026" tag="LAPORAN" size={34}>
        North Korea Steals USD 6.36 Billion From Binance in the Largest Hack in History
      </PaperCard>
      <TwentyMinutes from={b.kebanyakan - 2} to={b.satoshi} sweep={[b.kebanyakan, b.satoshi - 6]} y={1150} />

      {/* --- Satoshi's coins: 60× the stolen BTC, never moved. --- */}
      <Bars from={b.satoshi + 2} to={b.how} grow={b.juta - 10} mark={b.juta + 18} still={b.hampir} />
      <DocWindow src="whitepaper-p1.jpg" size={[1870, 2420]} from={b.satoshiW - 6} to={b.how} y={1090} h={330} focus={[360, 250, 1150, 300]} zoomAt={b.satoshiW + 8} zoomEnd={b.satoshiW + 30} dark={false} credit="WHITEPAPER BITCOIN, 2008 · BITCOIN.ORG" />

      {/* --- How Binance fell: a person and an online hot wallet. --- */}
      <IntactLock from={b.how + 2} to={b.menurut} />
      <PaperCard from={b.menurut} to={b.still} y={762} source="NPR · 3 NOV 2026" tag="PENILAIAN AWAL BINANCE" size={34}>
        A Binance engineer thought he was interviewing for a job. Then the hackers pounced
      </PaperCard>
      {f >= b.menipu - 2 && f < b.still && (
        <>
          <Link x1={252} x2={348} y={1150} o={life(f, b.wawancara, b.still)} t={ramp(f, b.wawancara, b.wawancara + 16)} color={RED} />
          <Link x1={492} x2={588} y={1150} o={life(f, b.wawancara + 10, b.still)} t={ramp(f, b.wawancara + 10, b.wawancara + 26)} color={RED} />
          <Link x1={732} x2={828} y={1150} o={life(f, b.menguasai, b.still)} t={ramp(f, b.menguasai, b.menguasai + 16)} color={RED} />
          <Node x={180} y={1150} o={life(f, b.menipu, b.still)} kind="recruiter" label={<>REKRUTER<br />PALSU</>} accent={RED} />
          <Node x={420} y={1150} o={life(f, b.wawancara, b.still)} kind="file" label={<>"TUGAS"<br />= MALWARE</>} accent={RED} />
          <Node x={660} y={1150} o={life(f, b.engineer, b.still)} kind="laptop" label={<>LAPTOP<br />ENGINEER</>} />
          <Node x={900} y={1150} o={life(f, b.menguasai, b.still)} kind="wallet" label={<>HOT<br />WALLET</>} sub={f >= b.online - 4 ? 'SELALU ONLINE' : undefined} accent={f >= b.online - 4 ? RED : colors.electric} pulse={f >= b.online - 4 ? ((f - b.online + 4) % 24) / 24 : 0} />
        </>
      )}

      {/* --- Why Satoshi differs: never moved, nothing online, nobody to trick. --- */}
      <DocWindow src="mempool-block3.jpg" size={[2200, 2800]} from={b.still} to={b.satuSatunya} y={760} h={430} focus={[1110, 1925, 1040, 105]} zoomAt={b.still + 14} zoomEnd={b.still + 40} mark="out" credit="MEMPOOL.SPACE · TRANSAKSI BLOK 3 · DIAMBIL 19 NOV 2026" />
      {f >= b.dipindah - 4 && f < b.nggakAda + 4 && (
        <div style={{position: 'absolute', left: 0, right: 0, top: 1300, textAlign: 'center', opacity: life(f, b.dipindah - 4, b.nggakAda + 4)}}>
          <Chip color={GREEN} size={24}>BLOK 3 · 9 JAN 2009 · 50 BTC · BELUM PERNAH DIPAKAI</Chip>
        </div>
      )}
      {f >= b.nggakAda - 2 && f < b.satuSatunya && (
        <>
          <Node x={380} y={1336} o={life(f, b.nggakAda, b.satuSatunya)} kind="wallet" label="HOT WALLET" crossed={ramp(f, b.nggakAda + 6, b.nggakAda + 18)} />
          <Node x={700} y={1336} o={life(f, b.karyawan - 6, b.satuSatunya)} kind="staff" label="KARYAWAN" crossed={ramp(f, b.karyawan, b.karyawan + 12)} />
        </>
      )}
      <KeyGuess from={b.satuSatunya} to={b.split} />

      {/* --- The breakdown in 3D: 21,953 safes. --- */}
      <Vaults t={vt} keys={keys} fog={fog} />
      {f >= b.tersebar && f < b.masing && (
        <div style={{position: 'absolute', left: 0, right: 0, top: 1446, textAlign: 'center', opacity: life(f, b.tersebar, b.masing)}}>
          <Chip size={22}>POLA "PATOSHI" (S. D. LERNER) · 21.953 BLOK × 50 BTC</Chip>
        </div>
      )}
      {f >= b.digits && f < b.untuk && (
        <div style={{position: 'absolute', left: 0, right: 0, top: 1446, textAlign: 'center', opacity: life(f, b.digits, b.untuk)}}>
          <Chip size={24}>21.953 BRANKAS · ≈ 1,1 JUTA BTC</Chip>
        </div>
      )}
      <Digits from={b.untuk} to={b.quantum} type={[b.jumlah, b.digit + 4]} />

      {/* --- The caveat (off-white): exposed public keys, quantum, the draft freeze. --- */}
      <DocWindow src="mempool-block3.jpg" size={[2200, 2800]} from={b.quantum} to={b.komputer} y={770} h={430} focus={[1110, 1925, 1040, 105]} zoomAt={b.quantum - 30} zoomEnd={b.quantum - 29} mark="out" credit="MEMPOOL.SPACE · BLOK 3, 9 JAN 2009" />
      <PubKey from={b.memajang} to={b.komputer} />
      <Quantum from={b.komputer} to={b.draf} theory={b.teori} compute={b.menghitung} none={b.mesinnya} />
      <DocWindow src="bip361-github.jpg" size={[2200, 2800]} from={b.draf} to={b.payoff} y={760} h={540} focus={[790, 870, 980, 580]} zoomAt={b.draf + 10} zoomEnd={b.draf + 34} mark="draft" dark={false} credit="GITHUB.COM/BITCOIN/BIPS · BIP-361 (BSD-3-CLAUSE)" />
      {f >= b.membekukan && f < b.payoff && (
        <div style={{position: 'absolute', left: 0, right: 0, top: 1360, textAlign: 'center', opacity: life(f, b.membekukan, b.payoff)}}>
          <Chip color={RED} bg="#FFFFFF" size={24} style={{color: INK}}>DRAF · BELUM DIADOPSI · BELUM ADA TANGGAL</Chip>
        </div>
      )}

      {/* --- Payoff: the 20 minutes again, what broke and what held. --- */}
      <TwentyMinutes from={b.payoff} to={b.kalau} sweep={[b.payoff - 2, b.payoff - 1]} y={740} />
      <Board from={b.bukan2 - 4} to={b.end + 18} held={b.bukan2} key1={b.tempat} key2={b.orang} />
      <ExchangeKey from={b.kalau} to={b.end + 18} />

      <OpeningTitle until={b.satoshi} />
      <HeadlineTrack
        centerY={HEADLINE_Y}
        until={b.quantum}
        cues={[
          {from: b.satoshi + 2, content: <>1,1 JUTA BTC<br /><Hi>MILIK SATOSHI?</Hi></>, size: 96},
          {from: b.hampir, content: <>±18 TAHUN<br /><Hi>NGGAK DIBOBOL</Hi></>, size: 96},
          {from: b.how, content: <>BITCOIN-NYA<br /><Hi>NGGAK DIBOBOL</Hi></>, size: 92},
          {from: b.menipu - 2, content: <>YANG DITIPU:<br /><Red>SATU ENGINEER</Red></>, size: 88},
          {from: b.menguasai, content: <>LALU MENGUASAI<br /><Red>HOT WALLET</Red></>, size: 92},
          {from: b.still, content: <>KOIN SATOSHI<br /><Hi>NGGAK PERNAH DIPINDAH</Hi></>, size: 80},
          {from: b.nggakAda, content: <>NGGAK ADA YANG<br /><Hi>BISA DITIPU</Hi></>, size: 88},
          {from: b.satuSatunya, content: <>SATU-SATUNYA JALAN:<br /><Hi>MENEBAK KUNCI</Hi></>, size: 80},
          {from: b.split, content: <>BUKAN<br /><Hi>SATU DOMPET</Hi></>, size: 100},
          {from: vt.split, content: null},
          {from: b.tersebar, content: <>TERSEBAR DI<br /><Hi>±22.000 BLOK</Hi></>, size: 96},
          {from: b.masing, content: <>TIAP BLOK 50 BTC,<br /><Hi>KUNCI BERBEDA</Hi></>, size: 84},
          {from: b.digits, content: <>22.000<br /><Hi>BRANKAS</Hi></>, size: 110},
          {from: b.jumlah, content: <>1 KUNCI DARI<br /><Hi>ANGKA 78 DIGIT</Hi></>, size: 90},
        ]}
      />
      <HeadlineTrack
        centerY={HEADLINE_Y}
        until={b.payoff}
        color={INK}
        cues={[
          {from: b.quantum, content: <>TAPI ADA<br /><Red>SATU CELAH</Red></>, size: 100},
          {from: b.format, content: <>KUNCI PUBLIKNYA<br /><Blue>TERPAJANG</Blue></>, size: 90},
          {from: b.komputer, content: <>KOMPUTER KUANTUM<br /><Blue>BISA MENGHITUNGNYA?</Blue></>, size: 76},
          {from: b.mesinnya, content: <>MESINNYA<br /><Red>BELUM ADA</Red></>, size: 100},
          {from: b.draf, content: <>DRAF: BEKUKAN<br /><Blue>KOIN MODEL LAMA</Blue></>, size: 86},
        ]}
      />
      <HeadlineTrack
        centerY={HEADLINE_Y}
        until={b.end + 18}
        cues={[
          {from: b.payoff, content: <>YANG JEBOL<br /><Red>BUKAN BITCOIN-NYA</Red></>, size: 88},
          {from: b.tempat, content: <>TAPI TEMPAT KUNCI<br /><Red>&amp; ORANGNYA</Red></>, size: 86},
          {from: b.kalau, content: <>KRIPTO LO DI EXCHANGE?<br /><Hi>KUNCI DIPEGANG EXCHANGE</Hi></>, size: 62},
        ]}
      />
      <div style={{position: 'absolute', left: 60, right: 60, top: SOURCE_Y, textAlign: 'center', fontFamily: fonts.mono, fontWeight: 500, fontSize: 18, letterSpacing: '0.03em', color: light ? '#4A5568' : '#9FB3D6', lineHeight: 1.4}}>{source}</div>
      <Sound />
    </AbsoluteFill>
  );
};

const fps = 30;
const q = captions.cues as Record<string, number>;
const wordAt = (w: string, nth = 0) => Math.round((captions.words as Array<{text: string; start: number}>).filter((x) => x.text.toLowerCase().replace(/[^\p{L}\p{N}]/gu, '') === w)[nth].start * fps);
// The hero move (one safe → 21,953 safes) crosses the text zones, so the micro captions sit it out.
const heroMove: Array<[number, number]> = [[wordAt('dompet', 1) + 2, wordAt('tersebar')]];

const episode: EpisodeModule = {config: config as EpisodeConfig, captions: captions as Captions, Scene, Cover, logoHide: [[Math.round(q.quantum * fps), Math.round(q.payoff * fps)]], captionMute: heroMove};
export default episode;
