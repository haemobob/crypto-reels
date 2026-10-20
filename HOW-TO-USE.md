# Cryptonite Reels: rules bundle

Every rule Claude follows when making a Cryptonite Reel, as of 20 Oct 2026.

## Easiest migration
Use the full project zip (`crypto-reels-project.zip`): it already contains every file below plus the code, fonts, 3D assets and episodes. Unzip it, open the `crypto-reels` folder in the new Claude Code account, and the rules load automatically.

## Using only the rules
Copy these into the root of the project folder you open in Claude Code, keeping the folder names:

| File | What it governs |
|---|---|
| `CLAUDE.md` | Master file, loaded automatically. Order of authority, how the rule sets resolve conflicts, layout rules (no text over graphics, no scrims), non-negotiables (1080x1920, 30 fps, Indonesian narration, captions, logo, accuracy), the 7-stage workflow, code map and gotchas. |
| `.claude/rules/cryptonite-viewer-value.md` | Scripting first: the viewer reward, the concept scorecard (/100), connected discoveries, real payoff. |
| `.claude/rules/cryptonite-retention.md` | Storytelling and retention (V3): retention brief, Hook Lab (5 cold opens, scored), first 12 seconds, ladder of rewards, script audit, A/B hooks, metrics. |
| `.claude/rules/cryptonite-reels.md` | Visual execution (V2): design system and brand colours, typography tracks, camera, transitions, motion engineering, sound, QC gates, anti-patterns. |
| `.claude/rules/cryptonite-openings.md` | The first 3 to 12 seconds: statement, real-world anchor, designed card, then abstract graphics; the three opening archetypes. |
| `.claude/rules/cryptonite-story-visuals.md` | The story picks the visual subject; vary visuals between episodes. |
| `reference/0x100x-reference-study.md` | Notes on the three reference Reels (a quality reference, not a formula). |
| `reference/episode-visual-log.md` | Visuals used in past episodes, so new ones don't repeat. |
| `templates/*.md` | Templates for each episode's docs (retention brief, hooks, cold-open storyboard, beat sheet, transition map, QA report, performance review, episode request). |

Files in `.claude/rules/` load automatically in Claude Code, like `CLAUDE.md`. On Windows, if a folder starting with a dot won't copy, copy its files into a new folder named `.claude` and a subfolder `rules`.

## Standing preferences from the chats (also in CLAUDE.md)
- You render the final MP4 yourself on your PC with the `make-*.bat` files; Claude checks work with stills and contact sheets and never claims motion was reviewed from stills alone.
- Text never overlaps graphics, including during camera moves; no gradients or scrims over graphics.
- Micro captions sit near the top (y about 384); key visuals stay in y 470 to 1500.
- Both audits (retention and visual quality) must read PASS before the final render.
- Simulations are labelled SIMULASI / ASET FIKTIF on screen.
- Voice: `voice.json` uses ElevenLabs (eleven_v3) with `[[tone:...]]` emotion tags; needs `elevenlabs-key.txt` and a `voiceId`. Edge TTS is the free fallback (`"engine": "edge-tts"`).
- Claude never posts or uploads; you control release.
