import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, useScroll, useTransform, MotionValue } from 'motion/react';
import { localizeDigits, mapRange, usePrefersReducedMotion } from './shared';

/**
 * Scroll-pinned double helix of 100 base pairs.
 * Phase 1: rungs light up one by one while the counter climbs to 97%.
 * Phase 2: the counter flips to 3% and three copper "genes" ignite —
 *          they are the three steps of the +3 model.
 */

const RUNGS = 100;
// Gene positions along the helix (left → right on screen).
const GENE_INDICES = [22, 50, 78];

function clamp01(v: number) {
  return Math.min(1, Math.max(0, v));
}

const GeneCallout: React.FC<{
  progress: MotionValue<number>;
  index: number;
  order: number;
  label: string;
  number: string;
  above: boolean;
}> = ({ progress, index, order, label, number, above }) => {
  const start = 0.6 + order * 0.07;
  const opacity = useTransform(progress, (v: number) => mapRange(v, start, start + 0.07, 0, 1));
  const y = useTransform(progress, (v: number) => mapRange(v, start, start + 0.07, above ? 14 : -14, 0));
  const left = `${(6 + (index / (RUNGS - 1)) * 88).toFixed(2)}%`;

  return (
    <motion.div
      style={{ opacity, y, left }}
      className={`absolute -translate-x-1/2 flex flex-col items-center ${above ? 'bottom-1/2 mb-[78px] sm:mb-[96px]' : 'top-1/2 mt-[78px] sm:mt-[96px] flex-col-reverse'}`}
    >
      <div className="rounded-xl border border-[#D9894A]/50 bg-[#1a120d]/90 backdrop-blur px-2.5 py-1.5 sm:px-3.5 sm:py-2 text-center shadow-[0_0_30px_-6px_rgba(217,137,74,0.6)] whitespace-nowrap">
        <span dir="ltr" className="block text-[10px] sm:text-xs font-black text-[#D9894A] tabular-nums">{number}</span>
        <span className="block text-[11px] sm:text-sm font-extrabold text-[#FAF7F2]">{label}</span>
      </div>
      <span className="w-px h-6 sm:h-10 bg-gradient-to-b from-[#D9894A] to-[#D9894A]/0" />
    </motion.div>
  );
};

export const DnaHelix: React.FC = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const isRtl = lang === 'fa' || lang === 'ar';
  const reducedMotion = usePrefersReducedMotion();

  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] });

  const percent = lang === 'fa' ? '٪' : '%';

  // Counters
  const sharedText = useTransform(scrollYProgress, (v) => localizeDigits(Math.round(mapRange(v, 0.06, 0.42, 0, 97)), lang));
  const sharedOpacity = useTransform(scrollYProgress, (v) => mapRange(v, 0.44, 0.52, 1, 0));
  const sharedScale = useTransform(scrollYProgress, (v) => mapRange(v, 0.44, 0.52, 1, 0.85));
  // The 3% holds the stage, then hands it to the closing line.
  const diffOpacity = useTransform(scrollYProgress, (v) =>
    v < 0.7 ? mapRange(v, 0.5, 0.58, 0, 1) : mapRange(v, 0.8, 0.86, 1, 0)
  );
  const diffScale = useTransform(scrollYProgress, (v) =>
    v < 0.7 ? mapRange(v, 0.5, 0.6, 1.35, 1) : mapRange(v, 0.8, 0.86, 1, 0.9)
  );

  const kickerOpacity = useTransform(scrollYProgress, (v) => mapRange(v, 0, 0.06, 0.3, 1));
  const outroOpacity = useTransform(scrollYProgress, (v) => mapRange(v, 0.84, 0.92, 0, 1));
  const outroY = useTransform(scrollYProgress, (v) => mapRange(v, 0.84, 0.92, 24, 0));

  // Helix renderer
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let raf = 0;
    let running = false;
    const t0 = performance.now();

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = () => {
      const p = scrollYProgress.get();
      const time = reducedMotion ? 0 : (performance.now() - t0) / 1000;
      const lit = clamp01((p - 0.06) / 0.36) * 97;
      const ignite = clamp01((p - 0.5) / 0.1);
      const dimOthers = 1 - ignite * 0.55;

      ctx.clearRect(0, 0, width, height);
      const margin = width * 0.06;
      const span = width - margin * 2;
      const cy = height / 2;
      const amp = Math.min(height * 0.32, 74);
      const twist = 0.27;
      const phase = time * 0.6 + p * 9;

      const pts1: [number, number, number][] = [];
      const pts2: [number, number, number][] = [];
      for (let i = 0; i < RUNGS; i++) {
        const x = margin + (i / (RUNGS - 1)) * span;
        const th = i * twist + phase;
        const s = Math.sin(th);
        const c = Math.cos(th);
        pts1.push([x, cy + amp * s, c]);
        pts2.push([x, cy - amp * s, -c]);
      }

      // Backbones (drawn segment by segment so depth can modulate alpha).
      const strand = (pts: [number, number, number][], tint: string) => {
        for (let i = 0; i < pts.length - 1; i++) {
          const [x1, y1, z1] = pts[i];
          const [x2, y2] = pts[i + 1];
          const a = (0.18 + 0.4 * ((z1 + 1) / 2)) * dimOthers;
          ctx.strokeStyle = `rgba(${tint},${a})`;
          ctx.lineWidth = 1.4 + z1 * 0.6;
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();
        }
      };
      strand(pts1, '200,190,180');
      strand(pts2, '200,190,180');

      // Rungs
      for (let i = 0; i < RUNGS; i++) {
        const [x, y1, z1] = pts1[i];
        const [, y2, z2] = pts2[i];
        const isGene = GENE_INDICES.includes(i);
        const geneOrder = GENE_INDICES.indexOf(i);
        const depth = (Math.max(z1, z2) + 1) / 2;

        if (isGene && ignite > 0) {
          const local = clamp01(ignite * 1.6 - geneOrder * 0.25);
          const pulse = reducedMotion ? 1 : 0.85 + 0.15 * Math.sin(time * 4 + i);
          const glow = ctx.createLinearGradient(x, y1, x, y2);
          glow.addColorStop(0, `rgba(255,211,161,${local})`);
          glow.addColorStop(0.5, `rgba(217,137,74,${local})`);
          glow.addColorStop(1, `rgba(255,211,161,${local})`);
          ctx.strokeStyle = `rgba(217,137,74,${0.25 * local * pulse})`;
          ctx.lineWidth = 14;
          ctx.beginPath();
          ctx.moveTo(x, y1);
          ctx.lineTo(x, y2);
          ctx.stroke();
          ctx.strokeStyle = glow;
          ctx.lineWidth = 3.2;
          ctx.beginPath();
          ctx.moveTo(x, y1);
          ctx.lineTo(x, y2);
          ctx.stroke();
          for (const y of [y1, y2]) {
            ctx.fillStyle = `rgba(255,211,161,${local})`;
            ctx.beginPath();
            ctx.arc(x, y, 4.5, 0, Math.PI * 2);
            ctx.fill();
          }
          continue;
        }

        const on = i < lit;
        const a = (on ? 0.22 + 0.45 * depth : 0.06 + 0.06 * depth) * (isGene ? 1 : dimOthers);
        ctx.strokeStyle = on ? `rgba(230,222,212,${a})` : `rgba(160,150,140,${a})`;
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(x, y1);
        ctx.lineTo(x, y2);
        ctx.stroke();

        const r1 = 1.4 + z1 * 0.9;
        const r2 = 1.4 + z2 * 0.9;
        ctx.fillStyle = `rgba(235,228,220,${on ? 0.35 + 0.5 * ((z1 + 1) / 2) * dimOthers : 0.12})`;
        ctx.beginPath();
        ctx.arc(x, y1, Math.max(0.8, r1 + 1), 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = `rgba(235,228,220,${on ? 0.35 + 0.5 * ((z2 + 1) / 2) * dimOthers : 0.12})`;
        ctx.beginPath();
        ctx.arc(x, y2, Math.max(0.8, r2 + 1), 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const loop = () => {
      draw();
      raf = requestAnimationFrame(loop);
    };

    resize();
    draw();

    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !running) {
        running = true;
        raf = requestAnimationFrame(loop);
      } else if (!entry.isIntersecting && running) {
        running = false;
        cancelAnimationFrame(raf);
      }
    });
    io.observe(canvas);
    const ro = new ResizeObserver(() => {
      resize();
      draw();
    });
    ro.observe(canvas);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
    };
  }, [scrollYProgress, reducedMotion]);

  const genes = [t('story.dna.gene1'), t('story.dna.gene2'), t('story.dna.gene3')];
  // In RTL the reading order runs right → left, so gene #1 sits on the right.
  const geneSlots = isRtl ? [...GENE_INDICES].reverse() : GENE_INDICES;

  return (
    <section ref={sectionRef} className="relative h-[320vh] bg-[#0A0A0B] text-[#FAF7F2]">
      <div className="sticky top-0 h-[100svh] overflow-hidden flex flex-col items-center justify-center pt-20 md:pt-28 pb-4">
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,rgba(184,115,51,0.10),transparent_60%)]" />

        <motion.span
          style={{ opacity: kickerOpacity }}
          className="relative text-[11px] sm:text-xs font-black tracking-[0.25em] uppercase text-[#D9894A] mb-2 sm:mb-4"
        >
          {t('story.dna.kicker')}
        </motion.span>

        {/* Stage: 97% → 3% → closing line */}
        <div className="relative h-[180px] sm:h-[180px] lg:h-[190px] w-full flex items-center justify-center">
          <motion.div
            style={{ opacity: sharedOpacity, scale: sharedScale }}
            className="absolute flex flex-col items-center"
          >
            <span className="flex items-baseline font-black leading-none text-[5.5rem] sm:text-[8rem] lg:text-[9.5rem] text-stone-200 tracking-tight" dir="ltr">
              <motion.span>{sharedText}</motion.span>
              <span className="text-[0.45em] text-stone-500 ms-1">{percent}</span>
            </span>
            <span className="mt-1 text-xs sm:text-sm font-bold text-stone-400">{t('story.dna.sharedLabel')}</span>
          </motion.div>

          <motion.div
            style={{ opacity: diffOpacity, scale: diffScale }}
            className="absolute flex flex-col items-center"
          >
            <span className="flex items-baseline font-black leading-none text-[5.5rem] sm:text-[8rem] lg:text-[9.5rem] tracking-tight drop-shadow-[0_0_40px_rgba(217,137,74,0.45)]" dir="ltr">
              <span className="og-copper-text">{localizeDigits(3, lang)}</span>
              <span className="text-[0.45em] text-[#D9894A] ms-1">{percent}</span>
            </span>
            <span className="mt-1 text-xs sm:text-sm font-bold text-[#E8A672]">{t('story.dna.diffLabel')}</span>
          </motion.div>

          <motion.div
            style={{ opacity: outroOpacity, y: outroY }}
            className="absolute max-w-3xl px-5 text-center space-y-3"
          >
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight">
              <span className="og-copper-text">{t('story.dna.title')}</span>
            </h2>
            <p className="text-sm sm:text-base leading-7 sm:leading-8 text-stone-400">{t('story.dna.body')}</p>
          </motion.div>
        </div>

        {/* Helix */}
        <div className="relative w-full max-w-6xl h-[220px] sm:h-[260px] my-12 sm:my-14">
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" aria-hidden="true" />
          {geneSlots.map((idx, order) => (
            <GeneCallout
              key={idx}
              progress={scrollYProgress}
              index={idx}
              order={order}
              label={genes[order]}
              number={`+${localizeDigits(1, lang)}`}
              above={order % 2 === 0}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
