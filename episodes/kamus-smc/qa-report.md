# QA report — kamus-smc

Both audits are done **before final rendering** (the user renders the final MP4). Update the two result lines; `npm run audit -- <id>` reads them and warns at render time while either is not PASS.

Retention audit result: PASS
Visual-quality audit result: PASS

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

## Part B — Visual-quality audit

Checked on stills across every beat during the build (four rounds; fixes: chart clipped to the stage band, autoscaled price axis, fixed-size labels that hide outside the stage, smaller stop piles, the replayed candle hidden properly, zone labels inside the frame, larger stage index), then on the **encoded MP4**. Render 1: one frame per second (84 frames, `output/kamus-smc-review/r1-sheet*.jpg`), 59 exact frames before/mid/after every boundary in `transition-map.md` (`r1-tr.jpg`), and full-resolution frames at eight beats (`cmpA/cmpB.jpg`). Three timing issues found there were fixed and checked on render 2 (`r2-check.jpg`, 22 exact frames at every changed spot).

### Layout
- [x] Headlines keep their zone (470–700 px); the chart is clipped to the stage band (722–1448 px) in every shot, so no candle, zone or pile reaches the headline zone or the source line.
- [x] In-world labels keep a fixed on-screen size and fade out before they leave the stage band; none crosses a headline, the stage index or the source line.
- [x] Nothing darkens or crops the chart to make room for text (taglines are small pills).
- [x] Opening title centred, rising in, no date/press tag; corner logo from frame 0 (21 Oct decision); the ground is dark throughout.

### Opening
- [x] Statement (0 s: 18 ISTILAH SMC, 1 CHART BITCOIN) over the real chart → the terms placed on their real spots (0.3–4.2 s) → the pile-up (4.1–6.9 s) → the five-stage index (6.8 s) → stage 1 (9.0 s). The anchor is the real Binance chart from frame 0 (asset level 3, rebuilt with identical values).
- [x] Opening motion restrained: a slow push on the whole chart; the hero dive waits for 37 s.
- [x] Data source credited on screen throughout; logged in `sources.md`.

### Demonstration and sound-off
- [x] Every term is shown where it happens on the real chart: the zigzag and its swing tags, the two break levels, the stop piles, the 1 Jul wick taking the nearest stops, the 9–14 Aug trap, the 16 Aug order block, the 19 Aug gap and its open state through 28 Oct, the July range halved, the 1 Aug bounce in discount.
- [x] Muted, the headlines carry the reading: 18 ISTILAH SMC, 1 CHART BITCOIN · 5 TAHAP · LOWER HIGH · LOWER LOW · HIGHER HIGH · HIGHER LOW · BOS = TEMBUS SEARAH TREND · CHoCH = TEMBUS LAWAN ARAH · LIQUIDITY = TUMPUKAN STOP · SELL SIDE / BUY SIDE · EQUAL HIGH = MAGNET · ITU SWEEP · INDUCEMENT = JEBAKAN KECIL · ORDER BLOCK · FVG = CELAH HARGA · MITIGATION · CELAH INI BELUM TERISI · EQUILIBRIUM = 50% · PREMIUM = MAHAL · DISCOUNT = MURAH · STRUKTUR → LIQUIDITY → SWEEP → ENTRY · CARA BACA, BUKAN JAMINAN.
- [x] Labels at the claim: CONTOH PEMBACAAN, BUKAN SINYAL (source line, throughout); ZONA STOP = PERKIRAAN (ILUSTRASI), BUKAN DATA ORDER (liquidity); TANDA AWAL, BUKAN KEPASTIAN (CHoCH); BACAAN KAMI · TIAP TRADER BISA BEDA (inducement); JALUR BALIK = ILUSTRASI and SERING DIISI, TAPI TIDAK SELALU (mitigation, open gap).
- [x] Real data throughout; the only illustrations (stop piles, the return path) are labelled.

### Evidence and editorial
- [x] Every date and price from the Binance candles (S9); definitions sourced as convention (S2–S7); the liquidity idea grounded in Osler 2003 (S1); the framework's edge not claimed (S8). No CTA beyond the 2 s brand outro; no buy/sell advice.

### Runtime and implementation
- [x] Duration from the audio (79.5 s narration) and the render (82.1 s file: 0.6 s hold + 2 s outro); inside the episode window (60–92 s).
- [x] ffprobe: 1080×1920, 30/1 fps, H.264 + AAC 48 kHz stereo, 82.1 s, 2,464 frames (last frame is the outro); −14.3 LUFS integrated, −1.1 dBTP, LRA 2.4 LU.
- [x] One continuous world; no cuts, no empty frames.
- [x] blackdetect: only the dark outro; freezedetect: holds on the July range while stage 5 is explained (61.5–71.4 s, the camera resting; labels and captions still change) and the static outro; silencedetect: only after the last word (79.5 s).
- [x] Numbers and labels checked against the candles and `research.md`.

### Visual and sound inspection
- [x] Encoded frames at every beat and every transition (before/mid/after); first 3 s and last 2 s checked frame by frame.
- [ ] Motion watched in a full render: **NOT REVIEWED** (frames only).
- [x] Sound measured, not heard: score 9.6–17.9 LU under the narration in every section (sidechain-ducked); cut to silence after the last word; effects on the on-screen event frames. **Not listened to**: Claude can't hear audio.
- [x] One dominant idea per beat (one term, one place on the chart); camera moves motivated (along the slide, push to each break, side angle for the piles, the dive into the sweep, three-quarter for the slab and gap, pull-back reveals, the final pull-back to the opening framing).
- [x] Polarity: one dark chart room by design (the chart must stay readable); the turns are marked by the stage index and camera angles.
- [x] Brand: Inter Tight / Inter / JetBrains Mono, brand blues with red/green only for meaning (down structure, stops, premium; up structure, discount), official logo bug and outro; all assets licensed or own work.

## Scores (1–5; any score below 4 → targeted revision and re-check)
| Hook | First 12 s | Real-world opening | Educational payoff | Reward ladder | Understanding | Hierarchy | Camera | Transitions | Rhythm | Brand | Factual accuracy |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 4 | 4 | 4 | 5 | 5 | 4 | 4 | 4 | 4 | 4 | 4 | 5 |

## Fixes completed and rechecked
1. Stills: zoomed shots pushed out-of-range candles into the headline zone → the chart is clipped to the stage band by two camera-space planes, and the price axis autoscales per shot.
2. Stills: labels were tiny in wide shots and huge in close shots → fixed on-screen size; they hide outside the stage.
3. Stills: the stop piles read as a red wall in the close-up → smaller cubes, three rows, and the sweep takes the two rows nearest the low with a white flash.
4. Stills: a dark box covered the replayed 1 Jul candle → the stored candle's instance is scaled away instead.
5. Stills: zone labels cut at the right edge; the order block lacked a highlight; the stage index was too small for a phone → moved, glow added, index enlarged.
6. Render 1: the pile of 18 labels showed for only 0.7 s → it now holds through "delapan belas istilahnya" and clears on "lima tahap".
7. Render 1: the HH/HL tags landed after the words → they land as they are said.
8. Added after render 1: the 20 Jul glow as the equal highs are run, and a pulse on the remaining stop piles when the payoff names "liquidity".

## Known limitations
- Motion not watched and audio not heard (frames and measurements only). Needs one full watch with sound, especially the Orus voice on the English terms (whisper heard "SMC" as "SMTI").
- The working voice is Google Orus; the ElevenLabs script is ready (`elevenlabs-script.md`) and a take re-times everything automatically (window up to 92 s).
- At 82 s the Reel is longer than the 35–60 s target for single-idea Reels: a glossary of 18 terms, and the user asked to recreate a 97.6 s reference.
- SMC readings are subjective; the inducement and the order-block choice are our reading (labelled). Stop piles are an illustration, not order data.
- Hook variant A (the viewer's own stop loss) was not built.

## Final verified artifact path
`output/kamus-smc.mp4` (render 2), 82.1 s, 2,464 frames, −14.3 LUFS.
