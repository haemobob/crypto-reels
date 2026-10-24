# Audio map — Bitcoin akan segera shutdown?

## Voice
- **Take:** the user's ElevenLabs take, voice "Ongky Himawan – Calm, Deep" (`ElevenLabs_2026-10-24T10_25_22_Ongky_Himawan_-_Calm__Deep_pvc_sp100_s80_sb0_v4.mp3`, 83.33 s), read from `elevenlabs-script.md`, which matches `narration.txt` word for word.
- **Edit** (`voice-cache/elevenlabs-take1-edit.wav` → `public/episodes/bitcoin-shutdown/narration.wav`, 84.77 s): five silences lengthened inside existing pauses, 1.44 s in all, for the brief's dramatic beats:

  | At (take, s) | Added | Why |
  |---|---|---|
  | 30.12 | 0.40 s | Near-silence after "…nggak bisa dibuka." |
  | 33.91 | 0.24 s | Held beat before "Bitcoin lo gimana?" |
  | 51.05 | 0.40 s | The blackout before "Tapi tunggu…" |
  | 52.03 | 0.18 s | Beat after "Tapi tunggu…" before the reveal |
  | 81.30 | 0.22 s | Quiet beat before the last line |

  Then: high-pass 60 Hz, gentle compression (−22 dB threshold, 2.5:1), loudness to about −18 LUFS. No words were cut or reordered.
- **Alignment:** `npm run voice -- bitcoin-shutdown --audio <edit>`. whisper.cpp small, aligned to the script: 185 words, 181 matched; word starts snapped out of detected silences (`silencedetect` −40 dB, 0.18 s). Whisper heard "SHUTDOWN" as "shut out": **check the pronunciation of "shutdown" by ear**.
- **Cues (s):** hook 0.07 · uk 2.37 · days 5.68 · ukinet 7.66 · php 9.38 · offline 15.81 · notend 19.52 · imagine 22.56 · pos 25.51 · atm 27.05 · bank 28.25 · question 30.72 · q2 32.75 · q3 34.76 · nocenter 36.28 · relay 38.83 · confirm 42.60 · local 43.97 · partition 47.45 · wait 52.32 · reveal 53.46 · key 55.48 · sat 59.96 · satsend 64.67 · exchange 68.68 · access 71.31 · sum 73.84 · final 77.65 · final2 80.90 · final3 82.92. Last word ends 84.84 s.

## Score (original, synthesized)
`npx tsx scripts/score-bitcoin-shutdown.ts` builds `public/episodes/bitcoin-shutdown/score.mp3` (320 kbps) from the cues above, so it re-times itself if the voice changes. No samples or third-party music. Each layer is measured and set to a target loudness, then the whole score is **sidechain-ducked under the narration** (threshold 0.025, 6:1, attack 30 ms, release 450 ms) so music stays below speech. Every tone carries overtones up to a few hundred hertz so it still reads on phone speakers.

| Layer | From → to | Target (LUFS, pre-duck) | What it does (brief §7) |
|---|---|---|---|
| Drone | 0 → question | −25 | A1 with overtones and a beating detune, slowly breathing: "low atmospheric drone" |
| Air | 0 → question | −42 | Band-passed pink noise: the dark room |
| Pulse | uk → imagine | −29 | 72 BPM low thump, building: "low-frequency pulse, controlled tension" under the UK notice |
| Server hum | php → pos | −30 | Mains hum and overtones: "server hum" |
| Tension | imagine → question | −28 | Minor second rubbing above the drone, growing under the outage simulation |
| Low tone | question → nocenter | −26 | The music drops out; one low E remains (scene 05) |
| Pulses | nocenter → wait | −28 | 120 BPM digital blips moving across the stereo field: "precise transaction pulses, subtle spatial movement" |
| Net pad | nocenter → wait | −31 | Thin A sus2 pad under the network |
| Escalate | local → wait | −27 | Slowly rising, beating tone: "escalation as connections fail" |
| — | wait − 0.55 s → reveal | silence | "Sudden silence": everything stops with the blackout |
| Reveal | reveal → exchange | −24 | Warm D major add9 with a shimmer and echo: "music changes from threatening to revelatory" |
| End drone | exchange → last word | −27 | Dark A/C ambience: "dark restrained ambience" |
| Heartbeat | sum → last word | −27, falling 70% | Slow lub-dub: "slow pulse"; fades under the last line |
| — | last word + 0.08 s | cut | "Cut to silence"; the outro is silent |

**Measured against the voice** (momentary loudness averaged per cue section, `tools/sections.py` in the session scratchpad): the score sits 7–19 LU below the narration in every section (closest: −7.2 LU in the "apa gunanya punya uang…" pause; −7.8 LU in the "dimatikan" beat), about 23 LU below in the blackout.

## Sound effects (placed in `src/episodes/bitcoin-shutdown/Sound.tsx`, on on-screen events)
Synthesized (`public/episodes/bitcoin-shutdown/sfx/`): disconnect, crackle, fail-beep, atm-chime, app-error, hop. Pack (`public/sfx/newest/`, user-confirmed licence) and `public/sfx/ping.wav`.

| Moment | Frame | Sound (volume) |
|---|---|---|
| First frame | 0 | cinematic-boom-soft (0.30) |
| Links snap on "SHUTDOWN" | word "shutdown" (f40) | impact-bass-echo (0.32), disconnect (0.35), crackle (0.22) |
| Line becomes the headline underline | uk − 12 | whoosh-deep-short (0.20) |
| GOV.UK document | uk + 2 | paper-movement-2 (0.25); typing (0.05, 2.5 s) as faint newsroom keys |
| 72 JAM monument | days − 4 | cinematic-boom-long (0.20) |
| Four services | ukinet | HUD 4 (0.14) |
| Digits dissolve into server lights | php | data-whoosh (0.24) |
| "Jutaan percobaan" | word "jutaan" | ui-glitchy-counter (0.20); HUD 6 warning (0.13) at +24 |
| NCSC card | offline + 4 | HUD 1 (0.13) |
| Six websites switched off | offline + 46 … + 71 | switch-click ×6 (0.14) |
| Into the failed site → terminal | pos − 52 / pos − 8 | metalic-riser (0.14) / whoosh-deep-short (0.22) |
| PAYMENT FAILED | pos + 3 | fail-beep (0.40) |
| Cut to the ATM | atm − 2 / atm + 4 | transition-swoosh (0.20) / atm-chime (0.30) |
| Bank app error | bank + 6 | app-error (0.40); then near-silence |
| Bank app becomes a wallet | question + 6 | ui-reveal (0.12) |
| CONNECTED → DISCONNECTED | q2 + 6 | disconnect (0.32) |
| Push on "Bitcoin lo gimana?" | q3 + 1 / word "gimana" | whoosh-deep-short (0.22) / bass-drop-descend (0.24) |
| Into the network | nocenter − 6 | deep-whoosh (0.24) |
| Three hops (Jakarta → Singapore → Mumbai → Frankfurt) | relay + 6, + 36, + 68 | hop (0.28) each |
| Confirmed in a block | confirm | positive notification chord (0.18) |
| Your connection drops | local + 14 | disconnect (0.30) |
| Long links break | partition + 18 | crackle (0.20), impact-bass-echo (0.18) |
| Transaction frozen | partition + 40 | ui-glitchy-counter (0.12) |
| Blackout | wait − 26 → reveal | silence |
| "Bitcoin lo nggak otomatis hilang" | reveal | bell-ring-idea (0.30): the memorable sound |
| The key | key + 4 | jail-lock-2 (0.16, cut to 1 s) |
| The chain of real blocks | kepemilikan − 8 | data-whoosh (0.18) |
| Tilt up the beam into space | sat − 24 | whoosh-deep-light (0.22) |
| Broadcast cone | sat + 26 | HUD 4 (0.12) |
| Ground dish receives | sat + 114 | ping (0.20) |
| Send is blocked (one-way) | satsend + 34 | fail-beep (0.25) |
| Custody comparison | exchange | transition-swoosh (0.18) |
| Exchange servers fail | access + 4 | app-error (0.32) |
| Pull-back into the global network | sum | whoosh-deep-light (0.16) |
| The coin rises | sum + 40 | cinematic-boom-soft (0.18) |
| Last line | final3 → end | no effects; score cut after the last word |

## Mix
The render normalises the whole mix to −14 LUFS integrated, true peak about −1.5 dBTP (`scripts/render.ts`). Final file: −14.1 LUFS, −1.3 dBTP, LRA 2.9 LU; silences only where scripted (51.8–52.3 s, 52.9–53.4 s) and after the last word.
