import * as THREE from 'three';

/** A light panel inside the environment box: what shiny surfaces reflect. */
export type EnvPanel = {color: string; intensity: number; position: [number, number, number]; size: [number, number]; lookAt?: [number, number, number]};

export const studioPanels = {
  /** Dark cinematic studio: a soft white key, a cool fill and two electric-blue strips. */
  dark: [
    {color: '#ffffff', intensity: 6, position: [-4, 5, 4], size: [4, 2.5]},
    {color: '#9fc6ff', intensity: 2.5, position: [5, 2, 3], size: [3, 3]},
    {color: '#1677FF', intensity: 9, position: [0, 1, -6], size: [9, 0.35]},
    {color: '#2997FF', intensity: 7, position: [6, -1, -2], size: [0.3, 6]},
    {color: '#ffffff', intensity: 1.2, position: [0, 7, 0], size: [6, 6]},
    // Soft front fill behind the camera, so faces looking straight at the lens don't mirror pure black.
    {color: '#ffe9cc', intensity: 1.1, position: [0, 0.5, 9], size: [8, 5]},
  ] as EnvPanel[],
  /** Clinical off-white product studio. */
  light: [
    {color: '#ffffff', intensity: 4, position: [0, 7, 0], size: [10, 10]},
    {color: '#ffffff', intensity: 3, position: [-6, 2, 4], size: [4, 5]},
    {color: '#dfe9ff', intensity: 2.5, position: [6, 2, 4], size: [4, 5]},
    {color: '#1677FF', intensity: 3, position: [0, 0.5, -7], size: [10, 0.4]},
  ] as EnvPanel[],
};

/** Prefiltered environment map from a dark box lit by emissive panels (like RoomEnvironment, but art-directed). */
export const makeStudioEnv = (gl: THREE.WebGLRenderer, panels: EnvPanel[], base = '#05070c') => {
  const scene = new THREE.Scene();
  const room = new THREE.Mesh(new THREE.BoxGeometry(20, 20, 20), new THREE.MeshBasicMaterial({color: base, side: THREE.BackSide}));
  scene.add(room);
  for (const p of panels) {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(...p.size), new THREE.MeshBasicMaterial({color: new THREE.Color(p.color).multiplyScalar(p.intensity), side: THREE.DoubleSide}));
    m.position.set(...p.position);
    m.lookAt(...(p.lookAt ?? [0, 0, 0]));
    scene.add(m);
  }
  const pm = new THREE.PMREMGenerator(gl);
  const tex = pm.fromScene(scene, 0.02).texture;
  pm.dispose();
  return tex;
};
