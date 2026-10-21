# Sources — Bitcoin sekarang mirip 2023?

| # | Claim or asset | Source | Published | Checked | Licence or basis |
|---|---|---|---|---|---|
| S1 | All BTC prices, dates and the weekly candles drawn in both charts | Binance BTCUSDT 1d klines, `https://data-api.binance.vision/api/v3/klines?symbol=BTCUSDT&interval=1d` (raw: `data/binance-btcusdt-1d.json`) | live market data | 2026-10-21 | Public market data; charts are Cryptonite's own vector drawings of the values |
| S2 | Cross-check of every level | Coinbase Exchange BTC-USD 1d candles, `https://api.exchange.coinbase.com/products/BTC-USD/candles?granularity=86400` (raw: `data/coinbase-btcusd-1d.json`) | live market data | 2026-10-21 | Public market data, used for verification only |

Notes
- Charts are rebuilt as vectors from S1 with identical values (weekly OHLC aggregated from daily candles, Monday-start weeks). Values used: `data/chart-data.json`.
- Both panels use the same logarithmic scale (equal on-screen height = equal % move) and the same week grid, so shapes and timing compare fairly.
- The current week (w/c 2026-10-19) is incomplete; on screen as "data per 21 Okt 2026".
- Scenario paths on the current chart are hypothetical and labelled SKENARIO on screen.
- No third-party images, logos or footage. The reference video the user mentioned was not available in this session and nothing from it is used.
- Sound effects are generated originals (`npm run audio`, see `audio-map.md`).
