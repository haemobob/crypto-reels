# Audio map — Bitcoin sekarang mirip 2023?

- **Voice (final, 21 Oct 2026)**: ElevenLabs take supplied by the user, voice "Ongky Himawan – Calm, Deep" (file `ElevenLabs_2026-10-21T08_17_38_Ongky_Himawan_-_Calm__Deep_pvc_sp100_s80_sb0_v4_1.mp3`, kept locally in `voice-cache/`), imported with `npm run voice -- btc-mirip-2023 --audio <file>`. Reads `narration.txt` word for word. (Earlier Google Chirp 3 HD Orus takes are superseded.)
- **Measured**: `narration.wav` 53.39 s (ffprobe). Video file 56.1 s (0.6 s tail + 2 s outro).
- **Word timings**: whisper.cpp 1.7.5 `small`, aligned to `narration.txt`: 119/120 words matched on the ElevenLabs take; "di-reclaim" (heard "diri klaim", an Indonesian-style reading) interpolated. Cue times in `captions.json`.
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

- **Mix**: render normalises to −14 LUFS integrated; true peak −1.1 dBTP (ElevenLabs render). Measured balance: most beats with effects are at or below voice-only level; the depth bass drop is ~2 dB above it. Levels measured, not listened to.
