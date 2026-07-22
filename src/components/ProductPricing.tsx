import React, { useState } from 'react';
import { ShoppingBag, BookOpen, Check, ShieldCheck, PenTool, Sparkles, Truck, Award } from 'lucide-react';
import { BOOKS_DATA, BUNDLE_DATA } from '../data/bookData';
import { toPersianDigits, formatCurrency } from '../utils/persian';
import { ThemeMode } from '../types';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import authorImg from '../assets/author_ali.jpg';

interface ProductPricingProps {
  onAddToCart: (bookId: string, customAuthorSignature?: boolean, recipientName?: string) => void;
  theme?: ThemeMode;
}

export const ProductPricing: React.FC<ProductPricingProps> = ({ onAddToCart, theme = 'dark' }) => {
  const [authorSignature, setAuthorSignature] = useState(true);
  const [recipientName, setRecipientName] = useState('');
  const [addedSuccessId, setAddedSuccessId] = useState<string | null>(null);
  const isLight = theme === 'light';

  const handleAdd = (id: string) => {
    if (id === 'bundle-full') {
      onAddToCart('bundle-full', authorSignature, recipientName);
    } else {
      onAddToCart(id);
    }
    setAddedSuccessId(id);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 }
    });
    setTimeout(() => setAddedSuccessId(null), 2500);
  };

  return (
    <section id="books" className={`py-16 md:py-20 transition-colors duration-300 border-b ${
      isLight ? 'bg-[#FAF8F5] border-stone-300 text-stone-900' : 'bg-[#121314] border-stone-800 text-[#FAF7F2]'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full border text-xs font-bold ${
            isLight ? 'bg-amber-100 border-amber-300 text-[#B87333]' : 'bg-[#1E2022] border-[#B87333]/40 text-[#B87333]'
          }`}>
            <BookOpen className="w-4 h-4 text-[#B87333]" />
            <span>سفارش مستقیم و بی‌واسطه از انتشارات</span>
          </div>
          <h2 className={`text-3xl sm:text-4xl font-extrabold ${isLight ? 'text-stone-900' : 'text-[#FAF7F2]'}`}>
            تهیه نسخه‌های فیزیکی <span className="text-[#B87333]">کتاب اورانگوتان +۳</span>
          </h2>
          <p className={`text-sm sm:text-base leading-relaxed ${isLight ? 'text-stone-600' : 'text-stone-400'}`}>
            امکان سفارش مجزای جلد اول و دوم یا خرید دوره کامل همراه با امضای اختصاصی و یادداشت علی‌اصغر حکیمیان.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          
          {/* Volume 1 Card */}
          <div className={`p-6 sm:p-8 rounded-3xl border transition-all flex flex-col justify-between space-y-6 shadow-xl ${
            isLight ? 'bg-white border-stone-200' : 'bg-[#1E2022] border-stone-800'
          }`}>
            <div className="space-y-4">
              <span className="text-xs font-bold text-[#B87333] bg-[#B87333]/10 px-3 py-1 rounded-full border border-[#B87333]/20 inline-block">
                {BOOKS_DATA[0].badge}
              </span>

              <h3 className={`text-xl font-black ${isLight ? 'text-stone-900' : 'text-[#FAF7F2]'}`}>
                {BOOKS_DATA[0].title}
              </h3>
              <p className="text-xs text-stone-400">
                {BOOKS_DATA[0].subtitle}
              </p>

              <div className={`text-2xl font-black pt-2 ${isLight ? 'text-stone-900' : 'text-[#FAF7F2]'}`}>
                {formatCurrency(BOOKS_DATA[0].price)}
              </div>

              <p className={`text-xs leading-relaxed font-normal ${isLight ? 'text-stone-700' : 'text-stone-300'}`}>
                {BOOKS_DATA[0].summary}
              </p>

              <div className="space-y-2 pt-2 border-t border-stone-500/20 text-xs text-stone-400">
                <span className={`font-bold block ${isLight ? 'text-stone-900' : 'text-[#FAF7F2]'}`}>سرفصل‌های کلیدی جلد اول:</span>
                {BOOKS_DATA[0].keyTopics.map((topic, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#B87333] shrink-0" />
                    <span>{topic}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-stone-500/20">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleAdd(BOOKS_DATA[0].id)}
                className={`w-full py-3.5 rounded-2xl font-bold text-xs border transition-all flex items-center justify-center gap-2 ${
                  isLight
                    ? 'bg-stone-100 hover:bg-stone-200 text-stone-800 border-stone-300'
                    : 'bg-stone-800 hover:bg-stone-700 text-white border-stone-700'
                }`}
              >
                {addedSuccessId === BOOKS_DATA[0].id ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-500" />
                    <span>به سبد خرید اضافه شد</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4 text-[#B87333]" />
                    <span>سفارش جلد اول ({toPersianDigits(BOOKS_DATA[0].pageCount)} ص)</span>
                  </>
                )}
              </motion.button>
            </div>
          </div>

          {/* Complete Bundle Card (FEATURED) */}
          <div className={`p-6 sm:p-8 rounded-3xl border-2 border-[#B87333] shadow-2xl relative flex flex-col justify-between space-y-6 lg:-translate-y-2 ${
            isLight ? 'bg-amber-50/40' : 'bg-gradient-to-b from-[#1E2022] via-[#242629] to-[#1E2022]'
          }`}>
            
            <div className="absolute -top-3.5 right-6 bg-[#B87333] text-white text-[11px] font-black px-3.5 py-1 rounded-full shadow-lg flex items-center gap-1">
              <Award className="w-3.5 h-3.5" />
              <span>پیشنهاد ویژه • محبوب‌ترین انتخاب</span>
            </div>

            <div className="space-y-4 pt-2">
              <h3 className={`text-2xl font-black ${isLight ? 'text-stone-900' : 'text-[#FAF7F2]'}`}>
                {BUNDLE_DATA.title}
              </h3>
              <p className={`text-xs ${isLight ? 'text-stone-700' : 'text-stone-300'}`}>
                {BUNDLE_DATA.subtitle} • مجموع {toPersianDigits(BUNDLE_DATA.totalPages)} صفحه
              </p>

              <div className="flex items-baseline gap-3 pt-2">
                <span className="text-2xl sm:text-3xl font-black text-[#B87333]">
                  {formatCurrency(BUNDLE_DATA.bundlePrice)}
                </span>
                <span className="text-xs text-stone-400 line-through">
                  {formatCurrency(BUNDLE_DATA.originalPrice)}
                </span>
              </div>

              {/* Author Custom Signature Checkbox */}
              <div className={`p-4 rounded-2xl border space-y-3 ${
                isLight ? 'bg-white border-amber-200' : 'bg-stone-900/90 border-stone-800'
              }`}>
                <div className="flex items-center gap-3">
                  <img
                    src={authorImg}
                    alt="علی‌اصغر حکیمیان"
                    className="w-14 h-14 rounded-xl object-cover border-2 border-[#B87333] shrink-0 shadow-md"
                    referrerPolicy="no-referrer"
                  />
                  <label className="flex items-center gap-2 cursor-pointer flex-1">
                    <input
                      type="checkbox"
                      checked={authorSignature}
                      onChange={(e) => setAuthorSignature(e.target.checked)}
                      className="w-4 h-4 rounded text-[#B87333] bg-[#121314] border-stone-700 focus:ring-[#B87333]"
                    />
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#B87333]">
                      <PenTool className="w-3.5 h-3.5 text-[#B87333]" />
                      <span>امضا و یادداشت اختصاصی علی‌اصغر حکیمیان</span>
                    </div>
                  </label>
                </div>

                {authorSignature && (
                  <div className="space-y-1">
                    <label className="text-[11px] text-stone-500 block">نام یا سازمان دریافت‌کننده امضا:</label>
                    <input
                      type="text"
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      placeholder="مثلاً: جناب آقای دکتر علوی / شرکت صنعتی فولاد"
                      className={`w-full px-3 py-2 rounded-xl border text-xs focus:outline-none ${
                        isLight ? 'bg-stone-50 border-stone-300 text-stone-900' : 'bg-[#121314] border-stone-700 text-[#FAF7F2]'
                      }`}
                    />
                  </div>
                )}
              </div>

              <div className={`space-y-2 pt-2 border-t border-stone-500/20 text-xs ${isLight ? 'text-stone-700' : 'text-stone-300'}`}>
                {BUNDLE_DATA.features.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-stone-500/20">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleAdd('bundle-full')}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#B87333] to-[#8B4513] hover:from-amber-600 hover:to-amber-700 text-white font-bold text-sm shadow-xl shadow-[#B87333]/25 transition-all flex items-center justify-center gap-2"
              >
                {addedSuccessId === 'bundle-full' ? (
                  <>
                    <Check className="w-5 h-5 text-emerald-300" />
                    <span>دوره کامل به سبد اضافه شد</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-5 h-5" />
                    <span>سفارش پک کامل با ۲۰٪ تخفیف</span>
                  </>
                )}
              </motion.button>
            </div>

          </div>

          {/* Volume 2 Card */}
          <div className={`p-6 sm:p-8 rounded-3xl border transition-all flex flex-col justify-between space-y-6 shadow-xl ${
            isLight ? 'bg-white border-stone-200' : 'bg-[#1E2022] border-stone-800'
          }`}>
            <div className="space-y-4">
              <span className="text-xs font-bold text-[#B87333] bg-[#B87333]/10 px-3 py-1 rounded-full border border-[#B87333]/20 inline-block">
                {BOOKS_DATA[1].badge}
              </span>

              <h3 className={`text-xl font-black ${isLight ? 'text-stone-900' : 'text-[#FAF7F2]'}`}>
                {BOOKS_DATA[1].title}
              </h3>
              <p className="text-xs text-stone-400">
                {BOOKS_DATA[1].subtitle}
              </p>

              <div className={`text-2xl font-black pt-2 ${isLight ? 'text-stone-900' : 'text-[#FAF7F2]'}`}>
                {formatCurrency(BOOKS_DATA[1].price)}
              </div>

              <p className={`text-xs leading-relaxed font-normal ${isLight ? 'text-stone-700' : 'text-stone-300'}`}>
                {BOOKS_DATA[1].summary}
              </p>

              <div className="space-y-2 pt-2 border-t border-stone-500/20 text-xs text-stone-400">
                <span className={`font-bold block ${isLight ? 'text-stone-900' : 'text-[#FAF7F2]'}`}>سرفصل‌های کلیدی جلد دوم:</span>
                {BOOKS_DATA[1].keyTopics.map((topic, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#B87333] shrink-0" />
                    <span>{topic}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-stone-500/20">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleAdd(BOOKS_DATA[1].id)}
                className={`w-full py-3.5 rounded-2xl font-bold text-xs border transition-all flex items-center justify-center gap-2 ${
                  isLight
                    ? 'bg-stone-100 hover:bg-stone-200 text-stone-800 border-stone-300'
                    : 'bg-stone-800 hover:bg-stone-700 text-white border-stone-700'
                }`}
              >
                {addedSuccessId === BOOKS_DATA[1].id ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-500" />
                    <span>به سبد خرید اضافه شد</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4 text-[#B87333]" />
                    <span>سفارش جلد دوم ({toPersianDigits(BOOKS_DATA[1].pageCount)} ص)</span>
                  </>
                )}
              </motion.button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
