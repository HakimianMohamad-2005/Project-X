import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { syncDocumentDirAndLang } from '../i18n/config';
import { ActiveTab } from '../types';

interface SeoMetaData {
  title: string;
  description: string;
  keywords: string;
  canonical: string;
  ogLocale: string;
  ogType: string;
  schemaType: 'Book' | 'WebApplication';
  schemaName: string;
  schemaDesc: string;
}

// 1. Home / Book Platform Meta Data Dictionary
const homeSeoDictionary: Record<string, SeoMetaData> = {
  fa: {
    title: 'کتاب اورانگوتان ۳+ | از مدیریت غریزی تا سازمانی ماندگار | علیاصغر حکیمیان',
    description: 'خرید مستقیم کتاب ۲ جلدی «اورانگوتان ۳+» نوشته علیاصغر حکیمیان حاصل ۴۰ سال تجربه مدیریت صنعتی. راهکارهای عملی مهار خونریزی مالی، حذف ضایعات پنهان و ساخت حافظه سازمانی.',
    keywords: 'اورانگوتان ۳+, کتاب اورانگوتان ۳, علی اصغر حکیمیان, مدیریت غریزی, مدیریت آگاهانه, مدیریت صنعتی, خرید کتاب اورانگوتان',
    canonical: 'https://www.orangutanplus3.com/',
    ogLocale: 'fa_IR',
    ogType: 'book',
    schemaType: 'Book',
    schemaName: 'اورانگوتان ۳+',
    schemaDesc: 'کتاب ۲ جلدی از مدیریت غریزی تا سازمانی که یاد میگیرد، اصلاح میکند و ماندگار میشود.'
  },
  en: {
    title: 'Orangutan 3+ Book | From Instinctive to Sustainable Management | Ali Asghar Hakimian',
    description: 'Official platform for the 2-volume book "Orangutan 3+" by Ali Asghar Hakimian. Practical industrial framework based on 40 years of executive management experience.',
    keywords: 'Orangutan 3+, Ali Asghar Hakimian, instinctive management, industrial management framework, executive leadership book, organizational memory',
    canonical: 'https://www.orangutanplus3.com/en',
    ogLocale: 'en_US',
    ogType: 'book',
    schemaType: 'Book',
    schemaName: 'Orangutan 3+',
    schemaDesc: 'A 2-volume executive manual: From Instinctive Management to an Organization that Learns, Corrects, and Endures.'
  },
  es: {
    title: 'Libro Orangután 3+ | De la Gestión Instintiva a la Organización Sostenible | Ali Asghar Hakimian',
    description: 'Plataforma oficial del libro de 2 volúmenes "Orangután 3+" de Ali Asghar Hakimian. Marco industrial práctico basado en 40 años de experiencia gerencial.',
    keywords: 'Orangután 3+, Ali Asghar Hakimian, gestión instintiva, marco de gestión industrial, libro de liderazgo ejecutivo',
    canonical: 'https://www.orangutanplus3.com/es',
    ogLocale: 'es_ES',
    ogType: 'book',
    schemaType: 'Book',
    schemaName: 'Orangután 3+',
    schemaDesc: 'Manual ejecutivo de 2 volúmenes: De la gestión instintiva a la organización sostenible.'
  },
  de: {
    title: 'Orangutan 3+ Buch | Von instinktiver zu nachhaltiger Unternehmensführung | Ali Asghar Hakimian',
    description: 'Offizielle Plattform für das zweibändige Buch "Orangutan 3+" von Ali Asghar Hakimian. Praktisches Industrie-Framework aus 40 Jahren Managementerfahrung.',
    keywords: 'Orangutan 3+, Ali Asghar Hakimian, instinktives Management, Industrie-Framework, Führungskräftebuch',
    canonical: 'https://www.orangutanplus3.com/de',
    ogLocale: 'de_DE',
    ogType: 'book',
    schemaType: 'Book',
    schemaName: 'Orangutan 3+',
    schemaDesc: 'Zweibändiges Führungshandbuch: Von instinktiver zu nachhaltiger Unternehmensführung.'
  },
  fr: {
    title: 'Livre Orang-outan 3+ | De la Gestion Instinctive à l\'Organisation Durable | Ali Asghar Hakimian',
    description: 'Plateforme officielle du livre en 2 volumes "Orang-outan 3+" par Ali Asghar Hakimian. Cadre industriel pratique basé sur 40 ans d\'expérience de gestion.',
    keywords: 'Orang-outan 3+, Ali Asghar Hakimian, management instinctif, gestion industrielle, livre de direction',
    canonical: 'https://www.orangutanplus3.com/fr',
    ogLocale: 'fr_FR',
    ogType: 'book',
    schemaType: 'Book',
    schemaName: 'Orang-outan 3+',
    schemaDesc: 'Manuel exécutif en 2 volumes : Du management instinctif à l\'organisation durable.'
  },
  zh: {
    title: '猩猩3+ 书籍 | 从本能管理到可持续企业组织 | 阿里·阿斯加尔·哈基米安',
    description: '阿里·阿斯加尔·哈基米安著作《猩猩3+》（两卷本）官方平台。基于40年工业管理经验的实用企业治理框架。',
    keywords: '猩猩3+, 阿里·阿斯加尔·哈基米安, 本能管理, 工业管理框架, 企业家领导力书籍',
    canonical: 'https://www.orangutanplus3.com/zh',
    ogLocale: 'zh_CN',
    ogType: 'book',
    schemaType: 'Book',
    schemaName: '猩猩3+',
    schemaDesc: '企业管理两卷本著作：从本能管理到能学习、能纠错、能基业长青的组织。'
  },
  ja: {
    title: 'オランウータン3+ 書籍 | 本能的経営から持続可能な組織へ | アリ・アスガル・ハキミアン',
    description: 'アリ・アスガル・ハキミアン著『オランウータン3+』（全2巻）公式プラットフォーム。40年の産業経営経験に基づく実践的フレームワーク。',
    keywords: 'オランウータン3+, アリ・アスガル・ハキミアン, 本能的経営, 産業マネジメント, 経営者向け書籍',
    canonical: 'https://www.orangutanplus3.com/ja',
    ogLocale: 'ja_JP',
    ogType: 'book',
    schemaType: 'Book',
    schemaName: 'オランウータン3+',
    schemaDesc: 'エグゼクティブ向け2巻本：本能的経営から学び、是正し、持続する組織へ。'
  },
  hi: {
    title: 'ओरंगउटान 3+ पुस्तक | सहज प्रबंधन से टिकाऊ संगठन तक | अली असगर हकीमियन',
    description: 'अली असगर हकीमियन द्वारा लिखित 2-खंड पुस्तक "ओरंगउटान 3+" का आधिकारिक मंच। 40 वर्षों के औद्योगिक प्रबंधन अनुभव पर आधारित व्यावहारिक ढांचा।',
    keywords: 'ओरंगउटान 3+, अली असगर हकीमियन, सहज प्रबंधन, औद्योगिक प्रबंधन ढांचा, नेतृत्व पुस्तक',
    canonical: 'https://www.orangutanplus3.com/hi',
    ogLocale: 'hi_IN',
    ogType: 'book',
    schemaType: 'Book',
    schemaName: 'ओरंगउटान 3+',
    schemaDesc: '2-खंडीय प्रबंधन मैनुअल: सहज प्रबंधन से उस संगठन तक जो सीखता है, सुधारता है और टिकाऊ बनता है।'
  },
  ar: {
    title: 'أورانغوتان +۳ | من الإدارة الغريزية إلى مؤسسة متعلمة ومستدامة | علي أصغر حكيميان',
    description: 'الموقع الرسمي لكتاب «أورانغوتان +۳» (مجلدین) تأليف علي أصغر حكيميان. خلاصة ٤٠ عاماً من الخبرة في الإدارة الصناعية وحلول النزيف الداخلي للمؤسسات.',
    keywords: 'أورانغوتان +۳, علي أصغر حكيميان, الإدارة الغريزية, إدارة صناعية, كتاب القيادة والإدارة, ذاكرة المؤسسة',
    canonical: 'https://www.orangutanplus3.com/ar',
    ogLocale: 'ar_SA',
    ogType: 'book',
    schemaType: 'Book',
    schemaName: 'أورانغوتان +۳',
    schemaDesc: 'دليل تنفيذي في مجلدين: من الإدارة الغريزية إلى مؤسسة تتعلم، تصحح مسارها وتدوم.'
  },
};

// 2. Manager Assessment Tool Meta Data Dictionary
const assessmentSeoDictionary: Record<string, SeoMetaData> = {
  fa: {
    title: 'آزمون آنلاین غریزی و خودارزیابی مدیران | سنجش الگوهای تصمیم‌گیری | اورانگوتان ۳+',
    description: 'آزمون آنلاین خودارزیابی مدیریت شامل ۲۴ سناریوی واقعی کارخانجات برای سنجش درصد درگیری سازمان با رفتارهای غریزی و ارائه گزارش تحلیلی ۸ بعدی بر اساس مدل ۳+ علی‌اصغر حکیمیان.',
    keywords: 'آزمون مدیریت, تست خودارزیابی مدیران, مدیریت غریزی, تصمیم گیری مدیریتی, اورانگوتان ۳+, سنجش بلوغ سازمانی, علی اصغر حکیمیان, تست آنلاین مدیریت',
    canonical: 'https://www.orangutanplus3.com/manager-assessment',
    ogLocale: 'fa_IR',
    ogType: 'website',
    schemaType: 'WebApplication',
    schemaName: 'آزمون غریزی و خودارزیابی مدیران | اورانگوتان ۳+',
    schemaDesc: 'سنجشگر آنلاین رفتار غریزی و بلوغ سیستمی سازمان بر اساس ۲۴ سناریوی واقعی مدیریت صنعت.'
  },
  en: {
    title: 'Online Instinctive Management Quiz & Assessment | Orangutan 3+',
    description: 'Evaluate your organization\'s engagement with instinctive management traps and measure systemic maturity across 8 dimensions with Ali Asghar Hakimian\'s 3+ Framework.',
    keywords: 'management assessment, instinctive management quiz, executive decision audit, systemic maturity test, industrial management assessment, Orangutan 3+, Ali Asghar Hakimian',
    canonical: 'https://www.orangutanplus3.com/en/manager-assessment',
    ogLocale: 'en_US',
    ogType: 'website',
    schemaType: 'WebApplication',
    schemaName: 'Online Instinctive Management Quiz & Assessment | Orangutan 3+',
    schemaDesc: 'Online diagnostic assessment tool measuring instinctive management traps and systemic maturity across 8 operational dimensions.'
  },
  es: {
    title: 'Test Online de Gestión Instintiva y Autoevaluación de Directivos | Orangután 3+',
    description: 'Evalúe el grado de involucramiento de su organización con trampas de gestión instintiva y mida la madurez sistémica en 8 dimensiones según el modelo 3+ de Ali Asghar Hakimian.',
    keywords: 'evaluación directiva, test gestión instintiva, autoevaluación gerencial, madurez sistémica, diagnóstico industrial, Orangután 3+, Ali Asghar Hakimian',
    canonical: 'https://www.orangutanplus3.com/es/manager-assessment',
    ogLocale: 'es_ES',
    ogType: 'website',
    schemaType: 'WebApplication',
    schemaName: 'Test Online de Gestión Instintiva y Autoevaluación de Directivos | Orangután 3+',
    schemaDesc: 'Herramienta de diagnóstico online para medir patrones de gestión instintiva y madurez sistémica en 8 dimensiones operativas.'
  },
  de: {
    title: 'Online-Test für instinktives Management & Führungskräfte-Audit | Orangutan 3+',
    description: 'Bewerten Sie die Anfälligkeit Ihres Unternehmens für instinktive Managementfallen und messen Sie die systemische Reife in 8 Dimensionen nach dem 3+-Framework von Ali Asghar Hakimian.',
    keywords: 'Management-Audit, instinktives Management Test, Führungskräfte Selbsteinschätzung, systemische Reife, Industrie-Diagnostik, Orangutan 3+',
    canonical: 'https://www.orangutanplus3.com/de/manager-assessment',
    ogLocale: 'de_DE',
    ogType: 'website',
    schemaType: 'WebApplication',
    schemaName: 'Online-Test für instinktives Management & Führungskräfte-Audit | Orangutan 3+',
    schemaDesc: 'Online-Diagnosetool zur Messung instinktiver Managementmuster und systemischer Reife über 8 Dimensionen.'
  },
  fr: {
    title: 'Test en Ligne de Management Instinctif & Auto-évaluation des Dirigeants | Orang-outan 3+',
    description: 'Évaluez l\'exposition de votre organisation aux pièges du management instinctif et mesurez la maturité systémique sur 8 dimensions selon le modèle 3+ d\'Ali Asghar Hakimian.',
    keywords: 'évaluation managériale, test management instinctif, audit dirigeants, maturité systémique, diagnostic industriel, Orang-outan 3+',
    canonical: 'https://www.orangutanplus3.com/fr/manager-assessment',
    ogLocale: 'fr_FR',
    ogType: 'website',
    schemaType: 'WebApplication',
    schemaName: 'Test en Ligne de Management Instinctif & Auto-évaluation des Dirigeants | Orang-outan 3+',
    schemaDesc: 'Outil de diagnostic en ligne mesurant les réflexes instinctifs de gestion et la maturité systémique sur 8 dimensions opérationnelles.'
  },
  zh: {
    title: '在线本能管理测试与管理者自评系统 | 猩猩3+',
    description: '基于阿里·阿斯加尔·哈基米安3+管理模型，通过24个工业实战场景评估企业本能管理陷阱程度与8大维度系统化成熟度。',
    keywords: '管理者在线自测, 本能管理测试, 企业决策评估, 系统成熟度诊断, 工业管理框架, 猩猩3+, 阿里·阿斯加尔·哈基米安',
    canonical: 'https://www.orangutanplus3.com/zh/manager-assessment',
    ogLocale: 'zh_CN',
    ogType: 'website',
    schemaType: 'WebApplication',
    schemaName: '在线本能管理测试与管理者自评系统 | 猩猩3+',
    schemaDesc: '基于24个真实工业场景评估企业本能管理陷阱与8大维度系统化成熟度的在线诊断工具。'
  },
  ja: {
    title: '本能的経営オンライン診断＆リーダー自己評価テスト | オランウータン3+',
    description: 'アリ・アスガル・ハキミアンの3+フレームワークに基づき、24の現場シナリオから組織の本能的経営度と8次元のシステム成熟度を診断します。',
    keywords: '経営オンライン診断, 本能的経営テスト, リーダー自己評価, 組織システム成熟度, 産業マネジメント診断, オランウータン3+',
    canonical: 'https://www.orangutanplus3.com/ja/manager-assessment',
    ogLocale: 'ja_JP',
    ogType: 'website',
    schemaType: 'WebApplication',
    schemaName: '本能的経営オンライン診断＆リーダー自己評価テスト | オランウータン3+',
    schemaDesc: '24の産業シナリオを通じて本能的経営トラップと8次元のシステム成熟度を測定するオンライン診断ツール。'
  },
  hi: {
    title: 'ऑनलाइन सहज प्रबंधन प्रश्नोत्तरी और प्रबंधकीय आत्म-मूल्यांकन | ओरंगउटान 3+',
    description: 'अली असगर हकीमियन के 3+ ढांचे के साथ 24 वास्तविक औद्योगिक परिदृश्यों के आधार पर सहज प्रबंधन के जालों और 8 आयामों में प्रणालीगत परिपक्वता का मूल्यांकन करें।',
    keywords: 'प्रबंधन मूल्यांकन, सहज प्रबंधन परीक्षण, नेतृत्व स्व-मूल्यांकन, प्रणालीगत परिपक्वता, औद्योगिक प्रबंधन डायग्नोस्टिक, ओरंगउटान 3+',
    canonical: 'https://www.orangutanplus3.com/hi/manager-assessment',
    ogLocale: 'hi_IN',
    ogType: 'website',
    schemaType: 'WebApplication',
    schemaName: 'ऑनलाइन सहज प्रबंधन प्रश्नोत्तरी और प्रबंधकीय आत्म-मूल्यांकन | ओरंगउटान 3+',
    schemaDesc: '24 वास्तविक औद्योगिक परिदृश्यों के आधार पर सहज प्रबंधन और 8 आयामों में प्रणालीगत परिपक्वता मापने वाला ऑनलाइन उपकरण।'
  },
  ar: {
    title: 'اختبار الإدارة الغريزية والتقييم الذاتي للمديرين أونلاين | أورانغوتان +۳',
    description: 'اختبار إلكتروني للتقييم الذاتي للمديرين يضم ٢٤ سيناريو واقعياً لقياس نسبة الانجرار خلف الإدارة الغريزية ونضج المؤسسة في ٨ أبعاد وفق نموذج +۳ لعلي أصغر حكيميان.',
    keywords: 'اختبار الإدارة, تقييم ذاتي للمديرين, الإدارة الغريزية, اتخاذ القرار الإداري, أورانغوتان +۳, النضج المؤسسي, علي أصغر حكيميان, اختبار الإدارة أونلاين',
    canonical: 'https://www.orangutanplus3.com/ar/manager-assessment',
    ogLocale: 'ar_SA',
    ogType: 'website',
    schemaType: 'WebApplication',
    schemaName: 'اختبار الإدارة الغريزية والتقييم الذاتي للمديرين أونلاين | أورانغوتان +۳',
    schemaDesc: 'أداة تشخيص إلكترونية لقياس سلوكيات الإدارة الغريزية والنضج المؤسسي عبر ٨ أبعاد استناداً إلى ٢٤ سيناريو واقعياً.'
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

const syncHreflangLinks = (isAssessment: boolean) => {
  const languagesList = [
    { code: 'fa', href: isAssessment ? 'https://www.orangutanplus3.com/manager-assessment' : 'https://www.orangutanplus3.com/' },
    { code: 'en', href: isAssessment ? 'https://www.orangutanplus3.com/en/manager-assessment' : 'https://www.orangutanplus3.com/en' },
    { code: 'es', href: isAssessment ? 'https://www.orangutanplus3.com/es/manager-assessment' : 'https://www.orangutanplus3.com/es' },
    { code: 'de', href: isAssessment ? 'https://www.orangutanplus3.com/de/manager-assessment' : 'https://www.orangutanplus3.com/de' },
    { code: 'fr', href: isAssessment ? 'https://www.orangutanplus3.com/fr/manager-assessment' : 'https://www.orangutanplus3.com/fr' },
    { code: 'zh', href: isAssessment ? 'https://www.orangutanplus3.com/zh/manager-assessment' : 'https://www.orangutanplus3.com/zh' },
    { code: 'ja', href: isAssessment ? 'https://www.orangutanplus3.com/ja/manager-assessment' : 'https://www.orangutanplus3.com/ja' },
    { code: 'hi', href: isAssessment ? 'https://www.orangutanplus3.com/hi/manager-assessment' : 'https://www.orangutanplus3.com/hi' },
    { code: 'ar', href: isAssessment ? 'https://www.orangutanplus3.com/ar/manager-assessment' : 'https://www.orangutanplus3.com/ar' },
    { code: 'x-default', href: isAssessment ? 'https://www.orangutanplus3.com/manager-assessment' : 'https://www.orangutanplus3.com/' },
  ];

  languagesList.forEach(({ code, href }) => {
    let link = document.querySelector(`link[rel="alternate"][hreflang="${code}"]`);
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'alternate');
      link.setAttribute('hreflang', code);
      document.head.appendChild(link);
    }
    link.setAttribute('href', href);
  });
};

const updateSchemaStructuredData = (seoData: SeoMetaData, lang: string, isAssessment: boolean) => {
  let script = document.getElementById('dynamic-seo-jsonld') as HTMLScriptElement | null;
  if (!script) {
    script = document.createElement('script');
    script.id = 'dynamic-seo-jsonld';
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }

  let structuredData: object;

  if (isAssessment) {
    structuredData = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebApplication',
          '@id': `${seoData.canonical}#app`,
          'name': seoData.schemaName,
          'url': seoData.canonical,
          'applicationCategory': 'BusinessApplication',
          'operatingSystem': 'All',
          'inLanguage': lang,
          'description': seoData.schemaDesc,
          'author': {
            '@type': 'Person',
            'name': lang === 'fa' || lang === 'ar' ? 'علی‌اصغر حکیمیان' : 'Ali Asghar Hakimian',
            'jobTitle': 'Senior Industrial & Strategic Management Consultant',
            'url': 'https://www.orangutanplus3.com'
          },
          'offers': {
            '@type': 'Offer',
            'price': '0',
            'priceCurrency': 'IRR',
            'availability': 'https://schema.org/InStock'
          }
        },
        {
          '@type': 'Quiz',
          '@id': `${seoData.canonical}#quiz`,
          'name': seoData.title,
          'description': seoData.description,
          'url': seoData.canonical,
          'educationalLevel': 'Executive Management & Industrial Leadership',
          'learningResourceType': 'Assessment Tool'
        },
        {
          '@type': 'WebSite',
          '@id': 'https://www.orangutanplus3.com/#website',
          'url': 'https://www.orangutanplus3.com',
          'name': 'اورانگوتان ۳+ | Orangutan 3+',
          'publisher': {
            '@type': 'Person',
            'name': 'Ali Asghar Hakimian'
          }
        }
      ]
    };
  } else {
    structuredData = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Book',
          '@id': 'https://www.orangutanplus3.com/#book',
          'name': seoData.schemaName,
          'alternateName': 'Orangutan 3+',
          'author': {
            '@type': 'Person',
            'name': lang === 'fa' || lang === 'ar' ? 'علی‌اصغر حکیمیان' : 'Ali Asghar Hakimian',
            'jobTitle': 'Senior Industrial & Strategic Management Consultant'
          },
          'url': seoData.canonical,
          'inLanguage': lang,
          'description': seoData.schemaDesc,
          'offers': {
            '@type': 'Offer',
            'price': '4000000',
            'priceCurrency': 'IRR',
            'availability': 'https://schema.org/InStock',
            'url': seoData.canonical
          }
        },
        {
          '@type': 'WebSite',
          '@id': 'https://www.orangutanplus3.com/#website',
          'url': 'https://www.orangutanplus3.com',
          'name': 'اورانگوتان ۳+',
          'publisher': {
            '@type': 'Person',
            'name': 'علی‌اصغر حکیمیان'
          }
        }
      ]
    };
  }

  script.textContent = JSON.stringify(structuredData, null, 2);
};

interface SeoManagerProps {
  activeTab?: ActiveTab;
}

export const SeoManager: React.FC<SeoManagerProps> = ({ activeTab = 'books' }) => {
  const { i18n } = useTranslation();

  useEffect(() => {
    const lang = i18n.language || 'fa';
    syncDocumentDirAndLang(lang);

    const isAssessment = activeTab === 'quiz' || 
      window.location.pathname.includes('/manager-assessment') || 
      window.location.pathname.includes('/quiz');

    const dictionary = isAssessment ? assessmentSeoDictionary : homeSeoDictionary;
    const seoData = dictionary[lang] || dictionary.fa;

    // 1. Document title
    document.title = seoData.title;

    // 2. Primary Meta Tags
    updateMetaTag('name', 'title', seoData.title);
    updateMetaTag('name', 'description', seoData.description);
    updateMetaTag('name', 'keywords', seoData.keywords);

    // 3. Open Graph
    updateMetaTag('property', 'og:title', seoData.title);
    updateMetaTag('property', 'og:description', seoData.description);
    updateMetaTag('property', 'og:url', seoData.canonical);
    updateMetaTag('property', 'og:type', seoData.ogType);
    updateMetaTag('property', 'og:locale', seoData.ogLocale);
    updateMetaTag('property', 'og:site_name', 'اورانگوتان ۳+ | Orangutan 3+');
    updateMetaTag('property', 'og:image', 'https://www.orangutanplus3.com/Jeld%20-%20Front.png');

    // 4. Twitter Card
    updateMetaTag('name', 'twitter:card', 'summary_large_image');
    updateMetaTag('name', 'twitter:title', seoData.title);
    updateMetaTag('name', 'twitter:description', seoData.description);
    updateMetaTag('name', 'twitter:url', seoData.canonical);
    updateMetaTag('name', 'twitter:image', 'https://www.orangutanplus3.com/Jeld%20-%20Front.png');

    // 5. Canonical URL
    updateCanonicalLink(seoData.canonical);

    // 6. Dynamic Hreflang Tags for all 9 languages + x-default
    syncHreflangLinks(isAssessment);

    // 7. Schema.org JSON-LD Structured Data
    updateSchemaStructuredData(seoData, lang, isAssessment);

  }, [i18n.language, activeTab]);

  return null;
};
