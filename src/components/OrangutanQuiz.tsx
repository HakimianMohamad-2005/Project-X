import React, { useState } from 'react';
import { HelpCircle, CheckCircle2, RefreshCw, BookOpen, AlertOctagon, ArrowLeft, Award, Sparkles } from 'lucide-react';
import { QUIZ_QUESTIONS } from '../data/bookData';
import { toPersianDigits } from '../utils/persian';
import { ThemeMode } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';

interface OrangutanQuizProps {
  onAddToCart: (bookId: string) => void;
  theme?: ThemeMode;
}

export const OrangutanQuiz: React.FC<OrangutanQuizProps> = ({ onAddToCart, theme = 'dark' }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>(Array(QUIZ_QUESTIONS.length).fill(-1));
  const [showResults, setShowResults] = useState(false);
  const isLight = theme === 'light';

  const currentQuestion = QUIZ_QUESTIONS[currentQuestionIndex];

  const handleSelectOption = (optionIndex: number) => {
    const updated = [...selectedAnswers];
    updated[currentQuestionIndex] = optionIndex;
    setSelectedAnswers(updated);
  };

  const handleNext = () => {
    if (currentQuestionIndex < QUIZ_QUESTIONS.length - 1) {
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

  const resetQuiz = () => {
    setSelectedAnswers(Array(QUIZ_QUESTIONS.length).fill(-1));
    setCurrentQuestionIndex(0);
    setShowResults(false);
  };

  // Calculate Total Score (Max 50 points = 100%)
  const calculateTotalScore = () => {
    let totalScore = 0;
    selectedAnswers.forEach((ansIndex, qIdx) => {
      if (ansIndex !== -1) {
        totalScore += QUIZ_QUESTIONS[qIdx].options[ansIndex].score;
      }
    });
    const percentage = Math.round((totalScore / 50) * 100);
    return { score: totalScore, percentage };
  };

  const getStatusDetails = (percentage: number) => {
    if (percentage <= 30) {
      return {
        title: 'وضعیت اورانگوتانی شدید (مدیریت هیجانی و غریزی)',
        color: 'text-red-500 border-red-300 bg-red-50',
        description: 'سازمان شما دردها و فشارها را حس می‌کند اما علت ریشه‌ای را نمی‌فهمد. تصمیمات بر اساس حس ششم، داد و فریاد و وابستگی به حافظه شخصی چند فرد گرفته می‌شود. خطاهای تکراری هزینه‌های سنگینی ایجاد می‌کنند.',
        recommendation: 'مطالعه ضروری جلد اول کتاب (فصل‌های ۱ تا ۴: چگونگی دیدن کف کارخانه بدون روتوش و ثبت آبکش ۴ صبح).'
      };
    } else if (percentage <= 60) {
      return {
        title: 'مدیریت غریزی نوسانی (نیمه‌سیستمی با وابستگی بالا)',
        color: 'text-amber-600 border-amber-300 bg-amber-50',
        description: 'شما برخی ابزارها و فرم‌ها را دارید اما با رفتن یا مرخصی نیروهای کلیدی، اختلالات جدی ایجاد می‌شود. هنوز بخشی از سود سازمان در نشتهای ناپدید انبار و فاکتورهای سمی فروش هدر می‌رود.',
        recommendation: 'مطالعه جلد اول و دوم (کدگذاری انبارها، حذف فاکتور سمی و فرمول محاسبه سود واقعی).'
      };
    } else if (percentage <= 80) {
      return {
        title: 'در مسیر سیستم‌سازی +۳ (سازمان رو به رشد)',
        color: 'text-emerald-600 border-emerald-300 bg-emerald-50',
        description: 'بخش زیادی از فرایندهای شما شفاف است اما برای ماندگاری نیازمند تبدیل تمام دانش‌ها به چک‌لیست‌های زنده و تربیت «مدیر معلمان» در طبقات مختلف سازمان هستید.',
        recommendation: 'مطالعه جلد دوم (فصل‌های ۳۹ و ۴۰: تالار چهل اشتباه و چهل درس ۴۰ ساله).'
      };
    } else {
      return {
        title: 'سازمان خودآموز و ماندگار +۳ (عالی)',
        color: 'text-teal-600 border-teal-300 bg-teal-50',
        description: 'تبریک! سازمان شما حافظه ماندگار دارد، از داده زنده استفاده می‌کند و وابسته به حضور فیزیکی مدیرعامل نیست. شما مفاهیم کتاب اورانگوتان +۳ را به خوبی در عمل پیاده کرده‌اید.',
        recommendation: 'استفاده از جلد دوم جهت پیاده‌سازی هوش مصنوعی به عنوان دستیار تصمیم‌گیری.'
      };
    }
  };

  const resultData = showResults ? calculateTotalScore() : null;
  const statusDetails = resultData ? getStatusDetails(resultData.percentage) : null;

  return (
    <section id="quiz" className={`py-16 md:py-20 transition-colors duration-300 border-b ${
      isLight ? 'bg-[#FAF8F5] border-stone-300 text-stone-900' : 'bg-[#121314] border-stone-800 text-[#FAF7F2]'
    }`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center space-y-4 mb-12">
          <div className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full border text-xs font-bold ${
            isLight ? 'bg-amber-100 border-amber-300 text-[#B87333]' : 'bg-[#1E2022] border-[#B87333]/40 text-[#B87333]'
          }`}>
            <HelpCircle className="w-4 h-4 text-[#B87333]" />
            <span>آزمون خودارزیابی مدیران</span>
          </div>
          <h2 className={`text-3xl sm:text-4xl font-extrabold ${isLight ? 'text-stone-900' : 'text-[#FAF7F2]'}`}>
            سنجشگر آنلاین <span className="text-[#B87333]">رفتار غریزی سازمان</span>
          </h2>
          <p className={`text-sm sm:text-base max-w-xl mx-auto ${isLight ? 'text-stone-600' : 'text-stone-400'}`}>
            پاسخ به ۵ سناریوی واقعی مدیریتی و محاسبه درصد ابتلا به «وضعیت اورانگوتانی» همراه با راهکارهای اختصاصی کتاب.
          </p>
        </div>

        {/* Quiz Body Container */}
        <div className={`p-6 sm:p-8 rounded-3xl border shadow-2xl ${
          isLight ? 'bg-white border-stone-200' : 'bg-[#1E2022] border-stone-800'
        }`}>
          
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
                
                {/* Progress Header */}
                <div className="flex items-center justify-between pb-4 border-b border-stone-500/20">
                  <span className="text-xs font-bold text-[#B87333]">
                    پرسش {toPersianDigits(currentQuestionIndex + 1)} از {toPersianDigits(QUIZ_QUESTIONS.length)}
                  </span>
                  <div className={`w-36 h-2 rounded-full overflow-hidden ${isLight ? 'bg-stone-200' : 'bg-stone-800'}`}>
                    <div
                      className="bg-[#B87333] h-full transition-all duration-300"
                      style={{ width: `${((currentQuestionIndex + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Question Text */}
                <div className="space-y-2">
                  <span className="text-xs text-stone-400 font-medium block">
                    مرجع کتاب: {currentQuestion.chapterRef}
                  </span>
                  <h3 className={`text-lg sm:text-xl font-bold leading-relaxed ${
                    isLight ? 'text-stone-900' : 'text-[#FAF7F2]'
                  }`}>
                    {currentQuestion.question}
                  </h3>
                </div>

                {/* Options List */}
                <div className="space-y-3">
                  {currentQuestion.options.map((option, idx) => {
                    const isSelected = selectedAnswers[currentQuestionIndex] === idx;
                    return (
                      <motion.button
                        key={idx}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => handleSelectOption(idx)}
                        className={`w-full p-4 rounded-2xl text-right transition-all flex items-start gap-3 border ${
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
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                      currentQuestionIndex === 0
                        ? 'opacity-40 cursor-not-allowed border-stone-300 text-stone-400'
                        : isLight
                          ? 'border-stone-300 text-stone-700 hover:bg-stone-100'
                          : 'border-stone-700 text-stone-300 hover:bg-stone-800'
                    }`}
                  >
                    قبلی
                  </button>

                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleNext}
                    disabled={selectedAnswers[currentQuestionIndex] === -1}
                    className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                      selectedAnswers[currentQuestionIndex] === -1
                        ? 'opacity-50 cursor-not-allowed bg-stone-400 text-white'
                        : 'bg-[#B87333] hover:bg-amber-600 text-white shadow-lg shadow-[#B87333]/20'
                    }`}
                  >
                    <span>{currentQuestionIndex === QUIZ_QUESTIONS.length - 1 ? 'مشاهده نتیجه آنالیز' : 'پرسش بعدی'}</span>
                    <ArrowLeft className="w-4 h-4" />
                  </motion.button>
                </div>

              </motion.div>
            </AnimatePresence>
          ) : (
            /* Results Breakdown View */
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="space-y-8"
            >
              
              <div className="text-center space-y-3 pb-6 border-b border-stone-500/20">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#B87333]/20 text-[#B87333] font-black text-2xl border border-[#B87333]/40 shadow-inner">
                  ٪{toPersianDigits(resultData?.percentage)}
                </div>
                <h3 className={`text-2xl font-black ${isLight ? 'text-stone-900' : 'text-[#FAF7F2]'}`}>
                  امتیاز سیستم‌سازی سازمان شما: {toPersianDigits(resultData?.percentage)}٪
                </h3>
                <div className={`p-4 rounded-2xl border font-bold text-sm max-w-lg mx-auto ${statusDetails?.color}`}>
                  {statusDetails?.title}
                </div>
              </div>

              {/* Diagnostic Description */}
              <div className={`p-5 rounded-2xl border space-y-3 ${
                isLight ? 'bg-stone-50 border-stone-200' : 'bg-stone-900/90 border-stone-800'
              }`}>
                <h4 className={`text-sm font-bold ${isLight ? 'text-stone-900' : 'text-[#FAF7F2]'}`}>تحلیل رفتاری سازمان:</h4>
                <p className={`text-xs sm:text-sm leading-relaxed ${isLight ? 'text-stone-700' : 'text-stone-300'}`}>
                  {statusDetails?.description}
                </p>
              </div>

              {/* Recommended Action & Book Link */}
              <div className="p-5 rounded-2xl bg-[#B87333]/10 border border-[#B87333]/30 space-y-3">
                <div className="flex items-center gap-2 text-[#B87333] font-bold text-sm">
                  <BookOpen className="w-5 h-5" />
                  <span>راهکار پیشنهادی علی‌اصغر حکیمیان:</span>
                </div>
                <p className={`text-xs sm:text-sm leading-relaxed ${isLight ? 'text-stone-800' : 'text-stone-200'}`}>
                  {statusDetails?.recommendation}
                </p>
              </div>

              {/* Actions: Retake Quiz or Buy Bundle */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-stone-500/20">
                <button
                  onClick={resetQuiz}
                  className={`px-4 py-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 ${
                    isLight ? 'border-stone-300 text-stone-700 hover:bg-stone-100' : 'border-stone-700 text-stone-300 hover:bg-stone-800'
                  }`}
                >
                  <RefreshCw className="w-4 h-4 text-stone-400" />
                  <span>آزمون مجدد</span>
                </button>

                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => onAddToCart('bundle-full')}
                  className="px-6 py-3 rounded-xl bg-[#B87333] hover:bg-amber-600 text-white font-bold text-xs shadow-xl flex items-center gap-2"
                >
                  <span>سفارش دوره کامل ۲ جلدی با تخفیف</span>
                  <ArrowLeft className="w-4 h-4" />
                </motion.button>
              </div>

            </motion.div>
          )}

        </div>

      </div>
    </section>
  );
};
