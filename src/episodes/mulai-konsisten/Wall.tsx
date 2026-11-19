import {interpolate, useCurrentFrame} from 'remotion';
import {colors} from '../../theme/colors';
import {ease} from '../../theme/motion';
import {fonts} from '../../theme/typography';
import {BRICK_H, BRICK_W, FLOOR, HOP, LAST, LOOK, PLAN, ROWS, WAIT_CYCLE, WAITER_STANDS, WAVE, WALL_W, WALL_X, levelBase, waitPhase} from './schedule';

/**
 * Wordless scene, our own animation after a reference clip's idea (Neuron Visuals, "perfectionist vs action taker"):
 * left, the waiter keeps lifting, nudging and levelling one brick ("NUNGGU ENTRY SEMPURNA"); right, the builder lays
 * brick after brick, standing on what he has laid and rising with the wall ("MULAI & KONSISTEN"), then turns and
 * waves down at the waiter, who finally stands up. Cryptonite colours;
 * no numbers, no prices, no promise of returns.
 */
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const ramp = (f: number, a: number, b: number, e = ease.inOut) => interpolate(f, [a, b], [0, 1], {...clamp, easing: e});
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const GOLD = '#FFD166';
const INK = colors.text;
const STAGE = 1.4;

const Brick = ({x, y, w = BRICK_W, o = 1, glow = 0}: {x: number; y: number; w?: number; o?: number; glow?: number}) =>
  o <= 0.01 ? null : (
    <g opacity={o}>
      <rect x={x} y={y} width={w} height={BRICK_H} rx={4} fill="#1366E0" />
      <rect x={x} y={y} width={w} height={9} rx={4} fill="#4FA3FF" />
      <rect x={x} y={y + BRICK_H - 6} width={w} height={6} rx={3} fill="#0C4BA8" />
      {glow > 0.01 && <rect x={x - 3} y={y - 3} width={w + 6} height={BRICK_H + 6} rx={6} fill="none" stroke="#9FD3FF" strokeWidth={3} opacity={glow} />}
    </g>
  );

type Pose = {x: number; base: number; bend: number; reach: number; head: number; kneel: number; arms?: 'carry' | 'level' | 'down' | 'wave'};
/** A stick figure. base = feet level; bend 0..1 leans forward; reach moves the hands out; kneel 0..1 drops onto one knee. */
const Figure = ({x, base, bend, reach, head, kneel, arms = 'down', facing = 1, wave = 0}: Pose & {facing?: number; wave?: number}) => {
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
  const waveHand = {x: neck.x + s * (26 + 16 * Math.sin(wave)), y: neck.y - 58 + 6 * Math.cos(wave)};
  const h1 = arms === 'wave' ? waveHand : hand;
  return (
    <g stroke={INK} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" fill="none">
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

/** `at` freezes the scene at a frame (used by the cover), `waiterAt` freezes the waiter at another; `labels` hides the two labels. */
export const Wall = ({at, waiterAt, labels = true}: {at?: number; waiterAt?: number; labels?: boolean} = {}) => {
  const cf = useCurrentFrame();
  const f = at ?? cf;
  // --- The builder stands ON the bricks he has laid (schedule.ts PLAN): lays the row around him, steps up, lays the brick
  // he stood on. Then looks back, walks to the far edge, jumps down to the floor and walks off.
  const P = PLAN.places;
  let k = -1;
  for (let i = 0; i < P.length; i++) if (P[i].at <= f) k = i;
  const placing = k >= 0 && f < P[k].land ? P[k] : null;
  const next = P[Math.min(k + 1, P.length - 1)];
  let pos = {x: WALL_X + BRICK_W / 2, base: FLOOR};
  let hopping = 0;
  for (const st of PLAN.steps) {
    if (f >= st.at + HOP) pos = st.to;
    else if (f >= st.at) {
      const t = ease.inOut((f - st.at) / HOP);
      pos = {x: lerp(st.from.x, st.to.x, t), base: lerp(st.from.base, st.to.base, t) - Math.sin(Math.PI * t) * 26};
      hopping = 1;
      break;
    } else break;
  }
  let facing = Math.sign((placing ?? next).x + (placing ?? next).w / 2 - pos.x) || 1;
  let bend = placing ? 0.75 * Math.sin(Math.PI * ((f - placing.at) / (placing.land - placing.at))) + 0.2 : 0.2 + hopping * 0.1;
  let reach = placing ? 0.8 : 0.35;
  let wave = 0;
  let arms: 'carry' | 'down' | 'wave' = 'carry';
  if (f >= LAST) {
    // Wall done: he straightens up on top, turns to the waiter and waves down at him.
    pos = {x: PLAN.endX, base: levelBase(ROWS)};
    bend = interpolate(f, [LAST, LAST + 6], [0.3, 0], clamp);
    reach = 0.2;
    arms = f >= WAVE ? 'wave' : 'down';
    facing = f >= LOOK ? -1 : facing;
    wave = (f - WAVE) * 0.45;
  }
  // The brick he carries (full or half, the size of the next one he lays): at his chest, then swung down into place.
  const held = placing ?? next;
  const hand = {x: pos.x + facing * 34 - held.w / 2, y: pos.base - 112};
  const swing = placing ? ease.inOut((f - placing.at) / (placing.land - placing.at)) : 0;
  const carried = f < LAST && (placing || k < P.length - 1) ? {x: lerp(hand.x, held.x, swing), y: lerp(hand.y, held.y, swing), w: held.w} : null;

  // --- The waiter: kneeling at his single brick; lift, nudge, set, level, check.
  const wf = waiterAt ?? f;
  const wp = waitPhase(wf);
  const lift = interpolate(wp, [0, 8, 16, 20], [0, 1, 1, 0], clamp);
  const nudge = Math.sin(Math.floor((wf - 10) / WAIT_CYCLE) * 2.1) * 8 * ramp(wp, 6, 14);
  const levelOn = interpolate(wp, [22, 28, 46, 52], [0, 1, 1, 0], clamp);
  const bubble = Math.sin(wp * 0.45) * (1 - ramp(wp, 28, 44)) * 1 + Math.sin(Math.floor((wf - 10) / WAIT_CYCLE)) * 0.6 * ramp(wp, 36, 44);
  const stands = ramp(wf, WAITER_STANDS, WAITER_STANDS + 14);
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
      {/* The wall, brick by brick (running bond, half bricks at the ends of odd rows), with a short glow as each lands. */}
      {P.map((q, i) => {
        if (f < q.land) return null;
        const glow = 1 - ramp(f, q.land, q.land + 10);
        return <Brick key={i} x={q.x} y={q.y} w={q.w} glow={glow} />;
      })}
      {/* The builder, standing on what he has built, and the brick he is carrying. */}
      <Figure x={pos.x} base={pos.base} bend={bend} reach={reach} head={f >= LOOK ? 0.8 : 0} kneel={0} arms={arms} facing={facing} wave={wave} />
      {carried && <Brick x={carried.x} y={carried.y} w={carried.w} />}
      {/* The waiter, his one brick and his level. */}
      <Brick x={wb.x} y={wb.y} />
      <Figure x={wx} base={FLOOR} bend={lerp(0.55 + 0.1 * lift, 0, stands)} reach={lerp(0.55, 0.1, stands)} head={lerp(levelOn * 1.2, 1.6, stands)} kneel={1 - stands} arms="level" />
      {levelOn > 0.01 && stands < 0.5 && <Level x={wb.x - 8} y={wb.y - 16} bubble={bubble} tilt={(1 - levelOn) * -10} />}
    </g>
  );

  return (
    <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{position: 'absolute', inset: 0}}>
      <defs>
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
