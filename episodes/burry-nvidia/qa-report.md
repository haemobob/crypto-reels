# QA report — burry-nvidia

Both audits are done **before final rendering** (the user renders the final MP4). Update the two result lines; `npm run audit -- <id>` reads them and warns at render time while either is not PASS.

Retention audit result: PENDING
Visual-quality audit result: PENDING

## Part A — Retention audit (retention rules, Rules 3, 6, 9)

### Script audit (estimated timing; re-measure on the real voice)
- [x] 1. Hook: "Dalam sembilan hari, market kacau banget … Banyak yang rungkad. Tapi satu trader justru cuan besar" (0–12 s): the stake is the crash and who made money from it.
- [x] 2. Evidence by 5 s: real NVDA line with "12 NOV · CEO MUNDUR" and −27,7% rolling (≈3–5 s).
- [x] 3. First payoff by 12 s: who profited (Michael Burry, real photo, ≈11–12 s).
- [x] 4. Reason to continue: who → why him (2008) → his new bet → down first → profit → lesson; each answer opens the next.
- [x] 5. Concrete nouns: a price line, a dashed rail at the buy-in price, red = losing, green = winning, a draining bar for leverage. "Put" is defined on the 13F card ("untung kalau harga turun").
- [x] 6. Cut test: no headline repeats; 2008 section kept to 3 sentences.
- [x] 7. Promise/payoff: the opening asks how one trader profited amid the chaos; the ending shows how (in at $206.88, out at the low) and the timing that made people talk. Ending set by the user (no "pelajaran").
- [x] 8. Truth test: Burry's real profit is never stated; spoken "Hasil aslinya nggak dia umumkan" + on-screen "HASIL ASLINYA TIDAK DIUMUMKAN" and SIMULASI on the $100 M and 5× numbers. 50%/75% conflict avoided ("ambil untung"). Spy allegation not used. Ending: "banyak orang berspekulasi" is followed by the verified fact that he disclosed every move the same day; no claim or hint of advance information; closing question offers luck or instinct only. Wording tweaks: "Dalam sembilan hari" (window 11–20 Nov), "ketahuan dia taruhan lagi" (13F revealed 30 Sep positions).
- [x] 9. Silent test: headline + red −27,7%/−20,5% read muted; the rail with red/green gaps carries the trade muted.
- [x] 10. Share reason: a friend trading futures with leverage after the November drop.

### Viewer-value gate
- [x] Opening understandable within three seconds · [x] reason to care (BTC −20%) · [x] early payoff (who) · [x] each section adds information · [x] mechanism clear (rail) · [x] no removable sentence · [~] insight worth remembering: replaced by the user's speculation ending (user override, recorded) · [x] delivers the promise · [x] no follow/save/share request

### Retention ladder
- 3 s CEO resigned · 5 s −27,7% · 7 s BTC −20,5% · 12 s Burry · 15 s The Big Short · 18 s 2005 bet · 21 s 2008 · 23 s $700 M · 27 s 13F Nov 2025 · 30 s $206,88 · 35 s $243 · 38 s down first · 41 s $125 · 44 s took profit · 46 s result not disclosed · 50 s +$39,3 jt SIMULASI · 54 s same-day calls · 58 s 3 days, +31,5% · 63 s pas banget · 67 s disclosed the same day · 70 s luck or instinct.
- Re-hook at ≈33 s ("Tapi Nvidia malah naik … minus duluan"), paid at ≈41 s.

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

## Draft check (silent draft, ESTIMATED timing, ending reworked 24 Nov 2026)
- `output/burry-nvidia-silent.mp4`, 75.1 s incl. outro. Pace (outro excluded, 73.1 s): still 12.6%, longest still 1.17 s, events 27.1/min, median gap 2.17 s, max gap 5.2 s (47.2 s, SIMULASI card; 61.8 s and 54.8 s gaps 4.8/4.6 s; re-check on the real voice), first change 0.3 s.
- Stills checked across every beat and the new ending; preview stills in `previews/burry-nvidia/`. Motion NOT REVIEWED by watching; final checks wait for the real voice.
