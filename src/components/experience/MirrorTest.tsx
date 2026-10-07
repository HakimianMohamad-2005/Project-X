import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, useInView, useMotionValue, useMotionTemplate, useMotionValueEvent, animate, useTransform } from 'motion/react';
import {
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  ChevronsLeftRight,
  Eye,
  Flame,
  Megaphone,
  PhoneCall,
  ShieldCheck,
  Siren,
  Target,
  Timer,
  Zap,
} from 'lucide-react';
import { localizeDigits, usePrefersReducedMotion } from './shared';

interface Step {
  stepNumber: number;
  title: string;
  subtitle: string;
  description: string;
  orangutanDiff: string;
  plus3Diff: string;
  tag: string;
}

const STEP_ICONS = [Eye, Target, ShieldCheck, Zap];

const CHAOS_ICONS = [
  { Icon: Flame, top: '14%', left: '8%', rot: -12, size: 'w-7 h-7' },
  { Icon: PhoneCall, top: '68%', left: '14%', rot: 14, size: 'w-6 h-6' },
  { Icon: Siren, top: '24%', left: '42%', rot: 8, size: 'w-8 h-8' },
  { Icon: AlertTriangle, top: '76%', left: '38%', rot: -18, size: 'w-7 h-7' },
  { Icon: Megaphone, top: '46%', left: '4%', rot: 22, size: 'w-6 h-6' },
  { Icon: Timer, top: '8%', left: '28%', rot: -6, size: 'w-6 h-6' },
];

export const MirrorTest: React.FC = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const reducedMotion = usePrefersReducedMotion();
  const steps = (t('framework.steps', { returnObjects: true }) as Step[]) || [];
  const [active, setActive] = useState(0);
  const step = steps[active] || ({} as Step);

  const frameRef = useRef<HTMLDivElement>(null);
  const inView = useInView(frameRef, { once: true, amount: 0.5 });
  // % of width showing the instinctive side (from the left).
  const split = useMotionValue(typeof window !== 'undefined' && window.innerWidth < 640 ? 100 : 50);
  const clip = useMotionTemplate`inset(0 calc(100% - ${split}%) 0 0)`;
  const handleLeft = useMotionTemplate`${split}%`;
  const orangutanDim = useTransform(split, [0, 50, 100], [0.4, 1, 1]);
  const plus3Dim = useTransform(split, [0, 50, 100], [1, 1, 0.4]);
  const dragging = useRef(false);
  const [ariaValue, setAriaValue] = useState(50);
  useMotionValueEvent(split, 'change', (v) => setAriaValue(Math.round(v / 10) * 10));

  // One-time teaser sweep so visitors discover the handle. On narrow screens
  // each side's text spans the full width, so the sweep ends on the +3 side.
  useEffect(() => {
    if (!inView || reducedMotion) return;
    const narrow = window.innerWidth < 640;
    const controls = narrow
      ? animate(split, [100, 100, 0], { duration: 3.2, ease: 'easeInOut', delay: 0.4 })
      : animate(split, [50, 82, 18, 50], { duration: 2.6, ease: 'easeInOut', delay: 0.3 });
    return () => controls.stop();
  }, [inView, reducedMotion, split]);

  const setFromClientX = (clientX: number) => {
    const el = frameRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    split.set(Math.min(100, Math.max(0, pct)));
  };

  const onPointerDown = (e: React.PointerEvent) => {
    dragging.current = true;
    split.stop();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    setFromClientX(e.clientX);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (dragging.current) setFromClientX(e.clientX);
  };
  const onPointerUp = () => {
    dragging.current = false;
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') split.set(Math.max(0, split.get() - 5));
    if (e.key === 'ArrowRight') split.set(Math.min(100, split.get() + 5));
  };

  const snapTo = (v: number) => animate(split, v, { type: 'spring', stiffness: 120, damping: 20 });

  return (
    <section className="relative bg-[#0A0A0B] text-[#FAF7F2] py-20 sm:py-28 overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#B87333]/40 to-transparent" />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.7 }}
          className="text-center max-w-2xl mx-auto space-y-3 mb-10"
        >
          <span className="text-[11px] sm:text-xs font-black tracking-[0.25em] uppercase text-[#D9894A]">
            {t('story.verdict.kicker')}
          </span>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight">{t('story.verdict.title')}</h2>
          <p className="text-sm sm:text-base text-stone-400 leading-7">{t('story.verdict.subtitle')}</p>
        </motion.div>

        {/* Step selector */}
        <div className="flex flex-wrap justify-center gap-2 mb-6" role="tablist">
          {steps.map((s, idx) => {
            const Icon = STEP_ICONS[idx] || Eye;
            const isActive = idx === active;
            return (
              <button
                key={s.stepNumber ?? idx}
                role="tab"
                aria-selected={isActive}
                onClick={() => setActive(idx)}
                className={`relative inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs sm:text-sm font-bold transition-colors ${
                  isActive ? 'text-white' : 'text-stone-400 hover:text-stone-200 bg-white/[0.03] border border-white/10'
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="mirror-step-pill"
                    className="absolute inset-0 rounded-full bg-gradient-to-br from-[#D9894A] to-[#8B4513] shadow-[0_6px_24px_-6px_rgba(217,137,74,0.7)]"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <Icon className="relative w-4 h-4" />
                <span className="relative">
                  {s.stepNumber <= 3 && (
                    <>
                      <bdi dir="ltr" className="opacity-70">+{localizeDigits(1, lang)}</bdi>
                      <span className="opacity-40 mx-1.5">·</span>
                    </>
                  )}
                  {s.title}
                </span>
              </button>
            );
          })}
        </div>

        {/* The mirror */}
        <div
          ref={frameRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          className="relative h-[460px] sm:h-[420px] rounded-[2rem] overflow-hidden border border-white/10 select-none cursor-ew-resize touch-pan-y"
          dir="ltr"
        >
          {/* +3 layer (full) */}
          <motion.div style={{ opacity: plus3Dim }} className="absolute inset-0 bg-[#0E0F10]">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(184,115,51,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(184,115,51,0.08)_1px,transparent_1px)] bg-[size:32px_32px]" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_50%,rgba(184,115,51,0.22),transparent_60%)]" />
            {/* Neat dashboard decor */}
            <div className="absolute bottom-8 right-8 hidden sm:flex items-end gap-2 h-24 opacity-70">
              {[38, 52, 61, 74, 88].map((h, i) => (
                <motion.span
                  key={i}
                  initial={{ height: 0 }}
                  whileInView={{ height: `${h}%` }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 + i * 0.12, duration: 0.6 }}
                  className="w-4 rounded-t bg-gradient-to-t from-[#8B4513] to-[#E8A672]"
                />
              ))}
            </div>
            <div className="absolute top-8 right-8 hidden sm:flex gap-2 opacity-80">
              {[0, 1, 2].map((i) => (
                <CheckCircle2 key={i} className="w-5 h-5 text-emerald-400/80" />
              ))}
              <BarChart3 className="w-5 h-5 text-[#D9894A]" />
            </div>

            <div
              dir={i18n.dir(lang)}
              className="absolute inset-y-0 right-0 w-full sm:w-1/2 flex flex-col justify-center gap-4 p-7 sm:p-12 text-start"
            >
              <span className="inline-flex w-fit items-center gap-2 rounded-full border border-[#D9894A]/50 bg-[#D9894A]/10 px-3 py-1 text-xs font-black text-[#E8A672]">
                <span className="h-2 w-2 rounded-full bg-[#D9894A]" />
                {t('story.verdict.plus3')}
              </span>
              <motion.p
                key={`p-${active}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="text-xl sm:text-2xl font-extrabold leading-relaxed text-[#FAF7F2]"
              >
                {step.plus3Diff}
              </motion.p>
            </div>
          </motion.div>

          {/* Instinctive layer (clipped) */}
          <motion.div
            style={{ clipPath: clip, WebkitClipPath: clip }}
            className="absolute inset-0"
          >
            <motion.div style={{ opacity: orangutanDim }} className="absolute inset-0 bg-[#140C0B]">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_50%,rgba(160,40,30,0.30),transparent_60%)]" />
              <svg className="absolute inset-0 w-full h-full opacity-[0.18]" preserveAspectRatio="none" viewBox="0 0 400 300" aria-hidden="true">
                <path
                  d="M10 40 C 80 10, 60 120, 140 80 S 210 20, 180 140 S 40 180, 120 220 S 260 260, 200 180 S 90 120, 30 260"
                  fill="none"
                  stroke="#E05A47"
                  strokeWidth="1.5"
                />
                <path
                  d="M20 150 C 90 90, 150 260, 60 200 S 160 40, 230 110 S 120 290, 15 280"
                  fill="none"
                  stroke="#B87333"
                  strokeWidth="1"
                />
              </svg>
              {CHAOS_ICONS.map(({ Icon, top, left, rot, size }, i) => (
                <span
                  key={i}
                  className="absolute hidden sm:block og-jitter text-red-400/60"
                  style={{ top, left, ['--og-rot' as string]: `${rot}deg`, animationDelay: `${i * 0.07}s` }}
                >
                  <Icon className={size} />
                </span>
              ))}

              <div
                dir={i18n.dir(lang)}
                className="absolute inset-y-0 left-0 w-full sm:w-1/2 flex flex-col justify-center gap-4 p-7 sm:p-12 text-start"
              >
                <span className="inline-flex w-fit items-center gap-2 rounded-full border border-red-500/40 bg-red-500/10 px-3 py-1 text-xs font-black text-red-300">
                  <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                  {t('story.verdict.orangutan')}
                </span>
                <motion.p
                  key={`o-${active}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="text-xl sm:text-2xl font-extrabold leading-relaxed text-stone-200"
                >
                  {step.orangutanDiff}
                </motion.p>
              </div>
            </motion.div>
          </motion.div>

          {/* Handle */}
          <motion.div
            style={{ left: handleLeft }}
            className="absolute inset-y-0 -translate-x-1/2 w-10 flex items-center justify-center pointer-events-none"
          >
            <span className="absolute inset-y-0 left-1/2 w-[2px] -translate-x-1/2 bg-gradient-to-b from-transparent via-[#FFD3A1] to-transparent shadow-[0_0_18px_rgba(255,211,161,0.8)]" />
            <span
              role="slider"
              tabIndex={0}
              aria-label={t('story.verdict.drag')}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={ariaValue}
              onKeyDown={onKeyDown}
              className="pointer-events-auto relative flex h-14 w-14 items-center justify-center rounded-full border border-[#FFD3A1]/60 bg-[#0A0A0B]/80 text-[#FFD3A1] shadow-[0_0_30px_rgba(217,137,74,0.6)] backdrop-blur focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD3A1]"
            >
              <ChevronsLeftRight className="w-6 h-6" />
            </span>
          </motion.div>
        </div>

        {/* Quick snaps + step description */}
        <div className="mt-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex gap-2" dir="ltr">
            <button
              onClick={() => snapTo(100)}
              className="rounded-full border border-red-500/30 bg-red-500/5 px-4 py-2 text-xs font-bold text-red-300 hover:bg-red-500/15 transition-colors"
            >
              {t('story.verdict.orangutan')}
            </button>
            <button
              onClick={() => snapTo(0)}
              className="rounded-full border border-[#D9894A]/40 bg-[#D9894A]/10 px-4 py-2 text-xs font-bold text-[#E8A672] hover:bg-[#D9894A]/20 transition-colors"
            >
              {t('story.verdict.plus3')}
            </button>
          </div>
          <motion.p
            key={`d-${active}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs sm:text-sm text-stone-500 leading-6 max-w-2xl text-center sm:text-start"
          >
            <span className="font-bold text-stone-300">{step.subtitle}</span>
          </motion.p>
        </div>
      </div>
    </section>
  );
};
