import React, { useState } from 'react';
import { Eye, Target, ShieldCheck, Zap, ArrowLeft, CheckCircle2, AlertTriangle, Lightbulb } from 'lucide-react';
import { FRAMEWORK_STEPS } from '../data/bookData';
import { toPersianDigits } from '../utils/persian';
import { ThemeMode } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface FrameworkExplorerProps {
  theme?: ThemeMode;
}

export const FrameworkExplorer: React.FC<FrameworkExplorerProps> = ({ theme = 'dark' }) => {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const isLight = theme === 'light';

  const currentStep = FRAMEWORK_STEPS[activeStepIndex];

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'Eye':
        return <Eye className="w-6 h-6 text-[#B87333]" />;
      case 'Target':
        return <Target className="w-6 h-6 text-[#B87333]" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-6 h-6 text-[#B87333]" />;
      case 'Zap':
        return <Zap className="w-6 h-6 text-amber-400" />;
      default:
        return <Eye className="w-6 h-6 text-[#B87333]" />;
    }
  };

  return (
    <section id="framework" className={`py-16 md:py-20 transition-colors duration-300 border-b ${
      isLight ? 'bg-[#FAF8F5] border-stone-300 text-stone-900' : 'bg-[#121314] border-stone-800 text-[#FAF7F2]'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <div className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full border text-xs font-bold ${
            isLight ? 'bg-amber-100/80 border-amber-300 text-[#B87333]' : 'bg-[#1E2022] border-[#B87333]/30 text-[#B87333]'
          }`}>
            <span>مدل مفهومی امضایی کتاب «اورانگوتان +۳»</span>
          </div>
          <h2 className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${
            isLight ? 'text-stone-900' : 'text-[#FAF7F2]'
          }`}>
            سیمولاتور تعاملی مدل <span className="text-[#B87333]">+۳</span>
          </h2>
          <p className={`text-sm sm:text-base leading-relaxed ${
            isLight ? 'text-stone-600' : 'text-stone-400'
          }`}>
            فرمول سه گامی علی‌اصغر حکیمیان برای نجات سازمان‌ها از رفتارهای غریزی، خطاهای تکراری و وابستگی مطلق به حافظه اشخاص.
          </p>
        </div>

        {/* Step Selector Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {FRAMEWORK_STEPS.map((step, idx) => {
            const isActive = idx === activeStepIndex;
            return (
              <motion.button
                key={step.stepNumber}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveStepIndex(idx)}
                className={`p-4 rounded-2xl border text-right transition-all flex flex-col justify-between h-36 relative ${
                  isActive
                    ? isLight
                      ? 'bg-white border-[#B87333] shadow-xl ring-2 ring-[#B87333]/30'
                      : 'bg-[#1E2022] border-[#B87333] shadow-xl shadow-[#B87333]/10 ring-2 ring-[#B87333]/40'
                    : isLight
                      ? 'bg-stone-100 border-stone-200 hover:bg-stone-200/60'
                      : 'bg-[#181A1C] border-stone-800 hover:border-stone-700 hover:bg-[#1E2022]/60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className={`p-2 rounded-xl ${
                    isActive ? 'bg-[#B87333]/20' : isLight ? 'bg-stone-200' : 'bg-stone-800'
                  }`}>
                    {renderIcon(step.iconName)}
                  </div>
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                    isActive ? 'bg-[#B87333] text-white' : isLight ? 'bg-stone-200 text-stone-700' : 'bg-stone-800 text-stone-400'
                  }`}>
                    {step.stepNumber <= 3 ? `گام ${toPersianDigits(step.stepNumber)}` : '+۱ پس‌لرزه'}
                  </span>
                </div>
                <div>
                  <h3 className={`text-sm font-bold truncate ${
                    isActive ? 'text-[#B87333]' : isLight ? 'text-stone-900' : 'text-[#FAF7F2]'
                  }`}>
                    {step.title}
                  </h3>
                  <p className="text-[11px] text-stone-400 truncate mt-0.5">
                    {step.tag}
                  </p>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Active Step Detailed Animated Display */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStepIndex}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className={`p-6 sm:p-8 rounded-3xl border shadow-2xl space-y-8 ${
              isLight ? 'bg-white border-stone-200 shadow-stone-200/50' : 'bg-[#1E2022] border-stone-800'
            }`}
          >
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-stone-500/20">
              <div className="flex items-center gap-4">
                <div className="p-3.5 rounded-2xl bg-[#B87333]/20 border border-[#B87333]/30">
                  {renderIcon(currentStep.iconName)}
                </div>
                <div>
                  <span className="text-xs font-bold text-[#B87333] uppercase tracking-wider block">
                    {currentStep.tag}
                  </span>
                  <h3 className={`text-2xl font-black ${isLight ? 'text-stone-900' : 'text-[#FAF7F2]'}`}>
                    {currentStep.title}
                  </h3>
                </div>
              </div>
              <p className={`text-sm font-semibold md:max-w-md ${isLight ? 'text-stone-700' : 'text-stone-300'}`}>
                {currentStep.subtitle}
              </p>
            </div>

            {/* Description Paragraph */}
            <div className={`text-sm sm:text-base leading-relaxed font-normal ${
              isLight ? 'text-stone-700' : 'text-stone-300'
            }`}>
              {currentStep.description}
            </div>

            {/* Comparison Grid: Instinctive vs +3 Approach */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              
              {/* Orangutan Instinctive Box */}
              <div className={`p-5 rounded-2xl border space-y-3 ${
                isLight ? 'bg-red-50/80 border-red-200' : 'bg-[#8B2626]/10 border-[#8B2626]/40'
              }`}>
                <div className="flex items-center gap-2 text-red-600 font-bold text-sm">
                  <AlertTriangle className="w-5 h-5 shrink-0" />
                  <span>رویکرد غریزی (وضعیت اورانگوتانی)</span>
                </div>
                <p className={`text-xs sm:text-sm leading-relaxed ${isLight ? 'text-stone-800' : 'text-stone-300'}`}>
                  {currentStep.orangutanDiff}
                </p>
              </div>

              {/* +3 Systemic Approach Box */}
              <div className={`p-5 rounded-2xl border space-y-3 ${
                isLight ? 'bg-emerald-50/80 border-emerald-200' : 'bg-[#2E5A44]/20 border-[#2E5A44]/50'
              }`}>
                <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <span>رویکرد سیستمی مدل +۳ (علی‌اصغر حکیمیان)</span>
                </div>
                <p className={`text-xs sm:text-sm leading-relaxed ${isLight ? 'text-stone-800' : 'text-stone-300'}`}>
                  {currentStep.plus3Diff}
                </p>
              </div>

            </div>

            {/* Practical Application Banner */}
            <div className={`p-4 rounded-2xl border flex items-center gap-3 ${
              isLight ? 'bg-stone-50 border-stone-200' : 'bg-stone-900/90 border-stone-800'
            }`}>
              <Lightbulb className="w-5 h-5 text-amber-500 shrink-0" />
              <div className={`text-xs sm:text-sm ${isLight ? 'text-stone-700' : 'text-stone-300'}`}>
                <strong className={isLight ? 'text-stone-900' : 'text-[#FAF7F2]'}>پیاده‌سازی در کارخانه:</strong> تمام مراحل مدل +۳ با فرمول‌های واقعی و چک‌لیست‌های عملیاتی در جلد اول و دوم کتاب تشریح گردیده‌اند.
              </div>
            </div>

          </motion.div>
        </AnimatePresence>

      </div>
    </section>
  );
};
