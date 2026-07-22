import React from 'react';
import { Award } from 'lucide-react';
import { toPersianDigits } from '../utils/persian';
import authorImg from '../assets/author_hakimian.jpg';

interface AuthorImagePlaceholderProps {
  theme?: 'dark' | 'light';
  size?: 'sm' | 'md' | 'lg';
}

export const AuthorImagePlaceholder: React.FC<AuthorImagePlaceholderProps> = ({
  theme = 'dark',
  size = 'md'
}) => {
  const isLight = theme === 'light';

  const containerSizes = {
    sm: 'w-40 h-52',
    md: 'w-56 h-72',
    lg: 'w-72 h-96'
  }[size];

  return (
    <div className={`relative ${containerSizes} rounded-3xl bg-gradient-to-tr from-[#B87333] via-amber-600 to-stone-700 p-1 shadow-2xl group`}>
      <div className={`w-full h-full rounded-[22px] ${
        isLight ? 'bg-stone-900 text-[#FAF7F2]' : 'bg-[#121314] text-[#FAF7F2]'
      } flex flex-col items-center justify-between relative overflow-hidden border border-amber-500/30`}>
        
        {/* Glow & Accent */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#B87333]/30 rounded-full blur-2xl pointer-events-none" />

        {/* Real Portrait Image */}
        <div className="relative w-full h-full overflow-hidden rounded-[22px]">
          <img
            src={authorImg}
            alt="علی‌اصغر حکیمیان - نویسنده کتاب اورانگوتان +۳"
            className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
            referrerPolicy="no-referrer"
          />
          
          {/* Subtle Overlay Gradient for readability of overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/20 to-transparent" />

          {/* Top Badge */}
          <div className="absolute top-3 right-3 left-3 flex items-center justify-between z-10">
            <span className="text-[10px] font-bold text-amber-300 bg-stone-950/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-amber-500/30 shadow-lg">
              {toPersianDigits(40)} سال سابقه صنعت
            </span>
            <div className="p-1.5 rounded-full bg-stone-950/80 border border-amber-500/30 text-[#B87333] shadow-lg">
              <Award className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Bottom Info Overlay */}
          <div className="absolute bottom-3 right-3 left-3 text-right z-10 space-y-0.5">
            <h3 className="text-base font-extrabold text-[#FAF7F2] drop-shadow-md">
              علی‌اصغر حکیمیان
            </h3>
            <p className="text-[11px] text-amber-200/90 font-medium">
              نویسنده کتاب و مشاور ارشد سیستم‌های صنعتی
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
