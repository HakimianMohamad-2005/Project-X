import React, { useMemo, useState } from 'react';
import { AlertTriangle, BookOpen, CheckCircle2, Search, SearchX, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'motion/react';
import { CategoryTag, ThemeMode } from '../types';
import { Container, FilterTabs, PageHeader, inputClass } from './ui/kit';
import { useLocaleFormat } from './ui/format';

interface MistakesAndLessonsProps {
  theme?: ThemeMode;
}

interface Item {
  id: string;
  number: number;
  type: 'mistake' | 'lesson';
  title: string;
  description: string;
  categoryLabel: string;
  bookRef: string;
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
  'l-5': 'view',
};

export const MistakesAndLessons: React.FC<MistakesAndLessonsProps> = () => {
  const { t } = useTranslation();
  const { num } = useLocaleFormat();
  const [type, setType] = useState<'mistake' | 'lesson'>('mistake');
  const [tag, setTag] = useState<CategoryTag | 'all'>('all');
  const [query, setQuery] = useState('');

  const raw = t('mistakesLessons.items', { returnObjects: true });
  const items = (Array.isArray(raw) ? raw : []) as Item[];

  const counts = {
    mistake: items.filter((i) => i.type === 'mistake').length,
    lesson: items.filter((i) => i.type === 'lesson').length,
  };

  const filtered = items.filter((item) => {
    const q = query.trim().toLowerCase();
    return (
      item.type === type &&
      (tag === 'all' || CATEGORY_MAP[item.id] === tag) &&
      (!q || item.title.toLowerCase().includes(q) || item.description.toLowerCase().includes(q))
    );
  });

  const tagOptions = useMemo(
    () =>
      (['all', 'view', 'decision', 'people', 'system', 'market'] as const).map((k) => ({
        value: k as CategoryTag | 'all',
        label: t(`mistakesLessons.categories.${k}`),
      })),
    [t]
  );

  const isMistake = type === 'mistake';

  return (
    <>
      <PageHeader icon={BookOpen} kicker={t('mistakesLessons.badge')} title={t('mistakesLessons.title')} subtitle={t('mistakesLessons.subtitle')} />

      <Container className="py-12 sm:py-16 space-y-8">
        {/* Mistakes / lessons switch */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 max-w-3xl mx-auto">
          {(['mistake', 'lesson'] as const).map((k) => {
            const active = type === k;
            const red = k === 'mistake';
            const Icon = red ? AlertTriangle : CheckCircle2;
            return (
              <button
                key={k}
                onClick={() => setType(k)}
                aria-pressed={active}
                className={`relative overflow-hidden rounded-3xl border p-4 sm:p-6 text-start transition-all duration-300 ${
                  active
                    ? red
                      ? 'border-red-500/60 bg-red-500/10 shadow-[0_20px_50px_-25px_rgba(239,68,68,0.6)]'
                      : 'border-emerald-500/60 bg-emerald-500/10 shadow-[0_20px_50px_-25px_rgba(16,185,129,0.6)]'
                    : 'border-line bg-surface opacity-70 hover:opacity-100'
                }`}
              >
                <span
                  className={`absolute -bottom-6 -end-2 text-[5.5rem] sm:text-[7rem] font-black leading-none ${
                    red ? 'text-red-500/10' : 'text-emerald-500/10'
                  }`}
                  dir="ltr"
                  aria-hidden="true"
                >
                  {num(40)}
                </span>
                <Icon className={`relative w-6 h-6 ${red ? 'text-red-500' : 'text-emerald-500'}`} />
                <span className="relative mt-3 block text-base sm:text-xl font-black text-ink">
                  {red ? t('mistakesLessons.toggleMistakes') : t('mistakesLessons.toggleLessons')}
                </span>
                <span className="relative mt-1 block text-xs text-ink-3">{t('ui.lessons.showing', { n: num(counts[k]) })}</span>
              </button>
            );
          })}
        </div>

        {/* Search + tags */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-4">
          <div className="relative lg:w-80 shrink-0">
            <Search className="pointer-events-none absolute top-1/2 -translate-y-1/2 start-3.5 w-4 h-4 text-ink-3" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('mistakesLessons.searchPlaceholder')}
              className={`${inputClass} ps-10 pe-9`}
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                aria-label={t('ui.common.clear')}
                className="absolute top-1/2 -translate-y-1/2 end-2.5 flex h-6 w-6 items-center justify-center rounded-full text-ink-3 hover:bg-surface-2 hover:text-ink"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <FilterTabs<CategoryTag | 'all'> options={tagOptions} value={tag} onChange={setTag} tone={isMistake ? 'red' : 'green'} className="lg:flex-1" />
        </div>

        {/* Items */}
        <motion.div layout className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <AnimatePresence mode="popLayout">
            {filtered.map((item, idx) => (
              <motion.article
                layout
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0, transition: { delay: idx * 0.05 } }}
                exit={{ opacity: 0, scale: 0.96 }}
                className="group relative overflow-hidden rounded-3xl border border-line bg-surface p-6 sm:p-7 transition-colors hover:border-line-strong"
              >
                <span
                  className={`absolute inset-y-6 start-0 w-1 rounded-e-full ${item.type === 'mistake' ? 'bg-red-500' : 'bg-emerald-500'}`}
                  aria-hidden="true"
                />
                <span
                  className={`pointer-events-none absolute -top-4 end-3 text-[6rem] font-black leading-none transition-colors ${
                    item.type === 'mistake' ? 'text-red-500/[0.07] group-hover:text-red-500/15' : 'text-emerald-500/[0.07] group-hover:text-emerald-500/15'
                  }`}
                  dir="ltr"
                  aria-hidden="true"
                >
                  {num(item.number)}
                </span>
                <div className="relative flex flex-wrap items-center gap-2 text-[11px] font-bold">
                  <span
                    className={`rounded-lg px-2 py-0.5 ${
                      item.type === 'mistake' ? 'bg-red-500/12 text-red-500' : 'bg-emerald-500/12 text-emerald-500'
                    }`}
                  >
                    {item.type === 'mistake' ? t('story.marquee.mistake') : t('story.marquee.lesson')} {num(item.number)}
                  </span>
                  <span className="text-ink-3">{item.categoryLabel}</span>
                </div>
                <h3 className="relative mt-4 text-lg font-black leading-8 text-ink">{item.title}</h3>
                <p className="relative mt-2 text-sm leading-7 text-ink-2">{item.description}</p>
                <p className="relative mt-5 border-t border-line pt-3 text-[11px] font-semibold text-ink-3">{item.bookRef}</p>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>

        {filtered.length === 0 && (
          <div className="flex flex-col items-center gap-3 rounded-3xl border border-dashed border-line-strong py-14 text-center">
            <SearchX className="w-10 h-10 text-ink-3" />
            <p className="text-sm text-ink-2">{t('mistakesLessons.noResults')}</p>
          </div>
        )}

        <p className="text-center text-xs leading-6 text-ink-3">{t('ui.lessons.note')}</p>
      </Container>
    </>
  );
};
