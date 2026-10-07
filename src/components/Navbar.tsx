import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  AlertCircle,
  Award,
  BookOpen,
  Briefcase,
  Building2,
  Check,
  ChevronDown,
  Compass,
  FileText,
  Globe,
  HelpCircle,
  Layers,
  Menu,
  MessageSquare,
  Moon,
  ShoppingBag,
  Sun,
  Truck,
  User,
  X,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'motion/react';
import { ActiveTab, ThemeMode } from '../types';
import { toPersianDigits } from '../utils/persian';
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

type LangCode = 'fa' | 'en' | 'es' | 'de' | 'fr' | 'zh' | 'ja' | 'hi' | 'ar';

const languages: { code: LangCode; name: string; label: string; path: string }[] = [
  { code: 'fa', name: 'فارسی', label: 'FA', path: '/' },
  { code: 'en', name: 'English', label: 'EN', path: '/en' },
  { code: 'es', name: 'Español', label: 'ES', path: '/es' },
  { code: 'de', name: 'Deutsch', label: 'DE', path: '/de' },
  { code: 'fr', name: 'Français', label: 'FR', path: '/fr' },
  { code: 'zh', name: '中文', label: 'ZH', path: '/zh' },
  { code: 'ja', name: '日本語', label: 'JA', path: '/ja' },
  { code: 'hi', name: 'हिन्दी', label: 'HI', path: '/hi' },
  { code: 'ar', name: 'العربية', label: 'AR', path: '/ar' },
];

const navItems: { id: ActiveTab; key: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'books', key: 'books', icon: BookOpen },
  { id: 'framework', key: 'framework', icon: Compass },
  { id: 'quiz', key: 'quiz', icon: Award },
  { id: 'case-studies', key: 'caseStudies', icon: Briefcase },
  { id: 'cards', key: 'cards', icon: Layers },
  { id: 'mistakes-lessons', key: 'mistakesLessons', icon: AlertCircle },
  { id: 'user-experiences', key: 'userExperiences', icon: MessageSquare },
  { id: 'faq', key: 'faq', icon: HelpCircle },
  { id: 'b2b', key: 'b2b', icon: Building2 },
  { id: 'author', key: 'author', icon: User },
];

const iconButton =
  'relative flex h-10 items-center justify-center gap-1.5 rounded-xl border border-line bg-surface/70 px-2.5 text-ink-2 transition-colors hover:border-copper/50 hover:text-ink';

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
  const [langOpen, setLangOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  const isLight = theme === 'light';
  const isFa = i18n.language === 'fa';
  const currentLang = languages.find((l) => l.code === i18n.language) || languages[0];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close the language menu on outside click / Escape.
  useEffect(() => {
    if (!langOpen) return;
    const onDown = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) setLangOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setLangOpen(false);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [langOpen]);

  // Lock page scroll behind the mobile menu.
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileMenuOpen]);

  const changeLanguageTo = (targetLang: LangCode) => {
    const target = languages.find((l) => l.code === targetLang) || languages[0];
    i18n.changeLanguage(targetLang);
    const newPath =
      activeTab === 'quiz' ? (targetLang === 'fa' ? '/manager-assessment' : `${target.path}/manager-assessment`) : target.path;
    window.history.pushState({}, '', newPath);
    syncDocumentDirAndLang(targetLang);
    setLangOpen(false);
  };

  const handleSelectTab = (tab: ActiveTab) => {
    onTabChange(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cartLabel = isFa ? toPersianDigits(cartCount) : String(cartCount);

  return (
    <header
      className={`sticky top-0 z-40 border-b backdrop-blur-xl transition-[background-color,box-shadow,border-color] duration-300 ${
        scrolled ? 'bg-canvas/85 border-line shadow-[0_10px_30px_-20px_rgba(0,0,0,0.6)]' : 'bg-canvas/70 border-transparent'
      }`}
    >
      {/* Row 1: brand + actions */}
      <div className="mx-auto w-full max-w-[1600px] px-3 sm:px-5 lg:px-6">
        <div className="flex h-16 items-center justify-between gap-3">
          <button onClick={() => handleSelectTab('books')} className="group flex shrink-0 items-center gap-2.5 text-start">
            <span className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#D9894A] via-[#B87333] to-[#7A3E14] p-[1.5px] shadow-[0_6px_20px_-6px_rgba(217,137,74,0.7)]">
              <span className="flex h-full w-full items-center justify-center rounded-[10px] bg-canvas transition-colors group-hover:bg-transparent">
                <span className="text-base font-black tracking-tighter text-copper-hi transition-colors group-hover:text-white">
                  {t('navbar.highlight')}
                </span>
              </span>
            </span>
            <span className="flex flex-col whitespace-nowrap">
              <span className="text-sm sm:text-base font-black tracking-tight text-ink">
                {t('navbar.title')} <span className="text-copper-hi">{t('navbar.highlight')}</span>
              </span>
              <span className="hidden xl:block max-w-[280px] truncate text-[11px] font-medium text-ink-3">{t('navbar.subtitle')}</span>
            </span>
          </button>

          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            {/* Language */}
            <div ref={langRef} className="relative z-50">
              <button
                onClick={() => setLangOpen((v) => !v)}
                className={`${iconButton} text-xs font-bold`}
                aria-haspopup="listbox"
                aria-expanded={langOpen}
                title={t('navbar.langTitle')}
              >
                <Globe className="w-4 h-4 text-copper-hi" />
                <span>{currentLang.label}</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${langOpen ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {langOpen && (
                  <motion.ul
                    role="listbox"
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.97 }}
                    transition={{ duration: 0.16 }}
                    className="absolute end-0 z-50 mt-2 w-48 origin-top rounded-2xl border border-line bg-surface p-1.5 og-shadow"
                  >
                    {languages.map((lang) => {
                      const selected = i18n.language === lang.code;
                      return (
                        <li key={lang.code}>
                          <button
                            role="option"
                            aria-selected={selected}
                            onClick={() => changeLanguageTo(lang.code)}
                            className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-bold transition-colors ${
                              selected ? 'bg-copper/12 text-copper-hi' : 'text-ink-2 hover:bg-surface-2 hover:text-ink'
                            }`}
                          >
                            <span className="flex items-center gap-2">
                              <span className="w-6 font-black">{lang.label}</span>
                              <span className="font-medium">{lang.name}</span>
                            </span>
                            {selected && <Check className="w-3.5 h-3.5" />}
                          </button>
                        </li>
                      );
                    })}
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>

            {/* Theme */}
            <button
              onClick={onToggleTheme}
              className={`${iconButton} w-10 overflow-hidden`}
              title={isLight ? t('navbar.switchThemeDark') : t('navbar.switchThemeLight')}
              aria-label={isLight ? t('navbar.switchThemeDark') : t('navbar.switchThemeLight')}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={theme}
                  initial={{ y: 14, rotate: -90, opacity: 0 }}
                  animate={{ y: 0, rotate: 0, opacity: 1 }}
                  exit={{ y: -14, rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="flex"
                >
                  {isLight ? <Moon className="w-4 h-4 text-copper-hi" /> : <Sun className="w-4 h-4 text-amber-400" />}
                </motion.span>
              </AnimatePresence>
            </button>

            <button onClick={onOpenSamplePdf} className={`${iconButton} hidden sm:flex text-xs font-bold`} title={t('navbar.samplePdfBtn')}>
              <FileText className="w-4 h-4 text-copper-hi" />
              <span className="whitespace-nowrap">{t('navbar.samplePdfBtn')}</span>
            </button>

            <button onClick={onOpenTracking} className={`${iconButton} hidden sm:flex text-xs font-bold`} title={t('navbar.orderTrackingBtn')}>
              <Truck className="w-4 h-4 text-emerald-500" />
              <span className="whitespace-nowrap">{t('navbar.orderTrackingBtn')}</span>
            </button>

            {/* Cart */}
            <button onClick={onOpenCart} className={`${iconButton} w-10`} aria-label={t('navbar.cartTooltip')}>
              <ShoppingBag className="w-[18px] h-[18px] text-copper-hi" />
              <AnimatePresence>
                {cartCount > 0 && (
                  <motion.span
                    key={cartCount}
                    initial={{ scale: 0.3, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.3, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 18 }}
                    className="absolute -top-1.5 -end-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-gradient-to-br from-[#D9894A] to-[#8B4513] px-1 text-[10px] font-black text-white ring-2 ring-canvas"
                  >
                    {cartLabel}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            <button
              onClick={() => setMobileMenuOpen((v) => !v)}
              className={`${iconButton} w-10 md:hidden`}
              aria-label={mobileMenuOpen ? t('ui.common.close') : t('ui.nav.menu')}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Row 2: every section, always visible on md+ */}
      <div className="hidden md:block border-t border-line">
        <nav className="og-no-scrollbar mx-auto w-full max-w-[1600px] overflow-x-auto px-2 sm:px-4 max-xl:[mask-image:linear-gradient(90deg,transparent,black_28px,black_calc(100%-28px),transparent)]">
          <ul className="mx-auto flex min-w-max items-center gap-0.5 py-1.5 px-2 justify-center">
            {navItems.map((item) => {
              const active = activeTab === item.id;
              const Icon = item.icon;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => handleSelectTab(item.id)}
                    aria-current={active ? 'page' : undefined}
                    className={`group relative flex items-center gap-1.5 whitespace-nowrap rounded-xl px-2 xl:px-2.5 2xl:px-3 py-1.5 text-[11px] xl:text-xs font-bold transition-colors ${
                      active ? 'text-copper-hi' : 'text-ink-2 hover:text-ink'
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId="nav-active-pill"
                        className="absolute inset-0 rounded-xl border border-copper/30 bg-copper/10"
                        transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                      />
                    )}
                    <Icon className={`relative hidden 2xl:block w-3.5 h-3.5 ${active ? '' : 'text-ink-3 group-hover:text-copper-hi'}`} />
                    <span className="relative">{t(`navbar.links.${item.key}`)}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* Mobile full-screen menu. Portalled to <body>: the header's backdrop-filter
          would otherwise become the containing block of this fixed overlay. */}
      {createPortal(
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="md:hidden fixed inset-x-0 top-16 bottom-0 z-30 overflow-y-auto bg-canvas"
          >
            <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-[radial-gradient(ellipse_at_top,rgba(184,115,51,0.18),transparent_70%)]" />
            <motion.div
              initial="hidden"
              animate="show"
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.035, delayChildren: 0.05 } } }}
              className="relative px-4 pt-5 pb-10 space-y-5"
            >
              <ul className="grid grid-cols-2 gap-2">
                {navItems.map((item) => {
                  const active = activeTab === item.id;
                  const Icon = item.icon;
                  return (
                    <motion.li key={item.id} variants={{ hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0 } }}>
                      <button
                        onClick={() => handleSelectTab(item.id)}
                        className={`flex w-full flex-col items-start gap-3 rounded-2xl border p-4 text-start transition-colors ${
                          active
                            ? 'border-copper/50 bg-copper/12 text-copper-hi'
                            : 'border-line bg-surface text-ink hover:border-copper/40'
                        }`}
                      >
                        <Icon className={`w-5 h-5 ${active ? '' : 'text-copper-hi'}`} />
                        <span className="text-sm font-bold leading-5">{t(`navbar.links.${item.key}`)}</span>
                      </button>
                    </motion.li>
                  );
                })}
              </ul>

              <motion.div variants={{ hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0 } }} className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenSamplePdf();
                  }}
                  className="flex items-center justify-center gap-2 rounded-2xl border border-copper/30 bg-copper/10 px-3 py-3 text-xs font-bold text-copper-hi"
                >
                  <FileText className="w-4 h-4" />
                  <span className="truncate">{t('navbar.samplePdfMobile')}</span>
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenTracking();
                  }}
                  className="flex items-center justify-center gap-2 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-3 text-xs font-bold text-emerald-500"
                >
                  <Truck className="w-4 h-4" />
                  <span className="truncate">{t('navbar.orderTrackingBtn')}</span>
                </button>
              </motion.div>

              <motion.div variants={{ hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0 } }} className="space-y-2.5">
                <span className="flex items-center gap-1.5 text-xs font-bold text-ink-3">
                  <Globe className="w-3.5 h-3.5 text-copper-hi" />
                  {t('ui.nav.language')}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        changeLanguageTo(lang.code);
                        setMobileMenuOpen(false);
                      }}
                      className={`rounded-xl px-3 py-2 text-xs font-bold transition-colors ${
                        i18n.language === lang.code
                          ? 'bg-gradient-to-br from-[#D9894A] to-[#8B4513] text-white'
                          : 'border border-line bg-surface text-ink-2'
                      }`}
                    >
                      {lang.name}
                    </button>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>,
      document.body
      )}
    </header>
  );
};
