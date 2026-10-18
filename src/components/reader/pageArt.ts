/**
 * Canvas artwork for the 3D reader: printed pages, endpapers, spine and page edges.
 * Text is laid out by hand (right-to-left, justified) so the pages read like the
 * printed book even though they end up as WebGL textures.
 */

import { FlipBlock, FlipPage, FlipVolume } from '../../data/flipbookPages';
import { toPersianDigits } from '../../utils/persian';

export const PAGE_PX_W = 1024;
export const PAGE_PX_H = 1456;
/** Design units → pixels (pages are designed at 400 × 569). */
const U = PAGE_PX_W / 400;

const FONT = 'Vazirmatn';
const PAPER = '#FBF7EF';
const INK = '#2B2520';
const BODY = '#3D3630';
const MUTED = '#9A8F84';
const COPPER = '#B87333';
const COPPER_DEEP = '#7A3E14';

export type Gutter = 'left' | 'right';

const fa = (v: number | string) => toPersianDigits(v);

/** Make sure every weight used on the pages is ready before drawing. */
export async function loadFonts(): Promise<void> {
  if (!document.fonts) return;
  await Promise.all(
    ['400', '600', '700', '800', '900'].map((w) => document.fonts.load(`${w} 24px ${FONT}`, 'اورانگوتان ۱۲۳').catch(() => [])),
  );
}

function canvas(w = PAGE_PX_W, h = PAGE_PX_H) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const ctx = c.getContext('2d')!;
  ctx.direction = 'rtl';
  ctx.textBaseline = 'alphabetic';
  return { c, ctx };
}

function font(ctx: CanvasRenderingContext2D, weight: number, sizeU: number) {
  ctx.font = `${weight} ${sizeU * U}px ${FONT}`;
}

/* ------------------------------------------------------------------
   Paper
   ------------------------------------------------------------------ */

function paper(ctx: CanvasRenderingContext2D, gutter: Gutter, tone = PAPER) {
  const { width: w, height: h } = ctx.canvas;
  ctx.fillStyle = tone;
  ctx.fillRect(0, 0, w, h);

  // Fibres: thousands of faint specks and a few longer strands.
  const img = ctx.getImageData(0, 0, w, h);
  const d = img.data;
  for (let i = 0; i < d.length; i += 4) {
    const n = (Math.random() - 0.5) * 7;
    d[i] += n;
    d[i + 1] += n;
    d[i + 2] += n * 0.8;
  }
  ctx.putImageData(img, 0, 0);
  ctx.strokeStyle = 'rgba(140,110,80,0.05)';
  ctx.lineWidth = 1;
  for (let i = 0; i < 120; i++) {
    const x = Math.random() * w;
    const y = Math.random() * h;
    const a = Math.random() * Math.PI;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + Math.cos(a) * 14, y + Math.sin(a) * 14);
    ctx.stroke();
  }

  // Gutter shadow near the spine and a soft edge falloff.
  const g = gutter === 'right' ? ctx.createLinearGradient(w, 0, w * 0.82, 0) : ctx.createLinearGradient(0, 0, w * 0.18, 0);
  g.addColorStop(0, 'rgba(70,45,20,0.26)');
  g.addColorStop(0.35, 'rgba(70,45,20,0.08)');
  g.addColorStop(1, 'rgba(70,45,20,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
  const e = ctx.createRadialGradient(w / 2, h / 2, h * 0.45, w / 2, h / 2, h * 0.78);
  e.addColorStop(0, 'rgba(120,90,60,0)');
  e.addColorStop(1, 'rgba(120,90,60,0.10)');
  ctx.fillStyle = e;
  ctx.fillRect(0, 0, w, h);
}

/* ------------------------------------------------------------------
   Text layout
   ------------------------------------------------------------------ */

function wrap(ctx: CanvasRenderingContext2D, text: string, maxW: number): string[][] {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[][] = [];
  let line: string[] = [];
  const space = ctx.measureText(' ').width;
  let lineW = 0;
  for (const word of words) {
    const ww = ctx.measureText(word).width;
    if (line.length && lineW + space + ww > maxW) {
      lines.push(line);
      line = [word];
      lineW = ww;
    } else {
      lineW += (line.length ? space : 0) + ww;
      line.push(word);
    }
  }
  if (line.length) lines.push(line);
  return lines;
}

/** Draws word by word from the right edge; every line but the last is justified. */
function drawLines(
  ctx: CanvasRenderingContext2D,
  lines: string[][],
  right: number,
  y: number,
  maxW: number,
  lh: number,
  opts: { justify?: boolean; center?: boolean } = {},
) {
  const space = ctx.measureText(' ').width;
  ctx.textAlign = 'right';
  lines.forEach((words, li) => {
    const widths = words.map((w) => ctx.measureText(w).width);
    const natural = widths.reduce((s, x) => s + x, 0) + space * (words.length - 1);
    const last = li === lines.length - 1;
    let gap = space;
    let x = right;
    if (opts.justify && !last && words.length > 1) gap = (maxW - widths.reduce((s, x2) => s + x2, 0)) / (words.length - 1);
    if (opts.center) x = right - (maxW - natural) / 2;
    words.forEach((w, i) => {
      ctx.fillText(w, x, y + li * lh);
      x -= widths[i] + gap;
    });
  });
  return lines.length * lh;
}

interface Box {
  right: number;
  width: number;
}

/** Measures (dry = true) or draws one block; returns its height in px. */
function block(ctx: CanvasRenderingContext2D, b: FlipBlock, box: Box, y: number, fs: number, dry: boolean): number {
  const lh = fs * U * 2;
  const pxFs = fs * U;
  switch (b.type) {
    case 'p': {
      font(ctx, 400, fs);
      ctx.fillStyle = BODY;
      const lines = wrap(ctx, b.text, box.width);
      if (!dry) drawLines(ctx, lines, box.right, y + pxFs * 1.35, box.width, lh, { justify: true });
      return lines.length * lh + pxFs * 0.55;
    }
    case 'lead': {
      font(ctx, 800, fs);
      const pad = pxFs * 0.8;
      const lines = wrap(ctx, b.text, box.width - pad * 2 - 3 * U);
      const h = lines.length * lh + pad * 0.9;
      const top = y + pxFs * 0.3;
      if (!dry) {
        ctx.fillStyle = 'rgba(184,115,51,0.09)';
        roundRect(ctx, box.right - box.width, top, box.width, h, 4 * U);
        ctx.fill();
        ctx.fillStyle = COPPER;
        ctx.fillRect(box.right - 3 * U, top, 3 * U, h);
        ctx.fillStyle = INK;
        drawLines(ctx, lines, box.right - pad - 3 * U, top + pad * 0.45 + pxFs * 1.35, box.width - pad * 2, lh);
      }
      return h + pxFs * 1.05;
    }
    case 'question': {
      font(ctx, 800, fs * 1.08);
      ctx.fillStyle = COPPER_DEEP;
      const lines = wrap(ctx, `❝ ${b.text} ❞`, box.width);
      if (!dry) drawLines(ctx, lines, box.right, y + pxFs * 1.7, box.width, lh, { center: true });
      return lines.length * lh + pxFs * 1.1;
    }
    case 'bullets': {
      font(ctx, 400, fs);
      let h = pxFs * 0.5;
      const indent = pxFs * 1.3;
      for (const item of b.items) {
        const lines = wrap(ctx, item, box.width - indent);
        if (!dry) {
          const cy = y + h + pxFs * 0.95;
          ctx.save();
          ctx.translate(box.right - pxFs * 0.35, cy);
          ctx.rotate(Math.PI / 4);
          ctx.fillStyle = COPPER;
          ctx.fillRect(-3 * U, -3 * U, 6 * U, 6 * U);
          ctx.restore();
          ctx.fillStyle = BODY;
          drawLines(ctx, lines, box.right - indent, y + h + pxFs * 1.35, box.width - indent, lh);
        }
        h += lines.length * lh * 0.92 + pxFs * 0.25;
      }
      return h;
    }
    case 'compare': {
      const gap = pxFs * 0.5;
      const colW = (box.width - gap) / 2;
      const rightCol = box.right;
      const leftCol = box.right - colW - gap;
      let h = pxFs * 0.6;
      // Header chips: instinct on the right (read first), conscious on the left.
      font(ctx, 800, fs * 0.92);
      const chipH = pxFs * 2;
      if (!dry) {
        ctx.fillStyle = 'rgba(180,60,40,0.10)';
        roundRect(ctx, rightCol - colW, y + h, colW, chipH, 6 * U);
        ctx.fill();
        ctx.fillStyle = 'rgba(20,140,120,0.12)';
        roundRect(ctx, leftCol - colW, y + h, colW, chipH, 6 * U);
        ctx.fill();
        ctx.textAlign = 'center';
        ctx.fillStyle = '#9E3B27';
        ctx.fillText(b.left, rightCol - colW / 2, y + h + chipH * 0.68);
        ctx.fillStyle = '#0F766E';
        ctx.fillText(b.right, leftCol - colW / 2, y + h + chipH * 0.68);
      }
      h += chipH + gap;
      const pad = pxFs * 0.65;
      const clh = pxFs * 1.85;
      for (const [a, c] of b.rows) {
        font(ctx, 400, fs);
        const la = wrap(ctx, a, colW - pad * 2);
        font(ctx, 600, fs);
        const lc = wrap(ctx, c, colW - pad * 2);
        const rowH = Math.max(la.length, lc.length) * clh + pad * 1.3;
        if (!dry) {
          ctx.save();
          ctx.setLineDash([4 * U, 3 * U]);
          ctx.strokeStyle = 'rgba(158,59,39,0.4)';
          ctx.lineWidth = 1.2 * U;
          roundRect(ctx, rightCol - colW, y + h, colW, rowH, 8 * U);
          ctx.stroke();
          ctx.restore();
          ctx.fillStyle = 'rgba(15,118,110,0.05)';
          roundRect(ctx, leftCol - colW, y + h, colW, rowH, 8 * U);
          ctx.fill();
          ctx.strokeStyle = 'rgba(15,118,110,0.4)';
          ctx.lineWidth = 1.2 * U;
          ctx.stroke();
          font(ctx, 400, fs);
          ctx.fillStyle = '#5B4A40';
          drawLines(ctx, la, rightCol - pad, y + h + pad * 0.65 + pxFs * 1.25, colW - pad * 2, clh);
          font(ctx, 600, fs);
          ctx.fillStyle = INK;
          drawLines(ctx, lc, leftCol - pad, y + h + pad * 0.65 + pxFs * 1.25, colW - pad * 2, clh);
        }
        h += rowH + gap;
      }
      return h;
    }
  }
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function runningHead(ctx: CanvasRenderingContext2D, text: string, gutter: Gutter) {
  const padX = 34 * U;
  font(ctx, 500, 8.5);
  ctx.fillStyle = MUTED;
  ctx.textAlign = 'right';
  ctx.fillText(text, PAGE_PX_W - padX, 40 * U);
  ctx.textAlign = 'left';
  ctx.fillText('• • •', padX, 40 * U);
  ctx.fillStyle = '#E3D9CB';
  ctx.fillRect(padX, 47 * U, PAGE_PX_W - padX * 2, 1 * U);
  void gutter;
}

function folio(ctx: CanvasRenderingContext2D, n: number) {
  font(ctx, 700, 10);
  ctx.fillStyle = '#8A7F74';
  ctx.textAlign = 'center';
  ctx.fillText(`— ${fa(n)} —`, PAGE_PX_W / 2, PAGE_PX_H - 26 * U);
}

/* ------------------------------------------------------------------
   Pages
   ------------------------------------------------------------------ */

export function drawTextPage(page: FlipPage, opts: { head: string; number: number; gutter: Gutter }): HTMLCanvasElement {
  const { c, ctx } = canvas();
  paper(ctx, opts.gutter);
  runningHead(ctx, opts.number % 2 ? opts.head : 'علی‌اصغر حکیمیان', opts.gutter);

  const box: Box = { right: PAGE_PX_W - 34 * U, width: PAGE_PX_W - 68 * U };
  let y = 64 * U;

  // Kicker with a copper rule, then the title.
  ctx.fillStyle = COPPER;
  ctx.fillRect(box.right - 18 * U, y + 4 * U, 18 * U, 2 * U);
  font(ctx, 800, 9.5);
  ctx.textAlign = 'right';
  ctx.fillText(page.kicker, box.right - 26 * U, y + 8 * U);
  y += 22 * U;
  font(ctx, 900, 18);
  ctx.fillStyle = INK;
  const titleLines = wrap(ctx, page.title, box.width);
  drawLines(ctx, titleLines, box.right, y + 18 * U, box.width, 29 * U);
  y += titleLines.length * 29 * U + 12 * U;

  // Shrink the body one step at a time until it fits above the folio.
  const bottom = PAGE_PX_H - 52 * U;
  let fs = 11.5;
  for (const size of [11.5, 11, 10.5, 10, 9.6]) {
    fs = size;
    let h = 0;
    for (const b of page.blocks) h += block(ctx, b, box, y + h, size, true);
    if (y + h <= bottom) break;
  }
  let yy = y;
  for (const b of page.blocks) yy += block(ctx, b, box, yy, fs, false);

  folio(ctx, opts.number);
  return c;
}

/** Half-title page: the first thing under the cover. */
export function drawTitlePage(vol: FlipVolume, subtitle: string, volumeLabel: string): HTMLCanvasElement {
  const { c, ctx } = canvas();
  paper(ctx, 'right');
  const cx = PAGE_PX_W / 2;
  ctx.textAlign = 'center';

  font(ctx, 900, 13);
  ctx.fillStyle = COPPER;
  ctx.fillText('+۳', cx, 150 * U);
  ctx.fillStyle = COPPER;
  ctx.fillRect(cx - 20 * U, 166 * U, 40 * U, 1.6 * U);

  font(ctx, 900, 30);
  ctx.fillStyle = INK;
  ctx.fillText('اورانگوتان +۳', cx, 222 * U);

  font(ctx, 700, 12);
  ctx.fillStyle = COPPER_DEEP;
  ctx.fillText(volumeLabel, cx, 252 * U);

  font(ctx, 400, 10.5);
  ctx.fillStyle = BODY;
  const lines = wrap(ctx, subtitle, 280 * U);
  drawLines(ctx, lines, cx + 140 * U, 284 * U, 280 * U, 22 * U, { center: true });

  // Ornament: 97 dim dots and the 3 that make the difference.
  for (let i = 0; i < 100; i++) {
    const a = (i / 100) * Math.PI * 2 - Math.PI / 2;
    const r = 34 * U;
    const plus = i >= 97;
    ctx.fillStyle = plus ? COPPER : 'rgba(120,100,80,0.28)';
    ctx.beginPath();
    ctx.arc(cx + Math.cos(a) * r, 380 * U + Math.sin(a) * r, (plus ? 2.4 : 1.2) * U, 0, Math.PI * 2);
    ctx.fill();
  }

  font(ctx, 800, 13);
  ctx.fillStyle = INK;
  ctx.fillText('علی‌اصغر حکیمیان', cx, 470 * U);
  font(ctx, 400, 9);
  ctx.fillStyle = MUTED;
  ctx.fillText('نویسنده و مشاور مدیریت', cx, 488 * U);
  font(ctx, 400, 8);
  ctx.fillText(`${fa(vol.pageCount)} صفحه`, cx, 540 * U);
  return c;
}

export function drawEndPage(vol: FlipVolume): HTMLCanvasElement {
  const { c, ctx } = canvas();
  paper(ctx, 'left', '#F6EFE3');
  const cx = PAGE_PX_W / 2;
  ctx.textAlign = 'center';
  font(ctx, 900, 44);
  ctx.fillStyle = COPPER;
  ctx.fillText('+۳', cx, 120 * U);
  ctx.fillRect(cx - 20 * U, 140 * U, 40 * U, 2 * U);
  font(ctx, 900, 19);
  ctx.fillStyle = INK;
  ctx.fillText('پایان پیش‌نمایش', cx, 180 * U);
  font(ctx, 400, 11.5);
  ctx.fillStyle = '#5B5048';
  const intro = `این فقط دو صفحه بود. ${fa(vol.pageCount)} صفحه دیگر، همراه با پرونده‌های واقعی، قانون‌های اجرایی و چک‌لیست‌ها در انتظار شماست.`;
  const lines = wrap(ctx, intro, 300 * U);
  drawLines(ctx, lines, cx + 150 * U, 212 * U, 300 * U, 23 * U, { center: true });

  let y = 212 * U + lines.length * 23 * U + 14 * U;
  vol.ahead.forEach((a, i) => {
    const x = 40 * U;
    const w = PAGE_PX_W - 80 * U;
    const h = 34 * U;
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    roundRect(ctx, x, y, w, h, 10 * U);
    ctx.fill();
    ctx.strokeStyle = '#E6DACA';
    ctx.lineWidth = 1 * U;
    ctx.stroke();
    ctx.fillStyle = 'rgba(184,115,51,0.14)';
    roundRect(ctx, x + w - 30 * U, y + 7 * U, 20 * U, 20 * U, 6 * U);
    ctx.fill();
    font(ctx, 900, 10);
    ctx.fillStyle = COPPER;
    ctx.textAlign = 'center';
    ctx.fillText(fa(i + 1), x + w - 20 * U, y + 21 * U);
    font(ctx, 700, 10.5);
    ctx.fillStyle = INK;
    ctx.textAlign = 'right';
    ctx.fillText(a, x + w - 40 * U, y + 22 * U);
    y += h + 8 * U;
  });
  font(ctx, 400, 8.5);
  ctx.fillStyle = MUTED;
  ctx.textAlign = 'center';
  ctx.fillText('صفحات این پیش‌نمایش از نسخه نمونه رسمی کتاب انتخاب شده‌اند.', cx, PAGE_PX_H - 30 * U);
  return c;
}

/** The page left showing when the preview ends: an invitation to keep reading. */
export function drawInvitePage(vol: FlipVolume, cover: HTMLImageElement | null, title: string, price: string): HTMLCanvasElement {
  const { c, ctx } = canvas();
  paper(ctx, 'right');
  const cx = PAGE_PX_W / 2;
  if (cover) {
    const w = 150 * U;
    const h = w * (cover.naturalHeight / cover.naturalWidth || 1.42);
    ctx.save();
    ctx.translate(cx, 92 * U + h / 2);
    ctx.rotate(-0.06);
    ctx.shadowColor = 'rgba(40,25,10,0.45)';
    ctx.shadowBlur = 30 * U;
    ctx.shadowOffsetY = 14 * U;
    ctx.drawImage(cover, -w / 2, -h / 2, w, h);
    ctx.restore();
  }
  ctx.textAlign = 'center';
  font(ctx, 900, 15);
  ctx.fillStyle = INK;
  const lines = wrap(ctx, title, 300 * U);
  drawLines(ctx, lines, cx + 150 * U, 440 * U, 300 * U, 24 * U, { center: true });
  font(ctx, 900, 17);
  ctx.fillStyle = COPPER_DEEP;
  ctx.fillText(price, cx, 440 * U + lines.length * 24 * U + 14 * U);
  font(ctx, 400, 9.5);
  ctx.fillStyle = MUTED;
  ctx.fillText(`${fa(vol.pageCount)} صفحه · ارسال رایگان · امضای نویسنده`, cx, 530 * U);
  return c;
}

/** Inside of the front board: dark copper endpaper with a bookplate. */
export function drawEndpaper(): HTMLCanvasElement {
  const { c, ctx } = canvas();
  const w = PAGE_PX_W;
  const h = PAGE_PX_H;
  const g = ctx.createLinearGradient(0, 0, w, h);
  g.addColorStop(0, '#1C1612');
  g.addColorStop(1, '#0E0B09');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);

  // Copper circuit traces, like the cover art.
  ctx.strokeStyle = 'rgba(217,137,74,0.16)';
  ctx.lineWidth = 2;
  for (let i = 0; i < 46; i++) {
    let x = Math.random() * w;
    let y = Math.random() * h;
    ctx.beginPath();
    ctx.moveTo(x, y);
    for (let s = 0; s < 4; s++) {
      if (Math.random() < 0.5) x += (Math.random() < 0.5 ? -1 : 1) * (60 + Math.random() * 140);
      else y += (Math.random() < 0.5 ? -1 : 1) * (60 + Math.random() * 140);
      ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.fillStyle = 'rgba(232,166,114,0.35)';
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fill();
  }

  // Bookplate.
  const bw = 230 * U;
  const bh = 150 * U;
  const bx = (w - bw) / 2;
  const by = (h - bh) / 2;
  ctx.fillStyle = '#F4ECDD';
  roundRect(ctx, bx, by, bw, bh, 10 * U);
  ctx.fill();
  ctx.strokeStyle = COPPER;
  ctx.lineWidth = 2 * U;
  roundRect(ctx, bx + 8 * U, by + 8 * U, bw - 16 * U, bh - 16 * U, 6 * U);
  ctx.stroke();
  ctx.textAlign = 'center';
  font(ctx, 900, 22);
  ctx.fillStyle = COPPER;
  ctx.fillText('+۳', w / 2, by + 50 * U);
  font(ctx, 700, 11);
  ctx.fillStyle = INK;
  ctx.fillText('از کتابخانه‌ی', w / 2, by + 82 * U);
  ctx.strokeStyle = 'rgba(43,37,32,0.35)';
  ctx.lineWidth = 1 * U;
  ctx.setLineDash([3 * U, 3 * U]);
  ctx.beginPath();
  ctx.moveTo(bx + 40 * U, by + 112 * U);
  ctx.lineTo(bx + bw - 40 * U, by + 112 * U);
  ctx.stroke();
  ctx.setLineDash([]);
  font(ctx, 400, 8);
  ctx.fillStyle = MUTED;
  ctx.fillText('www.orangutanplus3.com', w / 2, by + 132 * U);
  return c;
}

/** Back board: dark cloth with a blind-stamped mark. */
export function drawBackCover(): HTMLCanvasElement {
  const { c, ctx } = canvas(512, 728);
  ctx.fillStyle = '#121010';
  ctx.fillRect(0, 0, 512, 728);
  const img = ctx.getImageData(0, 0, 512, 728);
  for (let i = 0; i < img.data.length; i += 4) {
    const n = (Math.random() - 0.5) * 10;
    img.data[i] += n;
    img.data[i + 1] += n;
    img.data[i + 2] += n;
  }
  ctx.putImageData(img, 0, 0);
  ctx.textAlign = 'center';
  ctx.font = `900 64px ${FONT}`;
  ctx.fillStyle = 'rgba(217,137,74,0.55)';
  ctx.fillText('+۳', 256, 380);
  ctx.font = `500 18px ${FONT}`;
  ctx.fillStyle = 'rgba(250,247,242,0.35)';
  ctx.fillText('www.orangutanplus3.com', 256, 660);
  return c;
}

/** Spine artwork, drawn upright (text runs top to bottom when mapped). */
export function drawSpine(volumeLabel: string): HTMLCanvasElement {
  const { c, ctx } = canvas(160, 1456);
  const g = ctx.createLinearGradient(0, 0, 160, 0);
  g.addColorStop(0, '#0B0A09');
  g.addColorStop(0.5, '#221A14');
  g.addColorStop(1, '#0B0A09');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 160, 1456);
  ctx.fillStyle = 'rgba(217,137,74,0.8)';
  ctx.fillRect(0, 90, 160, 4);
  ctx.fillRect(0, 1362, 160, 4);
  ctx.save();
  ctx.translate(80, 728);
  ctx.rotate(Math.PI / 2);
  ctx.textAlign = 'center';
  ctx.font = `900 54px ${FONT}`;
  ctx.fillStyle = '#FAF7F2';
  ctx.fillText('اورانگوتان +۳', -170, 18);
  ctx.font = `700 34px ${FONT}`;
  ctx.fillStyle = '#E8A672';
  ctx.fillText(volumeLabel, 250, 14);
  ctx.restore();
  return c;
}

/** Page-block edge: hundreds of hairline sheets. */
export function drawPageEdge(vertical: boolean): HTMLCanvasElement {
  const w = vertical ? 64 : 1024;
  const h = vertical ? 1024 : 64;
  const { c, ctx } = canvas(w, h);
  ctx.fillStyle = '#F1E9DC';
  ctx.fillRect(0, 0, w, h);
  const n = 220;
  for (let i = 0; i < n; i++) {
    const t = i / n;
    ctx.fillStyle = `rgba(150,125,95,${0.12 + Math.random() * 0.22})`;
    if (vertical) ctx.fillRect(t * w, 0, 1, h);
    else ctx.fillRect(0, t * h, w, 1);
  }
  const g = vertical ? ctx.createLinearGradient(0, 0, w, 0) : ctx.createLinearGradient(0, 0, 0, h);
  g.addColorStop(0, 'rgba(60,40,20,0.25)');
  g.addColorStop(0.5, 'rgba(60,40,20,0)');
  g.addColorStop(1, 'rgba(60,40,20,0.25)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
  return c;
}
