# QA report — semua-merah

Both audits are done **before final rendering** (the user renders the final MP4). Update the two result lines; `npm run audit -- <id>` reads them and warns at render time while either is not PASS.

Retention audit result: PENDING
Visual-quality audit result: PENDING

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
