import React from 'react';
import { BookOpen, ShieldCheck, Truck, FileText, Phone, Mail, Globe, Heart } from 'lucide-react';
import { toPersianDigits } from '../utils/persian';
import { ActiveTab, ThemeMode } from '../types';

interface FooterProps {
  theme?: ThemeMode;
  onTabChange?: (tab: ActiveTab) => void;
}

export const Footer: React.FC<FooterProps> = ({ theme = 'light', onTabChange }) => {
  const isLight = theme === 'light';

  const handleNav = (tab: ActiveTab) => {
    if (onTabChange) {
      onTabChange(tab);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className={`border-t pt-16 pb-12 transition-colors duration-300 text-xs ${
      isLight ? 'bg-stone-100 border-stone-300 text-stone-600' : 'bg-[#0D0E0F] border-stone-800 text-stone-400'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Brand & Author Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#B87333] flex items-center justify-center font-black text-white text-lg">
                +۳
              </div>
              <span className={`text-xl font-black ${isLight ? 'text-stone-900' : 'text-[#FAF7F2]'}`}>
                اورانگوتان <span className="text-[#B87333]">+۳</span>
              </span>
            </div>

            <p className="leading-relaxed max-w-sm">
              کتاب دو جلدی «از مدیریت غریزی تا سازمانی که یاد می‌گیرد، اصلاح می‌کند و ماندگار می‌شود» نوشته علی‌اصغر حکیمیان.
            </p>

            <div className="flex items-center gap-2 font-mono text-xs text-[#B87333]">
              <Globe className="w-4 h-4 text-[#B87333]" />
              <span>orangutanplus3.com</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-3">
            <h3 className={`text-sm font-bold ${isLight ? 'text-stone-900' : 'text-[#FAF7F2]'}`}>بخش‌های وبسایت</h3>
            <ul className="space-y-2">
              <li><button onClick={() => handleNav('books')} className="hover:text-[#B87333] transition-colors">معرفی دو جلد کتاب</button></li>
              <li><button onClick={() => handleNav('framework')} className="hover:text-[#B87333] transition-colors">سیمولاتور مدل +۳</button></li>
              <li><button onClick={() => handleNav('case-studies')} className="hover:text-[#B87333] transition-colors">پرونده‌های واقعی کارخانه‌ها</button></li>
              <li><button onClick={() => handleNav('quiz')} className="hover:text-[#B87333] transition-colors">آزمون آنلاین رفتار غریزی</button></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className={`text-sm font-bold ${isLight ? 'text-stone-900' : 'text-[#FAF7F2]'}`}>ابزارها و خدمات</h3>
            <ul className="space-y-2">
              <li><button onClick={() => handleNav('cards')} className="hover:text-[#B87333] transition-colors">کارت‌های تصمیم مدیریتی</button></li>
              <li><button onClick={() => handleNav('mistakes-lessons')} className="hover:text-[#B87333] transition-colors">تالار چهل اشتباه و درس</button></li>
              <li><button onClick={() => handleNav('faq')} className="hover:text-[#B87333] transition-colors">پرسش‌ها قبل از خرید</button></li>
              <li><button onClick={() => handleNav('b2b')} className="hover:text-[#B87333] transition-colors">خرید عمده سازمانی</button></li>
              <li><button onClick={() => handleNav('author')} className="hover:text-[#B87333] transition-colors">درباره علی‌اصغر حکیمیان</button></li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div className="space-y-3">
            <h3 className={`text-sm font-bold ${isLight ? 'text-stone-900' : 'text-[#FAF7F2]'}`}>پشتیبانی و سفارشات</h3>
            <p className="leading-relaxed">
              ارسال سریع به سراسر کشور با پست پیشتاز. سفارش‌های فوق‌العاده سازمانی همراه با فاکتور رسمی حقوقی.
            </p>
            <div className="pt-2 flex items-center gap-2 text-[#B87333] font-bold">
              <Phone className="w-4 h-4" />
              <span>تلفن پشتیبانی: ۰۲۱-۸۸۹۹۰۰۱۱</span>
            </div>
          </div>

        </div>

        {/* Trust Badges */}
        <div className="pt-8 border-t border-stone-500/20 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div className="flex items-center justify-center gap-2">
            <Truck className="w-4 h-4 text-[#B87333]" />
            <span>ارسال سریع با پست پیشتاز کشوری</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>ضمانت اصالت نسخه فیزیکی کتاب</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <FileText className="w-4 h-4 text-[#B87333]" />
            <span>امکان درخواست فاکتور رسمی حقوقی</span>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-6 border-t border-stone-500/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-stone-500 text-[11px]">
          <p>
            تمامی حقوق مادی و معنوی این پلتفرم و محتوای کتاب متعلق به <strong className={isLight ? 'text-stone-900' : 'text-stone-300'}>علی‌اصغر حکیمیان</strong> (orangutanplus3.com) می‌باشد.
          </p>
          <p>
            طراحی و توسعه براساس استاندارد‌های مهارتی مدیریت ایران.
          </p>
        </div>

      </div>
    </footer>
  );
};
