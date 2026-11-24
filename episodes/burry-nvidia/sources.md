# Sources — burry-nvidia (checked 24 Nov 2026)

## Market data (primary series, saved in `evidence/`)
| Claim on screen / spoken | Value | Source | File |
|---|---|---|---|
| Nvidia close 11 Nov 2026 (day before Huang resigned) | $173.73 | Yahoo Finance chart API, NVDA daily | `evidence/yahoo-nvda-daily.json` |
| Nvidia close 20 Nov 2026 (low) | $125.53 (intraday low $124.50) | same | same |
| Nvidia −27,7% (11 → 20 Nov) | (173.73 − 125.53) / 173.73 | calculation | — |
| Nvidia close 3 Nov 2025 (13F filed) | $206.88 | same | same |
| Nvidia high 6 Oct 2026 | $243.37 intraday (close $239.24) | same | same |
| Nvidia close 23 Nov 2026 (Huang reinstated) | $165.05, +31.48% on the day | same; also Motley Fool quote box "as of 4:00 PM ET 11/23/26" | same |
| Nvidia Jan–Oct 2025 (grey context line) | daily closes | Yahoo Finance | `evidence/yahoo-nvda-daily-2025.json` |
| Bitcoin −20,5% (11 → 20 Nov) | $73,964 → $58,799 (UTC daily close) | Yahoo Finance, BTC-USD | `evidence/yahoo-btc-daily-nov2026.json` |
| US house prices 2000–2012, peak Jul 2006, −27% to Feb 2012 | 184.61 → 133.99 | S&P CoreLogic Case-Shiller U.S. National Home Price Index (CSUSHPINSA), via FRED | `evidence/fred-CSUSHPINSA.csv` |

## Events and people
- Huang resigned as Nvidia CEO on 12 Nov 2026 after reports of affairs; CFO Colette Kress interim; reinstated by the board 23 Nov 2026. Wikipedia "Jensen Huang" (read 24 Nov 2026); CNBC 23 Nov 2026 https://www.cnbc.com/2026/11/23/nvidia-stock-jensen-huang-ai-trade.html. The "alleged spy" angle is an allegation and is **not** used.
- Burry sold half his Nvidia and SMH puts on Fri 20 Nov 2026 (Substack update), described as substantial gains: Stocktwits, 20 Nov 2026 https://stocktwits.com/news-articles/markets/equity/michael-burry-locks-in-gains-on-nvidia-chipmaker-etf-puts-as-ai-rout-deepens/cNbSoRqR91e. Benzinga reports 75% sold plus a small call position (page blocked our reader; not used for a number). CNBC: he "made a boatload betting against Nvidia with put options". **No dollar figure for his profit has been published.** On screen: "HASIL ASLINYA TIDAK DIUMUMKAN".
- Scion's final 13F (filed 3 Nov 2025, positions at 30 Sep 2025): 10,000 Nvidia puts = 1,000,000 shares, notional ≈ $186.6 M. Sherwood News, Motley Fool, Yahoo Finance (13 Feb 2026). The 13F shows no strike, expiry or cost.
- The Big Short: Burry bought credit default swaps on subprime mortgage bonds from 2005; ≈ $100 M personal profit and > $700 M for remaining investors. Wikipedia "Michael Burry" (read 24 Nov 2026). Film 2015, Christian Bale as Burry.
- Scion Asset Management deregistered / wound down late 2025 (Wikipedia; Yahoo Finance 13 Feb 2026). Substack "Cassandra Unchained".

## Simulations (labelled SIMULASI on screen)
- $100 M plain short (no leverage, no fees, no borrow cost) at $206.88, closed at $125.53: +39.32% = **+$39.3 M**. Not Burry's result (he used put options; his real P&L is not public).
- (Removed 24 Nov 2026 with the old takeaway: the 5× leverage simulation.)

## The ending (user's rework, 24 Nov 2026)
- On Fri 20 Nov 2026 Burry also bought a small tranche of long-dated, deep out-of-the-money Nvidia **call** options, which he called a **hedge** (with the remaining puts, "essentially a straddle"); he disclosed the trades the same day on his Substack "Cassandra Unchained" and on X. Sources: Stocktwits/Yahoo Finance "Michael Burry Bought Nvidia Calls, Cut His Semiconductor Shorts Before The Rally" https://finance.yahoo.com/markets/stocks/articles/michael-burry-bought-nvidia-calls-032355083.html ; KuCoin flash "Burry Trims Nvidia Put Bets, Adds Calls Ahead of Huang-Driven Rally"; BigGo Finance "Burry Trims Nvidia Short Right at the Wire, Bails Before 31% Rally"; Benzinga (headline only).
- Huang's reinstatement was announced Monday 23 Nov before the open; NVDA +31.48% that day (Yahoo series).
- "Timingnya pas banget, sampai banyak orang berspekulasi": the timing was widely framed as remarkable (Finbold: "exceptionally timed"; "Right at the Wire"; "Bails Before 31% Rally"). **No report alleges or shows that Burry had advance information**; the script says people speculated, then states the fact that he disclosed every move publicly the same day. The closing question ("Kebetulan, atau insting…?") offers luck or instinct only.
- "Orang yang sudah dua kali benar": 2005–2008 housing short (Wikipedia) and the Nvidia short, which was in profit by 20 Nov (−39% from the disclosure price).

## Images
| File | What | Origin | Basis |
|---|---|---|---|
| `public/episodes/burry-nvidia/photos/premiere.jpg` | Michael Burry at the premiere of The Big Short (2015), backdrop visible | Supplied by the user (24 Nov 2026); appears to be a news-agency photo, photographer not confirmed | Editorial use to identify the subject. **Licence/origin to be confirmed by the user before release.** |
| `public/episodes/burry-nvidia/photos/desk.jpg` | Burry at his desk (archive photo, date unknown) | Supplied by the user (24 Nov 2026), 640×480; origin not confirmed | Same as above |
| (not used) | A third supplied image of "Burry" in an office with glasses and a chart | Supplied by the user | **Rejected:** looks AI-generated (invented room, chart, glasses); a generated likeness can't stand in for a real photo |
| (not used) | Jensen Huang photo, Nvidia logo | Wikimedia Commons was rate-limiting this session (HTTP 429) | The opening's real anchor is the real price data instead |

Currency: trading levels and P&L in USD (market-quoted), per the 22 Oct 2026 currency rule.
