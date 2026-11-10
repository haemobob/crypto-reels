# Sources — btc-ulang-2021

| # | Claim or asset | Source (URL / file) | Published | Checked | Licence or basis |
|---|---|---|---|---|---|
| S1 | Every price, date, percentage and day count for both cycles; the chart data | Binance BTC/USDT daily klines, https://data-api.binance.vision/api/v3/klines?symbol=BTCUSDT&interval=1d — `evidence/binance-btcusdt-1d-2021-2026.json`, chart file `public/episodes/btc-ulang-2021/btc-1d.json` | live | 2026-11-10 | Public market data, credited on screen |
| R | Reference Reel (claims checked, structure only) | https://www.instagram.com/reels/DfcxqkBDcDv/ (CoinForge, 7 Nov 2026) — `evidence/reference-transcript-raw.txt` | 2026-11-07 | 2026-11-10 | Not used in the Reel; see `reference-analysis.md` |

## Assets
| Asset | File | Origin | Licence or basis |
|---|---|---|---|
| Charts, tracing sheet, rulers, cards | `src/episodes/btc-ulang-2021/*` | Built in code from S1 (vector, identical values) | Own work |
| Sound effects | `public/sfx/newest/*` | User's pack | User-confirmed free to use (21 Oct 2026) |
| Score | `public/episodes/btc-ulang-2021/score.mp3` | Synthesised (`scripts/score-btc-ulang-2021.ts`) | Own work |

## Fact-check notes
- Wick highs/lows (not closes) mark every step; the chart line is daily closes with the daily high–low range behind it, so each marker sits on a real wick.
- The 10 Nov 2026 candle was open when checked; the chart ends at the 9 Nov close ($75.368). "Beberapa hari terakhir" = closes 6–9 Nov ($74.851–75.868) and the 8 Nov low ($73.510).
- The reference's "exactly 40%" is 42,3% on Binance daily wicks; its $75.400 lies between the 40% ($75.557) and 42,3% ($74.883) levels.
