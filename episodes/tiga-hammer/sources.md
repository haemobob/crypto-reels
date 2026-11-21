# Sources — tiga-hammer

## Facts and data
| # | Claim or asset | Source | Published | Checked | Licence or basis |
|---|---|---|---|---|---|
| S1 | All BTC prices, the three hammers' H1 OHLC and their 12 five-minute candles each. A: 1 Sep 2026 18:00 UTC. C: 15 Oct 2026 02:00 UTC. B: 17 Jul 2026 13:00 UTC. | Binance spot BTCUSDT klines, https://data-api.binance.vision/api/v3/klines (1h and 5m, 25 May–21 Nov 2026); extract in `src/episodes/tiga-hammer/candles.json` | live market data | 2026-11-21 | Public market data API; credited on screen "DATA: BINANCE BTCUSDT" |
| S2 | "Enam jam kemudian": B +1.59% (said "satu koma enam"), A +0.08% ("nyaris diam"), C min −1.27% within the six candles ("sempat turun satu koma tiga") | S1, our calculation: close 6 H1 candles later vs the hammer's close; min/max over those 6 candles | — | 2026-11-21 | Our calculation, shown with the source line |
| S3 | "Dari dua puluh delapan hammer Bitcoin enam bulan terakhir, pola B naik lima dari delapan. Sisanya, tiga belas dari dua puluh." Baseline (not spoken): any H1 candle higher 6 candles later, 51% | S1, our count over 25 May–21 Nov 2026 by the definitions in `research.md`; every hammer listed in `evidence/hammers-btc.json` | — | 2026-11-21 | Our count; on screen "28 HAMMER BTC H1 · 25 MEI–21 NOV 2026 · DEFINISI & HITUNGAN CRYPTONITE · SAMPEL KECIL" and "BUKAN RUMUS" |
| S4 | Hammer, sweep, equal low, lower high and change of character (CHoCH) as used here | Our stated definitions (`research.md`). The terms follow common price-action / smart-money usage; the thresholds are ours. | — | 2026-11-21 | Definitions |
| S5 | Payoff level "BATAL KALAU 62.538 TEMBUS" | Hammer B's H1 low, 62,537.56 (S1), rounded | — | 2026-11-21 | Data |
| S6 | Idea and structure of the original Reel: three H1 hammers with the same OHLC that differ on 15m (A empty inside, C a bounce that fades, B an equal-low sweep then a break of the last lower high = CHoCH inside one candle) | @tradersarena_id, https://www.instagram.com/reels/De4kXljzc6R/. Read from the public embed caption (`evidence/reference-caption.txt`); the video itself could not be downloaded (Instagram blocks anonymous downloads). | 2026-11 | 2026-11-21 | Idea only. Our version uses our own data (BTC, not XAUUSD), our own script and visuals, and an added data check; nothing from their video is reused. |

## What we changed from the original, and why
- **Data:** the original's three candles have identical OHLC (likely constructed). Ours are three real BTC hammers with nearly the same shape, each with its real date.
- **Timeframe:** the original used 15m; we use 5m so each hour has 12 bars to read.
- **The twist:** the original implies the B pattern is the one to buy. Our six-month count does not support that (5/8 vs 13/20), so the Reel says "bukan rumus" and turns the read into a risk rule (where the idea is wrong).
- **CTA:** the original asks for a comment. Ours ends on the payoff.

## Assets
| Asset | Origin | Licence / basis |
|---|---|---|
| Candles (all charts) | Drawn as SVG from S1 values, not screenshots | Public data |
| Pictogram actors, pills, grids | Cryptonite-made (`src/components/actors.tsx`) | Own work |
| Score `public/episodes/tiga-hammer/score.mp3` | Synthesised by `scripts/score-tiga-hammer.ts` | Original |
| SFX | `public/sfx/newest/` pack (user-cleared, 21 Oct 2026) | See `public/sfx/newest/manifest.json` |
| Voice | The user's ElevenLabs take (Eleven v3, "Ongky Himawan – Calm, Deep"), `voice-cache/elevenlabs-take.mp3` | The user's own account |

## Illustrative elements
- **The one-actor-per-5m-candle rows:** a visual count of which side won each real 5m candle (close above or below open). They show real data, but the people are a metaphor.
- **The dots under the swept level (stop orders):** illustrative. Their position is the real level; their number is not data.
