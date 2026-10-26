# QA report — jpmorgan-bitcoin

Both audits are done **before final rendering** (the user renders the final MP4). Update the two result lines; `npm run audit -- <id>` reads them and warns at render time while either is not PASS.

Retention audit result: PASS
Visual-quality audit result: PASS

## Part A — Retention audit (script on the user's ElevenLabs take, Ongky Himawan, 68.4 s; times from captions.json. First passed on the Orus working voice at 61.9 s)

### Script audit
- [x] 1. **Hook:** 0.1 s "Bos JPMorgan dulu nyebut Bitcoin penipuan." → 3.7 s "Sekarang, JPMorgan justru memproyeksikan Bitcoin ngalahin saham dan emas." The stake (is Bitcoin now the better bet than stocks and gold?) is clear by 3.7 s.
- [x] 2. **Evidence by 5 s:** the real 2027 LTCMA cover (J.P. Morgan Asset Management, 19 Oct 2026) from 3.7 s; Dimon's 2017 quote credited from frame 0.
- [x] 3. **First payoff by 8–12 s:** 11.4 s "sepuluh persen per tahun", 13.1 s "Saham Amerika, tujuh koma lima", 15.4 s "Emas, lima koma lima".
- [x] 4. **Reason to continue:** numbers (11.4 s) → "angka kedua yang jarang dibahas: lima puluh lima persen" (17.4 s) → what it means (21.9 s) → why it eats returns (25.5 s) → 20.9% vs 10% (32.0 s) → the rupiah range (37.5 s) → real proof (46.6 s) → JPMorgan's own caution (54.4 s) → the check (58.3–68.4 s).
- [x] 5. **Concrete nouns:** podium, rollercoaster track, a stack of 100 coins halving, Rp10 juta, a price chart; "volatilitas" is defined in plain words at 21.9 s.
- [x] 6. **Cut test:** the first draft (76 s) lost "Di laporan proyeksi jangka panjangnya", "di proyeksi itu", "Dan ini", "Turun lebih dari separuh"; nothing repeats the headline.
- [x] 7. **Promise/payoff:** "ngalahin saham dan emas?" → yes on return, at the price of 55% volatility; ends on the viewer's own check.
- [x] 8. **Truth test:** "memproyeksikan" (projects), not "memastikan"; on screen PROYEKSI · BUKAN JAMINAN at the numbers; scenarios and Rp outcomes labelled SIMULASI and attributed; the −50%/+50% example labelled ILUSTRASI; JPMorgan's own refusal to allocate is stated.
- [x] 9. **Silent test:** headlines carry each turn (DULU "PENIPUAN". SEKARANG JUARA? · 10% / 7,5% / 5,5% · 55% = VOLATILITAS · −50% +50% = −25% · 20,9% → 10% · RP48 JT ATAU RP3,6 JT · $126K → $58K · BELUM MASUK PORTOFOLIO · RETURN = HADIAH, VOLATILITAS = HARGA TIKET); verify on stills in Part B.
- [x] 10. **Share reason:** the friend who forwards "JPMorgan: Bitcoin beats gold" as a reason to go all in, or the one who only buys gold.

### Viewer-value gate
- [x] Understandable in 3 s · reason to care · early payoff (11.4 s) · each section adds information · mechanism explained (drag, 25.5–37.5 s) · no removable sentence · insight worth keeping (hadiah vs harga tiket + self-check) · delivers the promise · no follow/save/share request.

### Retention ladder
0.1 contradiction · 3.7 the forecast · 8.6 first time · 11.4 / 13.1 / 15.4 the three numbers · 17.4 the second number (55 spoken at 20.1) · 21.9 definition · 25.5 swings eat returns · 27.5–30.1 −50 +50 = −25 · 32.0 / 34.9 20.9% → 10% · 37.5–43.3 Rp48 jt or Rp3,6 jt · 46.6 / 51.9 $126K → $58K · 54.4 JPMorgan keeps it out · 58.3 / 61.0 hadiah / harga tiket · 63.7 the check.

### Rejection gates
- [x] Unsupported consequence: NO · first frame lacks stake: NO · logo/3D-only opening: NO (real quote from frame 0, real report from 3.7 s) · nothing real by 3–8 s: NO · no return by 8–12 s: NO (11.4 s) · padding: NO · disconnected diagrams: NO (one podium world carries numbers → tracks → drag → 20.9%→10%) · ending doesn't answer the opening: NO.

## Part B — Visual-quality audit

Checked on stills across every beat during the build, then on the **encoded MP4**. Render 1: one frame per second (65 frames, `output/jpmorgan-bitcoin-review/sheet*.jpg`), about 100 exact frames before/mid/after every boundary in `transition-map.md` (`tr*.jpg`, extracted by frame index), and full-resolution frames at every problem spot. Eight problems found there were fixed (below), re-checked on stills, and checked again on the encoded render 2 (new 1 fps sheets `r2-sheet*.jpg` and 65 transition frames `r2-tr.jpg`). Render 2 showed one leftover (the fan's year marks on the source line, 36.8–39.2 s); the source was corrected and frames 1050–1190, rendered from the corrected source, were spliced into the MP4 (video re-encoded at CRF 16; PSNR 49–58 dB, mean 55.6 dB against render 2 on every frame outside the splice and 52–55 dB at the splice edges, so no colour step; audio stream copied untouched). The spliced frames were checked (`sp-check.jpg`).

### Layout
- [x] Headlines keep their zone (470–700 px); 3D subjects framed into the stage (y ≈ 720–1450) with view offsets; the report stays between the headline and the source line while it is shown whole.
- [x] Source lines sit only on clear ground. Where the 3D fills the bottom of the frame (the report push, the crane over the podium, the rides from behind), the credit moves to the top tag (J.P. MORGAN ASSET MANAGEMENT · LTCMA 2027; JALUR = ILUSTRASI · VOLATILITAS: JPMAM VIA DECRYPT/YAHOO) and the source line is off.
- [x] 3D labels never cross a headline or tagline: the volatility figures hang over each step below the tagline; the ghost-step labels are two short lines inside the right safe edge; the vol labels are gone before the camera flies to the stack; the lost coins slide sideways and sink instead of rising through the captions.
- [x] Nothing darkens or crops a graphic to make room for text (taglines are small pills).
- [x] Source image shown whole first: the LTCMA cover whole and readable (3.0–7.7 s) before the push to its title.
- [x] Opening title centred, rising in, no date/press tag; corner logo from frame 0 (21 Oct decision), hidden on the off-white chart chapter (42.5–50.1 s).

### Opening
- [x] Statement (0 s: DULU "PENIPUAN". SEKARANG JUARA?) with the credited 2017 quote → real anchor (the LTCMA cover, 3.0 s) → designed podium with the report's numbers (10.2 s) → the abstract rides (15.9 s). The coin at 0–3 s is a realistic render of the public-domain ₿ (asset level 4) carrying the real, credited quote; the real document is on screen at 3.0 s.
- [x] Opening motion restrained: a slow push on the coin, the stamp, a hard cut, a documentary push on the report. The hero move waits for 15.9 s.
- [x] Real assets logged in `sources.md` with origin, date and basis; the cover is unaltered and credited; no publisher masthead imitated; the J.P. Morgan wordmark appears only on the report's own cover.

### Demonstration and sound-off
- [x] Every world demonstrates its line: the podium heights are the forecasts; the rides are the volatility; the stack shows −50% then +50% = −25%; the ghost step evaporates from 20.9% to 10%; the fan compounds Rp10 juta at the three rates; the real candles show the halving; the 60/40 ring keeps the coin outside.
- [x] Muted, the headlines carry the argument: DULU "PENIPUAN". SEKARANG JUARA? · PERTAMA KALI ADA BITCOIN · PROYEKSI RETURN PER TAHUN (10% / 7,5% / 5,5%) · ANGKA KEDUA: 55% · 55% = VOLATILITAS · NAIK-TURUN MAKAN HASIL · −50% LALU +50% = −25% · RATA-RATA: 20,9% PER TAHUN · YANG TERSISA: 10% · RP10 JUTA, 10 TAHUN… · RP48 JT ATAU RP3,6 JT · INI BUKAN TEORI · $126K → $58K · JPMORGAN SENDIRI: BELUM MASUK PORTOFOLIO · RETURN = HADIAHNYA / VOLATILITAS = HARGA TIKETNYA · KALAU TURUN SETENGAH, LO KUAT NAHAN?
- [x] Labels at the claim: PROYEKSI JPMORGAN and "10–15 TAHUN KE DEPAN · DALAM USD · BUKAN JAMINAN" on the numbers; JALUR = ILUSTRASI on the rides; ILUSTRASI on the stack and the ring; SIMULASI and "TANPA PAJAK, BIAYA & KURS" on the fan; the real chart is labelled as Binance data with dates.
- [x] Real data where it exists: the LTCMA cover, the report's numbers (rebuilt with identical values), Binance weekly candles.

### Evidence and editorial
- [x] All claims sourced (S1–S9), event and checked dates recorded; conditional claims visibly conditional; no CTA beyond the 2 s brand outro; no buy/sell advice.

### Runtime and implementation
- [x] Duration from the audio (61.9 s narration) and the render (64.5 s file: 0.6 s hold + 2 s outro); inside the episode window (45–62 s of narration).
- [x] ffprobe: 1080×1920, 30/1 fps, H.264 High (yuvj420p) + AAC 48 kHz stereo, 64.5 s, 1,934 frames; −14.1 LUFS integrated, −1.3 dBTP, LRA 1.8 LU.
- [x] No missing assets; each next 3D world mounts two frames early underneath the current one, so every cut lands on its cue with the assets loaded (fan at 35.0 s, ring at 50.1 s, arena at 54.1 s); no empty frame at any cut.
- [x] blackdetect: only the dark outro and two frames at 39.9 s that are the headline handover on the dark fan (lines and labels visible, checked); freezedetect: the deliberate holds on the finished real chart (44.2–47.2 s, 47.8–49.9 s; captions still change) and the static outro; silencedetect: only after the last word.
- [x] Numbers and labels verified against S1–S9 and the arithmetic in `script.md` (10 / 7,5 / 5,5; 55 / ±18 / ±17; 20,9 → 10; 48,1 / 25,9 / 3,6 jt; $126,2K / $57,8K / −54%; 60/40).

### Visual and sound inspection
- [x] Encoded frames at every beat and every transition (before/mid/after); first 3 s and last 2 s checked frame by frame.
- [ ] Motion watched in a full render: **NOT REVIEWED** (frames only).
- [x] Sound measured, not heard: score 9–20 LU under the narration in every section (sidechain-ducked); cut to silence after the last word; effects placed on the on-screen event frames. **Not listened to**: Claude can't hear audio.
- [x] One dominant visual per beat; camera moves motivated (push on the report, crane over the podium + reverse-angle cut as the hero move, flights between objects in one arena, dolly-out on the fan, callback to the reverse angle).
- [x] Polarity: one dark arena → off-white only for the real-data proof (42.5–50.1 s) → dark again for the model and the payoff.
- [x] Brand: Inter Tight / Inter / JetBrains Mono, brand blues with red/green only for meaning, official logo bug and outro; all assets licensed or own work (`sources.md`).

## Scores (1–5; any score below 4 → targeted revision and re-check)
| Hook | First 12 s | Real-world opening | Educational payoff | Reward ladder | Understanding | Hierarchy | Camera | Transitions | Rhythm | Brand | Factual accuracy |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 4 | 4 | 4 | 5 | 5 | 4 | 4 | 4 | 4 | 4 | 4 | 5 |

## Fixes completed and rechecked (from the render-1 frame review)
1. 7.7–10.2 s: the source line sat on the zoomed report, and at 7.6 s the whole report touched it. The whole view is framed higher and smaller (701–1489 px); during the push the credit moves to the top tag.
2. 16–23 s: the source line crossed the podium during the crane and the tracks from behind. The credit moves to the top tag for that section.
3. 20–23 s: "VOLATILITAS 55%" hid behind the tagline, and at 23.0 s crossed the headline in the camera flight. The figures (± 55%, ± 18%, ± 17%) now hang over each step, and fade before the flight.
4. 25.5–26.3 s: the lost coins flew up through the captions and the headline. They now slide off sideways and sink.
5. 30.3–35 s: "RATA-RATA 20,9%" was cut at the right edge and "TERSISA 10%" sat in the side safe zone. Both are two short lines.
6. 30.3 s: the stack's column crossed the new source line during the camera move. The source line now waits until the move ends.
7. 3.0 s: the FRAUD stamp tore across the report for 8 frames, and the report faded in from an empty frame. The stamp now tears off before the cut and the report is there on the cut (rip sound moved with it).
8. 35.0 s and 50.0 s: the next world appeared 2 frames early (over the fading headline, and as a black frame over the off-white chart). Worlds now preload underneath and cut on the cue. Also: the fan's year marks were hidden under the floor (now shown), and the payoff line now breaks as VOLATILITAS = / HARGA TIKETNYA.
9. Render 2, 36.8–39.2 s: the fan's year marks sat on the source line while the camera was close; they now appear once it has pulled back (spliced, see above).

## Known limitations
- Motion not watched and audio not heard (frames and measurements only). Needs one full watch with sound, especially for the Orus voice on "JPMorgan", "return" and "volatilitas", and the synthesized score's character.
- The working voice is Google Orus; the user's ElevenLabs voice can replace it from `elevenlabs-script.md` (re-aligns automatically; a slower take may need the 45–62 s window widened and a re-render).
- 55% volatility, 20.9% arithmetic return and the bear/bull scenarios come from press coverage of the report (Decrypt, Yahoo Finance, CoinDesk); the PDF itself is access-protected. Each is credited to its outlet on screen; the bear/bull rates rest on CoinDesk alone.
- The 0–3 s coin is a render, not a photo; Dimon appears only as a credited quote (no portrait, by choice).
- Hook variant A (consequence, the Rp10 juta fan) was not built; the released opening is variant B.
- The arena floor reads light grey at grazing angles from behind the podium (environment reflection). Kept: it separates the dark tracks and posts.

## Final verified artifact path
`output/jpmorgan-bitcoin.mp4` (render 2 with frames 1050–1190 spliced from the corrected source), 64.5 s, −14.1 LUFS.
