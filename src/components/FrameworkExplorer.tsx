import React, { useEffect, useState } from 'react';
import { AlertTriangle, ArrowLeft, CheckCircle2, Compass, Eye, Lightbulb, ShieldCheck, Target, Zap } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'motion/react';
import { ThemeMode } from '../types';
import { Button, Container, PageHeader, Reveal } from './ui/kit';
import { useLocaleFormat } from './ui/format';

interface FrameworkExplorerProps {
  theme?: ThemeMode;
}

interface Step {
  stepNumber: number;
  title: string;
  subtitle: string;
  description: string;
  orangutanDiff: string;
  plus3Diff: string;
  tag: string;
}

const ICONS = [Eye, Target, ShieldCheck, Zap];

/** Concentric ripples for the "positive aftershock" step. */
const Ripples: React.FC = () => (
  <div className="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden="true">
    {[0, 1, 2].map((i) => (
      <motion.span
        key={i}
        className="absolute h-24 w-24 rounded-full border border-copper/60"
        initial={{ scale: 0.6, opacity: 0.8 }}
        animate={{ scale: 2.6, opacity: 0 }}
        transition={{ duration: 3, repeat: Infinity, delay: i, ease: 'easeOut' }}
      />
    ))}
  </div>
);

export const FrameworkExplorer: React.FC<FrameworkExplorerProps> = () => {
  const { t } = useTranslation();
  const { num, isRtl } = useLocaleFormat();
  const raw = t('framework.steps', { returnObjects: true });
  const steps = (Array.isArray(raw) ? raw : []) as Step[];
  const [active, setActive] = useState(0);
  const step = steps[active] || ({} as Step);
  const Icon = ICONS[active] || Eye;
  const isAftershock = step.stepNumber > 3;

  // Arrow keys move through the model (respecting reading direction).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.tagName === 'INPUT') return;
      const next = isRtl ? 'ArrowLeft' : 'ArrowRight';
      const prev = isRtl ? 'ArrowRight' : 'ArrowLeft';
      if (e.key === next) setActive((i) => Math.min(steps.length - 1, i + 1));
      if (e.key === prev) setActive((i) => Math.max(0, i - 1));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isRtl, steps.length]);

  const stepLabel = (s: Step) => (s.stepNumber <= 3 ? `+${num(1)}` : t('framework.aftershockLabel'));

  return (
    <>
      <PageHeader icon={Compass} kicker={t('framework.badge')} title={t('framework.title')} subtitle={t('framework.subtitle')}>
        {/* The equation */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-2xl sm:text-4xl font-black">
          {[0, 1, 2].map((i) => (
            <React.Fragment key={i}>
              <button
                onClick={() => setActive(i)}
                className={`rounded-2xl px-3 sm:px-4 py-1.5 transition-all ${
                  active === i ? 'bg-copper/15 text-copper-hi ring-1 ring-copper/40 scale-110' : 'text-ink-3 hover:text-ink-2'
                }`}
                aria-label={steps[i]?.title}
              >
                <bdi dir="ltr">+{num(1)}</bdi>
              </button>
              {i < 2 && <span className="text-ink-3">+</span>}
            </React.Fragment>
          ))}
          <span className="text-ink-3">=</span>
          <bdi dir="ltr" className="og-copper-text">+{num(3)}</bdi>
        </div>
      </PageHeader>

      <Container className="py-14 sm:py-20 space-y-10">
        {/* Stepper */}
        <div className="relative">
          <div className="absolute top-7 inset-x-[12.5%] h-0.5 bg-line hidden sm:block" aria-hidden="true" />
          <motion.div
            aria-hidden="true"
            className="absolute top-7 start-[12.5%] h-0.5 bg-gradient-to-r from-[#D9894A] to-[#FFD3A1] rtl:bg-gradient-to-l hidden sm:block"
            animate={{ width: `${(active / Math.max(1, steps.length - 1)) * 75}%` }}
            transition={{ type: 'spring', stiffness: 120, damping: 20 }}
          />
          <ol className="relative grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {steps.map((s, i) => {
              const StepIcon = ICONS[i] || Eye;
              const isActive = i === active;
              const done = i < active;
              return (
                <li key={s.stepNumber ?? i}>
                  <button
                    onClick={() => setActive(i)}
                    aria-current={isActive ? 'step' : undefined}
                    className={`group flex w-full flex-col items-center gap-3 rounded-3xl border p-4 text-center transition-all sm:border-transparent sm:bg-transparent ${
                      isActive ? 'border-copper/50 bg-copper/10' : 'border-line bg-surface'
                    }`}
                  >
                    <span
                      className={`relative flex h-14 w-14 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                        isActive
                          ? 'border-copper bg-gradient-to-br from-[#D9894A] to-[#7A3E14] text-white shadow-[0_0_30px_-4px_rgba(217,137,74,0.8)] scale-110'
                          : done
                            ? 'border-copper/60 bg-surface text-copper-hi'
                            : 'border-line-strong bg-surface text-ink-3 group-hover:border-copper/50 group-hover:text-copper-hi'
                      }`}
                    >
                      <StepIcon className="w-6 h-6" />
                    </span>
                    <span className={`text-[11px] font-black ${isActive ? 'text-copper-hi' : 'text-ink-3'}`} dir="ltr">
                      {stepLabel(s)}
                    </span>
                    <span className={`text-sm font-bold leading-6 ${isActive ? 'text-ink' : 'text-ink-2'}`}>{s.title}</span>
                  </button>
                </li>
              );
            })}
          </ol>
        </div>

        {/* Detail */}
        <AnimatePresence mode="wait">
          <motion.article
            key={active}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="grid gap-6 lg:grid-cols-12"
          >
            {/* Emblem */}
            <div className="relative lg:col-span-4 overflow-hidden rounded-[2rem] border border-line bg-[#0A0A0B] p-8 text-[#FAF7F2] flex flex-col items-center justify-center text-center min-h-[300px]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(184,115,51,0.35),transparent_65%)]" />
              {isAftershock && <Ripples />}
              <div className="relative">
                <span className="block text-[7rem] leading-none font-black og-copper-text" dir="ltr">
                  {step.stepNumber <= 3 ? num(step.stepNumber) : '+'}
                </span>
                <span className="mt-2 flex items-center justify-center gap-2 text-xs font-black tracking-wider text-[#E8A672]">
                  <Icon className="w-4 h-4" />
                  {step.tag}
                </span>
              </div>
            </div>

            <div className="lg:col-span-8 space-y-6 rounded-[2rem] border border-line bg-surface p-6 sm:p-8">
              <div className="space-y-2">
                <h2 className="text-2xl sm:text-3xl font-black text-ink">{step.title}</h2>
                <p className="text-sm font-bold text-copper-hi">{step.subtitle}</p>
              </div>
              <p className="text-sm sm:text-base leading-8 text-ink-2">{step.description}</p>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="relative overflow-hidden rounded-2xl border border-red-500/25 bg-red-500/[0.06] p-5 space-y-2.5">
                  <span className="flex items-center gap-2 text-sm font-black text-red-500">
                    <AlertTriangle className="w-4 h-4" />
                    {t('framework.orangutanTitle')}
                  </span>
                  <p className="text-sm leading-7 text-ink-2">{step.orangutanDiff}</p>
                </div>
                <div className="relative overflow-hidden rounded-2xl border border-emerald-500/25 bg-emerald-500/[0.06] p-5 space-y-2.5">
                  <span className="flex items-center gap-2 text-sm font-black text-emerald-500">
                    <CheckCircle2 className="w-4 h-4" />
                    {t('framework.plus3Title')}
                  </span>
                  <p className="text-sm leading-7 text-ink-2">{step.plus3Diff}</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-line pt-5">
                <p className="flex items-start gap-2 text-xs leading-6 text-ink-3">
                  <Lightbulb className="mt-0.5 w-4 h-4 shrink-0 text-amber-500" />
                  <span>
                    <strong className="text-ink-2">{t('framework.bottomLabel')}</strong> {t('framework.bottomText')}
                  </span>
                </p>
                {active < steps.length - 1 && (
                  <Button variant="secondary" size="sm" onClick={() => setActive(active + 1)} className="shrink-0">
                    {steps[active + 1]?.title}
                    <ArrowLeft className="w-4 h-4 ltr:rotate-180" />
                  </Button>
                )}
              </div>
            </div>
          </motion.article>
        </AnimatePresence>

        <Reveal>
          <p className="text-center text-xs text-ink-3">{t('ui.framework.keyboardHint')}</p>
        </Reveal>
      </Container>
    </>
  );
};
