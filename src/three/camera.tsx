import {useThree} from '@react-three/fiber';
import {interpolate, useCurrentFrame} from 'remotion';
import type * as THREE from 'three';
import {ease} from '../theme/motion';

export type V3 = [number, number, number];
/** A camera key at frame f. Two keys on the same frame make a cut. `shift` moves the picture up by that many px (view offset). */
export type CamKey = {f: number; pos: V3; look: V3; fov?: number; shift?: number};

const mix = (a: number, b: number, t: number) => a + (b - a) * t;
const mix3 = (a: V3, b: V3, t: number): V3 => [mix(a[0], b[0], t), mix(a[1], b[1], t), mix(a[2], b[2], t)];

export const cameraAt = (frame: number, keys: CamKey[]): Required<CamKey> => {
  let i = 0;
  while (i + 1 < keys.length && keys[i + 1].f <= frame) i++;
  const a = keys[i];
  const b = keys[i + 1];
  const t = b && b.f > a.f ? interpolate(frame, [a.f, b.f], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease.inOut}) : 0;
  const to = b ?? a;
  return {
    f: frame,
    pos: mix3(a.pos, to.pos, t),
    look: mix3(a.look, to.look, t),
    fov: mix(a.fov ?? 35, to.fov ?? 35, t),
    shift: mix(a.shift ?? 0, to.shift ?? 0, t),
  };
};

/** Drives the default camera from frame-keyed positions; render it before anything that reads the camera. */
export const KeyedCamera = ({keys}: {keys: CamKey[]}) => {
  const frame = useCurrentFrame();
  const {camera, size} = useThree();
  const k = cameraAt(frame, keys);
  const cam = camera as THREE.PerspectiveCamera;
  cam.position.set(...k.pos);
  cam.fov = k.fov;
  if (k.shift) cam.setViewOffset(size.width, size.height, 0, k.shift, size.width, size.height);
  else cam.clearViewOffset();
  cam.updateProjectionMatrix();
  cam.lookAt(...k.look);
  cam.updateMatrixWorld();
  return null;
};
