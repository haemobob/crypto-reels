# Cryptonite Reels — production rules

Remotion template for Indonesian crypto-education Instagram Reels. Read this before making an episode.

## Rule system (read before every Reel)
Five rule files load automatically and work together:
- **`.claude/rules/cryptonite-viewer-value.md` governs scripting decisions first**: the viewer reward (who, their problem, what exactly they learn, why it matters to an Indonesian crypto investor, what they keep), the concept scorecard, connected discoveries, demonstrate-don't-decorate, sound-off comprehension, and a real payoff at the end. Every Reel needs a clear viewer benefit, a sequence of satisfying discoveries, and a reason to remember or save it.
- **`.claude/rules/cryptonite-retention.md` (V3) governs storytelling and retention**: audience and stakes, the angle, the Hook Lab, the first 12 seconds, the script's ladder of rewards, length, the retention audit, and post-publication metrics.
- **`.claude/rules/cryptonite-reels.md` (V2) governs visual execution**: design system, the two typography tracks, camera, transitions, motion engineering, sound, and technical and visual QC.
- **`.claude/rules/cryptonite-openings.md` governs the opening** (first 3–12 s): statement → real-world anchor (photo, logo, chart, document) → integrated into a designed card or diagram → only then abstract graphics; the three archetypes (Authority, Asset/Market, News/Document) and the visual asset hierarchy (real photos → logos → screenshots/charts/documents → realistic renders → abstract geometry).
- **`.claude/rules/cryptonite-story-visuals.md` governs the choice of visual subject and concept**: the story picks the subject (person, asset, institution, event or mechanism) by relevance, never by default; no famous faces for attention; no forced central character when data or diagrams explain it better; vary compositions, environments, framing and transitions between episodes (check `reference/episode-visual-log.md`), with reuse only for continuity. Typography, blue branding and production quality stay constant.
- Also read `reference/0x100x-reference-study.md` (a quality reference, not a formula) at the start of each production. Doc templates are in `templates/`.

**Order of authority:** facts, balance, source attribution and rights → the user's explicit brief (topic, length, constraints) → the viewer-value directive (what the Reel teaches and whether it is worth making) → the layout rules below → the opening rules for the first 3–12 s → V3 for anything about the story → V2 for anything about how it looks. Script quality comes first: no voice and no animation until the script passes the retention audit, and nothing visual is allowed to weaken comprehension or story momentum.

### Conflicts between the rule sets, resolved
- **Length:** V3 and the viewer-value directive agree: duration follows what is taught. Use the shortest runtime that keeps the mechanism and payoff: most single-idea Reels 35–60 s; 60–90+ s only when the story earns it or the user asks. V2's "editorial 55–75 s default" is retired. Record the choice in `retention-brief.md`.
- **Opening:** V2's evidence ladder "hook 0–3 s" is replaced by V3's Hook Lab and the 0–12 s cold open (interrupt → substantiate → first answer → next question). V2's ladder (authority → scale → contradiction → mechanism → implication → payoff) shapes the body, delivered as V3's ladder of rewards: a concrete fact, reveal or causal step about every 5–10 s.
- **First frame and opening:** the layout rule, V3 and the opening rules apply together. The first frame is a centred focal headline of about 3–8 words (statement, scale or contradiction), rising in from below, with narration starting within the first frames. No Cryptonite logo first, and the micro caption is never the only opening text. The real-world anchor follows as its own beat in V3's 1.5–4 s "substantiate" window, so something recognisably real is on screen by second 3–5; it is then turned into a designed card or diagram, and abstract graphics (3D, flows) start only after that, never before second 8. The cold open must answer: who or what is this about, why it matters, why keep watching.
- **Hook mechanisms vs archetypes:** the entry point decides what the cold open *says*: the directive's six (authority, problem, contradiction, evidence, simulation, question) replace V3's five (V3's "consequence" is the problem entry, "scale" is evidence). Don't force the same type every time. The opening archetype (Authority, Asset/Market, News/Document) decides what it *shows*. Each Hook Lab candidate names both.
- **Real anchor vs "not automatically":** the opening rules require something recognisably real in the first 3–8 s; the directive says use real assets when they improve credibility, not automatically. Both hold: the real anchor is the real thing the topic is about (the person, document, chart or trading interface), never a decorative stock asset. For problem, simulation or question openings the anchor is the real interface or chart where the problem lives (e.g. an actual order book), and any hypothetical numbers on it are labelled SIMULASI. If the needed asset isn't available, ask the user for exactly that asset instead of substituting an inaccurate illustration.
- **Simulations:** any hypothetical order, price move, chart or market is labelled "SIMULASI" (or "ILUSTRASI") on screen while it is shown, and never presented as actual historical market data.
- **Ending and CTA:** the educational payoff is mandatory and is the last content beat (a practical check, mental model, distinction or warning that answers the opening). No spoken or on-screen "follow / save / share" request; the ≤2 s branded outro stays as a signature only.
- **Visual nouns:** V2's dictionary still applies to the body, but in the opening the asset hierarchy wins: a real photo, logo, chart or document beats a monolith, sphere or abstract shape whenever one exists. Opening motion is restrained (small push-ins, card reveals, light sweeps, reframing); hero moves wait for the body.
- **Archetype examples vs story-driven subjects:** the Larry Fink/BlackRock, order-book and MSCI examples in the rule files illustrate techniques only. The Authority archetype is used only when a person or institution is genuinely central; a mechanism-led story uses the Asset/Market or News/Document archetype with real data, a real interface or a document as its anchor.
- **Logos:** "official logo only" is about Cryptonite's own logo. Real third-party logos and photos may appear to identify the subject, sourced in `sources.md`, unaltered, and never implying endorsement.
- **Briefs:** the viewer reward, the concept scorecard, and V3's audience, consequence, payoff, share trigger and length live in `retention-brief.md`. `brief.md` is only the visual plan (visual nouns, polarity chapters, hero move).
- **Animatic:** V2's "test the first 8–12 s as an editorial animatic" is replaced by V3's cold-open storyboard, built and approved before the rest of the film.
- **Qualifiers:** both rule sets want caveats on screen at the moment of the claim; the layout rules decide where: beside the graphic or built into it, never on top of it.
- **Rendering and A/B previews:** the user renders the final MP4. Hook A/B comparisons and checks use stills and contact sheets; the QA report says "motion NOT REVIEWED" unless a full render was watched. Claude never posts or uploads; the user controls release and any Trial Reels test.
- **Quality gates:** the directive's retention quality gate (8 questions) runs alongside V3's 10-question script audit in `qa-report.md` Part A, before animation. One `qa-report.md` with Part A (retention audit) and Part B (visual-quality audit, including demonstrate-don't-decorate and sound-off comprehension). Both result lines must read PASS before the final render (`npm run audit -- <id>`; `npm run render` warns while they don't).
- **Metrics:** never invent analytics. `performance-review.md` says NOT YET MEASURED until real Instagram Insights exist, then proposes one variable to change in the next episode. Hook scores are an editorial rubric, not a prediction of virality.

## Layout rules (from feedback, 16 Oct 2026)
- **Text never overlaps graphics.** Captions, labels and headlines get their own zones; graphics (3D, diagrams, images) stay out of them for the whole beat, including during camera moves and crossfades (let the outgoing text clear before the next one arrives). Check stills across every scene before delivery.
- **Graphics stay full frame and uncovered**: no dark gradients, scrims, vignettes, crops or letterbox windows over graphics to make room for text. If a piece of text can only sit on top of the graphics, drop it and let the narration, micro captions and in-world labels carry the beat; use a full-screen thesis card when a statement really needs to be on screen. Required qualifiers ("Usulan", "Ilustrasi", dates, sources) still go on screen at the moment of the claim, placed in clear space beside the graphic or built into it, never on top of it.
- **Source images** (press releases, screenshots, charts): show the whole picture first, readable, inside a fixed window; then zoom only into the part the narration is talking about. Low-resolution charts may be rebuilt as vector with identical values (note it in `sources.md`).
- **Opening title**: centred in the frame, rising in from below; it gets its own beat before the source image. No date or "Siaran pers" tag above it.
- **Opening anchor (17 Oct 2026)**: never open on pure abstract 3D or generic motion graphics. The first 3–8 s show something recognisably real, then convert it into the designed system (`cryptonite-openings.md`). Credibility over spectacle.
- **Rendering**: the user renders the final MP4 on their PC (`make-video.bat`, `make-msci-video.bat`). Check work with stills (`npm run still`) unless a full render is asked for.

## Non-negotiables
- 1080×1920, 30 fps, H.264 + AAC MP4, length chosen in `retention-brief.md` (shortest that keeps the mechanism; most single-idea Reels 35–60 s; never pad). Every episode sets its window in `episodes/<id>/episode.json` (`minSeconds`/`maxSeconds`, word range, voice rate, captions style; see `msci-indonesia-cryptonite`, 70–80 s). `npm run validate` enforces it (it falls back to a 30 s maximum when `episode.json` sets none).
- Narration in Bahasa Indonesia, natural spoken style with voice-friendly numbers and dates, length set by the chosen runtime (word range in `episode.json`), same voice every episode (`voice.json`: `engine` `elevenlabs` (eleven_v3, one continuous take with `[[tone:...]]` emotion tags, needs `elevenlabs-key.txt` and a `voiceId`; takes cached in `episodes/<id>/voice-cache/`, change `seed` for a new take) or `edge-tts` (`id-ID-ArdiNeural`, free)). Generate the voice **before** finalising animation; scenes sync to narration cues. If TTS is unavailable, say so; never ship subtitles-only or the stand-in voice as final.
- English terms in the script (cascade, leverage, ...) are mispronounced by the Indonesian voice: add each one to `pronunciations.json` (word -> one-word Indonesian-style respelling; the voice hears it, subtitles keep the original). Listen to every new episode's voice and fix what sounds off.
- Captions always on: the one-word micro caption track at the top (`<MicroCaptions>`, `captions: "micro"` in `episode.json`) by default; the older two-line subtitles only when a brief asks for them.
- Official Cryptonite logo only: `public/brand/logo.png`. Never invent or stretch a logo (ours or a third party's). It appears as the corner bug and in the outro automatically.
- Accuracy over hype: verify every number and definition, cite in `episodes/<id>/sources.md`, label illustrative data "ILUSTRASI", say "salah satu" when a cause isn't the only one, never fabricate prices, dates or stats, no investment promises.
- Music and SFX: only the generated originals in `public/music` and `public/sfx` (`npm run audio`) or assets with documented licences.
- Camera: restrained by default (locked or gentle moves, stable holds on key info), one or two motivated hero moves per minute (rulebook §4). No repeated zoom in/out, no decorative particles.
- Both audits (retention and visual quality) pass before the final render. Check the work frame by frame before calling it done: stills across every beat and transition, or the contact sheet and cue frames in `output/<id>-review/` when a full render was made. Never claim motion was checked from stills alone.

## Brand
Colours (`src/theme/colors.ts`): bg #050B18, bg2 #0B1730, blue #1677FF, electric #2997FF, light #75C7FF, text #FFFFFF / #A8BDD8, positive #19D69A, negative #FF5263. Blue dominates; green/red only carry meaning.
Fonts (local, `public/fonts`): Inter Tight (headings), Inter (body), JetBrains Mono (numbers).
Safe zones: top 250, bottom 350, left/right 90. Micro captions sit about 20% down (y ≈ 384); keep key visuals in screen y 250–1400 and out of the caption and label zones.
Outro signature: "PAHAMI CRYPTO, BUKAN CUMA IKUT HYPE." (`src/theme/brand.ts`), ≤2 s, after the payoff; it is a brand line, not a follow/save request.

## Workflow per episode (story first, then visuals)
`npm run new -- <id>` scaffolds `episodes/<id>/` with every doc below (from `templates/`), plus `sources.md`, `narration.txt` and `episode.json` (35–60 s, micro captions; change the window in `episode.json` and `index.tsx` to the length chosen in the retention brief).

**Stage 1: Story (viewer value, then V3). Gate: the concept scores and the script passes the retention audit.**
0. Viewer reward first: fill the "Viewer reward" part of `retention-brief.md` concretely ("learns how to spot two warning signs of low liquidity before buying an altcoin", not "learns about crypto") and score the concept (5 criteria × 1–5, ×4 = /100). If the reward is weak or the scorecard misses the bar, improve the angle or pick a stronger topic before writing. Plan the discovery sequence: early useful insight → visual demonstration → final takeaway. List any real assets the mechanism needs and ask the user for the ones you can't source.
1. Research: 5W1H, event vs publication date, claim types → `research.md`, `sources.md`.
2. `retention-brief.md`: audience, consequence, counterintuitive fact, evidence, payoff, misconception, share trigger, emotional shape, length. Reframe or reject a topic that is only "news happened".
3. `hooks.md`: pick the opening archetype and the real-world anchor (with its source); at least five cold opens using at least three mechanisms, scored 0–5 on consequence, novelty, specificity, evidence and visual; selected hook, broad and niche alternatives, and A/B variants (A consequence, B authority/contradiction/scale).
4. `cold-open-storyboard.md`: the 0–12 s mini-story in the order statement → real anchor → designed card/diagram → explanation, with what the viewer knows at 0, 1, 3, 5, 8 and 12 s and the answers to who/what, why it matters, why keep watching. Collect the real assets (official press kits, the institution's own releases, exchange or index pages) into `public/episodes/<id>/` and log each in `sources.md` with origin, date and licence basis.
5. Full script in `narration.txt` (the approved exact wording) as a ladder of rewards, with specific bridges, caveats at the claim, and no second intro. Syntax: `[[cue]]` before each beat's first word, `*keyword*` for blue highlights (closing `*` goes before punctuation: `*word*,`), `[[pause:0.6]]` for an exact silence (Edge synthesises segments split at pauses; ElevenLabs lengthens its own gap to at least that), `[[tone:curious]]` for an ElevenLabs v3 emotion tag on the words that follow (use a few per Reel, at real turns), `[[say:...]]` for Edge prosody.
6. Retention audit, script part (`qa-report.md` Part A: the 10 questions with exact quotes and timestamps, plus the rejection gates). If it fails, rewrite before going further.

**Stage 2: Visual plan (V2).**
7. `brief.md`: first the visual subject (and why it is the most relevant, or why data/diagrams carry the story), the visual concept unique to this story, and what differs from recent episodes in `reference/episode-visual-log.md`; then the visual plan, `beat-sheet.md`, `storyboard.md`, `transition-map.md`. Plan polarity chapters by meaning, not by a timer; pick the one or two hero moves.

**Stage 3: Voice.**
8. `npm run voice -- <id>` → `narration.wav` + `captions.json`. Check the measured length against the window, check that the cold-open checkpoints still land (evidence by about 5 s, first answer by 8–12 s), and fill `audio-map.md`.

**Stage 4: Cold open first.**
9. Build 0–12 s on the narration cues. Review stills with the sound off (first-frame test, silent test, "is it real by second 3–5?") and the A/B hook variants side by side; mark "Approved to animate the rest: YES" in `cold-open-storyboard.md`.

**Stage 5: The rest of the film.**
10. Build `src/episodes/<id>/` on the cues (`useCues()`, word frames): progressive disclosure, one dominant visual per beat, restrained camera, layout rules. `npm run studio` to preview; `npm run still -- <id> --sec N` for frame checks.

**Stage 6: Audits before the final render.**
11. Retention audit on the built piece (Part A again: first frame, silent test, payoff timing measured from `captions.json`, final frame answers the opening) and visual-quality audit (Part B: layout rules, stills across every beat and every transition before/mid/after, first 3 s and last 2 s at full resolution, technical checks). Score both rubrics; anything below 4 gets a targeted fix. Set both result lines to PASS and run `npm run audit -- <id>`.

**Stage 7: Render, publish, learn.**
12. The user renders the final MP4 (`npm run render -- <id>` or the `make-*.bat` files; render normalises to −14 LUFS and validates) and controls release.
13. Add the episode's row to `reference/episode-visual-log.md`. After posting, fill `performance-review.md` from real Instagram Insights only and propose one variable to change next episode.

## Code map
- `src/compositions/CryptoReel.tsx` — master layers: episode → logo bug → subtitles → outro; narration, ducked music, outro sting.
- `src/components/` — `CameraRig` (keys: x, y, zoom, rotate, tiltX/Y; `follow` for object tracking; `Layer depth` for parallax), `Background`, `AnimatedText`/`Chip`, `Subtitles`, `SceneTransition` (`SceneTimeline` + cut/flash/fade/zoomThrough/circle/wipe/push/perspective, centred on cues), `DataVisualization` (CountUp, CandlestickChart, LineChart, Meter, Panel), `BrandLogo`, `BrandedOutro`, `Sfx`.
- `src/scenes/` — generic Hook/Context/Explanation/Takeaway starting points (see `template-test`). Prefer custom episode scenes.
- `src/theme/` — colours, typography, motion (springs/easing/durations), layout, brand.
- `scripts/` — `voice.ts`, `render.ts`, `validate.ts`, `audit.ts` (pre-render retention/visual audit gate), `make-audio.ts`, `new-episode.ts`.
- Episodes 001, 002 and the MSCI film were made under the older "camera never stops" rules: reuse their components, but follow the rulebook's restrained camera and editorial transitions for new work.
- `src/three/` — real 3D (React Three Fiber via `@remotion/three`): `cameraPath` + `CameraRig3D` (spline camera keys with holds and cuts), `InstitutionalMonolith`, `MarketClassification` (tiered building with shaft and doors), `Label3D` (canvas text), `useAssets3D` (load fonts/textures before mounting the canvas). `Text3D` + `useTypefaces`: real extruded type in Geist / Geist Mono (typeface JSON in `public/fonts/typeface/`, made with `scripts/make-typeface.py`; per-glyph poses for type that breaks apart). Reel 003 v2 (`src/episodes/episode-003/World.tsx`) is the reference for a single continuous 3D world with an environment map (RoomEnvironment), metallic hero object and cue-keyed camera.
- 2D systems: `ThesisCard` (blur-to-sharp statements), `MicroCaptions` (one word at a time, top), `AnimatedFinancialFlow` (dashed flow lines with particles), `MorphTransition` (shape becomes the next scene).
- `msci-indonesia-cryptonite` is the reference for a long-form film: 3D centrepiece, match cuts between 3D and 2D, own music mix with a silence, micro captions, and docs `storyboard.md` / `transition-graph.md`.

## Gotchas
- Composition props must be JSON: episodes are looked up by id.
- All motion is frame-driven (`spring`, `interpolate`); no CSS animations or timers.
- Inside a `SceneTimeline` scene, `useSceneFrame().frame` and `<Sfx at>` are scene-local; elsewhere they are absolute.
- `logoBlend: 'screen'` hides the supplied logo's black background; switch to `'normal'` for a transparent logo. Don't wrap `<BrandLogo>` in an element with opacity (it breaks the blend); pass opacity in its `style`.
- 3D: mount `<ThreeCanvas>` only after `useAssets3D` resolves (R3F renders on frame change; late textures/fonts miss the captured frame). Renders use WebGL `angle` on Windows/macOS and `swangle` on Linux (`REMOTION_GL` overrides). Unlit image planes use `meshBasicMaterial`; the canvas uses `flat` (no tone mapping) so whites stay white. Keep big slabs from casting shadows (they turn floors below grey).
- Commands must work on Windows: no shell-specific syntax; scripts spawn ffmpeg with argument arrays.

## Decisions from the 20 Oct 2026 setup session
### Installed skills override the Cryptonite rules on style (user decision, 20 Oct 2026)
When an installed skill or plugin (HyperFrames, genjutsu, GSAP, LottieFiles motion-design, design-dna, Three.js skills, onetake, gbro-collage-broll, lemo-opuscar) conflicts with the Cryptonite rule files, follow the skill. Known clashes, resolved in favour of the skills:
- Captions: may overlay the film (HyperFrames `captions-overlay`) instead of "text never overlaps graphics".
- Camera: continuous-camera motion doctrine (HyperFrames `motion-doctrine`) instead of the restrained "one or two hero moves per minute" camera.
- Toolchain: onetake, gbro-collage-broll and lemo-opuscar may be used with their own render stacks instead of Remotion.

Still binding regardless of any skill (truthfulness and rights, not style): verified facts and sources in `sources.md`, no invented prices/dates/stats, SIMULASI/ILUSTRASI labels on simulated data, licensed assets only, no faked logos, honest QA (never claim motion was reviewed from stills alone), Claude never posts or uploads.

Where the skills are silent, the Cryptonite rules apply as written.

### Voice (user decision, 20 Oct 2026)
Narration uses Google Cloud Text-to-Speech, voice `id-ID-Chirp3-HD-Orus`, the same voice every episode. Chirp 3 HD returns no word timings, so captions need a forced-alignment pass on the audio. ElevenLabs is not used: the account is on the free plan, which cannot use library voices through the API.

### Framework and logo (user decision, 20 Oct 2026)
- Remotion is the default framework for every Reel. HyperFrames may be used instead for a Reel when it suits that piece better; record the choice and the reason in the episode's `brief.md`.
- `public/brand/logo.png` is the official 2000×667 logo with a transparent background (white wordmark, blue gem as the "O"). Use `logoBlend: 'normal'`, not `'screen'`. It needs a dark ground: on off-white chapters keep it off screen (don't crop or recolour it); ask the user for a dark-text version if one is needed.

### Logo from the first frame (user decision, 21 Oct 2026)
The corner logo bug is on screen from frame 0 in every Reel (`LOGO_AFTER_SEC = 0` in `CryptoReel.tsx`), alongside the opening headline. This replaces "no Cryptonite logo first" / "logo bug from 12 s" for the corner bug only: the headline is still the first frame's focal point, there is no logo intro before the hook, and the logo stays hidden on off-white grounds (`logoHide`).

### Rebuilt project status (20 Oct 2026)
The original project was not available, so it was rebuilt from these rules. The **Code map** and **Gotchas** above describe the original; this is what exists now:
- Exists: `src/theme/` (colors, typography with local fonts, layout, brand, motion), `src/components/` (`BrandLogo`, `CornerLogo` (with `logoHide` ranges), `BrandedOutro`, `MicroCaptions`, `Ground`, `Headline`/`Hi`, `HeadlineTrack` (headline zone, outgoing text clears before the next), `ThesisCard`, `Label`, `CountUp`, `CandleChart` (`Candles`, `TracePath`, `LevelLine`, `ScenarioPath`, `scaleFor`: log-scale weekly candles), `Sfx`), `src/compositions/CryptoReel.tsx`, `src/lib/` (`useCues()` with `cue(name)`, `word(text, nth)`, `narrationEnd`; `cameraAt`/`cameraTransform` keyframed 2D camera), and the scripts `new`, `voice` (`[[rate:x]]` per section; reports unmatched words and saves `voice-cache/heard.txt`), `audio` (generated SFX in `public/sfx`), `validate`, `audit`, `still` (`--sec N`, `--sheet`, or `--frames a,b,c` for a labelled sheet), `render`, plus `make-video.bat`.
- Not rebuilt yet (build when an episode needs them): `SceneTransition`/`SceneTimeline`, `LineChart`/`Meter`/`Panel`, `AnimatedFinancialFlow`, `MorphTransition`, a music bed, `src/three/`, `src/scenes/`. Episodes 001–003 and the MSCI film are gone.
- Episode layout: docs, `narration.txt`, `episode.json` and `captions.json` live in `episodes/<id>/`; the scene is `src/episodes/<id>/index.tsx` (imports both JSON files); audio goes to `public/episodes/<id>/narration.wav`. `pipeline-test` is a 11 s smoke test, not a Reel. `btc-mirip-2023` (21 Oct 2026) is the first real episode and the reference for chart-led Reels.
- Voice: `voice.json` (`engine: "google"`, Chirp 3 HD Orus). Key from `GOOGLE_TTS_API_KEY` or `google-tts-key.txt` (gitignored). `[[tone:...]]`/`[[say:...]]` are ignored by Google. Word timings come from whisper.cpp (`.whisper/`, built on first run) aligned to the script; the script reports how many words matched. Takes are cached in `episodes/<id>/voice-cache/` by text and voice settings, so re-running doesn't re-bill.
- Rendering: `npm run render -- <id>` → `output/<id>.mp4`, two-pass loudnorm to −14 LUFS, true peak ≈ −1.5 dBTP, then validated. Set `REMOTION_BROWSER` to use an installed Chrome instead of Remotion's download.
- Sound effects: `public/sfx/newest/` holds the user's 52-sound pack (imported 21 Oct 2026; user decision: cleared on the user's confirmation that it is free to use, not independently verified; per-sound inferred sources in its `manifest.json`). Use them by name via `<Sfx name="…">`; generated `hit`/`tick`/`whoosh`/`ping` remain. Import more packs with `npm run import-sfx -- <folder> --pack <name> --licence "<basis>"`.
- Cloud sessions behind a proxy: run voice with `NODE_USE_ENV_PROXY=1` (Node's fetch ignores `HTTPS_PROXY` otherwise). Not needed on a normal PC.
