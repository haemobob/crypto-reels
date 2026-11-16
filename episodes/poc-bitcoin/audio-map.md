# Audio map — poc-bitcoin

- **Take:** Google Chirp 3 HD Orus (working voice), `[[rate:1.1]]`, 59.89 s (window 50–72 s). Regenerated once on 16 Nov 2026 after two wording fixes ("rally terakhir" and "sejauh ini"). The ElevenLabs script is in `elevenlabs-script.md`, word for word.
- **Alignment:** 162 of 170 words matched. The unmatched words are the last phrase, "low Juli, lima puluh tujuh koma delapan ribu", which whisper wrote as "low-juli 57.8.000"; their timings are interpolated within the phrase. Respellings used: point → poin, control → kontrol, control-nya → kontrolnya, rally → reli. "low" has no respelling; whisper heard it as "low". **Not heard by ear.**
- **Cues (s):** hook 0.32 · nocoin 7.02 · poc 9.04 · summer 14.40 · bear 21.30 · rally 27.84 · stop 31.66 · drop 36.35 · hold 37.57 · why 43.59 · pay 48.79 · fail 54.49 · last word 59.90.
- **Score:** `scripts/score-poc-bitcoin.ts`, original synthesis (no samples), ducked under the voice:
  - an E minor add9 "question" under the hook;
  - A minor 7 with a soft tick while the profiles build;
  - C major under the rally;
  - D minor with a low pulse under the drop;
  - a steady G major 7 under the mechanism and the levels.
  - The score cuts after the last word.
- **SFX:** the user's pack (`public/sfx/newest/`, cleared 21 Oct 2026), placed on on-screen events (`Sound.tsx`): the ring hits, the profile reveals, the POC lines, the rally whoosh, the stop impact, the drop, the close-above chime, and the payoff hit.
