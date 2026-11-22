# Research — lantai-hammer (22 Nov 2026)

**Brief (user, 22 Nov 2026):** rebuild the hammer Reel with a much stronger structure and hook. The rebuild follows the critique of tiga-hammer: jargon never pictured, actors that don't act, and a twist that undercut its own lesson.

## Data
- **Source:** Binance spot BTCUSDT 1h klines, 25 May–21 Nov 2026 (to 21 Nov 06:00 UTC).
- **Hammers:** the 28 H1 hammers by the definitions in `../tiga-hammer/research.md`.
- **Floor:** the hammer's low (wick tip). The floor distance is (close − low) / close.
- **Results** (all in `evidence/floors.json`):

| Measure | Value |
|---|---|
| Floor broke within 24 h (any later hourly low below the hammer low) | **13 of 28** |
| Median floor distance | **0.77%** (range 0.19–1.61%) |
| Price first rose by the floor distance (48 h window) | **17** |
| Floor broke first | **9** |
| Same hour, ambiguous | 1 |
| Neither | 1 |
| Baseline: a level 0.77% under any H1 close, held 24 h | 36% (the hammer floors held 54%) |

## The worked example: 14 Nov 2026, 15:00 UTC (22:00 WIB)
- **H1 OHLC:** 65,914.02 / 66,047.37 / 65,066.66 / 65,742.01. Floor distance 1.03%.
- **+1 h** (23:00 WIB): low −1.13%, the floor breaks. A stop just under it exits at about −1%.
- **+2 h** (00:00 WIB): high +0.68%. Price bounces above the entry ("Raka merasa menang").
- **+5 h to +10 h:** it falls; the +10 h candle (08:00–09:00 WIB, 15 Nov) has the low, **−5.68%** from the entry ("besok paginya… minus lima koma tujuh persen").
- **After that:** +24 h close −1.51%; +48 h close −1.94%.

## Claim types
| Claim | Type |
|---|---|
| Prices, dates, path | Data (Binance) |
| Raka and Dina | Fictional traders on real prices; on screen "ILUSTRASI: TRADER FIKTIF, HARGA ASLI" |
| 13/28, 0.77%, 17 vs 9 | Our count, small sample, no fees or slippage; not a backtested strategy |
| "Ekor panjang itu jejak pembeli yang nahan harga" | Standard reading of a long lower wick (price traded lower and was pushed back up within the hour) |
| The rule | Risk education, not a signal; "bukan saran investasi" on screen |

## Honesty notes
- The stop under the wick sold Dina **before** a bounce on 14 Nov. The script keeps that ("Harga sempat balik, Raka merasa menang"): the point is a known loss, not being right.
- "Sembilan kali lantainya jebol duluan" counts the floor-first cases in the 48 h window; the 13 counts breaks within 24 h at any time (including after a rise). Both are labelled on screen with their definitions.
