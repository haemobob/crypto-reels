import {AbsoluteFill, staticFile, useCurrentFrame} from 'remotion';
import {Enter, KenBurns, Layer, RollNumber, SeamSide, Shot, seam} from '../components/motion';
import {colors} from '../theme/colors';
import {fonts} from '../theme/typography';

/**
 * Reference for the living-frame kit (composition "motion-kit", 7 s, no voice): three beats joined by caused seams.
 *  A (0–70)   a world that drifts with parallax; the headline blurs in word by word and holds still; a chip scale-settles.
 *  ── zoom through the safe at 70 ──
 *  B (70–140) a real photo with Ken Burns and a light sweep; a number rolls in; label wipes in.
 *  ── colour flood (polarity flip) from the number at 140 ──
 *  C (140–210) off-white chapter, the hero number carried over; thesis line lands and holds.
 */
const ZOOM = 70;
const FLOOD = 140;

const Grid = () => (
  <svg width={1080} height={1920} style={{position: 'absolute', inset: 0, opacity: 0.35}}>
    {Array.from({length: 24}, (_, i) => (
      <line key={i} x1={0} x2={1080} y1={i * 90} y2={i * 90} stroke="#16305A" strokeWidth={2} />
    ))}
    {Array.from({length: 14}, (_, i) => (
      <line key={`v${i}`} y1={0} y2={1920} x1={i * 90} x2={i * 90} stroke="#16305A" strokeWidth={2} />
    ))}
  </svg>
);

const Safe = () => (
  <svg width={420} height={420} viewBox="0 0 100 100">
    <rect x={8} y={8} width={84} height={84} rx={8} fill="#1B3A6B" stroke="#4FA3FF" strokeWidth={2.5} />
    <rect x={20} y={20} width={60} height={60} rx={4} fill="#244B88" />
    <circle cx={50} cy={50} r={13} fill="#9FC6FF" />
    <rect x={70} y={44} width={4} height={14} rx={2} fill="#D7E3F4" />
  </svg>
);

export const MotionKitDemo = () => {
  const f = useCurrentFrame();
  const title = {position: 'absolute' as const, left: 90, right: 90, top: 520, textAlign: 'center' as const, fontFamily: fonts.heading, fontWeight: 800, fontSize: 92, lineHeight: 1.02, color: '#FFFFFF', letterSpacing: '-0.02em'};
  return (
    <AbsoluteFill style={{backgroundColor: colors.bg}}>
      {/* A: the world drifts (grid far, safe near), words land and hold. */}
      {f < ZOOM && (
        <div style={{position: 'absolute', inset: 0, ...seam('zoom', f, ZOOM, 'out', {dur: 12, origin: [540, 1100]})}}>
          <Shot from={0} to={ZOOM} push={0.06} pan={[0, -30]}>
            <Layer depth={0.5}>
              <Grid />
            </Layer>
            <Layer depth={1.4}>
              <div style={{position: 'absolute', left: 330, top: 890}}>
                <Enter at={6} kind="scale" dur={14}>
                  <Safe />
                </Enter>
              </div>
            </Layer>
          </Shot>
          <div style={title}>
            <Enter at={2} kind="words">BUKAN SATU DOMPET</Enter>
          </div>
          <div style={{position: 'absolute', left: 0, right: 0, top: 1360, textAlign: 'center'}}>
            <Enter at={30} kind="scale" dur={10} style={{display: 'inline-block'}}>
              <span style={{display: 'inline-block', padding: '10px 18px', borderRadius: 10, border: `2px solid ${colors.electric}`, fontFamily: fonts.mono, fontWeight: 700, fontSize: 26, color: '#FFFFFF'}}>21.953 BLOK</span>
            </Enter>
          </div>
        </div>
      )}
      {/* B: real photo in motion, number rolls, label wipes. */}
      {f >= ZOOM && f < FLOOD + 12 && (
        <SeamSide kind="zoom" at={ZOOM} side="in" opts={{dur: 12}}>
          <div style={{position: 'absolute', left: 90, right: 90, top: 760, height: 620, borderRadius: 22, overflow: 'hidden', border: '3px solid rgba(255,255,255,0.85)'}}>
            <KenBurns src={staticFile('episodes/dompet-satoshi/ibm-quantum-system-one.jpg')} from={ZOOM} to={FLOOD + 12} push={0.1} pan={[0, -40]} sweepAt={ZOOM + 20} />
          </div>
          <div style={title}>
            <RollNumber value={1097650} at={ZOOM + 6} dur={30} style={{color: colors.electric}} /> BTC
          </div>
          <div style={{position: 'absolute', left: 90, top: 1400, fontFamily: fonts.mono, fontWeight: 700, fontSize: 22, color: '#A8BDD8'}}>
            <Enter at={ZOOM + 20} kind="wipe" dur={12}>FOTO: OJB QUANTUM · CC BY 4.0</Enter>
          </div>
        </SeamSide>
      )}
      {/* C: polarity flip as an iris from the number; the number is carried, the thesis lands. */}
      {f >= FLOOD && (
        <SeamSide kind="flood" at={FLOOD} side="in" opts={{dur: 12, origin: [540, 560]}} style={{backgroundColor: colors.offWhite}}>
          <Shot from={FLOOD} to={210} push={0.04}>
            <div style={{...title, color: colors.ink}}>
              1.097.650 BTC
            </div>
          </Shot>
          <div style={{position: 'absolute', left: 90, right: 90, top: 900, textAlign: 'center', fontFamily: fonts.heading, fontWeight: 800, fontSize: 64, color: colors.ink}}>
            <Enter at={FLOOD + 14} kind="blur" dur={8}>NGGAK PERNAH DIPINDAH</Enter>
          </div>
        </SeamSide>
      )}
    </AbsoluteFill>
  );
};
