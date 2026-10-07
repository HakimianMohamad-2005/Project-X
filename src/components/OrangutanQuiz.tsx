import React, { useState } from 'react';
import { ArrowLeft, Award, BookOpen, Check, HelpCircle, Lightbulb, RefreshCw, Sparkles, Zap } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { ThemeMode } from '../types';
import { AdvancedAssessmentRunner } from './AdvancedAssessmentRunner';
import { Button, Card, Container, PageHeader, FilterTabs } from './ui/kit';
import { ResultGauge } from './ui/ResultGauge';
import { useLocaleFormat } from './ui/format';

interface OrangutanQuizProps {
  onAddToCart: (bookId: string) => void;
  theme?: ThemeMode;
}

export type QuizMode = 'select' | 'simple' | 'advanced';

interface Question {
  id: number;
  question: string;
  chapterRef: string;
  options: { text: string; feedback: string }[];
}

const LETTERS = ['A', 'B', 'C', 'D'];

export const OrangutanQuiz: React.FC<OrangutanQuizProps> = ({ onAddToCart, theme = 'dark' }) => {
  const { t } = useTranslation();
  const { num, pct, isRtl } = useLocaleFormat();
  const [mode, setMode] = useState<QuizMode>('select');

  const raw = t('quiz.questions', { returnObjects: true });
  const questions = (Array.isArray(raw) ? raw : []) as Question[];
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>(() => Array(questions.length || 5).fill(-1));
  const [showResults, setShowResults] = useState(false);

  const question: Question = questions[index] || { id: 0, question: '', chapterRef: '', options: [] };
  const selected = answers[index];
  const isLast = index === questions.length - 1;

  const choose = (optionIndex: number) => setAnswers((a) => a.map((v, i) => (i === index ? optionIndex : v)));

  const next = () => {
    if (!isLast) {
      setIndex(index + 1);
      return;
    }
    setShowResults(true);
    confetti({ particleCount: 90, spread: 75, origin: { y: 0.6 }, colors: ['#D9894A', '#FFD3A1', '#10B981'] });
  };

  const reset = () => {
    setAnswers(Array(questions.length || 5).fill(-1));
    setIndex(0);
    setShowResults(false);
  };

  // Options run from instinctive (0 points) to systemic (10 points).
  const systemScore = Math.round((answers.reduce((acc, a) => acc + (a > -1 ? a * 5 : 0), 0) / 50) * 100);
  const tierKey = systemScore <= 30 ? 't1' : systemScore <= 60 ? 't2' : systemScore <= 80 ? 't3' : 't4';
  const tierTone = {
    t1: 'border-red-500/40 bg-red-500/10 text-red-500',
    t2: 'border-amber-500/40 bg-amber-500/10 text-amber-500',
    t3: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-500',
    t4: 'border-teal-500/40 bg-teal-500/10 text-teal-500',
  }[tierKey];

  const modeTabs = [
    { value: 'simple' as QuizMode, label: t('quiz.simpleQuizTitle'), icon: Zap },
    { value: 'advanced' as QuizMode, label: t('quiz.advancedQuizTitle'), icon: Sparkles },
  ];

  return (
    <>
      <PageHeader icon={HelpCircle} kicker={t('quiz.badge')} title={t('quiz.title')} subtitle={t('quiz.subtitle')} />

      <Container className="py-10 sm:py-14">
        <div className="mx-auto max-w-4xl space-y-6">
          {mode !== 'select' && (
            <FilterTabs<QuizMode>
              options={modeTabs}
              value={mode}
              onChange={(m) => {
                setMode(m);
                setShowResults(false);
              }}
            />
          )}

          <AnimatePresence mode="wait">
            {/* 1. Mode selection */}
            {mode === 'select' && (
              <motion.div
                key="select"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                className="space-y-6"
              >
                <div className="text-center space-y-2">
                  <h2 className="text-xl sm:text-2xl font-black text-ink">{t('quiz.modeSelectorTitle')}</h2>
                  <p className="text-sm text-ink-2">{t('quiz.modeSelectorSubtitle')}</p>
                </div>
                <div className="grid gap-5 md:grid-cols-2">
                  <button
                    onClick={() => setMode('simple')}
                    className="group flex flex-col gap-5 rounded-[2rem] border border-line bg-surface p-7 text-start transition-all hover:-translate-y-1 hover:border-copper/50 hover:og-shadow"
                  >
                    <div className="flex items-center justify-between">
                      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-copper/12 text-copper-hi border border-copper/25">
                        <Zap className="w-7 h-7" />
                      </span>
                      <span className="rounded-full border border-line px-3 py-1 text-[11px] font-bold text-ink-3">{t('quiz.simpleQuizBadge')}</span>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-black text-ink">{t('quiz.simpleQuizTitle')}</h3>
                      <p className="text-sm leading-7 text-ink-2">{t('quiz.simpleQuizDesc')}</p>
                    </div>
                    <span className="mt-auto inline-flex items-center gap-2 text-sm font-bold text-copper-hi">
                      {t('quiz.startSimpleBtn')}
                      <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1 ltr:rotate-180 ltr:group-hover:translate-x-1" />
                    </span>
                  </button>

                  <button
                    onClick={() => setMode('advanced')}
                    className="group relative flex flex-col gap-5 overflow-hidden rounded-[2rem] border border-copper/45 bg-[#0A0A0B] p-7 text-start text-[#FAF7F2] transition-all hover:-translate-y-1 shadow-[0_30px_60px_-30px_rgba(217,137,74,0.6)]"
                  >
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_100%_0%,rgba(184,115,51,0.35),transparent_60%)]" />
                    <div className="relative flex items-center justify-between">
                      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#D9894A] to-[#7A3E14] text-white shadow-lg">
                        <Sparkles className="w-7 h-7" />
                      </span>
                      <span className="rounded-full bg-[#D9894A]/20 px-3 py-1 text-[11px] font-black text-[#E8A672]">{t('quiz.advancedQuizBadge')}</span>
                    </div>
                    <div className="relative space-y-2">
                      <h3 className="text-xl font-black">{t('quiz.advancedQuizTitle')}</h3>
                      <p className="text-sm leading-7 text-stone-400">{t('quiz.advancedQuizDesc')}</p>
                    </div>
                    <span className="relative mt-auto inline-flex items-center gap-2 text-sm font-bold text-[#E8A672]">
                      {t('quiz.startAdvancedBtn')}
                      <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1 ltr:rotate-180 ltr:group-hover:translate-x-1" />
                    </span>
                  </button>
                </div>
              </motion.div>
            )}

            {/* 2. Advanced assessment */}
            {mode === 'advanced' && (
              <motion.div key="advanced" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
                <Card className="p-5 sm:p-8">
                  <AdvancedAssessmentRunner onAddToCart={onAddToCart} onBackToModeSelect={() => setMode('select')} theme={theme} />
                </Card>
              </motion.div>
            )}

            {/* 3. Simple quiz */}
            {mode === 'simple' && !showResults && (
              <motion.div key="simple" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
                <Card className="p-5 sm:p-8 space-y-7">
                  {/* Segmented progress */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-copper-hi">
                        {t('quiz.progressText', { num: num(index + 1), total: num(questions.length) })}
                      </span>
                      <span className="text-ink-3">{t('quiz.simpleBadgeLabel')}</span>
                    </div>
                    <div className="grid gap-1.5" style={{ gridTemplateColumns: `repeat(${questions.length || 1}, minmax(0, 1fr))` }}>
                      {questions.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => (answers[i] > -1 || i <= index ? setIndex(i) : undefined)}
                          aria-label={t('quiz.progressText', { num: num(i + 1), total: num(questions.length) })}
                          className={`h-1.5 rounded-full transition-colors ${
                            i === index ? 'bg-copper' : answers[i] > -1 ? 'bg-copper/50' : 'bg-line-strong'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: isRtl ? -30 : 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: isRtl ? 30 : -30 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6"
                    >
                      <div className="space-y-3">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-2 px-3 py-1 text-[11px] font-bold text-ink-3">
                          <BookOpen className="w-3.5 h-3.5" />
                          {t('quiz.chapterRefPrefix')} {question.chapterRef}
                        </span>
                        <h2 className="text-xl sm:text-2xl font-black leading-[1.7] text-ink">{question.question}</h2>
                      </div>

                      <div className="space-y-3" role="radiogroup">
                        {question.options.map((opt, i) => {
                          const isSel = selected === i;
                          return (
                            <div key={i}>
                              <button
                                role="radio"
                                aria-checked={isSel}
                                onClick={() => choose(i)}
                                className={`flex w-full items-start gap-4 rounded-2xl border p-4 sm:p-5 text-start transition-all ${
                                  isSel
                                    ? 'border-copper bg-copper/10 shadow-[0_10px_30px_-18px_rgba(217,137,74,0.9)]'
                                    : 'border-line bg-surface-2/50 hover:border-copper/40 hover:bg-surface-2'
                                }`}
                              >
                                <span
                                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-black transition-colors ${
                                    isSel ? 'bg-copper text-white' : 'bg-surface text-ink-3 border border-line'
                                  }`}
                                >
                                  {isSel ? <Check className="w-4 h-4" /> : LETTERS[i]}
                                </span>
                                <span className={`text-sm sm:text-base leading-7 ${isSel ? 'font-bold text-ink' : 'text-ink-2'}`}>{opt.text}</span>
                              </button>
                              <AnimatePresence>
                                {isSel && opt.feedback && (
                                  <motion.p
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="overflow-hidden"
                                  >
                                    <span className="mt-2 flex items-start gap-2 rounded-xl bg-surface-2/70 px-4 py-3 text-xs leading-6 text-ink-2">
                                      <Lightbulb className="mt-0.5 w-4 h-4 shrink-0 text-amber-500" />
                                      {opt.feedback}
                                    </span>
                                  </motion.p>
                                )}
                              </AnimatePresence>
                            </div>
                          );
                        })}
                      </div>
                    </motion.div>
                  </AnimatePresence>

                  <div className="flex items-center justify-between border-t border-line pt-5">
                    <Button variant="ghost" onClick={() => setIndex(Math.max(0, index - 1))} disabled={index === 0}>
                      {t('quiz.prevBtn')}
                    </Button>
                    <Button onClick={next} disabled={selected === -1}>
                      {isLast ? t('quiz.viewResultsBtn') : t('quiz.nextBtn')}
                      <ArrowLeft className="w-4 h-4 ltr:rotate-180" />
                    </Button>
                  </div>
                </Card>
              </motion.div>
            )}

            {/* 4. Simple quiz results */}
            {mode === 'simple' && showResults && (
              <motion.div key="results" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="space-y-5">
                <Card className="p-6 sm:p-10 text-center space-y-6">
                  <ResultGauge
                    value={systemScore}
                    instinctLabel={t('story.gauge.instinct')}
                    systemLabel={t('story.gauge.system')}
                    centerLabel={t('ui.quiz.systemScore')}
                  />
                  <h2 className="text-xl sm:text-2xl font-black text-ink">
                    {t('quiz.resultScoreTitle', { percentage: num(systemScore) })}
                  </h2>
                  <span className={`inline-flex rounded-2xl border px-5 py-2.5 text-sm font-black ${tierTone}`}>
                    {t(`quiz.tiers.${tierKey}.title`)}
                  </span>
                </Card>

                <div className="grid gap-5 md:grid-cols-2">
                  <Card className="p-6 space-y-3">
                    <h3 className="text-sm font-black text-ink">{t('quiz.resultAnalysisTitle')}</h3>
                    <p className="text-sm leading-8 text-ink-2">{t(`quiz.tiers.${tierKey}.description`)}</p>
                  </Card>
                  <div className="rounded-3xl border border-copper/35 bg-copper/[0.08] p-6 space-y-3">
                    <h3 className="flex items-center gap-2 text-sm font-black text-copper-hi">
                      <BookOpen className="w-4 h-4" />
                      {t('quiz.resultSolutionTitle')}
                    </h3>
                    <p className="text-sm leading-8 text-ink-2">{t(`quiz.tiers.${tierKey}.recommendation`)}</p>
                  </div>
                </div>

                <div className="relative overflow-hidden rounded-3xl bg-[#0A0A0B] p-6 sm:p-7 text-[#FAF7F2]">
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_0%_50%,rgba(184,115,51,0.35),transparent_60%)]" />
                  <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <span className="flex items-center gap-2 text-sm font-black text-[#E8A672]">
                        <Sparkles className="w-4 h-4" />
                        {t('quiz.promoAdvancedTitle')}
                      </span>
                      <p className="text-xs leading-6 text-stone-400">{t('quiz.promoAdvancedDesc')}</p>
                    </div>
                    <Button onClick={() => setMode('advanced')} className="shrink-0">
                      {t('quiz.promoAdvancedBtn')}
                    </Button>
                  </div>
                </div>

                <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  <Button variant="secondary" onClick={reset}>
                    <RefreshCw className="w-4 h-4" />
                    {t('quiz.retakeBtn')}
                  </Button>
                  <Button size="lg" onClick={() => onAddToCart('bundle-full')}>
                    <Award className="w-5 h-5" />
                    {t('quiz.orderBundleBtn')}
                  </Button>
                </div>
                <p className="text-center text-[11px] text-ink-3">{t('ui.quiz.scoreNote', { pct: pct(systemScore) })}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Container>
    </>
  );
};
