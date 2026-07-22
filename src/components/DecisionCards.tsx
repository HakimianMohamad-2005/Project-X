import React, { useState } from 'react';
import { Calculator, Droplets, ShieldAlert, Users, RotateCw, CheckSquare, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { DECISION_CARDS } from '../data/bookData';
import { DecisionCard, ThemeMode } from '../types';
import { toPersianDigits, formatCurrency } from '../utils/persian';
import { motion, AnimatePresence } from 'motion/react';

interface DecisionCardsProps {
  theme?: ThemeMode;
}

export const DecisionCards: React.FC<DecisionCardsProps> = ({ theme = 'dark' }) => {
  const [activeFlippedId, setActiveFlippedId] = useState<string | null>(null);
  const isLight = theme === 'light';

  // Hidden Cost Calculator state for Card 1
  const [directCost, setDirectCost] = useState<number>(100000000); // 100M Toman

  // Bleed Audit state for Card 2
  const [checkedBleedItems, setCheckedBleedItems] = useState<boolean[]>([false, false, false, false, false, false]);

  const toggleFlip = (id: string) => {
    setActiveFlippedId(activeFlippedId === id ? null : id);
  };

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'Calculator':
        return <Calculator className="w-6 h-6 text-[#B87333]" />;
      case 'Droplets':
        return <Droplets className="w-6 h-6 text-red-500" />;
      case 'ShieldAlert':
        return <ShieldAlert className="w-6 h-6 text-amber-500" />;
      case 'Users':
        return <Users className="w-6 h-6 text-[#B87333]" />;
      default:
        return <Calculator className="w-6 h-6 text-[#B87333]" />;
    }
  };

  const toggleBleedCheck = (idx: number) => {
    const updated = [...checkedBleedItems];
    updated[idx] = !updated[idx];
    setCheckedBleedItems(updated);
  };

  const totalBleedRiskCount = checkedBleedItems.filter(Boolean).length;

  return (
    <section id="cards" className={`py-16 md:py-20 transition-colors duration-300 border-b ${
      isLight ? 'bg-[#FAF8F5] border-stone-300 text-stone-900' : 'bg-[#121314] border-stone-800 text-[#FAF7F2]'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <div className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full border text-xs font-bold ${
            isLight ? 'bg-amber-100 border-amber-300 text-[#B87333]' : 'bg-[#1E2022] border-[#B87333]/40 text-[#B87333]'
          }`}>
            <Calculator className="w-4 h-4 text-[#B87333]" />
            <span>ابزارهای کاربردی برای میز مدیران</span>
          </div>
          <h2 className={`text-3xl sm:text-4xl font-extrabold ${isLight ? 'text-stone-900' : 'text-[#FAF7F2]'}`}>
            کارت‌های تعاملی <span className="text-[#B87333]">تصمیم مدیریتی</span>
          </h2>
          <p className={`text-sm sm:text-base leading-relaxed ${isLight ? 'text-stone-600' : 'text-stone-400'}`}>
            ۴ ابزار و چک‌لیست کاربردی جلد اول و دوم کتاب جهت سنجش هزینه‌های ناپدید تصمیم، کشف خونریزی مالی و پروتکل بحران.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {DECISION_CARDS.map((card) => {
            const isExpanded = activeFlippedId === card.id;

            return (
              <motion.div
                layout
                key={card.id}
                className={`p-6 sm:p-8 rounded-3xl border transition-all space-y-6 shadow-xl ${
                  isExpanded
                    ? 'border-[#B87333] ring-2 ring-[#B87333]/30'
                    : isLight
                      ? 'bg-white border-stone-200 hover:border-[#B87333]/60'
                      : 'bg-[#1E2022] border-stone-800 hover:border-stone-700'
                }`}
              >
                {/* Card Top Banner */}
                <div className="flex items-center justify-between pb-4 border-b border-stone-500/20">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-2xl border ${isLight ? 'bg-amber-50 border-amber-200' : 'bg-stone-900 border-stone-800'}`}>
                      {renderIcon(card.iconName)}
                    </div>
                    <div>
                      <span className="text-[11px] font-bold text-[#B87333] block">
                        {card.categoryLabel}
                      </span>
                      <h3 className={`text-lg font-bold ${isLight ? 'text-stone-900' : 'text-[#FAF7F2]'}`}>
                        {card.title}
                      </h3>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toggleFlip(card.id)}
                    className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                      isLight
                        ? 'bg-stone-100 hover:bg-stone-200 text-stone-800 border-stone-300'
                        : 'bg-stone-900 hover:bg-stone-800 text-stone-300 border-stone-800'
                    }`}
                  >
                    <span>{isExpanded ? 'بستن پروتکل' : 'مشاهده چک‌لیست'}</span>
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </motion.button>
                </div>

                {/* Subtitle & Front Summary */}
                <p className={`text-xs sm:text-sm leading-relaxed font-normal ${isLight ? 'text-stone-700' : 'text-stone-300'}`}>
                  {card.frontSummary}
                </p>

                {/* Interactive Tool / Expanded Checklist */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="pt-4 border-t border-stone-500/20 space-y-6"
                    >
                      
                      <div className="space-y-3">
                        <h4 className={`text-sm font-bold flex items-center gap-2 ${isLight ? 'text-stone-900' : 'text-[#FAF7F2]'}`}>
                          <Sparkles className="w-4 h-4 text-[#B87333]" />
                          <span>{card.backProtocol}</span>
                        </h4>

                        <ul className="space-y-2">
                          {card.actionableSteps.map((step, idx) => (
                            <li
                              key={idx}
                              className={`p-3 rounded-2xl border text-xs leading-relaxed flex items-start gap-2 ${
                                isLight ? 'bg-stone-50 border-stone-200 text-stone-800' : 'bg-stone-900/90 border-stone-800 text-stone-300'
                              }`}
                            >
                              <span className="w-2 h-2 rounded-full bg-[#B87333] shrink-0 mt-1.5" />
                              <span>{step}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Interactive Embedded Calculators per Tool Type */}
                      {card.toolType === 'cost_calc' && (
                        <div className={`p-4 rounded-2xl border space-y-4 ${
                          isLight ? 'bg-amber-50/60 border-amber-200' : 'bg-stone-900 border-stone-800'
                        }`}>
                          <span className="text-xs font-bold text-[#B87333] block">محاسبه‌گر آنلاین هزینه واقعی تصمیم:</span>
                          
                          <div className="space-y-2">
                            <label className={`text-[11px] block ${isLight ? 'text-stone-700' : 'text-stone-400'}`}>
                              هزینه مستقیم پروژه (تومان):
                            </label>
                            <input
                              type="number"
                              value={directCost}
                              onChange={(e) => setDirectCost(Number(e.target.value) || 0)}
                              className={`w-full px-3 py-2 rounded-xl border text-xs font-medium ${
                                isLight ? 'bg-white border-stone-300 text-stone-900' : 'bg-[#121314] border-stone-700 text-[#FAF7F2]'
                              }`}
                            />
                          </div>

                          <div className={`p-3 rounded-xl border text-xs space-y-1 ${
                            isLight ? 'bg-white border-amber-200' : 'bg-[#121314] border-stone-800'
                          }`}>
                            <div className="flex items-center justify-between text-stone-600">
                              <span>تخمین حداقل هزینه واقعی با هزینه‌های ناپدید:</span>
                              <span className="text-[#B87333] font-bold">
                                {formatCurrency(directCost * 2.2)}
                              </span>
                            </div>
                            <p className="text-[10px] text-stone-400">
                              *شامل هزینه فرصت از دست رفته، خطای اولیه آموزش و اصلاح اثرات جانبی.
                            </p>
                          </div>
                        </div>
                      )}

                      {card.toolType === 'bleed_audit' && (
                        <div className={`p-4 rounded-2xl border space-y-3 ${
                          isLight ? 'bg-red-50/60 border-red-200' : 'bg-stone-900 border-stone-800'
                        }`}>
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-red-500">چک‌لیست نشت سود انبار:</span>
                            <span className="text-xs font-bold text-stone-400">
                              {toPersianDigits(totalBleedRiskCount)} از ۶ مورد شناسایی شد
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {card.actionableSteps.map((step, idx) => (
                              <button
                                key={idx}
                                onClick={() => toggleBleedCheck(idx)}
                                className={`p-2.5 rounded-xl border text-right text-[11px] font-medium transition-all flex items-center justify-between ${
                                  checkedBleedItems[idx]
                                    ? 'bg-red-500/20 border-red-500 text-red-700 font-bold'
                                    : isLight
                                      ? 'bg-white border-stone-200 text-stone-700 hover:bg-stone-100'
                                      : 'bg-[#121314] border-stone-800 text-stone-400 hover:border-stone-700'
                                }`}
                              >
                                <span className="truncate">{step}</span>
                                <CheckSquare className={`w-4 h-4 shrink-0 ${checkedBleedItems[idx] ? 'text-red-500' : 'text-stone-400'}`} />
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                    </motion.div>
                  )}
                </AnimatePresence>

              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
