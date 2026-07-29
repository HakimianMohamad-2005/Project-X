import React from 'react';
import { BookOpen, Download, ArrowLeft, Award, CheckCircle2, Zap } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toPersianDigits, formatCurrency } from '../utils/persian';
import { BUNDLE_DATA } from '../data/bookData';
import { ActiveTab, ThemeMode } from '../types';
import { BookCoverPlaceholder } from './BookCoverPlaceholder';
import { motion } from 'motion/react';
import authorImg from '../assets/author_ali.jpg';

interface HeroProps {
  onAddToCart: (bookId: string) => void;
  onOpenSamplePdf: () => void;
  onTabChange: (tab: ActiveTab) => void;
  theme?: ThemeMode;
}

export const Hero: React.FC<HeroProps> = ({
  onAddToCart,
  onOpenSamplePdf,
  onTabChange,
  theme = 'light'
}) => {
  const { t, i18n } = useTranslation();
  const isLight = theme === 'light';
  const isEn = i18n.language === 'en';

  const formatPrice = (amount: number) => {
    if (isEn) {
      return `${amount.toLocaleString()} Toman`;
    }
    return formatCurrency(amount);
  };

  return (
    <section className={`relative overflow-hidden py-12 md:py-20 transition-colors duration-300 border-b ${
      isLight 
        ? 'bg-gradient-to-b from-[#FAF8F5] via-[#F3EFEA] to-[#FAF8F5] border-stone-300 text-stone-900' 
        : 'bg-gradient-to-b from-[#121314] via-[#1A1C1E] to-[#121314] border-stone-800 text-[#FAF7F2]'
    }`}>
      
      {/* Background Decorative Glows */}
      <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#B87333_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
      <div className="absolute top-1/4 right-10 w-96 h-96 bg-[#B87333]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Main Grid: Info + Book & Author Visuals */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Main Info Column */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-7 space-y-6 text-right ltr:text-left"
          >
            
            {/* Top Milestone Badge */}
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-semibold shadow-sm ${
              isLight 
                ? 'bg-white border-[#B87333]/40 text-[#B87333]' 
                : 'bg-[#1E2022] border-[#B87333]/40 text-[#B87333]'
            }`}>
              <Award className="w-4 h-4 text-[#B87333]" />
              <span>{t('hero.badge')}</span>
            </div>

            {/* H1 Heading */}
            <h1 className={`text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.2] ${
              isLight ? 'text-stone-900' : 'text-[#FAF7F2]'
            }`}>
              {t('hero.title')} <span className="text-[#B87333]">{t('hero.highlight')}</span>
            </h1>

            {/* Subtitle */}
            <p className={`text-lg sm:text-xl font-bold leading-relaxed max-w-2xl ${
              isLight ? 'text-stone-700' : 'text-stone-300'
            }`}>
              {t('hero.subtitle')}
            </p>

            <p className={`text-sm sm:text-base leading-relaxed font-normal max-w-2xl ${
              isLight ? 'text-stone-600' : 'text-stone-400'
            }`}>
              {t('hero.authorInfoPart1')}<strong className={isLight ? 'text-stone-900' : 'text-[#FAF7F2]'}>{t('hero.authorName')}</strong>{t('hero.authorInfoPart2')}
            </p>

            {/* Feature Bullet Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className={`flex items-center gap-2 text-xs sm:text-sm font-medium ${
                isLight ? 'text-stone-800' : 'text-stone-300'
              }`}>
                <CheckCircle2 className="w-4 h-4 text-[#B87333] shrink-0" />
                <span>{t('hero.features.f1')}</span>
              </div>
              <div className={`flex items-center gap-2 text-xs sm:text-sm font-medium ${
                isLight ? 'text-stone-800' : 'text-stone-300'
              }`}>
                <CheckCircle2 className="w-4 h-4 text-[#B87333] shrink-0" />
                <span>{t('hero.features.f2')}</span>
              </div>
              <div className={`flex items-center gap-2 text-xs sm:text-sm font-medium ${
                isLight ? 'text-stone-800' : 'text-stone-300'
              }`}>
                <CheckCircle2 className="w-4 h-4 text-[#B87333] shrink-0" />
                <span>{t('hero.features.f3')}</span>
              </div>
              <div className={`flex items-center gap-2 text-xs sm:text-sm font-medium ${
                isLight ? 'text-stone-800' : 'text-stone-300'
              }`}>
                <CheckCircle2 className="w-4 h-4 text-[#B87333] shrink-0" />
                <span>{t('hero.features.f4')}</span>
              </div>
            </div>

            {/* Call To Actions */}
            <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              
              {/* Primary CTA: Add Bundle to Cart */}
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => onAddToCart('bundle-full')}
                className="relative group overflow-hidden px-7 py-4 rounded-xl bg-gradient-to-r from-[#B87333] to-[#8B4513] text-white font-bold text-base shadow-xl shadow-[#B87333]/25 flex items-center justify-center gap-3"
              >
                <div className="flex items-center gap-2">
                  <span>{t('hero.ctaBundle')}</span>
                  <span className="bg-stone-900/40 text-amber-200 text-xs px-2 py-0.5 rounded-full font-bold">
                    {t('hero.discountBadge')}
                  </span>
                </div>
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 ltr:rotate-180 transition-transform" />
              </motion.button>

              {/* Secondary CTA: Download Sample PDF */}
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={onOpenSamplePdf}
                className={`px-6 py-4 rounded-xl font-semibold text-sm border transition-all flex items-center justify-center gap-2 ${
                  isLight
                    ? 'bg-white hover:bg-stone-100 text-stone-800 border-stone-300 shadow-sm'
                    : 'bg-[#1E2022] hover:bg-stone-800 text-stone-200 border-stone-700'
                }`}
              >
                <Download className="w-4 h-4 text-[#B87333]" />
                <span>{t('hero.ctaSamplePdf')}</span>
              </motion.button>

            </div>

            {/* Quick Tab Jump Prompts */}
            <div className="pt-3 flex flex-wrap items-center gap-4 text-xs font-semibold">
              <button
                onClick={() => onTabChange('quiz')}
                className="inline-flex items-center gap-1.5 text-[#B87333] hover:underline"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>{t('hero.quickJumpQuiz')}</span>
              </button>
              <span className="text-stone-400">•</span>
              <button
                onClick={() => onTabChange('case-studies')}
                className="inline-flex items-center gap-1.5 text-[#B87333] hover:underline"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>{t('hero.quickJumpCases')}</span>
              </button>
            </div>

          </motion.div>

          {/* Left Column: Visual Book Covers & Author Portrait */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-5 relative space-y-6"
          >
            
            {/* Visual Boxset & Covers Showcase */}
            <div className={`p-6 rounded-3xl border shadow-2xl space-y-6 relative overflow-hidden ${
              isLight ? 'bg-white border-stone-200' : 'bg-[#1E2022]/90 border-stone-800'
            }`}>
              
              <div className="flex items-center justify-between pb-3 border-b border-stone-500/20">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-[#B87333]" />
                  <span className={`text-sm font-bold ${isLight ? 'text-stone-900' : 'text-[#FAF7F2]'}`}>
                    {t('hero.showcaseTitle')}
                  </span>
                </div>
                <span className="text-xs bg-[#B87333]/20 text-[#B87333] font-bold px-2.5 py-1 rounded-full">
                  {t('hero.totalPagesBadge')}
                </span>
              </div>

              {/* Book Covers Display */}
              <div className="flex items-center justify-center gap-3 sm:gap-8 py-2">
                <BookCoverPlaceholder volume={1} size="lg" theme={theme} />
                <BookCoverPlaceholder volume={2} size="lg" theme={theme} />
              </div>

              {/* Author Info Banner Insert */}
              <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 ${
                isLight ? 'bg-stone-50 border-stone-200' : 'bg-stone-900/80 border-stone-800'
              }`}>
                <div className="flex items-center gap-3">
                  <img
                    src={authorImg}
                    alt={t('hero.authorName')}
                    className="w-14 h-14 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-[#B87333] shrink-0 shadow-lg"
                    referrerPolicy="no-referrer"
                  />
                  <div className="space-y-1 text-right ltr:text-left">
                    <span className={`text-sm font-bold block ${isLight ? 'text-stone-900' : 'text-[#FAF7F2]'}`}>
                      {t('hero.authorCardName')}
                    </span>
                    <span className="text-xs text-[#B87333] font-bold block">
                      {t('hero.authorCardDegree')}
                    </span>
                    <span className="text-[11px] text-stone-400 block">
                      {t('hero.authorCardSpec')}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => onTabChange('author')}
                  className="text-xs text-[#B87333] hover:text-amber-400 font-bold underline shrink-0 transition-colors text-left sm:text-right ltr:text-right"
                >
                  {t('hero.authorResumeBtn')}
                </button>
              </div>

              {/* Pricing & Add to Cart Action */}
              <div className={`p-4 rounded-xl border flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 ${
                isLight ? 'bg-amber-50/60 border-amber-200' : 'bg-stone-900/90 border-stone-800'
              }`}>
                <div>
                  <span className="text-xs text-stone-400 block">{t('hero.bundlePriceLabel')}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-stone-500 line-through text-xs font-semibold">
                      {formatPrice(BUNDLE_DATA.originalPrice)}
                    </span>
                    <span className="text-base font-black text-[#B87333]">
                      {formatPrice(BUNDLE_DATA.bundlePrice)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => onAddToCart('bundle-full')}
                  className="px-4 py-2.5 rounded-xl bg-[#B87333] hover:bg-amber-600 text-white font-bold text-xs shadow-md transition-all text-center"
                >
                  {t('hero.addBundleBtn')}
                </button>
              </div>

            </div>

          </motion.div>

        </div>

        {/* Dynamic Nav Tabs Quick Switch Bar */}
        <div className="mt-12 pt-8 border-t border-stone-500/20 grid grid-cols-2 sm:grid-cols-4 gap-4">
          
          <button
            onClick={() => onTabChange('framework')}
            className={`p-4 rounded-2xl border text-right ltr:text-left transition-all group ${
              isLight 
                ? 'bg-white hover:bg-amber-50 border-stone-200 shadow-sm' 
                : 'bg-[#1E2022] hover:bg-stone-800 border-stone-800'
            }`}
          >
            <span className="text-xs font-bold text-[#B87333] block mb-1">{t('hero.tabs.tab2Badge')}</span>
            <div className={`text-sm font-extrabold group-hover:text-[#B87333] transition-colors ${
              isLight ? 'text-stone-900' : 'text-[#FAF7F2]'
            }`}>
              {t('hero.tabs.tab2Title')}
            </div>
            <p className="text-[11px] text-stone-400 mt-1">{t('hero.tabs.tab2Desc')}</p>
          </button>

          <button
            onClick={() => onTabChange('quiz')}
            className={`p-4 rounded-2xl border text-right ltr:text-left transition-all group ${
              isLight 
                ? 'bg-white hover:bg-amber-50 border-stone-200 shadow-sm' 
                : 'bg-[#1E2022] hover:bg-stone-800 border-stone-800'
            }`}
          >
            <span className="text-xs font-bold text-[#B87333] block mb-1">{t('hero.tabs.tab3Badge')}</span>
            <div className={`text-sm font-extrabold group-hover:text-[#B87333] transition-colors ${
              isLight ? 'text-stone-900' : 'text-[#FAF7F2]'
            }`}>
              {t('hero.tabs.tab3Title')}
            </div>
            <p className="text-[11px] text-stone-400 mt-1">{t('hero.tabs.tab3Desc')}</p>
          </button>

          <button
            onClick={() => onTabChange('case-studies')}
            className={`p-4 rounded-2xl border text-right ltr:text-left transition-all group ${
              isLight 
                ? 'bg-white hover:bg-amber-50 border-stone-200 shadow-sm' 
                : 'bg-[#1E2022] hover:bg-stone-800 border-stone-800'
            }`}
          >
            <span className="text-xs font-bold text-[#B87333] block mb-1">{t('hero.tabs.tab4Badge')}</span>
            <div className={`text-sm font-extrabold group-hover:text-[#B87333] transition-colors ${
              isLight ? 'text-stone-900' : 'text-[#FAF7F2]'
            }`}>
              {t('hero.tabs.tab4Title')}
            </div>
            <p className="text-[11px] text-stone-400 mt-1">{t('hero.tabs.tab4Desc')}</p>
          </button>

          <button
            onClick={() => onTabChange('mistakes-lessons')}
            className={`p-4 rounded-2xl border text-right ltr:text-left transition-all group ${
              isLight 
                ? 'bg-white hover:bg-amber-50 border-stone-200 shadow-sm' 
                : 'bg-[#1E2022] hover:bg-stone-800 border-stone-800'
            }`}
          >
            <span className="text-xs font-bold text-[#B87333] block mb-1">{t('hero.tabs.tab6Badge')}</span>
            <div className={`text-sm font-extrabold group-hover:text-[#B87333] transition-colors ${
              isLight ? 'text-stone-900' : 'text-[#FAF7F2]'
            }`}>
              {t('hero.tabs.tab6Title')}
            </div>
            <p className="text-[11px] text-stone-400 mt-1">{t('hero.tabs.tab6Desc')}</p>
          </button>

        </div>

      </div>
    </section>
  );
};
