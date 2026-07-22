import React from 'react';
import { BookOpen, Sparkles, Download, ArrowLeft, ShieldCheck, Award, Star, CheckCircle2, User, Zap, ChevronRight } from 'lucide-react';
import { toPersianDigits, formatCurrency } from '../utils/persian';
import { BUNDLE_DATA, BOOKS_DATA } from '../data/bookData';
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
  theme = 'dark'
}) => {
  const isLight = theme === 'light';

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
          
          {/* Right Column: Book Pitch & CTAs */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-7 space-y-6 text-right"
          >
            
            {/* Top Milestone Badge */}
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-semibold shadow-sm ${
              isLight 
                ? 'bg-white border-[#B87333]/40 text-[#B87333]' 
                : 'bg-[#1E2022] border-[#B87333]/40 text-[#B87333]'
            }`}>
              <Award className="w-4 h-4 text-[#B87333]" />
              <span>حاصل ۴۰ سال تجربه اجرایی علی‌اصغر حکیمیان در صنایع تولیدی ایران</span>
            </div>

            {/* H1 Heading */}
            <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.2] ${
              isLight ? 'text-stone-900' : 'text-[#FAF7F2]'
            }`}>
              اورانگوتان <span className="text-[#B87333]">+۳</span>
            </h1>

            {/* Subtitle */}
            <p className={`text-lg sm:text-xl font-bold leading-relaxed max-w-2xl ${
              isLight ? 'text-stone-700' : 'text-stone-300'
            }`}>
              از مدیریت غریزی تا سازمانی که یاد می‌گیرد، اصلاح می‌کند و ماندگار می‌شود
            </p>

            <p className={`text-sm sm:text-base leading-relaxed font-normal max-w-2xl ${
              isLight ? 'text-stone-600' : 'text-stone-400'
            }`}>
              نوشته <strong className={isLight ? 'text-stone-900' : 'text-[#FAF7F2]'}>علی‌اصغر حکیمیان</strong> • نقد بی‌تعارف نسخه‌های شیک مدیریتی و ارائه راهکارهای عملیاتی بومی برای پرونده‌های واقعی کارخانه‌ها، انبارها، خطوط تولید و فاکتورهای سمی فروش.
            </p>

            {/* Feature Bullet Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className={`flex items-center gap-2 text-xs sm:text-sm font-medium ${
                isLight ? 'text-stone-800' : 'text-stone-300'
              }`}>
                <CheckCircle2 className="w-4 h-4 text-[#B87333] shrink-0" />
                <span>بررسی ۷ پرونده واقعی (پودر آب‌پنیر، PVC، بلبرینگ)</span>
              </div>
              <div className={`flex items-center gap-2 text-xs sm:text-sm font-medium ${
                isLight ? 'text-stone-800' : 'text-stone-300'
              }`}>
                <CheckCircle2 className="w-4 h-4 text-[#B87333] shrink-0" />
                <span>فرمول‌های مهار خونریزی مالی انبار و سودهای تورمی</span>
              </div>
              <div className={`flex items-center gap-2 text-xs sm:text-sm font-medium ${
                isLight ? 'text-stone-800' : 'text-stone-300'
              }`}>
                <CheckCircle2 className="w-4 h-4 text-[#B87333] shrink-0" />
                <span>فصل ویژه: ۴۰ اشتباه و ۴۰ درس ۴۰ ساله مدیریت</span>
              </div>
              <div className={`flex items-center gap-2 text-xs sm:text-sm font-medium ${
                isLight ? 'text-stone-800' : 'text-stone-300'
              }`}>
                <CheckCircle2 className="w-4 h-4 text-[#B87333] shrink-0" />
                <span>عبور از تصمیم‌گیری برپایه حافظه افراد به سیستم کتبی</span>
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
                  <span>خرید پک کامل (جلد ۱ و ۲)</span>
                  <span className="bg-stone-900/40 text-amber-200 text-xs px-2 py-0.5 rounded-full font-bold">
                    {toPersianDigits(BUNDLE_DATA.discountPercentage)}٪ تخفیف
                  </span>
                </div>
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
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
                <span>دانلود نمونه ۳۶ صفحه‌ای رایگان (PDF)</span>
              </motion.button>

            </div>

            {/* Quick Tab Jump Prompts */}
            <div className="pt-3 flex flex-wrap items-center gap-4 text-xs font-semibold">
              <button
                onClick={() => onTabChange('quiz')}
                className="inline-flex items-center gap-1.5 text-[#B87333] hover:underline"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>آزمون ۵ سؤالی آنلاین غریزی</span>
              </button>
              <span className="text-stone-400">•</span>
              <button
                onClick={() => onTabChange('case-studies')}
                className="inline-flex items-center gap-1.5 text-[#B87333] hover:underline"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>مشاهده پرونده‌های صنعت</span>
              </button>
            </div>

          </motion.div>

          {/* Left Column: Interactive 3D Visual Book Covers & Author Portrait Placeholders */}
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
                    تصاویر طرح جلد و نسخه چاپ جدید
                  </span>
                </div>
                <span className="text-xs bg-[#B87333]/20 text-[#B87333] font-bold px-2.5 py-1 rounded-full">
                  ۷۲۸ صفحه
                </span>
              </div>

              {/* Book Covers Placeholder Display */}
              <div className="flex items-center justify-center gap-4">
                <BookCoverPlaceholder volume={1} size="md" theme={theme} />
                <BookCoverPlaceholder volume={2} size="md" theme={theme} />
              </div>

              {/* Author Info Banner Insert */}
              <div className={`p-4 rounded-2xl border flex items-center justify-between gap-3 ${
                isLight ? 'bg-stone-50 border-stone-200' : 'bg-stone-900/80 border-stone-800'
              }`}>
                <div className="flex items-center gap-3.5">
                  <img
                    src={authorImg}
                    alt="علی‌اصغر حکیمیان"
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-[#B87333] shrink-0 shadow-lg"
                    referrerPolicy="no-referrer"
                  />
                  <div className="space-y-1 text-right">
                    <span className={`text-sm font-bold block ${isLight ? 'text-stone-900' : 'text-[#FAF7F2]'}`}>
                      نویسنده: علی‌اصغر حکیمیان
                    </span>
                    <span className="text-xs text-[#B87333] font-bold block">
                      دکترای مدیریت استراتژیک
                    </span>
                    <span className="text-[11px] text-stone-400 block">
                      متخصص نرم‌افزار • متخصص حسابداری
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => onTabChange('author')}
                  className="text-xs text-[#B87333] hover:text-amber-400 font-bold underline shrink-0 transition-colors"
                >
                  رزومه کامل ←
                </button>
              </div>

              {/* Pricing & Add to Cart Action */}
              <div className={`p-4 rounded-xl border flex items-center justify-between ${
                isLight ? 'bg-amber-50/60 border-amber-200' : 'bg-stone-900/90 border-stone-800'
              }`}>
                <div>
                  <span className="text-xs text-stone-400 block">قیمت دوره ۲ جلدی:</span>
                  <div className="flex items-center gap-2">
                    <span className="text-stone-500 line-through text-xs font-semibold">
                      {formatCurrency(BUNDLE_DATA.originalPrice)}
                    </span>
                    <span className="text-base font-black text-[#B87333]">
                      {formatCurrency(BUNDLE_DATA.bundlePrice)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => onAddToCart('bundle-full')}
                  className="px-4 py-2.5 rounded-xl bg-[#B87333] hover:bg-amber-600 text-white font-bold text-xs shadow-md transition-all"
                >
                  افزودن پک به سبد
                </button>
              </div>

            </div>

          </motion.div>

        </div>

        {/* Dynamic Nav Tabs Quick Switch Bar */}
        <div className="mt-12 pt-8 border-t border-stone-500/20 grid grid-cols-2 sm:grid-cols-4 gap-4">
          
          <button
            onClick={() => onTabChange('framework')}
            className={`p-4 rounded-2xl border text-right transition-all group ${
              isLight 
                ? 'bg-white hover:bg-amber-50 border-stone-200 shadow-sm' 
                : 'bg-[#1E2022] hover:bg-stone-800 border-stone-800'
            }`}
          >
            <span className="text-xs font-bold text-[#B87333] block mb-1">تب دوم</span>
            <div className={`text-sm font-extrabold group-hover:text-[#B87333] transition-colors ${
              isLight ? 'text-stone-900' : 'text-[#FAF7F2]'
            }`}>
              سیمولاتور مدل +۳ ←
            </div>
            <p className="text-[11px] text-stone-400 mt-1">مشاهده، عارضه‌یابی و اصلاح اهرمی</p>
          </button>

          <button
            onClick={() => onTabChange('quiz')}
            className={`p-4 rounded-2xl border text-right transition-all group ${
              isLight 
                ? 'bg-white hover:bg-amber-50 border-stone-200 shadow-sm' 
                : 'bg-[#1E2022] hover:bg-stone-800 border-stone-800'
            }`}
          >
            <span className="text-xs font-bold text-[#B87333] block mb-1">تب سوم</span>
            <div className={`text-sm font-extrabold group-hover:text-[#B87333] transition-colors ${
              isLight ? 'text-stone-900' : 'text-[#FAF7F2]'
            }`}>
              آزمون آنلاین ۵ سؤالی ←
            </div>
            <p className="text-[11px] text-stone-400 mt-1">سنجش درصد رفتار غریزی سازمان</p>
          </button>

          <button
            onClick={() => onTabChange('case-studies')}
            className={`p-4 rounded-2xl border text-right transition-all group ${
              isLight 
                ? 'bg-white hover:bg-amber-50 border-stone-200 shadow-sm' 
                : 'bg-[#1E2022] hover:bg-stone-800 border-stone-800'
            }`}
          >
            <span className="text-xs font-bold text-[#B87333] block mb-1">تب چهارم</span>
            <div className={`text-sm font-extrabold group-hover:text-[#B87333] transition-colors ${
              isLight ? 'text-stone-900' : 'text-[#FAF7F2]'
            }`}>
              ۷ پرونده صنعتی واقعی ←
            </div>
            <p className="text-[11px] text-stone-400 mt-1">پودر آب‌پنیر، PVC، بلبرینگ و شیر مدارس</p>
          </button>

          <button
            onClick={() => onTabChange('mistakes-lessons')}
            className={`p-4 rounded-2xl border text-right transition-all group ${
              isLight 
                ? 'bg-white hover:bg-amber-50 border-stone-200 shadow-sm' 
                : 'bg-[#1E2022] hover:bg-stone-800 border-stone-800'
            }`}
          >
            <span className="text-xs font-bold text-[#B87333] block mb-1">تب ششم</span>
            <div className={`text-sm font-extrabold group-hover:text-[#B87333] transition-colors ${
              isLight ? 'text-stone-900' : 'text-[#FAF7F2]'
            }`}>
              ۴۰ اشتباه و ۴۰ درس ۴۰ ساله ←
            </div>
            <p className="text-[11px] text-stone-400 mt-1">آرشیو کامل درس‌های مدیریتی</p>
          </button>

        </div>

      </div>
    </section>
  );
};
