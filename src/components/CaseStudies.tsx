import React, { useState } from 'react';
import { Factory, TrendingDown, Boxes, Clock, PieChart, DollarSign, Truck, X, ArrowLeft, Quote, Sparkles } from 'lucide-react';
import { CASE_STUDIES } from '../data/bookData';
import { CaseCategory, CaseStudy, ThemeMode } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface CaseStudiesProps {
  theme?: ThemeMode;
}

export const CaseStudies: React.FC<CaseStudiesProps> = ({ theme = 'light' }) => {
  const [selectedCategory, setSelectedCategory] = useState<CaseCategory>('all');
  const [activeModalCase, setActiveModalCase] = useState<CaseStudy | null>(null);
  const isLight = theme === 'light';

  const categories: { key: CaseCategory; label: string }[] = [
    { key: 'all', label: 'همه پرونده‌ها' },
    { key: 'production', label: 'تولید و صنعت' },
    { key: 'finance', label: 'مالی و انبار' },
    { key: 'sales', label: 'فروش و بازار' },
    { key: 'ai', label: 'هوش مصنوعی و فناوری' }
  ];

  const filteredCases = selectedCategory === 'all'
    ? CASE_STUDIES
    : CASE_STUDIES.filter(c => c.category === selectedCategory);

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'Factory':
        return <Factory className="w-5 h-5 text-[#B87333]" />;
      case 'TrendingDown':
        return <TrendingDown className="w-5 h-5 text-red-500" />;
      case 'Boxes':
        return <Boxes className="w-5 h-5 text-[#B87333]" />;
      case 'Clock':
        return <Clock className="w-5 h-5 text-[#B87333]" />;
      case 'PieChart':
        return <PieChart className="w-5 h-5 text-amber-500" />;
      case 'DollarSign':
        return <DollarSign className="w-5 h-5 text-emerald-500" />;
      case 'Truck':
        return <Truck className="w-5 h-5 text-[#B87333]" />;
      default:
        return <Factory className="w-5 h-5 text-[#B87333]" />;
    }
  };

  return (
    <section id="case-studies" className={`py-16 md:py-20 transition-colors duration-300 border-b ${
      isLight ? 'bg-[#FAF8F5] border-stone-300 text-stone-900' : 'bg-[#121314] border-stone-800 text-[#FAF7F2]'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <div className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full border text-xs font-bold ${
            isLight ? 'bg-amber-100 border-amber-300 text-[#B87333]' : 'bg-[#1E2022] border-[#B87333]/40 text-[#B87333]'
          }`}>
            <Factory className="w-4 h-4 text-[#B87333]" />
            <span>تجربه مستقیم از ۴۰ سال صنعت ایران</span>
          </div>
          <h2 className={`text-3xl sm:text-4xl font-extrabold ${isLight ? 'text-stone-900' : 'text-[#FAF7F2]'}`}>
            اتاق پرونده‌های واقعی <span className="text-[#B87333]">کارخانه‌ها</span>
          </h2>
          <p className={`text-sm sm:text-base leading-relaxed ${isLight ? 'text-stone-600' : 'text-stone-400'}`}>
            بازخوانی مستند پرونده‌های سوزن بخار، انبارگردانی بلبرینگ ۶۸ ساله، کسری PVC و فاکتور سمی که در جلد اول و دوم تشریح شده‌اند.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <motion.button
              key={cat.key}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setSelectedCategory(cat.key)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                selectedCategory === cat.key
                  ? 'bg-[#B87333] text-white border-[#B87333] shadow-md shadow-[#B87333]/20'
                  : isLight
                    ? 'bg-white text-stone-700 border-stone-300 hover:bg-stone-100'
                    : 'bg-[#1E2022] text-stone-300 border-stone-800 hover:border-stone-700'
              }`}
            >
              {cat.label}
            </motion.button>
          ))}
        </div>

        {/* Case Studies Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredCases.map((cs) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25 }}
              key={cs.id}
              className={`p-6 rounded-3xl border transition-all flex flex-col justify-between space-y-5 group shadow-lg ${
                isLight
                  ? 'bg-white border-stone-200 hover:border-[#B87333]/80 hover:shadow-xl'
                  : 'bg-[#1E2022] border-stone-800 hover:border-[#B87333]/60'
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className={`p-2.5 rounded-xl border ${isLight ? 'bg-amber-50 border-amber-200' : 'bg-stone-900 border-stone-800'}`}>
                    {renderIcon(cs.iconName)}
                  </div>
                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-md border ${
                    isLight ? 'bg-stone-100 border-stone-300 text-stone-700' : 'bg-stone-900 border-stone-800 text-stone-400'
                  }`}>
                    {cs.volumeRef}
                  </span>
                </div>

                <div>
                  <h3 className={`text-lg font-bold group-hover:text-[#B87333] transition-colors ${
                    isLight ? 'text-stone-900' : 'text-[#FAF7F2]'
                  }`}>
                    {cs.title}
                  </h3>
                  <p className="text-xs text-stone-400 mt-1 font-medium">
                    {cs.subtitle}
                  </p>
                </div>

                <p className={`text-xs line-clamp-3 leading-relaxed ${isLight ? 'text-stone-700' : 'text-stone-300'}`}>
                  <strong className={isLight ? 'text-stone-900' : 'text-stone-400'}>صورت مسئله: </strong>
                  {cs.problem}
                </p>
              </div>

              <div className="pt-4 border-t border-stone-500/20 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-stone-400 font-medium">دست‌آورد اصلی:</span>
                  <span className="text-xs font-black text-[#B87333] bg-[#B87333]/10 px-2.5 py-1 rounded-md border border-[#B87333]/20">
                    {cs.keyMetric}
                  </span>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveModalCase(cs)}
                  className={`w-full py-2.5 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-2 ${
                    isLight
                      ? 'bg-stone-100 hover:bg-stone-200 text-stone-800 border-stone-300'
                      : 'bg-stone-900 hover:bg-stone-800 text-stone-200 border-stone-800'
                  }`}
                >
                  <span>بررسی کامل پرونده</span>
                  <ArrowLeft className="w-3.5 h-3.5 text-[#B87333]" />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>

      {/* Case Study Deep-Dive Modal */}
      <AnimatePresence>
        {activeModalCase && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={`w-full max-w-2xl rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto border ${
                isLight ? 'bg-white border-stone-300 text-stone-900' : 'bg-[#1E2022] border-stone-700 text-[#FAF7F2]'
              }`}
            >
              
              <button
                onClick={() => setActiveModalCase(null)}
                className={`absolute top-6 left-6 p-2 rounded-xl ${
                  isLight ? 'bg-stone-100 text-stone-600 hover:text-stone-900' : 'bg-stone-800 text-stone-400 hover:text-white'
                }`}
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-2">
                <span className="text-xs font-bold text-[#B87333]">
                  {activeModalCase.volumeRef} • {activeModalCase.categoryLabel}
                </span>
                <h3 className={`text-2xl font-black ${isLight ? 'text-stone-900' : 'text-[#FAF7F2]'}`}>
                  {activeModalCase.title}
                </h3>
                <p className={`text-sm ${isLight ? 'text-stone-600' : 'text-stone-300'}`}>
                  {activeModalCase.subtitle}
                </p>
              </div>

              <div className="space-y-4 text-xs sm:text-sm">
                <div className={`p-4 rounded-2xl border space-y-1 ${
                  isLight ? 'bg-red-50/80 border-red-200' : 'bg-stone-900/90 border-stone-800'
                }`}>
                  <strong className="text-red-500 block font-bold">۱. صورت مسئله و بحران ابتدایی:</strong>
                  <p className={`leading-relaxed ${isLight ? 'text-stone-800' : 'text-stone-300'}`}>{activeModalCase.problem}</p>
                </div>

                <div className={`p-4 rounded-2xl border space-y-1 ${
                  isLight ? 'bg-amber-50/80 border-amber-200' : 'bg-stone-900/90 border-stone-800'
                }`}>
                  <strong className="text-[#B87333] block font-bold">۲. مداخله در نقطه اهرمی (+۳):</strong>
                  <p className={`leading-relaxed ${isLight ? 'text-stone-800' : 'text-stone-300'}`}>{activeModalCase.leverIntervention}</p>
                </div>

                <div className={`p-4 rounded-2xl border space-y-1 ${
                  isLight ? 'bg-emerald-50/80 border-emerald-200' : 'bg-[#2E5A44]/20 border-[#2E5A44]/40'
                }`}>
                  <strong className="text-emerald-600 block font-bold">۳. دستاورد مالی و عملیاتی:</strong>
                  <p className={`leading-relaxed ${isLight ? 'text-stone-800' : 'text-stone-200'}`}>{activeModalCase.results}</p>
                </div>

                <div className="p-4 rounded-2xl bg-[#B87333]/10 border border-[#B87333]/30 flex items-start gap-3">
                  <Quote className="w-6 h-6 text-[#B87333] shrink-0 mt-1" />
                  <p className={`text-xs sm:text-sm italic leading-relaxed ${isLight ? 'text-stone-900' : 'text-stone-200'}`}>
                    {activeModalCase.quote}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-stone-500/20 flex justify-end">
                <button
                  onClick={() => setActiveModalCase(null)}
                  className="px-6 py-2.5 rounded-xl bg-[#B87333] hover:bg-amber-600 text-white font-bold text-xs"
                >
                  بستن پنجره
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
