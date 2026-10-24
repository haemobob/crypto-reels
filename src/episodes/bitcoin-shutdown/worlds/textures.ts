import * as THREE from 'three';
import {toTexture} from '../../../three/assets';
import {colors} from '../../../theme/colors';
import {fonts} from '../../../theme/typography';

export const px = (canvas: HTMLCanvasElement) => toTexture(canvas);

const canvasOf = (w: number, h: number) => {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  return {c, ctx: c.getContext('2d')!};
};

/** A printed page: the GOV.UK excerpts stacked on white, with "[…]" where text is skipped. Pixel layout in PAGE. */
export const PAGE = {w: 1520, h: 1930, margin: 60, head: {y: 60, h: 1250}, power: {y: 1360, h: 230}, days: {y: 1640, h: 230}};
export const pageTexture = (head: HTMLImageElement, power: HTMLImageElement, days: HTMLImageElement) => {
  const {c, ctx} = canvasOf(PAGE.w, PAGE.h);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, PAGE.w, PAGE.h);
  ctx.drawImage(head, PAGE.margin, PAGE.head.y);
  ctx.drawImage(power, PAGE.margin, PAGE.power.y);
  ctx.drawImage(days, PAGE.margin, PAGE.days.y);
  ctx.fillStyle = '#9aa3ad';
  ctx.font = `600 30px "${fonts.body}"`;
  for (const y of [PAGE.power.y - 28, PAGE.days.y - 28]) ctx.fillText('[ … ]', PAGE.margin + 70, y + 8);
  // Paper grain.
  const img = ctx.getImageData(0, 0, PAGE.w, PAGE.h);
  let s = 7;
  for (let i = 0; i < img.data.length; i += 4) {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    const n = ((s >> 16) % 7) - 3;
    img.data[i] += n;
    img.data[i + 1] += n;
    img.data[i + 2] += n;
  }
  ctx.putImageData(img, 0, 0);
  return px(c);
};

/** A server's front panel: 8 units with vents, drive bays and handles (LEDs are separate glowing meshes). */
export const rackTexture = () => {
  const W = 300, H = 1064;
  const {c, ctx} = canvasOf(W, H);
  ctx.fillStyle = '#07090d';
  ctx.fillRect(0, 0, W, H);
  // Rails
  ctx.fillStyle = '#1a1f27';
  ctx.fillRect(0, 0, 14, H);
  ctx.fillRect(W - 14, 0, 14, H);
  for (let u = 0; u < 8; u++) {
    const y = H - 70 - u * 121 - 100;
    ctx.fillStyle = u % 3 === 1 ? '#151a22' : '#11151c';
    ctx.fillRect(18, y, W - 36, 100);
    ctx.strokeStyle = '#262d38';
    ctx.lineWidth = 2;
    ctx.strokeRect(18, y, W - 36, 100);
    // Drive bays
    for (let d = 0; d < 6; d++) {
      ctx.fillStyle = '#1c222c';
      ctx.fillRect(30 + d * 30, y + 14, 24, 72);
      ctx.fillStyle = '#2b333f';
      ctx.fillRect(30 + d * 30, y + 14, 24, 6);
    }
    // Vents
    ctx.fillStyle = '#05070a';
    for (let v = 0; v < 6; v++) for (let k = 0; k < 4; k++) ctx.fillRect(215 + k * 14, y + 16 + v * 12, 9, 6);
    // Handle
    ctx.fillStyle = '#323a47';
    ctx.fillRect(22, y + 40, 4, 24);
    ctx.fillRect(W - 26, y + 40, 4, 24);
  }
  return px(c);
};

/** Raised-floor tiles. */
export const floorTexture = () => {
  const S = 256;
  const {c, ctx} = canvasOf(S, S);
  ctx.fillStyle = '#0b0f16';
  ctx.fillRect(0, 0, S, S);
  ctx.strokeStyle = '#1b2230';
  ctx.lineWidth = 4;
  ctx.strokeRect(2, 2, S - 4, S - 4);
  ctx.fillStyle = '#121824';
  for (let y = 24; y < S - 20; y += 22) for (let x = 24; x < S - 20; x += 22) ctx.fillRect(x, y, 6, 6);
  const t = px(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  return t;
};

/** Generic website mock-ups (no real brands) and their error state. */
export const siteTexture = (variant: number, error: boolean) => {
  const W = 900, H = 600;
  const {c, ctx} = canvasOf(W, H);
  const accent = ['#1677FF', '#0E9F6E', '#7C3AED', '#E11D48', '#0891B2'][variant % 5];
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, W, H);
  // Browser chrome
  ctx.fillStyle = '#e9edf2';
  ctx.fillRect(0, 0, W, 54);
  for (let i = 0; i < 3; i++) {
    ctx.fillStyle = ['#ff5f57', '#febc2e', '#28c840'][i];
    ctx.beginPath();
    ctx.arc(26 + i * 24, 27, 8, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.roundRect(110, 12, 560, 30, 15);
  ctx.fill();
  ctx.fillStyle = '#7a8594';
  ctx.font = `500 18px "${fonts.body}"`;
  ctx.fillText(['website-berita', 'toko-online', 'layanan-publik', 'forum-komunitas', 'portal-sekolah'][variant % 5] + '.contoh', 130, 33);
  if (error) {
    ctx.fillStyle = '#111827';
    ctx.font = `800 150px "${fonts.heading}"`;
    ctx.fillText('503', 70, 260);
    ctx.font = `700 40px "${fonts.heading}"`;
    ctx.fillText('Service Temporarily', 74, 340);
    ctx.fillText('Unavailable', 74, 390);
    ctx.fillStyle = '#6b7280';
    ctx.font = `500 26px "${fonts.body}"`;
    ctx.fillText('Situs dimatikan sementara untuk pembaruan keamanan.', 74, 450);
    ctx.fillStyle = colors.negative;
    ctx.fillRect(74, 490, 160, 8);
    return px(c);
  }
  ctx.fillStyle = accent;
  ctx.fillRect(0, 54, W, 70);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(40, 76, 120, 26);
  for (let i = 0; i < 4; i++) ctx.fillRect(560 + i * 80, 82, 56, 14);
  ctx.fillStyle = '#eef2f7';
  ctx.fillRect(40, 150, 520, 250);
  ctx.fillStyle = accent;
  ctx.globalAlpha = 0.35;
  ctx.fillRect(40, 150, 520, 250);
  ctx.globalAlpha = 1;
  for (let i = 0; i < 6; i++) {
    ctx.fillStyle = '#d6dbe3';
    ctx.fillRect(600, 160 + i * 40, 250 - (i % 3) * 40, 16);
  }
  for (let i = 0; i < 3; i++) {
    ctx.fillStyle = '#e3e7ee';
    ctx.fillRect(40 + i * 280, 430, 250, 130);
  }
  return px(c);
};

/** A real clipping on a white card: the screenshot crop plus an optional second crop (byline) and a caption. */
export const clippingTexture = (main: HTMLImageElement, extra: HTMLImageElement | null, caption: string) => {
  const pad = 50;
  const W = main.width + pad * 2;
  const H = main.height + (extra ? extra.height + 20 : 0) + pad * 2 + 70;
  const {c, ctx} = canvasOf(W, H);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, W, H);
  ctx.drawImage(main, pad, pad);
  if (extra) ctx.drawImage(extra, pad, pad + main.height + 20);
  ctx.fillStyle = '#6b7280';
  ctx.font = `700 34px "${fonts.mono}"`;
  ctx.fillText(caption, pad, H - pad + 6);
  return {texture: px(c), aspect: W / H, pad, mainH: main.height};
};

/** Soft blurred newsroom wall (pre-blurred, so it reads as shallow depth of field). */
export const bokehWall = (seed: number, palette: string[], w = 1024, h = 512, count = 46) => {
  const {c, ctx} = canvasOf(w, h);
  ctx.fillStyle = '#020306';
  ctx.fillRect(0, 0, w, h);
  let s = seed;
  const r = () => ((s = (s * 1664525 + 1013904223) % 4294967296) / 4294967296);
  ctx.filter = 'blur(18px)';
  for (let i = 0; i < count; i++) {
    const x = r() * w, y = r() * h, rad = 10 + r() * 60;
    ctx.globalAlpha = 0.15 + r() * 0.45;
    ctx.fillStyle = palette[Math.floor(r() * palette.length)];
    if (r() < 0.5) {
      ctx.beginPath();
      ctx.arc(x, y, rad, 0, Math.PI * 2);
      ctx.fill();
    } else ctx.fillRect(x, y, rad * 3, rad * 0.9);
  }
  ctx.filter = 'none';
  ctx.globalAlpha = 1;
  return px(c);
};
