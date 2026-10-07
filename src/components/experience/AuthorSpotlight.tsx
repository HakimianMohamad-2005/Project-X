import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { ArrowLeft, GraduationCap } from 'lucide-react';
import { ActiveTab } from '../../types';
import { FlashlightPortrait } from './FlashlightPortrait';

export const AuthorSpotlight: React.FC<{ onTabChange: (tab: ActiveTab) => void }> = ({ onTabChange }) => {
  const { t } = useTranslation();
  const stats = [
    { value: t('author.stats.yearsCount'), label: t('author.stats.yearsLabel') },
    { value: t('author.stats.factoriesCount'), label: t('author.stats.factoriesLabel') },
    { value: t('author.stats.clientsCount'), label: t('author.stats.clientsLabel') },
  ];

  return (
    <section className="relative bg-[#0A0A0B] text-[#FAF7F2] py-20 sm:py-28 overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#B87333]/40 to-transparent" />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
        {/* Portrait with a light the visitor holds */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="lg:col-span-5"
        >
          <FlashlightPortrait className="aspect-[4/5] w-full max-w-md mx-auto" />
        </motion.div>

        {/* Words */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="lg:col-span-7 space-y-7 text-start"
        >
          <span className="text-[11px] sm:text-xs font-black tracking-[0.25em] uppercase text-[#D9894A]">
            {t('story.author.kicker')}
          </span>
          <blockquote className="relative border-s-2 border-[#B87333]/60 ps-5 sm:ps-7 text-2xl sm:text-3xl lg:text-[2.1rem] font-extrabold leading-[1.7] text-stone-100">
            {t('author.quote')}
          </blockquote>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="text-xl font-black">{t('author.name')}</span>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-400">
              <GraduationCap className="w-4 h-4 text-[#D9894A]" />
              {t('author.degree')}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-2">
            {stats.map((s, i) => (
              <div key={i} className="rounded-2xl border border-white/10 bg-white/[0.03] p-3 sm:p-4">
                <div className="text-xl sm:text-3xl font-black text-[#E8A672] tabular-nums">{s.value}</div>
                <div className="mt-1 text-[10px] sm:text-xs leading-5 text-stone-400">{s.label}</div>
              </div>
            ))}
          </div>

          <button
            onClick={() => onTabChange('author')}
            className="group inline-flex items-center gap-2 rounded-2xl border border-[#D9894A]/40 px-5 py-3 text-sm font-bold text-[#E8A672] hover:bg-[#D9894A]/10 transition-colors"
          >
            {t('story.author.cta')}
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1 ltr:rotate-180 ltr:group-hover:translate-x-1" />
          </button>
        </motion.div>
      </div>
    </section>
  );
};
