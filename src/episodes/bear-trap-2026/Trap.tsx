import type {ReactNode} from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import raw from '../../../public/episodes/bear-trap-2026/btc-1d.json';
import {colors} from '../../theme/colors';
import {ease} from '../../theme/motion';
import {fonts} from '../../theme/typography';

/**
 * Two real daily charts (Binance BTC/USDT): the 2023 bear trap and the 2026 setup, each with volume underneath and
 * the trap's anatomy drawn on it as the narration names each part. Frame-driven SVG keyed to cues (absolute frames).
 */
export type Beats = Record<'hook' | 'def' | 't23' | 'break23' | 'vol23' | 'fed' | 'rev23' | 'high23' | 't26' | 'break26' | 'press' | 'etf' | 'miss' | 'pay' | 'fail' | 'end', number>;

type Row = [string, number, number, number, number, number];
const data = raw as unknown as {y2023: Row[]; y2026: Row[]};
const DAY = 86_400_000;
const dayIdx = (rows: Row[], date: string) => Math.round((Date.parse(date) - Date.parse(rows[0][0])) / DAY);

type Frame = {rows: Row[]; slots: number; pMin: number; pMax: number; vMax: number};
const F23: Frame = {rows: data.y2023, slots: 122, pMin: 16000, pMax: 32500, vMax: 720000};
const F26: Frame = {rows: data.y2026, slots: 128, pMin: 58500, pMax: 100000, vMax: 36000};

// Stage geometry (screen px).
const X0 = 90;
const W = 900;
const C_TOP = 790;
const C_H = 470;
const V_BOT = 1420;
const V_H = 110;

const sx = (fr: Frame, i: number) => X0 + ((i + 0.5) / fr.slots) * W;
const sy = (fr: Frame, p: number) => C_TOP + C_H * (1 - (Math.log(p) - Math.log(fr.pMin)) / (Math.log(fr.pMax) - Math.log(fr.pMin)));

const clampOpts = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const ramp = (f: number, a: number, b: number, e = ease.inOut) => interpolate(f, [a, b], [0, 1], {...clampOpts, easing: e});
const appear = (f: number, at: number, len = 10) => ramp(f, at, at + len, ease.out);

const T = ({x, y, children, size = 20, color = colors.text, anchor = 'middle', weight = 700, font = fonts.mono, opacity = 1}: {x: number; y: number; children: ReactNode; size?: number; color?: string; anchor?: 'start' | 'middle' | 'end'; weight?: number; font?: string; opacity?: number}) => (
  <text x={x} y={y} fontFamily={font} fontWeight={weight} fontSize={size} fill={color} textAnchor={anchor} dominantBaseline="middle" opacity={opacity} letterSpacing="0.02em">
    {children}
  </text>
);
const Pill = ({x, y, text, color = '#FFFFFF', bg = colors.blue, size = 19, anchor = 'middle', opacity = 1}: {x: number; y: number; text: string; color?: string; bg?: string; size?: number; anchor?: 'start' | 'middle' | 'end'; opacity?: number}) => {
  if (opacity <= 0.01) return null;
  const w = text.length * size * 0.62 + 22;
  const h = size + 16;
  const left = anchor === 'middle' ? x - w / 2 : anchor === 'end' ? x - w : x;
  return (
    <g opacity={opacity}>
      <rect x={left} y={y - h / 2} width={w} height={h} rx={8} fill={bg} />
      <T x={left + w / 2} y={y + 1} size={size} color={color}>{text}</T>
    </g>
  );
};

/** Candles and volume up to `upTo` (day index, fractional = the growing candle). Down candles turn red inside `redFrom..redTo`, up candles green inside `greenFrom..greenTo`. */
const Candles = ({fr, upTo, red, green}: {fr: Frame; upTo: number; red?: [number, number]; green?: [number, number]}) => {
  const slot = W / fr.slots;
  const body = Math.max(3, slot * 0.62);
  return (
    <g>
      {fr.rows.map((r, i) => {
        const g = Math.max(0, Math.min(1, upTo - i));
        if (g <= 0) return null;
        const [, o, h, l, c, v] = r;
        const up = c >= o;
        const x = sx(fr, i);
        const yo = sy(fr, o);
        const lerp = (p: number) => yo + (sy(fr, p) - yo) * g;
        const isRed = !up && red && i >= red[0] && i <= red[1];
        const isGreen = up && green && i >= green[0] && i <= green[1];
        const col = isRed ? colors.negative : isGreen ? colors.positive : up ? colors.electric : '#7C8DA8';
        const top = lerp(Math.max(o, c));
        const bot = lerp(Math.min(o, c));
        const vh = (v / fr.vMax) * V_H * g;
        return (
          <g key={i}>
            <line x1={x} x2={x} y1={lerp(h)} y2={lerp(l)} stroke={col} strokeWidth={1.6} />
            <rect x={x - body / 2} y={top} width={body} height={Math.max(1.5, bot - top)} fill={up || isRed ? col : colors.bg} stroke={col} strokeWidth={1.4} />
            <rect x={x - body / 2} y={V_BOT - vh} width={body} height={vh} fill={isRed ? colors.negative : isGreen ? colors.positive : '#2A3A5A'} opacity={isRed || isGreen ? 0.9 : 0.8} />
          </g>
        );
      })}
    </g>
  );
};

/** A ring around a peak. */
const Ring = ({x, y, o, label}: {x: number; y: number; o: number; label?: string}) =>
  o <= 0.01 ? null : (
    <g opacity={o}>
      <circle cx={x} cy={y} r={20 * (0.7 + 0.3 * o)} fill="none" stroke="#FFD166" strokeWidth={3} />
      {label && <T x={x} y={y - 38} size={18} color="#FFD166">{label}</T>}
    </g>
  );

const HLine = ({fr, p, from, to, color, o, dash = '8 8', label, labelX, labelAbove = true}: {fr: Frame; p: number; from: number; to: number; color: string; o: number; dash?: string; label?: string; labelX?: number; labelAbove?: boolean}) => {
  if (o <= 0.01) return null;
  const y = sy(fr, p);
  const x1 = sx(fr, from);
  const x2 = x1 + (sx(fr, to) - x1) * Math.min(1, o * 1.4);
  return (
    <g opacity={Math.min(1, o * 1.5)}>
      <line x1={x1} x2={x2} y1={y} y2={y} stroke={color} strokeWidth={3} strokeDasharray={dash} />
      {label && <Pill x={labelX ?? x2} y={y + (labelAbove ? -26 : 26)} text={label} bg={color} anchor="end" size={18} color={color === '#FFFFFF' ? colors.bg : '#FFFFFF'} />}
    </g>
  );
};

export const Trap = ({b}: {b: Beats}) => {
  const f = useCurrentFrame();
  // Which year is on screen: 2026 for the hook, 2023 from the definition, 2026 again from "Sekarang mirip".
  const show23 = ramp(f, b.def - 6, b.def + 6) * (1 - ramp(f, b.t26 - 6, b.t26 + 6));
  const show26 = 1 - show23;

  // ---------- 2023
  const d23 = (s: string) => dayIdx(F23.rows, s);
  const up23 =
    f < b.t23 ? interpolate(f, [b.def, b.def + 40], [0, d23('2023-02-01')], {...clampOpts, easing: ease.inOut})
      : f < b.break23 ? interpolate(f, [b.t23, b.t23 + 40], [d23('2023-02-01'), d23('2023-03-02') + 1], {...clampOpts, easing: ease.inOut})
        : f < b.rev23 ? interpolate(f, [b.break23 + 6, b.break23 + 50], [d23('2023-03-02') + 1, d23('2023-03-12') + 1], {...clampOpts, easing: ease.inOut})
          : f < b.high23 ? interpolate(f, [b.rev23, b.rev23 + 24], [d23('2023-03-12') + 1, d23('2023-03-13') + 1], {...clampOpts, easing: ease.out})
            : interpolate(f, [b.high23, b.high23 + 50], [d23('2023-03-13') + 1, F23.rows.length], {...clampOpts, easing: ease.inOut});

  // ---------- 2026
  const d26 = (s: string) => dayIdx(F26.rows, s);
  const up26 =
    f < b.def ? interpolate(f, [b.hook, b.hook + 60], [0, F26.rows.length], {...clampOpts, easing: ease.inOut})
      : f < b.break26 ? interpolate(f, [b.t26, b.t26 + 40], [d26('2026-08-01'), d26('2026-10-14') + 1], {...clampOpts, easing: ease.inOut})
        : interpolate(f, [b.break26 + 4, b.break26 + 60], [d26('2026-10-14') + 1, F26.rows.length], {...clampOpts, easing: ease.inOut});
  const hookPhase = f < b.def;

  return (
    <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{position: 'absolute', inset: 0}}>
      {/* Year chip. */}
      <g opacity={1}>
        <rect x={X0} y={746} width={128} height={44} rx={10} fill={show23 > 0.5 ? '#2A3A5A' : colors.blue} />
        <T x={X0 + 64} y={769} size={26} weight={800} font={fonts.heading}>{show23 > 0.5 ? '2023' : '2026'}</T>
      </g>
      <line x1={X0} x2={X0 + W} y1={V_BOT} y2={V_BOT} stroke="#1E3256" strokeWidth={2} />
      <T x={X0 + W} y={V_BOT - V_H - 10} size={16} color="#6F84A8" anchor="end">VOLUME HARIAN</T>

      {/* ===== 2023 ===== */}
      {show23 > 0.01 && (
        <g opacity={show23}>
          <Candles fr={F23} upTo={up23} red={f >= b.vol23 ? [d23('2023-03-08'), d23('2023-03-10')] : undefined} green={f >= b.rev23 ? [d23('2023-03-12'), d23('2023-03-17')] : undefined} />
          <Ring x={sx(F23, d23('2023-02-02'))} y={sy(F23, 24255)} o={appear(f, b.t23 + 6)} />
          <Ring x={sx(F23, d23('2023-02-16'))} y={sy(F23, 25250)} o={appear(f, b.t23 + 22)} label="$25.250" />
          <HLine fr={F23} p={21351} from={d23('2023-02-13')} to={d23('2023-04-10')} color="#FFFFFF" o={appear(f, b.break23, 18)} label="SUPPORT $21.351" labelX={sx(F23, d23('2023-04-10'))} />
          <Pill x={sx(F23, d23('2023-03-10'))} y={sy(F23, 19549) + 34} text="$19.549 · −22,6%" bg={colors.negative} opacity={appear(f, b.break23 + 50)} />
          <Pill x={sx(F23, d23('2023-03-09')) - 10} y={V_BOT - V_H - 34} text="×1,8" bg={colors.negative} anchor="end" opacity={appear(f, b.vol23 + 4)} />
          {/* 12 Mar 2023: the backstop. */}
          <g opacity={appear(f, b.fed)}>
            <line x1={sx(F23, d23('2023-03-12'))} x2={sx(F23, d23('2023-03-12'))} y1={C_TOP + 10} y2={V_BOT} stroke={colors.light} strokeWidth={2} strokeDasharray="4 6" />
            <Pill x={sx(F23, d23('2023-03-12')) - 12} y={C_TOP + 30} text="12 MAR: AS JAMIN DEPOSAN" bg={colors.blue} anchor="end" size={17} />
          </g>
          <Pill x={sx(F23, d23('2023-03-13')) + 14} y={sy(F23, 24113) + 4} text="✓ 13 MAR" bg={colors.positive} anchor="start" opacity={appear(f, b.rev23 + 14)} color={colors.bg} />
          <HLine fr={F23} p={25250} from={d23('2023-02-16')} to={d23('2023-04-10')} color={colors.positive} o={appear(f, b.high23, 18)} dash="3 7" />
          <Pill x={sx(F23, d23('2023-03-17')) + 14} y={sy(F23, 27395) - 6} text="✓ 17 MAR · TEMBUS PUNCAK" bg={colors.positive} anchor="start" opacity={appear(f, b.high23 + 16)} color={colors.bg} size={17} />
        </g>
      )}

      {/* ===== 2026 ===== */}
      {show26 > 0.01 && (
        // In the hook, a slow push-in toward the drop keeps the opening line moving (restrained opening motion).
        <g opacity={show26} transform={hookPhase ? (() => {
          const k = 1 + 0.07 * ramp(f, b.hook + 56, b.def + 4, ease.inOut);
          const ox = sx(F26, d26('2026-11-15'));
          const oy = sy(F26, 70000);
          return `translate(${ox} ${oy}) scale(${k}) translate(${-ox} ${-oy})`;
        })() : undefined}>
          <Candles fr={F26} upTo={up26} red={f >= b.press || hookPhase ? [d26('2026-11-12'), d26('2026-11-15')] : undefined} />
          {/* Hook: the −29% from the high, at a glance. */}
          {hookPhase && (
            <g opacity={appear(f, b.hook + 50)}>
              <line x1={sx(F26, d26('2026-09-21'))} x2={sx(F26, d26('2026-11-15'))} y1={sy(F26, 87396)} y2={sy(F26, 87396)} stroke={colors.text} strokeWidth={1.5} strokeDasharray="4 6" opacity={0.6} />
              <line x1={sx(F26, d26('2026-11-15')) + 18} x2={sx(F26, d26('2026-11-15')) + 18} y1={sy(F26, 87396)} y2={sy(F26, 62006)} stroke={colors.negative} strokeWidth={4} />
              <Pill x={sx(F26, d26('2026-11-15')) + 28} y={(sy(F26, 87396) + sy(F26, 62006)) / 2} text="−29%" bg={colors.negative} anchor="start" size={26} />
            </g>
          )}
          {!hookPhase && (
            <g>
              <Ring x={sx(F26, d26('2026-09-21'))} y={sy(F26, 87396)} o={appear(f, b.t26 + 26)} />
              <Ring x={sx(F26, d26('2026-10-02'))} y={sy(F26, 87220)} o={appear(f, b.t26 + 36)} label="$87.396" />
              <HLine fr={F26} p={79800} from={d26('2026-10-15')} to={F26.slots - 1} color="#FFFFFF" o={appear(f, b.break26 + 2, 18)} label="SUPPORT $79.800" labelX={X0 + W} />
              <Pill x={sx(F26, d26('2026-10-29'))} y={sy(F26, 77992) + 30} text="JEBOL 29 OKT" bg="#2A3A5A" opacity={appear(f, b.break26 + 24)} size={16} />
              <Pill x={sx(F26, d26('2026-11-15')) - 12} y={sy(F26, 62006) + 30} text="$62.006 · −29%" bg={colors.negative} anchor="end" opacity={appear(f, b.break26 + 58)} />
              <Pill x={sx(F26, d26('2026-11-12')) - 10} y={V_BOT - V_H - 34} text="×2,1" bg={colors.negative} anchor="end" opacity={appear(f, b.press + 4)} />
              <Pill x={X0 + 6} y={C_TOP + 22} text="LIKUIDASI >$1,2 M / 24 JAM" bg={colors.negative} anchor="start" opacity={appear(f, b.press + 30)} size={17} />
              <Pill x={X0 + 6} y={C_TOP + 64} text="ETF BTC: −$1,91 M / 7 SESI" bg={colors.negative} anchor="start" opacity={appear(f, b.etf + 2)} size={17} />
              {/* The missing piece: the reversal. */}
              {f >= b.miss && (() => {
                const x1 = sx(F26, F26.rows.length - 0.5) + 6;
                const x2 = X0 + W;
                const y1 = sy(F26, 82500);
                const y2 = sy(F26, 61000);
                const o = appear(f, b.miss);
                const pulse = 0.75 + 0.25 * Math.sin((f - b.miss) / 6);
                return (
                  <g opacity={o}>
                    <rect x={x1} y={y1} width={x2 - x1} height={y2 - y1} rx={8} fill="none" stroke="#FFD166" strokeWidth={2.5} strokeDasharray="8 7" />
                    <T x={(x1 + x2) / 2} y={(y1 + y2) / 2} size={64} weight={800} font={fonts.heading} color="#FFD166" opacity={pulse}>?</T>
                  </g>
                );
              })()}
              {/* The condition: back above the broken support and holding (illustration). */}
              {f >= b.pay && (() => {
                const u = ramp(f, b.pay + 4, b.pay + 40);
                const x0 = sx(F26, F26.rows.length - 1);
                const y0 = sy(F26, 65351);
                const xe = X0 + W - 20;
                const ye = sy(F26, 81000);
                const xm = x0 + (xe - x0) * u;
                const ym = y0 + (ye - y0) * Math.min(1, u * 1.15);
                return (
                  <g opacity={appear(f, b.pay)}>
                    <path d={`M${x0},${y0} L${xm},${ym}`} stroke={colors.positive} strokeWidth={4} strokeDasharray="10 8" fill="none" />
                    <Pill x={X0 + W} y={sy(F26, 79800) - 62} text="SYARAT BEAR TRAP" bg={colors.positive} color={colors.bg} anchor="end" size={18} />
                    <T x={X0 + W - 4} y={sy(F26, 79800) + 26} size={15} color="#9FB3D6" anchor="end">ILUSTRASI</T>
                  </g>
                );
              })()}
              <HLine fr={F26} p={62006} from={d26('2026-11-15')} to={F26.slots - 1} color={colors.negative} o={appear(f, b.fail, 16)} label="LOW BARU = GAGAL" labelX={X0 + W} labelAbove />
            </g>
          )}
        </g>
      )}
    </svg>
  );
};

/** The four parts of a bear trap, ticked as each is shown; the fourth is a question for 2026. */
export const Anatomy = ({b}: {b: Beats}) => {
  const f = useCurrentFrame();
  const in23 = f >= b.def && f < b.t26;
  const steps = [
    {t: 'DUA PUNCAK', on: in23 ? b.t23 : b.t26},
    {t: 'SUPPORT JEBOL', on: in23 ? b.break23 + 30 : b.break26 + 30},
    {t: 'TEKANAN JUAL', on: in23 ? b.vol23 : b.press},
    {t: 'BERBALIK', on: in23 ? b.rev23 + 14 : b.miss},
  ];
  if (f < b.def || f >= b.end + 10) return null;
  const o = Math.min(ramp(f, b.def, b.def + 10), 1 - ramp(f, b.t26 - 8, b.t26) * 0.0);
  return (
    <div style={{position: 'absolute', top: 422, left: 60, right: 60, display: 'flex', justifyContent: 'center', gap: 10, opacity: o}}>
      {steps.map((s, i) => {
        const done = f >= s.on;
        const question = !in23 && i === 3 && done;
        const bg = question ? 'rgba(255,209,102,0.16)' : done ? colors.blue : 'rgba(11,23,48,0.9)';
        const fg = question ? '#FFD166' : done ? '#FFFFFF' : '#6F84A8';
        return (
          <div key={i} style={{display: 'flex', alignItems: 'center', gap: 6, padding: '6px 10px', borderRadius: 8, background: bg, boxShadow: question ? '0 0 0 1.5px #FFD166' : '0 0 0 1px #1E3256', fontFamily: fonts.mono, fontWeight: 700, fontSize: 17, letterSpacing: '0.04em', color: fg}}>
            <span>{question ? '?' : done ? '✓' : i + 1}</span>
            <span>{s.t}</span>
          </div>
        );
      })}
    </div>
  );
};
