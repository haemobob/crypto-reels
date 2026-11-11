# QA report — btc-ulang-2021

Both audits are done **before final rendering** (the user renders the final MP4). Update the two result lines; `npm run audit -- <id>` reads them and warns at render time while either is not PASS.

Retention audit result: PASS
Visual-quality audit result: PASS

## Part A — Retention audit (re-checked on the user's ElevenLabs take, 69.3 s, 11 Nov 2026; times from captions.json. First pass on the Orus working voice, 64.4 s)

### Script audit
- [x] 1. **Hook:** 0.1 s "Katanya, Bitcoin lagi ngulang siklus dua ribu dua puluh satu, langkah demi langkah." + 6.7 s "Dan ini dip terakhir sebelum all time high baru." The claim and its promise are clear in 3–7 s, over today's real chart.
- [x] 2. **Evidence by 5 s:** today's real BTC daily chart (Binance, to 9 Nov 2026) from frame 0, source line on screen.
- [x] 3. **First payoff by 8–12 s:** 11.6 s "Urutannya memang sama: double top, crash, mantul, kapitulasi…" with the six steps numbered on both real charts (13.0–18.1 s). At the edge of the window because of the slow, intriguing opening the user chose.
- [x] 4. **Reason to continue:** order matches (11.6 s) → but the size doesn't (19.1 s): crash, rally, speed → the 2023 pullback's 42% (31.5 s) → that level today, BTC on it now (40.2 s) → the caveat (48.6 s) → the check and the condition (54.5 s).
- [x] 5. **Concrete nouns:** two charts, numbered steps, a tracing sheet laid on top, a ruler moved from one chart to the other.
- [x] 6. **Cut test:** draft (192 words) lost the dates of the two lows (on screen instead), "dari masa lalu", "di chart sekarang", "beberapa hari terakhir"; nothing repeats the headline.
- [x] 7. **Promise/payoff:** "ngulang siklus 2021… dip terakhir?" → order yes, size no, level ≈ $75 rb now, ATH took 6 months, one example → three checks and the condition.
- [x] 8. **Truth test:** the claim is framed as "katanya" / KLAIM VIRAL; every number from Binance daily (S1); "sempat sedikit lebih dalam" (low 46,9% vs 42,3%); the condition is labelled BACAAN KAMI · BUKAN RAMALAN.
- [x] 9. **Silent test:** headlines carry it: BITCOIN NGULANG 2021? · CEK PAKAI DATA · URUTANNYA SAMA · UKURANNYA BEDA · CRASH −78% vs −54% · RALLY +105% vs +51% · ±3× LEBIH CEPAT · 2023: BERHENTI DI 42% · 42% SEKARANG ≈ $74.900 · ATH: 6 BULAN KEMUDIAN · CEK 3 HAL; verify on stills in Part B.
- [x] 10. **Share reason:** the friend who posted "last dip before ATH".

### Viewer-value gate
- [x] Understandable in 3 s · reason to care · early payoff (11.6–18 s) · each section adds information · the comparison is shown on real data · no removable sentence · a reusable check · delivers the promise · no follow/save/share request.

### Retention ladder
0.1 the claim · 6.7 the promise · 10.1 the check starts · 11.6 order matches (six steps to 18.1) · 19.1 size differs · 20.9 crash −78/−54 · 24.5 rally +105/+51 · 28.5 ≈3× faster · 31.5 2023 stopped at 42% · 37.0 never that cheap again · 40.2 42% today ≈ $75 rb · 44.6 BTC is there now, dipped deeper · 48.6 ATH 6 months later · 52.5 one example · 54.5 three checks · 61.0 verdict · 64.9 the condition.

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
- [x] Duration from the audio (69.3 s narration, the user's ElevenLabs take) and the render (71.9 s: 0.6 s hold + 2 s outro); inside the window (50–72 s).
- [x] ffprobe (render 4, ElevenLabs take): 1080×1920, 30/1 fps, H.264 + AAC 48 kHz stereo, 71.9 s, 2,156 frames (last frame is the outro); −14.1 LUFS, −1.2 dBTP, LRA 2.5 LU.
- [x] blackdetect: only the outro (69.9–71.8 s); freezedetect (2 s): short holds while a beat is explained (21.5, 33.2, 37.7, 46.3, 55.3 s; 2.0–2.8 s each, captions change), none in the opening after the fix; silencedetect: only after the last word (69.3 s).

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

## Fixes after the user's review (render 2)
1. The chart lines ran past the edge of the tracing sheet in the zoomed shots → the old chart is clipped to the sheet and today's chart closes in to the sheet as it lands (14 px inner margin); the ruler now fades out completely when the level line takes over.
2. In the check card, the number circles sat lower than their titles (centred on title + note) → number, title and result share one centred line; the note sits under the title.
Checked on stills and on the encoded render 2 (`output/btc-ulang-2021-review/r2-check.jpg`, 12 exact frames).

## ElevenLabs take (11 Nov 2026, renders 3–4)
- Render 3 on the take: one frame per second (`r3-sheet.jpg`) and 33 exact frames before/after every cue (`r3-tr.jpg`): every reveal lands on its word.
- Fix: with the slower opening the chart finished drawing at 3 s and held still to 6.7 s (freezedetect 3.1–6.7 s) → the draw now spans the whole first line and ends just before the claim (render 4).

## Known limitations
- Motion not watched and audio not heard. Listen to the ElevenLabs take on "dip" (whisper heard "deep") and the English terms.
- Voice: the user's ElevenLabs take (11 Nov 2026), levelled only, no cuts.
- The data ends at the 9 Nov 2026 close; the level and "BTC is there now" are as of 10 Nov 2026 and will age quickly. Post soon, or re-check the last candles before posting.
- Small labels (17–20 px mono) on the chart are readable at full size; on a phone they are secondary to the headlines.

## Final verified artifact path
`output/btc-ulang-2021.mp4` (render 4, ElevenLabs take, 11 Nov 2026), 71.9 s, 2,156 frames, −14.1 LUFS. Subtitles: `episodes/btc-ulang-2021/btc-ulang-2021.srt`. Cover: `output/btc-ulang-2021-cover.png` / `.jpg` (1080×1920) and `-cover-grid.jpg` (3:4 preview).
