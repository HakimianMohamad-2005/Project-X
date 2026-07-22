import React from 'react';
import { Award, Briefcase, Quote, CheckCircle2, Factory, Code2, LineChart } from 'lucide-react';
import { toPersianDigits } from '../utils/persian';
import { ThemeMode } from '../types';
import { AuthorImagePlaceholder } from './AuthorImagePlaceholder';
import { motion } from 'motion/react';

interface AuthorBioProps {
  theme?: ThemeMode;
}

export const AuthorBio: React.FC<AuthorBioProps> = ({ theme = 'dark' }) => {
  const isLight = theme === 'light';

  return (
    <section id="author" className={`py-16 md:py-20 transition-colors duration-300 border-b ${
      isLight ? 'bg-[#FAF8F5] border-stone-300 text-stone-900' : 'bg-[#121314] border-stone-800 text-[#FAF7F2]'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className={`p-8 sm:p-12 rounded-3xl border shadow-2xl relative overflow-hidden ${
          isLight ? 'bg-white border-stone-200' : 'bg-[#1E2022] border-stone-800'
        }`}>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Right Column: Author Photo / Visual Placeholder Component */}
            <div className="lg:col-span-4 flex flex-col items-center text-center space-y-4">
              <AuthorImagePlaceholder theme={theme} size="lg" />

              <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-bold ${
                isLight ? 'bg-amber-100 border-amber-300 text-amber-900' : 'bg-stone-900 border-stone-800 text-amber-400'
              }`}>
                <Award className="w-4 h-4 text-[#B87333]" />
                <span>۴۰ سال تجربه مدیریت صنعت و نرم‌افزار</span>
              </div>
            </div>

            {/* Left Column: Bio Content */}
            <div className="lg:col-span-8 space-y-6 text-right">
              
              <div className="space-y-3">
                <span className="text-xs font-bold text-[#B87333] tracking-widest uppercase">
                  درباره نویسنده کتاب
                </span>
                <h2 className={`text-3xl font-extrabold ${isLight ? 'text-stone-900' : 'text-[#FAF7F2]'}`}>
                  علی‌اصغر حکیمیان
                </h2>

                {/* Professional Titles & Credentials */}
                <div className="flex flex-wrap items-center gap-2 pt-1 pb-1">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border shadow-sm ${
                    isLight ? 'bg-amber-100/80 border-amber-300 text-amber-950' : 'bg-amber-950/60 border-amber-700/60 text-amber-300'
                  }`}>
                    🎓 دکترای مدیریت استراتژیک
                  </span>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border shadow-sm ${
                    isLight ? 'bg-stone-100 border-stone-300 text-stone-900' : 'bg-stone-800/80 border-stone-700 text-stone-200'
                  }`}>
                    💻 متخصص نرم‌افزار
                  </span>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border shadow-sm ${
                    isLight ? 'bg-stone-100 border-stone-300 text-stone-900' : 'bg-stone-800/80 border-stone-700 text-stone-200'
                  }`}>
                    📊 متخصص حسابداری
                  </span>
                </div>

                <p className="text-xs text-stone-400 font-medium">
                  حاصل چهار دهه فعالیت اجرایی و راهبردی در مدیریت استراتژیک، توسعه نرم‌افزار و سیستم‌های حسابداری و مالی
                </p>
              </div>

              <div className={`p-5 rounded-2xl border flex items-start gap-4 ${
                isLight ? 'bg-amber-50/70 border-amber-200' : 'bg-stone-900/90 border-stone-800'
              }`}>
                <Quote className="w-8 h-8 text-[#B87333] shrink-0 mt-1" />
                <p className={`text-sm sm:text-base font-bold italic leading-relaxed ${
                  isLight ? 'text-stone-900' : 'text-[#FAF7F2]'
                }`}>
                  «تجربه، تعداد سال‌هایی نیست که مدیریت کرده‌ای؛ تعداد اشتباه‌هایی است که اجازه نداده‌ای بی‌معنا در سازمان تکرار شوند.»
                </p>
              </div>

              <p className={`text-xs sm:text-sm leading-relaxed font-normal ${
                isLight ? 'text-stone-700' : 'text-stone-300'
              }`}>
                دکتر علی‌اصغر حکیمیان دارای دکترای مدیریت استراتژیک، متخصص نرم‌افزار و متخصص حسابداری است. او با بیش از ۴۰ سال سابقه ارزنده‌ی مدیریتی، مشاوره و اجرای پروژه‌های کلان، ترکیب کم‌نظیری از تفکر استراتژیک مدیریتی، تسلط بر فناوری‌های نرم‌افزاری و تحلیل‌های دقیق مالی و حسابداری را در مجموعه کتاب «اورانگوتان +۳» گرد آورده است.
              </p>

              {/* Experience Highlights Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                
                <div className={`p-3.5 rounded-2xl border space-y-1 ${
                  isLight ? 'bg-stone-50 border-stone-200' : 'bg-[#121314] border-stone-800'
                }`}>
                  <div className={`flex items-center gap-2 text-xs font-bold ${isLight ? 'text-stone-900' : 'text-[#FAF7F2]'}`}>
                    <Award className="w-4 h-4 text-[#B87333]" />
                    <span>دکترای مدیریت استراتژیک</span>
                  </div>
                  <p className="text-[11px] text-stone-400">
                    عارضه‌یابی ساختاری، تحلیل الگوی تصمیم‌گیری و راهبری تغییرات ماندگار در سازمان.
                  </p>
                </div>

                <div className={`p-3.5 rounded-2xl border space-y-1 ${
                  isLight ? 'bg-stone-50 border-stone-200' : 'bg-[#121314] border-stone-800'
                }`}>
                  <div className={`flex items-center gap-2 text-xs font-bold ${isLight ? 'text-stone-900' : 'text-[#FAF7F2]'}`}>
                    <Code2 className="w-4 h-4 text-[#B87333]" />
                    <span>متخصص نرم‌افزار</span>
                  </div>
                  <p className="text-[11px] text-stone-400">
                    طراحی سامانه‌های یکپارچه صنعتی، سیستم‌های ثبت داده و اتوماسیون فرایندها.
                  </p>
                </div>

                <div className={`p-3.5 rounded-2xl border space-y-1 ${
                  isLight ? 'bg-stone-50 border-stone-200' : 'bg-[#121314] border-stone-800'
                }`}>
                  <div className={`flex items-center gap-2 text-xs font-bold ${isLight ? 'text-stone-900' : 'text-[#FAF7F2]'}`}>
                    <LineChart className="w-4 h-4 text-[#B87333]" />
                    <span>متخصص حسابداری</span>
                  </div>
                  <p className="text-[11px] text-stone-400">
                    کنترل نشت مالی انبارها، تفکیک سود عملیاتی از تورمی و بهینه‌سازی جریان نقدینگی.
                  </p>
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
