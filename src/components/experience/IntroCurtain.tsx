import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'motion/react';
import { localizeDigits } from './shared';

type Phase = 'count' | 'diff' | 'open';

interface IntroCurtainProps {
  /** Called when the curtain starts opening (page content may animate in). */
  onOpening: () => void;
  /** Called once the curtain is fully gone. */
  onDone: () => void;
}

const TICKS = 100;

/**
 * Opening title: the shared-DNA counter climbs to 97%, then the copper +3
 * appears — the difference — and the curtain parts to reveal the site.
 */
export const IntroCurtain: React.FC<IntroCurtainProps> = ({ onOpening, onDone }) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const [phase, setPhase] = useState<Phase>('count');
  const count = useMotionValue(0);
  const countText = useTransform(count, (v) => localizeDigits(Math.round(v), lang));
  const [lit, setLit] = useState(0);
  const percent = lang === 'fa' ? '٪' : '%';

  useEffect(() => {
    const unsub = count.on('change', (v) => setLit(Math.round(v)));
    const controls = animate(count, 97, { duration: 1.5, ease: [0.3, 0, 0.2, 1] });
    const t1 = window.setTimeout(() => setPhase('diff'), 1750);
    const t2 = window.setTimeout(() => {
      setPhase('open');
      onOpening();
    }, 3000);
    const t3 = window.setTimeout(onDone, 3900);
    return () => {
      unsub();
      controls.stop();
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const prev = document.documentElement.style.overflow;
    if (phase !== 'open') document.documentElement.style.overflow = 'hidden';
    return () => {
      document.documentElement.style.overflow = prev;
    };
  }, [phase]);

  const skip = () => {
    if (phase === 'open') return;
    setPhase('open');
    onOpening();
    window.setTimeout(onDone, 900);
  };

  const opening = phase === 'open';
  const ease = [0.76, 0, 0.24, 1] as const;

  return (
    <div className="fixed inset-0 z-[200] pointer-events-auto" onClick={skip} role="presentation">
      {/* Two halves of the curtain */}
      <motion.div
        className="absolute inset-x-0 top-0 h-1/2 bg-[#0A0A0B] border-b border-[#B87333]/0"
        animate={opening ? { y: '-100%' } : { y: 0 }}
        transition={{ duration: 0.9, ease }}
      />
      <motion.div
        className="absolute inset-x-0 bottom-0 h-1/2 bg-[#0A0A0B]"
        animate={opening ? { y: '100%' } : { y: 0 }}
        transition={{ duration: 0.9, ease }}
      />
      {/* Seam of light as the halves part */}
      <motion.div
        className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-[#FFD3A1] to-transparent"
        initial={{ scaleX: 0, opacity: 0 }}
        animate={opening ? { scaleX: 1, opacity: [0, 1, 0] } : { scaleX: phase === 'diff' ? 0.6 : 0, opacity: phase === 'diff' ? 0.6 : 0 }}
        transition={{ duration: opening ? 0.9 : 0.6 }}
      />

      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center text-[#FAF7F2] px-6"
        animate={opening ? { opacity: 0, scale: 1.08 } : { opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="relative h-[150px] sm:h-[200px] w-full flex items-center justify-center">
          <AnimatePresence mode="popLayout">
            {phase === 'count' ? (
              <motion.div
                key="count"
                exit={{ opacity: 0, y: -30, filter: 'blur(10px)' }}
                transition={{ duration: 0.45 }}
                className="flex flex-col items-center"
              >
                <span className="flex items-baseline font-black text-[6rem] sm:text-[9rem] leading-none text-stone-200 tracking-tight" dir="ltr">
                  <motion.span>{countText}</motion.span>
                  <span className="text-[0.4em] text-stone-500 ms-1">{percent}</span>
                </span>
              </motion.div>
            ) : (
              <motion.div
                key="diff"
                initial={{ opacity: 0, scale: 1.6, filter: 'blur(16px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col items-center"
              >
                <span
                  className="og-copper-text font-black text-[6.5rem] sm:text-[10rem] leading-none drop-shadow-[0_0_50px_rgba(217,137,74,0.5)]"
                  dir="ltr"
                >
                  +{localizeDigits(3, lang)}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 100 genes: 97 grey, 3 copper */}
        <div className="mt-4 flex items-end gap-[2px] sm:gap-[3px] h-8" dir="ltr" aria-hidden="true">
          {Array.from({ length: TICKS }, (_, i) => {
            const isDiff = i >= 97;
            const on = isDiff ? phase !== 'count' : i < lit;
            return (
              <span
                key={i}
                className={`w-[2px] sm:w-[3px] rounded-full transition-all duration-300 ${
                  isDiff
                    ? on
                      ? 'h-8 bg-[#FFD3A1] shadow-[0_0_12px_rgba(255,211,161,0.9)]'
                      : 'h-3 bg-white/10'
                    : on
                      ? 'h-4 bg-stone-400/70'
                      : 'h-3 bg-white/10'
                }`}
              />
            );
          })}
        </div>

        <div className="mt-6 h-6 text-center text-sm sm:text-base font-bold">
          <AnimatePresence mode="wait">
            <motion.p
              key={phase === 'count' ? 'shared' : 'diff'}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35 }}
              className={phase === 'count' ? 'text-stone-400' : 'text-[#E8A672]'}
            >
              {phase === 'count' ? t('story.intro.shared') : t('story.intro.difference')}
            </motion.p>
          </AnimatePresence>
        </div>
      </motion.div>

      {!opening && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            skip();
          }}
          className="absolute bottom-6 end-6 rounded-full border border-white/15 px-4 py-1.5 text-xs font-bold text-stone-400 hover:text-white hover:border-[#D9894A] transition-colors"
        >
          {t('story.intro.skip')}
        </button>
      )}
    </div>
  );
};
