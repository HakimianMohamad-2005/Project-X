import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import {
  Activity,
  ArrowLeft,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Factory,
  Flame,
  Hourglass,
  Lightbulb,
  Radio,
  Users,
} from 'lucide-react';
import { Assessment, TIERS, computeStats, fa, faPct, relativeFa, scoreHex, tierStyle } from './assessmentData';
import { CountUp, DailyBars, Meter, PulseGauge, ScoreRing } from './charts';
import { Avatar } from './AssessmentDossier';

const EASE = [0.16, 1, 0.3, 1] as const;

const Panel: React.FC<{ className?: string; delay?: number; children: React.ReactNode }> = ({ className = '', delay = 0, children }) => (
  <motion.section
    initial={{ opacity: 0, y: 18 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.6, ease: EASE }}
    className={`relative overflow-hidden rounded-[1.75rem] border border-line bg-surface p-5 sm:p-6 ${className}`}
  >
    {children}
  </motion.section>
);

const PanelTitle: React.FC<{ icon: React.ComponentType<{ className?: string }>; title: string; hint?: string; action?: React.ReactNode }> = ({
  icon: Icon,
  title,
  hint,
  action,
}) => (
  <div className="mb-5 flex items-start justify-between gap-3">
    <div>
      <h2 className="flex items-center gap-2 text-sm font-black text-ink">
        <Icon className="h-4 w-4 text-copper-hi" />
        {title}
      </h2>
      {hint && <p className="mt-1 text-[11px] text-ink-3">{hint}</p>}
    </div>
    {action}
  </div>
);

export const OverviewPanel: React.FC<{
  items: Assessment[];
  loading: boolean;
  liveOnline: number;
  totalVisitors: number;
  todayVisits: number;
  onOpen: (a: Assessment) => void;
  onSeeAll: () => void;
  onSeeVisitors: () => void;
}> = ({ items, loading, liveOnline, totalVisitors, todayVisits, onOpen, onSeeAll, onSeeVisitors }) => {
  const stats = useMemo(() => computeStats(items), [items]);
  const doneCount = stats.completed.length;
  const weakest = [...stats.dimensionAvg].sort((a, b) => a.system - b.system);
  const recent = items.slice(0, 5);

  const kpis = [
    { icon: Users, label: 'شرکت‌کنندگان آزمون', value: stats.total, tone: 'text-copper-hi', sub: `${fa(stats.last7)} نفر در ۷ روز اخیر` },
    { icon: CheckCircle2, label: 'آزمون‌های تکمیل‌شده', value: doneCount, tone: 'text-emerald-500', sub: `نرخ تکمیل ${faPct(stats.completionRate)}` },
    { icon: Hourglass, label: 'نیمه‌کاره (سرنخ گرم)', value: stats.startedOnly, tone: 'text-amber-500', sub: 'آماده پیگیری تلفنی' },
    { icon: CalendarDays, label: 'ثبت‌شده امروز', value: stats.today, tone: 'text-sky-500', sub: 'از ابتدای امروز' },
  ];

  return (
    <div className="space-y-5">
      {/* Pulse hero */}
      <Panel className="!p-0">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_80%_-10%,rgba(217,137,74,0.22),transparent_55%),radial-gradient(ellipse_at_0%_110%,rgba(20,184,166,0.12),transparent_50%)]" />
        <div className="relative grid gap-6 p-5 sm:p-7 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)]">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-copper/30 bg-copper/10 px-3 py-1 text-[11px] font-black text-copper-hi">
              <Activity className="h-3.5 w-3.5" /> نبض +۳ مخاطبان کتاب
            </div>
            <PulseGauge value={loading ? 0 : stats.avgSystem} />
            <p className="mt-3 max-w-xs text-xs leading-6 text-ink-2">
              میانگین امتیاز سیستمی‌سازیِ <b className="text-ink">{fa(doneCount)}</b> مدیری که آزمون پیشرفته را کامل کرده‌اند.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {kpis.map((k, i) => (
              <motion.div
                key={k.label}
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.15 + i * 0.07, duration: 0.5, ease: EASE }}
                className="rounded-3xl border border-line bg-surface-2/60 p-4 backdrop-blur"
              >
                <k.icon className={`h-5 w-5 ${k.tone}`} />
                <div className="mt-3 text-3xl font-black text-ink">
                  {loading ? <span className="inline-block h-8 w-14 animate-pulse rounded-lg bg-surface" /> : <CountUp value={k.value} />}
                </div>
                <div className="mt-1 text-xs font-bold text-ink-2">{k.label}</div>
                <div className="mt-0.5 text-[10px] text-ink-3">{k.sub}</div>
              </motion.div>
            ))}
            <button
              onClick={onSeeVisitors}
              className="col-span-2 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 rounded-3xl border border-emerald-500/25 bg-emerald-500/5 px-4 py-3 text-start transition-colors hover:border-emerald-500/50"
            >
              <span className="flex items-center gap-2 text-xs font-bold text-ink-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
                </span>
                هم‌اکنون در سایت
                <b className="text-base text-emerald-500">
                  <CountUp value={liveOnline} duration={0.8} />
                </b>
                نفر
              </span>
              <span className="flex items-center gap-3 text-[11px] text-ink-3">
                <span>
                  امروز: <b className="text-ink-2"><CountUp value={todayVisits} /></b>
                </span>
                <span className="flex items-center gap-1">
                  <Radio className="h-3.5 w-3.5" /> کل بازدیدها: <b className="text-ink-2"><CountUp value={totalVisitors} /></b>
                </span>
              </span>
            </button>
          </div>
        </div>
      </Panel>

      {/* Evolution spectrum */}
      <Panel delay={0.1}>
        <PanelTitle
          icon={Activity}
          title="طیف تکامل مدیران: از اورانگوتان تا +۳"
          hint="توزیع شرکت‌کنندگان در پنج سطح نتیجه آزمون"
        />
        <div className="flex h-14 w-full overflow-hidden rounded-2xl border border-line bg-surface-2" dir="rtl">
          {[...TIERS].reverse().map((t, i) => {
            const n = stats.tierCounts[t.level] || 0;
            const share = doneCount ? (n / doneCount) * 100 : 0;
            return (
              <motion.div
                key={t.level}
                initial={{ width: 0 }}
                animate={{ width: `${doneCount ? share : 20}%` }}
                transition={{ delay: 0.3 + i * 0.08, duration: 1.1, ease: EASE }}
                className="relative flex items-center justify-center overflow-hidden text-xs font-black text-white"
                style={{ background: `linear-gradient(180deg, ${t.hex}, ${t.hex}bb)`, opacity: n || !doneCount ? 1 : 0.25 }}
                title={`${t.name}: ${fa(n)} نفر`}
              >
                {share >= 8 && <span className="drop-shadow">{faPct(Math.round(share))}</span>}
              </motion.div>
            );
          })}
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-5">
          {[...TIERS].reverse().map((t) => (
            <div key={t.level} className="flex items-center gap-2 rounded-2xl border border-line bg-surface-2/40 px-3 py-2">
              <span className="h-3 w-3 shrink-0 rounded-full" style={{ background: t.hex, boxShadow: `0 0 10px ${t.hex}` }} />
              <div className="min-w-0">
                <div className="truncate text-[11px] font-bold text-ink-2">{t.name}</div>
                <div className="text-sm font-black text-ink">
                  {fa(stats.tierCounts[t.level] || 0)} <span className="text-[10px] font-bold text-ink-3">نفر</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-3 flex justify-between text-[10px] font-bold text-ink-3">
          <span className="text-teal-500">مدیریت سیستمی +۳ ✦</span>
          <span className="text-red-500">رفتار غریزی 🦧</span>
        </div>
      </Panel>

      <div className="grid gap-5 lg:grid-cols-5">
        {/* Dimension heatmap */}
        <Panel delay={0.15} className="lg:col-span-3">
          <PanelTitle icon={Flame} title="ژن‌های مدیریتی مخاطبان" hint="میانگین امتیاز سیستمی در هر بُعد؛ ضعیف‌ترین بالا" />
          <div className="space-y-3.5">
            {weakest.map((d, i) => (
              <div key={d.dimension}>
                <div className="mb-1.5 flex items-center justify-between gap-3 text-xs">
                  <span className="truncate font-bold text-ink-2">{d.title}</span>
                  <span className="shrink-0 font-black" style={{ color: scoreHex(d.system) }}>
                    {doneCount ? faPct(d.system) : '—'}
                  </span>
                </div>
                <Meter value={doneCount ? d.system : 0} delay={0.3 + i * 0.06} />
              </div>
            ))}
          </div>
          {doneCount > 0 && weakest[0] && (
            <div className="mt-5 flex gap-3 rounded-2xl border border-copper/30 bg-copper/8 p-4">
              <Lightbulb className="mt-0.5 h-5 w-5 shrink-0 text-copper-hi" />
              <p className="text-xs leading-6 text-ink-2">
                ضعیف‌ترین ژن مخاطبان شما <b className="text-ink">«{weakest[0].title}»</b> است. محتوای تبلیغاتی و پیام‌های فروش را روی{' '}
                <b className="text-copper-hi">{weakest[0].chapter}</b> متمرکز کنید.
              </p>
            </div>
          )}
        </Panel>

        {/* Trend */}
        <Panel delay={0.2} className="lg:col-span-2">
          <PanelTitle icon={CalendarDays} title="روند ثبت آزمون" hint="۱۴ روز اخیر" />
          <DailyBars data={stats.daily} />
          <div className="mt-5 grid grid-cols-2 gap-2">
            <div className="rounded-2xl border border-line bg-surface-2/40 p-3">
              <div className="text-[10px] font-bold text-ink-3">۷ روز اخیر</div>
              <div className="text-xl font-black text-ink">{fa(stats.last7)}</div>
            </div>
            <div className="rounded-2xl border border-line bg-surface-2/40 p-3">
              <div className="text-[10px] font-bold text-ink-3">میانگین روزانه</div>
              <div className="text-xl font-black text-ink">
                {fa((stats.daily.reduce((s, d) => s + d.count, 0) / stats.daily.length).toFixed(1))}
              </div>
            </div>
          </div>
        </Panel>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {/* Recent */}
        <Panel delay={0.25}>
          <PanelTitle
            icon={Users}
            title="تازه‌ترین شرکت‌کنندگان"
            action={
              <button onClick={onSeeAll} className="inline-flex items-center gap-1 text-[11px] font-black text-copper-hi hover:underline">
                همه پرونده‌ها <ArrowLeft className="h-3.5 w-3.5" />
              </button>
            }
          />
          <div className="space-y-2">
            {recent.length === 0 && !loading && <p className="py-6 text-center text-xs text-ink-3">هنوز پرونده‌ای ثبت نشده است.</p>}
            {recent.map((a) => {
              const t = tierStyle(a.tierLevel);
              return (
                <button
                  key={a.id}
                  onClick={() => onOpen(a)}
                  className="flex w-full items-center gap-3 rounded-2xl border border-transparent p-2 text-start transition-colors hover:border-line hover:bg-surface-2/60"
                >
                  <Avatar a={a} />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-black text-ink">{a.fullName}</div>
                    <div className="truncate text-[11px] text-ink-3">
                      {a.role} · {relativeFa(a.date)}
                    </div>
                  </div>
                  {a.systemScore !== null ? (
                    <ScoreRing value={a.systemScore} size={42} stroke={4} textClass="text-xs" />
                  ) : (
                    <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[10px] font-black text-amber-500">
                      نیمه‌کاره
                    </span>
                  )}
                  {t && <span className="sr-only">{t.name}</span>}
                </button>
              );
            })}
          </div>
        </Panel>

        <div className="space-y-5">
          {/* Hardest questions */}
          <Panel delay={0.3}>
            <PanelTitle icon={Flame} title="تله‌های پرتکرار" hint="سؤال‌هایی که بیشترین پاسخ غریزی را گرفته‌اند" />
            <div className="space-y-2.5">
              {stats.hardestQuestions.length === 0 && <p className="py-4 text-center text-xs text-ink-3">داده کافی وجود ندارد.</p>}
              {stats.hardestQuestions.map((h, i) => (
                <div key={h.question.id} className="flex items-start gap-3 rounded-2xl border border-line bg-surface-2/40 p-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-red-500/10 text-xs font-black text-red-500">
                    {fa(i + 1)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-black text-ink">
                      سؤال {fa(h.question.id)}: {h.question.title}
                    </div>
                    <div className="mt-1 text-[11px] text-ink-3">
                      {faPct(h.instinctShare)} مدیران در این موقعیت واکنش غریزی نشان داده‌اند
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Panel>

          {/* Industries */}
          <Panel delay={0.35}>
            <PanelTitle icon={Factory} title="صنایع شرکت‌کننده" />
            <div className="space-y-2">
              {stats.industries.slice(0, 5).map((ind) => (
                <div key={ind.name} className="flex items-center gap-3">
                  <span className="min-w-0 flex-1 truncate text-xs font-bold text-ink-2">{ind.name}</span>
                  <span className="w-24 shrink-0">
                    <Meter value={stats.total ? (ind.count / stats.total) * 100 : 0} className="!h-1.5" color="#D9894A" />
                  </span>
                  <span className="w-8 shrink-0 text-end text-xs font-black text-ink">{fa(ind.count)}</span>
                  <span
                    className="w-12 shrink-0 text-end text-[11px] font-black"
                    style={{ color: ind.avgSystem === null ? 'var(--og-ink-3)' : scoreHex(ind.avgSystem) }}
                    title="میانگین امتیاز +۳"
                  >
                    {ind.avgSystem === null ? '—' : faPct(ind.avgSystem)}
                  </span>
                </div>
              ))}
              {stats.industries.length === 0 && <p className="py-4 text-center text-xs text-ink-3">داده‌ای وجود ندارد.</p>}
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-[10px] text-ink-3">
              <BookOpen className="h-3 w-3" /> ستون آخر: میانگین امتیاز +۳ هر صنعت
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
};
