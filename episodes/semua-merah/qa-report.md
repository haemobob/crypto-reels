# QA report — semua-merah

Both audits are done **before final rendering** (the user renders the final MP4). Update the two result lines; `npm run audit -- <id>` reads them and warns at render time while either is not PASS.

Retention audit result: PASS
Visual-quality audit result: PASS

## Part A — Retention audit (script on the Orus working voice, 60.3 s; times from captions.json)

### Script audit
- [x] 1. **Hook:** 0.4 s "Tiga puluh Oktober: saham Amerika turun, emas turun, perak turun, Bitcoin juga turun." → 6.0 s "Jadi, uangnya ke mana?" The stake (a day everything fell; where did the money go?) is clear in 3 s.
- [x] 2. **Evidence by 5 s:** four real dated closes on screen (S1).
- [x] 3. **First payoff by 8–12 s:** 10.6 s "tiap ada yang jual, pasti ada yang beli"; 14.1 s "Uangnya cuma pindah tangan".
- [x] 4. **Reason to continue:** the myth (7.7 s) → the mechanism (10.6–19.9 s) → not everything was red (19.9 s) → bonds, oil, sectors, dollar (21.6–33 s) → why each fell (33–52.5 s) → the check (52.5 s).
- [x] 5. **Concrete nouns:** a seller, a buyer, a coin, a cash stack, a price tag, a board of tiles.
- [x] 6. **Cut test:** no sentence repeats the question; each trigger is one sentence.
- [x] 7. **Promise/payoff:** "uangnya ke mana?" → it changed hands; part moved to what turned green; ask what's green and who was forced to sell.
- [x] 8. **Truth test:** dated numbers; "kata analis" on the metals cause; "insiden keamanan … senilai sekitar" (affected, not stolen); "lebih dari satu setengah miliar" (CoinGlass ≈ $1.54B); the trade is ILUSTRASI.
- [x] 9. **Silent test:** headlines carry it: SEMUA MERAH · UANGNYA KE MANA? · KABUR KE CASH? · TIAP JUAL ADA YANG BELI · UANG PINDAH TANGAN · YANG TURUN: HARGA · NGGAK SEMUANYA MERAH · OBLIGASI NAIK · MINYAK & DEFENSIF NAIK · DOLAR MALAH TURUN · PEMICUNYA BEDA-BEDA · INTEL −28,6% · FED NAIK? · BINANCE ±$6,3 M · LIKUIDASI >$1,5 M · APA YANG HIJAU? SIAPA YANG TERPAKSA JUAL?
- [x] 10. **Share reason:** the friend who forwarded the "everything is dumping" video.

### Viewer-value gate
- [x] Understandable in 3 s · reason to care · early payoff (10–14 s) · each section adds information · mechanism shown · no removable sentence · a reusable check · delivers the promise · no follow/save/share request.

### Retention ladder
0.4 the red day · 6.0 the question · 7.7 the myth · 10.6 every sale has a buyer · 14.1 money changes hands · 16.0 the price is what fell · 19.9 not everything was red · 21.6 bonds up · 26.9 oil and defensives up · 30.6 dollar down · 33.0 different triggers · 36.4 Intel · 39.8 Fed · 44.4 Binance · 48.9 liquidations · 52.5 / 56.8 the check.

### Rejection gates
- [x] Unsupported consequence: NO · first frame lacks stake: NO · logo/3D-only opening: NO (real dated closes from frame 0) · no return by 8–12 s: NO · padding: NO · disconnected diagrams: NO (one board) · ending doesn't answer the opening: NO.

## Part B — Visual-quality audit

Checked on stills across every beat during the build (three rounds; fixes: board clipped to the stage band, every shot fitted to the stage, labels hidden outside it, the trade framed between two plinths, the S&P 500 tile on screen from frame 0), then on the **encoded MP4**. Render 1: one frame per second (64 frames, `output/semua-merah-review/r1-sheet.jpg`) and eight full-resolution frames (`cmpA/cmpB.jpg`); two clutter issues fixed. Render 2 (final): 41 exact frames before/mid/after every boundary in `transition-map.md` (`r2-tr.jpg`).

### Layout
- [x] Headlines keep their zone (470–700 px); the board is clipped to the stage band (722–1448 px), so no tile reaches the headline zone or the source line.
- [x] In-world cards keep a fixed on-screen size and hide outside the stage; the trigger cards sit on tile edges, not over another tile's numbers.
- [x] Nothing darkens the board to make room for text, except the deliberate dim behind the trade illustration (the board is context there, the trade is the subject).
- [x] Opening title centred, rising in; corner logo from frame 0; dark ground throughout.

### Opening
- [x] Statement (SEMUA MERAH.) over a real dated tile from frame 0 (S&P 500 −1,82%, real October chart) → three more real tiles on their words → the question at 6.0 s → the myth (7.7 s) → the first answer (10.6–16 s). Asset level 3 (real market data).
- [x] Restrained opening motion (slow push); the hero pull-back waits for 19.9 s.

### Demonstration and sound-off
- [x] Each claim is shown: four red tiles; a coin and cash crossing between seller and buyer (UANG DI PASAR: TETAP; price $78.000 → $76.800, ILUSTRASI); the board widening to green tiles and a grey dollar; trigger cards on the chip, metals and Bitcoin tiles; the green tiles then the liquidation card lit for the check.
- [x] Muted, the headlines carry the argument: SEMUA MERAH · UANGNYA KE MANA? · KABUR KE CASH? · TIAP ADA YANG JUAL, ADA YANG BELI · UANGNYA CUMA PINDAH TANGAN · YANG TURUN: HARGANYA · NGGAK SEMUANYA MERAH · OBLIGASI AS NAIK · MINYAK & SAHAM DEFENSIF NAIK · DOLAR? MALAH TURUN TIPIS · PEMICUNYA BEDA-BEDA · CHIP: INTEL −28,6% · EMAS & PERAK: FED BAKAL NAIKIN BUNGA? · KRIPTO: BINANCE INSIDEN ±$6,3 MILIAR · + LIKUIDASI PAKSA >$1,5 MILIAR · APA YANG HIJAU? SIAPA YANG TERPAKSA JUAL?
- [x] Labels at the claim: ILUSTRASI (trade); YIELD 10 TAHUN 4,94% (−0,04) = HARGA OBLIGASI NAIK; KATA ANALIS · PELUANG DARI PASAR PREDIKSI; NILAI TERDAMPAK · ±$3 MILIAR DIBEKUKAN (DILAPORKAN); BUKAN SARAN INVESTASI at the end.

### Evidence and editorial
- [x] Every number from the 30 Oct close (S1) or the cited crypto reports (S4, S5); charts from FRED/Binance; the reference's wrong claims corrected on screen; no forecast, no CTA.

### Runtime and implementation
- [x] Duration from the audio (60.3 s narration) and the render (62.9 s: 0.6 s hold + 2 s outro); inside the window (45–72 s).
- [x] ffprobe: 1080×1920, 30/1 fps, H.264 + AAC 48 kHz stereo, 62.9 s, 1,886 frames (last frame is the outro); −14.1 LUFS, −1.1 dBTP, LRA 1.9 LU.
- [x] blackdetect: only the outro; freezedetect: short holds while a beat is explained on a resting camera (the longest 4.7 s on the bond beat, 3.1 s on the metals beat; captions change); silencedetect: only after the last word.

### Visual and sound inspection
- [x] Encoded frames at every beat and transition; first 3 s and last 2 s checked frame by frame.
- [ ] Motion watched in a full render: **NOT REVIEWED** (frames only).
- [x] Sound measured, not heard: score 11.5–19.3 LU under the narration; effects on on-screen events. **Not listened to**.
- [x] One dominant idea per beat; camera moves motivated (push to the myth, framing the trade, the pull-back reveal, push-ins per trigger, pull-back for the check).
- [x] Brand: Inter Tight / Inter / JetBrains Mono, red/green only for down/up, official logo bug and outro.

## Scores (1–5; any score below 4 → targeted revision and re-check)
| Hook | First 12 s | Real-world opening | Educational payoff | Reward ladder | Understanding | Hierarchy | Camera | Transitions | Rhythm | Brand | Factual accuracy |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 5 | 4 | 4 | 5 | 4 | 4 | 4 | 4 | 4 | 4 | 4 | 5 |

## Fixes completed and rechecked
1. Stills: close-ups pushed tiles into the headline zone → stage clipping and fitted framing.
2. Stills: the seller and buyer sat at the frame edges with the board competing → plinths moved in, board dimmed behind the trade.
3. Stills: labels drifted into the caption zone → labels hide outside the stage.
4. Render 1: the Fed card's note sat on the silver tile's number and the Binance note on the staples tile → notes moved into the taglines; the Binance and liquidation cards sit on the Bitcoin tile's edges.

## Known limitations
- Motion not watched and audio not heard. Listen for "leverage" (whisper heard "lefresh") and "cash" (respelled "kes").
- The working voice is Google Orus; the ElevenLabs script is ready.
- Bitcoin's −1,3% is the US-session figure (S1); Binance's UTC daily candle shows −0,8%.
- The Binance figures are as reported on 30 Oct; the incident was still developing.

## Final verified artifact path
`output/semua-merah.mp4` (render 2), 62.9 s, 1,886 frames, −14.1 LUFS.
