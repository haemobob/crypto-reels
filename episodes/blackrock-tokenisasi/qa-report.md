# QA report — Tokenisasi: internet 1996-nya keuangan?

Both audits are done **before final rendering** (the user renders the final MP4). Update the two result lines; `npm run audit -- <id>` reads them and warns at render time while either is not PASS.

Retention audit result: PASS
Visual-quality audit result: PASS

## Part A — Retention audit

### Script audit (working Orus take, 55.3 s)
- [x] 1. Hook: 0.4 s "Larry Fink, bos BlackRock, bilang tokenisasi sekarang kira-kira ada di titik internet tahun 1996" + TOKENISASI = INTERNET TAHUN 1996?
- [x] 2. Evidence by 5 s: official photo + profile card from ~1.5 s; quote sourced to his 2026 letter at 2.6 s.
- [x] 3. First payoff by 8–12 s: scale in rupiah (8.0 s) and vs PDB Indonesia (13.2 s); definition at 16.0 s.
- [x] 4. Reason to continue: who → how big → what is it → why faster → what else → how big really → what to check.
- [x] 5. Concrete nouns: BEI, dua hari bursa, hitungan detik, jaminan pinjaman, Rp279 ribu triliun, 39 miliar dolar.
- [x] 6. Cut test: dropped "seperti saham atau obligasi", "Hari ini", "sudah", "kalau ada… ditawarkan ke kamu".
- [x] 7. Promise/payoff: "internet 1996" (early, big potential) → "baru setengah persen… nggak akan… dalam semalam" → what to check now.
- [x] 8. Truth test: "kira-kira" kept from the quote; forecast ($16T) not used; collateral shown as ILUSTRASI; currency rule applied.
- [x] 9. Silent test: headlines carry each step; verify in Part B.
- [x] 10. Share reason: the friend shilling an RWA token.

### Viewer-value gate
- [x] All eight questions pass; no follow/save/share request; payoff is the last content beat.

### Retention ladder
- [x] 2.6 quote · 8.0 IDR scale · 13.2 ×PDB · 16.0 definition · 20.0 T+2 · 23.0 seconds · 28.1 fractions · 30.0 collateral · 33.5 $39B · 38.0 0.5% · 40.4 not overnight · 44.8–50.8 checks.

### Rejection gates
- [x] Unsupported consequence: NO · first frame lacks stake: NO · logo/3D-only opening: NO · nothing real in 3–8 s: NO (official photo from 1.4 s) · no return by 8–12 s: NO · padding: NO · disconnected diagrams: NO (one token carries ledger → lanes → split → pledge) · ending doesn't answer opening: NO

## Part B — Visual-quality audit

Checked on rendered stills across every beat and on before/mid/after frames at every transition from the encoded MP4 (`output/blackrock-tokenisasi-review/`). Not watched in motion.

- [x] No text over graphics: headlines in the headline zone, source line below the stage, ILUSTRASI tags in clear space beside the graphics (fixed: three-line title wrap; "≈ 12× PDB" headline arriving before the blocks).
- [x] Nothing darkens or crops graphics for text; rwa.xyz crop shown whole and readable, with source and capture time on screen.
- [x] Opening: centred title rising in (0 s) → official photo + profile card (1.4 s) → quote card (2.6 s) → designed counter (8 s); no logo intro (corner bug only, per 21 Oct decision).
- [x] Asset hierarchy level 1 (official BlackRock headshot, credited "FOTO: JERRY GOLDBERG / BLACKROCK"); unaltered; no implied endorsement. Second supplied photo not used (unknown source).
- [x] Every graphic demonstrates its line: certificate → token on a ledger, T+2 lane vs seconds lane, split and pledge, to-scale bars.
- [x] Sound-off: headline zone carries each step (WHO, ≈ Rp279.465 T, ≈ 12× PDB, definition, T+2 vs detik, dipecah, jaminan, $39 M, 0,25%, three checks).
- [x] Simulations labelled ILUSTRASI while shown (ledger, lanes' token, split/pledge); no simulated market data.
- [x] Numbers match `research.md`/`sources.md`: $15,5 T (30 Sep 2026), 18.030 IDR/USD (22 Oct 2026), PDB 2025 Rp23.821,1 T → 11,7×, $39,02 M (22 Oct 2026), 0,25%; currency rule applied (wealth in IDR, tokenized market in USD, ratio between them).
- [x] Polarity: one off-white chapter for the reality check, back to dark for the checklist; logo hidden on off-white.
- [x] Payoff stretch: blackdetect flagged 44.8–47.8 s as near-black; fixed with numbered shells at the payoff cue. Only remaining dark stretch is the ≤2 s branded outro.
- [x] ffprobe 1080×1920, 30 fps, H.264 + AAC; 58.0 s (window 40–60); −14.2 LUFS, −1.2 dBTP.
- [ ] Motion watched: **NOT REVIEWED**.

## Scores (1–5; any score below 4 → targeted revision and re-check)
| Hook | First 12 s | Real-world opening | Educational payoff | Reward ladder | Understanding | Hierarchy | Camera | Transitions | Rhythm | Brand | Factual accuracy |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 4 | 4 | 5 | 5 | 4 | 4 | 4 | 4 | 4 | 4 | 4 | 5 |

## Known limitations
- Motion not watched; please check on a phone.
- Working voice is Orus; an ElevenLabs take will replace it if the user supplies one (re-render needed).
- rwa.xyz figure is a 22 Oct 2026 snapshot; re-capture before a later release. Screenshot used editorially with credit.
- The exchange rate and PDB comparison move with the rupiah; dated on screen.

## Final verified artifact path
`output/blackrock-tokenisasi.mp4` (gitignored).
