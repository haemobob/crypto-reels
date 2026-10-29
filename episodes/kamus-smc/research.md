# Research — kamus-smc (checked 29 Oct 2026)

## 5W1H
- **What:** Smart Money Concepts (SMC), a discretionary chart-reading framework popularised by ICT (Inner Circle Trader, Michael J. Huddleston) and retail trading educators. It reads price as traces of large orders: structure, breaks, liquidity (resting orders), entry zones and premium/discount.
- **Who uses it:** retail traders, widely in Indonesian crypto and forex communities (the reference Reel is one of many).
- **When / where:** our worked example is BTC/USDT on Binance, daily candles, 20 May – 5 Sep 2026 (fetched 29 Oct 2026).
- **Why it matters:** the vocabulary is everywhere in Indonesian trading content; viewers meet BOS/CHoCH/FVG without a map, and often without the caveat that it is interpretation.
- **How:** the Reel defines each term and points to where it appears on the real chart, in the order a trader would use them.

## Claim types
| Claim | Type | Basis |
|---|---|---|
| Term definitions (HH/HL/LH/LL, BOS, CHoCH, BSL/SSL, equal highs, sweep, inducement, order block, imbalance/FVG, mitigation, equilibrium/premium/discount) | **Convention** (common usage, not a standard) | S2–S7; definitions vary between sources (e.g. body vs full range for an order block; wick vs close for a sweep) |
| Stop-loss orders cluster just beyond round numbers / obvious levels | **Fact (research)** | Osler 2003, Journal of Finance (S1): ~9,700 currency stop-loss and take-profit orders; take-profits cluster at round numbers, stop-losses just beyond them |
| "Liquidity = tumpukan stop loss" above highs / below lows | **Interpretation** grounded in S1 ("biasanya") | S1, S4 |
| Price "is drawn to" equal highs; FVGs "often get filled"; sweeps lead to reversals | **Interpretation / belief**, not guaranteed | S4, S5; critics note sweeps don't always reverse (S8) |
| SMC as a full framework has a proven edge | **Not supported**: no rigorous public testing found; readings are subjective | S8 (critical reviews), S5 (vendor acknowledges subjectivity) |
| Every date and price on the chart | **Fact (market data)** | S9, Binance daily candles |

## The worked example (Binance BTC/USDT daily, UTC; detected with a fixed rule and checked by hand)
Swing points: fractal of 4 candles each side. Breaks: daily close beyond the most recent confirmed swing.
| Term | Where on the chart | Values |
|---|---|---|
| Lower high / lower low | 26 May LH 78,080 → 5 Jun LL 59,131 → 15 Jun LH 67,292 → 25 Jun LL 58,115 | — |
| BOS (down) | 24 Jun close 61,078 below the 18 Jun low 62,272 | trend continues |
| Sell-side liquidity | below the 25 Jun low 58,115 | — |
| Sweep | 1 Jul: wick to **57,800** (below 58,115), close **60,024** back above | — |
| CHoCH (up) | 14 Jul close **65,044** above the 6 Jul high 64,700 (first break against the downtrend; +4.3% day) | — |
| Equal highs (buy-side liquidity) | 22 Jun 65,623 ≈ 15 Jul 65,600 (0.04% apart) | taken on 20–21 Jul (wick 65,799, then close 66,556) |
| BOS (up) / higher high | 21 Jul close 66,556 above 65,600; HH 66,956 | — |
| Higher low | 1 Aug low 62,275 | — |
| Equilibrium / discount | range 1 Jul low 57,800 → 21 Jul high 66,956: midpoint **62,378**; 1 Aug low 62,275 is just below it (discount) | — |
| Inducement (reading) | 9 Aug minor high 65,474, just under the 65.6K equal highs; price then dipped to 62,535 (14 Aug) before the real move | subjective; labelled "CONTOH PEMBACAAN" |
| Order block | 16 Aug, the last down candle (O 63,086, C 62,900, L 62,716, H 63,390) before the 17–21 Aug run | — |
| Imbalance / FVG | 19 Aug +7.1% candle: gap between the 18 Aug high **65,059** and the 20 Aug low **68,902** | — |
| BOS (up) / higher high | 19 Aug close 69,335 above 66,956; HH 81,479 on 28 Aug | — |
| Mitigation | not yet: lowest price after 21 Aug is 74,968 (15 Sep), so the 65,059–68,902 gap is **still unfilled at 29 Oct 2026** | the "not always" example |

## Caveats to put on screen at the claim
- SMC readings are interpretations: "CONTOH PEMBACAAN · BUKAN SINYAL".
- Liquidity zones are inferred, not observed: "ZONA STOP = PERKIRAAN".
- Gaps are often filled but not always: the August gap is still open.
- No guarantee; stop loss still required (ending).
