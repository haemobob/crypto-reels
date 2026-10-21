# Chart data notes

- `binance-btcusdt-1d.json`: raw daily candles 2022-09-01 → 2026-10-21 (Binance BTCUSDT). Primary source.
- `coinbase-btcusd-1d.json`: raw daily candles, same range (Coinbase BTC-USD). Cross-check only.
- `chart-data.json`: what the Reel draws: 25 weekly candles for 2022-10-31 → 2023-04-17 and 20 for 2026-06-08 → 2026-10-19 (last one incomplete), each with `t` = weeks from the low week, plus the verified levels and phase weeks.

Method: Monday-start weeks; open = first daily open, close = last daily close, high/low = extremes. Lows, highs and dates in `research.md` come from daily candles, so a weekly wick and a quoted daily level always agree.

Both exchanges agree to within 0.3% on every level (largest gap: 2023 high, $25,250 vs $25,289).

This is a snapshot as of 21 Oct 2026. If the Reel is published later, the current week, the latest price and possibly the structure itself (a reclaim, or a deeper pullback) will have moved: re-pull the data and re-check the levels, script and labels before rendering again.
