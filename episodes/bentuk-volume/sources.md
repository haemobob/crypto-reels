# Sources — bentuk-volume

| # | Claim or asset | Source | Published | Checked | Licence or basis |
|---|---|---|---|---|---|
| S1 | All prices and the daily volume profiles (12–17 Nov 2026) | Binance BTC/USDT 5-minute klines, data-api.binance.vision. Raw files: `evidence/binance-btcusdt-5m-2026-08-01_2026-11-16.json` and `evidence/binance-btcusdt-5m-2026-11-17.json` (fetched 18 Nov). Classifier: `evidence/day-shapes.py` | live | 2026-11-17 | Public market data, credited on screen |
| S2 | Open interest, 15 Nov 2026 | OKX Rubik API, BTC-USDT-SWAP, hourly open interest. Raw file: `evidence/okx-btc-usdt-swap-oi-1h-2026-10-31_2026-11-17.json` | live | 2026-11-17 | Public market data, credited on screen |
| S3 | P = possible short covering, b = possible long liquidation, D = balance | NinjaTrader, "Volume Profile Shapes: The 4 Patterns Every Futures Trader Should Know", https://ninjatrader.com/futures/blogs/trade-futures-understanding-the-4-common-volume-profile-shapes/ (text copy: `evidence/ninjatrader-4-volume-profile-shapes.txt`) | 2026-06-15 | 2026-11-17 | Cited, not reproduced |
| S4 | Balance and the bell-shaped profile; P and b as deviations from balance | Bookmap, "B-Shaped and P-Shaped Market Profile: How Deviations From Balance Create Weak Highs and Weak Lows", https://bookmap.com/blog/b-shaped-and-p-shaped-market-profile-how-deviations-from-balance-create-weak-highs-and-weak-lows (text copy: `evidence/bookmap-2026-02-12-b-and-p-shaped-profiles.txt`) | 2026-02-12 | 2026-11-17 | Cited, not reproduced |
| R | Reference post (the idea: four profile shapes and the trade each implies) | Instagram, Zak Elga (zak.elga), https://www.instagram.com/reels/Dfy1lX4vCMR/ (uploaded 16 Nov 2026). Transcript `evidence/reference-transcript-raw.txt`; metadata `evidence/reference-info.json` | 2026-11-16 | 2026-11-17 | Structure only. No footage, audio, graphics or wording used. Its examples are futures (NQ), not reproduced. Ours are recomputed from real BTC data. Its "comment MAP" CTA is dropped |

## Method
- Each UTC day: 288 five-minute candles. Each candle's volume is spread evenly over its high–low range, then summed into 30 equal price bins between the day's low and high.
- Classifier thresholds (`day-shapes.py`) were checked by eye on the five days used:
  - **P:** POC in the top third and at least 50% of volume there.
  - **b:** the mirror of P.
  - **D:** POC in the middle third, the open-to-close move under 40% of the range, and at least 45% of volume in the middle.
  - **Long and thin:** range at least 1.3× the 20-day median, the open-to-close move at least 70% of the range, and no third holding 50% of volume.
- **Note:** 15 Nov's top third holds 47% (just under the P threshold), but its POC is in the top third (0.68) and the thin part sits below it. By eye it reads as a P with a small foot at the low.
