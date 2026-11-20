---
name: reel-motion
description: Cryptonite's living-frame direction for Remotion Reels — pace targets, the three motion layers, varied entrances, transitions with a cause, worlds instead of voids, when to use real assets, sound on events, and the `npm run pace` gate. Use before building or revising any Reel's visuals (new-reel Stage 3, any "feels dead / like slides / not enticing" note), and when reviewing a render.
---

# Reel motion: make the frame alive

Read `reference/retention-playbook.md` first: it holds the evidence (our renders measured, the 0x100x study, the measured craft norms) and the story rules. This skill is the build recipe. The facts, rights and labelling rules in CLAUDE.md still apply unchanged.

## The target, measured

`npm run pace -- <id>` after every render. A Reel passes when:
- **still time** is ≤ 25% of the film;
- **no still stretch is over 1.5 s**, except up to two marked thesis holds (≤ 1.5 s each, logged in `qa-report.md`);
- **visual events** come every ≤ 2.5 s (median), never more than 4 s apart;
- **the first picture change** happens within 1 s.

dompet-satoshi measured 55% still, with 8 stretches over 1.5 s. That is the failure this skill exists to prevent.

## 1. Every shot has three layers (`src/components/motion.tsx`)

| Layer | Moves? | Kit |
|---|---|---|
| **World**: background, set, map, photo, 3D stage | Always, gently, for the whole shot | `<Shot from to push pan roll>` with `<Layer depth>` for parallax; `<KenBurns>` for photos; 3D camera keys that never fully stop (orbit 3–5°/s, dolly) |
| **Subject**: the thing being explained | Acts on the narration's word | `RollNumber`, draw-on lines and charts, objects assembling, a document scrolling to its line, counters |
| **Words**: headline, labels, chips | Land, then hold dead still | `<Enter kind>`; exits are 0.55× the entrance |

```tsx
<Shot from={b.split} to={b.digits} push={0.06} pan={[0, -40]}>
  <Layer depth={0.5}><Backdrop /></Layer>      {/* far: moves half as much */}
  <Layer depth={1.3}><Subject /></Layer>       {/* near: moves more */}
</Shot>
<div style={headlineZone}><Enter at={b.split} kind="words">BUKAN SATU DOMPET</Enter></div>
```

**Never:**
- a breathing, floating or pulsing loop standing in for motion;
- a title that keeps scaling or sliding after it lands;
- a slow creeping push added late in a shot.

## 2. Entrances: vary them (at least four kinds per Reel)

`<Enter kind=…>`:
- `words`: blur-in per word, for headlines;
- `blur`: the whole line;
- `scale`: settle with ~3% overshoot, for chips, cards and objects;
- `wipe`: clip reveal, for labels and source lines;
- `rise`: the old fade + slide-up, for at most a third of entrances;
- `cut`: instant, on a beat.

Arrivals take 8–14 frames on a long ease-out. Overlap the next element when the previous one is 30–50% done; don't stack them one after another.

## 3. Seams: every one has a cause

Plan each seam in `transition-map.md`: outgoing state → **cause on screen** → kind → incoming state → sync word → sound. Use 3–5 kinds per Reel. At most a third of the seams between beats are hard cuts. Never crossfade two layouts in the same spot.

| Kind (`seam()` / `<SeamSide>`) | Use when | Built as |
|---|---|---|
| `zoom` (through an object) | the next idea lives inside the thing on screen (a safe → its 22,000 blocks) | outgoing scales ~4× around `origin`, ease-in plus blur; incoming arrives at 1.12 and settles |
| object becomes the world | a card or document *is* the next scene | grow the card past the frame (episode code, 0.65 s inOut) while its surroundings blur out |
| carry across | the same number or object continues with new meaning | move and scale the element from layout A to B with a blur peak mid-move; keep it on screen through the seam |
| `flood` (iris or colour) | a polarity flip at an argument turn | incoming opens as a circle from the hero object; the hero stays |
| match cut | two things share a shape (coin → dial → globe) | hold the silhouette, swap everything around it on the cut |
| `whip` | a fast jump to a related fact | 8 frames, horizontal smear, incoming sharpens |
| `push` | moving down the same story (next step) | vertical camera move between two beats |
| `blurSwap` | the same stage, new content | 8 px blur through |
| `dip` / hard cut | a surprise, a thesis, a number landing on a beat | cut on the word or beat; `dip` darkens 3 frames first |

`motion-kit` (`src/compositions/MotionKitDemo.tsx`) shows zoom, Ken Burns, a rolling number, a wipe and a flood in 7 s. Render it to see each one: `npx remotion still src/index.ts motion-kit out.png --frame=N`.

## 4. Worlds, not voids
- **Each chapter is a place:**
  - a vault floor;
  - an exchange's order book;
  - a block explorer;
  - a desk with the document;
  - a map;
  - a chart room with depth (grid, horizon, light).
- **What changes between chapters:** ground, light and scale. **What stays:** palette and type.
- **Fill the visual band** (y 740–1440). The subject takes 50–80% of it. Empty space is a deliberate thesis beat.
- **Banned:**
  - small cards floating in the middle of a navy void;
  - three cards in a row;
  - side-by-side panels standing in for a scene;
  - glow and particles.

## 5. Real assets: when and how
- **Where real assets go:**
  - **anchor** (0–5 s): the real thing the story is about;
  - **proof:** the document, chart or transaction behind a claim;
  - **real-world pivot:** 1–3 s of punctuation (a place, an event, a person).
- **Prefer motion:**
  - footage over stills;
  - a screen recording of the real interface (scroll the block explorer, the order book, the filing) over a screenshot. Playwright can record public pages, e.g. `page.video`, or screenshots stepped by scroll;
  - a photo cut into layers with parallax over a flat photo.
- **A still always moves:** `<KenBurns>` push 6–10% across the shot, an optional light sweep, or scroll to the detail.
- **Labelling:** SIMULASI / ILUSTRASI labels and sources as in CLAUDE.md.

## 6. Story and words on screen
- **Script:**
  - re-hook every 15–25 s with a specific spoken open loop, paid within 10–20 s;
  - one spine object or number travels from the hook to the payoff.
- **Headlines:**
  - ≤ 6 words a line, two lines at most;
  - hold 0.5 s + 0.3 s a word;
  - the screen never repeats the spoken sentence word for word: it says the idea.
- **Payoff:** the biggest visual moment, once, 60–80% in. Hold 0.3–0.75 s before it.

## 7. Sound on every event
- **Bed:** a music bed with a pulse (95–115 BPM). Cut on beats, change layout on bars, drop the bed under a thesis line.
- **Effects:** one on every visual event, rotating 2–3 takes per kind:
  - a whoosh on seams and moves;
  - a pop on chips and numbers;
  - ticks on counters;
  - one riser into an impact, at the payoff.
- **Timing and level:** the effect peak lands one frame after its picture, 3–6 dB over the bed. `Sfx` names are in `src/components/Sfx.tsx`.

## 8. Review loop
1. Render, then run `npm run pace -- <id>`. Fix each failing stretch: add a world move, a subject action or a seam. Don't add decoration.
2. Make a contact sheet at 2 fps, plus a strip across every seam (−0.2 s / +0.2 s).
3. **Describe each beat frame as a stranger would.** Name every tell from the playbook §4 and replace it.
4. **The pictures alone:** with the words covered, do the beats still tell the story?
5. Record the pace numbers in `qa-report.md` Part B. Motion is not "reviewed" until a full render was watched or measured.

## 9. Art direction at 0x100x level (playbook §11)
- **Two studio worlds for the whole film:**
  - **Porcelain** (off-white): matte white objects, soft light, contact shadows. For the old way, analogies and characters.
  - **Graphite** (black): dark chrome and glass, white rim highlights, one brand-blue accent. For money, numbers and the mechanism.
- **Render finish:**
  - drei `Environment` with `Lightformer` panels;
  - `MeshReflectorMaterial` floor;
  - `ContactShadows`;
  - `<Post focus bloom grain>` from `src/three/post.tsx`. Not `@react-three/postprocessing`'s `<EffectComposer>`, which renders black under Remotion.
  - Reference: `look-test`.
- **Type:**
  - headlines are small and medium weight (Inter Tight 600, ~54–64 px);
  - the big number gets the display treatment;
  - the 800-weight 100 px headline is retired for ordinary lines.
- **Colour:** monochrome plus brand blue. Semantic colours only where they carry meaning.
- **Composition:** objects at 40–60% of the width, generous black. Make the camera move instead of making the object bigger.
- **Style frames first:** render 3–6 at final quality and compare them side by side with a 0x100x frame before animating the rest.
