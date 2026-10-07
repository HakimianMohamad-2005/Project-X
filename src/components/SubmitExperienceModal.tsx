import React, { useState } from 'react';
import { Award, BookOpen, Building2, Loader2, MessageSquare, Phone, Send, ShieldCheck, Sparkles, Star, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ThemeMode, ExperienceCategory, BookVolumeRead, UserExperience, NewExperienceForm } from '../types';
import { saveUserExperienceToApi, saveLocalExperience } from '../lib/api';
import { Button, Field, Modal, SuccessState, inputClass } from './ui/kit';
import { useLocaleFormat } from './ui/format';

interface SubmitExperienceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (newExp: UserExperience) => void;
  theme?: ThemeMode;
}

const EMPTY: NewExperienceForm = {
  fullName: '',
  role: '',
  company: '',
  industry: '',
  category: 'manufacturing',
  phoneOrEmail: '',
  rating: 5,
  volumeRead: 'bundle',
  achievementBadge: '',
  feedback: '',
};

export const SubmitExperienceModal: React.FC<SubmitExperienceModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const { t, i18n } = useTranslation();
  const { num } = useLocaleFormat();
  const [formData, setFormData] = useState<NewExperienceForm>(EMPTY);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.company.trim() || !formData.feedback.trim() || !formData.achievementBadge.trim()) {
      setErrorMsg(t('userExperiences.form.validationError'));
      return;
    }
    setIsSubmitting(true);
    setErrorMsg('');

    const newExp: UserExperience = {
      id: `exp-${Date.now()}`,
      fullName: formData.fullName.trim(),
      role: formData.role.trim() || t('userExperiences.card.executiveRole'),
      company: formData.company.trim(),
      industry: formData.industry.trim() || formData.company.trim(),
      category: formData.category,
      rating: formData.rating,
      volumeRead: formData.volumeRead,
      achievementBadge: formData.achievementBadge.trim(),
      keyMetric: formData.achievementBadge.trim(),
      feedback: formData.feedback.trim(),
      verified: true,
      date: new Date().toLocaleDateString(i18n.language === 'fa' ? 'fa-IR' : 'en-US'),
    };

    try {
      // Save locally first for an instant UI response, then to the API.
      saveLocalExperience(newExp);
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
        feedback: newExp.feedback,
      });
      if (res && res.id) newExp.id = res.id;
    } catch (err) {
      console.warn('Error saving experience to API, saved locally:', err);
    } finally {
      onSubmit(newExp);
      setIsSubmitted(true);
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    onClose();
    // Reset after the exit animation so the content doesn't jump while closing.
    window.setTimeout(() => {
      setIsSubmitted(false);
      setErrorMsg('');
      setFormData(EMPTY);
    }, 400);
  };

  const shownRating = hoverRating ?? formData.rating;

  return (
    <Modal open={isOpen} onClose={handleClose} size="lg">
      <div className="p-6 sm:p-9">
        {isSubmitted ? (
          <SuccessState title={t('userExperiences.modal.successTitle')} text={t('userExperiences.modal.successDesc')}>
            <Button onClick={handleClose}>{t('userExperiences.modal.closeBtn')}</Button>
          </SuccessState>
        ) : (
          <div className="space-y-6">
            <div className="space-y-2 pe-12">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-copper/10 px-3 py-1 text-xs font-bold text-copper-hi">
                <Sparkles className="w-3.5 h-3.5" />
                {t('userExperiences.modal.badge')}
              </span>
              <h2 className="text-xl sm:text-2xl font-black leading-9">{t('userExperiences.modal.title')}</h2>
              <p className="text-sm leading-7 text-ink-2">{t('userExperiences.modal.subtitle')}</p>
            </div>

            {errorMsg && (
              <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-xs font-bold text-red-500">{errorMsg}</p>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label={t('userExperiences.form.fullName')} icon={User} required>
                  <input
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder={t('userExperiences.form.fullNamePlaceholder')}
                    className={inputClass}
                  />
                </Field>
                <Field label={t('userExperiences.form.roleAndCompany')} icon={Building2} required>
                  <input
                    required
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder={t('userExperiences.form.roleAndCompanyPlaceholder')}
                    className={inputClass}
                  />
                </Field>
                <Field label={t('userExperiences.form.category')} icon={Building2}>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as ExperienceCategory })}
                    className={inputClass}
                  >
                    <option value="manufacturing">{t('userExperiences.categories.manufacturing')}</option>
                    <option value="finance-systems">{t('userExperiences.categories.financeSystems')}</option>
                    <option value="sales-services">{t('userExperiences.categories.salesServices')}</option>
                  </select>
                </Field>
                <Field label={t('userExperiences.form.contact')} icon={Phone}>
                  <input
                    dir="ltr"
                    value={formData.phoneOrEmail}
                    onChange={(e) => setFormData({ ...formData, phoneOrEmail: e.target.value })}
                    placeholder={t('userExperiences.form.contactPlaceholder')}
                    className={`${inputClass} text-start`}
                  />
                </Field>
                <Field label={t('userExperiences.form.volumeRead')} icon={BookOpen}>
                  <select
                    value={formData.volumeRead}
                    onChange={(e) => setFormData({ ...formData, volumeRead: e.target.value as BookVolumeRead })}
                    className={inputClass}
                  >
                    <option value="bundle">{t('userExperiences.volume.bundle')}</option>
                    <option value="vol1">{t('userExperiences.volume.vol1')}</option>
                    <option value="vol2">{t('userExperiences.volume.vol2')}</option>
                  </select>
                </Field>
                <div className="space-y-1.5">
                  <span className="flex items-center gap-1.5 text-xs font-bold text-ink-2">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    {t('userExperiences.form.rating')}
                  </span>
                  <div className="flex h-[46px] items-center justify-between rounded-xl border border-line-strong bg-field px-3" onMouseLeave={() => setHoverRating(null)}>
                    <div className="flex items-center gap-0.5" dir="ltr">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onMouseEnter={() => setHoverRating(star)}
                          onClick={() => setFormData({ ...formData, rating: star })}
                          aria-label={`${star}/5`}
                          className="p-0.5 transition-transform hover:scale-125"
                        >
                          <Star className={`w-5 h-5 ${shownRating >= star ? 'fill-amber-400 text-amber-400' : 'text-line-strong'}`} />
                        </button>
                      ))}
                    </div>
                    <span className="text-xs font-black text-amber-500">
                      {num(shownRating)} / {num(5)}
                    </span>
                  </div>
                </div>
              </div>

              <Field label={t('userExperiences.form.achievementBadge')} icon={Award} required>
                <input
                  required
                  value={formData.achievementBadge}
                  onChange={(e) => setFormData({ ...formData, achievementBadge: e.target.value })}
                  placeholder={t('userExperiences.form.achievementPlaceholder')}
                  className={inputClass}
                />
              </Field>
              <Field label={t('userExperiences.form.feedbackText')} icon={MessageSquare} required>
                <textarea
                  required
                  rows={4}
                  value={formData.feedback}
                  onChange={(e) => setFormData({ ...formData, feedback: e.target.value })}
                  placeholder={t('userExperiences.form.feedbackPlaceholder')}
                  className={`${inputClass} resize-none`}
                />
              </Field>

              <p className="flex items-start gap-2 text-[11px] leading-5 text-ink-3">
                <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-500" />
                {t('userExperiences.form.privacyNotice')}
              </p>

              <div className="flex items-center justify-end gap-3 pt-2">
                <Button variant="ghost" onClick={handleClose}>
                  {t('userExperiences.form.cancelBtn')}
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  {isSubmitting ? t('ui.common.sending') : t('userExperiences.form.submitBtn')}
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>
    </Modal>
  );
};
