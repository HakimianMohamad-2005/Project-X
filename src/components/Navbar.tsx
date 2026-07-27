import React, { useState } from 'react';
import { ShoppingBag, Menu, X, BookOpen, Sun, Moon, Sparkles, Truck, FileText, Award } from 'lucide-react';
import { ActiveTab, ThemeMode } from '../types';
import { toPersianDigits } from '../utils/persian';
import { motion } from 'motion/react';

interface NavbarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  theme: ThemeMode;
  onToggleTheme: () => void;
  cartCount: number;
  onOpenCart: () => void;
  onOpenTracking: () => void;
  onOpenSamplePdf: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  theme,
  onToggleTheme,
  cartCount,
  onOpenCart,
  onOpenTracking,
  onOpenSamplePdf,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isLight = theme === 'light';

  const navItems: { id: ActiveTab; label: string; icon?: string }[] = [
    { id: 'books', label: 'معرفی و خرید کتاب' },
    { id: 'framework', label: 'مدل +۳' },
    { id: 'quiz', label: 'آزمون غریزی' },
    { id: 'case-studies', label: 'پرونده‌های صنعت' },
    { id: 'cards', label: 'کارت‌های تصمیم' },
    { id: 'mistakes-lessons', label: '۴۰ اشتباه و درس' },
    { id: 'faq', label: 'پرسش‌ها' },
    { id: 'b2b', label: 'سفارش سازمانی' },
    { id: 'author', label: 'درباره نویسنده' },
  ];

  const handleSelectTab = (tab: ActiveTab) => {
    onTabChange(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className={`sticky top-0 z-40 backdrop-blur-md transition-colors duration-300 border-b ${
      isLight 
        ? 'bg-[#FAF8F5]/90 border-stone-300 text-stone-900 shadow-sm' 
        : 'bg-[#121314]/90 border-stone-800 text-[#FAF7F2]'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Right Section: Logo & Brand */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => handleSelectTab('books')}
              className="flex items-center gap-3 text-right group focus:outline-none shrink-0"
            >
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#B87333] to-[#8B4513] p-0.5 shadow-lg shadow-[#B87333]/20 flex items-center justify-center shrink-0">
                <div className={`w-full h-full rounded-[10px] flex items-center justify-center transition-colors ${
                  isLight ? 'bg-white group-hover:bg-amber-50' : 'bg-[#121314] group-hover:bg-[#1E2022]'
                }`}>
                  <span className="text-[#B87333] font-black text-xl tracking-tighter">+۳</span>
                </div>
              </div>
              <div className="flex flex-col text-right whitespace-nowrap shrink-0">
                <span className={`font-extrabold text-lg sm:text-xl tracking-tight transition-colors ${
                  isLight ? 'text-stone-900 group-hover:text-[#B87333]' : 'text-[#FAF7F2] group-hover:text-[#B87333]'
                }`}>
                  اورانگوتان <span className="text-[#B87333]">+۳</span>
                </span>
                <span className={`text-[11px] font-medium leading-tight ${isLight ? 'text-stone-600' : 'text-stone-400'}`}>
                  کتاب دو جلدی علی‌اصغر حکیمیان
                </span>
              </div>
            </button>
          </div>

          {/* Center Navigation Tabs (Desktop) */}
          <nav className="hidden xl:flex items-center gap-1 p-1.5 rounded-2xl bg-stone-500/10 border border-stone-500/20 text-xs font-semibold shrink">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectTab(item.id)}
                  className={`relative px-2.5 py-2 rounded-xl transition-all duration-200 whitespace-nowrap ${
                    isActive
                      ? isLight
                        ? 'bg-white text-[#B87333] font-bold shadow-md'
                        : 'bg-[#1E2022] text-[#B87333] font-bold shadow-lg border border-[#B87333]/30'
                      : isLight
                        ? 'text-stone-700 hover:text-stone-900 hover:bg-stone-200/60'
                        : 'text-stone-300 hover:text-white hover:bg-stone-800/60'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <motion.div
                      layoutId="activeTabIndicator"
                      className="absolute -bottom-1 left-2.5 right-2.5 h-0.5 bg-[#B87333] rounded-full"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Left Action Controls */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            
            {/* Dark / Light Theme Toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onToggleTheme}
              className={`p-2.5 rounded-xl border transition-all flex items-center justify-center ${
                isLight 
                  ? 'bg-amber-100/80 border-amber-300 text-amber-800 hover:bg-amber-200' 
                  : 'bg-stone-800/80 border-stone-700 text-amber-400 hover:bg-stone-700'
              }`}
              title={isLight ? 'تغییر به حالت تاریک (Dark Mode)' : 'تغییر به حالت روشن (Light Mode)'}
            >
              {isLight ? (
                <Moon className="w-4 h-4 text-amber-900" />
              ) : (
                <Sun className="w-4 h-4 text-amber-400" />
              )}
            </motion.button>

            {/* Download Sample PDF Button */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={onOpenSamplePdf}
              className={`hidden lg:flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                isLight
                  ? 'bg-stone-100 hover:bg-stone-200 text-stone-800 border-stone-300'
                  : 'bg-stone-800/80 hover:bg-stone-700 text-stone-200 border-stone-700/60'
              }`}
            >
              <FileText className="w-4 h-4 text-[#B87333]" />
              <span>نمونه رایگان</span>
            </motion.button>

            {/* Order Tracking Button */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={onOpenTracking}
              className={`hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                isLight
                  ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border-emerald-300'
                  : 'bg-stone-800/80 hover:bg-stone-700 text-stone-200 border-stone-700/60'
              }`}
            >
              <Truck className="w-4 h-4 text-emerald-500" />
              <span>پیگیری سفارش</span>
            </motion.button>

            {/* Cart Drawer Trigger */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onOpenCart}
              className={`relative flex items-center justify-center p-2.5 rounded-xl border transition-all ${
                isLight
                  ? 'bg-white hover:bg-stone-100 text-stone-900 border-stone-300 shadow-sm'
                  : 'bg-[#1E2022] hover:bg-stone-800 text-[#FAF7F2] border-stone-700/80'
              }`}
              aria-label="سبد خرید"
            >
              <ShoppingBag className="w-5 h-5 text-[#B87333]" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#B87333] text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-md animate-bounce">
                  {toPersianDigits(cartCount)}
                </span>
              )}
            </motion.button>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`xl:hidden p-2 rounded-xl border ${
                isLight ? 'bg-stone-100 border-stone-300 text-stone-800' : 'bg-stone-800 border-stone-700 text-stone-200'
              }`}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className={`xl:hidden border-b px-4 pt-4 pb-6 space-y-3 max-h-[80vh] overflow-y-auto ${
            isLight ? 'bg-white border-stone-200' : 'bg-[#1E2022] border-stone-800'
          }`}
        >
          {/* Quick Action Triggers in Mobile */}
          <div className="grid grid-cols-2 gap-2 mb-4 pb-4 border-b border-stone-500/20">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenSamplePdf();
              }}
              className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-[#B87333]/10 border border-[#B87333]/30 text-xs font-semibold text-[#B87333]"
            >
              <FileText className="w-4 h-4" />
              <span>دانلود نمونه ۳۶ص</span>
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenTracking();
              }}
              className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs font-semibold text-emerald-500"
            >
              <Truck className="w-4 h-4" />
              <span>پیگیری سفارش</span>
            </button>
          </div>

          {/* Navigation Links Grid */}
          <div className="grid grid-cols-2 gap-2">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectTab(item.id)}
                  className={`p-3 rounded-xl text-xs font-bold text-right transition-colors ${
                    isActive
                      ? 'bg-[#B87333] text-white shadow-md'
                      : isLight
                        ? 'bg-stone-100 text-stone-800 hover:bg-stone-200'
                        : 'bg-stone-900 text-stone-300 hover:bg-stone-800'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </motion.div>
      )}
    </header>
  );
};
