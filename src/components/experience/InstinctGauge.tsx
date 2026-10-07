import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { ArrowLeft, Zap } from 'lucide-react';
import { ActiveTab } from '../../types';
import { usePrefersReducedMotion } from './shared';

/** Quiz teaser: a gauge whose needle can't decide where your organization sits. */
export const InstinctGauge: React.FC<{ onTabChange: (tab: ActiveTab) => void }> = ({ onTabChange }) => {
  const { t } = useTranslation();
  const reducedMotion = usePrefersReducedMotion();

  const ticks = Array.from({ length: 41 }, (_, i) => -90 + i * 4.5);

  return (
    <section className="relative bg-[#0A0A0B] text-[#FAF7F2] py-20 sm:py-24 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8 }}
          className="relative rounded-[2.25rem] border border-[#B87333]/25 bg-gradient-to-br from-[#17110d] via-[#0E0F10] to-[#0E0F10] p-7 sm:p-12 overflow-hidden grid grid-cols-1 md:grid-cols-2 gap-10 items-center"
        >
          <div className="absolute -top-32 -end-32 w-96 h-96 rounded-full bg-[#B87333]/20 blur-[100px] pointer-events-none" />

          <div className="relative space-y-5 text-start">
            <span className="inline-flex items-center gap-2 text-[11px] sm:text-xs font-black tracking-[0.25em] uppercase text-[#D9894A]">
              <Zap className="w-4 h-4" />
              {t('story.gauge.kicker')}
            </span>
            <h2 className="text-3xl sm:text-4xl font-black leading-tight">{t('story.gauge.title')}</h2>
            <p className="text-sm sm:text-base text-stone-400 leading-7">{t('story.gauge.body')}</p>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onTabChange('quiz')}
              className="group inline-flex items-center gap-3 rounded-2xl bg-gradient-to-br from-[#D9894A] via-[#B87333] to-[#7A3E14] px-7 py-4 font-extrabold text-white shadow-[0_10px_40px_-10px_rgba(217,137,74,0.7)]"
            >
              {t('story.gauge.cta')}
              <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1 ltr:rotate-180 ltr:group-hover:translate-x-1" />
            </motion.button>
          </div>

          <div className="relative mx-auto w-full max-w-sm" dir="ltr">
            <svg viewBox="-160 -150 320 175" className="w-full" aria-hidden="true">
              <defs>
                <linearGradient id="og-gauge" x1="0" x2="1">
                  <stop offset="0%" stopColor="#E05A47" />
                  <stop offset="50%" stopColor="#D9894A" />
                  <stop offset="100%" stopColor="#FFD3A1" />
                </linearGradient>
              </defs>
              <path d="M -130 0 A 130 130 0 0 1 130 0" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="18" strokeLinecap="round" />
              <path d="M -130 0 A 130 130 0 0 1 130 0" fill="none" stroke="url(#og-gauge)" strokeWidth="6" strokeLinecap="round" />
              {ticks.map((deg, i) => {
                const a = ((deg - 90) * Math.PI) / 180;
                const long = i % 5 === 0;
                const r1 = long ? 100 : 106;
                return (
                  <line
                    key={i}
                    x1={Math.cos(a) * r1}
                    y1={Math.sin(a) * r1}
                    x2={Math.cos(a) * 114}
                    y2={Math.sin(a) * 114}
                    stroke="rgba(255,255,255,0.35)"
                    strokeWidth={long ? 1.6 : 0.8}
                  />
                );
              })}
              <motion.g
                initial={{ rotate: -70 }}
                animate={
                  reducedMotion
                    ? { rotate: 0 }
                    : { rotate: [-70, 48, -22, 30, -8, 62, -55, -70] }
                }
                transition={reducedMotion ? undefined : { duration: 9, repeat: Infinity, ease: 'easeInOut' }}
              >
                {/* Invisible disc centers the group's box on the pivot. */}
                <circle r="122" fill="none" />
                <line x1="0" y1="8" x2="0" y2="-118" stroke="#FFD3A1" strokeWidth="3" strokeLinecap="round" />
                <circle cy="-118" r="4" fill="#FFD3A1" />
              </motion.g>
              <circle r="11" fill="#0A0A0B" stroke="#D9894A" strokeWidth="2" />
              <text x="0" y="4" textAnchor="middle" fontSize="12" fontWeight="900" fill="#D9894A">?</text>
              <text x="-130" y="22" textAnchor="middle" fontSize="11" fontWeight="800" fill="#E05A47">
                {t('story.gauge.instinct')}
              </text>
              <text x="130" y="22" textAnchor="middle" fontSize="11" fontWeight="800" fill="#FFD3A1">
                {t('story.gauge.system')}
              </text>
            </svg>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
