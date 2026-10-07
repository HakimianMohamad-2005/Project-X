import React, { useState } from 'react';
import { Building2, FileText, Lock, Minus, Phone, Plus, Send, Sparkles, User, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { B2BForm, ThemeMode } from '../types';
import { saveB2BInquiryToApi } from '../lib/api';
import { Button, Card, Check, Container, Field, PageHeader, Reveal, SuccessState, inputClass } from './ui/kit';
import { useLocaleFormat } from './ui/format';

interface B2BSectionProps {
  theme?: ThemeMode;
}

const MIN_QTY = 10;
const INITIAL: B2BForm = {
  companyName: '',
  contactPerson: '',
  phone: '',
  email: '',
  quantity: MIN_QTY,
  requestAuthorMeeting: true,
  requestLegalInvoice: true,
  notes: '',
};

export const B2BSection: React.FC<B2BSectionProps> = () => {
  const { t } = useTranslation();
  const { num } = useLocaleFormat();
  const [form, setForm] = useState<B2BForm>(INITIAL);
  const [submitted, setSubmitted] = useState(false);

  const setQty = (q: number) => setForm((f) => ({ ...f, quantity: Math.max(MIN_QTY, Math.min(999, Math.round(q) || MIN_QTY)) }));

  const perks = [
    { icon: FileText, title: t('b2b.features.f1Title'), desc: t('b2b.features.f1Desc'), from: 1 },
    { icon: Sparkles, title: t('b2b.features.f3Title'), desc: t('b2b.features.f3Desc'), from: 10 },
    { icon: Users, title: t('b2b.features.f2Title'), desc: t('b2b.features.f2Desc'), from: 20 },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    saveB2BInquiryToApi(form);
    confetti({ particleCount: 80, spread: 80, origin: { y: 0.6 }, colors: ['#D9894A', '#FFD3A1', '#10B981'] });
  };

  return (
    <>
      <PageHeader icon={Building2} kicker={t('b2b.badge')} title={t('b2b.title')} subtitle={t('b2b.subtitle')} />

      <Container className="py-12 sm:py-16">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-start">
          {/* Perks that react to the quantity */}
          <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-32">
            <Reveal>
              <h2 className="text-lg font-black text-ink">{t('ui.b2b.perksTitle')}</h2>
              <p className="mt-1 text-xs text-ink-3">{t('ui.b2b.perksHint')}</p>
            </Reveal>
            {perks.map(({ icon: Icon, title, desc, from }, i) => {
              const unlocked = form.quantity >= from;
              return (
                <Reveal key={title} delay={i * 0.08}>
                  <div
                    className={`relative overflow-hidden rounded-3xl border p-5 transition-all duration-500 ${
                      unlocked ? 'border-copper/45 bg-copper/[0.07]' : 'border-line bg-surface opacity-60'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <span
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl transition-colors ${
                          unlocked ? 'bg-gradient-to-br from-[#D9894A] to-[#7A3E14] text-white' : 'bg-surface-2 text-ink-3'
                        }`}
                      >
                        {unlocked ? <Icon className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                      </span>
                      <div className="space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-sm font-black text-ink">{title}</h3>
                          {from > 1 && (
                            <span
                              className={`rounded-full px-2 py-0.5 text-[10px] font-black ${
                                unlocked ? 'bg-emerald-500/15 text-emerald-500' : 'bg-surface-2 text-ink-3'
                              }`}
                            >
                              {unlocked ? t('ui.b2b.unlocked') : t('ui.b2b.from', { n: num(from) })}
                            </span>
                          )}
                        </div>
                        <p className="text-xs leading-6 text-ink-2">{desc}</p>
                      </div>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>

          {/* Form */}
          <Reveal className="lg:col-span-7" delay={0.1}>
            <Card className="relative overflow-hidden p-6 sm:p-8 og-shadow">
              <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(ellipse_at_top,rgba(184,115,51,0.14),transparent_70%)]" />
              {!submitted ? (
                <form onSubmit={handleSubmit} className="relative space-y-5">
                  <h2 className="text-xl font-black text-ink">{t('b2b.formTitle')}</h2>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label={t('b2b.companyNameLabel').replace(/[:：*]+$/, '')} icon={Building2} required>
                      <input
                        required
                        value={form.companyName}
                        onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                        placeholder={t('b2b.companyNamePlaceholder')}
                        autoComplete="organization"
                        className={inputClass}
                      />
                    </Field>
                    <Field label={t('b2b.contactPersonLabel').replace(/[:：*]+$/, '')} icon={User} required>
                      <input
                        required
                        value={form.contactPerson}
                        onChange={(e) => setForm({ ...form, contactPerson: e.target.value })}
                        placeholder={t('b2b.contactPersonPlaceholder')}
                        autoComplete="name"
                        className={inputClass}
                      />
                    </Field>
                    <Field label={t('b2b.phoneLabel').replace(/[:：*]+$/, '')} icon={Phone} required>
                      <input
                        required
                        type="tel"
                        dir="ltr"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        placeholder="09xx xxx xxxx"
                        autoComplete="tel"
                        className={`${inputClass} text-start`}
                      />
                    </Field>
                    <Field label={t('b2b.quantityLabel').replace(/[:：]+$/, '')}>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setQty(form.quantity - 1)}
                          aria-label={t('ui.cart.decrease')}
                          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-line-strong bg-field text-ink-2 hover:text-copper-hi"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <input
                          type="number"
                          min={MIN_QTY}
                          dir="ltr"
                          value={form.quantity}
                          onChange={(e) => setQty(Number(e.target.value))}
                          className={`${inputClass} text-center font-black`}
                        />
                        <button
                          type="button"
                          onClick={() => setQty(form.quantity + 1)}
                          aria-label={t('ui.cart.increase')}
                          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-line-strong bg-field text-ink-2 hover:text-copper-hi"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </Field>
                  </div>

                  <input
                    type="range"
                    min={MIN_QTY}
                    max={100}
                    value={Math.min(form.quantity, 100)}
                    onChange={(e) => setQty(Number(e.target.value))}
                    className="w-full accent-[#B87333]"
                    aria-label={t('b2b.quantityLabel')}
                  />

                  <div className="grid gap-3">
                    <Check checked={form.requestLegalInvoice} onChange={(v) => setForm({ ...form, requestLegalInvoice: v })}>
                      {t('b2b.taxInvoiceCheckbox')}
                    </Check>
                    <Check checked={form.requestAuthorMeeting} onChange={(v) => setForm({ ...form, requestAuthorMeeting: v })}>
                      {t('b2b.meetingCheckbox')}
                    </Check>
                  </div>

                  <Field label={t('b2b.notesLabel').replace(/[:：]+$/, '')}>
                    <textarea
                      rows={3}
                      value={form.notes}
                      onChange={(e) => setForm({ ...form, notes: e.target.value })}
                      placeholder={t('b2b.notesPlaceholder')}
                      className={`${inputClass} resize-none`}
                    />
                  </Field>

                  <Button type="submit" size="lg" className="w-full">
                    <Send className="w-5 h-5" />
                    {t('b2b.submitBtn')}
                  </Button>
                </form>
              ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative">
                  <SuccessState title={t('b2b.successTitle')} text={t('b2b.successSubtitle')}>
                    <Button
                      variant="secondary"
                      onClick={() => {
                        setForm(INITIAL);
                        setSubmitted(false);
                      }}
                    >
                      {t('b2b.resetBtn')}
                    </Button>
                  </SuccessState>
                </motion.div>
              )}
            </Card>
          </Reveal>
        </div>
      </Container>
    </>
  );
};
