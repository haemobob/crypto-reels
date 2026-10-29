import btc from '../../../public/episodes/kamus-smc/btc-1d-2026.json';
import type {CamKey, V3} from '../../three/camera';

/** Binance BTC/USDT daily candles, 20 May – 28 Oct 2026 (UTC), as [openTime, o, h, l, c]. */
type Raw = [number, number, number, number, number];
const day = (s: string) => Date.UTC(Number(s.slice(0, 4)), Number(s.slice(5, 7)) - 1, Number(s.slice(8, 10))) / 1000;
const FIRST = day('2026-05-20'), LAST = day('2026-10-28');
export const CANDLES = (btc.candles as Raw[])
  .filter((r) => r[0] >= FIRST && r[0] <= LAST)
  .map(([t, o, h, l, c]) => ({t, o, h, l, c}));
export const N = CANDLES.length;

/** Candle index of a date ("2026-07-01"). */
export const at = (date: string) => {
  const i = CANDLES.findIndex((k) => k.t === day(date));
  if (i < 0) throw new Error(`No candle for ${date}`);
  return i;
};

// World layout: time runs along +x (0.1 per day), price up +y (1 unit = $2,500), the chart stands in the z = 0 plane.
export const DX = 0.1;
export const BODY = 0.066;
export const P0 = 70000, PER = 2500;
export const X = (i: number) => (i - (N - 1) / 2) * DX;
export const Y = (p: number) => (p - P0) / PER;
export const FLOOR_Y = Y(54500);

/** The reading (research.md): every value is from the candles above. */
export const EV = {
  lh1: {i: at('2026-05-26'), p: 78080}, ll1: {i: at('2026-06-05'), p: 59131},
  lh2: {i: at('2026-06-15'), p: 67292}, ll2: {i: at('2026-06-25'), p: 58115},
  lowJun18: {i: at('2026-06-18'), p: 62272}, bosDn: {i: at('2026-06-24'), p: 61078},
  eqh1: {i: at('2026-06-22'), p: 65623}, eqh2: {i: at('2026-07-15'), p: 65600},
  sweep: {i: at('2026-07-01'), low: 57800, close: 60024, open: 58625, high: 61334},
  highJul6: {i: at('2026-07-06'), p: 64700}, choch: {i: at('2026-07-14'), p: 65044},
  eqhTaken: {i: at('2026-07-20'), p: 65799}, bosUp: {i: at('2026-07-21'), p: 66556},
  hh1: {i: at('2026-07-21'), p: 66956}, hl1: {i: at('2026-08-01'), p: 62275},
  idm: {i: at('2026-08-09'), p: 65474}, idmDip: {i: at('2026-08-14'), p: 62535},
  ob: {i: at('2026-08-16'), lo: 62716, hi: 63390},
  fvg: {i: at('2026-08-19'), lo: 65059, hi: 68902},
  hh2: {i: at('2026-08-28'), p: 81479},
  range: {lo: 57800, hi: 66956, mid: 62378},
} as const;

const VIEW_W = 1080, VIEW_H = 1920;
/** A camera key plus the price-axis scale for that shot (the chart autoscales its price axis like a chart app). */
export type Shot = CamKey & {sy: number};
/**
 * Frames candles [a, b] and prices [lo, hi] inside the stage (screen y 740–1430 by default), seen from yaw (degrees,
 * + = from the right) and pitch (degrees, + = from above). The camera distance is set by the time span; the price
 * axis is then scaled (sy) so the price span fills the stage height.
 */
export const shot = (
  f: number,
  {a, b, lo, hi, yaw = 0, pitch = 4, fov = 34, stage = [740, 1430], widthFrac = 0.8, fill = 0.9, ease}: {a: number; b: number; lo: number; hi: number; yaw?: number; pitch?: number; fov?: number; stage?: [number, number]; widthFrac?: number; fill?: number; ease?: CamKey['ease']},
): Shot => {
  const t = Math.tan(((fov / 2) * Math.PI) / 180);
  const w = (X(b) - X(a) + BODY) / widthFrac;
  const d = w / (2 * t * (VIEW_W / VIEW_H));
  const sy = (2 * d * t * ((stage[1] - stage[0]) / VIEW_H) * fill) / (Y(hi) - Y(lo));
  const cx = (X(a) + X(b)) / 2, cy = ((Y(lo) + Y(hi)) / 2) * sy;
  const ya = (yaw * Math.PI) / 180, pa = (pitch * Math.PI) / 180;
  const look: V3 = [cx, cy, 0];
  const pos: V3 = [cx + d * Math.sin(ya) * Math.cos(pa), cy + d * Math.sin(pa), d * Math.cos(ya) * Math.cos(pa)];
  // The look point lands at the stage's centre line.
  const shift = 960 - (stage[0] + stage[1]) / 2;
  return {f, pos, look, fov, shift, ease, sy};
};

/** "$57.800": Indonesian thousands separator. */
export const usd = (p: number) => `$${String(Math.round(p)).replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;
export const DATE = (i: number) => {
  const d = new Date(CANDLES[i].t * 1000);
  return `${d.getUTCDate()} ${['JAN', 'FEB', 'MAR', 'APR', 'MEI', 'JUN', 'JUL', 'AGU', 'SEP', 'OKT', 'NOV', 'DES'][d.getUTCMonth()]}`;
};
