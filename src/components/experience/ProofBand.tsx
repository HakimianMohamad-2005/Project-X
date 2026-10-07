import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, useInView, useMotionValue, useTransform, animate } from 'motion/react';
import { ActiveTab } from '../../types';
import { localizeDigits, usePrefersReducedMotion } from './shared';

interface MistakeLessonItem {
  id: string;
  number: number;
  type: 'mistake' | 'lesson';
  title: string;
}

const CountUp: React.FC<{ to: number; lang: string; suffix?: string }> = ({ to, lang, suffix = '' }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reducedMotion = usePrefersReducedMotion();
  const value = useMotionValue(reducedMotion ? to : 0);
  const text = useTransform(value, (v) => localizeDigits(Math.round(v), lang) + suffix);

  useEffect(() => {
    if (!inView || reducedMotion) return;
    const controls = animate(value, to, { duration: 2, ease: [0.16, 1, 0.3, 1] });
    return () => controls.stop();
  }, [inView, reducedMotion, to, value]);

  return <motion.span ref={ref}>{text}</motion.span>;
};

const MarqueeRow: React.FC<{
  items: MistakeLessonItem[];
  label: string;
  lang: string;
  reverse?: boolean;
  onSelect: () => void;
}> = ({ items, label, lang, reverse, onSelect }) => {
  if (items.length === 0) return null;
  // Repeat so one half of the track is always wider than the viewport.
  const half = [...items, ...items, ...items];
  const isMistake = items[0].type === 'mistake';

  return (
    <div
      dir="ltr"
      className="og-marquee relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_8%,black_92%,transparent)]"
    >
      <div
        className={`og-marquee-track flex w-max gap-3 py-1.5 ${reverse ? 'og-reverse' : ''}`}
        style={{ ['--og-marquee-duration' as string]: '70s' }}
      >
        {[...half, ...half].map((item, i) => (
          <button
            key={`${item.id}-${i}`}
            onClick={onSelect}
            tabIndex={i < half.length ? 0 : -1}
            aria-hidden={i >= half.length}
            dir={lang === 'fa' || lang === 'ar' ? 'rtl' : 'ltr'}
            className={`group shrink-0 inline-flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-bold transition-colors ${
              isMistake
                ? 'border-red-500/15 bg-red-500/[0.04] text-stone-300 hover:border-red-500/40'
                : 'border-[#B87333]/20 bg-[#B87333]/[0.06] text-stone-200 hover:border-[#D9894A]/60'
            }`}
          >
            <span
              className={`rounded-lg px-2 py-0.5 text-[11px] font-black tabular-nums ${
                isMistake ? 'bg-red-500/15 text-red-300' : 'bg-[#D9894A]/15 text-[#E8A672]'
              }`}
            >
              {label} {localizeDigits(item.number, lang)}
            </span>
            <span className="whitespace-nowrap">{item.title}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export const ProofBand: React.FC<{ onTabChange: (tab: ActiveTab) => void }> = ({ onTabChange }) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const items = (t('mistakesLessons.items', { returnObjects: true }) as MistakeLessonItem[]) || [];
  const mistakes = Array.isArray(items) ? items.filter((i) => i.type === 'mistake') : [];
  const lessons = Array.isArray(items) ? items.filter((i) => i.type === 'lesson') : [];

  const stats = [
    { to: 728, label: t('story.numbers.pages') },
    { to: 7, label: t('story.numbers.cases') },
    { to: 80, label: t('story.numbers.lessons') },
    { to: 40, label: t('story.numbers.years'), suffix: '+' },
  ];

  return (
    <section className="relative bg-[#0A0A0B] text-[#FAF7F2] py-20 sm:py-24 overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#B87333]/40 to-transparent" />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center text-[11px] sm:text-xs font-black tracking-[0.25em] uppercase text-[#D9894A] mb-10"
        >
          {t('story.numbers.kicker')}
        </motion.p>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px rounded-3xl overflow-hidden border border-white/10 bg-white/10">
          {stats.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="group relative bg-[#0E0F10] px-5 py-8 sm:py-10 text-center overflow-hidden"
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(circle_at_50%_120%,rgba(217,137,74,0.25),transparent_70%)]" />
              <div className="relative text-5xl sm:text-6xl font-black tracking-tight og-copper-text" dir="ltr">
                <CountUp to={s.to} lang={lang} suffix={s.suffix} />
              </div>
              <div className="relative mt-3 text-xs sm:text-sm font-bold text-stone-400">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="mt-14 space-y-3">
        <MarqueeRow
          items={mistakes}
          label={t('story.marquee.mistake')}
          lang={lang}
          onSelect={() => onTabChange('mistakes-lessons')}
        />
        <MarqueeRow
          items={lessons}
          label={t('story.marquee.lesson')}
          lang={lang}
          reverse
          onSelect={() => onTabChange('mistakes-lessons')}
        />
      </div>
    </section>
  );
};
