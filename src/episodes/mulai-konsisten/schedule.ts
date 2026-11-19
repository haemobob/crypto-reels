/**
 * One schedule for picture and sound (wordless Reel, user request 19 Nov 2026).
 * The builder stands ON the bricks he has laid: for each row he lays the bricks around him (farthest first), steps
 * up onto the new row, then lays the brick where he was standing. When the wall is done he turns, looks down at the
 * waiter and waves; the waiter, still at his one brick, finally stands up. Frames at 30 fps; the score script reads
 * the same events.
 */
export const FPS = 30;
export const SCENE_FRAMES = 450; // 15 s, then the 2 s branded outro

export const FLOOR = 1360;
export const BRICK_W = 72;
export const BRICK_H = 34;
export const GAP = 4;
export const ROW_H = BRICK_H + GAP;
export const COLS = 4;
export const ROWS = 11;
export const WALL_X = 560; // left edge of the wall
export const WALL_W = COLS * BRICK_W + (COLS - 1) * GAP;

export const START = 24; // first brick
export const EVERY = 6; // frames per brick
export const DROP = 5; // frames for a brick to go from his hands into place
export const HOP = 8; // frames for a step up onto the new row

/** Brick (row, col) position; odd rows are staggered by half a brick. */
export const brickAt = (row: number, col: number) => ({x: WALL_X + col * (BRICK_W + GAP) + (row % 2 ? BRICK_W / 2 : 0), y: FLOOR - (row + 1) * ROW_H + GAP});
/** Where the builder's feet are when standing on column `col` at `level` rows high (0 = the floor). */
export const standAt = (col: number, level: number) => ({x: (level === 0 ? brickAt(0, col).x : brickAt(level - 1, col).x) + BRICK_W / 2, base: FLOOR - level * ROW_H});

export type Place = {row: number; col: number; x: number; y: number; at: number};
export type Step = {at: number; from: {x: number; base: number}; to: {x: number; base: number}};

const plan = () => {
  const places: Place[] = [];
  const steps: Step[] = [];
  let t = START;
  let s = 0; // column he stands on
  for (let r = 0; r < ROWS; r++) {
    const others = [...Array(COLS).keys()].filter((c) => c !== s).sort((a, b) => Math.abs(b - s) - Math.abs(a - s));
    for (const c of others) {
      places.push({row: r, col: c, ...brickAt(r, c), at: t});
      t += EVERY;
    }
    const n = s < COLS - 1 ? s + 1 : s - 1; // step onto a neighbouring brick of the new row
    steps.push({at: t, from: standAt(s, r), to: standAt(n, r + 1)});
    t += HOP;
    places.push({row: r, col: s, ...brickAt(r, s), at: t});
    t += EVERY;
    s = n;
  }
  return {places, steps, end: t, endCol: s};
};
export const PLAN = plan();
export const LAST = PLAN.end + DROP; // wall complete
export const LOOK = LAST + 8; // turns to the waiter
export const WAVE = LOOK + 8; // waves down at him

/** The waiter's cycle: lift the brick, nudge it, set it down, level it, look; repeat. */
export const WAIT_CYCLE = 54;
export const waitPhase = (f: number) => ((f - 10) % WAIT_CYCLE + WAIT_CYCLE) % WAIT_CYCLE;
export const WAITER_STANDS = WAVE + 18; // the waiter gets up and looks at the wall

export type SoundEvent = {t: number; kind: 'brick' | 'level' | 'step' | 'drop'};
export const events = (): SoundEvent[] => {
  const ev: SoundEvent[] = [];
  for (const p of PLAN.places) ev.push({t: (p.at + DROP - 1) / FPS, kind: 'brick'});
  for (const s of PLAN.steps) ev.push({t: (s.at + HOP - 1) / FPS, kind: 'step'});
  for (let c = 10; c < WAITER_STANDS; c += WAIT_CYCLE) {
    ev.push({t: (c + 20) / FPS, kind: 'brick'}); // the waiter sets his brick down again
    ev.push({t: (c + 30) / FPS, kind: 'level'});
  }
  ev.push({t: (WAITER_STANDS + 6) / FPS, kind: 'drop'}); // the waiter gets up
  return ev;
};
