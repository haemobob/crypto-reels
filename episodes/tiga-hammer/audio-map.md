# Audio map — tiga-hammer

## Voice
- **Take:** the user's ElevenLabs take (Eleven v3, "Ongky Himawan – Calm, Deep", Stability Natural), supplied 21 Nov 2026 → `voice-cache/elevenlabs-take.mp3` (58.75 s).
- **Cleanup:**
  1. ffmpeg highpass 70 Hz + gentle compressor;
  2. −18 LUFS;
  3. limiter 0.85;
  4. → `public/episodes/tiga-hammer/narration.wav`.
- **Duration (measured):** 58.72 s voice + 1.1 s tail + 2 s outro ≈ 61.8 s.
- **Alignment:** whisper.cpp small, aligned to `narration.txt`; 148 of 149 words matched (`captions.json`).
- **Pronunciation to check by ear:** whisper heard "chart" as "car" both times (about 2.3 s and 8.3 s). It may be the recogniser rather than the voice.

## Cues (s, measured)
hook 0.05 · pick 5.25 · a 11.10 · c 19.87 · b 25.50 · result 32.66 · twist 39.85 · payoff 49.15 · end 58.72

## Score (`scripts/score-tiga-hammer.ts`, original, synthesised)
| Section | From (s) | Music |
|---|---|---|
| Hook / pick | 0 | A-minor pluck pulse, 100 BPM |
| Insides A, C, B | 8.6 ("lima") | D-minor heartbeat, thinner |
| Result | 32.7 | C-major lift |
| Twist | 39.9 | thin bed + ticks |
| Payoff | 49.1 | G sus2, resolves under "batal" |

The score is cut at 58.8 s; the outro sting plays after.

## SFX (on events, `src/episodes/tiga-hammer/Sound.tsx`)
| Word / cue | Sound |
|---|---|
| frame 0 | soft cinematic boom |
| "sama" | pop when the candles stack, light whoosh when they part |
| "beli" | three pops, one per BELI pill |
| "lima" (1st) | deep whoosh (zoom seam), counter tick as the bars draw |
| "disapu" / "patah" / "kosong" | pop / pop / bass impact |
| cue c, cue b | short whooshes (whip seams) |
| "disapu" (2nd) | descending bass drop |
| "gagal" | switch click |
| "sapu" | data whoosh |
| "change" | whoosh and hit |
| result | riser before; positive chord on "naik"; pop on "nyaris"; bass drop on "sempat" |
| twist | soft boom; counter readouts as the grids light |
| "kendali" / "batal" | pop / bass impact |

All SFX are from `public/sfx/newest/` (user-cleared pack).

## Loudness
The render normalises to −14 LUFS integrated (two-pass loudnorm). True peak is measured in the QA report.
