import type {ReactNode} from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import captions from '../../../episodes/tiga-hammer/captions.json';
import config from '../../../episodes/tiga-hammer/episode.json';
import {ACTOR, Actor, IconGrid, Pill, SentenceTrack, type Pose} from '../../components/actors';
import {Shot, seam} from '../../components/motion';
import {useCues} from '../../lib/cues';
import type {EpisodeModule} from '../../lib/episode-module';
import type {Captions, EpisodeConfig} from '../../lib/types';
import {ease} from '../../theme/motion';
import {fonts} from '../../theme/typography';
import data from './candles.json';

/**
 * tiga-hammer: three real BTC H1 hammers of near-identical shape (Binance), opened on 5 m. Pictogram-actor style
 * (reference/pictogram-storytelling-study.md): three traders, each candle's inside acted out by who won each
 * 5 minutes, the swept level as a line of stop orders, the last lower high as a gate. Black ground, white actors,
 * brand blue as the only accent; red only for a loss.
 */
type K = [number, number, number, number, number, number];
type Pick = {utc: string; h1: K; m5: K[]; after6h: K[]; levels: {low12: number; equalLow: number | null; lowerHigh: number | null; lowerHighAt: number | null; lowAt: number; closeAboveLH: boolean}};
const D = data as unknown as Record<'A' | 'B' | 'C', Pick>;
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const ramp = (f: number, a: number, b: number, e = ease.out) => (b <= a ? (f >= a ? 1 : 0) : interpolate(f, [a, b], [0, 1], {...clamp, easing: e}));
const life = (f: number, a: number, b: number) => ramp(f, a, a + 8) * (1 - ramp(f, b - 6, b, ease.in));
const BLUE = ACTOR.blue;
const RED = ACTOR.red;
const GROUND = 1330;
const STATIONS: Array<{k: 'A' | 'B' | 'C'; x: number; date: string}> = [
  {k: 'A', x: 220, date: '2 SEP 2026 · 01:00 WIB'},
  {k: 'B', x: 540, date: '17 JUL 2026 · 20:00 WIB'},
  {k: 'C', x: 860, date: '15 OKT 2026 · 09:00 WIB'},
];
const fmt = (n: number) => n.toLocaleString('id-ID', {maximumFractionDigits: 0});

/** A candle drawn from real OHLC, normalised to `h` px tall around (cx, top). `draw` 0..1 grows wick then body. */
const HammerIcon = ({k, cx, top, h, draw = 1, color = '#F4F6FA'}: {k: K; cx: number; top: number; h: number; draw?: number; color?: string}) => {
  const [, o, hi, lo, c] = k;
  const Y = (p: number) => top + ((hi - p) / (hi - lo)) * h;
  const wick = ramp(draw, 0, 0.6, ease.inOut);
  const body = ramp(draw, 0.4, 1);
  const bodyTop = Y(Math.max(o, c));
  const bodyBot = Math.max(Y(Math.min(o, c)), bodyTop + 6);
  return (
    <g>
      <line x1={cx} x2={cx} y1={top} y2={top + h * wick} stroke={color} strokeWidth={7} strokeLinecap="round" />
      {body > 0 && <rect x={cx - 34 * body} y={bodyTop} width={68 * body} height={bodyBot - bodyTop} rx={4} fill={color} />}
    </g>
  );
};

/** The opening/result stage: three traders under three real hammers. */
const Stations = ({f, from, merge, buy, results}: {f: number; from: number; merge: number; buy: number; results?: {at: number}}) => {
  const res = results ? ramp(f, results.at, results.at + 14) : 0;
  const after = (k: 'A' | 'B' | 'C') => (D[k].after6h[5][4] - D[k].h1[4]) / D[k].h1[4] * 100;
  const minAfter = (k: 'A' | 'B' | 'C') => (Math.min(...D[k].after6h.map((c) => c[3])) - D[k].h1[4]) / D[k].h1[4] * 100;
  const pose = (k: 'A' | 'B' | 'C'): Pose => (res < 0.5 ? (buy > 0.5 ? 'hold' : 'stand') : k === 'B' ? 'cheer' : k === 'A' ? 'shrug' : 'slump');
  const tone = (k: 'A' | 'B' | 'C') => (res < 0.5 ? '#F4F6FA' : k === 'B' ? BLUE : k === 'C' ? '#9AA6B6' : '#C9D1DB');
  return (
    <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
      <line x1={70} x2={1010} y1={GROUND + 1} y2={GROUND + 1} stroke="#2A3240" strokeWidth={3} />
      {STATIONS.map((s, i) => {
        const cx = s.x + (540 - s.x) * merge;
        const draw = ramp(f, from - 10 + i * 3, from + 8 + i * 3, ease.inOut);
        return (
          <g key={s.k}>
            <HammerIcon k={D[s.k].h1} cx={cx} top={640} h={360} draw={draw} color={merge > 0.05 ? `rgba(244,246,250,${1 - 0.45 * merge})` : '#F4F6FA'} />
            {merge < 0.5 && res < 0.05 && <Pill x={s.x} y={600} text={`HAMMER ${s.k}`} size={22} />}
            {merge < 0.5 && (
              <text x={s.x} y={1040} textAnchor="middle" fontFamily={fonts.mono} fontWeight={600} fontSize={18} fill="#7F8EA3" letterSpacing="0.02em">{s.date}</text>
            )}
            <Actor x={s.x} y={GROUND} h={190} pose={pose(s.k)} color={tone(s.k)} glow={buy > 0 && buy < 1 && Math.abs(buy - (i + 1) / 3) < 0.25 ? 1 : 0} />
            <Pill x={s.x} y={GROUND + 44} text={`TRADER ${s.k}`} size={20} border={res > 0.5 && s.k === 'B' ? BLUE : '#3A4556'} />
            {buy > 0.15 + i * 0.25 && res < 0.5 && <Pill x={s.x + 70} y={GROUND - 232} text="BELI" size={22} color="#FFFFFF" border={BLUE} bg="#0B1730" />}
            {res > 0.01 && (
              <g opacity={res}>
                <text x={s.x} y={1100} textAnchor="middle" fontFamily={fonts.mono} fontWeight={800} fontSize={48} fill={s.k === 'B' ? BLUE : s.k === 'C' ? RED : '#C9D1DB'}>
                  {s.k === 'C' ? `${minAfter('C').toFixed(1).replace('.', ',')}%` : `${after(s.k) >= 0 ? '+' : ''}${after(s.k).toFixed(1).replace('.', ',')}%`}
                </text>
                <text x={s.x} y={1134} textAnchor="middle" fontFamily={fonts.mono} fontWeight={600} fontSize={18} fill="#7F8EA3">{s.k === 'C' ? 'TERENDAH 6 JAM' : 'SETELAH 6 JAM'}</text>
              </g>
            )}
          </g>
        );
      })}
      {merge > 0.3 && <Pill x={540} y={1100} text="DITUMPUK: NYARIS SAMA" size={26} border={BLUE} at={from} />}
    </svg>
  );
};

/** One hammer opened on 5 m: real candles, the swept level as a row of stop orders, the last lower high as a gate. */
const Inside = ({k, f, from, to, label, notes}: {k: 'A' | 'B' | 'C'; f: number; from: number; to: number; label: string; notes: ReactNode}) => {
  const p = D[k];
  const bars = p.m5.slice(24, 48); // the hour before (context, dimmed) + the hour itself
  const lv = p.levels;
  const level = lv.equalLow ?? lv.low12;
  const lo = Math.min(...bars.map((b) => b[3]), level) * 0.9996;
  const hi = Math.max(...bars.map((b) => b[2]), lv.lowerHigh ?? 0) * 1.0004;
  const X0 = 110;
  const W = 740; // labels for the lines sit in the clear margin on the right (x ≥ 870)
  const T = 650;
  const Hh = 520;
  const Y = (v: number) => T + ((hi - v) / (hi - lo)) * Hh;
  const bw = W / bars.length;
  const span = to - from;
  const shownAt = (i: number) => (i < 12 ? from + 4 + i * 0.6 : from + 14 + ((i - 12) / 12) * span * 0.62);
  const lhX = lv.lowerHighAt !== null ? X0 + (lv.lowerHighAt - 24) * bw + bw / 2 : X0;
  const flushI = bars.findIndex((b, i) => i >= 12 && b[3] < level);
  const swept = flushI >= 0 && f >= shownAt(flushI);
  const sweptReclaimed = p.h1[4] > level;
  const lastShown = bars.reduce((m, _, i) => (f >= shownAt(i) ? i : m), -1);
  const broke = lv.closeAboveLH && lastShown >= 0 && bars.slice(12, lastShown + 1).some((b) => lv.lowerHigh !== null && b[4] > lv.lowerHigh);
  return (
    <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
      <Pill x={540} y={600} text={label} size={21} border={BLUE} />
      <rect x={X0 + 12 * bw - 4} y={T - 18} width={12 * bw + 8} height={Hh + 36} rx={18} fill="none" stroke="#3A4556" strokeWidth={2} strokeDasharray="10 8" />
      {/* The swept level: a line with stop orders resting just under it. */}
      {f >= from + 10 && (
        <g opacity={ramp(f, from + 10, from + 20)}>
          <line x1={X0} x2={X0 + W} y1={Y(level)} y2={Y(level)} stroke={k === 'A' ? '#5A6577' : '#9AA6B6'} strokeWidth={2.5} strokeDasharray="12 9" />
          <text x={X0 + W + 16} y={Y(level) + 7} fontFamily={fonts.mono} fontWeight={700} fontSize={19} fill="#9AA6B6">{lv.equalLow ? 'EQUAL LOW' : 'LOW 12 JAM'}</text>
          <text x={X0 + W + 16} y={Y(level) + 30} fontFamily={fonts.mono} fontWeight={500} fontSize={15} fill="#7F8EA3">{fmt(level)}</text>
          {Array.from({length: 14}, (_, i) => {
            const gone = swept ? ramp(f, shownAt(flushI) + i * 0.8, shownAt(flushI) + i * 0.8 + 10, ease.in) : 0;
            const sx = X0 + 24 + i * 52;
            const sy = Y(level) + 18 + gone * 120;
            return gone >= 1 ? null : <circle key={i} cx={sx} cy={sy} r={6} fill={gone > 0 ? (sweptReclaimed ? BLUE : '#9AA6B6') : '#7F8EA3'} opacity={1 - gone} />;
          })}
          
        </g>
      )}
      {/* The last lower high: the gate. */}
      {lv.lowerHigh !== null && f >= from + 12 && (
        <g opacity={ramp(f, from + 12, from + 22)}>
          <line x1={lhX} x2={X0 + W} y1={Y(lv.lowerHigh)} y2={Y(lv.lowerHigh)} stroke={broke ? BLUE : '#C9D1DB'} strokeWidth={broke ? 4 : 2.5} strokeDasharray={broke ? undefined : '6 8'} />
          <text x={X0 + W + 16} y={Y(lv.lowerHigh) + 7 - (Math.abs(Y(lv.lowerHigh) - Y(level)) < 44 ? 40 : 0)} fontFamily={fonts.mono} fontWeight={700} fontSize={19} fill={broke ? BLUE : '#C9D1DB'}>LOWER HIGH</text>
        </g>
      )}
      {bars.map((b, i) => {
        const a = ramp(f, shownAt(i), shownAt(i) + 4);
        if (a <= 0.01) return null;
        const up = b[4] >= b[1];
        const inside = i >= 12;
        const col = !inside ? '#2F3846' : up ? '#F4F6FA' : '#6B778A';
        const x = X0 + i * bw + bw / 2;
        return (
          <g key={i} opacity={a}>
            <line x1={x} x2={x} y1={Y(b[2])} y2={Y(b[3])} stroke={col} strokeWidth={3} />
            <rect x={x - bw * 0.3} y={Y(Math.max(b[1], b[4]))} width={bw * 0.6} height={Math.max(3, Y(Math.min(b[1], b[4])) - Y(Math.max(b[1], b[4])))} fill={col} rx={2} />
          </g>
        );
      })}
      {/* Who won each 5 minutes: one actor per candle of the hour (blue = buyers, grey = sellers). */}
      {bars.slice(12).map((b, i) => {
        const at = shownAt(12 + i);
        if (f < at) return null;
        const up = b[4] >= b[1];
        return <Actor key={i} x={X0 + (12 + i) * bw + bw / 2} y={GROUND + 40} h={58} color={up ? BLUE : ACTOR.grey} pop={at} />;
      })}
      <text x={540} y={GROUND + 84} textAnchor="middle" fontFamily={fonts.mono} fontWeight={700} fontSize={20} fill="#7F8EA3">PEMENANG TIAP 5 MENIT: <tspan fill={BLUE}>BUYER</tspan> · <tspan fill="#C9D1DB">SELLER</tspan></text>
      {notes}
    </svg>
  );
};

const Scene = () => {
  const f = useCurrentFrame();
  const {cue, word, narrationEnd} = useCues();
  const b = {hook: cue('hook'), pick: cue('pick'), a: cue('a'), c: cue('c'), bb: cue('b'), result: cue('result'), twist: cue('twist'), payoff: cue('payoff'), end: narrationEnd};
  const w = {
    sama: word('sama'), beli: word('beli'), lima: word('lima', 0), disapu: word('disapu', 0), patah: word('patah'), kosong: word('kosong'),
    gagal: word('gagal'), change: word('change'), enam2: word('enam', 1), rumus: word('rumus'), lima2: word('lima', 1), tiga2: word('tiga', 2), kendali: word('kendali'), batal: word('batal'),
  };
  const loopAt = b.end - 36;
  const merge = ramp(f, w.sama, w.sama + 12, ease.inOut) * (1 - ramp(f, w.sama + 40, w.sama + 54, ease.inOut));
  const buy = interpolate(f, [w.beli - 10, w.beli + 30], [0, 1], clamp);
  // Which world is on screen.
  const stage = f < w.lima ? 'open' : f < b.c ? 'A' : f < b.bb ? 'C' : f < b.result ? 'B' : f < b.twist ? 'result' : f < b.payoff ? 'twist' : f < loopAt ? 'payoff' : 'loop';
  const zoomOrigin: [number, number] = [220, 820];
  const source =
    stage === 'twist' ? '28 HAMMER BTC H1 · 25 MEI–21 NOV 2026 · DEFINISI & HITUNGAN CRYPTONITE · SAMPEL KECIL'
      : 'DATA: BINANCE BTCUSDT · H1 & 5 MENIT · BUKAN SARAN INVESTASI';
  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      {(stage === 'open' || stage === 'loop') && (
        <div style={{position: 'absolute', inset: 0, ...(stage === 'open' ? seam('zoom', f, w.lima, 'out', {dur: 12, origin: zoomOrigin}) : seam('blurSwap', f, loopAt, 'in'))}}>
          <Shot from={stage === 'open' ? 0 : loopAt} to={stage === 'open' ? w.lima : b.end + 20} push={0.035}>
            <Stations f={f} from={stage === 'open' ? -30 : loopAt} merge={stage === 'open' ? merge : 0} buy={stage === 'open' ? buy : 0} />
          </Shot>
        </div>
      )}
      {stage === 'A' && (
        <div style={{position: 'absolute', inset: 0, ...seam('zoom', f, w.lima, 'in', {dur: 12}), ...seam('whip', f, b.c, 'out')}}>
          <Shot from={w.lima} to={b.c} push={0.03} pan={[0, -12]}>
            <Inside k="A" f={f} from={w.lima} to={b.c} label="HAMMER A · ISINYA: 12 CANDLE 5 MENIT" notes={
              <>
                <Pill x={540} y={1215} text="LOW LAMA TEMBUS, NGGAK DIREBUT LAGI" size={22} at={w.disapu} border="#5A6577" />
                <Pill x={300} y={1264} text="STRUKTUR NGGAK PATAH ✕" size={22} at={w.patah} border="#5A6577" />
                <Pill x={800} y={1264} text="KOSONG DI DALAM" size={24} at={w.kosong} border={BLUE} />
              </>
            } />
          </Shot>
        </div>
      )}
      {stage === 'C' && (
        <div style={{position: 'absolute', inset: 0, ...seam('whip', f, b.c, 'in'), ...seam('whip', f, b.bb, 'out')}}>
          <Shot from={b.c} to={b.bb} push={0.03} pan={[0, -12]}>
            <Inside k="C" f={f} from={b.c} to={b.bb} label="HAMMER C · ISINYA: 12 CANDLE 5 MENIT" notes={<Pill x={540} y={1236} text="GAGAL TEMBUS LOWER HIGH ✕" size={26} at={w.gagal} border={RED} />} />
          </Shot>
        </div>
      )}
      {stage === 'B' && (
        <div style={{position: 'absolute', inset: 0, ...seam('whip', f, b.bb, 'in'), ...seam('blurSwap', f, b.result, 'out')}}>
          <Shot from={b.bb} to={b.result} push={0.03} pan={[0, -12]}>
            <Inside k="B" f={f} from={b.bb} to={b.result} label="HAMMER B · ISINYA: 12 CANDLE 5 MENIT" notes={<Pill x={540} y={1236} text="CHoCH DI DALAM 1 CANDLE" size={26} at={w.change} border={BLUE} color={BLUE} />} />
          </Shot>
        </div>
      )}
      {stage === 'result' && (
        <div style={{position: 'absolute', inset: 0, ...seam('blurSwap', f, b.result, 'in'), ...seam('dip', f, b.twist, 'out')}}>
          <Shot from={b.result} to={b.twist} push={0.03}>
            <Stations f={f} from={b.result - 20} merge={0} buy={0} results={{at: b.result + 6}} />
            <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
              <Pill x={540} y={600} text="6 JAM KEMUDIAN" size={24} border={BLUE} at={b.result} />
            </svg>
          </Shot>
        </div>
      )}
      {stage === 'twist' && (
        <div style={{position: 'absolute', inset: 0, ...seam('flood', f, b.twist, 'in', {origin: [540, 900]}), ...seam('push', f, b.payoff, 'out')}}>
          <Shot from={b.twist} to={b.payoff} push={0.025}>
            <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
              <Pill x={540} y={600} text="BUKAN RUMUS" size={28} border={RED} at={w.rumus} />
              <text x={290} y={700} textAnchor="middle" fontFamily={fonts.mono} fontWeight={700} fontSize={24} fill={BLUE} letterSpacing="0.05em">POLA B</text>
              <IconGrid x={130} y={720} n={8} lit={5} cols={4} size={78} at={w.lima2 - 20} />
              <text x={790} y={700} textAnchor="middle" fontFamily={fonts.mono} fontWeight={700} fontSize={24} fill="#C9D1DB" letterSpacing="0.05em">HAMMER LAIN</text>
              <IconGrid x={580} y={720} n={20} lit={13} cols={5} size={78} at={w.tiga2 - 34} litColor="#F4F6FA" />
              <g opacity={ramp(f, w.lima2, w.lima2 + 10)}>
                <text x={290} y={1150} textAnchor="middle" fontFamily={fonts.mono} fontWeight={800} fontSize={64} fill={BLUE}>5/8</text>
                <text x={290} y={1188} textAnchor="middle" fontFamily={fonts.mono} fontWeight={600} fontSize={19} fill="#7F8EA3">NAIK 6 JAM KEMUDIAN</text>
              </g>
              <g opacity={ramp(f, w.tiga2, w.tiga2 + 10)}>
                <text x={790} y={1150} textAnchor="middle" fontFamily={fonts.mono} fontWeight={800} fontSize={64} fill="#F4F6FA">13/20</text>
                <text x={790} y={1188} textAnchor="middle" fontFamily={fonts.mono} fontWeight={600} fontSize={19} fill="#7F8EA3">NAIK 6 JAM KEMUDIAN</text>
              </g>
              <Pill x={540} y={1290} text="BEDANYA TIPIS" size={28} border={BLUE} at={w.tiga2 + 14} />
            </svg>
          </Shot>
        </div>
      )}
      {stage === 'payoff' && (
        <div style={{position: 'absolute', inset: 0, ...seam('push', f, b.payoff, 'in'), ...seam('blurSwap', f, loopAt, 'out')}}>
          <Shot from={b.payoff} to={loopAt} push={0.03}>
            <Inside k="B" f={f} from={b.payoff - 400} to={b.payoff - 200} label="HAMMER B · YANG DISAPU JADI LANTAI" notes={null} />
            <PayoffMarks f={f} from={b.payoff} kendali={w.kendali} batal={w.batal} />
          </Shot>
        </div>
      )}
      <SentenceTrack y={440} size={50} />
      <div style={{position: 'absolute', left: 60, right: 60, top: 1530, textAlign: 'center', fontFamily: fonts.mono, fontWeight: 500, fontSize: 17, letterSpacing: '0.04em', color: '#7F8EA3'}}>{source}</div>
    </AbsoluteFill>
  );
};

/** Payoff: the swept low becomes the floor B stands on; if it breaks, the idea is void. */
const PayoffMarks = ({f, from, kendali, batal}: {f: number; from: number; kendali: number; batal: number}) => {
  const p = D.B;
  const bars = p.m5.slice(24, 48);
  const level = p.levels.equalLow ?? p.levels.low12;
  const lo = Math.min(...bars.map((x) => x[3]), level) * 0.9996;
  const hi = Math.max(...bars.map((x) => x[2]), p.levels.lowerHigh ?? 0) * 1.0004;
  const Y = (v: number) => 650 + ((hi - v) / (hi - lo)) * 520;
  const sweptLow = p.h1[3];
  const a = ramp(f, batal - 14, batal);
  return (
    <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
      <g opacity={ramp(f, kendali - 6, kendali + 6)}>
        <Actor x={150} y={Y(sweptLow) - 4} h={96} color={BLUE} pose="stand" pop={kendali - 6} />
      </g>
      <g opacity={a}>
        <line x1={110} x2={850} y1={Y(sweptLow)} y2={Y(sweptLow)} stroke={RED} strokeWidth={3} strokeDasharray="12 9" />
        <Pill x={540} y={Y(sweptLow) + 40} text={`BATAL KALAU ${fmt(sweptLow)} TEMBUS`} size={24} border={RED} />
      </g>
    </svg>
  );
};

const episode: EpisodeModule = {config: config as EpisodeConfig, captions: captions as Captions, Scene};
export default episode;
