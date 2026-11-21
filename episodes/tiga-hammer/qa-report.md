# QA report — tiga-hammer

Retention audit result: PASS
Visual-quality audit result: PASS

Render checked: `output/tiga-hammer.mp4`, 21 Nov 2026 (render 2, after the living-frame rework). Timings below are measured from `captions.json` (the user's ElevenLabs take, 58.72 s).

## Part A — Retention audit

### Script audit
- [x] **1. Hook:** "Tiga hammer Bitcoin. Di chart satu jam, bentuknya hampir *sama persis*." (0.05–4.4 s). Three real candles and three traders are on screen from frame 0, and the candles stack on "sama" (4.1 s).
- [x] **2. Evidence by 5 s:** the real Binance candles with dates (2 SEP / 17 JUL / 15 OKT, WIB), the source line from frame 0, and the stack "DITUMPUK: NYARIS SAMA" at 4.1 s.
- [x] **3. First payoff (8–12 s):** "Tapi di chart lima menit, *isinya beda total*" (7.8–10.4 s). A's real 12 five-minute bars replay from 9.3 s.
- [x] **4. Reason to continue:**
  - A (empty) → C (sweep but fails) → B (sweep + break): each inside adds one element of the check.
  - "Enam jam kemudian" answers "who was right?".
  - "Tapi ini bukan rumus" (39.9 s) overturns the easy conclusion.
  - The payoff says what the read is good for.
- [x] **5. Concrete nouns:** traders, candles, a line of stop orders that gets taken, a gate that breaks, one person per 5 minutes, 28 hammers on a calendar.
- [x] **6. Cut test:** no repeated headline, no empty question, no history detour. The original's CTA and its "pick one" question are dropped.
- [x] **7. Promise/payoff:**
  - Opening: "same shape, different insides".
  - Ending: what the inside tells you (who took control, not the direction) and how to use it (the swept low is your invalidation).
- [x] **8. Truth test:**
  - The 5/8 vs 13/20 count is labelled "BUKAN RUMUS", "BEDANYA TIPIS", "DEFINISI & HITUNGAN CRYPTONITE · SAMPEL KECIL".
  - The hypothetical break of the swept low is labelled "SIMULASI".
  - "BUKAN SARAN INVESTASI" sits in the source line throughout.
- [x] **9. Silent test:**
  - Frame 0: three labelled candles, three traders and the first sentence (the sentence track shows it before it is spoken).
  - Muted inside beats: the bars replay, the stop dots fall when the low is swept, the gate turns blue when broken, and the pills name each finding.
- [x] **10. Share reason:** a trading friend who "always buys hammers".

### Viewer-value gate
- [x] Opening understandable within three seconds
- [x] The audience has a reason to care
- [x] A meaningful early payoff (8–11 s)
- [x] Each section contributes new information
- [x] The central mechanism is explained clearly (sweep + lower-high break, shown on real bars)
- [x] No sentence can be removed without reducing understanding
- [x] The final insight is worth remembering: a two-question check plus an invalidation rule
- [x] The viewer gets what was promised
- [x] No follow/save/share request; the payoff is the last content beat

### Retention ladder (measured)
| Time | Reward |
|---|---|
| 4.1 s | the candles stack: really the same |
| 9.3–13.6 s | inside A: a slide, then a late bounce |
| 15.1 / 17.0 / 18.7 s | not swept / no structure broken / empty inside (the H1 outline over its bars) |
| 21.3 s | C's old low swept (stop dots fall) |
| 22.8 s | C fails at the gate |
| 26.1 s | B sweeps the equal lows |
| 27.6 s | B breaks the gate |
| 29.9 s | CHoCH |
| 34.1–39.1 s | six hours later, one trader at a time |
| 41.4–43.9 s | 28 hammers placed on their dates |
| 45.3 / 47.3 s | 5/8 vs 13/20 |
| 51.2 s | "kendali" |
| 52.0 s | "not the direction" (fork) |
| 54.8 s | the red line |
| 56.7 s | SIMULASI break |
| 58.1 s | batal |

- [x] Specific bridges only; no generic ones.
- [x] No second intro.
- [x] The caveat ("bukan rumus") sits at the claim.
- [x] The final frame loops back to the opening shot.

### Rejection gates (all NO)
- [x] Hook supported
- [x] First frame has a subject and stakes
- [x] Not a logo or meaningless 3D opening
- [x] Real data from frame 0
- [x] Proof and return by 8–12 s
- [x] No padding
- [x] A causal story, not a deck
- [x] The ending answers the opening

## Part B — Visual-quality audit

### Layout
- [x] **No text over graphics:**
  - pills sit in clear space under the charts;
  - right-margin labels sit beside the lines;
  - the sentence track sits in its own zone (y ≈ 380–500).
  - Checked on stills across every beat and on the seam sheet from the render.
- [x] Nothing darkens or covers the graphics.
- [x] Opening: the first sentence is centred in the top zone; no logo intro.

### Opening
- [x] **Order (statement → real anchor → designed diagram):**
  - the statement is the sentence track;
  - the real candles (Binance) are the anchor;
  - the zoom into A's real 5m bars is the designed diagram.
- [x] **Asset hierarchy:** real charts (level 3). No photo or logo is relevant; the candles are the subject.
- [x] Opening motion: the candles replay their real hour, the camera drifts, the candles stack on "sama".
- [x] Sources in `sources.md`.

### Demonstration and sound-off
- [x] **Every graphic demonstrates the spoken mechanism:** each candle replays on the words that describe it (A's low at "balik", C's flush at "disapu", B's breakout at "tembus").
- [x] Understandable muted (see A9).
- [x] **SIMULASI** is on the hypothetical break in the payoff.
- [x] **Real data:** the stop-order dots and the one-actor-per-5-minutes rows are labelled metaphors in `sources.md`. Their positions and colours come from the real data.

### Evidence and editorial
- [x] All claims sourced, with dates checked (S1–S6).
- [x] Conditional claims visibly conditional ("kalau…", SIMULASI).
- [x] No CTA.

### Runtime and implementation
- [x] **ffprobe:** 1080×1920, 30 fps, H.264 + AAC, 61.9 s (58.7 s voice + 1.1 s tail + 2 s outro), within the 45–72 s window.
- [x] **Loudness:** −14.1 LUFS integrated, LRA 2.7 LU (two-pass loudnorm in `npm run render`).
- [x] No missing assets, gaps or audio tails (render validated).
- [x] Safe zones checked at every camera key: content stays in y 520–1510 and x 90–990, except context bars that the push carries off the left edge on purpose.
- [x] Numbers verified against `candles.json` and `hammers-btc.json` (28 / 8 / 5 / 13).

### Visual and sound inspection
- [x] **Stills checked:**
  - 40 beat stills (five sheets);
  - the seam sheet from the MP4 (before/mid/after for all 7 seams);
  - first 3 s and last 2 s.
- [x] **Pace** (`npm run pace -- tiga-hammer`, relative event detector of 21 Nov 2026):
  - still time **6.6%** (≤ 25%) ✔ (the first build measured 74.1%);
  - longest still **0.93 s** (≤ 1.5 s) ✔; no still stretch over 1.5 s;
  - first change **0.07 s** ✔;
  - visual events **15.5/min**, median gap **2.77 s** ✖ (target ≤ 2.5 s), max **8.3 s** ✖ (target ≤ 4 s).
  - The long gaps are the candle replays (9–15 s, 25–32 s): continuous motion without a discrete landing, not freezes. Hitting the target would take punch-in zooms on words, which the rules forbid. Same level as the user's pictogram reference TikTok A (median 2.7 s, max 27.5 s).
  - Thesis hold: "Tapi ini bukan rumus" (39.9–41.0 s, the axis drawing on a near-empty frame), 1.1 s.
- [x] **Living frame:**
  - the camera travels on a spline in every stage;
  - subjects act on their words;
  - 5 seam kinds (zoom through, whip, blur swap, dip + flood, push).
- [ ] **Motion watched in a full render: NOT REVIEWED.** Motion was judged from stills, the seam sheet and the pace measurement; no one has watched the MP4 in real time.
- [x] Sound on events (`audio-map.md`); the voice leads, the score is ducked.
- [x] Single dominant visual concept per beat.
- [x] **Camera motivated:** it follows the price head during replays, leans to each trader as they're named, follows the playhead, and pushes toward the swept low and the SIMULASI path.
- [x] **Polarity:** black throughout (pictogram style); the blue flood marks the twist.
- [x] Brand: blue as the only accent, house fonts, official logo bug and outro.

## Scores (1–5)
| Hook | First 12 s | Real-world opening | Educational payoff | Reward ladder | Understanding | Hierarchy | Camera | Transitions | Rhythm | Brand | Factual accuracy |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 5 | 5 | 4 | 5 | 5 | 4 | 4 | 4 | 4 | 4 | 5 | 5 |

## Known limitations
- **Pronunciation:** whisper heard "chart" as "car" both times (≈ 2.3 s and 8.3 s). The user should check it by ear.
- **Pace:** the events target is a near miss (see Part B).
- **Motion not watched:** motion was not watched in real time (see Part B).
- **A/B hook:** the variant (problem hook) was not built.
- **Twist intro:** 39.9–41.0 s is sparse while "Tapi ini bukan rumus" is spoken (a deliberate thesis beat).

## Fixes completed and rechecked
- **Render 1:** 74% still. Render 2 adds:
  - the camera spline (`cameraSpline` in `src/lib/camera.ts`);
  - candle replays from the real 5m path;
  - the next-6-hours charts;
  - the 28-hammer timeline and sort;
  - the fork and SIMULASI path in the payoff.
- Result: 6.6% still.
- A's notes were moved under the hour box so the push into it keeps them on screen.
- The reference embed page was replaced by its caption text (`evidence/reference-caption.txt`).

## Final verified artifact path
`output/tiga-hammer.mp4` (render 2); cover: `output/tiga-hammer-cover.jpg`; subtitles: `episodes/tiga-hammer/tiga-hammer.srt`.
