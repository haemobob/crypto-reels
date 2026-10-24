import type {ThreeElements} from '@react-three/fiber';
import {useMemo} from 'react';
import * as THREE from 'three';

/** Position on a THREE.SphereGeometry of radius r that matches an equirectangular (lon −180…180) texture. */
export const latLon = (lat: number, lon: number, r: number) => {
  const phi = ((lon + 180) * Math.PI) / 180;
  const theta = ((90 - lat) * Math.PI) / 180;
  return new THREE.Vector3(-r * Math.cos(phi) * Math.sin(theta), r * Math.cos(theta), r * Math.sin(phi) * Math.sin(theta));
};

/** Great-circle point between two surface points, lifted by `lift` at the middle (for network arcs). */
export const arcPoint = (a: THREE.Vector3, b: THREE.Vector3, t: number, r: number, lift: number) => {
  const p = a.clone().normalize().lerp(b.clone().normalize(), t).normalize();
  return p.multiplyScalar(r + lift * Math.sin(Math.PI * t));
};

const dayNightShader = {
  vertex: /* glsl */ `
    varying vec2 vUv;
    varying vec3 vN;
    void main() {
      vUv = uv;
      vN = normalize(mat3(modelMatrix) * normal);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }`,
  fragment: /* glsl */ `
    uniform sampler2D dayMap;
    uniform sampler2D nightMap;
    uniform vec3 sunDir;
    uniform float nightGain;
    uniform float dayGain;
    varying vec2 vUv;
    varying vec3 vN;
    void main() {
      float d = dot(normalize(vN), normalize(sunDir));
      float mixDay = smoothstep(-0.12, 0.22, d);
      vec3 day = texture2D(dayMap, vUv).rgb * (0.08 + 1.05 * max(d, 0.0)) * dayGain;
      vec3 night = texture2D(nightMap, vUv).rgb * nightGain;
      gl_FragColor = vec4(mix(night, day, mixDay), 1.0);
      #include <tonemapping_fragment>
      #include <colorspace_fragment>
    }`,
};

const atmosphereShader = {
  vertex: /* glsl */ `
    varying vec3 vN;
    varying vec3 vP;
    void main() {
      vN = normalize(normalMatrix * normal);
      vec4 mv = modelViewMatrix * vec4(position, 1.0);
      vP = mv.xyz;
      gl_Position = projectionMatrix * mv;
    }`,
  fragment: /* glsl */ `
    uniform vec3 color;
    uniform float strength;
    varying vec3 vN;
    varying vec3 vP;
    void main() {
      float rim = 1.0 - max(dot(normalize(vN), normalize(-vP)), 0.0);
      float a = pow(rim, 3.2) * strength;
      gl_FragColor = vec4(color * a, a);
    }`,
};

export type EarthProps = {
  radius: number;
  night: THREE.Texture;
  /** Day texture: when given, the globe is lit by `sun` (day/night terminator); otherwise it is a night globe. */
  day?: THREE.Texture;
  clouds?: THREE.Texture;
  sun?: [number, number, number];
  nightGain?: number;
  dayGain?: number;
  atmosphere?: string;
  atmosphereStrength?: number;
} & ThreeElements['group'];

export const Earth = ({radius, night, day, clouds, sun = [1, 0.2, 0.4], nightGain = 1, dayGain = 1, atmosphere = '#2997FF', atmosphereStrength = 1.2, ...group}: EarthProps) => {
  const geo = useMemo(() => new THREE.SphereGeometry(radius, 128, 96), [radius]);
  const atmoGeo = useMemo(() => new THREE.SphereGeometry(radius * 1.045, 96, 64), [radius]);
  const surface = useMemo(() => {
    if (!day) return new THREE.MeshStandardMaterial({color: '#03060d', roughness: 0.75, metalness: 0.1, emissive: '#ffffff', emissiveMap: night, emissiveIntensity: nightGain});
    return new THREE.ShaderMaterial({uniforms: {dayMap: {value: day}, nightMap: {value: night}, sunDir: {value: new THREE.Vector3(...sun)}, nightGain: {value: nightGain}, dayGain: {value: dayGain}}, vertexShader: dayNightShader.vertex, fragmentShader: dayNightShader.fragment});
  }, [day, night]); // eslint-disable-line react-hooks/exhaustive-deps
  if (surface instanceof THREE.ShaderMaterial) {
    surface.uniforms.sunDir.value.set(...sun);
    surface.uniforms.nightGain.value = nightGain;
    surface.uniforms.dayGain.value = dayGain;
  } else surface.emissiveIntensity = nightGain;
  const atmo = useMemo(
    () => new THREE.ShaderMaterial({uniforms: {color: {value: new THREE.Color(atmosphere)}, strength: {value: atmosphereStrength}}, vertexShader: atmosphereShader.vertex, fragmentShader: atmosphereShader.fragment, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false}),
    [atmosphere], // eslint-disable-line react-hooks/exhaustive-deps
  );
  atmo.uniforms.strength.value = atmosphereStrength;
  const cloudMat = useMemo(() => (clouds ? new THREE.MeshStandardMaterial({alphaMap: clouds, transparent: true, color: '#ffffff', roughness: 1, depthWrite: false, opacity: 0.85}) : null), [clouds]);
  return (
    <group {...group}>
      <mesh geometry={geo} material={surface} />
      {cloudMat && (
        <mesh material={cloudMat} scale={1.008}>
          <sphereGeometry args={[radius, 96, 64]} />
        </mesh>
      )}
      <mesh geometry={atmoGeo} material={atmo} />
    </group>
  );
};
