# Audio map — Semua merah. Uangnya ke mana?

## Voice
- **Take:** the user's ElevenLabs take (Eleven v3, "Ongky Himawan – Calm, Deep", from the intriguing, slow-opening `elevenlabs-script.md`; received 8 Nov 2026), 61.65 s. Original in `voice-cache/elevenlabs-take1.mp3`.
- **Edit (no words changed, no cuts):** highpass 60 Hz, gentle compression (2.5:1 from −22 dB), levelled to −18 LUFS, limiter (peak −1.0 dBFS) → `voice-cache/elevenlabs-take1-clean.wav` → `public/episodes/semua-merah/narration.wav`, **61.65 s**. No tag was read aloud and the pauses were already short (longest 0.48 s), so nothing was trimmed.
- **Superseded:** the Orus working voice (60.28 s); its captions are kept in `voice-cache/captions-orus.json`. An earlier urgent script read as angry and was replaced before a take was made.
- **Alignment:** whisper.cpp small: **147 of 151 words matched**; unmatched (interpolated between neighbours): two "ke" (heard as "kemana"), "Binance", "setengah". **Not heard by ear**: listen to "Binance", "leverage" and "cash".
- **Cues (s):** hook 0.07 · q 6.72 · myth 9.08 · trade 11.96 · swap 15.50 · price 17.20 · green 21.23 · bonds 22.93 · oil 27.78 · dollar 31.23 · why 33.49 · intel 36.93 · metals 40.39 · binance 44.64 · liq 49.12 · payoff 53.63 · check 57.64. Last word ends 61.52 s.

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
