/**
 * The loop's choreography (frames at 30 fps), shared by the picture (Loop.tsx) and the sound (scripts/score-nggak-nyerah-loop.ts)
 * so every dribble, rim hit and swish lands on the frame it is seen. Pure data and math: no React.
 */
export const FPS = 30;
export const SCENE_FRAMES = 390; // 13 s of court, then the 2 s branded outro

/** Inside one shot: gather the ball, raise, release, flight to the rim. */
export const GATHER = 10;
export const RELEASE = 16;
export const FLIGHT = 20;
export const DRIBBLE = 16; // frames per bounce

export type Lane = {label: string; key?: string; y: number; shots: Array<{at: number; make: boolean}>; quitAt: number | null};

export const LANES: Lane[] = [
  {label: 'NYERAH DI AWAL', y: 560, shots: [{at: 40, make: false}], quitAt: 84},
  {label: 'NYERAH DI TENGAH', y: 960, shots: [24, 76, 128, 180].map((at) => ({at, make: false})), quitAt: 224},
  {label: 'NYERAH', key: 'NGGAK', y: 1360, shots: [14, 60, 106, 152, 198, 244, 290].map((at, k, a) => ({at, make: k === a.length - 1})), quitAt: null},
];

export const HOOP_X = 120;
export const FIG_X = 880;
export const rimOf = (y: number) => ({x: HOOP_X + 56, y: y - 150});
export const floorOf = (y: number) => y + 80;

/** The shot (if any) in progress at frame f: index, frames since its start. */
export const shotAt = (lane: Lane, f: number) => {
  for (let i = lane.shots.length - 1; i >= 0; i--) {
    const s = lane.shots[i];
    if (f >= s.at) return {i, t: f - s.at, make: s.make};
  }
  return null;
};

/** Frame where a lane's last make lands (celebration starts). */
export const makeFrame = (lane: Lane) => {
  const m = lane.shots.find((s) => s.make);
  return m ? m.at + RELEASE + FLIGHT : null;
};

/** True while the trader is dribbling (holding the ball between shots, not quitting, not celebrating). */
export const dribbling = (lane: Lane, f: number) => {
  if (lane.quitAt !== null && f >= lane.quitAt) return false;
  const mk = makeFrame(lane);
  if (mk !== null && f >= mk) return false;
  const s = shotAt(lane, f);
  const next = lane.shots.find((x) => x.at > f);
  if (s && s.t < RELEASE + FLIGHT + 8) return false; // shooting, or the ball is still in the air
  if (next && next.at - f < GATHER) return false; // gathering for the next shot
  return true;
};

/** Every event the sound needs, in seconds. */
export const events = () => {
  const out: Array<{t: number; kind: 'dribble' | 'release' | 'rim' | 'swish' | 'floor'; lane: number}> = [];
  LANES.forEach((lane, li) => {
    for (let f = 0; f < SCENE_FRAMES; f++) {
      // A dribble hits the floor halfway through each bounce period while dribbling.
      if (dribbling(lane, f) && dribbling(lane, f - 1) && (f % DRIBBLE) === DRIBBLE / 2) out.push({t: f / FPS, kind: 'dribble', lane: li});
    }
    lane.shots.forEach((s) => {
      out.push({t: (s.at + RELEASE) / FPS, kind: 'release', lane: li});
      out.push({t: (s.at + RELEASE + FLIGHT) / FPS, kind: s.make ? 'swish' : 'rim', lane: li});
      if (!s.make) out.push({t: (s.at + RELEASE + FLIGHT + 14) / FPS, kind: 'floor', lane: li});
    });
  });
  return out.sort((a, b) => a.t - b.t);
};
