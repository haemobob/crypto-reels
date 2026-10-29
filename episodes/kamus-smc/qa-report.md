# QA report — kamus-smc

Both audits are done **before final rendering** (the user renders the final MP4). Update the two result lines; `npm run audit -- <id>` reads them and warns at render time while either is not PASS.

Retention audit result: PENDING
Visual-quality audit result: PENDING

## Part A — Retention audit (script on the Orus working voice, 79.5 s; times from captions.json)

### Script audit
- [x] 1. **Hook:** 0.3 s "Order block, FVG, sweep... istilah smart money concept emang bikin pusing." The stake (a vocabulary everyone uses and few can read) is clear in 3 s, with the real chart on screen.
- [x] 2. **Evidence by 5 s:** the real Binance BTC/USDT daily chart from frame 0 (source line), with three of the terms placed on their real dates.
- [x] 3. **First payoff by 8–12 s:** 6.8 s "lima tahap" (the 18 terms are one reading in five stages); 9.0 s stage 1 starts with LH/LL on 26 May and 5 Jun.
- [x] 4. **Reason to continue:** structure (9.0 s) → what signals a change (17.7 s) → where the stops are (26.2 s) → the real sweep on 1 Jul (37.2 s) → the trap (42.4 s) → entry areas (45.5 s) → the gap that is still open (56.3 s) → cheap or expensive (59.8 s) → the reading order (71.6 s).
- [x] 5. **Concrete nouns:** peaks and valleys, a pile of stop orders, a wick that pierces it, a gap between candles, a range cut in half.
- [x] 6. **Cut test:** the first draft (193 words, 90 s) lost "Mei sampai Agustus kemarin", "Trend naik kebalikannya", "Kalau tembusnya…", "Itu sweep", "Dan karena…"; no sentence repeats the headline.
- [x] 7. **Promise/payoff:** "18 istilah bikin pusing" → each term placed in five stages on one chart → the reading order to keep.
- [x] 8. **Truth test:** "biasanya numpuk", "sering jadi magnet", "tanda awal berbalik" (not certainty); the gap that did not fill is shown; "cara baca, bukan jaminan" at the end; on screen CONTOH PEMBACAAN · BUKAN SINYAL and ZONA STOP = PERKIRAAN; the mitigation path is ILUSTRASI.
- [x] 9. **Silent test:** headlines carry each turn (18 ISTILAH SMC, 1 CHART BITCOIN · LH/LL · HH/HL · BOS · CHoCH · LIQUIDITY = TUMPUKAN STOP · SSL / BSL · EQUAL HIGH · SWEEP · INDUCEMENT · ORDER BLOCK · FVG · MITIGATION · BELUM TERISI · EQUILIBRIUM · PREMIUM / DISCOUNT · STRUKTUR → LIQUIDITY → SWEEP → ENTRY · CARA BACA, BUKAN JAMINAN); verify on stills in Part B.
- [x] 10. **Share reason:** the friend in the trading group who throws BOS and CHoCH around, or the beginner who asked what they mean.

### Viewer-value gate
- [x] Understandable in 3 s · reason to care · early payoff (6.8–9 s) · each section adds new terms · the mechanism is shown on the real chart · no removable sentence · insight worth keeping (the reading order + stop loss) · delivers the promise · no follow/save/share request.

### Retention ladder
0.3 the jargon · 4.9 one real chart · 6.8 five stages · 9.0 LH/LL · 14.4 HH/HL · 17.7 BOS · 22.6 CHoCH · 26.2 liquidity · 29.9 / 32.0 SSL / BSL · 33.9 equal high · 37.2 the 1 Jul sweep · 42.4 inducement · 45.5 order block · 49.8 FVG · 54.1 mitigation · 56.3 still unfilled · 59.8 equilibrium · 65.0 / 66.8 premium / discount · 68.8 the 1 Aug bounce · 71.6 the order · 75.9 the rule.

### Rejection gates
- [x] Unsupported consequence: NO · first frame lacks stake: NO · logo/3D-only opening: NO (real chart from frame 0) · nothing real by 3–8 s: NO · no return by 8–12 s: NO · padding: NO · disconnected diagrams: NO (one chart carries every term) · ending doesn't answer the opening: NO.

## Part B — Visual-quality audit (motion-design rules, sections 4–8, and CLAUDE.md layout rules)

### Layout (CLAUDE.md)
- [ ] No text over graphics in any frame, including camera moves and crossfades
- [ ] Nothing darkens, crops or covers the graphics to make room for text
- [ ] Source images shown whole first, then zoomed only on the narrated part
- [ ] Opening title centred, rising in; no date/press tag above it; no logo before the hook

### Opening (cryptonite-openings.md)
- [ ] Statement → real anchor → designed card/diagram → abstract graphics, in that order
- [ ] Highest available level of the asset hierarchy used (real photo/logo/document over abstract)
- [ ] Opening motion restrained: push-ins, card reveals, light sweeps, reframing; no hero move or spectacle
- [ ] Each real asset sourced in `sources.md` (origin, date, licence basis); third-party logos/photos unaltered, no implied endorsement; news-style panels don't imitate a publisher's masthead

### Demonstration and sound-off (directive §6–8)
- [ ] Every important graphic demonstrates the spoken mechanism; decorative animation removed
- [ ] Main idea understandable muted: headlines, progressive labels, visible cause and effect, uncrowded
- [ ] Simulations labelled SIMULASI/ILUSTRASI on screen while shown; nothing simulated passes as real market data
- [ ] Real assets used where they add credibility; missing ones were requested, not faked

### Evidence and editorial
- [ ] All claims sourced; event dates and date checked recorded
- [ ] Conditional claims are visibly conditional
- [ ] CTA factually represents an existing asset or offer

### Runtime and implementation
- [ ] Duration measured from audio and render
- [ ] Output 1080×1920, 30fps, intended codecs (verified by ffprobe)
- [ ] No missing assets, 0-frame/negative-length clips, scene gaps, or audio tails
- [ ] Safe zones and fonts checked at mobile preview size
- [ ] Numbers and labels verified, including qualifiers

### Visual and sound inspection
- [ ] Stills across every beat; every transition before/mid/after; first 3 s and last 2 s at full resolution
- [ ] Motion watched in a full render: YES / NOT REVIEWED (never claim motion was checked from stills alone)
- [ ] Sound synchronized to emphasis and narration intelligible
- [ ] Single dominant visual concept per beat
- [ ] Camera move meaningfully motivated
- [ ] Polarity switches have semantic purpose
- [ ] Brand consistency and licensed assets checked

## Scores (1–5; any score below 4 → targeted revision and re-check)
| Hook | First 12 s | Real-world opening | Educational payoff | Reward ladder | Understanding | Hierarchy | Camera | Transitions | Rhythm | Brand | Factual accuracy |
|---|---|---|---|---|---|---|---|---|---|---|---|
| | | | | | | | | | | | |

## Known limitations

## Fixes completed and rechecked

## Final verified artifact path
