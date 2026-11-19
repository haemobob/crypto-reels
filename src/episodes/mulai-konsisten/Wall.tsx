import {interpolate, useCurrentFrame} from 'remotion';
import {colors} from '../../theme/colors';
import {ease} from '../../theme/motion';
import {fonts} from '../../theme/typography';
import {BRICK_H, BRICK_W, COLS, DROP, FLOOR, GONE, LAST, LEAVE, LOOK, ROW_H, ROWS, STAND, WAIT_CYCLE, WAITER_STANDS, WALL_W, WALL_X, brick, placeAt, waitPhase} from './schedule';

/**
 * Wordless scene, our own animation after a reference clip's idea (Neuron Visuals, "perfectionist vs action taker"):
 * left, the waiter keeps lifting, nudging and levelling one brick ("NUNGGU ENTRY SEMPURNA"); right, the builder lays
 * brick after brick, rising with the wall ("MULAI & KONSISTEN"), then looks back and climbs over. Cryptonite colours;
 * no numbers, no prices, no promise of returns.
 */
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const ramp = (f: number, a: number, b: number, e = ease.inOut) => interpolate(f, [a, b], [0, 1], {...clamp, easing: e});
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const GOLD = '#FFD166';
const INK = colors.text;
const STAGE = 1.4;

const Brick = ({x, y, o = 1, glow = 0}: {x: number; y: number; o?: number; glow?: number}) =>
  o <= 0.01 ? null : (
    <g opacity={o}>
      <rect x={x} y={y} width={BRICK_W} height={BRICK_H} rx={4} fill="#1366E0" />
      <rect x={x} y={y} width={BRICK_W} height={9} rx={4} fill="#4FA3FF" />
      <rect x={x} y={y + BRICK_H - 6} width={BRICK_W} height={6} rx={3} fill="#0C4BA8" />
      {glow > 0.01 && <rect x={x - 3} y={y - 3} width={BRICK_W + 6} height={BRICK_H + 6} rx={6} fill="none" stroke="#9FD3FF" strokeWidth={3} opacity={glow} />}
    </g>
  );

type Pose = {x: number; base: number; bend: number; reach: number; head: number; kneel: number; arms?: 'carry' | 'level' | 'down' | 'wave'};
/** A stick figure. base = feet level; bend 0..1 leans forward; reach moves the hands out; kneel 0..1 drops onto one knee. */
const Figure = ({x, base, bend, reach, head, kneel, arms = 'down', facing = 1, clipTop}: Pose & {facing?: number; clipTop?: number}) => {
  const s = facing;
  const hipY = base - lerp(72, 40, kneel);
  const torso = 70;
  const lean = bend * 0.9;
  const neck = {x: x + s * Math.sin(lean) * torso, y: hipY - Math.cos(lean) * torso};
  const headC = {x: neck.x + s * (Math.sin(lean) * 26 + head * 6), y: neck.y - Math.cos(lean) * 24};
  const hand = {x: neck.x + s * lerp(18, 64, reach), y: neck.y + lerp(52, 36, reach) + bend * 30};
  const hand2 = {x: hand.x - s * 14, y: hand.y + 4};
  const elbow = (h: {x: number; y: number}) => ({x: (neck.x + h.x) / 2 - s * 4, y: (neck.y + h.y) / 2 + 14});
  const knee = {x: x + s * lerp(18, 30, kneel), y: lerp(base - 36, base - 8, kneel)};
  const knee2 = {x: x - s * lerp(10, 2, kneel), y: lerp(base - 36, base - 40, kneel)};
  const foot2 = {x: x - s * lerp(14, 36, kneel), y: base};
  const waveHand = {x: neck.x + s * 30, y: neck.y - 60};
  const h1 = arms === 'wave' ? waveHand : hand;
  return (
    <g stroke={INK} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" fill="none" clipPath={clipTop !== undefined ? 'url(#builder-clip)' : undefined}>
      <circle cx={headC.x} cy={headC.y} r={22} fill={INK} stroke="none" />
      <line x1={neck.x} y1={neck.y} x2={x} y2={hipY} />
      <polyline points={`${x},${hipY} ${knee.x},${knee.y} ${knee.x + s * 4},${base}`} />
      <polyline points={`${x},${hipY} ${knee2.x},${knee2.y} ${foot2.x},${foot2.y}`} />
      <polyline points={`${neck.x},${neck.y + 8} ${elbow(h1).x},${elbow(h1).y} ${h1.x},${h1.y}`} />
      <polyline points={`${neck.x},${neck.y + 8} ${elbow(hand2).x},${elbow(hand2).y} ${hand2.x},${hand2.y}`} />
    </g>
  );
};

/** The spirit level: a gold bar with a bubble that drifts and settles. */
const Level = ({x, y, bubble, tilt}: {x: number; y: number; bubble: number; tilt: number}) => (
  <g transform={`rotate(${tilt} ${x + 44} ${y + 7})`}>
    <rect x={x} y={y} width={88} height={14} rx={4} fill={GOLD} />
    <rect x={x + 32} y={y + 3} width={24} height={8} rx={4} fill="#FFF4CC" />
    <circle cx={x + 44 + bubble * 9} cy={y + 7} r={3.4} fill="#7BC67E" />
  </g>
);

/** `at` freezes the scene at a frame (used by the cover); `labels` hides the two labels. */
export const Wall = ({at, labels = true}: {at?: number; labels?: boolean} = {}) => {
  const cf = useCurrentFrame();
  const f = at ?? cf;
  const n = Math.max(0, Math.min(ROWS * COLS, Math.floor((f - placeAt(0)) / (placeAt(1) - placeAt(0))) + 1));
  const rowsDone = Math.floor(Math.min(n, ROWS * COLS) / COLS);

  // --- The builder: behind the wall, rising with it; his torso shows above the top row.
  const cur = Math.min(n, ROWS * COLS - 1);
  const target = brick(cur);
  const prev = brick(Math.max(0, cur - 1));
  const tIn = ramp(f, placeAt(cur) - 4, placeAt(cur) + 2);
  const bx = lerp(prev.x, target.x, tIn) + BRICK_W / 2 - 34;
  const rise = interpolate(f, [placeAt(0), LAST], [0, ROWS], clamp);
  const smoothRows = Math.min(rise, rowsDone + ramp(f, placeAt(rowsDone * COLS) - 6, placeAt(rowsDone * COLS)));
  const topY = FLOOR - smoothRows * ROW_H;
  const phase = f < LAST ? ((f - placeAt(0)) % (placeAt(1) - placeAt(0))) / (placeAt(1) - placeAt(0)) : 0;
  const bend = f < LAST ? 0.35 + 0.35 * Math.sin(phase * Math.PI) : 0;
  // After the wall: stand on top, look back, walk to the far edge, climb down the far side.
  const standUp = ramp(f, LAST, STAND + 8);
  const lookBack = ramp(f, LOOK, LOOK + 8) * (1 - ramp(f, LEAVE - 4, LEAVE + 4));
  const walk = ramp(f, LEAVE, LEAVE + 26, ease.inOut);
  const down = ramp(f, LEAVE + 22, GONE, ease.in);
  const wallTop = FLOOR - ROWS * ROW_H;
  const builderBase = f < LAST ? topY + 36 : lerp(wallTop + 36, wallTop + 2, standUp) + down * 260;
  // He climbs down the far side behind the wall, so the wall hides him.
  const builderX = f < LAST ? bx : lerp(bx, WALL_X + WALL_W - 60, walk);
  const facing = lookBack > 0.5 ? -1 : 1;

  // --- The waiter: kneeling at his single brick; lift, nudge, set, level, check.
  const wp = waitPhase(f);
  const lift = interpolate(wp, [0, 8, 16, 20], [0, 1, 1, 0], clamp);
  const nudge = Math.sin(Math.floor((f - 10) / WAIT_CYCLE) * 2.1) * 8 * ramp(wp, 6, 14);
  const levelOn = interpolate(wp, [22, 28, 46, 52], [0, 1, 1, 0], clamp);
  const bubble = Math.sin(wp * 0.45) * (1 - ramp(wp, 28, 44)) * 1 + Math.sin(Math.floor((f - 10) / WAIT_CYCLE)) * 0.6 * ramp(wp, 36, 44);
  const stands = ramp(f, WAITER_STANDS, WAITER_STANDS + 14);
  const wx = 290;
  const wb = {x: 330 + nudge, y: FLOOR - BRICK_H - lift * 26};

  const labelO = ramp(f, 4, 18);
  // Labels above each figure (screen space, outside the scaled stage), two lines each.
  const label = (x: number, l1: string, l2: string) => (
    <g opacity={labelO} fontFamily={fonts.mono} fontWeight={700} fontSize={34} letterSpacing="0.08em" fill={INK} textAnchor="middle">
      <text x={x} y={392}>{l1}</text>
      <text x={x} y={438}>{l2}</text>
    </g>
  );

  const scene = (mirror = false) => (
    <g>
      {/* Builder first (behind the wall), clipped to above the floor. */}
      {f < GONE + 2 && <Figure x={builderX} base={builderBase} bend={bend} reach={f < LAST ? 0.6 + 0.4 * Math.sin(phase * Math.PI) : 0.2} head={lookBack * 1.5} kneel={0} arms={f < LAST ? 'carry' : lookBack > 0.5 ? 'wave' : 'down'} facing={facing} clipTop={mirror ? undefined : 0} />}
      {/* The brick in the builder's hands, then dropping into place. */}
      {f < LAST && n < ROWS * COLS && (() => {
        const t = ramp(f, placeAt(cur), placeAt(cur) + DROP, ease.in);
        const from = {x: target.x + 10, y: topY - 70};
        return <Brick x={lerp(from.x, target.x, t)} y={lerp(from.y, target.y, t)} />;
      })()}
      {/* The wall, brick by brick, with a short glow as each one lands. */}
      <g clipPath="url(#wall-clip)">
        {Array.from({length: ROWS * COLS}, (_, i) => {
          if (f < placeAt(i) + DROP) return null;
          const b = brick(i);
          const glow = 1 - ramp(f, placeAt(i) + DROP, placeAt(i) + DROP + 10);
          return <Brick key={i} x={b.x} y={b.y} glow={glow} />;
        })}
        {/* Half bricks closing the staggered rows on the left. */}
        {Array.from({length: ROWS}, (_, r) => (r % 2 === 1 && f >= placeAt(r * COLS + COLS - 1) + DROP ? <Brick key={`h${r}`} x={WALL_X - BRICK_W / 2 - 4} y={FLOOR - (r + 1) * ROW_H + 4} /> : null))}
      </g>
      {/* The waiter, his one brick and his level. */}
      <Brick x={wb.x} y={wb.y} />
      <Figure x={wx} base={FLOOR} bend={lerp(0.55 + 0.1 * lift, 0, stands)} reach={lerp(0.55, 0.1, stands)} head={lerp(levelOn * 1.2, 1.6, stands)} kneel={1 - stands} arms="level" />
      {levelOn > 0.01 && stands < 0.5 && <Level x={wb.x - 8} y={wb.y - 16} bubble={bubble} tilt={(1 - levelOn) * -10} />}
    </g>
  );

  return (
    <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{position: 'absolute', inset: 0}}>
      <defs>
        <clipPath id="wall-clip">
          <rect x={WALL_X} y={0} width={WALL_W} height={FLOOR} />
        </clipPath>
        <clipPath id="builder-clip">
          <rect x={0} y={0} width={1080} height={FLOOR} />
        </clipPath>
        <linearGradient id="reflect-fade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.32" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <mask id="reflect-mask">
          <rect x={0} y={FLOOR} width={1080} height={520} fill="url(#reflect-fade)" />
        </mask>
        <radialGradient id="spot" cx="0.5" cy="0.62" r="0.55">
          <stop offset="0" stopColor="#13284D" />
          <stop offset="1" stopColor={colors.bg} />
        </radialGradient>
      </defs>
      <rect width={1080} height={1920} fill="url(#spot)" />
      {/* Floor and a soft reflection. */}
      <line x1={60} x2={1020} y1={FLOOR + 1} y2={FLOOR + 1} stroke="#2A4C86" strokeWidth={3} opacity={0.8} />
      {/* The stage, scaled up around the centre of the floor so the figures read on a phone. */}
      <g transform={`translate(540 ${FLOOR}) scale(${STAGE}) translate(-540 ${-FLOOR})`}>
        <g mask="url(#reflect-mask)">
          <g transform={`translate(0 ${2 * FLOOR + 4}) scale(1 -1)`}>{scene(true)}</g>
        </g>
        {scene()}
      </g>
      {labels && label(250, 'NUNGGU ENTRY', 'SEMPURNA')}
      {labels && label(540 + (WALL_X + WALL_W / 2 - 540) * STAGE, 'MULAI &', 'KONSISTEN')}
    </svg>
  );
};
