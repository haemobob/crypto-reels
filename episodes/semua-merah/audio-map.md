# Audio map — Semua merah. Uangnya ke mana?

## Voice
- **Take (working voice):** Google Cloud TTS, Chirp 3 HD `id-ID-Chirp3-HD-Orus`, from `narration.txt` with `[[rate:1.12]]`. `public/episodes/semua-merah/narration.wav`, **60.28 s**.
- **ElevenLabs alternative:** `elevenlabs-script.md` (same words, v3 tags). Swap in with `npm run voice -- semua-merah --audio <file>`, then `npx tsx scripts/score-semua-merah.ts`; everything is cue-keyed. Window 45–72 s.
- **Alignment:** whisper.cpp small: **144 of 151 words matched**. Respellings for Orus (`pronunciations.json`, lowercase keys): cash → kes, yield → yild, leverage → leverej, binance → bainens. Whisper still heard "leverage" as "lefresh": **listen to it**.
- **Cues (s):** hook 0.38 · q 6.00 · myth 7.74 · trade 10.64 · swap 14.12 · price 15.99 · green 19.87 · bonds 21.59 · oil 26.94 · dollar 30.60 · why 33.02 · intel 36.39 · metals 39.82 · binance 44.43 · liq 48.90 · payoff 52.50 · check 56.78.

## Score (original, synthesized)
`npx tsx scripts/score-semua-merah.ts` → `public/episodes/semua-merah/score.mp3` (shared `scripts/score-lib.ts`, sidechain-ducked under the narration, cut 0.08 s after the last word). No samples.

| Layer | From → to | Target (LUFS) | What it does |
|---|---|---|---|
| Red | hook → trade | −29 | D minor pad under the red board |
| Pulse | hook → trade | −31 | Low heartbeat (80 BPM) |
| Trade | trade → green | −30 | Lighter F major 7 |
| Green | green → why | −28 | A major add9: not everything was red |
| Why | why → payoff | −29 | C minor pad |
| Tick | why → payoff | −35 | 100 BPM tick under the triggers |
| Resolve | payoff → last word + 0.08 s | −27 | Warm D major with echo, cut to silence |

**Measured against the voice:** 11.5–19.3 LU below the narration in every section.

## Sound effects (`src/episodes/semua-merah/Sound.tsx`)
User's pack `public/sfx/newest/` (user-confirmed free to use).

| Moment | Frame | Sound (volume) |
|---|---|---|
| First frame | 0 | cinematic-boom-soft (0.24) |
| Each red tile | hook + 4, "emas", "perak", "bitcoin" | HUD 6 (0.12) ×4 |
| The question | q − 2 | deep-whoosh (0.18) |
| The CASH box | myth + 4 | ui-reveal (0.14) |
| Strike / trade | trade − 2 / + 24 | switch-click (0.16) / coins-money-drop (0.18) |
| Money changes hands | swap + 10 | cash-register-1 (0.12) |
| Lower price | price + 10 | bass-drop-descend (0.14) |
| Pull-back reveal | green − 2 | whoosh-deep-light (0.20) |
| Green tiles | bonds, oil, "energi" + 2 | positive chord (0.10) ×3 |
| Dollar | dollar + 2 | HUD 1 (0.12) |
| Triggers | why − 2; intel/metals/binance + 6 | transition-swoosh (0.16); impact-bass-echo (0.14) ×3 |
| Liquidations | liq + 4 | ui-glitchy-counter (0.12) |
| The check | payoff − 4; "hijau", "terpaksa" | whoosh-and-hit-2 (0.16); infographic (0.16) ×2 |

## Mix
Render normalises to −14 LUFS integrated, true peak ≈ −1.5 dBTP. Final measurements in `qa-report.md` Part B.
