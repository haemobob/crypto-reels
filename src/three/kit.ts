import * as THREE from 'three';
import {TextGeometry} from 'three/examples/jsm/geometries/TextGeometry.js';
import {Font} from 'three/examples/jsm/loaders/FontLoader.js';
import {SVGLoader} from 'three/examples/jsm/loaders/SVGLoader.js';
import {toTexture} from './assets';

/** Soft round glow (white core fading out) for additive sprites and points. */
export const glowTexture = (size = 128, falloff = 2.2) => {
  const c = document.createElement('canvas');
  c.width = size;
  c.height = size;
  const ctx = c.getContext('2d')!;
  const img = ctx.createImageData(size, size);
  for (let y = 0; y < size; y++)
    for (let x = 0; x < size; x++) {
      const d = Math.hypot(x - size / 2 + 0.5, y - size / 2 + 0.5) / (size / 2);
      const a = Math.max(0, 1 - d) ** falloff;
      const i = (y * size + x) * 4;
      img.data[i] = img.data[i + 1] = img.data[i + 2] = 255;
      img.data[i + 3] = Math.round(a * 255);
    }
  ctx.putImageData(img, 0, 0);
  return toTexture(c);
};

/** A canvas of the given size drawn by `draw`, as an sRGB texture. Keep the canvas to redraw it later. */
export const canvasTexture = (w: number, h: number, draw: (ctx: CanvasRenderingContext2D, w: number, h: number) => void) => {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  draw(c.getContext('2d')!, w, h);
  const t = toTexture(c) as THREE.CanvasTexture;
  return {texture: t, canvas: c, redraw: (d: typeof draw) => { const ctx = c.getContext('2d')!; ctx.clearRect(0, 0, w, h); d(ctx, w, h); t.needsUpdate = true; }};
};

export const loadFont = async (url: string) => new Font(await (await fetch(url)).json());

/** Extruded, centred 3D type. Size is the cap height in world units (approximately). */
export const text3D = (font: Font, text: string, {size = 1, depth = 0.2, bevel = 0.02, curveSegments = 10, align = 'center'}: {size?: number; depth?: number; bevel?: number; curveSegments?: number; align?: 'center' | 'left'} = {}) => {
  const g = new TextGeometry(text, {font, size, depth, curveSegments, bevelEnabled: bevel > 0, bevelThickness: bevel, bevelSize: bevel * 0.8, bevelSegments: 3});
  g.computeBoundingBox();
  const b = g.boundingBox!;
  g.translate(align === 'center' ? -(b.max.x + b.min.x) / 2 : -b.min.x, -(b.max.y + b.min.y) / 2, -depth / 2);
  g.computeVertexNormals();
  return g;
};

/** Shapes of every filled path in an SVG file whose fill matches `fill` (or all paths). */
export const svgShapes = async (url: string, fill?: string) => {
  const data = new SVGLoader().parse(await (await fetch(url)).text());
  return data.paths.filter((p) => !fill || (p.userData?.style?.fill ?? '').toLowerCase() === fill.toLowerCase()).flatMap((p) => SVGLoader.createShapes(p));
};

/** Seeded pseudo-random numbers, so procedural layouts are identical in every render. */
export const rng = (seed: number) => () => {
  seed = (seed * 1664525 + 1013904223) % 4294967296;
  return seed / 4294967296;
};

/** Normal map of fine vertical ridges (a coin's reeded edge, a server grille). */
export const ridgeNormalMap = (count = 160, w = 1024, h = 32) => {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const ctx = c.getContext('2d')!;
  const img = ctx.createImageData(w, h);
  for (let x = 0; x < w; x++) {
    const nx = Math.sin(((x / w) * count) * Math.PI * 2);
    const r = Math.round((nx * 0.6 * 0.5 + 0.5) * 255);
    for (let y = 0; y < h; y++) {
      const i = (y * w + x) * 4;
      img.data[i] = r;
      img.data[i + 1] = 128;
      img.data[i + 2] = 230;
      img.data[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  return t;
};
