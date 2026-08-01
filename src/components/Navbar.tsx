import React, { useState } from 'react';
import { ShoppingBag, Menu, X, Sun, Moon, Truck, FileText, Globe, ChevronDown, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ActiveTab, ThemeMode } from '../types';
import { toPersianDigits } from '../utils/persian';
import { motion, AnimatePresence } from 'motion/react';
import { syncDocumentDirAndLang } from '../i18n/config';

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

const languages = [
  { code: 'fa', name: 'فارسی', label: 'FA', path: '/' },
  { code: 'en', name: 'English', label: 'EN', path: '/en' },
  { code: 'es', name: 'Español', label: 'ES', path: '/es' },
];

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
  const { t, i18n } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  const isLight = theme === 'light';
  const isFa = i18n.language === 'fa';
  const isEs = i18n.language === 'es';
  const currentLangObj = languages.find((l) => l.code === i18n.language) || languages[0];

  const changeLanguageTo = (targetLang: 'fa' | 'en' | 'es') => {
    const targetObj = languages.find((l) => l.code === targetLang) || languages[0];
    i18n.changeLanguage(targetLang);
    window.history.pushState({}, '', targetObj.path);
    syncDocumentDirAndLang(targetLang);
    setLangDropdownOpen(false);
  };

  // All 9 navigation links directly in one list
  const navItems: { id: ActiveTab; key: string }[] = [
    { id: 'books', key: 'books' },
    { id: 'framework', key: 'framework' },
    { id: 'quiz', key: 'quiz' },
    { id: 'case-studies', key: 'caseStudies' },
    { id: 'cards', key: 'cards' },
    { id: 'mistakes-lessons', key: 'mistakesLessons' },
    { id: 'faq', key: 'faq' },
    { id: 'b2b', key: 'b2b' },
    { id: 'author', key: 'author' },
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
      <div className="w-full max-w-[1600px] mx-auto px-3 sm:px-5 lg:px-6">
        <div className="flex items-center justify-between h-20 gap-2 xl:gap-3">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-1.5 sm:gap-2 xl:gap-3 shrink-0">
            <button
              onClick={() => handleSelectTab('books')}
              className="flex items-center gap-1.5 sm:gap-2.5 text-start group focus:outline-none shrink-0"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 xl:w-10 xl:h-10 2xl:w-11 2xl:h-11 rounded-xl bg-gradient-to-br from-[#B87333] to-[#8B4513] p-0.5 shadow-lg shadow-[#B87333]/20 flex items-center justify-center shrink-0">
                <div className={`w-full h-full rounded-[10px] flex items-center justify-center transition-colors ${
                  isLight ? 'bg-white group-hover:bg-amber-50' : 'bg-[#121314] group-hover:bg-[#1E2022]'
                }`}>
                  <span className="text-[#B87333] font-black text-base sm:text-lg xl:text-lg 2xl:text-xl tracking-tighter">{t('navbar.highlight')}</span>
                </div>
              </div>
              <div className="flex flex-col text-start whitespace-nowrap shrink-0">
                <span className={`font-extrabold text-sm sm:text-base xl:text-base 2xl:text-lg tracking-tight transition-colors ${
                  isLight ? 'text-stone-900 group-hover:text-[#B87333]' : 'text-[#FAF7F2] group-hover:text-[#B87333]'
                }`}>
                  {t('navbar.title')} <span className="text-[#B87333]">{t('navbar.highlight')}</span>
                </span>
                <span className={`hidden 2xl:block text-[10px] sm:text-[11px] font-medium leading-tight ${isLight ? 'text-stone-600' : 'text-stone-400'}`}>
                  {t('navbar.subtitle')}
                </span>
              </div>
            </button>
          </div>

          {/* Center Navigation Tabs (Desktop - All 9 items visible directly without scroll/clipping) */}
          <nav className={`hidden xl:flex items-center p-1 rounded-2xl bg-stone-500/10 border border-stone-500/20 font-semibold shrink-0 ${
            isEs ? 'gap-[2px]' : 'gap-0.5 2xl:gap-1 text-[11px] 2xl:text-xs'
          }`}>
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectTab(item.id)}
                  className={`relative rounded-xl transition-all duration-200 whitespace-nowrap shrink-0 ${
                    isEs 
                      ? 'px-[5px] py-0.5 text-[11px] xl:text-[11.5px]' 
                      : 'px-1.5 py-1 2xl:px-2.5 2xl:py-1.5'
                  } ${
                    isActive
                      ? isLight
                        ? 'bg-white text-[#B87333] font-bold shadow-md'
                        : 'bg-[#1E2022] text-[#B87333] font-bold shadow-lg border border-[#B87333]/30'
                      : isLight
                        ? 'text-stone-700 hover:text-stone-900 hover:bg-stone-200/60'
                        : 'text-stone-300 hover:text-white hover:bg-stone-800/60'
                  }`}
                >
                  {t(`navbar.links.${item.key}`)}
                  {isActive && (
                    <motion.div
                      layoutId="activeTabIndicator"
                      className="absolute -bottom-1 start-1.5 end-1.5 h-0.5 bg-[#B87333] rounded-full"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Action Controls */}
          <div className={`flex items-center shrink-0 flex-shrink-0 ${isEs ? 'gap-1 me-2 pe-1 sm:pe-2 xl:pe-3' : 'gap-1 sm:gap-2'}`}>
            
            {/* 3-Language Dropdown Switcher */}
            <div className="relative shrink-0 flex-shrink-0">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className={`rounded-xl border font-bold transition-all flex items-center justify-center gap-1.5 shrink-0 flex-shrink-0 ${
                  isEs 
                    ? 'px-2 py-1 text-[11px]' 
                    : 'px-2 py-1 sm:px-2.5 sm:py-1.5 text-[11px] sm:text-xs'
                } ${
                  isLight
                    ? 'bg-amber-50 hover:bg-amber-100 text-stone-900 border-amber-200 shadow-sm'
                    : 'bg-stone-800 hover:bg-stone-700 text-[#FAF7F2] border-stone-700'
                }`}
                title={t('navbar.langTitle', 'تغییر زبان / Language')}
              >
                <Globe className="w-3.5 h-3.5 text-[#B87333]" />
                <span>{currentLangObj.label}</span>
                <ChevronDown className={`w-3 h-3 text-stone-400 transition-transform duration-200 ${langDropdownOpen ? 'rotate-180' : ''}`} />
              </motion.button>

              <AnimatePresence>
                {langDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setLangDropdownOpen(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className={`absolute end-0 mt-2 w-36 rounded-2xl p-1.5 border shadow-xl z-50 overflow-hidden ${
                        isLight ? 'bg-white border-amber-200/80 text-stone-900' : 'bg-[#1E2022] border-stone-700 text-[#FAF7F2]'
                      }`}
                    >
                      {languages.map((lang) => {
                        const isSelected = i18n.language === lang.code;
                        return (
                          <button
                            key={lang.code}
                            onClick={() => changeLanguageTo(lang.code as 'fa' | 'en' | 'es')}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
                              isSelected
                                ? isLight
                                  ? 'bg-amber-100/70 text-[#B87333]'
                                  : 'bg-[#B87333]/20 text-[#B87333]'
                                : isLight
                                  ? 'hover:bg-stone-100 text-stone-700'
                                  : 'hover:bg-stone-800 text-stone-300'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <span className="font-extrabold">{lang.label}</span>
                              <span className="text-[11px] opacity-80 font-normal">({lang.name})</span>
                            </div>
                            {isSelected && <Check className="w-3.5 h-3.5 text-[#B87333]" />}
                          </button>
                        );
                      })}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Dark / Light Theme Toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onToggleTheme}
              className={`p-1.5 sm:p-2 rounded-xl border transition-all flex items-center justify-center shrink-0 flex-shrink-0 ${
                isLight 
                  ? 'bg-amber-100/80 border-amber-300 text-amber-800 hover:bg-amber-200' 
                  : 'bg-stone-800/80 border-stone-700 text-amber-400 hover:bg-stone-700'
              }`}
              title={isLight ? t('navbar.switchThemeDark') : t('navbar.switchThemeLight')}
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
              className={`hidden 2xl:flex items-center gap-1 rounded-xl font-semibold border transition-all shrink-0 flex-shrink-0 ${
                isEs 
                  ? 'px-2 py-1 text-[11px]' 
                  : 'px-2.5 py-1.5 text-[11px] 2xl:text-xs'
              } ${
                isLight
                  ? 'bg-stone-100 hover:bg-stone-200 text-stone-800 border-stone-300'
                  : 'bg-stone-800/80 hover:bg-stone-700 text-stone-200 border-stone-700/60'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-[#B87333]" />
              <span>{t('navbar.samplePdfBtn')}</span>
            </motion.button>

            {/* Order Tracking Button */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={onOpenTracking}
              className={`hidden lg:flex items-center gap-1 rounded-xl font-semibold border transition-all shrink-0 flex-shrink-0 ${
                isEs 
                  ? 'px-2 py-1 text-[11px]' 
                  : 'px-2.5 py-1.5 text-[11px] 2xl:text-xs'
              } ${
                isLight
                  ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border-emerald-300'
                  : 'bg-stone-800/80 hover:bg-stone-700 text-stone-200 border-stone-700/60'
              }`}
            >
              <Truck className="w-3.5 h-3.5 text-emerald-500" />
              <span>{t('navbar.orderTrackingBtn')}</span>
            </motion.button>

            {/* Cart Drawer Trigger */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onOpenCart}
              className={`relative flex items-center justify-center p-1.5 sm:p-2 rounded-xl border transition-all shrink-0 flex-shrink-0 ${
                isLight
                  ? 'bg-white hover:bg-stone-100 text-stone-900 border-stone-300 shadow-sm'
                  : 'bg-[#1E2022] hover:bg-stone-800 text-[#FAF7F2] border-stone-700/80'
              }`}
              aria-label={t('navbar.cartTooltip')}
            >
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-[#B87333]" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -end-2 bg-[#B87333] text-white text-[10px] sm:text-[11px] font-bold w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center border-2 border-white shadow-md animate-bounce">
                  {isFa ? toPersianDigits(cartCount) : cartCount}
                </span>
              )}
            </motion.button>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`xl:hidden p-1.5 sm:p-2 rounded-xl border shrink-0 flex-shrink-0 ${
                isLight ? 'bg-stone-100 border-stone-300 text-stone-800' : 'bg-stone-800 border-stone-700 text-stone-200'
              }`}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
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
          {/* Mobile Language Switcher Bar */}
          <div className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 mb-2 ${
            isLight ? 'bg-amber-50/70 border-amber-200' : 'bg-stone-900 border-stone-800'
          }`}>
            <div className="flex items-center gap-1.5 text-xs font-bold text-stone-700 dark:text-stone-300">
              <Globe className="w-4 h-4 text-[#B87333]" />
              <span>زبان / Language</span>
            </div>
            <div className="flex gap-1">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    changeLanguageTo(lang.code as 'fa' | 'en' | 'es');
                    setMobileMenuOpen(false);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    i18n.language === lang.code
                      ? 'bg-[#B87333] text-white shadow-sm'
                      : isLight
                        ? 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
                        : 'bg-stone-800 text-stone-300 hover:bg-stone-700 border border-stone-700'
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>

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
              <span>{t('navbar.samplePdfMobile')}</span>
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenTracking();
              }}
              className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs font-semibold text-emerald-500"
            >
              <Truck className="w-4 h-4" />
              <span>{t('navbar.orderTrackingBtn')}</span>
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
                  className={`p-3 rounded-xl text-xs font-bold text-start transition-colors ${
                    isActive
                      ? 'bg-[#B87333] text-white shadow-md'
                      : isLight
                        ? 'bg-stone-100 text-stone-800 hover:bg-stone-200'
                        : 'bg-stone-900 text-stone-300 hover:bg-stone-800'
                  }`}
                >
                  {t(`navbar.links.${item.key}`)}
                </button>
              );
            })}
          </div>
        </motion.div>
      )}
    </header>
  );
};

