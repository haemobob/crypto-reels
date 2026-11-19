/**
 * One schedule for picture and sound (wordless Reel, user request 19 Nov 2026): the builder lays a 4-wide, 12-row
 * wall one brick at a time, rising with it, then looks back and climbs over; the waiter keeps adjusting one brick.
 * Frames at 30 fps; the score script reads the same events.
 */
export const FPS = 30;
export const SCENE_FRAMES = 450; // 15 s, then the 2 s branded outro

export const FLOOR = 1360;
export const BRICK_W = 72;
export const BRICK_H = 34;
export const GAP = 4;
export const ROW_H = BRICK_H + GAP;
export const COLS = 4;
export const ROWS = 12;
export const WALL_X = 560; // left edge of the wall
export const WALL_W = COLS * BRICK_W + (COLS - 1) * GAP;

export const START = 24; // first brick
export const EVERY = 6; // frames per brick
export const DROP = 6; // frames for a brick to settle
export const placeAt = (n: number) => START + n * EVERY;
export const LAST = placeAt(ROWS * COLS - 1) + DROP; // wall complete
export const STAND = LAST + 6; // builder stands on top
export const LOOK = STAND + 16; // looks back at the waiter
export const LEAVE = LOOK + 28; // walks to the far edge
export const GONE = LEAVE + 30; // has climbed down the far side

/** Brick n's position: rows bottom-up, alternate rows run right-to-left (as a builder works back and forth). */
export const brick = (n: number) => {
  const row = Math.floor(n / COLS);
  const k = n % COLS;
  const col = row % 2 === 0 ? k : COLS - 1 - k;
  const offset = row % 2 === 0 ? 0 : BRICK_W / 2; // stagger odd rows by half a brick
  return {row, col, x: WALL_X + col * (BRICK_W + GAP) + offset, y: FLOOR - (row + 1) * ROW_H + GAP};
};

/** The waiter's cycle: lift the brick, nudge it, set it down, level it, look; repeat. */
export const WAIT_CYCLE = 54;
export const waitPhase = (f: number) => ((f - 10) % WAIT_CYCLE + WAIT_CYCLE) % WAIT_CYCLE;
export const WAITER_STANDS = GONE + 4;

export type SoundEvent = {t: number; kind: 'brick' | 'level' | 'step' | 'drop'};
export const events = (): SoundEvent[] => {
  const ev: SoundEvent[] = [];
  for (let n = 0; n < ROWS * COLS; n++) ev.push({t: (placeAt(n) + DROP - 1) / FPS, kind: 'brick'});
  for (let c = 10; c < WAITER_STANDS; c += WAIT_CYCLE) {
    ev.push({t: (c + 20) / FPS, kind: 'brick'}); // the waiter sets his brick down again
    ev.push({t: (c + 30) / FPS, kind: 'level'});
  }
  for (let s = LEAVE; s < LEAVE + 28; s += 9) ev.push({t: s / FPS, kind: 'step'});
  ev.push({t: (GONE - 4) / FPS, kind: 'drop'});
  return ev;
};
