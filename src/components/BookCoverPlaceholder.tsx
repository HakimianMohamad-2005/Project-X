import React, { useState } from 'react';
import { BookOpen, Image, Sparkles, ShieldCheck, PenTool, Award, TouchpadIcon } from 'lucide-react';
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
  theme = 'light'
}) => {
  const isLight = theme === 'light';
  const [isOpen, setIsOpen] = useState(false);

  // Sizing styles (Enlarged)
  const sizeClasses = {
    sm: 'w-32 h-48 text-xs',
    md: 'w-48 h-72 sm:w-52 sm:h-76 text-sm',
    lg: 'w-60 h-88 sm:w-64 sm:h-96 text-base'
  }[size];

  if (volume === 'bundle') {
    return (
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`relative group [perspective:1200px] cursor-pointer ${size === 'lg' ? 'w-64 h-96' : 'w-52 h-76'}`}
      >
        {/* 3D Boxset / Stacked Books Effect */}
        <div className={`relative w-full h-full rounded-2xl bg-gradient-to-br from-[#B87333] via-amber-700 to-stone-900 p-1 shadow-2xl transition-all duration-700 [transform-style:preserve-3d] ${
          isOpen 
            ? '[transform:rotateY(-14deg)_rotateX(6deg)_scale(1.05)]' 
            : 'group-hover:[transform:rotateY(-14deg)_rotateX(6deg)_scale(1.05)]'
        }`}>
          <div className={`w-full h-full rounded-[14px] ${isLight ? 'bg-stone-900 text-[#FAF7F2]' : 'bg-[#121314] text-[#FAF7F2]'} flex relative overflow-hidden border border-amber-500/30`}>
            
            {/* Split Covers Effect for Vol 1 & Vol 2 Bundle */}
            <div className="relative w-1/2 h-full overflow-hidden border-r border-amber-500/40">
              <img
                src="/Jeld%20-%20Front.png"
                alt="جلد اول کتاب اورانگوتان +۳"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <span className="absolute top-2 right-2 text-[9px] font-black bg-black/70 text-amber-300 px-1.5 py-0.5 rounded backdrop-blur">جلد ۱</span>
            </div>

            <div className="relative w-1/2 h-full overflow-hidden">
              <img
                src="/Jeld2%20-%20Front.png"
                alt="جلد دوم کتاب اورانگوتان +۳"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <span className="absolute top-2 left-2 text-[9px] font-black bg-black/70 text-amber-300 px-1.5 py-0.5 rounded backdrop-blur">جلد ۲</span>
            </div>

            {/* Overlay Badge */}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-stone-950 via-stone-950/80 to-transparent p-3 text-right">
              <span className="text-[10px] font-black bg-[#B87333] text-white px-2 py-0.5 rounded-full shadow">
                دوره کامل ۲ جلدی
              </span>
              <p className="text-[11px] font-bold text-white mt-1">مجموع ۷۲۸ صفحه • نویسنده: علی‌اصغر حکیمیان</p>
            </div>

          </div>
        </div>
      </div>
    );
  }

  const isVol1 = volume === 1;

  if (isVol1) {
    return (
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`relative group ${sizeClasses} [perspective:1200px] cursor-pointer select-none`}
      >
        {/* Main 3D Book Wrapper */}
        <div className={`relative w-full h-full transition-all duration-1000 ease-out [transform-style:preserve-3d] shadow-2xl rounded-2xl ${
          isOpen
            ? '[transform:rotateY(-18deg)_rotateX(8deg)_scale(1.06)]'
            : 'group-hover:[transform:rotateY(-18deg)_rotateX(8deg)_scale(1.06)]'
        }`}>
          
          {/* Inner Pages (Visible when cover swings open) */}
          <div className="absolute inset-0 rounded-2xl bg-[#FAF6EE] text-stone-900 border-2 border-stone-300/80 p-4 flex flex-col justify-between overflow-hidden shadow-inner">
            {/* Paper Texture Lines */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:12px_12px] pointer-events-none" />

            <div className="relative z-0 text-right space-y-2 pr-2 pt-2">
              <div className="flex items-center justify-between border-b border-amber-800/20 pb-1.5">
                <span className="text-[10px] font-extrabold text-[#8B4513] tracking-tight">جلد اول • صفحه اول</span>
                <Sparkles className="w-3.5 h-3.5 text-amber-700" />
              </div>
              <h4 className="text-sm font-black text-stone-900 leading-tight">
                اورانگوتان <span className="text-[#8B4513]">+۳</span>
              </h4>
              <p className="text-[11px] font-bold text-amber-900">
                فصل ۱: وضعیت اورانگوتانی چیست؟
              </p>
              <p className="text-[10px] text-stone-700 leading-relaxed font-serif line-clamp-4">
                «در هر سازمانی که تصمیم‌گیری بر اساس هیجان، شایعه و حس غریزی باشد، اتلاف مالی پنهان رخ می‌دهد. خودآگاهی اولین گام برای درمان خونریزی مالی است...»
              </p>
            </div>

            <div className="relative z-0 pt-2 border-t border-amber-800/20 flex items-center justify-between text-[10px] text-stone-600 font-bold">
              <span>علی‌اصغر حکیمیان</span>
              <span className="text-[#8B4513]">۳۸۴ صفحه</span>
            </div>
          </div>

          {/* Paper Thickness Effect (3D Side Edges) */}
          <div className="absolute top-1 bottom-1 left-0.5 w-3 bg-gradient-to-r from-stone-200 via-amber-50 to-stone-300 rounded-l border-r border-stone-400/50 shadow-md pointer-events-none [transform:translateZ(-2px)]" />

          {/* Front Cover (Opens 3D on Hover or Tap) */}
          <div className={`absolute inset-0 rounded-2xl bg-stone-900 [transform-origin:right_center] transition-transform duration-1000 [transition-timing-function:cubic-bezier(0.25,1,0.5,1)] [transform-style:preserve-3d] shadow-2xl overflow-hidden border border-amber-600/30 ${
            isOpen 
              ? '[transform:rotateY(135deg)]' 
              : 'group-hover:[transform:rotateY(135deg)]'
          }`}>
            <img
              src="/Jeld%20-%20Front.png"
              alt="طرح جلد کتاب اورانگوتان +۳ جلد اول - علی‌اصغر حکیمیان"
              className="w-full h-full object-cover rounded-2xl"
              referrerPolicy="no-referrer"
            />
            
            {/* Spine Shadow Effect */}
            <div className="absolute inset-y-0 right-0 w-3 bg-gradient-to-l from-black/60 to-transparent pointer-events-none" />
            <div className="absolute inset-y-0 left-0 w-1.5 bg-gradient-to-r from-white/30 to-transparent pointer-events-none" />

            {/* Subtle Hover/Touch Hint Badge */}
            <div className={`absolute bottom-3 left-3 right-3 bg-black/75 backdrop-blur-md text-amber-300 text-[10px] font-bold py-1.5 px-2.5 rounded-lg text-center transition-all duration-300 flex items-center justify-center gap-1.5 border border-amber-500/30 shadow-lg ${
              isOpen ? 'opacity-0' : 'opacity-90 sm:opacity-0 sm:group-hover:opacity-100'
            }`}>
              <BookOpen className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>{isOpen ? 'بستن جلد' : 'لمس کنید تا باز شود'}</span>
            </div>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div 
      onClick={() => setIsOpen(!isOpen)}
      className={`relative group ${sizeClasses} [perspective:1200px] cursor-pointer select-none`}
    >
      {/* Main 3D Book Wrapper */}
      <div className={`relative w-full h-full transition-all duration-1000 ease-out [transform-style:preserve-3d] shadow-2xl rounded-2xl ${
        isOpen
          ? '[transform:rotateY(-18deg)_rotateX(8deg)_scale(1.06)]'
          : 'group-hover:[transform:rotateY(-18deg)_rotateX(8deg)_scale(1.06)]'
      }`}>
        
        {/* Inner Pages (Visible when cover swings open) */}
        <div className="absolute inset-0 rounded-2xl bg-[#FAF6EE] text-stone-900 border-2 border-stone-300/80 p-4 flex flex-col justify-between overflow-hidden shadow-inner">
          {/* Paper Texture Lines */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:12px_12px] pointer-events-none" />

          <div className="relative z-0 text-right space-y-2 pr-2 pt-2">
            <div className="flex items-center justify-between border-b border-amber-800/20 pb-1.5">
              <span className="text-[10px] font-extrabold text-[#8B4513] tracking-tight">جلد دوم • صفحه اول</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-700" />
            </div>
            <h4 className="text-sm font-black text-stone-900 leading-tight">
              راهکارهای <span className="text-[#8B4513]">+۳</span>
            </h4>
            <p className="text-[11px] font-bold text-amber-900">
              فصل ۲۰: نقشه راه پایداری و رشد +۳
            </p>
            <p className="text-[10px] text-stone-700 leading-relaxed font-serif line-clamp-4">
              «وقتی سیستم مدیریتی بر پایه داده‌های شفاف و معماری سازمان یادگیرنده بنا شود، رشد پایدار اتفاق می‌افتد و سازمان بدون وابسته بودن به اشخاص اداره می‌شود...»
            </p>
          </div>

          <div className="relative z-0 pt-2 border-t border-amber-800/20 flex items-center justify-between text-[10px] text-stone-600 font-bold">
            <span>علی‌اصغر حکیمیان</span>
            <span className="text-[#8B4513]">۳۴۴ صفحه</span>
          </div>
        </div>

        {/* Paper Thickness Effect (3D Side Edges) */}
        <div className="absolute top-1 bottom-1 left-0.5 w-3 bg-gradient-to-r from-stone-200 via-amber-50 to-stone-300 rounded-l border-r border-stone-400/50 shadow-md pointer-events-none [transform:translateZ(-2px)]" />

        {/* Front Cover (Opens 3D on Hover or Tap) */}
        <div className={`absolute inset-0 rounded-2xl bg-stone-900 [transform-origin:right_center] transition-transform duration-1000 [transition-timing-function:cubic-bezier(0.25,1,0.5,1)] [transform-style:preserve-3d] shadow-2xl overflow-hidden border border-amber-600/30 ${
          isOpen 
            ? '[transform:rotateY(135deg)]' 
            : 'group-hover:[transform:rotateY(135deg)]'
        }`}>
          <img
            src="/Jeld2%20-%20Front.png"
            alt="طرح جلد کتاب اورانگوتان +۳ جلد دوم - علی‌اصغر حکیمیان"
            className="w-full h-full object-cover rounded-2xl"
            referrerPolicy="no-referrer"
          />
          
          {/* Spine Shadow Effect */}
          <div className="absolute inset-y-0 right-0 w-3 bg-gradient-to-l from-black/60 to-transparent pointer-events-none" />
          <div className="absolute inset-y-0 left-0 w-1.5 bg-gradient-to-r from-white/30 to-transparent pointer-events-none" />

          {/* Subtle Hover/Touch Hint Badge */}
          <div className={`absolute bottom-3 left-3 right-3 bg-black/75 backdrop-blur-md text-amber-300 text-[10px] font-bold py-1.5 px-2.5 rounded-lg text-center transition-all duration-300 flex items-center justify-center gap-1.5 border border-amber-500/30 shadow-lg ${
            isOpen ? 'opacity-0' : 'opacity-90 sm:opacity-0 sm:group-hover:opacity-100'
          }`}>
            <BookOpen className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>{isOpen ? 'بستن جلد' : 'لمس کنید تا باز شود'}</span>
          </div>
        </div>

      </div>
    </div>
  );
};

