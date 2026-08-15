import React, { useState } from 'react';
import { HelpCircle, RefreshCw, BookOpen, ArrowLeft, ArrowRight, Sparkles, Layers, Zap } from 'lucide-react';
import { toPersianDigits } from '../utils/persian';
import { ThemeMode } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { useTranslation } from 'react-i18next';
import { AdvancedAssessmentRunner } from './AdvancedAssessmentRunner';

interface OrangutanQuizProps {
  onAddToCart: (bookId: string) => void;
  theme?: ThemeMode;
}

export type QuizMode = 'select' | 'simple' | 'advanced';

export const OrangutanQuiz: React.FC<OrangutanQuizProps> = ({ onAddToCart, theme = 'light' }) => {
  const { t, i18n } = useTranslation();
  const isPersian = i18n.language === 'fa';
  const isLight = theme === 'light';

  // Active Mode: 'select' | 'simple' | 'advanced'
  const [activeMode, setActiveMode] = useState<QuizMode>('select');

  // Simple 5-question quiz states
  const questions = (t('quiz.questions', { returnObjects: true }) as any[]) || [];
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>(Array(questions.length || 5).fill(-1));
  const [showResults, setShowResults] = useState(false);

  const currentQuestion = questions[currentQuestionIndex] || { options: [] };

  const handleSelectOption = (optionIndex: number) => {
    const updated = [...selectedAnswers];
    updated[currentQuestionIndex] = optionIndex;
    setSelectedAnswers(updated);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setShowResults(true);
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const resetSimpleQuiz = () => {
    setSelectedAnswers(Array(questions.length || 5).fill(-1));
    setCurrentQuestionIndex(0);
    setShowResults(false);
  };

  // Calculate Total Score for 5-question quiz (Max 50 points = 100%)
  const calculateTotalScore = () => {
    let totalScore = 0;
    selectedAnswers.forEach((ansIndex) => {
      if (ansIndex !== -1) {
        totalScore += ansIndex * 5; // 0, 5, 10 points
      }
    });
    const percentage = Math.round((totalScore / 50) * 100);
    return { score: totalScore, percentage };
  };

  const getStatusDetails = (percentage: number) => {
    if (percentage <= 30) {
      return {
        title: t('quiz.tiers.t1.title'),
        color: 'text-red-500 border-red-300 bg-red-50',
        description: t('quiz.tiers.t1.description'),
        recommendation: t('quiz.tiers.t1.recommendation')
      };
    } else if (percentage <= 60) {
      return {
        title: t('quiz.tiers.t2.title'),
        color: 'text-amber-600 border-amber-300 bg-amber-50',
        description: t('quiz.tiers.t2.description'),
        recommendation: t('quiz.tiers.t2.recommendation')
      };
    } else if (percentage <= 80) {
      return {
        title: t('quiz.tiers.t3.title'),
        color: 'text-emerald-600 border-emerald-300 bg-emerald-50',
        description: t('quiz.tiers.t3.description'),
        recommendation: t('quiz.tiers.t3.recommendation')
      };
    } else {
      return {
        title: t('quiz.tiers.t4.title'),
        color: 'text-teal-600 border-teal-300 bg-teal-50',
        description: t('quiz.tiers.t4.description'),
        recommendation: t('quiz.tiers.t4.recommendation')
      };
    }
  };

  const resultData = showResults ? calculateTotalScore() : null;
  const statusDetails = resultData ? getStatusDetails(resultData.percentage) : null;
  const BackIcon = isPersian ? ArrowLeft : ArrowRight;

  return (
    <section id="quiz" className={`py-16 md:py-20 transition-colors duration-300 border-b ${
      isLight ? 'bg-[#FAF8F5] border-stone-300 text-stone-900' : 'bg-[#121314] border-stone-800 text-[#FAF7F2]'
    }`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header - Strict Title: "آزمون غریزی" */}
        <div className="text-center space-y-4 mb-8">
          <div className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full border text-xs font-bold ${
            isLight ? 'bg-amber-100 border-amber-300 text-[#B87333]' : 'bg-[#1E2022] border-[#B87333]/40 text-[#B87333]'
          }`}>
            <HelpCircle className="w-4 h-4 text-[#B87333]" />
            <span>{t('quiz.badge')}</span>
          </div>
          <h2 className={`text-3xl sm:text-4xl font-extrabold ${isLight ? 'text-stone-900' : 'text-[#FAF7F2]'}`}>
            {t('quiz.title')}
          </h2>
          <p className={`text-sm sm:text-base max-w-xl mx-auto ${isLight ? 'text-stone-600' : 'text-stone-400'}`}>
            {t('quiz.subtitle')}
          </p>
        </div>

        {/* Mode Switcher Pills (Top of Card) */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <button
            onClick={() => {
              setActiveMode('simple');
              setShowResults(false);
            }}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeMode === 'simple'
                ? 'bg-[#B87333] text-white shadow-md shadow-[#B87333]/20'
                : isLight
                  ? 'bg-stone-200/80 hover:bg-stone-300 text-stone-700'
                  : 'bg-stone-800 hover:bg-stone-700 text-stone-300'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>{t('quiz.simpleQuizTitle', 'آزمون ساده (۵ سؤال)')}</span>
          </button>

          <button
            onClick={() => setActiveMode('advanced')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeMode === 'advanced'
                ? 'bg-[#B87333] text-white shadow-md shadow-[#B87333]/20'
                : isLight
                  ? 'bg-stone-200/80 hover:bg-stone-300 text-stone-700'
                  : 'bg-stone-800 hover:bg-stone-700 text-stone-300'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>{t('quiz.advancedQuizTitle', 'آزمون پیشرفته (۲۴ سناریو)')}</span>
          </button>
        </div>

        {/* Quiz Body Container */}
        <div className={`p-6 sm:p-8 rounded-3xl border shadow-2xl ${
          isLight ? 'bg-white border-stone-200' : 'bg-[#1E2022] border-stone-800'
        }`}>
          
          {/* ======================================================== */}
          {/* 1. SELECTION LANDING CARDS (if activeMode === 'select') */}
          {/* ======================================================== */}
          {activeMode === 'select' && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="text-center space-y-2 pb-4 border-b border-stone-500/20">
                <h3 className={`text-lg sm:text-xl font-black ${isLight ? 'text-stone-900' : 'text-[#FAF7F2]'}`}>
                  {t('quiz.modeSelectorTitle', 'انتخاب نوع آزمون')}
                </h3>
                <p className={`text-xs sm:text-sm ${isLight ? 'text-stone-600' : 'text-stone-400'}`}>
                  برای ارزیابی الگوهای تصمیم‌گیری و وضعیت اورانگوتانی، یکی از دو آزمون زیر را انتخاب کنید:
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                
                {/* Card 1: Simple Quiz */}
                <div className={`p-6 rounded-2xl border transition-all hover:shadow-xl flex flex-col justify-between space-y-4 ${
                  isLight ? 'bg-stone-50 border-stone-200 hover:border-amber-400' : 'bg-stone-900 border-stone-800 hover:border-amber-600'
                }`}>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-[#B87333] flex items-center justify-center">
                        <Zap className="w-5 h-5" />
                      </div>
                      <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-stone-200/80 dark:bg-stone-800 text-stone-600 dark:text-stone-300">
                        {t('quiz.simpleQuizBadge', 'سنجش سریع ۵ سناریویی')}
                      </span>
                    </div>

                    <h4 className={`text-base font-black ${isLight ? 'text-stone-900' : 'text-[#FAF7F2]'}`}>
                      {t('quiz.simpleQuizTitle', 'آزمون ساده (۵ سؤال)')}
                    </h4>

                    <p className={`text-xs sm:text-sm leading-relaxed ${isLight ? 'text-stone-600' : 'text-stone-400'}`}>
                      {t('quiz.simpleQuizDesc', 'پاسخ سریع به ۵ سناریوی کلیدی مدیریتی جهت آشنایی با الگوهای پایه تصمیم‌گیری غریزی.')}
                    </p>
                  </div>

                  <button
                    onClick={() => setActiveMode('simple')}
                    className="w-full py-3 rounded-xl bg-[#B87333] hover:bg-amber-600 text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  >
                    <span>{t('quiz.startSimpleBtn', 'شروع آزمون ساده (۵ سؤال)')}</span>
                    <BackIcon className="w-4 h-4" />
                  </button>
                </div>

                {/* Card 2: Advanced Quiz */}
                <div className={`p-6 rounded-2xl border transition-all hover:shadow-xl flex flex-col justify-between space-y-4 relative overflow-hidden ${
                  isLight ? 'bg-amber-50/50 border-amber-300 hover:border-[#B87333]' : 'bg-[#181A1C] border-[#B87333]/40 hover:border-[#B87333]'
                }`}>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#B87333] to-[#8B4513] text-white flex items-center justify-center shadow-md">
                        <Sparkles className="w-5 h-5" />
                      </div>
                      <span className="text-[11px] font-black px-2.5 py-1 rounded-full bg-[#B87333]/20 text-[#B87333] border border-[#B87333]/30">
                        {t('quiz.advancedQuizBadge', 'ارزیابی جامع ۸ بُعدی + اکشن‌پلان')}
                      </span>
                    </div>

                    <h4 className={`text-base font-black ${isLight ? 'text-stone-900' : 'text-[#FAF7F2]'}`}>
                      {t('quiz.advancedQuizTitle', 'آزمون پیشرفته (۲۴ سناریو)')}
                    </h4>

                    <p className={`text-xs sm:text-sm leading-relaxed ${isLight ? 'text-stone-600' : 'text-stone-400'}`}>
                      {t('quiz.advancedQuizDesc', 'ارزیابی عمیق در ۸ بُعد سازمان همراه با نمودار راداری، شاخص سازگاری و اکشن‌پلان ۳ گام +۳.')}
                    </p>
                  </div>

                  <button
                    onClick={() => setActiveMode('advanced')}
                    className="w-full py-3 rounded-xl bg-[#B87333] hover:bg-amber-600 text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#B87333]/25"
                  >
                    <span>{t('quiz.startAdvancedBtn', 'شروع آزمون پیشرفته (۲۴ سناریو)')}</span>
                    <BackIcon className="w-4 h-4" />
                  </button>
                </div>

              </div>
            </motion.div>
          )}

          {/* ======================================================== */}
          {/* 2. ADVANCED 24-SCENARIO ASSESSMENT RUNNER */}
          {/* ======================================================== */}
          {activeMode === 'advanced' && (
            <AdvancedAssessmentRunner
              onAddToCart={onAddToCart}
              onBackToModeSelect={() => setActiveMode('select')}
              theme={theme}
            />
          )}

          {/* ======================================================== */}
          {/* 3. SIMPLE 5-QUESTION QUIZ RUNNER */}
          {/* ======================================================== */}
          {activeMode === 'simple' && (
            <div>
              {!showResults ? (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentQuestionIndex}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-8"
                  >
                    
                    {/* Progress Header (No timer, no time limit) */}
                    <div className="flex items-center justify-between pb-4 border-b border-stone-500/20">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#B87333]">
                          {t('quiz.progressText', {
                            num: isPersian ? toPersianDigits(currentQuestionIndex + 1) : currentQuestionIndex + 1,
                            total: isPersian ? toPersianDigits(questions.length) : questions.length
                          })}
                        </span>
                        <span className="text-[11px] text-stone-400">
                          (آزمون ساده)
                        </span>
                      </div>

                      <div className={`w-36 h-2 rounded-full overflow-hidden ${isLight ? 'bg-stone-200' : 'bg-stone-800'}`}>
                        <div
                          className="bg-[#B87333] h-full transition-all duration-300"
                          style={{ width: `${((currentQuestionIndex + 1) / Math.max(questions.length, 1)) * 100}%` }}
                        />
                      </div>
                    </div>

                    {/* Question Text */}
                    <div className="space-y-2">
                      <span className="text-xs text-stone-400 font-medium block">
                        {t('quiz.chapterRefPrefix')} {currentQuestion.chapterRef}
                      </span>
                      <h3 className={`text-lg sm:text-xl font-bold leading-relaxed ${
                        isLight ? 'text-stone-900' : 'text-[#FAF7F2]'
                      }`}>
                        {currentQuestion.question}
                      </h3>
                    </div>

                    {/* Options List */}
                    <div className="space-y-3">
                      {(currentQuestion.options || []).map((option: any, idx: number) => {
                        const isSelected = selectedAnswers[currentQuestionIndex] === idx;
                        return (
                          <motion.button
                            key={idx}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            onClick={() => handleSelectOption(idx)}
                            className={`w-full p-4 rounded-2xl text-start transition-all flex items-start gap-3 border cursor-pointer ${
                              isSelected
                                ? 'bg-[#B87333]/15 border-[#B87333] font-bold shadow-md'
                                : isLight
                                  ? 'bg-stone-50 border-stone-200 hover:bg-stone-100 text-stone-800'
                                  : 'bg-[#181A1C] border-stone-800 hover:border-stone-700 text-stone-300'
                            }`}
                          >
                            <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                              isSelected ? 'border-[#B87333] bg-[#B87333]' : 'border-stone-400'
                            }`}>
                              {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                            </div>
                            <span className="text-sm font-medium leading-relaxed">
                              {option.text}
                            </span>
                          </motion.button>
                        );
                      })}
                    </div>

                    {/* Quiz Navigation Buttons */}
                    <div className="flex items-center justify-between pt-6 border-t border-stone-500/20">
                      <button
                        onClick={handlePrev}
                        disabled={currentQuestionIndex === 0}
                        className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                          currentQuestionIndex === 0
                            ? 'opacity-40 cursor-not-allowed border-stone-300 text-stone-400'
                            : isLight
                              ? 'border-stone-300 text-stone-700 hover:bg-stone-100'
                              : 'border-stone-700 text-stone-300 hover:bg-stone-800'
                        }`}
                      >
                        {t('quiz.prevBtn')}
                      </button>

                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={handleNext}
                        disabled={selectedAnswers[currentQuestionIndex] === -1}
                        className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                          selectedAnswers[currentQuestionIndex] === -1
                            ? 'opacity-50 cursor-not-allowed bg-stone-400 text-white'
                            : 'bg-[#B87333] hover:bg-amber-600 text-white shadow-lg shadow-[#B87333]/20'
                        }`}
                      >
                        <span>{currentQuestionIndex === questions.length - 1 ? t('quiz.viewResultsBtn') : t('quiz.nextBtn')}</span>
                        <BackIcon className="w-4 h-4" />
                      </motion.button>
                    </div>

                  </motion.div>
                </AnimatePresence>
              ) : (
                /* Simple Quiz Results Breakdown View */
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-8"
                >
                  
                  <div className="text-center space-y-3 pb-6 border-b border-stone-500/20">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#B87333]/20 text-[#B87333] font-black text-2xl border border-[#B87333]/40 shadow-inner">
                      {isPersian ? `%${toPersianDigits(resultData?.percentage)}` : `${resultData?.percentage}%`}
                    </div>
                    <h3 className={`text-2xl font-black ${isLight ? 'text-stone-900' : 'text-[#FAF7F2]'}`}>
                      {t('quiz.resultScoreTitle', {
                        percentage: isPersian ? toPersianDigits(resultData?.percentage) : resultData?.percentage
                      })}
                    </h3>
                    <div className={`p-4 rounded-2xl border font-bold text-sm max-w-lg mx-auto ${statusDetails?.color}`}>
                      {statusDetails?.title}
                    </div>
                  </div>

                  {/* Diagnostic Description */}
                  <div className={`p-5 rounded-2xl border space-y-3 ${
                    isLight ? 'bg-stone-50 border-stone-200' : 'bg-stone-900/90 border-stone-800'
                  }`}>
                    <h4 className={`text-sm font-bold ${isLight ? 'text-stone-900' : 'text-[#FAF7F2]'}`}>{t('quiz.resultAnalysisTitle')}</h4>
                    <p className={`text-xs sm:text-sm leading-relaxed ${isLight ? 'text-stone-700' : 'text-stone-300'}`}>
                      {statusDetails?.description}
                    </p>
                  </div>

                  {/* Recommended Action & Book Link */}
                  <div className="p-5 rounded-2xl bg-[#B87333]/10 border border-[#B87333]/30 space-y-3">
                    <div className="flex items-center gap-2 text-[#B87333] font-bold text-sm">
                      <BookOpen className="w-5 h-5" />
                      <span>{t('quiz.resultSolutionTitle')}</span>
                    </div>
                    <p className={`text-xs sm:text-sm leading-relaxed ${isLight ? 'text-stone-800' : 'text-stone-200'}`}>
                      {statusDetails?.recommendation}
                    </p>
                  </div>

                  {/* Promotion to Advanced Quiz */}
                  <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-3 ${
                    isLight ? 'bg-amber-50 border-amber-200' : 'bg-stone-900 border-stone-800'
                  }`}>
                    <div className="space-y-1 text-center sm:text-start">
                      <span className="text-xs font-black text-[#B87333] flex items-center gap-1.5 justify-center sm:justify-start">
                        <Sparkles className="w-4 h-4" />
                        <span>می‌خواهید عارضه‌یابی جامع‌تر ۸ بُعدی دریافت کنید؟</span>
                      </span>
                      <p className="text-[11px] text-stone-500">
                        آزمون پیشرفته ۲۴ سناریویی، نقاط داغ و اکشن‌پلان اختصاصی +۳ را ارائه می‌دهد.
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveMode('advanced')}
                      className="px-4 py-2 rounded-xl bg-[#B87333] hover:bg-amber-600 text-white font-bold text-xs shrink-0 cursor-pointer"
                    >
                      ورود به آزمون ۲۴ سناریویی
                    </button>
                  </div>

                  {/* Actions: Retake Quiz or Buy Bundle */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-stone-500/20">
                    <button
                      onClick={resetSimpleQuiz}
                      className={`px-4 py-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 cursor-pointer ${
                        isLight ? 'border-stone-300 text-stone-700 hover:bg-stone-100' : 'border-stone-700 text-stone-300 hover:bg-stone-800'
                      }`}
                    >
                      <RefreshCw className="w-4 h-4 text-stone-400" />
                      <span>{t('quiz.retakeBtn')}</span>
                    </button>

                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => onAddToCart('bundle-full')}
                      className="px-6 py-3 rounded-xl bg-[#B87333] hover:bg-amber-600 text-white font-bold text-xs shadow-xl flex items-center gap-2 cursor-pointer"
                    >
                      <span>{t('quiz.orderBundleBtn')}</span>
                      <BackIcon className="w-4 h-4" />
                    </motion.button>
                  </div>

                </motion.div>
              )}
            </div>
          )}

        </div>

      </div>
    </section>
  );
};
