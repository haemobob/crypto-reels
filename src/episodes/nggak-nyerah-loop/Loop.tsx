import {interpolate, useCurrentFrame} from 'remotion';
import {brand} from '../../theme/brand';
import {colors} from '../../theme/colors';
import {ease} from '../../theme/motion';
import {fonts} from '../../theme/typography';
import {NOW} from '../btc-ulang-2021/data';
import {DRIBBLE, FIG_X, FLIGHT, GATHER, HOOP_X, LANES, RELEASE, SCENE_FRAMES, dribbling, floorOf, makeFrame, rimOf, shotAt, type Lane} from './schedule';

/**
 * Wordless loop (user request, 11 Nov 2026): three traders shoot at three hoops; the first two give up, the third
 * keeps shooting and finally scores. Our own animation in Cryptonite colours, after a reference clip's idea;
 * no statistics on screen (the reference's 93/6/1% were unsourced).
 */
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const ramp = (f: number, a: number, b: number, e = ease.inOut) => interpolate(f, [a, b], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: e});

/** The ball is a Bitcoin coin (₿ symbol: Wikimedia Commons File:Bitcoin.svg, public domain), turning as it moves. */
const Ball = ({x, y, o = 1}: {x: number; y: number; o?: number}) =>
  o <= 0.01 ? null : (
    <g transform={`translate(${x},${y})`} opacity={o}>
      <circle r={21} fill="#C26F0E" cy={2} />
      <g transform={`rotate(${((x + y) * 0.9) % 360}) scale(0.64) translate(-32,-32)`}>
        <path fill="#f7931a" d="m63.033,39.744c-4.274,17.143-21.637,27.576-38.782,23.301-17.138-4.274-27.571-21.638-23.295-38.78,4.272-17.145,21.635-27.579,38.775-23.305,17.144,4.274,27.576,21.64,23.302,38.784z" />
        <path fill="#FFF" d="m46.103,27.444c0.637-4.258-2.605-6.547-7.038-8.074l1.438-5.768-3.511-0.875-1.4,5.616c-0.923-0.23-1.871-0.447-2.813-0.662l1.41-5.653-3.509-0.875-1.439,5.766c-0.764-0.174-1.514-0.346-2.242-0.527l0.004-0.018-4.842-1.209-0.934,3.75s2.605,0.597,2.55,0.634c1.422,0.355,1.679,1.296,1.636,2.042l-1.638,6.571c0.098,0.025,0.225,0.061,0.365,0.117-0.117-0.029-0.242-0.061-0.371-0.092l-2.296,9.205c-0.174,0.432-0.615,1.08-1.609,0.834,0.035,0.051-2.552-0.637-2.552-0.637l-1.743,4.019,4.569,1.139c0.85,0.213,1.683,0.436,2.503,0.646l-1.453,5.834,3.507,0.875,1.439-5.772c0.958,0.26,1.888,0.5,2.798,0.726l-1.434,5.745,3.511,0.875,1.453-5.823c5.987,1.133,10.489,0.676,12.384-4.739,1.527-4.36-0.076-6.875-3.226-8.515,2.294-0.529,4.022-2.038,4.483-5.155zm-8.022,11.249c-1.085,4.36-8.426,2.003-10.806,1.412l1.928-7.729c2.38,0.594,10.012,1.77,8.878,6.317zm1.086-11.312c-0.99,3.966-7.1,1.951-9.082,1.457l1.748-7.01c1.982,0.494,8.365,1.416,7.334,5.553z" />
      </g>
    </g>
  );

/** Faint real BTC weekly candles behind the court (Binance daily, Jul 2025 – Nov 2026, as in the covers). */
const Backdrop = () => {
  const ks: Array<{o: number; h: number; l: number; c: number}> = [];
  for (let i = 1; i < NOW.length; i += 7) {
    const w = NOW.slice(i, i + 7);
    ks.push({o: NOW[i - 1].c, h: Math.max(...w.map((p) => p.h)), l: Math.min(...w.map((p) => p.l)), c: w[w.length - 1].c});
  }
  const lo = Math.min(...ks.map((k) => k.l));
  const hi = Math.max(...ks.map((k) => k.h));
  const y = (r: number) => 1560 - ((Math.log(r) - Math.log(lo)) / (Math.log(hi) - Math.log(lo))) * 1240;
  const step = 1080 / ks.length;
  return (
    <g opacity={0.16} style={{filter: 'blur(1.5px)'}}>
      {ks.map((k, i) => {
        const c = k.c >= k.o ? colors.positive : colors.negative;
        const x = i * step + step / 2;
        return (
          <g key={i}>
            <line x1={x} x2={x} y1={y(k.h)} y2={y(k.l)} stroke={c} strokeWidth={2} />
            <rect x={x - step * 0.32} y={y(Math.max(k.o, k.c))} width={step * 0.64} height={Math.max(3, y(Math.min(k.o, k.c)) - y(Math.max(k.o, k.c)))} fill={c} />
          </g>
        );
      })}
    </g>
  );
};

/** Each shot's result as a candle under the lane's label (red = loss, tall green = the one that goes in), and a
 *  LOSS / PROFIT tag popping at the rim when the ball gets there. */
const Results = ({lane, f}: {lane: Lane; f: number}) => {
  const rim = rimOf(lane.y);
  const n = lane.shots.length;
  const w = 32;
  const x0 = 540 - (n * w) / 2 + w / 2;
  return (
    <g>
      {lane.shots.map((s, k) => {
        const land = s.at + RELEASE + FLIGHT;
        if (f < land) return null;
        const pop = interpolate(f, [land, land + 5, land + 9], [0, 1.25, 1], {extrapolateRight: 'clamp'});
        const x = x0 + k * w;
        const c = s.make ? colors.positive : colors.negative;
        const top = s.make ? lane.y + 6 : lane.y + 28;
        const bottom = lane.y + 58;
        const mid = (top + bottom) / 2;
        return (
          <g key={k} transform={`translate(${x} ${mid}) scale(1 ${pop}) translate(${-x} ${-mid})`}>
            <line x1={x} x2={x} y1={top - 6} y2={bottom + 6} stroke={c} strokeWidth={2} />
            <rect x={x - 10} y={top} width={20} height={bottom - top} rx={2} fill={c} />
          </g>
        );
      })}
      {lane.shots.map((s, k) => {
        const land = s.at + RELEASE + FLIGHT;
        const a = f - land;
        if (a < 0 || a > 28) return null;
        const o = Math.min(1, a / 3) * (1 - Math.max(0, a - 16) / 12);
        return (
          <text key={`t${k}`} x={rim.x + (s.make ? 140 : 110)} y={rim.y - 30 - a * 1.6} textAnchor="middle" dominantBaseline="middle" fontFamily={s.make ? fonts.heading : fonts.mono} fontWeight={800} fontSize={s.make ? 44 : 26} fill={s.make ? colors.positive : colors.negative} opacity={o} letterSpacing="0.04em">
            {s.make ? '+PROFIT' : 'LOSS'}
          </text>
        );
      })}
    </g>
  );
};

const Hoop = ({y, glow}: {y: number; glow: number}) => {
  const r = rimOf(y);
  const net = glow > 0.15 ? colors.positive : '#A9BBDD';
  return (
    <g>
      <rect x={HOOP_X - 74} y={y - 250} width={12} height={330} rx={3} fill="#3A4C6E" />
      <rect x={HOOP_X - 66} y={y - 226} width={70} height={10} fill="#3A4C6E" />
      <rect x={HOOP_X} y={y - 236} width={12} height={110} rx={3} fill="#6F84A8" />
      {glow > 0 && <ellipse cx={r.x} cy={r.y + 26} rx={70} ry={50} fill={colors.electric} opacity={0.35 * glow} />}
      <path d={`M${r.x - 38},${r.y} L${r.x - 26},${r.y + 56} L${r.x + 26},${r.y + 56} L${r.x + 38},${r.y}`} stroke={net} strokeWidth={2.5} fill="none" />
      <path d={`M${r.x - 20},${r.y} L${r.x - 12},${r.y + 56} M${r.x},${r.y} V${r.y + 56} M${r.x + 20},${r.y} L${r.x + 12},${r.y + 56} M${r.x - 34},${r.y + 20} H${r.x + 34} M${r.x - 30},${r.y + 40} H${r.x + 30}`} stroke={net} strokeWidth={1.8} opacity={0.8} />
      <ellipse cx={r.x} cy={r.y} rx={40} ry={8} fill="none" stroke={glow > 0.15 ? colors.positive : colors.electric} strokeWidth={5} />
    </g>
  );
};

/** Stick trader facing left. raise: shot; dip: knees; slump: gave up; cheer: arms up; jump: px off the floor. */
const Figure = ({y, raise = 0, dip = 0, slump = 0, cheer = 0, jump = 0, handBall = 0}: {y: number; raise?: number; dip?: number; slump?: number; cheer?: number; jump?: number; handBall?: number}) => {
  const x = FIG_X;
  const fl = floorOf(y);
  const k = dip * 10 - jump;
  const lean = slump * 10;
  const head = {x: x - lean - slump * 4, y: y - 96 + k + slump * 10};
  const neck = {x: x - lean * 0.6, y: y - 76 + k + slump * 6};
  const hip = {x, y: y + 6 + k};
  // Hands: chest → raised (shot) → hanging (slump) → V (cheer); handBall moves the shooting hand to the dribble.
  let hx = lerp(x - 30, x - 30, raise);
  let hy = lerp(y - 40 + k, y - 132 + k, raise);
  hx = lerp(hx, x - 44, handBall);
  hy = lerp(hy, y - 6 + k, handBall);
  hx = lerp(hx, x - 12 - lean, slump);
  hy = lerp(hy, y + 30 + k, slump);
  const cheerL = {x: lerp(hx, x - 46, cheer), y: lerp(hy, y - 150 + k, cheer)};
  const cheerR = {x: lerp(hx + 14, x + 46, cheer), y: lerp(hy + 4, y - 150 + k, cheer)};
  const elbow = (h: {x: number; y: number}, side: number) => ({x: (neck.x + h.x) / 2 + side * 12, y: (neck.y + 10 + h.y) / 2 + 8});
  const eL = elbow(cheerL, -1);
  const eR = elbow(cheerR, 1);
  return (
    <g stroke={colors.text} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" fill="none">
      <circle cx={head.x} cy={head.y} r={20} fill={colors.text} stroke="none" />
      <line x1={neck.x} y1={neck.y} x2={hip.x} y2={hip.y} />
      <polyline points={`${hip.x},${hip.y} ${x - 14},${lerp(y + 44, fl - 30, jump / 40) + dip * 5} ${x - 20},${fl - jump}`} />
      <polyline points={`${hip.x},${hip.y} ${x + 16},${lerp(y + 44, fl - 30, jump / 40) + dip * 5} ${x + 22},${fl - jump}`} />
      <polyline points={`${neck.x},${neck.y + 10} ${eL.x},${eL.y} ${cheerL.x},${cheerL.y}`} />
      <polyline points={`${neck.x},${neck.y + 10} ${eR.x},${eR.y} ${cheerR.x},${cheerR.y}`} />
    </g>
  );
};

/** Everything one lane shows at frame f. */
const laneState = (lane: Lane, f: number) => {
  const fl = floorOf(lane.y);
  const rim = rimOf(lane.y);
  const mk = makeFrame(lane);
  const quit = lane.quitAt !== null ? ramp(f, lane.quitAt, lane.quitAt + 12) : 0;
  const cheerT = mk !== null && f >= mk ? f - mk : -1;
  let raise = 0;
  let dip = 0;
  let handBall = 0;
  let ball: {x: number; y: number; o: number} | null = null;
  let glow = 0;
  const s = shotAt(lane, f);
  const drib = dribbling(lane, f);
  const nextShot = lane.shots.find((x) => x.at > f);
  if (drib) {
    const ph = (f % DRIBBLE) / DRIBBLE;
    const top = lane.y - 6;
    const bottom = fl - 17;
    const h = Math.abs(Math.cos(Math.PI * ph));
    ball = {x: FIG_X - 44, y: lerp(bottom, top, h), o: 1};
    handBall = 1;
    dip = 0.25 * (1 - h);
  } else if (nextShot && nextShot.at - f < GATHER && (!s || s.t >= RELEASE + FLIGHT + 8)) {
    // Gathering: the ball comes up to the chest, knees dip.
    const g = 1 - (nextShot.at - f) / GATHER;
    ball = {x: FIG_X - 36, y: lerp(lane.y - 6, lane.y - 50, g), o: 1};
    handBall = 1 - g;
    dip = g;
  }
  if (s && s.t < RELEASE + FLIGHT + 40) {
    const t = s.t;
    if (t < RELEASE) {
      raise = clamp01((t - 4) / (RELEASE - 4));
      dip = t < 6 ? 1 - t / 6 : 0;
      ball = {x: FIG_X - 36, y: lerp(lane.y - 50, lane.y - 150, raise), o: 1};
    } else {
      raise = t < RELEASE + 10 ? 1 : Math.max(0, 1 - (t - RELEASE - 10) / 8);
      const tb = t - RELEASE;
      const sx = FIG_X - 36;
      const sy = lane.y - 150;
      if (tb <= FLIGHT) {
        const u = tb / FLIGHT;
        const tx = s.make ? rim.x : rim.x + 46;
        const ty = s.make ? rim.y - 10 : rim.y - 12;
        const apex = Math.min(sy, ty) - 120;
        const cx = (sx + tx) / 2;
        const cy = 2 * apex - (sy + ty) / 2;
        ball = {x: (1 - u) ** 2 * sx + 2 * (1 - u) * u * cx + u ** 2 * tx, y: (1 - u) ** 2 * sy + 2 * (1 - u) * u * cy + u ** 2 * ty, o: 1};
      } else {
        const a = tb - FLIGHT;
        const lastBeforeQuit = lane.quitAt !== null && s.i === lane.shots.length - 1;
        if (s.make) {
          // Through the net, down to the floor under the hoop, a couple of small bounces.
          const drop = Math.min(1, a / 12);
          const yb = a <= 12 ? lerp(rim.y - 10, fl - 17, drop * drop) : fl - 17 - Math.abs(Math.sin(((a - 12) / 10) * Math.PI)) * 30 * Math.exp(-(a - 12) / 12);
          ball = {x: rim.x + Math.min(a, 30) * 0.6, y: yb, o: 1};
          glow = Math.max(0, 1 - a / 40);
        } else {
          // Off the rim, out and down; it rolls, and stays on the floor when this was the last try.
          const air = 14;
          let x = rim.x + 46 + 5 * Math.min(a, air);
          let y = rim.y - 12 - 7 * a + 0.5 * ((fl - 17 - (rim.y - 12) + 7 * air) / (0.5 * air * air)) * a * a;
          if (a >= air) {
            const r = a - air;
            x = rim.x + 46 + 5 * air + 60 * (1 - Math.exp(-r / 10));
            y = fl - 17;
          }
          y = Math.min(y, fl - 17);
          ball = {x, y, o: lastBeforeQuit ? 1 : Math.max(0, 1 - Math.max(0, a - 20) / 8)};
        }
      }
    }
  }
  // After quitting, the dropped ball stays where it rolled.
  if (lane.quitAt !== null && f >= lane.quitAt) {
    const last = lane.shots[lane.shots.length - 1];
    const a = last.at + RELEASE + FLIGHT + 40;
    if (f >= a) ball = {x: rim.x + 46 + 70 + 60, y: fl - 17, o: 1};
  }
  // After the make: the ball rests under the hoop.
  if (mk !== null && f >= mk + 40) ball = {x: rim.x + 18, y: fl - 17, o: 1};
  const cheer = cheerT >= 0 ? ramp(cheerT, 0, 6, ease.out) : 0;
  const jump = cheerT >= 0 ? 34 * Math.abs(Math.sin((cheerT / 15) * Math.PI)) : 0;
  return {raise: raise * (1 - quit) * (1 - cheer), dip: dip * (1 - quit), handBall: handBall * (1 - quit), slump: quit, cheer, jump, ball, glow, cheerT};
};

export const Loop = () => {
  const f = useCurrentFrame();
  const intro = 1; // visible from frame 0: the first frame is often the thumbnail
  return (
    <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{position: 'absolute', inset: 0}}>
      <defs>
        <radialGradient id="topLight" cx="50%" cy="0%" r="70%">
          <stop offset="0%" stopColor={colors.electric} stopOpacity={0.42} />
          <stop offset="60%" stopColor={colors.blue} stopOpacity={0.08} />
          <stop offset="100%" stopColor={colors.blue} stopOpacity={0} />
        </radialGradient>
        <filter id="labelGlow" x="-30%" y="-80%" width="160%" height="260%">
          <feGaussianBlur stdDeviation="12" />
        </filter>
      </defs>
      <Backdrop />
      <rect x={0} y={0} width={1080} height={1100} fill="url(#topLight)" />
      {LANES.map((lane, i) => {
        const st = laneState(lane, f);
        const glowLabel = st.cheerT >= 0 ? Math.min(1, st.cheerT / 8) * (0.75 + 0.25 * Math.sin(st.cheerT / 4)) : 0;
        return (
          <g key={i} opacity={intro}>
            <line x1={60} x2={1020} y1={floorOf(lane.y)} y2={floorOf(lane.y)} stroke="#1E3256" strokeWidth={2} />
            <Hoop y={lane.y} glow={st.glow} />
            {/* The label: TRADER over the line; the third lane's key word in blue, glowing once the shot goes in. */}
            <g>
              <text x={540} y={lane.y - 68} textAnchor="middle" dominantBaseline="middle" fontFamily={fonts.mono} fontWeight={700} fontSize={27} fill="#9FB3D6" letterSpacing="0.2em">TRADER</text>
              {glowLabel > 0 && (
                <text x={540} y={lane.y - 24} textAnchor="middle" dominantBaseline="middle" fontFamily={fonts.heading} fontWeight={800} fontSize={46} fill={colors.electric} filter="url(#labelGlow)" opacity={glowLabel}>
                  {lane.key ? `${lane.key} ${lane.label}` : lane.label}
                </text>
              )}
              <text x={540} y={lane.y - 24} textAnchor="middle" dominantBaseline="middle" fontFamily={fonts.heading} fontWeight={800} fontSize={46} fill={glowLabel > 0 ? colors.light : colors.text} letterSpacing="0.01em">
                {lane.key && <tspan fill={colors.electric}>{lane.key} </tspan>}
                {lane.label}
              </text>
            </g>
            <Results lane={lane} f={f} />
            <Figure y={lane.y} raise={st.raise} dip={st.dip} handBall={st.handBall} slump={st.slump} cheer={st.cheer} jump={st.jump} />
            {st.ball && <Ball x={st.ball.x} y={st.ball.y} o={st.ball.o} />}
          </g>
        );
      })}
      {/* Bottom signature (the reference had its own name here): our brand line. */}
      <text x={540} y={1640} textAnchor="middle" dominantBaseline="middle" fontFamily={fonts.heading} fontWeight={700} fontSize={30} fill={colors.muted} letterSpacing="0.08em" opacity={intro * (1 - ramp(f, SCENE_FRAMES - 8, SCENE_FRAMES))}>
        {brand.outroLine}
      </text>
    </svg>
  );
};
