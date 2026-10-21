# QA report — Bitcoin sekarang mirip 2023?

Both audits are done **before final rendering** (the user renders the final MP4). Update the two result lines; `npm run audit -- <id>` reads them and warns at render time while either is not PASS.

Retention audit result: PASS
Visual-quality audit result: PASS (stills and transition frames; motion NOT REVIEWED)

## Part A — Retention audit (retention rules, Rules 3, 6, 9)

### Script audit (before animation; times measured from `captions.json`, take of 21 Oct 2026, 52.1 s)
- [x] 1. Hook: a stranger can say what is at stake. 0.3 s "Bitcoin sekarang terlihat mirip struktur tahun dua ribu dua puluh tiga" + on-screen BITCOIN SEKARANG MIRIP 2023? with both charts. Stake: does the 2023 recovery pattern apply now.
- [x] 2. Evidence by second 5: both real weekly charts (Binance data, same log scale) on screen from ~1.5 s.
- [x] 3. First payoff by 8–12 s: 4.3 s "Bukan berarti hasilnya pasti sama", then at 9.0–13.5 s the first matching phases (titik rendah, konsolidasi, breakout) on both charts. Useful answer: the similarity is in sequence, not outcome.
- [x] 4. Reason to continue: similar? (0–9 s) → which parts? (9–21 s) → what is different? (21 s "Bedanya, sekarang jauh lebih dangkal") → what mattered in 2023? (23.6 s) → which level now? (32.1 s) → what if it fails? (39.4 s).
- [x] 5. Concrete nouns: titik rendah, puncak, minggu kedua belas, dua puluh lima ribu dolar, delapan puluh tujuh ribu dolar; each shown as a marker or line on the chart. "Pullback", "breakout", "reclaim" are defined by what the chart does at the moment they are said.
- [x] 6. Cut test: removed from the base script "Di dua periode ini", "harganya … mengalami", "memantul" (not a separate phase in the data), "area yang sama ada di". No line repeats the headline; no empty rhetorical questions.
- [x] 7. Promise/payoff: opening asks whether BTC is "mirip 2023"; ending answers: similar in sequence and timing, validated only by the level ("Tapi buat tahu level mana yang benar-benar penting", 45.5 s; "chart yang mirip… belum tentu hasilnya sama", 49.0 s).
- [x] 8. Truth test: headline carries a question mark; "Bukan berarti hasilnya pasti sama" within 4.3 s; the depth difference is stated (21.2 s); paths after week 16 on the current chart are labelled SKENARIO; data date on screen.
- [x] 9. Silent test (script level): every claim has an on-screen counterpart (phase labels, week numbers, %, level lines, SKENARIO). Verified on stills in Part B.
- [x] 10. Share reason: the friend who forwards "history repeats" charts; this gives them the one level to check.

### Viewer-value gate (directive §10, before animation)
- [x] Opening understandable within three seconds
- [x] The audience has a reason to care
- [x] A meaningful early payoff
- [x] Each section contributes new information
- [x] The central mechanism is explained clearly
- [x] No sentence can be removed without reducing understanding
- [x] The final insight is worth remembering (mental model: pola = konteks, level = validasi)
- [x] The viewer would feel the video delivered what it promised
- [x] No follow/save/share request; the payoff is the last content beat

### Retention ladder
- [x] A concrete fact, reveal or causal step about every 5–10 s: 1.5 s charts; 4.3 s caveat; 9.0 s low; 11.1 s base; 12.3 s breakout; 14.2 s pullback; 16.2 s week 12; 19.4 s week 15; 21.2 s depth difference; 23.6/29.3 s 2023 reclaim and $25K; 32.1 s $87K; 35.8/39.4 s both outcomes; 42.4 s takeaway.
- [x] Generic bridges replaced: "Setelah itu", "Bedanya", "Sekarang" each introduce a new fact.
- [x] No second intro at 8–15 s; caveat sits at the claim (4.3 s), not only at the end.
- [x] Final frame answers the first question; outro ≤2 s, no CTA.

### Rejection gates (any YES = rewrite before animating)
- [ ] Hook's promised consequence cannot be supported: NO
- [ ] First frame lacks an understandable subject/stake: NO (frame 0: BITCOIN SEKARANG MIRIP 2023? alone on black)
- [ ] Opening is only an animated logo or meaningless 3D: NO
- [ ] Nothing recognisably real in the first 3–8 s: NO (real BTC chart data)
- [ ] No tangible proof or educational return by ~8–12 s: NO
- [ ] Script repeats context or pads with generic questions: NO
- [ ] Animation is a deck of disconnected diagrams: NO (one persistent two-panel stage; every beat builds on the same charts)
- [ ] Final answer does not fulfil the first question: NO

## Part B — Visual-quality audit (motion-design rules, sections 4–8, and CLAUDE.md layout rules)

Checked on: rendered stills (`npm run still -- btc-mirip-2023 --frames …`) across every beat, and stills pulled from the encoded MP4 at every transition before/mid/after (`output/btc-mirip-2023-review/transitions.jpg`). The video was **not watched in motion**.

### Layout (CLAUDE.md)
- [x] No text over graphics: headlines, legend and source line have their own zones; in-chart labels sit in clear space (fixed: level/reclaim labels that crossed 2023 candles moved; week "15"/"16" collision fixed).
- [x] Nothing darkens, crops or covers the graphics for text (the chart stage is a fixed window the camera moves inside; zooms are framing, not cover).
- [x] Source images: n/a (charts drawn from data).
- [x] Opening title centred, rising in, no tag above it, no logo intro before the hook; corner logo bug on screen from frame 0 alongside the title (user decision, 21 Oct 2026).

### Opening (cryptonite-openings.md)
- [x] Statement (0 s) → real data (1.5 s) → designed comparison (4.3 s) → annotation (9 s).
- [x] Highest available asset level: real chart data (3).
- [x] Opening motion restrained: candle build, ≤1.04× push-in, trace; the hero move waits until 32 s.
- [x] Sources logged; no third-party logos or photos.

### Demonstration and sound-off (directive §6–8)
- [x] Every graphic demonstrates the spoken point: phases, week guides, depth, levels, scenarios.
- [x] Muted: the headline zone and legend carry the argument; numbers on screen.
- [x] Simulated paths labelled SKENARIO A/B and "BUKAN PREDIKSI" while shown; nothing hypothetical drawn before week 16 or as candles.
- [x] Real data used throughout; nothing faked.

### Evidence and editorial
- [x] All claims sourced (`sources.md`, `research.md`); data date on screen.
- [x] Conditional claims visibly conditional.
- [x] No CTA; "Bukan nasihat finansial" on the closing frame.

### Runtime and implementation
- [x] Duration measured: narration 52.12 s; MP4 54.8 s (user target 40–55 s).
- [x] ffprobe: 1080×1920, 30/1, H.264 + AAC.
- [x] No black frames (blackdetect), no missing assets; render validated by `npm run render`.
- [x] Safe zones: key content within x 90–990, y 384–1555.
- [x] Numbers on screen match `chart-data.json` and `research.md` ($15,476 · $57,800 · $25,250 · $87,396 · $82,893 · −22.6% · −8.7% · 17 Mar 2023 · $31,000).
- [x] Loudness −14.2 LUFS, true peak −1.2 dBTP; low hits lowered after measuring them above the voice.

### Visual and sound inspection
- [x] Stills across every beat; every transition before/mid/after; first frame and outro at full resolution.
- [ ] Motion watched in a full render: **NOT REVIEWED**. Easing, camera smoothness and sync were only checked frame by frame.
- [x] Sound cues placed on narration cues (from `captions.json`); levels measured, not listened to.
- [x] One dominant visual per beat.
- [x] Camera moves motivated: push-ins on the claim, zoom into 2023 for the reclaim, one hero move to today.
- [x] Polarity: black analysis, one off-white thesis flip.
- [x] Brand: blue dominant, fonts, logo bug, outro.

## Scores (1–5; any score below 4 → targeted revision and re-check)
| Hook | First 12 s | Real-world opening | Educational payoff | Reward ladder | Understanding | Hierarchy | Camera | Transitions | Rhythm | Brand | Factual accuracy |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 4 | 4 | 4 | 5 | 4 | 4 | 4 | 4 | 4 | 4 | 4 | 5 |

Camera, transitions and rhythm are scored from stills; they need a look in motion before release.

## Known limitations
- Motion not watched. Please watch the MP4 on a phone before posting: camera easing, the hero move at 32 s and caption sync.
- No music bed. SFX now come from the user-supplied pack (licence on the user's confirmation, not independently verified); placement and levels were measured, not listened to.
- Chirp 3 HD has no emotion tags: the "slightly dramatic / firmer" delivery relies on wording, pauses and rate.
- Data is a 21 Oct 2026 snapshot; re-check before a later release (`data/chart-data-notes.md`).
- The reference video wasn't available here; its $72.5K level was not used (not supported by current data).

## Fixes completed and rechecked
- Panel titles clipped by the early push-in → titles lowered, push-ins capped (rechecked f128–410).
- Week labels 15/16 collided → 16 hidden once 15 is marked.
- 2023 level/reclaim labels over candles → price above the label, reclaim date moved to the headline zone.
- Level label "~$87.396" → exact "$87.396" on the chart, "~$87.400" in the headline.
- Low-hit SFX louder than the voice → lowered.
- SFX swapped to the user's pack (21 Oct): re-rendered; −14.2 LUFS, −1.3 dBTP; effects measured 0.4–1.7 dB above voice-only passages.

## Final verified artifact path
`output/btc-mirip-2023.mp4` (render of 21 Oct 2026; gitignored; re-render with `make-video.bat btc-mirip-2023`).
