# QA report — bentuk-volume

Retention audit result: PASS
Visual-quality audit result: PASS

## Part A — Retention audit (script, on the working Orus voice, 60.4 s, 17 Nov 2026)
- [x] 1. **Hook:** 0.5 s. "Bitcoin mantul lima persen dari enam puluh dua ribu. Kelihatannya pembeli sudah balik. Tapi bentuk volumenya bilang lain." The title reads "MANTUL 5%. PEMBELI BALIK?".
- [x] 2. **Evidence by 5 s:** the real Binance 5-minute chart of 15 Nov is drawn by 2.3 s, with the $62,006 low ringed at 1.7 s.
- [x] 3. **First payoff by 8–12 s:** 7.2 s "bentuk P"; 10.9 s open interest fell, a sign of shorts closing.
- [x] 4. **Reason to continue:** the P answer (7–15 s) → the key, fat vs thin (15.8 s) → b on 12 Nov and what followed (23.4 s) → long and thin on 14 Nov and its broken low (31.0 s) → how to use the P, and it held (39.3 s) → D yesterday (46.9 s) → today's limits (50.4 s) → takeaway (55.6 s).
- [x] 5. **Concrete nouns:** a price line, bars of volume, fat and thin, a letter shape, a falling line of open positions.
- [x] 6. **Cut test:** every sentence carries a number, a shape or a check. Left out of the reference: the "order flow / entry" segment, which would need order-flow data we don't have, and the "comment MAP" CTA.
- [x] 7. **Promise/payoff:** "are buyers back? the volume says otherwise" → P with falling open interest (shorts closing) → the four shapes → today's limits → "not a signal, but it tells you who's in control and where the limit is".
- [x] 8. **Truth test:**
  - The OI reading is "tanda" (a sign) and named "di OKX" (one exchange).
  - The shapes are readings; the end says "bukan sinyal" (not a signal).
  - Every date is UTC, data runs to 17 Nov.
  - The final frame says "BACAAN, BUKAN SINYAL · BUKAN SARAN INVESTASI".
  - We don't call 12 Nov "long liquidation": OKX OI rose that day.
- [x] 9. **Silent test:** the headlines carry the shape, the date and the reading. The profiles, letters, bands, rings and the OI line show the relationship without sound.
- [x] 10. **Share reason:** the friend about to buy the bounce.

### Viewer-value gate
- [x] Understandable in 3 s.
- [x] A reason to care.
- [x] Early payoff (7–11 s).
- [x] Each section adds a fact.
- [x] Mechanism shown on real data.
- [x] No removable sentence.
- [x] A check to keep (fat/thin, who's in control, where the limit is).
- [x] Delivers the promise.
- [x] No CTA.

### Rejection gates
- [x] None triggered.

### Re-check on the user's ElevenLabs take (68.2 s, 19 Nov 2026)
- Hook at 0.1 s.
- Real chart by 2 s, $62K ring at 2.1 s.
- First answer: P at 8.2 s, open interest at 12.4 s.
- Takeaway at 62.4 s.
- The final frame answers the opening: "are buyers back?" → the shape shows who's in control and where the limit is; the 18 Nov break shows it isn't a signal.
- **Truth update:** the thin area broke on 18 Nov, after the take was recorded. It is shown on screen during the takeaway: "BENTUK ≠ SINYAL: 18 NOV, AREA TIPIS JEBOL", the red 18 Nov line, "18 NOV: JEBOL → $62.063" and "DATA S/D TUTUP 18 NOV 2026". So the Reel doesn't imply the level held.

## Part B — Visual-quality audit

**Stills during the build (two rounds).** Fixes:
- "bentuk b" was uppercased to "B" by the headline style; it is now kept lowercase.
- Headline sizes reduced so none wraps to a third line.
- "+5,4%" leaves before the profile grows.
- "JEBOL" and "LOW 16 NOV" pills moved clear of the day labels and the band.
- Shape letters fade when their day is outside the frame.
- Start and end values added to the open-interest panel.
- The 13 Nov pill appears within its short beat.
- After the 18 Nov revision: 17 Nov added as its own beat, the "today" column removed, and 18 Nov added to the pull-back.

**Encoded MP4, render 1** (ElevenLabs take):
- One frame per second: `output/bentuk-volume-review/r1-sheet.jpg`.
- 24 exact frames at every cue and transition: `r1-tr.jpg`.
- The takeaway at full resolution: `r1-pay-full.jpg`.
- Render 1 → 2: a 4.5 s hold on 12 Nov (28.9–33.3 s) is broken by splitting the headline. "12 NOV: BENTUK b / VOLUME DI BAWAH" shows, then "PENJUAL PEGANG KENDALI" on the word "Penjual" (31.4 s).

- [x] **Layout:**
  - micro captions at y ≈ 384;
  - headlines centred at 590;
  - chart 780–1280, day labels at 1310;
  - open-interest panel 1330–1480 (only in its beat);
  - source line at 1534;
  - pills sit on clear ground. Bands are in-world annotations at 16% opacity, not scrims.
- [x] **Opening:** the title and the empty 15 Nov chart frame at frame 0; the real line is drawn by 2 s.
- [x] **Demonstration:**
  - every profile grows from its POC;
  - letters land on the shape's name;
  - bands on "Gemuk" and "Tipis";
  - 13 Nov in red on "turun lagi";
  - the break line on "jebol";
  - the 17 Nov ring on its number;
  - the close on "ditutup";
  - 18 Nov drawn in red as the frame pulls back.
- [x] **Camera:** data-space moves, each landing on the day the narration names (skills override: continuous camera allowed). One hero pull-back at the takeaway.
- [x] **ffprobe (render 1):** 1080×1920, 30/1 fps, H.264 + AAC 48 kHz stereo, 70.9 s, 2,124 frames; −14.2 LUFS, −1.3 dBTP.
- [x] **blackdetect:** only the outro (68.8–70.8 s).
- [x] **silencedetect:** only after the last word (68.3 s).
- [x] **freezedetect (2 s):**
  - Holds of 2.4–2.8 s on key frames, with the micro captions moving.
  - The 4.5 s hold on 12 Nov is fixed in render 2.
- [ ] **Motion watched in a full render:** **NOT REVIEWED** (frames only).
- [x] **Sound:** measured, not heard. **Not listened to:** "open interest", "OKX", "short", "low-nya", and the letters P / b / D.

## Scores
| Hook | First 12 s | Real-world opening | Educational payoff | Reward ladder | Understanding | Hierarchy | Camera | Transitions | Rhythm | Brand | Factual accuracy |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 5 | 4 | 5 | 5 | 5 | 4 | 4 | 4 | 4 | 4 | 4 | 5 |

## Known limitations
- The voice ends the story at 17 Nov; 18 Nov is on screen only. A narrated line would need a new take.
- One exchange's open interest (OKX). Binance's and Bybit's futures data are geo-restricted from the build environment.
- Volume profiles are our approximation from 5-minute candles. Tick-based profiles can differ slightly.
- The post ages quickly. The data runs to the 18 Nov close.

## Final verified artifact path
`output/bentuk-volume.mp4` (render 2, the user's ElevenLabs take, 19 Nov 2026): 70.9 s, 2,124 frames, 1080×1920, 30 fps, H.264 + AAC, −14.2 LUFS, −1.3 dBTP.
- **freezedetect:** longest hold 2.8 s.
- **Re-keyed beat:** checked on 12 exact frames of the encoded file (`output/bentuk-volume-review/r2-check.jpg`).
- **Subtitles:** `episodes/bentuk-volume/bentuk-volume.srt` (33 cues).
- **Cover:** `output/bentuk-volume-cover.png` / `.jpg`, plus the grid crop `-cover-grid.jpg`.
