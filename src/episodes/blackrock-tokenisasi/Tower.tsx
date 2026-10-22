import {ThreeCanvas} from '@remotion/three';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {fontsReady, textTexture, useAssets3D} from '../../three/assets';
import {KeyedCamera, type CamKey} from '../../three/camera';
import {Label3D} from '../../three/Label3D';
import {colors} from '../../theme/colors';
import {ease} from '../../theme/motion';
import {fonts} from '../../theme/typography';
import {Env, gridTexture} from './World';

const ramp = (frame: number, a: number, b: number) =>
  interpolate(frame, [a, b], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease.inOut});

const H = 20; // BlackRock AUM = 100%
const SIDE = 3;
const SLIVER_X = 4.4;

/** BlackRock's assets as a tower and every tokenized real-world asset as a slab beside it, heights to scale. */
export const TowerWorld = ({start, crane, settle, share, end}: {start: number; crane: number; settle: number; share: number; end: number}) => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();
  const a = useAssets3D(async () => {
    await fontsReady();
    const t = (s: string, color: string, family: string = fonts.heading, px = 96) => textTexture(s, {family, weight: 800, px, color, tracking: 1});
    return {
      grid: gridTexture('#E3E5EA', 'rgba(16,24,40,0.07)', 30),
      t: {
        slabSub: textTexture('SEMUA ASET NYATA TERTOKENISASI', {family: fonts.mono, weight: 700, px: 64, color: colors.ink, tracking: 3}),
        tower: t('BLACKROCK = 100%', colors.ink),
        slab: t(`${(share * 100).toFixed(2).replace('.', ',')}%`, colors.blue),
      },
    };
  }, 'tower-world');
  if (!a) return null;

  const h = H * share;
  const up = ramp(frame, crane, settle);
  // Close: the slab fills the stage, the tower is only a dark wall at the left edge. Wide: the whole tower in the stage.
  const keys: CamKey[] = [
    {f: start, pos: [5.2, 1.3, 8.2], look: [4.15, 0.2, 0], fov: 50, shift: -130},
    {f: crane, pos: [5.1, 1.25, 7.9], look: [4.15, 0.2, 0], fov: 50, shift: -130},
    {f: settle, pos: [24, 12, 62], look: [2.2, 10.5, 0], fov: 50, shift: -150},
    {f: end, pos: [24.5, 12.2, 63.5], look: [2.2, 10.5, 0], fov: 50, shift: -150},
  ];
  const fadeOut = interpolate(frame, [end - 8, end], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  return (
    <ThreeCanvas width={width} height={height} style={{position: 'absolute', inset: 0, opacity: fadeOut}} gl={{antialias: true}}>
      <Env bg={colors.offWhite} near={90} far={180} envIntensity={0.6} />
      <KeyedCamera keys={keys} />
      <ambientLight intensity={0.9} />
      <directionalLight position={[-12, 30, 18]} intensity={2.2} />
      <directionalLight position={[20, 8, 10]} intensity={0.8} />
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[200, 200]} />
        <meshStandardMaterial map={a.grid} roughness={0.9} />
      </mesh>
      <mesh position={[0, H / 2, 0]}>
        <boxGeometry args={[SIDE, H, SIDE]} />
        <meshStandardMaterial color={colors.ink} roughness={0.45} metalness={0.25} />
      </mesh>
      <mesh position={[SLIVER_X, h / 2, 0]}>
        <boxGeometry args={[SIDE, h, SIDE]} />
        <meshStandardMaterial color={colors.blue} roughness={0.35} metalness={0.1} />
      </mesh>
      {/* Marker so the slab can still be found in the wide shot */}
      <mesh position={[SLIVER_X, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.6, 2.85, 64]} />
        <meshBasicMaterial color={colors.blue} transparent opacity={up} />
      </mesh>
      <Label3D tex={a.t.tower} height={2} position={[0, H + 1.9, 0]} opacity={ramp(frame, settle - 14, settle)} />
      <Label3D tex={a.t.slab} height={2.4} position={[SLIVER_X + 5, 4.4, 2]} opacity={ramp(frame, settle - 10, settle + 4)} />
      <Label3D tex={a.t.slabSub} height={0.7} position={[SLIVER_X + 5, 2.7, 2]} opacity={ramp(frame, settle - 10, settle + 4)} />
    </ThreeCanvas>
  );
};
