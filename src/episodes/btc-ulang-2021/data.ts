import raw from '../../../public/episodes/btc-ulang-2021/btc-1d.json';

/** One daily candle: days from the cycle's final low, and high/low/close as a ratio to that low. */
export type Pt = {date: string; d: number; h: number; l: number; c: number};

const DAY = 86_400_000;
const toDays = (a: string, b: string) => Math.round((Date.parse(b) - Date.parse(a)) / DAY);

type Row = [string, number, number, number];
const build = (rows: Row[], lowDate: string, low: number): Pt[] =>
  rows.map(([date, h, l, c]) => ({date, d: toDays(lowDate, date), h: h / low, l: l / low, c: c / low}));

/** Binance BTC/USDT daily (S1). Final lows: 21 Nov 2022 $15.476 and 1 Jul 2026 $57.800. */
export const LOW_OLD = 15476;
export const LOW_NOW = 57800.19;
const series = raw as unknown as {old: Row[]; now: Row[]};
export const OLD = build(series.old, '2022-11-21', LOW_OLD);
export const NOW = build(series.now, '2026-07-01', LOW_NOW);

const at = (s: Pt[], date: string) => s.find((p) => p.date === date)!;

/** The six steps (wick highs for tops and bounces, wick lows for lows), both cycles. */
export type Step = {n: number; old: {date: string; price: number; top: boolean}; now: {date: string; price: number; top: boolean}};
export const STEPS: Step[] = [
  {n: 1, old: {date: '2021-11-10', price: 69000, top: true}, now: {date: '2025-10-06', price: 126199.63, top: true}},
  {n: 2, old: {date: '2022-01-24', price: 32917.17, top: false}, now: {date: '2025-11-21', price: 80600, top: false}},
  {n: 3, old: {date: '2022-03-28', price: 48189.84, top: true}, now: {date: '2026-01-14', price: 97924.49, top: true}},
  {n: 4, old: {date: '2022-06-18', price: 17622, top: false}, now: {date: '2026-02-06', price: 60000, top: false}},
  {n: 5, old: {date: '2022-08-15', price: 25211.32, top: true}, now: {date: '2026-05-06', price: 82850, top: true}},
  {n: 6, old: {date: '2022-11-21', price: 15476, top: false}, now: {date: '2026-07-01', price: 57800.19, top: false}},
];
/** The first top of each double top. */
export const TOP0 = {old: {date: '2021-04-14', price: 64854}, now: {date: '2025-08-14', price: 124474}};

export const dayOld = (date: string) => toDays('2022-11-21', date);
export const dayNow = (date: string) => toDays('2026-07-01', date);

/** Rally and pullback (S1). */
export const RALLY = {
  old: {hiDate: '2023-07-13', hi: 31804.2, pbDate: '2023-09-11', pb: 24901},
  now: {hiDate: '2026-09-21', hi: 87395.67},
};
export const RETRACE = (RALLY.old.hi - RALLY.old.pb) / (RALLY.old.hi - LOW_OLD); // 0.4228
export const LEVEL_NOW = RALLY.now.hi - RETRACE * (RALLY.now.hi - LOW_NOW); // ≈ 74.883
export const NOW_LOW = {date: '2026-11-08', price: 73510};
export const NOW_LAST = {date: '2026-11-09', price: 75368.41};
export const ATH = {date: '2024-03-08', price: 69990};

export const lastOld = OLD[OLD.length - 1];
export const lastNow = NOW[NOW.length - 1];
export {at};
