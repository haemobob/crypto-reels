# QA report — nggak-nyerah-loop

Retention audit result: PASS
Visual-quality audit result: PASS

## Part A — Brief check (wordless loop, user's brief)
- [x] Matches the user's request: no voice, the reference's layout and story, Cryptonite colours, our logo, no CapCut watermark or third-party name.
- [x] Truth and rights: no statistics on screen (words instead of the reference's unsourced percentages); our own animation and sound, nothing taken from the reference video.
- [x] The narration/caption/payoff rules are set aside by the user's explicit brief (`retention-brief.md`).

## Part B — Visual-quality audit
Checked on stills during the build (14 frames; fix: the court now shows from frame 0 instead of fading in) and on the encoded MP4 (12 exact frames, `output/nggak-nyerah-loop-review/r1-check.jpg`).
- [x] Layout: three lanes 400 px apart; each ball arc stays inside its lane; labels clear of the arcs; logo bug top-left; brand line bottom.
- [x] Story reads without sound: lane 1 stops after one miss (ball left on the floor, figure slumped), lane 2 after four, lane 3 scores on the seventh shot (rim and net glow, label glows, jump with arms up).
- [x] ffprobe: 1080×1920, 30/1 fps, H.264 + AAC 48 kHz stereo, 15.1 s, 450 frames; −14.3 LUFS, −1.3 dBTP, LRA 2.7 LU.
- [x] blackdetect/freezedetect: only the outro.
- [ ] Motion watched in a full render: **NOT REVIEWED** (frames only).
- [x] Sound measured, not heard: foley on the schedule's frames; **not listened to**.

## Final verified artifact path
`output/nggak-nyerah-loop.mp4`, 15.1 s, 450 frames, −14.3 LUFS.
