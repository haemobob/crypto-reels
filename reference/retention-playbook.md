# Cryptonite retention playbook: hook, story, motion, transitions, assets (20 Nov 2026)

Why this exists: the user's verdict on the first ten Reels. They are going in the right direction but "don't feel alive" and aren't enticing enough to stop a swipe and hold to the end. Goal: **Reels people keep watching**, not just good-looking ones.

## Sources
- `reference/0x100x-reference-study.md`: three 0x100x Reels (Fink, Buffett, gold), read at one frame per second.
- **HyperFrames motion and story references** (heygen-com/hyperframes, `skills/hyperframes/references/motion.md`, `story.md`, `types/vertical.md`, `types/explainer.md`, `types/data.md`, `review.md`, `sound.md`). Craft numbers measured frame by frame from professional films. The user's 20 Oct decision already says these skills win on style. The plugin wasn't installed in recent sessions, so the restrained-camera rule kept winning by default.
- **Our own renders, measured with `npm run pace`** (new, below).
- **Limitation:** Instagram and YouTube now block anonymous downloads, so no new 0x100x video could be pulled from here. To calibrate the targets on their real cuts, put 5–10 of their Reels as MP4 in the repo or a Drive folder and run `npm run pace -- <file.mp4>` on each.

## 1. What we measured (`npm run pace`, outro excluded, main zone y 470–1500, captions and logo excluded)

| Reel | Still time | Still stretches > 1.5 s | Longest still | Visual events | Median gap / max gap |
|---|---|---|---|---|---|
| dompet-satoshi (65 s) | **55.5%** | 8 | 3.1 s | 24.7 / min | 2.3 s / 6.1 s |
| satu-meja (63 s) | **54%** | 10 | 3.7 s | 22.8 / min | 3.1 s / 6.3 s |
| mulai-konsisten (15 s, wordless) | 9% | 0 | 0 s | 4 / min | one continuous shot, nothing new for 15 s |
| 0x100x site clip (8 s of live footage) | 1% | 0 | 0 s | — | live footage is never still |

**Reading:** in our explainers the picture is frozen more than half the time. Each element pops in, then parks until the next cue. That is the "not alive" feeling, measured.

## 2. Diagnosis: the tells in our Reels
1. **Pop and park.** Every element enters with the same 10-frame fade and 26 px slide-up (`life()`), then stands still. HyperFrames lists "everything fading and sliding up" as the first tell of a generated film.
2. **One entrance for everything.** Cards, chips, photos and headlines all enter the same way, so the rhythm is monotone even when the content changes.
3. **Slide-show seams.** Beats change by fading one panel out and another into the same spot. No object carries across, no camera move links the two, and nothing on screen causes the cut. ("It feels like slides" → "enter the next scene through an object on screen; cut a move mid-flight.")
4. **A void with floating cards.** A navy or black ground with small panels in the middle third. No world, depth, texture or footage. The subject often fills only 30–50% of the frame, which the study read as restraint, but without motion it reads as emptiness.
5. **A locked camera.** V2 §4 ("restrained by default, one or two hero moves per minute") made almost every shot a locked frame. It contradicts the user's 20 Oct decision (continuous-camera doctrine).
6. **Story momentum.** Scripts are dense lists of facts, with few spoken re-hooks after the opening. Process detail that isn't the answer reads as filler (the user cut the Binance "how" beat for this reason). Open loops close fast and no new ones open.
7. **Thin sound.** Synthesised pads with no pulse or beat grid, so cuts have nothing to land on. Effects are on some events, not every one.
8. **Real assets used as slides.** Screenshots and documents sit still in windows. No footage, no parallax, no scrolling of a real interface.

## 3. What 0x100x does (from the three-video study)
- **Hook:** the first frame is a word plus a recognisable subject (Buffett's portrait inside a perspective cone; "$7.6 TRILLION" on gold bars), and something changes inside the first second. The spoken number and an on-screen counter land together ($26B → $183B → $340B → $373B within 4–8 s).
- **Pattern interrupt at 8–10 s:** a near-empty frame with one line ("You should pay attention."). It resets attention once the hook has paid out.
- **Spoken re-hooks every 15–35 s:** "Let us explain" (~14 s), "And here is what almost nobody is pricing in" (~30 s), "And here is the part nobody is talking about" (~65 s). Each promises a bigger reveal, and the next 10–20 s pay it.
- **Polarity flips at argument turns, every 4–20 s** (Buffett: 11 flips in 103 s). Never on a timer.
- **Concept-as-object chains:** money → coin piles → house "For Sale" → IPO building. The same object returns with a new meaning (a callback).
- **The world moves while the line holds:** globes turn, counters climb, charts grow, piles assemble, the camera eases in. The title is still once landed.
- **Real footage as punctuation:** 1–3 s of archival B-roll (helicopters, soldiers) framed inside the designed world. Real portraits identify authorities.
- **Long runtimes (85–138 s) still hold**, because motion and re-hooks never stop. Length isn't the problem; dead time is.

## 4. Measured craft norms (HyperFrames, from professional films)
- **Vertical pacing:** shots of 1–2 s, a new beat every 2–4 s. Explainer shots average 1.8–3 s *with motion inside them*. More than 3 s with nothing changing is a `dead_stretch`.
- **Arrive slow, leave clean:** arrivals on long ease-outs, exits 40–50% shorter than entrances. The next element starts when the previous one is 30–50% done.
- **Ease by role:** an arrival `expo.out`; a camera move or colour flood `inOut`; a zoom-through or exit accelerates (`in`). The same ease and duration everywhere "makes a film feel generated".
- **Fast moves:** 0.3–0.6 s with motion blur peaking mid-move (6–12 px on text-sized elements, 15–20 px full frame).
- **Titles land and hold dead still.** The motion moves to the next element, the camera or the world behind. Vary the entrance within a film:
  - blur-in word by word (0.13 s each, 0.067 s apart);
  - grey to ink;
  - the whole line blurring in;
  - a number rolling like a slot machine.
- **Holds:** a line the viewer must read holds 0.5 s + 0.3 s a word. A one- or two-word chapter line may hold 0.4 s. Hold 0.3–0.75 s before the payoff.
- **Transitions with a cause:** use 3–5 kinds per film, each caused by something on screen. At most a third of the seams between beats are hard cuts, and worlds never crossfade. The kinds:
  - zoom through an object;
  - an object becomes the world;
  - a morph;
  - a carry across;
  - a colour flood;
  - a whip;
  - an iris;
  - a dip cut;
  - a blur swap on one stage.
- **Banned defaults:**
  - a dark void with small things floating in it;
  - glow and particles;
  - everything fading and sliding up;
  - three cards in a row;
  - every scene entering the same way;
  - breathing or floating loops instead of real motion;
  - side-by-side panels standing in for a scene.

## 5. The Cryptonite rules from now on

### Pace (gate: `npm run pace -- <id>`)
- **Stillness:**
  - still time ≤ 25% of the film;
  - no still stretch over 1.5 s, except up to two marked thesis holds of ≤ 1.5 s each (logged in `qa-report.md`).
- **Visual events:** a new one at least every 2.5 s (median), never more than 4 s apart.
- **Opening:** the picture changes inside the first second.

### The living frame: three layers in every shot
1. **The world moves.** One of:
   - a camera push or pan of about 2–4% per second, with parallax between background, subject and labels;
   - a 3D orbit of 3–5° per second;
   - a map drifting;
   - footage playing;
   - a real interface scrolling.
   It continues through the shot, eases at the ends, and is never a breathing loop.
2. **The subject acts.** A counter climbs, a chart draws, an object assembles, a document scrolls to the line that matters, a photo is parallaxed into layers.
3. **The words land and hold still.** Headlines and labels land, then stay dead still until they leave. Only the world behind them moves.

### Entrances (vary them)
- Use at least four kinds per Reel:
  - blur-in by word;
  - scale-settle (spring, damping 0.75–0.85);
  - a mask or clip wipe;
  - a draw-on for lines and charts;
  - a number rolling;
  - a carry-in from the previous object.
- Fade + slide-up is allowed for at most a third of entrances.
- Exits are 40–50% shorter than entrances.

### Transitions (every seam has a cause)
- Plan each seam in `transition-map.md` with its cause. Use 3–5 kinds per Reel:
  - **zoom through** the object being talked about into the next idea;
  - **object becomes the world:** a card grows past the frame and its contents become the next scene;
  - **carry across:** the number or object shrinks and lands inside the next layout;
  - **colour flood:** a polarity flip while the hero object stays;
  - **match cut:** the same shape holds while everything around it changes;
  - **whip** (0.2–0.3 s, motion blur);
  - **dip cut** or a hard cut on a word or beat.
- **Never crossfade two layouts in the same spot.** That is the slide-show seam.

### Worlds, not voids
- Each chapter is a place with depth (a desk, an exchange floor, a vault, a map, a block explorer, a chart room). Ground, light and scale are distinct per chapter; palette and type stay constant.
- Fill the frame. The subject takes 50–80% of the visual band; empty space is a deliberate thesis beat, not the default.
- Text still never sits on top of the subject. Labels sit in the world beside what they name.

## 6. Story rules for retention
- **Three storylines first.** Before the script, sketch three different films: a device plus a form each, e.g. "the result first + one continuous take", "a number lands + object-to-object chain", "life before/after + match cuts". Pick the one a stranger would follow. Record them in `hooks.md`.
- **Hook stack:**
  - **frame 0:** a picture plus a 3–8-word line, never a bare headline on an empty ground;
  - **under 1 s:** something changes;
  - **by 3 s:** the stake;
  - **by 5 s:** the real anchor;
  - **by 8–12 s:** the first real answer;
  - **8–12 s (optional):** a pattern-interrupt line.
- **One spine.** One real object or number travels from the hook to the payoff (e.g. block 3's key, the 20 minutes) and returns with a new meaning.
- **Re-hooks every 15–25 s.** A spoken, specific open loop that promises the next bigger reveal, paid within 10–20 s:
  - "Tapi bagian yang jarang dibahas: …"
  - "Dan di sinilah masalahnya: …"
  - "Masalahnya, angka ini belum semuanya."
  Never generic ("tunggu dulu"), never unpaid.
- **Cut process that isn't the answer.** If a beat explains how something happened but the viewer's question is why it matters, cut it. Every beat either answers the last question or raises the next one.
- **The payoff is the biggest visual moment, once, 60–80% in.** Then the one practical line, then the end. No second explanation after the payoff.

## 7. Assets: when real, when designed
- **Real** (photo, footage, document, interface) for:
  - the anchor (0–5 s);
  - the proof of a claim (the document, the chart, the transaction);
  - a pivot to the real world (a person, a place, an event), as 1–3 s punctuation.
- **Designed** (2D or 3D) for mechanisms, numbers and comparisons.
- **Moving beats still:**
  - footage over a photo;
  - a screen recording of a real interface (scrolling the block explorer, the exchange order book) over a static screenshot;
  - a photo cut into layers with parallax over a flat photo in a window.
  - Every still gets motion: a push, a parallax split, a light sweep, or a scroll to the detail.
- **Sources stay licensed:** NASA, Commons video and images, official press kits, the institution's own media, our own screen recordings of public pages. Log each in `sources.md`.

## 8. Sound
- **A music bed with a pulse,** not only pads; pick a tempo (95–115 BPM for explainers).
- **Cut on the beat,** change layout on the bar, and let the music drop out under a thesis line and come back on the next beat.
- **An effect on every visual event,** rotating two or three takes:
  - a whoosh on moves and cuts;
  - a pop on chips and numbers;
  - ticks on counters;
  - one riser into an impact, at the payoff.
- **Timing and level:** the effect peak lands one frame after its picture, 3–6 dB over the bed.

## 9. Review (before delivery)
1. `npm run pace -- <id>`: fix every failing stretch, or mark it as a thesis hold with a reason.
2. **Describe each beat frame as a stranger would.** An object you'd have to explain is a P0.
3. **Name every tell on screen** (§4 banned list) and replace it.
4. **The pictures alone:** with the words covered, do the beat frames still tell the story?
5. **Write P0/P1/P2 notes:** `t=4.2s · where · problem → change`.

## 10. The angle (what makes someone stay for the next sentence)
A topic is not an angle. 0x100x's angles share one shape: **someone powerful or something huge → a number you can feel → a mechanism almost nobody explains → what it means for you**. Before scripting, the angle must pass:
1. **Tension the viewer feels:** their money, their exchange, their country, their future price. Not just "news happened".
2. **One question the whole Reel answers.** It is stated or implied in the first 3 s, and the last line answers it.
3. **Three or four escalating reveals.** Each is bigger or closer to the viewer than the last, and each is set up by a re-hook.
4. **A payoff that changes what they think or do.** A check, a distinction, a warning.

Angle shapes that retain:
- the hidden mechanism behind a headline;
- a contrast (X lost billions, Y never lost a coin);
- "what happens if…" (a simulation, labelled);
- "the number nobody is pricing in";
- a myth turned over;
- "follow the money" (one flow traced end to end).

## Appendix: dompet-satoshi under these rules (what a re-cut would change)
- **P0 (0–5 s):** a headline on a navy void, then a logo and a card fading in. Instead:
  - open on the real 20-minute outflow already running, with a counter racing and the TRM headline sliding across as a document carried in;
  - make the first second move.
- **P0 (5–12 s):** the bars and the whitepaper park for 2 s (measured still 10.2–12.3 s). Instead, carry the 18,270 BTC bar across into a 60× stack that keeps building while "nggak pernah dibobol" is said.
- **P1 (12–19 s):** the mempool screenshot sits in a window. Instead:
  - scroll the real explorer (a recorded scroll) down to the output and punch in;
  - show the crossed-out "hot wallet" and "staff" as objects that drop out of the frame, not icons in circles.
- **P1 (seams):** almost every seam is a fade-out and fade-in in the same spot. Use:
  - zoom through the block-3 output into the 3D safe;
  - carry the safe across into the 78-digit lock;
  - flood the polarity from the public key into the caveat chapter;
  - match-cut the 20-minute bar back in the payoff.
- **P1 (story):** no spoken re-hook between 12 s and 39 s. Add one at ~20 s ("Dan itu baru satu blok…") and one at ~39 s, where the caveat already works as one.
- **P2 (sound):** a pulse bed at ~100 BPM, effects on every event, one riser into the payoff board.
