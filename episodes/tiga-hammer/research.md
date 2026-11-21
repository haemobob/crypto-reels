# Research — tiga-hammer (21 Nov 2026)

**Brief (user):** recreate @tradersarena_id's Reel (https://www.instagram.com/reels/De4kXljzc6R/) in the pictogram-actor style from `reference/pictogram-storytelling-study.md`.
- Instagram blocked the video download.
- The idea comes from the post's public embed caption (`evidence/reference-embed.html`): three H1 hammers with identical OHLC; on 15 m, A is "cakep dari luar tapi kosong di dalam", C "sempat mantul, tapi buyer-nya cepat ngilang", B "sapu equal low dulu, terus tembus lower high terakhir. Itu CHOCH di dalam satu candle"; next time check a liquidity sweep and a structure break.
- Their market is XAUUSD/forex. Ours is BTCUSDT.
- Their CTA ("Komen 'CHART'") is not reproduced.

## Data
- **Binance spot BTCUSDT** (data-api.binance.vision), downloaded 21 Nov 2026:
  - 1h: 25 May → 21 Nov 2026, 4,320 candles;
  - 5m: same period, 51,840 candles;
  - 4h: 21 Nov 2025 → 21 Nov 2026, 2,190 candles;
  - 15m: same year, 35,041 candles.
- **Our hammer definition** (stated on screen as Cryptonite's):
  - lower wick ≥ 2× body and ≥ 55% of the range;
  - upper wick ≤ 15% of the range;
  - body ≥ 4%;
  - range ≥ 1.3× the median of the previous 20 candles;
  - the candle's low is the lowest of the last 12 candles.
- **Sweep:** the hammer's low breaks the lowest low of the previous 12 candles and closes back above it ("equal low" when two of those lows are within 0.15%).
- **CHoCH inside the candle:** a 5m close after the low, inside the hour, above the last 5m swing high before the low (the last lower high).
- **Outcome:** close 6 candles later vs the hammer's close, plus the maximum and minimum in those 6 candles.
- All 39 hammers found (28 H1, 11 H4) are in `evidence/hammers-btc.json`.

## The three examples (real, similar shape; UTC, with WIB in brackets)
Shape is given as body / lower wick / upper wick, each as a share of the range.

**A — 1 Sep 2026 18:00 UTC (2 Sep 01:00 WIB)**
- H1 OHLC: 77,265.79 / 77,319.64 / 76,420.00 / 77,153.90.
- Shape: 0.12 / 0.82 / 0.06.
- Inside (5m): a steady slide all hour, then a snap back in the last 15 minutes. No sweep, no CHoCH.
- 6h later: **+0.08%** (max +0.63%, min −0.30%).

**C — 15 Oct 2026 02:00 UTC (09:00 WIB)**
- H1 OHLC: 81,640.00 / 81,814.01 / 80,226.35 / 81,538.01.
- Shape: 0.06 / 0.83 / 0.11.
- Inside (5m): one large flush through the previous lows (equal-low sweep), then a bounce that does not close above the last lower high (no CHoCH).
- 6h later: **−0.19%** (min **−1.27%**).

**B — 17 Jul 2026 13:00 UTC (20:00 WIB)**
- H1 OHLC: 63,099.75 / 63,180.00 / 62,537.56 / 63,153.99.
- Shape: 0.08 / 0.88 / 0.04.
- Inside (5m): a drift down that sweeps equal lows, then a close above the last lower high (CHoCH inside the hour).
- 6h later: **+1.59%** (max +1.95%).

## The check the original doesn't do (our twist)
| Group | Higher 6 candles later | Median 6-candle return |
|---|---|---|
| H1 hammers with sweep + CHoCH (B-type) | **5 of 8** (62%) | +0.45% |
| All other H1 hammers | **13 of 20** (65%) | +0.16% |
| Any H1 candle (baseline) | 51% | — |
| H4 hammers with sweep + CHoCH | 3 of 6 | — |
| Other H4 hammers | 0 of 5 | — |

**Reading:**
- The samples are small. B-type hammers don't go up more often than other hammers. They show slightly bigger moves up and smaller drawdowns on average.
- So the inside of a candle tells you how it was built (who took control), not where price goes next.
- The practical use: it shows where the idea is wrong. If price breaks the swept low again, the bullish read is void.
- **This is not investment advice and not a backtested strategy.**

## Claim types
| Claim | Type |
|---|---|
| OHLC, dates, outcomes | Data (Binance) |
| A / B / C readings | Our reading of the real 5m data, by the stated rules |
| 5/8 vs 13/20 | Our count, by the stated definitions, over 6 months; small sample |
| "ide bullish-nya batal" | A standard invalidation rule, framed as a risk tool, not a signal |
