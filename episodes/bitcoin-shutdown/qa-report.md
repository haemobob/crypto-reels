# QA report — Bitcoin akan segera shutdown?

Both audits are done **before final rendering**. `npm run audit -- <id>` reads the two result lines.

Retention audit result: PASS
Visual-quality audit result: PASS

## Part A — Retention audit (script, on the final ElevenLabs take; times from captions.json)

### Script audit
- [x] 1. **Hook:** 0.07 s "BITCOIN akan segera... SHUTDOWN?". A stranger can say what's at stake: whether Bitcoin can stop working.
- [x] 2. **Evidence by 5 s:** 2.37 s "Pemerintah Inggris baru saja mengimbau…" over the real GOV.UK page (22 Oct 2026).
- [x] 3. **First payoff by 8–12 s:** 5.68–9.0 s "tiga hari gangguan layanan penting, seperti listrik dan internet". A concrete, sourced fact.
- [x] 4. **Reason to continue:** each answer opens the next question: UK advice → real attack this week (9.4 s) → "not the end of the internet, but imagine" (19.5 s) → money stops (25.5 s) → "Bitcoin lo gimana?" (34.8 s) → how a transaction travels (36.3 s) → what an outage does to it (44.0 s) → "Tapi tunggu… nggak otomatis hilang" (52.3 s) → satellite (60.0 s) → exchange (68.7 s) → ownership vs access (73.8–84.8 s).
- [x] 5. **Concrete nouns:** mesin pembayaran, ATM, aplikasi bank, server, jaringan komputer, satelit, exchange, private key; each one has an object on screen.
- [x] 6. **Cut test:** no sentence repeats the headline; no generic bridge ("Tapi tunggu" is the brief's own deliberate reversal and is followed by the answer within 1.1 s).
- [x] 7. **Promise/payoff:** "Bitcoin akan segera shutdown?" is answered at 73.8 s ("internet mati belum tentu membuat Bitcoin mati"), then deepened into the access question.
- [x] 8. **Truth test:** the opening is a question; "Ini bukan berarti internet dunia akan segera mati" at 19.5 s; UK advice shown as general preparedness, not a prediction; "millions of attempts" shown as attempts, with NCSC UK's "no reports of successful hacks"; outage and partition beats labelled SIMULASI/ILUSTRASI; satellite shown as receive-only; hardware wallet shown as guarding keys, not holding coins.
- [x] 9. **Silent test:** to verify on stills in Part B (headlines carry each turn: SHUTDOWN? · 72 JAM · JUTAAN PERCOBAAN · SIMULASI · BITCOIN JUGA OFFLINE? · TANPA SERVER PUSAT · TRANSAKSI TERTUNDA · INTERNET MATI ≠ BITCOIN HILANG · SATU ARAH · BISAKAH LO MENGAKSESNYA?).
- [x] 10. **Share reason:** for a friend who keeps everything on an exchange app, or who thinks Bitcoin is immune to outages.

### Viewer-value gate
- [x] Opening understandable within 3 s · reason to care · early payoff (8–9 s) · each section adds information · mechanism explained (36–51 s) · no removable sentence · final insight worth keeping (ownership ≠ access) · delivers the promise.
- Ending: per the user's brief it ends on a question, after the answer (73.8 s) and the distinction. No follow/save/share request.

### Retention ladder (a new fact or turn every ~3–8 s)
2.4 UK advice · 5.7 three days · 7.7 power and internet · 9.4 PHP attacks · 15.8 sites switched off · 19.5 caveat · 22.6 imagine · 25.5/27.1/28.3 payments, ATM, bank app · 34.8 the Bitcoin question · 36.3 no central server · 38.8 must be sent · 42.6 confirmed · 44.0 local outage → delay · 47.4 partition · 52.3 reversal · 55.5 key and chain · 60.0 satellite · 64.7 one-way · 68.7 exchange · 73.8 answer · 77.7–84.8 final question.

### Rejection gates
- [x] Unsupported consequence: NO · first frame lacks stake: NO · logo/3D-only opening: NO (real document from 2.4 s) · no return by 8–12 s: NO · padding: NO · disconnected diagrams: NO (one transaction and one node map carry the mechanism) · ending doesn't answer the opening: NO (73.8 s).

## Part B — Visual-quality audit

Checked on stills across every beat during the build, then on the **encoded MP4** (render 1): one frame per second (88 frames, `output/bitcoin-shutdown-review/mp4/sheet-*.jpg`), before/mid/after frames at every boundary in `transition-map.md` (about 70 frames), and full-resolution crops of the first 3 s, the last 2 s and every problem spot. Seven problems found there were fixed (below), re-checked on stills, and checked again on the encoded render 2 (frames at every fixed spot plus a new 1 fps sheet, `output/bitcoin-shutdown-review/mp4/final-sheet-*.jpg`). Render 2 showed one leftover: the logo returned two frames early over the page's top edge (f204–205); the source was corrected (hide until `days + 36`) and those two frames, rendered from the corrected source, were spliced into the MP4 (video re-encoded at CRF 16, PSNR 50 dB on all other frames; audio stream copied untouched).

### Layout
- [x] Headlines keep their zone (470–700 px); 3D subjects are framed numerically into the stage (y ≈ 720–1450) with view offsets; device shots use the lower-third headline (y ≈ 1478).
- [x] Captions overlay the film where they cross a graphic, as allowed by the 20 Oct skills-override decision; headlines stay legible throughout.
- [ ] Known compromise: in the 3D worlds, thin network arcs, the globe's atmosphere (36–52 s) and the satellite's solar panel (60–62 s) pass behind headlines; the Blockstream evidence card covers the lower part of the satellite for 2.5 s (61–63 s). The text stays readable; no scrim was added.
- [x] Nothing darkens or crops a graphic to make room for text (taglines are small pills, not scrims).
- [x] Source images shown whole first: the GOV.UK page as a whole document (2.4–3.0 s) before the reading push; the Guardian and NCSC-NL clippings whole as cards; the Blockstream page crop whole in its card.
- [x] Opening title centred, rising in, no date/press tag; corner logo from frame 0 (21 Oct decision), hidden whenever a white surface sits under it (GOV.UK page 3.4–6.9 s, off-white reveal 53.2–60.0 s).

### Opening
- [x] Statement (0 s) → real anchor (GOV.UK page, 2.4 s) → designed monument 72 JAM with service chips (5.7 s) → abstract 3D (server room 9.4 s). The 0–2.4 s coin is a realistic render of the public-domain ₿ (asset level 4); something real is on screen by 2.4 s.
- [x] Opening motion follows the user's brief (low-angle approach, small orbit, fast reframe on the ₿), which overrides the restrained-opening default; the document section uses a documentary push-in.
- [x] Real assets logged in `sources.md` with origin, date and basis; the GOV.UK, Guardian and NCSC-NL crops are unaltered and credited; no publisher masthead imitated; Blockstream named to identify the service, no logo imitation.

### Demonstration and sound-off
- [x] Every world demonstrates the line it sits under: the notice and its three days; attacks as red LEDs and sites switching to 503; failing devices; the wallet going TERPUTUS with KIRIM locked; a transaction hopping Jakarta → Singapore → Mumbai → Frankfurt into a block; links dropping (A) and the world splitting (B); the key and the real blocks; a one-way satellite beam with the return blocked; the custody comparison.
- [x] Muted, the headlines carry the argument: SHUTDOWN? · 72 JAM · JUTAAN PERCOBAAN EKSPLOITASI · WEBSITE SENGAJA DIMATIKAN · BUKAN BERARTI INTERNET DUNIA MATI · MESIN PEMBAYARAN GAGAL / ATM OFFLINE / APLIKASI BANK NGGAK KEBUKA · BITCOIN JUGA OFFLINE? · TANPA SERVER PUSAT · TRANSAKSI HARUS DIKIRIM · LALU DIKONFIRMASI · TERTUNDA · JARINGAN TERPECAH · INTERNET MATI ≠ BITCOIN HILANG · TETAP TERCATAT DI BLOCKCHAIN · BLOCKSTREAM SATELLITE · TERIMA ✓ · PERLU JALUR LAIN · AKSES = SISTEM MEREKA · BITCOIN BISA BERTAHAN. TAPI BISAKAH LO MENGAKSESNYA?
- [x] Labels at the claim: SIMULASI GANGGUAN BESAR on every device shot; SIMULASI · DOMPET CONTOH and a SIMULASI balance; ILUSTRASI on the server room and the connection lines; SKENARIO A · ILUSTRASI and SKENARIO B · HIPOTESIS; "PERCOBAAN · NCSC INGGRIS: BELUM ADA LAPORAN PERETASAN BERHASIL"; "IMBAUAN INGGRIS = PERSIAPAN, BUKAN PREDIKSI"; "HARDWARE WALLET MENJAGA KUNCI, BUKAN MENYIMPAN KOIN"; "LINK SATELIT INI SATU ARAH"; "KIRIM TETAP BUTUH JARINGAN".
- [x] Real data where it exists: 3,271 public node locations (Bitnodes), ten real blocks (mempool.space), the real GOV.UK/Guardian/NCSC-NL/Blockstream pages. Devices and apps are generic and unbranded on purpose.

### Evidence and editorial
- [x] All claims sourced (S1–S9), event and checked dates recorded; conditional claims visibly conditional; no prices, no CTA beyond the 2 s brand outro.

### Runtime and implementation
- [x] Duration from the audio (84.8 s narration) and the render (87.5 s file: 0.6 s hold + 2 s outro). Inside the episode window (60–88 s); **above the brief's 65–80 s target** (see limitations).
- [x] ffprobe: 1080×1920, 30/1 fps, H.264 + AAC 48 kHz stereo, 87.5 s, 2,622 frames; −14.1 LUFS integrated, −1.3 dBTP, LRA 2.9 LU (render 2).
- [x] No missing assets; cue-driven worlds overlap by 2–4 frames at each hand-off so no frame is empty; a 2-frame black gap at the ATM → phone cut found in render 1 and fixed (same-frame cut).
- [x] blackdetect (≥ 2 frames): only the three intentionally dark frames inside the zoom-through into the network (36.3 s; node lights visible) and the dark outro; freezedetect: only the static outro; silencedetect: only the scripted silence (51.8–52.3 s, 52.9–53.4 s) and the cut to silence after the last word.
- [x] Numbers and labels verified against S1–S9 (72 jam, ±70%, 32 services, 3.271 locations, #972.911, Telstar 18V 138°BT).

### Visual and sound inspection
- [x] Encoded frames at every beat and every transition (before/mid/after); first 3 s and last 2 s at full resolution.
- [ ] Motion watched in a full render: **NOT REVIEWED** (frames only).
- [x] Sound measured, not heard: score 7–19 LU under the narration in every section (sidechain-ducked), sudden silence 51.8–53.4 s, cut to silence after the last word; effects placed on the on-screen event frames. **Not listened to**: Claude can't hear audio.
- [x] One dominant visual per beat; camera moves motivated (approach, reading push, flight into the room, aisle track, match cuts, crash push on the wallet, zoom-through, hop-by-hop carry, light match cut + polarity flip, beam tilt, orbit and descent, pull-back reveal).
- [x] Polarity: black/navy threat world → off-white only for the reversal (53.5–60 s) → space → black ending.
- [x] Brand: Inter Tight / Inter / JetBrains Mono, brand blues with red/green only for meaning, official logo bug and outro; all assets licensed or own work (`sources.md`).

## Scores (1–5; any score below 4 → targeted revision and re-check)
| Hook | First 12 s | Real-world opening | Educational payoff | Reward ladder | Understanding | Hierarchy | Camera | Transitions | Rhythm | Brand | Factual accuracy |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 4 | 4 | 4 | 5 | 4 | 4 | 4 | 4 | 4 | 4 | 4 | 5 |

## Fixes completed and rechecked (from the render-1 frame review)
1. 25.4 s: the dive into the failing website ended on two white frames between dark shots (luminance flash). The hero site now has a dark error page whose red ✕ sits where the terminal's ✕ is: a match cut, dark to dark.
2. 28.2 s: two black frames between the ATM and the phone (camera interpolating between sets 30 units apart). Now a same-frame cut.
3. 3.4–6.8 s: the white corner logo sat on the white GOV.UK page (over GOV.UK's own wordmark, then over its text). Hidden while the page is under it.
4. 2.5 s: the 2D handoff line lingered while the page moved and crossed the standfirst like a strikethrough. It now lands on the page's own underline and hands over within 3 frames.
5. 66–68 s: "SATU ARAH" and "JALUR LAIN (MIS. INTERNET)" were cut at the frame edges. The ground set is reframed and the label split in two lines; the blocked pulse stays below the headline zone.
6. 55.5 s: "PRIVATE KEY" entered cut at the right edge; it now fades in once the key is in frame.
7. 53.3 s and 59.8 s: the logo showed for a few frames on the grey fade into and out of the off-white reveal; the hide now covers the whole fade. Also: the satellite tagline wrapped "PASIFIK" onto a second line; shortened to one line.

## Known limitations
- Motion not watched and audio not heard (frames and measurements only). Needs one full watch with sound, especially for: the pronunciation of "SHUTDOWN" (the recogniser heard "shut out"), the synthesized score's character, and the dive at 25.4 s.
- Length 87.4 s is over the brief's 65–80 s target: the take itself is 83.3 s, plus 1.4 s of added dramatic pauses. Getting under 80 s needs a shorter script and a new take.
- The score is original but synthesized (sine/noise layers, no samples); a licensed track can replace it if a produced sound is preferred.
- In the 3D sections thin lines and the satellite panel pass behind some headlines, and the evidence card covers part of the satellite for 2.5 s (text remains legible).
- Hook variant A (consequence) was not built; the released opening is variant B, as the user's brief specified.
- Render time is about 45 min in this cloud container (software WebGL); on a PC with a GPU it's much faster.

## Final verified artifact path
- `output/bitcoin-shutdown.mp4`: render 2 with frames 204–205 spliced from the corrected source; 87.5 s, 1080×1920, 30 fps, H.264 + AAC, −14.1 LUFS, −1.3 dBTP; `npm run validate` and `npm run audit` pass. Local file (MP4s are gitignored); a fresh `npm run render -- bitcoin-shutdown` from the committed source produces the same picture.
- Subtitles: `episodes/bitcoin-shutdown/bitcoin-shutdown.srt` (45 cues, `npm run srt`).
