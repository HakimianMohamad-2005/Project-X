import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import faTranslation from './locales/fa.json';
import enTranslation from './locales/en.json';
import esTranslation from './locales/es.json';
import deTranslation from './locales/de.json';
import frTranslation from './locales/fr.json';
import zhTranslation from './locales/zh.json';
import jaTranslation from './locales/ja.json';
import hiTranslation from './locales/hi.json';
import arTranslation from './locales/ar.json';

// Detect initial language based on URL path
const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
const isArPath = pathname === '/ar' || pathname.startsWith('/ar/');
const isHiPath = pathname === '/hi' || pathname.startsWith('/hi/');
const isJaPath = pathname === '/ja' || pathname.startsWith('/ja/');
const isZhPath = pathname === '/zh' || pathname.startsWith('/zh/');
const isFrPath = pathname === '/fr' || pathname.startsWith('/fr/');
const isDePath = pathname === '/de' || pathname.startsWith('/de/');
const isEsPath = pathname === '/es' || pathname.startsWith('/es/');
const isEnPath = pathname === '/en' || pathname.startsWith('/en/');
const initialLang = isArPath ? 'ar' : isHiPath ? 'hi' : isJaPath ? 'ja' : isZhPath ? 'zh' : isFrPath ? 'fr' : isDePath ? 'de' : isEsPath ? 'es' : isEnPath ? 'en' : 'fa';

// Helper function to sync document direction and lang attribute
export const syncDocumentDirAndLang = (lang: string) => {
  if (typeof document === 'undefined') return;
  const isRtl = lang === 'fa' || lang === 'ar';
  document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
  document.documentElement.lang = lang;
};

// Sync document dir/lang on module load
syncDocumentDirAndLang(initialLang);

i18n
  .use(initReactI18next)
  .init({
    resources: {
      fa: { translation: faTranslation },
      en: { translation: enTranslation },
      es: { translation: esTranslation },
      de: { translation: deTranslation },
      fr: { translation: frTranslation },
      zh: { translation: zhTranslation },
      ja: { translation: jaTranslation },
      hi: { translation: hiTranslation },
      ar: { translation: arTranslation },
    },
    lng: initialLang,
    fallbackLng: 'fa',
    interpolation: {
      escapeValue: false,
    },
  });

// Keep document attributes synced on language change
i18n.on('languageChanged', (lng) => {
  syncDocumentDirAndLang(lng);
});

export default i18n;
