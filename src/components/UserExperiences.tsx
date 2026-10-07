import React, { useEffect, useMemo, useState } from 'react';
import { Award, BadgeCheck, Building, Factory, Loader2, MessageSquareQuote, PlusCircle, ShieldCheck, Star, TrendingUp, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'motion/react';
import { ThemeMode, ExperienceCategory, UserExperience } from '../types';
import { SubmitExperienceModal } from './SubmitExperienceModal';
import { fetchUserExperiencesFromApi, getLocalExperiences } from '../lib/api';
import { Button, Container, FilterTabs, PageHeader, Reveal } from './ui/kit';
import { useLocaleFormat } from './ui/format';

interface UserExperiencesProps {
  theme?: ThemeMode;
}

export const UserExperiences: React.FC<UserExperiencesProps> = ({ theme = 'dark' }) => {
  const { t } = useTranslation();
  const { num } = useLocaleFormat();

  const [experiences, setExperiences] = useState<UserExperience[]>(() => {
    const local = getLocalExperiences();
    return Array.isArray(local) ? local : [];
  });
  const [apiExperiences, setApiExperiences] = useState<UserExperience[]>([]);
  const [isLoadingApi, setIsLoadingApi] = useState(false);
  const [category, setCategory] = useState<ExperienceCategory>('all');
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);

  // Merge local submissions with approved ones from the API (deduplicated by id).
  useEffect(() => {
    const unique = new Map<string, UserExperience>();
    [...(getLocalExperiences() || []), ...apiExperiences].forEach((item) => {
      if (item && item.id) unique.set(item.id, item);
    });
    setExperiences(Array.from(unique.values()));
  }, [apiExperiences]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setIsLoadingApi(true);
      try {
        const res = await fetchUserExperiencesFromApi();
        if (mounted && res.success && Array.isArray(res.experiences)) setApiExperiences(res.experiences);
      } catch (err) {
        console.warn('Could not load experiences from API:', err);
      } finally {
        if (mounted) setIsLoadingApi(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const filtered = category === 'all' ? experiences : experiences.filter((e) => e.category === category);
  const avgRating = experiences.length ? experiences.reduce((a, e) => a + (Number(e.rating) || 0), 0) / experiences.length : 0;

  const tabs = useMemo(
    () =>
      [
        { value: 'all' as ExperienceCategory, label: t('userExperiences.categories.all'), icon: Users },
        { value: 'manufacturing' as ExperienceCategory, label: t('userExperiences.categories.manufacturing'), icon: Factory },
        { value: 'finance-systems' as ExperienceCategory, label: t('userExperiences.categories.financeSystems'), icon: TrendingUp },
        { value: 'sales-services' as ExperienceCategory, label: t('userExperiences.categories.salesServices'), icon: Building },
      ].map((o) => ({
        ...o,
        count: num(o.value === 'all' ? experiences.length : experiences.filter((e) => e.category === o.value).length),
      })),
    [t, experiences, num]
  );

  const volumeLabel = (v: string) =>
    v === 'vol1'
      ? t('userExperiences.volume.vol1Short')
      : v === 'vol2'
        ? t('userExperiences.volume.vol2Short')
        : t('userExperiences.volume.bundleShort');

  const handleAdd = (newExp: UserExperience) =>
    setExperiences((prev) => (prev.some((e) => e.id === newExp.id) ? prev : [newExp, ...prev]));

  return (
    <>
      <PageHeader
        icon={MessageSquareQuote}
        kicker={t('userExperiences.header.badge')}
        title={t('userExperiences.header.title')}
        subtitle={t('userExperiences.header.subtitle')}
      >
        <div className="flex flex-col items-center gap-4">
          <Button size="lg" onClick={() => setIsSubmitOpen(true)}>
            <PlusCircle className="w-5 h-5" />
            {t('userExperiences.header.submitCta')}
          </Button>
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-3">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            {t('userExperiences.header.verifiedBadge')}
          </span>
        </div>
      </PageHeader>

      <Container className="py-12 sm:py-16 space-y-10">
        <div className="flex flex-col items-center gap-5">
          <FilterTabs<ExperienceCategory> options={tabs} value={category} onChange={setCategory} />
          <div className="flex items-center gap-4 text-xs font-bold text-ink-3">
            {experiences.length > 0 && (
              <span className="inline-flex items-center gap-1.5">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                {t('ui.reviews.average', { rating: num(avgRating.toFixed(1)) })}
              </span>
            )}
            {isLoadingApi && (
              <span className="inline-flex items-center gap-1.5 text-copper-hi">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                {t('ui.reviews.syncing')}
              </span>
            )}
          </div>
        </div>

        {filtered.length > 0 ? (
          <div className="columns-1 gap-6 md:columns-2 xl:columns-3 [column-fill:_balance]">
            <AnimatePresence mode="popLayout">
              {filtered.map((exp, idx) => (
                <motion.article
                  key={exp.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0, transition: { delay: Math.min(idx, 8) * 0.05 } }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  className="relative mb-6 break-inside-avoid overflow-hidden rounded-3xl border border-line bg-surface p-6 transition-colors hover:border-copper/40"
                >
                  <MessageSquareQuote className="absolute -top-2 -end-2 w-24 h-24 text-copper/[0.07]" />
                  <div className="relative flex items-center gap-0.5" aria-label={`${exp.rating}/5`}>
                    {[0, 1, 2, 3, 4].map((s) => (
                      <Star key={s} className={`w-4 h-4 ${s < exp.rating ? 'fill-amber-400 text-amber-400' : 'text-line-strong'}`} />
                    ))}
                  </div>

                  <p className="relative mt-4 flex items-start gap-2 text-lg font-black leading-8 text-copper-hi">
                    <Award className="mt-1.5 w-5 h-5 shrink-0" />
                    {exp.achievementBadge}
                  </p>
                  <p className="relative mt-3 text-sm leading-8 text-ink-2">«{exp.feedback}»</p>

                  <div className="relative mt-6 flex items-center gap-3 border-t border-line pt-5">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#D9894A] to-[#7A3E14] text-lg font-black text-white">
                      {exp.fullName.charAt(0)}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="flex items-center gap-1.5 text-sm font-black text-ink">
                        <span className="truncate">{exp.fullName}</span>
                        {exp.verified && (
                          <span title={t('userExperiences.card.verifiedTooltip')} className="inline-flex">
                            <BadgeCheck className="w-4 h-4 shrink-0 text-emerald-500" />
                          </span>
                        )}
                      </p>
                      <p className="truncate text-xs text-ink-3">
                        {exp.role} — <span className="text-ink-2">{exp.company}</span>
                      </p>
                    </div>
                  </div>
                  <div className="relative mt-4 flex flex-wrap items-center justify-between gap-2 text-[11px] font-bold">
                    <span className="rounded-lg bg-copper/10 px-2 py-1 text-copper-hi">{volumeLabel(exp.volumeRead)}</span>
                    <span className="text-ink-3">{num(exp.date)}</span>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <Reveal>
            <div className="relative overflow-hidden rounded-[2rem] border border-dashed border-line-strong px-6 py-16 text-center">
              <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-copper/10 blur-3xl" />
              <div className="relative mx-auto flex max-w-xl flex-col items-center gap-5">
                <span className="flex h-20 w-20 items-center justify-center rounded-[1.75rem] border border-copper/30 bg-copper/10 text-copper-hi">
                  <MessageSquareQuote className="w-9 h-9" />
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-ink">{t('userExperiences.emptyState.title')}</h3>
                <p className="text-sm leading-8 text-ink-2">{t('userExperiences.emptyState.desc')}</p>
                <div className="flex flex-wrap justify-center gap-3">
                  <Button onClick={() => setIsSubmitOpen(true)}>
                    <PlusCircle className="w-4 h-4" />
                    {t('userExperiences.emptyState.btn')}
                  </Button>
                  {category !== 'all' && (
                    <Button variant="secondary" onClick={() => setCategory('all')}>
                      {t('userExperiences.categories.all')}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </Reveal>
        )}

        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] bg-[#0A0A0B] p-8 sm:p-12 text-center text-[#FAF7F2]">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(184,115,51,0.35),transparent_60%)]" />
            <div className="relative mx-auto max-w-2xl space-y-4">
              <h3 className="text-2xl sm:text-3xl font-black">{t('userExperiences.bottomCta.title')}</h3>
              <p className="text-sm leading-8 text-stone-400">{t('userExperiences.bottomCta.subtitle')}</p>
              <Button size="lg" onClick={() => setIsSubmitOpen(true)}>
                <PlusCircle className="w-5 h-5" />
                {t('userExperiences.bottomCta.btn')}
              </Button>
            </div>
          </div>
        </Reveal>
      </Container>

      <SubmitExperienceModal isOpen={isSubmitOpen} onClose={() => setIsSubmitOpen(false)} onSubmit={handleAdd} theme={theme} />
    </>
  );
};
