# Research — bentuk-volume

## 5W1H
- **Who:** Bitcoin (BTC/USDT). Price data from Binance spot; open interest from the OKX BTC-USDT perpetual.
- **What:** each UTC day's volume profile (where the day's volume traded, by price) takes one of four common shapes, and each is commonly read as a sign of who was in control. Bitcoin's last five days show all four:
  - 12 Nov: b
  - 13–14 Nov: long and thin
  - 15 Nov: P
  - 16 Nov: D
- **When:** 12–18 Nov 2026 (UTC days). Data fetched 17 Nov 2026 around 04:00 UTC, plus 17 Nov's full day on 18 Nov at 05:14 UTC. The script was revised on 18 Nov: "kemarin" and "hari ini" became dates, and the 17 Nov test of the thin area was added.
- **Why it matters:** the 15 Nov bounce (+5.4% from $62,006) looks like buyers returning. But volume piled up at the top (P), and OKX open interest fell during the rise. That is consistent with short covering rather than new positions, which is the textbook caveat on P shapes.
- **How:** our own profiles from Binance 5-minute candles. Each candle's volume is spread evenly over its high–low range, in 30 bins per day. Shapes are classified by where the POC and the volume sit (`evidence/day-shapes.py`) and checked by eye.

## The four shapes (sources: NinjaTrader, 15 Jun 2026; Bookmap, 12 Feb 2026)
- **P:** a rally, then consolidation at the top; a thin lower part. NinjaTrader: it "can also mark the end of a downtrend indicating a possible short covering rally".
- **b:** a sharp fall, then consolidation at the bottom; a thin upper part. NinjaTrader: it "can occur as a result of long liquidation".
- **D:** balance, with the POC in the middle. Bookmap: "When buyers and sellers agree on a price, the market naturally moves back and forth… a bell-shaped curve."
- **Long and thin:** a trend day, where volume is spread along a long range with no bulge. The reference calls it "long and thin"; Market Profile literature calls it a trend day.
- **Caveat** (repeated across sources; secondary sources found via search): the letters describe where volume piled up. They are not buy or sell signals, and no reliable published win rate exists. We say "bukan sinyal" (not a signal) on screen and in the voice.

## Claims
| Claim | Type | Source | Checked |
|---|---|---|---|
| 15 Nov: low $62,006 (01:45 UTC), close $65,351 = +5.4% ("mantul lima persen") | Fact (data) | S1 | 2026-11-17 |
| 15 Nov profile: volume heaviest at $64.5–65.5K, thinnest at $63.2–63.7K → P | Calculation | S1 | 2026-11-17 |
| OKX OI 15 Nov: 33,686 → 32,600 BTC (−3.2%) over the day; −2.5% from the hour of the low (02:00) to the close while price rose | Fact (data) | S2 | 2026-11-17 |
| "A sign of shorts closing, not new positions" | Interpretation (OI falls while price rises; one exchange) | S2, S3 | — |
| 12 Nov: open $74,015, close $71,460, volume heaviest at the bottom ($71.4–72.1K) → b. The next day fell 4.4% (close $68,314) | Fact / calculation | S1 | 2026-11-17 |
| 14 Nov: −6.1% ($68,314 → $64,150), range 2.8× the 20-day median, volume spread along the range → long and thin. Its low ($63,320) broke the next day ($62,006) | Fact / calculation | S1 | 2026-11-17 |
| P reading: buyers defend the thin area below (~$63.5K; 15 Nov's thinnest bins $63,106–63,794) | Reading (heuristic) | S1, S3 | 2026-11-17 |
| 16 Nov: POC ~$64,890 in the middle of $63,905–65,696 → D | Calculation | S1 | 2026-11-17 |
| 17 Nov: fell below 16 Nov's range to $63,336 (15:50 UTC), inside the thin area; no 5-minute close below $63,106 (lowest close $63,421); closed $64,947, above the thin area ("jatuh ke area tipis itu… lalu ditutup lagi di atasnya") | Fact (data) | S1 | 2026-11-18 |
| 18 Nov (after the voice was recorded; shown on screen only): the thin area broke. The first 5-minute close below $63,106 came at 15:45 UTC; low $62,063 (22:55 UTC), close $63,068 | Fact (data) | S1 (`evidence/binance-btcusdt-5m-2026-11-18.json`) | 2026-11-19 |

## Nuance kept off screen (honest notes)
- On 12 Nov (the b day), OKX OI **rose** 5.5% as price fell: new shorts, not long liquidation. So we say "penjual pegang kendali" (sellers in control) and do not say "long liquidation" for that day.
- 13 Nov's OI fell 9.2% while price fell (long liquidation). We don't need it in the script.
- One exchange's OI is a slice of the market. On screen it is "OI OKX".

## Update at voice lock (19 Nov 2026)
The user's take ends the story at 17 Nov (the thin area held). On 18 Nov it broke: close $63,068, low $62,063, almost back to the 15 Nov low. So the payoff beat shows 18 Nov in red with "18 NOV: JEBOL → $62.063" and the headline "BENTUK ≠ SINYAL: 18 NOV, AREA TIPIS JEBOL", during the spoken "Bentuknya bukan sinyal". The data line reads "DATA S/D TUTUP 18 NOV 2026". A narrated version would need one more spoken line and a new take (offered to the user).
