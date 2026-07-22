import React from 'react';
import { BookOpen, Image, Sparkles, ShieldCheck, PenTool, Award } from 'lucide-react';
import { toPersianDigits } from '../utils/persian';

interface BookCoverProps {
  volume: 1 | 2 | 'bundle';
  title?: string;
  subtitle?: string;
  size?: 'sm' | 'md' | 'lg';
  theme?: 'dark' | 'light';
}

export const BookCoverPlaceholder: React.FC<BookCoverProps> = ({
  volume,
  title,
  subtitle,
  size = 'md',
  theme = 'dark'
}) => {
  const isLight = theme === 'light';

  // Sizing styles
  const sizeClasses = {
    sm: 'w-28 h-40 text-xs',
    md: 'w-40 h-56 text-sm',
    lg: 'w-56 h-80 text-base'
  }[size];

  if (volume === 'bundle') {
    return (
      <div className={`relative group perspective-1000 ${size === 'lg' ? 'w-64 h-84' : 'w-48 h-64'}`}>
        {/* 3D Boxset Effect */}
        <div className="relative w-full h-full rounded-2xl bg-gradient-to-br from-[#B87333] via-amber-700 to-stone-900 p-1 shadow-2xl transition-transform duration-300 group-hover:scale-105">
          <div className={`w-full h-full rounded-[14px] ${isLight ? 'bg-stone-900 text-[#FAF7F2]' : 'bg-[#121314] text-[#FAF7F2]'} p-4 flex flex-col justify-between relative overflow-hidden border border-amber-500/30`}>
            
            {/* Background Texture & Badge */}
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-[#B87333]/20 rounded-full blur-xl pointer-events-none" />
            
            <div className="flex items-center justify-between border-b border-amber-500/20 pb-2">
              <span className="text-[10px] font-black bg-[#B87333] text-white px-2 py-0.5 rounded-full tracking-wider">
                پک کامل دو جلدی
              </span>
              <BookOpen className="w-4 h-4 text-[#B87333]" />
            </div>

            {/* Book Cover Placeholder Badge */}
            <div className="my-auto text-center space-y-2">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 text-[#B87333] flex items-center justify-center mx-auto">
                <Image className="w-6 h-6" />
              </div>
              <span className="text-[10px] text-amber-300/80 font-mono block">
                [محل تصویر روی جلد پک دو جلدی]
              </span>
              <h3 className="text-base font-black text-[#FAF7F2] tracking-tight">
                اورانگوتان <span className="text-[#B87333]">+۳</span>
              </h3>
              <p className="text-[11px] text-stone-300">
                علی‌اصغر حکیمیان
              </p>
            </div>

            {/* Bottom Spine Detail */}
            <div className="pt-2 border-t border-amber-500/20 flex items-center justify-between text-[10px] text-stone-400">
              <span>۷۲۸ صفحه</span>
              <span className="text-amber-400 font-bold">۲ جلد کامل</span>
            </div>

          </div>
        </div>
      </div>
    );
  }

  const isVol1 = volume === 1;

  return (
    <div className={`relative group ${sizeClasses} rounded-2xl bg-gradient-to-tr ${
      isVol1 
        ? 'from-[#8B4513] via-amber-800 to-stone-900 border border-amber-600/40' 
        : 'from-stone-900 via-stone-800 to-[#B87333] border border-amber-500/40'
    } p-0.5 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl`}>
      
      <div className={`w-full h-full rounded-[15px] ${
        isLight ? 'bg-stone-900 text-[#FAF7F2]' : 'bg-[#181A1C] text-[#FAF7F2]'
      } p-3.5 flex flex-col justify-between relative overflow-hidden`}>
        
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-stone-800/80 pb-2">
          <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${
            isVol1 ? 'bg-[#B87333] text-white' : 'bg-amber-600 text-white'
          }`}>
            جلد {toPersianDigits(volume)}
          </span>
          <span className="text-[10px] text-stone-400 font-bold">
            {isVol1 ? '۳۸۴ صفحه' : '۳۴۴ صفحه'}
          </span>
        </div>

        {/* Center Cover Graphic Placeholder */}
        <div className="my-auto text-center space-y-1.5 py-2">
          
          <div className="w-10 h-10 rounded-xl bg-stone-800/80 border border-stone-700/80 text-[#B87333] flex items-center justify-center mx-auto shadow-inner">
            <Image className="w-5 h-5" />
          </div>

          <span className="text-[9px] text-amber-300/80 font-mono block px-1">
            [تصویر طرح جلد جلد {toPersianDigits(volume)}]
          </span>

          <h4 className="text-xs font-black text-[#FAF7F2] leading-snug">
            {isVol1 ? 'اورانگوتان +۳' : 'راهکارهای +۳'}
          </h4>

          <p className="text-[10px] text-stone-400 line-clamp-1">
            {isVol1 ? 'وضعیت غریزی و داده‌ها' : 'تولید، فروش و ۴۰ درس'}
          </p>
        </div>

        {/* Bottom Author Signature Indicator */}
        <div className="pt-2 border-t border-stone-800/80 flex items-center justify-between text-[10px] text-stone-400">
          <span className="font-semibold text-stone-300">علی‌اصغر حکیمیان</span>
          <Sparkles className="w-3 h-3 text-[#B87333]" />
        </div>

      </div>
    </div>
  );
};
