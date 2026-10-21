# Audio map — Bitcoin sekarang mirip 2023?

- **Voice**: Google Cloud TTS `id-ID-Chirp3-HD-Orus`; rate 1.06, key-level section (23.6–42.4 s) at 1.0 for clarity; pauses 0.2/0.3 s before "menarik" and before the closing line. Takes cached in `voice-cache/`.
- **Measured**: `narration.wav` 52.12 s (ffprobe). Video file 54.8 s (0.6 s tail + 2 s outro).
- **Word timings**: whisper.cpp 1.7.5 `small`, aligned to `narration.txt`: 119/120 words matched; "di-reclaim" (heard "diri klaim", an Indonesian-style reading) interpolated. Cue times in `captions.json`.
- **Music**: none. No generated or licensed bed exists yet; the voice carries the piece, SFX mark the beats.
- **SFX** (generated originals, `npm run audio`, no licences needed): hit f0 (0.3) and f1271 (0.28); whoosh f30, f705, f961, f1467; tick on each phase/annotation cue; ping when each level line draws (f715, f1001).
- **Mix**: render normalises to −14 LUFS integrated; true peak ≈ −1.2 dBTP measured on the 21 Oct render.
