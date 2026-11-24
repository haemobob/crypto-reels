/**
 * The trade on one line: Nvidia's real daily closes from the 13F disclosure (3 Nov 2025) to Huang's return
 * (23 Nov 2026), with the entry level ($206.88) as a blue rail across the whole year. The camera travels along the
 * line; red fills the gap when price is above the rail (a short is losing), green when it is below (winning).
 * Everything is drawn in screen space from a stage camera, so strokes and type stay crisp at any zoom.
 */
import type {ReactNode} from 'react';
import {useCurrentFrame} from 'remotion';
import {Enter, RollNumber} from '../../components/motion';
import {ease} from '../../theme/motion';
import {fonts} from '../../theme/typography';
import data from './data.json';
import {BLUE, GREEN, idn, life, partial, pathOf, ramp, RED, Tag} from './kit';
import {T} from './timing';

const NV = data.nvda;
const HIST = data.hist; // Jan–Oct 2025, before the disclosure (grey context)
const ENTRY = data.key.entry;
const iOf = (d: string) => NV.findIndex((p) => p.d === d);
const I_PEAK = iOf('2026-10-06');
const I_LOW = iOf('2026-11-20');
const I_BACK = iOf('2026-11-23');
const PEAK_HIGH = NV[I_PEAK].h;

// Stage units: 10 per trading day, 8 per dollar.
const X = (i: number) => i * 10;
const Y = (p: number) => (250 - p) * 8;
const CY = 1040; // screen y the camera centres on (the band under the caption line)

type Move = {at: number; dur?: number; x: number; y: number; s: number};
/** Camera moves on the narration's words (quick, eased), with a slow drift between them: calm, then a move. */
const MOVES = (): Move[] => [
  {at: T.bet - 24, x: X(-50), y: Y(160), s: 0.6},
  {at: T.ketahuan, x: X(-25), y: Y(180), s: 0.78},
  {at: T.turun - 4, x: X(5), y: Y(190), s: 0.9},
  {at: T.harganya - 2, x: X(30), y: Y(198), s: 0.96},
  {at: T.naik - 4, dur: 18, x: X(110), y: Y(206), s: 0.8},
  {at: T.naik + 22, dur: T.oktober - 8 - (T.naik + 22), x: X(I_PEAK) - 260, y: Y(220), s: 0.74},
  {at: T.oktober - 4, dur: 12, x: X(I_PEAK) - 180, y: Y(224), s: 0.86},
  {at: T.minus - 4, dur: 12, x: X(I_PEAK) - 90, y: Y(216), s: 0.96},
  {at: T.payoff - 2, dur: 12, x: X(I_PEAK) + 60, y: Y(190), s: 0.72},
  {at: T.payoff + 12, dur: T.panik - 6 - (T.payoff + 12), x: X(I_LOW) - 170, y: Y(168), s: 0.76},
  {at: T.panik - 4, dur: 12, x: X(I_LOW) - 140, y: Y(156), s: 0.9},
  {at: T.ambil - 4, dur: 12, x: X(I_LOW) - 200, y: Y(178), s: 0.96},
  {at: T.hasil - 2, dur: 10, x: X(I_LOW) - 170, y: Y(172), s: 0.88},
  {at: T.kalau - 4, dur: 12, x: X(I_LOW) - 120, y: Y(158), s: 0.78},
  {at: T.untungnya + 1, dur: 8, x: X(I_LOW) - 90, y: Y(154), s: 0.98},
  {at: T.kemudian - 2, dur: 12, x: X(I_BACK) - 150, y: Y(166), s: 0.74},
  {at: T.balik - 2, dur: 10, x: X(I_BACK) - 130, y: Y(160), s: 0.84},
  {at: T.takeaway, dur: 24, x: 1340, y: Y(188), s: 0.37},
  {at: T.setengah - 2, dur: 10, x: 1320, y: Y(190), s: 0.42},
  {at: T.leverage - 2, dur: 12, x: X(120), y: Y(206), s: 0.5},
  {at: T.futures, dur: 16, x: X(I_PEAK) - 200, y: Y(218), s: 0.6},
  {at: T.tinggal + 8, dur: 8, x: X(I_PEAK) - 110, y: Y(226), s: 0.8},
  {at: T.setengahnya - 2, dur: 12, x: 1300, y: Y(190), s: 0.38},
  {at: T.bertahan - 2, dur: 12, x: 1320, y: Y(188), s: 0.43},
];
/** Moves are eased; between moves the camera drifts linearly (a slow push and pan), so the frame never parks. */
const camera = (f: number) => {
  const m = MOVES();
  // Drift at a steady screen speed (≈ 45 px/s pan, 1.5%/s push) whatever the gap length.
  const drift = (k: Move, frames: number) => ({x: k.x + (1.5 * frames) / k.s, y: k.y, s: k.s * (1 + 0.0005 * frames)});
  // State at the end of move i, drifted for the time until the next move starts.
  let prev = {x: m[0].x, y: m[0].y, s: m[0].s};
  for (let i = 0; i < m.length; i++) {
    const start = m[i].at;
    const end = start + (m[i].dur ?? 14);
    const next = i + 1 < m.length ? m[i + 1].at : T.end + 120;
    const target = {x: m[i].x, y: m[i].y, s: m[i].s};
    if (f < start) return prev;
    if (f < end && i > 0) {
      const t = ramp(f, start, end, ease.out);
      return {x: prev.x + (target.x - prev.x) * t, y: prev.y + (target.y - prev.y) * t, s: prev.s + (target.s - prev.s) * t};
    }
    if (f < next) return drift(m[i], f - end);
    prev = drift(m[i], Math.max(0, next - end));
  }
  return prev;
};

/** How far along the series the line is drawn (fractional trading-day index). */
const drawnTo = (f: number) =>
  ramp(f, T.naik - 2, T.oktober + 8, ease.inOut) * I_PEAK +
  ramp(f, T.payoff, T.panik + 4, ease.inOut) * (I_LOW - I_PEAK) +
  ramp(f, T.kemudian, T.memantul + 4, ease.out) * (I_BACK - I_LOW);

/** A screen-positioned label pinned to a stage point. */
const Pin = ({at, out, sx, sy, dx = 0, dy = 0, align = 'left', children}: {at: number; out: number; sx: number; sy: number; dx?: number; dy?: number; align?: 'left' | 'right' | 'center'; children: ReactNode}) => {
  const f = useCurrentFrame();
  const o = life(f, at, out, 8, 6);
  if (o <= 0.01) return null;
  const shift = align === 'right' ? '-100%' : align === 'center' ? '-50%' : '0%';
  return <div style={{position: 'absolute', left: sx + dx, top: sy + dy, transform: `translate(${shift}, 0) translateY(${(1 - o) * 12}px)`, opacity: o}}>{children}</div>;
};

export const NvdaWorld = () => {
  const f = useCurrentFrame();
  const cam = camera(f);
  const sx = (x: number) => 540 + (x - cam.x) * cam.s;
  const sy = (y: number) => CY + (y - cam.y) * cam.s;
  const pts: Array<[number, number]> = NV.map((p, i) => [sx(X(i)), sy(Y(p.c))]);
  const hist: Array<[number, number]> = [...HIST, NV[0]].map((p, i) => [sx(X(i - HIST.length)), sy(Y(p.c))]);
  const histO = ramp(f, T.bet, T.bet + 16);
  const u = drawnTo(f);
  const line = partial(pts, u);
  const head = line[line.length - 1];
  const railY = sy(Y(ENTRY));
  const railT = ramp(f, T.harganya - 2, T.harganya + 22, ease.inOut);
  const railX0 = sx(X(0));
  const railX1 = railX0 + (sx(X(I_BACK) + 120) - railX0) * railT;
  // Gap fills: the drawn line closed back to the rail, clipped above (red) and below (green) the rail.
  const fillPath = line.length > 1 ? `${pathOf(line)}L${head[0].toFixed(1)},${railY.toFixed(1)}L${line[0][0].toFixed(1)},${railY.toFixed(1)}Z` : '';
  // Month gridlines (first trading day of each month).
  const months = [...HIST, ...NV].map((p, i) => ({i: i - HIST.length, m: p.d.slice(0, 7)})).filter((p, k, a) => k === 0 || p.m !== a[k - 1].m);
  const monthName = (m: string) => ['JAN', 'FEB', 'MAR', 'APR', 'MEI', 'JUN', 'JUL', 'AGU', 'SEP', 'OKT', 'NOV', 'DES'][Number(m.slice(5)) - 1] + (m.slice(5) === '01' ? ` ${m.slice(2, 4)}` : '');
  // Takeaway replay: a 5× short from the entry, marked against each day's high, as a dot runs to the peak.
  const replay = ramp(f, T.leverage + 4, T.tinggal + 6, ease.inOut) * I_PEAK;
  const ri = Math.min(I_PEAK, Math.floor(replay));
  const worstHigh = Math.max(ENTRY, ...NV.slice(0, ri + 1).map((p) => p.h));
  const margin = Math.max(0, 100 - 5 * ((worstHigh - ENTRY) / ENTRY) * 100);
  const replayPt = partial(pts, replay).slice(-1)[0];
  const showReplay = f >= T.leverage && f < T.setengahnya;
  const bounceO = life(f, T.balik - 4, T.takeaway, 8, 6);
  return (
    <div style={{position: 'absolute', inset: 0, background: '#000000'}}>
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
        <defs>
          <clipPath id="above">
            <rect x={-10} y={-10} width={1100} height={Math.max(0, railY + 10)} />
          </clipPath>
          <clipPath id="below">
            <rect x={-10} y={railY} width={1100} height={Math.max(0, 1940 - railY)} />
          </clipPath>
        </defs>
        {/* World: month gridlines and price levels, moving with the camera. */}
        {months.map(({i, m}) => (
          <line key={m} x1={sx(X(i))} x2={sx(X(i))} y1={470} y2={1600} stroke="#FFFFFF" strokeOpacity={0.06} strokeWidth={2} />
        ))}
        {[100, 125, 150, 175, 200, 225, 250].map((p) => (
          <line key={p} x1={0} x2={1080} y1={sy(Y(p))} y2={sy(Y(p))} stroke="#FFFFFF" strokeOpacity={0.07} strokeWidth={2} />
        ))}
        {/* Gap fills */}
        {fillPath && (
          <>
            <path d={fillPath} fill={RED} opacity={0.22} clipPath="url(#above)" />
            <path d={fillPath} fill={GREEN} opacity={0.22} clipPath="url(#below)" />
          </>
        )}
        {/* The rail: the entry level, the spine of the film */}
        {railT > 0 && <line x1={railX0} x2={railX1} y1={railY} y2={railY} stroke={BLUE} strokeWidth={5} strokeDasharray="16 10" />}
        {/* 2025 before the disclosure: grey context */}
        <path d={pathOf(hist)} fill="none" stroke="#6B778A" strokeWidth={4} strokeLinejoin="round" opacity={histO} />
        {/* The price line */}
        <path d={pathOf(line)} fill="none" stroke="#F2F5FA" strokeWidth={6} strokeLinejoin="round" strokeLinecap="round" />
        {/* Peak day's wick up to the intraday high */}
        {u >= I_PEAK - 0.5 && <line x1={pts[I_PEAK][0]} x2={pts[I_PEAK][0]} y1={pts[I_PEAK][1]} y2={sy(Y(PEAK_HIGH))} stroke={RED} strokeWidth={5} strokeLinecap="round" opacity={ramp(f, T.oktober, T.oktober + 8)} />}
        <circle cx={pts[0][0]} cy={pts[0][1]} r={12} fill={BLUE} stroke="#000" strokeWidth={3} />
        <circle cx={head[0]} cy={head[1]} r={11} fill="#FFFFFF" />
        {/* The bet: down arrow from the entry point */}
        {f >= T.turun - 4 && f < T.naik + 10 && (
          <g opacity={life(f, T.turun - 4, T.naik + 10, 8, 8)} transform={`translate(${pts[0][0] + 60} ${pts[0][1] + 30})`}>
            <line x1={0} y1={0} x2={0} y2={150 * ramp(f, T.turun - 4, T.turun + 10, ease.out)} stroke={BLUE} strokeWidth={8} strokeLinecap="round" />
            <path d={`M -24 ${150 * ramp(f, T.turun - 4, T.turun + 10, ease.out) - 26} L 0 ${150 * ramp(f, T.turun - 4, T.turun + 10, ease.out) + 4} L 24 ${150 * ramp(f, T.turun - 4, T.turun + 10, ease.out) - 26}`} fill="none" stroke={BLUE} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" />
          </g>
        )}
        {/* The bounce: Huang returns */}
        {bounceO > 0.01 && (
          <g opacity={bounceO}>
            <line x1={pts[I_LOW][0] + 26} x2={pts[I_LOW][0] + 26} y1={pts[I_LOW][1]} y2={pts[I_LOW][1] + (pts[I_BACK][1] - pts[I_LOW][1]) * ramp(f, T.kemudian, T.memantul + 4, ease.out)} stroke={BLUE} strokeWidth={6} strokeLinecap="round" />
          </g>
        )}
        {/* Takeaway replay dot */}
        {showReplay && replay > 0.2 && (
          <g opacity={life(f, T.leverage, T.setengahnya, 6, 6)}>
            <line x1={replayPt[0]} x2={replayPt[0]} y1={railY} y2={Math.min(railY, sy(Y(worstHigh)))} stroke={RED} strokeWidth={5} />
            <circle cx={replayPt[0]} cy={replayPt[1]} r={14} fill={RED} stroke="#000" strokeWidth={3} />
          </g>
        )}
      </svg>

      {/* Month labels along the bottom of the band */}
      {months.map(({i, m}) => {
        const x = sx(X(i));
        if (x < 190 || x > 1040) return null;
        return <div key={m} style={{position: 'absolute', left: x + 8, top: 1556, fontFamily: fonts.mono, fontWeight: 600, fontSize: 18, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.04em'}}>{monthName(m)}</div>;
      })}
      {/* Price scale on the right */}
      {[100, 125, 150, 175, 200, 225, 250].map((p) => {
        const y = sy(Y(p));
        if (y < 500 || y > 1540) return null;
        return <div key={p} style={{position: 'absolute', right: 24, top: y - 26, fontFamily: fonts.mono, fontWeight: 600, fontSize: 18, color: 'rgba(255,255,255,0.4)'}}>${p}</div>;
      })}
      <div style={{position: 'absolute', left: 24, top: 1556, fontFamily: fonts.mono, fontWeight: 700, fontSize: 18, color: 'rgba(255,255,255,0.55)', letterSpacing: '0.04em', opacity: ramp(f, T.bet, T.bet + 10)}}>NVDA · HARIAN</div>

      {/* Sticky rail tag: the entry price, pinned to the left edge at the rail's height */}
      {railT > 0.2 && (
        <div style={{position: 'absolute', left: Math.max(24, railX0 - 20), top: railY - 70, opacity: ramp(f, T.harganya, T.harganya + 10), background: 'rgba(0,0,0,0.86)', borderRadius: 10, padding: '2px 12px 4px 10px'}}>
          <span style={{fontFamily: fonts.mono, fontWeight: 800, fontSize: 40, color: BLUE, letterSpacing: '-0.02em'}}>${idn(ENTRY, 2)}</span>
          <span style={{marginLeft: 14, fontFamily: fonts.mono, fontWeight: 700, fontSize: 19, color: 'rgba(255,255,255,0.75)', letterSpacing: '0.04em'}}>HARGA SAAT TARUHAN DIUNGKAP</span>
        </div>
      )}

      {/* The bet */}
      <Pin at={T.bet + 6} out={T.naik + 6} sx={pts[0][0]} sy={pts[0][1]} dx={-20} dy={30} align="left">
        <Tag color="#FFFFFF" border="rgba(255,255,255,0.5)" size={22}>3 NOV 2025</Tag>
      </Pin>
      {f >= T.ketahuan - 2 && f < T.naik + 8 && (
        <div style={{position: 'absolute', left: 90, right: 90, top: 1340, opacity: life(f, T.ketahuan - 2, T.naik + 8, 10, 8), transform: `translateY(${(1 - ramp(f, T.ketahuan - 2, T.ketahuan + 10, ease.out)) * 30}px)`, background: '#EDEDED', borderRadius: 18, borderLeft: `10px solid ${BLUE}`, padding: '18px 26px'}}>
          <div style={{fontFamily: fonts.mono, fontWeight: 700, fontSize: 19, color: '#3B4A63', letterSpacing: '0.05em'}}>LAPORAN 13F KE SEC · SCION ASSET MANAGEMENT · 3 NOV 2025</div>
          <div style={{marginTop: 6, fontFamily: fonts.heading, fontWeight: 800, fontSize: 44, color: '#101828', letterSpacing: '-0.01em', lineHeight: 1.1}}>Put Nvidia: 1 juta saham (≈ $187 jt)</div>
          <div style={{marginTop: 4, fontFamily: fonts.mono, fontWeight: 600, fontSize: 18, color: '#4A5568'}}>PUT = UNTUNG KALAU HARGA TURUN · POSISI PER 30 SEP 2025</div>
        </div>
      )}

      {/* Loss first: the October high */}
      <Pin at={T.oktober} out={T.payoff + 10} sx={pts[I_PEAK][0]} sy={sy(Y(PEAK_HIGH))} dx={-24} dy={-118} align="right">
        <div style={{textAlign: 'right'}}>
          <div style={{fontFamily: fonts.mono, fontWeight: 700, fontSize: 22, color: 'rgba(255,255,255,0.8)', letterSpacing: '0.04em'}}>6 OKT 2026 · TERTINGGI</div>
          <div style={{fontFamily: fonts.mono, fontWeight: 800, fontSize: 58, color: '#FFFFFF', letterSpacing: '-0.02em'}}>${idn(PEAK_HIGH, 2)}</div>
        </div>
      </Pin>
      <Pin at={T.minus - 2} out={T.payoff + 10} sx={pts[I_PEAK][0]} sy={railY} dx={-30} dy={24} align="right">
        <Tag color={RED} size={26}>SHORT DI $206,88: −{idn(((PEAK_HIGH - ENTRY) / ENTRY) * 100)}%</Tag>
      </Pin>

      {/* The low and the profit */}
      <Pin at={T.panik - 2} out={T.takeaway} sx={pts[I_LOW][0]} sy={pts[I_LOW][1]} dx={34} dy={-40} align="left">
        <div style={{textAlign: 'left'}}>
          <div style={{fontFamily: fonts.mono, fontWeight: 800, fontSize: 52, color: GREEN, letterSpacing: '-0.02em'}}>${idn(NV[I_LOW].c, 2)}</div>
          <div style={{fontFamily: fonts.mono, fontWeight: 700, fontSize: 21, color: 'rgba(255,255,255,0.8)', letterSpacing: '0.04em'}}>20 NOV 2026 · TITIK TERENDAH</div>
        </div>
      </Pin>
      <Pin at={T.ambil - 2} out={T.kemudian} sx={pts[I_LOW][0]} sy={railY} dx={-84} dy={34} align="right">
        <div style={{textAlign: 'right'}}>
          <Tag color={BLUE} size={24}>20 NOV · BURRY AMBIL UNTUNG</Tag>
          {f >= T.hasil - 2 && (
            <div style={{marginTop: 10, opacity: ramp(f, T.hasil - 2, T.hasil + 8)}}>
              <Tag color="rgba(255,255,255,0.85)" border="rgba(255,255,255,0.4)" size={20}>HASIL ASLINYA TIDAK DIUMUMKAN</Tag>
            </div>
          )}
        </div>
      </Pin>
      <Pin at={T.balik - 2} out={T.takeaway} sx={pts[I_BACK][0]} sy={pts[I_BACK][1]} dx={40} dy={-120} align="left">
        <div style={{textAlign: 'left'}}>
          <div style={{fontFamily: fonts.mono, fontWeight: 800, fontSize: 52, color: BLUE, letterSpacing: '-0.02em'}}>+31,5%</div>
          <div style={{fontFamily: fonts.mono, fontWeight: 700, fontSize: 21, color: 'rgba(255,255,255,0.8)', letterSpacing: '0.04em'}}>23 NOV · HUANG KEMBALI</div>
        </div>
      </Pin>

      {/* SIMULASI: a plain $100 M short */}
      {f >= T.kalau - 4 && f < T.takeaway + 6 && (
        <div style={{position: 'absolute', left: 90, right: 90, top: 1330, opacity: life(f, T.kalau - 4, T.takeaway + 6, 10, 8), transform: `scale(${0.94 + 0.06 * ramp(f, T.kalau - 4, T.kalau + 8, ease.out)})`, transformOrigin: '50% 100%', background: '#0B1220', border: `2px solid ${GREEN}`, borderRadius: 20, padding: '18px 26px'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <span style={{fontFamily: fonts.mono, fontWeight: 800, fontSize: 20, color: '#0B1220', background: '#FFD166', padding: '4px 10px', borderRadius: 6, letterSpacing: '0.06em'}}>SIMULASI</span>
            <span style={{fontFamily: fonts.mono, fontWeight: 700, fontSize: 19, color: 'rgba(255,255,255,0.7)', letterSpacing: '0.04em'}}>SHORT BIASA · BUKAN HASIL ASLI BURRY</span>
          </div>
          <div style={{marginTop: 10, display: 'flex', alignItems: 'baseline', justifyContent: 'space-between'}}>
            <span style={{fontFamily: fonts.heading, fontWeight: 700, fontSize: 44, color: '#FFFFFF'}}>Short $100 jt</span>
            <span style={{fontFamily: fonts.mono, fontWeight: 800, fontSize: 76, color: GREEN, letterSpacing: '-0.03em'}}>
              {f >= T.untungnya - 2 ? (
                <>
                  +$<RollNumber value={39.3} at={T.untungnya - 2} dur={22} format={(n) => idn(n)} /> jt
                </>
              ) : (
                '…'
              )}
            </span>
          </div>
          <div style={{marginTop: 2, fontFamily: fonts.mono, fontWeight: 600, fontSize: 19, color: 'rgba(255,255,255,0.7)'}}>$206,88 → $125,53 = +39,3% · tanpa biaya</div>
        </div>
      )}

      {/* Takeaway: thesis, the leverage meter, the closing line */}
      {f >= T.takeaway && f < T.leverage + 4 && (
        <div style={{position: 'absolute', left: 60, right: 60, top: 600, textAlign: 'center', opacity: 1 - ramp(f, T.leverage - 4, T.leverage + 4)}}>
          <Enter at={T.takeaway + 26} kind="words" style={{fontFamily: fonts.heading, fontWeight: 700, fontSize: 70, lineHeight: 1.05, color: '#FFFFFF', letterSpacing: '-0.02em'}}>
            BENAR ARAH
          </Enter>
          <Enter at={T.setengah - 2} kind="scale" dur={12} style={{fontFamily: fonts.heading, fontWeight: 800, fontSize: 70, lineHeight: 1.05, color: BLUE, letterSpacing: '-0.02em'}}>
            = BARU SETENGAH
          </Enter>
        </div>
      )}
      {showReplay && (
        <div style={{position: 'absolute', left: 90, right: 90, top: 540, opacity: life(f, T.leverage, T.setengahnya, 8, 6)}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline'}}>
            <span style={{fontFamily: fonts.mono, fontWeight: 800, fontSize: 24, color: '#FFFFFF', letterSpacing: '0.05em'}}>LEVERAGE 5× · MODAL TERSISA{f >= T.futures ? <span style={{marginLeft: 10, color: '#0B1220', background: BLUE, padding: '2px 8px', borderRadius: 6, whiteSpace: 'nowrap'}}>FUTURES</span> : null}</span>
            <span style={{fontFamily: fonts.mono, fontWeight: 800, fontSize: 20, color: '#0B1220', background: '#FFD166', padding: '3px 9px', borderRadius: 6, letterSpacing: '0.06em'}}>SIMULASI</span>
          </div>
          <div style={{marginTop: 14, height: 34, borderRadius: 17, background: 'rgba(255,255,255,0.1)', overflow: 'hidden'}}>
            <div style={{width: `${margin}%`, height: '100%', borderRadius: 17, background: margin > 40 ? BLUE : RED}} />
          </div>
          <div style={{marginTop: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline'}}>
            <span style={{fontFamily: fonts.mono, fontWeight: 600, fontSize: 19, color: 'rgba(255,255,255,0.65)'}}>SAMPAI HARGA TERTINGGI 6 OKT</span>
            <span style={{display: 'inline-block', fontFamily: fonts.mono, fontWeight: 800, fontSize: 64, color: margin > 40 ? '#FFFFFF' : RED, letterSpacing: '-0.03em', transform: `scale(${1 + 0.18 * (ramp(f, T.tinggal + 6, T.tinggal + 10) - ramp(f, T.tinggal + 10, T.tinggal + 18))})`, transformOrigin: '100% 60%'}}>{Math.round(margin)}%</span>
          </div>
        </div>
      )}
      {f >= T.setengahnya - 2 && (
        <div style={{position: 'absolute', left: 60, right: 60, top: 600, textAlign: 'center'}}>
          <Enter at={T.setengahnya - 2} kind="blur" dur={12} style={{fontFamily: fonts.heading, fontWeight: 700, fontSize: 58, color: 'rgba(255,255,255,0.8)', letterSpacing: '-0.02em'}}>
            SETENGAHNYA LAGI:
          </Enter>
          <Enter at={T.bertahan - 2} kind="scale" dur={14} style={{marginTop: 6, fontFamily: fonts.heading, fontWeight: 800, fontSize: 80, lineHeight: 1.02, color: BLUE, letterSpacing: '-0.025em'}}>
            BERTAHAN SAMPAI TERBUKTI BENAR
          </Enter>
        </div>
      )}
    </div>
  );
};
