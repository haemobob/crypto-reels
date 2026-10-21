# Research — Peta likuidasi Bitcoin

Checked 21 Oct 2026 (UTC).

## 5W1H
- **What**: the liquidation heatmap: a chart that estimates the price levels where leveraged futures positions would be force-closed, coloured by estimated size.
- **Who**: CoinGlass (data aggregator); traders on Binance BTC/USDT perpetual futures.
- **When**: screenshot of the live heatmap taken 21 Oct 2026, 14:42 UTC (24-hour view, Model 1, default threshold 0.85).
- **Why it matters**: futures traders use it to see where forced orders may cluster; it can also show where their own position would be cleared.
- **How**: liquidation price ≈ entry × (1 − 1/leverage + maintenance margin rate) for a long; entry × (1 + 1/leverage − MMR) for a short (isolated margin, simplified).

## Claims
| Claim | Type | Source | Checked |
|---|---|---|---|
| CoinGlass's heatmap "predicts where liquidations might be triggered, not the actual number"; colours go from purple to yellow as estimated liquidations increase; "actual number of forced liquidations is often lower than the intensity indicated"; read it as relative | Fact (CoinGlass's own description) | S1 | 2026-10-21 |
| Bright (yellow) bands at ≈ $82,300 and ≈ $84,800 on the 24 h Binance BTC/USDT heatmap | Fact (read from the screenshot's own price axis: $82,336 and $84,791) | S2 | 2026-10-21 14:42 UTC |
| BTC price at the screenshot: $84,222 (1-minute close, 14:42 UTC) | Fact | S3 | 2026-10-21 |
| Long 50× at $84,000 → liquidation ≈ $82,656; short 50× → ≈ $85,344 | Calculation (simplified formula, MMR 0.4% assumed; real values vary by exchange, tier and margin mode) | S4 | 2026-10-21 |
| A long's liquidation is a forced sell; a short's is a forced buy | Fact (mechanism) | S1, S4 | 2026-10-21 |
| Price is often drawn toward dense bands and can move faster there; bands can be swept and price can then reverse | Interpretation (common trader reading; "sering"/"bisa", never "pasti") | S1 (liquidity framing), reference reel's own example | — |
| Keeping your own liquidation price outside the bright bands | Risk-management suggestion, not a trade signal | Own analysis | — |

Not claimed: any price target, that bands cause moves, or that anyone deliberately hunts them.
