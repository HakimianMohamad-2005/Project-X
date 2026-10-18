import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import * as THREE from 'three';
import { ChevronLeft, ChevronRight, FileText, Hand, Minus, Plus, ShoppingBag, Volume2, VolumeX, X } from 'lucide-react';
import { FLIP_VOLUMES, FlipVolume } from '../../data/flipbookPages';
import { BOOKS_DATA } from '../../data/bookData';
import { useLocaleFormat } from '../ui/format';
import { toPersianDigits } from '../../utils/persian';
import { BookScene, BookTextures } from './BookScene';
import {
  drawBackCover,
  drawEndPage,
  drawEndpaper,
  drawInvitePage,
  drawPageEdge,
  drawSpine,
  drawTextPage,
  drawTitlePage,
  loadFonts,
} from './pageArt';
import { playRustle, playThump } from './sounds';

export type VolumeId = 'vol-1' | 'vol-2';

interface BookReaderProps {
  volume: VolumeId;
  /** The hero book the reader flies out of (and back into). */
  origin: HTMLElement | null;
  onClose: () => void;
  onAddToCart: (id: VolumeId) => void;
  onOpenSamplePdf: () => void;
  onVolumeChange: (id: VolumeId) => void;
  /** The 3D book is on screen: the page can hide its DOM book. */
  onReady?: () => void;
}

const SOUND_KEY = 'og3-flip-sound';
const HINT_KEY = 'og3-reader-hinted';
const THICKNESS: Record<VolumeId, number> = { 'vol-1': 0.1, 'vol-2': 0.125 };

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.decoding = 'async';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

async function buildTextures(vol: FlipVolume, renderer: THREE.WebGLRenderer, labels: { volume: string; subtitle: string; title: string; price: string }) {
  await loadFonts();
  const cover = await loadImage(vol.cover);
  const aniso = renderer.capabilities.getMaxAnisotropy();
  const wrap = (src: HTMLCanvasElement | HTMLImageElement) => {
    const t = src instanceof HTMLImageElement ? new THREE.Texture(src) : new THREE.CanvasTexture(src);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = aniso;
    t.needsUpdate = true;
    return t;
  };
  const tex: BookTextures = {
    cover: wrap(cover),
    endpaper: wrap(drawEndpaper()),
    back: wrap(drawBackCover()),
    spine: wrap(drawSpine(labels.volume)),
    edgeV: wrap(drawPageEdge(true)),
    edgeH: wrap(drawPageEdge(false)),
    leaves: [
      [wrap(drawTitlePage(vol, labels.subtitle, labels.volume)), wrap(drawTextPage(vol.pages[0], { head: vol.runningHead, number: 1, gutter: 'left' }))],
      [wrap(drawTextPage(vol.pages[1], { head: vol.runningHead, number: 2, gutter: 'right' })), wrap(drawEndPage(vol))],
    ],
    last: wrap(drawInvitePage(vol, cover, labels.title, labels.price)),
  };
  return tex;
}


export const BookReader: React.FC<BookReaderProps> = ({ volume, origin, onClose, onAddToCart, onOpenSamplePdf, onVolumeChange, onReady }) => {
  const { t } = useTranslation();
  const { price } = useLocaleFormat();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<BookScene | null>(null);
  const [ready, setReady] = useState(false);
  const [landed, setLanded] = useState(false);
  const [closing, setClosing] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [state, setState] = useState(0); // 0 closed · 1 title · 2 pages 1–2 · 3 end
  const [focus, setFocus] = useState(0); // phones: −1 left page, +1 right page
  const [hint, setHint] = useState(() => {
    try {
      return !sessionStorage.getItem(HINT_KEY);
    } catch {
      return true;
    }
  });
  const [sound, setSound] = useState(() => {
    try {
      return localStorage.getItem(SOUND_KEY) !== 'off';
    } catch {
      return true;
    }
  });
  const soundRef = useRef(sound);
  soundRef.current = sound;
  const [portrait, setPortrait] = useState(() => window.innerWidth / window.innerHeight < 0.9);
  const swapping = useRef(false);

  const vol = FLIP_VOLUMES.find((v) => v.id === volume) || FLIP_VOLUMES[0];
  const book = BOOKS_DATA.find((b) => b.id === volume);
  const key = volume === 'vol-1' ? 'vol1' : 'vol2';
  const total = 3;

  /* ---------- Scene lifecycle ---------- */

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let disposed = false;
    let scene: BookScene | null = null;
    const isSwap = swapping.current;
    setReady(false);
    setLanded(false);
    setState(0);
    setFocus(0);

    // A throwaway renderer just to read GPU capabilities would cost a context; use defaults.
    const probe = { capabilities: { getMaxAnisotropy: () => 8 } } as unknown as THREE.WebGLRenderer;
    buildTextures(vol, probe, {
      volume: t(`ui.flip.${key}`),
      subtitle: book?.subtitle || '',
      title: t(`books.${key}.title`),
      price: book ? price(book.price) : '',
    })
      .then((tex) => {
        if (disposed) return;
        scene = new BookScene(canvas, tex, { thickness: THICKNESS[volume] });
        sceneRef.current = scene;
        scene.onLand = (kind) => {
          if (kind === 'cover' && soundRef.current) playThump();
        };
        scene.resize(window.innerWidth, window.innerHeight);
        const rect = origin?.getBoundingClientRect();
        const land = () => {
          if (disposed) return;
          setLanded(true);
          swapping.current = false;
        };
        if (!isSwap && rect && rect.width > 0) {
          scene.flyFrom({ x: rect.left, y: rect.top, w: rect.width, h: rect.height }, { w: window.innerWidth, h: window.innerHeight }, land);
        } else {
          scene.rise(land);
        }
        scene.start();
        setReady(true);
        requestAnimationFrame(() => onReady?.());
      })
      .catch(() => onClose());

    return () => {
      disposed = true;
      scene?.dispose();
      sceneRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [volume]);

  useEffect(() => {
    const onResize = () => {
      sceneRef.current?.resize(window.innerWidth, window.innerHeight);
      setPortrait(window.innerWidth / window.innerHeight < 0.9);
    };
    window.addEventListener('resize', onResize);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('resize', onResize);
      document.body.style.overflow = prev;
    };
  }, []);

  // Phones read one page at a time: the camera glides between the two pages.
  useEffect(() => {
    sceneRef.current?.setFocus(portrait && state > 0 ? focus || 1 : 0);
  }, [portrait, state, focus]);

  /* ---------- Turning ---------- */

  const dismissHint = () => {
    if (!hint) return;
    setHint(false);
    try {
      sessionStorage.setItem(HINT_KEY, '1');
    } catch {}
  };

  const turnTo = useCallback(
    (dir: 1 | -1, opts: { from?: number; grabY?: number } = {}) => {
      const scene = sceneRef.current;
      if (!scene || !landed || closing) return false;
      const index = dir === 1 ? state : state - 1;
      if (index < 0 || index >= total) return false;
      scene.turn(index, dir === 1 ? 1 : 0, opts);
      if (soundRef.current && index > 0) playRustle();
      setState((s) => s + dir);
      setFocus(dir === 1 ? 1 : -1);
      dismissHint();
      return true;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state, landed, closing],
  );

  /** Next/previous in reading order; on phones the two pages of a spread come first. */
  const step = useCallback(
    (dir: 1 | -1) => {
      if (portrait && state > 0) {
        if (dir === 1 && focus !== -1 && state < total) {
          setFocus(-1);
          return;
        }
        if (dir === -1 && focus === -1) {
          setFocus(1);
          return;
        }
      }
      turnTo(dir);
    },
    [portrait, state, focus, turnTo],
  );

  /* ---------- Pointer: drag a page, click to turn, hover to lift the corner ---------- */

  const drag = useRef<{ id: number; x0: number; y0: number; t0: number; index: number; dir: 1 | -1; grabY: number; moved: boolean; span: number } | null>(null);

  const layoutAt = () => sceneRef.current?.screenLayout(window.innerWidth, window.innerHeight);

  const onPointerDown = (e: React.PointerEvent) => {
    const scene = sceneRef.current;
    const L = layoutAt();
    if (!scene || !L || !landed || closing) return;
    const dir: 1 | -1 = e.clientX < L.spine ? 1 : -1;
    const index = dir === 1 ? state : state - 1;
    if (index < 0 || index >= total) return;
    const grabY = Math.max(-1, Math.min(1, 1 - (2 * (e.clientY - L.top)) / Math.max(1, L.bottom - L.top)));
    const pageW = Math.max(60, Math.abs(L.spine - L.left));
    drag.current = { id: e.pointerId, x0: e.clientX, y0: e.clientY, t0: performance.now(), index, dir, grabY, moved: false, span: pageW * 1.8 };
    try {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    } catch {}
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const scene = sceneRef.current;
    if (!scene) return;
    const d = drag.current;
    if (!d) {
      // Hover: parallax, and lift the corner of the next page.
      if (e.pointerType === 'mouse') {
        scene.setParallax(e.clientX / window.innerWidth - 0.5, e.clientY / window.innerHeight - 0.5);
        const L = layoutAt();
        if (L && landed && state < total) {
          const pageW = L.spine - L.left;
          const nearEdge = e.clientX < L.spine - pageW * 0.55 && e.clientX > L.left - 30 && e.clientY > L.top && e.clientY < L.bottom;
          const grabY = 1 - (2 * (e.clientY - L.top)) / Math.max(1, L.bottom - L.top);
          scene.peel(nearEdge ? state : null, grabY);
        }
      }
      return;
    }
    if (d.id !== e.pointerId) return;
    const dx = e.clientX - d.x0;
    if (!d.moved && Math.hypot(dx, e.clientY - d.y0) < 6) return;
    d.moved = true;
    dismissHint();
    const p = (d.dir === 1 ? dx : -dx) / d.span;
    scene.drag(d.index, d.dir === 1 ? p : 1 - p, d.grabY, d.dir);
  };

  const onPointerUp = (e: React.PointerEvent) => {
    const scene = sceneRef.current;
    const d = drag.current;
    if (!scene || !d || d.id !== e.pointerId) return;
    drag.current = null;
    if (!d.moved) {
      if (portrait) step(d.dir);
      else turnTo(d.dir, { grabY: d.grabY });
      return;
    }
    const tNow = scene.getT(d.index);
    const v = (e.clientX - d.x0) / Math.max(1, performance.now() - d.t0);
    const commit = d.dir === 1 ? tNow > 0.33 || v > 0.5 : tNow < 0.67 || v < -0.5;
    if (commit) turnTo(d.dir, { from: tNow, grabY: d.grabY });
    else scene.turn(d.index, d.dir === 1 ? 0 : 1, { from: tNow });
  };

  const onPointerLeave = () => {
    sceneRef.current?.peel(null);
    sceneRef.current?.setParallax(0, 0);
  };

  const onWheel = (e: React.WheelEvent) => {
    const scene = sceneRef.current;
    if (!scene) return;
    scene.setZoom(scene.zoomLevel * (e.deltaY > 0 ? 0.92 : 1.08));
  };

  /* ---------- Closing (turn everything back, then fly home) ---------- */

  const close = useCallback(
    (after?: () => void) => {
      const scene = sceneRef.current;
      if (closing) return;
      setClosing(true);
      dismissHint();
      const finish = () => {
        onClose();
        after?.();
      };
      if (!scene) return finish();
      // Close leaves from the top of the right-hand stack down, then the cover.
      const delays: number[] = [];
      for (let i = state - 1; i >= 0; i--) delays.push(i);
      delays.forEach((index, k) => window.setTimeout(() => scene.turn(index, 0), k * 170));
      const wait = state > 0 ? delays.length * 170 + 900 : 0;
      window.setTimeout(() => {
        setLeaving(true);
        const rect = origin?.getBoundingClientRect();
        if (rect && rect.width > 0 && rect.bottom > 0 && rect.top < window.innerHeight) {
          scene.setOrigin({ x: rect.left, y: rect.top, w: rect.width, h: rect.height }, { w: window.innerWidth, h: window.innerHeight });
          scene.flyBack(finish);
        } else {
          // The page scrolled away from the hero: let the book sink out of view instead.
          scene.setOriginBelow();
          scene.flyBack(finish);
        }
      }, wait);
    },
    [closing, state, origin, onClose],
  );

  const addToCart = () => close(() => onAddToCart(volume));

  const switchVolume = (id: VolumeId) => {
    if (id === volume || closing || !landed) return;
    swapping.current = true;
    onVolumeChange(id);
  };

  /* ---------- Keyboard ---------- */

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowLeft') step(1);
      else if (e.key === 'ArrowRight') step(-1);
      else if (e.key === '+' || e.key === '=') sceneRef.current?.setZoom((sceneRef.current?.zoomLevel || 1) * 1.12);
      else if (e.key === '-') sceneRef.current?.setZoom((sceneRef.current?.zoomLevel || 1) / 1.12);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [close, step]);

  const toggleSound = () =>
    setSound((s) => {
      try {
        localStorage.setItem(SOUND_KEY, s ? 'off' : 'on');
      } catch {}
      return !s;
    });

  const label = useMemo(() => {
    const fa = (n: number) => toPersianDigits(n);
    if (state === 0) return t('ui.flip.cover');
    if (state === 1) return t('ui.reader.titlePage');
    if (state === 2) {
      if (portrait) return t('ui.flip.pageN', { n: fa(focus === -1 ? 2 : 1) });
      return t('ui.flip.pages12', { a: fa(1), b: fa(2) });
    }
    return t('ui.flip.end');
  }, [state, portrait, focus, t]);

  return createPortal(
    <div
      className="fixed inset-0 z-[95] select-none overflow-hidden text-[#FAF7F2]"
      role="dialog"
      aria-modal="true"
      aria-label={t(`books.${key}.title`)}
    >
      {/* Room: dark backdrop, warm lamp pool, vignette and grain. Only the room fades,
          so the book itself stays solid while it flies in and out. */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: leaving ? 0 : 1 }}
        transition={{ duration: leaving ? 0.8 : 0.7, ease: [0.4, 0, 0.2, 1] }}
      >
        <div className="absolute inset-0 bg-[#0B0A09]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_42%_38%,rgba(217,137,74,0.22),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_55%,transparent_45%,rgba(0,0,0,0.75))]" />
        <div className="og-grain pointer-events-none absolute inset-0 opacity-40" />
      </motion.div>

      {/* Keyed by volume: disposing a scene loses its WebGL context for good, so each
          volume gets a fresh canvas instead of reusing a dead one. */}
      <canvas
        key={volume}
        ref={canvasRef}
        className={`absolute inset-0 h-full w-full touch-none ${landed ? 'cursor-grab active:cursor-grabbing' : ''}`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onPointerLeave={onPointerLeave}
        onWheel={onWheel}
      />

      {!ready && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="h-10 w-10 animate-spin rounded-full border-2 border-[#E8A672]/30 border-t-[#E8A672]" aria-label={t('ui.reader.loading')} />
        </div>
      )}

      {/* Top bar */}
      <AnimatePresence>
        {landed && !closing && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.45 }}
            className="absolute inset-x-0 top-0 flex items-start justify-between gap-3 p-4 sm:p-6"
            dir="rtl"
          >
            <div className="flex items-center gap-1.5 rounded-2xl border border-white/10 bg-black/40 p-1.5 backdrop-blur-md">
              {FLIP_VOLUMES.map((v) => {
                const on = v.id === volume;
                return (
                  <button
                    key={v.id}
                    onClick={() => switchVolume(v.id)}
                    className={`relative flex items-center gap-2 rounded-xl py-1 pe-3 ps-1 text-xs font-bold transition-colors ${on ? 'text-white' : 'text-white/60 hover:text-white'}`}
                    aria-pressed={on}
                  >
                    {on && <motion.span layoutId="reader-vol" className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#D9894A] to-[#8B4513]" />}
                    <img src={v.cover} alt="" className="relative h-9 w-6 rounded-[3px] object-cover" draggable={false} />
                    <span className="relative">{t(v.id === 'vol-1' ? 'ui.flip.vol1' : 'ui.flip.vol2')}</span>
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => close()}
              aria-label={t('ui.reader.close')}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-black/40 text-white/80 backdrop-blur-md transition hover:border-[#E8A672]/60 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* First-time hint */}
      <AnimatePresence>
        {landed && hint && !closing && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.4 }}
            className="pointer-events-none absolute inset-x-0 bottom-32 flex justify-center sm:bottom-36"
          >
            <div className="flex items-center gap-2.5 rounded-full border border-white/10 bg-black/55 px-4 py-2 text-xs font-bold text-white/85 backdrop-blur-md">
              <motion.span animate={{ x: [0, 16, 0], rotate: [0, -8, 0] }} transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}>
                <Hand className="h-4 w-4 text-[#E8A672]" />
              </motion.span>
              {state === 0 ? t('ui.reader.openHint') : t('ui.flip.hint')}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom toolbar */}
      <AnimatePresence>
        {landed && !closing && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-x-0 bottom-0 flex justify-center p-3 sm:p-6"
            dir="rtl"
          >
            <div className="flex w-full max-w-3xl flex-wrap items-center justify-between gap-3 rounded-[1.6rem] border border-white/10 bg-black/45 px-3 py-2.5 backdrop-blur-xl sm:flex-nowrap sm:px-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => step(-1)}
                  disabled={state === 0}
                  aria-label={t('ui.flip.prev')}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white/80 transition hover:border-[#E8A672]/60 hover:text-white disabled:opacity-30"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
                <div className="flex min-w-[118px] flex-col items-center gap-1.5">
                  <span className="text-xs font-black">{label}</span>
                  <div className="flex gap-1.5" dir="rtl">
                    {Array.from({ length: total + 1 }, (_, i) => (
                      <motion.span
                        key={i}
                        className="h-1.5 rounded-full"
                        animate={{ width: i === state ? 20 : 6, backgroundColor: i <= state ? '#D9894A' : 'rgba(255,255,255,0.2)' }}
                      />
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => step(1)}
                  disabled={state >= total && !(portrait && focus !== -1)}
                  aria-label={t('ui.flip.next')}
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-[#D9894A] via-[#B87333] to-[#7A3E14] text-white shadow-[0_10px_30px_-12px_rgba(217,137,74,0.8)] transition hover:brightness-110 disabled:opacity-30"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
              </div>

              <div className="flex items-center gap-1">
                <button onClick={toggleSound} aria-label={sound ? t('ui.flip.soundOff') : t('ui.flip.soundOn')} className="flex h-9 w-9 items-center justify-center rounded-full text-white/60 transition hover:bg-white/10 hover:text-white">
                  {sound ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                </button>
                <button onClick={() => sceneRef.current?.setZoom((sceneRef.current?.zoomLevel || 1) / 1.15)} aria-label={t('ui.reader.zoomOut')} className="hidden h-9 w-9 items-center justify-center rounded-full text-white/60 transition hover:bg-white/10 hover:text-white sm:flex">
                  <Minus className="h-4 w-4" />
                </button>
                <button onClick={() => sceneRef.current?.setZoom((sceneRef.current?.zoomLevel || 1) * 1.15)} aria-label={t('ui.reader.zoomIn')} className="hidden h-9 w-9 items-center justify-center rounded-full text-white/60 transition hover:bg-white/10 hover:text-white sm:flex">
                  <Plus className="h-4 w-4" />
                </button>
                <button onClick={() => close(onOpenSamplePdf)} aria-label={t('ui.flip.sample')} title={t('ui.flip.sample')} className="flex h-9 w-9 items-center justify-center rounded-full text-white/60 transition hover:bg-white/10 hover:text-white">
                  <FileText className="h-4 w-4" />
                </button>
              </div>

              <motion.button
                onClick={addToCart}
                whileTap={{ scale: 0.96 }}
                animate={state === total ? { boxShadow: ['0 0 0 0 rgba(217,137,74,0.6)', '0 0 0 14px rgba(217,137,74,0)'] } : {}}
                transition={state === total ? { duration: 1.6, repeat: Infinity } : {}}
                className="flex h-11 flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-[#D9894A] via-[#B87333] to-[#7A3E14] px-4 text-sm font-black text-white sm:flex-none"
              >
                <ShoppingBag className="h-4 w-4" />
                <span>{t('ui.pricing.add')}</span>
                {book && <span className="rounded-lg bg-black/25 px-2 py-0.5 text-[11px]">{price(book.price)}</span>}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>,
    document.body,
  );
};

export default BookReader;
