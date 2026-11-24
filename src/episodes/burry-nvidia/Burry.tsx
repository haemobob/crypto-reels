/**
 * Who he is: the real premiere photo (tight on the face, then wide enough to show "THE BIG SHORT" behind him), and
 * the off-white archive chapter: his desk photo and the real US house-price index 2000–2012 with 2005 and 2008 marked.
 */
import {Img, staticFile, useCurrentFrame} from 'remotion';
import {Enter, RollNumber} from '../../components/motion';
import {ease} from '../../theme/motion';
import {fonts} from '../../theme/typography';
import data from './data.json';
import {BLUE, idn, partial, pathOf, ramp, RED} from './kit';
import {T} from './timing';

const photo = (f: string) => staticFile(`episodes/burry-nvidia/photos/${f}`);
const BAND_TOP = 470;
const BAND_H = 1450;

// premiere.jpg is 2000×1500. Pose = scale k and which photo point sits where in the band.
type Pose = {k: number; fx: number; fy: number; sx: number; sy: number};
const TIGHT: Pose = {k: 1.3, fx: 960, fy: 600, sx: 540, sy: 600};
const WIDE: Pose = {k: 0.97, fx: 1250, fy: 620, sx: 540, sy: 600};
/** Where "THE BIG SHORT" on the backdrop lands on screen in the wide pose (the zoom-through origin). */
export const BIG_SHORT_SCREEN: [number, number] = [WIDE.sx + (1360 - WIDE.fx) * WIDE.k, BAND_TOP + WIDE.sy + (580 - WIDE.fy) * WIDE.k];

export const Portrait = () => {
  const f = useCurrentFrame();
  const w = ramp(f, T.film - 4, T.film + 26, ease.inOut);
  const mix = (a: number, b: number) => a + (b - a) * w;
  // Keep drifting inside each pose (push ~4%) so the photo never parks.
  const drift = 1 + 0.045 * ramp(f, T.trader, T.film, ease.inOut) + 0.035 * ramp(f, T.film + 20, T.tahun, ease.inOut);
  const k = mix(TIGHT.k, WIDE.k) * drift;
  const fx = mix(TIGHT.fx, WIDE.fx);
  const fy = mix(TIGHT.fy, WIDE.fy);
  const left = mix(TIGHT.sx, WIDE.sx) - fx * k;
  const top = mix(TIGHT.sy, WIDE.sy) - fy * k;
  const nameO = ramp(f, T.michael - 2, T.michael + 10, ease.out) * (1 - ramp(f, T.film - 6, T.film + 2));
  return (
    <div style={{position: 'absolute', inset: 0, background: '#000'}}>
      <div style={{position: 'absolute', left: 0, top: BAND_TOP, width: 1080, height: BAND_H, overflow: 'hidden'}}>
        <Img src={photo('premiere.jpg')} style={{position: 'absolute', left, top, width: 2000 * k, height: 1500 * k}} />
      </div>
      {nameO > 0.01 && (
        <div style={{position: 'absolute', left: 90, top: 1330, opacity: nameO, transform: `translateY(${(1 - nameO) * 20}px)`}}>
          <div style={{fontFamily: fonts.heading, fontWeight: 800, fontSize: 84, lineHeight: 1, color: '#FFFFFF', letterSpacing: '-0.025em', textShadow: '0 4px 30px rgba(0,0,0,0.7)'}}>MICHAEL BURRY</div>
          <div style={{marginTop: 14, fontFamily: fonts.mono, fontWeight: 700, fontSize: 25, color: '#FFFFFF', letterSpacing: '0.06em', textShadow: '0 2px 12px rgba(0,0,0,0.95)'}}><span style={{color: BLUE}}>■</span> INVESTOR · PENDIRI SCION</div>
        </div>
      )}
      {f >= T.film && (
        <div style={{position: 'absolute', left: 90, top: 1350}}>
          <Enter at={T.film + 4} kind="wipe" dur={12} style={{fontFamily: fonts.heading, fontWeight: 800, fontSize: 64, color: '#FFFFFF', letterSpacing: '-0.02em', lineHeight: 1, textShadow: '0 4px 30px rgba(0,0,0,0.7)'}}>
            TOKOH ASLI THE BIG SHORT
          </Enter>
          <Enter at={T.film + 12} kind="wipe" dur={12} style={{marginTop: 14, fontFamily: fonts.mono, fontWeight: 700, fontSize: 24, color: '#FFFFFF', letterSpacing: '0.05em', textShadow: '0 2px 12px rgba(0,0,0,0.95)'}}>
            <span style={{color: BLUE}}>■</span> FILM 2015 · DIPERANKAN CHRISTIAN BALE
          </Enter>
        </div>
      )}
      <div style={{position: 'absolute', right: 90, top: 1520, fontFamily: fonts.mono, fontWeight: 600, fontSize: 17, color: 'rgba(255,255,255,0.75)', letterSpacing: '0.04em', textShadow: '0 2px 8px rgba(0,0,0,0.9)'}}>FOTO: PREMIERE THE BIG SHORT, 2015</div>
    </div>
  );
};

// ---------------------------------------------------------------------------------------------------------------
// Archive chapter (off-white): the 2005 bet against the housing market, the 2008 crisis, the result.

const INK = '#101828';
const HOUSE = data.house;
const CX0 = 110;
const CX1 = 970;
const CY0 = 1190;
const CY1 = 1500;
const hv = HOUSE.map((p) => p.v);
const hLo = 90;
const hHi = 200;
const hx = (i: number) => CX0 + (i / (HOUSE.length - 1)) * (CX1 - CX0);
const hy = (v: number) => CY1 - ((v - hLo) / (hHi - hLo)) * (CY1 - CY0);
const idxOf = (m: string) => HOUSE.findIndex((p) => p.m === m);
const I2005 = idxOf('2005-01');
const IPEAK = hv.indexOf(Math.max(...hv));
const I2008 = idxOf('2008-01');
const I2009 = idxOf('2009-01');
const ITROUGH = hv.indexOf(Math.min(...hv.slice(IPEAK)));
export const BET_2005_SCREEN: [number, number] = [hx(I2005), (CY0 + CY1) / 2];
const dropPct = ((hv[IPEAK] - hv[ITROUGH]) / hv[IPEAK]) * 100;

export const Archive = () => {
  const f = useCurrentFrame();
  const pts: Array<[number, number]> = HOUSE.map((p, i) => [hx(i), hy(p.v)]);
  const u =
    ramp(f, T.tahun, T.bertaruh, ease.out) * I2005 +
    ramp(f, T.jebol - 4, T.krisis + 6, ease.inOut) * (I2009 - I2005) +
    ramp(f, T.krisis + 6, T.investornya, ease.inOut) * (HOUSE.length - 1 - I2009);
  const up = partial(pts.slice(0, IPEAK + 1), Math.min(u, IPEAK));
  const down = u > IPEAK ? partial(pts.slice(IPEAK), u - IPEAK) : [];
  const head = down.length ? down[down.length - 1] : up[up.length - 1];
  const push = 1 + 0.025 * Math.min(1, Math.max(0, (f - T.tahun) / (T.bet - T.tahun))) + 0.035 * ramp(f, T.bertaruh - 2, T.bertaruh + 8, ease.out) + 0.035 * ramp(f, T.krisis - 2, T.krisis + 8, ease.out) - 0.05 * ramp(f, T.investornya - 4, T.investornya + 8);
  const printOut = ramp(f, T.investornya - 4, T.investornya + 10, ease.in);
  const bandO = ramp(f, T.krisis - 1, T.krisis + 3);
  const yearX = ['2000-01', '2004-01', '2008-01', '2012-01'].map((m) => [m.slice(0, 4), hx(idxOf(m))] as const);
  return (
    <div style={{position: 'absolute', inset: 0, background: '#EDEDED'}}>
    <div style={{position: 'absolute', inset: 0, transformOrigin: '50% 70%', transform: `translateX(${40 - (f - T.tahun) * 0.3}px) scale(${push})`}}>
      {/* The desk print */}
      {printOut < 1 && (
        <div style={{position: 'absolute', left: 240, top: 505, width: 600, transform: `translateX(${-printOut * 900}px) rotate(${-2 - printOut * 6}deg)`, filter: printOut > 0 ? `blur(${printOut * 6}px)` : undefined}}>
          <div style={{padding: 14, background: '#FFFFFF', boxShadow: '0 30px 70px rgba(16,24,40,0.28)'}}>
            <Img src={photo('desk.jpg')} style={{display: 'block', width: 572, height: 429, objectFit: 'cover'}} />
          </div>
          <div style={{marginTop: 12, fontFamily: fonts.mono, fontWeight: 700, fontSize: 19, color: '#4A5568', letterSpacing: '0.05em'}}>MICHAEL BURRY · FOTO ARSIP</div>
        </div>
      )}
      {/* The result, replacing the print */}
      {f >= T.investornya - 2 && (
        <div style={{position: 'absolute', left: 0, right: 0, top: 560, textAlign: 'center'}}>
          <div style={{fontFamily: fonts.mono, fontWeight: 700, fontSize: 26, color: '#4A5568', letterSpacing: '0.06em', opacity: ramp(f, T.investornya, T.investornya + 8)}}>UNTUNG UNTUK INVESTOR SCION</div>
          <div style={{fontFamily: fonts.heading, fontWeight: 800, fontSize: 200, lineHeight: 1.05, color: INK, letterSpacing: '-0.04em'}}>
            $<RollNumber value={700} at={T.investornya} dur={Math.max(12, T.tujuh + 14 - T.investornya)} format={(n) => String(Math.round(n / 10) * 10)} /> JT<span style={{color: BLUE}}>+</span>
          </div>
          <div style={{fontFamily: fonts.mono, fontWeight: 600, fontSize: 24, color: '#4A5568', letterSpacing: '0.04em', opacity: ramp(f, T.tujuh + 10, T.tujuh + 20)}}>+ ±$100 JT UNTUK BURRY SENDIRI</div>
        </div>
      )}
      {/* The chart */}
      <div style={{position: 'absolute', left: CX0, top: CY0 - 74, fontFamily: fonts.mono, fontWeight: 700, fontSize: 21, color: '#4A5568', letterSpacing: '0.05em'}}>HARGA RUMAH AS · INDEKS S&P/CASE-SHILLER</div>
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
        {[100, 150, 200].map((v) => (
          <line key={v} x1={0} x2={1080} y1={hy(v)} y2={hy(v)} stroke={INK} strokeOpacity={0.1} strokeWidth={2} />
        ))}
        {bandO > 0 && <rect x={hx(I2008)} y={CY0 - 20} width={hx(I2009) - hx(I2008)} height={CY1 - CY0 + 20} fill={RED} opacity={0.14 * bandO} />}
        {f >= T.bertaruh - 2 && (
          <g opacity={ramp(f, T.bertaruh - 1, T.bertaruh + 3)}>
            <line x1={hx(I2005)} x2={hx(I2005)} y1={CY0 - 30} y2={CY1} stroke={BLUE} strokeWidth={4} strokeDasharray="10 9" />
            <circle cx={hx(I2005)} cy={hy(hv[I2005])} r={11} fill={BLUE} />
          </g>
        )}
        <path d={pathOf(up)} fill="none" stroke={INK} strokeWidth={7} strokeLinejoin="round" strokeLinecap="round" />
        {down.length > 1 && <path d={pathOf(down)} fill="none" stroke={RED} strokeWidth={7} strokeLinejoin="round" strokeLinecap="round" />}
        <circle cx={head[0]} cy={head[1]} r={9} fill={down.length > 1 ? RED : INK} />
      </svg>
      {f >= T.bertaruh - 2 && (
        <div style={{position: 'absolute', left: hx(I2005) + 16, top: CY1 - 66, width: 340, textAlign: 'left', fontFamily: fonts.mono, fontWeight: 800, fontSize: 22, color: BLUE, letterSpacing: '0.03em', opacity: ramp(f, T.bertaruh, T.bertaruh + 8)}}>2005 · BURRY<br />TARUHAN: JEBOL</div>
      )}
      {bandO > 0 && (
        <div style={{position: 'absolute', left: hx(I2008) - 30, top: CY1 + 40, fontFamily: fonts.mono, fontWeight: 800, fontSize: 22, color: RED, letterSpacing: '0.03em', opacity: bandO}}>KRISIS 2008</div>
      )}
      {u >= HOUSE.length - 2 && (
        <div style={{position: 'absolute', left: hx(ITROUGH) - 250, top: hy(hv[ITROUGH]) + 18, width: 330, textAlign: 'right', fontFamily: fonts.mono, fontWeight: 800, fontSize: 24, color: RED, opacity: ramp(f, T.investornya - 6, T.investornya + 4)}}>−{idn(dropPct, 0)}% · 2006 → 2012</div>
      )}
      {yearX.map(([y, x]) => (
        <div key={y} style={{position: 'absolute', left: x - 40, width: 80, top: CY1 + 40, textAlign: 'center', fontFamily: fonts.mono, fontWeight: 600, fontSize: 19, color: '#6B7A90', opacity: y === '2008' && bandO > 0 ? 0 : 1}}>{y}</div>
      ))}
      <div style={{position: 'absolute', right: 110, top: CY0 - 74, fontFamily: fonts.mono, fontWeight: 600, fontSize: 17, color: '#6B7A90', letterSpacing: '0.04em'}}>DATA: FRED</div>
    </div>
    </div>
  );
};
