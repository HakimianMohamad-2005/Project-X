import React, { useState } from 'react';
import { Building2, Users, FileText, CheckCircle2, Send, Sparkles } from 'lucide-react';
import { B2BForm, ThemeMode } from '../types';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { saveB2BInquiryToApi } from '../lib/api';
import { useTranslation } from 'react-i18next';

interface B2BSectionProps {
  theme?: ThemeMode;
}

export const B2BSection: React.FC<B2BSectionProps> = ({ theme = 'light' }) => {
  const { t } = useTranslation();
  const [form, setForm] = useState<B2BForm>({
    companyName: '',
    contactPerson: '',
    phone: '',
    email: '',
    quantity: 10,
    requestAuthorMeeting: true,
    requestLegalInvoice: true,
    notes: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const isLight = theme === 'light';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    saveB2BInquiryToApi(form);
    confetti({
      particleCount: 70,
      spread: 80,
      origin: { y: 0.6 }
    });
  };

  return (
    <section id="b2b" className={`py-16 md:py-20 transition-colors duration-300 border-b ${
      isLight ? 'bg-[#FAF8F5] border-stone-300 text-stone-900' : 'bg-[#121314] border-stone-800 text-[#FAF7F2]'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Right Column: B2B Features & Value Proposition */}
          <div className="lg:col-span-6 space-y-6">
            <div className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full border text-xs font-bold ${
              isLight ? 'bg-amber-100 border-amber-300 text-[#B87333]' : 'bg-[#1E2022] border-[#B87333]/40 text-[#B87333]'
            }`}>
              <Building2 className="w-4 h-4 text-[#B87333]" />
              <span>{t('b2b.badge')}</span>
            </div>

            <h2 className={`text-3xl sm:text-4xl font-extrabold leading-tight ${
              isLight ? 'text-stone-900' : 'text-[#FAF7F2]'
            }`}>
              {t('b2b.title')}
            </h2>

            <p className={`text-sm sm:text-base leading-relaxed ${isLight ? 'text-stone-700' : 'text-stone-300'}`}>
              {t('b2b.subtitle')}
            </p>

            <div className="space-y-4 pt-2">
              <div className={`flex items-start gap-3 p-4 rounded-2xl border ${
                isLight ? 'bg-white border-stone-200' : 'bg-[#1E2022] border-stone-800'
              }`}>
                <FileText className="w-5 h-5 text-[#B87333] shrink-0 mt-0.5" />
                <div>
                  <h3 className={`text-sm font-bold ${isLight ? 'text-stone-900' : 'text-[#FAF7F2]'}`}>{t('b2b.features.f1Title')}</h3>
                  <p className="text-xs text-stone-400 mt-1">
                    {t('b2b.features.f1Desc')}
                  </p>
                </div>
              </div>

              <div className={`flex items-start gap-3 p-4 rounded-2xl border ${
                isLight ? 'bg-white border-stone-200' : 'bg-[#1E2022] border-stone-800'
              }`}>
                <Users className="w-5 h-5 text-[#B87333] shrink-0 mt-0.5" />
                <div>
                  <h3 className={`text-sm font-bold ${isLight ? 'text-stone-900' : 'text-[#FAF7F2]'}`}>{t('b2b.features.f2Title')}</h3>
                  <p className="text-xs text-stone-400 mt-1">
                    {t('b2b.features.f2Desc')}
                  </p>
                </div>
              </div>

              <div className={`flex items-start gap-3 p-4 rounded-2xl border ${
                isLight ? 'bg-white border-stone-200' : 'bg-[#1E2022] border-stone-800'
              }`}>
                <Sparkles className="w-5 h-5 text-[#B87333] shrink-0 mt-0.5" />
                <div>
                  <h3 className={`text-sm font-bold ${isLight ? 'text-stone-900' : 'text-[#FAF7F2]'}`}>{t('b2b.features.f3Title')}</h3>
                  <p className="text-xs text-stone-400 mt-1">
                    {t('b2b.features.f3Desc')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Left Column: Interactive Form */}
          <div className="lg:col-span-6">
            <div className={`p-6 sm:p-8 rounded-3xl border shadow-2xl space-y-6 ${
              isLight ? 'bg-white border-stone-200' : 'bg-[#1E2022] border-stone-700'
            }`}>
              
              {!submitted ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h3 className={`text-lg font-bold pb-2 border-b border-stone-500/20 ${
                    isLight ? 'text-stone-900' : 'text-[#FAF7F2]'
                  }`}>
                    {t('b2b.formTitle')}
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={`text-xs font-semibold block mb-1 ${isLight ? 'text-stone-700' : 'text-stone-300'}`}>
                        {t('b2b.companyNameLabel')}
                      </label>
                      <input
                        type="text"
                        required
                        value={form.companyName}
                        onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                        placeholder={t('b2b.companyNamePlaceholder')}
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none focus:border-[#B87333] ${
                          isLight ? 'bg-stone-50 border-stone-300 text-stone-900' : 'bg-[#121314] border-stone-700 text-[#FAF7F2]'
                        }`}
                      />
                    </div>

                    <div>
                      <label className={`text-xs font-semibold block mb-1 ${isLight ? 'text-stone-700' : 'text-stone-300'}`}>
                        {t('b2b.contactPersonLabel')}
                      </label>
                      <input
                        type="text"
                        required
                        value={form.contactPerson}
                        onChange={(e) => setForm({ ...form, contactPerson: e.target.value })}
                        placeholder={t('b2b.contactPersonPlaceholder')}
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none focus:border-[#B87333] ${
                          isLight ? 'bg-stone-50 border-stone-300 text-stone-900' : 'bg-[#121314] border-stone-700 text-[#FAF7F2]'
                        }`}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={`text-xs font-semibold block mb-1 ${isLight ? 'text-stone-700' : 'text-stone-300'}`}>
                        {t('b2b.phoneLabel')}
                      </label>
                      <input
                        type="tel"
                        required
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        placeholder={t('b2b.phonePlaceholder')}
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none focus:border-[#B87333] ${
                          isLight ? 'bg-stone-50 border-stone-300 text-stone-900' : 'bg-[#121314] border-stone-700 text-[#FAF7F2]'
                        }`}
                      />
                    </div>

                    <div>
                      <label className={`text-xs font-semibold block mb-1 ${isLight ? 'text-stone-700' : 'text-stone-300'}`}>
                        {t('b2b.quantityLabel')}
                      </label>
                      <input
                        type="number"
                        min="10"
                        value={form.quantity}
                        onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })}
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none focus:border-[#B87333] ${
                          isLight ? 'bg-stone-50 border-stone-300 text-stone-900' : 'bg-[#121314] border-stone-700 text-[#FAF7F2]'
                        }`}
                      />
                    </div>
                  </div>

                  <div className="space-y-2 pt-2">
                    <label className={`flex items-center gap-2 cursor-pointer text-xs ${isLight ? 'text-stone-700' : 'text-stone-300'}`}>
                      <input
                        type="checkbox"
                        checked={form.requestLegalInvoice}
                        onChange={(e) => setForm({ ...form, requestLegalInvoice: e.target.checked })}
                        className="w-4 h-4 rounded text-[#B87333] bg-[#121314] border-stone-700"
                      />
                      <span>{t('b2b.taxInvoiceCheckbox')}</span>
                    </label>

                    <label className={`flex items-center gap-2 cursor-pointer text-xs ${isLight ? 'text-stone-700' : 'text-stone-300'}`}>
                      <input
                        type="checkbox"
                        checked={form.requestAuthorMeeting}
                        onChange={(e) => setForm({ ...form, requestAuthorMeeting: e.target.checked })}
                        className="w-4 h-4 rounded text-[#B87333] bg-[#121314] border-stone-700"
                      />
                      <span>{t('b2b.meetingCheckbox')}</span>
                    </label>
                  </div>

                  <div>
                    <label className={`text-xs font-semibold block mb-1 ${isLight ? 'text-stone-700' : 'text-stone-300'}`}>{t('b2b.notesLabel')}</label>
                    <textarea
                      rows={3}
                      value={form.notes}
                      onChange={(e) => setForm({ ...form, notes: e.target.value })}
                      placeholder={t('b2b.notesPlaceholder')}
                      className={`w-full px-3.5 py-2 rounded-xl border text-xs focus:outline-none focus:border-[#B87333] ${
                        isLight ? 'bg-stone-50 border-stone-300 text-stone-900' : 'bg-[#121314] border-stone-700 text-[#FAF7F2]'
                      }`}
                    />
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="w-full py-3.5 rounded-2xl bg-[#B87333] hover:bg-amber-600 text-white font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>{t('b2b.submitBtn')}</span>
                  </motion.button>
                </form>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8 space-y-4"
                >
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className={`text-xl font-bold ${isLight ? 'text-stone-900' : 'text-[#FAF7F2]'}`}>
                    {t('b2b.successTitle')}
                  </h3>
                  <p className="text-xs text-stone-400 leading-relaxed max-w-md mx-auto">
                    {t('b2b.successSubtitle')}
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className={`px-6 py-2.5 rounded-xl text-xs font-bold ${
                      isLight ? 'bg-stone-200 text-stone-800 hover:bg-stone-300' : 'bg-stone-800 text-white hover:bg-stone-700'
                    }`}
                  >
                    {t('b2b.resetBtn')}
                  </button>
                </motion.div>
              )}

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

