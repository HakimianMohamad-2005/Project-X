import React, { useState } from 'react';
import { Award, BookOpen, Check, FileText, PenTool, ShieldCheck, ShoppingBag, Truck } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { BOOKS_DATA, BUNDLE_DATA } from '../data/bookData';
import { ThemeMode } from '../types';
import authorImg from '../assets/author_ali.jpg';
import { Button, Container, Reveal, inputClass } from './ui/kit';
import { Tilt } from './ui/Tilt';
import { useLocaleFormat } from './ui/format';

interface ProductPricingProps {
  onAddToCart: (bookId: string, customAuthorSignature?: boolean, recipientName?: string) => void;
  theme?: ThemeMode;
}

const COVER: Record<string, string> = {
  'vol-1': '/Jeld%20-%20Front.png',
  'vol-2': '/Jeld2%20-%20Front.png',
};

export const ProductPricing: React.FC<ProductPricingProps> = ({ onAddToCart }) => {
  const { t } = useTranslation();
  const { price } = useLocaleFormat();
  const [authorSignature, setAuthorSignature] = useState(true);
  const [recipientName, setRecipientName] = useState('');
  const [addedId, setAddedId] = useState<string | null>(null);

  const handleAdd = (id: string) => {
    if (id === 'bundle-full') onAddToCart('bundle-full', authorSignature, recipientName);
    else onAddToCart(id);
    setAddedId(id);
    confetti({ particleCount: 60, spread: 70, origin: { y: 0.7 }, colors: ['#D9894A', '#FFD3A1', '#B87333'] });
    window.setTimeout(() => setAddedId(null), 2500);
  };

  const asList = (key: string, fallback: string[]) => {
    const v = t(key, { returnObjects: true });
    return Array.isArray(v) ? (v as string[]) : fallback;
  };
  const volumes = [
    { data: BOOKS_DATA[0], key: 'vol1', topics: asList('books.vol1.keyTopics', BOOKS_DATA[0].keyTopics) },
    { data: BOOKS_DATA[1], key: 'vol2', topics: asList('books.vol2.keyTopics', BOOKS_DATA[1].keyTopics) },
  ];
  const bundleFeatures = asList('books.bundle.features', BUNDLE_DATA.features);
  const savings = BUNDLE_DATA.originalPrice - BUNDLE_DATA.bundlePrice;

  // A render helper (not a component) so cards keep their state across re-renders.
  const renderVolume = (v: (typeof volumes)[number], delay: number) => (
    <Reveal delay={delay} className="h-full">
      <article className="group flex h-full flex-col rounded-[2rem] border border-line bg-surface p-6 sm:p-7 transition-colors hover:border-copper/40">
        <div className="relative mb-6 flex h-64 items-center justify-center rounded-3xl bg-[#0A0A0B] overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_60%,rgba(184,115,51,0.32),transparent_65%)]" />
          <Tilt className="relative">
            <img
              src={COVER[v.data.id]}
              alt={t(`books.${v.key}.title`)}
              className="w-36 rounded-lg shadow-[0_30px_50px_-18px_rgba(0,0,0,0.95)] transition-transform duration-500 group-hover:scale-[1.03]"
              draggable={false}
            />
          </Tilt>
          <span className="absolute top-4 start-4 rounded-full border border-white/15 bg-black/50 px-3 py-1 text-[11px] font-bold text-[#E8A672] backdrop-blur">
            {t(`books.${v.key}.badge`)}
          </span>
        </div>

        <div className="flex-1 space-y-3">
          <h3 className="text-xl font-black leading-8 text-ink">{t(`books.${v.key}.title`)}</h3>
          <p className="text-xs leading-6 text-ink-3">{t(`books.${v.key}.subtitle`)}</p>
          <p className="text-sm leading-7 text-ink-2">{t(`books.${v.key}.summary`)}</p>
          <div className="space-y-2 border-t border-line pt-4">
            <span className="text-xs font-black text-ink">{t(`books.${v.key}.keyTopicsTitle`)}</span>
            <ul className="space-y-2">
              {v.topics.map((topic) => (
                <li key={topic} className="flex items-start gap-2 text-xs leading-6 text-ink-2">
                  <Check className="mt-1 w-3.5 h-3.5 shrink-0 text-copper-hi" />
                  {topic}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between gap-3 border-t border-line pt-5">
          <span className="text-2xl font-black text-ink">{price(v.data.price)}</span>
          <Button variant="secondary" onClick={() => handleAdd(v.data.id)} className="shrink-0">
            <AnimatePresence mode="wait" initial={false}>
              {addedId === v.data.id ? (
                <motion.span key="ok" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-1.5 text-emerald-500">
                  <Check className="w-4 h-4" />
                  {t('books.addedToCart')}
                </motion.span>
              ) : (
                <motion.span key="add" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-1.5">
                  <ShoppingBag className="w-4 h-4 text-copper-hi" />
                  {t('ui.pricing.add')}
                </motion.span>
              )}
            </AnimatePresence>
          </Button>
        </div>
      </article>
    </Reveal>
  );

  return (
    <section id="books" className="relative py-20 sm:py-28">
      <Container>
        <Reveal className="mx-auto mb-14 max-w-3xl space-y-4 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-copper/35 bg-copper/10 px-3.5 py-1.5 text-xs font-bold text-copper-hi">
            <BookOpen className="w-3.5 h-3.5" />
            {t('books.sectionBadge')}
          </span>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-ink text-balance">
            {t('books.sectionTitle')} <span className="og-copper-text">{t('books.sectionTitleHighlight')}</span>
          </h2>
          <p className="text-sm sm:text-base leading-8 text-ink-2">{t('books.sectionSubtitle')}</p>
        </Reveal>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:items-stretch">
          <div className="order-2 lg:order-1">
            {renderVolume(volumes[0], 0.1)}
          </div>

          {/* Featured bundle */}
          <Reveal className="order-1 lg:order-2 h-full">
            <article className="relative flex h-full flex-col overflow-hidden rounded-[2rem] border border-copper/50 bg-[#0A0A0B] p-6 sm:p-7 text-[#FAF7F2] shadow-[0_40px_80px_-40px_rgba(217,137,74,0.6)] lg:-my-4">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(184,115,51,0.35),transparent_60%)]" />
              <div className="absolute inset-0 og-grain opacity-[0.05]" />

              <div className="relative flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-br from-[#D9894A] to-[#8B4513] px-3 py-1 text-[11px] font-black text-white">
                  <Award className="w-3.5 h-3.5" />
                  {t('books.bundle.badge')}
                </span>
                <span className="text-[11px] font-bold text-stone-400">{t('books.bundle.totalPagesLabel')}</span>
              </div>

              <div className="relative my-6 flex h-56 items-center justify-center">
                <div className="absolute h-40 w-40 rounded-full bg-[#B87333]/40 blur-[60px]" />
                <Tilt className="relative" max={12}>
                  <div className="relative h-52 w-56">
                    <img
                      src={COVER['vol-2']}
                      alt=""
                      className="absolute top-3 start-2 w-32 rounded-lg shadow-2xl [transform:rotate(-9deg)]"
                      draggable={false}
                    />
                    <img
                      src={COVER['vol-1']}
                      alt={t('books.bundle.title')}
                      className="absolute top-0 end-2 w-36 rounded-lg shadow-[0_30px_50px_-18px_rgba(0,0,0,0.95)] [transform:rotate(6deg)]"
                      draggable={false}
                    />
                  </div>
                </Tilt>
              </div>

              <div className="relative flex-1 space-y-4">
                <div className="space-y-1">
                  <h3 className="text-2xl font-black leading-9">{t('books.bundle.title')}</h3>
                  <p className="text-xs text-stone-400">{t('books.bundle.subtitle')}</p>
                </div>

                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span className="text-3xl sm:text-4xl font-black og-copper-text">{price(BUNDLE_DATA.bundlePrice)}</span>
                  <span className="text-sm text-stone-500 line-through">{price(BUNDLE_DATA.originalPrice)}</span>
                  <span className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[11px] font-black text-emerald-400">
                    {t('ui.pricing.save', { amount: price(savings) })}
                  </span>
                </div>

                {/* Author signature */}
                <div className={`rounded-2xl border p-4 transition-colors ${authorSignature ? 'border-[#D9894A]/50 bg-[#D9894A]/10' : 'border-white/10 bg-white/[0.03]'}`}>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={authorSignature}
                    onClick={() => setAuthorSignature((v) => !v)}
                    className="flex w-full items-center gap-3 text-start"
                  >
                    <img src={authorImg} alt="" className="h-11 w-11 shrink-0 rounded-xl object-cover ring-2 ring-[#D9894A]/60" />
                    <span className="flex-1 text-xs font-bold leading-5 text-[#E8A672]">
                      <PenTool className="inline w-3.5 h-3.5 me-1" />
                      {t('books.bundle.signatureTitle')}
                    </span>
                    <span className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${authorSignature ? 'bg-[#D9894A]' : 'bg-white/15'}`}>
                      <motion.span
                        layout
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow ${authorSignature ? 'end-0.5' : 'start-0.5'}`}
                      />
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {authorSignature && (
                      <motion.label
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="block overflow-hidden"
                      >
                        <span className="mt-3 mb-1.5 block text-[11px] text-stone-400">{t('books.bundle.signatureLabel')}</span>
                        <input
                          value={recipientName}
                          onChange={(e) => setRecipientName(e.target.value)}
                          placeholder={t('books.bundle.signaturePlaceholder')}
                          className={`${inputClass} !bg-black/40 !border-white/15 !text-[#FAF7F2] placeholder:!text-stone-500`}
                        />
                      </motion.label>
                    )}
                  </AnimatePresence>
                </div>

                <ul className="space-y-2.5">
                  {bundleFeatures.map((feat) => (
                    <li key={feat} className="flex items-start gap-2 text-xs leading-6 text-stone-300">
                      <Check className="mt-1 w-3.5 h-3.5 shrink-0 text-emerald-400" />
                      {feat}
                    </li>
                  ))}
                </ul>
              </div>

              <Button size="lg" onClick={() => handleAdd('bundle-full')} className="relative mt-6 w-full overflow-hidden group">
                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/25 to-transparent" />
                <AnimatePresence mode="wait" initial={false}>
                  {addedId === 'bundle-full' ? (
                    <motion.span key="ok" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="relative flex items-center gap-2">
                      <Check className="w-5 h-5" />
                      {t('books.bundle.addedSuccess')}
                    </motion.span>
                  ) : (
                    <motion.span key="add" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="relative flex items-center gap-2">
                      <ShoppingBag className="w-5 h-5" />
                      {t('books.bundle.ctaBtn')}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Button>
            </article>
          </Reveal>

          <div className="order-3">
            {renderVolume(volumes[1], 0.2)}
          </div>
        </div>

        {/* Trust strip */}
        <Reveal delay={0.1} className="mt-14">
          <ul className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-line bg-line lg:grid-cols-4">
            {[
              { icon: Truck, label: t('footer.badges.shipping') },
              { icon: PenTool, label: t('books.bundle.signatureTitle') },
              { icon: ShieldCheck, label: t('footer.badges.authenticity') },
              { icon: FileText, label: t('footer.badges.invoice') },
            ].map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-3 bg-surface px-5 py-4 text-xs font-bold leading-5 text-ink-2">
                <Icon className="w-5 h-5 shrink-0 text-copper-hi" />
                {label}
              </li>
            ))}
          </ul>
        </Reveal>
      </Container>
    </section>
  );
};
