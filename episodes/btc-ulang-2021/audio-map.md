# Audio map — btc-ulang-2021

## Voice
- **Take:** the user's ElevenLabs take (Eleven v3, "Ongky Himawan – Calm, Deep", from the intriguing `elevenlabs-script.md`; received 11 Nov 2026), 69.33 s. Original in `voice-cache/elevenlabs-take1.mp3`.
- **Edit (no words changed, no cuts):** highpass 60 Hz, gentle compression (2.5:1 from −22 dB), levelled to −18 LUFS, limiter (peak −1.2 dBFS) → `voice-cache/elevenlabs-take1-clean.wav` → `public/episodes/btc-ulang-2021/narration.wav`, **69.28 s**. No tag read aloud; no pause longer than 0.45 s, so nothing was trimmed.
- **Superseded:** the Orus working voice (64.44 s); its captions are kept in `voice-cache/captions-orus.json`.
- **Alignment:** whisper.cpp small: **163 of 165 words matched**; unmatched "dip" (heard "deep") and one "di", interpolated between neighbours. **Not heard by ear**: listen to "dip" and the English terms.
- **Cues (s):** hook 0.09 · claim 6.67 · check 10.09 · order 11.64 · s1 13.04 · s2 14.02 · s3 14.77 · s4 15.38 · s5 16.65 · s6 17.73 · size 19.07 · crash 20.86 · rally 24.54 · speed 28.54 · retrace 31.51 · never 37.02 · level 40.23 · now 44.62 · ath 48.57 · one 52.48 · payoff 54.52 · verdict 61.03 · fail 64.89. Last word ends 69.2 s.

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
