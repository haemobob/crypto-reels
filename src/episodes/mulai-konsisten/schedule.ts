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

export const START = 20; // first brick
export const EVERY = 6; // frames per full brick
export const EVERY_HALF = 4; // frames per half brick
export const DROP = 5; // frames for a brick to go from his hands into place
export const HOP = 8; // frames for a step up onto the new row
export const HALF = (BRICK_W - GAP) / 2; // a half brick, so the staggered rows end flush with the wall
const FOOT = 24; // half the width of his stance

/** Running bond, as a real wall is laid: even rows are four full bricks; odd rows are a half brick at each end with
 *  three full bricks between them, so every joint sits over the middle of the brick below and both ends are flush. */
export type Piece = {x: number; w: number};
export const rowPieces = (r: number): Piece[] =>
  r % 2 === 0
    ? [0, 1, 2, 3].map((c) => ({x: WALL_X + c * (BRICK_W + GAP), w: BRICK_W}))
    : [{x: WALL_X, w: HALF}, ...[0, 1, 2].map((c) => ({x: WALL_X + HALF + GAP + c * (BRICK_W + GAP), w: BRICK_W})), {x: WALL_X + WALL_W - HALF, w: HALF}];
/** Top edge of brick row r, and the builder's feet when standing `level` rows up (0 = the floor). */
export const rowTop = (r: number) => FLOOR - (r + 1) * ROW_H + GAP;
export const levelBase = (level: number) => FLOOR - level * ROW_H;

export type Place = {row: number; x: number; w: number; y: number; at: number; land: number};
export type Step = {at: number; from: {x: number; base: number}; to: {x: number; base: number}};

/** For each row: lay every brick that isn't under his feet (farthest first), step up onto the nearest full brick of
 *  the new row, then lay the one or two bricks where he was standing. */
const plan = () => {
  const places: Place[] = [];
  const steps: Step[] = [];
  let t = START;
  let sx = WALL_X + BRICK_W / 2; // where he stands
  const centre = (q: Piece) => q.x + q.w / 2;
  const lay = (r: number, q: Piece) => {
    const dur = q.w < BRICK_W ? EVERY_HALF : EVERY;
    places.push({row: r, ...q, y: rowTop(r), at: t, land: t + Math.min(DROP, dur)});
    t += dur;
  };
  for (let r = 0; r < ROWS; r++) {
    const pcs = rowPieces(r);
    const under = pcs.filter((q) => q.x < sx + FOOT && q.x + q.w > sx - FOOT);
    const far = (x: number) => (a: Piece, b: Piece) => Math.abs(centre(b) - x) - Math.abs(centre(a) - x);
    const others = pcs.filter((q) => !under.includes(q)).sort(far(sx));
    for (const q of others) lay(r, q);
    const onto = others.filter((q) => q.w === BRICK_W).sort((a, b) => Math.abs(centre(a) - sx) - Math.abs(centre(b) - sx))[0];
    const nx = centre(onto);
    steps.push({at: t, from: {x: sx, base: levelBase(r)}, to: {x: nx, base: levelBase(r + 1)}});
    t += HOP;
    for (const q of [...under].sort(far(nx))) lay(r, q);
    sx = nx;
  }
  return {places, steps, end: t, endX: sx};
};
export const PLAN = plan();
export const LAST = PLAN.places[PLAN.places.length - 1].land; // wall complete
export const LOOK = LAST + 8; // turns to the waiter
export const WAVE = LOOK + 8; // waves down at him

/** The waiter's cycle: lift the brick, nudge it, set it down, level it, look; repeat. */
export const WAIT_CYCLE = 54;
export const waitPhase = (f: number) => ((f - 10) % WAIT_CYCLE + WAIT_CYCLE) % WAIT_CYCLE;
export const WAITER_STANDS = WAVE + 16; // the waiter gets up and looks at the wall

export type SoundEvent = {t: number; kind: 'brick' | 'level' | 'step' | 'drop'};
export const events = (): SoundEvent[] => {
  const ev: SoundEvent[] = [];
  for (const p of PLAN.places) ev.push({t: (p.land - 1) / FPS, kind: 'brick'});
  for (const s of PLAN.steps) ev.push({t: (s.at + HOP - 1) / FPS, kind: 'step'});
  for (let c = 10; c < WAITER_STANDS; c += WAIT_CYCLE) {
    ev.push({t: (c + 20) / FPS, kind: 'brick'}); // the waiter sets his brick down again
    ev.push({t: (c + 30) / FPS, kind: 'level'});
  }
  ev.push({t: (WAITER_STANDS + 6) / FPS, kind: 'drop'}); // the waiter gets up
  return ev;
};
