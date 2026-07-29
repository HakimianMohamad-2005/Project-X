import React from 'react';
import { ShieldCheck, Truck, FileText, Phone, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ActiveTab, ThemeMode } from '../types';

interface FooterProps {
  theme?: ThemeMode;
  onTabChange?: (tab: ActiveTab) => void;
}

export const Footer: React.FC<FooterProps> = ({ theme = 'light', onTabChange }) => {
  const { t } = useTranslation();
  const isLight = theme === 'light';

  const handleNav = (tab: ActiveTab) => {
    if (onTabChange) {
      onTabChange(tab);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className={`border-t pt-16 pb-12 transition-colors duration-300 text-xs ${
      isLight ? 'bg-stone-100 border-stone-300 text-stone-600' : 'bg-[#0D0E0F] border-stone-800 text-stone-400'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Brand & Author Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#B87333] flex items-center justify-center font-black text-white text-lg">
                {t('footer.highlight')}
              </div>
              <span className={`text-xl font-black ${isLight ? 'text-stone-900' : 'text-[#FAF7F2]'}`}>
                {t('footer.title')} <span className="text-[#B87333]">{t('footer.highlight')}</span>
              </span>
            </div>

            <p className="leading-relaxed max-w-sm">
              {t('footer.desc')}
            </p>

            <div className="flex items-center gap-2 font-mono text-xs text-[#B87333]">
              <Globe className="w-4 h-4 text-[#B87333]" />
              <span>{t('footer.domain')}</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-3">
            <h3 className={`text-sm font-bold ${isLight ? 'text-stone-900' : 'text-[#FAF7F2]'}`}>
              {t('footer.navSectionsTitle')}
            </h3>
            <ul className="space-y-2">
              <li><button onClick={() => handleNav('books')} className="hover:text-[#B87333] transition-colors">{t('footer.links.books')}</button></li>
              <li><button onClick={() => handleNav('framework')} className="hover:text-[#B87333] transition-colors">{t('footer.links.framework')}</button></li>
              <li><button onClick={() => handleNav('case-studies')} className="hover:text-[#B87333] transition-colors">{t('footer.links.caseStudies')}</button></li>
              <li><button onClick={() => handleNav('quiz')} className="hover:text-[#B87333] transition-colors">{t('footer.links.quiz')}</button></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className={`text-sm font-bold ${isLight ? 'text-stone-900' : 'text-[#FAF7F2]'}`}>
              {t('footer.navToolsTitle')}
            </h3>
            <ul className="space-y-2">
              <li><button onClick={() => handleNav('cards')} className="hover:text-[#B87333] transition-colors">{t('footer.links.cards')}</button></li>
              <li><button onClick={() => handleNav('mistakes-lessons')} className="hover:text-[#B87333] transition-colors">{t('footer.links.mistakesLessons')}</button></li>
              <li><button onClick={() => handleNav('faq')} className="hover:text-[#B87333] transition-colors">{t('footer.links.faq')}</button></li>
              <li><button onClick={() => handleNav('b2b')} className="hover:text-[#B87333] transition-colors">{t('footer.links.b2b')}</button></li>
              <li><button onClick={() => handleNav('author')} className="hover:text-[#B87333] transition-colors">{t('footer.links.author')}</button></li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div className="space-y-3">
            <h3 className={`text-sm font-bold ${isLight ? 'text-stone-900' : 'text-[#FAF7F2]'}`}>
              {t('footer.navSupportTitle')}
            </h3>
            <p className="leading-relaxed">
              {t('footer.navSupportText')}
            </p>
            <div className="pt-2 flex items-center gap-2 text-[#B87333] font-bold">
              <Phone className="w-4 h-4" />
              <span>{t('footer.supportPhone')}</span>
            </div>
          </div>

        </div>

        {/* Trust Badges */}
        <div className="pt-8 border-t border-stone-500/20 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div className="flex items-center justify-center gap-2">
            <Truck className="w-4 h-4 text-[#B87333]" />
            <span>{t('footer.badges.shipping')}</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>{t('footer.badges.authenticity')}</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <FileText className="w-4 h-4 text-[#B87333]" />
            <span>{t('footer.badges.invoice')}</span>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-6 border-t border-stone-500/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-stone-500 text-[11px]">
          <p>
            {t('footer.copyright')}
          </p>
          <p>
            {t('footer.devInfo')}
          </p>
        </div>

      </div>
    </footer>
  );
};
