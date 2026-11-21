# Transition map — tiga-hammer

Five kinds of seam: zoom through, whip, blur swap, dip + flood, and push. Every seam has a cause on screen. There is no crossfade of two layouts in one spot.

| Boundary | Outgoing composition | Incoming composition | Why they connect | Transition type | Trigger word/frame | Sound cue | QA midframe |
|---|---|---|---|---|---|---|---|
| open → A | three traders, hammer A on the left | A's 12 five-minute bars | We go *inside* candle A | zoom through A's body (12 f) | "lima" (8.61 s) | deep whoosh | checked on stills |
| A → C | A's inside, "KOSONG DI DALAM" | C's inside | Next trader, same frame logic | whip left (8 f) | cue c (19.87 s) | short whoosh | checked |
| C → B | C's inside, red failed gate | B's inside | Next trader | whip left | cue b (25.50 s) | short whoosh | checked |
| B → result | B's inside, "CHoCH" | the three traders, six hours later | Back out to the people to see what happened | blur swap | cue result (32.66 s) | riser → positive chord | checked |
| result → twist | traders cheer/shrug/slump | two isotype grids | "Tapi…" — the data overturns the easy conclusion | dip to black, then a blue flood from the centre | cue twist (39.85 s) | soft boom | checked |
| twist → payoff | 5/8 vs 13/20 | B's chart with the swept low | Back to B to show the real use | push | cue payoff (49.15 s) | light whoosh | checked |
| payoff → loop | the red "BATAL" line | the opening shot (three traders) | The Reel loops to its first frame | blur swap | 58.72 s + 3 f | — | checked |

## Test
Review the last 3 frames of each outgoing shot, the transition midpoint, and the first 3 frames of the incoming shot. Check object position, luminance flash, type visibility, cut rhythm, SFX timing and story logic. Results are in `qa-report.md` Part B.
