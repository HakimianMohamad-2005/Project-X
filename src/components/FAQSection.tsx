import React, { useState } from 'react';
import { HelpCircle, ChevronDown, BookOpen, CheckCircle2, FileText, Phone } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ThemeMode, ActiveTab } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface FAQSectionProps {
  theme?: ThemeMode;
  onSelectTab?: (tab: ActiveTab) => void;
  onOpenSamplePdf?: () => void;
}

interface FAQItem {
  id: string;
  category: 'purchase' | 'content' | 'shipping' | 'audience';
  question: string;
  answer: string;
  highlights?: string[];
}

export const FAQSection: React.FC<FAQSectionProps> = ({
  theme = 'light',
  onSelectTab,
  onOpenSamplePdf
}) => {
  const { t } = useTranslation();
  const isLight = theme === 'light';
  const [activeCategory, setActiveCategory] = useState<'all' | 'audience' | 'content' | 'purchase' | 'shipping'>('all');
  const [openId, setOpenId] = useState<string | null>('faq-1');

  const defaultFaqs: FAQItem[] = [
    {
      id: 'faq-1',
      category: 'audience',
      question: 'این کتاب دو جلدی دقیقاً برای چه کسانی نوشته شده است؟',
      answer: 'کتاب «اورانگوتان +۳» اختصاصاً برای مدیران عامل، مالکان کارخانجات و کارگاه‌های تولیدی، مدیران ارشد عملیاتی و صاحبان کسب‌وکارهای توسعه‌یافته در ایران نوشته شده است. اگر احساس می‌کنید تمام بار تصمیم‌گیری سازمان روی دوش شماست، کارکنان بدون حضور شما خروجی ندارند یا با افزایش درآمد اتلاف مالی شما بیشتر می‌شود، این کتاب نقشه راه دقیق شماست.',
      highlights: [
        'مدیران عامل و صاحبان صنایع تولیدی و خدماتی',
        'مدیران ارشد اجرایی، مالی و بازرگانی',
        'کارآفرینانی که قصد گذار از مدیریت هیجانی به ساختار ماندگار دارند'
      ]
    },
    {
      id: 'faq-2',
      category: 'content',
      question: 'آیا برای فهم و اجرای مطالب کتاب نیاز به مدرک MBA یا پیش‌زمینه آکادمیک است؟',
      answer: 'خیر! زبان کتاب کاملاً کاربردی، صریح و بدون اصطلاحات پیچیده نظری است. تمامی الگوها، فرمول‌ها و کارت‌های تصمیم براساس تجربه واقعی در کف کارخانه‌ها و شرکت‌های ایرانی تدوین شده‌اند و نیازی به هیچ‌گونه پیش‌زمینه آکادمیک مدیریت ندارید.',
      highlights: [
        'زبان ساده، عاری از تئوری‌های غربی غیرکاربردی',
        'تمرکز بر مثال‌های بومی و چالش‌های واقعی بازار ایران',
        'ارائه چک‌لیست‌ها و پروتکل‌های گام‌به‌گام قابلاجراء'
      ]
    },
    {
      id: 'faq-3',
      category: 'content',
      question: 'تفاوت اصلی جلد اول و جلد دوم کتاب چیست؟',
      answer: 'جلد اول (از مدیریت غریزی تا خودآگاهی) به عارضه‌یابی و افشای «تله‌های رفتار غریزی» در مدیریت پرداخته و علت ریشه‌ای خونریزی مالی و بی‌نظمی کارخانه‌ها را شفاف می‌سازد. جلد دوم (نقشه راه پایداری و رشد +۳) ابزارها، لورهای سه‌گانه، کارت‌های تصمیم و معماری سازمان یادگیرنده را ارائه می‌دهد تا سیستم بدون وابسته بودن به اشخاص اداره شود.',
      highlights: [
        'جلد ۱: آسیب‌شناسی و شناخت تله‌های تصمیم‌گیری غریزی',
        'جلد ۲: ابزارسازی، فرمول‌های محاسبه اتلاف و ساختار ماندگار'
      ]
    },
    {
      id: 'faq-4',
      category: 'content',
      question: 'چرا این کتاب با سایر کتاب‌های ترجمه‌ای مدیریت در بازار متفاوت است؟',
      answer: 'اکثر کتاب‌های مدیریت موجود در بازار، ترجمه متون غربی هستند که شرایط محیطی، تورم، نوسانات ارزی و فرهنگ نیروی انسانی ایران را نادیده می‌گیرند. کتاب اورانگوتان +۳ ماحصل سال‌ها تجربه مستقیم علی‌اصغر حکیمیان در مواجهه با چالش‌های واقعی تولید و صنعت در ایران است.',
      highlights: [
        'سازگار با شرایط تورمی و نوسانات بازار ایران',
        'تحلیل دقیق رفتارهای نیروی انسانی و فرهنگ سازمانی بومی',
        'بررسی پرونده‌های واقعی صنایع مختلف داخلی'
      ]
    },
    {
      id: 'faq-5',
      category: 'purchase',
      question: 'آیا امکان مطالعه نمونه کتاب قبل از ثبت سفارش وجود دارد؟',
      answer: 'بله! شما می‌توانید نسخه ۳۶ صفحه‌ای شامل منتخب فصل‌های مهم جلد اول و دوم را به صورت رایگان در قالب فایل PDF دریافت و مطالعه کنید تا با نحوه نگارش و عمق مطالب آشنا شوید.',
      highlights: [
        'دریافت فوری فایل PDF ۳۶ صفحه‌ای نمونه',
        'بدون نیاز به پرداخت هزینه'
      ]
    },
    {
      id: 'faq-6',
      category: 'purchase',
      question: 'آیا امکان درخواست امضای اختصاصی و تقدیم‌نامه نویسنده وجود دارد؟',
      answer: 'بله، هنگام اضافه کردن پکیج کتاب به سبد خرید می‌توانید گزینه «درخواست امضا و یادداشت اختصاصی نویسنده» را فعال کرده و نام تحویل‌گیرنده یا هدیه‌گیرنده را وارد نمایید تا کتاب با امضای علی‌اصغر حکیمیان ارسال شود.',
      highlights: [
        'امضای دستی نویسنده روی صفحه نخست کتاب',
        'گزینه‌ای ایده‌آل برای هدیه دادن به مدیران و همکاران ارشد'
      ]
    },
    {
      id: 'faq-7',
      category: 'shipping',
      question: 'زمان ارسال و نحوه تحویل سفارش چگونه است؟',
      answer: 'تمامی سفارش‌ها ظرف ۲۴ ساعت کاری بسته‌بندی شده و از طریق پست پیشتاز به تمام نقاط ایران ارسال می‌گردند. کد رهگیری مرسوله پستی بلافاصله از طریق پیامک ارسال شده و در بخش «پیگیری سفارش» سایت نیز قابل استعلام است.',
      highlights: [
        'ارسال سریع با پست پیشتاز کشوری',
        'ارسال رایگان برای تمامی سفارش‌ها و پکیج کامل',
        'رهگیری آنلاین لحظه‌ای مرسوله'
      ]
    },
    {
      id: 'faq-8',
      category: 'shipping',
      question: 'آیا امکان خرید عمده سازمانی و صدور فاکتور رسمی حقوقی وجود دارد؟',
      answer: 'بله! برای سازمان‌ها، کارخانجات و شرکت‌هایی که قصد خرید تعداد بالا برای پرسنل مدیریتی خود دارند، فاکتور رسمی حقوقی با محاسبه ارزش افزوده و شناسه ملی صادر می‌شود. همچنین امکان هماهنگی جلسه با نویسنده وجود دارد.',
      highlights: [
        'صدور فاکتور رسمی معتبر حقوقی',
        'تخفیف ویژه پکیج‌های خرید ۵ جلد به بالا',
        'امکان درخواست جلسه آنلاین یا حضوری با نویسنده'
      ]
    }
  ];

  const translatedFaqs = t('faq.items', { returnObjects: true }) as FAQItem[];
  const faqs = (Array.isArray(translatedFaqs) && translatedFaqs.length > 0)
    ? translatedFaqs
    : defaultFaqs;

  const filteredFaqs = activeCategory === 'all' 
    ? faqs 
    : faqs.filter(f => f.category === activeCategory);

  const toggleFaq = (id: string) => {
    setOpenId(prev => prev === id ? null : id);
  };

  return (
    <div className="space-y-12 py-4">
      
      {/* Header Banner */}
      <div className={`p-8 sm:p-12 rounded-3xl border relative overflow-hidden text-center space-y-4 ${
        isLight 
          ? 'bg-gradient-to-br from-stone-100 via-amber-50/50 to-stone-50 border-stone-200' 
          : 'bg-gradient-to-br from-[#1E2022] via-[#1A1C1E] to-[#121314] border-stone-800'
      }`}>
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#B87333]/15 text-[#B87333] border border-[#B87333]/30 text-xs font-bold">
          <HelpCircle className="w-4 h-4 text-[#B87333]" />
          <span>{t('faq.headerBadge')}</span>
        </div>

        <h1 className={`text-2xl sm:text-4xl font-black leading-tight ${isLight ? 'text-stone-900' : 'text-[#FAF7F2]'}`}>
          {t('faq.headerTitle')}
        </h1>

        <p className="text-xs sm:text-sm text-stone-400 max-w-2xl mx-auto leading-relaxed">
          {t('faq.headerSubtitle')}
        </p>

        {/* Quick Call to Action Buttons */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
          {onOpenSamplePdf && (
            <button
              onClick={onOpenSamplePdf}
              className="px-5 py-2.5 rounded-xl bg-[#B87333] hover:bg-amber-600 text-white font-bold text-xs shadow-lg transition-all flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              <span>{t('faq.ctaSamplePdf')}</span>
            </button>
          )}

          {onSelectTab && (
            <button
              onClick={() => onSelectTab('books')}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs border transition-all flex items-center gap-2 ${
                isLight 
                  ? 'bg-white text-stone-800 border-stone-300 hover:bg-stone-50' 
                  : 'bg-stone-800 text-stone-200 border-stone-700 hover:bg-stone-700'
              }`}
            >
              <BookOpen className="w-4 h-4 text-[#B87333]" />
              <span>{t('faq.ctaBuyBooks')}</span>
            </button>
          )}
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setActiveCategory('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
            activeCategory === 'all'
              ? 'bg-[#B87333] text-white border-[#B87333] shadow-md'
              : isLight
                ? 'bg-white text-stone-600 border-stone-200 hover:text-stone-900'
                : 'bg-stone-900 text-stone-400 border-stone-800 hover:text-white'
          }`}
        >
          {t('faq.categoryAll', { count: faqs.length })}
        </button>

        <button
          onClick={() => setActiveCategory('audience')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
            activeCategory === 'audience'
              ? 'bg-[#B87333] text-white border-[#B87333] shadow-md'
              : isLight
                ? 'bg-white text-stone-600 border-stone-200 hover:text-stone-900'
                : 'bg-stone-900 text-stone-400 border-stone-800 hover:text-white'
          }`}
        >
          {t('faq.categoryAudience')}
        </button>

        <button
          onClick={() => setActiveCategory('content')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
            activeCategory === 'content'
              ? 'bg-[#B87333] text-white border-[#B87333] shadow-md'
              : isLight
                ? 'bg-white text-stone-600 border-stone-200 hover:text-stone-900'
                : 'bg-stone-900 text-stone-400 border-stone-800 hover:text-white'
          }`}
        >
          {t('faq.categoryContent')}
        </button>

        <button
          onClick={() => setActiveCategory('purchase')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
            activeCategory === 'purchase'
              ? 'bg-[#B87333] text-white border-[#B87333] shadow-md'
              : isLight
                ? 'bg-white text-stone-600 border-stone-200 hover:text-stone-900'
                : 'bg-stone-900 text-stone-400 border-stone-800 hover:text-white'
          }`}
        >
          {t('faq.categoryPurchase')}
        </button>

        <button
          onClick={() => setActiveCategory('shipping')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
            activeCategory === 'shipping'
              ? 'bg-[#B87333] text-white border-[#B87333] shadow-md'
              : isLight
                ? 'bg-white text-stone-600 border-stone-200 hover:text-stone-900'
                : 'bg-stone-900 text-stone-400 border-stone-800 hover:text-white'
          }`}
        >
          {t('faq.categoryShipping')}
        </button>
      </div>

      {/* Accordion FAQ Items List */}
      <div className="max-w-4xl mx-auto space-y-4">
        {filteredFaqs.map((faq) => {
          const isOpen = openId === faq.id;
          return (
            <div
              key={faq.id}
              className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                isLight
                  ? isOpen
                    ? 'bg-white border-[#B87333]/50 shadow-md'
                    : 'bg-stone-50 border-stone-200 hover:border-stone-300'
                  : isOpen
                    ? 'bg-[#1E2022] border-[#B87333]/50 shadow-lg'
                    : 'bg-[#181A1B] border-stone-800 hover:border-stone-700'
              }`}
            >
              <button
                onClick={() => toggleFaq(faq.id)}
                className="w-full p-5 sm:p-6 text-right ltr:text-left flex items-center justify-between gap-4 focus:outline-none"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl border ${
                    isOpen 
                      ? 'bg-[#B87333] text-white border-[#B87333]' 
                      : isLight 
                        ? 'bg-stone-200 text-stone-600 border-stone-300' 
                        : 'bg-stone-800 text-stone-400 border-stone-700'
                  }`}>
                    <HelpCircle className="w-4 h-4" />
                  </div>
                  <h3 className={`text-sm sm:text-base font-bold ${isLight ? 'text-stone-900' : 'text-[#FAF7F2]'}`}>
                    {faq.question}
                  </h3>
                </div>

                <div className={`p-1.5 rounded-lg border transition-transform duration-300 ${
                  isOpen ? 'rotate-180 bg-[#B87333]/20 border-[#B87333]/30 text-[#B87333]' : 'text-stone-400 border-transparent'
                }`}>
                  <ChevronDown className="w-4 h-4" />
                </div>
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className={`px-5 sm:px-6 pb-6 pt-2 border-t text-xs sm:text-sm leading-relaxed space-y-4 ${
                      isLight ? 'border-stone-100 text-stone-700' : 'border-stone-800/80 text-stone-300'
                    }`}>
                      <p>{faq.answer}</p>

                      {faq.highlights && faq.highlights.length > 0 && (
                        <div className={`p-4 rounded-xl border space-y-2 ${
                          isLight ? 'bg-amber-50/50 border-amber-200/60' : 'bg-stone-900/60 border-stone-800'
                        }`}>
                          <span className="text-xs font-extrabold text-[#B87333] block">
                            {t('faq.highlightsTitle')}
                          </span>
                          <ul className="space-y-1.5">
                            {faq.highlights.map((h, i) => (
                              <li key={i} className="flex items-center gap-2 text-xs">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                                <span>{h}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Bottom Assistance Box */}
      <div className={`p-8 rounded-3xl border max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 ${
        isLight ? 'bg-stone-100 border-stone-200' : 'bg-stone-900/80 border-stone-800'
      }`}>
        <div className="space-y-1 text-center sm:text-right ltr:text-left">
          <h4 className={`text-base font-bold ${isLight ? 'text-stone-900' : 'text-[#FAF7F2]'}`}>
            {t('faq.bottomBoxTitle')}
          </h4>
          <p className="text-xs text-stone-400">
            {t('faq.bottomBoxSubtitle')}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <a
            href="tel:02188990011"
            className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md flex items-center gap-2"
          >
            <Phone className="w-4 h-4" />
            <span>{t('faq.supportPhoneBtn')}</span>
          </a>
        </div>
      </div>

    </div>
  );
};
