import React, { useState } from 'react';
import { 
  X, 
  Star, 
  Send, 
  CheckCircle2, 
  Building2, 
  User, 
  Mail, 
  Phone, 
  BookOpen, 
  Award, 
  MessageSquare,
  Sparkles,
  ShieldCheck,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { ThemeMode, ExperienceCategory, BookVolumeRead, UserExperience, NewExperienceForm } from '../types';
import { saveUserExperienceToApi, saveLocalExperience } from '../lib/api';

interface SubmitExperienceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (newExp: UserExperience) => void;
  theme?: ThemeMode;
}

export const SubmitExperienceModal: React.FC<SubmitExperienceModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  theme = 'light'
}) => {
  const { t, i18n } = useTranslation();
  const isLight = theme === 'light';
  const isRtl = i18n.language === 'fa' || i18n.language === 'ar';

  const [formData, setFormData] = useState<NewExperienceForm>({
    fullName: '',
    role: '',
    company: '',
    industry: '',
    category: 'manufacturing',
    phoneOrEmail: '',
    rating: 5,
    volumeRead: 'bundle',
    achievementBadge: '',
    feedback: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.company.trim() || !formData.feedback.trim() || !formData.achievementBadge.trim()) {
      setErrorMsg(t('userExperiences.form.validationError', 'لطفاً فیلدهای ستاره‌دار (نام، سازمان، دستاورد کلیدی و متن تجربه) را تکمیل کنید.'));
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    const newExp: UserExperience = {
      id: `exp-${Date.now()}`,
      fullName: formData.fullName.trim(),
      role: formData.role.trim() || t('userExperiences.card.executiveRole', 'مدیر و فعال صنعتی'),
      company: formData.company.trim(),
      industry: formData.industry.trim() || formData.company.trim(),
      category: formData.category,
      rating: formData.rating,
      volumeRead: formData.volumeRead,
      achievementBadge: formData.achievementBadge.trim(),
      keyMetric: formData.achievementBadge.trim(),
      feedback: formData.feedback.trim(),
      verified: true,
      date: new Date().toLocaleDateString(i18n.language === 'fa' ? 'fa-IR' : 'en-US')
    };

    try {
      // Save locally first for instant UI response
      saveLocalExperience(newExp);

      // Submit via POST to MySQL backend API (/api/experiences.php)
      const res = await saveUserExperienceToApi({
        fullName: newExp.fullName,
        role: newExp.role,
        company: newExp.company,
        industry: newExp.industry,
        category: newExp.category,
        phoneOrEmail: formData.phoneOrEmail,
        rating: newExp.rating,
        volumeRead: newExp.volumeRead,
        achievementBadge: newExp.achievementBadge,
        keyMetric: newExp.keyMetric,
        feedback: newExp.feedback
      });

      if (res && res.id) {
        newExp.id = res.id;
      }
      
      onSubmit(newExp);
      setIsSubmitted(true);
    } catch (err: any) {
      console.warn('Error saving experience to API, saved locally:', err);
      onSubmit(newExp);
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsSubmitted(false);
    setErrorMsg('');
    setFormData({
      fullName: '',
      role: '',
      company: '',
      industry: '',
      category: 'manufacturing',
      phoneOrEmail: '',
      rating: 5,
      volumeRead: 'bundle',
      achievementBadge: '',
      feedback: ''
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
      />

      {/* Modal Card */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className={`relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl p-6 sm:p-8 shadow-2xl z-10 border transition-colors ${
          isLight
            ? 'bg-[#FAF8F5] text-stone-900 border-stone-200 shadow-stone-300/40'
            : 'bg-[#18191B] text-[#FAF7F2] border-stone-800 shadow-black/60'
        }`}
        dir={isRtl ? 'rtl' : 'ltr'}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className={`absolute top-5 ${isRtl ? 'left-5' : 'right-5'} p-2.5 rounded-full transition-colors ${
            isLight ? 'hover:bg-stone-200 text-stone-500' : 'hover:bg-stone-800 text-stone-400'
          }`}
        >
          <X className="w-5 h-5" />
        </button>

        {isSubmitted ? (
          <div className="py-12 text-center space-y-5">
            <div className="w-20 h-20 mx-auto rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center ring-8 ring-emerald-500/5">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-black">
              {t('userExperiences.modal.successTitle', 'تجربه شما با موفقیت ثبت شد!')}
            </h3>
            <p className={`max-w-md mx-auto text-sm leading-relaxed ${isLight ? 'text-stone-600' : 'text-stone-300'}`}>
              {t('userExperiences.modal.successDesc', 'از اینکه دستاوردها و نتایج پیاده‌سازی راهکارهای کتاب اورانگوتان ۳+ در صنعت و سازمان خود را به اشتراک گذاشتید بی‌نهایت سپاسگزاریم. تجربه شما پس از بازبینی تیم انتشارات در فهرست قرار خواهد گرفت.')}
            </p>
            <div className="pt-4">
              <button
                onClick={handleClose}
                className="px-8 py-3 rounded-xl font-bold bg-[#B87333] hover:bg-[#965A25] text-white shadow-lg transition-transform active:scale-95"
              >
                {t('userExperiences.modal.closeBtn', 'متوجه شدم')}
              </button>
            </div>
          </div>
        ) : (
          <div>
            {/* Header */}
            <div className="mb-6 space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-[#B87333]/10 text-[#B87333]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{t('userExperiences.modal.badge', 'انتقال تجربه و دانش کاربردی')}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black">
                {t('userExperiences.modal.title', 'اشتراک‌گذاری تجربه شما از کتاب اورانگوتان ۳+')}
              </h2>
              <p className={`text-xs sm:text-sm leading-relaxed ${isLight ? 'text-stone-600' : 'text-stone-400'}`}>
                {t('userExperiences.modal.subtitle', 'دیدگاه‌ها و نتایج عملی شما در مهار ضایعات، حسابداری تورمی یا سیستم‌سازی کارخانه، چراغ راه سایر مدیران صنایع کشور خواهد بود.')}
              </p>
            </div>

            {errorMsg && (
              <div className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-xs font-semibold">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Personal Info Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold mb-1.5 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#B87333]" />
                    <span>{t('userExperiences.form.fullName', 'نام و نام خانوادگی')} *</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder={t('userExperiences.form.fullNamePlaceholder', 'مثال: مهندس کاظم رحیمی')}
                    className={`w-full px-3.5 py-2.5 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-[#B87333] transition-colors ${
                      isLight 
                        ? 'bg-white border-stone-300 text-stone-900 placeholder:text-stone-400' 
                        : 'bg-[#222428] border-stone-700 text-white placeholder:text-stone-500'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1.5 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-[#B87333]" />
                    <span>{t('userExperiences.form.roleAndCompany', 'سمت و نام شرکت / کارخانه')} *</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder={t('userExperiences.form.roleAndCompanyPlaceholder', 'مثال: مدیر کارخانه - صنایع فولاد سهند')}
                    className={`w-full px-3.5 py-2.5 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-[#B87333] transition-colors ${
                      isLight 
                        ? 'bg-white border-stone-300 text-stone-900 placeholder:text-stone-400' 
                        : 'bg-[#222428] border-stone-700 text-white placeholder:text-stone-500'
                    }`}
                  />
                </div>
              </div>

              {/* Industry & Contact */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold mb-1.5 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-[#B87333]" />
                    <span>{t('userExperiences.form.category', 'حوزه فعالیت سازمانی')}</span>
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as ExperienceCategory })}
                    className={`w-full px-3.5 py-2.5 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-[#B87333] transition-colors ${
                      isLight 
                        ? 'bg-white border-stone-300 text-stone-900' 
                        : 'bg-[#222428] border-stone-700 text-white'
                    }`}
                  >
                    <option value="manufacturing">{t('userExperiences.categories.manufacturing', 'صنایع تولیدی و کارخانجات')}</option>
                    <option value="finance-systems">{t('userExperiences.categories.financeSystems', 'مدیریت مالی، بهای تمام‌شده و سیستم‌ها')}</option>
                    <option value="sales-services">{t('userExperiences.categories.salesServices', 'فروش سازمانی، لجستیک و خدمات')}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1.5 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#B87333]" />
                    <span>{t('userExperiences.form.contact', 'شماره همراه یا ایمیل (جهت راستی‌آزمایی)')}</span>
                  </label>
                  <input
                    type="text"
                    value={formData.phoneOrEmail}
                    onChange={(e) => setFormData({ ...formData, phoneOrEmail: e.target.value })}
                    placeholder={t('userExperiences.form.contactPlaceholder', '0912... یا email@company.com')}
                    className={`w-full px-3.5 py-2.5 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-[#B87333] transition-colors ${
                      isLight 
                        ? 'bg-white border-stone-300 text-stone-900 placeholder:text-stone-400' 
                        : 'bg-[#222428] border-stone-700 text-white placeholder:text-stone-500'
                    }`}
                  />
                </div>
              </div>

              {/* Volume Read & Rating */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold mb-1.5 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-[#B87333]" />
                    <span>{t('userExperiences.form.volumeRead', 'کدام جلد را مطالعه فرموده‌اید؟')}</span>
                  </label>
                  <select
                    value={formData.volumeRead}
                    onChange={(e) => setFormData({ ...formData, volumeRead: e.target.value as BookVolumeRead })}
                    className={`w-full px-3.5 py-2.5 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-[#B87333] transition-colors ${
                      isLight 
                        ? 'bg-white border-stone-300 text-stone-900' 
                        : 'bg-[#222428] border-stone-700 text-white'
                    }`}
                  >
                    <option value="bundle">{t('userExperiences.volume.bundle', 'پکیج کامل (جلد ۱ و ۲)')}</option>
                    <option value="vol1">{t('userExperiences.volume.vol1', 'جلد اول: از مدیریت غریزی تا خودآگاهی')}</option>
                    <option value="vol2">{t('userExperiences.volume.vol2', 'جلد دوم: نقشه راه پایداری و رشد +۳')}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1.5 flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <span>{t('userExperiences.form.rating', 'امتیاز شما به کارایی متدولوژی کتاب')}</span>
                  </label>
                  <div className="flex items-center gap-2 h-10 px-3 rounded-xl border border-stone-200/60 dark:border-stone-800 bg-stone-500/5">
                    {[1, 2, 3, 4, 5].map((star) => {
                      const isFilled = (hoverRating !== null ? hoverRating : formData.rating) >= star;
                      return (
                        <button
                          key={star}
                          type="button"
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(null)}
                          onClick={() => setFormData({ ...formData, rating: star })}
                          className="p-1 transition-transform hover:scale-125 focus:outline-none"
                        >
                          <Star className={`w-5 h-5 ${isFilled ? 'text-amber-500 fill-amber-500' : 'text-stone-400'}`} />
                        </button>
                      );
                    })}
                    <span className="text-xs font-bold text-amber-600 mr-auto ml-1 font-mono">
                      {formData.rating} / 5
                    </span>
                  </div>
                </div>
              </div>

              {/* Achievement Badge */}
              <div>
                <label className="block text-xs font-bold mb-1.5 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-[#B87333]" />
                  <span>{t('userExperiences.form.achievementBadge', 'مهم‌ترین دستاورد یا خروجی عددی در سازمان')} *</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.achievementBadge}
                  onChange={(e) => setFormData({ ...formData, achievementBadge: e.target.value })}
                  placeholder={t('userExperiences.form.achievementPlaceholder', 'مثال: مهار ۱۸٪ ضایعات تزریق پلاستیک / کاهش دوره وصول مطالبات به ۳۰ روز')}
                  className={`w-full px-3.5 py-2.5 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-[#B87333] transition-colors ${
                    isLight 
                      ? 'bg-white border-stone-300 text-stone-900 placeholder:text-stone-400' 
                      : 'bg-[#222428] border-stone-700 text-white placeholder:text-stone-500'
                  }`}
                />
              </div>

              {/* Detailed Feedback */}
              <div>
                <label className="block text-xs font-bold mb-1.5 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-[#B87333]" />
                  <span>{t('userExperiences.form.feedbackText', 'متن تجربه، چالش قبلی و اثرات پیاده‌سازی راهکارها')} *</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.feedback}
                  onChange={(e) => setFormData({ ...formData, feedback: e.target.value })}
                  placeholder={t('userExperiences.form.feedbackPlaceholder', 'شرح دهید قبل از مطالعه کتاب چه چالشی در واحد خود داشتید و پیاده‌سازی کدام فصل یا کارت تصمیم چه تغییری ایجاد کرد...')}
                  className={`w-full px-3.5 py-2.5 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-[#B87333] transition-colors resize-none ${
                    isLight 
                      ? 'bg-white border-stone-300 text-stone-900 placeholder:text-stone-400' 
                      : 'bg-[#222428] border-stone-700 text-white placeholder:text-stone-500'
                  }`}
                />
              </div>

              {/* Privacy Notice */}
              <div className="flex items-center gap-2 text-[11px] text-stone-500 dark:text-stone-400">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{t('userExperiences.form.privacyNotice', 'اطلاعات تماس شما به هیچ وجه عمومی نشده و صرفاً جهت تایید اصالت سمت سازمانی استفاده می‌گردد.')}</span>
              </div>

              {/* Submit Actions */}
              <div className="pt-3 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                    isLight ? 'bg-stone-200 text-stone-700 hover:bg-stone-300' : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
                  }`}
                >
                  {t('userExperiences.form.cancelBtn', 'انصراف')}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl text-xs font-bold bg-[#B87333] hover:bg-[#965A25] text-white shadow-md flex items-center gap-2 transition-transform active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>{t('userExperiences.form.submitting', 'در حال ثبت...')}</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>{t('userExperiences.form.submitBtn', 'ثبت و ارسال تجربه')}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </motion.div>
    </div>
  );
};
