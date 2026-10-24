# Audio map — JPMorgan: Bitcoin 10% per tahun, tapi 55%

## Voice
- **Take (working voice):** Google Cloud TTS, Chirp 3 HD `id-ID-Chirp3-HD-Orus` (`voice.json`), synthesised from `narration.txt` with `[[rate:1.12]]`. Cached in `voice-cache/` by text and settings. `public/episodes/jpmorgan-bitcoin/narration.wav`, **61.86 s** (ffprobe).
- **ElevenLabs alternative:** `elevenlabs-script.md` has the same words with v3 delivery tags for one continuous take. To swap it in: `npm run voice -- jpmorgan-bitcoin --audio <file>`, then `npx tsx scripts/score-jpmorgan-bitcoin.ts`. Scenes, SFX and score are keyed to cues, so they re-time themselves; the 45–62 s window in `episode.json` may need widening if the take is slower.
- **Alignment:** whisper.cpp small, aligned to the script: **151 of 151 words matched** (percentages and decimals are expanded to spoken Indonesian before matching, `scripts/align.ts`); word starts snapped out of detected silences. Pronunciation: `return` → "ritern" (`pronunciations.json`; whisper heard "written" before the fix). **Not heard by ear in this session**: listen for "JPMorgan", "volatilitas" and "return".
- **Cues (s):** hook 0.41 · now 3.02 · report 7.73 · race 10.18 · stocks 11.82 · gold 13.97 · catch 15.93 · vol 18.66 · drag 23.07 · down 25.45 · up 26.78 · loss 28.09 · avg 30.28 · keep 33.04 · range 35.00 · bull 38.41 · bear 39.93 · real 42.52 · low 47.42 · model 50.09 · payoff 54.03 · ticket 55.95 · check 58.24. Last word ends 61.80 s.
- **Cold-open checkpoints:** contradiction stated by 3.0 s ("penipuan" → "Sekarang"), the real report on screen at 3.0 s, the first answer (10% / 7.5% / 5.5%) from 10.2 s; the next question ("angka kedua") at 15.9 s.

## Score (original, synthesized)
`npx tsx scripts/score-jpmorgan-bitcoin.ts` builds `public/episodes/jpmorgan-bitcoin/score.mp3` (320 kbps) with the shared `scripts/score-lib.ts`: no samples or third-party music. Each layer is set to a target loudness, then the mix is **sidechain-ducked under the narration** (threshold 0.025, 6:1, attack 30 ms, release 450 ms) and cut 0.08 s after the last word. Tones carry overtones so they read on phone speakers. Noise seeds are fixed, so a rebuild is identical.

| Layer | From → to | Target (LUFS, pre-duck) | What it does |
|---|---|---|---|
| Pad | 0 → catch | −28 | Soft D minor 9, slowly breathing: intrigue under the claim and the report |
| Tick | race − 0.2 s → catch | −33 | Light 120 BPM eighths while the podium rises |
| Drone | catch → range | −29 | Low A with overtones: the second number |
| Ride | catch + 0.3 s → range | −31 | A tone whose pitch swings up and down like the track |
| Fan | range → real | −28 | Airy A major add9 that opens up as the scenarios fan out |
| Real | real → model | −28 | The pad drops out; one low E with a slow tremolo under the real chart |
| Resolve | model → last word + 0.08 s | −27 | Warm D major with a short echo; cut to silence |

**Measured against the voice** (momentary loudness averaged per cue section; "phone" = the same with a 300 Hz high-pass): the score sits **9.3–20.0 LU below the narration** in every section. Closest: −9.3 LU in "Dan naik turun itu makan hasil" and −9.4 LU under the podium numbers (the tick).

## Sound effects (placed in `src/episodes/jpmorgan-bitcoin/Sound.tsx`, on on-screen events)
User's pack `public/sfx/newest/` (user-confirmed free to use, 21 Oct 2026).

| Moment | Frame | Sound (volume) |
|---|---|---|
| First frame | 0 | cinematic-boom-soft (0.26) |
| FRAUD stamp slams | 3 | impact-bass-echo (0.22) |
| Stamp tears off | now − 1 | paper-wrapper-rip-2 (0.30) |
| The report appears | now + 4 | paper-movement-2 (0.20) |
| Highlights on the title | report + 4 | ui-reveal (0.14) |
| Report drops, podium comes up | race − 12 | whoosh-deep-short (0.18) |
| Each step rises | race − 2, stocks − 2, gold − 2 | infographic-sound-effect-1 (0.20) ×3 |
| "Angka kedua" | catch | bass-drop-descend (0.20) |
| Crane over the podium | catch + 6 | deep-whoosh (0.20) |
| Cart on the ride | vol (4 s) | wheel-spin (0.08) |
| Stack of 100 builds | drag + 4 | coins-money-drop (0.22) |
| −50% | down | data-whoosh (0.18) |
| +50% | up + 2 | coins-money-drop (0.20) |
| −25% | loss | HUD 6 (0.14) |
| Ghost of the average rises | avg (1 s) | metalic-riser (0.11) |
| Ghost evaporates to 10% | keep | transition-swoosh (0.18) |
| Into the scenario fan | range − 2 | whoosh-deep-light (0.18) |
| Good scenario lands | bull + 26 | positive notification chord (0.14) |
| Bad scenario falls | bear + 4 | bass-drop-descend (0.20) |
| Flip to the real chart | real | slide-projector-9 (0.24) |
| The low | low | impact-bass-echo (0.16) |
| Coin stays outside the model | model + 14 (1 s) | jail-lock-2 (0.14) |
| Back to the podium | payoff − 4 | whoosh-and-hit-2 (0.18) |
| The final question | check + 4 | deep-whoosh (0.16) |

## Mix
The render normalises the whole mix to −14 LUFS integrated, true peak about −1.5 dBTP (`scripts/render.ts`). Final-file measurements are in `qa-report.md` Part B.
