import {useMemo} from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import * as THREE from 'three';
import {fontsReady, useAssets3D} from '../../../three/assets';
import type {CamKey} from '../../../three/camera';
import {ATM, PaymentTerminal, Phone} from '../../../three/devices';
import {studioPanels} from '../../../three/env';
import {canvasTexture} from '../../../three/kit';
import {drawATM, drawBankApp, drawTerminal, drawWallet} from '../../../three/screens';
import {World3D} from '../../../three/World3D';
import {colors} from '../../../theme/colors';
import {ease} from '../../../theme/motion';
import {fonts} from '../../../theme/typography';
import {bokehWall} from './textures';

const ramp = (f: number, a: number, b: number, e = ease.inOut) => interpolate(f, [a, b], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: e});

export type PayBeats = {pos: number; atm: number; bank: number; question: number; q2: number; q3: number; nocenter: number};

const ATM_X = 30;
const PHONE_X = 60;
const TERM_ROT = 0.35;
/** Terminal screen centre in world space (terminal flat on the counter, turned TERM_ROT). */
const TERM_SCREEN: [number, number, number] = [-0.36 * Math.sin(TERM_ROT), 0.172, -0.36 * Math.cos(TERM_ROT)];
const TERM_UP: [number, number, number] = [-Math.sin(TERM_ROT), 0, -Math.cos(TERM_ROT)];

export const PaymentsWorld = ({b}: {b: PayBeats}) => {
  const frame = useCurrentFrame();
  const a = useAssets3D(async () => {
    await fontsReady();
    const term = canvasTexture(800, 600, drawTerminal);
    const atm = canvasTexture(800, 600, drawATM);
    const header = canvasTexture(980, 220, (ctx, w, h) => {
      ctx.fillStyle = '#0b3a8a';
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = '#ffffff';
      ctx.font = `800 130px "${fonts.heading}"`;
      ctx.textAlign = 'center';
      ctx.fillText('ATM', w / 2, 160);
    });
    const phone = canvasTexture(900, 1960, (ctx, w, h) => drawBankApp(ctx, w, h, 0));
    return {
      term: term.texture, atm: atm.texture, header: header.texture, phone,
      storeBokeh: bokehWall(21, ['#ffcf8a', '#ffffff', '#ffe2b0', '#75C7FF', '#FF5263'], 1024, 640, 60),
      lobbyBokeh: bokehWall(33, ['#cfe2ff', '#ffffff', '#75C7FF', '#1677FF'], 1024, 640, 50),
    };
  }, 'payments');

  const counter = useMemo(() => new THREE.MeshPhysicalMaterial({color: '#211d1a', roughness: 0.38, metalness: 0.05, clearcoat: 0.5, clearcoatRoughness: 0.3}), []);
  if (!a) return null;

  // Phone screen: bank app with spinner → morphs into the wallet → goes offline.
  const morph = ramp(frame, b.question + 4, b.question + 26);
  const online = frame < b.q2 + 6 ? 1 : 0;
  a.phone.redraw((ctx, w, h) => {
    if (morph < 1) drawBankApp(ctx, w, h, frame * 0.22, 1);
    if (morph > 0) drawWallet(ctx, w, h, {online, alpha: morph, rise: (1 - morph) * 120, pulse: Math.abs(Math.sin(frame * 0.25))});
  });

  const wallet = frame >= b.question;
  const bob = Math.sin(frame / 22) * 0.02;
  const S = TERM_SCREEN;
  // Device shots use the lower-third layout: the device fills y ≈ 330–1470, the headline sits below it.
  const keys: CamKey[] = [
    // Match cut: the 503 card fills the frame → the terminal's screen fills the frame, seen from above.
    {f: b.pos, pos: [S[0] + 0.02, S[1] + 0.62, S[2] + 0.02], look: S, fov: 40, up: TERM_UP},
    {f: b.pos + 4, pos: [S[0] + 0.02, S[1] + 0.64, S[2] + 0.03], look: S, fov: 40, up: TERM_UP},
    {f: b.pos + 30, pos: [0.5, 1.95, 1.3], look: [-0.06, 0.1, -0.25], fov: 40, shift: 40, ease: 'out'},
    {f: b.atm, pos: [0.62, 2.05, 1.5], look: [-0.06, 0.1, -0.22], fov: 40, shift: 40},
    // Hard cut to the ATM: strong sideways track left → right.
    {f: b.atm, pos: [ATM_X - 1.4, 1.5, 3.6], look: [ATM_X - 0.5, 1.45, 0], fov: 40, shift: 60},
    {f: b.bank - 2, pos: [ATM_X + 1.0, 1.5, 3.4], look: [ATM_X + 0.1, 1.45, 0], fov: 40, shift: 60, ease: 'out'},
    {f: b.bank, pos: [ATM_X + 1.0, 1.5, 3.4], look: [ATM_X + 0.1, 1.45, 0], fov: 40, shift: 60},
    // Hard cut to the phone (same frame): the banking error, slow push through the near-silence.
    {f: b.bank, pos: [PHONE_X + 0.35, 1.2, 3.3], look: [PHONE_X, 1.18, 0], fov: 40, shift: 60},
    {f: b.question, pos: [PHONE_X + 0.15, 1.16, 3.0], look: [PHONE_X, 1.15, 0], fov: 40, shift: 60, ease: 'linear'},
    // The phone becomes a Bitcoin wallet: slow orbit, then a sudden push on "Bitcoin lo gimana?".
    {f: b.question + 24, pos: [PHONE_X + 0.6, 1.3, 3.6], look: [PHONE_X, 1.2, 0], fov: 40, shift: 60},
    {f: b.q3, pos: [PHONE_X - 0.75, 1.36, 3.45], look: [PHONE_X, 1.2, 0], fov: 40, shift: 60, ease: 'linear'},
    // Push frames status, balance and the locked KIRIM together (y ≈ 300–1200); the headline covers only the activity list.
    {f: b.q3 + 9, pos: [PHONE_X - 0.07, 1.48, 1.8], look: [PHONE_X - 0.06, 1.48, 0], fov: 40, shift: 200, ease: 'in'},
    {f: b.nocenter - 12, pos: [PHONE_X - 0.06, 1.48, 1.74], look: [PHONE_X - 0.06, 1.48, 0], fov: 40, shift: 200},
    // Zoom-through into the screen's dark background (the cut to the network happens inside it).
    {f: b.nocenter + 1, pos: [PHONE_X + 0.12, 1.02, 0.12], look: [PHONE_X + 0.12, 1.02, 0], fov: 40, shift: 0, ease: 'in'},
  ];

  return (
    <World3D keys={keys} panels={studioPanels.dark} envIntensity={0.8} exposure={1.05}>
      <ambientLight intensity={0.15} />

      {/* Store counter at night */}
      <group>
        <mesh position={[0, -0.06, 0]} material={counter}>
          <boxGeometry args={[8, 0.12, 4]} />
        </mesh>
        <mesh position={[0, 1.2, -4.5]}>
          <planeGeometry args={[14, 8]} />
          <meshBasicMaterial map={a.storeBokeh} toneMapped={false} />
        </mesh>
        <spotLight position={[-1.5, 3, 1.5]} angle={0.5} penumbra={0.8} intensity={30} color="#fff1dc" />
        <pointLight position={[S[0], 0.5, S[2]]} color={colors.negative} intensity={1.6} distance={1.5} />
        <PaymentTerminal screen={a.term} position={[0, 0.08, 0]} rotation={[0, TERM_ROT, 0]} />
      </group>

      {/* Bank lobby ATM */}
      <group>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[ATM_X, 0, 0]}>
          <planeGeometry args={[8, 8]} />
          <meshStandardMaterial color="#0e1218" roughness={0.3} metalness={0.4} />
        </mesh>
        <mesh position={[ATM_X, 2, -1.2]}>
          <planeGeometry args={[10, 6]} />
          <meshBasicMaterial map={a.lobbyBokeh} toneMapped={false} />
        </mesh>
        <spotLight position={[ATM_X, 3.6, 1.6]} angle={0.55} penumbra={0.7} intensity={40} color="#e8f0ff" />
        <pointLight position={[ATM_X + 1.5, 1.6, 1]} color={colors.electric} intensity={4} distance={4} />
        <ATM screen={a.atm} header={a.header} position={[ATM_X, 0, 0]} />
      </group>

      {/* The phone: dim store light behind the bank app; black void once it becomes a wallet */}
      <group>
        <mesh position={[PHONE_X, 1.2, -3]}>
          <planeGeometry args={[9, 7]} />
          <meshBasicMaterial map={a.storeBokeh} toneMapped={false} transparent opacity={0.55 * (1 - ramp(frame, b.question, b.question + 16))} />
        </mesh>
        <spotLight position={[PHONE_X - 1.5, 2.6, 2]} angle={0.6} penumbra={0.8} intensity={14} color="#ffffff" />
        <pointLight position={[PHONE_X + 1.2, 1.6, -1]} color={colors.electric} intensity={wallet ? 10 : 3} distance={4} />
        <Phone screen={a.phone.texture} position={[PHONE_X, 1.2 + bob, 0]} rotation={[0.04, wallet ? -0.12 : 0.06, wallet ? 0.02 : -0.03]} />
      </group>
    </World3D>
  );
};
