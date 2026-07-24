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
        {/* 3D Boxset / Stacked Books Effect */}
        <div className="relative w-full h-full rounded-2xl bg-gradient-to-br from-[#B87333] via-amber-700 to-stone-900 p-1 shadow-2xl transition-transform duration-300 group-hover:scale-105">
          <div className={`w-full h-full rounded-[14px] ${isLight ? 'bg-stone-900 text-[#FAF7F2]' : 'bg-[#121314] text-[#FAF7F2]'} flex flex-col justify-between relative overflow-hidden border border-amber-500/30`}>
            
            {/* Real Cover Image Overlay */}
            <div className="relative w-full h-full overflow-hidden rounded-[13px]">
              <img
                src="/Jeld%20-%20Front.png"
                alt="پک کامل کتاب اورانگوتان +۳"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/20 to-transparent flex flex-col justify-between p-3.5">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-black bg-[#B87333] text-white px-2 py-0.5 rounded-full shadow">
                    دوره کامل ۲ جلدی
                  </span>
                  <BookOpen className="w-4 h-4 text-amber-400 drop-shadow" />
                </div>
                <div className="text-right space-y-0.5">
                  <p className="text-[10px] text-amber-300 font-bold">مجموع ۷۲۸ صفحه • هاردکاور</p>
                  <p className="text-xs font-black text-white">علی‌اصغر حکیمیان</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    );
  }

  const isVol1 = volume === 1;

  if (isVol1) {
    return (
      <div className={`relative group ${sizeClasses} rounded-2xl bg-gradient-to-tr from-[#8B4513] via-amber-800 to-stone-900 p-0.5 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl`}>
        <div className="w-full h-full rounded-[15px] overflow-hidden relative shadow-inner bg-stone-900">
          <img
            src="/Jeld%20-%20Front.png"
            alt="طرح جلد کتاب اورانگوتان +۳ جلد اول - علی‌اصغر حکیمیان"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            referrerPolicy="no-referrer"
          />
          {/* Subtle Spine Highlight & Shadow */}
          <div className="absolute inset-y-0 right-0 w-2 bg-gradient-to-l from-black/40 to-transparent pointer-events-none" />
          <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-r from-white/20 to-transparent pointer-events-none" />
        </div>
      </div>
    );
  }

  return (
    <div className={`relative group ${sizeClasses} rounded-2xl bg-gradient-to-tr from-stone-900 via-stone-800 to-[#B87333] border border-amber-500/40 p-0.5 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl`}>
      
      <div className={`w-full h-full rounded-[15px] ${
        isLight ? 'bg-stone-900 text-[#FAF7F2]' : 'bg-[#181A1C] text-[#FAF7F2]'
      } p-3.5 flex flex-col justify-between relative overflow-hidden`}>
        
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-stone-800/80 pb-2">
          <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-amber-600 text-white">
            جلد ۲
          </span>
          <span className="text-[10px] text-stone-400 font-bold">
            ۳۴۴ صفحه
          </span>
        </div>

        {/* Center Cover Graphic Placeholder for Vol 2 */}
        <div className="my-auto text-center space-y-1.5 py-2">
          
          <div className="w-10 h-10 rounded-xl bg-stone-800/80 border border-stone-700/80 text-[#B87333] flex items-center justify-center mx-auto shadow-inner">
            <BookOpen className="w-5 h-5 text-amber-400" />
          </div>

          <h4 className="text-xs font-black text-[#FAF7F2] leading-snug">
            راهکارهای +۳
          </h4>

          <p className="text-[10px] text-stone-400 line-clamp-2">
            تولید، فروش و ۴۰ درس
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
