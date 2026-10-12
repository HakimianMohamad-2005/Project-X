import { useCallback, useEffect, useMemo, useState } from 'react';
import { SESSION_ADMIN_PASSCODE_KEY } from '../../context/VisitorContext';
import { dayKey } from './assessmentData';

/* ------------------------------------------------------------------
   Types (shape of get_telemetry.php)
   ------------------------------------------------------------------ */

export interface LiveSession {
  visitorId: string;
  sessionId: string;
  currentPath: string;
  device: string;
  os: string;
  browser: string;
  city: string;
  country: string;
  pageViews: number;
  onSiteSeconds: number;
  idleSeconds: number;
}

export interface VisitRecord {
  id: number;
  visitorId: string;
  sessionId: string;
  ageSeconds: number;
  idleSeconds: number;
  online: boolean;
  ip: string;
  city: string;
  country: string;
  device: string;
  os: string;
  browser: string;
  gpu: string;
  cpu: number;
  ram: number | null;
  battery: number | null;
  network: string;
  screen: string;
  currentPath: string;
  duration: number;
  pageViews: number;
  referrer: string;
  details: any | null;
}

export interface Bucket {
  name: string;
  count: number;
}

export interface TelemetryReport {
  ready: boolean;
  onlineWindowSeconds: number;
  live: { online: number; sessions: LiveSession[] };
  totals: {
    visits: number;
    visitors: number;
    pageViews: number;
    avgDuration: number;
    bounces: number;
    returning: number;
    todayVisits: number;
    todayVisitors: number;
    last7Visits: number;
    last7Visitors: number;
  };
  hourly: { h: number; n: number }[];
  devices: Bucket[];
  os: Bucket[];
  browsers: Bucket[];
  cities: Bucket[];
  sections: { section: string; path: string; count: number }[];
  referrers: Bucket[];
  recent: VisitRecord[];
}

/* ------------------------------------------------------------------
   Labels
   ------------------------------------------------------------------ */

export const SECTION_LABEL: Record<string, string> = {
  home: 'صفحه اصلی',
  books: 'صفحه اصلی و خرید کتاب',
  framework: 'مدل +۳',
  quiz: 'آزمون مدیریتی',
  'case-studies': 'پرونده‌های صنعت',
  cards: 'کارت‌های تصمیم',
  'mistakes-lessons': '۴۰ اشتباه و درس',
  'user-experiences': 'تجربیات خوانندگان',
  faq: 'پرسش‌ها',
  b2b: 'سفارش سازمانی',
  author: 'درباره نویسنده',
  admin: 'پنل مدیریت',
};

const LANG_LABEL: Record<string, string> = {
  en: 'انگلیسی',
  es: 'اسپانیایی',
  de: 'آلمانی',
  fr: 'فرانسوی',
  zh: 'چینی',
  ja: 'ژاپنی',
  hi: 'هندی',
  ar: 'عربی',
};

/** "Quiz (English)" style label for a section + path. */
export function sectionLabel(section: string, path = ''): string {
  const base = SECTION_LABEL[section] || (section ? section : path || '/');
  const lang = (path.match(/^\/(en|es|de|fr|zh|ja|hi|ar)(\/|$)/) || [])[1];
  return lang ? `${base} (${LANG_LABEL[lang]})` : base;
}

export function sectionFromPath(path: string): string {
  if (path.includes('/admin')) return 'admin';
  if (path.includes('/manager-assessment') || path.includes('/quiz')) return 'quiz';
  if (path.includes('/user-experiences') || path.includes('/reviews')) return 'user-experiences';
  return 'books';
}

export const DEVICE_LABEL: Record<string, string> = { desktop: 'دسکتاپ', mobile: 'موبایل', tablet: 'تبلت' };

export function referrerLabel(ref: string): string {
  if (!ref) return 'ورود مستقیم';
  try {
    const host = new URL(ref).hostname.replace(/^www\./, '');
    if (/google\./.test(host)) return 'گوگل';
    if (/bing\.|yahoo\.|duckduckgo\./.test(host)) return 'موتور جستجو';
    if (/instagram\./.test(host)) return 'اینستاگرام';
    if (/t\.me|telegram\./.test(host)) return 'تلگرام';
    if (/linkedin\./.test(host)) return 'لینکدین';
    if (/whatsapp\./.test(host)) return 'واتس‌اپ';
    if (/twitter\.|x\.com|t\.co/.test(host)) return 'ایکس (توییتر)';
    if (/eitaa\.|bale\.|rubika\./.test(host)) return 'پیام‌رسان داخلی';
    return host;
  } catch {
    return ref.slice(0, 40);
  }
}

/** Seconds → "۳ دقیقه و ۱۲ ثانیه" style (Persian digits applied by the caller). */
export function durationParts(sec: number): string {
  const s = Math.max(0, Math.round(sec));
  if (s < 60) return `${s} ثانیه`;
  const m = Math.floor(s / 60);
  if (m < 60) return s % 60 ? `${m} دقیقه و ${s % 60} ثانیه` : `${m} دقیقه`;
  const h = Math.floor(m / 60);
  return m % 60 ? `${h} ساعت و ${m % 60} دقیقه` : `${h} ساعت`;
}

/** Visits per local calendar day for the last `days` days (server sends hours-ago buckets). */
export function dailyFromHourly(hourly: { h: number; n: number }[], days = 14) {
  const now = new Date();
  const out: { key: string; date: Date; count: number }[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
    out.push({ key: dayKey(d), date: d, count: 0 });
  }
  const index = new Map(out.map((d, i) => [d.key, i]));
  hourly.forEach(({ h, n }) => {
    // Middle of the bucket keeps rounding errors off day boundaries.
    const at = new Date(now.getTime() - (h + 0.5) * 3600 * 1000);
    const i = index.get(dayKey(at));
    if (i !== undefined) out[i].count += n;
  });
  return out;
}

/* ------------------------------------------------------------------
   Fetching with live polling
   ------------------------------------------------------------------ */

const POLL_MS = 15000;

function readPasscode(): string {
  try {
    return sessionStorage.getItem(SESSION_ADMIN_PASSCODE_KEY) || '';
  } catch {
    return '';
  }
}

export interface TelemetryState {
  report: TelemetryReport | null;
  loading: boolean;
  error: string | null;
  authError: boolean;
  source: 'api' | 'demo';
  updatedAt: Date | null;
  reload: () => void;
}

export function useTelemetry(): TelemetryState {
  const [report, setReport] = useState<TelemetryReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [authError, setAuthError] = useState(false);
  const [source, setSource] = useState<'api' | 'demo'>('api');
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);
  const [tick, setTick] = useState(0);

  const load = useCallback(async (signal: { cancelled: boolean }) => {
    const passcode = readPasscode();
    try {
      if (!passcode) throw Object.assign(new Error('auth'), { auth: true });
      const res = await fetch('/api/get_telemetry.php', { headers: { 'X-Admin-Passcode': passcode }, cache: 'no-store' });
      if (res.status === 403) throw Object.assign(new Error('auth'), { auth: true, forbidden: true });
      const data = await res.json();
      if (!data || !data.success) throw new Error((data && data.message) || 'bad response');
      if (signal.cancelled) return;
      setReport(data.ready === false ? emptyReport() : (data as TelemetryReport));
      setSource('api');
      setError(null);
      setAuthError(false);
    } catch (err: any) {
      if (signal.cancelled) return;
      if (import.meta.env.DEV && !err?.forbidden) {
        // PHP is not executed by the Vite dev server; show a realistic sample.
        setReport((prev) => (prev && prev.recent.length ? jiggle(prev) : buildDemoReport()));
        setSource('demo');
      } else if (err?.auth) {
        setAuthError(true);
      } else {
        setError('دریافت آمار بازدید از سرور ممکن نشد.');
      }
    } finally {
      if (!signal.cancelled) {
        setLoading(false);
        setUpdatedAt(new Date());
      }
    }
  }, []);

  useEffect(() => {
    const signal = { cancelled: false };
    void load(signal);
    const id = setInterval(() => {
      if (document.visibilityState === 'visible') void load(signal);
    }, POLL_MS);
    return () => {
      signal.cancelled = true;
      clearInterval(id);
    };
  }, [load, tick]);

  const reload = useCallback(() => setTick((t) => t + 1), []);
  return useMemo(
    () => ({ report, loading, error, authError, source, updatedAt, reload }),
    [report, loading, error, authError, source, updatedAt, reload]
  );
}

function emptyReport(): TelemetryReport {
  return {
    ready: true,
    onlineWindowSeconds: 70,
    live: { online: 0, sessions: [] },
    totals: { visits: 0, visitors: 0, pageViews: 0, avgDuration: 0, bounces: 0, returning: 0, todayVisits: 0, todayVisitors: 0, last7Visits: 0, last7Visitors: 0 },
    hourly: [],
    devices: [],
    os: [],
    browsers: [],
    cities: [],
    sections: [],
    referrers: [],
    recent: [],
  };
}

/* ------------------------------------------------------------------
   CSV export
   ------------------------------------------------------------------ */

const cell = (v: unknown) => `"${String(v ?? '').replace(/"/g, '""')}"`;

export function exportVisitsCsv(visits: VisitRecord[]) {
  const headers = ['شناسه بازدید', 'شناسه بازدیدکننده', 'زمان ورود', 'مدت حضور (ثانیه)', 'صفحات دیده‌شده', 'آخرین بخش', 'منبع ورود', 'آی‌پی', 'شهر', 'کشور', 'دستگاه', 'سیستم‌عامل', 'مرورگر', 'صفحه نمایش', 'شبکه'];
  const rows = visits.map((v) =>
    [
      v.sessionId,
      v.visitorId,
      new Date(Date.now() - v.ageSeconds * 1000).toLocaleString('fa-IR'),
      v.duration,
      v.pageViews,
      sectionLabel(sectionFromPath(v.currentPath), v.currentPath),
      referrerLabel(v.referrer),
      v.ip,
      v.city,
      v.country,
      DEVICE_LABEL[v.device] || v.device,
      v.os,
      v.browser,
      v.screen,
      v.network,
    ].map(cell)
  );
  const csv = '﻿' + [headers.map(cell).join(','), ...rows.map((r) => r.join(','))].join('\n');
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = `orangutan3_visits_${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

/* ------------------------------------------------------------------
   Dev-only sample
   ------------------------------------------------------------------ */

function rng(seed: number) {
  return () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
}

function buildDemoReport(): TelemetryReport {
  const r = rng(97);
  const pick = <T,>(a: T[]) => a[Math.floor(r() * a.length)];
  const cities = ['تهران', 'تهران', 'تهران', 'اصفهان', 'مشهد', 'شیراز', 'تبریز', 'کرج', 'اهواز', 'قم'];
  const devices = ['mobile', 'mobile', 'mobile', 'desktop', 'desktop', 'tablet'];
  const paths = ['/', '/', '/', '/manager-assessment', '/user-experiences', '/en', '/manager-assessment'];
  const refs = ['', '', '', 'https://www.google.com/', 'https://www.google.com/', 'https://t.me/', 'https://www.instagram.com/', 'https://www.linkedin.com/'];
  const recent: VisitRecord[] = [];
  for (let i = 0; i < 60; i++) {
    const device = pick(devices);
    const online = i < 7;
    const age = online ? Math.floor(r() * 900) + 30 : Math.floor(Math.pow(r(), 1.5) * 14 * 86400);
    const path = pick(paths);
    recent.push({
      id: 3800 - i,
      visitorId: `VID-${Math.floor(r() * 1e9).toString(36).toUpperCase()}`,
      sessionId: `SID-${Math.floor(r() * 1e9).toString(36).toUpperCase()}`,
      ageSeconds: age,
      idleSeconds: online ? Math.floor(r() * 30) : age,
      online,
      ip: `5.${Math.floor(r() * 255)}.${Math.floor(r() * 255)}.${Math.floor(r() * 255)}`,
      city: pick(cities),
      country: 'ایران',
      device,
      os: device === 'desktop' ? pick(['Windows 11', 'Windows 10', 'macOS']) : pick(['Android 14', 'iOS 17', 'Android 13']),
      browser: pick(['Chrome', 'Chrome', 'Safari', 'Edge', 'Firefox']),
      gpu: device === 'desktop' ? 'NVIDIA GeForce RTX 3060' : 'Adreno 650',
      cpu: pick([4, 8, 8, 12]),
      ram: pick([4, 8, 8, null]),
      battery: device === 'desktop' ? null : Math.floor(r() * 90) + 10,
      network: pick(['4g', '4g', 'wifi', '3g']),
      screen: device === 'desktop' ? '1920x1080' : '393x852',
      currentPath: path,
      duration: Math.floor(r() * 600) + (online ? 0 : 5),
      pageViews: Math.floor(r() * 6) + 1,
      referrer: pick(refs),
      details: null,
    });
  }
  const live = recent.filter((v) => v.online);
  const hourly = Array.from({ length: 14 * 24 }, (_, h) => {
    const hourOfDay = (new Date(Date.now() - h * 3600e3).getHours() + 24) % 24;
    const base = hourOfDay >= 9 && hourOfDay <= 23 ? 9 : 2;
    return { h, n: Math.round(base * (0.5 + r()) * (1 + (14 * 24 - h) / 600)) };
  });
  const visits = hourly.reduce((s, x) => s + x.n, 0) + 1840;
  const count = (key: keyof VisitRecord) => {
    const m = new Map<string, number>();
    recent.forEach((v) => m.set(String(v[key]), (m.get(String(v[key])) || 0) + 1));
    return Array.from(m.entries())
      .map(([name, c]) => ({ name, count: Math.round((c / recent.length) * visits) }))
      .sort((a, b) => b.count - a.count);
  };
  return {
    ready: true,
    onlineWindowSeconds: 70,
    live: {
      online: live.length,
      sessions: live.map((v) => ({
        visitorId: v.visitorId,
        sessionId: v.sessionId,
        currentPath: v.currentPath,
        device: v.device,
        os: v.os,
        browser: v.browser,
        city: v.city,
        country: v.country,
        pageViews: v.pageViews,
        onSiteSeconds: v.ageSeconds,
        idleSeconds: v.idleSeconds,
      })),
    },
    totals: {
      visits,
      visitors: Math.round(visits * 0.71),
      pageViews: Math.round(visits * 3.4),
      avgDuration: 214,
      bounces: Math.round(visits * 0.32),
      returning: Math.round(visits * 0.18),
      todayVisits: hourly.slice(0, new Date().getHours() + 1).reduce((s, x) => s + x.n, 0),
      todayVisitors: Math.round(hourly.slice(0, new Date().getHours() + 1).reduce((s, x) => s + x.n, 0) * 0.8),
      last7Visits: hourly.slice(0, 7 * 24).reduce((s, x) => s + x.n, 0),
      last7Visitors: Math.round(hourly.slice(0, 7 * 24).reduce((s, x) => s + x.n, 0) * 0.74),
    },
    hourly,
    devices: count('device'),
    os: count('os').slice(0, 6),
    browsers: count('browser').slice(0, 6),
    cities: count('city').slice(0, 8),
    sections: [
      { section: 'books', path: '/', count: 2410 },
      { section: 'quiz', path: '/manager-assessment', count: 1320 },
      { section: 'framework', path: '/', count: 860 },
      { section: 'cards', path: '/', count: 540 },
      { section: 'user-experiences', path: '/user-experiences', count: 470 },
      { section: 'case-studies', path: '/', count: 410 },
      { section: 'books', path: '/en', count: 260 },
      { section: 'author', path: '/', count: 230 },
    ],
    referrers: count('referrer'),
    recent,
  };
}

/** Small changes between polls so the demo feels live. */
function jiggle(prev: TelemetryReport): TelemetryReport {
  const delta = Math.random() < 0.5 ? -1 : 1;
  const online = Math.max(1, Math.min(prev.live.sessions.length, prev.live.online + delta));
  return {
    ...prev,
    live: {
      online,
      sessions: prev.live.sessions.slice(0, online).map((s) => ({ ...s, onSiteSeconds: s.onSiteSeconds + 15, idleSeconds: Math.floor(Math.random() * 30) })),
    },
    totals: { ...prev.totals, visits: prev.totals.visits + (Math.random() < 0.4 ? 1 : 0) },
  };
}
