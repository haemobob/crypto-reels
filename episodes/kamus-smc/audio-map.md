# Audio map — Kamus SMC: 18 istilah di 1 chart Bitcoin

## Voice
- **Take (working voice):** Google Cloud TTS, Chirp 3 HD `id-ID-Chirp3-HD-Orus` (`voice.json`), from `narration.txt` with `[[rate:1.15]]`. `public/episodes/kamus-smc/narration.wav`, **79.53 s** (ffprobe). Cached in `voice-cache/`.
- **ElevenLabs alternative:** `elevenlabs-script.md` (same words, v3 tags, one take). Swap in with `npm run voice -- kamus-smc --audio <file>`, then `npx tsx scripts/score-kamus-smc.ts`; scenes, SFX and score are cue-keyed and re-time themselves. The 60–92 s window should hold an Ongky take (~85–90 s).
- **Alignment:** whisper.cpp small, aligned to the script: **176 of 178 words matched** ("concept" heard as "konsep", "SMC" as "SMTI"). Respellings for Orus in `pronunciations.json`: high → hai, break → brek, area → ariya, SMC → esemce (the aligner now accepts either the respelling or the original word, `scripts/align.ts`). **Not heard by ear**: listen to the English terms.
- **Cues (s):** hook 0.33 · chart 4.88 · count 6.82 · s1 9.02 · up 14.42 · s2 17.74 · choch 22.61 · s3 26.20 · ssl 29.88 · bsl 31.95 · eqh 33.85 · sweep 37.15 · idm 42.35 · s4 45.46 · fvg 49.82 · mitig 54.09 · open 56.32 · s5 59.77 · prem 65.03 · disc 66.77 · aug 68.77 · payoff 71.62 · caveat 75.88. Last word ends 79.22 s.
- **Cold-open checkpoints:** real chart from frame 0; the five stages at 6.8 s; stage 1 (LH/LL with dates) from 9.0 s.

## Score (original, synthesized)
`npx tsx scripts/score-kamus-smc.ts` → `public/episodes/kamus-smc/score.mp3` (320 kbps), shared `scripts/score-lib.ts`: no samples or third-party music; each layer set to a target loudness, the mix sidechain-ducked under the narration (threshold 0.025, 6:1, attack 30 ms, release 450 ms), cut 0.08 s after the last word.

| Layer | From → to | Target (LUFS, pre-duck) | What it does |
|---|---|---|---|
| Intro | hook → s1 | −29 | A minor 9 pad: the question |
| Struktur | s1 → s3 | −29 | F major 7 pad while structure and breaks are read |
| Liquidity | s3 → s4 | −29 | D minor pad: tension |
| Drone | s3 → s4 | −30 | Low A with overtones, growing under the stop piles |
| Riser | "nembus" − 0.6 s → "sweep" | −31 | A rising tone into the 1 Jul wick |
| Entry | s4 → s5 | −29 | C add9: opening up |
| Zones | s5 → payoff | −29 | G6 |
| Tick | s1 → payoff | −35 | 100 BPM eighths: the chart being read |
| Resolve | payoff → last word + 0.08 s | −27 | A major add9 with a short echo; cut to silence |

**Measured against the voice** (momentary loudness per cue section): the score sits **9.6–17.9 LU below the narration** in every section (closest: −9.6 LU at "Tiga, liquidity").

## Sound effects (`src/episodes/kamus-smc/Sound.tsx`, on on-screen events)
User's pack `public/sfx/newest/` (user-confirmed free to use, 21 Oct 2026).

| Moment | Frame | Sound (volume) |
|---|---|---|
| First frame | 0 | cinematic-boom-soft (0.24) |
| ORDER BLOCK / FVG / SWEEP land | their words | infographic-sound-effect-1 (0.16) ×3 |
| The pile-up of 18 labels | "pusing" | ui-glitchy-counter (0.12) |
| Labels clear | chart + 2 | transition-swoosh (0.16) |
| Five-stage index | count + 2 | ui-reveal (0.14) |
| Each stage starts | s1…s5 − 4 | whoosh-deep-short (0.16) ×5 |
| BOS / CHoCH | "break" + 4, choch + 10 | HUD 4 (0.12) ×2 |
| Piles grow | s3 + 8 | coins-money-drop (0.14) |
| Equal highs | eqh + 4 | HUD 1 (0.12) |
| The wick spears the pile | "nembus" − 6 / + 22 | deep-whoosh (0.20) / impact-bass-echo (0.22) |
| SWEEP | "sweep" − 2 | bass-drop-descend (0.18) |
| Inducement | idm + 6 | HUD 6 (0.12) |
| Order block | s4 + 10 | ui-reveal (0.14) |
| FVG | fvg + 6 | data-whoosh (0.16) |
| Gap still open | open + 4 | transition-swoosh (0.14) |
| Equilibrium | s5 + 30 | ui-reveal (0.12) |
| The 1 Aug bounce | aug + 6 | positive notification chord (0.12) |
| The four steps | "struktur", "liquidity", "sweep", "entry" | infographic-sound-effect-1 (0.16) ×4 |
| The rule | caveat − 4 | whoosh-and-hit-2 (0.16) |

## Mix
The render normalises the whole mix to −14 LUFS integrated, true peak about −1.5 dBTP (`scripts/render.ts`). Final-file measurements in `qa-report.md` Part B.
