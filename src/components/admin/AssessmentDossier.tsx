import React, { useMemo, useRef, useState } from 'react';
import { motion } from 'motion/react';
import {
  Award,
  BookOpen,
  Briefcase,
  Building2,
  CalendarClock,
  Check,
  CheckCircle2,
  ClipboardCopy,
  Flame,
  Hash,
  Hourglass,
  Layers,
  Phone,
  ShieldCheck,
  Target,
  Users,
} from 'lucide-react';
import { Drawer, FilterTabs } from '../ui/kit';
import {
  ANSWER_HEX,
  ANSWER_LABEL,
  Assessment,
  DIMENSION_ORDER,
  DIMENSION_SHORT,
  FA_DIMENSIONS,
  FA_QUESTIONS,
  fa,
  faPct,
  formatFaDate,
  relativeFa,
  scoreHex,
  summariseAssessment,
  tierStyle,
} from './assessmentData';
import { AnswerStrip, Meter, ScoreRing, SystemRadar } from './charts';

type AnswerFilter = 'all' | 'instinct' | 'system';

export const initialsOf = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p.charAt(0))
    .join('‌') || '؟';

export const Avatar: React.FC<{ a: Assessment; size?: 'sm' | 'lg' }> = ({ a, size = 'sm' }) => {
  const hex = a.systemScore === null ? 'var(--og-ink-3)' : scoreHex(a.systemScore);
  const dim = size === 'lg' ? 'h-20 w-20 text-2xl' : 'h-11 w-11 text-sm';
  return (
    <span
      className={`relative inline-flex ${dim} shrink-0 items-center justify-center rounded-2xl font-black text-ink`}
      style={{
        background: `linear-gradient(135deg, ${a.systemScore === null ? 'var(--og-surface-2)' : hex + '33'}, var(--og-surface-2))`,
        boxShadow: `inset 0 0 0 1.5px ${hex}`,
      }}
    >
      {initialsOf(a.fullName)}
      {!a.completed && (
        <span className="absolute -bottom-1 -start-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-surface bg-amber-500 text-white">
          <Hourglass className="h-2.5 w-2.5" />
        </span>
      )}
    </span>
  );
};

const SectionHead: React.FC<{ icon: React.ComponentType<{ className?: string }>; title: string; hint?: string }> = ({
  icon: Icon,
  title,
  hint,
}) => (
  <div className="mb-4 flex items-end justify-between gap-3">
    <h3 className="flex items-center gap-2 text-sm font-black text-ink">
      <Icon className="h-4 w-4 text-copper-hi" />
      {title}
    </h3>
    {hint && <span className="text-[11px] text-ink-3">{hint}</span>}
  </div>
);

export const AssessmentDossier: React.FC<{ assessment: Assessment | null; onClose: () => void }> = ({
  assessment,
  onClose,
}) => (
  <Drawer open={!!assessment} onClose={onClose} size="xl">
    {assessment && <DossierBody a={assessment} />}
  </Drawer>
);

const DossierBody: React.FC<{ a: Assessment }> = ({ a }) => {
  const [filter, setFilter] = useState<AnswerFilter>('all');
  const [copied, setCopied] = useState<'summary' | 'phone' | null>(null);
  const [activeQ, setActiveQ] = useState<number | null>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const tier = tierStyle(a.tierLevel);
  const r = a.result;

  const copy = (text: string, what: 'summary' | 'phone') => {
    navigator.clipboard?.writeText(text).catch(() => {});
    setCopied(what);
    setTimeout(() => setCopied(null), 1800);
  };

  const jumpTo = (qid: number) => {
    setFilter('all');
    setActiveQ(qid);
    requestAnimationFrame(() => {
      const el = scroller.current?.querySelector<HTMLElement>(`[data-q="${qid}"]`);
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  };

  const counts = useMemo(() => {
    const scores = Object.values(a.answers).map((x) => x.score);
    return {
      instinct: scores.filter((s) => s >= 2).length,
      system: scores.filter((s) => s <= 1).length,
      perfect: scores.filter((s) => s === 0).length,
    };
  }, [a.answers]);

  const radarValues = useMemo(
    () =>
      DIMENSION_ORDER.map((dim) => {
        const d = r?.dimensionResults.find((x) => x.dimension === dim);
        return { label: DIMENSION_SHORT[dim], value: d ? 100 - d.percentage : 0 };
      }),
    [r]
  );

  const profile = [
    { icon: Briefcase, label: 'سمت سازمانی', value: a.role },
    { icon: Building2, label: 'صنعت', value: a.industry },
    { icon: Users, label: 'تعداد کارکنان', value: a.headcount },
    { icon: Award, label: 'سابقه مدیریت', value: a.experience },
    { icon: Layers, label: 'محدوده ارزیابی', value: a.scope, wide: true },
  ];

  const questions = FA_QUESTIONS.filter((q) => {
    const ans = a.answers[String(q.id)];
    if (filter === 'instinct') return ans && ans.score >= 2;
    if (filter === 'system') return ans && ans.score <= 1;
    return true;
  });

  return (
    <div ref={scroller} dir="rtl" className="flex-1 overflow-y-auto">
      {/* Hero */}
      <div className="relative overflow-hidden border-b border-line px-6 pb-6 pt-8 sm:px-8">
        <div
          className="pointer-events-none absolute inset-0 opacity-80"
          style={{
            background: `radial-gradient(ellipse at 85% 0%, ${tier ? tier.hex + '30' : 'rgba(184,115,51,0.18)'}, transparent 60%)`,
          }}
        />
        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center">
          <Avatar a={a} size="lg" />
          <div className="min-w-0 flex-1 space-y-2">
            <div className="flex flex-wrap items-center gap-2 pe-12">
              <h2 className="text-2xl font-black text-ink">{a.fullName}</h2>
              {a.completed ? (
                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-black text-emerald-500">
                  <CheckCircle2 className="h-3 w-3" /> تکمیل‌شده
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-[11px] font-black text-amber-500">
                  <Hourglass className="h-3 w-3" /> نیمه‌کاره
                </span>
              )}
            </div>
            <p className="text-sm text-ink-2">{a.role}</p>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-ink-3">
              <span className="inline-flex items-center gap-1.5">
                <Hash className="h-3.5 w-3.5" /> پرونده {fa(a.id)}
              </span>
              <span className="inline-flex items-center gap-1.5" title={formatFaDate(a.date, true)}>
                <CalendarClock className="h-3.5 w-3.5" /> {formatFaDate(a.date, true)} · {relativeFa(a.date)}
              </span>
            </div>
          </div>
        </div>

        <div className="relative mt-5 flex flex-wrap gap-2">
          {a.phone ? (
            <>
              <a
                href={`tel:${a.phone}`}
                className="inline-flex h-10 items-center gap-2 rounded-xl bg-gradient-to-br from-[#D9894A] via-[#B87333] to-[#7A3E14] px-4 text-sm font-bold text-white shadow-[0_10px_30px_-12px_rgba(217,137,74,0.8)] hover:brightness-110"
              >
                <Phone className="h-4 w-4" />
                <span dir="ltr">{fa(a.phone)}</span>
              </a>
              <button
                onClick={() => copy(a.phone, 'phone')}
                className="inline-flex h-10 items-center gap-2 rounded-xl border border-line-strong bg-surface px-3 text-xs font-bold text-ink-2 hover:border-copper/60 hover:text-copper-hi"
              >
                {copied === 'phone' ? <Check className="h-4 w-4 text-emerald-500" /> : <ClipboardCopy className="h-4 w-4" />}
                {copied === 'phone' ? 'کپی شد' : 'کپی شماره'}
              </button>
            </>
          ) : (
            <span className="inline-flex h-10 items-center gap-2 rounded-xl border border-dashed border-line-strong px-4 text-xs text-ink-3">
              <Phone className="h-4 w-4" /> شماره تماس وارد نشده
            </span>
          )}
          <button
            onClick={() => copy(summariseAssessment(a), 'summary')}
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-line-strong bg-surface px-3 text-xs font-bold text-ink-2 hover:border-copper/60 hover:text-copper-hi"
          >
            {copied === 'summary' ? <Check className="h-4 w-4 text-emerald-500" /> : <ClipboardCopy className="h-4 w-4" />}
            {copied === 'summary' ? 'خلاصه کپی شد' : 'کپی خلاصه پرونده'}
          </button>
        </div>
      </div>

      <div className="space-y-8 px-6 py-7 sm:px-8">
        {/* Profile */}
        <section>
          <SectionHead icon={Briefcase} title="مشخصات شرکت‌کننده" />
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {profile.map((p) => (
              <div
                key={p.label}
                className={`flex items-start gap-3 rounded-2xl border border-line bg-surface-2/50 p-3.5 ${p.wide ? 'sm:col-span-2' : ''}`}
              >
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-copper/12 text-copper-hi">
                  <p.icon className="h-4 w-4" />
                </span>
                <div className="min-w-0">
                  <div className="text-[11px] font-bold text-ink-3">{p.label}</div>
                  <div className="mt-0.5 text-sm font-bold leading-6 text-ink">{p.value || '—'}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {!a.completed || !r || a.systemScore === null ? (
          <section className="rounded-3xl border border-dashed border-amber-500/40 bg-amber-500/5 p-6 text-center">
            <Hourglass className="mx-auto h-10 w-10 text-amber-500" />
            <h3 className="mt-3 text-base font-black text-ink">این مدیر آزمون را شروع کرد ولی به پایان نرساند</h3>
            <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-ink-2">
              اطلاعات فردی او ثبت شده اما پاسخی ذخیره نشده است. این یک سرنخ گرم است؛ یک تماس کوتاه می‌تواند او را به
              تکمیل آزمون یا خرید کتاب برساند.
            </p>
          </section>
        ) : (
          <>
            {/* Verdict */}
            <section className="grid gap-4 sm:grid-cols-[auto_1fr]">
              <div className="flex flex-col items-center justify-center rounded-3xl border border-line bg-surface-2/50 p-5">
                <ScoreRing value={a.systemScore} size={132} stroke={10} textClass="text-4xl" label="امتیاز +۳" />
                <div className="mt-3 text-[11px] text-ink-3">
                  رفتار غریزی: <b className="text-ink-2">{faPct(100 - a.systemScore)}</b> · خام: {fa(a.rawScore)} از ۷۲
                </div>
              </div>
              <div className="space-y-3">
                {tier && (
                  <div className="rounded-3xl border p-4" style={{ borderColor: tier.hex + '55', background: tier.hex + '12' }}>
                    <div className="text-[11px] font-black" style={{ color: tier.hex }}>
                      سطح {fa(tier.level)} از ۵ · {tier.name}
                    </div>
                    <div className="mt-1 text-sm font-black text-ink">{r.tier.titleFa}</div>
                    <p className="mt-1.5 text-xs leading-6 text-ink-2">{r.tier.descriptionFa}</p>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-line bg-surface-2/50 p-3.5">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-ink-3">
                      <ShieldCheck className="h-3.5 w-3.5" /> ثبات پاسخ‌ها
                    </div>
                    <div
                      className={`mt-1 text-sm font-black ${
                        r.consistency.level === 'high'
                          ? 'text-teal-500'
                          : r.consistency.level === 'medium'
                            ? 'text-amber-500'
                            : 'text-red-500'
                      }`}
                    >
                      {r.consistency.titleFa}
                    </div>
                    <div className="mt-0.5 text-[10px] text-ink-3">میانگین اختلاف جفت‌سؤال‌ها: {fa(r.consistency.score)}</div>
                  </div>
                  <div className="rounded-2xl border border-line bg-surface-2/50 p-3.5">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-ink-3">
                      <Target className="h-3.5 w-3.5" /> پاسخ‌های +۳
                    </div>
                    <div className="mt-1 text-sm font-black text-ink">
                      {fa(counts.perfect)} <span className="text-xs text-ink-3">از ۲۴ سؤال</span>
                    </div>
                    <div className="mt-0.5 text-[10px] text-ink-3">
                      {fa(counts.instinct)} پاسخ غریزی · {fa(counts.system)} پاسخ سیستمی
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Strength + hotspots */}
            <section className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-3xl border border-teal-500/30 bg-teal-500/8 p-4">
                <div className="flex items-center gap-1.5 text-[11px] font-black text-teal-500">
                  <Award className="h-3.5 w-3.5" /> قوی‌ترین ژن مدیریتی
                </div>
                <div className="mt-1.5 text-sm font-black leading-6 text-ink">{r.keyStrength.titleFa}</div>
                <div className="mt-1 text-xs text-ink-2">امتیاز سیستمی {faPct(100 - r.keyStrength.percentage)}</div>
              </div>
              <div className="rounded-3xl border border-red-500/30 bg-red-500/8 p-4">
                <div className="flex items-center gap-1.5 text-[11px] font-black text-red-500">
                  <Flame className="h-3.5 w-3.5" /> سه نقطه داغ (نیازمند مداخله)
                </div>
                <ol className="mt-1.5 space-y-1.5">
                  {r.hotspots.map((h, i) => (
                    <li key={h.dimension} className="flex items-start justify-between gap-2 text-xs">
                      <span className="font-bold leading-5 text-ink">
                        {fa(i + 1)}. {h.titleFa}
                      </span>
                      <span className="shrink-0 font-black text-red-500">{faPct(100 - h.percentage)}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </section>

            {/* Radar + bars */}
            <section>
              <SectionHead icon={Target} title="نقشه ۸ بُعد مدیریتی" hint="لبه بیرونی = کاملاً سیستمی" />
              <div className="grid items-center gap-6 rounded-3xl border border-line bg-surface-2/40 p-5 md:grid-cols-2">
                <SystemRadar values={radarValues} size={320} />
                <div className="space-y-3">
                  {[...r.dimensionResults]
                    .sort((x, y) => y.percentage - x.percentage)
                    .map((d, i) => (
                      <div key={d.dimension}>
                        <div className="mb-1 flex items-center justify-between text-xs">
                          <span className="font-bold text-ink-2">{FA_DIMENSIONS[d.dimension].title}</span>
                          <span className="font-black" style={{ color: scoreHex(100 - d.percentage) }}>
                            {faPct(100 - d.percentage)}
                          </span>
                        </div>
                        <Meter value={100 - d.percentage} delay={0.2 + i * 0.06} />
                      </div>
                    ))}
                </div>
              </div>
            </section>

            {/* Book prescription */}
            <section>
              <SectionHead icon={BookOpen} title="نسخه مطالعه پیشنهادی برای این مدیر" />
              <div className="space-y-2">
                {r.bookRecommendations.map((b) => (
                  <div key={b.dimension} className="flex items-start gap-3 rounded-2xl border border-line bg-surface-2/40 p-3.5">
                    <BookOpen className="mt-0.5 h-4 w-4 shrink-0 text-copper-hi" />
                    <div>
                      <div className="text-xs font-black text-ink">{b.titleFa}</div>
                      <div className="mt-0.5 text-[11px] leading-5 text-ink-3">{b.chapterRefFa}</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Answers */}
            <section>
              <SectionHead icon={CheckCircle2} title="پاسخ‌نامه کامل" hint="روی هر خانه بزنید تا به آن سؤال بروید" />
              <div className="mb-3 rounded-2xl border border-line bg-surface-2/40 p-3">
                <AnswerStrip answers={a.answers} size="md" onPick={jumpTo} activeId={activeQ} />
                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[10px] text-ink-3">
                  {ANSWER_LABEL.map((label, s) => (
                    <span key={label} className="inline-flex items-center gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-sm" style={{ background: ANSWER_HEX[s] }} />
                      {label} ({fa(s)})
                    </span>
                  ))}
                </div>
              </div>

              <FilterTabs<AnswerFilter>
                className="mb-4"
                value={filter}
                onChange={setFilter}
                options={[
                  { value: 'all', label: 'همه سؤال‌ها', count: fa(24) },
                  { value: 'instinct', label: 'پاسخ‌های غریزی', count: fa(counts.instinct) },
                  { value: 'system', label: 'پاسخ‌های سیستمی', count: fa(counts.system) },
                ]}
              />

              <div className="space-y-3">
                {questions.map((q) => {
                  const ans = a.answers[String(q.id)];
                  const hex = ans ? ANSWER_HEX[ans.score] : 'var(--og-line-strong)';
                  return (
                    <motion.article
                      key={q.id}
                      data-q={q.id}
                      layout
                      className={`overflow-hidden rounded-3xl border bg-surface transition-shadow ${
                        activeQ === q.id ? 'border-copper og-shadow' : 'border-line'
                      }`}
                    >
                      <div className="flex items-start gap-3 border-b border-line p-4" style={{ boxShadow: `inset -4px 0 0 ${hex}` }}>
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-surface-2 text-xs font-black text-ink-2">
                          {fa(q.id)}
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h4 className="text-sm font-black text-ink">{q.title}</h4>
                            <span className="rounded-md bg-copper/10 px-1.5 py-0.5 text-[10px] font-bold text-copper-hi">
                              {DIMENSION_SHORT[q.dimension]}
                            </span>
                          </div>
                          <p className="mt-1.5 text-xs leading-6 text-ink-2">{q.scenario}</p>
                        </div>
                        {ans && (
                          <span
                            className="shrink-0 rounded-lg px-2 py-1 text-[10px] font-black text-white"
                            style={{ background: ANSWER_HEX[ans.score] }}
                          >
                            {ANSWER_LABEL[ans.score]}
                          </span>
                        )}
                      </div>
                      <ul className="space-y-1.5 p-3">
                        {q.options.map((o) => {
                          const chosen = ans?.optionId === o.id;
                          const best = o.score === 0;
                          return (
                            <li
                              key={o.id}
                              className={`flex items-start gap-3 rounded-2xl p-2.5 text-xs leading-6 ${
                                chosen ? 'bg-surface-2 ring-1' : ''
                              }`}
                              style={chosen ? { boxShadow: `inset 0 0 0 1.5px ${ANSWER_HEX[o.score]}` } : undefined}
                            >
                              <span
                                className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-[10px] font-black uppercase ${
                                  chosen ? 'text-white' : 'border border-line-strong text-ink-3'
                                }`}
                                style={chosen ? { background: ANSWER_HEX[o.score] } : undefined}
                              >
                                {o.id}
                              </span>
                              <span className={`flex-1 ${chosen ? 'font-bold text-ink' : 'text-ink-3'}`}>{o.text}</span>
                              <span className="flex shrink-0 flex-col items-end gap-1">
                                <span className="rounded-md px-1.5 text-[10px] font-black" style={{ color: ANSWER_HEX[o.score] }}>
                                  {fa(o.score)} امتیاز
                                </span>
                                {chosen && <span className="text-[10px] font-black text-ink">انتخاب او</span>}
                                {!chosen && best && <span className="text-[10px] font-bold text-teal-500">پاسخ +۳</span>}
                              </span>
                            </li>
                          );
                        })}
                        {!ans && <li className="p-2.5 text-xs text-ink-3">به این سؤال پاسخی ثبت نشده است.</li>}
                      </ul>
                    </motion.article>
                  );
                })}
                {questions.length === 0 && (
                  <div className="rounded-3xl border border-dashed border-line-strong p-8 text-center text-sm text-ink-3">
                    در این دسته پاسخی وجود ندارد.
                  </div>
                )}
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
};
