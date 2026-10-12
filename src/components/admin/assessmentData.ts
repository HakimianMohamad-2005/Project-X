import { useCallback, useEffect, useMemo, useState } from 'react';
import { AssessmentDimension, AssessmentQuestion } from '../../data/managerAssessment';
import { getLocalizedQuestions } from '../../data/assessmentQuestionsI18n';
import { getIntakeFormOptions, getLocalizedDimensionMetas } from '../../data/assessmentMetadataI18n';
import { AdvancedAssessmentResult, evaluateAdvancedAssessment } from '../../lib/managerAssessment';
import { SESSION_ADMIN_PASSCODE_KEY } from '../../context/VisitorContext';
import { toPersianDigits } from '../../utils/persian';

/* ------------------------------------------------------------------
   Types
   ------------------------------------------------------------------ */

export type AnswerMap = Record<string, { optionId: string; score: number }>;

/** One row of `advanced_assessments`, as returned by get_assessments.php. */
export interface AssessmentRecord {
  id: number;
  createdAt: string;
  fullName: string;
  phone: string;
  role: string;
  industry: string;
  headcount: string;
  experience: string;
  scope: string;
  rawScore: number;
  percentage: number;
  tierTitle: string;
  consistencyLevel: string;
  consistencyScore: string;
  keyStrength: string;
  hotspots: { dimension: string; title: string; percentage: number }[];
  answers: AnswerMap;
  status: string;
}

/** A record plus everything the dashboard derives from it (in Persian). */
export interface Assessment extends AssessmentRecord {
  date: Date;
  completed: boolean;
  answeredCount: number;
  result: AdvancedAssessmentResult | null;
  /** 0–100, higher = more systematic (the "+3"). Inverse of the stored instinct percentage. */
  systemScore: number | null;
  /** 1 (+3 embedded) … 5 (critical orangutan). */
  tierLevel: number | null;
}

export type DataSource = 'api' | 'demo';

/* ------------------------------------------------------------------
   Shared Persian lookups
   ------------------------------------------------------------------ */

export const FA_QUESTIONS: AssessmentQuestion[] = getLocalizedQuestions('fa');
export const FA_DIMENSIONS = getLocalizedDimensionMetas('fa');
export const DIMENSION_ORDER: AssessmentDimension[] = [
  'reality',
  'execution',
  'systems',
  'memory',
  'culture',
  'data',
  'operations',
  'market',
];

/** Short labels for tight spaces (radar axes, chips). */
export const DIMENSION_SHORT: Record<AssessmentDimension, string> = {
  reality: 'مواجهه با واقعیت',
  execution: 'اجرا و پیگیری',
  systems: 'سیستم‌سازی',
  memory: 'حافظه سازمانی',
  culture: 'فرهنگ و خطا',
  data: 'داده و گزارش',
  operations: 'عملیات و انبار',
  market: 'بازار و فروش',
};

export interface TierStyle {
  level: number;
  name: string;
  hex: string;
  chip: string;
}

/** Ordered from the orangutan end (5) to the +3 end (1). */
export const TIERS: TierStyle[] = [
  { level: 5, name: 'بحرانی اورانگوتانی', hex: '#E05A47', chip: 'bg-red-500/12 text-red-500 border-red-500/30' },
  { level: 4, name: 'غریزی شدید', hex: '#F08C3A', chip: 'bg-orange-500/12 text-orange-500 border-orange-500/30' },
  { level: 3, name: 'غریزی متوسط', hex: '#E0B13A', chip: 'bg-amber-500/12 text-amber-500 border-amber-500/30' },
  { level: 2, name: 'در مسیر تکامل', hex: '#34C38F', chip: 'bg-emerald-500/12 text-emerald-500 border-emerald-500/30' },
  { level: 1, name: '+۳ نهادینه‌شده', hex: '#14B8A6', chip: 'bg-teal-500/12 text-teal-500 border-teal-500/30' },
];

export const tierStyle = (level: number | null): TierStyle | null =>
  level === null ? null : TIERS.find((t) => t.level === level) || null;

/** Same thresholds as getTierByPercentage, on the instinct percentage. */
export function tierLevelFromInstinct(instinctPct: number): number {
  if (instinctPct <= 19) return 1;
  if (instinctPct <= 39) return 2;
  if (instinctPct <= 59) return 3;
  if (instinctPct <= 79) return 4;
  return 5;
}

/** Colour for a 0–100 system score: red → amber → green. */
export function scoreHex(systemScore: number): string {
  if (systemScore >= 80) return '#14B8A6';
  if (systemScore >= 60) return '#34C38F';
  if (systemScore >= 40) return '#E0B13A';
  if (systemScore >= 20) return '#F08C3A';
  return '#E05A47';
}

/** Colour for a single answer score (0 = the +3 answer, 3 = pure instinct). */
export const ANSWER_HEX = ['#14B8A6', '#9BBF5A', '#F08C3A', '#E05A47'];
export const ANSWER_LABEL = ['پاسخ +۳', 'نیمه‌سیستمی', 'غریزی', 'کاملاً غریزی'];

export const fa = (v: number | string) => toPersianDigits(v);
export const faPct = (v: number) => `${toPersianDigits(v)}٪`;

/* ------------------------------------------------------------------
   Dates
   ------------------------------------------------------------------ */

/** MySQL "YYYY-MM-DD HH:MM:SS" (server local time) → Date. */
export function parseDbDate(value: string): Date {
  if (!value) return new Date(NaN);
  const d = new Date(value.includes('T') ? value : value.replace(' ', 'T'));
  return d;
}

export function formatFaDate(d: Date, withTime = false): string {
  if (isNaN(d.getTime())) return '—';
  const opts: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  if (withTime) {
    opts.hour = '2-digit';
    opts.minute = '2-digit';
  }
  return new Intl.DateTimeFormat('fa-IR', opts).format(d);
}

export function relativeFa(d: Date, now = Date.now()): string {
  if (isNaN(d.getTime())) return '—';
  const diff = (d.getTime() - now) / 1000;
  const rtf = new Intl.RelativeTimeFormat('fa', { numeric: 'auto' });
  const abs = Math.abs(diff);
  if (abs < 60) return 'همین حالا';
  if (abs < 3600) return rtf.format(Math.round(diff / 60), 'minute');
  if (abs < 86400) return rtf.format(Math.round(diff / 3600), 'hour');
  if (abs < 86400 * 30) return rtf.format(Math.round(diff / 86400), 'day');
  return formatFaDate(d);
}

export const dayKey = (d: Date) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;

/* ------------------------------------------------------------------
   Normalising + enrichment
   ------------------------------------------------------------------ */

function normaliseAnswers(raw: unknown): AnswerMap {
  const out: AnswerMap = {};
  if (!raw || typeof raw !== 'object') return out;
  // PHP may hand back a list when the keys were sequential; both shapes are accepted.
  const entries: [string, unknown][] = Array.isArray(raw)
    ? raw.map((v, i) => [String(i), v] as [string, unknown])
    : Object.entries(raw as Record<string, unknown>);
  for (const [key, val] of entries) {
    if (val && typeof val === 'object' && 'optionId' in val) {
      const v = val as { optionId: unknown; score: unknown };
      out[key] = { optionId: String(v.optionId), score: Number(v.score) || 0 };
    }
  }
  return out;
}

export function enrich(rec: AssessmentRecord): Assessment {
  const answers = normaliseAnswers(rec.answers);
  const answeredCount = Object.keys(answers).length;
  const completed = rec.status === 'completed' && answeredCount > 0;
  let result: AdvancedAssessmentResult | null = null;

  if (completed) {
    try {
      result = evaluateAdvancedAssessment(
        {
          fullName: rec.fullName,
          phone: rec.phone,
          role: rec.role,
          industry: rec.industry,
          headcount: rec.headcount,
          experience: rec.experience,
          scope: rec.scope,
          createdAt: rec.createdAt,
        },
        answers as unknown as Record<number, { optionId: string; score: number }>,
        'fa'
      );
    } catch {
      result = null;
    }
  }

  const instinct = result ? result.engagementPercentage : completed ? rec.percentage : null;

  return {
    ...rec,
    answers,
    date: parseDbDate(rec.createdAt),
    completed,
    answeredCount,
    result,
    systemScore: instinct === null ? null : 100 - instinct,
    tierLevel: instinct === null ? null : tierLevelFromInstinct(instinct),
  };
}

/* ------------------------------------------------------------------
   Fetching
   ------------------------------------------------------------------ */

function readPasscode(): string {
  try {
    return sessionStorage.getItem(SESSION_ADMIN_PASSCODE_KEY) || '';
  } catch {
    return '';
  }
}

export class AdminAuthError extends Error {}

async function fetchFromApi(): Promise<AssessmentRecord[]> {
  const passcode = readPasscode();
  if (!passcode) throw new AdminAuthError('missing passcode');
  const res = await fetch('/api/get_assessments.php', {
    headers: { 'X-Admin-Passcode': passcode },
    cache: 'no-store',
  });
  if (res.status === 403) throw new AdminAuthError('forbidden');
  const data = await res.json();
  if (!data || !data.success || !Array.isArray(data.assessments)) {
    throw new Error((data && data.message) || 'پاسخ نامعتبر از سرور');
  }
  return data.assessments as AssessmentRecord[];
}

export interface AssessmentsState {
  items: Assessment[];
  loading: boolean;
  error: string | null;
  authError: boolean;
  source: DataSource;
  lastUpdated: Date | null;
  reload: () => void;
}

export function useAssessments(): AssessmentsState {
  const [records, setRecords] = useState<AssessmentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [authError, setAuthError] = useState(false);
  const [source, setSource] = useState<DataSource>('api');
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    setAuthError(false);

    fetchFromApi()
      .then((rows) => {
        if (cancelled) return;
        setRecords(rows);
        setSource('api');
      })
      .catch((err) => {
        if (cancelled) return;
        if (import.meta.env.DEV && !(err instanceof AdminAuthError && err.message === 'forbidden')) {
          // PHP doesn't run on the Vite dev server; show a realistic sample instead.
          setRecords(buildDemoRecords());
          setSource('demo');
          return;
        }
        if (err instanceof AdminAuthError) setAuthError(true);
        else setError('دریافت نتایج از سرور ممکن نشد. اتصال اینترنت یا دیتابیس را بررسی کنید.');
        setRecords([]);
      })
      .finally(() => {
        if (cancelled) return;
        setLoading(false);
        setLastUpdated(new Date());
      });

    return () => {
      cancelled = true;
    };
  }, [tick]);

  const items = useMemo(() => records.map(enrich), [records]);
  const reload = useCallback(() => setTick((t) => t + 1), []);

  return { items, loading, error, authError, source, lastUpdated, reload };
}

/* ------------------------------------------------------------------
   Aggregate analytics
   ------------------------------------------------------------------ */

export interface AssessmentStats {
  total: number;
  completed: Assessment[];
  startedOnly: number;
  completionRate: number;
  avgSystem: number;
  today: number;
  last7: number;
  tierCounts: Record<number, number>;
  dimensionAvg: { dimension: AssessmentDimension; title: string; short: string; system: number; chapter: string }[];
  daily: { key: string; date: Date; count: number }[];
  hardestQuestions: { question: AssessmentQuestion; avgScore: number; instinctShare: number }[];
  industries: { name: string; count: number; avgSystem: number | null }[];
}

export function computeStats(items: Assessment[], days = 14): AssessmentStats {
  const completed = items.filter((a) => a.completed && a.systemScore !== null);
  const now = new Date();
  const todayKey = dayKey(now);
  const weekAgo = now.getTime() - 7 * 86400 * 1000;

  const tierCounts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  completed.forEach((a) => {
    if (a.tierLevel) tierCounts[a.tierLevel] += 1;
  });

  const dimensionAvg = DIMENSION_ORDER.map((dim) => {
    const values = completed
      .map((a) => a.result?.dimensionResults.find((d) => d.dimension === dim)?.percentage)
      .filter((v): v is number => typeof v === 'number');
    const instinct = values.length ? values.reduce((s, v) => s + v, 0) / values.length : 0;
    return {
      dimension: dim,
      title: FA_DIMENSIONS[dim].title,
      short: DIMENSION_SHORT[dim],
      system: values.length ? Math.round(100 - instinct) : 0,
      chapter: FA_DIMENSIONS[dim].bookChapterRef,
    };
  });

  const daily: AssessmentStats['daily'] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
    daily.push({ key: dayKey(d), date: d, count: 0 });
  }
  const dailyIndex = new Map(daily.map((d, i) => [d.key, i]));
  items.forEach((a) => {
    const idx = dailyIndex.get(dayKey(a.date));
    if (idx !== undefined) daily[idx].count += 1;
  });

  const hardestQuestions = FA_QUESTIONS.map((q) => {
    const scores = completed
      .map((a) => a.answers[String(q.id)]?.score)
      .filter((v): v is number => typeof v === 'number');
    const avgScore = scores.length ? scores.reduce((s, v) => s + v, 0) / scores.length : 0;
    const instinctShare = scores.length ? Math.round((scores.filter((s) => s >= 2).length / scores.length) * 100) : 0;
    return { question: q, avgScore, instinctShare };
  })
    .filter((q) => q.avgScore > 0)
    .sort((a, b) => b.avgScore - a.avgScore)
    .slice(0, 3);

  const industryMap = new Map<string, Assessment[]>();
  items.forEach((a) => {
    const key = a.industry || 'نامشخص';
    industryMap.set(key, [...(industryMap.get(key) || []), a]);
  });
  const industries = Array.from(industryMap.entries())
    .map(([name, list]) => {
      const done = list.filter((a) => a.systemScore !== null);
      return {
        name,
        count: list.length,
        avgSystem: done.length ? Math.round(done.reduce((s, a) => s + (a.systemScore || 0), 0) / done.length) : null,
      };
    })
    .sort((a, b) => b.count - a.count);

  return {
    total: items.length,
    completed,
    startedOnly: items.length - completed.length,
    completionRate: items.length ? Math.round((completed.length / items.length) * 100) : 0,
    avgSystem: completed.length
      ? Math.round(completed.reduce((s, a) => s + (a.systemScore || 0), 0) / completed.length)
      : 0,
    today: items.filter((a) => dayKey(a.date) === todayKey).length,
    last7: items.filter((a) => a.date.getTime() >= weekAgo).length,
    tierCounts,
    dimensionAvg,
    daily,
    hardestQuestions,
    industries,
  };
}

/* ------------------------------------------------------------------
   CSV export (UTF-8 BOM so Excel shows Persian correctly)
   ------------------------------------------------------------------ */

const csvCell = (v: unknown) => `"${String(v ?? '').replace(/"/g, '""')}"`;

export function exportAssessmentsCsv(items: Assessment[]) {
  const headers = [
    'شناسه',
    'تاریخ ثبت',
    'نام و نام خانوادگی',
    'تلفن',
    'سمت',
    'صنعت',
    'تعداد کارکنان',
    'سابقه مدیریت',
    'محدوده ارزیابی',
    'وضعیت',
    'امتیاز +۳ (سیستمی)',
    'درصد رفتار غریزی',
    'سطح',
    'ثبات پاسخ‌ها',
    'نقطه قوت',
    'نقطه داغ ۱',
    'نقطه داغ ۲',
    'نقطه داغ ۳',
    ...FA_QUESTIONS.map((q) => `س${q.id}: ${q.title}`),
  ];

  const rows = items.map((a) => {
    const hs = a.result?.hotspots || [];
    return [
      a.id,
      formatFaDate(a.date, true),
      a.fullName,
      a.phone,
      a.role,
      a.industry,
      a.headcount,
      a.experience,
      a.scope,
      a.completed ? 'تکمیل‌شده' : 'نیمه‌کاره',
      a.systemScore ?? '',
      a.systemScore === null ? '' : 100 - a.systemScore,
      tierStyle(a.tierLevel)?.name || '',
      a.result?.consistency.titleFa || '',
      a.result?.keyStrength.titleFa || '',
      hs[0]?.titleFa || '',
      hs[1]?.titleFa || '',
      hs[2]?.titleFa || '',
      ...FA_QUESTIONS.map((q) => {
        const ans = a.answers[String(q.id)];
        return ans ? `${ans.optionId.toUpperCase()} (${ans.score})` : '';
      }),
    ].map(csvCell);
  });

  const csv = '﻿' + [headers.map(csvCell).join(','), ...rows.map((r) => r.join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `orangutan3_assessments_${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

/** Plain-text summary for pasting into a message or CRM. */
export function summariseAssessment(a: Assessment): string {
  const lines = [
    `پرونده آزمون پیشرفته #${fa(a.id)} — ${a.fullName}`,
    `تاریخ: ${formatFaDate(a.date, true)}`,
    a.phone ? `تلفن: ${fa(a.phone)}` : '',
    `سمت: ${a.role} | صنعت: ${a.industry}`,
    `کارکنان: ${a.headcount} | سابقه: ${a.experience}`,
  ];
  if (a.result && a.systemScore !== null) {
    lines.push(
      `امتیاز +۳: ${faPct(a.systemScore)} — ${tierStyle(a.tierLevel)?.name || ''}`,
      `ثبات پاسخ‌ها: ${a.result.consistency.titleFa}`,
      `نقطه قوت: ${a.result.keyStrength.titleFa}`,
      `نقاط داغ: ${a.result.hotspots.map((h) => h.titleFa).join('، ')}`
    );
  } else {
    lines.push('وضعیت: آزمون شروع شده ولی تکمیل نشده است.');
  }
  return lines.filter(Boolean).join('\n');
}

/* ------------------------------------------------------------------
   Dev-only sample data (the PHP API is not executed by Vite)
   ------------------------------------------------------------------ */

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildDemoRecords(): AssessmentRecord[] {
  const rnd = mulberry32(1403);
  const pick = <T,>(arr: T[]) => arr[Math.floor(rnd() * arr.length)];
  const opts = getIntakeFormOptions('fa');
  const first = ['محمد', 'علی', 'زهرا', 'مریم', 'حسین', 'سارا', 'رضا', 'فاطمه', 'امیر', 'نرگس', 'مهدی', 'لیلا', 'کاوه', 'شیرین', 'بهرام', 'آزاده'];
  const last = ['رضایی', 'محمدی', 'کریمی', 'حسینی', 'احمدی', 'موسوی', 'جعفری', 'صادقی', 'نوری', 'طاهری', 'کاظمی', 'رحیمی', 'افشار', 'توکلی'];
  const now = Date.now();
  const out: AssessmentRecord[] = [];

  for (let i = 0; i < 38; i++) {
    // Each respondent leans towards instinct or system; answers scatter around that lean.
    const lean = rnd() * 2.4 + 0.1;
    const started = rnd() < 0.18;
    const answers: AnswerMap = {};
    if (!started) {
      FA_QUESTIONS.forEach((q) => {
        const target = Math.max(0, Math.min(3, Math.round(lean + (rnd() - 0.5) * 2.2)));
        const opt = q.options.find((o) => o.score === target) || pick(q.options);
        answers[String(q.id)] = { optionId: opt.id, score: opt.score };
      });
    }
    const raw = Object.values(answers).reduce((s, a) => s + a.score, 0);
    const created = new Date(now - Math.pow(rnd(), 1.6) * 20 * 86400 * 1000);
    const pad = (n: number) => String(n).padStart(2, '0');
    out.push({
      id: 412 - i,
      createdAt: `${created.getFullYear()}-${pad(created.getMonth() + 1)}-${pad(created.getDate())} ${pad(created.getHours())}:${pad(created.getMinutes())}:00`,
      fullName: `${pick(first)} ${pick(last)}`,
      phone: rnd() < 0.8 ? `09${Math.floor(100000000 + rnd() * 899999999)}` : '',
      role: pick(opts.roles).value,
      industry: pick(opts.industries).value,
      headcount: pick(opts.headcounts).value,
      experience: pick(opts.experiences).value,
      scope: pick(opts.scopes).value,
      rawScore: raw,
      percentage: started ? 0 : Math.round((raw / 72) * 100),
      tierTitle: '',
      consistencyLevel: '',
      consistencyScore: '',
      keyStrength: '',
      hotspots: [],
      answers,
      status: started ? 'started' : 'completed',
    });
  }
  return out.sort((a, b) => b.createdAt.localeCompare(a.createdAt)).map((r, i) => ({ ...r, id: 412 - i }));
}
