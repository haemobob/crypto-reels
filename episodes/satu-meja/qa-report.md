# QA report — satu-meja

Retention audit result: PASS
Visual-quality audit result: PASS

## Part A — Retention audit (script; estimated timing, no voice yet; 19 Nov 2026)
- [x] 1. **Hook:** "Tiga negara dengan senjata nuklir terbanyak di dunia, untuk pertama kalinya duduk di satu meja." Title: "TRUMP, PUTIN, XI: SATU MEJA".
- [x] 2. **Evidence by 5 s:** the real Kremlin photo from 0.9 s; the SIPRI card at "nuklir".
- [x] 3. **First payoff by 8–12 s:** where and when (Shenzhen, 19 Nov, APEC), who, then the declaration adopted (about 11 s).
- [x] 4. **Reason to continue:** "Tapi di luar ruangan itu, peta dunia sedang bergeser." → Japan → Russian diesel → Europe and Palantir → Macron and Ukraine → Russian aircraft → Chinese ships → "Belum tentu… niat, bukan perjanjian" → what to watch.
- [x] 5. **Concrete nouns:** a table, a map, pins, planes, ships, people's faces.
- [x] 6. **Cut test:** every line is one verified event. Removed: the unverified hug, missile timing and Pentagon warning, plus the "follow us" CTA.
- [x] 7. **Promise/payoff:** "one table" → "is this a new world order? Not necessarily. A declaration is intent, not a treaty."
- [x] 8. **Truth test:**
  - "dilaporkan" (reportedly) for Japan, plus "LAPORAN · BELUM FINAL" on its card.
  - "diduga" (suspected) for the aircraft.
  - "menurut pejabat Taiwan" (according to Taiwanese officials) for the ships.
  - "Bulan lalu" (last month) for the October diesel deal.
  - Illustrative routes and positions are labelled ILUSTRASI.
  - The Macron and Fuji photos are marked as 2024 archive shots.
- [x] 9. **Silent test:** headlines carry each shift; the map, pins and cards show where.
- [x] 10. **Share reason:** the friend who forwards "new world order" posts.

### Rejection gates
- [x] None triggered.

### Re-check on the user's ElevenLabs take (62.7 s, 139/139 words)
- Hook at 0.1 s.
- Real photo at 0.9 s.
- SIPRI card at 1.6 s.
- First answer, the declaration, at 12.4 s.
- Payoff at 52.0 s; callback to the opening photo at 58.5 s.

## Part B — Visual-quality audit

**Stills, two rounds.** First round: headlines and micro captions sat on bright map imagery. Fixed by putting the map in its own window (740–1270) with text on navy above it. Also fixed:
- three-line headlines reworded;
- the Palantir label was off-screen;
- the "AS" tag was cut off;
- China's gold fill was too heavy in the Shenzhen close-up;
- Macron cropped from a group photo;
- the 2024 archive credit;
- the SIPRI evidence card added.

**Draft MP4** (estimated timing) was sent to the user before the voice arrived.

**Render 1** (ElevenLabs take):
- 14 key frames on the real timing checked before the render.
- Encoded file: one frame per second in `output/satu-meja-review/r1-sheet.jpg`.

**Checks:**
- [x] **Layout:** micro captions at y ≈ 384; headlines centred at 590 on navy; map window 740–1270; cards and portraits 1290–1500; source line at 1534. No text on the map except in-world pins and tags.
- [x] **Real people and places:**
  - Kremlin.ru meeting photos (CC BY 4.0, credited on screen);
  - EU photo of Macron (CC BY 4.0, "ARSIP 2024");
  - US Marines photo over Fuji (public domain, "2024");
  - NASA satellite map and Natural Earth borders (public domain).
- [x] **Illustrations labelled:** "RUTE: ILUSTRASI", "JALUR: ILUSTRASI", "ILUSTRASI POSISI" / "POSISI KAPAL: ILUSTRASI".
- [x] **Camera:** map flights land on each place as it is named. Hero pull-back at "Tapi di luar ruangan itu".
- [x] **ffprobe:** 1080×1920, 30/1 fps, H.264 + AAC 48 kHz stereo, 65.3 s, 1,958 frames; −14.1 LUFS, −1.3 dBTP.
- [x] **blackdetect:** only the outro (63.3–65.2 s).
- [x] **silencedetect:** only after the last word (62.7 s).
- [x] **freezedetect (2 s):** two holds of 2.7 s and 3.1 s, while a photo or card is read.
- [ ] **Motion watched in a full render:** **NOT REVIEWED** (frames only).
- [x] **Sound:** measured, not heard. **Not listened to:** "Xi Jinping", "Shenzhen", "Palantir", "Macron", "software".

## Scores
| Hook | First 12 s | Real-world opening | Educational payoff | Reward ladder | Understanding | Hierarchy | Camera | Transitions | Rhythm | Brand | Factual accuracy |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 5 | 5 | 5 | 4 | 5 | 4 | 4 | 4 | 4 | 4 | 4 | 5 |

## Known limitations
- No real video. The Kremlin had not published Shenzhen video when checked (19 Nov). The Japan MoD site was blocked from the build container, so the aircraft beat uses the map.
- Japan's figure is a report ("dilaporkan", "LAPORAN · BELUM FINAL"); no final agreement.
- The story moves fast; the data is as of 19 Nov 2026.

## Final verified artifact path
`output/satu-meja.mp4` (render 1, the user's ElevenLabs take, 19 Nov 2026): 65.3 s, 1,958 frames, −14.1 LUFS, −1.3 dBTP.
- Subtitles: `episodes/satu-meja/satu-meja.srt`.
- Cover: `output/satu-meja-cover.png` / `.jpg`, plus `-cover-grid.jpg`.
- Draft (estimated timing, no voice): `output/satu-meja-draft.mp4`.
