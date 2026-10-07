import React from 'react';
import { ArrowLeft, FileText, Globe, Phone, ShieldCheck, Truck, Zap } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ActiveTab, ThemeMode } from '../types';
import { PublicVisitorCounter } from './PublicVisitorCounter';
import { Container, buttonClass } from './ui/kit';

interface FooterProps {
  theme?: ThemeMode;
  onTabChange?: (tab: ActiveTab) => void;
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ theme = 'dark', onTabChange, onOpenAdmin }) => {
  const { t } = useTranslation();

  const go = (tab: ActiveTab) => {
    if (onTabChange) {
      onTabChange(tab);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const openAdmin = () => {
    if (onOpenAdmin) onOpenAdmin();
    else go('admin');
  };

  const sections: { tab: ActiveTab; key: string }[] = [
    { tab: 'books', key: 'books' },
    { tab: 'framework', key: 'framework' },
    { tab: 'case-studies', key: 'caseStudies' },
    { tab: 'user-experiences', key: 'userExperiences' },
    { tab: 'quiz', key: 'quiz' },
  ];
  const tools: { tab: ActiveTab; key: string }[] = [
    { tab: 'cards', key: 'cards' },
    { tab: 'mistakes-lessons', key: 'mistakesLessons' },
    { tab: 'faq', key: 'faq' },
    { tab: 'b2b', key: 'b2b' },
    { tab: 'author', key: 'author' },
  ];

  const linkClass =
    'group inline-flex items-center gap-2 text-sm text-ink-2 transition-colors hover:text-copper-hi';

  return (
    <footer className="relative isolate overflow-hidden border-t border-line bg-canvas">
      {/* Giant watermark */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-[0.18em] start-1/2 -z-10 -translate-x-1/2 rtl:translate-x-1/2 select-none text-[34vw] sm:text-[24vw] font-black leading-none tracking-tighter text-copper/[0.06]"
        dir="ltr"
      >
        +3
      </div>

      <Container className="pt-16 sm:pt-20 pb-10 space-y-14">
        {/* Closing call to action */}
        <div className="relative overflow-hidden rounded-[2rem] border border-copper/25 bg-[#0A0A0B] p-7 sm:p-10 text-[#FAF7F2]">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_85%_20%,rgba(184,115,51,0.35),transparent_60%)]" />
          <div className="absolute inset-0 og-grain opacity-[0.05]" />
          <div className="relative grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
            <div className="space-y-3">
              <h2 className="text-2xl sm:text-4xl font-black tracking-tight">
                <span className="og-copper-text">{t('ui.footer.ctaTitle')}</span>
              </h2>
              <p className="max-w-xl text-sm leading-7 text-stone-400">{t('ui.footer.ctaText')}</p>
              <div className="flex flex-wrap gap-3 pt-2">
                <button onClick={() => go('books')} className={buttonClass('primary', 'md')}>
                  {t('ui.footer.ctaBuy')}
                  <ArrowLeft className="w-4 h-4 ltr:rotate-180" />
                </button>
                <button
                  onClick={() => go('quiz')}
                  className="inline-flex h-11 items-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-5 text-sm font-bold text-stone-200 transition-colors hover:border-[#D9894A]/60"
                >
                  <Zap className="w-4 h-4 text-[#D9894A]" />
                  {t('ui.footer.ctaQuiz')}
                </button>
              </div>
            </div>
            <div className="relative hidden md:block h-44 w-56" aria-hidden="true">
              <img
                src="/Jeld2%20-%20Front.png"
                alt=""
                className="absolute top-2 start-0 w-28 rounded-lg shadow-2xl [transform:rotate(-8deg)]"
              />
              <img
                src="/Jeld%20-%20Front.png"
                alt=""
                className="absolute top-0 end-2 w-32 rounded-lg shadow-[0_30px_50px_-20px_rgba(0,0,0,0.9)] [transform:rotate(5deg)]"
              />
            </div>
          </div>
        </div>

        {/* Columns */}
        <div className="grid grid-cols-2 gap-10 lg:grid-cols-12">
          <div className="col-span-2 lg:col-span-5 space-y-5">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#D9894A] via-[#B87333] to-[#7A3E14] text-lg font-black text-white shadow-lg">
                {t('footer.highlight')}
              </span>
              <span className="text-xl font-black text-ink">
                {t('footer.title')} <span className="text-copper-hi">{t('footer.highlight')}</span>
              </span>
            </div>
            <p className="max-w-sm text-sm leading-7 text-ink-2">{t('footer.desc')}</p>
            <div className="flex flex-col gap-2.5 text-sm">
              <a href="tel:09130440143" className="inline-flex w-fit items-center gap-2 font-bold text-copper-hi hover:underline underline-offset-4">
                <Phone className="w-4 h-4" />
                {t('footer.supportPhone')}
              </a>
              <span className="inline-flex items-center gap-2 font-mono text-xs text-ink-3">
                <Globe className="w-4 h-4" />
                {t('footer.domain')}
              </span>
            </div>
          </div>

          <nav className="lg:col-span-2 space-y-4" aria-label={t('footer.navSectionsTitle')}>
            <h3 className="text-xs font-black tracking-wider uppercase text-ink-3">{t('footer.navSectionsTitle')}</h3>
            <ul className="space-y-3">
              {sections.map((l) => (
                <li key={l.tab}>
                  <button onClick={() => go(l.tab)} className={linkClass}>
                    <span className="h-px w-0 bg-copper transition-all group-hover:w-3" />
                    {t(`footer.links.${l.key}`)}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <nav className="lg:col-span-2 space-y-4" aria-label={t('footer.navToolsTitle')}>
            <h3 className="text-xs font-black tracking-wider uppercase text-ink-3">{t('footer.navToolsTitle')}</h3>
            <ul className="space-y-3">
              {tools.map((l) => (
                <li key={l.tab}>
                  <button onClick={() => go(l.tab)} className={linkClass}>
                    <span className="h-px w-0 bg-copper transition-all group-hover:w-3" />
                    {t(`footer.links.${l.key}`)}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <div className="col-span-2 lg:col-span-3 space-y-4">
            <h3 className="text-xs font-black tracking-wider uppercase text-ink-3">{t('footer.navSupportTitle')}</h3>
            <p className="text-sm leading-7 text-ink-2">{t('footer.navSupportText')}</p>
            <ul className="space-y-2.5 text-xs font-semibold text-ink-2">
              <li className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-copper-hi" />
                {t('footer.badges.shipping')}
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                {t('footer.badges.authenticity')}
              </li>
              <li className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-copper-hi" />
                {t('footer.badges.invoice')}
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-line pt-8 text-center md:flex-row md:text-start">
          <PublicVisitorCounter onOpenAdmin={openAdmin} theme={theme} />
          <div className="space-y-1 text-[11px] text-ink-3">
            <p>{t('footer.copyright')}</p>
            <p>{t('footer.devInfo')}</p>
          </div>
        </div>
      </Container>
    </footer>
  );
};
