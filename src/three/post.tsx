import {useFrame, useThree} from '@react-three/fiber';
import {BlendFunction, BloomEffect, DepthOfFieldEffect, EffectComposer, EffectPass, NoiseEffect, RenderPass, SMAAEffect, ToneMappingEffect, ToneMappingMode, VignetteEffect} from 'postprocessing';
import {useMemo} from 'react';
import * as THREE from 'three';

/**
 * Film finish for a <ThreeCanvas>: SMAA, depth of field on a world-space target, a little bloom, AgX tone mapping,
 * grain. Built on `postprocessing` directly: @react-three/postprocessing's <EffectComposer> renders black under
 * Remotion's manual frame loop, this one renders every advanced frame. Put it last inside the canvas and give the
 * canvas gl={{toneMapping: THREE.NoToneMapping}} (tone mapping happens here).
 */
export type PostProps = {
  /** World point to keep in focus; omit for no depth of field. */
  focus?: [number, number, number];
  focalLength?: number;
  bokehScale?: number;
  bloom?: number;
  bloomThreshold?: number;
  grain?: number;
  /** Edge darkening 0–1; keep tiny (≤ 0.3): it is a lens finish, never a scrim for text. */
  vignette?: number;
};

export const Post = ({focus, focalLength = 0.03, bokehScale = 3, bloom = 0.35, bloomThreshold = 0.82, grain = 0.045, vignette = 0}: PostProps) => {
  const {gl, scene, camera, size} = useThree();
  const pipe = useMemo(() => {
    const composer = new EffectComposer(gl);
    composer.addPass(new RenderPass(scene, camera));
    composer.addPass(new EffectPass(camera, new SMAAEffect()));
    let dof: DepthOfFieldEffect | null = null;
    if (focus) {
      dof = new DepthOfFieldEffect(camera, {focalLength, bokehScale});
      dof.target = new THREE.Vector3(...focus);
      composer.addPass(new EffectPass(camera, dof));
    }
    const finish = [
      new BloomEffect({intensity: bloom, luminanceThreshold: bloomThreshold, luminanceSmoothing: 0.2, mipmapBlur: true}),
      new ToneMappingEffect({mode: ToneMappingMode.AGX}),
      ...(vignette > 0 ? [new VignetteEffect({darkness: vignette, offset: 0.35})] : []),
      ...(grain > 0 ? [Object.assign(new NoiseEffect({blendFunction: BlendFunction.OVERLAY, premultiply: true}), {})] : []),
    ];
    const noise = finish.find((e) => e instanceof NoiseEffect) as NoiseEffect | undefined;
    if (noise) noise.blendMode.opacity.value = grain * 6;
    composer.addPass(new EffectPass(camera, ...finish));
    composer.setSize(size.width, size.height);
    return {composer, dof};
    // Focus is updated per frame below; the pipeline is built once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gl, scene, camera, size.width, size.height]);
  if (pipe.dof && focus) pipe.dof.target = new THREE.Vector3(...focus);
  useFrame(() => pipe.composer.render(), 1);
  return null;
};
