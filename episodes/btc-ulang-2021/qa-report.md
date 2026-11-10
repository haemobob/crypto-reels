# QA report — btc-ulang-2021

Both audits are done **before final rendering** (the user renders the final MP4). Update the two result lines; `npm run audit -- <id>` reads them and warns at render time while either is not PASS.

Retention audit result: PENDING
Visual-quality audit result: PENDING

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
(after the build)
