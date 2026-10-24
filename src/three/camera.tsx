import {useThree} from '@react-three/fiber';
import {Easing, interpolate, useCurrentFrame} from 'remotion';
import type * as THREE from 'three';
import {ease} from '../theme/motion';

export type V3 = [number, number, number];
type EaseName = 'inOut' | 'out' | 'in' | 'linear';
/**
 * A camera key at frame f. Two keys on the same frame make a cut. `shift` moves the picture up by that many px
 * (view offset). `ease` shapes the move that arrives at this key. `shake` adds a small deterministic handheld sway
 * (world units) while this key's segment plays. `up` overrides the up vector (for overhead shots).
 */
export type CamKey = {f: number; pos: V3; look: V3; fov?: number; shift?: number; ease?: EaseName; shake?: number; up?: V3};

const curves: Record<EaseName, (t: number) => number> = {inOut: ease.inOut, out: ease.out, in: ease.in, linear: Easing.linear};
const mix = (a: number, b: number, t: number) => a + (b - a) * t;
const mix3 = (a: V3, b: V3, t: number): V3 => [mix(a[0], b[0], t), mix(a[1], b[1], t), mix(a[2], b[2], t)];

export const cameraAt = (frame: number, keys: CamKey[]) => {
  let i = 0;
  while (i + 1 < keys.length && keys[i + 1].f <= frame) i++;
  const a = keys[i];
  const b = keys[i + 1];
  const to = b ?? a;
  const t = b && b.f > a.f ? interpolate(frame, [a.f, b.f], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: curves[b.ease ?? 'inOut']}) : 0;
  const shakeAmp = mix(a.shake ?? 0, to.shake ?? 0, t);
  // Sum of incommensurate sines: smooth, deterministic, never loops visibly.
  const s = (k: number) => Math.sin(frame * 0.071 * k + k * 1.7) * 0.6 + Math.sin(frame * 0.163 * k + k) * 0.4;
  const pos = mix3(a.pos, to.pos, t);
  return {
    pos: [pos[0] + s(1) * shakeAmp, pos[1] + s(2) * shakeAmp * 0.7, pos[2] + s(3) * shakeAmp * 0.4] as V3,
    look: mix3(a.look, to.look, t),
    fov: mix(a.fov ?? 35, to.fov ?? 35, t),
    shift: mix(a.shift ?? 0, to.shift ?? 0, t),
    // Blend the up vector too, so an overhead shot eases back to level instead of snapping.
    up: mix3(a.up ?? [0, 1, 0], to.up ?? [0, 1, 0], t),
  };
};

/** Drives the default camera from frame-keyed positions; render it before anything that reads the camera. */
export const KeyedCamera = ({keys, frameOffset = 0}: {keys: CamKey[]; frameOffset?: number}) => {
  const frame = useCurrentFrame() + frameOffset;
  const {camera, size} = useThree();
  const k = cameraAt(frame, keys);
  const cam = camera as THREE.PerspectiveCamera;
  cam.position.set(...k.pos);
  cam.up.set(...k.up);
  cam.fov = k.fov;
  if (k.shift) cam.setViewOffset(size.width, size.height, 0, k.shift, size.width, size.height);
  else cam.clearViewOffset();
  cam.near = 0.02;
  cam.far = 400;
  cam.updateProjectionMatrix();
  cam.lookAt(...k.look);
  cam.updateMatrixWorld();
  return null;
};
