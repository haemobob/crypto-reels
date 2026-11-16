# QA report — bear-trap-2026

Retention audit result: PASS
Visual-quality audit result: PASS

## Part A — Retention audit (re-checked on the user's ElevenLabs take, 65.0 s, 16 Nov 2026; first pass on the Orus voice, 63.0 s)
- [x] 1. **Hook:** 0.1 s "Bitcoin jatuh dua puluh sembilan persen dari puncaknya. Banyak yang bilang: ini bear trap, kayak dua ribu dua puluh tiga." over the real chart with the −29% bracket.
- [x] 2. **Evidence by 5 s:** the real Binance chart from the first second.
- [x] 3. **First payoff by 8–12 s:** 7.8 s the definition, with the four parts on screen.
- [x] 4. **Reason to continue:** 2023's four parts (14.5–33 s: highs, break to $19,549, volume ×1.8, the 12 Mar backstop, back above support in 3 days, above the high in 7) → 2026's three (33.4–49 s: highs, break to $62,006, volume ×2.1, liquidations, ETF selling) → the missing fourth (49.2 s) → the levels (52.7 s, 58.0 s).
- [x] 5. **Concrete nouns:** two peaks, a broken floor, red volume bars, a question-mark box.
- [x] 6. **Cut test:** no sentence without a number or a step; the April 2023 +59% stays off (not needed for the test).
- [x] 7. **Promise/payoff:** "bear trap like 2023?" → three of four parts yes; the fourth decides; here are its two levels.
- [x] 8. **Truth test:** the reversal is never promised; the condition labelled BACAAN KAMI · BUKAN RAMALAN · BUKAN SARAN INVESTASI; the projected path labelled ILUSTRASI; 2023's catalyst sourced; 2026 flows sourced on screen.
- [x] 9. **Silent test:** the anatomy row ticks ✓ ✓ ✓ ✓ for 2023 and ✓ ✓ ✓ ? for 2026; headlines carry every number.
- [x] 10. **Share reason:** the friend saying "bear trap, beli!".

### Viewer-value gate
- [x] Understandable in 3 s · reason to care · early payoff (8.5 s) · every sentence adds a fact · mechanism shown on real data · no removable sentence · a two-level check to keep · delivers the promise · no CTA.

### Rejection gates
- [x] None triggered.

## Part B — Visual-quality audit

Checked on stills during the build (two rounds; fixes: headline line breaks; the 2026 price scale raised so the liquidation/ETF tags sit above the candles; the failure label moved above its line) and on the encoded MP4 (one frame per second `output/bear-trap-2026-review/r1-sheet.jpg`; 12 exact frames at the transitions `r2-tr.jpg`). Render 1 → 2: the opening chart held still 3.9–8.3 s → a slow 7% push-in toward the drop during the first line (restrained opening motion); no freeze left in the opening.

- [x] Layout: headlines in their zone; the anatomy row under the micro captions; candles 790–1260 and volume 1310–1420; every tag on its own pill clear of the candles; source line credits Binance, the 12 Mar 2023 statement and the 2026 flow sources at the moment they are used.
- [x] Opening: the real 2026 chart from the first second, the −29% bracket, the title; the 2023 chart by 8.5 s.
- [x] Demonstration: each part of the trap is drawn on real candles as it is named (rings, support, red breakdown and volume, the 12 Mar marker, green reversal, ✓ 13 MAR / ✓ 17 MAR); 2026 gets ✓ ✓ ✓ and a "?" box; the condition path labelled ILUSTRASI.
- [x] ffprobe (render 3, ElevenLabs take): 1080×1920, 30/1 fps, H.264 + AAC 48 kHz stereo, 67.7 s, 2,028 frames; −14.1 LUFS, −1.2 dBTP. One frame per beat checked on the encoded file (`r3-check.jpg`).
- [x] blackdetect: only the outro; freezedetect (2 s): short holds while a beat is explained (9.4, 22.7 s); silencedetect: only after the last word.
- [ ] Motion watched in a full render: **NOT REVIEWED** (frames only).
- [x] Sound measured, not heard. **Not listened to**: "bear trap" (heard as "bertrep"), "support", "ETF", "long".

## Scores
| Hook | First 12 s | Real-world opening | Educational payoff | Reward ladder | Understanding | Hierarchy | Camera | Transitions | Rhythm | Brand | Factual accuracy |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 5 | 4 | 5 | 4 | 5 | 5 | 4 | 4 | 4 | 4 | 4 | 5 |

## Known limitations
- Data to the 15 Nov 2026 close; the levels ($79,800 / $62,006) are what to watch from here, and the post ages quickly.
- Voice: the user's ElevenLabs take (16 Nov 2026), levelled only.

## Final verified artifact path
`output/bear-trap-2026.mp4` (render 3, ElevenLabs take, 16 Nov 2026), 67.7 s, 2,028 frames, −14.1 LUFS. Subtitles `episodes/bear-trap-2026/bear-trap-2026.srt`. Cover `output/bear-trap-2026-cover.png` / `.jpg`.
