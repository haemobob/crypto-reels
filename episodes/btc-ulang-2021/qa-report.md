# QA report — btc-ulang-2021

Both audits are done **before final rendering** (the user renders the final MP4). Update the two result lines; `npm run audit -- <id>` reads them and warns at render time while either is not PASS.

Retention audit result: PASS
Visual-quality audit result: PASS

## Part A — Retention audit (script on the Orus working voice, 64.4 s; times from captions.json)

### Script audit
- [x] 1. **Hook:** 0.4 s "Katanya, Bitcoin lagi ngulang siklus dua ribu dua puluh satu, langkah demi langkah." + 5.1 s "Dan ini dip terakhir sebelum all time high baru." The claim and its promise are clear in 3–7 s, over today's real chart.
- [x] 2. **Evidence by 5 s:** today's real BTC daily chart (Binance, to 9 Nov 2026) from frame 0, source line on screen.
- [x] 3. **First payoff by 8–12 s:** 9.4 s "Urutannya memang sama: double top, crash, mantul, kapitulasi…" with the six steps numbered on both real charts (10.8–15.3 s).
- [x] 4. **Reason to continue:** order matches (9.4 s) → but the size doesn't (16.5 s): crash, rally, speed → the 2023 pullback's 42% (28.1 s) → that level today, BTC on it now (36.0 s) → the caveat (44.5 s) → the check and the condition (49.9 s).
- [x] 5. **Concrete nouns:** two charts, numbered steps, a tracing sheet laid on top, a ruler moved from one chart to the other.
- [x] 6. **Cut test:** draft (192 words) lost the dates of the two lows (on screen instead), "dari masa lalu", "di chart sekarang", "beberapa hari terakhir"; nothing repeats the headline.
- [x] 7. **Promise/payoff:** "ngulang siklus 2021… dip terakhir?" → order yes, size no, level ≈ $75 rb now, ATH took 6 months, one example → three checks and the condition.
- [x] 8. **Truth test:** the claim is framed as "katanya" / KLAIM VIRAL; every number from Binance daily (S1); "sempat sedikit lebih dalam" (low 46,9% vs 42,3%); the condition is labelled BACAAN KAMI · BUKAN RAMALAN.
- [x] 9. **Silent test:** headlines carry it: BITCOIN NGULANG 2021? · CEK PAKAI DATA · URUTANNYA SAMA · UKURANNYA BEDA · CRASH −78% vs −54% · RALLY +105% vs +51% · ±3× LEBIH CEPAT · 2023: BERHENTI DI 42% · 42% SEKARANG ≈ $74.900 · ATH: 6 BULAN KEMUDIAN · CEK 3 HAL; verify on stills in Part B.
- [x] 10. **Share reason:** the friend who posted "last dip before ATH".

### Viewer-value gate
- [x] Understandable in 3 s · reason to care · early payoff (9.4–15 s) · each section adds information · the comparison is shown on real data · no removable sentence · a reusable check · delivers the promise · no follow/save/share request.

### Retention ladder
0.4 the claim · 5.1 the promise · 7.7 the check starts · 9.4 order matches (six steps to 15.3) · 16.5 size differs · 18.1 crash −78/−54 · 21.7 rally +105/+51 · 25.7 ≈3× faster · 28.1 2023 stopped at 42% · 32.9 never that cheap again · 36.0 42% today ≈ $75 rb · 40.4 BTC is there now, dipped deeper · 44.5 ATH 6 months later · 48.3 one example · 49.9 three checks · 56.7 verdict · 60.4 the condition.

### Rejection gates
- [x] Unsupported consequence: NO · first frame lacks stake: NO · logo/3D-only opening: NO (real chart from frame 0) · nothing real by 3–8 s: NO · no return by 8–12 s: NO · padding: NO · disconnected diagrams: NO (one light table, one sheet) · ending doesn't answer the opening: NO.

## Part B — Visual-quality audit

Checked on stills during the build (three rounds; fixes: the opening chart narrowed so the price ticks don't sit on the line; taglines moved under two-line headlines; the panel title moved clear of the step markers; the 42% pill, the 2023 low label and the 8/9 Nov labels separated; the check rows shown as placeholders from the start of the verdict), then on the **encoded MP4**: one frame per second (`output/btc-ulang-2021-review/r1-sheet.jpg`, 67 frames) and 24 exact frames before/mid/after every boundary in `transition-map.md` (`r1-tr.jpg`).

### Layout
- [x] Headlines keep their zone (470–700 px); taglines sit between the headline and the stage; the light table is clipped to the stage (742–1442 px), so no line or label reaches the headline zone or the source line.
- [x] Labels sit on solid pills or in clear space beside the lines; none crosses a headline.
- [x] Nothing darkens the charts to make room for text; the tracing sheet is the object being shown, and after it lands it is translucent so today's chart reads through it.
- [x] Opening title centred, rising in; corner logo from frame 0 on navy, hidden on the off-white chapter (`logoHide`), back for the verdict.

### Opening
- [x] Statement (BITCOIN NGULANG 2021?) → today's real Binance chart drawing in from 0.4 s (asset level 3) → the claim tag at 5.1 s → the light table and the 2021–23 sheet at 7.7 s → the first answer at 9.4 s.
- [x] Restrained opening (a draw-on, a pulse); the hero re-scale waits for 16.5 s.

### Demonstration and sound-off
- [x] Each claim is shown on the data: six numbered steps on both charts; both cycles on one ruler pinned at the final low with crash and rally brackets and day bars; the 42% ruler on the 2023 rally carried onto today's; the 9 Nov close and 8 Nov low on the level; the ATH 179 days later; the 1 CONTOH stamp.
- [x] Muted, the headlines carry it (see Part A, 9).
- [x] Labels at the claim: KLAIM VIRAL (the claim is theirs, not ours); dates and prices on every marker; SEMPAT LEBIH DALAM: 47%; SATU SIKLUS DULU ≠ JAMINAN; BACAAN KAMI · BUKAN RAMALAN · BUKAN SARAN INVESTASI.

### Evidence and editorial
- [x] Every number from Binance BTC/USDT daily (S1); the reference's "exactly 40%", "next stop ATH" and "history on our side" corrected; no forecast, no CTA.

### Runtime and implementation
- [x] Duration from the audio (64.4 s narration) and the render (67.1 s: 0.6 s hold + 2 s outro); inside the window (50–72 s).
- [x] ffprobe: 1080×1920, 30/1 fps, H.264 + AAC 48 kHz stereo, 67.1 s, 2,011 frames (last frame is the outro); −14.2 LUFS, −1.0 dBTP, LRA 1.8 LU.
- [x] blackdetect: only the outro (65.0–67.0 s); freezedetect (2 s): short holds while a beat is explained (18.7, 29.5, 33.8, 42.1, 46.0, 50.8 s; 2.0–3.2 s each, captions change); silencedetect: only after the last word (64.5 s).

### Visual and sound inspection
- [x] Encoded frames at every beat and transition; first 3 s and last 2 s checked.
- [ ] Motion watched in a full render: **NOT REVIEWED** (frames only).
- [x] Sound: score layers set per section and sidechain-ducked under the voice; effects on on-screen events. **Not listened to.**
- [x] One dominant idea per beat; every move motivated (the sheet arriving, landing on one ruler, reframing to the rallies, the ruler carried, reframing out to the ATH).
- [x] Brand: Inter Tight / Inter / JetBrains Mono, brand blue for today, graphite for the past, red/green only for down/up numbers; official logo bug and outro.

## Scores (1–5; any score below 4 → targeted revision and re-check)
| Hook | First 12 s | Real-world opening | Educational payoff | Reward ladder | Understanding | Hierarchy | Camera | Transitions | Rhythm | Brand | Factual accuracy |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 4 | 4 | 4 | 5 | 5 | 5 | 4 | 4 | 4 | 4 | 4 | 5 |

## Known limitations
- Motion not watched and audio not heard. Listen to the Orus voice on "double top", "crash", "rally", "pullback", "all time high" (respelled) and "dip" (whisper heard "deep").
- The working voice is Google Orus; the ElevenLabs script is ready (`elevenlabs-script.md`).
- The data ends at the 9 Nov 2026 close; the level and "BTC is there now" are as of 10 Nov 2026 and will age quickly. Post soon, or re-check the last candles before posting.
- Small labels (17–20 px mono) on the chart are readable at full size; on a phone they are secondary to the headlines.

## Final verified artifact path
`output/btc-ulang-2021.mp4` (render 1), 67.1 s, 2,011 frames, −14.2 LUFS. Subtitles: `episodes/btc-ulang-2021/btc-ulang-2021.srt`.
