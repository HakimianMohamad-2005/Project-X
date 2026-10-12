import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  Clock,
  Compass,
  Cpu,
  Eye,
  FileSpreadsheet,
  Globe2,
  Layers,
  MapPin,
  Monitor,
  MousePointerClick,
  Repeat,
  Search,
  Smartphone,
  Tablet,
  TrendingUp,
  UserRound,
  Users,
} from 'lucide-react';
import { Modal, buttonClass, inputClass } from '../ui/kit';
import { fa, faPct, relativeFa } from './assessmentData';
import { CountUp, DailyBars, Meter } from './charts';
import {
  Bucket,
  DEVICE_LABEL,
  TelemetryState,
  VisitRecord,
  dailyFromHourly,
  durationParts,
  exportVisitsCsv,
  referrerLabel,
  sectionFromPath,
  sectionLabel,
} from './telemetryData';

const EASE = [0.16, 1, 0.3, 1] as const;

const Box: React.FC<{ className?: string; children: React.ReactNode }> = ({ className = '', children }) => (
  <section className={`relative overflow-hidden rounded-[1.75rem] border border-line bg-surface p-5 sm:p-6 ${className}`}>{children}</section>
);

const Title: React.FC<{ icon: React.ComponentType<{ className?: string }>; hint?: string; children: React.ReactNode }> = ({
  icon: Icon,
  hint,
  children,
}) => (
  <div className="mb-4">
    <h2 className="flex items-center gap-2 text-sm font-black text-ink">
      <Icon className="h-4 w-4 text-copper-hi" />
      {children}
    </h2>
    {hint && <p className="mt-1 text-[11px] text-ink-3">{hint}</p>}
  </div>
);

const DeviceIcon: React.FC<{ device: string; className?: string }> = ({ device, className = 'h-4 w-4' }) => {
  const Icon = device === 'mobile' ? Smartphone : device === 'tablet' ? Tablet : Monitor;
  return <Icon className={className} />;
};

const dur = (s: number) => fa(durationParts(s));
const agoDate = (ageSeconds: number) => new Date(Date.now() - ageSeconds * 1000);

/** Live pulse: the number of people with the site open right now. */
export const LiveBeacon: React.FC<{ online: number; size?: 'md' | 'lg' }> = ({ online, size = 'md' }) => (
  <span className={`relative inline-flex shrink-0 items-center justify-center ${size === 'lg' ? 'h-28 w-28' : 'h-14 w-14'}`}>
    {[0, 1, 2].map((i) => (
      <motion.span
        key={i}
        className="absolute inset-0 rounded-full border border-emerald-400"
        initial={{ scale: 0.6, opacity: 0.7 }}
        animate={{ scale: 1.35, opacity: 0 }}
        transition={{ duration: 2.4, delay: i * 0.8, repeat: Infinity, ease: 'easeOut' }}
      />
    ))}
    <span className="absolute inset-[18%] rounded-full bg-emerald-500/15 ring-1 ring-emerald-500/40" />
    <span className={`relative font-black tabular-nums text-emerald-500 ${size === 'lg' ? 'text-4xl' : 'text-xl'}`}>
      <CountUp value={online} duration={0.8} />
    </span>
  </span>
);

const BarList: React.FC<{ rows: { label: React.ReactNode; count: number; key: string }[]; total: number; empty?: string }> = ({
  rows,
  total,
  empty = 'هنوز داده‌ای ثبت نشده است.',
}) => (
  <div className="space-y-3">
    {rows.length === 0 && <p className="text-xs text-ink-3">{empty}</p>}
    {rows.map((r, i) => {
      const pct = total ? Math.round((r.count / total) * 100) : 0;
      return (
        <div key={r.key}>
          <div className="mb-1 flex items-center justify-between gap-3 text-xs">
            <span className="min-w-0 truncate font-bold text-ink-2">{r.label}</span>
            <span className="shrink-0 font-black text-ink">
              {fa(r.count.toLocaleString('en-US'))} <span className="text-[10px] text-ink-3">({faPct(pct)})</span>
            </span>
          </div>
          <Meter value={pct} delay={0.1 + i * 0.05} className="!h-1.5" color="#D9894A" />
        </div>
      );
    })}
  </div>
);

export const TelemetryPanel: React.FC<{ data: TelemetryState }> = ({ data }) => {
  const { report, loading } = data;
  const [query, setQuery] = useState('');
  const [onlyOnline, setOnlyOnline] = useState(false);
  const [selected, setSelected] = useState<VisitRecord | null>(null);

  const daily = useMemo(() => dailyFromHourly(report?.hourly || []), [report]);

  const visits = useMemo(() => {
    const list = report?.recent || [];
    const q = query.trim().toLowerCase();
    return list.filter((v) => {
      if (onlyOnline && !v.online) return false;
      if (!q) return true;
      return [v.ip, v.city, v.country, v.os, v.browser, v.visitorId, v.sessionId, referrerLabel(v.referrer)].some((f) =>
        (f || '').toLowerCase().includes(q)
      );
    });
  }, [report, query, onlyOnline]);

  if (loading && !report) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i} className="h-36 animate-pulse rounded-[1.75rem] border border-line bg-surface" />
        ))}
      </div>
    );
  }

  if (!report) {
    return (
      <div className="rounded-3xl border border-dashed border-line-strong p-12 text-center text-sm text-ink-3">
        آمار بازدید در دسترس نیست.
      </div>
    );
  }

  const t = report.totals;
  const sectionsTotal = report.sections.reduce((s, x) => s + x.count, 0);
  const deviceTotal = report.devices.reduce((s, x) => s + x.count, 0);
  const bounceRate = t.visits ? Math.round((t.bounces / t.visits) * 100) : 0;
  const pagesPerVisit = t.visits ? (t.pageViews / t.visits).toFixed(1) : '0';

  const kpis = [
    { icon: TrendingUp, label: 'کل بازدیدها', value: t.visits, sub: `${fa(t.last7Visits.toLocaleString('en-US'))} بازدید در ۷ روز اخیر`, tone: 'text-copper-hi' },
    { icon: Users, label: 'بازدیدکنندگان یکتا', value: t.visitors, sub: `${fa(t.returning.toLocaleString('en-US'))} نفر بیش از یک بار آمده‌اند`, tone: 'text-sky-500' },
    { icon: UserRound, label: 'بازدید امروز', value: t.todayVisits, sub: `${fa(t.todayVisitors)} بازدیدکننده یکتا`, tone: 'text-emerald-500' },
    { icon: Eye, label: 'صفحات دیده‌شده', value: t.pageViews, sub: `${fa(pagesPerVisit)} بخش در هر بازدید`, tone: 'text-purple-500' },
  ];

  const bucketRows = (list: Bucket[], label?: (n: string) => React.ReactNode) =>
    list.map((b) => ({ key: b.name || '—', label: label ? label(b.name) : b.name || 'نامشخص', count: b.count }));

  const listTotal = (list: Bucket[]) => list.reduce((s, x) => s + x.count, 0);

  return (
    <div className="space-y-5">
      {/* Live */}
      <Box className="!p-0">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_90%_0%,rgba(16,185,129,0.16),transparent_55%)]" />
        <div className="relative grid gap-6 p-5 sm:p-7 lg:grid-cols-[auto_1fr]">
          <div className="flex flex-col items-center justify-center gap-3 text-center lg:w-56">
            <LiveBeacon online={report.live.online} size="lg" />
            <div>
              <div className="text-sm font-black text-ink">نفر هم‌اکنون در سایت</div>
              <p className="mt-1 text-[11px] leading-5 text-ink-3">
                افرادی که صفحه سایت جلوی چشمشان باز است
                <br />
                به‌روزرسانی خودکار هر ۱۵ ثانیه
              </p>
            </div>
          </div>

          <div className="min-w-0">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-sm font-black text-ink">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
                </span>
                چه کسانی الان آنلاین‌اند؟
              </h2>
              {data.updatedAt && <span className="text-[10px] text-ink-3">آخرین بررسی: {relativeFa(data.updatedAt)}</span>}
            </div>
            {report.live.sessions.length === 0 ? (
              <div className="flex h-40 flex-col items-center justify-center gap-2 rounded-3xl border border-dashed border-line-strong text-center">
                <Users className="h-8 w-8 text-ink-3" />
                <p className="text-xs text-ink-3">در این لحظه کسی در سایت نیست.</p>
              </div>
            ) : (
              <ul className="og-no-scrollbar max-h-64 space-y-2 overflow-y-auto pe-1">
                <AnimatePresence initial={false}>
                  {report.live.sessions.map((s) => (
                    <motion.li
                      key={s.sessionId}
                      layout
                      initial={{ opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -16 }}
                      transition={{ duration: 0.35, ease: EASE }}
                      className="flex items-center gap-3 rounded-2xl border border-line bg-surface-2/50 px-3 py-2.5"
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
                        <DeviceIcon device={s.device} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-xs font-black text-ink">
                          در حال دیدن: {sectionLabel(sectionFromPath(s.currentPath), s.currentPath)}
                        </div>
                        <div className="mt-0.5 truncate text-[11px] text-ink-3">
                          {[s.city, DEVICE_LABEL[s.device] || s.device, s.browser].filter(Boolean).join(' · ')}
                        </div>
                      </div>
                      <div className="shrink-0 text-end">
                        <div className="text-[11px] font-black text-ink-2">{dur(s.onSiteSeconds)}</div>
                        <div className="text-[10px] text-ink-3">{fa(s.pageViews)} بخش</div>
                      </div>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
            )}
          </div>
        </div>
      </Box>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {kpis.map((k, i) => (
          <motion.div
            key={k.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * i, duration: 0.5, ease: EASE }}
            className="rounded-[1.5rem] border border-line bg-surface p-4 sm:p-5"
          >
            <k.icon className={`h-5 w-5 ${k.tone}`} />
            <div className="mt-3 text-2xl font-black text-ink sm:text-3xl">
              <CountUp value={k.value} />
            </div>
            <div className="mt-1 text-xs font-bold text-ink-2">{k.label}</div>
            <div className="mt-0.5 text-[10px] leading-4 text-ink-3">{k.sub}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-5">
        <Box className="lg:col-span-3">
          <Title icon={TrendingUp} hint="تعداد بازدید در هر روز، ۱۴ روز اخیر">
            روند بازدید
          </Title>
          <DailyBars data={daily} />
        </Box>
        <Box className="lg:col-span-2">
          <Title icon={Clock}>کیفیت بازدیدها</Title>
          <div className="space-y-3">
            {[
              { icon: Clock, label: 'میانگین مدت حضور', value: dur(t.avgDuration) },
              { icon: Layers, label: 'میانگین بخش‌های دیده‌شده', value: `${fa(pagesPerVisit)} بخش` },
              { icon: MousePointerClick, label: 'خروج سریع (کمتر از ۱۰ ثانیه)', value: faPct(bounceRate) },
              { icon: Repeat, label: 'بازدیدکنندگان وفادار', value: `${fa(t.returning.toLocaleString('en-US'))} نفر` },
            ].map((q) => (
              <div key={q.label} className="flex items-center gap-3 rounded-2xl border border-line bg-surface-2/40 p-3">
                <q.icon className="h-4 w-4 shrink-0 text-copper-hi" />
                <span className="flex-1 text-xs font-bold text-ink-2">{q.label}</span>
                <span className="text-sm font-black text-ink">{q.value}</span>
              </div>
            ))}
          </div>
        </Box>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        <Box>
          <Title icon={Layers} hint="۳۰ روز اخیر">
            پربازدیدترین بخش‌ها
          </Title>
          <BarList
            total={sectionsTotal}
            rows={report.sections.slice(0, 8).map((s) => ({ key: `${s.section}${s.path}`, label: sectionLabel(s.section, s.path), count: s.count }))}
          />
        </Box>
        <Box>
          <Title icon={Compass}>از کجا آمده‌اند؟</Title>
          <BarList total={listTotal(report.referrers)} rows={bucketRows(mergeReferrers(report.referrers), (n) => n)} />
        </Box>
        <Box>
          <Title icon={MapPin}>شهرها</Title>
          <BarList total={listTotal(report.cities)} rows={bucketRows(report.cities, (n) => n || 'نامشخص')} />
        </Box>
        <Box>
          <Title icon={Monitor}>دستگاه‌ها</Title>
          <BarList
            total={deviceTotal}
            rows={bucketRows(report.devices, (n) => (
              <span className="inline-flex items-center gap-1.5">
                <DeviceIcon device={n} className="h-3.5 w-3.5" /> {DEVICE_LABEL[n] || n || 'نامشخص'}
              </span>
            ))}
          />
        </Box>
        <Box>
          <Title icon={Cpu}>سیستم‌عامل‌ها</Title>
          <BarList total={listTotal(report.os)} rows={bucketRows(report.os)} />
        </Box>
        <Box>
          <Title icon={Globe2}>مرورگرها</Title>
          <BarList total={listTotal(report.browsers)} rows={bucketRows(report.browsers)} />
        </Box>
      </div>

      {/* Visit log */}
      <Box className="!p-0">
        <div className="flex flex-col gap-3 border-b border-line p-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-sm font-black text-ink">آخرین بازدیدها</h2>
            <p className="mt-1 text-[11px] text-ink-3">{fa(report.recent.length)} بازدید آخر؛ روی هر ردیف بزنید تا جزئیات باز شود.</p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <button
              onClick={() => setOnlyOnline((v) => !v)}
              className={`inline-flex h-10 items-center justify-center gap-2 rounded-xl border px-3 text-xs font-bold transition-colors ${
                onlyOnline ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-line-strong text-ink-2 hover:border-emerald-500/50'
              }`}
            >
              <span className={`h-2 w-2 rounded-full ${onlyOnline ? 'bg-white' : 'bg-emerald-500'}`} /> فقط آنلاین‌ها
            </button>
            <div className="relative sm:w-64">
              <Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-3" />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="IP، شهر، مرورگر، منبع..." className={`${inputClass} h-10 ps-9`} />
            </div>
            <button onClick={() => exportVisitsCsv(visits)} disabled={!visits.length} className={buttonClass('secondary', 'sm', 'h-10')}>
              <FileSpreadsheet className="h-4 w-4 text-emerald-500" /> خروجی اکسل
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-surface-2/60 text-[11px] font-bold text-ink-3">
              <tr>
                {['زمان ورود', 'مکان', 'دستگاه', 'منبع ورود', 'آخرین بخش', 'مدت / بخش‌ها'].map((h) => (
                  <th key={h} className="whitespace-nowrap px-4 py-3 text-start">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {visits.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-ink-3">
                    موردی یافت نشد.
                  </td>
                </tr>
              ) : (
                visits.map((v) => (
                  <tr key={v.id} onClick={() => setSelected(v)} className="cursor-pointer text-ink-2 transition-colors hover:bg-copper/5">
                    <td className="whitespace-nowrap px-4 py-3">
                      <div className="flex items-center gap-2 font-bold text-ink">
                        {v.online && <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" title="آنلاین" />}
                        {relativeFa(agoDate(v.ageSeconds))}
                      </div>
                      <div className="mt-0.5 text-[10px] text-ink-3">
                        {agoDate(v.ageSeconds).toLocaleString('fa-IR', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <div className="font-bold text-ink">{[v.city, v.country].filter(Boolean).join('، ') || 'نامشخص'}</div>
                      <div className="font-mono text-[10px] text-ink-3" dir="ltr">
                        {v.ip || '—'}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <div className="flex items-center gap-1.5 font-bold text-ink">
                        <DeviceIcon device={v.device} className="h-3.5 w-3.5 text-copper-hi" /> {v.os || '—'}
                      </div>
                      <div className="text-[10px] text-ink-3">{v.browser}</div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">{referrerLabel(v.referrer)}</td>
                    <td className="max-w-[180px] truncate px-4 py-3">{sectionLabel(sectionFromPath(v.currentPath), v.currentPath)}</td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <div className="font-bold text-ink">{dur(v.duration)}</div>
                      <div className="text-[10px] text-ink-3">{fa(v.pageViews)} بخش</div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Box>

      <Modal open={!!selected} onClose={() => setSelected(null)} size="xl">
        {selected && <VisitDetail v={selected} />}
      </Modal>
    </div>
  );
};

/** Group raw referrers by readable source (all Google URLs → "گوگل"). */
function mergeReferrers(list: Bucket[]): Bucket[] {
  const m = new Map<string, number>();
  list.forEach((r) => {
    const k = referrerLabel(r.name);
    m.set(k, (m.get(k) || 0) + r.count);
  });
  return Array.from(m.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 7);
}

const VisitDetail: React.FC<{ v: VisitRecord }> = ({ v }) => {
  const d = v.details || {};
  const trail: { path: string; title?: string }[] = Array.isArray(d.navigationTrail) ? d.navigationTrail : [];
  const rows: [string, string][] = [
    ['زمان ورود', agoDate(v.ageSeconds).toLocaleString('fa-IR')],
    ['مدت حضور', dur(v.duration)],
    ['بخش‌های دیده‌شده', fa(v.pageViews)],
    ['منبع ورود', v.referrer ? `${referrerLabel(v.referrer)}` : 'ورود مستقیم'],
    ['آی‌پی', v.ip || 'نامشخص'],
    ['مکان', [v.city, v.country].filter(Boolean).join('، ') || 'نامشخص'],
    ['دستگاه', `${DEVICE_LABEL[v.device] || v.device} · ${v.os}`],
    ['مرورگر', v.browser || 'نامشخص'],
    ['صفحه نمایش', v.screen || 'نامشخص'],
    ['شبکه', v.network || 'نامشخص'],
    ['پردازنده / حافظه', `${fa(v.cpu || 0)} هسته${v.ram ? ` · ${fa(v.ram)} گیگابایت` : ''}`],
    ['کارت گرافیک', v.gpu || 'نامشخص'],
  ];
  return (
    <div dir="rtl" className="space-y-6 p-6 sm:p-8">
      <div className="flex items-center gap-4 pe-12">
        <span className={`flex h-12 w-12 items-center justify-center rounded-2xl ${v.online ? 'bg-emerald-500/12 text-emerald-500' : 'bg-copper/12 text-copper-hi'}`}>
          <DeviceIcon device={v.device} className="h-6 w-6" />
        </span>
        <div>
          <h3 className="flex items-center gap-2 text-lg font-black text-ink">
            جزئیات بازدید
            {v.online && (
              <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-black text-emerald-500">آنلاین</span>
            )}
          </h3>
          <div className="mt-0.5 font-mono text-[11px] text-ink-3" dir="ltr">
            {v.visitorId} · {v.sessionId}
          </div>
        </div>
      </div>
      <div className="grid gap-2.5 sm:grid-cols-2">
        {rows.map(([k, val]) => (
          <div key={k} className="rounded-2xl border border-line bg-surface-2/50 p-3">
            <div className="text-[11px] font-bold text-ink-3">{k}</div>
            <div className="mt-0.5 break-words text-xs font-bold text-ink">{val}</div>
          </div>
        ))}
      </div>
      {v.referrer && (
        <div className="rounded-2xl border border-line bg-surface-2/50 p-3">
          <div className="text-[11px] font-bold text-ink-3">آدرس کامل منبع</div>
          <div className="mt-0.5 break-all font-mono text-[11px] text-ink-2" dir="ltr">
            {v.referrer}
          </div>
        </div>
      )}
      {trail.length > 0 && (
        <div>
          <h4 className="mb-2 text-xs font-black text-copper-hi">نقطه ورود به سایت</h4>
          <div className="text-xs text-ink-2">{sectionLabel(trail[0].title || sectionFromPath(trail[0].path), trail[0].path)}</div>
        </div>
      )}
      {d.client?.userAgentRaw && (
        <div>
          <div className="mb-1.5 text-[11px] font-bold text-ink-3">User-Agent</div>
          <div className="select-all break-all rounded-2xl bg-surface-2 p-3 font-mono text-[11px] text-ink-2" dir="ltr">
            {d.client.userAgentRaw}
          </div>
        </div>
      )}
    </div>
  );
};
