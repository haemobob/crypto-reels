# QA report — mulai-konsisten

Retention audit result: PASS
Visual-quality audit result: PASS

## Part A — Brief check (wordless, the user's brief)
- [x] Matches the request: no voice, no script, purely graphics. Cryptonite colours, our logo, the user's chosen theme "waiting vs starting".
- [x] Truth and rights: no numbers, prices or promises on screen. Our own animation and sound; nothing taken from the reference video.
- [x] The narration, caption and payoff rules are set aside by the user's explicit brief (`retention-brief.md`).

## Part B — Visual-quality audit
**Stills, two rounds.** Fixes:
- the stage scaled 1.4× so the figures read on a phone;
- the timing tightened so the builder finishes at 10.4 s and the waiter stands for the last 1.8 s;
- the labels split onto two lines inside the safe area;
- the builder climbs down behind the wall, so the wall hides him.

**Encoded render 2:** two frames per second in `output/mulai-konsisten-review/r1-sheet.jpg` (render 1; render 2 changed only the sound levels).

- [x] **Layout:** labels at y 360–440 inside the safe area; the stage on a floor at 1360 with a soft reflection; logo bug top-left.
- [x] **Story reads without sound:** 48 bricks laid one by one; the waiter's lift, nudge, set and level cycle repeats eight times; the builder stands, looks back and leaves; the waiter stands and faces the wall.
- [x] **ffprobe:** 1080×1920, 30 fps, H.264 + AAC, 17.1 s, 510 frames (15 s scene + 2 s outro).
- [x] **Loudness (render 2):** −14.0 LUFS. True peak −0.8 dBTP, a little above the −1 dBTP target, from the brick-clack transients. The clacks were already lowered and a compressor added between render 1 and render 2.
- [x] **blackdetect:** only the outro (15.0–17.0 s).
- [x] **freezedetect (1.5 s):** no holds.
- [ ] **Motion watched in a full render:** **NOT REVIEWED** (frames only).
- [x] **Sound:** measured, not heard. Foley on the schedule's frames. **Not listened to.**

## Final verified artifact path
`output/mulai-konsisten.mp4` (render 2, 19 Nov 2026), 17.1 s, −14.0 LUFS.
- Cover: `output/mulai-konsisten-cover.png` / `.jpg`, plus `-cover-grid.jpg`.
