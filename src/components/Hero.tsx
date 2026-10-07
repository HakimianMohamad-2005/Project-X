import React, { useEffect, useRef } from 'react';
import { ArrowLeft, Download, MousePointer2, Zap } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion, useMotionValue, useSpring, useTransform, animate } from 'motion/react';
import { formatCurrency } from '../utils/persian';
import { BUNDLE_DATA } from '../data/bookData';
import { ActiveTab, ThemeMode } from '../types';
import { ParticleField } from './experience/ParticleField';
import { Book3D } from './experience/Book3D';
import { localizeDigits, useFinePointer, usePrefersReducedMotion } from './experience/shared';

interface HeroProps {
  onAddToCart: (bookId: string) => void;
  onOpenSamplePdf: () => void;
  onTabChange: (tab: ActiveTab) => void;
  theme?: ThemeMode;
  /** False while the intro curtain is still covering the page. */
  revealed?: boolean;
}

const MARK = '§';

/** Renders a translated sentence and styles the interpolated value. */
const Highlighted: React.FC<{ text: string; value: string; className: string }> = ({ text, value, className }) => {
  const [before, after] = text.split(MARK);
  return (
    <>
      {before}
      <span className={className}>{value}</span>
      {after}
    </>
  );
};

const CompassRings: React.FC = () => {
  const ticks = Array.from({ length: 120 }, (_, i) => i * 3);
  return (
    <svg viewBox="-260 -260 520 520" className="w-full h-full" aria-hidden="true">
      <defs>
        <linearGradient id="og-ring-arc" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#D9894A" stopOpacity="0" />
          <stop offset="100%" stopColor="#FFD3A1" stopOpacity="0.9" />
        </linearGradient>
      </defs>
      <g className="og-spin-slow" style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
        <circle r="246" fill="none" stroke="#B87333" strokeOpacity="0.35" />
        {ticks.map((deg) => {
          const long = deg % 30 === 0;
          const r1 = long ? 222 : 232;
          const a = (deg * Math.PI) / 180;
          return (
            <line
              key={deg}
              x1={Math.cos(a) * r1}
              y1={Math.sin(a) * r1}
              x2={Math.cos(a) * 240}
              y2={Math.sin(a) * 240}
              stroke="#D9894A"
              strokeOpacity={long ? 0.8 : 0.35}
              strokeWidth={long ? 1.5 : 1}
            />
          );
        })}
        <path d="M 0 -246 A 246 246 0 0 1 213 -123" fill="none" stroke="url(#og-ring-arc)" strokeWidth="2.5" strokeLinecap="round" />
      </g>
      <g className="og-spin-slower-reverse" style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
        <circle r="196" fill="none" stroke="#D9894A" strokeOpacity="0.45" strokeDasharray="2 8" />
        <circle r="150" fill="none" stroke="#B87333" strokeOpacity="0.2" />
        <circle cx="196" cy="0" r="3.5" fill="#FFD3A1" />
      </g>
    </svg>
  );
};

export const Hero: React.FC<HeroProps> = ({
  onAddToCart,
  onOpenSamplePdf,
  onTabChange,
  revealed = true,
}) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const isRtl = lang === 'fa' || lang === 'ar';
  const reducedMotion = usePrefersReducedMotion();
  const finePointer = useFinePointer();
  const sectionRef = useRef<HTMLElement>(null);

  // Book stage tilt (pointer-driven on desktop, gentle idle sway elsewhere).
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 70, damping: 18, mass: 0.6 });
  const sy = useSpring(py, { stiffness: 70, damping: 18, mass: 0.6 });
  const rotateY = useTransform(sx, [-1, 1], [16, 44]);
  const rotateX = useTransform(sy, [-1, 1], [14, -6]);
  const glowX = useTransform(sx, [-1, 1], ['35%', '65%']);

  useEffect(() => {
    if (reducedMotion) return;
    if (finePointer) {
      const el = sectionRef.current;
      if (!el) return;
      const onMove = (e: PointerEvent) => {
        const rect = el.getBoundingClientRect();
        px.set(((e.clientX - rect.left) / rect.width) * 2 - 1);
        py.set(((e.clientY - rect.top) / rect.height) * 2 - 1);
      };
      const onLeave = () => {
        px.set(0);
        py.set(0);
      };
      el.addEventListener('pointermove', onMove);
      el.addEventListener('pointerleave', onLeave);
      return () => {
        el.removeEventListener('pointermove', onMove);
        el.removeEventListener('pointerleave', onLeave);
      };
    }
    const controls = animate(px, [-0.5, 0.5, -0.5], { duration: 9, repeat: Infinity, ease: 'easeInOut' });
    return () => controls.stop();
  }, [finePointer, reducedMotion, px, py]);

  const formatPrice = (amount: number) =>
    lang === 'fa' ? formatCurrency(amount) : `${amount.toLocaleString()} Toman`;

  const pct97 = localizeDigits('97', lang) + (lang === 'fa' ? '٪' : '%');
  const pct3 = localizeDigits('3', lang) + (lang === 'fa' ? '٪' : '%');

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.11, delayChildren: 0.15 } },
  };
  const item = {
    hidden: { opacity: 0, y: 26, filter: 'blur(8px)' },
    show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const } },
  };

  return (
    <section
      ref={sectionRef}
      className="relative isolate overflow-hidden bg-[#0A0A0B] text-[#FAF7F2] min-h-[calc(100svh-4rem)] md:min-h-[calc(100svh-6.75rem)] flex flex-col"
    >
      {/* ---------- Backdrop ---------- */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 w-[70vw] h-[70vw] max-w-[900px] max-h-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(184,115,51,0.20),rgba(184,115,51,0)_65%)]"
          style={{ left: glowX }}
        />
        <ParticleField
          className="absolute inset-0"
          orderSide={isRtl ? 'left' : 'right'}
          reducedMotion={reducedMotion}
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(10,10,11,0.85)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-[#0A0A0B]" />
      </div>

      {/* ---------- Content ---------- */}
      <div className="relative flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 items-center gap-6 lg:gap-10 pt-10 pb-24 lg:py-16">
        <motion.div
          variants={container}
          initial="hidden"
          animate={revealed ? 'show' : 'hidden'}
          className="lg:col-span-7 space-y-6 sm:space-y-7 text-start relative z-10"
        >
          <motion.div variants={item} className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#B87333]/40 bg-[#B87333]/10 px-3.5 py-1.5 text-xs font-bold text-[#E8A672] backdrop-blur">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#D9894A] opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#D9894A]" />
              </span>
              {t('story.hero.eyebrow')}
            </span>
            <span className="hidden sm:inline text-xs text-stone-400 font-medium">{t('hero.badge')}</span>
          </motion.div>

          <motion.h1
            variants={item}
            className="font-black tracking-tight leading-[1.05] text-[3.4rem] sm:text-7xl lg:text-[5.6rem] xl:text-8xl"
          >
            <span className="text-[#FAF7F2]">{t('hero.title')}</span>{' '}
            <span className="og-copper-text drop-shadow-[0_0_30px_rgba(217,137,74,0.35)] inline-block">
              {t('hero.highlight')}
            </span>
          </motion.h1>

          <motion.div variants={item} className="space-y-1.5 text-xl sm:text-2xl lg:text-[1.7rem] font-extrabold leading-snug">
            <p className="text-stone-500">
              <Highlighted
                text={t('story.hero.line1', { pct: MARK })}
                value={pct97}
                className="text-stone-300 tabular-nums"
              />
            </p>
            <p className="text-[#FAF7F2]">
              <Highlighted
                text={t('story.hero.line2', { pct: MARK })}
                value={pct3}
                className="text-[#E8A672] tabular-nums"
              />
            </p>
          </motion.div>

          <motion.p variants={item} className="text-sm sm:text-base leading-8 text-stone-400 max-w-xl">
            {t('story.hero.body')}
          </motion.p>

          <motion.div variants={item} className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3 sm:gap-4 pt-1">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onAddToCart('bundle-full')}
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#D9894A] via-[#B87333] to-[#7A3E14] px-7 py-4 font-extrabold text-white shadow-[0_10px_40px_-10px_rgba(217,137,74,0.7)] flex items-center justify-center gap-3"
            >
              <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/25 to-transparent" />
              <span className="relative whitespace-nowrap">{t('hero.ctaBundle')}</span>
              <span className="relative whitespace-nowrap rounded-full bg-black/30 px-2 py-0.5 text-[11px] font-bold text-amber-100">
                {t('hero.discountBadge')}
              </span>
              <ArrowLeft className="relative w-5 h-5 transition-transform group-hover:-translate-x-1 ltr:rotate-180 ltr:group-hover:translate-x-1" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={onOpenSamplePdf}
              className="rounded-2xl border border-white/15 bg-white/[0.04] px-6 py-4 text-sm font-bold text-stone-200 backdrop-blur hover:border-[#B87333]/60 hover:bg-white/[0.07] transition-colors flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4 text-[#D9894A] shrink-0" />
              <span className="whitespace-nowrap">{t('hero.ctaSamplePdf')}</span>
            </motion.button>
          </motion.div>

          <motion.div variants={item} className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-1 text-sm">
            <div className="flex items-baseline gap-2">
              <span className="text-xs text-stone-500">{t('hero.bundlePriceLabel')}</span>
              <span className="text-xs text-stone-600 line-through">{formatPrice(BUNDLE_DATA.originalPrice)}</span>
              <span className="font-black text-[#E8A672]">{formatPrice(BUNDLE_DATA.bundlePrice)}</span>
            </div>
            <button
              onClick={() => onTabChange('quiz')}
              className="group inline-flex items-center gap-2 font-bold text-stone-200 hover:text-[#E8A672] transition-colors"
            >
              <Zap className="w-4 h-4 text-[#D9894A]" />
              <span className="border-b border-dashed border-stone-600 group-hover:border-[#E8A672]">
                {t('story.hero.quizLink')}
              </span>
            </button>
          </motion.div>
        </motion.div>

        {/* ---------- Book stage ---------- */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={revealed ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.92 }}
          transition={{ duration: 1.2, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="lg:col-span-5 relative h-[420px] sm:h-[520px] flex items-center justify-center [perspective:1400px] pointer-events-none"
        >
          <div className="absolute w-[420px] h-[420px] sm:w-[520px] sm:h-[520px]">
            <CompassRings />
          </div>
          <div className="absolute w-64 h-64 rounded-full bg-[#B87333]/25 blur-[90px]" />

          <div className="scale-[0.82] sm:scale-100 [transform-style:preserve-3d]">
          <motion.div
            style={{ rotateX, rotateY }}
            className="relative [transform-style:preserve-3d]"
          >
            <Book3D
              cover="/Jeld2%20-%20Front.png"
              alt={`${t('hero.title')} ${t('hero.highlight')} — 2`}
              width={228}
              depth={40}
              className="!absolute top-0 left-0"
              style={{ transform: 'translate3d(-74px, -30px, -110px) rotateZ(-5deg)' }}
            />
            <Book3D
              cover="/Jeld%20-%20Front.png"
              alt={`${t('hero.title')} ${t('hero.highlight')} — 1`}
              width={228}
              depth={38}
              style={{ transform: 'translate3d(34px, 18px, 30px)' }}
            />
          </motion.div>
          </div>

          <div className="absolute bottom-6 sm:bottom-10 w-72 h-10 rounded-[100%] bg-black/70 blur-2xl" />

          <div className="absolute bottom-2 sm:bottom-6 start-1/2 ltr:-translate-x-1/2 rtl:translate-x-1/2 flex items-center gap-2 rounded-full border border-white/10 bg-black/50 px-3 py-1.5 text-[11px] font-bold text-stone-300 backdrop-blur whitespace-nowrap">
            <span className="tabular-nums text-[#E8A672]">{t('hero.totalPagesBadge')}</span>
            <span className="text-stone-600">•</span>
            <span>{t('hero.authorName')}</span>
          </div>
        </motion.div>
      </div>

      {/* ---------- Bottom rail ---------- */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={revealed ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: 1.4, duration: 0.8 }}
        className="absolute inset-x-0 bottom-0 pb-5 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex items-end justify-between gap-4 pointer-events-none"
      >
        <div className="hidden md:flex items-center gap-2 text-[11px] text-stone-500 max-w-xs">
          {finePointer && (
            <>
              <MousePointer2 className="w-3.5 h-3.5 text-[#B87333] shrink-0" />
              <span>{t('story.hero.fieldHint')}</span>
            </>
          )}
        </div>
        <div className="flex flex-col items-center gap-2 mx-auto md:mx-0">
          <span className="text-[11px] font-bold tracking-wide text-stone-400">{t('story.hero.scroll')}</span>
          <span className="relative h-10 w-px bg-white/10 overflow-hidden">
            <span className="og-drip absolute inset-0 bg-gradient-to-b from-[#D9894A] to-transparent" />
          </span>
        </div>
        <div className="hidden md:block max-w-xs" />
      </motion.div>
    </section>
  );
};
