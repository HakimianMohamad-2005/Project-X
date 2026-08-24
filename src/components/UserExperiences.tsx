import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Star, 
  PlusCircle, 
  Award, 
  CheckCircle, 
  TrendingUp, 
  Building, 
  ShieldCheck, 
  Sparkles, 
  Factory, 
  Filter,
  MessageSquareQuote,
  Loader2
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'motion/react';
import { ThemeMode, ExperienceCategory, UserExperience } from '../types';
import { SubmitExperienceModal } from './SubmitExperienceModal';
import { toPersianDigits } from '../utils/persian';
import { fetchUserExperiencesFromApi, getLocalExperiences } from '../lib/api';

interface UserExperiencesProps {
  theme?: ThemeMode;
}

export const UserExperiences: React.FC<UserExperiencesProps> = ({ theme = 'light' }) => {
  const { t, i18n } = useTranslation();
  const isLight = theme === 'light';
  const currentLang = i18n.language || 'fa';
  const isFa = currentLang === 'fa';
  const isRtl = currentLang === 'fa' || currentLang === 'ar';

  const [experiences, setExperiences] = useState<UserExperience[]>(() => {
    const localExps = getLocalExperiences();
    return Array.isArray(localExps) ? localExps : [];
  });

  const [apiExperiences, setApiExperiences] = useState<UserExperience[]>([]);
  const [isLoadingApi, setIsLoadingApi] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ExperienceCategory>('all');
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

  // Sync experiences list with local storage and MySQL API results
  useEffect(() => {
    const localExps = getLocalExperiences() || [];
    const dynamicItems = [...localExps, ...apiExperiences];
    
    // Deduplicate by ID
    const uniqueMap = new Map<string, UserExperience>();
    dynamicItems.forEach((item) => {
      if (item && item.id) {
        uniqueMap.set(item.id, item);
      }
    });
    
    setExperiences(Array.from(uniqueMap.values()));
  }, [apiExperiences]);

  // Fetch approved experiences from MySQL database via PHP API on mount
  useEffect(() => {
    let isMounted = true;
    const loadExperiences = async () => {
      setIsLoadingApi(true);
      try {
        const res = await fetchUserExperiencesFromApi();
        if (isMounted && res.success && Array.isArray(res.experiences)) {
          setApiExperiences(res.experiences);
        }
      } catch (err) {
        console.warn('Could not load experiences from API:', err);
      } finally {
        if (isMounted) setIsLoadingApi(false);
      }
    };

    loadExperiences();
    return () => {
      isMounted = false;
    };
  }, []);

  const categories: { key: ExperienceCategory; labelKey: string; icon: any }[] = [
    { key: 'all', labelKey: 'userExperiences.categories.all', icon: Users },
    { key: 'manufacturing', labelKey: 'userExperiences.categories.manufacturing', icon: Factory },
    { key: 'finance-systems', labelKey: 'userExperiences.categories.financeSystems', icon: TrendingUp },
    { key: 'sales-services', labelKey: 'userExperiences.categories.salesServices', icon: Building }
  ];

  const filteredExperiences = selectedCategory === 'all' 
    ? experiences 
    : experiences.filter(exp => exp.category === selectedCategory);

  const handleAddNewExperience = (newExp: UserExperience) => {
    setExperiences(prev => {
      const exists = prev.some(e => e.id === newExp.id);
      if (exists) return prev;
      return [newExp, ...prev];
    });
  };

  const getVolumeBadge = (volume: string) => {
    switch (volume) {
      case 'vol1':
        return {
          label: t('userExperiences.volume.vol1Short', 'مطالعه جلد اول'),
          color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
        };
      case 'vol2':
        return {
          label: t('userExperiences.volume.vol2Short', 'مطالعه جلد دوم'),
          color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20'
        };
      default:
        return {
          label: t('userExperiences.volume.bundleShort', 'مطالعه دوره کامل ۲ جلدی'),
          color: 'bg-[#B87333]/15 text-[#B87333] border-[#B87333]/30 font-bold'
        };
    }
  };

  return (
    <div className="space-y-12">
      {/* Header Banner */}
      <div className={`relative overflow-hidden rounded-3xl p-8 sm:p-12 border transition-all ${
        isLight
          ? 'bg-gradient-to-br from-stone-100 via-amber-50/40 to-stone-200 border-stone-300 shadow-lg text-stone-900'
          : 'bg-gradient-to-br from-[#161719] via-[#1E2024] to-[#121315] border-stone-800 shadow-2xl text-[#FAF7F2]'
      }`}>
        <div className="relative z-10 max-w-4xl space-y-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#B87333]/15 text-[#B87333] border border-[#B87333]/30">
            <Sparkles className="w-4 h-4" />
            <span>{t('userExperiences.header.badge', 'گواهی‌های عملیاتی مدیران و صنایع کشور')}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            {t('userExperiences.header.title', 'تجربیات واقعی خوانندگان و مدیران صنایع')}
          </h1>

          <p className={`text-sm sm:text-base lg:text-lg leading-relaxed ${isLight ? 'text-stone-700' : 'text-stone-300'}`}>
            {t('userExperiences.header.subtitle', 'روایت دستاوردهای مستند مدیران کارخانجات، مدیران مالی و کارآفرینانی که با پیاده‌سازی متدولوژی کتاب اورانگوتان ۳+، مهار ضایعات پنهان، اصلاح سود تورمی و معماری سیستم‌های پایدار را رقم زدند.')}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4">
            <button
              onClick={() => setIsSubmitModalOpen(true)}
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl font-bold text-sm bg-[#B87333] hover:bg-[#965A25] text-white shadow-xl shadow-[#B87333]/20 transition-all transform hover:-translate-y-0.5 active:scale-95"
            >
              <PlusCircle className="w-5 h-5" />
              <span>{t('userExperiences.header.submitCta', 'اشتراک‌گذاری تجربه شما از مطالعه کتاب')}</span>
            </button>

            <div className="flex items-center gap-2 text-xs font-medium text-stone-500 dark:text-stone-400">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>{t('userExperiences.header.verifiedBadge', 'تمام نظرات و دستاوردها توسط انتشارات راستی‌آزمایی شده‌اند.')}</span>
            </div>
          </div>
        </div>

        {/* Decorative background watermark */}
        <div className={`absolute -bottom-10 ${isRtl ? '-left-10' : '-right-10'} opacity-5 pointer-events-none select-none`}>
          <MessageSquareQuote className="w-80 h-80 text-[#B87333]" />
        </div>
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center justify-between flex-wrap gap-4 pb-2 border-b border-stone-200 dark:border-stone-800">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
          {categories.map(cat => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.key;
            return (
              <button
                key={cat.key}
                onClick={() => setSelectedCategory(cat.key)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  isSelected
                    ? 'bg-[#B87333] text-white shadow-md'
                    : isLight
                      ? 'bg-stone-200/80 hover:bg-stone-300 text-stone-700'
                      : 'bg-[#1C1E22] hover:bg-[#282B30] text-stone-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{t(cat.labelKey)}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          {isLoadingApi && (
            <span className="flex items-center gap-1 text-[11px] text-[#B87333]">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>{isFa ? 'در حال همگام‌سازی...' : 'Syncing...'}</span>
            </span>
          )}
          <span className="text-xs font-bold text-stone-500 dark:text-stone-400">
            {isFa ? `${toPersianDigits(filteredExperiences.length)} تجربه ثبت‌شده` : `${filteredExperiences.length} Experiences`}
          </span>
        </div>
      </div>

      {/* Experiences Grid / Empty State */}
      {filteredExperiences.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          <AnimatePresence mode="popLayout">
            {filteredExperiences.map((exp, idx) => {
              const volInfo = getVolumeBadge(exp.volumeRead);
              return (
                <motion.div
                  key={exp.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25, delay: idx * 0.05 }}
                  className={`flex flex-col justify-between rounded-3xl p-6 sm:p-7 border transition-all hover:shadow-xl ${
                    isLight
                      ? 'bg-white border-stone-200 hover:border-[#B87333]/40 text-stone-900 shadow-sm'
                      : 'bg-[#17181A] border-stone-800 hover:border-[#B87333]/40 text-[#FAF7F2]'
                  }`}
                >
                  {/* Top Section */}
                  <div className="space-y-4">
                    {/* Header: User Info & Verified Tag */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#B87333] to-[#8C5220] text-white font-bold flex items-center justify-center text-lg shadow-md shrink-0">
                          {exp.fullName.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h3 className="font-black text-sm sm:text-base leading-snug">
                              {exp.fullName}
                            </h3>
                            {exp.verified && (
                              <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" title={t('userExperiences.card.verifiedTooltip', 'تایید شده توسط انتشارات')} />
                            )}
                          </div>
                          <p className={`text-xs ${isLight ? 'text-stone-600' : 'text-stone-400'} line-clamp-1`}>
                            {exp.role}
                          </p>
                          <p className={`text-[11px] font-semibold text-[#B87333] line-clamp-1`}>
                            {exp.company}
                          </p>
                        </div>
                      </div>

                      {/* Stars */}
                      <div className="flex items-center gap-0.5 text-amber-500 shrink-0">
                        {[...Array(5)].map((_, sIdx) => (
                          <Star
                            key={sIdx}
                            className={`w-4 h-4 ${sIdx < exp.rating ? 'fill-amber-500 text-amber-500' : 'text-stone-400'}`}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Volume Badge & Date */}
                    <div className="flex items-center justify-between gap-2 flex-wrap text-xs">
                      <span className={`px-2.5 py-1 rounded-lg border text-[11px] font-bold ${volInfo.color}`}>
                        {volInfo.label}
                      </span>
                      <span className="text-[11px] text-stone-400">
                        {isFa ? toPersianDigits(exp.date) : exp.date}
                      </span>
                    </div>

                    {/* Achievement Badge (Highlighted Box) */}
                    <div className="p-3 rounded-2xl bg-[#B87333]/10 border border-[#B87333]/25 flex items-center gap-2.5">
                      <Award className="w-4 h-4 text-[#B87333] shrink-0" />
                      <div className="text-xs font-black text-[#B87333] leading-snug">
                        {exp.achievementBadge}
                      </div>
                    </div>

                    {/* Feedback Text Quote */}
                    <p className={`text-xs sm:text-sm leading-relaxed text-justify ${
                      isLight ? 'text-stone-700' : 'text-stone-300'
                    }`}>
                      «{exp.feedback}»
                    </p>
                  </div>

                  {/* Bottom Industry Tag */}
                  <div className="pt-5 mt-4 border-t border-stone-100 dark:border-stone-800/80 flex items-center justify-between text-[11px] text-stone-400">
                    <span className="flex items-center gap-1">
                      <Building className="w-3.5 h-3.5 text-stone-400" />
                      <span>{exp.industry}</span>
                    </span>
                    <span className="text-[#B87333] font-bold">
                      {t('userExperiences.modelBadge', '+3 Model')}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className={`relative overflow-hidden rounded-3xl p-8 sm:p-14 text-center border transition-all ${
            isLight
              ? 'bg-gradient-to-b from-stone-50/80 via-white to-stone-100/80 border-stone-200 shadow-sm text-stone-800'
              : 'bg-gradient-to-b from-[#181A1D] via-[#141517] to-[#101113] border-stone-800 shadow-xl text-[#FAF7F2]'
          }`}
        >
          {/* Subtle decorative glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-[#B87333]/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-xl mx-auto space-y-6 flex flex-col items-center">
            {/* Icon badge */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-br from-[#B87333]/20 via-[#B87333]/10 to-transparent border border-[#B87333]/30 flex items-center justify-center text-[#B87333] shadow-inner">
              <MessageSquareQuote className="w-8 h-8 sm:w-10 sm:h-10 text-[#B87333]" />
            </div>

            <div className="space-y-3">
              <h3 className="text-xl sm:text-2xl font-black tracking-tight">
                {t('userExperiences.emptyState.title', 'هنوز تجربه‌ای برای این بخش ثبت نشده است')}
              </h3>
              <p className={`text-sm sm:text-base leading-relaxed ${isLight ? 'text-stone-600' : 'text-stone-300'}`}>
                {t('userExperiences.emptyState.desc', 'هنوز تجربه‌ای برای این بخش ثبت نشده است. اولین نفری باشید که دستاورد و تجربه خود را از مطالعه کتاب «اورانگوتان ۳+» ثبت می‌کنید!')}
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setIsSubmitModalOpen(true)}
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-2xl font-bold text-sm bg-[#B87333] hover:bg-[#965A25] text-white shadow-xl shadow-[#B87333]/25 transition-all transform hover:-translate-y-0.5 active:scale-95 cursor-pointer"
              >
                <PlusCircle className="w-5 h-5" />
                <span>{t('userExperiences.emptyState.btn', 'اشتراک‌گذاری تجربه شما')}</span>
              </button>

              {selectedCategory !== 'all' && (
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`inline-flex items-center gap-2 px-5 py-3.5 rounded-2xl font-medium text-xs sm:text-sm border transition-all cursor-pointer ${
                    isLight
                      ? 'bg-stone-100 hover:bg-stone-200 border-stone-300 text-stone-700'
                      : 'bg-stone-800/60 hover:bg-stone-800 border-stone-700 text-stone-300'
                  }`}
                >
                  <Filter className="w-4 h-4" />
                  <span>{t('userExperiences.categories.all', 'همه تجربیات')}</span>
                </button>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* Bottom CTA Box */}
      <div className={`p-8 rounded-3xl text-center space-y-4 border ${
        isLight ? 'bg-stone-100 border-stone-200' : 'bg-[#151618] border-stone-800'
      }`}>
        <h3 className="text-xl sm:text-2xl font-black">
          {t('userExperiences.bottomCta.title', 'شما هم از تجربیات و نتایج سازمان خود بگویید')}
        </h3>
        <p className={`max-w-xl mx-auto text-xs sm:text-sm leading-relaxed ${isLight ? 'text-stone-600' : 'text-stone-400'}`}>
          {t('userExperiences.bottomCta.subtitle', 'هر فصل از کتاب اورانگوتان ۳+ برای حل یک معضل عینی نگارش شده است. اگر از ابزارهای کارت‌های تصمیم یا فرمول‌های مهار خونریزی مالی استفاده کرده‌اید، نظر و دستاورد شما برای ما ارزشمند است.')}
        </p>
        <button
          onClick={() => setIsSubmitModalOpen(true)}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs sm:text-sm bg-[#B87333] hover:bg-[#965A25] text-white shadow-lg transition-transform active:scale-95"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{t('userExperiences.bottomCta.btn', 'ثبت تجربه و دستاورد جدید')}</span>
        </button>
      </div>

      {/* Modal for Submission */}
      <SubmitExperienceModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        onSubmit={handleAddNewExperience}
        theme={theme}
      />
    </div>
  );
};
