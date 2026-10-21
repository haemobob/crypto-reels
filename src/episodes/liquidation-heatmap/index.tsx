import type {ReactNode} from 'react';
import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import captions from '../../../episodes/liquidation-heatmap/captions.json';
import config from '../../../episodes/liquidation-heatmap/episode.json';
import {Ground} from '../../components/Ground';
import {Hi} from '../../components/Headline';
import {HeadlineTrack} from '../../components/HeadlineTrack';
import {Sfx} from '../../components/Sfx';
import {cameraAt, cameraTransform, type CamKey} from '../../lib/camera';
import {useCues} from '../../lib/cues';
import type {EpisodeModule} from '../../lib/episode-module';
import type {Captions, EpisodeConfig} from '../../lib/types';
import {colors} from '../../theme/colors';
import {ease} from '../../theme/motion';
import {fonts} from '../../theme/typography';

// Layout (screen px): headlines own 470–690, the stage owns 700–1520, the source line sits at 1534.
const HEADLINE_Y = 585;
const STAGE = {top: 700, w: 1080, h: 820};
const SOURCE_Y = 1534;

// Real anchor: the CoinGlass screenshot (1862×1568 crop) in a fixed window, with a gutter on the right for tags.
const SHOT = {w: 1862, h: 1568, file: 'episodes/liquidation-heatmap/coinglass-heatmap-2026-10-21.png'};
const WIN = {x: 90, y: 40, w: 760, h: 640};
// Two bright bands, read off the screenshot's own price axis.
const SHOT_BANDS = [
  {iy: 1063, label: '~$82.300'},
  {iy: 712, label: '~$84.800'},
];
const ZOOM = {fx: 1460, fy: 888, z: 2.4};

// Designed heatmap (ILUSTRASI): price ladder 80.6K–86.2K, time flows left to right.
const PLOT = {x0: 90, x1: 900, y0: 80, y1: 700};
const P_MIN = 80600;
const P_MAX = 86200;
const py = (p: number) => PLOT.y1 - ((p - P_MIN) / (P_MAX - P_MIN)) * (PLOT.y1 - PLOT.y0);
const px = (u: number) => PLOT.x0 + u * (PLOT.x1 - PLOT.x0);

const NOW = 84222;
const ENTRY = 84000;
const LIQ_LONG = Math.round(ENTRY * (1 - 1 / 50 + 0.004)); // 82,656
const LIQ_SHORT = Math.round(ENTRY * (1 + 1 / 50 - 0.004)); // 85,344
const BAND_LO = 82330;
const BAND_HI = 84790;
// Fainter clusters, roughly where the screenshot shows them (ILUSTRASI).
const FAINT = [81500, 82000, 83600, 84050, 85450, 85950];

const usd = (n: number) => `$${Math.round(n).toLocaleString('id-ID')}`;
const fade = (frame: number, from: number, len = 10) =>
  interpolate(frame, [from, from + len], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease.out});
const fadeOut = (frame: number, at: number, len = 10) =>
  interpolate(frame, [at, at + len], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
const cueFrame = (name: keyof typeof captions.cues) => Math.round(captions.cues[name] * 30);

// Deterministic pseudo-random (no Math.random in renders).
const rand = (i: number) => {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};
// Liquidation ticks that rain in and stack into the bands: most near the two bands, some scattered.
const TICKS = Array.from({length: 140}, (_, i) => {
  const r = rand(i);
  const centre = r < 0.55 ? BAND_LO : r < 0.85 ? BAND_HI : P_MIN + 300 + rand(i + 900) * (P_MAX - P_MIN - 600);
  const spread = r < 0.85 ? (rand(i + 300) - 0.5) * 160 : 0;
  return {price: centre + spread, u: 0.05 + rand(i + 600) * 0.9, delay: Math.floor(rand(i + 1200) * 48)};
});

/** Price path for the demonstration (ILUSTRASI): drifts, drops into the lower band, speeds through, then turns. */
const pathAt = (u: number) => {
  const wiggle = Math.sin(u * 38) * 70 + Math.sin(u * 91) * 35;
  if (u <= 0.55) return NOW + wiggle * 0.8;
  const keys: Array<[number, number]> = [
    [0.55, NOW],
    [0.7, BAND_LO + 40],
    [0.78, 81580],
    [0.86, 81950],
    [0.97, 83150],
  ];
  for (let i = 1; i < keys.length; i++) {
    const [ua, pa] = keys[i - 1];
    const [ub, pb] = keys[i];
    if (u <= ub) {
      const t = (u - ua) / (ub - ua);
      return pa + (pb - pa) * ease.inOut(t) + wiggle * 0.25;
    }
  }
  return 83150;
};

const Sub = ({children, color = colors.muted}: {children: ReactNode; color?: string}) => (
  <div style={{fontFamily: fonts.mono, fontWeight: 600, fontSize: 26, letterSpacing: '0.05em', color, marginTop: 14, textTransform: 'uppercase'}}>{children}</div>
);

/** Opening statement: centred on black at frame 0, then rises into the headline zone as the map arrives. */
const OpeningTitle = ({until}: {until: number}) => {
  const frame = useCurrentFrame();
  if (frame >= until) return null;
  const rise = interpolate(frame, [-6, 10], [0, 1], {extrapolateRight: 'clamp', easing: ease.out});
  const move = interpolate(frame, [52, 74], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease.inOut});
  return (
    <div
      style={{
        position: 'absolute',
        left: 90,
        right: 90,
        top: 960 + (HEADLINE_Y - 960) * move + (1 - rise) * 60,
        transform: 'translateY(-50%)',
        opacity: interpolate(rise, [0, 0.4], [0, 1], {extrapolateRight: 'clamp'}) * fadeOut(frame, until - 7, 6),
        textAlign: 'center',
        fontFamily: fonts.heading,
        fontWeight: 800,
        fontSize: 88 - 16 * move,
        lineHeight: 1.03,
        letterSpacing: '-0.02em',
        color: colors.text,
      }}
    >
      TRADER CEK PETA INI
      <br />
      <Hi>SEBELUM ENTRY</Hi>
    </div>
  );
};

const Scene = () => {
  const frame = useCurrentFrame();
  const {cue, word, narrationEnd} = useCues();
  const A = cue('anchor');
  const B1 = cue('bands');
  const B2 = cue('band2');
  const W = cue('what');
  const L = cue('long');
  const S = cue('short');
  const ST = cue('stack');
  const WHY = cue('why');
  const FU = cue('fuel');
  const CV = cue('caveat');
  const SW = cue('sweep');
  const PO = cue('payoff');
  const CK = cue('check');
  const CL = cue('closing');
  const END = narrationEnd + 18;
  const touch = word('paksa');

  // ---- Real anchor: the screenshot, whole first, then zoomed onto the two bands ----
  const shotIn = fade(frame, A - 4, 14);
  const shotOut = fadeOut(frame, W - 2, 16);
  const zp = interpolate(frame, [B1 - 6, B1 + 26], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease.inOut});
  const k = WIN.w / SHOT.w;
  const S_ = k * (1 + (ZOOM.z - 1) * zp);
  const cxI = SHOT.w / 2 + (ZOOM.fx - SHOT.w / 2) * zp;
  const cyI = SHOT.h / 2 + (ZOOM.fy - SHOT.h / 2) * zp;
  const tx = WIN.w / 2 - cxI * S_;
  const ty = WIN.h / 2 - cyI * S_;
  const shotScaleIn = 0.96 + 0.04 * shotIn;

  // ---- Designed heatmap ----
  const ladderIn = fade(frame, W + 4, 16);
  const tickRain = (i: number) => fade(frame, ST + TICKS[i].delay, 10);
  const bandGlow = interpolate(frame, [ST + 10, ST + 60], [0.55, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  // The lower band is consumed as price runs through it, and gone once it is swept.
  const lowerBandLeft = interpolate(frame, [touch, touch + 40], [1, 0.15], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  // Price reveal across the chart: drift until "why", the drop and the sweep after.
  const uNow = interpolate(
    frame,
    [W + 4, WHY, touch, FU + 20, SW, SW + 60],
    [0.02, 0.55, 0.7, 0.78, 0.8, 0.97],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
  );
  const path = Array.from({length: 120}, (_, i) => (i / 119) * uNow).map((u) => `${px(u)},${py(pathAt(u))}`).join(' ');
  const dot = {x: px(uNow), y: py(pathAt(uNow))};
  const forced = fade(frame, touch, 8) * fadeOut(frame, CV - 4, 8);

  // Camera on the designed heatmap: follow the drop (hero move), pull back for the sweep and the check.
  const cx = STAGE.w / 2;
  const cy = STAGE.h / 2;
  const keys: CamKey[] = [
    {f: 0, x: cx, y: cy, s: 1},
    {f: WHY, x: cx, y: cy, s: 1},
    {f: touch, x: 620, y: py(82600), s: 1.45},
    {f: FU + 24, x: 680, y: py(81900), s: 1.55},
    {f: CV, x: 680, y: py(81900), s: 1.55},
    {f: SW, x: cx, y: cy, s: 1},
    {f: END, x: cx, y: cy, s: 1.02},
  ];
  const cam = cameraAt(frame, keys);

  // Position examples (ILUSTRASI).
  const longIn = fade(frame, L, 10);
  const longDrop = interpolate(frame, [L + 30, L + 60], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease.inOut});
  const shortIn = fade(frame, S, 10);
  const shortRise = interpolate(frame, [S + 18, S + 46], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease.inOut});
  const examplesOut = fadeOut(frame, ST + 30, 14);

  // Your own liquidation line: first inside the yellow band, then moved out of it.
  const mine = fade(frame, PO + 4, 10);
  const moveOut = interpolate(frame, [CK + 40, CK + 70], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease.inOut});
  const myLiq = BAND_LO + 10 + (81050 - BAND_LO - 10) * moveOut;
  const myOk = moveOut > 0.5;

  const thesisOn = frame >= CV && frame < SW;
  const sourceText =
    frame < W + 10
      ? 'SUMBER: COINGLASS · BINANCE BTC/USDT PERPETUAL · 24 JAM · 21 OKT 2026, 14:42 UTC'
      : frame >= CL
        ? 'ILUSTRASI · BUKAN NASIHAT FINANSIAL · PETA: COINGLASS 21 OKT 2026'
        : 'ILUSTRASI · LIKUIDASI = ENTRY × (1 − 1/LEVERAGE ± MMR 0,4%) · BEDA TIAP BURSA';

  return (
    <Ground polarity="dark">
      <div style={{position: 'absolute', left: 0, top: STAGE.top, width: STAGE.w, height: STAGE.h, overflow: 'hidden'}}>
        {/* Real anchor: CoinGlass screenshot in a fixed window. */}
        {shotIn * shotOut > 0 && (
          <div style={{position: 'absolute', left: WIN.x, top: WIN.y, width: WIN.w, height: WIN.h, overflow: 'hidden', borderRadius: 14, opacity: shotIn * shotOut, transform: `scale(${shotScaleIn})`, boxShadow: '0 0 0 2px #1B2A44'}}>
            <Img src={staticFile(SHOT.file)} style={{position: 'absolute', left: 0, top: 0, width: SHOT.w, height: SHOT.h, transformOrigin: '0 0', transform: `translate(${tx}px, ${ty}px) scale(${S_})`}} />
          </div>
        )}
        {/* Tags in the gutter beside the window, aligned to the bands. */}
        {SHOT_BANDS.map((b, i) => {
          const o = fade(frame, i === 0 ? B1 + 20 : B2, 10) * shotOut;
          if (o <= 0) return null;
          const y = WIN.y + ty + b.iy * S_;
          if (y < WIN.y || y > WIN.y + WIN.h) return null;
          return (
            <div key={b.iy} style={{position: 'absolute', left: WIN.x + WIN.w + 10, top: y, transform: 'translateY(-50%)', opacity: o, display: 'flex', alignItems: 'center', gap: 6}}>
              <div style={{width: 0, height: 0, borderTop: '9px solid transparent', borderBottom: '9px solid transparent', borderRight: `12px solid ${colors.yellow}`}} />
              <div style={{fontFamily: fonts.mono, fontWeight: 800, fontSize: 24, color: colors.yellow}}>{b.label}</div>
            </div>
          );
        })}

        {/* Designed heatmap (ILUSTRASI). */}
        {ladderIn > 0 && (
          <svg width={STAGE.w} height={STAGE.h} viewBox={`0 0 ${STAGE.w} ${STAGE.h}`} style={{position: 'absolute', inset: 0, opacity: ladderIn}}>
            <g transform={cameraTransform(cam, STAGE.w, STAGE.h)}>
              <rect x={PLOT.x0} y={PLOT.y0} width={PLOT.x1 - PLOT.x0} height={PLOT.y1 - PLOT.y0} fill={colors.bg} />
              {[81000, 82000, 83000, 84000, 85000, 86000].map((p) => (
                <g key={p}>
                  <line x1={PLOT.x0} x2={PLOT.x1} y1={py(p)} y2={py(p)} stroke="#15223A" strokeWidth={1.5} />
                  <text x={PLOT.x1 + 12} y={py(p) + 7} fill="#6F83A3" fontFamily={fonts.mono} fontSize={20}>
                    {p / 1000}K
                  </text>
                </g>
              ))}
              {FAINT.map((p, i) => (
                <rect key={p} x={PLOT.x0 + (PLOT.x1 - PLOT.x0) * (0.25 + rand(i + 50) * 0.3)} y={py(p) - 3} width={(PLOT.x1 - PLOT.x0) * (0.75 - rand(i + 50) * 0.3)} height={6} fill={colors.blue} opacity={0.35 * bandGlow} />
              ))}
              {/* Bright bands: yellow because the real tool marks its densest estimates yellow. */}
              <rect x={PLOT.x0 + 120} y={py(BAND_HI) - 8} width={PLOT.x1 - PLOT.x0 - 120} height={16} fill={colors.yellow} opacity={0.85 * bandGlow} rx={2} />
              <rect x={PLOT.x0 + 60} y={py(BAND_LO) - 10} width={(PLOT.x1 - PLOT.x0 - 60) * lowerBandLeft} height={20} fill={colors.yellow} opacity={0.9 * bandGlow} rx={2} />
              <rect x={PLOT.x0 + 60 + (PLOT.x1 - PLOT.x0 - 60) * lowerBandLeft} y={py(BAND_LO) - 10} width={(PLOT.x1 - PLOT.x0 - 60) * (1 - lowerBandLeft)} height={20} fill={colors.yellow} opacity={0.12} rx={2} />
              <text x={PLOT.x0 + 8} y={py(BAND_HI) - 16} fill={colors.yellow} fontFamily={fonts.mono} fontWeight={700} fontSize={20} opacity={bandGlow}>~$84.800</text>
              <text x={PLOT.x0 + 8} y={py(BAND_LO) + 36} fill={colors.yellow} fontFamily={fonts.mono} fontWeight={700} fontSize={20} opacity={bandGlow * lowerBandLeft + 0.25}>~$82.300</text>

              {/* Liquidation ticks raining in and stacking into the bands. */}
              {TICKS.map((t, i) => {
                const o = tickRain(i);
                if (o <= 0) return null;
                const drop = (1 - o) * 40;
                return <rect key={i} x={px(t.u) - 9} y={py(t.price) - 2 - drop} width={18} height={4} fill={colors.text} opacity={0.75 * o * fadeOut(frame, ST + 90, 30)} />;
              })}

              {/* Example positions at $84,000 and their liquidation prices. */}
              {longIn * examplesOut > 0 && (
                <g opacity={longIn * examplesOut}>
                  <circle cx={px(0.3)} cy={py(ENTRY)} r={9} fill={colors.electric} />
                  <text x={px(0.3) - 10} y={py(84560)} fill={colors.text} fontFamily={fonts.mono} fontWeight={700} fontSize={22}>LONG 50× · $84.000</text>
                  <line x1={px(0.3)} x2={px(0.3)} y1={py(ENTRY)} y2={py(ENTRY) + (py(LIQ_LONG) - py(ENTRY)) * longDrop} stroke={colors.negative} strokeWidth={3} strokeDasharray="7 6" />
                  {longDrop > 0.95 && (
                    <g>
                      <circle cx={px(0.3)} cy={py(LIQ_LONG)} r={8} fill={colors.negative} />
                      <text x={px(0.3) + 18} y={py(LIQ_LONG) - 12} fill={colors.negative} fontFamily={fonts.mono} fontWeight={800} fontSize={22}>LIKUIDASI ≈ {usd(LIQ_LONG)}</text>
                    </g>
                  )}
                </g>
              )}
              {shortIn * examplesOut > 0 && (
                <g opacity={shortIn * examplesOut}>
                  <circle cx={px(0.62)} cy={py(ENTRY)} r={9} fill={colors.light} />
                  <text x={px(0.62) + 18} y={py(ENTRY) + 32} fill={colors.text} fontFamily={fonts.mono} fontWeight={700} fontSize={22}>SHORT 50×</text>
                  <line x1={px(0.62)} x2={px(0.62)} y1={py(ENTRY)} y2={py(ENTRY) + (py(LIQ_SHORT) - py(ENTRY)) * shortRise} stroke={colors.negative} strokeWidth={3} strokeDasharray="7 6" />
                  {shortRise > 0.95 && (
                    <g>
                      <circle cx={px(0.62)} cy={py(LIQ_SHORT)} r={8} fill={colors.negative} />
                      <text x={px(0.62) + 18} y={py(LIQ_SHORT) - 12} fill={colors.negative} fontFamily={fonts.mono} fontWeight={800} fontSize={22}>LIKUIDASI ≈ {usd(LIQ_SHORT)}</text>
                    </g>
                  )}
                </g>
              )}

              {/* Price path and the "now" dot. */}
              <polyline points={path} fill="none" stroke={colors.text} strokeWidth={3.5} strokeLinejoin="round" strokeLinecap="round" />
              <circle cx={dot.x} cy={dot.y} r={8} fill={colors.text} />

              {/* Forced orders firing as price touches the band. */}
              {forced > 0 &&
                [0, 1, 2, 3, 4].map((i) => {
                  const t = ((frame - touch) / 30 + i * 0.2) % 1;
                  return (
                    <g key={i} opacity={forced * (1 - t)}>
                      <text x={dot.x - 30 - i * 26} y={dot.y + 30 + t * 70} fill={colors.negative} fontFamily={fonts.heading} fontWeight={800} fontSize={26}>▼</text>
                    </g>
                  );
                })}
              {forced > 0 && (
                <text x={dot.x + 22} y={dot.y + 44} fill={colors.negative} fontFamily={fonts.mono} fontWeight={800} fontSize={20} opacity={forced}>
                  JUAL PAKSA
                </text>
              )}

              {/* Your own liquidation line. */}
              {mine > 0 && (
                <g opacity={mine}>
                  <line x1={PLOT.x0} x2={PLOT.x1} y1={py(myLiq)} y2={py(myLiq)} stroke={myOk ? colors.electric : colors.negative} strokeWidth={4} strokeDasharray="12 8" />
                  {/* The label clears before the line moves and returns once it has landed, so it never crosses the band. */}
                  <text x={PLOT.x0 + 8} y={py(myLiq) + (myOk ? 34 : -18)} fill={myOk ? colors.electric : colors.negative} fontFamily={fonts.mono} fontWeight={800} fontSize={24} opacity={myOk ? fade(frame, CK + 70, 10) : fadeOut(frame, CK + 32, 6)}>
                    {myOk ? '✓ LIKUIDASI KAMU: DI LUAR ZONA' : '✗ LIKUIDASI KAMU: DI ZONA KUNING'}
                  </text>
                </g>
              )}
            </g>
          </svg>
        )}
        {/* Fixed tag only while the camera is wide; zoomed, the source line below carries ILUSTRASI. */}
        {ladderIn > 0 && frame < CV && cam.s < 1.04 && (
          <div style={{position: 'absolute', left: PLOT.x0, top: 22, fontFamily: fonts.mono, fontWeight: 700, fontSize: 22, letterSpacing: '0.12em', color: colors.light, opacity: ladderIn * interpolate(cam.s, [1, 1.04], [1, 0])}}>ILUSTRASI</div>
        )}
      </div>

      <OpeningTitle until={B1} />
      <HeadlineTrack
        centerY={HEADLINE_Y}
        until={END}
        cues={[
          {from: B1, content: <>ZONA KUNING: <span style={{color: colors.yellow}}>~$82.300</span><div style={{opacity: fade(frame, B2, 10)}}>& <span style={{color: colors.yellow}}>~$84.800</span></div><Sub>HARGA SAAT ITU {usd(NOW)}</Sub></>, size: 70},
          {from: W, content: <>BUKAN ORDER<Sub>PERKIRAAN HARGA LIKUIDASI POSISI LEVERAGE</Sub></>, size: 84},
          {from: L, content: <>TIAP POSISI PUNYA <Hi>HARGA LIKUIDASI</Hi></>, size: 70},
          {from: ST, content: <>RIBUAN POSISI → <span style={{color: colors.yellow}}>ZONA TERANG</span></>, size: 70},
          {from: WHY, content: <>DISENTUH → <span style={{color: colors.negative}}>JUAL / BELI PAKSA</span></>, size: 70},
          {from: FU, content: <>HARGA BISA BERGERAK <Hi>MAKIN CEPAT</Hi></>, size: 70},
          {from: CV, content: null},
          {from: SW, content: <>SETELAH DISAPU, HARGA BISA <Hi>BERBALIK</Hi></>, size: 66},
          {from: PO, content: <>SATU CEK <Hi>SEBELUM ENTRY</Hi><div style={{opacity: fade(frame, CK, 10)}}><Sub>LIKUIDASI KAMU DI LUAR ZONA KUNING</Sub></div></>, size: 72},
          {from: CL, content: <>DI ZONA RAMAI, POSISI KAMU BISA JADI <span style={{color: colors.yellow}}>BAHAN BAKAR</span></>, size: 62},
        ]}
      />

      <div style={{position: 'absolute', left: 90, right: 90, top: SOURCE_Y, textAlign: 'center', fontFamily: fonts.mono, fontWeight: 500, fontSize: 18, letterSpacing: '0.03em', color: '#6F83A3', opacity: fade(frame, A, 12)}}>
        {sourceText}
      </div>

      {/* Caveat: polarity flip to off-white. */}
      {thesisOn && (
        <AbsoluteFill style={{backgroundColor: colors.offWhite, justifyContent: 'center', alignItems: 'center', padding: '0 100px'}}>
          <div style={{textAlign: 'center', color: colors.ink}}>
            <div style={{fontFamily: fonts.heading, fontWeight: 800, fontSize: 96, lineHeight: 1.04, letterSpacing: '-0.02em', opacity: fade(frame, CV, 12), filter: `blur(${(1 - fade(frame, CV, 12)) * 16}px)`}}>
              PERKIRAAN,
              <br />
              <span style={{color: colors.blue}}>BUKAN KEPASTIAN.</span>
            </div>
            <div style={{marginTop: 46, fontFamily: fonts.body, fontWeight: 500, fontSize: 36, lineHeight: 1.35, color: '#3A4A63', opacity: fade(frame, word('coinglass', 1) + 4, 12)}}>
              “Likuidasi nyata biasanya lebih kecil
              <br />
              dari intensitas di heatmap.”
              <div style={{marginTop: 14, fontFamily: fonts.mono, fontSize: 24, letterSpacing: '0.06em'}}>— COINGLASS (DIPARAFRASAKAN)</div>
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* Sound: each effect marks what the picture is doing (library sounds, see sources.md). */}
      <Sfx name="cinematic-boom-soft" at={0} volume={0.26} />
      <Sfx name="data-whoosh" at={A - 6} volume={0.25} />
      <Sfx name="ui-clicks-notification-pop" at={B1 + 20} volume={0.3} />
      <Sfx name="ui-clicks-notification-pop" at={B2} volume={0.3} />
      <Sfx name="ui-reveal" at={W} volume={0.25} />
      <Sfx name="hud-electronic-interface-sfx-pack-4" at={L} volume={0.24} />
      <Sfx name="hud-electronic-interface-sfx-pack-4" at={S} volume={0.24} />
      <Sfx name="mountain-audio-computer-data-readout-and-counter-bundle-sound-3" at={ST} volume={0.2} />
      <Sfx name="whoosh-deep-short" at={WHY + 4} volume={0.26} />
      <Sfx name="bass-drop-descend" at={touch} volume={0.28} />
      <Sfx name="impact-bass-echo" at={CV} volume={0.22} />
      <Sfx name="metalic-riser" at={SW + 8} volume={0.2} />
      <Sfx name="hud-electronic-interface-sfx-pack-1" at={PO + 4} volume={0.24} />
      <Sfx name="ni-sound-cute-interface-bubble-pop-synth-chord-positive-notification" at={CK + 56} volume={0.24} />
      <Sfx name="whoosh-and-hit-2" at={CL - 6} volume={0.22} />
    </Ground>
  );
};

const episode: EpisodeModule = {
  config: config as EpisodeConfig,
  captions: captions as Captions,
  Scene,
  captionMute: [[cueFrame('caveat'), cueFrame('sweep')]],
  logoHide: [[cueFrame('caveat'), cueFrame('sweep')]],
};
export default episode;
