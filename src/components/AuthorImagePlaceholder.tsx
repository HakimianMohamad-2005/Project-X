import React from 'react';
import { Award } from 'lucide-react';
import { toPersianDigits } from '../utils/persian';
import authorImg from '../assets/author_ali.jpg';

interface AuthorImagePlaceholderProps {
  theme?: 'dark' | 'light';
  size?: 'sm' | 'md' | 'lg';
}

export const AuthorImagePlaceholder: React.FC<AuthorImagePlaceholderProps> = ({
  theme = 'light',
  size = 'md'
}) => {
  const isLight = theme === 'light';

  const containerSizes = {
    sm: 'w-48 h-64',
    md: 'w-64 h-80',
    lg: 'w-72 h-96'
  }[size];

  return (
    <div className={`relative ${containerSizes} rounded-3xl bg-gradient-to-tr from-[#B87333] via-amber-600 to-stone-700 p-1 shadow-2xl group`}>
      <div className={`w-full h-full rounded-[22px] ${
        isLight ? 'bg-stone-900 text-[#FAF7F2]' : 'bg-[#121314] text-[#FAF7F2]'
      } relative overflow-hidden border border-amber-500/30 flex flex-col`}>
        
        {/* Real Portrait Image */}
        <div className="relative w-full h-full overflow-hidden">
          <img
            src={authorImg}
            alt="علی‌اصغر حکیمیان - نویسنده کتاب اورانگوتان +۳"
            className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
            referrerPolicy="no-referrer"
          />
          
          {/* Subtle bottom gradient overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/20 to-transparent pointer-events-none" />

          {/* Top Badge */}
          <div className="absolute top-3 right-3 left-3 flex items-center justify-between z-10 pointer-events-none">
            <span className="text-[10px] font-bold text-amber-300 bg-stone-950/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-amber-500/30 shadow-lg">
              ۴۰+ سال تجربه صنعتی و مدیریتی
            </span>
            <div className="p-1.5 rounded-full bg-stone-950/80 border border-amber-500/30 text-[#B87333] shadow-lg">
              <Award className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Bottom Info Overlay */}
          <div className="absolute bottom-3 right-3 left-3 text-right z-10 space-y-0.5 pointer-events-none">
            <h3 className="text-base font-extrabold text-[#FAF7F2] drop-shadow-md">
              علی‌اصغر حکیمیان
            </h3>
            <p className="text-[11px] text-amber-300 font-bold drop-shadow">
              مدیر صنعتی و معمار سیستم‌های سازمانی
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};


