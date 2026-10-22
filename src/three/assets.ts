import {useEffect, useState} from 'react';
import {cancelRender, continueRender, delayRender} from 'remotion';
import * as THREE from 'three';
import {loadBrandFonts} from '../theme/typography';

/** Runs an async loader once and holds the frame until it resolves. Mount the canvas only when it returns non-null. */
export const useAssets3D = <T,>(load: () => Promise<T>, label = 'three-assets'): T | null => {
  const [handle] = useState(() => delayRender(label));
  const [value, setValue] = useState<T | null>(null);
  useEffect(() => {
    let live = true;
    load()
      .then((v) => {
        if (!live) return;
        setValue(v);
        continueRender(handle);
      })
      .catch((e) => cancelRender(e));
    return () => {
      live = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return value;
};

export const loadImage = (src: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Could not load ${src}`));
    img.src = src;
  });

export const toTexture = (source: HTMLImageElement | HTMLCanvasElement) => {
  const t = source instanceof HTMLCanvasElement ? new THREE.CanvasTexture(source) : new THREE.Texture(source);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  t.needsUpdate = true;
  return t;
};

/** Brand fonts must be ready before text is drawn onto canvases. */
export const fontsReady = async () => {
  await loadBrandFonts();
  await document.fonts.ready;
};

export type TextTexture = {texture: THREE.Texture; aspect: number};

/** One line of brand type drawn onto a canvas (2× for crispness). */
export const textTexture = (
  text: string,
  {family, weight = 800, px = 96, color = '#FFFFFF', tracking = 0, bg, pad = 0, radius = 0}: {family: string; weight?: number; px?: number; color?: string; tracking?: number; bg?: string; pad?: number; radius?: number},
): TextTexture => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;
  const font = `${weight} ${px}px "${family}"`;
  ctx.font = font;
  ctx.letterSpacing = `${tracking}px`;
  const w = Math.ceil(ctx.measureText(text).width + pad * 2 + 4);
  const h = Math.ceil(px * 1.3 + pad * 2);
  canvas.width = w;
  canvas.height = h;
  ctx.font = font;
  ctx.letterSpacing = `${tracking}px`;
  if (bg) {
    ctx.fillStyle = bg;
    ctx.beginPath();
    ctx.roundRect(0, 0, w, h, radius);
    ctx.fill();
  }
  ctx.fillStyle = color;
  ctx.textBaseline = 'middle';
  ctx.fillText(text, pad + 2, h / 2 + px * 0.04);
  return {texture: toTexture(canvas), aspect: w / h};
};
