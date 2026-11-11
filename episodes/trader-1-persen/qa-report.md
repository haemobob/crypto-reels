# QA report — trader-1-persen

Both audits are done **before final rendering** (the user renders the final MP4). Update the two result lines; `npm run audit -- <id>` reads them and warns at render time while either is not PASS.

Retention audit result: PENDING
Visual-quality audit result: PENDING

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
(after the build)
