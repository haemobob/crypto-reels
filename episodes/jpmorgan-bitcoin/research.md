# Research — jpmorgan-bitcoin

Checked 24 Oct 2026. Source numbers in `sources.md`; captured texts in `evidence/`.

## 5W1H
- **Who:** J.P. Morgan Asset Management (the asset-management arm of JPMorgan Chase; AUM $4.8T at 30 Sep 2026), in its 2027 Long-Term Capital Market Assumptions (LTCMA). Bitcoin section by portfolio manager Dr Sheena Shah and head of digital asset strategy Dennis Cristallo (CoinDesk). Context: JPMorgan Chase CEO Jamie Dimon called bitcoin "a fraud" on 12 Sep 2017 (CNBC).
- **What:** for the first time in the report's 31 editions, a long-term return assumption for bitcoin: **10% compound annual return over 10–15 years**, bear case **−9.7%**, bull case **17%** (CoinDesk), **55% annualized volatility**, **arithmetic mean return 20.9%** (Decrypt, Yahoo). Bitcoin is **not included as an allocation** and **not in the main covariance matrices** (JPMAM's own pages).
- **Comparisons (JPMAM's own release and exhibits):** U.S. large cap 7.5%, gold 5.5%, USD 60/40 portfolio 7.0%, U.S. cash 3.2%, global aggregate bonds 5.3%. U.S. small cap 7.7% and volatility of ~18% (U.S. large cap) / ~17% (gold) via coverage.
- **When:** press release dated 19 Oct 2026; coverage 20 Oct 2026 (CoinDesk, Decrypt, Yahoo), Coinvestasi 21 Oct 2026.
- **Why it matters:** first time a major Wall Street asset manager puts a long-term number on bitcoin; the number is higher than stocks and gold, but comes with three times their volatility and a scenario range from −9.7% to +17% a year.
- **How (the mechanism we teach):** volatility drag. Big swings make the simple average return (20.9%) much higher than what compounds (10%): −50% then +50% leaves you at −25%.

## Real-world check of the volatility (Binance BTCUSDT weekly, fetched 24 Oct 2026)
- Peak week of 6 Oct 2025: high **$126,199.63**. Low week of 29 Jun 2026: **$57,800.19** → **−54.2%**. Last weekly close (week of 19 Oct 2026): $79,709.66 (−36.8% from the peak).
- 2021 peak $69,000 (week of 8 Nov 2021) → 2022 low $15,476 (week of 21 Nov 2022): −77.6%.

## Calculations (shown as SIMULASI, our arithmetic)
Rp10 juta compounded for 10 years at each assumption (USD returns; tax, fees and exchange rate ignored):
| Assumption | Rate | ×10 y | Result |
|---|---|---|---|
| Bitcoin bull (JPMAM) | 17% | 4.807 | Rp48,1 juta |
| Bitcoin base (JPMAM) | 10% | 2.594 | Rp25,9 juta |
| U.S. large cap (JPMAM) | 7.5% | 2.061 | Rp20,6 juta |
| Gold (JPMAM) | 5.5% | 1.708 | Rp17,1 juta |
| Bitcoin bear (JPMAM) | −9.7% | 0.360 | Rp3,6 juta |

Volatility drag illustration: 100 × 0.5 × 1.5 = 75 → −25%.

## Claims
| Claim | Type | Source | Date checked |
|---|---|---|---|
| Dimon called bitcoin "a fraud" (Barclays conference) | fact (quote) | CNBC 12 Sep 2017 (S9); repeated in CoinDesk 20 Oct 2026 | 24 Oct 2026 |
| First LTCMA with a bitcoin return range; not included as an allocation; not in main covariance matrices | fact | JPMAM press release 19 Oct 2026 and LTCMA page (S1, S2) | 24 Oct 2026 |
| Bitcoin 10% compound annual return, 10–15 years | forecast | Decrypt, Yahoo, CoinDesk quoting the report (S4–S6) | 24 Oct 2026 |
| U.S. large cap 7.5%, gold 5.5% | forecast | JPMAM press release and exhibits (S1, S3) | 24 Oct 2026 |
| Volatility 55%; arithmetic mean 20.9% | forecast inputs | Decrypt, Yahoo (S5, S6) | 24 Oct 2026 |
| Bear −9.7%, bull 17% | forecast scenarios | CoinDesk (S4) — single outlet, attributed on screen | 24 Oct 2026 |
| −50% then +50% = −25% | calculation (illustration) | arithmetic | — |
| Rp10 juta → Rp48,1 / 3,6 juta | calculation (SIMULASI) | our arithmetic on S4 | — |
| $126.2K (Oct 2025) → $57.8K (Jun 2026) | fact (market data) | Binance weekly klines (S8) | 24 Oct 2026 |
| Bitwise's Matt Hougan thinks 55% vol is too high | opinion | Decrypt (S5) | not used in narration |
