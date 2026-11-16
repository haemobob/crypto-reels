# Research — poc-bitcoin

## 5W1H
- **Who:** Bitcoin (BTC/USDT on Binance).
- **What:** two volume levels framed the last two big moves. The latest rally (Aug–Sep 2026) stopped 0.5% under the point of control (POC) of the Oct 2025 – Jan 2026 range. The drop that followed bottomed just under the POC of the Jun–Aug 2026 range and closed back above it.
- **When:** rally 18 Aug → 21 Sep 2026 (high $87,396, 21 Sep). Drop 21 Sep → 15 Nov 2026 (low $62,006 and close $65,351, both 15 Nov). Data fetched 16 Nov 2026, the day after the 15 Nov daily close.
- **Where:** Binance BTC/USDT spot, daily and hourly klines.
- **Why it matters:** a POC is where the most volume traded in a range. Many holders' entry prices sit there, so price often reacts on the way back. It is a level to watch, not a guarantee.
- **How:** volume profile computed by us from Binance hourly klines. Each hour's volume is spread evenly over that hour's high–low range and binned at $250 and $500. The POC is the bin with the most volume.

## Claims
| Claim | Type | Source | Date checked |
|---|---|---|---|
| The latest rally stopped at $87K: high $87,396 on 21 Sep 2026 | Fact (data) | S1 daily | 2026-11-16 |
| The drop has stopped at $62K so far: low $62,006 on 15 Nov 2026 | Fact (data), one day old ("sejauh ini") | S1 daily | 2026-11-16 |
| Summer range (15 Jun – 18 Aug 2026) POC ≈ $64,100 (bin $64,000–64,250; $500 bin $64,000–64,500) | Calculation | S1 hourly | 2026-11-16 |
| Bear range (6 Oct 2025 – 31 Jan 2026) POC ≈ $87,900 (bin $87,750–88,000; $500 bin $87,500–88,000) | Calculation | S1 hourly | 2026-11-16 |
| Both POCs are the same bin for other window choices (summer from 1 Jun or 1 Jul, to 16 or 18 Aug; bear from 6 Oct, 1 Nov or 15 Nov, to 31 Jan or 4 Feb) | Calculation (robustness) | S1 hourly | 2026-11-16 |
| Rally +36% from $64K: from the 18 Aug low of $64,028 to $87,396 = +36.5%; from the POC $64,125 = +36.3% | Calculation | S1 daily | 2026-11-16 |
| $87,396 is 0.5% below the bear POC (vs $87,875: 0.55%; vs $87,750: 0.40%) | Calculation | S1 | 2026-11-16 |
| Drop −29%: $87,396 → $62,006 = −29.05% | Calculation | S1 daily | 2026-11-16 |
| 15 Nov closed at $65,351, above the summer POC | Fact (data) | S1 daily | 2026-11-16 |
| The next level if $64K breaks: July low $57,800.19 (1 Jul 2026) | Fact (data); "next level" is our reading | S1 daily | 2026-11-16 |
| "Price often reacts at high-volume levels" | Interpretation (common volume-profile reading), worded "sering" (often), not "always" | — | — |

## Left out of the reference
- **"Biggest rally of the year":** not used. The 2026 high was 14 Jan ($97,924), so the hook says "rally terakhir" (the latest rally) instead.
- **Elliott-wave count** (five waves down from $126K, wave A/B/C, "beginning of a new uptrend"): interpretation and forecast, not verifiable. Left out.
- **"Line in the sand" figure:** the reference transcript reads $67,700 at one point and $57,700 at another. We use the verifiable July low from Binance, $57,800, and present it only as the next level, not as an invalidation of a forecast.

## Limits
- The profile method (an even spread over each hour's range) is an approximation. Exchange volume profiles built from tick data may put the POC a few hundred dollars away. On screen it is "≈" and narrated as "sekitar".
- The range boundaries are our choice. They are disclosed on screen and shown to be robust above.
- The data ends at the 15 Nov 2026 close; the post ages quickly.
