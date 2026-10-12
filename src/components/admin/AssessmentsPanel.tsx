import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  ArrowDownWideNarrow,
  CheckCircle2,
  ChevronLeft,
  FileSpreadsheet,
  Hourglass,
  Inbox,
  ListFilter,
  Phone,
  Search,
  X,
} from 'lucide-react';
import { FilterTabs, buttonClass, inputClass } from '../ui/kit';
import { Assessment, TIERS, exportAssessmentsCsv, fa, relativeFa, tierStyle } from './assessmentData';
import { AnswerStrip, ScoreRing } from './charts';
import { Avatar } from './AssessmentDossier';

type StatusFilter = 'all' | 'completed' | 'started';
type SortKey = 'newest' | 'oldest' | 'best' | 'worst';

const PAGE = 24;

export const AssessmentsPanel: React.FC<{
  items: Assessment[];
  loading: boolean;
  onOpen: (a: Assessment) => void;
}> = ({ items, loading, onOpen }) => {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<StatusFilter>('all');
  const [tier, setTier] = useState<number | null>(null);
  const [sort, setSort] = useState<SortKey>('newest');
  const [limit, setLimit] = useState(PAGE);

  const counts = useMemo(
    () => ({
      all: items.length,
      completed: items.filter((a) => a.completed).length,
      started: items.filter((a) => !a.completed).length,
    }),
    [items]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase().replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 1776));
    let list = items.filter((a) => {
      if (status === 'completed' && !a.completed) return false;
      if (status === 'started' && a.completed) return false;
      if (tier !== null && a.tierLevel !== tier) return false;
      if (!q) return true;
      return [a.fullName, a.phone, a.role, a.industry, a.scope, String(a.id)].some((f) =>
        (f || '').toLowerCase().includes(q)
      );
    });
    const by = {
      newest: (x: Assessment, y: Assessment) => y.date.getTime() - x.date.getTime(),
      oldest: (x: Assessment, y: Assessment) => x.date.getTime() - y.date.getTime(),
      best: (x: Assessment, y: Assessment) => (y.systemScore ?? -1) - (x.systemScore ?? -1),
      worst: (x: Assessment, y: Assessment) => (x.systemScore ?? 101) - (y.systemScore ?? 101),
    }[sort];
    list = [...list].sort(by);
    return list;
  }, [items, query, status, tier, sort]);

  const visible = filtered.slice(0, limit);
  const filtersActive = query || status !== 'all' || tier !== null;

  return (
    <div className="space-y-5">
      {/* Toolbar */}
      <div className="rounded-3xl border border-line bg-surface p-4 sm:p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute start-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-3" />
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setLimit(PAGE);
              }}
              placeholder="جستجوی نام، شماره تماس، سمت، صنعت یا شماره پرونده..."
              className={`${inputClass} h-11 ps-10`}
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                aria-label="پاک کردن جستجو"
                className="absolute end-2.5 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg text-ink-3 hover:bg-surface-2 hover:text-ink"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
          <FilterTabs<StatusFilter>
            className="lg:mx-0"
            value={status}
            onChange={(v) => {
              setStatus(v);
              setLimit(PAGE);
            }}
            options={[
              { value: 'all', label: 'همه', count: fa(counts.all) },
              { value: 'completed', label: 'تکمیل‌شده', icon: CheckCircle2, count: fa(counts.completed) },
              { value: 'started', label: 'نیمه‌کاره', icon: Hourglass, count: fa(counts.started) },
            ]}
          />
          <div className="flex gap-2">
            <label className="relative">
              <ArrowDownWideNarrow className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-copper-hi" />
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className={`${inputClass} h-11 w-auto cursor-pointer appearance-none ps-9 pe-4 text-xs font-bold`}
                aria-label="مرتب‌سازی"
              >
                <option value="newest">جدیدترین</option>
                <option value="oldest">قدیمی‌ترین</option>
                <option value="best">بیشترین امتیاز +۳</option>
                <option value="worst">غریزی‌ترین</option>
              </select>
            </label>
            <button
              onClick={() => exportAssessmentsCsv(filtered)}
              disabled={!filtered.length}
              className={buttonClass('secondary', 'md', 'h-11 shrink-0 text-xs')}
            >
              <FileSpreadsheet className="h-4 w-4 text-emerald-500" />
              <span className="hidden sm:inline">خروجی اکسل</span>
            </button>
          </div>
        </div>

        {/* Tier chips */}
        <div className="og-no-scrollbar mt-4 flex items-center gap-2 overflow-x-auto">
          <span className="inline-flex shrink-0 items-center gap-1 text-[11px] font-bold text-ink-3">
            <ListFilter className="h-3.5 w-3.5" /> سطح:
          </span>
          {[...TIERS].reverse().map((t) => {
            const active = tier === t.level;
            return (
              <button
                key={t.level}
                onClick={() => {
                  setTier(active ? null : t.level);
                  setLimit(PAGE);
                }}
                className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-bold transition-all ${
                  active ? 'text-white' : 'border-line bg-surface-2/60 text-ink-2 hover:border-line-strong'
                }`}
                style={active ? { background: t.hex, borderColor: t.hex } : undefined}
              >
                <span className="h-2 w-2 rounded-full" style={{ background: active ? '#fff' : t.hex }} />
                {t.name}
              </button>
            );
          })}
          {filtersActive && (
            <button
              onClick={() => {
                setQuery('');
                setStatus('all');
                setTier(null);
              }}
              className="ms-auto shrink-0 text-[11px] font-bold text-copper-hi hover:underline"
            >
              حذف فیلترها
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between px-1 text-xs text-ink-3">
        <span>
          {fa(filtered.length)} پرونده {filtersActive && <>از {fa(items.length)}</>}
        </span>
        <span className="hidden sm:inline">برای دیدن پرونده کامل و پاسخ‌نامه، روی هر ردیف بزنید.</span>
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-2.5">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="h-[76px] animate-pulse rounded-3xl border border-line bg-surface" style={{ animationDelay: `${i * 80}ms` }} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-3xl border border-dashed border-line-strong bg-surface/50 px-6 py-16 text-center">
          <Inbox className="h-10 w-10 text-ink-3" />
          <div className="text-base font-black text-ink">{items.length ? 'پرونده‌ای با این فیلترها پیدا نشد' : 'هنوز کسی آزمون پیشرفته نداده است'}</div>
          <p className="max-w-sm text-sm text-ink-3">
            {items.length
              ? 'عبارت جستجو یا فیلترها را تغییر دهید.'
              : 'به محض اینکه اولین مدیر آزمون را شروع کند، پرونده‌اش اینجا ظاهر می‌شود.'}
          </p>
        </div>
      ) : (
        <motion.ul layout className="space-y-2.5">
          <AnimatePresence initial={false}>
            {visible.map((a, i) => (
              <Row key={a.id} a={a} index={i} onOpen={onOpen} />
            ))}
          </AnimatePresence>
        </motion.ul>
      )}

      {filtered.length > limit && (
        <div className="flex justify-center pt-2">
          <button onClick={() => setLimit((l) => l + PAGE)} className={buttonClass('secondary', 'md')}>
            نمایش {fa(Math.min(PAGE, filtered.length - limit))} پرونده دیگر
          </button>
        </div>
      )}
    </div>
  );
};

const Row: React.FC<{ a: Assessment; index: number; onOpen: (a: Assessment) => void }> = ({ a, index, onOpen }) => {
  const tier = tierStyle(a.tierLevel);
  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0, transition: { delay: Math.min(index, 12) * 0.03, duration: 0.35 } }}
      exit={{ opacity: 0, scale: 0.98 }}
    >
      <button
        onClick={() => onOpen(a)}
        className="group relative flex w-full items-center gap-3 overflow-hidden rounded-3xl border border-line bg-surface p-3.5 text-start transition-all hover:-translate-y-0.5 hover:border-copper/50 hover:og-shadow sm:gap-4 sm:p-4"
      >
        <span
          className="absolute inset-y-0 start-0 w-1 opacity-70 transition-opacity group-hover:opacity-100"
          style={{ background: tier?.hex || 'var(--og-line-strong)' }}
        />
        <Avatar a={a} />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="truncate text-sm font-black text-ink">{a.fullName}</span>
            <span className="text-[10px] font-bold text-ink-3">#{fa(a.id)}</span>
          </div>
          <div className="mt-0.5 truncate text-xs text-ink-2">{a.role}</div>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-ink-3">
            <span className="truncate">{a.industry}</span>
            {a.phone && (
              <span className="inline-flex items-center gap-1" dir="ltr">
                <Phone className="h-3 w-3" />
                {fa(a.phone)}
              </span>
            )}
          </div>
        </div>

        <div className="hidden flex-col items-end gap-1.5 md:flex">
          {a.completed ? (
            <AnswerStrip answers={a.answers} />
          ) : (
            <span className="text-[11px] font-bold text-amber-500">بدون پاسخ ثبت‌شده</span>
          )}
          <span className="text-[10px] text-ink-3">{relativeFa(a.date)}</span>
        </div>

        <div className="flex shrink-0 flex-col items-center gap-1">
          {a.systemScore !== null ? (
            <ScoreRing value={a.systemScore} size={52} />
          ) : (
            <span className="flex h-[52px] w-[52px] items-center justify-center rounded-full border-2 border-dashed border-amber-500/50 text-amber-500">
              <Hourglass className="h-5 w-5" />
            </span>
          )}
          <span
            className={`max-w-[92px] truncate rounded-full border px-2 py-0.5 text-[9px] font-black ${
              tier ? tier.chip : 'border-amber-500/30 bg-amber-500/10 text-amber-500'
            }`}
          >
            {tier ? tier.name : 'نیمه‌کاره'}
          </span>
        </div>

        <ChevronLeft className="hidden h-5 w-5 shrink-0 text-ink-3 transition-transform group-hover:-translate-x-1 group-hover:text-copper-hi sm:block" />
      </button>
    </motion.li>
  );
};
