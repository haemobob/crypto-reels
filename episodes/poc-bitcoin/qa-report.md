# QA report — poc-bitcoin

Retention audit result: PASS
Visual-quality audit result: PASS

## Part A — Retention audit (re-checked on the user's ElevenLabs take, 66.1 s, 17 Nov 2026; first pass on the Orus voice, 59.9 s)
- [x] 1. **Hook:** 0.1 s. "Rally terakhir Bitcoin berhenti di delapan puluh tujuh ribu. Lalu jatuhnya berhenti di enam puluh dua ribu." The title reads "BITCOIN BERHENTI DI $87 RB & $62 RB. KEBETULAN?".
- [x] 2. **Evidence by 5 s:** the real Binance chart from 0.1 s, with rings on the actual high (2.8 s) and low (5.9 s).
- [x] 3. **First payoff by 8–12 s:** at 9.3 s, the definition of a point of control, with the summer profile growing on real volume.
- [x] 4. **Reason to continue:** definition (9.3 s) → level 1 (15.4 s) → level 2 (22.6 s) → the rally stops under level 2 (33.7 s) → the drop stops at level 1 (42.5 s) → why (47.8 s) → what to watch (53.5 s) → the next level (60.1 s).
- [x] 5. **Concrete nouns:** a price line, bars of volume, two gold lines, rings where price turned.
- [x] 6. **Cut test:** every sentence carries a number or a step. Left out: the Elliott-wave count, "biggest rally of the year" (false: January was higher), and "follow me".
- [x] 7. **Promise/payoff:** "coincidence?" → no: both turns sit at volume levels → watch those two levels.
- [x] 8. **Truth test:**
  - The low is "sejauh ini" (one day old, dated "15 NOV" on screen).
  - Both POCs are marked "≈" and narrated as "sekitar".
  - The method is stated on screen; "sering bereaksi" (often reacts) rather than "always".
  - The closing frame says "BACAAN KAMI, BUKAN RAMALAN · BUKAN SARAN INVESTASI".
- [x] 9. **Silent test:** headlines carry every number. The profile, gold line, rings and coloured paths show the relationship without sound.
- [x] 10. **Share reason:** the friend asking "BTC lanjut turun nggak?".

### Viewer-value gate
- [x] Understandable in 3 s.
- [x] A reason to care.
- [x] Early payoff (9.3 s).
- [x] Each section adds a fact.
- [x] Mechanism shown on real data.
- [x] No removable sentence.
- [x] Three numbers to keep.
- [x] Delivers the promise.
- [x] No CTA.

### Rejection gates
- [x] None triggered.

## Part B — Visual-quality audit

**Stills during the build (three rounds).** Fixes:
- The chart enlarged.
- The data-space reframe added so the rally, drop and both levels read at phone size.
- The summer profile now builds on the definition beat (9 s) rather than afterwards.
- The hook rings step back during the explanation, so the summer POC pill and the $62K ring never collide.
- The summer POC pill moves left in the reframed view.
- "+36%" moved off the green line.
- Price labels haloed above the line.
- At the payoff, the callouts fade to zero (no ghost boxes).
- The source line fits on one line.

**Encoded MP4, render 1.** One frame per second: `output/poc-bitcoin-review/r1-sheet.jpg`. 26 exact frames at the transitions: `r1-tr.jpg`. Full-resolution 0 s, 3 s, 43.5 s, 59.9 s: `r1-full.jpg`. Render 1 → 2: "−29%…" was on screen for only 1.2 s. The "…BERHENTI DI POC BAWAH" beat (headline, ring, SFX) is now keyed to the spoken "berhenti" (38.3 s), and the close-above pill to "tutup" (40.7 s).

- [x] **Layout:**
  - micro captions at y ≈ 384;
  - headlines in their zone (centred at 590);
  - chart 790–1390 with month labels at 1418;
  - source line at 1534;
  - every pill on clear ground.
  - At the busiest frame (43.5 s) there are eight labels and no overlaps.
- [x] **Opening:** the title and the empty chart frame at frame 0; the real line is drawn by 2 s; rings on the real high and low as they are spoken.
- [x] **Demonstration:**
  - each profile grows from its POC bar;
  - the gold POC line extends as the level is named;
  - green and red paths draw as the moves are narrated;
  - the two reactions are ringed at the moment of the claim;
  - the July-low line arrives with "jebol".
- [x] **Camera:** one motivated move, the reframe at "Agustus" (27.8 s, 40 frames), connecting the rally to both levels. Otherwise locked.
- [x] **ffprobe (render 1):** 1080×1920, 30/1 fps, H.264 + AAC 48 kHz stereo, 62.6 s; −14.2 LUFS, −1.2 dBTP.
- [x] **blackdetect:** only the outro (60.5–62.5 s).
- [x] **silencedetect:** only after the last word (59.99 s).
- [x] **freezedetect (2 s):** holds of 2.3–2.9 s on the stop, the hold and the payoff, where the micro captions keep moving.
- [ ] **Motion watched in a full render:** **NOT REVIEWED** (frames only).
- [x] **Sound:** measured, not heard. **Not listened to:** "point of control" (poin of kontrol), "rally" (reli), "low Juli".

## Scores
| Hook | First 12 s | Real-world opening | Educational payoff | Reward ladder | Understanding | Hierarchy | Camera | Transitions | Rhythm | Brand | Factual accuracy |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 5 | 4 | 5 | 4 | 5 | 5 | 4 | 5 | 4 | 4 | 4 | 5 |

## Known limitations
- The data runs to the 15 Nov 2026 close. The $62K low is one day old ("sejauh ini" in the voice, "15 NOV" on screen), and the post ages quickly.
- The volume profile is our approximation from hourly candles. Tick-based profiles may differ by a few hundred dollars, so it is shown as "≈" and narrated as "sekitar".
- Voice: the Orus working voice. The ElevenLabs script is in `elevenlabs-script.md`.

## Final verified artifact path
`output/poc-bitcoin.mp4` (render 2, Orus voice, 16 Nov 2026): 62.6 s, 1,875 frames, 1080×1920, 30 fps, H.264 + AAC, −14.2 LUFS, −1.1 dBTP.
- Render 2 changed only the hold beat's timing. It was checked on 12 exact frames of the encoded file (`output/poc-bitcoin-review/r2-check.jpg`).
- Subtitles: `episodes/poc-bitcoin/poc-bitcoin.srt` (33 cues).
- Cover: `output/poc-bitcoin-cover.png` / `.jpg`, plus the grid crop `-cover-grid.jpg`.
