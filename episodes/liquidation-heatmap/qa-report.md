# QA report — Peta likuidasi Bitcoin

Both audits are done **before final rendering** (the user renders the final MP4). Update the two result lines; `npm run audit -- <id>` reads them and warns at render time while either is not PASS.

Retention audit result: PASS
Visual-quality audit result: PASS (stills and transition frames; motion NOT REVIEWED)

## Part A — Retention audit

### Script audit (times from `captions.json`, working Orus take of 21 Oct 2026, 53.1 s)
- [x] 1. Hook: 0.0 s "Banyak trader futures cek peta ini sebelum entry" + TRADER CEK PETA INI SEBELUM ENTRY. Stake: a tool people use before risking money.
- [x] 2. Evidence by second 5: the real CoinGlass heatmap from 2.6 s ("Ini data CoinGlass hari ini"), bands named at 5.8 s.
- [x] 3. First payoff by 8–12 s: bands at $82,300 / $84,800 (5.8–11.9 s), then "Garis itu bukan order" at 12.0 s.
- [x] 4. Reason to continue: what are they? (12 s) → how one position makes one (16–25 s) → why price reacts (28.7 s) → limits (37.1 s) → what to do (44.4 s).
- [x] 5. Concrete nouns: garis kuning, long/short 50× at $84,000, harga likuidasi, jual/beli paksa, zona.
- [x] 6. Cut test: removed "dan bisa", "di mana … bakal dipaksa tutup", "pakai peta ini buat"; no repeated headline, no rhetorical filler.
- [x] 7. Promise/payoff: "cek peta ini sebelum entry" → "satu cek sebelum entry: harga likuidasi kamu jangan ada di zona kuning".
- [x] 8. Truth test: "perkiraan" at 12 s and 37.1 s with CoinGlass's own caveat; "sering"/"bisa", never "pasti"; formula numbers labelled ILUSTRASI; no targets.
- [x] 9. Silent test: headline zone carries every step; verified on stills in Part B.
- [x] 10. Share reason: a friend trading with high leverage.

### Viewer-value gate
- [x] Opening understandable within three seconds
- [x] Reason to care
- [x] Early payoff
- [x] Each section adds information
- [x] Mechanism explained (liquidation price → bands → forced orders)
- [x] No removable sentence
- [x] Takeaway worth remembering (a pre-entry check)
- [x] Delivers the promise
- [x] No follow/save/share request; payoff is the last content beat

### Retention ladder
- [x] New fact every 5–10 s: 2.6 real map · 5.8/9.5 bands · 12.0 not orders · 16.4 long liq · 22.2 short liq · 25.8 bands = stacked positions · 28.7 forced orders · 33.0 faster moves · 37.1 estimate · 41.8 reversal · 44.4/46.9 the check.
- [x] Specific bridges ("Misalnya" style questions, "Saat", "Tapi", "Jadi").
- [x] No second intro; caveats at the claim.
- [x] Final frame answers the opening.

### Rejection gates
- [ ] Unsupported consequence: NO
- [ ] First frame lacks subject/stake: NO
- [ ] Logo/3D-only opening: NO
- [ ] Nothing real in 3–8 s: NO (CoinGlass screenshot from 2.6 s)
- [ ] No return by 8–12 s: NO
- [ ] Padding: NO
- [ ] Disconnected diagrams: NO (one ladder carries the whole explanation)
- [ ] Ending doesn't answer the opening: NO

## Part B — Visual-quality audit

Checked on rendered stills across every beat and frames from the encoded MP4 at each transition (`output/liquidation-heatmap-review/`). Not watched in motion.

- [x] No text over graphics: headlines in their zone; band tags in the gutter beside the screenshot; in-chart labels in clear space (fixed: LONG label crossing the price line; fixed ILUSTRASI tag during the zoom; "your liquidation" label crossing the band while moving).
- [x] Screenshot shown whole and readable first, then zoomed on the narrated bands; unaltered crop with CoinGlass title and watermark; source and capture time on screen.
- [x] Opening: statement (0 s) → real map (2.6 s) → designed ladder (12 s).
- [x] Simulations labelled: ILUSTRASI tag on the ladder and in the source line; formula and MMR on screen.
- [x] Caveat on screen at the claim (CoinGlass paraphrase, marked as paraphrase).
- [x] ffprobe 1080×1920, 30 fps, H.264 + AAC; 60.0 s with the ElevenLabs take (window widened to 40–60 s for it); no black frames; −14.3 LUFS, −1.1 dBTP.
- [x] Numbers match `research.md`: $82,300 / $84,800 (axis readings $82,336 / $84,791), $84,222, $82,656, $85,344.
- [x] Logo from frame 0; hidden on the off-white caveat; captions muted there.
- [ ] Motion watched: **NOT REVIEWED**.

## Scores
| Hook | First 12 s | Real-world opening | Educational payoff | Reward ladder | Understanding | Hierarchy | Camera | Transitions | Rhythm | Brand | Factual accuracy |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 4 | 4 | 5 | 5 | 4 | 5 | 4 | 4 | 4 | 4 | 4 | 4 |

## Known limitations
- Motion not watched; please check on a phone.
- Final voice is the user's ElevenLabs take 2 (57.3 s), so the Reel is 60 s rather than the 45–55 s planned.
- Screenshot is a 21 Oct 2026 14:42 UTC snapshot; levels change hourly. Re-capture before a later release.
- Using CoinGlass's screenshot is editorial use with credit, not a licence.
- The 0.4% maintenance-margin figure comes from calculators, not Binance's own spec page; labelled as an illustration.

## Final verified artifact path
`output/liquidation-heatmap.mp4` (gitignored).
