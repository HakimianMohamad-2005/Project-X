import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import * as THREE from 'three';
import {
  ChevronLeft,
  ChevronRight,
  FileText,
  Hand,
  Minus,
  Move3d,
  Plus,
  ShoppingBag,
  Smartphone,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';
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
const ROTATE_KEY = 'og3-reader-rotate-hint';
const THICKNESS: Record<VolumeId, number> = { 'vol-1': 0.1, 'vol-2': 0.125 };
const READ_ZOOM = 1.75;

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.decoding = 'async';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

async function buildTextures(vol: FlipVolume, labels: { volume: string; subtitle: string; title: string; price: string }) {
  await loadFonts();
  const cover = await loadImage(vol.cover);
  const wrap = (src: HTMLCanvasElement | HTMLImageElement) => {
    const t = src instanceof HTMLImageElement ? new THREE.Texture(src) : new THREE.CanvasTexture(src);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 8; // three clamps this to what the GPU supports
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

/** A tiny tap on the hand, like the paper giving way. Silently ignored where unsupported. */
function haptic(pattern: number | number[]) {
  try {
    navigator.vibrate?.(pattern);
  } catch {}
}

const isTouchDevice = () => typeof window !== 'undefined' && window.matchMedia?.('(pointer: coarse)').matches;

type OrientationCtor = typeof DeviceOrientationEvent & { requestPermission?: () => Promise<'granted' | 'denied'> };

export const BookReader: React.FC<BookReaderProps> = ({ volume, origin, onClose, onAddToCart, onOpenSamplePdf, onVolumeChange, onReady }) => {
  const { t } = useTranslation();
  const { price } = useLocaleFormat();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<BookScene | null>(null);
  const [ready, setReady] = useState(false);
  const [landed, setLanded] = useState(false);
  const [closing, setClosing] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [state, setState] = useState(0); // 0 closed · 1 title · 2 pages 1–2 · 3 end
  const [focus, setFocus] = useState(0); // one-page mode: −1 left page, +1 right page
  const [zoomed, setZoomed] = useState(false);
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
  const touch = useMemo(isTouchDevice, []);
  const [viewport, setViewport] = useState(() => ({ w: window.innerWidth, h: window.innerHeight }));
  const portrait = viewport.w / viewport.h < 0.9;
  const compact = viewport.w < 640 || viewport.h < 520;
  const short = viewport.h < 500;
  const [rotateHint, setRotateHint] = useState(false);
  const [motionMode, setMotionMode] = useState<'off' | 'on' | 'ask'>('off');
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
    setZoomed(false);

    buildTextures(vol, {
      volume: t(`ui.flip.${key}`),
      subtitle: book?.subtitle || '',
      title: t(`books.${key}.title`),
      price: book ? price(book.price) : '',
    })
      .then((tex) => {
        if (disposed) return;
        scene = new BookScene(canvas, tex, { thickness: THICKNESS[volume], lite: touch || window.innerWidth < 768 });
        sceneRef.current = scene;
        scene.onLand = (kind) => {
          if (kind === 'cover') {
            if (soundRef.current) playThump();
            haptic(14);
          }
        };
        measureInsets();
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

  /** Frame the book between the real top and bottom bars (they differ per device). */
  const measureInsets = useCallback(() => {
    const top = topRef.current?.getBoundingClientRect();
    const bottom = bottomRef.current?.getBoundingClientRect();
    // Short landscape screens: the top controls sit in the corners, so the book may rise between them.
    const short = window.innerHeight < 500 && window.innerWidth / window.innerHeight > 1.3;
    const t0 = short ? 10 : top ? top.bottom + 8 : 84;
    const b0 = bottom ? window.innerHeight - bottom.top + 8 : 110;
    sceneRef.current?.setInsets(t0, b0);
  }, []);

  useLayoutEffect(() => {
    const ro = new ResizeObserver(measureInsets);
    if (topRef.current) ro.observe(topRef.current);
    if (bottomRef.current) ro.observe(bottomRef.current);
    return () => ro.disconnect();
  }, [measureInsets, landed]);

  useEffect(() => {
    const onResize = () => {
      setViewport({ w: window.innerWidth, h: window.innerHeight });
      measureInsets();
      sceneRef.current?.resize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);
    // Pinch-zoom of the page itself would fight the book's own zoom.
    const prevOverflow = document.body.style.overflow;
    const prevTouch = document.body.style.touchAction;
    document.body.style.overflow = 'hidden';
    document.body.style.touchAction = 'none';
    return () => {
      window.removeEventListener('resize', onResize);
      document.body.style.overflow = prevOverflow;
      document.body.style.touchAction = prevTouch;
    };
  }, [measureInsets]);

  // One page at a time on tall screens: the camera glides between the two pages.
  useEffect(() => {
    sceneRef.current?.setFocus(portrait && state > 0 ? focus || 1 : 0);
  }, [portrait, state, focus]);

  // Suggest turning the phone sideways once, when the book is first opened in portrait.
  useEffect(() => {
    if (!touch || !portrait || state !== 1) return;
    try {
      if (sessionStorage.getItem(ROTATE_KEY)) return;
      sessionStorage.setItem(ROTATE_KEY, '1');
    } catch {}
    setRotateHint(true);
    const id = window.setTimeout(() => setRotateHint(false), 4200);
    return () => window.clearTimeout(id);
  }, [touch, portrait, state]);

  /* ---------- Tilt the phone to look around the book ---------- */

  useEffect(() => {
    if (!touch || typeof DeviceOrientationEvent === 'undefined') return;
    const Ctor = DeviceOrientationEvent as OrientationCtor;
    setMotionMode(typeof Ctor.requestPermission === 'function' ? 'ask' : 'on');
  }, [touch]);

  useEffect(() => {
    if (motionMode !== 'on') return;
    let base: { b: number; g: number } | null = null;
    const onOrient = (e: DeviceOrientationEvent) => {
      if (e.beta === null || e.gamma === null) return;
      if (!base) base = { b: e.beta, g: e.gamma };
      // Ease the neutral pose towards however the reader is holding the phone.
      base.b += (e.beta - base.b) * 0.01;
      base.g += (e.gamma - base.g) * 0.01;
      const x = Math.max(-1, Math.min(1, (e.gamma - base.g) / 18));
      const y = Math.max(-1, Math.min(1, (e.beta - base.b) / 18));
      sceneRef.current?.setParallax(x * 0.9, y * 0.9);
    };
    window.addEventListener('deviceorientation', onOrient);
    return () => window.removeEventListener('deviceorientation', onOrient);
  }, [motionMode]);

  const enableMotion = async () => {
    const Ctor = DeviceOrientationEvent as OrientationCtor;
    try {
      const res = await Ctor.requestPermission?.();
      setMotionMode(res === 'granted' ? 'on' : 'off');
    } catch {
      setMotionMode('off');
    }
  };

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
      if (index > 0) haptic(8);
      setState((s) => s + dir);
      // Reading order on one-page screens: after turning forward you land on the right-hand page.
      setFocus(dir === 1 ? 1 : -1);
      dismissHint();
      return true;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state, landed, closing],
  );

  /** Next/previous in reading order; in one-page mode the two pages of a spread come first. */
  const step = useCallback(
    (dir: 1 | -1) => {
      if (portrait && state > 0) {
        if (dir === 1 && focus !== -1) {
          setFocus(-1);
          haptic(4);
          return;
        }
        if (dir === -1 && focus === -1) {
          setFocus(1);
          haptic(4);
          return;
        }
      }
      turnTo(dir);
    },
    [portrait, state, focus, turnTo],
  );

  const setZoom = (z: number) => {
    const scene = sceneRef.current;
    if (!scene) return;
    scene.setZoom(z);
    setZoomed(scene.zoomLevel > 1.05);
  };

  /* ---------- Pointer & touch gestures ----------
     · drag a page (live paper curl), or tap a side to turn
     · one-page mode: swipe right = forward (RTL), swipe left = back
     · two fingers: pinch to zoom · double tap: zoom in to read / back out
     · zoomed in: one finger pans around the page                              */

  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const pinch = useRef<{ d0: number; z0: number } | null>(null);
  const gesture = useRef<{
    id: number;
    x0: number;
    y0: number;
    lx: number;
    ly: number;
    t0: number;
    mode: 'pending' | 'turn' | 'pagepan' | 'pan';
    index: number;
    dir: 1 | -1;
    grabY: number;
    span: number;
  } | null>(null);
  const lastTap = useRef<{ t: number; x: number; y: number } | null>(null);
  const tapTimer = useRef<number | null>(null);

  const layoutAt = () => sceneRef.current?.screenLayout(window.innerWidth, window.innerHeight);

  const cancelTurnGesture = () => {
    const g = gesture.current;
    const scene = sceneRef.current;
    if (g && g.mode === 'turn' && scene) scene.turn(g.index, g.dir === 1 ? 0 : 1, { from: scene.getT(g.index) });
    scene?.setParallax(0, 0);
    gesture.current = null;
  };

  const onPointerDown = (e: React.PointerEvent) => {
    const scene = sceneRef.current;
    if (!scene || !landed || closing) return;
    // A primary pointer starts a fresh gesture: forget any touch whose "up" never arrived.
    if (e.isPrimary) {
      pointers.current.clear();
      pinch.current = null;
    }
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    try {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    } catch {}
    if (pointers.current.size === 2 && !pinch.current) {
      cancelTurnGesture();
      const [a, b] = [...pointers.current.values()];
      pinch.current = { d0: Math.hypot(a.x - b.x, a.y - b.y), z0: scene.zoomLevel };
      return;
    }
    if (pointers.current.size > 2) return;
    const L = layoutAt();
    const grabY = L ? Math.max(-1, Math.min(1, 1 - (2 * (e.clientY - L.top)) / Math.max(1, L.bottom - L.top))) : -0.6;
    const pageW = L ? Math.max(60, Math.abs(L.spine - L.left)) : 200;
    gesture.current = {
      id: e.pointerId,
      x0: e.clientX,
      y0: e.clientY,
      lx: e.clientX,
      ly: e.clientY,
      t0: performance.now(),
      mode: 'pending',
      index: -1,
      dir: 1,
      grabY,
      span: portrait ? pageW * 1.05 : pageW * 1.8,
    };
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const scene = sceneRef.current;
    if (!scene) return;
    if (pointers.current.has(e.pointerId)) pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pinch.current && pointers.current.size >= 2) {
      const [a, b] = [...pointers.current.values()];
      setZoom(pinch.current.z0 * (Math.hypot(a.x - b.x, a.y - b.y) / Math.max(1, pinch.current.d0)));
      return;
    }

    const g = gesture.current;
    if (!g) {
      // Mouse hover: parallax, and lift the corner of the next page.
      if (e.pointerType === 'mouse' && landed) {
        scene.setParallax(e.clientX / window.innerWidth - 0.5, e.clientY / window.innerHeight - 0.5);
        const L = layoutAt();
        if (L && state < total && !portrait) {
          const pageW = L.spine - L.left;
          const nearEdge = e.clientX < L.spine - pageW * 0.55 && e.clientX > L.left - 30 && e.clientY > L.top && e.clientY < L.bottom;
          const grabY = 1 - (2 * (e.clientY - L.top)) / Math.max(1, L.bottom - L.top);
          scene.peel(nearEdge ? state : null, grabY);
        }
      }
      return;
    }
    if (g.id !== e.pointerId) return;
    const dx = e.clientX - g.x0;
    const dy = e.clientY - g.y0;

    if (g.mode === 'pending') {
      if (Math.hypot(dx, dy) < 8) return;
      dismissHint();
      if (scene.zoomLevel > 1.05) {
        g.mode = 'pan';
      } else if (Math.abs(dx) < Math.abs(dy) * 0.8) {
        // Mostly vertical: not a page turn.
        gesture.current = null;
        return;
      } else if (portrait && state > 0) {
        const dir: 1 | -1 = dx > 0 ? 1 : -1;
        const pageHop = dir === 1 ? focus !== -1 : focus === -1;
        g.dir = dir;
        if (pageHop) g.mode = 'pagepan';
        else {
          g.index = dir === 1 ? state : state - 1;
          g.mode = g.index >= 0 && g.index < total ? 'turn' : 'pagepan';
        }
      } else {
        const L = layoutAt();
        const dir: 1 | -1 = portrait ? (dx > 0 ? 1 : -1) : L && g.x0 < L.spine ? 1 : -1;
        g.dir = dir;
        g.index = dir === 1 ? state : state - 1;
        if (g.index < 0 || g.index >= total) {
          gesture.current = null;
          return;
        }
        g.mode = 'turn';
      }
    }

    if (g.mode === 'pan') {
      scene.panBy(e.clientX - g.lx, e.clientY - g.ly);
    } else if (g.mode === 'pagepan') {
      // Rubber-band the camera towards the other page while the finger moves.
      scene.setParallax(Math.max(-1.6, Math.min(1.6, (-dx / window.innerWidth) * 2.4)), 0);
    } else if (g.mode === 'turn') {
      const p = (g.dir === 1 ? dx : -dx) / g.span;
      scene.drag(g.index, g.dir === 1 ? p : 1 - p, g.grabY, g.dir);
    }
    g.lx = e.clientX;
    g.ly = e.clientY;
  };

  const handleTap = (x: number) => {
    const L = layoutAt();
    if (portrait || !L) {
      // Thumb zones: the left half reads on, the right half goes back (RTL).
      step(x < window.innerWidth / 2 ? 1 : -1);
    } else {
      turnTo(x < L.spine ? 1 : -1);
    }
  };

  const onPointerUp = (e: React.PointerEvent) => {
    const scene = sceneRef.current;
    pointers.current.delete(e.pointerId);
    if (pinch.current) {
      if (pointers.current.size < 2) pinch.current = null;
      gesture.current = null;
      return;
    }
    const g = gesture.current;
    if (!scene || !g || g.id !== e.pointerId) return;
    gesture.current = null;
    const dt = performance.now() - g.t0;
    const dx = e.clientX - g.x0;
    const v = dx / Math.max(1, dt);

    if (g.mode === 'pending') {
      if (dt > 450) return;
      const now = performance.now();
      const prev = lastTap.current;
      const isDouble = prev && now - prev.t < 300 && Math.hypot(prev.x - e.clientX, prev.y - e.clientY) < 40;
      if (isDouble) {
        lastTap.current = null;
        if (tapTimer.current) window.clearTimeout(tapTimer.current);
        setZoom(scene.zoomLevel > 1.05 ? 1 : READ_ZOOM);
        haptic(6);
        return;
      }
      lastTap.current = { t: now, x: e.clientX, y: e.clientY };
      if (scene.zoomLevel > 1.05) return; // zoomed in: taps don't turn pages
      if (e.pointerType === 'mouse') handleTap(e.clientX);
      else {
        // Wait a beat so a double tap can still become a zoom.
        const x = e.clientX;
        tapTimer.current = window.setTimeout(() => handleTap(x), 260);
      }
      return;
    }

    if (g.mode === 'pagepan') {
      scene.setParallax(0, 0);
      if (Math.abs(dx) > 50 || Math.abs(v) > 0.35) step(g.dir);
      return;
    }

    if (g.mode === 'turn') {
      const tNow = scene.getT(g.index);
      const commit = g.dir === 1 ? tNow > 0.33 || v > 0.45 : tNow < 0.67 || v < -0.45;
      if (commit) turnTo(g.dir, { from: tNow, grabY: g.grabY });
      else scene.turn(g.index, g.dir === 1 ? 0 : 1, { from: tNow });
    }
  };

  const onPointerLeave = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse') return;
    sceneRef.current?.peel(null);
    if (motionMode !== 'on') sceneRef.current?.setParallax(0, 0);
  };

  const onWheel = (e: React.WheelEvent) => {
    const scene = sceneRef.current;
    if (!scene) return;
    setZoom(scene.zoomLevel * (e.deltaY > 0 ? 0.92 : 1.08));
  };

  useEffect(() => () => {
    if (tapTimer.current) window.clearTimeout(tapTimer.current);
  }, []);

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
      scene.setZoom(1);
      scene.setFocus(0);
      // Close leaves from the top of the right-hand stack down, then the cover.
      const order: number[] = [];
      for (let i = state - 1; i >= 0; i--) order.push(i);
      order.forEach((index, k) => window.setTimeout(() => scene.turn(index, 0), k * 170));
      const wait = state > 0 ? order.length * 170 + 900 : 0;
      window.setTimeout(() => {
        setLeaving(true);
        const rect = origin?.getBoundingClientRect();
        if (rect && rect.width > 0 && rect.bottom > 0 && rect.top < window.innerHeight) {
          scene.setOrigin({ x: rect.left, y: rect.top, w: rect.width, h: rect.height }, { w: window.innerWidth, h: window.innerHeight });
        } else {
          // The page scrolled away from the hero: let the book sink out of view instead.
          scene.setOriginBelow();
        }
        scene.flyBack(finish);
      }, wait);
    },
    [closing, state, origin, onClose],
  );

  const addToCart = () => {
    haptic([10, 40, 18]);
    close(() => onAddToCart(volume));
  };

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
      else if (e.key === '+' || e.key === '=') setZoom((sceneRef.current?.zoomLevel || 1) * 1.12);
      else if (e.key === '-') setZoom((sceneRef.current?.zoomLevel || 1) / 1.12);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    if (state === 1) return portrait && focus !== -1 ? t('ui.reader.insideCover') : t('ui.reader.titlePage');
    if (state === 2) {
      if (portrait) return t('ui.flip.pageN', { n: fa(focus === -1 ? 2 : 1) });
      return t('ui.flip.pages12', { a: fa(1), b: fa(2) });
    }
    if (portrait && focus === -1) return t('ui.reader.keepReading');
    return t('ui.flip.end');
  }, [state, portrait, focus, t]);

  // Progress: in one-page mode each page counts as a step.
  const steps = portrait ? 1 + (total - 1) * 2 + 1 : total + 1;
  const stepIndex = portrait ? (state === 0 ? 0 : 1 + (state - 1) * 2 + (focus === -1 ? 1 : 0)) : state;
  const canBack = state > 0;
  const canNext = state < total || (portrait && state > 0 && focus !== -1);

  const iconBtn = 'flex h-10 w-10 items-center justify-center rounded-full text-white/70 transition hover:bg-white/10 hover:text-white active:scale-95';

  return createPortal(
    <div
      className="fixed inset-0 z-[95] select-none overflow-hidden text-[#FAF7F2] [-webkit-tap-highlight-color:transparent]"
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
        className={`absolute inset-0 h-full w-full touch-none ${landed ? (zoomed ? 'cursor-move' : 'cursor-grab active:cursor-grabbing') : ''}`}
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
      <motion.div
        ref={topRef}
        initial={{ opacity: 0, y: -16 }}
        animate={landed && !closing ? { opacity: 1, y: 0 } : { opacity: 0, y: -16 }}
        transition={{ duration: 0.45 }}
        className={`absolute inset-x-0 top-0 flex items-center justify-between gap-2 px-3 pb-2 ${short ? 'pt-[max(0.5rem,env(safe-area-inset-top))]' : 'pt-[max(0.75rem,env(safe-area-inset-top))] sm:px-6 sm:pt-6'} ${landed && !closing ? '' : 'pointer-events-none'}`}
        dir="rtl"
      >
        <div className="flex items-center gap-1 rounded-2xl border border-white/10 bg-black/45 p-1 backdrop-blur-md">
          {FLIP_VOLUMES.map((v) => {
            const on = v.id === volume;
            return (
              <button
                key={v.id}
                onClick={() => switchVolume(v.id)}
                className={`relative flex items-center gap-1.5 rounded-xl py-1 pe-2.5 ps-1 text-[11px] font-bold transition-colors sm:gap-2 sm:pe-3 sm:text-xs ${on ? 'text-white' : 'text-white/60 hover:text-white'}`}
                aria-pressed={on}
              >
                {on && <motion.span layoutId="reader-vol" className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#D9894A] to-[#8B4513]" />}
                <img src={v.cover} alt="" className="relative h-8 w-[22px] rounded-[3px] object-cover sm:h-9 sm:w-6" draggable={false} />
                <span className="relative whitespace-nowrap">{t(v.id === 'vol-1' ? 'ui.flip.vol1' : 'ui.flip.vol2')}</span>
              </button>
            );
          })}
        </div>
        <div className="flex items-center gap-1 rounded-full border border-white/10 bg-black/45 p-1 backdrop-blur-md">
          {motionMode !== 'off' && (
            <button
              onClick={motionMode === 'ask' ? enableMotion : () => setMotionMode('off')}
              aria-label={t('ui.reader.motion')}
              title={t('ui.reader.motion')}
              className={`${iconBtn} ${motionMode === 'on' ? 'text-[#E8A672]' : ''}`}
            >
              <Move3d className="h-4 w-4" />
            </button>
          )}
          <button onClick={toggleSound} aria-label={sound ? t('ui.flip.soundOff') : t('ui.flip.soundOn')} className={iconBtn}>
            {sound ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </button>
          <button onClick={() => close(onOpenSamplePdf)} aria-label={t('ui.flip.sample')} title={t('ui.flip.sample')} className={iconBtn}>
            <FileText className="h-4 w-4" />
          </button>
          <button onClick={() => close()} aria-label={t('ui.reader.close')} className={`${iconBtn} bg-white/10 text-white`}>
            <X className="h-5 w-5" />
          </button>
        </div>
      </motion.div>

      {/* Hints */}
      <AnimatePresence>
        {landed && !closing && (hint || rotateHint) && (
          <motion.div
            key={rotateHint ? 'rotate' : 'hint'}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.3 }}
            className="pointer-events-none absolute inset-x-0 flex justify-center px-4"
            style={{ bottom: (bottomRef.current?.offsetHeight || 90) + 22 }}
          >
            <div className="flex items-center gap-2.5 rounded-full border border-white/10 bg-black/60 px-4 py-2 text-xs font-bold text-white/90 backdrop-blur-md">
              {rotateHint ? (
                <motion.span animate={{ rotate: [0, -90, -90, 0] }} transition={{ duration: 2.2, repeat: Infinity, times: [0, 0.35, 0.7, 1] }}>
                  <Smartphone className="h-4 w-4 text-[#E8A672]" />
                </motion.span>
              ) : (
                <motion.span animate={{ x: [0, 16, 0], rotate: [0, -8, 0] }} transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}>
                  <Hand className="h-4 w-4 text-[#E8A672]" />
                </motion.span>
              )}
              {rotateHint
                ? t('ui.reader.rotateHint')
                : state === 0
                  ? t('ui.reader.openHint')
                  : touch
                    ? t('ui.reader.swipeHint')
                    : t('ui.flip.hint')}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Zoom badge: double tap to come back */}
      <AnimatePresence>
        {zoomed && landed && !closing && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            onClick={() => setZoom(1)}
            className="absolute start-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full border border-white/10 bg-black/60 px-3 py-1.5 text-[11px] font-bold text-white/85 backdrop-blur-md rtl:translate-x-1/2"
            style={{ top: (topRef.current?.getBoundingClientRect().bottom || 70) + 8 }}
          >
            <Minus className="h-3.5 w-3.5" />
            {t('ui.reader.zoomReset')}
          </motion.button>
        )}
      </AnimatePresence>

      {/* Bottom toolbar */}
      <motion.div
        ref={bottomRef}
        initial={{ opacity: 0, y: 24 }}
        animate={landed && !closing ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className={`absolute inset-x-0 bottom-0 flex justify-center px-3 pt-2 ${short ? 'pb-[max(0.5rem,env(safe-area-inset-bottom))] sm:px-6' : 'pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:p-6'} ${landed && !closing ? '' : 'pointer-events-none'}`}
        dir="rtl"
      >
        <div className={`flex w-full max-w-3xl items-center justify-between gap-2 rounded-[1.6rem] border border-white/10 bg-black/50 px-2 backdrop-blur-xl sm:gap-3 sm:px-4 ${short ? 'py-1' : 'py-2'}`}>
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => step(-1)}
              disabled={!canBack}
              aria-label={t('ui.flip.prev')}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white/80 transition hover:border-[#E8A672]/60 hover:text-white active:scale-95 disabled:opacity-30"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            <div className={`flex flex-col items-center gap-1.5 ${compact ? 'min-w-[84px]' : 'min-w-[118px]'}`}>
              <span className="whitespace-nowrap text-[11px] font-black sm:text-xs">{label}</span>
              <div className="flex gap-1" dir="rtl">
                {Array.from({ length: steps }, (_, i) => (
                  <motion.span
                    key={i}
                    className="h-1.5 rounded-full"
                    animate={{ width: i === stepIndex ? 16 : 5, backgroundColor: i <= stepIndex ? '#D9894A' : 'rgba(255,255,255,0.2)' }}
                  />
                ))}
              </div>
            </div>
            <button
              onClick={() => step(1)}
              disabled={!canNext}
              aria-label={t('ui.flip.next')}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-[#D9894A] via-[#B87333] to-[#7A3E14] text-white shadow-[0_10px_30px_-12px_rgba(217,137,74,0.8)] transition hover:brightness-110 active:scale-95 disabled:opacity-30"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          </div>

          {!compact && (
            <div className="flex items-center gap-1">
              <button onClick={() => setZoom((sceneRef.current?.zoomLevel || 1) / 1.15)} aria-label={t('ui.reader.zoomOut')} className={iconBtn}>
                <Minus className="h-4 w-4" />
              </button>
              <button onClick={() => setZoom((sceneRef.current?.zoomLevel || 1) * 1.15)} aria-label={t('ui.reader.zoomIn')} className={iconBtn}>
                <Plus className="h-4 w-4" />
              </button>
            </div>
          )}

          <motion.button
            onClick={addToCart}
            whileTap={{ scale: 0.95 }}
            animate={state === total ? { boxShadow: ['0 0 0 0 rgba(217,137,74,0.6)', '0 0 0 14px rgba(217,137,74,0)'] } : {}}
            transition={state === total ? { duration: 1.6, repeat: Infinity } : {}}
            className="flex h-11 items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-[#D9894A] via-[#B87333] to-[#7A3E14] px-3 text-sm font-black text-white sm:px-4"
            aria-label={t('ui.pricing.add')}
          >
            <ShoppingBag className="h-4 w-4 shrink-0" />
            {!compact && <span>{t('ui.pricing.add')}</span>}
            {book && <span className="whitespace-nowrap rounded-lg bg-black/25 px-2 py-0.5 text-[11px]">{price(book.price)}</span>}
          </motion.button>
        </div>
      </motion.div>
    </div>,
    document.body,
  );
};

export default BookReader;
