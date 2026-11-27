/**
 * Reel cover (1080×1920) in the format the user referenced (26 Nov 2026): the isometric city scene above a two-line
 * question in boxes. Our own scene, type and colours. Everything that matters sits inside the centre 3:4 band
 * (y 240–1680) the profile grid shows; the bottom of that band stays clear for Instagram's view count.
 */
import {ThreeCanvas} from '@remotion/three';
import {AbsoluteFill, useVideoConfig} from 'remotion';
import * as THREE from 'three';
import {BrandLogo} from '../../components/BrandLogo';
import {fontsReady, textTexture, useAssets3D, type TextTexture} from '../../three/assets';
import {KeyedCamera} from '../../three/camera';
import {fonts} from '../../theme/typography';
import {C, Crate, Flag, Ground, Road, Tower, Trees, Truck, Vault} from './city';
import {DepthRange, iso} from './Style';
import {flagTexture, windowsTexture} from './textures';

type A = {sign: TextTexture; windows: THREE.Texture; cn: THREE.Texture; pl: THREE.Texture};
const load = async (): Promise<A> => {
  await fontsReady();
  return {
    sign: textTexture('BANK SENTRAL', {family: fonts.heading, weight: 800, px: 90, color: C.white, tracking: 4}),
    windows: windowsTexture(),
    cn: flagTexture('cn'),
    pl: flagTexture('pl'),
  };
};

const AREA: [number, number, number, number] = [-30, -30, 30, 30];
const CLEAR: Array<[number, number, number, number]> = [[-40, 1.2, 40, 4.8], [-4, -9, 9, 1.4]];

const Box = ({children, bg, color}: {children: string; bg: string; color: string}) => (
  <div style={{display: 'inline-block', background: bg, color, padding: '6px 20px 10px', fontFamily: fonts.heading, fontWeight: 800, fontSize: 80, lineHeight: 1.02, letterSpacing: '-0.025em', whiteSpace: 'nowrap'}}>{children}</div>
);

export const Cover = () => {
  const {width, height} = useVideoConfig();
  const a = useAssets3D(load, 'emas-cover');
  // Look at the vault; shift the picture up so the scene fills the top two thirds.
  const key = {...iso(0, [2.2, 1.0, -2.8], 8.6), shift: 250};
  return (
    <AbsoluteFill style={{background: C.ground}}>
      {a && (
        <ThreeCanvas width={width} height={height} gl={{antialias: true, toneMapping: THREE.NoToneMapping, preserveDrawingBuffer: true}} dpr={2} shadows>
          <KeyedCamera keys={[key]} />
          <DepthRange />
          <color attach="background" args={[C.ground]} />
          <hemisphereLight args={['#DCE7FF', '#0A2470', 0.95]} />
          <directionalLight position={[-14, 26, 10]} intensity={3.0} castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048} shadow-camera-left={-20} shadow-camera-right={20} shadow-camera-top={20} shadow-camera-bottom={-20} shadow-bias={-0.0008} shadow-normalBias={0.03} />
          <Vault position={[-0.4, 0, -5.4]} size={[5, 3.2, 4]} open={1} />
          <mesh position={[-0.4, 2.62, -3.37]}>
            <planeGeometry args={[0.42 * a.sign.aspect, 0.42]} />
            <meshBasicMaterial map={a.sign.texture} transparent toneMapped={false} />
          </mesh>
          <Road at={[-0.4, 0, -0.6]} length={3.8} alongZ width={2.2} />
          <Truck position={[-0.4, 0, -1.6]} rot={Math.PI / 2} />
          <Truck position={[-0.4, 0, 0.6]} rot={Math.PI / 2} />
          <Truck position={[3.6, 0, 2.4]} rot={Math.PI} />
          <Truck position={[6.2, 0, 2.4]} rot={Math.PI} />
          {[0, 1].map((r) => [0, 1].map((c) => <Crate key={`${r}${c}`} position={[4.2 + c * 1.9, 0, -5.0 + r * 1.9]} rows={8} cols={5} layers={r ? 6 : 9} />))}
          <Flag position={[3.4, 0, -6.2]} tex={a.cn} />
          <Flag position={[5.3, 0, -6.2]} tex={a.pl} />
          <Tower position={[-7.5, 0, -9]} size={[3, 8, 3]} windows={a.windows} />
          <Road at={[0, 0, 3]} length={80} />
          <Trees area={AREA} count={420} seed={12} clear={CLEAR} />
          <Ground />
        </ThreeCanvas>
      )}
      <div style={{position: 'absolute', left: 76, top: 292, padding: '12px 16px', borderRadius: 12, background: 'rgba(5,11,24,0.92)', lineHeight: 0}}>
        <BrandLogo width={200} />
      </div>
      <div style={{position: 'absolute', left: 76, right: 60, top: 1150}}>
        <Box bg="rgba(5,11,24,0.95)" color="#FFFFFF">EMAS ANJLOK 32%,</Box>
        <div style={{height: 12}} />
        <Box bg={C.gold} color="#050B18">KOK MALAH DIBORONG?</Box>
      </div>
    </AbsoluteFill>
  );
};
