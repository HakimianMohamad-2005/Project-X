import React, { useMemo, useRef, useState } from 'react';
import { ArrowLeft, Boxes, Briefcase, Clock, DollarSign, Factory, PieChart, Quote, Target, TrendingDown, TrendingUp, Truck } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'motion/react';
import { CaseCategory, ThemeMode } from '../types';
import { Container, FilterTabs, Modal, PageHeader, Button } from './ui/kit';
import { useLocaleFormat } from './ui/format';

interface CaseStudiesProps {
  theme?: ThemeMode;
}

interface CaseItem {
  id: string;
  title: string;
  subtitle: string;
  categoryLabel: string;
  volumeRef: string;
  problem: string;
  leverIntervention: string;
  results: string;
  keyMetric: string;
  quote: string;
}

const ICON_BY_CASE: Record<string, React.ComponentType<{ className?: string }>> = {
  'case-steam-needle': Factory,
  'case-pvc-leak': TrendingDown,
  'case-bearing-68y': Boxes,
  'case-milk-4am': Clock,
  'case-kabab-soda': PieChart,
  'case-sales-toxic': DollarSign,
  'case-school-milk': Truck,
};

const CATEGORY_OF: Record<string, Exclude<CaseCategory, 'all'>> = {
  'case-steam-needle': 'production',
  'case-milk-4am': 'production',
  'case-pvc-leak': 'finance',
  'case-bearing-68y': 'finance',
  'case-kabab-soda': 'sales',
  'case-sales-toxic': 'sales',
  'case-school-milk': 'ai',
};

export const CaseStudies: React.FC<CaseStudiesProps> = () => {
  const { t } = useTranslation();
  const { num } = useLocaleFormat();
  const [category, setCategory] = useState<CaseCategory>('all');
  const [openCase, setOpenCase] = useState<CaseItem | null>(null);

  const raw = t('caseStudies.items', { returnObjects: true });
  const items = (Array.isArray(raw) ? raw : []) as CaseItem[];
  const filtered = category === 'all' ? items : items.filter((c) => CATEGORY_OF[c.id] === category);

  const tabs = useMemo(
    () =>
      (['all', 'production', 'finance', 'sales', 'ai'] as CaseCategory[]).map((key) => ({
        value: key,
        label: t(`caseStudies.categories.${key}`),
        count: num(key === 'all' ? items.length : items.filter((c) => CATEGORY_OF[c.id] === key).length),
      })),
    [t, items, num]
  );

  // Keep showing the last case while the modal animates out.
  const lastCase = useRef<CaseItem | null>(null);
  if (openCase) lastCase.current = openCase;
  const shown = openCase || lastCase.current;
  const OpenIcon = shown ? ICON_BY_CASE[shown.id] || Factory : Factory;

  return (
    <>
      <PageHeader icon={Briefcase} kicker={t('caseStudies.badge')} title={t('caseStudies.title')} subtitle={t('caseStudies.subtitle')} />

      <Container className="py-12 sm:py-16 space-y-10">
        <FilterTabs<CaseCategory> options={tabs} value={category} onChange={setCategory} />

        <motion.div layout className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((cs, idx) => {
              const Icon = ICON_BY_CASE[cs.id] || Factory;
              const fileNo = items.findIndex((c) => c.id === cs.id) + 1;
              return (
                <motion.button
                  layout
                  key={cs.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0, transition: { delay: idx * 0.05 } }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  onClick={() => setOpenCase(cs)}
                  className="group relative flex flex-col text-start pt-4"
                >
                  {/* Folder tab */}
                  <span className="absolute top-0 start-0 h-6 w-28 rounded-t-xl border border-b-0 border-line bg-surface px-3 pt-1 text-[10px] font-black text-ink-3 transition-colors group-hover:text-copper-hi">
                    {t('ui.cases.file')} {num(String(fileNo).padStart(2, '0'))}
                  </span>
                  <div className="relative flex h-full flex-col overflow-hidden rounded-3xl rounded-ss-none border border-line bg-surface p-6 transition-all duration-300 group-hover:-translate-y-1 group-hover:border-copper/50 group-hover:og-shadow">
                    <div className="absolute -top-20 -end-20 h-48 w-48 rounded-full bg-copper/10 blur-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                    <div className="relative flex items-start justify-between gap-3">
                      <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-copper/25 bg-copper/10 text-copper-hi">
                        <Icon className="w-6 h-6" />
                      </span>
                      <span className="rounded-lg border border-line px-2.5 py-1 text-[10px] font-bold text-ink-3">{cs.volumeRef}</span>
                    </div>

                    <div className="relative mt-6 rounded-2xl bg-surface-2/70 px-4 py-3">
                      <span className="block text-[10px] font-bold text-ink-3">{t('caseStudies.keyMetricLabel')}</span>
                      <span className="block text-xl font-black text-copper-hi">{cs.keyMetric}</span>
                    </div>

                    <h3 className="relative mt-5 text-lg font-black leading-7 text-ink transition-colors group-hover:text-copper-hi">
                      {cs.title}
                    </h3>
                    <p className="relative mt-1 text-xs leading-6 text-ink-3">{cs.subtitle}</p>
                    <p className="relative mt-4 line-clamp-3 flex-1 text-sm leading-7 text-ink-2">{cs.problem}</p>

                    <span className="relative mt-5 inline-flex items-center gap-2 text-sm font-bold text-copper-hi">
                      {t('caseStudies.viewCaseBtn')}
                      <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1 ltr:rotate-180 ltr:group-hover:translate-x-1" />
                    </span>
                  </div>
                </motion.button>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </Container>

      <Modal open={!!openCase} onClose={() => setOpenCase(null)} size="lg">
        {shown && (
          <div className="p-6 sm:p-9 space-y-7">
            <div className="flex items-start gap-4 pe-12">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#D9894A] to-[#7A3E14] text-white shadow-lg">
                <OpenIcon className="w-7 h-7" />
              </span>
              <div className="space-y-1">
                <span className="text-xs font-bold text-copper-hi">
                  {shown.volumeRef} • {shown.categoryLabel}
                </span>
                <h3 className="text-2xl font-black leading-9">{shown.title}</h3>
                <p className="text-sm text-ink-2">{shown.subtitle}</p>
              </div>
            </div>

            <div className="flex items-center justify-between gap-4 rounded-2xl border border-copper/30 bg-copper/10 px-5 py-4">
              <span className="flex items-center gap-2 text-xs font-bold text-ink-2">
                <TrendingUp className="w-4 h-4 text-copper-hi" />
                {t('caseStudies.keyMetricLabel')}
              </span>
              <span className="text-xl sm:text-2xl font-black text-copper-hi">{shown.keyMetric}</span>
            </div>

            {/* Timeline: problem → lever → result */}
            <ol className="relative space-y-6 ps-10">
              <span className="absolute top-2 bottom-2 start-[15px] w-0.5 bg-gradient-to-b from-red-500 via-[#D9894A] to-emerald-500" aria-hidden="true" />
              {[
                { title: t('caseStudies.modalProblemTitle'), text: shown.problem, dot: 'bg-red-500', tone: 'text-red-500', icon: TrendingDown },
                { title: t('caseStudies.modalLeverTitle'), text: shown.leverIntervention, dot: 'bg-[#D9894A]', tone: 'text-copper-hi', icon: Target },
                { title: t('caseStudies.modalResultTitle'), text: shown.results, dot: 'bg-emerald-500', tone: 'text-emerald-500', icon: TrendingUp },
              ].map(({ title, text, dot, tone, icon: StepIcon }, i) => (
                <motion.li
                  key={title}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + i * 0.12 }}
                  className="relative space-y-1.5"
                >
                  <span className={`absolute -start-10 top-0 flex h-8 w-8 items-center justify-center rounded-full ${dot} text-white ring-4 ring-surface`}>
                    <StepIcon className="w-4 h-4" />
                  </span>
                  <h4 className={`text-sm font-black ${tone}`}>{title}</h4>
                  <p className="text-sm leading-7 text-ink-2">{text}</p>
                </motion.li>
              ))}
            </ol>

            <blockquote className="relative overflow-hidden rounded-3xl bg-[#0A0A0B] p-6 sm:p-7 text-[#FAF7F2]">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_0%_0%,rgba(184,115,51,0.35),transparent_60%)]" />
              <Quote className="relative mb-3 w-7 h-7 text-[#D9894A]" />
              <p className="relative text-base sm:text-lg font-bold leading-8">{shown.quote}</p>
            </blockquote>

            <div className="flex justify-end">
              <Button variant="secondary" onClick={() => setOpenCase(null)}>
                {t('caseStudies.closeModalBtn')}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};
