# Sources — jpmorgan-bitcoin

| # | Claim or asset | Source (URL / file) | Published | Checked | Licence or basis |
|---|---|---|---|---|---|
| S1 | 2027 LTCMA, 31st edition; "a range on bitcoin return is introduced, but bitcoin is not included as an allocation"; U.S. large cap 7.5%; gold 5.5%; 60/40 7.0%; horizon 10–15 years | J.P. Morgan Asset Management press release, https://am.jpmorgan.com/us/en/asset-management/institutional/about-us/media/press-releases/jp-morgan-releases-2027-long-term-capital-market-assumptions/ — `evidence/jpmam-press-release-2026-10-19.txt` | 2026-10-19 | 2026-10-24 | Fact (the firm's own release) |
| S2 | "For the first time, we put a range on bitcoin returns, though we do not yet include bitcoin in our main covariance matrices"; "volatility and unstable correlation … remain an obstacle" | JPMAM LTCMA page, https://am.jpmorgan.com/us/en/asset-management/institutional/insights/portfolio-insights/ltcma/ — `evidence/jpmam-ltcma-page.txt` | 2026-10-19 | 2026-10-24 | Fact; quoted |
| S3 | Exhibits: U.S. large cap 7.5%, U.S. cash 3.2% (public markets table); gold 5.5% (real assets table) | JPMAM exhibit SVGs `public-markets-exhibit.svg`, `executive-exhibit-4.svg` — rendered to `evidence/ltcma-2027-*.png` | 2026-10-19 | 2026-10-24 | Fact; rebuilt in our design, values identical |
| S4 | Bitcoin base 10% annualized; bear −9.7%; bull 17%; U.S. large/small cap 7.5%/7.7%; gold 5.5%; Dimon "fraud" 2017; JPMAM "speculative asset and a hedge against monetary easing" | CoinDesk, https://www.coindesk.com/markets/2026/10/20/jpmorgan-sees-10-annual-bitcoin-returns-topping-stocks-bonds-and-gold-over-next-decade — `evidence/coindesk-2026-10-20.txt` | 2026-10-20 | 2026-10-24 | Fact (reporting the report); scenarios from this single outlet, attributed |
| S5 | 10% compound annual return over 10–15 years; 55% volatility vs ~17% gold; arithmetic average 20.9% | Decrypt, https://decrypt.co/381464/jpmorgan-bitcoin-forecast-first-time-stocks-gold — `evidence/decrypt-2026-10-20.txt` | 2026-10-20 | 2026-10-24 | Fact (reporting the report) |
| S6 | 55% vs ~18% U.S. large cap; 10% compound vs 20.9% arithmetic ("volatility drag") | Yahoo Finance, https://finance.yahoo.com/markets/crypto/articles/jpmorgan-2027-ltcma-gives-bitcoin-103835394.html — `evidence/yahoo-range-2026-10-20.txt` | 2026-10-20 | 2026-10-24 | Fact (reporting the report) |
| S7 | Indonesian coverage (story peg) | Coinvestasi, https://coinvestasi.com/berita/bitcoin-diprediksi-kalahkan-saham-dan-emas | 2026-10-21 | 2026-10-24 | Reference only |
| S8 | Bitcoin weekly prices: high $126,199.63 (week of 6 Oct 2025), low $57,800.19 (week of 29 Jun 2026); 2021 high $69,000, 2022 low $15,476 | Binance BTCUSDT weekly klines, `https://data-api.binance.vision/api/v3/klines?symbol=BTCUSDT&interval=1w` → `public/episodes/jpmorgan-bitcoin/btc-weekly-2020-2026.json` | live | 2026-10-24 | Public market data, credited on screen |
| S9 | Jamie Dimon: bitcoin "is a fraud", 12 Sep 2017, Barclays conference | CNBC, https://www.cnbc.com/2017/09/12/jpmorgans-dimon-says-bitcoin-is-a-fraud-that-will-eventually-blow-up.html | 2017-09-12 | 2026-10-24 | Fact (quote), credited on screen |

## Assets
| Asset | File | Origin | Licence or basis |
|---|---|---|---|
| 2027 LTCMA report cover (with the J.P. Morgan Asset Management wordmark) | `public/episodes/jpmorgan-bitcoin/ltcma-2027-cover.jpg` | https://am.jpmorgan.com/content/dam/jpm-am-aem/global/en/ltcma-2027/ltcma-cover-1020x1320.jpg (the firm's public LTCMA page) | Editorial use to identify the report, shown whole and unaltered, credited; no endorsement implied |
| ₿ symbol | `bitcoin-symbol.svg` | Wikimedia Commons, File:Bitcoin.svg | Public domain |
| 3D coin, gold bar, stock tile, podium, tracks, coin stacks, scenario ribbons, portfolio ring | `src/three/*`, `src/episodes/jpmorgan-bitcoin/*` | Built in code | Own work |
| Typefaces for 3D type | `public/fonts/typeface/*.json` | From the project's Inter Tight / JetBrains Mono | SIL OFL 1.1 |
| Sound effects | `public/sfx/newest/*`, `public/sfx/*.wav` | User's pack; generated originals | User-confirmed free to use (21 Oct 2026); own work |
| Voice (working) | `public/episodes/jpmorgan-bitcoin/narration.wav` | Google Cloud TTS, Chirp 3 HD Orus | The user's Google Cloud account |
