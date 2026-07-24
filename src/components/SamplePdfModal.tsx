import React, { useState } from 'react';
import { X, FileText, Download, CheckCircle2, Sparkles, ShieldCheck } from 'lucide-react';
import { LeadForm, ThemeMode } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { saveLeadSampleToFirebase } from '../lib/firebase';

interface SamplePdfModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme?: ThemeMode;
}

export const SamplePdfModal: React.FC<SamplePdfModalProps> = ({ isOpen, onClose, theme = 'light' }) => {
  const [form, setForm] = useState<LeadForm>({
    fullName: '',
    phone: '',
    organization: '',
    position: ''
  });

  const [downloadReady, setDownloadReady] = useState(false);
  const isLight = theme === 'light';

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDownloadReady(true);
    
    // Save lead to Firebase Firestore
    saveLeadSampleToFirebase(form);

    // Trigger confetti safely
    try {
      if (typeof confetti === 'function') {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 }
        });
      }
    } catch (err) {
      console.warn('Confetti animation error:', err);
    }

    // Automatically trigger PDF download
    handleDownloadFile();
  };

  const handleDownloadFile = async () => {
    try {
      // Fetch binary PDF file directly as a Blob to guarantee full size (1.4MB)
      const response = await fetch("/orangutan-plus3-sample-36-pages.pdf");
      if (!response.ok) throw new Error("File fetch failed");
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = "orangutan-plus3-sample-36-pages.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setTimeout(() => URL.revokeObjectURL(blobUrl), 15000);
    } catch (err) {
      console.error("Blob download failed, falling back to direct link", err);
      // Fallback
      const element = document.createElement("a");
      element.href = "/orangutan-plus3-sample-36-pages.pdf";
      element.download = "orangutan-plus3-sample-36-pages.pdf";
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className={`w-full max-w-lg rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative border ${
          isLight ? 'bg-white border-stone-300 text-stone-900' : 'bg-[#1E2022] border-stone-700 text-[#FAF7F2]'
        }`}
      >
        
        <button
          onClick={onClose}
          className={`absolute top-6 left-6 p-2 rounded-xl ${
            isLight ? 'bg-stone-100 text-stone-600 hover:text-stone-900' : 'bg-stone-800 text-stone-400 hover:text-white'
          }`}
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-[#B87333]/20 border border-[#B87333]/30">
            <FileText className="w-6 h-6 text-[#B87333]" />
          </div>
          <div>
            <h3 className={`text-xl font-bold ${isLight ? 'text-stone-900' : 'text-[#FAF7F2]'}`}>
              دریافت ۳۶ صفحه نمونه رایگان کتاب
            </h3>
            <p className="text-xs text-stone-400">
              مجموعه‌ای از بهترین سرفصل‌ها و پرونده‌های جلد اول و دوم
            </p>
          </div>
        </div>

        {!downloadReady ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className={`text-xs font-semibold block mb-1 ${isLight ? 'text-stone-700' : 'text-stone-300'}`}>
                نام و نام خانوادگی:*
              </label>
              <input
                type="text"
                required
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                placeholder="مثلاً: مهندس محمدی"
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none focus:border-[#B87333] ${
                  isLight ? 'bg-stone-50 border-stone-300 text-stone-900' : 'bg-[#121314] border-stone-700 text-[#FAF7F2]'
                }`}
              />
            </div>

            <div>
              <label className={`text-xs font-semibold block mb-1 ${isLight ? 'text-stone-700' : 'text-stone-300'}`}>
                شماره همراه تماس (جهت پیامک لینک دانلود):*
              </label>
              <input
                type="tel"
                required
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="۰۹۱۲..."
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none focus:border-[#B87333] ${
                  isLight ? 'bg-stone-50 border-stone-300 text-stone-900' : 'bg-[#121314] border-stone-700 text-[#FAF7F2]'
                }`}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={`text-xs font-semibold block mb-1 ${isLight ? 'text-stone-700' : 'text-stone-300'}`}>
                  نام سازمان / کارخانه:
                </label>
                <input
                  type="text"
                  value={form.organization}
                  onChange={(e) => setForm({ ...form, organization: e.target.value })}
                  placeholder="اختیاری"
                  className={`w-full px-3 py-2 rounded-xl border text-xs focus:outline-none focus:border-[#B87333] ${
                    isLight ? 'bg-stone-50 border-stone-300 text-stone-900' : 'bg-[#121314] border-stone-700 text-[#FAF7F2]'
                  }`}
                />
              </div>

              <div>
                <label className={`text-xs font-semibold block mb-1 ${isLight ? 'text-stone-700' : 'text-stone-300'}`}>
                  سمت مدیریتی:
                </label>
                <input
                  type="text"
                  value={form.position}
                  onChange={(e) => setForm({ ...form, position: e.target.value })}
                  placeholder="مثلاً: مدیرعامل / سرپرست"
                  className={`w-full px-3 py-2 rounded-xl border text-xs focus:outline-none focus:border-[#B87333] ${
                    isLight ? 'bg-stone-50 border-stone-300 text-stone-900' : 'bg-[#121314] border-stone-700 text-[#FAF7F2]'
                  }`}
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-[#B87333] hover:bg-amber-600 text-white font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>دریافت فوری فایل نمونه (PDF)</span>
            </motion.button>
          </form>
        ) : (
          <div className="text-center py-6 space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h4 className={`text-lg font-bold ${isLight ? 'text-stone-900' : 'text-[#FAF7F2]'}`}>
                فایل نمونه ۳۶ صفحه‌ای آماده دانلود است
              </h4>
              <p className="text-xs text-stone-400">
                لینک دانلود همزمان به شماره {form.phone} پیامک گردید.
              </p>
            </div>

            <div className="space-y-3">
              <a
                href="/orangutan-plus3-sample-36-pages.pdf"
                download="orangutan-plus3-sample-36-pages.pdf"
                onClick={(e) => {
                  e.preventDefault();
                  handleDownloadFile();
                }}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-bold text-xs shadow-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>دانلود مستقیم فایل PDF (حجم ۱.۴ مگابایت)</span>
              </a>

              <a
                href="/orangutan-plus3-sample-36-pages.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className={`w-full py-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                  isLight
                    ? 'bg-stone-100 hover:bg-stone-200 text-stone-800 border-stone-300'
                    : 'bg-stone-800 hover:bg-stone-700 text-stone-200 border-stone-700'
                }`}
              >
                <span>مشاهده و مطالعه مستقیم در مرورگر</span>
              </a>
            </div>

            <button
              onClick={onClose}
              className="text-xs text-stone-400 underline underline-offset-4"
            >
              بستن پنجره
            </button>
          </div>
        )}

      </motion.div>
    </div>
  );
};
