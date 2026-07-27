import React from 'react';
import { Award, Factory, Network, Calculator, Building2, Users, History, GraduationCap, Quote } from 'lucide-react';
import { ThemeMode } from '../types';
import { AuthorImagePlaceholder } from './AuthorImagePlaceholder';

interface AuthorBioProps {
  theme?: ThemeMode;
}

export const AuthorBio: React.FC<AuthorBioProps> = ({ theme = 'light' }) => {
  const isLight = theme === 'light';

  return (
    <section id="author" className={`py-16 md:py-20 transition-colors duration-300 border-b ${
      isLight ? 'bg-[#FAF8F5] border-stone-300 text-stone-900' : 'bg-[#121314] border-stone-800 text-[#FAF7F2]'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className={`p-6 sm:p-10 lg:p-12 rounded-3xl border shadow-2xl relative overflow-hidden ${
          isLight ? 'bg-white border-stone-200' : 'bg-[#1E2022] border-stone-800'
        }`}>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* Right Column: Author Photo / Visual Component */}
            <div className="lg:col-span-4 flex flex-col items-center text-center space-y-4">
              <AuthorImagePlaceholder theme={theme} size="lg" />

              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-bold shadow-sm ${
                isLight ? 'bg-amber-50 border-amber-300 text-amber-950' : 'bg-stone-900 border-amber-500/30 text-amber-300'
              }`}>
                <Award className="w-4 h-4 text-[#B87333] shrink-0" />
                <span>۴۰ سال تجربه مدیریت صنعت و معماری سیستم</span>
              </div>
            </div>

            {/* Left Column: Bio Content */}
            <div className="lg:col-span-8 space-y-6 text-right">
              
              <div className="space-y-3">
                <span className="text-xs font-bold text-[#B87333] tracking-widest uppercase">
                  درباره نویسنده کتاب
                </span>
                
                <h2 className={`text-3xl sm:text-4xl font-black tracking-tight ${isLight ? 'text-stone-900' : 'text-[#FAF7F2]'}`}>
                  علی‌اصغر حکیمیان
                </h2>

                {/* 1. Badges */}
                <div className="flex flex-wrap items-center gap-2 pt-1 pb-1">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border shadow-sm ${
                    isLight ? 'bg-amber-100/80 border-amber-300 text-amber-950' : 'bg-amber-950/60 border-amber-700/60 text-amber-300'
                  }`}>
                    <Factory className="w-3.5 h-3.5 text-[#B87333]" />
                    مدیر صنعتی و متخصص بهینه‌سازی سیستم‌ها و روش‌ها
                  </span>

                  <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border shadow-sm ${
                    isLight ? 'bg-stone-100 border-stone-300 text-stone-900' : 'bg-stone-800/80 border-stone-700 text-stone-200'
                  }`}>
                    <Network className="w-3.5 h-3.5 text-[#B87333]" />
                    معمار سیستم‌های سازمانی و ERP
                  </span>

                  <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border shadow-sm ${
                    isLight ? 'bg-stone-100 border-stone-300 text-stone-900' : 'bg-stone-800/80 border-stone-700 text-stone-200'
                  }`}>
                    <Calculator className="w-3.5 h-3.5 text-[#B87333]" />
                    متخصص سیستم‌های مالی و حسابداری صنعتی
                  </span>
                </div>

                {/* Degree Expression */}
                <div className={`flex items-center gap-1.5 text-xs font-semibold ${
                  isLight ? 'text-stone-600' : 'text-stone-400'
                }`}>
                  <GraduationCap className="w-4 h-4 text-[#B87333] shrink-0" />
                  <span>دکترای حرفه‌ای مدیریت استراتژیک – دانشکده مدیریت دانشگاه تهران</span>
                </div>

                {/* Short Subtitle */}
                <p className="text-sm font-bold text-[#B87333]">
                  از کف کارخانه تا معماری سیستم‌های سازمانی
                </p>
              </div>

              {/* Quote box */}
              <div className={`p-4 sm:p-5 rounded-2xl border flex items-start gap-3.5 ${
                isLight ? 'bg-amber-50/70 border-amber-200/80' : 'bg-stone-900/90 border-stone-800'
              }`}>
                <Quote className="w-7 h-7 text-[#B87333] shrink-0 mt-0.5" />
                <p className={`text-xs sm:text-sm font-bold italic leading-relaxed ${
                  isLight ? 'text-stone-900' : 'text-[#FAF7F2]'
                }`}>
                  «تجربه، تعداد سال‌هایی نیست که مدیریت کرده‌ای؛ تعداد اشتباه‌هایی است که اجازه نداده‌ای بی‌معنا در سازمان تکرار شوند.»
                </p>
              </div>

              {/* 2. Main Bio Paragraphs */}
              <div className="space-y-3.5 text-xs sm:text-sm leading-relaxed font-normal text-justify">
                <p className={isLight ? 'text-stone-700' : 'text-stone-300'}>
                  علی‌اصغر حکیمیان بیش از چهار دهه است که سازمان را نه فقط از اتاق مدیریت، بلکه از نزدیک‌ترین فاصله با کار واقعی دیده است؛ از ماشین‌آلات و تولید تا حسابداری صنعتی، نرم‌افزار، فروش، نیروی انسانی و تصمیم‌های مدیریتی.
                </p>

                <p className={isLight ? 'text-stone-700' : 'text-stone-300'}>
                  او بنیان‌گذار یک شرکت نرم‌افزاری سازمانی با حدود ۱۵۰۰ مشتری بوده، به بیش از ۴۰ کارخانه و مجموعه تولیدی مشاوره داده و امروز نیز مستقیماً در مدیریت و تحول عملیاتی واحدهای صنعتی حضور دارد. تجربه او در نقطه‌ای شکل گرفته که ماشین، انسان، پول، داده، فرآیند و تصمیم به هم می‌رسند.
                </p>

                <p className={`font-semibold p-3.5 rounded-xl border ${
                  isLight ? 'bg-amber-50/40 border-amber-200/60 text-stone-900' : 'bg-stone-900/50 border-stone-800 text-stone-200'
                }`}>
                  «اورانگوتان +۳» حاصل همین مسیر است؛ تبدیل تجربه، خطا و اصلاح در میدان واقعی به چارچوبی برای ساختن سازمانی که یاد می‌گیرد و اشتباه را بی‌دلیل تکرار نمی‌کند.
                </p>
              </div>

              {/* 3. Feature Cards (۳ کارت) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                
                <div className={`p-4 rounded-2xl border space-y-1.5 transition-all hover:border-amber-500/40 ${
                  isLight ? 'bg-stone-50 border-stone-200' : 'bg-[#121314] border-stone-800'
                }`}>
                  <div className={`flex items-center gap-2 text-xs font-bold ${isLight ? 'text-stone-900' : 'text-[#FAF7F2]'}`}>
                    <div className="p-1.5 rounded-lg bg-amber-500/10 text-[#B87333]">
                      <Factory className="w-4 h-4" />
                    </div>
                    <span>مدیر صنعتی</span>
                  </div>
                  <p className={`text-[11px] leading-normal ${isLight ? 'text-stone-600' : 'text-stone-400'}`}>
                    تولید، بهره‌وری، رفع گلوگاه، کیفیت و تحول عملیاتی
                  </p>
                </div>

                <div className={`p-4 rounded-2xl border space-y-1.5 transition-all hover:border-amber-500/40 ${
                  isLight ? 'bg-stone-50 border-stone-200' : 'bg-[#121314] border-stone-800'
                }`}>
                  <div className={`flex items-center gap-2 text-xs font-bold ${isLight ? 'text-stone-900' : 'text-[#FAF7F2]'}`}>
                    <div className="p-1.5 rounded-lg bg-amber-500/10 text-[#B87333]">
                      <Network className="w-4 h-4" />
                    </div>
                    <span>معمار سیستم‌های سازمانی</span>
                  </div>
                  <p className={`text-[11px] leading-normal ${isLight ? 'text-stone-600' : 'text-stone-400'}`}>
                    ERP، نرم‌افزارهای مالی، تولید، فروش، انبار و فرآیند
                  </p>
                </div>

                <div className={`p-4 rounded-2xl border space-y-1.5 transition-all hover:border-amber-500/40 ${
                  isLight ? 'bg-stone-50 border-stone-200' : 'bg-[#121314] border-stone-800'
                }`}>
                  <div className={`flex items-center gap-2 text-xs font-bold ${isLight ? 'text-stone-900' : 'text-[#FAF7F2]'}`}>
                    <div className="p-1.5 rounded-lg bg-amber-500/10 text-[#B87333]">
                      <Calculator className="w-4 h-4" />
                    </div>
                    <span>متخصص سیستم‌های مالی و صنعتی</span>
                  </div>
                  <p className={`text-[11px] leading-normal ${isLight ? 'text-stone-600' : 'text-stone-400'}`}>
                    حسابداری صنعتی، بهای تمام‌شده، کنترل مالی و تصمیم‌سازی
                  </p>
                </div>

              </div>

              {/* 4. Social Proof / Highlights Row (نوار اعتبار) */}
              <div className={`mt-6 pt-6 border-t grid grid-cols-1 sm:grid-cols-3 gap-4 text-center ${
                isLight ? 'border-stone-200' : 'border-stone-800'
              }`}>
                
                <div className={`p-4 rounded-2xl border flex flex-col items-center justify-center space-y-1 ${
                  isLight ? 'bg-amber-50/50 border-amber-200/60' : 'bg-stone-900/60 border-stone-800'
                }`}>
                  <div className="flex items-center gap-1.5 text-[#B87333]">
                    <Users className="w-4 h-4" />
                    <span className="text-lg font-black tracking-tight">۱,۵۰۰+</span>
                  </div>
                  <span className={`text-xs font-bold ${isLight ? 'text-stone-800' : 'text-stone-200'}`}>
                    حدود ۱۵۰۰ مشتری سازمانی
                  </span>
                  <span className="text-[10px] text-stone-400">بنیان‌گذار شرکت نرم‌افزاری</span>
                </div>

                <div className={`p-4 rounded-2xl border flex flex-col items-center justify-center space-y-1 ${
                  isLight ? 'bg-amber-50/50 border-amber-200/60' : 'bg-stone-900/60 border-stone-800'
                }`}>
                  <div className="flex items-center gap-1.5 text-[#B87333]">
                    <Building2 className="w-4 h-4" />
                    <span className="text-lg font-black tracking-tight">۴۰+</span>
                  </div>
                  <span className={`text-xs font-bold ${isLight ? 'text-stone-800' : 'text-stone-200'}`}>
                    مشاوره به بیش از ۴۰ کارخانه و مجموعه تولیدی
                  </span>
                  <span className="text-[10px] text-stone-400">تحول و بهینه‌سازی عملیاتی</span>
                </div>

                <div className={`p-4 rounded-2xl border flex flex-col items-center justify-center space-y-1 ${
                  isLight ? 'bg-amber-50/50 border-amber-200/60' : 'bg-stone-900/60 border-stone-800'
                }`}>
                  <div className="flex items-center gap-1.5 text-[#B87333]">
                    <History className="w-4 h-4" />
                    <span className="text-lg font-black tracking-tight">۴۰+ سال</span>
                  </div>
                  <span className={`text-xs font-bold ${isLight ? 'text-stone-800' : 'text-stone-200'}`}>
                    بیش از چهار دهه تجربه میدانی در صنعت
                  </span>
                  <span className="text-[10px] text-stone-400">از کف کارخانه تا هیئت مدیره</span>
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

