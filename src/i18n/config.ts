import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import faTranslation from './locales/fa.json';
import enTranslation from './locales/en.json';

// Detect initial language based on URL path
const isEnPath = typeof window !== 'undefined' && (window.location.pathname === '/en' || window.location.pathname.startsWith('/en/'));
const initialLang = isEnPath ? 'en' : 'fa';

// Helper function to sync document direction and lang attribute
export const syncDocumentDirAndLang = (lang: string) => {
  if (typeof document === 'undefined') return;
  const isEn = lang === 'en';
  document.documentElement.dir = isEn ? 'ltr' : 'rtl';
  document.documentElement.lang = isEn ? 'en' : 'fa';
};

// Sync document dir/lang on module load
syncDocumentDirAndLang(initialLang);

i18n
  .use(initReactI18next)
  .init({
    resources: {
      fa: { translation: faTranslation },
      en: { translation: enTranslation },
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
