# QA report — trader-1-persen

Both audits are done **before final rendering** (the user renders the final MP4). Update the two result lines; `npm run audit -- <id>` reads them and warns at render time while either is not PASS.

Retention audit result: PASS
Visual-quality audit result: PASS

## Part A — Retention audit (script on the Orus working voice, 30.9 s; times from captions.json)

### Script audit
- [x] 1. **Hook:** 0.4 s "Katanya, kalau nggak pernah nyerah, lo bakal jadi satu persen trader yang menang." The claim is the one the viewer knows; the picture (traders shooting hoops) states it without sound.
- [x] 2. **Evidence by 5 s:** 4.7 s "Ada yang ngecek": the study card (title, authors, data source).
- [x] 3. **First payoff by 8–12 s:** 9.6 s "Yang cuma sehari: hampir tiga puluh persen untung."
- [x] 4. **Reason to continue:** 1 day 29.8% (9.6 s) → 101–200 days ≈ 7% (13.0 s) → > 300 days 3% (17.6 s) → the pattern (20.4 s) → no learning (23.5 s) → the check (25.7 s).
- [x] 5. **Concrete nouns:** traders, hoops, balls that go in or don't, a falling bar chart.
- [x] 6. **Cut test:** no sentence repeats the headline; the 1.1% minimum-wage figure stays off to keep one idea.
- [x] 7. **Promise/payoff:** "never give up → the 1%" → the longer they kept going, the fewer were in profit → check net results first.
- [x] 8. **Truth test:** "katanya" / KLAIM VIRAL; the study named; "hampir" on rounded numbers (29.8 → "hampir tiga puluh", 6.8 → "hampir tujuh"); limits on screen (Brazil, index futures, 2013–2015, not crypto); the hoop shots labelled ILUSTRASI.
- [x] 9. **Silent test:** 1% YANG NGGAK NYERAH? · ADA YANG NGECEK · 1 HARI 29,8% · 101–200 HARI 6,8% · >300 HARI 3,0% · MAKIN LAMA, MAKIN SEDIKIT YANG UNTUNG · NGGAK ADA BUKTI MAKIN JAGO · SETELAH BIAYA: POSITIF?; verify on stills.
- [x] 10. **Share reason:** the friend paying for a "never give up" trading course.

### Viewer-value gate
- [x] Understandable in 3 s · reason to care · early payoff (9.6 s) · each beat adds a number · the pattern is shown on real data · no removable sentence · a check to keep · delivers the promise · no follow/save/share request.

### Retention ladder
0.4 the claim · 4.7 someone checked (19,646) · 9.6 1 day: 29.8% · 13.0 101–200 days: 6.8% · 17.6 > 300 days: 3.0% · 20.4 the pattern (six bars) · 23.5 no learning · 25.7 the check.

### Rejection gates
- [x] Unsupported consequence: NO · first frame lacks stake: NO · logo/3D-only opening: NO · nothing real by 3–8 s: NO (study card 4.7 s) · no return by 8–12 s: NO · padding: NO · disconnected diagrams: NO · ending doesn't answer the opening: NO.

## Part B — Visual-quality audit

Checked on stills during the build (two rounds; fixes: ball arcs flattened and lanes respaced so no arc crosses a label or the headline zone; the claim tag moved off the court's edge; the falling trend line moved clear of the bar labels; the end card simplified), then on the **encoded MP4**: two frames per second (`output/trader-1-persen-review/r1-sheet.jpg`) and 18 exact frames at every beat (`r2-check.jpg`). Render 1 → 2: the study card showed "0" for 1.5 s before counting → the count now starts as the card appears and lands on 19.646 with "dua puluh ribu".

### Layout
- [x] Headlines keep their zone (470–700 px); the claim tag sits between headline and court; the court, card, chart and scoreboard share the stage (760–1460); the source line below.
- [x] Ball arcs stay in their lane's band above its label and below the label of the lane above.
- [x] Nothing darkens the graphics for text; the spotlight is part of the court.
- [x] Opening title centred, rising in; corner logo from frame 0; dark ground throughout.

### Opening
- [x] Statement (1% YANG NGGAK NYERAH?) over the court (the claim's own picture) → the study card at 4.7 s (asset level 3: the real paper's title, authors, institution, data source) → the first number at 9.6 s.

### Demonstration and sound-off
- [x] The pattern is shown twice: lanes that score less and less (illustration, labelled) with the real percentages, then the real six-group bar chart.
- [x] Muted, the headlines carry it (Part A, 9). Labels at the claim: KLAIM VIRAL · ANGKANYA TANPA SUMBER; BOLA MASUK = ILUSTRASI · PERSENTASE = DATA STUDI; source line with study, data, years and BUKAN KRIPTO throughout the body.

### Evidence and editorial
- [x] Numbers from the study (S1–S3); limits on screen; no CTA, no advice beyond "check your net results".

### Runtime and implementation
- [x] Duration from the audio (30.9 s narration) and the render (33.6 s: 0.6 s hold + 2 s outro); inside the window (25–40 s).
- [x] ffprobe: 1080×1920, 30/1 fps, H.264 + AAC 48 kHz stereo, 33.6 s, 1,006 frames; −14.4 LUFS, −1.2 dBTP, LRA 2.0 LU.
- [x] blackdetect: only the outro (31.5 s on); freezedetect (2 s): the study card after the count (7.1–9.4 s, narration continues) and the scoreboard (26.7–29.8 s, the "?" pulses); silencedetect: only after the last word (31.0 s).

### Visual and sound inspection
- [x] Encoded frames at every beat; first 3 s and last 2 s checked.
- [ ] Motion watched in a full render: **NOT REVIEWED** (frames only); the shooting loop in particular should be watched once.
- [x] Sound measured, not heard: score ducked under the voice; chimes on lane 1's makes come from the same schedule as the picture. **Not listened to.**
- [x] Brand: Inter Tight / Inter / JetBrains Mono, navy and blue, green/red only for profit/loss shares; official logo bug and outro.

## Scores (1–5; any score below 4 → targeted revision and re-check)
| Hook | First 12 s | Real-world opening | Educational payoff | Reward ladder | Understanding | Hierarchy | Camera | Transitions | Rhythm | Brand | Factual accuracy |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 4 | 4 | 4 | 4 | 4 | 5 | 4 | 4 | 4 | 4 | 4 | 5 |

## Known limitations
- Motion not watched and audio not heard. Listen to "trader", "day trading", "futures" (respelled) and "Brasil" (whisper heard "berasil").
- The study is Brazil, index futures, 2013–2015: not crypto (on screen). It describes outcomes, not causes.
- The working voice is Google Orus; the ElevenLabs script is ready (`elevenlabs-script.md`).

## Final verified artifact path
`output/trader-1-persen.mp4` (render 2), 33.6 s, 1,006 frames, −14.4 LUFS. Subtitles: `episodes/trader-1-persen/trader-1-persen.srt`. Cover: `output/trader-1-persen-cover.png` / `.jpg` (1080×1920), `-cover-grid.jpg` (3:4 preview).
