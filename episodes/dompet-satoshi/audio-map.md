# Audio map — dompet-satoshi

- **Voice:** the user's ElevenLabs take (Eleven v3 per CLAUDE.md; the file name says "elevenlabs-v4"), "Ongky Himawan – Calm, Deep", supplied 19 Nov 2026 (`voice-cache/elevenlabs-take.mp3`). 75.31 s.
  - Cleanup: highpass 70 Hz, a gentle compressor, −18 LUFS, limiter.
  - Aligned with whisper.cpp: 178 of 180 words matched. "BTC" (the first) and "lo" are timed from their neighbours.
  - Heard as: "Kormat awal" (format, 52.2 s) and "melayankan" (melainkan, 67.9 s). This may be whisper mishearing; listen to these two words in the take.
- **20 Nov 2026 cut (user: the "how Binance was hacked" beat is outdated filler):** 12.30–22.66 s was removed from the same take, cutting inside the pauses on both sides with 30 ms fades (`voice-cache/elevenlabs-take-cut.mp3`). It was re-cleaned and re-aligned: 153 of 157 words matched; whisper heard "Satoshi" as "satu shi" twice, and those words, plus "BTC" and "lo", are timed from their neighbours.
- **Narration:** `public/episodes/dompet-satoshi/narration.wav`, 64.92 s (window 60–88 s).
- **Cues (s):** hook 0.02 · satoshi 5.29 · still 12.53 · split 19.94 · digits 31.53 · quantum 39.25 · payoff 54.21.
- **Score:** `scripts/score-dompet-satoshi.ts` → `public/episodes/dompet-satoshi/score.mp3`. Original synthesis, ducked under the voice:
  - E minor pulse under the hack;
  - a cold C maj7 for Satoshi's coins, held until the split;
  - an A minor add9 swell under the field;
  - a thin F-lydian pad under the caveat;
  - open G major under the payoff, cut after the last word.
- **SFX:** generated originals and the user's `newest` pack (`Sound.tsx`), placed on on-screen events: logo, document panels, chain nodes, X marks, the split boom, typing for the digits, the stamp.
- **Loudness:** render normalises to −14 LUFS.
