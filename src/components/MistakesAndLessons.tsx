import React, { useState } from 'react';
import { BookOpen, Search, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { CategoryTag, ThemeMode } from '../types';
import { toPersianDigits } from '../utils/persian';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from 'react-i18next';

interface MistakesAndLessonsProps {
  theme?: ThemeMode;
}

const CATEGORY_MAP: Record<string, CategoryTag> = {
  'm-1': 'view',
  'm-2': 'system',
  'm-3': 'market',
  'm-4': 'people',
  'm-5': 'decision',
  'l-1': 'system',
  'l-2': 'decision',
  'l-3': 'people',
  'l-4': 'market',
  'l-5': 'view'
};

export const MistakesAndLessons: React.FC<MistakesAndLessonsProps> = ({ theme = 'light' }) => {
  const { t, i18n } = useTranslation();
  const isPersian = i18n.language === 'fa';
  const [activeType, setActiveType] = useState<'mistake' | 'lesson'>('mistake');
  const [selectedTag, setSelectedTag] = useState<CategoryTag | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const isLight = theme === 'light';

  const categoryTags: { key: CategoryTag | 'all'; label: string }[] = [
    { key: 'all', label: t('mistakesLessons.categories.all') },
    { key: 'view', label: t('mistakesLessons.categories.view') },
    { key: 'decision', label: t('mistakesLessons.categories.decision') },
    { key: 'people', label: t('mistakesLessons.categories.people') },
    { key: 'system', label: t('mistakesLessons.categories.system') },
    { key: 'market', label: t('mistakesLessons.categories.market') }
  ];

  const translatedItems = (t('mistakesLessons.items', { returnObjects: true }) as any[]) || [];

  const filteredItems = translatedItems.filter(item => {
    const itemCategory = CATEGORY_MAP[item.id];
    const matchesType = item.type === activeType;
    const matchesTag = selectedTag === 'all' || itemCategory === selectedTag;
    const matchesSearch = searchQuery === '' ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesType && matchesTag && matchesSearch;
  });

  return (
    <section id="mistakes-lessons" className={`py-16 md:py-20 transition-colors duration-300 border-b ${
      isLight ? 'bg-[#FAF8F5] border-stone-300 text-stone-900' : 'bg-[#121314] border-stone-800 text-[#FAF7F2]'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <div className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full border text-xs font-bold ${
            isLight ? 'bg-amber-100 border-amber-300 text-[#B87333]' : 'bg-[#1E2022] border-[#B87333]/40 text-[#B87333]'
          }`}>
            <BookOpen className="w-4 h-4 text-[#B87333]" />
            <span>{t('mistakesLessons.badge')}</span>
          </div>
          <h2 className={`text-3xl sm:text-4xl font-extrabold ${isLight ? 'text-stone-900' : 'text-[#FAF7F2]'}`}>
            {t('mistakesLessons.title')}
          </h2>
          <p className={`text-sm sm:text-base leading-relaxed ${isLight ? 'text-stone-600' : 'text-stone-400'}`}>
            {t('mistakesLessons.subtitle')}
          </p>
        </div>

        {/* Top Controls: Type Toggle & Search Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          
          {/* Mistakes vs Lessons Toggle */}
          <div className={`p-1.5 rounded-2xl border flex items-center w-full md:w-auto ${
            isLight ? 'bg-stone-100 border-stone-300' : 'bg-[#1E2022] border-stone-800'
          }`}>
            <button
              onClick={() => setActiveType('mistake')}
              className={`flex-1 md:flex-none px-6 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                activeType === 'mistake'
                  ? 'bg-red-600 text-white shadow-md'
                  : isLight ? 'text-stone-700 hover:text-stone-900' : 'text-stone-400 hover:text-white'
              }`}
            >
              <AlertTriangle className="w-4 h-4" />
              <span>{t('mistakesLessons.toggleMistakes')}</span>
            </button>

            <button
              onClick={() => setActiveType('lesson')}
              className={`flex-1 md:flex-none px-6 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                activeType === 'lesson'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : isLight ? 'text-stone-700 hover:text-stone-900' : 'text-stone-400 hover:text-white'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{t('mistakesLessons.toggleLessons')}</span>
            </button>
          </div>

          {/* Search Input Bar */}
          <div className="relative w-full md:w-80">
            <Search className={`w-4 h-4 text-stone-400 absolute top-3.5 ${isPersian ? 'right-3.5' : 'left-3.5'}`} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('mistakesLessons.searchPlaceholder')}
              className={`w-full ${isPersian ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-2.5 rounded-2xl border text-xs font-medium focus:outline-none ${
                isLight
                  ? 'bg-white border-stone-300 text-stone-900 placeholder-stone-400 focus:border-[#B87333]'
                  : 'bg-[#1E2022] border-stone-800 text-[#FAF7F2] placeholder-stone-500 focus:border-[#B87333]'
              }`}
            />
          </div>

        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
          {categoryTags.map((tag) => (
            <button
              key={tag.key}
              onClick={() => setSelectedTag(tag.key)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                selectedTag === tag.key
                  ? 'bg-[#B87333] text-white border-[#B87333]'
                  : isLight
                    ? 'bg-white text-stone-700 border-stone-300 hover:bg-stone-100'
                    : 'bg-[#181A1C] text-stone-400 border-stone-800 hover:border-stone-700'
              }`}
            >
              {tag.label}
            </button>
          ))}
        </div>

        {/* Items List Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeType + selectedTag}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                whileHover={{ scale: 1.01 }}
                className={`p-6 rounded-3xl border transition-all space-y-4 relative group shadow-sm ${
                  isLight
                    ? 'bg-white border-stone-200 hover:border-[#B87333]/80'
                    : 'bg-[#1E2022] border-stone-800 hover:border-stone-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`w-7 h-7 rounded-lg text-xs font-black flex items-center justify-center ${
                      item.type === 'mistake'
                        ? 'bg-red-500/10 text-red-600 border border-red-300'
                        : 'bg-emerald-500/10 text-emerald-600 border border-emerald-300'
                    }`}>
                      #{isPersian ? toPersianDigits(item.number) : item.number}
                    </span>
                    <span className="text-xs font-bold text-stone-400">
                      {item.categoryLabel}
                    </span>
                  </div>

                  <span className="text-[10px] font-semibold text-stone-400">
                    {item.bookRef}
                  </span>
                </div>

                <h3 className={`text-base font-bold group-hover:text-[#B87333] transition-colors leading-snug ${
                  isLight ? 'text-stone-900' : 'text-[#FAF7F2]'
                }`}>
                  {item.title}
                </h3>

                <p className={`text-xs leading-relaxed font-normal ${isLight ? 'text-stone-700' : 'text-stone-300'}`}>
                  {item.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {filteredItems.length === 0 && (
          <div className="text-center py-12 text-stone-400 text-sm">
            {t('mistakesLessons.noResults')}
          </div>
        )}

      </div>
    </section>
  );
};

