/** Canvas textures for the emas-bank-sentral city (windows, flags, the real gold chart). */
import {toTexture} from '../../three/assets';
import {fonts} from '../../theme/typography';
import {C} from './city';
import data from './data.json';

// // Canvas textures

export const windowsTexture = () => {
  const c = document.createElement('canvas');
  c.width = 256;
  c.height = 512;
  const g = c.getContext('2d')!;
  g.fillStyle = C.building;
  g.fillRect(0, 0, 256, 512);
  for (let y = 0; y < 16; y++)
    for (let x = 0; x < 6; x++) {
      const lit = Math.abs((Math.sin(x * 12.9 + y * 78.2) * 43758.5) % 1);
      g.fillStyle = lit > 0.6 ? '#DCE8FF' : '#1A4FC9';
      g.fillRect(18 + x * 38, 20 + y * 30, 22, 16);
    }
  return toTexture(c);
};

export const flagTexture = (country: 'cn' | 'pl') => {
  const c = document.createElement('canvas');
  c.width = 300;
  c.height = 200;
  const g = c.getContext('2d')!;
  if (country === 'pl') {
    g.fillStyle = '#FFFFFF';
    g.fillRect(0, 0, 300, 100);
    g.fillStyle = '#DC143C';
    g.fillRect(0, 100, 300, 100);
  } else {
    g.fillStyle = '#EE1C25';
    g.fillRect(0, 0, 300, 200);
    const star = (cx: number, cy: number, r: number, rot: number) => {
      g.beginPath();
      for (let i = 0; i < 10; i++) {
        const a = rot + (i * Math.PI) / 5 - Math.PI / 2;
        const rr = i % 2 ? r * 0.382 : r;
        g.lineTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr);
      }
      g.closePath();
      g.fillStyle = '#FFFF00';
      g.fill();
    };
    star(50, 50, 30, 0);
    [[100, 20], [120, 40], [120, 70], [100, 90]].forEach(([x, y], i) => star(x, y, 10, 0.3 + i * 0.3));
  }
  return toTexture(c);
};

export type ChartOpts = {from: string; to: string; title: string; badge: string; sub: string; highlight?: [string, string]};

/** Draws the real gold price (daily closes) between two dates onto a canvas, the line drawn up to `progress` (0–1). */
export const drawChart = (c: HTMLCanvasElement, {from, to, title, badge, sub, highlight}: ChartOpts, progress = 1) => {
  const W = 1200;
  const H = 700;
  c.width = W;
  c.height = H;
  const g = c.getContext('2d')!;
  g.fillStyle = '#071433';
  g.fillRect(0, 0, W, H);
  const pts = data.gold.filter((p) => p.d >= from && p.d <= to);
  const vals = pts.map((p) => p.c);
  const lo = Math.min(...vals) * 0.96;
  const hi = Math.max(...vals) * 1.03;
  const px = (i: number) => 60 + (i / (pts.length - 1)) * (W - 200);
  const py = (v: number) => 190 + ((hi - v) / (hi - lo)) * (H - 250);
  if (highlight) {
    const a = pts.findIndex((p) => p.d >= highlight[0]);
    const b = pts.findLastIndex((p) => p.d <= highlight[1]);
    g.fillStyle = 'rgba(255,82,99,0.16)';
    g.fillRect(px(a), 170, px(b) - px(a), H - 210);
  }
  const step = hi - lo > 2000 ? 1000 : 250;
  g.strokeStyle = 'rgba(255,255,255,0.08)';
  g.lineWidth = 2;
  g.font = `600 26px "${fonts.mono}"`;
  for (let v = Math.ceil(lo / step) * step; v < hi; v += step) {
    g.beginPath();
    g.moveTo(40, py(v));
    g.lineTo(W - 150, py(v));
    g.stroke();
    g.fillStyle = 'rgba(255,255,255,0.5)';
    g.fillText(`$${v.toLocaleString('id-ID')}`, W - 140, py(v) + 9);
  }
  const upto = Math.max(1, Math.round((pts.length - 1) * Math.max(0, Math.min(1, progress))));
  g.beginPath();
  pts.slice(0, upto + 1).forEach((p, i) => (i ? g.lineTo(px(i), py(p.c)) : g.moveTo(px(i), py(p.c))));
  g.strokeStyle = C.gold;
  g.lineWidth = 7;
  g.lineJoin = 'round';
  g.stroke();
  g.beginPath();
  g.arc(px(upto), py(pts[upto].c), 12, 0, Math.PI * 2);
  g.fillStyle = progress >= 1 ? '#FF5263' : '#FFFFFF';
  g.fill();
  g.font = `800 56px "${fonts.heading}"`;
  g.fillStyle = '#FFFFFF';
  g.fillText(title, 60, 90);
  if (progress >= 1) {
    g.font = `800 80px "${fonts.mono}"`;
    g.fillStyle = '#FF5263';
    g.textAlign = 'right';
    g.fillText(badge, W - 50, 100);
    g.textAlign = 'left';
  }
  g.font = `600 24px "${fonts.mono}"`;
  g.fillStyle = 'rgba(255,255,255,0.6)';
  g.fillText(sub, 60, 135);
};

export const chartTexture = (opts: ChartOpts) => {
  const c = document.createElement('canvas');
  drawChart(c, opts);
  return toTexture(c);
};

