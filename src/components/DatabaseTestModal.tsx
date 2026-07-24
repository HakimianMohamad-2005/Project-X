import React, { useState, useEffect } from 'react';
import { Database, CheckCircle2, AlertTriangle, RefreshCw, X, Server, Table, ShieldCheck } from 'lucide-react';
import { testDatabaseConnection, DbTestResult } from '../lib/api';
import { ThemeMode } from '../types';
import { toPersianDigits } from '../utils/persian';
import { motion, AnimatePresence } from 'motion/react';

interface DatabaseTestModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme?: ThemeMode;
}

export const DatabaseTestModal: React.FC<DatabaseTestModalProps> = ({
  isOpen,
  onClose,
  theme = 'light'
}) => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DbTestResult | null>(null);
  const isLight = theme === 'light';

  const runTest = async () => {
    setLoading(true);
    const res = await testDatabaseConnection();
    setResult(res);
    setLoading(false);
  };

  useEffect(() => {
    if (isOpen) {
      runTest();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className={`relative w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl border text-right font-vazir ${
          isLight ? 'bg-[#FAF8F5] border-stone-300 text-stone-900' : 'bg-[#181A1B] border-stone-800 text-[#FAF7F2]'
        }`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className={`absolute top-5 left-5 p-2 rounded-full transition-colors ${
            isLight ? 'bg-stone-200 hover:bg-stone-300 text-stone-700' : 'bg-stone-800 hover:bg-stone-700 text-stone-300'
          }`}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0">
            <Database className="w-6 h-6 text-[#B87333]" />
          </div>
          <div>
            <h3 className="font-black text-lg sm:text-xl">تست آنلاین اتصال دیتابیس MySQL</h3>
            <p className={`text-xs mt-0.5 ${isLight ? 'text-stone-600' : 'text-stone-400'}`}>
              بررسی وضعیت ارتباط PHP (PDO) با دیتابیس cPanel
            </p>
          </div>
        </div>

        {/* Credentials Info */}
        <div className={`p-4 rounded-2xl border text-xs space-y-1.5 mb-6 ${
          isLight ? 'bg-stone-100 border-stone-200 text-stone-800' : 'bg-stone-900/60 border-stone-800 text-stone-300'
        }`}>
          <div className="flex justify-between items-center font-mono text-[11px]">
            <span className="font-sans font-bold">نام دیتابیس:</span>
            <span className="text-[#B87333] font-semibold">oranguta_book</span>
          </div>
          <div className="flex justify-between items-center font-mono text-[11px]">
            <span className="font-sans font-bold">نام کاربری:</span>
            <span className="text-stone-600 dark:text-stone-400">oranguta_Controller</span>
          </div>
          <div className="flex justify-between items-center font-mono text-[11px]">
            <span className="font-sans font-bold">آدرس اندپوینت:</span>
            <span className="text-blue-500 dir-ltr">/api/test_db.php</span>
          </div>
        </div>

        {/* Results Area */}
        {loading ? (
          <div className="py-10 text-center flex flex-col items-center justify-center gap-3">
            <RefreshCw className="w-8 h-8 text-[#B87333] animate-spin" />
            <p className="text-xs font-semibold text-stone-600 dark:text-stone-400">
              در حال ارسال درخواست به سرور و تست اتصال PDO...
            </p>
          </div>
        ) : result ? (
          <div className="space-y-4">
            {/* Status Banner */}
            <div
              className={`p-4 rounded-2xl border flex items-start gap-3 ${
                result.success
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-800 dark:text-emerald-300'
                  : 'bg-amber-500/10 border-amber-500/30 text-amber-800 dark:text-amber-300'
              }`}
            >
              {result.success ? (
                <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-6 h-6 text-amber-500 shrink-0 mt-0.5" />
              )}
              <div className="text-xs leading-relaxed">
                <p className="font-bold text-sm mb-1">{result.message}</p>
                {!result.success && (
                  <p className="mt-2 text-[11px] text-stone-600 dark:text-stone-400 leading-normal">
                    نکته: برای تست عملی روی هاست cPanel، مطمئن شوید که فایل‌های پوشه <code className="bg-stone-200 dark:bg-stone-800 px-1 py-0.5 rounded">public/api</code> و اسکریپت SQL در <code className="bg-stone-200 dark:bg-stone-800 px-1 py-0.5 rounded">schema.sql</code> روی هاست ایمپورت شده باشند.
                  </p>
                )}
              </div>
            </div>

            {/* Detailed Stats if successful */}
            {result.success && (
              <div className={`p-4 rounded-2xl border text-xs space-y-3 ${
                isLight ? 'bg-white border-stone-200' : 'bg-stone-900 border-stone-800'
              }`}>
                <div className="flex items-center justify-between border-b pb-2 border-stone-200 dark:border-stone-800">
                  <span className="flex items-center gap-1.5 font-semibold">
                    <Table className="w-4 h-4 text-[#B87333]" />
                    جدول‌های شناسایی شده در phpMyAdmin:
                  </span>
                  <span className="font-mono font-bold dir-ltr">
                    {result.tables && result.tables.length > 0 ? result.tables.join(', ') : 'جدولی یافت نشد'}
                  </span>
                </div>

                <div className="flex items-center justify-between border-b pb-2 border-stone-200 dark:border-stone-800">
                  <span className="flex items-center gap-1.5 font-semibold">
                    <Server className="w-4 h-4 text-emerald-500" />
                    تعداد کل سفارش‌های ثبت‌شده:
                  </span>
                  <span className="font-extrabold text-sm text-emerald-600 dark:text-emerald-400">
                    {toPersianDigits(result.orderCount ?? 0)} سفارش
                  </span>
                </div>

                {result.serverTime && (
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 font-semibold text-stone-500">
                      <ShieldCheck className="w-4 h-4 text-blue-500" />
                      زمان پاسخگویی سرور:
                    </span>
                    <span className="font-mono text-[11px] dir-ltr text-stone-500">
                      {result.serverTime}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : null}

        {/* Footer Actions */}
        <div className="mt-6 flex items-center justify-between gap-3">
          <button
            onClick={runTest}
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#B87333] hover:bg-amber-600 text-white text-xs font-bold shadow-md transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>تست مجدد اتصال</span>
          </button>

          <button
            onClick={onClose}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold border transition-all ${
              isLight ? 'bg-stone-100 hover:bg-stone-200 text-stone-800 border-stone-300' : 'bg-stone-800 hover:bg-stone-700 text-stone-200 border-stone-700'
            }`}
          >
            بستن
          </button>
        </div>
      </motion.div>
    </div>
  );
};
