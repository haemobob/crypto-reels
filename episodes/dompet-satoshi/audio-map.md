# Audio map — dompet-satoshi

- **Voice:** the user's ElevenLabs take (Eleven v3 per CLAUDE.md; the file name says "elevenlabs-v4"), "Ongky Himawan – Calm, Deep", supplied 19 Nov 2026 (`voice-cache/elevenlabs-take.mp3`). 75.31 s.
  - Cleanup: highpass 70 Hz, a gentle compressor, −18 LUFS, limiter.
  - Aligned with whisper.cpp: 178 of 180 words matched. "BTC" (the first) and "lo" are timed from their neighbours.
  - Heard as: "Kormat awal" (format, 52.2 s) and "melayankan" (melainkan, 67.9 s). This may be whisper mishearing; listen to these two words in the take.
- **Narration:** `public/episodes/dompet-satoshi/narration.wav`, 75.28 s (window 60–88 s).
- **Cues (s):** hook 0.02 · satoshi 5.29 · how 12.49 · still 22.89 · split 30.30 · digits 41.89 · quantum 49.61 · payoff 64.57.
- **Score:** `scripts/score-dompet-satoshi.ts` → `public/episodes/dompet-satoshi/score.mp3`. Original synthesis, ducked under the voice:
  - E minor pulse under the hack;
  - a cold C maj7 for Satoshi's coins;
  - an A minor add9 swell under the field;
  - a thin F-lydian pad under the caveat;
  - open G major under the payoff, cut after the last word.
- **SFX:** generated originals and the user's `newest` pack (`Sound.tsx`), placed on on-screen events: logo, document panels, chain nodes, X marks, the split boom, typing for the digits, the stamp.
- **Loudness:** render normalises to −14 LUFS.
