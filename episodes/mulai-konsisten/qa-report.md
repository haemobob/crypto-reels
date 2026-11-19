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

**Render 3 (user note, 19 Nov 2026: "why is it floating… it looks so unnatural"):** in renders 1–2 the builder stood behind the wall on an invisible platform, with his legs showing through the gaps. Rebuilt:
- he now stands on the bricks he has laid. For each row he lays the bricks around him, steps up onto the new row, then lays the brick he stood on;
- the wall is 11 rows, at a calmer 6 frames per brick;
- he is drawn in front of the wall, so his feet always rest on a brick top;
- on top he turns and waves down at the waiter, who finally stands up, so there is no jump off the frame edge;
- the cover is now frame 386 (builder on the finished wall), with the waiter frozen at 372 (level on).

**Render 4 (user note, 19 Nov 2026: "why 3 centre then suddenly becomes even"):** the staggered rows were faked. They were full bricks shifted half a brick, clipped at the wall edge, with a left half brick that only popped in when the row was done. So a row being built looked like three centred bricks that suddenly snapped flush. Rebuilt as a real running bond:
- each odd row is a half brick, three full bricks and a half brick, so both ends are flush at every moment;
- he carries and places each brick at its true size (half bricks are smaller in his hands);
- before stepping up he lays every brick not under his feet, then steps onto the nearest full brick of the new row, then lays the one or two bricks where he stood;
- 49 bricks in all;
- no clipping anywhere.

**Encoded render 4:** a zoomed sheet of the wall at four frames per second, `output/mulai-konsisten-review/r4-wall.jpg`. Both ends are flush in every frame, and his feet are always on a brick top or the floor.

- [x] **Layout:** labels at y 360–440 inside the safe area; the stage on a floor at 1360 with a soft reflection; logo bug top-left.
- [x] **Story reads without sound:** 49 bricks (running bond, half bricks at the ends) laid one by one, with the builder rising on each row he lays; the waiter's lift, nudge, set and level cycle repeats; the builder turns and waves from the top; the waiter stands.
- [x] **ffprobe:** 1080×1920, 30 fps, H.264 + AAC, 17.1 s, 510 frames (15 s scene + 2 s outro).
- [x] **Loudness (render 4):** −14.0 LUFS, true peak −0.9 dBTP. That is a little above the −1 dBTP target, from the brick-clack transients. For render 4 the clacks were lowered again and the score limiter set to 0.6; render 3 measured −0.6 dBTP.
- [x] **blackdetect:** only the outro (15.0–17.0 s).
- [x] **freezedetect (1.5 s):** no holds.
- [ ] **Motion watched in a full render:** **NOT REVIEWED** (frames only).
- [x] **Sound:** measured, not heard. Foley on the schedule's frames. **Not listened to.**

## Final verified artifact path
`output/mulai-konsisten.mp4` (render 4, 19 Nov 2026), 17.1 s, 510 frames, −14.0 LUFS.
- Cover: `output/mulai-konsisten-cover.png` / `.jpg`, plus `-cover-grid.jpg`.
