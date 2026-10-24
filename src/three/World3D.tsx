import {useThree} from '@react-three/fiber';
import {ThreeCanvas} from '@remotion/three';
import {useMemo, type CSSProperties, type ReactNode} from 'react';
import {useVideoConfig} from 'remotion';
import * as THREE from 'three';
import {KeyedCamera, type CamKey} from './camera';
import {makeStudioEnv, type EnvPanel} from './env';

const Setup = ({bg, fog, panels, envIntensity, exposure}: {bg: string | null; fog?: [string, number, number]; panels: EnvPanel[]; envIntensity: number; exposure: number}) => {
  const {gl, scene} = useThree();
  useMemo(() => {
    gl.localClippingEnabled = true;
    gl.toneMapping = THREE.ACESFilmicToneMapping;
    scene.environment = makeStudioEnv(gl, panels);
  }, [gl, scene, panels]);
  // Background, exposure and reflections can change every frame (e.g. a black → off-white bloom).
  gl.toneMappingExposure = exposure;
  scene.background = bg ? new THREE.Color(bg) : null;
  scene.environmentIntensity = envIntensity;
  scene.fog = fog ? new THREE.Fog(fog[0], fog[1], fog[2]) : null;
  return null;
};

/**
 * One full-frame 3D world: studio reflections, optional fog, ACES tone mapping and a cue-keyed camera.
 * Pass bg={null} for a transparent canvas over the page.
 */
export const World3D = ({keys, children, bg = '#000000', fog, panels, envIntensity = 1, exposure = 1, style}: {keys: CamKey[]; children: ReactNode; bg?: string | null; fog?: [string, number, number]; panels: EnvPanel[]; envIntensity?: number; exposure?: number; style?: CSSProperties}) => {
  const {width, height} = useVideoConfig();
  return (
    <ThreeCanvas width={width} height={height} style={{position: 'absolute', inset: 0, ...style}} gl={{antialias: true, alpha: bg === null}}>
      <Setup bg={bg} fog={fog} panels={panels} envIntensity={envIntensity} exposure={exposure} />
      <KeyedCamera keys={keys} />
      {children}
    </ThreeCanvas>
  );
};
