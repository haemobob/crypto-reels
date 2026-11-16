# Sources — poc-bitcoin

| # | Claim or asset | Source | Published | Checked | Licence or basis |
|---|---|---|---|---|---|
| S1 | All prices, dates and volumes. The daily chart (closes plus each day's high–low) and both volume profiles | Binance BTC/USDT klines, data-api.binance.vision: daily `evidence/binance-btcusdt-1d-2022-2026.json` and hourly `evidence/binance-btcusdt-1h-2025-09_2026-11.json` (1 Sep 2025 – 16 Nov 2026 00:00 UTC). Chart file `public/episodes/poc-bitcoin/btc.json` | live | 2026-11-16 | Public market data, credited on screen |
| R | Reference post (the idea: two points of control framing the rally and the drop) | Instagram, real_coinforge, https://www.instagram.com/reels/Dfx6XgFAR-L/ (uploaded 15 Nov 2026). Transcript `evidence/reference-transcript-raw.txt`, metadata `evidence/reference-info.json` | 2026-11-15 | 2026-11-16 | Structure only. No footage, audio, graphics or wording used. Every number was recomputed from S1 |

## Method (on screen: "POC: volume per jam Binance BTC/USDT, dibagi rata ke rentang harga tiap jam")
- Each hourly candle's base-asset volume is spread evenly over its high–low range, then summed into $250 and $500 price bins. The bars drawn are the $500 bins; the gold line is the top $250 bin's midpoint.
- Summer range: 15 Jun – 18 Aug 2026 → $250 bin $64,000–64,250 (line at $64,125, "≈ $64.100").
- Bear range: 6 Oct 2025 – 31 Jan 2026 → $250 bin $87,750–88,000 (line at $87,875, "≈ $87.900").
- Robustness (`evidence/poc-robust.py`, run as `python3 evidence/poc-robust.py evidence/binance-btcusdt-1h-2025-09_2026-11.json`; the results are in `research.md`): the same bins for every window variant tried.

## Fact-check notes
- The chart line is daily closes. The two rings sit on the day's wick (high $87,396 on 21 Sep, low $62,006 on 15 Nov), which is drawn faintly under the line.
- "Rally terakhir" replaces the reference's "biggest rally of the year": January 2026 traded higher ($97,924).
