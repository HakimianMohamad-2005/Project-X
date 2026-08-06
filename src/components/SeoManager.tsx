import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { syncDocumentDirAndLang } from '../i18n/config';

interface SeoMetaData {
  title: string;
  description: string;
  canonical: string;
  ogLocale: string;
}

const seoDictionary: Record<string, SeoMetaData> = {
  fa: {
    title: 'کتاب اورانگوتان ۳+ | از مدیریت غریزی تا سازمانی ماندگار | علیاصغر حکیمیان',
    description: 'خرید مستقیم کتاب ۲ جلدی «اورانگوتان ۳+» نوشته علیاصغر حکیمیان حاصل ۴۰ سال تجربه مدیریت صنعتی. راهکارهای عملی مهار خونریزی مالی، حذف ضایعات پنهان و ساخت حافظه سازمانی.',
    canonical: 'https://www.orangutanplus3.com/',
    ogLocale: 'fa_IR',
  },
  en: {
    title: 'Orangutan 3+ Book | From Instinctive to Sustainable Management | Ali Asghar Hakimian',
    description: 'Official platform for the 2-volume book "Orangutan 3+" by Ali Asghar Hakimian. Practical industrial framework based on 40 years of executive management experience.',
    canonical: 'https://www.orangutanplus3.com/en',
    ogLocale: 'en_US',
  },
  es: {
    title: 'Libro Orangután 3+ | De la Gestión Instintiva a la Organización Sostenible | Ali Asghar Hakimian',
    description: 'Plataforma oficial del libro de 2 volúmenes "Orangután 3+" de Ali Asghar Hakimian. Marco industrial práctico basado en 40 años de experiencia gerencial.',
    canonical: 'https://www.orangutanplus3.com/es',
    ogLocale: 'es_ES',
  },
  de: {
    title: 'Orangutan 3+ Buch | Von instinktiver zu nachhaltiger Unternehmensführung | Ali Asghar Hakimian',
    description: 'Offizielle Plattform für das zweibändige Buch "Orangutan 3+" von Ali Asghar Hakimian. Praktisches Industrie-Framework aus 40 Jahren Managementerfahrung.',
    canonical: 'https://www.orangutanplus3.com/de',
    ogLocale: 'de_DE',
  },
  fr: {
    title: 'Livre Orang-outan 3+ | De la Gestion Instinctive à l\'Organisation Durable | Ali Asghar Hakimian',
    description: 'Plateforme officielle du livre en 2 volumes "Orang-outan 3+" par Ali Asghar Hakimian. Cadre industriel pratique basé sur 40 ans d\'expérience de gestion.',
    canonical: 'https://www.orangutanplus3.com/fr',
    ogLocale: 'fr_FR',
  },
  zh: {
    title: '猩猩3+ 书籍 | 从本能管理到可持续企业组织 | 阿里·阿斯加尔·哈基米安',
    description: '阿里·阿斯加尔·哈基米安著作《猩猩3+》（两卷本）官方平台。基于40年工业管理经验的实用企业治理框架。',
    canonical: 'https://www.orangutanplus3.com/zh',
    ogLocale: 'zh_CN',
  },
  ja: {
    title: 'オランウータン3+ 書籍 | 本能的経営から持続可能な組織へ | アリ・アスガル・ハキミアン',
    description: 'アリ・アスガル・ハキミアン著『オランウータン3+』（全2巻）公式プラットフォーム。40年の産業経営経験に基づく実践的フレームワーク。',
    canonical: 'https://www.orangutanplus3.com/ja',
    ogLocale: 'ja_JP',
  },
  hi: {
    title: 'ओरंगउटान 3+ पुस्तक | सहज प्रबंधन से टिकाऊ संगठन तक | अली असगर हकीमियन',
    description: 'अली असगर हकीमियन द्वारा लिखित 2-खंड पुस्तक "ओरंगउटान 3+" का आधिकारिक मंच। 40 वर्षों के औद्योगिक प्रबंधन अनुभव पर आधारित व्यावहारिक ढांचा।',
    canonical: 'https://www.orangutanplus3.com/hi',
    ogLocale: 'hi_IN',
  },
  ar: {
    title: 'أورانغوتان +۳ | من الإدارة الغريزية إلى مؤسسة متعلمة ومستدامة | علي أصغر حكيميان',
    description: 'الموقع الرسمي لكتاب «أورانغوتان +۳» (مجلدین) تأليف علي أصغر حكيميان. خلاصة ٤٠ عاماً من الخبرة في الإدارة الصناعية وحلول النزيف الداخلي للمؤسسات.',
    canonical: 'https://www.orangutanplus3.com/ar',
    ogLocale: 'ar_SA',
  },
};

const updateMetaTag = (attribute: 'name' | 'property', key: string, content: string) => {
  let element = document.querySelector(`meta[${attribute}="${key}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
};

const updateCanonicalLink = (url: string) => {
  let element = document.querySelector('link[rel="canonical"]');
  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', 'canonical');
    document.head.appendChild(element);
  }
  element.setAttribute('href', url);
};

export const SeoManager: React.FC = () => {
  const { i18n } = useTranslation();

  useEffect(() => {
    const lang = i18n.language || 'fa';
    syncDocumentDirAndLang(lang);

    const seoData = seoDictionary[lang] || seoDictionary.fa;

    // Document title
    document.title = seoData.title;

    // Meta Description & Title
    updateMetaTag('name', 'title', seoData.title);
    updateMetaTag('name', 'description', seoData.description);

    // Open Graph
    updateMetaTag('property', 'og:title', seoData.title);
    updateMetaTag('property', 'og:description', seoData.description);
    updateMetaTag('property', 'og:url', seoData.canonical);
    updateMetaTag('property', 'og:locale', seoData.ogLocale);

    // Twitter Card
    updateMetaTag('name', 'twitter:title', seoData.title);
    updateMetaTag('name', 'twitter:description', seoData.description);
    updateMetaTag('name', 'twitter:url', seoData.canonical);

    // Canonical link
    updateCanonicalLink(seoData.canonical);
  }, [i18n.language]);

  return null;
};
