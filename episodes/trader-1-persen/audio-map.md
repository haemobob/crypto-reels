# Audio map — trader-1-persen

## Voice
- **Take (working voice):** Google Cloud TTS, Chirp 3 HD `id-ID-Chirp3-HD-Orus`, `[[rate:1.08]]`. `public/episodes/trader-1-persen/narration.wav`, **30.93 s**.
- **ElevenLabs alternative:** `elevenlabs-script.md` (same words, v3 tags). Swap in with `npm run voice -- trader-1-persen --audio <file>`, then `npx tsx scripts/score-trader-1-persen.ts`; everything is cue-keyed. Window 25–40 s.
- **Alignment:** whisper.cpp small: **81 of 81 words matched**. **Not heard by ear**: listen to "trader", "day trading", "futures" (respelled) and "Brasil" (whisper heard "berasil").
- **Cues (s):** hook 0.41 · study 4.73 · one 9.60 · mid 13.00 · long 17.64 · trend 20.44 · learn 23.52 · payoff 25.66. Last word ends ≈ 30.9 s.

## Score (original, synthesized)
`npx tsx scripts/score-trader-1-persen.ts` → `public/episodes/trader-1-persen/score.mp3`: D minor 7 pad with a 90 BPM low "dribble" pulse under the court (hook → trend), a darker B♭ minor pad under the pattern, an F major resolve under the check, cut 0.08 s after the last word; sidechain-ducked under the voice. No samples.

## Sound effects (`src/episodes/trader-1-persen/Sound.tsx`)
User's pack `public/sfx/newest/` (user-confirmed free to use, 21 Oct 2026): soft boom (frame 0), soft clicks on each throw in the opening, paper (study card), counter (19.646), whoosh (lanes), a chime on each of lane 1's makes (computed from the same shot schedule as the picture), HUD (lane 2), bass drop (lane 3), data whoosh (bars), HUD (no learning), whoosh-hit (check), reveal ("positif").

## Mix
Normalised to −14 LUFS integrated by the render; final-file measurements in `qa-report.md` Part B.
