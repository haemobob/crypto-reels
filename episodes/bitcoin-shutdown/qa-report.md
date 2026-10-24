# QA report — bitcoin-shutdown

Both audits are done **before final rendering** (the user renders the final MP4). Update the two result lines; `npm run audit -- <id>` reads them and warns at render time while either is not PASS.

Retention audit result: PENDING
Visual-quality audit result: PENDING

## Part A — Retention audit (retention rules, Rules 3, 6, 9)

### Script audit (before voice generation; quote exact lines and timestamps)
- [ ] 1. Hook: a stranger can say what is at stake —
- [ ] 2. Evidence: the proof that appears by second 5 —
- [ ] 3. First payoff: the useful answer delivered by second 8–12 —
- [ ] 4. Reason to continue: each answer leads to a genuine next question —
- [ ] 5. Concrete nouns: a 12-year-old can picture the mechanism without jargon —
- [ ] 6. Cut test: removed every line that repeats the headline, delays explanation, asks an empty rhetorical question or adds irrelevant context —
- [ ] 7. Promise/payoff: the ending answers the opening —
- [ ] 8. Truth test: no proposal, prediction or allegation can be mistaken for completed fact (first frame and wording) —
- [ ] 9. Silent test: first 3 s legible muted; an explanation beat's diagram carries the relationship muted —
- [ ] 10. Share reason: a real person this would be useful to —

### Viewer-value gate (directive §10, before animation)
- [ ] Opening understandable within three seconds
- [ ] The audience has a reason to care
- [ ] A meaningful early payoff
- [ ] Each section contributes new information (answers a question, reveals a mechanism, creates the next question)
- [ ] The central mechanism is explained clearly
- [ ] No sentence can be removed without reducing understanding
- [ ] The final insight is worth remembering (practical check / mental model / distinction / warning)
- [ ] The viewer would feel the video delivered what it promised
- [ ] No follow/save/share request; the payoff is the last content beat

### Retention ladder
- [ ] A concrete fact, reveal or causal step about every 5–10 s (list them with times)
- [ ] Generic bridges ("Tapi tunggu dulu", "Dan bukan cuma itu") replaced with specific ones
- [ ] No second intro at 8–15 s; caveats sit at the claim, not only at the end
- [ ] Final frame answers or echoes the first question; CTA and brand ending short

### Rejection gates (any YES = rewrite before animating)
- [ ] Hook's promised consequence cannot be supported
- [ ] First frame lacks an understandable subject/stake
- [ ] Opening is only an animated logo or meaningless 3D
- [ ] Nothing recognisably real (photo, logo, chart, document) in the first 3–8 s
- [ ] No tangible proof or educational return by ~8–12 s
- [ ] Script repeats context or pads with generic questions
- [ ] Animation is a deck of disconnected diagrams, not a causal story
- [ ] Final answer does not fulfil the first question

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
