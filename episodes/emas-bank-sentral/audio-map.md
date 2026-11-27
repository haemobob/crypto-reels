# Audio map — emas-bank-sentral

- Voice: see voice.json; take measured by npm run voice
- Duration (measured):
- Cue times: captions.json
- Music / SFX cue points and licences:

## Voice (27 Nov 2026)
- Take: the user's ElevenLabs v3 MP3 ("Ongky Himawan – Calm, Deep"), 87.72 s, read word for word.
- Cleanup: 12 pauses longer than 0.6 s shortened to 0.6 s (the "Tapi…" hang after "puncaknya" kept at 0.85 s); speech untouched. 84.09 s.
- Alignment: whisper.cpp small, 172/178 words matched (97%); unmatched (placed between neighbours): dua, pertiganya, resmi, Gold, mana, pun.
- Cues: hook 0.15 · fast 8.52 · slow 29.50 · dip 48.55 · why 56.19 · payoff 70.73 s.

## Music and effects
- Score: original, synthesized (scripts/score-emas-bank-sentral.ts), ducked under the voice, cut after the last word.
- Effects: the 52-sound pack in public/sfx/newest (licence basis in its manifest), on camera moves, numbers and objects (Sound.tsx).
