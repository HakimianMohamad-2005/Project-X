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
  const { i18n } = useTranslation();
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

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} className="space-y-6">
      
      {/* ---------------------------------------------------- */}
      {/* STEP 1: 5-FIELD INTAKE FORM */}
      {/* ---------------------------------------------------- */}
      {step === 'profile' && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          className="space-y-6"
        >
          <div className="flex items-center justify-between pb-4 border-b border-stone-500/20">
            <div>
              <h3 className={`text-xl font-bold ${isLight ? 'text-stone-900' : 'text-[#FAF7F2]'}`}>
                {formLabels.title}
              </h3>
              <p className={`text-xs sm:text-sm mt-1 ${isLight ? 'text-stone-600' : 'text-stone-400'}`}>
                {formLabels.subtitle}
              </p>
            </div>
            <button
              onClick={onBackToModeSelect}
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-colors cursor-pointer ${
                isLight ? 'border-stone-300 hover:bg-stone-100 text-stone-700' : 'border-stone-700 hover:bg-stone-800 text-stone-300'
              }`}
            >
              {formLabels.backBtn}
            </button>
          </div>

          <form onSubmit={handleStartQuiz} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              {/* Field A: Full Name (نام و نام خانوادگی) - Required & Pre-Loaded */}
              <div className="space-y-1.5">
                <label className={`text-xs font-bold flex items-center gap-1.5 ${isLight ? 'text-stone-800' : 'text-stone-200'}`}>
                  <User className="w-3.5 h-3.5 text-[#B87333]" />
                  <span>{formLabels.fullNameLabel}</span>
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={profile.fullName || ''}
                  onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                  placeholder={formLabels.fullNamePlaceholder}
                  required
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[#B87333] ${
                    isLight ? 'bg-stone-50 border-stone-300 text-stone-900' : 'bg-[#181A1C] border-stone-700 text-stone-100'
                  }`}
                />
              </div>

              {/* Field B: Phone (شماره تماس) - Optional (اختیاری) */}
              <div className="space-y-1.5">
                <label className={`text-xs font-bold flex items-center justify-between gap-1.5 ${isLight ? 'text-stone-800' : 'text-stone-200'}`}>
                  <span className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#B87333]" />
                    <span>{formLabels.phoneLabel}</span>
                  </span>
                  <span className="text-[11px] font-normal text-stone-400">
                    {formLabels.phoneOptionalBadge}
                  </span>
                </label>
                <input
                  type="tel"
                  dir="ltr"
                  value={profile.phone || ''}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  placeholder={formLabels.phonePlaceholder}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[#B87333] text-start ${
                    isLight ? 'bg-stone-50 border-stone-300 text-stone-900' : 'bg-[#181A1C] border-stone-700 text-stone-100'
                  }`}
                />
              </div>

              {/* Field 1: Role */}
              <div className="space-y-1.5">
                <label className={`text-xs font-bold flex items-center gap-1.5 ${isLight ? 'text-stone-800' : 'text-stone-200'}`}>
                  <Briefcase className="w-3.5 h-3.5 text-[#B87333]" />
                  <span>{formLabels.roleLabel}</span>
                  <span className="text-red-500">*</span>
                </label>
                <select
                  value={profile.role}
                  onChange={(e) => setProfile({ ...profile, role: e.target.value })}
                  required
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[#B87333] ${
                    isLight ? 'bg-stone-50 border-stone-300 text-stone-900' : 'bg-[#181A1C] border-stone-700 text-stone-100'
                  }`}
                >
                  <option value="">{formLabels.rolePlaceholder}</option>
                  {formOptions.roles.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Field 2: Industry */}
              <div className="space-y-1.5">
                <label className={`text-xs font-bold flex items-center gap-1.5 ${isLight ? 'text-stone-800' : 'text-stone-200'}`}>
                  <Building2 className="w-3.5 h-3.5 text-[#B87333]" />
                  <span>{formLabels.industryLabel}</span>
                  <span className="text-red-500">*</span>
                </label>
                <select
                  value={profile.industry}
                  onChange={(e) => setProfile({ ...profile, industry: e.target.value })}
                  required
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[#B87333] ${
                    isLight ? 'bg-stone-50 border-stone-300 text-stone-900' : 'bg-[#181A1C] border-stone-700 text-stone-100'
                  }`}
                >
                  <option value="">{formLabels.industryPlaceholder}</option>
                  {formOptions.industries.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Field 3: Headcount */}
              <div className="space-y-1.5">
                <label className={`text-xs font-bold flex items-center gap-1.5 ${isLight ? 'text-stone-800' : 'text-stone-200'}`}>
                  <Users className="w-3.5 h-3.5 text-[#B87333]" />
                  <span>{formLabels.headcountLabel}</span>
                  <span className="text-red-500">*</span>
                </label>
                <select
                  value={profile.headcount}
                  onChange={(e) => setProfile({ ...profile, headcount: e.target.value })}
                  required
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[#B87333] ${
                    isLight ? 'bg-stone-50 border-stone-300 text-stone-900' : 'bg-[#181A1C] border-stone-700 text-stone-100'
                  }`}
                >
                  <option value="">{formLabels.headcountPlaceholder}</option>
                  {formOptions.headcounts.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Field 4: Experience */}
              <div className="space-y-1.5">
                <label className={`text-xs font-bold flex items-center gap-1.5 ${isLight ? 'text-stone-800' : 'text-stone-200'}`}>
                  <Award className="w-3.5 h-3.5 text-[#B87333]" />
                  <span>{formLabels.experienceLabel}</span>
                  <span className="text-red-500">*</span>
                </label>
                <select
                  value={profile.experience}
                  onChange={(e) => setProfile({ ...profile, experience: e.target.value })}
                  required
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[#B87333] ${
                    isLight ? 'bg-stone-50 border-stone-300 text-stone-900' : 'bg-[#181A1C] border-stone-700 text-stone-100'
                  }`}
                >
                  <option value="">{formLabels.experiencePlaceholder}</option>
                  {formOptions.experiences.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

            </div>

            {/* Field 5: Scope */}
            <div className="space-y-1.5">
              <label className={`text-xs font-bold flex items-center gap-1.5 ${isLight ? 'text-stone-800' : 'text-stone-200'}`}>
                <Layers className="w-3.5 h-3.5 text-[#B87333]" />
                <span>{formLabels.scopeLabel}</span>
                <span className="text-red-500">*</span>
              </label>
              <select
                value={profile.scope}
                onChange={(e) => setProfile({ ...profile, scope: e.target.value })}
                required
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[#B87333] ${
                  isLight ? 'bg-stone-50 border-stone-300 text-stone-900' : 'bg-[#181A1C] border-stone-700 text-stone-100'
                }`}
              >
                <option value="">{formLabels.scopePlaceholder}</option>
                {formOptions.scopes.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Submit button */}
            <div className="pt-4 flex items-center justify-end">
              <button
                type="submit"
                disabled={!isProfileValid}
                className={`px-6 py-3 rounded-2xl font-bold text-sm transition-all flex items-center gap-2 shadow-lg cursor-pointer ${
                  isProfileValid
                    ? 'bg-[#B87333] hover:bg-amber-600 text-white shadow-[#B87333]/25'
                    : 'bg-stone-400 text-stone-200 cursor-not-allowed opacity-60'
                }`}
              >
                <span>{formLabels.submitBtn}</span>
                <NextIcon className="w-4 h-4" />
              </button>
            </div>

          </form>
        </motion.div>
      )}

      {/* ---------------------------------------------------- */}
      {/* STEP 2: 24-SCENARIO SINGLE-VIEW STEPPER */}
      {/* ---------------------------------------------------- */}
      {step === 'quiz' && (
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQ.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            className="space-y-6"
          >
            {/* Top Progress & Dimension Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-stone-500/20">
              
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-black bg-[#B87333]/15 text-[#B87333] border border-[#B87333]/30">
                  {uiLabels.questionCount(formatNumber(currentIdx + 1), formatNumber(24))}
                </span>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
                  isLight ? 'bg-stone-100 text-stone-600' : 'bg-stone-800 text-stone-300'
                }`}>
                  {uiLabels.dimensionLabel(currentDimMeta?.title || '')}
                </span>
              </div>

              {/* Progress Bar (No timer, no time limit) */}
              <div className="flex items-center gap-2 min-w-[140px]">
                <div className={`w-32 sm:w-44 h-2 rounded-full overflow-hidden ${isLight ? 'bg-stone-200' : 'bg-stone-800'}`}>
                  <div
                    className="bg-[#B87333] h-full transition-all duration-300"
                    style={{ width: `${((currentIdx + 1) / 24) * 100}%` }}
                  />
                </div>
                <span className="text-[11px] font-mono font-bold text-stone-400">
                  {formatPct(Math.round(((currentIdx + 1) / 24) * 100))}
                </span>
              </div>

            </div>

            {/* Scenario Card */}
            <div className={`p-5 sm:p-6 rounded-2xl border space-y-3 ${
              isLight ? 'bg-amber-50/40 border-amber-200/70' : 'bg-stone-900/60 border-stone-800'
            }`}>
              <div className="flex items-center gap-2 text-xs font-extrabold text-[#B87333]">
                <span className="w-2 h-2 rounded-full bg-[#B87333]" />
                <span>{uiLabels.scenarioNumber(formatNumber(currentIdx + 1), currentQ.title)}</span>
              </div>
              <p className={`text-sm sm:text-base leading-relaxed font-semibold ${isLight ? 'text-stone-900' : 'text-[#FAF7F2]'}`}>
                {currentQ.scenario}
              </p>
            </div>

            {/* 4 Options */}
            <div className="space-y-3">
              <span className={`text-xs font-bold block ${isLight ? 'text-stone-500' : 'text-stone-400'}`}>
                {uiLabels.userResponseLabel}
              </span>

              {currentOptions.map((opt) => {
                const isSelected = currentSelected?.optionId === opt.id;
                const optionLetter = opt.id.toUpperCase();

                return (
                  <motion.button
                    key={`${currentQ.id}-${opt.id}`}
                    whileHover={{ scale: 1.008 }}
                    whileTap={{ scale: 0.992 }}
                    onClick={() => handleSelectOption(currentQ.id, opt)}
                    className={`w-full p-4 rounded-2xl text-start transition-all flex items-start gap-3.5 border cursor-pointer ${
                      isSelected
                        ? 'bg-[#B87333]/15 border-[#B87333] font-bold shadow-md ring-1 ring-[#B87333]'
                        : isLight
                          ? 'bg-stone-50 border-stone-200 hover:bg-stone-100/80 text-stone-800'
                          : 'bg-[#181A1C] border-stone-800 hover:border-stone-700 text-stone-200'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-full border flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold transition-colors ${
                      isSelected
                        ? 'border-[#B87333] bg-[#B87333] text-white'
                        : isLight
                          ? 'border-stone-400 bg-white text-stone-600'
                          : 'border-stone-600 bg-stone-800 text-stone-300'
                    }`}>
                      {optionLetter}
                    </div>
                    <span className="text-xs sm:text-sm font-medium leading-relaxed">
                      {opt.text}
                    </span>
                  </motion.button>
                );
              })}
            </div>

            {/* Stepper Navigation Buttons */}
            <div className="flex items-center justify-between pt-5 border-t border-stone-500/20">
              <button
                type="button"
                onClick={handlePrevQuestion}
                disabled={currentIdx === 0}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
                  currentIdx === 0
                    ? 'opacity-40 cursor-not-allowed border-stone-300 text-stone-400'
                    : isLight
                      ? 'border-stone-300 text-stone-700 hover:bg-stone-100 cursor-pointer'
                      : 'border-stone-700 text-stone-300 hover:bg-stone-800 cursor-pointer'
                }`}
              >
                <PrevIcon className="w-4 h-4" />
                <span>{uiLabels.prevBtn}</span>
              </button>

              <button
                type="button"
                onClick={handleNextQuestion}
                disabled={!currentSelected}
                className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-lg ${
                  !currentSelected
                    ? 'opacity-50 cursor-not-allowed bg-stone-400 text-white'
                    : 'bg-[#B87333] hover:bg-amber-600 text-white shadow-[#B87333]/25 cursor-pointer'
                }`}
              >
                <span>{currentIdx === 23 ? uiLabels.calcResultsBtn : uiLabels.nextBtn}</span>
                <NextIcon className="w-4 h-4" />
              </button>
            </div>

          </motion.div>
        </AnimatePresence>
      )}

      {/* ---------------------------------------------------- */}
      {/* STEP 3: COMPREHENSIVE DIAGNOSTIC REPORT */}
      {/* ---------------------------------------------------- */}
      {step === 'result' && result && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.35 }}
          className="space-y-8"
        >
          {/* Main Score Header */}
          <div className="text-center space-y-4 pb-6 border-b border-stone-500/20">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black bg-[#B87333]/15 text-[#B87333] border border-[#B87333]/30">
              {uiLabels.resultBadge}
            </div>

            <div className="flex flex-col items-center justify-center gap-2">
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-[#B87333] to-[#8B4513] p-1 shadow-2xl flex items-center justify-center">
                <div className={`w-full h-full rounded-[22px] flex flex-col items-center justify-center ${
                  isLight ? 'bg-white' : 'bg-[#121314]'
                }`}>
                  <span className="text-2xl sm:text-3xl font-black text-[#B87333]">
                    {formatPct(result.engagementPercentage)}
                  </span>
                  <span className="text-[10px] text-stone-500 font-bold">{uiLabels.of100}</span>
                </div>
              </div>

              <h3 className={`text-xl sm:text-2xl font-black ${isLight ? 'text-stone-900' : 'text-[#FAF7F2]'}`}>
                {uiLabels.resultTitle(formatPct(result.engagementPercentage))}
              </h3>

              {result.profile?.fullName && (
                <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-semibold text-stone-500 pt-1">
                  <span className="font-bold text-[#B87333]">{result.profile.fullName}</span>
                  {result.profile.role && <span>• {result.profile.role}</span>}
                  {result.profile.industry && <span>• {result.profile.industry}</span>}
                </div>
              )}
            </div>

            {/* Tier Badge & Summary */}
            <div className={`p-4 sm:p-5 rounded-2xl border max-w-2xl mx-auto space-y-2 ${result.tier.cardColor}`}>
              <div className="flex items-center justify-center gap-2">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-black ${result.tier.badgeColor}`}>
                  {result.tier.shortDesc}
                </span>
                <span className="font-extrabold text-sm sm:text-base">
                  {result.tier.title}
                </span>
              </div>
              <p className="text-xs sm:text-sm leading-relaxed font-medium">
                {result.tier.description}
              </p>
            </div>

            {/* Consistency Index Badge */}
            <div className={`inline-flex flex-col sm:flex-row items-center gap-2 px-4 py-2.5 rounded-xl border text-xs max-w-xl mx-auto ${
              result.consistency.level === 'high'
                ? 'bg-teal-500/10 border-teal-400 text-teal-800 dark:text-teal-300'
                : result.consistency.level === 'medium'
                  ? 'bg-amber-500/10 border-amber-400 text-amber-800 dark:text-amber-300'
                  : 'bg-red-500/10 border-red-400 text-red-800 dark:text-red-300'
            }`}>
              <div className="flex items-center gap-1.5 font-bold">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>{uiLabels.consistencyTitle}</span>
                <span className="font-mono">({formatNumber(result.consistency.score)}) {result.consistency.title}</span>
              </div>
              <span className="text-[11px] font-normal text-stone-600 dark:text-stone-400">
                {result.consistency.description}
              </span>
            </div>

          </div>

          {/* Radar & 8-Dimension Visualizer */}
          <div className={`p-6 rounded-3xl border space-y-4 ${
            isLight ? 'bg-stone-50 border-stone-200' : 'bg-stone-900/60 border-stone-800'
          }`}>
            <div className="text-center space-y-1">
              <h4 className={`text-base font-extrabold ${isLight ? 'text-stone-900' : 'text-[#FAF7F2]'}`}>
                {uiLabels.radarTitle}
              </h4>
              <p className="text-xs text-stone-500">
                {uiLabels.radarDesc}
              </p>
            </div>

            <RadarDimensionChart
              dimensions={result.dimensionResults}
              isLight={isLight}
              isPersian={isPersian}
            />
          </div>

          {/* 3 Hotspots (Weakest) & 1 Key Strength */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Hotspots */}
            <div className={`p-5 rounded-2xl border space-y-3 ${
              isLight ? 'bg-red-50/50 border-red-200' : 'bg-red-950/20 border-red-900/50'
            }`}>
              <div className="flex items-center gap-2 text-red-600 font-extrabold text-sm">
                <Flame className="w-4 h-4" />
                <span>{uiLabels.hotspotsTitle}</span>
              </div>
              <div className="space-y-2.5">
                {result.hotspots.map((item, idx) => (
                  <div key={item.dimension} className={`p-3 rounded-xl border flex items-start justify-between gap-3 text-xs ${
                    isLight ? 'bg-white border-red-100 text-stone-800' : 'bg-stone-900 border-stone-800 text-stone-200'
                  }`}>
                    <div className="space-y-1">
                      <div className="font-bold flex items-center gap-1.5">
                        <span className="w-4 h-4 rounded-full bg-red-500 text-white flex items-center justify-center text-[10px]">
                          {formatNumber(idx + 1)}
                        </span>
                        <span>{item.title}</span>
                      </div>
                      <p className="text-[11px] text-stone-500 leading-relaxed">
                        {item.shortDesc}
                      </p>
                    </div>
                    <span className="font-bold font-mono text-red-600 bg-red-100 dark:bg-red-950 px-2 py-0.5 rounded shrink-0">
                      {formatPct(item.percentage)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Strength */}
            <div className={`p-5 rounded-2xl border space-y-3 ${
              isLight ? 'bg-teal-50/50 border-teal-200' : 'bg-teal-950/20 border-teal-900/50'
            }`}>
              <div className="flex items-center gap-2 text-teal-600 font-extrabold text-sm">
                <CheckCircle2 className="w-4 h-4" />
                <span>{uiLabels.keyStrengthTitle}</span>
              </div>
              <div className={`p-4 rounded-xl border space-y-2 text-xs ${
                isLight ? 'bg-white border-teal-100 text-stone-800' : 'bg-stone-900 border-stone-800 text-stone-200'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="font-black text-sm text-teal-700 dark:text-teal-400">
                    {result.keyStrength.title}
                  </span>
                  <span className="font-bold font-mono text-teal-600 bg-teal-100 dark:bg-teal-950 px-2 py-0.5 rounded">
                    {uiLabels.keyStrengthBadge(formatPct(result.keyStrength.percentage))}
                  </span>
                </div>
                <p className="text-[11px] text-stone-600 dark:text-stone-400 leading-relaxed">
                  {result.keyStrength.shortDesc}
                </p>
                <div className="pt-2 text-[10px] text-teal-600 dark:text-teal-400 font-bold border-t border-teal-100 dark:border-stone-800">
                  {uiLabels.keyStrengthFooter}
                </div>
              </div>
            </div>

          </div>

          {/* Three-Step +3 Program Action Plan */}
          <div className="p-6 rounded-3xl bg-[#B87333]/10 border border-[#B87333]/30 space-y-4">
            <div className="flex items-center gap-2 text-[#B87333] font-black text-base">
              <Award className="w-5 h-5" />
              <span>{uiLabels.actionPlanTitle}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {result.actionPlan.map((stepPlan) => (
                <div
                  key={stepPlan.stepNumber}
                  className={`p-4 rounded-2xl border space-y-2.5 ${
                    isLight ? 'bg-white border-stone-200 text-stone-800' : 'bg-stone-900 border-stone-800 text-stone-200'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#B87333] text-white flex items-center justify-center text-xs font-black">
                      {formatNumber(stepPlan.stepNumber)}
                    </span>
                    <span className="text-xs font-bold text-[#B87333]">
                      {stepPlan.phaseTitle}
                    </span>
                  </div>
                  <h5 className="text-xs font-extrabold leading-snug">
                    {stepPlan.actionTitle}
                  </h5>
                  <p className="text-[11px] text-stone-600 dark:text-stone-400 leading-relaxed">
                    {stepPlan.description}
                  </p>
                  <div className="pt-2 border-t border-stone-200 dark:border-stone-800 text-[10px] font-bold text-amber-700 dark:text-amber-400">
                    {stepPlan.keyRule}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Book Chapters */}
          <div className={`p-6 rounded-3xl border space-y-4 ${
            isLight ? 'bg-stone-50 border-stone-200' : 'bg-[#181A1C] border-stone-800'
          }`}>
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2 text-stone-900 dark:text-[#FAF7F2] font-black text-sm">
                <BookOpen className="w-5 h-5 text-[#B87333]" />
                <span>{uiLabels.recommendedChaptersTitle}</span>
              </div>
              <button
                onClick={() => onAddToCart('bundle-full')}
                className="text-xs font-bold text-[#B87333] hover:underline cursor-pointer"
              >
                {uiLabels.orderBundleBtn}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {result.bookRecommendations.map((bookRec) => (
                <div
                  key={bookRec.dimension}
                  className={`p-3.5 rounded-2xl border space-y-2 text-xs ${
                    isLight ? 'bg-white border-stone-200' : 'bg-stone-900 border-stone-800'
                  }`}
                >
                  <div className="font-extrabold text-[#B87333]">
                    {bookRec.chapterRef}
                  </div>
                  <p className="text-[11px] text-stone-600 dark:text-stone-400 leading-relaxed">
                    {bookRec.whyNeeded}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Comparison with Past Result Modal/Box if exists */}
          {previousResult && previousResult.id !== result.id && (
            <div className={`p-4 rounded-2xl border space-y-2 text-xs ${
              isLight ? 'bg-stone-100 border-stone-300' : 'bg-stone-900 border-stone-800'
            }`}>
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setShowComparison(!showComparison)}
                  className="flex items-center gap-2 font-bold text-[#B87333] hover:underline cursor-pointer"
                >
                  <History className="w-4 h-4" />
                  <span>
                    {showComparison ? uiLabels.closeCompareBtn : uiLabels.compareBtn}
                  </span>
                </button>
                <span className="text-[10px] text-stone-500 font-mono">
                  {uiLabels.prevAssessmentScore(formatPct(previousResult.engagementPercentage))}
                </span>
              </div>

              {showComparison && (
                <div className="pt-3 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                  {result.dimensionResults.map((dim) => {
                    const prevDim = previousResult.dimensionResults.find((d) => d.dimension === dim.dimension);
                    const diff = prevDim ? dim.percentage - prevDim.percentage : 0;
                    return (
                      <div key={dim.dimension} className={`p-2.5 rounded-xl border ${
                        isLight ? 'bg-white border-stone-200' : 'bg-stone-800 border-stone-700'
                      }`}>
                        <span className="font-bold block truncate">{dim.title}</span>
                        <div className="flex items-center justify-between mt-1">
                          <span className="font-mono">{uiLabels.currentLabel(formatPct(dim.percentage))}</span>
                          <span className={`font-mono font-bold ${
                            diff < 0 ? 'text-teal-600' : diff > 0 ? 'text-red-500' : 'text-stone-400'
                          }`}>
                            {diff > 0 ? `+${formatPct(diff)}` : `${formatPct(diff)}`}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Action Buttons: Print, Retake, Buy Bundle */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-stone-500/20">
            
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className={`px-3.5 py-2.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  isLight ? 'border-stone-300 hover:bg-stone-100 text-stone-700' : 'border-stone-700 hover:bg-stone-800 text-stone-300'
                }`}
              >
                <Printer className="w-3.5 h-3.5" />
                <span>{uiLabels.printBtn}</span>
              </button>

              <button
                onClick={handleRetake}
                className={`px-3.5 py-2.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  isLight ? 'border-stone-300 hover:bg-stone-100 text-stone-700' : 'border-stone-700 hover:bg-stone-800 text-stone-300'
                }`}
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>{uiLabels.retakeBtn}</span>
              </button>
            </div>

            <button
              onClick={() => onAddToCart('bundle-full')}
              className="px-6 py-3 rounded-xl bg-[#B87333] hover:bg-amber-600 text-white font-black text-xs shadow-xl flex items-center gap-2 cursor-pointer transition-transform hover:scale-105"
            >
              <span>{uiLabels.orderBundleBtn}</span>
              <BookOpen className="w-4 h-4" />
            </button>

          </div>

        </motion.div>
      )}

    </div>
  );
};
