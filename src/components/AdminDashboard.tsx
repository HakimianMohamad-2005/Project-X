/**
 * Confidential admin command centre ("اتاق فرمان +۳").
 * - Passcode gate with the 97 / 3 genome emblem
 * - Overview: audience pulse, tier spectrum, dimension heatmap, trends
 * - Advanced assessment dossiers: full profile, scores and every answer (from MySQL)
 * - Visitor telemetry (local registry)
 */

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'motion/react';
import {
  ArrowRight,
  ClipboardList,
  Database,
  Eye,
  EyeOff,
  FlaskConical,
  LayoutDashboard,
  Lock,
  LogOut,
  Radar,
  RefreshCw,
  ShieldAlert,
  Unlock,
} from 'lucide-react';
import { useVisitor } from '../context/VisitorContext';
import { FilterTabs, buttonClass } from './ui/kit';
import { Assessment, fa, useAssessments } from './admin/assessmentData';
import { OverviewPanel } from './admin/OverviewPanel';
import { AssessmentsPanel } from './admin/AssessmentsPanel';
import { AssessmentDossier } from './admin/AssessmentDossier';
import { TelemetryPanel } from './admin/TelemetryPanel';
import { useTelemetry } from './admin/telemetryData';

interface AdminDashboardProps {
  onBackToSite: () => void;
  theme?: 'dark' | 'light';
}

type AdminTab = 'overview' | 'assessments' | 'telemetry';
const TAB_KEY = 'og3-admin-tab';
const EASE = [0.16, 1, 0.3, 1] as const;

/* ------------------------------------------------------------------
   The genome emblem: 100 dots, 97 dim + 3 copper. `lit` lights extra dots.
   ------------------------------------------------------------------ */

const GenomeEmblem: React.FC<{ lit?: number; error?: boolean; unlocked?: boolean; size?: number }> = ({
  lit = 0,
  error = false,
  unlocked = false,
  size = 200,
}) => {
  const dots = Array.from({ length: 100 }, (_, i) => {
    const a = (i / 100) * Math.PI * 2 - Math.PI / 2;
    const isPlus = i >= 97;
    const on = unlocked || isPlus || i < lit;
    return { x: Math.cos(a) * 92, y: Math.sin(a) * 92, isPlus, on, i };
  });
  const Icon = unlocked ? Unlock : Lock;
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg viewBox="-110 -110 220 220" className="h-full w-full">
        <defs>
          <radialGradient id="og-gate-core">
            <stop offset="0%" stopColor={error ? '#E05A47' : '#D9894A'} stopOpacity="0.35" />
            <stop offset="100%" stopColor={error ? '#E05A47' : '#B87333'} stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle r="70" fill="url(#og-gate-core)" />
        <g className="og-spin-slow" style={{ transformOrigin: 'center', transformBox: 'fill-box' }}>
          {dots.map((d) => (
            <circle
              key={d.i}
              cx={d.x}
              cy={d.y}
              r={d.isPlus ? 3.6 : 2.1}
              fill={error ? '#E05A47' : d.on ? (d.isPlus ? '#F2B27A' : '#B87333') : 'var(--og-ink-3)'}
              opacity={d.on ? 1 : 0.28}
              style={{
                transition: 'fill .35s, opacity .35s',
                filter: d.isPlus && !error ? 'drop-shadow(0 0 4px #E8A672)' : undefined,
              }}
            />
          ))}
        </g>
        <g className="og-spin-slower-reverse" style={{ transformOrigin: 'center', transformBox: 'fill-box' }}>
          <circle r="76" fill="none" stroke="var(--og-line-strong)" strokeDasharray="2 7" />
        </g>
        <circle r="58" fill="var(--og-surface-2)" stroke={error ? '#E05A47' : 'rgba(184,115,51,0.45)'} strokeWidth="1.5" />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center">
        <motion.span
          key={unlocked ? 'u' : 'l'}
          initial={{ scale: 0.6, opacity: 0, rotate: unlocked ? -20 : 0 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 14 }}
          className={error ? 'text-red-500' : 'text-copper-hi'}
        >
          <Icon className="h-11 w-11" strokeWidth={1.75} />
        </motion.span>
      </span>
    </div>
  );
};

/* ------------------------------------------------------------------
   Passcode gate
   ------------------------------------------------------------------ */

const AdminGate: React.FC<{ onSubmit: (code: string) => boolean; onBack: () => void }> = ({ onSubmit, onBack }) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState(false);
  const [show, setShow] = useState(false);
  const [caps, setCaps] = useState(false);
  const [shake, setShake] = useState(0);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;
    if (!onSubmit(code)) {
      setError(true);
      setShake((s) => s + 1);
      setCode('');
    }
  };

  return (
    <div dir="rtl" className="relative flex min-h-[78vh] items-center justify-center px-2 py-10">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/2 h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(184,115,51,0.18),transparent_65%)]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: EASE }}
        className="relative w-full max-w-md overflow-hidden rounded-[2.25rem] border border-line bg-surface/90 p-8 text-center og-shadow backdrop-blur-xl sm:p-10"
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-copper/70 to-transparent" />
        <motion.div
          key={shake}
          animate={shake ? { x: [0, -14, 12, -9, 6, -3, 0] } : undefined}
          transition={{ duration: 0.5 }}
          className="mx-auto mb-6 flex justify-center"
        >
          <GenomeEmblem lit={Math.min(97, code.length * 12)} error={error} size={190} />
        </motion.div>

        <div className="mb-1 text-[11px] font-black tracking-[0.25em] text-copper-hi">ORANGUTAN +3 · COMMAND</div>
        <h1 className="text-2xl font-black text-ink">اتاق فرمان +۳</h1>
        <p className="mx-auto mt-2 max-w-xs text-sm leading-7 text-ink-3">
          ۹۷٪ این سایت برای همه باز است. این ۳٪ فقط برای مدیر.
        </p>

        <form onSubmit={submit} className="mt-7 space-y-3 text-start">
          <label className="block">
            <span className="mb-1.5 block text-xs font-bold text-ink-2">کد عبور محرمانه</span>
            <span className="relative block">
              <input
                type={show ? 'text' : 'password'}
                value={code}
                onChange={(e) => {
                  setCode(e.target.value);
                  setError(false);
                }}
                onKeyUp={(e) => setCaps(e.getModifierState?.('CapsLock') ?? false)}
                placeholder="••••••••"
                autoFocus
                autoComplete="current-password"
                dir="ltr"
                className={`h-14 w-full rounded-2xl border bg-field px-12 text-center font-mono text-lg tracking-[0.35em] text-ink outline-none transition-all placeholder:text-ink-3 focus:ring-4 ${
                  error ? 'border-red-500 focus:ring-red-500/15' : 'border-line-strong focus:border-copper focus:ring-copper/15'
                }`}
              />
              <button
                type="button"
                onClick={() => setShow((s) => !s)}
                aria-label={show ? 'پنهان کردن کد' : 'نمایش کد'}
                className="absolute end-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-ink-3 hover:text-ink"
              >
                {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </span>
          </label>

          <AnimatePresence>
            {(error || caps) && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className={`flex items-center justify-center gap-1.5 text-xs font-bold ${error ? 'text-red-500' : 'text-amber-500'}`}
              >
                <ShieldAlert className="h-3.5 w-3.5" />
                {error ? 'کد عبور درست نیست. دوباره تلاش کنید.' : 'کلید Caps Lock روشن است.'}
              </motion.p>
            )}
          </AnimatePresence>

          <button type="submit" disabled={!code.trim()} className={buttonClass('primary', 'lg', 'w-full')}>
            <Unlock className="h-5 w-5" /> ورود به اتاق فرمان
          </button>
        </form>

        <button onClick={onBack} className="mt-6 inline-flex items-center gap-1.5 text-xs font-bold text-ink-3 hover:text-copper-hi">
          <ArrowRight className="h-3.5 w-3.5" /> بازگشت به سایت
        </button>
      </motion.div>
    </div>
  );
};

/** Full-screen flourish played right after a successful login. */
const UnlockOverlay: React.FC = () => (
  <motion.div
    className="fixed inset-0 z-[90] flex flex-col items-center justify-center bg-canvas"
    initial={{ opacity: 1 }}
    exit={{ opacity: 0, transition: { duration: 0.7, ease: EASE } }}
    dir="rtl"
  >
    <motion.div
      initial={{ scale: 0.85 }}
      animate={{ scale: [0.85, 1, 1.08] }}
      transition={{ duration: 1.4, ease: EASE, times: [0, 0.4, 1] }}
    >
      <GenomeEmblem unlocked size={220} />
    </motion.div>
    <motion.div
      className="absolute h-[220px] w-[220px] rounded-full border-2 border-copper"
      initial={{ scale: 1, opacity: 0.8 }}
      animate={{ scale: 6, opacity: 0 }}
      transition={{ delay: 0.5, duration: 1.2, ease: 'easeOut' }}
    />
    <motion.p
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35, duration: 0.5 }}
      className="mt-6 text-lg font-black text-ink"
    >
      دسترسی تأیید شد
    </motion.p>
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.55 }}
      className="mt-1 text-sm text-ink-3"
    >
      به اتاق فرمان +۳ خوش آمدید
    </motion.p>
  </motion.div>
);

/* ------------------------------------------------------------------
   Header pieces
   ------------------------------------------------------------------ */

function greeting(h: number) {
  if (h < 5) return 'شب بخیر';
  if (h < 12) return 'صبح بخیر';
  if (h < 17) return 'روز بخیر';
  if (h < 20) return 'عصر بخیر';
  return 'شب بخیر';
}

function useNow(intervalMs = 30000) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return now;
}

/* ------------------------------------------------------------------
   Dashboard shell
   ------------------------------------------------------------------ */

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBackToSite }) => {
  const { isAdminAuthenticated, loginAdmin, logoutAdmin } = useVisitor();
  const [unlocking, setUnlocking] = useState(false);

  useEffect(() => {
    if (!unlocking) return;
    const id = setTimeout(() => setUnlocking(false), 1700);
    return () => clearTimeout(id);
  }, [unlocking]);

  const handleLogin = (code: string) => {
    const ok = loginAdmin(code);
    if (ok) setUnlocking(true);
    return ok;
  };

  if (!isAdminAuthenticated) {
    return <AdminGate onSubmit={handleLogin} onBack={onBackToSite} />;
  }

  return (
    <>
      {/* Portalled: the page transition wrapper is transformed, which would trap a fixed overlay. */}
      {createPortal(<AnimatePresence>{unlocking && <UnlockOverlay />}</AnimatePresence>, document.body)}
      <CommandCenter
        onBackToSite={onBackToSite}
        onLogout={() => {
          logoutAdmin();
          onBackToSite();
        }}
        onRelogin={logoutAdmin}
      />
    </>
  );
};

const CommandCenter: React.FC<{
  onBackToSite: () => void;
  onLogout: () => void;
  onRelogin: () => void;
}> = ({ onBackToSite, onLogout, onRelogin }) => {
  const data = useAssessments();
  const telemetry = useTelemetry();
  const isDemo = data.source === 'demo' || telemetry.source === 'demo';
  const authError = data.authError || telemetry.authError;
  const errorText = data.error || telemetry.error;
  const now = useNow();
  const [selected, setSelected] = useState<Assessment | null>(null);
  const [tab, setTab] = useState<AdminTab>(() => {
    try {
      const saved = sessionStorage.getItem(TAB_KEY) as AdminTab | null;
      if (saved === 'overview' || saved === 'assessments' || saved === 'telemetry') return saved;
    } catch {}
    return 'overview';
  });

  useEffect(() => {
    try {
      sessionStorage.setItem(TAB_KEY, tab);
    } catch {}
  }, [tab]);

  const refresh = () => {
    data.reload();
    telemetry.reload();
  };

  // Assembled from parts: some engines order the weekday last ("۱۴۰۵ مهر ۲۰, دوشنبه").
  const parts = new Intl.DateTimeFormat('fa-IR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).formatToParts(now);
  const part = (type: Intl.DateTimeFormatPartTypes) => parts.find((p) => p.type === type)?.value || '';
  const dateText = `${part('weekday')}، ${part('day')} ${part('month')} ${part('year')}`;
  const timeText = new Intl.DateTimeFormat('fa-IR', { hour: '2-digit', minute: '2-digit' }).format(now);

  return (
    <div dir="rtl" className="space-y-5 pb-16">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE }}
        className="relative overflow-hidden rounded-[2rem] border border-line bg-surface p-5 sm:p-7"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_100%_0%,rgba(217,137,74,0.20),transparent_50%)]" />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage: 'radial-gradient(var(--og-line-strong) 1px, transparent 1px)',
            backgroundSize: '18px 18px',
            maskImage: 'linear-gradient(to left, black, transparent 70%)',
            WebkitMaskImage: 'linear-gradient(to left, black, transparent 70%)',
          }}
        />
        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <div className="hidden shrink-0 sm:block">
              <GenomeEmblem unlocked size={76} />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl font-black text-ink sm:text-2xl">اتاق فرمان +۳</h1>
                <span className="rounded-full border border-red-500/30 bg-red-500/10 px-2 py-0.5 text-[10px] font-black text-red-500">
                  محرمانه
                </span>
              </div>
              <p className="mt-1 text-sm text-ink-2">
                {greeting(now.getHours())}، مدیر عزیز. <span className="text-ink-3">این‌جا همان ۳٪ پشت صحنه است.</span>
              </p>
              <p className="mt-1 text-[11px] text-ink-3">
                {dateText} · ساعت {timeText}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex h-9 items-center gap-1.5 rounded-xl border px-3 text-[11px] font-black ${
                isDemo
                  ? 'border-sky-500/30 bg-sky-500/10 text-sky-500'
                  : errorText || authError
                    ? 'border-red-500/30 bg-red-500/10 text-red-500'
                    : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-500'
              }`}
            >
              {isDemo ? <FlaskConical className="h-3.5 w-3.5" /> : <Database className="h-3.5 w-3.5" />}
              {isDemo ? 'داده نمایشی' : errorText || authError ? 'قطع ارتباط' : 'متصل به دیتابیس'}
            </span>
            <button onClick={refresh} className={buttonClass('secondary', 'sm')} title="به‌روزرسانی داده‌ها">
              <RefreshCw className={`h-4 w-4 text-copper-hi ${data.loading || telemetry.loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">به‌روزرسانی</span>
            </button>
            <button onClick={onBackToSite} className={buttonClass('ghost', 'sm')}>
              <ArrowRight className="h-4 w-4" />
              <span className="hidden sm:inline">سایت</span>
            </button>
            <button
              onClick={onLogout}
              className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-red-500/30 bg-red-500/10 px-3 text-xs font-bold text-red-500 transition-colors hover:bg-red-500/20"
            >
              <LogOut className="h-4 w-4" /> خروج
            </button>
          </div>
        </div>
      </motion.header>

      {/* Notices */}
      {isDemo && (
        <div className="flex items-start gap-2 rounded-2xl border border-sky-500/25 bg-sky-500/5 px-4 py-3 text-xs leading-6 text-ink-2">
          <FlaskConical className="mt-0.5 h-4 w-4 shrink-0 text-sky-500" />
          <p className="min-w-0">
            در محیط توسعه، فایل‌های PHP اجرا نمی‌شوند؛ برای پیش‌نمایش، داده‌های نمونه نمایش داده شده است. روی سرور اصلی، نتایج واقعی
            آزمون‌ها و آمار واقعی بازدیدکنندگان از دیتابیس این‌جا نمایش داده می‌شود.
          </p>
        </div>
      )}
      {authError && (
        <div className="flex flex-col gap-3 rounded-2xl border border-red-500/30 bg-red-500/5 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-start gap-2 text-xs leading-6 text-ink-2">
            <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
            سرور کد عبور این نشست را نپذیرفت. برای مشاهده نتایج آزمون‌ها یک بار دیگر وارد شوید.
          </p>
          <button onClick={onRelogin} className={buttonClass('primary', 'sm', 'shrink-0')}>
            ورود دوباره
          </button>
        </div>
      )}
      {errorText && (
        <div className="flex flex-col gap-3 rounded-2xl border border-red-500/30 bg-red-500/5 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-start gap-2 text-xs leading-6 text-ink-2">
            <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
            {errorText}
          </p>
          <button onClick={refresh} className={buttonClass('secondary', 'sm', 'shrink-0')}>
            تلاش دوباره
          </button>
        </div>
      )}

      <FilterTabs<AdminTab>
        value={tab}
        onChange={setTab}
        options={[
          { value: 'overview', label: 'نمای کلی', icon: LayoutDashboard },
          { value: 'assessments', label: 'نتایج آزمون‌ها', icon: ClipboardList, count: fa(data.items.length) },
          { value: 'telemetry', label: 'آمار بازدید', icon: Radar, count: telemetry.report ? `${fa(telemetry.report.live.online)} آنلاین` : undefined },
        ]}
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.35, ease: EASE }}
        >
          {tab === 'overview' && (
            <OverviewPanel
              items={data.items}
              loading={data.loading}
              liveOnline={telemetry.report?.live.online ?? 0}
              totalVisitors={telemetry.report?.totals.visits ?? 0}
              todayVisits={telemetry.report?.totals.todayVisits ?? 0}
              onSeeVisitors={() => setTab('telemetry')}
              onOpen={setSelected}
              onSeeAll={() => setTab('assessments')}
            />
          )}
          {tab === 'assessments' && <AssessmentsPanel items={data.items} loading={data.loading} onOpen={setSelected} />}
          {tab === 'telemetry' && <TelemetryPanel data={telemetry} />}
        </motion.div>
      </AnimatePresence>

      <AssessmentDossier assessment={selected} onClose={() => setSelected(null)} />
    </div>
  );
};
