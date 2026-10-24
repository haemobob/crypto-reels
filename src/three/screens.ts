import {colors} from '../theme/colors';
import {fonts} from '../theme/typography';

type Ctx = CanvasRenderingContext2D;

const roundRect = (ctx: Ctx, x: number, y: number, w: number, h: number, r: number) => {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
};
const center = (ctx: Ctx, text: string, x: number, y: number, font: string, color: string) => {
  ctx.font = font;
  ctx.fillStyle = color;
  ctx.textAlign = 'center';
  ctx.fillText(text, x, y);
  ctx.textAlign = 'left';
};
const errorBadge = (ctx: Ctx, x: number, y: number, r: number, color = colors.negative) => {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = r * 0.16;
  ctx.lineCap = 'round';
  const k = r * 0.38;
  ctx.beginPath();
  ctx.moveTo(x - k, y - k);
  ctx.lineTo(x + k, y + k);
  ctx.moveTo(x + k, y - k);
  ctx.lineTo(x - k, y + k);
  ctx.stroke();
};
const spinner = (ctx: Ctx, x: number, y: number, r: number, t: number, color: string) => {
  ctx.strokeStyle = 'rgba(255,255,255,0.15)';
  ctx.lineWidth = r * 0.18;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = color;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.arc(x, y, r, t, t + Math.PI * 0.6);
  ctx.stroke();
};

/** EDC payment terminal: transaction failed, no connection (SIMULASI). */
export const drawTerminal = (ctx: Ctx, w: number, h: number) => {
  ctx.fillStyle = '#0b1220';
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = '#16233a';
  ctx.fillRect(0, 0, w, 70);
  ctx.font = `700 30px "${fonts.mono}"`;
  ctx.fillStyle = '#8fa6c8';
  ctx.fillText('KARTU DEBIT', 28, 46);
  // No-signal bars
  for (let i = 0; i < 4; i++) {
    ctx.fillStyle = i === 0 ? colors.negative : '#2a3550';
    ctx.fillRect(w - 120 + i * 22, 50 - i * 10, 14, 10 + i * 10);
  }
  errorBadge(ctx, w / 2, 200, 70);
  center(ctx, 'PAYMENT FAILED', w / 2, 345, `800 62px "${fonts.heading}"`, '#ffffff');
  center(ctx, 'NO CONNECTION', w / 2, 410, `700 44px "${fonts.mono}"`, colors.negative);
  center(ctx, 'Transaksi gagal · tidak ada koneksi', w / 2, 470, `500 30px "${fonts.body}"`, '#8fa6c8');
  roundRect(ctx, w / 2 - 150, 505, 300, 64, 14);
  ctx.fillStyle = '#22314d';
  ctx.fill();
  center(ctx, 'ULANGI', w / 2, 549, `700 30px "${fonts.mono}"`, '#cfe0ff');
};

/** ATM screen: temporarily offline (SIMULASI). */
export const drawATM = (ctx: Ctx, w: number, h: number) => {
  const g = ctx.createLinearGradient(0, 0, 0, h);
  g.addColorStop(0, '#0f2a5c');
  g.addColorStop(1, '#081733');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
  // Clock icon
  ctx.strokeStyle = '#ffd166';
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.arc(w / 2, 190, 74, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(w / 2, 190);
  ctx.lineTo(w / 2, 140);
  ctx.moveTo(w / 2, 190);
  ctx.lineTo(w / 2 + 38, 210);
  ctx.stroke();
  center(ctx, 'TEMPORARILY', w / 2, 345, `800 66px "${fonts.heading}"`, '#ffffff');
  center(ctx, 'OFFLINE', w / 2, 418, `800 66px "${fonts.heading}"`, '#ffd166');
  center(ctx, 'Mohon maaf, layanan sementara tidak tersedia.', w / 2, 488, `500 30px "${fonts.body}"`, '#bcd0f0');
  center(ctx, 'Silakan coba beberapa saat lagi.', w / 2, 528, `500 30px "${fonts.body}"`, '#bcd0f0');
};

const statusBar = (ctx: Ctx, w: number, dark: boolean, connected: boolean) => {
  const fg = dark ? '#ffffff' : '#111827';
  ctx.font = `600 40px "${fonts.body}"`;
  ctx.fillStyle = fg;
  ctx.fillText('21.43', 70, 92);
  // Dynamic island
  roundRect(ctx, w / 2 - 120, 40, 240, 70, 35);
  ctx.fillStyle = '#000000';
  ctx.fill();
  // Signal + wifi (crossed out when offline)
  for (let i = 0; i < 4; i++) {
    ctx.fillStyle = connected ? fg : 'rgba(150,160,175,0.6)';
    ctx.fillRect(w - 250 + i * 16, 92 - 10 - i * 7, 10, 10 + i * 7);
  }
  if (!connected) {
    ctx.strokeStyle = colors.negative;
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(w - 254, 54);
    ctx.lineTo(w - 186, 98);
    ctx.stroke();
  }
  roundRect(ctx, w - 160, 66, 80, 34, 9);
  ctx.strokeStyle = fg;
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.fillStyle = fg;
  ctx.fillRect(w - 154, 72, 50, 22);
};

/** Generic mobile-banking app that cannot connect (no real bank). */
export const drawBankApp = (ctx: Ctx, w: number, h: number, t: number, alpha = 1) => {
  ctx.globalAlpha = alpha;
  ctx.fillStyle = '#f4f6fa';
  ctx.fillRect(0, 0, w, h);
  statusBar(ctx, w, false, false);
  ctx.fillStyle = '#0b3a8a';
  ctx.fillRect(0, 150, w, 190);
  ctx.font = `800 54px "${fonts.heading}"`;
  ctx.fillStyle = '#ffffff';
  ctx.fillText('m-Banking', 70, 265);
  // Ghost content
  for (let i = 0; i < 4; i++) {
    roundRect(ctx, 70, 400 + i * 150, w - 140, 110, 22);
    ctx.fillStyle = '#e3e8f0';
    ctx.fill();
  }
  // Error sheet
  roundRect(ctx, 60, h * 0.42, w - 120, 700, 40);
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = 'rgba(0,0,0,0.25)';
  ctx.shadowBlur = 40;
  ctx.fill();
  ctx.shadowBlur = 0;
  errorBadge(ctx, w / 2, h * 0.42 + 160, 80);
  center(ctx, 'Tidak dapat terhubung', w / 2, h * 0.42 + 330, `800 56px "${fonts.heading}"`, '#111827');
  center(ctx, 'Periksa koneksi internet Anda,', w / 2, h * 0.42 + 410, `500 38px "${fonts.body}"`, '#4b5563');
  center(ctx, 'lalu coba lagi.', w / 2, h * 0.42 + 460, `500 38px "${fonts.body}"`, '#4b5563');
  roundRect(ctx, w / 2 - 220, h * 0.42 + 540, 440, 100, 50);
  ctx.fillStyle = '#0b3a8a';
  ctx.fill();
  spinner(ctx, w / 2 - 120, h * 0.42 + 590, 22, t, '#ffffff');
  center(ctx, 'Coba lagi', w / 2 + 30, h * 0.42 + 604, `700 40px "${fonts.body}"`, '#ffffff');
  ctx.globalAlpha = 1;
};

/** Generic self-custody Bitcoin wallet (SIMULASI balance). `online` 1 = connected, 0 = disconnected. */
export const drawWallet = (ctx: Ctx, w: number, h: number, {online, alpha = 1, rise = 0, pulse = 0}: {online: number; alpha?: number; rise?: number; pulse?: number}) => {
  ctx.globalAlpha = alpha;
  ctx.fillStyle = '#050b18';
  ctx.fillRect(0, 0, w, h);
  ctx.save();
  ctx.translate(0, rise);
  statusBar(ctx, w, true, online > 0.5);
  ctx.font = `700 44px "${fonts.body}"`;
  ctx.fillStyle = '#a8bdd8';
  ctx.fillText('Dompet Bitcoin', 70, 250);
  // Network chip
  const ok = online > 0.5;
  roundRect(ctx, 70, 300, ok ? 330 : 360, 76, 38);
  ctx.fillStyle = ok ? 'rgba(25,214,154,0.14)' : 'rgba(255,82,99,0.16)';
  ctx.fill();
  ctx.fillStyle = ok ? colors.positive : colors.negative;
  ctx.beginPath();
  ctx.arc(112, 338, 13 + (ok ? 0 : 3 * pulse), 0, Math.PI * 2);
  ctx.fill();
  ctx.font = `800 38px "${fonts.mono}"`;
  ctx.fillText(ok ? 'TERHUBUNG' : 'TERPUTUS', 142, 352);
  // Balance
  ctx.font = `600 40px "${fonts.body}"`;
  ctx.fillStyle = '#a8bdd8';
  ctx.fillText('Saldo', 70, 520);
  ctx.font = `800 138px "${fonts.heading}"`;
  ctx.fillStyle = '#ffffff';
  ctx.fillText('0,0500', 66, 668);
  ctx.font = `800 64px "${fonts.heading}"`;
  ctx.fillStyle = '#F7931A';
  ctx.fillText('BTC', 560, 668);
  ctx.font = `700 30px "${fonts.mono}"`;
  ctx.fillStyle = '#5b7090';
  ctx.fillText('SIMULASI', 70, 730);
  // Buttons
  const btn = (x: number, label: string, enabled: boolean) => {
    roundRect(ctx, x, 830, 360, 130, 34);
    ctx.fillStyle = enabled ? colors.blue : '#1a2232';
    ctx.fill();
    center(ctx, label, x + 180, 912, `800 50px "${fonts.heading}"`, enabled ? '#ffffff' : '#56627a');
  };
  btn(70, 'KIRIM', ok);
  btn(w - 430, 'TERIMA', true);
  if (!ok) {
    // Lock glyph on the send button
    ctx.strokeStyle = '#56627a';
    ctx.lineWidth = 7;
    ctx.beginPath();
    ctx.arc(140, 878, 18, Math.PI, 0);
    ctx.stroke();
    ctx.fillStyle = '#56627a';
    ctx.fillRect(116, 878, 48, 38);
    center(ctx, 'Butuh koneksi ke jaringan untuk mengirim', w / 2, 1035, `500 34px "${fonts.body}"`, colors.negative);
  }
  // Activity list
  ctx.font = `700 36px "${fonts.body}"`;
  ctx.fillStyle = '#a8bdd8';
  ctx.fillText('Aktivitas', 70, 1150);
  for (let i = 0; i < 3; i++) {
    roundRect(ctx, 70, 1190 + i * 150, w - 140, 120, 24);
    ctx.fillStyle = '#0b1730';
    ctx.fill();
    ctx.fillStyle = '#1e3256';
    ctx.fillRect(110, 1225 + i * 150, 220, 20);
    ctx.fillRect(110, 1260 + i * 150, 140, 16);
  }
  ctx.restore();
  ctx.globalAlpha = 1;
};

/** Generic crypto-exchange web app that cannot reach its servers (no real exchange). */
export const drawExchange = (ctx: Ctx, w: number, h: number, t: number) => {
  ctx.fillStyle = '#0b0f17';
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = '#121826';
  ctx.fillRect(0, 0, w, 90);
  ctx.font = `800 44px "${fonts.heading}"`;
  ctx.fillStyle = '#ffffff';
  ctx.fillText('EXCHANGE', 40, 60);
  ctx.font = `600 26px "${fonts.body}"`;
  ctx.fillStyle = '#6b7a93';
  ['Pasar', 'Trade', 'Aset'].forEach((m, i) => ctx.fillText(m, 330 + i * 120, 57));
  // Ghost chart + order rows behind the error
  ctx.strokeStyle = 'rgba(41,151,255,0.25)';
  ctx.lineWidth = 4;
  ctx.beginPath();
  for (let x = 0; x <= 560; x += 20) ctx.lineTo(40 + x, 300 - 60 * Math.sin(x / 70) - x * 0.1);
  ctx.stroke();
  for (let i = 0; i < 6; i++) {
    ctx.fillStyle = '#161d2b';
    ctx.fillRect(660, 140 + i * 50, 300, 34);
  }
  ctx.fillStyle = 'rgba(5,8,14,0.72)';
  ctx.fillRect(0, 90, w, h - 90);
  // Error modal
  roundRect(ctx, w / 2 - 330, 160, 660, 330, 26);
  ctx.fillStyle = '#151c2b';
  ctx.fill();
  ctx.strokeStyle = 'rgba(255,82,99,0.6)';
  ctx.lineWidth = 3;
  ctx.stroke();
  errorBadge(ctx, w / 2, 245, 46);
  center(ctx, 'Tidak dapat terhubung ke server', w / 2, 345, `800 38px "${fonts.heading}"`, '#ffffff');
  center(ctx, 'Saldo & penarikan sementara tidak tersedia.', w / 2, 395, `500 26px "${fonts.body}"`, '#9aa8bf');
  spinner(ctx, w / 2, 450, 18, t, colors.electric);
};
