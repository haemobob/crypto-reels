# Audio map — Bitcoin sekarang mirip 2023?

- **Voice**: Google Cloud TTS `id-ID-Chirp3-HD-Orus`; rate 1.06, key-level section (23.6–42.4 s) at 1.0 for clarity; pauses 0.2/0.3 s before "menarik" and before the closing line. Takes cached in `voice-cache/`.
- **Measured**: `narration.wav` 52.12 s (ffprobe). Video file 54.8 s (0.6 s tail + 2 s outro).
- **Word timings**: whisper.cpp 1.7.5 `small`, aligned to `narration.txt`: 119/120 words matched; "di-reclaim" (heard "diri klaim", an Indonesian-style reading) interpolated. Cue times in `captions.json`.
- **Music**: none. No generated or licensed bed exists yet; the voice carries the piece, SFX mark the beats.
- **SFX** (library `public/sfx/newest/`, licence basis: user confirmation 21 Oct 2026, see its README; volume is relative to a −3 dBFS peak):

| Frame / cue | Sound | Inferred source | Vol | Why |
|---|---|---|---|---|
| f0 | cinematic-boom-soft | Freesound | 0.28 | Weight under the opening title |
| f28 | data-whoosh | Unknown | 0.25 | Title moves up, charts arrive |
| f48 | mountain-audio-computer-data-readout… | Artlist | 0.18 | Candles build |
| caution +12 | ui-reveal | Unknown | 0.25 | Price trace draws |
| bottom, base, breakout, "kuat", pullback | ui-clicks-notification-pop | Unknown pack | 0.30 | Each numbered phase lands |
| timing, timing2 | hud-electronic-interface-sfx-pack-4 | Unknown | 0.26 | Week guides |
| depth | bass-drop-descend | Epidemic Sound | 0.30 | The pullback-depth figures |
| key2023 | whoosh-deep-short | Freesound | 0.30 | Zoom into 2023 |
| key2023 +8, keynow +40 | melodic-linear-2 | Unknown | 0.20 | A level line draws |
| key2023 +60 | ni-sound-cute-interface-bubble-pop… | Artlist | 0.24 | Green reclaim ring |
| keynow, +4 | transition-swoosh, whoosh-deep-light | Unknown, Freesound | 0.35, 0.20 | Hero move |
| reclaim +8 | infographic-sound-effect-1 | Unknown | 0.25 | Scenario A path |
| fail +6 | bass-drop-descend | Epidemic Sound | 0.26 | Scenario B path |
| takeaway | impact-bass-echo | Unknown | 0.24 | Polarity flip to the thesis |
| closing −6 | whoosh-and-hit-2 | Unknown | 0.24 | Back to the charts |

- **Mix**: render normalises to −14 LUFS integrated; true peak −1.3 dBTP. Measured balance: beats with effects are 0.4–1.7 dB louder (mean) than voice-only passages, so effects sit under the narration. Levels measured, not listened to.
