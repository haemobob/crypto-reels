import {useThree} from '@react-three/fiber';
import * as THREE from 'three';
import type {TextTexture} from './assets';

/** A text plane `height` units tall. Faces the camera unless `flat` (lies on the floor) or a rotation is given. */
export const Label3D = ({tex, height, position, opacity = 1, flat = false, rotation}: {tex: TextTexture; height: number; position: [number, number, number]; opacity?: number; flat?: boolean; rotation?: [number, number, number]}) => {
  const {camera} = useThree();
  if (opacity <= 0.001) return null;
  const q = flat || rotation ? undefined : camera.quaternion.clone();
  return (
    <mesh position={position} quaternion={q} rotation={flat ? [-Math.PI / 2, 0, 0] : rotation} renderOrder={10}>
      <planeGeometry args={[height * tex.aspect, height]} />
      <meshBasicMaterial map={tex.texture} transparent opacity={opacity} depthWrite={false} toneMapped={false} side={THREE.DoubleSide} />
    </mesh>
  );
};
