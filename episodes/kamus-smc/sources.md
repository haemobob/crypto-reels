# Sources — kamus-smc

| # | Claim or asset | Source (URL / file) | Published | Checked | Licence or basis |
|---|---|---|---|---|---|
| S1 | Stop-loss orders cluster just beyond round numbers; take-profit orders cluster at round numbers (~9,700 orders, a large dealing bank, Sep 1999 – Apr 2000) | Carol L. Osler, "Currency Orders and Exchange Rate Dynamics: An Explanation for the Predictive Success of Technical Analysis", *Journal of Finance* 58(5), 1791–1819; https://econpapers.repec.org/RePEc:bla:jfinan:v:58:y:2003:i:5:p:1791-1819 ; NY Fed Staff Report 125, https://www.newyorkfed.org/medialibrary/media/research/staff_reports/sr125.html | 2003 | 2026-10-29 | Fact (peer-reviewed); cited, not shown |
| S2 | BOS = break in the trend's direction (continuation); CHoCH = first break against the trend (possible reversal) | Mind Math Money, https://www.mindmathmoney.com/articles/break-of-structure-change-of-character-explained ; FXOpen, https://fxopen.com/blog/en/what-is-a-change-of-character-choch-in-trading-definition-signals-and-examples/ | — | 2026-10-29 | Convention (trader education) |
| S3 | Order block = last opposite-colour candle before an impulsive move; definitions vary (body vs range); subjective | TradingView education, https://www.tradingview.com/education/ictorderblock ; LuxAlgo, https://www.luxalgo.com/library/concept/bullish-bearish-order-block/ | — | 2026-10-29 | Convention |
| S4 | Buy-side liquidity above highs, sell-side below lows; equal highs/lows as targets; sweep = trade through a level and fail to hold; inducement = a minor pocket taken first | LuxAlgo, https://www.luxalgo.com/library/concept/buy-side-liquidity/ , https://www.luxalgo.com/library/concept/equal-highs-lows-as-liquidity/ , https://www.luxalgo.com/library/concept/liquidity-sweep/ | — | 2026-10-29 | Convention |
| S5 | Fair value gap = 3-candle imbalance, from candle 1's high to candle 3's low (bullish); often revisited, not guaranteed | LuxAlgo, https://www.luxalgo.com/library/concept/fair-value-gap/ ; TrendSpider, https://trendspider.com/blog/fair-value-gap-basics/ | — | 2026-10-29 | Convention |
| S6 | Dealing range, equilibrium = 50% midpoint, premium = upper half, discount = lower half | LuxAlgo, https://www.luxalgo.com/library/concept/premium-and-discount/ | — | 2026-10-29 | Convention |
| S7 | Mitigation = price returning to an order block / imbalance | LuxAlgo concept library (as S3, S5) | — | 2026-10-29 | Convention |
| S8 | Criticism: SMC readings are subjective; no rigorous public testing of the framework's edge; sweeps do not reliably reverse | EarnForex, https://www.earnforex.com/guides/smart-money-concepts-flaws/ ; LuxAlgo, https://www.luxalgo.com/library/concept/smart-money-concepts/ | — | 2026-10-29 | Opinion / review, used for the caveat only |
| S9 | Every candle, date and price in the Reel | Binance BTC/USDT 1d klines, https://data-api.binance.vision/api/v3/klines?symbol=BTCUSDT&interval=1d → `public/episodes/kamus-smc/btc-1d-2026.json`, raw copy `evidence/binance-btcusdt-1d-2026-10-29.json` | live | 2026-10-29 | Public market data, credited on screen; rebuilt as 3D candles with identical values |
| R | Reference Reel (structure only) | https://www.instagram.com/reels/De_V4s2StNA/ (@cuanterusidn) | 2026-10-27 | 2026-10-29 | Not used in the Reel; see `reference-analysis.md` |

## Assets
| Asset | File | Origin | Licence or basis |
|---|---|---|---|
| BTC/USDT daily candles (20 May – 5 Sep 2026, plus the check to 29 Oct) | `public/episodes/kamus-smc/btc-1d-2026.json` | Binance public market-data API | Public data, credited |
| 3D candles, levels, stop-order stacks, zones, labels | `src/episodes/kamus-smc/*` | Built in code | Own work |
| Typefaces for 3D type | `public/fonts/typeface/*.json` | From the project's Inter Tight / JetBrains Mono | SIL OFL 1.1 |
| Sound effects | `public/sfx/newest/*`, `public/sfx/*.wav` | User's pack; generated originals | User-confirmed free to use (21 Oct 2026); own work |

## Fact-check notes
- All structure labels were found with a fixed rule (4-candle fractal swings; daily close beyond the most recent confirmed swing) and checked against the raw candles; readings like inducement are labelled as our reading.
- "Sampai akhir Oktober belum terisi": lowest price after 21 Aug 2026 is 74,968 (15 Sep), above the gap's top (68,902), checked on 29 Oct 2026.
