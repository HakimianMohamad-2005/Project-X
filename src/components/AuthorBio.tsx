import React from 'react';
import { Building2, Calculator, Factory, GraduationCap, History, Network, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { ThemeMode } from '../types';
import { Container, Reveal } from './ui/kit';
import { FlashlightPortrait } from './experience/FlashlightPortrait';

interface AuthorBioProps {
  theme?: ThemeMode;
}

export const AuthorBio: React.FC<AuthorBioProps> = () => {
  const { t } = useTranslation();

  const tags = [
    { icon: Factory, label: t('author.tag1') },
    { icon: Network, label: t('author.tag2') },
    { icon: Calculator, label: t('author.tag3') },
  ];

  const journey = [
    { icon: Factory, title: t('author.card1Title'), desc: t('author.card1Desc') },
    { icon: Network, title: t('author.card2Title'), desc: t('author.card2Desc') },
    { icon: Calculator, title: t('author.card3Title'), desc: t('author.card3Desc') },
  ];

  const stats = [
    { icon: History, value: t('author.stats.yearsCount'), label: t('author.stats.yearsLabel'), sub: t('author.stats.yearsSub') },
    { icon: Building2, value: t('author.stats.factoriesCount'), label: t('author.stats.factoriesLabel'), sub: t('author.stats.factoriesSub') },
    { icon: Users, value: t('author.stats.clientsCount'), label: t('author.stats.clientsLabel'), sub: t('author.stats.clientsSub') },
  ];

  return (
    <>
      {/* Cinematic introduction (always dark) */}
      <section className="relative isolate overflow-hidden bg-[#0A0A0B] text-[#FAF7F2]">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_70%_30%,rgba(184,115,51,0.22),transparent_60%)]" />
        <div className="absolute inset-0 -z-10 og-grain opacity-[0.05]" />
        <Container className="grid items-center gap-10 py-14 sm:py-20 lg:grid-cols-12 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5"
          >
            <FlashlightPortrait className="aspect-[4/5] w-full max-w-md mx-auto">
              <span className="rounded-full bg-gradient-to-br from-[#D9894A] to-[#7A3E14] px-3 py-1 text-white">
                {t('author.imageBadgeYears')}
              </span>
            </FlashlightPortrait>
          </motion.div>

          <motion.div
            initial="hidden"
            animate="show"
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } } }}
            className="lg:col-span-7 space-y-6"
          >
            <motion.span
              variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}
              className="inline-block text-[11px] sm:text-xs font-black tracking-[0.25em] uppercase text-[#D9894A]"
            >
              {t('author.sectionTitle')}
            </motion.span>
            <motion.h1
              variants={{ hidden: { opacity: 0, y: 18, filter: 'blur(6px)' }, show: { opacity: 1, y: 0, filter: 'blur(0px)' } }}
              className="text-4xl sm:text-6xl font-black tracking-tight"
            >
              {t('author.name')}
            </motion.h1>
            <motion.p variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }} className="text-lg sm:text-xl font-bold og-copper-text w-fit">
              {t('author.subtitle')}
            </motion.p>
            <motion.div variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }} className="flex flex-wrap gap-2">
              {tags.map(({ icon: Icon, label }) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-bold text-stone-300"
                >
                  <Icon className="w-3.5 h-3.5 text-[#D9894A]" />
                  {label}
                </span>
              ))}
            </motion.div>
            <motion.p
              variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}
              className="flex items-center gap-2 text-sm font-semibold text-stone-400"
            >
              <GraduationCap className="w-5 h-5 shrink-0 text-[#D9894A]" />
              {t('author.degree')}
            </motion.p>
            <motion.blockquote
              variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}
              className="border-s-2 border-[#D9894A]/60 ps-5 text-lg sm:text-2xl font-extrabold leading-[1.8] text-stone-100"
            >
              {t('author.quote')}
            </motion.blockquote>
          </motion.div>
        </Container>
      </section>

      {/* Stats band */}
      <section className="border-b border-line">
        <Container className="grid grid-cols-1 sm:grid-cols-3">
          {stats.map(({ icon: Icon, value, label, sub }, i) => (
            <Reveal
              key={label}
              delay={i * 0.08}
              className={`flex flex-col items-center gap-2 px-4 py-10 text-center ${i > 0 ? 'border-t sm:border-t-0 sm:border-s border-line' : ''}`}
            >
              <Icon className="w-5 h-5 text-copper-hi" />
              <span className="text-4xl sm:text-5xl font-black og-copper-text">{value}</span>
              <span className="text-sm font-bold text-ink">{label}</span>
              <span className="text-xs text-ink-3">{sub}</span>
            </Reveal>
          ))}
        </Container>
      </section>

      {/* Story + journey */}
      <Container className="grid gap-12 py-16 sm:py-24 lg:grid-cols-12">
        <Reveal className="lg:col-span-7 space-y-6">
          <p className="text-base sm:text-lg leading-9 text-ink-2">{t('author.bioParagraph1')}</p>
          <p className="text-base sm:text-lg leading-9 text-ink-2">{t('author.bioParagraph2')}</p>
          <p className="rounded-3xl border border-copper/30 bg-copper/[0.07] p-6 text-base sm:text-lg font-bold leading-9 text-ink">
            {t('author.bioParagraph3')}
          </p>
        </Reveal>

        <div className="lg:col-span-5">
          <ol className="relative space-y-5 ps-12">
            <span className="absolute top-3 bottom-3 start-[19px] w-0.5 bg-gradient-to-b from-[#D9894A] via-[#D9894A]/50 to-transparent" aria-hidden="true" />
            {journey.map(({ icon: Icon, title, desc }, i) => (
              <li key={title} className="relative">
                <Reveal delay={i * 0.12} className="rounded-3xl border border-line bg-surface p-5">
                  <span className="absolute -start-12 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#D9894A] to-[#7A3E14] text-white ring-4 ring-canvas">
                    <Icon className="w-5 h-5" />
                  </span>
                  <h3 className="text-base font-black text-ink">{title}</h3>
                  <p className="mt-1.5 text-sm leading-7 text-ink-2">{desc}</p>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </>
  );
};
