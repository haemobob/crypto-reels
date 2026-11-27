# QA report — emas-bank-sentral

Both audits are done **before final rendering** (the user renders the final MP4). Update the two result lines; `npm run audit -- <id>` reads them and warns at render time while either is not PASS.

Retention audit result: PASS
Visual-quality audit result: PENDING

## Part A — Retention audit (retention rules, Rules 3, 6, 9)

### Script audit (estimated timing; re-measure on the real voice)
- [x] 1. Hook: "Harga emas sudah anjlok sepertiga dari puncaknya. Tapi bank sentral dunia justru memborong. Kenapa?" (0–6 s): the contradiction is the stake.
- [x] 2. Evidence by 5 s: the real gold chart (daily closes) on the billboard from frame 0, −32% on the ground.
- [x] 3. First payoff by 8–12 s: who sells (fast money, speculators).
- [x] 4. Reason to continue: who sells → why (yield) → who buys → the hidden part → did they keep buying in the fall → why → what it means.
- [x] 5. Concrete nouns: a tower pouring gold, a bond building, crates of bars, wrapped crates, a convoy, signs.
- [x] 6. Cut test: the reference's euro comparison and "second-biggest reserve asset" detail dropped.
- [x] 7. Promise/payoff: "Kenapa?" is answered (time horizon + dollar-share view), with the caveat that buying didn't stop the fall.
- [x] 8. Truth test: the 63% is labelled an estimate ("sisanya perkiraan World Gold Council"); China's October buy is "terbesar dalam setahun" (the reference's "two years" corrected); the bonds sentence states yields, not a proven flow.
- [x] 9. Silent test: ground text carries every number; the chart is real.
- [x] 10. Share reason: a friend who panicked about their gold.

### Viewer-value gate: all YES (see retention-brief.md). No follow/save/share request.

### Retention ladder
2 s −32% · 4 s buyers · 8 s fast money · 15 s $9,3 bn · 19 s bonds 5% vs 0% · 28 s 321 t · 30 s +42% · 34 s ⅔ unreported · 35 s 120 t reported · 41 s October −7% · 43 s China +26 t · 48 s 3 of 4 · 52 s dollar share · 54 s can't default · 60 s buying ≠ immune · 64 s fast money · 67 s patient buyer.

### Rejection gates: none triggered.

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
- [ ] Pace (`npm run pace -- <id>`): still time __% (≤ 25%) · longest still __ s (≤ 1.5 s; thesis holds listed) · median event gap __ s (≤ 2.5 s), max __ s (≤ 4 s) · first change __ s (≤ 1 s)
- [ ] Living frame: every shot has a moving world, a subject acting, and words that land and hold. Seams have causes, using 3–5 kinds. No void with floating cards, no fade-in-and-park, no breathing loops (`reel-motion` skill).
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

## Draft check (silent draft, ESTIMATED timing, 26 Nov 2026)
- `output/emas-bank-sentral-silent.mp4`, 71.3 s incl. outro, 1080×1920 (dpr 2 supersampled). Pace (outro excluded, 69.3 s): still 19.2%, longest still 1.17 s, events 41.6/min, median gap 1.43 s, max gap 2.9 s, first change 0.1 s. PASS on every pace target.
- Re-render 27 Nov 2026 (fixed lanes, convoys in gaps, chute stream): still 7.4%, longest still 1.03 s, events 41.6/min, median gap 1.47 s, max gap 2.57 s, first change 0.1 s. PASS. Frames at the fixed spots (4.5, 5.5, 11.5, 12.5, 41.5, 43, 44.5, 66.5 s) checked: no overlapping trucks, gold stays on the chute.
- Contact sheet checked at 1 fps. Motion NOT REVIEWED by watching; final checks wait for the real voice.

## Render with voice (27 Nov 2026)
- `output/emas-bank-sentral.mp4`: 87.0 s, 1080×1920, 30 fps, H.264 + AAC; −14.0 LUFS integrated, peak −1.5 dBFS; `validate` passed.
- Pace (outro excluded, 84.9 s): still 6.5%, longest still 1.37 s, events 32.5/min, median gap 1.97 s, max gap 4.13 s (49.9–54.0 s, the October convoy; 0.13 s over the 4 s target), first change 0.1 s.
- Contact sheet at 1 fps checked. Motion measured by the pace tool, NOT watched; Visual-quality audit stays PENDING until the user reviews the render (Gate 3).
