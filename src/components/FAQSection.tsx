import React, { useMemo, useState } from 'react';
import { BookOpen, CheckCircle2, FileText, HelpCircle, Layers, MessageCircleQuestion, Package, Phone, Search, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'motion/react';
import { ThemeMode, ActiveTab } from '../types';
import { Button, Container, PageHeader, inputClass } from './ui/kit';
import { useLocaleFormat } from './ui/format';

interface FAQSectionProps {
  theme?: ThemeMode;
  onSelectTab?: (tab: ActiveTab) => void;
  onOpenSamplePdf?: () => void;
}

type Category = 'all' | 'audience' | 'content' | 'purchase' | 'shipping';

interface FAQItem {
  id: string;
  category: Exclude<Category, 'all'>;
  question: string;
  answer: string;
  highlights?: string[];
}

const CATEGORY_META: { key: Category; labelKey: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { key: 'all', labelKey: 'faq.categoryAll', icon: Layers },
  { key: 'audience', labelKey: 'faq.categoryAudience', icon: Users },
  { key: 'content', labelKey: 'faq.categoryContent', icon: BookOpen },
  { key: 'purchase', labelKey: 'faq.categoryPurchase', icon: FileText },
  { key: 'shipping', labelKey: 'faq.categoryShipping', icon: Package },
];

export const FAQSection: React.FC<FAQSectionProps> = ({ onSelectTab, onOpenSamplePdf }) => {
  const { t } = useTranslation();
  const { num } = useLocaleFormat();
  const [category, setCategory] = useState<Category>('all');
  const [openId, setOpenId] = useState<string | null>('faq-1');
  const [query, setQuery] = useState('');

  const raw = t('faq.items', { returnObjects: true });
  const faqs = (Array.isArray(raw) ? raw : []) as FAQItem[];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return faqs.filter(
      (f) =>
        (category === 'all' || f.category === category) &&
        (!q || f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q))
    );
  }, [faqs, category, query]);

  const countFor = (key: Category) => (key === 'all' ? faqs.length : faqs.filter((f) => f.category === key).length);

  return (
    <>
      <PageHeader icon={HelpCircle} kicker={t('faq.headerBadge')} title={t('faq.headerTitle')} subtitle={t('faq.headerSubtitle')}>
        <div className="flex flex-wrap items-center justify-center gap-3">
          {onOpenSamplePdf && (
            <Button onClick={onOpenSamplePdf}>
              <FileText className="w-4 h-4" />
              {t('faq.ctaSamplePdf')}
            </Button>
          )}
          {onSelectTab && (
            <Button variant="secondary" onClick={() => onSelectTab('books')}>
              <BookOpen className="w-4 h-4 text-copper-hi" />
              {t('faq.ctaBuyBooks')}
            </Button>
          )}
        </div>
      </PageHeader>

      <Container className="py-12 sm:py-16">
        <div className="grid gap-8 lg:grid-cols-12">
          {/* Sidebar */}
          <aside className="lg:col-span-4">
            <div className="lg:sticky lg:top-32 space-y-5">
              <div className="relative">
                <Search className="pointer-events-none absolute top-1/2 -translate-y-1/2 start-3.5 w-4 h-4 text-ink-3" />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={t('ui.faq.search')}
                  className={`${inputClass} ps-10`}
                />
              </div>

              <nav className="og-no-scrollbar flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible" aria-label={t('faq.headerBadge')}>
                {CATEGORY_META.map(({ key, labelKey, icon: Icon }) => {
                  const active = category === key;
                  return (
                    <button
                      key={key}
                      onClick={() => setCategory(key)}
                      aria-pressed={active}
                      className={`relative flex shrink-0 items-center justify-between gap-4 rounded-2xl px-4 py-3 text-sm font-bold transition-colors ${
                        active ? 'text-copper-hi' : 'text-ink-2 hover:bg-surface hover:text-ink'
                      }`}
                    >
                      {active && (
                        <motion.span
                          layoutId="faq-cat"
                          className="absolute inset-0 rounded-2xl border border-copper/35 bg-copper/10"
                          transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                        />
                      )}
                      <span className="relative flex items-center gap-2.5 whitespace-nowrap">
                        <Icon className="w-4 h-4" />
                        {t(labelKey, { count: faqs.length })}
                      </span>
                      <span className="relative rounded-md bg-surface-2 px-1.5 text-[11px] font-black text-ink-3">{num(countFor(key))}</span>
                    </button>
                  );
                })}
              </nav>

              <div className="hidden lg:block relative overflow-hidden rounded-3xl bg-[#0A0A0B] p-6 text-[#FAF7F2]">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_100%_0%,rgba(184,115,51,0.35),transparent_60%)]" />
                <MessageCircleQuestion className="relative w-7 h-7 text-[#D9894A]" />
                <h3 className="relative mt-4 text-base font-black leading-7">{t('faq.bottomBoxTitle')}</h3>
                <p className="relative mt-2 text-xs leading-6 text-stone-400">{t('faq.bottomBoxSubtitle')}</p>
                <a
                  href="tel:09130440143"
                  className="relative mt-5 inline-flex items-center gap-2 rounded-2xl bg-emerald-500 px-4 py-2.5 text-xs font-bold text-white hover:bg-emerald-400 transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  {t('faq.supportPhoneBtn')}
                </a>
              </div>
            </div>
          </aside>

          {/* Accordion */}
          <div className="lg:col-span-8 space-y-3">
            <AnimatePresence initial={false}>
              {filtered.map((faq, idx) => {
                const open = openId === faq.id;
                return (
                  <motion.div
                    layout
                    key={faq.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className={`overflow-hidden rounded-3xl border transition-colors ${
                      open ? 'border-copper/45 bg-surface og-shadow' : 'border-line bg-surface hover:border-line-strong'
                    }`}
                  >
                    <button
                      onClick={() => setOpenId(open ? null : faq.id)}
                      aria-expanded={open}
                      className="flex w-full items-center gap-4 p-5 sm:p-6 text-start"
                    >
                      <span
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xs font-black transition-colors ${
                          open ? 'bg-gradient-to-br from-[#D9894A] to-[#7A3E14] text-white' : 'bg-surface-2 text-ink-3'
                        }`}
                      >
                        {num(idx + 1)}
                      </span>
                      <span className="flex-1 text-sm sm:text-base font-bold leading-7 text-ink">{faq.question}</span>
                      <span
                        className={`relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
                          open ? 'border-copper/40 rotate-45 text-copper-hi' : 'border-line text-ink-3'
                        }`}
                        aria-hidden="true"
                      >
                        <span className="absolute h-0.5 w-3 rounded bg-current" />
                        <span className="absolute h-3 w-0.5 rounded bg-current" />
                      </span>
                    </button>
                    <AnimatePresence initial={false}>
                      {open && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                        >
                          <div className="space-y-4 px-5 sm:px-6 pb-6 sm:ps-[4.75rem]">
                            <p className="text-sm leading-8 text-ink-2">{faq.answer}</p>
                            {faq.highlights && faq.highlights.length > 0 && (
                              <ul className="grid gap-2 rounded-2xl bg-surface-2/70 p-4">
                                {faq.highlights.map((h) => (
                                  <li key={h} className="flex items-start gap-2 text-xs leading-6 text-ink-2">
                                    <CheckCircle2 className="mt-1 w-3.5 h-3.5 shrink-0 text-emerald-500" />
                                    {h}
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {filtered.length === 0 && (
              <div className="rounded-3xl border border-dashed border-line-strong py-12 text-center text-sm text-ink-2">
                {t('ui.faq.noResults')}
              </div>
            )}

            {/* Mobile contact card */}
            <div className="lg:hidden mt-6 rounded-3xl border border-line bg-surface p-6 space-y-3">
              <h3 className="text-base font-black">{t('faq.bottomBoxTitle')}</h3>
              <p className="text-xs leading-6 text-ink-2">{t('faq.bottomBoxSubtitle')}</p>
              <a
                href="tel:09130440143"
                className="inline-flex items-center gap-2 rounded-2xl bg-emerald-500 px-4 py-2.5 text-xs font-bold text-white"
              >
                <Phone className="w-4 h-4" />
                {t('faq.supportPhoneBtn')}
              </a>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};
