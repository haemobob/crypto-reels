# Audio map — JPMorgan: Bitcoin 10% per tahun, tapi 55%

## Voice
- **Take:** the user's ElevenLabs take, voice "Ongky Himawan – Calm, Deep", Eleven v3 (`ElevenLabs_2026-10-26T06_25_09_Ongky_Himawan_-_Calm__Deep_pvc_sp100_s80_sb0_v4.mp3`, 68.44 s, mono 44.1 kHz, −24.3 LUFS), read from `elevenlabs-script.md`, which matches `narration.txt` word for word. Kept in `voice-cache/elevenlabs-take1.mp3`.
- **Clean-up** (`voice-cache/elevenlabs-take1-edit.wav` → `public/episodes/jpmorgan-bitcoin/narration.wav`, **68.44 s**): high-pass 60 Hz, gentle compression (−22 dB threshold, 2.5:1), +9.9 dB to −18 LUFS, peak limiter at −1 dBFS, 48 kHz. No pauses changed, no words cut or reordered (the take's own held beats are kept).
- **Window:** `episode.json` widened from 45–62 s to 45–70 s for this take.
- **Alignment:** `npm run voice -- jpmorgan-bitcoin --audio <edit>`. whisper.cpp small, aligned to the script: **151 of 151 words matched**; word starts snapped out of detected silences. Whisper heard "Mas, 5,5" for "Emas, lima koma lima" and "Scenario-nya" for "Skenarionya": **listen to "Emas"** (it may be clipped). The last line was heard as a statement: check that "lo kuat nahan?" sounds like a question.
- **Cues (s):** hook 0.09 · now 3.67 · report 8.62 · race 11.35 · stocks 13.11 · gold 15.39 · catch 17.35 (the 55 is spoken at 20.12) · vol 21.89 · drag 25.48 · down 27.54 · up 28.79 · loss 30.06 · avg 31.95 · keep 34.91 · range 37.46 · bull 41.27 · bear 43.32 · real 46.59 · low 51.93 · model 54.36 · payoff 58.26 · ticket 61.02 · check 63.69. Last word ends 68.36 s.
- **Cold-open checkpoints:** contradiction stated by 3.7 s ("penipuan" → "Sekarang"), the real report on screen at 3.7 s, the first answer (10% / 7.5% / 5.5%) from 11.4 s; the next question ("angka kedua") at 17.4 s.
- **Earlier working voice:** Google Chirp 3 HD Orus at rate 1.12 (61.86 s), kept in `voice-cache/narration-orus.wav` and `captions-orus.json`.

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

**Measured against the voice** (momentary loudness averaged per cue section; "phone" = the same with a 300 Hz high-pass): the score sits **10.2–21.6 LU below the narration** in every section on the ElevenLabs take. Closest: −10.2 LU in the held beat before "lima puluh lima persen", −10.6 LU under the last question.

## Sound effects (placed in `src/episodes/jpmorgan-bitcoin/Sound.tsx`, on on-screen events)
User's pack `public/sfx/newest/` (user-confirmed free to use, 21 Oct 2026).

| Moment | Frame | Sound (volume) |
|---|---|---|
| First frame | 0 | cinematic-boom-soft (0.26) |
| FRAUD stamp slams | 3 | impact-bass-echo (0.22) |
| Stamp tears off | now − 10 | paper-wrapper-rip-2 (0.30) |
| The report appears | now + 4 | paper-movement-2 (0.20) |
| Highlights on the title | report + 4 | ui-reveal (0.14) |
| Report drops, podium comes up | race − 12 | whoosh-deep-short (0.18) |
| Each step rises | race − 2, stocks − 2, gold − 2 | infographic-sound-effect-1 (0.20) ×3 |
| "lima puluh lima persen" (the 55 appears) | word "lima" #4 | bass-drop-descend (0.20) |
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
