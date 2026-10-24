# QA report — jpmorgan-bitcoin

Both audits are done **before final rendering** (the user renders the final MP4). Update the two result lines; `npm run audit -- <id>` reads them and warns at render time while either is not PASS.

Retention audit result: PENDING
Visual-quality audit result: PENDING

## Part A — Retention audit (script on the working Orus voice, 61.9 s; times from captions.json)

### Script audit
- [x] 1. **Hook:** 0.4 s "Bos JPMorgan dulu nyebut Bitcoin penipuan." → 3.0 s "Sekarang, JPMorgan justru memproyeksikan Bitcoin ngalahin saham dan emas." The stake (is Bitcoin now the better bet than stocks and gold?) is clear by 3 s.
- [x] 2. **Evidence by 5 s:** the real 2027 LTCMA cover (J.P. Morgan Asset Management, 19 Oct 2026) from 3.0 s; Dimon's 2017 quote credited from frame 0.
- [x] 3. **First payoff by 8–12 s:** 10.2 s "sepuluh persen per tahun", 11.8 s "Saham Amerika, tujuh koma lima", 14.0 s "Emas, lima koma lima".
- [x] 4. **Reason to continue:** numbers (10.2 s) → "angka kedua yang jarang dibahas: lima puluh lima persen" (15.9 s) → what it means (18.7 s) → why it eats returns (23.1 s) → 20.9% vs 10% (30.3 s) → the rupiah range (35.0 s) → real proof (42.5 s) → JPMorgan's own caution (50.1 s) → the check (54.0–61.9 s).
- [x] 5. **Concrete nouns:** podium, rollercoaster track, a stack of 100 coins halving, Rp10 juta, a price chart; "volatilitas" is defined in plain words at 18.7 s.
- [x] 6. **Cut test:** the first draft (76 s) lost "Di laporan proyeksi jangka panjangnya", "di proyeksi itu", "Dan ini", "Turun lebih dari separuh"; nothing repeats the headline.
- [x] 7. **Promise/payoff:** "ngalahin saham dan emas?" → yes on return, at the price of 55% volatility; ends on the viewer's own check.
- [x] 8. **Truth test:** "memproyeksikan" (projects), not "memastikan"; on screen PROYEKSI · BUKAN JAMINAN at the numbers; scenarios and Rp outcomes labelled SIMULASI and attributed; the −50%/+50% example labelled ILUSTRASI; JPMorgan's own refusal to allocate is stated.
- [x] 9. **Silent test:** headlines carry each turn (DULU "PENIPUAN". SEKARANG JUARA? · 10% / 7,5% / 5,5% · 55% = VOLATILITAS · −50% +50% = −25% · 20,9% → 10% · RP48 JT ATAU RP3,6 JT · $126K → $58K · BELUM MASUK PORTOFOLIO · RETURN = HADIAH, VOLATILITAS = HARGA TIKET); verify on stills in Part B.
- [x] 10. **Share reason:** the friend who forwards "JPMorgan: Bitcoin beats gold" as a reason to go all in, or the one who only buys gold.

### Viewer-value gate
- [x] Understandable in 3 s · reason to care · early payoff (10 s) · each section adds information · mechanism explained (drag, 23–35 s) · no removable sentence · insight worth keeping (hadiah vs harga tiket + self-check) · delivers the promise · no follow/save/share request.

### Retention ladder
0.4 contradiction · 3.0 the forecast · 7.7 first time · 10.2 / 11.8 / 14.0 the three numbers · 15.9 the second number · 18.7 definition · 23.1 swings eat returns · 25.5–28.1 −50 +50 = −25 · 30.3 / 33.0 20.9% → 10% · 35.0–39.9 Rp48 jt or Rp3,6 jt · 42.5 / 47.4 $126K → $58K · 50.1 JPMorgan keeps it out · 54.0 / 56.0 hadiah / harga tiket · 58.2 the check.

### Rejection gates
- [x] Unsupported consequence: NO · first frame lacks stake: NO · logo/3D-only opening: NO (real quote from frame 0, real report from 3 s) · nothing real by 3–8 s: NO · no return by 8–12 s: NO (10.2 s) · padding: NO · disconnected diagrams: NO (one podium world carries numbers → tracks → drag → 20.9%→10%) · ending doesn't answer the opening: NO.

## Part B — Visual-quality audit (motion-design rules, sections 4–8, and CLAUDE.md layout rules)

### Layout (CLAUDE.md)
- [ ] No text over graphics in any frame, including camera moves and crossfades
- [ ] Nothing darkens, crops or covers the graphics to make room for text
- [ ] Source images shown whole first, then zoomed only on the narrated part
- [ ] Opening title centred, rising in; no date/press tag above it; no logo before the hook

### Opening (cryptonite-openings.md)
- [ ] Statement → real anchor → designed card/diagram → abstract graphics, in that order
- [ ] Highest available level of the asset hierarchy used (real photo/logo/document over abstract)
- [ ] Opening motion restrained: push-ins, card reveals, light sweeps, reframing; no hero move or spectacle
- [ ] Each real asset sourced in `sources.md` (origin, date, licence basis); third-party logos/photos unaltered, no implied endorsement; news-style panels don't imitate a publisher's masthead

### Demonstration and sound-off (directive §6–8)
- [ ] Every important graphic demonstrates the spoken mechanism; decorative animation removed
- [ ] Main idea understandable muted: headlines, progressive labels, visible cause and effect, uncrowded
- [ ] Simulations labelled SIMULASI/ILUSTRASI on screen while shown; nothing simulated passes as real market data
- [ ] Real assets used where they add credibility; missing ones were requested, not faked

### Evidence and editorial
- [ ] All claims sourced; event dates and date checked recorded
- [ ] Conditional claims are visibly conditional
- [ ] CTA factually represents an existing asset or offer

### Runtime and implementation
- [ ] Duration measured from audio and render
- [ ] Output 1080×1920, 30fps, intended codecs (verified by ffprobe)
- [ ] No missing assets, 0-frame/negative-length clips, scene gaps, or audio tails
- [ ] Safe zones and fonts checked at mobile preview size
- [ ] Numbers and labels verified, including qualifiers

### Visual and sound inspection
- [ ] Stills across every beat; every transition before/mid/after; first 3 s and last 2 s at full resolution
- [ ] Motion watched in a full render: YES / NOT REVIEWED (never claim motion was checked from stills alone)
- [ ] Sound synchronized to emphasis and narration intelligible
- [ ] Single dominant visual concept per beat
- [ ] Camera move meaningfully motivated
- [ ] Polarity switches have semantic purpose
- [ ] Brand consistency and licensed assets checked

## Scores (1–5; any score below 4 → targeted revision and re-check)
| Hook | First 12 s | Real-world opening | Educational payoff | Reward ladder | Understanding | Hierarchy | Camera | Transitions | Rhythm | Brand | Factual accuracy |
|---|---|---|---|---|---|---|---|---|---|---|---|
| | | | | | | | | | | | |

## Known limitations

## Fixes completed and rechecked

## Final verified artifact path
