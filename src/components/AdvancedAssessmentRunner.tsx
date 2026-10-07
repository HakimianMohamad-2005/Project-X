import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { AssessmentOption } from '../data/managerAssessment';
import { getLocalizedQuestions } from '../data/assessmentQuestionsI18n';
import {
  getIntakeFormOptions,
  getIntakeFormLabels,
  getAssessmentUILabels,
  getLocalizedDimensionMetas
} from '../data/assessmentMetadataI18n';
import {
  AssessmentRespondentProfile,
  AdvancedAssessmentResult,
  evaluateAdvancedAssessment,
  saveAssessmentDraft,
  loadAssessmentDraft,
  clearAssessmentDraft,
  saveAssessmentResultToHistory,
  getLatestAssessmentResult
} from '../lib/managerAssessment';
import { RadarDimensionChart } from './RadarDimensionChart';
import { toPersianDigits } from '../utils/persian';
import { ThemeMode } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import {
  Building2,
  Users,
  Briefcase,
  Layers,
  Award,
  BookOpen,
  RefreshCw,
  Printer,
  ChevronRight,
  ChevronLeft,
  Flame,
  ShieldCheck,
  CheckCircle2,
  History,
  User,
  Phone
} from 'lucide-react';
import { saveAssessmentToApi } from '../lib/api';
import { Button, Field, inputClass } from './ui/kit';
import { ResultGauge } from './ui/ResultGauge';

interface AdvancedAssessmentRunnerProps {
  onAddToCart: (bookId: string) => void;
  onBackToModeSelect: () => void;
  theme?: ThemeMode;
}

export const AdvancedAssessmentRunner: React.FC<AdvancedAssessmentRunnerProps> = ({
  onAddToCart,
  onBackToModeSelect,
  theme = 'light'
}) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language || 'fa';
  const isPersian = lang === 'fa';
  const isArabic = lang === 'ar';
  const isRTL = isPersian || isArabic;
  const isLight = theme === 'light';

  // Localized metadata and questions
  const formLabels = useMemo(() => getIntakeFormLabels(lang), [lang]);
  const formOptions = useMemo(() => getIntakeFormOptions(lang), [lang]);
  const uiLabels = useMemo(() => getAssessmentUILabels(lang), [lang]);
  const dimensionMetas = useMemo(() => getLocalizedDimensionMetas(lang), [lang]);
  const questions = useMemo(() => getLocalizedQuestions(lang), [lang]);

  // Step management: 'profile' | 'quiz' | 'result'
  const [step, setStep] = useState<'profile' | 'quiz' | 'result'>('profile');

  // Intake Form Profile State with Pre-Loaded sensible defaults
  const [profile, setProfile] = useState<AssessmentRespondentProfile>(() => {
    return {
      fullName: formLabels.defaultFullName || 'مدیر ارشد سازمان',
      phone: '',
      role: formOptions.roles[0]?.value || '',
      industry: formOptions.industries[0]?.value || '',
      headcount: formOptions.headcounts[2]?.value || formOptions.headcounts[0]?.value || '',
      experience: formOptions.experiences[2]?.value || formOptions.experiences[0]?.value || '',
      scope: formOptions.scopes[0]?.value || '',
      createdAt: ''
    };
  });

  // Track database assessment record ID for updating results upon quiz completion
  const [assessmentRecordId, setAssessmentRecordId] = useState<number | null>(null);

  // Pre-load default values when language or form options change (if fields are unselected)
  useEffect(() => {
    setProfile((prev) => {
      return {
        ...prev,
        fullName: prev.fullName?.trim() ? prev.fullName : (formLabels.defaultFullName || 'مدیر ارشد سازمان'),
        role: prev.role?.trim() ? prev.role : (formOptions.roles[0]?.value || ''),
        industry: prev.industry?.trim() ? prev.industry : (formOptions.industries[0]?.value || ''),
        headcount: prev.headcount?.trim() ? prev.headcount : (formOptions.headcounts[2]?.value || formOptions.headcounts[0]?.value || ''),
        experience: prev.experience?.trim() ? prev.experience : (formOptions.experiences[2]?.value || formOptions.experiences[0]?.value || ''),
        scope: prev.scope?.trim() ? prev.scope : (formOptions.scopes[0]?.value || '')
      };
    });
  }, [formLabels, formOptions]);

  // Current Question Index in 24 questions (0..23)
  const [currentIdx, setCurrentIdx] = useState<number>(0);

  // Answers Map: { [qId: number]: { optionId: string; score: number } }
  const [answers, setAnswers] = useState<Record<number, { optionId: string; score: number }>>({});

  // Randomized options per question (generated once per session so order doesn't jump on prev/next)
  const [shuffledOptionsMap, setShuffledOptionsMap] = useState<Record<number, AssessmentOption[]>>({});

  // Result object after completion
  const [result, setResult] = useState<AdvancedAssessmentResult | null>(null);

  // Re-evaluate result if language changes while viewing results
  useEffect(() => {
    if (result && step === 'result') {
      const updated = evaluateAdvancedAssessment(result.profile, result.answers, lang);
      setResult(updated);
    }
  }, [lang]);

  // Comparison toggle & previous result from history
  const [previousResult, setPreviousResult] = useState<AdvancedAssessmentResult | null>(null);
  const [showComparison, setShowComparison] = useState(false);

  // Initialize and load any saved draft or past history
  useEffect(() => {
    const prev = getLatestAssessmentResult();
    if (prev) {
      setPreviousResult(prev);
    }

    const draft = loadAssessmentDraft();
    if (draft && draft.step) {
      if (draft.profile) {
        setProfile((prev) => ({
          ...prev,
          ...draft.profile,
          fullName: (draft.profile.fullName && draft.profile.fullName.trim()) ? draft.profile.fullName : prev.fullName
        }));
      }
      if (draft.answers) setAnswers(draft.answers);
      if (typeof draft.currentIdx === 'number') setCurrentIdx(draft.currentIdx);
      if (draft.shuffledOptionsMap) setShuffledOptionsMap(draft.shuffledOptionsMap);
      if (typeof draft.assessmentRecordId === 'number') setAssessmentRecordId(draft.assessmentRecordId);
      if (draft.step === 'quiz') setStep('quiz');
    }
  }, []);

  // Initialize shuffled options if not set
  useEffect(() => {
    if (Object.keys(shuffledOptionsMap).length === 0 && questions.length > 0) {
      const map: Record<number, AssessmentOption[]> = {};
      questions.forEach((q) => {
        const opts = [...q.options];
        for (let i = opts.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [opts[i], opts[j]] = [opts[j], opts[i]];
        }
        map[q.id] = opts;
      });
      setShuffledOptionsMap(map);
    }
  }, [shuffledOptionsMap, questions]);

  // Autosave draft on change
  useEffect(() => {
    if (step === 'quiz') {
      saveAssessmentDraft({
        step: 'quiz',
        profile,
        answers,
        currentIdx,
        shuffledOptionsMap,
        assessmentRecordId
      });
    }
  }, [step, profile, answers, currentIdx, shuffledOptionsMap, assessmentRecordId]);

  // Form validation for Profile Step (fullName is required; phone is optional; select fields are pre-loaded)
  const isProfileValid = useMemo(() => {
    return (
      (profile.fullName || '').trim() !== '' &&
      (profile.role || '').trim() !== '' &&
      (profile.industry || '').trim() !== '' &&
      (profile.headcount || '').trim() !== '' &&
      (profile.experience || '').trim() !== '' &&
      (profile.scope || '').trim() !== ''
    );
  }, [profile]);

  const handleStartQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isProfileValid) return;
    const nowIso = new Date().toISOString();
    const updatedProfile = { ...profile, createdAt: nowIso };
    setProfile(updatedProfile);
    setStep('quiz');

    // Save lead/assessment immediately to MySQL database (status: started)
    try {
      const resp = await saveAssessmentToApi({
        profile: updatedProfile,
        status: 'started'
      });
      if (resp && resp.success && resp.id) {
        setAssessmentRecordId(resp.id);
      }
    } catch (err) {
      console.warn('Initial assessment save warning:', err);
    }
  };

  const handleSelectOption = (questionId: number, option: AssessmentOption) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: {
        optionId: option.id,
        score: option.score
      }
    }));
  };

  const handleNextQuestion = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      // Calculate final results with current active language
      const res = evaluateAdvancedAssessment(profile, answers, lang);
      setResult(res);
      saveAssessmentResultToHistory(res);
      clearAssessmentDraft();
      setStep('result');

      // Save/update final assessment report in MySQL database (status: completed)
      saveAssessmentToApi({
        profile,
        result: res,
        assessmentId: assessmentRecordId,
        status: 'completed'
      }).catch((err) => {
        console.warn('Final assessment save error:', err);
      });

      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 }
      });
    }
  };

  const handlePrevQuestion = () => {
    if (currentIdx > 0) {
      setCurrentIdx(currentIdx - 1);
    }
  };

  const handleRetake = () => {
    clearAssessmentDraft();
    setAnswers({});
    setCurrentIdx(0);
    setResult(null);
    setShowComparison(false);
    setAssessmentRecordId(null);
    setStep('profile');
  };

  const handlePrint = () => {
    window.print();
  };

  const formatNumber = (n: number | string) => {
    if (isPersian || isArabic) return toPersianDigits(n);
    return `${n}`;
  };

  const formatPct = (pct: number) => {
    if (isPersian) return `%${toPersianDigits(pct)}`;
    if (isArabic) return `٪${toPersianDigits(pct)}`;
    return `${pct}%`;
  };

  const currentQ = questions[currentIdx] || questions[0];
  const currentOptions = useMemo(() => {
    const rawSaved = shuffledOptionsMap[currentQ.id];
    if (!rawSaved || rawSaved.length === 0) return currentQ.options;
    // Map order by id to guarantee active language texts are always rendered
    return rawSaved.map((item) => {
      const localizedMatch = currentQ.options.find((o) => o.id === item.id);
      return localizedMatch || item;
    });
  }, [shuffledOptionsMap, currentQ]);
  const currentSelected = answers[currentQ.id];
  const currentDimMeta = dimensionMetas[currentQ.dimension];

  const NextIcon = isRTL ? ChevronLeft : ChevronRight;
  const PrevIcon = isRTL ? ChevronRight : ChevronLeft;

  const selectFields: {
    key: keyof AssessmentRespondentProfile;
    label: string;
    placeholder: string;
    icon: React.ComponentType<{ className?: string }>;
    options: { value: string; label: string }[];
  }[] = [
    { key: 'role', label: formLabels.roleLabel, placeholder: formLabels.rolePlaceholder, icon: Briefcase, options: formOptions.roles },
    { key: 'industry', label: formLabels.industryLabel, placeholder: formLabels.industryPlaceholder, icon: Building2, options: formOptions.industries },
    { key: 'headcount', label: formLabels.headcountLabel, placeholder: formLabels.headcountPlaceholder, icon: Users, options: formOptions.headcounts },
    { key: 'experience', label: formLabels.experienceLabel, placeholder: formLabels.experiencePlaceholder, icon: Award, options: formOptions.experiences },
    { key: 'scope', label: formLabels.scopeLabel, placeholder: formLabels.scopePlaceholder, icon: Layers, options: formOptions.scopes },
  ];

  const progressPct = Math.round(((currentIdx + 1) / questions.length) * 100);
  const consistencyTone =
    result?.consistency.level === 'high'
      ? 'border-teal-500/40 bg-teal-500/10 text-teal-500'
      : result?.consistency.level === 'medium'
        ? 'border-amber-500/40 bg-amber-500/10 text-amber-500'
        : 'border-red-500/40 bg-red-500/10 text-red-500';

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} className="space-y-6">
      {/* STEP 1: intake form */}
      {step === 'profile' && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="flex items-start justify-between gap-4 border-b border-line pb-5">
            <div className="space-y-1">
              <h3 className="text-xl font-black text-ink">{formLabels.title}</h3>
              <p className="text-sm leading-7 text-ink-2">{formLabels.subtitle}</p>
            </div>
            <Button variant="secondary" size="sm" onClick={onBackToModeSelect} className="shrink-0">
              {formLabels.backBtn}
            </Button>
          </div>

          <form onSubmit={handleStartQuiz} className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label={formLabels.fullNameLabel} icon={User} required>
                <input
                  required
                  value={profile.fullName || ''}
                  onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                  placeholder={formLabels.fullNamePlaceholder}
                  className={inputClass}
                />
              </Field>
              <Field label={formLabels.phoneLabel} icon={Phone} hint={formLabels.phoneOptionalBadge}>
                <input
                  type="tel"
                  dir="ltr"
                  value={profile.phone || ''}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  placeholder={formLabels.phonePlaceholder}
                  className={`${inputClass} text-start`}
                />
              </Field>
              {selectFields.map(({ key, label, placeholder, icon, options }, i) => (
                <Field key={key} label={label} icon={icon} required className={i === selectFields.length - 1 ? 'sm:col-span-2' : ''}>
                  <select
                    required
                    value={(profile[key] as string) || ''}
                    onChange={(e) => setProfile({ ...profile, [key]: e.target.value })}
                    className={inputClass}
                  >
                    <option value="">{placeholder}</option>
                    {options.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </Field>
              ))}
            </div>
            <div className="flex justify-end pt-2">
              <Button type="submit" size="lg" disabled={!isProfileValid}>
                {formLabels.submitBtn}
                <NextIcon className="w-5 h-5" />
              </Button>
            </div>
          </form>
        </motion.div>
      )}

      {/* STEP 2: 24 scenarios */}
      {step === 'quiz' && (
        <div className="space-y-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-copper/12 px-3 py-1 text-xs font-black text-copper-hi">
                  {uiLabels.questionCount(formatNumber(currentIdx + 1), formatNumber(questions.length))}
                </span>
                <span className="rounded-full bg-surface-2 px-3 py-1 text-xs font-bold text-ink-2">
                  {uiLabels.dimensionLabel(currentDimMeta?.title || '')}
                </span>
              </div>
              <span className="text-xs font-black text-ink-3">{formatPct(progressPct)}</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-line-strong">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-[#D9894A] to-[#FFD3A1] rtl:bg-gradient-to-l"
                animate={{ width: `${progressPct}%` }}
                transition={{ type: 'spring', stiffness: 120, damping: 20 }}
              />
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentQ.id}
              initial={{ opacity: 0, x: isRTL ? -30 : 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: isRTL ? 30 : -30 }}
              transition={{ duration: 0.28 }}
              className="space-y-5"
            >
              <div className="relative overflow-hidden rounded-3xl bg-[#0A0A0B] p-6 text-[#FAF7F2]">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_100%_0%,rgba(184,115,51,0.3),transparent_60%)]" />
                <span className="relative flex items-center gap-2 text-xs font-black text-[#E8A672]">
                  <span className="h-2 w-2 rounded-full bg-[#D9894A]" />
                  {uiLabels.scenarioNumber(formatNumber(currentIdx + 1), currentQ.title)}
                </span>
                <p className="relative mt-3 text-base sm:text-lg font-bold leading-8">{currentQ.scenario}</p>
              </div>

              <div className="space-y-3" role="radiogroup" aria-label={uiLabels.userResponseLabel}>
                <span className="text-xs font-bold text-ink-3">{uiLabels.userResponseLabel}</span>
                {currentOptions.map((opt) => {
                  const isSelected = currentSelected?.optionId === opt.id;
                  return (
                    <button
                      key={`${currentQ.id}-${opt.id}`}
                      role="radio"
                      aria-checked={isSelected}
                      onClick={() => handleSelectOption(currentQ.id, opt)}
                      className={`flex w-full items-start gap-4 rounded-2xl border p-4 text-start transition-all ${
                        isSelected
                          ? 'border-copper bg-copper/10 shadow-[0_10px_30px_-18px_rgba(217,137,74,0.9)]'
                          : 'border-line bg-surface-2/50 hover:border-copper/40 hover:bg-surface-2'
                      }`}
                    >
                      <span
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-black ${
                          isSelected ? 'bg-copper text-white' : 'border border-line bg-surface text-ink-3'
                        }`}
                      >
                        {isSelected ? <CheckCircle2 className="w-4 h-4" /> : opt.id.toUpperCase()}
                      </span>
                      <span className={`text-sm leading-7 ${isSelected ? 'font-bold text-ink' : 'text-ink-2'}`}>{opt.text}</span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center justify-between border-t border-line pt-5">
            <Button variant="ghost" onClick={handlePrevQuestion} disabled={currentIdx === 0}>
              <PrevIcon className="w-4 h-4" />
              {uiLabels.prevBtn}
            </Button>
            <Button onClick={handleNextQuestion} disabled={!currentSelected}>
              {currentIdx === questions.length - 1 ? uiLabels.calcResultsBtn : uiLabels.nextBtn}
              <NextIcon className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* STEP 3: diagnostic report */}
      {step === 'result' && result && (
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.35 }} className="space-y-6">
          <div className="space-y-5 text-center">
            <span className="inline-flex rounded-full bg-copper/12 px-3 py-1 text-xs font-black text-copper-hi">{uiLabels.resultBadge}</span>
            <ResultGauge
              value={100 - result.engagementPercentage}
              instinctLabel={t('story.gauge.instinct')}
              systemLabel={t('story.gauge.system')}
              centerLabel={t('ui.quiz.systemScore')}
            />
            <h3 className="text-xl sm:text-2xl font-black text-ink">{uiLabels.resultTitle(formatPct(result.engagementPercentage))}</h3>
            {result.profile?.fullName && (
              <p className="flex flex-wrap items-center justify-center gap-2 text-xs font-semibold text-ink-3">
                <span className="font-bold text-copper-hi">{result.profile.fullName}</span>
                {result.profile.role && <span>• {result.profile.role}</span>}
                {result.profile.industry && <span>• {result.profile.industry}</span>}
              </p>
            )}
            <div className={`mx-auto max-w-2xl space-y-2 rounded-3xl border p-5 ${result.tier.cardColor}`}>
              <div className="flex flex-wrap items-center justify-center gap-2">
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-black ${result.tier.badgeColor}`}>{result.tier.shortDesc}</span>
                <span className="text-sm sm:text-base font-black">{result.tier.title}</span>
              </div>
              <p className="text-sm leading-7">{result.tier.description}</p>
            </div>
            <div className={`mx-auto inline-flex max-w-xl flex-col items-center gap-1 rounded-2xl border px-4 py-3 text-xs sm:flex-row sm:gap-3 ${consistencyTone}`}>
              <span className="flex items-center gap-1.5 font-black">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                {uiLabels.consistencyTitle} ({formatNumber(result.consistency.score)}) {result.consistency.title}
              </span>
              <span className="text-ink-2">{result.consistency.description}</span>
            </div>
          </div>

          <div className="rounded-3xl border border-line bg-surface-2/50 p-5 sm:p-6 space-y-4">
            <div className="text-center space-y-1">
              <h4 className="text-base font-black text-ink">{uiLabels.radarTitle}</h4>
              <p className="text-xs text-ink-3">{uiLabels.radarDesc}</p>
            </div>
            <RadarDimensionChart dimensions={result.dimensionResults} isLight={isLight} isPersian={isPersian} />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-3xl border border-red-500/30 bg-red-500/[0.06] p-5 space-y-3">
              <h4 className="flex items-center gap-2 text-sm font-black text-red-500">
                <Flame className="w-4 h-4" />
                {uiLabels.hotspotsTitle}
              </h4>
              <ul className="space-y-2.5">
                {result.hotspots.map((item, idx) => (
                  <li key={item.dimension} className="flex items-start justify-between gap-3 rounded-2xl border border-line bg-surface p-3">
                    <div className="space-y-1">
                      <p className="flex items-center gap-2 text-sm font-bold text-ink">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">{formatNumber(idx + 1)}</span>
                        {item.title}
                      </p>
                      <p className="text-xs leading-6 text-ink-3">{item.shortDesc}</p>
                    </div>
                    <span className="shrink-0 rounded-lg bg-red-500/12 px-2 py-0.5 text-xs font-black text-red-500">{formatPct(item.percentage)}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-3xl border border-teal-500/30 bg-teal-500/[0.06] p-5 space-y-3">
              <h4 className="flex items-center gap-2 text-sm font-black text-teal-500">
                <CheckCircle2 className="w-4 h-4" />
                {uiLabels.keyStrengthTitle}
              </h4>
              <div className="space-y-2 rounded-2xl border border-line bg-surface p-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-black text-teal-500">{result.keyStrength.title}</span>
                  <span className="rounded-lg bg-teal-500/12 px-2 py-0.5 text-xs font-black text-teal-500">
                    {uiLabels.keyStrengthBadge(formatPct(result.keyStrength.percentage))}
                  </span>
                </div>
                <p className="text-xs leading-6 text-ink-2">{result.keyStrength.shortDesc}</p>
                <p className="border-t border-line pt-2 text-[11px] font-bold text-teal-500">{uiLabels.keyStrengthFooter}</p>
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-3xl bg-[#0A0A0B] p-6 text-[#FAF7F2] space-y-4">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(184,115,51,0.3),transparent_60%)]" />
            <h4 className="relative flex items-center gap-2 text-base font-black text-[#E8A672]">
              <Award className="w-5 h-5" />
              {uiLabels.actionPlanTitle}
            </h4>
            <ol className="relative grid gap-3 md:grid-cols-3">
              {result.actionPlan.map((stepPlan) => (
                <li key={stepPlan.stepNumber} className="space-y-2.5 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                  <span className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-[#D9894A] to-[#7A3E14] text-xs font-black text-white">
                      {formatNumber(stepPlan.stepNumber)}
                    </span>
                    <span className="text-xs font-bold text-[#E8A672]">{stepPlan.phaseTitle}</span>
                  </span>
                  <h5 className="text-sm font-black leading-6">{stepPlan.actionTitle}</h5>
                  <p className="text-xs leading-6 text-stone-400">{stepPlan.description}</p>
                  <p className="border-t border-white/10 pt-2 text-[11px] font-bold text-amber-300">{stepPlan.keyRule}</p>
                </li>
              ))}
            </ol>
          </div>

          <div className="rounded-3xl border border-line p-5 sm:p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h4 className="flex items-center gap-2 text-sm font-black text-ink">
                <BookOpen className="w-5 h-5 text-copper-hi" />
                {uiLabels.recommendedChaptersTitle}
              </h4>
              <button onClick={() => onAddToCart('bundle-full')} className="text-xs font-bold text-copper-hi hover:underline underline-offset-4">
                {uiLabels.orderBundleBtn}
              </button>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {result.bookRecommendations.map((bookRec) => (
                <div key={bookRec.dimension} className="space-y-2 rounded-2xl bg-surface-2/60 p-4">
                  <p className="text-sm font-black text-copper-hi">{bookRec.chapterRef}</p>
                  <p className="text-xs leading-6 text-ink-2">{bookRec.whyNeeded}</p>
                </div>
              ))}
            </div>
          </div>

          {previousResult && previousResult.id !== result.id && (
            <div className="rounded-3xl border border-line p-4 space-y-3 text-xs">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <button onClick={() => setShowComparison(!showComparison)} className="flex items-center gap-2 font-bold text-copper-hi hover:underline">
                  <History className="w-4 h-4" />
                  {showComparison ? uiLabels.closeCompareBtn : uiLabels.compareBtn}
                </button>
                <span className="text-ink-3">{uiLabels.prevAssessmentScore(formatPct(previousResult.engagementPercentage))}</span>
              </div>
              {showComparison && (
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {result.dimensionResults.map((dim) => {
                    const prevDim = previousResult.dimensionResults.find((d) => d.dimension === dim.dimension);
                    const diff = prevDim ? dim.percentage - prevDim.percentage : 0;
                    return (
                      <div key={dim.dimension} className="rounded-xl bg-surface-2/60 p-2.5">
                        <span className="block truncate font-bold text-ink">{dim.title}</span>
                        <div className="mt-1 flex items-center justify-between">
                          <span className="text-ink-3">{uiLabels.currentLabel(formatPct(dim.percentage))}</span>
                          <span className={`font-black ${diff < 0 ? 'text-teal-500' : diff > 0 ? 'text-red-500' : 'text-ink-3'}`}>
                            {diff > 0 ? `+${formatPct(diff)}` : formatPct(diff)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-5">
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" onClick={handlePrint}>
                <Printer className="w-3.5 h-3.5" />
                {uiLabels.printBtn}
              </Button>
              <Button variant="secondary" size="sm" onClick={handleRetake}>
                <RefreshCw className="w-3.5 h-3.5" />
                {uiLabels.retakeBtn}
              </Button>
            </div>
            <Button onClick={() => onAddToCart('bundle-full')}>
              <BookOpen className="w-4 h-4" />
              {uiLabels.orderBundleBtn}
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
};
