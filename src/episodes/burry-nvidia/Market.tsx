/**
 * Cold open: the opening headline, then the two real charts of the nine days (Nvidia and Bitcoin daily closes,
 * 6–20 Nov 2026). The Nvidia chart is drawing under the headline from frame 0 and carries up into the board on "CEO".
 */
import {interpolate, useCurrentFrame} from 'remotion';
import {Enter, RollNumber} from '../../components/motion';
import {colors} from '../../theme/colors';
import {ease} from '../../theme/motion';
import {fonts} from '../../theme/typography';
import data from './data.json';
import {idn, partial, pathOf, ramp, RED} from './kit';
import {T} from './timing';

type Pt = {d: string; c: number};
const NV: Pt[] = data.nvda.filter((p) => p.d >= '2026-11-06' && p.d <= '2026-11-20');
const BT: Pt[] = data.btc;
const X0 = 90;
const X1 = 990;
const PLOT_TOP = 128; // inside a panel: header above the plot
const PANEL_H = 500;

const short = (d: string) => `${Number(d.slice(8))} NOV`;

const Panel = ({series, top, drawA, drawB, winA, winB, name, pct, pctAt, mark, eventIdx, eventLabel, eventAt, dollars}: {
  series: Pt[]; top: number; drawA: [number, number]; drawB: [number, number]; winA: string; winB: string; name: string; pct: number; pctAt: number; mark: number;
  eventIdx?: number; eventLabel?: string; eventAt?: number; dollars: (n: number) => string;
}) => {
  const f = useCurrentFrame();
  const vals = series.map((p) => p.c);
  const lo = Math.min(...vals);
  const hi = Math.max(...vals);
  const pad = (hi - lo) * 0.12;
  const h = PANEL_H - PLOT_TOP - 40;
  const px = (i: number) => X0 + 40 + (i / (series.length - 1)) * (X1 - X0 - 80);
  const py = (v: number) => PLOT_TOP + ((hi + pad - v) / (hi - lo + 2 * pad)) * h;
  const pts: Array<[number, number]> = series.map((p, i) => [px(i), py(p.c)]);
  const ia = series.findIndex((p) => p.d === winA);
  const ib = series.findIndex((p) => p.d === winB);
  // Draw: the run-up to the window first (white), then the window itself (red).
  const u = ramp(f, drawA[0], drawA[1], ease.out) * ia + ramp(f, drawB[0], drawB[1], ease.inOut) * (ib - ia);
  const pre = partial(pts.slice(0, ia + 1), Math.min(u, ia));
  const win = u > ia ? partial(pts.slice(ia, ib + 1), u - ia) : [];
  const end = win.length ? win[win.length - 1] : pre[pre.length - 1];
  const doneWin = u >= ib - 0.01;
  const flash = mark > 0 ? ramp(f, mark, mark + 16, ease.out) : 0;
  const wipeIn = top > 700 ? ramp(f, 8, 20, ease.out) : 1;
  return (
    <div style={{position: 'absolute', left: 0, top, width: 1080, height: PANEL_H, clipPath: wipeIn < 1 ? `inset(0 ${(1 - wipeIn) * 100}% 0 0)` : undefined}}>
      {/* header */}
      <div style={{position: 'absolute', left: X0, top: 8, fontFamily: fonts.heading, fontWeight: 700, fontSize: 50, color: '#FFFFFF', letterSpacing: '-0.01em'}}>{name}</div>
      <div style={{position: 'absolute', left: X0, top: 70, fontFamily: fonts.mono, fontWeight: 600, fontSize: 22, color: '#8FA3C0', letterSpacing: '0.05em'}}>HARGA PENUTUPAN HARIAN · 6–20 NOV 2026</div>
      {f >= pctAt && (
        <div style={{position: 'absolute', right: 1080 - X1, top: -6, fontFamily: fonts.mono, fontWeight: 800, fontSize: 100, color: RED, letterSpacing: '-0.03em'}}>
          −<RollNumber value={pct} at={pctAt} dur={20} format={(n) => idn(n)} />%
        </div>
      )}
      <svg width={1080} height={PANEL_H} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
        {[0, 0.5, 1].map((k) => (
          <line key={k} x1={0} x2={1080} y1={PLOT_TOP + k * h} y2={PLOT_TOP + k * h} stroke="#FFFFFF" strokeOpacity={0.08} strokeWidth={2} />
        ))}
        {eventIdx !== undefined && eventAt !== undefined && f >= eventAt && (
          <g opacity={ramp(f, eventAt, eventAt + 8)}>
            <line x1={px(eventIdx)} x2={px(eventIdx)} y1={PLOT_TOP - 6} y2={PLOT_TOP + h} stroke="#FFFFFF" strokeOpacity={0.55} strokeWidth={2} strokeDasharray="8 8" />
          </g>
        )}
        <path d={pathOf(pre)} fill="none" stroke="#DCE6F5" strokeWidth={8} strokeLinejoin="round" strokeLinecap="round" />
        {win.length > 1 && <path d={pathOf(win)} fill="none" stroke={RED} strokeWidth={9} strokeLinejoin="round" strokeLinecap="round" />}
        {u > ia - 0.01 && <circle cx={pts[ia][0]} cy={pts[ia][1]} r={10} fill="#FFFFFF" />}
        <circle cx={end[0]} cy={end[1]} r={doneWin ? 12 : 8} fill={doneWin ? RED : '#FFFFFF'} />
        {flash > 0 && flash < 1 && <circle cx={pts[ib][0]} cy={pts[ib][1]} r={12 + flash * 70} fill="none" stroke={RED} strokeWidth={5} opacity={1 - flash} />}
      </svg>
      {eventIdx !== undefined && eventAt !== undefined && f >= eventAt && (
        <div style={{position: 'absolute', left: px(eventIdx) + 14, top: PLOT_TOP - 4, opacity: ramp(f, eventAt, eventAt + 8), fontFamily: fonts.mono, fontWeight: 700, fontSize: 21, color: '#FFFFFF', letterSpacing: '0.04em'}}>{eventLabel}</div>
      )}
      {u > ia - 0.01 && (
        <div style={{position: 'absolute', left: pts[ia][0] - 150, top: pts[ia][1] - 56, width: 300, textAlign: 'center', fontFamily: fonts.mono, fontWeight: 700, fontSize: 21, color: '#DCE6F5', opacity: ramp(f, drawA[1] - 6, drawA[1] + 4)}}>
          {short(winA)} · {dollars(series[ia].c)}
        </div>
      )}
      {doneWin && (
        <div style={{position: 'absolute', left: pts[ib][0] - 300, top: pts[ib][1] + 22, width: 300, textAlign: 'right', fontFamily: fonts.mono, fontWeight: 800, fontSize: 24, color: RED, opacity: ramp(f, drawB[1] - 4, drawB[1] + 6)}}>
          {short(winB)} · {dollars(series[ib].c)}
        </div>
      )}
    </div>
  );
};

/** Screen position of the Nvidia low (20 Nov) once the board has settled: the iris to the photo opens from it. */
export const NV_LOW_SCREEN: [number, number] = [X0 + 40 + (X1 - X0 - 80), 500 + PLOT_TOP + (PANEL_H - PLOT_TOP - 40) * 0.94];

export const Market = () => {
  const f = useCurrentFrame();
  // The Nvidia panel starts under the headline and carries up into the board on "CEO".
  const carry = ramp(f, T.ceo - 4, T.ceo + 16, ease.inOut);
  const nvTop = interpolate(carry, [0, 1], [1000, 500]);
  // World: a slow push for the whole cold open, then a push toward the lows on "banyak yang rungkad".
  const push = 1 + 0.03 * ramp(f, 0, T.banyak, ease.inOut) + 0.07 * ramp(f, T.banyak - 4, T.trader + 4, ease.inOut);
  const nvIdx = NV.findIndex((p) => p.d === '2026-11-12');
  return (
    <div style={{position: 'absolute', inset: 0, transformOrigin: '80% 62%', transform: `scale(${push})`}}>
      <Panel
        series={NV}
        top={nvTop}
        drawA={[0, T.ceo]}
        drawB={[T.sahamnya - 6, T.delapan + 18]}
        winA="2026-11-11"
        winB="2026-11-20"
        name="NVIDIA (NVDA)"
        pct={27.7}
        pctAt={T.delapan}
        mark={T.rungkad}
        eventIdx={nvIdx}
        eventLabel="12 NOV · CEO MUNDUR"
        eventAt={T.mundur}
        dollars={(n) => `$${idn(n, 2)}`}
      />
      {f >= T.bitcoin - 8 && (
        <div style={{position: 'absolute', inset: 0, opacity: ramp(f, T.bitcoin - 8, T.bitcoin + 4), transform: `translateY(${(1 - ramp(f, T.bitcoin - 8, T.bitcoin + 6, ease.out)) * 60}px)`}}>
          <Panel
            series={BT}
            top={1050}
            drawA={[T.bitcoin - 8, T.bitcoin + 8]}
            drawB={[T.bitcoin + 8, T.bitcoin + 34]}
            winA="2026-11-11"
            winB="2026-11-20"
            name="BITCOIN (BTC)"
            pct={20.5}
            pctAt={T.bitcoin + 20}
            mark={T.rungkad}
            dollars={(n) => `$${Math.round(n).toLocaleString('id-ID')}`}
          />
        </div>
      )}
      {/* Opening headline: centred, rising in from below, clears upward as the board takes over. */}
      {f < T.ceo + 6 && (
        <div style={{position: 'absolute', left: 60, right: 60, top: 700, transform: `translateY(-50%) translateY(${-ramp(f, T.ceo - 8, T.ceo + 4, ease.in) * 80}px)`, opacity: 1 - ramp(f, T.ceo - 6, T.ceo + 4), filter: `blur(${ramp(f, T.ceo - 6, T.ceo + 4) * 8}px)`, textAlign: 'center'}}>
          <Enter at={-14} kind="rise" dur={12} style={{fontFamily: fonts.heading, fontWeight: 800, fontSize: 104, lineHeight: 1.0, letterSpacing: '-0.025em', color: '#FFFFFF'}}>
            MARKET KACAU.
          </Enter>
          <Enter at={-10} kind="rise" dur={12} style={{fontFamily: fonts.heading, fontWeight: 800, fontSize: 104, lineHeight: 1.0, letterSpacing: '-0.025em', color: colors.electric, marginTop: 10}}>
            SATU ORANG CUAN.
          </Enter>
        </div>
      )}
    </div>
  );
};
