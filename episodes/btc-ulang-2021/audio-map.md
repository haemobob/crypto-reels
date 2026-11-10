# Audio map — btc-ulang-2021

## Voice
- **Take (working voice):** Google Cloud TTS, Chirp 3 HD `id-ID-Chirp3-HD-Orus`, from `narration.txt` with `[[rate:1.1]]`. `public/episodes/btc-ulang-2021/narration.wav`, **64.44 s**.
- **ElevenLabs alternative:** `elevenlabs-script.md` (same words, v3 tags, the user's preferred intriguing read). Swap in with `npm run voice -- btc-ulang-2021 --audio <file>`, then `npx tsx scripts/score-btc-ulang-2021.ts`; everything is cue-keyed. Window 50–72 s.
- **Alignment:** whisper.cpp small: **162 of 165 words matched**; unmatched "dip" (heard "deep") and two "di". Respellings added for Orus (`pronunciations.json`): double → dabel, crash → kresy, rally → reli, pullback → pulbek, all → ol, time → taim. **Not heard by ear**: listen to the English terms.
- **Cues (s):** hook 0.40 · claim 5.07 · check 7.72 · order 9.41 · s1 10.77 · s2 11.70 · s3 12.36 · s4 13.08 · s5 14.00 · s6 14.93 · size 16.52 · crash 18.14 · rally 21.73 · speed 25.72 · retrace 28.14 · never 32.93 · level 36.03 · now 40.44 · ath 44.50 · one 48.29 · payoff 49.90 · verdict 56.72 · fail 60.36. Last word ends ≈ 64.4 s.

## Score (original, synthesized)
`npx tsx scripts/score-btc-ulang-2021.ts` → `public/episodes/btc-ulang-2021/score.mp3` (shared `scripts/score-lib.ts`, sidechain-ducked under the narration, cut 0.08 s after the last word). No samples.

| Layer | From → to | Target (LUFS) | What it does |
|---|---|---|---|
| Claim | hook → check | −29 | E minor add9: the question |
| Table | check → size | −30 | G major 7: the light table |
| Tick | order → size | −35 | 96 BPM tick while the steps are counted |
| Size | size → ath | −29 | C minor under the size difference and the level |
| Pulse | level → ath | −31 | Low heartbeat under "BTC is there now" |
| Caveat | ath → payoff | −31 | A minor, quieter |
| Resolve | payoff → last word + 0.08 s | −27 | E major with echo, cut to silence |

## Sound effects (`src/episodes/btc-ulang-2021/Sound.tsx`, on on-screen events)
User's pack `public/sfx/newest/` (user-confirmed free to use, 21 Oct 2026): soft boom (frame 0), data whoosh (chart draws), pop (claim), slide projector + paper (light table, sheet), a tick per step, paper + whoosh (sheet lands), bass drop (crash), reveal (rally), clock (speed), chalk slide ×2 (ruler), hit (level line), HUD (8 Nov low), swoosh (reframe to ATH), camera click (1 CONTOH stamp), whoosh-hit (verdict), button presses (three rows), chord (sama), HUD (kecil), reveal (condition).

## Mix
The render normalises the whole mix to −14 LUFS integrated, true peak about −1.5 dBTP (`scripts/render.ts`). Final-file measurements in `qa-report.md` Part B.
