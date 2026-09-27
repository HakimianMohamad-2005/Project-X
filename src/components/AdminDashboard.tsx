/**
 * Confidential Admin Telemetry Dashboard Component
 * Protected by Passcode Gate.
 * Features:
 * - Passcode Gate (sessionStorage token, no hints)
 * - Live Active Online Visitors [CONFIDENTIAL]
 * - Total Visitors Baseline & Increment
 * - Device, OS, Browser & Popular Pages Breakdown
 * - Searchable Visitor Telemetry Registry Table
 * - Detailed Visitor Identity Modal (Trail, Hardware, Raw UA with Copy)
 * - JSON and UTF-8 BOM CSV Exports
 */

import React, { useState, useMemo } from 'react';
import {
  ShieldAlert,
  Lock,
  Unlock,
  Users,
  Radio,
  Monitor,
  Smartphone,
  Tablet,
  Cpu,
  HardDrive,
  Battery,
  BatteryCharging,
  Wifi,
  Search,
  Download,
  FileSpreadsheet,
  FileCode,
  ArrowLeft,
  X,
  Copy,
  Check,
  Clock,
  MapPin,
  Compass,
  RefreshCw,
} from 'lucide-react';
import { useVisitor } from '../context/VisitorContext';
import { VisitorTelemetry } from '../types/telemetry';
import { toPersianDigits } from '../utils/persian';

interface AdminDashboardProps {
  onBackToSite: () => void;
  theme?: 'dark' | 'light';
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBackToSite, theme = 'light' }) => {
  const {
    totalVisitors,
    liveOnlineVisitors,
    summary,
    isAdminAuthenticated,
    loginAdmin,
    logoutAdmin,
    refreshTelemetry,
    exportJson,
    exportCsv,
  } = useVisitor();

  // Passcode gate state
  const [passcode, setPasscode] = useState('');
  const [loginError, setLoginError] = useState(false);

  // Table Search and Selection
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVisitor, setSelectedVisitor] = useState<VisitorTelemetry | null>(null);
  const [copiedUa, setCopiedUa] = useState(false);

  const isLight = theme === 'light';

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = loginAdmin(passcode);
    if (!success) {
      setLoginError(true);
      setPasscode('');
    } else {
      setLoginError(false);
    }
  };

  const handleCopyUa = (ua: string) => {
    navigator.clipboard.writeText(ua);
    setCopiedUa(true);
    setTimeout(() => setCopiedUa(false), 2000);
  };

  // Filtered Visitors
  const filteredVisitors = useMemo(() => {
    if (!searchQuery.trim()) return summary.recentVisitors;
    const q = searchQuery.toLowerCase().trim();
    return summary.recentVisitors.filter((v) => {
      const ip = v.geo?.ip?.toLowerCase() || '';
      const city = v.geo?.city?.toLowerCase() || '';
      const os = v.client?.os?.toLowerCase() || '';
      const browser = v.client?.browser?.toLowerCase() || '';
      const gpu = v.hardware?.gpu?.renderer?.toLowerCase() || '';
      const vid = v.visitorId?.toLowerCase() || '';
      return (
        ip.includes(q) ||
        city.includes(q) ||
        os.includes(q) ||
        browser.includes(q) ||
        gpu.includes(q) ||
        vid.includes(q)
      );
    });
  }, [summary.recentVisitors, searchQuery]);

  // LAYER A: Passcode Gate
  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className={`w-full max-w-md p-8 rounded-3xl border shadow-2xl space-y-6 transition-all ${
          isLight ? 'bg-white border-stone-200 text-stone-900' : 'bg-[#181A1B] border-stone-800 text-[#FAF7F2]'
        }`}>
          <div className="text-center space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-[#B87333] flex items-center justify-center mx-auto shadow-inner">
              <Lock className="w-8 h-8" />
            </div>
            <h1 className="text-xl font-black tracking-tight">
              درگاه امنیتی تله‌متری و مانیتورینگ
            </h1>
            <p className="text-xs text-stone-500">
              دسترسی به این بخش صرفاً برای مدیران مجاز سایت امکان‌پذیر است.
            </p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold mb-2">
                کد عبور محرمانه (Passcode)
              </label>
              <input
                type="password"
                value={passcode}
                onChange={(e) => {
                  setPasscode(e.target.value);
                  setLoginError(false);
                }}
                placeholder="••••••••"
                autoFocus
                className={`w-full px-4 py-3 rounded-xl text-center text-lg font-mono tracking-widest border transition-all outline-none ${
                  loginError
                    ? 'border-red-500 bg-red-500/10 text-red-500'
                    : isLight
                      ? 'border-stone-300 bg-stone-50 focus:border-[#B87333] focus:bg-white'
                      : 'border-stone-700 bg-stone-900 focus:border-[#B87333] focus:bg-stone-800'
                }`}
              />
              {loginError && (
                <p className="text-xs text-red-500 font-bold mt-2 text-center flex items-center justify-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>کد عبور نامعتبر است. دسترسی مجاز نیست.</span>
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#B87333] to-[#8B4513] text-white font-bold text-sm shadow-lg shadow-[#B87333]/20 hover:opacity-95 transition-opacity"
            >
              احراز هویت و ورود به اتاق فرمان
            </button>
          </form>

          <div className="pt-4 border-t border-stone-500/20 text-center">
            <button
              onClick={onBackToSite}
              className="text-xs text-stone-500 hover:text-[#B87333] transition-colors inline-flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>بازگشت به صفحات عمومی سایت</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // LAYER B: Confidential Command Center & Telemetry Monitoring
  return (
    <div className="space-y-8 pb-16">

      {/* Top Bar Navigation */}
      <div className={`p-4 rounded-3xl border flex flex-col md:flex-row items-center justify-between gap-4 ${
        isLight ? 'bg-white border-stone-300 text-stone-900 shadow-sm' : 'bg-[#181A1B] border-stone-800 text-[#FAF7F2]'
      }`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 flex items-center justify-center shrink-0">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-base sm:text-lg">اتاق فرمان و تله‌متری مراجعین</h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-red-500/10 text-red-500 border border-red-500/30">
                محرمانه - فقط مدیر
              </span>
            </div>
            <p className="text-xs text-stone-500">
              رصد زنده نشست‌ها، مشخصات سخت‌افزاری، شبکه و رفتار مراجعین وب‌سایت
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap justify-end">
          <button
            onClick={refreshTelemetry}
            className={`p-2 rounded-xl border text-xs font-bold flex items-center gap-1 transition-all ${
              isLight ? 'bg-stone-100 hover:bg-stone-200 border-stone-300' : 'bg-stone-800 hover:bg-stone-700 border-stone-700'
            }`}
            title="بروزرسانی داده‌ها"
          >
            <RefreshCw className="w-4 h-4 text-[#B87333]" />
            <span className="hidden sm:inline">بروزرسانی</span>
          </button>

          <button
            onClick={exportJson}
            className={`px-3 py-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all ${
              isLight ? 'bg-stone-100 hover:bg-stone-200 border-stone-300' : 'bg-stone-800 hover:bg-stone-700 border-stone-700'
            }`}
          >
            <FileCode className="w-4 h-4 text-sky-500" />
            <span>خروجی JSON</span>
          </button>

          <button
            onClick={exportCsv}
            className={`px-3 py-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all ${
              isLight ? 'bg-emerald-50 hover:bg-emerald-100 border-emerald-300 text-emerald-900' : 'bg-emerald-950/40 hover:bg-emerald-900/60 border-emerald-800 text-emerald-300'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
            <span>خروجی اکسل (CSV)</span>
          </button>

          <button
            onClick={logoutAdmin}
            className="px-3 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/30 text-xs font-bold flex items-center gap-1 transition-all"
          >
            <Unlock className="w-4 h-4" />
            <span>خروج</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        {/* Live Active Online Visitors (STRICTLY CONFIDENTIAL) */}
        <div className={`p-5 rounded-3xl border shadow-sm relative overflow-hidden ${
          isLight ? 'bg-gradient-to-br from-white to-emerald-50/50 border-emerald-200' : 'bg-[#181A1B] border-emerald-900/40'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-stone-500 flex items-center gap-1.5">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
              مراجعین آنلاین در لحظه
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 font-bold border border-emerald-500/30">
              Live
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black font-mono text-emerald-600">
              {toPersianDigits(liveOnlineVisitors)}
            </span>
            <span className="text-xs text-stone-500 font-semibold">کاربر همزمان در سایت</span>
          </div>
          <p className="text-[11px] text-stone-400 mt-2">
            محرمانه • همگام با BroadcastChannel تب‌های مرورگر
          </p>
        </div>

        {/* Total Registered Visitors */}
        <div className={`p-5 rounded-3xl border shadow-sm ${
          isLight ? 'bg-white border-stone-200' : 'bg-[#181A1B] border-stone-800'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-stone-500 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-[#B87333]" />
              مجموع مراجعین (کل نشست‌ها)
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-stone-500/10 text-stone-500 font-bold">
              Baseline+
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black font-mono text-[#B87333]">
              {toPersianDigits(totalVisitors.toLocaleString('fa-IR'))}
            </span>
            <span className="text-xs text-stone-500">نفر</span>
          </div>
          <p className="text-[11px] text-stone-400 mt-2">
            افزایش یک واحد به ازای هر سشن جدید
          </p>
        </div>

        {/* Device Distribution Rate */}
        <div className={`p-5 rounded-3xl border shadow-sm ${
          isLight ? 'bg-white border-stone-200' : 'bg-[#181A1B] border-stone-800'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-stone-500">سهم انواع دستگاه‌ها</span>
            <Monitor className="w-4 h-4 text-sky-500" />
          </div>
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="flex items-center gap-1 text-sky-600"><Monitor className="w-3.5 h-3.5" /> دسکتاپ:</span>
              <span>{toPersianDigits(summary.deviceBreakdown.desktopPercent)}٪</span>
            </div>
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="flex items-center gap-1 text-amber-600"><Smartphone className="w-3.5 h-3.5" /> موبایل:</span>
              <span>{toPersianDigits(summary.deviceBreakdown.mobilePercent)}٪</span>
            </div>
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="flex items-center gap-1 text-purple-600"><Tablet className="w-3.5 h-3.5" /> تبلت:</span>
              <span>{toPersianDigits(summary.deviceBreakdown.tabletPercent)}٪</span>
            </div>
          </div>
        </div>

        {/* Network & Battery Overview */}
        <div className={`p-5 rounded-3xl border shadow-sm ${
          isLight ? 'bg-white border-stone-200' : 'bg-[#181A1B] border-stone-800'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-stone-500">سیاهه تله‌متری ثبت‌شده</span>
            <HardDrive className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-black font-mono text-indigo-600">
            {toPersianDigits(summary.recentVisitors.length)}
          </div>
          <p className="text-[11px] text-stone-400 mt-2">
            نشست‌های ذخیره شده در حافظه کلاینت و سرور
          </p>
        </div>

      </div>

      {/* Analytics Breakdown Row: OS, Browser, Popular Pages */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        {/* Top Operating Systems */}
        <div className={`p-5 rounded-3xl border shadow-sm ${
          isLight ? 'bg-white border-stone-200' : 'bg-[#181A1B] border-stone-800'
        }`}>
          <h2 className="text-xs font-bold mb-3 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-[#B87333]" />
            <span>توزیع سیستم‌های عامل (OS)</span>
          </h2>
          <div className="space-y-2.5">
            {summary.topOperatingSystems.map((os) => (
              <div key={os.name} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span>{os.name}</span>
                  <span className="font-mono text-stone-500">{toPersianDigits(os.percent)}٪ ({toPersianDigits(os.count)})</span>
                </div>
                <div className="w-full h-1.5 bg-stone-200 dark:bg-stone-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#B87333] rounded-full"
                    style={{ width: `${os.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Browsers */}
        <div className={`p-5 rounded-3xl border shadow-sm ${
          isLight ? 'bg-white border-stone-200' : 'bg-[#181A1B] border-stone-800'
        }`}>
          <h2 className="text-xs font-bold mb-3 flex items-center gap-2">
            <Compass className="w-4 h-4 text-sky-500" />
            <span>سهم مرورگرهای وب</span>
          </h2>
          <div className="space-y-2.5">
            {summary.topBrowsers.map((b) => (
              <div key={b.name} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span>{b.name}</span>
                  <span className="font-mono text-stone-500">{toPersianDigits(b.percent)}٪ ({toPersianDigits(b.count)})</span>
                </div>
                <div className="w-full h-1.5 bg-stone-200 dark:bg-stone-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-sky-500 rounded-full"
                    style={{ width: `${b.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Popular Visited Pages */}
        <div className={`p-5 rounded-3xl border shadow-sm ${
          isLight ? 'bg-white border-stone-200' : 'bg-[#181A1B] border-stone-800'
        }`}>
          <h2 className="text-xs font-bold mb-3 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-500" />
            <span>پربازدیدترین صفحات و تب‌ها</span>
          </h2>
          <div className="space-y-2">
            {summary.topPages.map((p) => (
              <div key={p.path} className="flex items-center justify-between p-2 rounded-xl bg-stone-500/5 text-xs">
                <span className="font-mono truncate max-w-[200px]" dir="ltr">{p.path}</span>
                <span className="font-bold text-[#B87333] font-mono shrink-0">
                  {toPersianDigits(p.views)} بازدید
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Visitor Telemetry Registry Table */}
      <div className={`rounded-3xl border shadow-sm overflow-hidden ${
        isLight ? 'bg-white border-stone-200' : 'bg-[#181A1B] border-stone-800'
      }`}>
        <div className="p-4 sm:p-6 border-b border-stone-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-bold text-base">سیاهه مراجعین و ردیابی تله‌متری (Visitor Telemetry Registry)</h2>
            <p className="text-xs text-stone-500">
              کلیک روی هر سطر، شناسنامه کامل سخت‌افزار و خط سیر ناوبری کاربر را نمایش می‌دهد.
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute start-3 top-3 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="جستجو در IP، شهر، کارت گرافیک، مرورگر..."
              className={`w-full ps-9 pe-4 py-2 rounded-xl text-xs border outline-none transition-all ${
                isLight ? 'bg-stone-50 border-stone-300 focus:border-[#B87333]' : 'bg-stone-900 border-stone-700 focus:border-[#B87333]'
              }`}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-start">
            <thead className={`border-b text-[11px] font-bold ${
              isLight ? 'bg-stone-50 border-stone-200 text-stone-600' : 'bg-stone-900/60 border-stone-800 text-stone-400'
            }`}>
              <tr>
                <th className="py-3 px-4 text-start">زمان / شناسه</th>
                <th className="py-3 px-4 text-start">آی‌پی و شهر</th>
                <th className="py-3 px-4 text-start">دستگاه و سیستم‌عامل</th>
                <th className="py-3 px-4 text-start">کارت گرافیک (GPU)</th>
                <th className="py-3 px-4 text-start">سخت‌افزار (CPU/RAM)</th>
                <th className="py-3 px-4 text-start">باتری و شبکه</th>
                <th className="py-3 px-4 text-start">صفحه و مدت حضور</th>
                <th className="py-3 px-4 text-center">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-500/10">
              {filteredVisitors.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-stone-400">
                    موردی مطابق با جستجوی شما یافت نشد.
                  </td>
                </tr>
              ) : (
                filteredVisitors.map((v) => (
                  <tr
                    key={v.sessionId}
                    onClick={() => setSelectedVisitor(v)}
                    className="hover:bg-amber-500/5 cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="font-mono font-bold text-[#B87333]">{v.visitorId}</div>
                      <div className="text-[10px] text-stone-400 flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3" />
                        <span>{new Date(v.sessionStartedAt).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="font-mono font-semibold" dir="ltr">{v.geo?.ip || '127.0.0.1'}</div>
                      <div className="text-[11px] text-stone-500">{v.geo?.city || 'تهران'} • {v.geo?.country || 'ایران'}</div>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="font-bold">{v.client?.os}</div>
                      <div className="text-[11px] text-stone-500">{v.client?.browser}</div>
                    </td>

                    <td className="py-3 px-4 max-w-[220px]">
                      <div className="truncate font-mono text-[11px]" title={v.hardware?.gpu?.renderer}>
                        {v.hardware?.gpu?.renderer || 'پیکربندی استاندارد'}
                      </div>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap font-mono">
                      <span>{v.hardware?.cpuCores} هسته</span>
                      {v.hardware?.deviceMemoryGb && <span> • {v.hardware.deviceMemoryGb}GB RAM</span>}
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1 text-[11px]">
                        {v.battery?.charging ? (
                          <BatteryCharging className="w-3.5 h-3.5 text-emerald-500" />
                        ) : (
                          <Battery className="w-3.5 h-3.5 text-amber-500" />
                        )}
                        <span>{v.battery?.levelPercent !== null ? `${toPersianDigits(v.battery.levelPercent)}٪` : '-'}</span>
                        <span className="text-stone-400">|</span>
                        <Wifi className="w-3 h-3 text-sky-500" />
                        <span>{v.network?.effectiveType || 'online'}</span>
                      </div>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="font-mono truncate max-w-[140px]" dir="ltr">{v.currentPath}</div>
                      <div className="text-[10px] text-stone-400">{toPersianDigits(v.durationSeconds)} ثانیه</div>
                    </td>

                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedVisitor(v);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-[#B87333]/10 text-[#B87333] hover:bg-[#B87333] hover:text-white transition-all text-xs font-bold"
                      >
                        شناسنامه
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETAIL MODAL: Comprehensive Visitor Identity Card */}
      {selectedVisitor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className={`w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl border shadow-2xl p-6 space-y-6 transition-all ${
            isLight ? 'bg-white border-stone-200 text-stone-900' : 'bg-[#181A1B] border-stone-800 text-[#FAF7F2]'
          }`}>

            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-stone-500/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#B87333]/10 text-[#B87333] flex items-center justify-center">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-base">شناسنامه کامل تله‌متری مراجع</h3>
                  <div className="flex items-center gap-2 text-xs font-mono text-stone-500">
                    <span>{selectedVisitor.visitorId}</span>
                    <span>•</span>
                    <span>{selectedVisitor.sessionId}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedVisitor(null)}
                className="p-2 rounded-xl hover:bg-stone-500/10 text-stone-400 hover:text-stone-900 dark:hover:text-white transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Hardware & Graphic Spec */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-[#B87333] flex items-center gap-1.5">
                <Cpu className="w-4 h-4" />
                <span>مشخصات پردازشی و سخت‌افزاری کلاینت</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-2xl bg-stone-500/5 space-y-1">
                  <span className="text-stone-400">کارت گرافیک (GPU Renderer):</span>
                  <div className="font-mono font-bold break-all">{selectedVisitor.hardware?.gpu?.renderer || 'نامشخص'}</div>
                </div>
                <div className="p-3 rounded-2xl bg-stone-500/5 space-y-1">
                  <span className="text-stone-400">سازنده گرافیک (GPU Vendor):</span>
                  <div className="font-mono font-bold">{selectedVisitor.hardware?.gpu?.vendor || 'نامشخص'}</div>
                </div>
                <div className="p-3 rounded-2xl bg-stone-500/5 space-y-1">
                  <span className="text-stone-400">هسته‌های پردازنده (CPU Cores):</span>
                  <div className="font-mono font-bold">{selectedVisitor.hardware?.cpuCores} هسته فیزیکی/منطقی</div>
                </div>
                <div className="p-3 rounded-2xl bg-stone-500/5 space-y-1">
                  <span className="text-stone-400">حافظه رم تخمینی (Device Memory):</span>
                  <div className="font-mono font-bold">{selectedVisitor.hardware?.deviceMemoryGb ? `${selectedVisitor.hardware.deviceMemoryGb} گیگابایت` : 'نامشخص'}</div>
                </div>
              </div>
            </div>

            {/* Display & Battery & Network */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-[#B87333] flex items-center gap-1.5">
                <Monitor className="w-4 h-4" />
                <span>نمایشگر، باتری و اتصالات شبکه</span>
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-2xl bg-stone-500/5">
                  <span className="text-stone-400 block mb-1">ابعاد و تراکم صفحه:</span>
                  <span className="font-mono font-bold">
                    {selectedVisitor.screen?.screenWidth}x{selectedVisitor.screen?.screenHeight} (DPR: {selectedVisitor.screen?.devicePixelRatio})
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-stone-500/5">
                  <span className="text-stone-400 block mb-1">فضای داخلی پنجره:</span>
                  <span className="font-mono font-bold">
                    {selectedVisitor.screen?.windowWidth}x{selectedVisitor.screen?.windowHeight}
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-stone-500/5">
                  <span className="text-stone-400 block mb-1">عمق رنگ و HDR:</span>
                  <span className="font-mono font-bold">
                    {selectedVisitor.screen?.colorDepth}-bit • {selectedVisitor.screen?.highDynamicRange ? 'HDR فعال' : 'SDR'}
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-stone-500/5">
                  <span className="text-stone-400 block mb-1">وضعیت باتری و شارژ:</span>
                  <span className="font-bold">
                    {selectedVisitor.battery?.levelPercent !== null ? `${selectedVisitor.battery.levelPercent}٪` : 'نامشخص'}
                    {selectedVisitor.battery?.charging && ' (متصل به شارژر)'}
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-stone-500/5">
                  <span className="text-stone-400 block mb-1">نوع شبکه و تاخیر (RTT):</span>
                  <span className="font-mono font-bold">
                    {selectedVisitor.network?.effectiveType} ({selectedVisitor.network?.rttMs ? `${selectedVisitor.network.rttMs}ms` : 'عادی'})
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-stone-500/5">
                  <span className="text-stone-400 block mb-1">پهنای باند تخمینی:</span>
                  <span className="font-mono font-bold">
                    {selectedVisitor.network?.downlinkMbps ? `${selectedVisitor.network.downlinkMbps} Mbps` : 'سرعت استاندارد'}
                  </span>
                </div>
              </div>
            </div>

            {/* Navigation Trail */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-[#B87333] flex items-center gap-1.5">
                <Compass className="w-4 h-4" />
                <span>خط سیر ناوبری و صفحات بازدید شده در نشست (Navigation Trail)</span>
              </h4>
              <div className="space-y-2">
                {selectedVisitor.navigationTrail?.map((trail, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-stone-500/5 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-[#B87333]/20 text-[#B87333] flex items-center justify-center font-bold text-[10px]">
                        {idx + 1}
                      </span>
                      <span className="font-bold">{trail.title}</span>
                      <span className="font-mono text-stone-400" dir="ltr">{trail.path}</span>
                    </div>
                    <span className="font-mono text-stone-400 text-[11px]">{trail.timestamp}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Raw User-Agent with Copy button */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-500">رشته خام User-Agent:</span>
                <button
                  onClick={() => handleCopyUa(selectedVisitor.client?.userAgentRaw || '')}
                  className="text-xs text-[#B87333] hover:underline flex items-center gap-1 font-bold"
                >
                  {copiedUa ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedUa ? 'کپی شد!' : 'کپی User-Agent'}</span>
                </button>
              </div>
              <div className="p-3 rounded-xl bg-stone-500/10 font-mono text-[11px] break-all select-all text-stone-600 dark:text-stone-300">
                {selectedVisitor.client?.userAgentRaw}
              </div>
            </div>

            <div className="pt-4 border-t border-stone-500/20 text-end">
              <button
                onClick={() => setSelectedVisitor(null)}
                className="px-5 py-2.5 rounded-xl bg-[#B87333] text-white font-bold text-xs"
              >
                بستن شناسنامه
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
