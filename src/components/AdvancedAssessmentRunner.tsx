import React, { useState, useEffect, useMemo } from 'react';
import {
  ADVANCED_ASSESSMENT_QUESTIONS,
  AssessmentQuestion,
  AssessmentOption,
  DIMENSION_METAS
} from '../data/managerAssessment';
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
  ArrowUpDown,
  History
} from 'lucide-react';

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
  const isLight = theme === 'light';

  // Step management: 'profile' | 'quiz' | 'result'
  const [step, setStep] = useState<'profile' | 'quiz' | 'result'>('profile');

  // Intake Form Profile State
  const [profile, setProfile] = useState<AssessmentRespondentProfile>({
    role: '',
    industry: '',
    headcount: '',
    experience: '',
    scope: '',
    createdAt: ''
  });

  // Current Question Index in 24 questions (0..23)
  const [currentIdx, setCurrentIdx] = useState<number>(0);

  // Answers Map: { [qId: number]: { optionId: string; score: number } }
  const [answers, setAnswers] = useState<Record<number, { optionId: string; score: number }>>({});

  // Randomized options per question (generated once per session so order doesn't jump on prev/next)
  const [shuffledOptionsMap, setShuffledOptionsMap] = useState<Record<number, AssessmentOption[]>>({});

  // Result object after completion
  const [result, setResult] = useState<AdvancedAssessmentResult | null>(null);

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
      if (draft.profile) setProfile(draft.profile);
      if (draft.answers) setAnswers(draft.answers);
      if (typeof draft.currentIdx === 'number') setCurrentIdx(draft.currentIdx);
      if (draft.shuffledOptionsMap) setShuffledOptionsMap(draft.shuffledOptionsMap);
      if (draft.step === 'quiz') setStep('quiz');
    }
  }, []);

  // Initialize shuffled options if not set
  useEffect(() => {
    if (Object.keys(shuffledOptionsMap).length === 0) {
      const map: Record<number, AssessmentOption[]> = {};
      ADVANCED_ASSESSMENT_QUESTIONS.forEach((q) => {
        // Deterministic or seeded shuffle for this session
        const opts = [...q.options];
        for (let i = opts.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [opts[i], opts[j]] = [opts[j], opts[i]];
        }
        map[q.id] = opts;
      });
      setShuffledOptionsMap(map);
    }
  }, [shuffledOptionsMap]);

  // Autosave draft on change
  useEffect(() => {
    if (step === 'quiz') {
      saveAssessmentDraft({
        step: 'quiz',
        profile,
        answers,
        currentIdx,
        shuffledOptionsMap
      });
    }
  }, [step, profile, answers, currentIdx, shuffledOptionsMap]);

  // Form validation for Profile Step
  const isProfileValid = useMemo(() => {
    return (
      profile.role.trim() !== '' &&
      profile.industry.trim() !== '' &&
      profile.headcount.trim() !== '' &&
      profile.experience.trim() !== '' &&
      profile.scope.trim() !== ''
    );
  }, [profile]);

  const handleStartQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isProfileValid) return;
    setProfile((prev) => ({ ...prev, createdAt: new Date().toISOString() }));
    setStep('quiz');
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
    if (currentIdx < ADVANCED_ASSESSMENT_QUESTIONS.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      // Calculate final results
      const res = evaluateAdvancedAssessment(profile, answers);
      setResult(res);
      saveAssessmentResultToHistory(res);
      clearAssessmentDraft();
      setStep('result');
      
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
    setStep('profile');
  };

  const handlePrint = () => {
    window.print();
  };

  const currentQ: AssessmentQuestion = ADVANCED_ASSESSMENT_QUESTIONS[currentIdx] || ADVANCED_ASSESSMENT_QUESTIONS[0];
  const currentOptions = shuffledOptionsMap[currentQ.id] || currentQ.options;
  const currentSelected = answers[currentQ.id];
  const currentDimMeta = DIMENSION_METAS[currentQ.dimension];

  return (
    <div className="space-y-6">
      
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
                مشخصات سازمانی و مدیریتی
              </h3>
              <p className={`text-xs sm:text-sm mt-1 ${isLight ? 'text-stone-600' : 'text-stone-400'}`}>
                جهت تطبیق تحلیل رفتار سازمانی با ابعاد کسب‌وکار شما، تکمیل ۵ فیلد زیر الزامی است.
              </p>
            </div>
            <button
              onClick={onBackToModeSelect}
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-colors ${
                isLight ? 'border-stone-300 hover:bg-stone-100 text-stone-700' : 'border-stone-700 hover:bg-stone-800 text-stone-300'
              }`}
            >
              بازگشت به انتخاب آزمون
            </button>
          </div>

          <form onSubmit={handleStartQuiz} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Field 1: Role */}
              <div className="space-y-1.5">
                <label className={`text-xs font-bold flex items-center gap-1.5 ${isLight ? 'text-stone-800' : 'text-stone-200'}`}>
                  <Briefcase className="w-3.5 h-3.5 text-[#B87333]" />
                  <span>۱. سمت یا جایگاه سازمانی</span>
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
                  <option value="">-- انتخاب سمت سازمانی --</option>
                  <option value="مدیرعامل / مالک کسب‌وکار">مدیرعامل / مؤسس / مالک کسب‌وکار</option>
                  <option value="عضو هیئت‌مدیره / سهامدار">عضو هیئت‌مدیره / سهامدار ارشد</option>
                  <option value="مدیر کارخانه / مدیر عملیات">مدیر کارخانه / مدیر ارشد عملیات و تولید</option>
                  <option value="مدیر میانی (فروش، مالی، انبار، منابع انسانی، کیفیت)">مدیر میانی (فروش، مالی، انبار، منابع انسانی، کیفیت)</option>
                  <option value="سرپرست خط / کارشناس ارشد">سرپرست خط / کارشناس ارشد اجرایی</option>
                  <option value="مشاور مدیریت / ارزیاب">مشاور مدیریت / مدرس / ارزیاب سازمانی</option>
                </select>
              </div>

              {/* Field 2: Industry */}
              <div className="space-y-1.5">
                <label className={`text-xs font-bold flex items-center gap-1.5 ${isLight ? 'text-stone-800' : 'text-stone-200'}`}>
                  <Building2 className="w-3.5 h-3.5 text-[#B87333]" />
                  <span>۲. صنعت / نوع سازمان</span>
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
                  <option value="">-- انتخاب حوزه فعالیت --</option>
                  <option value="تولیدی / صنعتی / کارخانجات">تولیدی / صنعتی / کارخانجات و فرآوری</option>
                  <option value="بازرگانی / پخش و توزیع">بازرگانی / واردات / صادرات / پخش و توزیع</option>
                  <option value="خدماتی / فناوری و IT / استارتاپ">خدماتی / فناوری اطلاعات و نرم‌افزار / پلتفرم</option>
                  <option value="پیمانکاری / عمرانی / ساختمانی">پیمانکاری / مهندسی / نفت، گاز و پتروشیمی / عمران</option>
                  <option value="بهداشتی / دارویی / مواد غذایی">صنایع غذایی / دارویی / آرایشی و بهداشتی</option>
                  <option value="فروشگاهی / خرده‌فروشی / زنجیره‌ای">فروشگاهی / خرده‌فروشی / هایپرمارکت</option>
                </select>
              </div>

              {/* Field 3: Headcount */}
              <div className="space-y-1.5">
                <label className={`text-xs font-bold flex items-center gap-1.5 ${isLight ? 'text-stone-800' : 'text-stone-200'}`}>
                  <Users className="w-3.5 h-3.5 text-[#B87333]" />
                  <span>۳. تعداد کل کارکنان</span>
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
                  <option value="">-- انتخاب تعداد پرسنل --</option>
                  <option value="۱ تا ۱۰ نفر (میکرو / تیم کوچک)">۱ تا ۱۰ نفر (تیم کوچک)</option>
                  <option value="۱۱ تا ۵۰ نفر (کسب‌وکار کوچک)">۱۱ تا ۵۰ نفر (کسب‌وکار کوچک)</option>
                  <option value="۵۱ تا ۲۰۰ نفر (سازمان متوسط)">۵۱ تا ۲۰۰ نفر (سازمان متوسط)</option>
                  <option value="۲۰۱ تا ۵۰۰ نفر (صنایع بزرگ)">۲۰۱ تا ۵۰۰ نفر (سازمان بزرگ)</option>
                  <option value="بیش از ۵۰۰ نفر (صنایع هلدینگی)">بیش از ۵۰۰ نفر (سازمان‌های بزرگ و هلدینگ)</option>
                </select>
              </div>

              {/* Field 4: Experience */}
              <div className="space-y-1.5">
                <label className={`text-xs font-bold flex items-center gap-1.5 ${isLight ? 'text-stone-800' : 'text-stone-200'}`}>
                  <Award className="w-3.5 h-3.5 text-[#B87333]" />
                  <span>۴. سابقه مدیریت شما</span>
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
                  <option value="">-- سابقه مدیریتی --</option>
                  <option value="کمتر از ۲ سال">کمتر از ۲ سال (مدیر نوپا)</option>
                  <option value="۲ تا ۵ سال">۲ تا ۵ سال</option>
                  <option value="۶ تا ۱۰ سال">۶ تا ۱۰ سال</option>
                  <option value="۱۱ تا ۲۰ سال">۱۱ تا ۲۰ سال</option>
                  <option value="بیش از ۲۰ سال">بیش از ۲۰ سال (مدیر باسابقه و پیشکسوت)</option>
                </select>
              </div>

            </div>

            {/* Field 5: Scope */}
            <div className="space-y-1.5">
              <label className={`text-xs font-bold flex items-center gap-1.5 ${isLight ? 'text-stone-800' : 'text-stone-200'}`}>
                <Layers className="w-3.5 h-3.5 text-[#B87333]" />
                <span>۵. محدوده ارزیابی (پاسخ‌های شما بازتاب کدام بخش است؟)</span>
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
                <option value="">-- انتخاب محدوده ارزیابی --</option>
                <option value="کل شرکت / کارخانه (نگاه هلی‌کوپتری)">کل سازمان / شرکت / کارخانه (نگاه هلی‌کوپتری به تمام واحدها)</option>
                <option value="واحد تحت مدیریت مستقیم من">واحد یا کارخانه تحت مدیریت مستقیم من</option>
                <option value="سبک و عادات تصمیم‌گیری شخصی من به عنوان مدیر">سبک و عادات تصمیم‌گیری شخصی من به عنوان مدیر</option>
              </select>
            </div>

            {/* Submit button */}
            <div className="pt-4 flex items-center justify-end">
              <button
                type="submit"
                disabled={!isProfileValid}
                className={`px-6 py-3 rounded-2xl font-bold text-sm transition-all flex items-center gap-2 shadow-lg ${
                  isProfileValid
                    ? 'bg-[#B87333] hover:bg-amber-600 text-white shadow-[#B87333]/25 cursor-pointer'
                    : 'bg-stone-400 text-stone-200 cursor-not-allowed opacity-60'
                }`}
              >
                <span>ورود به آزمون ۲۴ سناریویی</span>
                <ChevronLeft className="w-4 h-4" />
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
                  سؤال {toPersianDigits(currentIdx + 1)} از ۲۴
                </span>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
                  isLight ? 'bg-stone-100 text-stone-600' : 'bg-stone-800 text-stone-300'
                }`}>
                  بُعد: {currentDimMeta?.titleFa}
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
                  %{toPersianDigits(Math.round(((currentIdx + 1) / 24) * 100))}
                </span>
              </div>

            </div>

            {/* Scenario Card */}
            <div className={`p-5 sm:p-6 rounded-2xl border space-y-3 ${
              isLight ? 'bg-amber-50/40 border-amber-200/70' : 'bg-stone-900/60 border-stone-800'
            }`}>
              <div className="flex items-center gap-2 text-xs font-extrabold text-[#B87333]">
                <span className="w-2 h-2 rounded-full bg-[#B87333]" />
                <span>سناریوی شماره {toPersianDigits(currentIdx + 1)}: {currentQ.title}</span>
              </div>
              <p className={`text-sm sm:text-base leading-relaxed font-semibold ${isLight ? 'text-stone-900' : 'text-[#FAF7F2]'}`}>
                {currentQ.scenario}
              </p>
            </div>

            {/* 4 Options */}
            <div className="space-y-3">
              <span className={`text-xs font-bold block ${isLight ? 'text-stone-500' : 'text-stone-400'}`}>
                پاسخ یا شیوه مداخله معمول شما کدام است؟ (یک گزینه را انتخاب کنید):
              </span>

              {currentOptions.map((opt, idx) => {
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
                <ChevronRight className="w-4 h-4" />
                <span>سؤال قبلی</span>
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
                <span>{currentIdx === 23 ? 'محاسبه گزارش جامع و اکشن‌پلان' : 'سؤال بعدی'}</span>
                <ChevronLeft className="w-4 h-4" />
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
              گزارش جامع ۲۴ سناریویی و نقشه راه اختصاصی
            </div>

            <div className="flex flex-col items-center justify-center gap-2">
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-[#B87333] to-[#8B4513] p-1 shadow-2xl flex items-center justify-center">
                <div className={`w-full h-full rounded-[22px] flex flex-col items-center justify-center ${
                  isLight ? 'bg-white' : 'bg-[#121314]'
                }`}>
                  <span className="text-2xl sm:text-3xl font-black text-[#B87333]">
                    %{toPersianDigits(result.engagementPercentage)}
                  </span>
                  <span className="text-[10px] text-stone-500 font-bold">از ۱۰۰٪</span>
                </div>
              </div>

              <h3 className={`text-xl sm:text-2xl font-black ${isLight ? 'text-stone-900' : 'text-[#FAF7F2]'}`}>
                درصد درگیری با وضعیت اورانگوتانی: %{toPersianDigits(result.engagementPercentage)}
              </h3>
            </div>

            {/* Tier Badge & Summary */}
            <div className={`p-4 sm:p-5 rounded-2xl border max-w-2xl mx-auto space-y-2 ${result.tier.cardColor}`}>
              <div className="flex items-center justify-center gap-2">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-black ${result.tier.badgeColor}`}>
                  {result.tier.shortDescFa}
                </span>
                <span className="font-extrabold text-sm sm:text-base">
                  {result.tier.titleFa}
                </span>
              </div>
              <p className="text-xs sm:text-sm leading-relaxed font-medium">
                {result.tier.descriptionFa}
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
                <span>شاخص سازگاری پاسخ‌ها:</span>
                <span className="font-mono">({toPersianDigits(result.consistency.score)}) {result.consistency.titleFa}</span>
              </div>
              <span className="text-[11px] font-normal text-stone-600 dark:text-stone-400">
                {result.consistency.descriptionFa}
              </span>
            </div>

          </div>

          {/* Radar & 8-Dimension Visualizer */}
          <div className={`p-6 rounded-3xl border space-y-4 ${
            isLight ? 'bg-stone-50 border-stone-200' : 'bg-stone-900/60 border-stone-800'
          }`}>
            <div className="text-center space-y-1">
              <h4 className={`text-base font-extrabold ${isLight ? 'text-stone-900' : 'text-[#FAF7F2]'}`}>
                نمودار راداری ابعاد هشت‌گانه رفتار مدیریتی
              </h4>
              <p className="text-xs text-stone-500">
                فاصله بیشتر هر بُعد از مرکز، نشان‌دهنده غلبه رفتارهای تکانشی و غریزی در آن حوزه است.
              </p>
            </div>

            <RadarDimensionChart
              dimensions={result.dimensionResults}
              isLight={isLight}
              isPersian={true}
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
                <span>۳ نقطه داغ و اولویت‌های اصلی مداخله:</span>
              </div>
              <div className="space-y-2.5">
                {result.hotspots.map((item, idx) => (
                  <div key={item.dimension} className={`p-3 rounded-xl border flex items-start justify-between gap-3 text-xs ${
                    isLight ? 'bg-white border-red-100 text-stone-800' : 'bg-stone-900 border-stone-800 text-stone-200'
                  }`}>
                    <div className="space-y-1">
                      <div className="font-bold flex items-center gap-1.5">
                        <span className="w-4 h-4 rounded-full bg-red-500 text-white flex items-center justify-center text-[10px]">
                          {toPersianDigits(idx + 1)}
                        </span>
                        <span>{item.titleFa}</span>
                      </div>
                      <p className="text-[11px] text-stone-500 leading-relaxed">
                        {item.shortDescFa}
                      </p>
                    </div>
                    <span className="font-bold font-mono text-red-600 bg-red-100 dark:bg-red-950 px-2 py-0.5 rounded shrink-0">
                      %{toPersianDigits(item.percentage)}
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
                <span>نقطه قوت و پایداری سازمانی شما:</span>
              </div>
              <div className={`p-4 rounded-xl border space-y-2 text-xs ${
                isLight ? 'bg-white border-teal-100 text-stone-800' : 'bg-stone-900 border-stone-800 text-stone-200'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="font-black text-sm text-teal-700 dark:text-teal-400">
                    {result.keyStrength.titleFa}
                  </span>
                  <span className="font-bold font-mono text-teal-600 bg-teal-100 dark:bg-teal-950 px-2 py-0.5 rounded">
                    درگیری اندک: %{toPersianDigits(result.keyStrength.percentage)}
                  </span>
                </div>
                <p className="text-[11px] text-stone-600 dark:text-stone-400 leading-relaxed">
                  {result.keyStrength.shortDescFa}
                </p>
                <div className="pt-2 text-[10px] text-teal-600 dark:text-teal-400 font-bold border-t border-teal-100 dark:border-stone-800">
                  این بُعد ستون اصلی پایداری فعلی شماست؛ از ابزارهای آن برای الگوبرداری در سایر بخش‌ها بهره بگیرید.
                </div>
              </div>
            </div>

          </div>

          {/* Three-Step +3 Program Action Plan */}
          <div className="p-6 rounded-3xl bg-[#B87333]/10 border border-[#B87333]/30 space-y-4">
            <div className="flex items-center gap-2 text-[#B87333] font-black text-base">
              <Award className="w-5 h-5" />
              <span>اکشن‌پلان سه گام «برنامه ثابت +۳» (فرمول علی‌اصغر حکیمیان)</span>
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
                      {toPersianDigits(stepPlan.stepNumber)}
                    </span>
                    <span className="text-xs font-bold text-[#B87333]">
                      {stepPlan.phaseTitleFa}
                    </span>
                  </div>
                  <h5 className="text-xs font-extrabold leading-snug">
                    {stepPlan.actionTitleFa}
                  </h5>
                  <p className="text-[11px] text-stone-600 dark:text-stone-400 leading-relaxed">
                    {stepPlan.descriptionFa}
                  </p>
                  <div className="pt-2 border-t border-stone-200 dark:border-stone-800 text-[10px] font-bold text-amber-700 dark:text-amber-400">
                    {stepPlan.keyRuleFa}
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
                <span>فصل‌های پیشنهادی از کتاب اورانگوتان +۳ برای ۳ بُعد ضعیف‌تر شما:</span>
              </div>
              <button
                onClick={() => onAddToCart('bundle-full')}
                className="text-xs font-bold text-[#B87333] hover:underline cursor-pointer"
              >
                سفارش پکیج کامل ۲ جلدی
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
                    {bookRec.chapterRefFa}
                  </div>
                  <p className="text-[11px] text-stone-600 dark:text-stone-400 leading-relaxed">
                    {bookRec.whyNeededFa}
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
                    {showComparison ? 'بستن مقایسه با ارزیابی پیشین' : 'مقایسه این نتیجه با آخرین ارزیابی ذخیره‌شده شما'}
                  </span>
                </button>
                <span className="text-[10px] text-stone-500 font-mono">
                  ارزیابی قبلی: %{toPersianDigits(previousResult.engagementPercentage)} درگیری
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
                        <span className="font-bold block truncate">{dim.titleFa}</span>
                        <div className="flex items-center justify-between mt-1">
                          <span className="font-mono">فعلی: %{toPersianDigits(dim.percentage)}</span>
                          <span className={`font-mono font-bold ${
                            diff < 0 ? 'text-teal-600' : diff > 0 ? 'text-red-500' : 'text-stone-400'
                          }`}>
                            {diff > 0 ? `+${toPersianDigits(diff)}%` : `${toPersianDigits(diff)}%`}
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
                <span>چاپ و ذخیره گزارش (PDF)</span>
              </button>

              <button
                onClick={handleRetake}
                className={`px-3.5 py-2.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  isLight ? 'border-stone-300 hover:bg-stone-100 text-stone-700' : 'border-stone-700 hover:bg-stone-800 text-stone-300'
                }`}
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>تکرار آزمون</span>
              </button>
            </div>

            <button
              onClick={() => onAddToCart('bundle-full')}
              className="px-6 py-3 rounded-xl bg-[#B87333] hover:bg-amber-600 text-white font-black text-xs shadow-xl flex items-center gap-2 cursor-pointer transition-transform hover:scale-105"
            >
              <span>سفارش دوره کامل کتاب (جلد ۱ و ۲)</span>
              <BookOpen className="w-4 h-4" />
            </button>

          </div>

        </motion.div>
      )}

    </div>
  );
};
